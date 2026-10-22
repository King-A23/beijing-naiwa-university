// A retained cookie can offer an account, but only an explicit choice opens a portal.
// This is a UI preference, not authentication; the API still verifies every request.
const portals=new Set(['campus.html','principal.html','academic.html','student-services.html']);
const choiceKey='naiwa.campus.explicit-entry.v1';
const identity=profile=>profile?.identity?.accountId?`${profile.identity.accountId}:${profile.role}`:'';

export function createCampusEntry({storage,origin,referrer='',navigationType='navigate'}={}){
 let internal=false;
 try{const from=new URL(referrer);internal=from.origin===origin&&portals.has(from.pathname.split('/').pop());}catch{}
 const clear=()=>{try{storage?.removeItem(choiceKey);}catch{}};
 // Coming from the school homepage, a bookmark or an external link starts a new entry.
 if(!internal&&!['reload','back_forward'].includes(navigationType))clear();
 return {
  clear,
  has(profile){try{return !!identity(profile)&&storage?.getItem(choiceKey)===identity(profile);}catch{return false;}},
  choose(profile){
   if(!identity(profile))throw Error('账号状态已失效，请重新登录。');
   try{storage.setItem(choiceKey,identity(profile));if(storage.getItem(choiceKey)!==identity(profile))throw Error();}
   catch{throw Error('浏览器未允许保存本次登录选择，请允许本站会话存储后重试。');}
  }
 };
}

export function safeCampusTarget(value,origin,role){
 try{
  const target=new URL(value,origin+'/');
  const file=target.pathname.slice(1);
  if(target.origin!==origin||!portals.has(file)||target.search||target.username||target.password||/^#auth(?:\/|$)/.test(target.hash))return null;
  if(file==='principal.html'&&role!=='principal')return null;
  return file+target.hash;
 }catch{return null;}
}

let storage;try{storage=globalThis.sessionStorage;}catch{}
const entry=createCampusEntry({storage,origin:globalThis.location?.origin,referrer:globalThis.document?.referrer,navigationType:globalThis.performance?.getEntriesByType?.('navigation')[0]?.type});
export const clearCampusChoice=()=>entry.clear();
export const hasCampusChoice=profile=>entry.has(profile);
export const chooseCampusAccount=profile=>entry.choose(profile);
export function requireCampusChoice(profile){
 if(entry.has(profile))return true;
 entry.clear();
 const target=location.pathname.split('/').pop()+location.hash;
 location.replace('campus.html?continue='+encodeURIComponent(target)+'#auth/login');
 return false;
}
export function campusLoginTarget(profile){
 return safeCampusTarget(new URLSearchParams(location.search).get('continue')||'',location.origin,profile.role)||'campus.html#home';
}

if(globalThis.window){
 // Do not reveal a cached workbench after logout or after another tab changes accounts.
 window.addEventListener('pagehide',event=>{if(event.persisted)document.documentElement.style.visibility='hidden';});
 window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
}
