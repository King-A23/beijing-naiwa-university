import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { RegistryError } from './registry.mjs';

export function createStore(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path, { timeout: 5000 });
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL;
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      frog_id TEXT NOT NULL COLLATE NOCASE UNIQUE,
      name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 20),
      avatar_id TEXT NOT NULL CHECK(avatar_id IN ('welcome','signal','study','graduate')),
      entry_year INTEGER NOT NULL DEFAULT 0 CHECK(entry_year=0),
      graduation_year INTEGER NOT NULL DEFAULT 4 CHECK(graduation_year=4),
      enrolled_at TEXT NOT NULL,
      request_id TEXT NOT NULL COLLATE NOCASE UNIQUE
    ) STRICT;
    CREATE TABLE IF NOT EXISTS rate_limits (
      identity TEXT NOT NULL, scope TEXT NOT NULL, bucket INTEGER NOT NULL,
      expires_at INTEGER NOT NULL, hits INTEGER NOT NULL,
      PRIMARY KEY(identity,scope,bucket)
    ) STRICT;
    CREATE INDEX IF NOT EXISTS rate_expiry ON rate_limits(expires_at);`);
  const count = () => db.prepare('SELECT COUNT(*) AS n FROM students').get().n;
  const transaction = fn => {
    db.exec('BEGIN IMMEDIATE');
    try { const result = fn(); db.exec('COMMIT'); return result; }
    catch (error) { db.exec('ROLLBACK'); throw error; }
  };
  return {
    close() { db.close(); },
    health() { return db.prepare('SELECT 1 AS ok').get().ok === 1; },
    list(limit=12, cursor=null) {
      return transaction(() => {
        const rows = cursor === null
          ? db.prepare('SELECT * FROM students ORDER BY id DESC LIMIT ?').all(limit+1)
          : db.prepare('SELECT * FROM students WHERE id < ? ORDER BY id DESC LIMIT ?').all(cursor,limit+1);
        const students = rows.slice(0,limit);
        return {total:count(),students,nextCursor:rows.length>limit?students.at(-1).id:null};
      });
    },
    enroll(input) {
      return transaction(() => {
        const prior = db.prepare('SELECT * FROM students WHERE request_id=?').get(input.requestId);
        if (prior) {
          if (prior.frog_id.toUpperCase() !== input.frogId || prior.name !== input.name || prior.avatar_id !== input.avatarId)
            throw new RegistryError(409,'REQUEST_CHANGED','登记信息已改变，请重新提交。');
          return {student:prior,total:count(),created:false};
        }
        if (db.prepare('SELECT id FROM students WHERE frog_id=?').get(input.frogId))
          throw new RegistryError(409,'FROG_ID_TAKEN','这枚蛙号已经入塘啦，请换一个蛙号。','frogId');
        db.prepare('INSERT INTO students(frog_id,name,avatar_id,enrolled_at,request_id) VALUES(?,?,?,?,?)')
          .run(input.frogId,input.name,input.avatarId,new Date().toISOString(),input.requestId);
        return {student:db.prepare('SELECT * FROM students WHERE request_id=?').get(input.requestId),total:count(),created:true};
      });
    },
    incrementRate(identity,scope,period) {
      const now=Math.floor(Date.now()/1000),bucket=Math.floor(now/period);
      return transaction(() => {
        db.prepare('DELETE FROM rate_limits WHERE expires_at < ?').run(now);
        return db.prepare(`INSERT INTO rate_limits VALUES(?,?,?,?,1)
          ON CONFLICT(identity,scope,bucket) DO UPDATE SET hits=hits+1 RETURNING hits`)
          .get(identity,scope,bucket,(bucket+1)*period).hits;
      });
    },
    deleteProbe(frogId) {
      // This endpoint cannot remove normal registrations.
      return db.prepare("DELETE FROM students WHERE frog_id=? AND name='上线验证奶蛙'").run(frogId).changes;
    },
    importStudent(row) {
      return transaction(() => {
        const columns=['id','frog_id','name','avatar_id','entry_year','graduation_year','enrolled_at','request_id'];
        const existing=db.prepare('SELECT * FROM students WHERE id=? OR frog_id=? OR request_id=?').all(row.id,row.frog_id,row.request_id);
        if(existing.length) {
          if(existing.length!==1 || columns.some(k=>existing[0][k]!==row[k]))
            throw new RegistryError(409,'IMPORT_CONFLICT','迁移记录与现有名册冲突。');
          return {imported:false,total:count()};
        }
        db.prepare(`INSERT INTO students (${columns.join(',')}) VALUES (?,?,?,?,?,?,?,?)`).run(...columns.map(k=>row[k]));
        return {imported:true,total:count()};
      });
    }
  };
}
