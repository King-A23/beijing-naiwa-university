'use strict';
const content = window.NAIWA_CONTENT || [];
const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const articleLink = id => 'article.html?id=' + encodeURIComponent(id);
function make(tag, text, cls) {
  const el = document.createElement(tag);
  if (text !== undefined) el.textContent = text;
  if (cls) el.className = cls;
  return el;
}
function linkTo(article, label) {
  const a = make('a', label || article.title);
  a.href = articleLink(article.id);
  return a;
}
function animate(el, frames, options = {}) {
  if (!el || reducedMotion.matches || !el.animate) return;
  el.getAnimations().forEach(a => a.cancel());
  el.animate(frames, { duration: 450, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards', ...options });
}
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) document.getAnimations().forEach(a => a.cancel());
});

// Shared navigation stays in the original masthead.
const menu = document.querySelector('#menuToggle');
const nav = document.querySelector('#mainNav');
function closeMenu(returnFocus = false) {
  nav?.classList.remove('open');
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', '展开导航');
  if (returnFocus) menu?.focus();
}
menu?.addEventListener('click', () => {
  const opened = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(opened));
  menu.setAttribute('aria-label', opened ? '收起导航' : '展开导航');
});
nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
const mobileMenu = matchMedia('(max-width: 600px)');
mobileMenu.addEventListener('change', () => closeMenu());
function markNavigation() {
  const article = content.find(a => a.id === params.get('id'));
  const categoryTargets = { '招生就业':'admissions', '院系介绍':'schools', '人才培养':'education', '教学科研':'research', '学术活动':'research', '合作交流':'exchange', '奶蛙概况':'about', '服务指南':'life', '校园动态':'life' };
  const isHome = location.pathname.endsWith('/') || location.pathname.endsWith('/index.html');
  const target = isHome ? (location.hash.slice(1) || 'top') : article ? categoryTargets[article.category] : location.pathname.endsWith('gallery.html') ? 'life' : null;
  nav?.querySelectorAll('a').forEach(a => {
    const active = !!target && (a.hash === '#' + target || (target === 'admissions' && a.href.includes('id=admissions')));
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', isHome ? 'location' : 'page');
    else a.removeAttribute('aria-current');
  });
}
markNavigation();
addEventListener('hashchange', markNavigation);
const searchToggle = document.querySelector('#searchToggle');
const searchForm = document.querySelector('#searchForm');
function closeSearch(returnFocus = false) {
  if (!searchForm) return;
  searchForm.hidden = true;
  searchToggle.setAttribute('aria-expanded', 'false');
  searchToggle.setAttribute('aria-label', '打开站内搜索');
  if (returnFocus) searchToggle.focus();
}
searchToggle?.addEventListener('click', () => {
  if (!searchForm.hidden) return closeSearch(true);
  searchForm.hidden = false;
  searchToggle.setAttribute('aria-expanded', 'true');
  searchToggle.setAttribute('aria-label', '关闭站内搜索');
  document.querySelector('#searchInput').focus();
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || document.querySelector('dialog[open]')) return;
  if (searchForm && !searchForm.hidden) closeSearch(true);
  else if (nav?.classList.contains('open')) closeMenu(true);
});
searchForm?.addEventListener('submit', e => {
  const q = document.querySelector('#searchInput').value.trim();
  if (!q) { e.preventDefault(); document.querySelector('#searchResult').textContent = '先写一个关键词，例如“食堂”或“通信”。'; }
});

