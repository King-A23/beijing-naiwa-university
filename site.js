(() => {
  'use strict';
  const home = document.body.dataset.page === 'home';
  const to = id => (home ? '' : 'index.html') + '#' + id;
  document.querySelector('#siteHeader')?.insertAdjacentHTML('afterbegin', `
    <a class="skipLink" href="#main">跳到主要内容</a>
    <header class="siteHeader"><div class="utilityBar"><div class="wrap"><span>非官方创意校园 · 灵感不限带宽</span><a class="officialJump" href="https://www.bupt.edu.cn/" target="_blank" rel="noopener noreferrer">跳转到真正的奶蛙大学 <span aria-hidden="true">↗</span><small>北邮官网</small></a></div></div>
    <div class="navBar wrap"><a class="brand" href="index.html" aria-label="北京奶蛙大学首页"><img src="assets/frog.svg" width="44" height="44" alt=""><span><strong>北京奶蛙大学</strong><small>BEIJING NAIWA UNIVERSITY</small></span></a>
    <nav id="mainNav" aria-label="主导航"><a href="${to('news')}">奶蛙情报</a><a href="${to('schools')}">院系与课堂</a><a href="${to('lab')}">呱声实验室</a><a href="${to('life')}">校园生活</a><a href="article.html?id=freshman">新生入口 ↗</a></nav><div class="navTools"><button id="searchToggle" class="iconButton" aria-label="打开站内搜索" aria-haspopup="dialog"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button><button id="menuToggle" class="iconButton" aria-label="展开导航" aria-expanded="false" aria-controls="mainNav"><span></span><span></span></button></div></div></header>
    <dialog id="searchDialog" aria-labelledby="searchTitle"><div class="searchDialogTop"><span class="eyebrow">FIND YOUR FREQUENCY</span><button class="iconButton" id="closeSearch" aria-label="关闭搜索">×</button></div><h2 id="searchTitle">你想找点什么？</h2><form id="globalSearchForm"><label class="srOnly" for="globalSearchInput">搜索校园内容</label><input id="globalSearchInput" type="search" placeholder="试试：早八、通信、食堂…" autocomplete="off"><button class="button primary" type="submit">搜索 →</button></form><p class="searchHint">搜索文章、院系、课程与生活指南</p><div id="globalSearchResults" aria-live="polite"></div><a class="textLink" href="news.html">浏览所有奶蛙情报 ↗</a></dialog>`);
  document.querySelector('#siteFooter')?.insertAdjacentHTML('afterbegin', `
    <footer class="siteFooter"><div class="wrap footerGrid"><div><a class="brand" href="index.html"><img src="assets/frog.svg" width="44" height="44" alt=""><span><strong>北京奶蛙大学</strong><small>BEIJING NAIWA UNIVERSITY</small></span></a><p>让每一份热爱，都有回响。<br>STAY CURIOUS. KEEP CROAKING.</p></div><div class="footerLinks"><a href="article.html?id=about">认识奶蛙</a><a href="article.html?id=guide">校园服务指南</a><a href="gallery.html">校园相册</a><a href="article.html?id=exchange">跨院串门</a><a href="article.html?id=credits">素材与网站说明</a><a href="https://www.bupt.edu.cn/" target="_blank" rel="noopener noreferrer">北京邮电大学官网 ↗</a></div><a class="backTop" href="#siteHeader" aria-label="返回页面顶部">↑</a></div><div class="wrap footerLegal"><span>© 2026 北京奶蛙大学 · 个人非官方创意作品</span><span>大学、院系及活动均属虚构，与北京邮电大学无隶属关系。</span></div></footer>`);
  document.querySelector('.backTop')?.addEventListener('click', e => {e.preventDefault(); window.scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'}); document.querySelector('.brand')?.focus({preventScroll:true});});
  const menu = document.querySelector('#menuToggle'), nav = document.querySelector('#mainNav');
  const closeMenu = () => {nav?.classList.remove('open'); menu?.setAttribute('aria-expanded','false'); menu?.setAttribute('aria-label','展开导航');};
  menu?.addEventListener('click', () => {const opened = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(opened)); menu.setAttribute('aria-label', opened ? '收起导航' : '展开导航');if(opened)nav.querySelector('a')?.focus();});
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {if (e.key === 'Escape' && nav?.classList.contains('open')) {closeMenu(); menu.focus();}});
  document.addEventListener('click', e => {if(!e.target.closest('.navBar')) closeMenu();});
  const dialog = document.querySelector('#searchDialog'), searchInput = document.querySelector('#globalSearchInput'), results = document.querySelector('#globalSearchResults');
  document.querySelector('#searchToggle')?.addEventListener('click', () => {closeMenu();dialog.showModal();searchInput.focus();});
  document.querySelector('#closeSearch')?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', e => {if (e.target === dialog) {const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog?.addEventListener('close', () => document.querySelector('#searchToggle')?.focus());
  const showResults = () => {
    results.replaceChildren(); const q = searchInput.value.trim().toLocaleLowerCase();
    if (!q) {const p=document.createElement('p');p.textContent='输入关键词，找到你的校园频段。';results.append(p);return;}
    const found = (window.NAIWA_CONTENT || []).filter(a => [a.title,a.category,a.deck,...a.paragraphs,...(a.sections||[]).flatMap(s=>[s.title,...s.paragraphs])].join(' ').toLocaleLowerCase().includes(q));
    const summary = document.createElement('p'); summary.textContent = found.length ? `找到 ${found.length} 条内容` : '这个频段暂时没信号。试试“通信”“宿舍”或“食堂”。'; results.append(summary);
    found.forEach(a => {const link=document.createElement('a');link.href='article.html?id='+encodeURIComponent(a.id);const cat=document.createElement('small');cat.textContent=a.category;const title=document.createElement('span');title.textContent=a.title;link.append(cat,title);results.append(link);});
  };
  document.querySelector('#globalSearchForm')?.addEventListener('submit', e => {e.preventDefault();showResults();});
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const applyMotion = () => document.documentElement.classList.toggle('reducedMotion', reduced.matches);
  applyMotion();reduced.addEventListener('change', applyMotion);
  document.addEventListener('visibilitychange', () => document.documentElement.classList.toggle('pageHidden', document.hidden));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(e => {e.target.classList.toggle('inViewport', e.isIntersecting);if(e.isIntersecting){e.target.classList.add('revealed');}}), {threshold:.08});
    document.querySelectorAll('.sectionHead,.schoolCard,.heroVisual,.lifeGrid,.plannerCard,.labGrid').forEach(el => observer.observe(el));
  }
})();
