const ORIGINS=new Set(['https://xn--1lq90ic7f9iv6f088h.cn','https://king-a23.github.io']);
const AVATARS=new Set(['welcome','signal','study','graduate']);
const encoder=new TextEncoder();
class RegistryError extends Error {
  constructor(status,code,message,field){super(message);Object.assign(this,{status,code,field});}
}
function validOrigin(request){
  const origin=request.headers.get('Origin'),url=new URL(request.url);
  return origin&&(ORIGINS.has(origin)||origin===url.origin||
    (['127.0.0.1','localhost'].includes(url.hostname)&&/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin)));
}
function respond(request,status,body,extra={}){
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin',...extra};
  if(validOrigin(request))headers['Access-Control-Allow-Origin']=request.headers.get('Origin');
  return new Response(status===204?null:JSON.stringify(body),{status,headers});
}
function validate(input){
  if(!input||typeof input!=='object'||Array.isArray(input))throw new RegistryError(400,'INVALID_INPUT','请填写入塘信息。');
  const name=typeof input.name==='string'?input.name.normalize('NFKC').trim():'';
  const frogId=typeof input.frogId==='string'?input.frogId.normalize('NFKC').trim().toUpperCase():'';
  if(!name||[...name].length>20||/[\p{Cc}\p{Cf}<>]/u.test(name))throw new RegistryError(400,'INVALID_NAME','蛙名请填写 1–20 个字，不使用换行或特殊控制符。','name');
  if(!/^[A-Z0-9_-]{3,20}$/.test(frogId))throw new RegistryError(400,'INVALID_FROG_ID','蛙号需为 3–20 位字母、数字、下划线或短横线。','frogId');
  if(!AVATARS.has(input.avatarId))throw new RegistryError(400,'INVALID_AVATAR','请选择一张奶蛙头像。','avatarId');
  if(typeof input.requestId!=='string'||!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(input.requestId))throw new RegistryError(400,'INVALID_REQUEST','登记凭据已失效，请刷新页面后再试。');
  return {name,frogId,avatarId:input.avatarId,requestId:input.requestId.toLowerCase()};
}
async function body(request){
  if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type')||''))throw new RegistryError(415,'JSON_REQUIRED','请使用入塘登记表提交。');
  const reader=request.body?.getReader();if(!reader)throw new RegistryError(400,'BAD_JSON','请填写入塘信息。');
  let size=0;const chunks=[];
  try{for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>4096){await reader.cancel();throw new RegistryError(413,'BODY_TOO_LARGE','填写内容太长，请精简后再试。');}chunks.push(value);}}
  finally{reader.releaseLock();}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new RegistryError(400,'BAD_JSON','登记内容没有读完整，请再试一次。');}
}
const publicStudent=row=>({id:row.id,name:row.name,frogId:row.frog_id,avatarId:row.avatar_id,entryYear:row.entry_year,graduationYear:row.graduation_year,enrolledAt:row.enrolled_at});
const b64=bytes=>btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
function un64(str){return Uint8Array.from(atob(str.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}
async function key(secret){if(!secret)throw new Error('Registry signing secret missing');return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
async function ipHash(request,signingKey){
  // Cloudflare supplies this header. Do not trust client forwarding headers.
  const ip=request.headers.get('CF-Connecting-IP')||'unknown';
  return b64(new Uint8Array(await crypto.subtle.sign('HMAC',signingKey,encoder.encode('ip:'+ip))));
}
async function rateLimit(db,identity,scope,period,limit){
  const now=Math.floor(Date.now()/1000),window=Math.floor(now/period),bucket=scope+':'+identity+':'+window;
  const result=await db.batch([
    db.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(now),
    db.prepare('INSERT INTO rate_limits(bucket,hits,expires_at) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET hits=hits+1 RETURNING hits').bind(bucket,(window+1)*period),
  ]);
  if(result[1].results[0].hits>limit)throw new RegistryError(429,'RATE_LIMITED','入塘登记太频繁啦，休息一会儿再来。');
}
async function issueTicket(request,env,db){
  const signingKey=await key(env.REGISTRY_SIGNING_KEY),identity=await ipHash(request,signingKey);
  await rateLimit(db,identity,'ticket',60,30);
  const expiresAt=Date.now()+10*60*1000;
  const payload=b64(encoder.encode(JSON.stringify({expiresAt,identity,nonce:crypto.randomUUID()})));
  const signature=b64(new Uint8Array(await crypto.subtle.sign('HMAC',signingKey,encoder.encode(payload))));
  return {ticket:payload+'.'+signature,expiresAt};
}
async function verifyTicket(request,env){
  try{
    const token=request.headers.get('X-Naiwa-Ticket')||'';if(token.length>1024)throw new Error();
    const parts=token.split('.');if(parts.length!==2)throw new Error();
    const signingKey=await key(env.REGISTRY_SIGNING_KEY);
    if(!await crypto.subtle.verify('HMAC',signingKey,un64(parts[1]),encoder.encode(parts[0])))throw new Error();
    const data=JSON.parse(new TextDecoder().decode(un64(parts[0])));
    const identity=await ipHash(request,signingKey);
    if(!Number.isFinite(data.expiresAt)||data.expiresAt<Date.now()||data.identity!==identity)throw new Error();
    return identity;
  }catch{throw new RegistryError(403,'TICKET_EXPIRED','入塘凭据需要更新，请再点一次确认入学。');}
}
async function enroll(request,env,db){
  const input=validate(await body(request)),identity=await verifyTicket(request,env);
  const prior=await db.prepare('SELECT * FROM students WHERE request_id=?').bind(input.requestId).first();
  if(prior){
    if(prior.frog_id!==input.frogId||prior.name!==input.name||prior.avatar_id!==input.avatarId)throw new RegistryError(409,'REQUEST_CHANGED','登记信息已改变，请重新提交。');
    return {student:publicStudent(prior),total:(await db.prepare('SELECT COUNT(*) AS total FROM students').first()).total,created:false};
  }
  await rateLimit(db,identity,'enroll',3600,120);
  // Atomic batch and database UNIQUE constraints arbitrate concurrent Workers.
  const result=await db.batch([
    db.prepare('INSERT INTO students(frog_id,name,avatar_id,enrolled_at,request_id) VALUES (?,?,?,?,?) ON CONFLICT DO NOTHING RETURNING id').bind(input.frogId,input.name,input.avatarId,new Date().toISOString(),input.requestId),
    db.prepare('SELECT * FROM students WHERE request_id=?').bind(input.requestId),
    db.prepare('SELECT COUNT(*) AS total FROM students'),
  ]);
  const row=result[1].results[0];
  if(!row)throw new RegistryError(409,'FROG_ID_TAKEN','这枚蛙号已经入塘啦，请换一个蛙号。','frogId');
  if(row.frog_id!==input.frogId||row.name!==input.name||row.avatar_id!==input.avatarId)throw new RegistryError(409,'REQUEST_CHANGED','登记信息已改变，请重新提交。');
  return {student:publicStudent(row),total:result[2].results[0].total,created:result[0].results.length===1};
}
async function list(url,db){
  const limit=url.searchParams.has('limit')?Number(url.searchParams.get('limit')):12;
  const cursor=url.searchParams.has('cursor')?Number(url.searchParams.get('cursor')):null;
  if(!Number.isInteger(limit)||limit<1||limit>24||(cursor!==null&&(!Number.isSafeInteger(cursor)||cursor<1)))throw new RegistryError(400,'INVALID_PAGE','名册页码不正确，请重新展开名册。');
  const statement=cursor===null?db.prepare('SELECT * FROM students ORDER BY id DESC LIMIT ?').bind(limit+1):db.prepare('SELECT * FROM students WHERE id<? ORDER BY id DESC LIMIT ?').bind(cursor,limit+1);
  const result=await db.batch([statement,db.prepare('SELECT COUNT(*) AS total FROM students')]);
  const students=result[0].results.slice(0,limit).map(publicStudent);
  return {students,total:result[1].results[0].total,nextCursor:result[0].results.length>limit?students.at(-1).id:null};
}
async function isAdmin(request,env){
  if(!env.REGISTRY_ADMIN_KEY)return false;
  const supplied=request.headers.get('Authorization')||'';
  const a=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(supplied)));
  const b=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode('Bearer '+env.REGISTRY_ADMIN_KEY)));
  let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];return diff===0;
}
export async function handleRegistry(request,env){
  const url=new URL(request.url);
  try{
    if(!env.DB)throw new Error('Registry database missing');
    const db=env.DB.withSession('first-primary');
    if(url.pathname==='/api/maintenance/qa'&&request.method==='DELETE'){
      if(!await isAdmin(request,env))throw new RegistryError(403,'FORBIDDEN','没有维护权限。');
      const input=await body(request);
      if(!/^QA_PROBE_[A-Z0-9]{8}$/.test(input.frogId||''))throw new RegistryError(400,'INVALID_PROBE','只能清理本次验证记录。');
      const result=await db.prepare("DELETE FROM students WHERE frog_id=? AND name='上线验证奶蛙'").bind(input.frogId).run();
      return respond(request,200,{deleted:result.meta.changes});
    }
    if(url.pathname==='/api/maintenance/export'&&request.method==='GET'){
      if(!await isAdmin(request,env))throw new RegistryError(403,'FORBIDDEN','没有维护权限。');
      return respond(request,200,await list(url,db));
    }
    if(!['/api/enrollments','/api/enrollment-ticket','/api/health'].includes(url.pathname))return respond(request,404,{message:'没有找到这个蛙务入口。'});
    if(request.headers.has('Origin')&&!validOrigin(request))throw new RegistryError(403,'ORIGIN_DENIED','请从奶蛙大学页面提交登记。');
    if(request.method==='OPTIONS')return respond(request,204,null,{'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type, X-Naiwa-Ticket','Access-Control-Max-Age':'600'});
    if(url.pathname==='/api/health'&&request.method==='GET')return respond(request,200,{ok:!!(await db.prepare('SELECT 1 FROM students LIMIT 1').all()).success,service:'naiwa-registry',version:'20261020-1'});
    if(url.pathname==='/api/enrollments'&&request.method==='GET')return respond(request,200,await list(url,db));
    if(!validOrigin(request))throw new RegistryError(403,'ORIGIN_DENIED','请从奶蛙大学页面提交登记。');
    if(url.pathname==='/api/enrollment-ticket'&&request.method==='GET')return respond(request,200,await issueTicket(request,env,db));
    if(url.pathname==='/api/enrollments'&&request.method==='POST'){
      const result=await enroll(request,env,db);return respond(request,result.created?201:200,result);
    }
    return respond(request,405,{message:'这个入口只办理查询与入塘登记。'},{Allow:'GET, POST, OPTIONS'});
  }catch(error){
    if(error instanceof RegistryError)return respond(request,error.status,{code:error.code,message:error.message,field:error.field},error.status===429?{'Retry-After':'60'}:{});
    console.error('Registry request failed',error.message);
    return respond(request,503,{message:'登记处暂时忙碌，请稍后重试。'});
  }
}