// A calm, user-controllable carousel; no timers run offscreen or in the background.
const slides = [
  ['hero.jpg','BEIJING NAIWA UNIVERSITY · 2026','传蛙万里　与梦想同频','以好奇探索世界，以热爱连接未来。','#about','走进奶蛙大学','校园校门'],
  ['avenue.jpg','AUTUMN ON CAMPUS · 校园文化','秋日有信　青春有声','早八有点困，沿途的风景依然值得抬头。','gallery.html','走进光影校园','校园林荫道'],
  ['campus.jpg','EXPLORE & CONNECT · 教学科研','以求知为帆　以热爱为航','愿每一个问题有回应，每一份努力都有 ACK。','article.html?id=protocol','试试呱声通信实验','校园钟塔']
];
const hero = document.querySelector('.hero');
if (hero) {
  let current = 0, paused = false, hovered = false, focused = false, visible = true, timer, revision = 0;
  const dots = [...hero.querySelectorAll('.dots button')];
  const image = document.querySelector('#heroImage');
  const pause = make('button', 'Ⅱ');
  pause.id = 'pauseSlides';
  hero.querySelector('.heroControls>div:last-child').prepend(pause);
  const status = make('span', undefined, 'srOnly');
  status.setAttribute('aria-live', 'polite');
  hero.append(status);
  function schedule() {
    clearTimeout(timer);
    const stopped = paused || reducedMotion.matches;
    pause.textContent = stopped ? '▶' : 'Ⅱ';
    pause.setAttribute('aria-pressed', String(stopped));
    pause.setAttribute('aria-label', reducedMotion.matches ? '已按系统偏好关闭自动切换' : paused ? '继续自动切换' : '暂停自动切换');
    pause.disabled = reducedMotion.matches;
    if (!stopped && !hovered && !focused && visible && !document.hidden) timer = setTimeout(() => {
      if (!paused && !reducedMotion.matches && !hovered && !focused && visible && !document.hidden) showSlide(current + 1);
      else schedule();
    }, 8000);
  }
  async function showSlide(n, manual = false) {
    current = (n + slides.length) % slides.length;
    const ticket = ++revision;
    const [src,kicker,title,sub,href,label,alt] = slides[current];
    const nextImage = new Image();
    nextImage.src = 'assets/' + src;
    try { await nextImage.decode(); } catch { /* Keep text and links usable if an image cannot load. */ }
    if (ticket !== revision) return;
    image.src = nextImage.src;
    image.alt = alt + '，北京邮电大学校园影像引用';
    document.querySelector('#heroKicker').textContent = kicker;
    document.querySelector('#heroTitle').replaceChildren(...title.split('　').map(t => make('span', t)));
    document.querySelector('#heroSub').textContent = sub;
    const link = document.querySelector('#heroLink');
    link.href = href;
    link.replaceChildren(document.createTextNode(label), make('span', '→'));
    document.querySelector('#slideCounter').textContent = `0${current + 1} / 03`;
    dots.forEach((b,i) => { b.classList.toggle('selected', i === current); b.setAttribute('aria-pressed', String(i === current)); });
    animate(image, [{opacity:.65, transform:'scale(1.018)'},{opacity:1, transform:'scale(1)'}], {duration:700});
    hero.querySelectorAll('.heroContent > *').forEach((el,i) => animate(el, [{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}], {delay:i*45}));
    if (manual) status.textContent = `专题 ${current + 1}：${title.replace('　','，')}`;
    schedule();
  }
  pause.addEventListener('click', () => { paused = !paused; schedule(); });
  document.querySelector('#prevSlide').onclick = () => showSlide(current - 1, true);
  document.querySelector('#nextSlide').onclick = () => showSlide(current + 1, true);
  dots.forEach((b,i) => { b.setAttribute('aria-label', '专题' + (i+1) + '：' + slides[i][2].replace('　','，')); b.onclick = () => showSlide(i, true); });
  hero.addEventListener('pointerenter', e => { if(e.pointerType === 'mouse') { hovered = true; schedule(); } });
  hero.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  hero.addEventListener('focusin', () => { focused = true; schedule(); });
  hero.addEventListener('focusout', e => { focused = hero.contains(e.relatedTarget); schedule(); });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', schedule);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; schedule(); }).observe(hero);
  swipe(hero, direction => showSlide(current + direction, true));
  schedule();
}
function swipe(el, callback) {
  let start;
  el.addEventListener('pointerdown', e => { if(e.pointerType === 'touch') start = {x:e.clientX,y:e.clientY}; });
  el.addEventListener('pointerup', e => {
    if (!start) return;
    const dx = e.clientX-start.x, dy = e.clientY-start.y;
    start = null;
    if (Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.5) callback(dx<0 ? 1 : -1);
  });
  el.addEventListener('pointercancel', () => { start = null; });
}

