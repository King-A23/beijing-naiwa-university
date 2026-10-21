'use strict';
const content = window.NAIWA_CONTENT || [];
const params = new URLSearchParams(location.search);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const categoryLabel = name => (window.NAIWA_CATEGORY_LABELS || {})[name] || name;
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
    const section = target==='top'?'home':['about','schools','exchange'].includes(target)?'about':'news';
    const active = a.dataset.portalNav ? (isHome ? a.dataset.portalNav===section : a.dataset.portalNav===(article?.category==='奶蛙概况'||article?.category==='院系介绍'?'about':'news')) : !!target && (a.hash === '#' + target || (target === 'admissions' && a.href.includes('id=admissions')));
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
  if (!q) { e.preventDefault(); document.querySelector('#searchResult').textContent = '先留一个关键词，试试“入塘”“蛙声101”或“荷叶食堂”。'; }
});

// A calm, user-controllable carousel; no timers run offscreen or in the background.
const slides = [
  ['hero-naiwa.jpg','BEIJING NAIWA UNIVERSITY · 2026','传蛙万里　与梦想同频','新蛙按时入塘，搭子记得回呱。','article.html?id=firstweek','领取入塘手册','校门前背着书包、侧身回眸的奶蛙'],
  ['avenue.jpg','LIFE IN THE POND · 3D校园','荷风起时　奶蛙出没','从南门走过湖桥，亲自看看这片校园。','campus.html#explore','开启3D巡塘','校园林荫道'],
  ['campus.jpg','FOUR SCHOOLS · 四院合呱','一声呱起　四院同频','从“荷叶食堂见”，到同频搭子的一个 ACK。','campus.html#course/signal/encoding','翻开通信讲义','校园钟塔']
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
    hero.classList.toggle('naiwaScene', current === 0);
    hero.querySelector('.photoCredit').textContent = current === 0 ? '校园底图：北京邮电大学 · 奶蛙插图' : '校园影像引用：北京邮电大学';
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
  if (more) { more.href = 'news.html?category=' + encodeURIComponent(tab.dataset.category || tab.textContent); more.setAttribute('aria-label', '更多' + tab.textContent); }
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
  const selected = categories.find(c => c === requested || categoryLabel(c) === requested) || '全部';
  const unknownCategory = !categories.some(c => c === requested || categoryLabel(c) === requested);
  const query = (params.get('q') || '').trim().slice(0,100);
  const normalize = s => s.normalize('NFKC').toLocaleLowerCase();
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  document.querySelector('#listingQuery').value = query;
  document.querySelector('#searchInput').value = query;
  if (selected !== '全部') { const input = make('input'); input.type='hidden'; input.name='category'; input.value=selected; document.querySelector('#listingSearch').append(input); }
  categories.forEach(category => {
    const link = make('a',categoryLabel(category),selected===category ? 'active' : '');
    const filters = new URLSearchParams();
    if(category!=='全部') filters.set('category',category);
    if(query) filters.set('q',query);
    link.href = 'news.html' + (filters.size ? '?' + filters.toString() : '');
    if(category===selected) link.setAttribute('aria-current','page');
    document.querySelector('#categoryTabs').append(link);
  });
  const matches = content.filter(a => {
    const text = normalize([a.title,a.category,categoryLabel(a.category),a.source,...a.paragraphs,...(a.sections||[]).map(s=>s.title+' '+s.text),...(a.faq||[]).map(s=>s.q+' '+s.a)].join(' '));
    return (selected==='全部'||a.category===selected) && terms.every(t=>text.includes(t));
  }).sort((a,b)=>b.date.localeCompare(a.date));
  document.querySelector('#listingSummary').textContent = (unknownCategory ? '这条塘路暂未开通，先带你看看全塘。' : '') + (query ? `“${query}” · ` : '') + categoryLabel(selected) + ` · 共 ${matches.length} 条内容`;
  document.title = (query ? `搜索：${query}` : selected==='全部' ? '奶蛙通讯社' : categoryLabel(selected)) + ' · 北京奶蛙大学';
  matches.forEach(a => {
    const row = make('a',undefined,'listingItem'); row.href=articleLink(a.id);
    if(a.image) { const img=make('img'); img.src='assets/'+a.image; img.alt=''; img.loading='lazy'; img.width=120; img.height=80; row.append(img); }
    else row.append(make('div',a.date.slice(5).replace('-',' / '),'listingDate'));
    const text=make('div'); text.append(make('h2',a.title),make('p',a.date+'　'+a.source+'　·　'+categoryLabel(a.category)),make('p',a.paragraphs[0],'listingExcerpt'));
    row.append(text,make('span','→')); listing.append(row);
  });
  if(!matches.length) {
    const empty=make('div',undefined,'emptyState');
    empty.append(make('h2','这声呱，还没找到同频消息'),make('p','试试“入塘”“蛙声101”或“荷叶食堂”。也可以清除筛选，换片荷叶继续逛。'));
    const all=make('a','返回全塘内容 →'); all.href='news.html'; empty.append(all); listing.append(empty);
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
    document.querySelector('#articleCategory').textContent=categoryLabel(article.category);
    document.querySelector('#innerSection').textContent=categoryLabel(article.category);
    const categoryLink=make('a',categoryLabel(article.category)); categoryLink.href='news.html?category='+encodeURIComponent(article.category);
    document.querySelector('#breadcrumbCategory').append(' / ',categoryLink);
    document.querySelector('#articleMeta').textContent='发布时间：'+article.date+'　　来源：'+article.source;
    article.paragraphs.forEach(p=>body.append(make('p',p)));
    if(article.image) {
      const figure=make('figure',undefined,article.imageFit==='contain'?'documentFigure':''),img=make('img');img.src='assets/'+article.image;img.alt=article.imageAlt||'北京邮电大学校园影像';
      img.decoding='async';
      figure.append(img,make('figcaption',article.imageCaption||'校园影像引用：北京邮电大学公开素材'));body.insertBefore(figure,body.children[1]||null);
    }
    (article.sections||[]).forEach(s=>{const section=make('section',undefined,'articleSection');section.append(make('h2',s.title),make('p',s.text));body.append(section);});
    (article.illustrations||[]).forEach(item=>{
      const figure=make('figure',undefined,'documentFigure'+(item.portrait?' portraitFigure':''));
      const img=make('img');img.src='assets/'+item.src;img.alt=item.alt;img.loading='lazy';img.decoding='async';
      const caption=make('figcaption',item.caption);
      if(item.download){const download=make('a','保存奶蛙证件照 ↓','storyLink');download.href=img.getAttribute('src');download.download=item.download;caption.append(make('br'),download);}
      figure.append(img,caption);body.append(figure);
    });
    if(article.widget) renderWidget(article.widget,body);
    if(article.faq) {
      const faq=make('section',undefined,'articleFaq');faq.append(make('h2','新蛙常问'));
      article.faq.forEach(item=>{const details=make('details');details.append(make('summary',item.q),make('p',item.a));faq.append(details);});body.append(faq);
    }
    if(article.links) {
      const links=make('div',undefined,'sourceLinks');article.links.forEach(item=>{const link=make('a',item.label);link.href=item.href;if(item.download)link.download=item.download;links.append(link);});body.append(links);
    }
    const related=document.querySelector('#relatedReading');
    const recommendations=(article.related||[]).map(id=>content.find(a=>a.id===id)).filter(Boolean);
    if(recommendations.length) { related.append(make('h2','顺着这声呱，去下一站')); const links=make('div'); recommendations.forEach(a=>links.append(linkTo(a,a.title+' →')));related.append(links); }
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
    const back=make('a','继续逛'+categoryLabel(article.category)+' →');back.href=categoryLink.href;pagination.append(back);
    let size=parseFloat(getComputedStyle(body).fontSize);
    const down=document.querySelector('#fontDown'),up=document.querySelector('#fontUp');
    function resize(delta) { size=Math.max(14,Math.min(22,size+delta));body.style.fontSize=size+'px';down.disabled=size<=14;up.disabled=size>=22; }
    down.onclick=()=>resize(-1);up.onclick=()=>resize(1);
    document.querySelector('#copyLink').onclick=async()=>{
      const status=document.querySelector('#copyStatus');
      const url=new URL(location.href);url.hash='';url.search='';url.searchParams.set('id',article.id);
      try { await navigator.clipboard.writeText(url.href);status.textContent='链接已复制，转给同频搭子，记得等一声“收到，呱”。'; }
      catch {
        status.textContent='自动复制不可用，请选中下面的链接复制。';
        let field=document.querySelector('#shareUrl');
        if(!field){field=make('input');field.id='shareUrl';field.readOnly=true;field.setAttribute('aria-label','文章分享链接');document.querySelector('.readingTools').after(field);}
        field.value=url.href;field.focus();field.select();
      }
    };
  } else {
    document.title='内容未找到 · 北京奶蛙大学';articleTitle.textContent='这页奶蛙档案暂未找到';
    body.append(make('p','这只呱包可能走错了地址。返回奶蛙通讯社，换片荷叶继续逛。'));
    const back=make('a','返回奶蛙通讯社 →','storyLink');back.href='news.html';body.append(back);
    document.querySelector('.readingTools').hidden=true;document.querySelector('.articleEnd').hidden=true;document.querySelector('#relatedReading').hidden=true;
  }
}

