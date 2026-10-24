import {findCourse} from './catalog-meta.mjs?v=20261024-colleges';
const loaded=new Map();
export async function loadCourse(id){
 const meta=findCourse(id);if(!meta)return null;
 if(!loaded.has(id))loaded.set(id,meta.creditSystem==='legacy-platform'?import('./legacy.mjs?v=20261024-colleges').then(m=>m.findCourse(id)):import(`./${meta.contentDirectory||'phase1'}/${id}.mjs?v=20261024-colleges`).then(m=>m.course));
 try{return await loaded.get(id);}catch(error){loaded.delete(id);throw error;}
}
