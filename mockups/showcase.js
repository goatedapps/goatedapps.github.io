const mode = document.body.dataset.design;
const isHomepage = document.body.dataset.root === 'true';
const designs = { gallery: 'Product gallery', workspace: 'App workspace', cinema: 'Screening room' };
const apps = APP_DATA.flatMap(group => group.apps.map(app => ({ ...app, category: group.category, key: app.id || app.url })));
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const safeURL = value => { try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : '#'; } catch { return '#'; } };
const screenshot = app => app.screenshot && !/^(?:[a-z]+:|\/\/)/i.test(app.screenshot) ? (isHomepage ? '' : '../') + app.screenshot : '';
const storageKey = 'yiwen-frequently-used-v1';
const themeKey = 'goatedapps-theme-v1';
const themes = { mineral: 'Mineral', coral: 'Coral', mulberry: 'Mulberry' };
let theme = 'mineral';
try { const savedTheme = localStorage.getItem(themeKey); if (Object.hasOwn(themes, savedTheme)) theme = savedTheme; } catch {}
if (mode === 'cinema') document.body.dataset.theme = theme;
let pins = new Set();
let storageAvailable = true;
try { const saved = JSON.parse(localStorage.getItem(storageKey) || '[]'); if (Array.isArray(saved)) pins = new Set(saved.filter(key => apps.some(app => app.key === key))); } catch { storageAvailable = false; }
let category = 'All apps';
let query = '';
let featured = apps.find(app => app.id === 'menu-planner') || apps[0];
let lastDetailTrigger;
const star = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/></svg>';
const external = '<span aria-hidden="true">↗</span>';
function pinButton(app, compact = false) {
  const selected = pins.has(app.key);
  return `<button class="pin ${selected ? 'selected' : ''} ${compact ? 'compact' : ''}" data-pin="${escape(app.key)}" aria-pressed="${selected}" aria-label="${selected ? 'Remove' : 'Add'} ${escape(app.name)} ${selected ? 'from' : 'to'} Frequently Used">${star}${compact ? '' : `<span>${selected ? 'Frequently used' : 'Use frequently'}</span>`}</button>`;
}
function image(app, eager = false) {
  return screenshot(app) ? `<img src="${escape(screenshot(app))}" alt="Screenshot of ${escape(app.name)}" loading="${eager ? 'eager' : 'lazy'}">` : '<div class="missing-image">Screenshot coming soon</div>';
}
function stack(app) { return (app.techStack?.length ? app.techStack : ['Tech stack to be added']).map(value => `<span>${escape(value)}</span>`).join(''); }
document.body.innerHTML = `
  <a class="skip" href="#catalogue">Skip to apps</a>
  <header class="topbar"><a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">y.</span>Yiwen<span class="brand-sub"> / GoatedApps</span></a>${mode === 'cinema' ? `<div class="theme-picker" role="group" aria-label="Color scheme"><span class="theme-label">Appearance</span>${Object.entries(themes).map(([key,label])=>`<button data-theme-choice="${key}" aria-pressed="${key===theme}"><span class="theme-swatch ${key}" aria-hidden="true"></span>${label}</button>`).join('')}</div>` : `<nav aria-label="Design concepts">${Object.entries(designs).map(([key, label]) => `<a href="${key}.html" ${key === mode ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`}<a class="compare" href="index.html">Compare designs</a></header>
  <div class="layout"><aside class="sidebar"><div><p class="sidebar-title">Your app collection</p><nav id="side-categories" aria-label="App categories"></nav></div><div class="sidebar-bottom"><span class="maker-dot"></span> Made by Yiwen<p>Small tools for everyday life.</p></div></aside>
  <main>
    <section class="favorites" aria-labelledby="favorites-title"><div class="section-top"><h2 id="favorites-title">${star} Frequently Used</h2><span id="save-note">Saved on this browser</span></div><div id="favorites-list"></div></section>
    <section class="hero" aria-label="Product showcase"></section><p id="feature-status" class="sr-only" role="status"></p>
    <section id="catalogue" class="catalogue" aria-labelledby="catalogue-title"><div class="catalogue-heading"><div><h2 id="catalogue-title">Explore the collection</h2><p>Tools to learn, play, plan and go places.</p></div><label class="search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input type="search" placeholder="Find an app…" aria-label="Search apps"><kbd>/</kbd></label></div><nav id="categories" aria-label="Filter apps by category"></nav><p id="result-count" class="sr-only" role="status"></p><div id="projects"></div></section>
    <footer><span>Yiwen / Independent app collection</span><span>Built around everyday possibilities.</span></footer>
  </main></div>
  <dialog id="details" aria-labelledby="detail-title"><button class="close" aria-label="Close project details">×</button><div id="detail-content"></div></dialog>
  <div class="toast" role="status" aria-live="polite"></div>`;

function renderFavorites() {
  const saved = apps.filter(app => pins.has(app.key));
  document.querySelector('#save-note').textContent = storageAvailable ? 'Saved on this browser' : 'Saved for this visit only';
  document.querySelector('#favorites-list').innerHTML = saved.length ? `<div class="favorite-items">${saved.map(app => `<div class="favorite"><a href="${safeURL(app.url)}" target="_blank" rel="noopener noreferrer"><span class="favorite-icon">${escape(app.name.slice(0,1))}</span><span>${escape(app.name)}</span>${external}</a>${pinButton(app,true)}</div>`).join('')}</div>` : `<p class="empty-favorites">${star} Keep your go-to apps here. Select the star on any project to add it.</p>`;
}
function renderHero() {
  const hero = document.querySelector('.hero');
  if (mode === 'workspace') {
    hero.innerHTML = `<div class="workspace-title"><div><p class="intro-label">A little more useful, every day.</p><h1>Your apps.<br>Your everyday toolkit.</h1></div><p>A collection of things I’ve built to make learning, planning and play a little easier.</p></div>`;
    return;
  }
  if (!featured) { hero.innerHTML = '<h1>Useful things,<br>thoughtfully made.</h1>'; return; }
  if (mode === 'gallery') {
    hero.innerHTML = `<div class="hero-copy"><p class="intro-label">Independent apps by Yiwen</p><h1>Useful things,<br>thoughtfully made.</h1><p>Small apps for real life. Explore a growing collection for learning, play and everything in between.</p><a class="primary" href="#catalogue">Explore the apps <span aria-hidden="true">↓</span></a><div class="hero-footnote">${apps.length} apps to explore <span>Four corners of everyday life</span></div></div><div class="hero-visual"><div class="window"><div class="window-bar"><span class="window-dots">● ● ●</span><span>${escape(new URL(featured.url).hostname)}</span>${external}</div><button class="preview-button" data-detail="${escape(featured.key)}" aria-label="View ${escape(featured.name)} details">${image(featured,true)}</button></div><div class="featured-caption"><div><small>In the collection</small><strong>${escape(featured.name)}</strong></div><button class="text-button" data-detail="${escape(featured.key)}">Take a closer look ${external}</button></div></div>`;
  } else {
    hero.innerHTML = `<div class="stage"><div class="stage-copy"><p class="intro-label">The app collection / ${escape(featured.category)}</p><h1>${escape(featured.name)}</h1><p>${escape(featured.description)}</p><div class="tags">${stack(featured)}</div><div class="stage-actions"><a class="primary" href="${safeURL(featured.url)}" target="_blank" rel="noopener noreferrer">Open app ${external}</a><button class="secondary" data-detail="${escape(featured.key)}">Behind the build</button></div></div><div class="stage-preview"><button class="stage-arrow previous" data-step="-1" aria-label="Previous app"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg></button><button class="stage-image" data-detail="${escape(featured.key)}" aria-label="View ${escape(featured.name)} details">${image(featured,true)}</button><button class="stage-arrow next" data-step="1" aria-label="Next app"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg></button><span class="stage-counter">${apps.indexOf(featured)+1} / ${apps.length}</span></div></div><div class="stage-bottom"><p>Made for real life.<br><span>Select a project to explore.</span></p><div class="stage-selector" aria-label="Featured project">${apps.map(app => `<button data-feature="${escape(app.key)}" aria-pressed="${app.key===featured.key}">${escape(app.name)}</button>`).join('')}</div></div>`;
  }
}
function renderCategories() {
  const categories = ['All apps', ...APP_DATA.map(group => group.category)];
  const markup = categories.map(value => `<button data-category="${escape(value)}" aria-pressed="${category === value}"><span>${escape(value)}</span><span class="count">${value==='All apps' ? apps.length : apps.filter(app=>app.category===value).length}</span></button>`).join('');
  document.querySelector('#categories').innerHTML = markup;
  document.querySelector('#side-categories').innerHTML = markup;
}
function card(app) {
  return `<article class="project"><div class="project-image"><button class="preview-button" data-detail="${escape(app.key)}" aria-label="View ${escape(app.name)} details">${image(app)}</button>${pinButton(app,true)}</div><div class="project-body"><div class="project-title"><h3><button data-detail="${escape(app.key)}">${escape(app.name)}</button></h3><span class="category-label">${escape(app.category)}</span></div><p class="description">${escape(app.description)}</p><div class="tags">${stack(app)}</div><div class="project-actions"><button class="text-button" data-detail="${escape(app.key)}">Project details <span aria-hidden="true">+</span></button><a href="${safeURL(app.url)}" target="_blank" rel="noopener noreferrer">Open app ${external}</a></div></div></article>`;
}
function renderProjects() {
  const filtered = apps.filter(app => (category === 'All apps' || app.category === category) && [app.name,app.description,app.category,...(app.techStack || [])].join(' ').toLowerCase().includes(query));
  document.querySelector('#result-count').textContent = `${filtered.length} apps found`;
  document.querySelector('#projects').innerHTML = filtered.length ? APP_DATA.filter(group=>filtered.some(app=>app.category===group.category)).map(group=>`<section class="project-group" aria-label="${escape(group.category)}"><div class="group-heading"><h2>${escape(group.category)}</h2><span>${filtered.filter(app=>app.category===group.category).length} apps</span></div><div class="project-grid">${filtered.filter(app=>app.category===group.category).map(card).join('')}</div></section>`).join('') : '<div class="no-results"><h3>No apps found</h3><p>Try another name or choose a different category.</p><button class="secondary" data-reset>Clear filters</button></div>';
}
function detail(app) {
  document.querySelector('#detail-content').innerHTML = `<div class="detail-image">${image(app,true)}</div><div class="detail-copy"><p class="intro-label">${escape(app.category)}</p><h2 id="detail-title">${escape(app.name)}</h2><p>${escape(app.description)}</p><h3>Tech stack</h3><div class="tags">${stack(app)}</div>${app.stackVerified === false ? '<p class="draft-note">Technology details to be confirmed.</p>' : ''}<h3>What I learnt ${app.learningDraft ? '<span class="draft-badge">Draft</span>' : ''}</h3><p class="learning">${escape(app.learning || 'Learning notes to be added.')}</p>${app.learningDraft ? '<p class="draft-note">Suggested copy for this mockup; to be reviewed by Yiwen.</p>' : ''}<div class="detail-actions"><a class="primary" href="${safeURL(app.url)}" target="_blank" rel="noopener noreferrer">Open app ${external}</a>${pinButton(app)}</div></div>`;
}
function announceFeature() {
  document.querySelector('#feature-status').textContent = `${featured.name}, app ${apps.indexOf(featured)+1} of ${apps.length}`;
}
function moveFeature(direction) {
  if (!apps.length) return;
  featured = apps[(apps.indexOf(featured)+direction+apps.length)%apps.length];
  renderHero();
  announceFeature();
  document.querySelector(`[data-step="${direction}"]`)?.focus({preventScroll:true});
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelector('.stage-image').animate([
      {opacity:.4,transform:`translateX(${direction*12}px)`},
      {opacity:1,transform:'translateX(0)'}
    ],{duration:230,easing:'ease-out'});
  }
}
let toastTimer;
document.addEventListener('click', event => {
  const themeButton = event.target.closest('[data-theme-choice]');
  if (themeButton) {
    theme = themeButton.dataset.themeChoice;
    document.body.dataset.theme = theme;
    document.querySelectorAll('[data-theme-choice]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.themeChoice===theme));
    try { localStorage.setItem(themeKey,theme); } catch {}
  }
  const step = event.target.closest('[data-step]');
  if (step) moveFeature(Number(step.dataset.step));
  const pin = event.target.closest('[data-pin]');
  if (pin) {
    const key = pin.dataset.pin;
    pins.has(key) ? pins.delete(key) : pins.add(key);
    try { localStorage.setItem(storageKey,JSON.stringify([...pins])); storageAvailable = true; } catch { storageAvailable = false; }
    renderFavorites();
    document.querySelectorAll('[data-pin]').forEach(button => { const app = apps.find(a=>a.key===button.dataset.pin); button.outerHTML = pinButton(app,button.classList.contains('compact')); });
    const replacement = [...document.querySelectorAll('[data-pin]')].find(button=>button.dataset.pin===key && (document.querySelector('#details').open ? button.closest('dialog') : button.closest('.project')));
    replacement?.focus({preventScroll:true});
    const toast = document.querySelector('.toast');
    toast.textContent = pins.has(key) ? 'Added to Frequently Used' : 'Removed from Frequently Used';
    toast.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove('visible'),2200);
  }
  const filter = event.target.closest('[data-category]');
  if(filter) { category=filter.dataset.category; const parent=filter.parentElement.id; renderCategories(); renderProjects(); [...document.getElementById(parent).children].find(button=>button.dataset.category===category)?.focus({preventScroll:true}); if(mode==='workspace' || mode==='cinema') document.querySelector('#catalogue').scrollIntoView({block:'start'}); }
  const trigger=event.target.closest('[data-detail]');
  if(trigger) { lastDetailTrigger=trigger; detail(apps.find(app=>app.key===trigger.dataset.detail)); document.querySelector('#details').showModal(); }
  if(event.target.closest('.close')) document.querySelector('#details').close();
  const feature=event.target.closest('[data-feature]');
  if(feature) { featured=apps.find(app=>app.key===feature.dataset.feature); renderHero(); announceFeature(); [...document.querySelectorAll('[data-feature]')].find(button=>button.dataset.feature===featured.key)?.focus({preventScroll:true}); }
  if(event.target.closest('[data-reset]')) { query=''; category='All apps'; document.querySelector('input').value=''; renderCategories(); renderProjects(); document.querySelector('input').focus(); }
});
document.querySelector('#details').addEventListener('click', event => { if(event.target===event.currentTarget) { const rect=event.currentTarget.getBoundingClientRect(); if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom) event.currentTarget.close(); }});
document.querySelector('#details').addEventListener('close',()=>lastDetailTrigger?.focus({preventScroll:true}));
document.querySelector('input').addEventListener('input',event=>{query=event.target.value.trim().toLowerCase();renderProjects();});
document.addEventListener('keydown', event=>{ if(mode==='cinema' && event.target.closest('.hero') && ['ArrowLeft','ArrowRight'].includes(event.key)) { event.preventDefault(); moveFeature(event.key==='ArrowLeft'?-1:1); } if(event.key==='/' && !/INPUT|TEXTAREA|SELECT/.test(event.target.tagName) && !document.querySelector('#details').open) {event.preventDefault();document.querySelector('input').focus();} });
window.addEventListener('storage',event=>{if(event.key===storageKey){try{const saved=JSON.parse(event.newValue||'[]');pins=new Set(Array.isArray(saved)?saved:[]);}catch{pins=new Set();}renderFavorites();renderProjects();}});
document.addEventListener('error',event=>{ if(event.target.tagName==='IMG'){const fallback=document.createElement('div');fallback.className='missing-image';fallback.textContent='Screenshot unavailable';event.target.replaceWith(fallback);}},true);
renderFavorites();renderHero();renderCategories();renderProjects();
