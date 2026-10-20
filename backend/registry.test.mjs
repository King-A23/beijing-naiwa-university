import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createRegistryStore } from './registry.mjs';
import { createApp } from './server.mjs';
const input = (frogId, extra = {}) => ({ name: '同频奶蛙', frogId, avatarId: 'welcome', requestId: randomUUID(), ...extra });

test('normalization, immutable years, idempotency and duplicate IDs', () => {
  const store = createRegistryStore(':memory:');
  try {
    const request = input(' ｎｗ００１ ', { entryYear: 99, graduationYear: 88 });
    const first = store.enroll(request);
    assert.equal(first.student.frogId, 'NW001'); assert.equal(first.total, 1);
    assert.equal(first.student.entryYear, 0); assert.equal(first.student.graduationYear, 4);
    assert.equal(store.enroll(request).created, false); assert.equal(store.list().total, 1);
    assert.throws(() => store.enroll(input('nw001')), { code: 'FROG_ID_TAKEN' });
    assert.throws(() => store.enroll({ ...request, name: '另一只蛙' }), { code: 'REQUEST_CHANGED' });
    assert.throws(() => store.enroll(input('X')), { code: 'INVALID_FROG_ID' });
    assert.throws(() => store.enroll(input('NW002', { name: '<svg/onload=x>' })), { code: 'INVALID_NAME' });
    assert.throws(() => store.enroll(input('NW002', { avatarId: '../../secret' })), { code: 'INVALID_AVATAR' });
    assert.equal(store.list().total, 1);
  } finally { store.close(); }
});
test('durability and stable cursor pagination across new enrollments', () => {
  const dir = mkdtempSync(join(tmpdir(), 'naiwa-test-'));const path = join(dir, 'test.sqlite');
  let store = createRegistryStore(path);
  try {
    for(let i=0;i<15;i++)store.enroll(input('FROG'+i));
    const first=store.list({limit:12});assert.equal(first.students.length,12);
    store.close();store=createRegistryStore(path);assert.equal(store.list().total,15);
    store.enroll(input('NEWEST'));
    const next=store.list({limit:12,cursor:first.nextCursor});assert.equal(next.students.length,3);
    assert.equal(new Set([...first.students,...next.students].map(s=>s.frogId)).size,15);
    assert.equal(next.total,16);assert.equal(next.nextCursor,null);
    assert.ok(!('request_id' in first.students[0]));
  } finally { store.close();rmSync(dir,{recursive:true,force:true}); }
});
test('HTTP concurrency admits one frog and protects local database paths', async () => {
  const server=createApp({databasePath:':memory:'});server.listen(0,'127.0.0.1');await once(server,'listening');
  const base=`http://127.0.0.1:${server.address().port}`;
  try {
    const responses=await Promise.all(Array.from({length:8},()=>fetch(base+'/api/enrollments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(input('SAME001'))})));
    assert.equal(responses.filter(r=>r.status===201).length,1);assert.equal(responses.filter(r=>r.status===409).length,7);
    assert.equal((await (await fetch(base+'/api/enrollments')).json()).total,1);
    assert.equal((await fetch(base+'/.local/students.sqlite')).status,404);
    assert.equal((await fetch(base+'/backend/registry.mjs')).status,404);
    assert.equal((await fetch(base+'/api/enrollments?limit=-1')).status,400);
    assert.equal((await fetch(base+'/api/enrollments',{method:'POST',headers:{'Content-Type':'application/json',Origin:'https://unrelated.example'},body:JSON.stringify(input('OTHER001'))})).status,403);
    assert.equal((await fetch(base+'/api/enrollments',{method:'POST',headers:{'Content-Type':'application/json'},body:'{oops'})).status,400);
  } finally { await new Promise(resolve=>server.close(resolve)); }
});
