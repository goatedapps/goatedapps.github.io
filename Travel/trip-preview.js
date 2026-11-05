const concepts = {
  brickbound: { name: 'Brickbound', line: 'A big little adventure.', description: 'A sunny toy-brick world. Pick a day, unpack its missions, and watch the train hop into place.', motion: 'Bricks drop into place. The train rolls in. Day markers pop when selected.', label: 'A toy world to explore', type: 'Toy-brick adventure' },
  platform: { name: 'Platform 26', line: 'Next level: Malaysia.', description: 'Your holiday as a pocket-sized platform game, with day levels, a pixel skyline and a friendly quest log.', motion: 'A train crosses the level. The player hops between days. Quests arrive with an arcade snap.', label: 'Nine days. One great run.', type: 'Pocket platformer' },
  manual: { name: 'Build the Journey', line: 'Good trips come in pieces.', description: 'A playful building booklet. Every day is a new instruction page, with a brick-built train and a tidy parts list.', motion: 'Train pieces assemble in sequence. Changing days rebuilds the scene and opens a fresh page.', label: 'The holiday building set', type: 'Building instruction book' }
};
const params = new URLSearchParams(location.search);
const concept = Object.hasOwn(concepts, params.get('concept')) ? params.get('concept') : null;
const root = document.querySelector('main');
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const svg = content => `<svg viewBox="0 0 900 530" role="img" aria-label="A playful toy illustration of the train journey through Malaysia">${content}</svg>`;
const colors = { blue: ['#6ab9ed','#2585cd','#1664a5'], yellow: ['#ffe783','#f7c638','#d69c1e'], red: ['#ff8c74','#ef6348','#c94135'], green: ['#b9d98c','#8abc63','#628d43'], white: ['#fffbe8','#eae4ce','#bcbfae'], dark: ['#779096','#365b62','#24454a'] };
function brick(x,y,w,h,d,color,studs=true,extra='') {
  const [top,front,side] = colors[color];
  return `<g class="brick ${extra}"><path d="M${x} ${y}h${w}l${d} ${-d*.55}h${-w}Z" fill="${top}"/><path d="M${x} ${y}h${w}v${h}h${-w}Z" fill="${front}"/><path d="M${x+w} ${y}l${d} ${-d*.55}v${h}l${-d} ${d*.55}Z" fill="${side}"/>${studs ? Array.from({length:Math.max(1,Math.floor(w/25))},(_,i)=>`<ellipse cx="${x+14+i*25+d*.45}" cy="${y-d*.25-2}" rx="9" ry="5" fill="${front}"/><ellipse cx="${x+14+i*25+d*.45}" cy="${y-d*.25-5}" rx="9" ry="5" fill="${top}" stroke="${front}" stroke-opacity=".35"/>`).join('') : ''}</g>`;
}
function toyTree(x,y) {
  return brick(x+13,y+20,14,43,14,'dark',false)+brick(x,y,44,32,35,'green')+brick(x+9,y-23,26,28,27,'green');
}
function train(x,y) {
  return `<g class="train">${brick(x,y,162,47,40,'yellow')}${brick(x+8,y-20,142,22,37,'red')}${[16,50,84,118].map(dx=>`<rect x="${x+dx}" y="${y+8}" width="24" height="20" rx="3" fill="#305b69"/><path d="m${x+dx+3} ${y+11} 14 0-14 13Z" fill="#73bbca"/>`).join('')}<rect x="${x+5}" y="${y+38}" width="154" height="9" fill="#e35940"/>${[25,128].map(dx=>`<circle cx="${x+dx}" cy="${y+49}" r="11" fill="#24454a"/><circle cx="${x+dx}" cy="${y+49}" r="5" fill="#adc9bf"/>`).join('')}</g>`;
}
function toyScene() {
  return svg(`<g class="clouds" fill="#fff" opacity=".8"><path d="M90 110h110v-20h-20V74h-51v16H90Z"/><path d="M650 80h120V60h-30V45h-45v15h-45Z"/></g><circle cx="734" cy="145" r="41" fill="#ffe486"/><ellipse cx="475" cy="451" rx="330" ry="39" fill="#79a699" opacity=".15"/>${brick(112,376,590,26,122,'green',false)}<g opacity=".25" fill="#e5f5ba">${Array.from({length:6},(_,row)=>Array.from({length:18},(_,i)=>`<ellipse cx="${140+i*30+row*13}" cy="${370-row*11}" rx="7" ry="3"/>`).join('')).join('')}</g><path d="M170 373h458l90-50" fill="none" stroke="#d5cda9" stroke-width="22"/><path d="M170 373h458l90-50" fill="none" stroke="#7b8c7a" stroke-width="3" stroke-dasharray="8 6"/>${toyTree(170,272)}${brick(267,225,50,115,38,'blue')}${brick(335,225,50,115,38,'blue')}<path class="brick" d="M295 208v-68m68 68v-68M315 249h21v13h-21" fill="none" stroke="#527988" stroke-width="7"/><g fill="#c8eaf2">${[0,1,2,3].map(i=>`<path d="M278 ${240+i*23}h26v9h-26Zm68 0h26v9h-26Z"/>`).join('')}</g>${brick(440,268,111,84,49,'yellow')}${brick(436,250,119,20,48,'red')}<path d="M455 284h18v20h-18Zm29 0h18v20h-18Zm29 0h18v20h-18ZM480 322h28v30h-28Z" fill="#557c7b"/>${brick(585,207,43,126,35,'white')}${brick(648,207,43,126,35,'white')}${brick(602,251,60,17,27,'white')}<g class="brick" fill="#668994"><path d="M608 190v-68m62 68v-68" stroke="#668994" stroke-width="5"/><path d="m598 185 10-28 10 28Zm62 0 10-28 10 28Z"/></g>${toyTree(719,291)}${toyTree(97,327)}${train(269,359)}<g class="map-label"><rect x="426" y="182" width="141" height="34" rx="17" fill="#fff9e7"/><text x="496" y="204" text-anchor="middle" fill="#365b62" font-family="Trebuchet MS,sans-serif" font-size="15" font-weight="bold">Kuala Lumpur</text></g><g class="flag"><path d="M697 267v-79" stroke="#365b62" stroke-width="5"/><path d="M699 188h46v28h-46Z" fill="#ef6348"/><path d="m714 197 5 5-5 5" fill="none" stroke="#fff9e7" stroke-width="3"/></g>`);
}
function pixelScene() {
  return svg(`<g shape-rendering="crispEdges"><path fill="#303464" d="M0 0h900v530H0Z"/><circle cx="733" cy="108" r="49" fill="#ffb7a1"/><path fill="#d6cce6" d="M66 118h100v-18h-20V81h-40v19H66Zm473-42h90V58h-20V42h-35v16h-35Z"/><g class="brick" fill="#55578c"><path d="M16 353V219h58v-42h34v42h49v134Zm166 0V154h26v-40h21v40h27v199Zm103 0V204h63v149Zm97 0V115h35V76h11v39h33v238Zm110 0V229h94v124Zm124 0V173h30v-35h14v35h30v180Zm120 0V228h68v125Z"/></g><g fill="#eac89f">${[196,395,439,629,672].map(x=>Array.from({length:6},(_,i)=>`<rect x="${x}" y="${190+i*24}" width="9" height="9"/>`).join('')).join('')}</g><path d="M0 412h900v118H0Z" fill="#b8d5a3"/><path d="M0 412h900v14H0Z" fill="#79b09b"/><path d="M0 468h900v10H0Z" fill="#303464"/><path d="M0 493h900v10H0Z" fill="#303464"/><g stroke="#303464" stroke-width="6">${Array.from({length:30},(_,i)=>`<path d="M${i*33} 464v43"/>`).join('')}</g><g class="train"><path d="M170 344h213v59H170Z" fill="#ffcb66"/><path d="M176 333h191v11H176Zm-6 56h213v14H170Z" fill="#f68d82"/>${[187,226,265,304,343].map(x=>`<rect x="${x}" y="354" width="25" height="23" fill="#303464"/><path d="M${x+3} 357h17v4h-17Z" fill="#8db1c5"/>`).join('')}<path d="M190 403h24v17h-24Zm143 0h24v17h-24Z" fill="#303464"/></g><g class="coins" fill="#ffcb66">${[442,488,534].map(x=>`<path d="m${x} 310 11-11 11 11-11 11Z"/>`).join('')}</g><g class="player"><path d="M586 332h23v23h-23Z" fill="#ffcb66"/><path d="M579 355h37v33h-37Z" fill="#f68d82"/><path d="M582 388h12v24h-12Zm21 0h12v24h-12Z" fill="#d6cce6"/><rect x="601" y="340" width="4" height="5" fill="#303464"/></g><g class="flag"><path d="M762 291h6v121h-6Z" fill="#d6cce6"/><path d="M768 292h57v37h-57Z" fill="#f68d82"/><path d="M783 303h26v5h-26Zm0 10h17v5h-17Z" fill="#303464"/></g><g fill="#8a8ab4">${[[44,42],[250,62],[483,127],[832,63],[686,231]].map(([x,y])=>`<path d="M${x} ${y}h5v5h-5Z"/>`).join('')}</g></g>`);
}
function manualScene() {
  return svg(`<defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0v28" fill="none" stroke="#bed0be" stroke-width="1"/></pattern></defs><rect width="900" height="530" fill="url(#grid)"/><ellipse cx="443" cy="454" rx="239" ry="30" fill="#52755a" opacity=".1"/><path d="M460 114v308" fill="none" stroke="#6e8c73" stroke-width="2" stroke-dasharray="7 7"/><g class="snap">${brick(235,414,330,22,100,'dark',false)}<g fill="#183f36">${[283,501].map(x=>`<circle cx="${x}" cy="444" r="27"/><circle cx="${x}" cy="444" r="12" fill="#a9c0ad"/>`).join('')}</g></g><g class="snap">${brick(244,302,313,64,94,'yellow')}<g fill="#305c54">${[266,322,378,434,490].map(x=>`<rect x="${x}" y="313" width="38" height="34" rx="3"/>`).join('')}</g></g><g class="snap">${brick(236,200,329,25,100,'red')}</g><g class="snap">${brick(300,115,65,20,48,'white')}${brick(427,115,65,20,48,'white')}</g><g fill="#285346" font-family="Trebuchet MS,sans-serif" font-size="17"><text x="690" y="190">2 × roof bricks</text><text x="690" y="310">1 × carriage</text><text x="690" y="423">1 × wheel base</text></g><g fill="none" stroke="#6e8c73" stroke-width="1.5"><path d="M584 182h83M609 301h58M590 414h77"/></g><g class="part-number" fill="#285346" font-family="Trebuchet MS,sans-serif" font-size="16"><circle cx="163" cy="194" r="21" fill="#285346"/><text x="163" y="200" text-anchor="middle" fill="#f0f2df">1</text><circle cx="163" cy="307" r="21" fill="#285346"/><text x="163" y="313" text-anchor="middle" fill="#f0f2df">2</text><circle cx="163" cy="421" r="21" fill="#285346"/><text x="163" y="427" text-anchor="middle" fill="#f0f2df">3</text></g>`);
}
let selectedDay = 0;
let completed = new Set();
let storageAvailable = true;
try { const saved = JSON.parse(localStorage.getItem('jbkl-2026-missions') || '[]'); if (Array.isArray(saved)) completed = new Set(saved.filter(key => /^\d-\d$/.test(key))); } catch { storageAvailable = false; }
let entrance;
let changeAnimation;
let animationContext;
let motionAllowed = false;
function gallery() {
  document.body.className = 'review';
  root.innerHTML = `<header class="review-top"><span class="review-brand"><span class="mini-brick" aria-hidden="true"></span> A little adventure</span><span>25 November – 3 December 2026</span></header><section class="review-intro"><p class="review-kicker">Singapore / Johor Bahru / Kuala Lumpur</p><h1>Same holiday.<br>Three ways to play.</h1><p>A train ride, a city to explore, and a whole lot of bricks.<br>Choose a world for your nine-day family itinerary.</p></section><section class="concept-grid" aria-label="Three design concepts">${Object.entries(concepts).map(([key,c],i)=>`<article class="concept-card"><a class="concept-art art-${key}" href="?concept=${key}" aria-label="Explore ${esc(c.name)}"><iframe tabindex="-1" aria-hidden="true" title="${esc(c.name)} visual preview" src="?concept=${key}&thumbnail=1" loading="eager"></iframe><span class="preview-tag">Interactive preview</span></a><div class="concept-copy"><p class="concept-type">${i+1} / ${c.type}</p><h2>${c.name}</h2><p>${c.description}</p><div class="motion-note"><strong>How it moves</strong><p>${c.motion}</p></div><a class="explore" href="?concept=${key}">Explore ${c.name} <span aria-hidden="true">↗</span></a></div></article>`).join('')}</section><footer class="review-footer"><p>All three include the full itinerary, day navigation and a mission checklist.</p><p>Design previews only · Unlinked from the homepage</p></footer>`;
}
function renderApp() {
  const c = concepts[concept];
  document.title = `${c.name} · JB + KL 2026`;
  document.body.className = `trip ${concept}${params.has('thumbnail') ? ' thumbnail' : ''}`;
  root.innerHTML = `<div class="preview-bar"><a href="2026JB-KL.html?concept=compare">‹ All three designs</a><span>Design preview · ${c.type}</span><nav aria-label="Switch design">${Object.entries(concepts).map(([key,value])=>`<a href="?concept=${key}" ${key===concept?'aria-current="page"':''}>${value.name}</a>`).join('')}</nav></div><div class="trip-shell"><header class="trip-header"><a class="trip-brand" href="?concept=${concept}"><span class="brand-icon" aria-hidden="true">${concept==='platform'?'▣':concept==='manual'?'+':'▦'}</span> ${c.name}</a><span class="trip-dates">25 Nov – 03 Dec 2026</span><span class="trip-length">9 days of adventure</span></header><section class="trip-hero"><div class="hero-copy"><p class="hero-route">Singapore <span>→</span> Johor Bahru <span>→</span> Kuala Lumpur</p><h1>${c.line}</h1><p class="hero-description">Trains, city quests & a little brick magic. <br>Our family’s JB + KL adventure.</p><a class="start-button" href="#day-nav">${concept==='platform'?'Choose your level':concept==='manual'?'Open the instructions':'Let’s explore'} <span aria-hidden="true">↓</span></a><div class="hero-stats"><span><strong>09</strong> days</span><span><strong>02</strong> base camps</span><span><strong>∞</strong> little memories</span></div></div><div class="scene-wrap"><div class="scene">${concept==='platform'?pixelScene().replace('viewBox="0 0 900 530"', 'viewBox="0 0 900 530" preserveAspectRatio="none"'):concept==='manual'?manualScene():toyScene()}</div><div class="scene-caption"><span>${c.label}</span><button class="replay" type="button" aria-label="Replay scene animation">↻ Replay</button></div>${concept==='brickbound'?'<div class="scene-ticket"><span>Admit the whole family</span><strong>JB + KL</strong><span>25.11 — 03.12 / 2026</span></div>':''}</div></section><section class="itinerary" aria-label="Daily itinerary"><div class="chapter-heading"><h2>${concept==='platform'?'Select a level':concept==='manual'?'Your building instructions':'Every day, a new adventure.'}</h2><span>Pick any day to explore</span></div><nav id="day-nav" class="day-nav" aria-label="Choose itinerary day">${TRIP_DAYS.map((d,i)=>`<button type="button" data-day="${i}" aria-pressed="${i===0}"><span class="day-index">${concept==='platform'?'Lv. ':''}${String(i+1).padStart(2,'0')}</span><span class="day-date">${d.date}</span><span class="day-short">${d.short}</span></button>`).join('')}</nav><div class="day-layout"><section id="day-panel" class="day-panel" aria-labelledby="day-title"></section><aside class="trip-aside"><div class="stay-card" id="stay-card"></div><div class="route-card"><h3>The adventure route</h3><ol><li><span class="route-dot"></span><div><strong>Singapore</strong><span>25 Nov · The starting line</span></div></li><li><span class="route-dot"></span><div><strong>Kuala Lumpur</strong><span>25–29 Nov · City adventures</span></div></li><li><span class="route-dot"></span><div><strong>Johor Bahru</strong><span>29 Nov–3 Dec · Legoland base</span></div></li><li><span class="route-dot"></span><div><strong>Singapore</strong><span>3 Dec · Home sweet home</span></div></li></ol></div><p class="plan-note">Times and prices are from your itinerary. Activity prices are estimates, not live quotes. “$” currency is as supplied.</p></aside></div><div class="day-controls"><button type="button" data-prev>← Previous day</button><span id="day-count"></span><button type="button" data-next>Next day →</button></div></section><footer class="trip-footer"><span>Made for the memories.</span><span>Singapore → JB → KL → JB → Singapore</span><a href="2026JB-KL.html?concept=compare">Compare designs</a></footer></div><p class="sr-only" role="status" id="announcement"></p>`;
  renderDay(false);
  document.querySelectorAll('[data-day]').forEach(button=>button.addEventListener('click',()=>selectDay(Number(button.dataset.day))));
  document.querySelector('[data-prev]').addEventListener('click',()=>selectDay(selectedDay-1));
  document.querySelector('[data-next]').addEventListener('click',()=>selectDay(selectedDay+1));
  document.querySelector('#day-panel').addEventListener('change',event=>{
    if (!event.target.matches('input[data-mission]')) return;
    const key = event.target.dataset.mission;
    event.target.checked ? completed.add(key) : completed.delete(key);
    event.target.closest('.mission').classList.toggle('complete',event.target.checked);
    try { localStorage.setItem('jbkl-2026-missions',JSON.stringify([...completed])); } catch { storageAvailable=false; }
    updateProgress();
  });
  document.querySelector('.replay').addEventListener('click',playScene);
  if (window.gsap) {
    animationContext=gsap.matchMedia();
    animationContext.add('(prefers-reduced-motion: no-preference)',()=>{
      motionAllowed=true;
      playScene();
      return ()=>{motionAllowed=false; entrance?.kill(); changeAnimation?.kill(); gsap.set('.scene .brick, .scene .snap, .scene .train, .scene .player, .scene .coins, .scene .map-label, .scene .part-number, .mission, .day-heading',{clearProps:'all'});};
    });
  }
}
function selectDay(index) {
  if (index<0 || index>=TRIP_DAYS.length || index===selectedDay) return;
  selectedDay=index;
  renderDay(true);
  document.querySelector('#announcement').textContent=`Day ${index+1}, ${TRIP_DAYS[index].date}. ${TRIP_DAYS[index].title}`;
}
function renderDay(animate) {
  changeAnimation?.kill();
  const d = TRIP_DAYS[selectedDay];
  document.querySelectorAll('[data-day]').forEach(button=>button.setAttribute('aria-pressed',Number(button.dataset.day)===selectedDay));
  document.querySelector('#day-panel').innerHTML=`<div class="day-heading"><div class="day-badge">${String(selectedDay+1).padStart(2,'0')}</div><div><p class="day-meta">${d.weekday}, ${d.date} <span> / ${d.place}</span></p><h2 id="day-title">${d.title}</h2></div></div><div class="mission-heading"><h3>${concept==='manual'?'Today’s pieces':concept==='platform'?'Quest log':'Today’s missions'}</h3><span id="mission-progress"></span></div>${d.items.length ? `<ol class="mission-list">${d.items.map((item,i)=>{const key=`${selectedDay}-${i}`;return `<li class="mission ${completed.has(key)?'complete':''}"><label class="mission-check"><input type="checkbox" data-mission="${key}" ${completed.has(key)?'checked':''} aria-label="Mark ${esc(item.title)} complete"><span aria-hidden="true">✓</span></label><div class="mission-time">${esc(item.time)}</div><div class="mission-copy"><div class="mission-title"><h4>${esc(item.title)}</h4>${item.booked?'<span class="booked">Booked</span>':''}</div><p>${esc(item.note)}</p>${item.options?`<ul class="options">${item.options.map(option=>`<li>${esc(option)}</li>`).join('')}</ul>`:''}</div><span class="mission-kind">${item.kind}</span></li>`;}).join('')}</ol>` : `<div class="open-day"><div class="loose-bricks" aria-hidden="true"><i></i><i></i><i></i></div><h3>A day with room to play.</h3><p>No activities planned yet.<br>Your Legoland Hotel base is set; the rest is yours to build.</p><span>Open for adventures</span></div>`}<p class="save-note" id="save-note"></p>`;
  document.querySelector('#stay-card').innerHTML=`<span class="hotel-icon" aria-hidden="true">▥</span><p>${selectedDay===8?'The finish line':'Your base camp'}</p><h3>${d.stay}</h3><span>${selectedDay<4?'Kuala Lumpur · 25–29 Nov':selectedDay<8?'Johor Bahru · 29 Nov–3 Dec':'Arrive 3 Dec · 19:05'}</span><div class="stay-bricks" aria-hidden="true"><i></i><i></i><i></i></div>`;
  document.querySelector('[data-prev]').disabled=selectedDay===0;
  document.querySelector('[data-next]').disabled=selectedDay===TRIP_DAYS.length-1;
  document.querySelector('#day-count').textContent=`Day ${selectedDay+1} of ${TRIP_DAYS.length}`;
  updateProgress();
  if (animate && motionAllowed) {
    changeAnimation=gsap.timeline({defaults:{duration:.35,ease:'power2.out'}})
      .from('.day-heading',{x:concept==='platform'?18:0,y:concept==='platform'?0:10,autoAlpha:0})
      .from('.mission, .open-day',{x:concept==='manual'?-14:0,y:concept==='manual'?0:12,autoAlpha:0,stagger:.045},'<0.08');
    gsap.fromTo(`[data-day="${selectedDay}"]`,{y:0},{y:-5,duration:.16,yoyo:true,repeat:1,overwrite:true,ease:'power1.out'});
    if(concept==='manual') playScene();
    else {
      gsap.fromTo('.scene .train',{x:-55},{x:0,duration:.65,overwrite:true,ease:'power2.out'});
      if(concept==='platform') gsap.fromTo('.scene .player',{y:-24},{y:0,duration:.5,overwrite:true,ease:'bounce.out'});
    }
  }
}
function updateProgress() {
  const total=TRIP_DAYS[selectedDay].items.length;
  const done=TRIP_DAYS[selectedDay].items.filter((_,i)=>completed.has(`${selectedDay}-${i}`)).length;
  document.querySelector('#mission-progress').textContent=total?`${done} / ${total} complete`:'Unplanned';
  document.querySelector('#save-note').textContent=total?(storageAvailable?'Tick off a memory. Progress is saved on this browser.':'Tick off a memory. Progress is saved for this visit only.'):'';
}
function playScene() {
  if (!motionAllowed) return;
  entrance?.revert();
  entrance=gsap.timeline({defaults:{duration:.7,ease:'back.out(1.3)'}});
  if (concept==='manual') {
    entrance.from('.scene .snap',{y:-90,autoAlpha:0,stagger:.15}).from('.part-number',{autoAlpha:0,duration:.3},'<.3');
  } else if(concept==='platform') {
    entrance.from('.scene .brick',{y:60,autoAlpha:0,ease:'steps(6)'})
      .from('.scene .train',{x:-390,duration:1.1,ease:'power2.out'},'<.1')
      .from('.scene .player',{y:-60,autoAlpha:0,ease:'bounce.out'},'<.5')
      .from('.scene .coins',{scale:0,transformOrigin:'center',duration:.35},'<.2');
  } else {
    entrance.from('.scene .brick',{y:-55,autoAlpha:0,stagger:.025})
      .from('.scene .train',{x:-220,autoAlpha:0,duration:.9,ease:'power2.out'},'<.35')
      .from('.scene .map-label',{y:-15,autoAlpha:0,duration:.35},'<.45');
  }
}
if (!params.has('concept') || concept === 'brickbound' && !params.has('thumbnail') && params.get('preview') !== 'railway') renderDriverCab();
else if (concept === 'brickbound' && params.get('preview') === 'railway') renderRailwayDay();
else if (concept) renderApp();
else gallery();