function renderWidget(kind,body) {
  const panel=make('section',undefined,'campusWidget');
  const status=make('p',undefined,'widgetStatus');status.setAttribute('role','status');status.setAttribute('aria-atomic','true');
  if(kind==='protocol') {
    panel.append(make('h2','蛙声201 · 呱包接力实验台'));
    const label=make('label','给这次呱包选择链路状况');label.htmlFor='packetScenario';
    const scenario=make('select');scenario.id='packetScenario';
    [['normal','正常送达'],['message','呱包丢失一次'],['ack','ACK 丢失一次']].forEach(([value,text])=>{const option=make('option',text);option.value=value;scenario.append(option);});
    const path=make('div',undefined,'packetPath');
    const sender=make('span','奶蛙 A'),receiver=make('span','奶蛙 B');
    sender.append(make('small','发送端'));receiver.append(make('small','接收端'));
    path.append(sender,make('span','呱 → ACK ←','packetSignal'),receiver);
    const actions=make('div',undefined,'widgetActions'),send=make('button','发送“荷叶食堂见”'),retry=make('button','超时后重传'),reset=make('button','重置实验');
    retry.disabled=true;actions.append(send,retry,reset);
    const log=make('ol',undefined,'packetLog');log.setAttribute('aria-label','通信实验记录');
    let received=false;
    function resetExperiment(){received=false;log.replaceChildren();send.disabled=false;retry.disabled=true;scenario.disabled=false;status.textContent='奶蛙 A 已就位：发出第 01 号呱包，等搭子回一个 ACK。';}
    function record(text){log.append(make('li',text));}
    send.onclick=()=>{
      send.disabled=true;scenario.disabled=true;
      record('A 发出序号 01：“荷叶食堂见”。');
      if(scenario.value==='message'){record('呱包在途中丢失，奶蛙 B 还不知道要去荷叶食堂。');status.textContent='奶蛙 A 没等到 ACK：模拟超时后，给这声呱一次重传。';retry.disabled=false;}
      else {
        received=true;record('B 收到序号 01，记录一次晚饭约定，并回复 ACK 01。');
        if(scenario.value==='ack'){record('ACK 在返回途中丢失，A 无法确认是否送达。');status.textContent='B 已收呱，A 还不知。模拟超时后，重传同一个序号试试。';retry.disabled=false;}
        else {record('A 收到 ACK 01，本次传输完成。');status.textContent='收到，呱！1 条消息、1 次接收。荷叶食堂的晚饭约定已确认。';}
      }
      animate(path,[{opacity:.5},{opacity:1}],{duration:350});
    };
    retry.onclick=()=>{
      record('A 超时后重发序号 01。本次演示的重传链路正常。');
      record(received?'B 识别到重复序号，不重复记录晚饭约定，只补发 ACK 01。':'B 首次收到序号 01，记录晚饭约定，并回复 ACK 01。');
      received=true;record('A 收到 ACK 01，本次传输完成。');retry.disabled=true;
      status.textContent='重传成功，呱包抵达！发送 2 次，约定只记录 1 次：重传不等于约两顿晚饭。';
    };
    reset.onclick=resetExperiment;
    panel.append(label,scenario,path,actions,status,log);resetExperiment();
  }
  if(kind==='canteen') {
    panel.append(make('h2','荷叶食堂 · 今日奶蛙补给'));
    const label=make('label','这只奶蛙今天想吃什么？');label.htmlFor='mealType';
    const select=make('select');select.id='mealType';
    [['all','随缘奶蛙'],['rice','米饭奶蛙'],['noodle','面食奶蛙']].forEach(([value,text])=>{const o=make('option',text);o.value=value;select.append(o);});
    const meals={rice:['入塘番茄蛋饭 + 时蔬｜早八已经接入，午饭也该有回音。','同频香菇鸡饭 + 紫菜汤｜搭子到齐，先开饭，代码稍后再编译。','青荷豆腐菌菇饭 + 青菜｜给调试了一上午的奶蛙，补一顿热乎饭。'],noodle:['早八续航番茄蛋面｜面要趁热吃，奶蛙先缓一缓。','静音香菇青菜面｜书房里没呱完的问题，吃饱再想。','ACK 水饺 + 小菜｜点单已确认，奶蛙快乐出栈。']};
    let previous='';
    const button=make('button','给本蛙配一餐');
    button.onclick=()=>{const pool=(select.value==='all'?[...meals.rice,...meals.noodle]:meals[select.value]).filter(v=>v!==previous);previous=pool[Math.floor(Math.random()*pool.length)];status.textContent=previous;button.textContent='换一份奶蛙补给';animate(status,[{opacity:.3,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}]);};
    status.textContent='全塘开饭信号已发出。先选米饭或面食，本蛙今天不再纠结。';
    const actions=make('div',undefined,'widgetActions');actions.append(button);panel.append(label,select,actions,status,make('small','奶蛙补给口诀：口味合适，按时开饭，吃饱再与难题同频。'));
  }
  if(kind==='checklist') {
    panel.append(make('h2','新蛙入塘 · 四条基础链路'));
    const tasks=['认塘：核对自己的课表与教室','试课：读一篇四院导读，选个想学的问题','同频：和室友约好作息、声音与公共空间','补给：给吃饭、散步和睡觉留出时间'];
    const key='naiwa-firstweek-v1';let saved=[],stored=true;
    try {const parsed=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(parsed))saved=parsed.filter(i=>Number.isInteger(i)&&i>=0&&i<tasks.length);} catch {stored=false;}
    const group=make('div',undefined,'campusChecklist');
    tasks.forEach((task,i)=>{const label=make('label'),box=make('input');box.type='checkbox';box.checked=saved.includes(i);label.append(box,make('span',task));group.append(label);});
    const boxes=[...group.querySelectorAll('input')];
    function update(persist=false){
      const done=boxes.flatMap((b,i)=>b.checked?[i]:[]);
      if(persist)try{localStorage.setItem(key,JSON.stringify(done));stored=true;}catch{stored=false;}
      status.textContent=`已完成 ${done.length} / ${tasks.length} 项。`+(done.length===tasks.length?'四条链路接通，欢迎新蛙入塘！按自己的节奏继续呱。':'不用一下跳完整个荷塘，完成一件也算数。')+(stored?' 进度仅保存在当前浏览器。':' 当前浏览器无法保存，进度仅在本页有效。');
    }
    boxes.forEach(b=>b.addEventListener('change',()=>update(true)));
    const reset=make('button','重新整理入塘清单');reset.onclick=()=>{boxes.forEach(b=>b.checked=false);update(true);};
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