const tabs = [...document.querySelectorAll('.infoTabs [role=tab]')];
function activateTab(tab) {
  tabs.forEach(b => { const on = b===tab; b.setAttribute('aria-selected',String(on)); b.tabIndex = on ? 0 : -1; document.getElementById(b.getAttribute('aria-controls')).hidden = !on; });
  const more = document.querySelector('#infoMore');
  if (more) { more.href = 'news.html?category=' + encodeURIComponent(tab.textContent); more.setAttribute('aria-label', '更多' + tab.textContent); }
  animate(document.getElementById(tab.getAttribute('aria-controls')), [{opacity:.4,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}]);
}
tabs.forEach((tab,i) => {
  tab.onclick = () => activateTab(tab);
  tab.onkeydown = e => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    e.preventDefault();
    const n = e.key==='Home' ? 0 : e.key==='End' ? tabs.length-1 : (i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
    activateTab(tabs[n]); tabs[n].focus();
  };
});

// Every content category is reachable; filters and search share bookmarkable URLs.
const listing = document.querySelector('#newsListing');
if (listing) {
  const categories = ['全部', ...new Set(content.map(a => a.category))];
  const requested = params.get('category') || '全部';
  const selected = categories.includes(requested) ? requested : '全部';
  const query = (params.get('q') || '').trim().slice(0,100);
  const normalize = s => s.normalize('NFKC').toLocaleLowerCase();
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  document.querySelector('#listingQuery').value = query;
  document.querySelector('#searchInput').value = query;
  if (selected !== '全部') { const input = make('input'); input.type='hidden'; input.name='category'; input.value=selected; document.querySelector('#listingSearch').append(input); }
  categories.forEach(category => {
    const link = make('a',category,selected===category ? 'active' : '');
    const filters = new URLSearchParams();
    if(category!=='全部') filters.set('category',category);
    if(query) filters.set('q',query);
    link.href = 'news.html' + (filters.size ? '?' + filters.toString() : '');
    if(category===selected) link.setAttribute('aria-current','page');
    document.querySelector('#categoryTabs').append(link);
  });
  const matches = content.filter(a => {
    const text = normalize([a.title,a.category,a.source,...a.paragraphs,...(a.sections||[]).map(s=>s.title+' '+s.text),...(a.faq||[]).map(s=>s.q+' '+s.a)].join(' '));
    return (selected==='全部'||a.category===selected) && terms.every(t=>text.includes(t));
  }).sort((a,b)=>b.date.localeCompare(a.date));
  document.querySelector('#listingSummary').textContent = (requested!==selected ? '未找到该栏目，已显示全部。' : '') + (query ? `“${query}” · ` : '') + selected + ` · 共 ${matches.length} 条内容`;
  document.title = (query ? `搜索：${query}` : selected==='全部' ? '新闻中心' : selected) + ' · 北京奶蛙大学';
  matches.forEach(a => {
    const row = make('a',undefined,'listingItem'); row.href=articleLink(a.id);
    if(a.image) { const img=make('img'); img.src='assets/'+a.image; img.alt=''; img.loading='lazy'; img.width=120; img.height=80; row.append(img); }
    else row.append(make('div',a.date.slice(5).replace('-',' / '),'listingDate'));
    const text=make('div'); text.append(make('h2',a.title),make('p',a.date+'　'+a.source+'　·　'+a.category),make('p',a.paragraphs[0],'listingExcerpt'));
    row.append(text,make('span','→')); listing.append(row);
  });
  if(!matches.length) {
    const empty=make('div',undefined,'emptyState');
    empty.append(make('h2','这段信号还没有匹配到内容'),make('p','试试“早八”“通信”或“食堂”，也可以清除筛选，继续逛逛校园。'));
    const all=make('a','查看全部校园内容 →'); all.href='news.html'; empty.append(all); listing.append(empty);
  }
}

