import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { createStore } from './store.mjs';
import { handleRegistry } from './registry.mjs';
const origin='https://xn--1lq90ic7f9iv6f088h.cn';
const payload=(frogId='FROG_001')=>({name:'测试奶蛙',frogId,avatarId:'welcome',requestId:randomUUID()});
function fixture(){
  const dir=mkdtempSync(join(tmpdir(),'naiwa-ecs-'));
  const path=join(dir,'test.sqlite');
  const STORE=createStore(path);
  return {path,STORE,env:{STORE,REGISTRY_SIGNING_KEY:'test-only-signing',REGISTRY_ADMIN_KEY:'test-only-admin'},close(){STORE.close();rmSync(dir,{recursive:true,force:true});}};
}
const request=(path,options={})=>new Request('https://api.xn--1lq90ic7f9iv6f088h.cn/api'+path,{...options,headers:{Origin:origin,'X-Naiwa-Source-IP':'192.0.2.10',...options.headers}});
async function ticket(env){const r=await handleRegistry(request('/enrollment-ticket'),env);assert.equal(r.status,200);return (await r.json()).ticket;}
const post=(data,token)=>request('/enrollments',{method:'POST',headers:{'Content-Type':'application/json','X-Naiwa-Ticket':token},body:JSON.stringify(data)});

test('concurrent case variants create one registration; retry preserves count',async()=>{
  const f=fixture();try{
    const token=await ticket(f.env),a=payload('SAME_ID'),b=payload('same_id');
    const results=await Promise.all([a,b].map(p=>handleRegistry(post(p,token),f.env)));
    assert.deepEqual(results.map(r=>r.status).sort(),[201,409]);
    const winner=results[0].status===201?a:b;
    const retry=await handleRegistry(post(winner,token),f.env);
    assert.equal(retry.status,200);assert.equal((await retry.json()).total,1);
    assert.equal((await handleRegistry(post({...winner,name:'改名奶蛙'},token),f.env)).status,409);
    const listed=await (await handleRegistry(request('/enrollments'),f.env)).json();
    assert.equal(listed.total,1);assert.equal('request_id' in listed.students[0],false);
  }finally{f.close();}
});
test('migration retains ID and retry token across restart and detects conflicts',()=>{
  const f=fixture();try{
    const row={id:12,frog_id:'OLD_FROG',name:'原有奶蛙',avatar_id:'study',entry_year:0,graduation_year:4,enrolled_at:'2026-10-19T10:00:00.000Z',request_id:randomUUID()};
    assert.equal(f.STORE.importStudent(row).imported,true);
    assert.equal(f.STORE.importStudent(row).imported,false);
    const second=createStore(f.path);try{
      assert.deepEqual({...second.list().students[0]},row);
      assert.equal(second.enroll({frogId:row.frog_id,name:row.name,avatarId:row.avatar_id,requestId:row.request_id}).created,false);
      assert.throws(()=>second.enroll(payload('old_frog')),e=>e.code==='FROG_ID_TAKEN');
      assert.throws(()=>second.importStudent({...row,name:'冲突'}),e=>e.code==='IMPORT_CONFLICT');
      assert.ok(second.enroll(payload()).student.id>12);
    }finally{second.close();}
  }finally{f.close();}
});
test('CORS, IP-bound ticket and maintenance permission remain enforced',async()=>{
  const f=fixture();try{
    const token=await ticket(f.env);
    const p=post(payload(),token);p.headers.set('X-Naiwa-Source-IP','192.0.2.11');
    assert.equal((await handleRegistry(p,f.env)).status,403);
    assert.equal((await handleRegistry(request('/enrollment-ticket',{headers:{Origin:'https://example.com'}}),f.env)).status,403);
    assert.equal((await handleRegistry(request('/maintenance/import',{method:'POST',headers:{Authorization:'Bearer test-only-admin','Content-Type':'application/json'},body:'{}'}),f.env)).status,403);
    const cors=await handleRegistry(request('/enrollments',{method:'OPTIONS'}),f.env);
    assert.equal(cors.status,204);assert.equal(cors.headers.get('Access-Control-Allow-Origin'),origin);
    assert.equal(f.STORE.list().total,0);
  }finally{f.close();}
});
