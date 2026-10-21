(() => {
  'use strict';
  const section=document.querySelector('#enrollment');
  if(!section)return;
  if(location.protocol==='file:'){
    document.querySelector('#enrollmentSummary').textContent='请先运行 npm start，并通过终端显示的本地地址进入校园。';
    for(const id of ['openEnrollment','toggleRoster','retryEnrollmentCount']){const button=document.getElementById(id);if(button)button.disabled=true;}
    return;
  }
  document.querySelector('#openEnrollment')?.addEventListener('click',event=>{
    event.stopImmediatePropagation();location.href='campus.html#auth/register';
  });
  const localPreview=['127.0.0.1','localhost','[::1]'].includes(location.hostname);
  const api=(localPreview?'/api':document.querySelector('meta[name="naiwa-enrollment-api"]')?.content||'/api').replace(/\/$/,'');
  const sharedService=new URL(api,location.href).origin!==location.origin;
  let enrollmentTicket=null;
  const avatars={welcome:{src:'naiwa-portrait.jpg',label:'迎新奶蛙'},signal:{src:'avatar-signal.jpg',label:'同频耳机蛙'},study:{src:'avatar-study.jpg',label:'静音抱书蛙'},graduate:{src:'avatar-graduate.jpg',label:'出塘毕业蛙'}};
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const dialog=document.querySelector('#enrollmentDialog'),form=document.querySelector('#enrollmentForm');
  const open=document.querySelector('#openEnrollment'),close=document.querySelector('#closeEnrollment');
  const nameInput=document.querySelector('#frogName'),idInput=document.querySelector('#frogId');
  const submit=document.querySelector('#submitEnrollment'),formMessage=document.querySelector('#enrollmentFormMessage');
  const roster=document.querySelector('#frogRoster'),toggle=document.querySelector('#toggleRoster'),cards=document.querySelector('#frogCards');
  const rosterStatus=document.querySelector('#rosterStatus'),more=document.querySelector('#loadMoreFrogs'),refresh=document.querySelector('#refreshRoster');
  const count=document.querySelector('#enrollmentCount'),summary=document.querySelector('#enrollmentSummary');
  const success=document.querySelector('#enrollmentSuccess'),live=document.querySelector('#enrollmentLive');
  let knownTotal=null,students=[],nextCursor=null,revision=0,loading=false,submitting=false,completed=false,requestKey=null;
  const make=(tag,text,cls)=>{const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
  function avatar(id,cls){const el=make('img',undefined,cls);el.src='assets/'+(avatars[id]||avatars.welcome).src;el.alt='';el.width=64;el.height=64;el.decoding='async';return el;}
  function animateIn(el){if(!motion.matches&&el.animate)el.animate([{opacity:.4,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:260,easing:'ease-out'});}
  motion.addEventListener('change',()=>{if(motion.matches)section.getAnimations({subtree:true}).forEach(a=>a.cancel());});
  async function request(path,options={}){
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
    try{
      const response=await fetch(api+path,{...options,signal:controller.signal,cache:'no-store',headers:{Accept:'application/json',...options.headers}});
      let data;try{data=await response.json();}catch{throw new Error('暂时没连上入塘登记处，请稍后重试。');}
      if(!response.ok){const error=new Error(data.message||'登记处暂时忙碌，请稍后重试。');error.field=data.field;error.code=data.code;throw error;}
      return data;
    }catch(error){if(error.name==='AbortError'||error instanceof TypeError)throw new Error('暂时没连上入塘登记处，你填写的信息已保留，请重试。');throw error;}
    finally{clearTimeout(timeout);}
  }
  function renderCount(total){
    if(!Number.isSafeInteger(total)||total<0)return;
    const next=total,changed=knownTotal!==null&&next>knownTotal;
    knownTotal=next;count.textContent=next.toLocaleString('zh-CN');
    summary.textContent=next===0?'第一片荷叶已经留好，等你来入塘。':'从第一声“我来啦”，到一塘同频的奶蛙。';
    if(changed)animateIn(count);
  }
  function renderStack(){
    const stack=document.querySelector('#enrollmentAvatars');stack.replaceChildren();
    const recent=students.length?students.slice(0,4).map(s=>s.avatarId):Object.keys(avatars);
    recent.forEach(id=>stack.append(avatar(id)));
  }
  function renderCards(){
    cards.replaceChildren();
    students.forEach(student=>{
      const card=make('article',undefined,'frogCard'),detail=make('div');
      detail.append(make('h4',student.name),make('p','蛙号 '+student.frogId,'frogNumber'));
      const years=make('p',undefined,'frogYears');years.append(make('span','蛙元'+student.entryYear+'年入学'),make('span','蛙元'+student.graduationYear+'年毕业'));
      detail.append(years);card.append(avatar(student.avatarId),detail);cards.append(card);
    });
    document.querySelector('#rosterEmpty').hidden=students.length>0;
    document.querySelector('#rosterProgress').textContent=students.length?'已展示 '+students.length+' / '+knownTotal+' 位奶蛙 · 最近入塘的蛙友在前':'';
    more.hidden=nextCursor===null;renderStack();
  }
  async function loadRoster(reset=true){
    if(loading&&!reset)return;
    const ticket=++revision;loading=true;refresh.disabled=true;more.disabled=true;roster.setAttribute('aria-busy','true');
    rosterStatus.textContent='正在翻开全塘名册…';
    try{
      const data=await request('/enrollments?limit=12'+(!reset&&nextCursor?'&cursor='+nextCursor:''));
      if(ticket!==revision)return;
      renderCount(data.total);
      if(reset)students=data.students;else{const ids=new Set(students.map(s=>s.id));students.push(...data.students.filter(s=>!ids.has(s.id)));}
      nextCursor=data.nextCursor;renderCards();rosterStatus.textContent='';document.querySelector('#retryEnrollmentCount').hidden=true;
      if(!roster.hidden)animateIn(cards);
    }catch(error){
      if(ticket!==revision)return;
      rosterStatus.textContent=error.message;
      if(knownTotal===null)summary.textContent='暂时没有收到点名回声，稍后再试。';
      document.querySelector('#retryEnrollmentCount').hidden=false;
      document.querySelector('#rosterEmpty').hidden=true;
    }finally{if(ticket===revision){loading=false;refresh.disabled=false;more.disabled=false;roster.setAttribute('aria-busy','false');}}
  }
  function revealRoster(){
    roster.hidden=false;toggle.setAttribute('aria-expanded','true');toggle.textContent='收起蛙友名册 ↑';animateIn(roster);
    if(knownTotal===null&&!loading)loadRoster();
  }
  toggle.addEventListener('click',()=>{
    if(roster.hidden){revealRoster();if(knownTotal!==null)loadRoster();}
    else{roster.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.textContent='查看学生名册 ↓';}
  });
  more.addEventListener('click',()=>loadRoster(false));refresh.addEventListener('click',()=>loadRoster());
  document.querySelector('#retryEnrollmentCount').addEventListener('click',()=>loadRoster());
  function resetForm(){
    form.reset();formMessage.textContent='';nameInput.removeAttribute('aria-invalid');idInput.removeAttribute('aria-invalid');
    success.hidden=true;form.hidden=false;completed=false;requestKey=null;
  }
  open.addEventListener('click',()=>{
    if(completed&&!submitting)resetForm();
    dialog.showModal();document.body.classList.add('enrollmentModalOpen');
    if(submitting)close.focus();else nameInput.focus();
  });
  close.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.classList.remove('enrollmentModalOpen');open.focus();});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  [nameInput,idInput].forEach(input=>input.addEventListener('input',()=>{input.removeAttribute('aria-invalid');formMessage.textContent='';}));
  function showError(message,field){
    formMessage.textContent=message;
    const input=field==='name'?nameInput:field==='frogId'?idInput:null;
    if(input){input.setAttribute('aria-invalid','true');if(dialog.open)input.focus();}
  }
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(submitting)return;
    const name=nameInput.value.normalize('NFKC').trim(),frogId=idInput.value.normalize('NFKC').trim().toUpperCase();
    const avatarId=new FormData(form).get('avatarId');
    if(!name||[...name].length>20||/[\p{Cc}\p{Cf}<>]/u.test(name))return showError('蛙名请填写 1–20 个字，不使用换行或特殊控制符。','name');
    if(!/^[A-Z0-9_-]{3,20}$/.test(frogId))return showError('蛙号需为 3–20 位字母、数字、下划线或短横线。','frogId');
    if(!avatars[avatarId])return showError('请选择一张奶蛙头像。');
    nameInput.value=name;idInput.value=frogId;
    const fingerprint=JSON.stringify({name,frogId,avatarId});
    if(!requestKey||requestKey.fingerprint!==fingerprint)requestKey={fingerprint,id:crypto.randomUUID()};
    submitting=true;submit.disabled=true;form.setAttribute('aria-busy','true');submit.textContent='正在接入全塘…';formMessage.textContent='';
    // Prevent changing a pending request, while still allowing the dialog to close.
    [...form.elements].forEach(el=>el.disabled=true);
    try{
      const headers={'Content-Type':'application/json'};
      if(sharedService){
        if(!enrollmentTicket||enrollmentTicket.expiresAt<Date.now()+30000)enrollmentTicket=await request('/enrollment-ticket');
        headers['X-Naiwa-Ticket']=enrollmentTicket.ticket;
      }
      const data=await request('/enrollments',{method:'POST',headers,body:JSON.stringify({name,frogId,avatarId,requestId:requestKey.id})});
      completed=true;renderCount(data.total);form.hidden=true;success.hidden=false;
      const photo=document.querySelector('#successAvatar');photo.src='assets/'+avatars[data.student.avatarId].src;
      document.querySelector('#successName').textContent=data.student.name+'，欢迎入塘！';
      document.querySelector('#successFrogId').textContent=data.student.frogId;
      live.textContent='收到，呱！'+data.student.name+'入学成功，当前全塘已有 '+data.total+' 位奶蛙。';
      animateIn(success);if(dialog.open)document.querySelector('#seeMyClassmates').focus();
      loadRoster();
    }catch(error){
      // A retry of the same payload keeps its request ID, even after a timeout.
      if(error.code==='REQUEST_CHANGED')requestKey=null;
      if(error.code==='TICKET_EXPIRED')enrollmentTicket=null;
      showError(error.message,error.field);
    }finally{
      submitting=false;[...form.elements].forEach(el=>el.disabled=false);form.setAttribute('aria-busy','false');submit.textContent='确认入学，呱！';
      const invalid=form.querySelector('[aria-invalid="true"]');if(dialog.open&&!completed&&invalid)invalid.focus();
    }
  });
  document.querySelector('#seeMyClassmates').addEventListener('click',()=>{dialog.close();revealRoster();roster.scrollIntoView({behavior:motion.matches?'instant':'smooth',block:'start'});document.querySelector('#rosterHeading').focus({preventScroll:true});});
  async function refreshSharedCount(){
    if(document.hidden||dialog.open||loading||submitting)return;
    const ticket=revision;
    try{const data=await request('/enrollments?limit=1');if(ticket!==revision||submitting||loading)return;renderCount(data.total);
      if(students.length)document.querySelector('#rosterProgress').textContent='已展示 '+students.length+' / '+knownTotal+' 位奶蛙 · 最近入塘的蛙友在前';
    }catch{/* Keep the last confirmed count during a background network failure. */}
  }
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshSharedCount();});
  setInterval(refreshSharedCount,30000);
  renderStack();loadRoster();
})();