const articleTitle = document.querySelector('#articleTitle');
if(articleTitle) {
  const article=content.find(a=>a.id===params.get('id'));
  const body=document.querySelector('#articleBody');
  if(article) {
    document.title=article.title+' · 北京奶蛙大学';
    document.querySelector('meta[name=description]').content=article.paragraphs[0];
    articleTitle.textContent=article.title;
    document.querySelector('#articleCategory').textContent=article.category;
    document.querySelector('#innerSection').textContent=article.category;
    const categoryLink=make('a',article.category); categoryLink.href='news.html?category='+encodeURIComponent(article.category);
    document.querySelector('#breadcrumbCategory').append(' / ',categoryLink);
    document.querySelector('#articleMeta').textContent='发布时间：'+article.date+'　　来源：'+article.source+'　　虚构校园栏目';
    article.paragraphs.forEach(p=>body.append(make('p',p)));
    if(article.image) {
      const figure=make('figure'),img=make('img');img.src='assets/'+article.image;img.alt='北京邮电大学校园影像，作为奶蛙校园故事配图';
      figure.append(img,make('figcaption','校园影像引用：北京邮电大学公开素材'));body.insertBefore(figure,body.children[1]||null);
    }
    (article.sections||[]).forEach(s=>{const section=make('section',undefined,'articleSection');section.append(make('h2',s.title),make('p',s.text));body.append(section);});
    if(article.widget) renderWidget(article.widget,body);
    if(article.faq) {
      const faq=make('section',undefined,'articleFaq');faq.append(make('h2','你可能还想问'));
      article.faq.forEach(item=>{const details=make('details');details.append(make('summary',item.q),make('p',item.a));faq.append(details);});body.append(faq);
    }
    if(article.links) {
      const links=make('div',undefined,'sourceLinks');article.links.forEach(item=>{const link=make('a',item.label);link.href=item.href;links.append(link);});body.append(links);
    }
    const related=document.querySelector('#relatedReading');
    const recommendations=(article.related||[]).map(id=>content.find(a=>a.id===id)).filter(Boolean);
    if(recommendations.length) { related.append(make('h2','沿着这条线，继续逛校园')); const links=make('div'); recommendations.forEach(a=>links.append(linkTo(a,a.title+' →')));related.append(links); }
    else related.hidden=true;
    const peers=content.filter(a=>a.category===article.category);
    const i=peers.indexOf(article);
    const pagination=document.querySelector('#articlePagination');
    if(peers.length>1) {
      [['同栏上一篇',peers[(i-1+peers.length)%peers.length]],['同栏下一篇',peers[(i+1)%peers.length]]].forEach(([label,a],index)=>{
        if(index===1&&peers.length===2) return;
        const link=linkTo(a,'');link.replaceChildren(make('small',label),make('span',a.title));pagination.append(link);
      });
    }
    const back=make('a','浏览'+article.category+'全部内容 →');back.href=categoryLink.href;pagination.append(back);
    let size=parseFloat(getComputedStyle(body).fontSize);
    const down=document.querySelector('#fontDown'),up=document.querySelector('#fontUp');
    function resize(delta) { size=Math.max(14,Math.min(22,size+delta));body.style.fontSize=size+'px';down.disabled=size<=14;up.disabled=size>=22; }
    down.onclick=()=>resize(-1);up.onclick=()=>resize(1);
    document.querySelector('#copyLink').onclick=async()=>{
      const status=document.querySelector('#copyStatus');
      const url=new URL(location.href);url.hash='';url.search='';url.searchParams.set('id',article.id);
      try { await navigator.clipboard.writeText(url.href);status.textContent='链接已复制，可以发给同频的朋友。'; }
      catch {
        status.textContent='自动复制不可用，请选中下面的链接复制。';
        let field=document.querySelector('#shareUrl');
        if(!field){field=make('input');field.id='shareUrl';field.readOnly=true;field.setAttribute('aria-label','文章分享链接');document.querySelector('.readingTools').after(field);}
        field.value=url.href;field.focus();field.select();
      }
    };
  } else {
    document.title='内容未找到 · 北京奶蛙大学';articleTitle.textContent='这条信号暂未接通';
    body.append(make('p','文章链接可能有误。返回新闻中心，换一条路线继续探索。'));
    const back=make('a','返回新闻中心 →','storyLink');back.href='news.html';body.append(back);
    document.querySelector('.readingTools').hidden=true;document.querySelector('.articleEnd').hidden=true;document.querySelector('#relatedReading').hidden=true;
  }
}

