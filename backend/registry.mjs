import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export const AVATARS = new Set(['welcome', 'signal', 'study', 'graduate']);
export class RegistryError extends Error {
  constructor(status, code, message, field) {
    super(message); Object.assign(this, { status, code, field });
  }
}
export function validateEnrollment(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new RegistryError(400, 'INVALID_INPUT', '请填写入塘信息。');
  const name = typeof input.name === 'string' ? input.name.normalize('NFKC').trim() : '';
  const frogId = typeof input.frogId === 'string' ? input.frogId.normalize('NFKC').trim().toUpperCase() : '';
  if (!name || [...name].length > 20 || /[\p{Cc}\p{Cf}<>]/u.test(name)) throw new RegistryError(400, 'INVALID_NAME', '蛙名请填写 1–20 个字，不使用换行或特殊控制符。', 'name');
  if (!/^[A-Z0-9_-]{3,20}$/.test(frogId)) throw new RegistryError(400, 'INVALID_FROG_ID', '蛙号需为 3–20 位字母、数字、下划线或短横线。', 'frogId');
  if (!AVATARS.has(input.avatarId)) throw new RegistryError(400, 'INVALID_AVATAR', '请选择一张奶蛙头像。', 'avatarId');
  if (typeof input.requestId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(input.requestId)) throw new RegistryError(400, 'INVALID_REQUEST', '登记凭据已失效，请刷新页面后再试。');
  return { name, frogId, avatarId: input.avatarId, requestId: input.requestId };
}
function publicStudent(row) {
  return { id: row.id, name: row.name, frogId: row.frog_id, avatarId: row.avatar_id, entryYear: row.entry_year, graduationYear: row.graduation_year, enrolledAt: row.enrolled_at };
}
export function createRegistryStore(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path, { timeout: 5000 });
  db.exec(`PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      frog_id TEXT NOT NULL COLLATE NOCASE UNIQUE,
      name TEXT NOT NULL CHECK(length(name) BETWEEN 1 AND 20),
      avatar_id TEXT NOT NULL CHECK(avatar_id IN ('welcome','signal','study','graduate')),
      entry_year INTEGER NOT NULL DEFAULT 0 CHECK(entry_year = 0),
      graduation_year INTEGER NOT NULL DEFAULT 4 CHECK(graduation_year = 4),
      enrolled_at TEXT NOT NULL,
      request_id TEXT NOT NULL UNIQUE
    ) STRICT;`);
  const count = () => db.prepare('SELECT COUNT(*) AS total FROM students').get().total;
  return {
    close() { db.close(); },
    list({ limit = 12, cursor = null } = {}) {
      if (!Number.isInteger(limit) || limit < 1 || limit > 24 || (cursor !== null && (!Number.isSafeInteger(cursor) || cursor < 1))) throw new RegistryError(400, 'INVALID_PAGE', '名册页码不正确，请重新展开名册。');
      const rows = cursor === null
        ? db.prepare('SELECT * FROM students ORDER BY id DESC LIMIT ?').all(limit + 1)
        : db.prepare('SELECT * FROM students WHERE id < ? ORDER BY id DESC LIMIT ?').all(cursor, limit + 1);
      const hasMore = rows.length > limit;
      const students = rows.slice(0, limit).map(publicStudent);
      return { total: count(), students, nextCursor: hasMore ? students.at(-1).id : null };
    },
    enroll(raw) {
      const input = validateEnrollment(raw);
      // Uniqueness and retry handling share the same database transaction.
      db.exec('BEGIN IMMEDIATE');
      try {
        const prior = db.prepare('SELECT * FROM students WHERE request_id = ?').get(input.requestId);
        if (prior) {
          if (prior.frog_id !== input.frogId || prior.name !== input.name || prior.avatar_id !== input.avatarId) throw new RegistryError(409, 'REQUEST_CHANGED', '登记信息已改变，请重新提交。');
          const result = { student: publicStudent(prior), total: count(), created: false };
          db.exec('COMMIT'); return result;
        }
        if (db.prepare('SELECT id FROM students WHERE frog_id = ?').get(input.frogId)) throw new RegistryError(409, 'FROG_ID_TAKEN', '这枚蛙号已经入塘啦，请换一个蛙号。', 'frogId');
        db.prepare('INSERT INTO students (frog_id,name,avatar_id,enrolled_at,request_id) VALUES (?,?,?,?,?)').run(input.frogId, input.name, input.avatarId, new Date().toISOString(), input.requestId);
        const row = db.prepare('SELECT * FROM students WHERE request_id = ?').get(input.requestId);
        const result = { student: publicStudent(row), total: count(), created: true };
        db.exec('COMMIT'); return result;
      } catch (error) { db.exec('ROLLBACK'); throw error; }
    }
  };
}
