function renderRailwayDay() {
  const day = TRIP_DAYS[0];
  const main = document.querySelector('main');
  const palette = {
    red: ['#ff997d', '#ed7157', '#c84f40'],
    yellow: ['#ffe99b', '#f6c746', '#d4a12d'],
    blue: ['#9cdae7', '#6bb6ce', '#3e899f'],
    green: ['#c3df9d', '#99c56f', '#739c51'],
    white: ['#fffbea', '#eee9d3', '#c9cfb8'],
    teal: ['#84aaa4', '#426f69', '#2f5552']
  };
  const stops = [
    { city: 'Singapore', title: 'The adventure starts here.', caption: 'Shuttle Tebrau', label: 'All aboard', color: 'blue', tip: 'First stop: Johor Bahru. Let the holiday begin!', scene: 'departure' },
    { city: 'Johor Bahru', title: 'A kopi kind of morning.', caption: 'Oriental Kopi', label: 'Kopi stop', color: 'yellow', tip: 'Arrive in JB at 09:50, then head for breakfast at Oriental Kopi.', scene: 'kopi' },
    { city: 'JB → Kuala Lumpur', title: 'Watch the world roll by.', caption: 'JB → KL train', label: 'On the rails', color: 'green', tip: 'Your 12:45 train takes the adventure north to Kuala Lumpur.', scene: 'journey' },
    { city: 'Kuala Lumpur', title: 'Hello, big city!', caption: 'Berjaya Times Square', label: 'Hello, KL', color: 'blue', tip: 'Arrive at 17:05. Take a taxi to Berjaya Times Square hotel and check in.', scene: 'arrival' },
    { city: 'Kuala Lumpur', title: 'Noodles are the reward.', caption: 'Tangkak Beef Noodle House', label: 'Noodle quest', color: 'red', tip: 'Dinner at Tangkak Beef Noodle House. No dinner time set yet.', scene: 'dinner' },
    { city: 'Berjaya Times Square', title: 'A sweet little side quest.', caption: 'Supermarket + Mixue', label: 'Sweet ending', color: 'yellow', tip: 'Walk around the supermarket, then find Mixue at Level 2.', scene: 'mixue' }
  ];
  let active = 0;
  let collected = new Set();
  let canSave = true;
  let reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let arriveTimeline;
  let revealTimeline;
  let arrivalState = { distance: 0 };
  let mm;
  try {
    const saved = JSON.parse(localStorage.getItem('brickbound-25nov-memories') || '[]');
    if (Array.isArray(saved)) collected = new Set(saved.filter(i => Number.isInteger(i) && i >= 0 && i < stops.length));
  } catch { canSave = false; }
  const cube = (x,y,w,h,d,color,studs=true) => {
    const [top,front,side] = palette[color];
    return `<g class="toy-piece"><path d="M${x} ${y}h${w}l${d} ${-d*.55}h${-w}Z" fill="${top}"/><path d="M${x} ${y}h${w}v${h}h${-w}Z" fill="${front}"/><path d="M${x+w} ${y}l${d} ${-d*.55}v${h}l${-d} ${d*.55}Z" fill="${side}"/>${studs ? Array.from({length:Math.max(1,Math.floor(w/27))},(_,i)=>`<ellipse cx="${x+13+i*27+d*.45}" cy="${y-d*.25-3}" rx="8" ry="4" fill="${front}"/><ellipse cx="${x+13+i*27+d*.45}" cy="${y-d*.25-6}" rx="8" ry="4" fill="${top}"/>`).join('') : ''}</g>`;
  };
  const tree = (x,y) => cube(x+12,y+25,12,36,10,'teal',false)+cube(x,y,38,30,25,'green')+cube(x+8,y-20,23,25,20,'green');
  const littleTrain = (x,y) => `<g class="little-train">${cube(x,y,150,45,35,'yellow')}${cube(x-4,y-15,158,17,35,'red')}${[12,45,78,111].map(dx=>`<rect x="${x+dx}" y="${y+7}" width="23" height="21" rx="3" fill="#356968"/><path d="M${x+dx+3} ${y+10}h15l-15 13Z" fill="#a5d9d8"/>`).join('')}${[24,122].map(dx=>`<circle cx="${x+dx}" cy="${y+46}" r="11" fill="#345653"/><circle cx="${x+dx}" cy="${y+46}" r="5" fill="#dbe8ce"/>`).join('')}</g>`;
  const sign = (x,y,text,width=160) => `<g class="toy-sign"><rect x="${x}" y="${y}" width="${width}" height="30" rx="4" fill="#fffbea" stroke="#d7dfc5"/><text x="${x+width/2}" y="${y+20}" text-anchor="middle" font-family="Trebuchet MS,sans-serif" font-weight="bold" font-size="12" fill="#345653">${text}</text></g>`;
  const figure = (x,y) => `<g class="minifigure"><rect x="${x+11}" y="${y-6}" width="13" height="7" rx="2" fill="#e4ae35"/><rect x="${x+6}" y="${y}" width="23" height="23" rx="5" fill="#ffce52"/><circle cx="${x+13}" cy="${y+9}" r="1.6" fill="#3b5a53"/><circle cx="${x+23}" cy="${y+9}" r="1.6" fill="#3b5a53"/><path d="M${x+13} ${y+16}q5 5 10 0" stroke="#3b5a53" fill="none" stroke-width="1.6"/><rect x="${x+3}" y="${y+26}" width="29" height="30" rx="4" fill="#ed7157"/><path d="M${x+1} ${y+29}l-7 25m42-25 7 25" stroke="#ed7157" stroke-width="10"/><path d="M${x+10} ${y+56}v22m15-22v22" stroke="#426f69" stroke-width="12"/><rect x="${x+39}" y="${y+53}" width="24" height="27" rx="3" fill="#6bb6ce"/><path d="M${x+45} ${y+53}v-8h11v8" fill="none" stroke="#426f69" stroke-width="3"/></g>`;
  function dayArt(scene) {
    const ground = `<ellipse cx="325" cy="366" rx="239" ry="28" fill="#4e756c" opacity=".12"/>${cube(79,307,403,22,82,'green',false)}<g opacity=".24" fill="#ecf5cf">${Array.from({length:3},(_,r)=>Array.from({length:12},(_,i)=>`<ellipse cx="${100+i*31+r*20}" cy="${300-r*14}" rx="7" ry="3.5"/>`).join('')).join('')}</g>`;
    let content='';
    if(scene==='departure') content = `${cube(146,187,173,100,45,'white')}${cube(132,169,199,20,49,'red')}${sign(151,196,'Singapore · Platform 1',167)}<path d="M169 236h24v51h-24Zm43 0h24v51h-24Zm43 0h24v51h-24Z" fill="#6a9996"/>${littleTrain(237,292)}${figure(137,260)}${tree(449,230)}`;
    if(scene==='kopi') content = `${cube(159,157,225,144,50,'white')}${cube(148,141,248,20,50,'yellow')}${sign(186,168,'Oriental Kopi',172)}<path d="M164 212h214v26H164Z" fill="#ed7157"/>${[0,1,2,3,4,5].map(i=>`<path d="M${164+i*36} 212h18v26h-18Z" fill="#fff4d6"/>`).join('')}<rect x="185" y="249" width="67" height="52" fill="#60968d"/><rect x="270" y="249" width="80" height="38" fill="#b7d7c1"/>${cube(347,282,105,18,37,'teal')}<g class="coffee"><ellipse cx="391" cy="268" rx="32" ry="10" fill="#fffbea"/><path d="M368 238h39v24q-19 15-39 0Z" fill="#fffbea"/><ellipse cx="387" cy="239" rx="19" ry="6" fill="#8d6242"/><path d="M408 241q27-1 15 17h-15" stroke="#fffbea" stroke-width="6" fill="none"/><path d="M379 225q-6-7 0-14m15 14q-6-7 0-14" stroke="#90a99b" fill="none" stroke-width="3"/></g>${figure(105,266)}${tree(452,198)}`;
    if(scene==='journey') content=`<path d="M88 324q180-86 397 0" fill="none" stroke="#9abfc4" stroke-width="45"/>${cube(110,269,355,24,55,'white',false)}<path d="M144 293v41m78-41v22m78-22v22m78-22v32m70-32v47" stroke="#b9c6ad" stroke-width="17"/>${tree(75,180)}${tree(425,175)}${littleTrain(213,231)}${sign(233,129,'Next stop · Kuala Lumpur',190)}<g fill="#fffbea"><path d="M107 117h100v-14h-18V87h-45v16h-37Z"/><path d="M375 85h97V69h-23V52h-36v17h-38Z"/></g>`;
    if(scene==='arrival') content=`${cube(155,119,38,172,28,'blue')}${cube(214,119,38,172,28,'blue')}${cube(190,178,37,13,20,'white',false)}<path d="M176 102V57m59 45V57" stroke="#6f9698" stroke-width="4"/><g fill="#d1eeec">${[0,1,2,3,4,5].map(i=>`<path d="M164 ${135+i*24}h20v8h-20Zm60 0h20v8h-20Z"/>`).join('')}</g>${cube(304,176,148,119,50,'yellow')}${cube(294,155,168,22,50,'red')}${sign(312,186,'Berjaya Times Square',160)}<path d="M324 235h20v24h-20Zm36 0h20v24h-20Zm36 0h20v24h-20ZM361 272h25v23h-25Z" fill="#608579"/>${cube(242,313,100,30,28,'yellow')}<path d="M262 313v-21h45v21" fill="#6bb6ce"/><circle cx="259" cy="343" r="9" fill="#345653"/><circle cx="322" cy="343" r="9" fill="#345653"/>${figure(110,262)}`;
    if(scene==='dinner') content=`${cube(166,150,216,146,46,'red')}${cube(153,135,242,20,46,'yellow')}${sign(177,164,'Tangkak Beef Noodle House',222)}<rect x="187" y="218" width="73" height="78" fill="#426f69"/><rect x="282" y="218" width="72" height="47" fill="#ffc96a"/>${cube(301,293,145,18,48,'teal')}<ellipse cx="365" cy="276" rx="44" ry="14" fill="#f9ebd1"/><path d="M321 275q7 55 88 0Z" fill="#f9ebd1"/><ellipse cx="365" cy="276" rx="36" ry="10" fill="#b57e42"/><path d="M343 274q10-15 22 0t20 0m-41 6q10-15 22 0t20 0" stroke="#ffe39a" fill="none" stroke-width="3"/><path d="m388 268 29-40m-22 44 31-38" stroke="#426f69" stroke-width="3"/>${figure(112,258)}${tree(453,201)}`;
    if(scene==='mixue') content=`${cube(133,174,149,119,38,'white')}${cube(123,158,168,18,40,'green')}${sign(141,184,'Supermarket',139)}<rect x="151" y="228" width="112" height="46" fill="#8ab9a4"/>${cube(311,133,132,159,43,'white')}${cube(301,117,153,18,43,'red')}${sign(319,146,'Mixue · Level 2',143)}<rect x="334" y="204" width="42" height="88" fill="#9dcfcd"/><rect x="389" y="204" width="35" height="46" fill="#ed7157"/><g class="ice-cream"><path d="m278 279 16 46 17-46Z" fill="#e5b86d"/><path d="M273 279q-3-12 9-16-7-12 7-15-3-12 9-18 14 10 10 19 14 7 8 16 12 8 3 14Z" fill="#fffbea" stroke="#e2dcca" stroke-width="2"/></g>${figure(95,263)}${tree(465,218)}`;
    return `<svg viewBox="0 0 640 410" role="img" aria-label="Toy-brick scene: ${stops[active].caption}"><g class="scene-sun"><circle cx="478" cy="76" r="30" fill="#f8d976"/></g>${ground}${content}</svg>`;
  }
  const routePoints = [.12,.25,.37,.48,.59,.70,.80,.89,.98];
  document.body.className='railway-prototype';
  document.title='25 November · All aboard, adventurers | Brickbound';
  main.innerHTML=`<div class="rk-preview"><a href="2026JB-KL.html?concept=compare">‹ Design previews</a><span>Day 1 prototype · Only 25 November is playable</span><a href="#rk-day">Explore the day ↓</a></div><div class="rk-shell"><header class="rk-header"><a href="?concept=brickbound" class="rk-brand"><span aria-hidden="true">▦</span> Brickbound</a><span>Our JB + KL adventure</span><div class="rk-date">25 Nov – 03 Dec 2026</div></header><section class="rk-intro"><div><p class="rk-eyebrow">A little railway. A big family adventure.</p><h1>Good memories.<br>Next station.</h1></div><div class="rk-intro-note"><span class="rk-ticket-punch" aria-hidden="true">✳</span><p>Your holiday is a world to explore. <br>Click the golden station to arrive, <br>then pick a carriage to see what’s inside.</p></div></section><section class="rk-map" aria-label="Holiday railway map"><div class="rk-map-top"><span><i aria-hidden="true"></i> The adventure line</span><span>9 days / 2 base camps / a lot of little memories</span></div><div class="rk-map-window"><svg class="rk-map-svg" viewBox="0 0 1200 340" aria-label="Toy railway with nine day stations, beginning on 25 November" role="group"><defs><pattern id="rk-grass" width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="3" fill="#d3e5ba"/></pattern></defs><path d="M28 246 137 97 335 65 470 142 637 64 892 84 1164 211 1108 307 774 313 487 289 225 317Z" fill="#dceac8"/><path d="M28 246 137 97 335 65 470 142 637 64 892 84 1164 211 1108 307 774 313 487 289 225 317Z" fill="url(#rk-grass)"/><path d="M578 65q-75 74-31 152t-31 88" stroke="#b6dce0" stroke-width="37" fill="none"/><g class="rk-map-scenery">${cube(296,104,24,65,17,'blue')}${cube(334,104,24,65,17,'blue')}<path d="M309 91V69m39 22V69m-28 59h15" stroke="#7c9c9b" stroke-width="3"/>${cube(772,136,65,46,25,'yellow')}${cube(767,118,75,20,25,'red')}${cube(754,103,22,77,16,'white')}${cube(842,103,22,77,16,'white')}${tree(435,94)}${tree(944,152)}${tree(112,166)}${tree(673,72)}<g fill="#557d6b" font-family="Trebuchet MS,sans-serif" font-size="12"><text x="288" y="56">Kuala Lumpur</text><text x="748" y="62">Legoland base camp</text><text x="1094" y="291">Home</text></g></g><defs><path id="rk-route" d="M69 260 C120 260 128 212 210 212 S360 255 446 230 S520 150 618 173 S731 250 825 238 S965 156 1030 195 S1085 254 1133 254" fill="none"/></defs><use href="#rk-route" fill="none" stroke="#f4f2da" stroke-width="19" stroke-linecap="round"/><use href="#rk-route" fill="none" stroke="#8fa694" stroke-width="13" stroke-dasharray="3 10"/><use href="#rk-route" fill="none" stroke="#55766d" stroke-width="2"/><g id="rk-stations"></g><g id="rk-route-train" aria-hidden="true"><rect x="-30" y="-15" width="56" height="25" rx="5" fill="#ef795d" stroke="#f9f3d7" stroke-width="3"/><rect x="-24" y="-10" width="13" height="12" rx="2" fill="#fbd26a"/><rect x="-5" y="-10" width="13" height="12" rx="2" fill="#fbd26a"/><rect x="13" y="-10" width="8" height="12" rx="2" fill="#355d59"/><circle cx="-17" cy="12" r="5" fill="#355d59"/><circle cx="15" cy="12" r="5" fill="#355d59"/></g></svg></div><div class="rk-map-bottom"><span class="rk-map-status" id="rk-map-status" role="status">Click 25 Nov to bring your train into the station.</span><span><b class="rk-key-dot"></b> Today’s preview <b class="rk-key-dot muted"></b> More days to build</span></div></section><section class="rk-day" id="rk-day" aria-labelledby="rk-day-title"><div class="rk-day-heading"><div class="rk-day-number"><span>Day</span><strong>01</strong></div><div><p>Wednesday, 25 November 2026</p><h2 id="rk-day-title">All aboard, adventurers.</h2><span>Singapore → Johor Bahru → Kuala Lumpur</span></div><div class="rk-night"><span>Tonight’s base camp</span><strong>Berjaya Times Square</strong><small>Kuala Lumpur</small></div></div><div class="rk-boarding"><div><span class="rk-small-square" aria-hidden="true"></span><strong>Six stops. One little adventure.</strong></div><span>Pick a carriage. Unpack a memory.</span></div><div class="rk-train-carousel" aria-label="Explore the six stops on 25 November"><div class="rk-carousel-window"><div class="rk-convoy">${stops.map((stop,i)=>`<button type="button" class="rk-carriage car-${stop.color}" data-stop="${i}" aria-pressed="${i===0}" aria-controls="rk-stop-panel" aria-label="Stop ${i+1}: ${day.items[i].time}, ${stop.caption}"><span class="rk-car-studs" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="rk-car-roof"><span>0${i+1}</span><span>${day.items[i].time}</span></span><span class="rk-car-windows" aria-hidden="true"><i></i><i class="rk-car-icon">${['↗','☕','↗','▥','≋','❄'][i]}</i><i></i></span><span class="rk-car-label">${stop.label}</span><span class="rk-car-chassis" aria-hidden="true"></span><span class="rk-car-wheels" aria-hidden="true"><i></i><i></i></span><span class="rk-car-tick" aria-hidden="true">✓</span></button>`).join('')}</div></div><div class="rk-rail" aria-hidden="true"></div></div><div class="rk-carousel-controls"><button type="button" data-stop-prev aria-label="Previous activity">←</button><span id="rk-car-position">Carriage 01 / 06</span><button type="button" data-stop-next aria-label="Next activity">→</button><span class="rk-swipe-hint">Swipe or use the arrows</span></div><div class="rk-stop-panel" id="rk-stop-panel" aria-labelledby="rk-stop-title"><div class="rk-stage"><div class="rk-stage-label"><span id="rk-scene-city"></span><span>Little world / 01</span></div><div class="rk-day-art" id="rk-day-art"></div><div class="rk-stage-caption" id="rk-scene-caption"></div></div><article class="rk-pass"><div class="rk-pass-top"><span>One family adventure</span><span id="rk-pass-number"></span></div><div class="rk-pass-time" id="rk-pass-time"></div><h3 id="rk-stop-title"></h3><p class="rk-venue" id="rk-venue"></p><p class="rk-stop-description" id="rk-description"></p><div class="rk-pass-bottom"><button type="button" id="rk-collect">Collect this memory <span aria-hidden="true">✳</span></button><span id="rk-saved-note"></span></div><div class="rk-barcode" aria-hidden="true"></div></article></div><div class="rk-passport"><div><span class="rk-passport-icon" aria-hidden="true">✳</span><div><h3>Your first-day souvenir</h3><p id="rk-progress"></p></div></div><div class="rk-stamps" aria-label="Collected memories">${stops.map((stop,i)=>`<span data-stamp="${i}" title="${stop.caption}">${String(i+1).padStart(2,'0')}</span>`).join('')}</div></div></section><footer class="rk-footer"><span>A little less scrolling. A little more exploring.</span><a href="2026JB-KL.html?concept=compare">Back to the three concepts</a><span>25 November prototype</span></footer></div><p class="rk-sr-only" role="status" id="rk-announcement"></p>`;
  const route = document.querySelector('#rk-route');
  const routeLength = route.getTotalLength();
  document.querySelector('#rk-stations').innerHTML=TRIP_DAYS.map((d,i)=>{
    const point=route.getPointAtLength(routeLength*routePoints[i]);
    const above=i%2===0;
    return `<g class="rk-station ${i===0?'available':'future'}" transform="translate(${point.x} ${point.y})" ${i===0?'role="button" tabindex="0" aria-label="Arrive at 25 November station"':'role="img" aria-label="'+d.date+' station, not included in this preview"'}>${i===0?'<rect x="-40" y="-90" width="95" height="115" fill="transparent"/>':''}<path d="M0 ${above?-18:18}v${above?-17:17}" stroke="${i===0?'#c7a12b':'#9aad94'}" stroke-width="2"/><circle r="${i===0?17:11}" fill="${i===0?'#f8cf58':'#eaf0dc'}" stroke="${i===0?'#bb9428':'#a4b69a'}" stroke-width="${i===0?4:2}"/><circle r="${i===0?6:3}" fill="${i===0?'#fff9df':'#a4b69a'}"/><rect x="-34" y="${above?-63:34}" width="68" height="26" rx="5" fill="${i===0?'#f8cf58':'#edf2e3'}"/><text y="${above?-46:51}" text-anchor="middle" font-size="12" font-weight="${i===0?'bold':'normal'}" fill="#496c5e" font-family="Trebuchet MS,sans-serif">${d.date}</text>${i===0?'<path d="M25-64v-21h24v15H25" stroke="#416c5a" stroke-width="2" fill="#88b683"/>':''}</g>`;
  }).join('');
  function placeTrain(distance) {
    const point=route.getPointAtLength(distance);
    const next=route.getPointAtLength(Math.min(routeLength,distance+1));
    const angle=Math.atan2(next.y-point.y,next.x-point.x)*180/Math.PI;
    document.querySelector('#rk-route-train').setAttribute('transform',`translate(${point.x} ${point.y-9}) rotate(${angle})`);
  }
  function arrive() {
    arriveTimeline?.kill();
    arrivalState.distance=0;
    placeTrain(0);
    const status=document.querySelector('#rk-map-status');
    status.textContent='All aboard! Arriving at 25 November…';
    const finish=()=>{status.textContent='You’ve arrived at Day 1. Pick a carriage below to explore.';document.querySelector('.rk-map').classList.add('has-arrived');};
    if(!window.gsap || reducedMotion) {placeTrain(routeLength*routePoints[0]);finish();return;}
    arriveTimeline=gsap.timeline({defaults:{ease:'power2.inOut'}})
      .to(arrivalState,{distance:routeLength*routePoints[0],duration:1.7,onUpdate:()=>placeTrain(arrivalState.distance)})
      .fromTo('.rk-day-number',{scale:.9},{scale:1,duration:.4,ease:'back.out(2)',onStart:finish});
  }
  function centerCar(animate) {
    const windowElement=document.querySelector('.rk-carousel-window');
    const carriage=document.querySelector(`[data-stop="${active}"]`);
    const offset=windowElement.clientWidth/2-carriage.offsetLeft-carriage.offsetWidth/2;
    const convoy=document.querySelector('.rk-convoy');
    if(window.gsap && !reducedMotion && animate) gsap.to(convoy,{x:offset,duration:.7,ease:'power3.inOut',overwrite:true});
    else {if(window.gsap) gsap.set(convoy,{x:offset});else convoy.style.transform=`translateX(${offset}px)`;}
  }
  function showStop(index,animate=true,announce=true) {
    if(index<0 || index>=stops.length) return;
    revealTimeline?.revert();
    active=index;
    const panel=document.querySelector('#rk-stop-panel');
    panel.setAttribute('aria-busy','false');
    const s=stops[index];
    const item=day.items[index];
    document.querySelectorAll('[data-stop]').forEach(button=>{
      button.setAttribute('aria-pressed',Number(button.dataset.stop)===index);
      button.tabIndex=Number(button.dataset.stop)===index?0:-1;
    });
    document.querySelector('#rk-day-art').innerHTML=dayArt(s.scene);
    document.querySelector('#rk-scene-city').textContent=s.city;
    document.querySelector('#rk-scene-caption').textContent=s.caption;
    document.querySelector('.rk-stage-label>span:last-child').textContent=`Little world / 0${index+1}`;
    document.querySelector('#rk-car-position').textContent=`Carriage 0${index+1} / 06`;
    document.querySelector('#rk-pass-number').textContent=`Stop 0${index+1} / 06`;
    document.querySelector('#rk-pass-time').textContent=item.time;
    document.querySelector('#rk-stop-title').textContent=s.title;
    document.querySelector('#rk-venue').textContent=s.caption;
    document.querySelector('#rk-description').textContent=s.tip;
    document.querySelector('[data-stop-prev]').disabled=index===0;
    document.querySelector('[data-stop-next]').disabled=index===stops.length-1;
    centerCar(animate);
    updateMemories();
    if(announce) document.querySelector('#rk-announcement').textContent=`Stop ${index+1}: ${item.time}. ${s.caption}. ${s.tip}`;
    if(window.gsap && !reducedMotion && animate) {
      panel.setAttribute('aria-busy','true');
      revealTimeline=gsap.timeline({defaults:{duration:.45,ease:'power2.out'},onComplete:()=>panel.setAttribute('aria-busy','false')})
        .from('.rk-day-art .toy-piece',{y:-24,autoAlpha:0,stagger:.025})
        .from('.rk-day-art .minifigure',{y:-20,autoAlpha:0,ease:'back.out(1.4)'},'<.1')
        .from('.rk-pass-time, #rk-stop-title, .rk-venue, .rk-stop-description',{y:10,autoAlpha:0,stagger:.055},'<.1');
    }
  }
  function updateMemories() {
    document.querySelectorAll('[data-stamp]').forEach(stamp=>{
      const done=collected.has(Number(stamp.dataset.stamp));
      stamp.classList.toggle('collected',done);
      stamp.setAttribute('aria-label',`${stops[Number(stamp.dataset.stamp)].caption}: ${done?'collected':'not collected'}`);
      stamp.textContent=done?'✳':String(Number(stamp.dataset.stamp)+1).padStart(2,'0');
    });
    document.querySelectorAll('[data-stop]').forEach(car=>car.classList.toggle('memory-collected',collected.has(Number(car.dataset.stop))));
    const button=document.querySelector('#rk-collect');
    button.classList.toggle('is-collected',collected.has(active));
    button.setAttribute('aria-pressed',collected.has(active));
    button.innerHTML=collected.has(active)?'Memory collected <span aria-hidden="true">✓</span>':'Collect this memory <span aria-hidden="true">✳</span>';
    document.querySelector('#rk-progress').textContent=collected.size===stops.length?'All six memories collected. What a first day!':`${collected.size} of 6 memories collected. The little moments count.`;
    document.querySelector('#rk-saved-note').textContent=canSave?'Saved on this browser.':'Saved for this visit only.';
  }
  const station=document.querySelector('.rk-station.available');
  station.addEventListener('click',arrive);
  station.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();arrive();}});
  document.querySelectorAll('[data-stop]').forEach(button=>button.addEventListener('click',()=>showStop(Number(button.dataset.stop))));
  document.querySelector('[data-stop-prev]').addEventListener('click',()=>showStop(active-1));
  document.querySelector('[data-stop-next]').addEventListener('click',()=>showStop(active+1));
  document.querySelector('.rk-train-carousel').addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showStop(active+(event.key==='ArrowLeft'?-1:1));document.querySelector(`[data-stop="${active}"]`).focus({preventScroll:true});}
  });
  let swipeStart;
  const swipeArea=document.querySelector('.rk-carousel-window');
  swipeArea.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')swipeStart={x:event.clientX,y:event.clientY};});
  swipeArea.addEventListener('pointerup',event=>{
    if(!swipeStart)return;
    const dx=event.clientX-swipeStart.x;
    const dy=event.clientY-swipeStart.y;
    if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){showStop(active+(dx<0?1:-1));suppressClick=true;setTimeout(()=>suppressClick=false,0);}
    swipeStart=null;
  });
  let suppressClick=false;
  swipeArea.addEventListener('click',event=>{if(suppressClick){event.preventDefault();event.stopPropagation();}},true);
  swipeArea.addEventListener('pointercancel',()=>{swipeStart=null;});
  document.querySelector('#rk-collect').addEventListener('click',()=>{
    const adding=!collected.has(active);
    adding?collected.add(active):collected.delete(active);
    try{localStorage.setItem('brickbound-25nov-memories',JSON.stringify([...collected]));}catch{canSave=false;}
    updateMemories();
    if(window.gsap&&!reducedMotion&&adding) gsap.fromTo(`[data-stamp="${active}"]`,{scale:1.5,rotation:-20},{scale:1,rotation:0,duration:.45,ease:'back.out(1.5)',overwrite:true});
    document.querySelector('#rk-announcement').textContent=adding?`Memory collected: ${stops[active].caption}.`:`Memory removed: ${stops[active].caption}.`;
  });
  new ResizeObserver(()=>centerCar(false)).observe(document.querySelector('.rk-carousel-window'));
  showStop(0,false,false);
  placeTrain(routeLength*routePoints[0]);
  if(window.gsap){
    mm=gsap.matchMedia();
    mm.add({motion:'(prefers-reduced-motion: no-preference)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
      reducedMotion=context.conditions.reduce;
      if(reducedMotion){arriveTimeline?.kill();revealTimeline?.revert();gsap.killTweensOf('.rk-convoy');document.querySelector('#rk-stop-panel').setAttribute('aria-busy','false');centerCar(false);}
      arrive();
      return ()=>{arriveTimeline?.kill();revealTimeline?.revert();gsap.killTweensOf('.rk-convoy');};
    });
  }else arrive();
}