function renderWidget(kind,body) {
  const panel=make('section',undefined,'campusWidget');
  const status=make('p',undefined,'widgetStatus');status.setAttribute('role','status');status.setAttribute('aria-atomic','true');
  if(kind==='protocol') {
    panel.append(make('h2','呱声实验台 · 一条消息怎样送到'));
    const label=make('label','选择链路状况');label.htmlFor='packetScenario';
    const scenario=make('select');scenario.id='packetScenario';
    [['normal','正常送达'],['message','消息丢失一次'],['ack','ACK 丢失一次']].forEach(([value,text])=>{const option=make('option',text);option.value=value;scenario.append(option);});
    const path=make('div',undefined,'packetPath');
    const sender=make('span','小蛙 A'),receiver=make('span','小蛙 B');
    sender.append(make('small','发送端'));receiver.append(make('small','接收端'));
    path.append(sender,make('span','呱 → ACK ←','packetSignal'),receiver);
    const actions=make('div',undefined,'widgetActions'),send=make('button','发送“晚上食堂见”'),retry=make('button','超时后重传'),reset=make('button','重置实验');
    retry.disabled=true;actions.append(send,retry,reset);
    const log=make('ol',undefined,'packetLog');log.setAttribute('aria-label','通信实验记录');
    let received=false;
    function resetExperiment(){received=false;log.replaceChildren();send.disabled=false;retry.disabled=true;scenario.disabled=false;status.textContent='就绪：发送序号 01 的消息，观察是否收到确认。';}
    function record(text){log.append(make('li',text));}
    send.onclick=()=>{
      send.disabled=true;scenario.disabled=true;
      record('A 发出序号 01：“晚上食堂见”。');
      if(scenario.value==='message'){record('消息在途中丢失，B 没有收到。');status.textContent='A 未收到 ACK：模拟等待超时后，请点击重传。';retry.disabled=false;}
      else {
        received=true;record('B 收到序号 01，记录一次晚饭约定，并回复 ACK 01。');
        if(scenario.value==='ack'){record('ACK 在返回途中丢失，A 无法确认是否送达。');status.textContent='B 已收到，A 还不知道。模拟超时后，重传同一序号试试。';retry.disabled=false;}
        else {record('A 收到 ACK 01，本次传输完成。');status.textContent='通信完成：1 条消息、1 次接收。晚饭约定已确认。';}
      }
      animate(path,[{opacity:.5},{opacity:1}],{duration:350});
    };
    retry.onclick=()=>{
      record('A 超时后重发序号 01。本次演示的重传链路正常。');
      record(received?'B 识别到重复序号，不重复记录晚饭约定，只补发 ACK 01。':'B 首次收到序号 01，记录晚饭约定，并回复 ACK 01。');
      received=true;record('A 收到 ACK 01，本次传输完成。');retry.disabled=true;
      status.textContent='重传成功：发送 2 次，内容只记录 1 次。序号让接收端能识别重复消息。';
    };
    reset.onclick=resetExperiment;
    panel.append(label,scenario,path,actions,status,log);resetExperiment();
  }
  if(kind==='canteen') {
    panel.append(make('h2','今日食堂灵感'));
    const label=make('label','今天想吃哪一类？');label.htmlFor='mealType';
    const select=make('select');select.id='mealType';
    [['all','随缘都可以'],['rice','米饭派'],['noodle','面食派']].forEach(([value,text])=>{const o=make('option',text);o.value=value;select.append(o);});
    const meals={rice:['番茄炒蛋饭 + 一份时蔬｜给早八之后的自己一点热乎劲。','香菇鸡肉饭 + 紫菜汤｜今日任务：好好吃饭，暂不编译。','豆腐菌菇饭 + 清炒青菜｜吃完再看报错，它不会自己跑掉。'],noodle:['番茄鸡蛋面｜汤面可以热，脑袋先别过热。','香菇青菜面｜让午饭先返回一个温暖的结果。','一碗水饺 + 一份小菜｜纠结结束，快乐出栈。']};
    let previous='';
    const button=make('button','奶蛙，帮我选一个');
    button.onclick=()=>{const pool=(select.value==='all'?[...meals.rice,...meals.noodle]:meals[select.value]).filter(v=>v!==previous);previous=pool[Math.floor(Math.random()*pool.length)];status.textContent=previous;button.textContent='再换一个灵感';animate(status,[{opacity:.3,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}]);};
    status.textContent='先选一个范围，让午饭从“待定”变成“已决定”。';
    const actions=make('div',undefined,'widgetActions');actions.append(button);panel.append(label,select,actions,status,make('small','虚构菜单灵感；请按自己的口味、饮食需求和实际供应选择。'));
  }
  if(kind==='checklist') {
    panel.append(make('h2','奶蛙第一周 · 自助清单'));
    const tasks=['核对自己的真实课表，标好教室','读一篇感兴趣的学院或课程导读','和室友商量作息与公共空间约定','给吃饭、散步和休息留出时间'];
    const key='naiwa-firstweek-v1';let saved=[],stored=true;
    try {const parsed=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(parsed))saved=parsed.filter(i=>Number.isInteger(i)&&i>=0&&i<tasks.length);} catch {stored=false;}
    const group=make('div',undefined,'campusChecklist');
    tasks.forEach((task,i)=>{const label=make('label'),box=make('input');box.type='checkbox';box.checked=saved.includes(i);label.append(box,make('span',task));group.append(label);});
    const boxes=[...group.querySelectorAll('input')];
    function update(persist=false){
      const done=boxes.flatMap((b,i)=>b.checked?[i]:[]);
      if(persist)try{localStorage.setItem(key,JSON.stringify(done));stored=true;}catch{stored=false;}
      status.textContent=`已完成 ${done.length} / ${tasks.length} 项。`+(done.length===tasks.length?'开学连接成功，记得按自己的节奏继续。':'不用一次做完，每一步都算数。')+(stored?' 进度仅保存在当前浏览器。':' 当前浏览器无法保存，进度仅在本页有效。');
    }
    boxes.forEach(b=>b.addEventListener('change',()=>update(true)));
    const reset=make('button','清空我的勾选');reset.onclick=()=>{boxes.forEach(b=>b.checked=false);update(true);};
    const actions=make('div',undefined,'widgetActions');actions.append(reset);panel.append(group,status,actions);update();
  }
  body.append(panel);
}

