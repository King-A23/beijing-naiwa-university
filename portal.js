(() => {
'use strict';
const content = window.NAIWA_CONTENT || [];
const $ = selector => document.querySelector(selector);
const articleLink = id => 'article.html?id=' + encodeURIComponent(id);
function el(tag, text, cls) { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (cls) node.className = cls; return node; }
function safeHref(href) { if (typeof href !== 'string' || !href.trim()) return false; try { return ['https:', 'http:'].includes(new URL(href, location.href).protocol); } catch { return false; } }
function link(text, href, cls) { const a = el('a', text, cls); a.href = href; return a; }
function paragraphs(a) { return [...(a.paragraphs || []), ...(a.sections || []).flatMap(section => section.paragraphs || [])]; }
function dateText(date) { return (date || '').replaceAll('-', '.'); }
function summary(a) { return a.deck || a.paragraphs?.[0] || ''; }
function image(a, cls) { const img = el('img', undefined, cls); img.src = 'assets/' + a.image.replace(/^(hero|avenue|campus|garden|campus2)\.jpg$/, '$1.webp'); img.alt = a.imageAlt || a.title + '配图'; img.loading = 'lazy'; return img; }
const params = new URLSearchParams(location.search);
if ($('#articleTitle')) {
 const a = content.find(item => item.id === params.get('id'));
 if (!a) {
  document.title = '来信未找到 · 北京奶蛙大学'; $('#articleTitle').textContent = '这封来信，暂未送达。'; $('#articleCategory').textContent = '404 / SIGNAL NOT FOUND'; $('#articleDeck').textContent = '链接中的文章编号不存在。你可以回到校园来信，重新选择一个频段。'; $('#articleBody').append(link('返回校园来信 →', 'news.html', 'button')); $('.readingTools').hidden = true; $('.articleEnd').hidden = true; $('.articleAside').hidden = true;
 } else {
  document.title = a.title + ' · 北京奶蛙大学'; $('#articleTitle').textContent = a.title; $('#articleCategory').textContent = a.category + ' / NAIWA LETTERS'; $('#breadcrumbCategory').textContent = '/ ' + a.category; $('#articleDeck').textContent = a.deck || ''; const minutes = Math.max(1, Math.ceil(paragraphs(a).join('').length / 350));
  $('#articleMeta').textContent = dateText(a.date) + '　·　' + a.source + '　·　约 ' + minutes + ' 分钟';
  const body = $('#articleBody');
  if (a.image) { const figure = el('figure', undefined, 'articleImage'); figure.append(image(a), el('figcaption', a.imageCaption || '校园影像 · 北京邮电大学公开素材')); body.append(figure); }
  if (a.eventDate || a.eventTime || a.venue) { const box = el('dl', undefined, 'eventDetails'); for (const [label, value] of [['活动日期', a.eventDate], ['活动时间', a.eventTime], ['场景地点', a.venue]]) if (value) box.append(el('dt', label), el('dd', value)); body.append(box); }
  (a.paragraphs || []).forEach(text => body.append(el('p', text)));
  (a.sections || []).forEach(section => { const node = el('section'); node.append(el('h2', section.title)); (section.paragraphs || []).forEach(text => node.append(el('p', text))); body.append(node); });
  if (safeHref(a.action?.href) && a.action?.label) $('#articleAction').append(link(a.action.label + ' →', a.action.href, 'button'));
  const related = (a.related || []).map(id => content.find(item => item.id === id)).filter(Boolean);
  if (related.length < 3) content.filter(item => item.id !== a.id && item.category === a.category && !related.includes(item)).slice(0, 3 - related.length).forEach(item => related.push(item));
  related.slice(0, 4).forEach(item => { const anchor = link('', articleLink(item.id), 'relatedArticle'); anchor.append(el('small', item.category), el('strong', item.title), el('span', '阅读来信 ↗')); $('#relatedArticles').append(anchor); });
  const siblings = content.filter(item => item.category === a.category); const index = siblings.indexOf(a); for (const [label, item] of [['同栏目 · 上一封', siblings[index - 1]], ['同栏目 · 下一封', siblings[index + 1]]]) if (item) { const anchor = link('', articleLink(item.id)); anchor.append(el('small', label), el('strong', item.title), el('span', '→')); $('#articlePagination').append(anchor); }
  let fontSize = parseFloat(getComputedStyle(body).fontSize) || 18; function resize(amount) { fontSize = Math.max(16, Math.min(24, fontSize + amount)); body.style.fontSize = fontSize + 'px'; $('#fontDown').disabled = fontSize <= 16; $('#fontUp').disabled = fontSize >= 24; }
  $('#fontDown').addEventListener('click', () => resize(-1)); $('#fontUp').addEventListener('click', () => resize(1));
  $('#copyLink').addEventListener('click', async () => { try { if (!navigator.clipboard?.writeText) throw new Error('unavailable'); await navigator.clipboard.writeText(location.href); $('#copyStatus').textContent = '链接已复制，可以发给同频的朋友。'; } catch { let input = $('#copyFallback'); if (!input) { input = el('input'); input.id = 'copyFallback'; input.readOnly = true; input.setAttribute('aria-label', '文章链接，选中后可手动复制'); $('.readingTools').append(input); } input.value = location.href; input.focus(); input.select(); $('#copyStatus').textContent = '链接已选中，请手动复制。'; } });
  let scheduled = false; function progress() { const start = body.getBoundingClientRect().top + scrollY; const end = start + body.offsetHeight - innerHeight * .4; const percent = Math.max(0, Math.min(1, (scrollY + innerHeight * .5 - start) / Math.max(1, end - start))); $('#readingProgress').style.transform = 'scaleX(' + percent + ')'; scheduled = false; } addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(progress); } }, { passive: true }); addEventListener('resize', progress); progress();
 }
}
if ($('#newsListing')) {
 const categories = ['全部', ...new Set(content.map(item => item.category))];
 let category = categories.includes(params.get('category')) ? params.get('category') : '全部'; let query = params.get('q') || ''; $('#newsQuery').value = query;
 function updateURL(mode = 'push') { const state = new URLSearchParams(); if (category !== '全部') state.set('category', category); if (query) state.set('q', query); const next = 'news.html' + (state.size ? '?' + state.toString() : ''); if (next !== location.pathname.split('/').pop() + location.search) history[mode === 'replace' ? 'replaceState' : 'pushState'](null, '', next); }
 function render() {
  $('#categoryTabs').replaceChildren(); categories.forEach(name => { const state = new URLSearchParams(); if (name !== '全部') state.set('category', name); if (query) state.set('q', query); const a = link(name, 'news.html' + (state.size ? '?' + state : ''), name === category ? 'active' : ''); if (name === category) a.setAttribute('aria-current', 'page'); a.addEventListener('click', event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); category = name; updateURL(); render(); }); $('#categoryTabs').append(a); });
  const terms = query.toLocaleLowerCase().split(/\s+/).filter(Boolean); const matches = content.filter(a => (category === '全部' || a.category === category) && terms.every(term => [a.title, a.category, a.deck || '', ...(a.sections || []).map(section => section.title), ...paragraphs(a)].join(' ').toLocaleLowerCase().includes(term))).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  $('#listingSummary').textContent = (query ? '“' + query + '” · ' : '') + (category === '全部' ? '所有频段' : category) + ' · ' + matches.length + ' 封来信'; $('#newsListing').replaceChildren();
  matches.forEach((a, i) => { const row = link('', articleLink(a.id), 'listingItem'); const visual = el('div', undefined, 'listingVisual'); if (a.image) visual.append(image(a)); else visual.append(el('span', a.category), el('strong', String(i + 1).padStart(2, '0'))); const text = el('div', undefined, 'listingText'); text.append(el('small', dateText(a.date) + ' / ' + a.category), el('h2', a.title), el('p', summary(a)), el('span', a.source)); row.append(visual, text, el('span', '↗', 'listingArrow')); $('#newsListing').append(row); });
  if (!matches.length) { const empty = el('div', undefined, 'emptyResults'); empty.append(el('h2', '这个频段还没有回音。'), el('p', '换一个关键词，或清空筛选，看看校园里正在发生什么。')); const reset = el('button', '接收所有来信 →', 'button'); reset.addEventListener('click', clear); empty.append(reset); $('#newsListing').append(empty); }
 }
 function clear() { category = '全部'; query = ''; $('#newsQuery').value = ''; updateURL(); render(); $('#newsQuery').focus(); }
 $('#newsSearch').addEventListener('submit', event => { event.preventDefault(); query = $('#newsQuery').value.trim(); updateURL(); render(); }); $('#clearNews').addEventListener('click', clear); addEventListener('popstate', () => { const state = new URLSearchParams(location.search); category = categories.includes(state.get('category')) ? state.get('category') : '全部'; query = state.get('q') || ''; $('#newsQuery').value = query; render(); }); updateURL('replace'); render();
}
if ($('#galleryGrid')) {
 const scenes = [
 { image:'hero.webp', title:'校门 / 一切从连接开始', text:'刚入学时，行李箱像待发送的数据包。走进校门，先找到宿舍，再慢慢找到属于自己的方向。每一位陌生同学，都可能是未来帮你定位 bug 的队友。', id:'freshman', fallback:'launch', label:'打开新生接入指南' },
 { image:'campus.webp', title:'钟塔 / 校准自己的时钟', text:'上课铃是全校共用的同步信号，困意却各有各的时延。路过钟塔时抬一抬头：今天还有时间提一个问题，也有时间把午饭好好吃完。', id:'signal', fallback:'signal', label:'阅读信号与生活' },
 { image:'avenue.webp', title:'林荫 / 允许偶尔掉线', text:'从教室走回宿舍的这段路，不需要跑满带宽。和朋友聊一次没结论的天，踩过一片落叶，看看今天的天空，都算有效传输。', id:'dorm', fallback:'autumn', label:'接收宿舍生活来信' },
 { image:'garden.webp', title:'邮苑 / 留一点空白给自己', text:'图书馆外的风没有考试范围。把刚才没算出的那一道题暂存，坐一会儿，再带着新思路回去。休息不是丢包，是给下一次出发留缓存。', id:'library', fallback:'library', label:'领取阅读与自习指南' }
 ]; let current = 0; let opener; const box = $('#lightbox');
 scenes.forEach((scene, index) => { const figure = el('figure', undefined, 'galleryCard'); const button = el('button', undefined, 'galleryZoom'); button.setAttribute('aria-label', '放大照片：' + scene.title); button.setAttribute('aria-haspopup', 'dialog'); const img = el('img'); img.src = 'assets/' + scene.image; img.alt = scene.title; img.loading = 'lazy'; button.append(img, el('span', '0' + (index + 1) + '　放大 ↗', 'galleryOverlay')); button.addEventListener('click', () => { opener = button; show(index); box.showModal(); $('#closeLightbox').focus(); }); const caption = el('figcaption'); caption.append(el('h2', scene.title), el('p', scene.text)); figure.append(button, caption); $('#galleryGrid').append(figure); });
 function show(index) { current = (index + scenes.length) % scenes.length; const scene = scenes[current]; $('#lightboxImage').src = 'assets/' + scene.image; $('#lightboxImage').alt = scene.title; $('#lightboxTitle').textContent = scene.title; $('#lightboxDescription').textContent = scene.text; $('#lightboxCount').textContent = '0' + (current + 1) + ' / 04　校园漫游'; const id = content.some(a => a.id === scene.id) ? scene.id : scene.fallback; $('#lightboxArticle').href = articleLink(id); $('#lightboxArticle').textContent = scene.label + ' →'; }
 $('#closeLightbox').addEventListener('click', () => box.close()); $('#previousPhoto').addEventListener('click', () => show(current - 1)); $('#nextPhoto').addEventListener('click', () => show(current + 1)); box.addEventListener('keydown', event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1)); } }); box.addEventListener('close', () => { document.body.classList.remove('lightboxOpen'); opener?.focus(); }); box.addEventListener('click', event => { if (event.target === box) { const rect = box.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) box.close(); } }); const observer = new MutationObserver(() => document.body.classList.toggle('lightboxOpen', box.open)); observer.observe(box, { attributes: true, attributeFilter: ['open'] });
}
})();
