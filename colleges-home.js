import {colleges} from './courses/colleges.mjs?v=20261024-colleges';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const host=document.querySelector('#collegeHomeList');
if(host){host.innerHTML=colleges.map((c,i)=>`<a href="campus.html#college/${encodeURIComponent(c.id)}"><small>${String(i+1).padStart(2,'0')}</small><h3>${esc(c.name)}</h3><p>${esc(c.tagline)}</p><span>${c.programIds.length}个方向 · 走进学院 ↗</span></a>`).join('');const summary=document.querySelector('#collegeHomeSummary');if(summary)summary.textContent=`${colleges.length}个学院 · ${new Set(colleges.flatMap(c=>c.programIds)).size}个方向 · 从兴趣找到学习路线`;}