const lightbox=document.querySelector('#lightbox');
if(lightbox) {
  const photos=[...document.querySelectorAll('.galleryZoom')];let current=0,opener;
  function showPhoto(n){
    current=(n+photos.length)%photos.length;const photo=photos[current];
    const img=lightbox.querySelector('img');img.src=photo.dataset.image;img.alt=photo.dataset.caption;
    document.querySelector('#photoCaption').textContent=photo.dataset.caption;
    document.querySelector('#photoCount').textContent=(current+1)+' / '+photos.length;
    animate(img,[{opacity:.4},{opacity:1}],{duration:250});
  }
  photos.forEach((button,i)=>button.onclick=()=>{opener=button;showPhoto(i);lightbox.showModal();document.body.classList.add('lightboxOpen');document.querySelector('#closePhoto').focus();});
  document.querySelector('#closePhoto').onclick=()=>lightbox.close();
  document.querySelector('#prevPhoto').onclick=()=>showPhoto(current-1);
  document.querySelector('#nextPhoto').onclick=()=>showPhoto(current+1);
  lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();showPhoto(current+(e.key==='ArrowRight'?1:-1));}});
  lightbox.addEventListener('close',()=>{document.body.classList.remove('lightboxOpen');opener?.focus();});
  lightbox.addEventListener('click',e=>{if(e.target!==lightbox)return;const r=lightbox.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)lightbox.close();});
  swipe(lightbox.querySelector('img'),direction=>showPhoto(current+direction));
}

// Animate once on entry without making content dependent on animation or JS.
if(!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    animate(entry.target,[{opacity:.55,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:550});
    observer.unobserve(entry.target);
  }),{threshold:.12});
  document.querySelectorAll('.portalCard,.researchFeature,.researchSide>a,.schoolLinks>a,.cultureLarge,.cultureSmall,.galleryGrid figure,.articleSection').forEach(el=>observer.observe(el));
}
