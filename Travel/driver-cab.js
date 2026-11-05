function renderDriverCab() {
  const stationDays = [
    {...TRIP_DAYS[0], highlight:'Train to KL'},
    {...TRIP_DAYS[1], highlight:'Skyline Luge'},
    {...TRIP_DAYS[2], highlight:'Escape room'},
    {...TRIP_DAYS[3], highlight:'Shopping'},
    {...TRIP_DAYS[4], highlight:'To Legoland'},
    {...TRIP_DAYS[5], date:'30 Nov–2 Dec', weekday:'Mon–Wed', title:'Three days of brick magic.', highlight:'Legoland', groupedDays:TRIP_DAYS.slice(5,8)},
    {...TRIP_DAYS[8], date:'3 Dec', highlight:'Home to SG'}
  ];
  const scenes = [
    { image: 'kl', title: 'Hello, Kuala Lumpur.', activity: 'City arrival', position: '50% 53%' },
    { image: 'luge', title: 'A little downhill adventure.', activity: 'Skyline Luge', position: '58% 52%' },
    { image: 'escape', title: 'Next stop: a mystery.', activity: 'Breakout Escape Room', position: '59% 50%' },
    { image: 'shopping', title: 'A city full of side quests.', activity: 'Pavilion & Lot 10', position: '58% 53%' },
    { image: 'legoland', title: 'Welcome to your brick kingdom.', activity: 'Legoland Hotel', position: '56% 52%' },
    { image: 'legoland', title: 'Three days of brick magic.', activity: 'Legoland · 30 Nov–2 Dec', position: '54% 52%' },
    { image: 'home', title: 'Home with a pocketful of memories.', activity: 'Home to Singapore', position: '50% 53%' }
  ];
  const escapeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const source = index => `images/driver-${scenes[index].image}.webp`;
  let current = 0;
  let direction = 1;
  let travelling = false;
  let activeLayer = 0;
  let journey;
  let cabShake;
  let dialogAnimation;
  let leverAnimation;
  let pointerStart = null;
  let pushAmount = 0;
  let targetIndex = null;
  let driveToken = 0;
  const speed = { value: 0 };
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  document.body.className = 'driver-view';
  document.title = 'Brickbound · Your seat for a little adventure';
  document.querySelector('meta[name="theme-color"]').content = '#244c48';
  document.querySelector('main').innerHTML = `
    <div class="cab" id="cab">
      <header class="cab-header"><a class="cab-brand" href="2026JB-KL.html?concept=compare"><span class="cab-brand-mark" aria-hidden="true">▦</span><span>Brickbound<small>A family railway adventure</small></span></a><div class="cab-header-route">Singapore <span>—</span> Kuala Lumpur <span>—</span> Legoland</div><button type="button" class="cab-food-map" id="open-food-map"><span aria-hidden="true">⌖</span><span>Food map</span></button><details class="cab-sound" id="cab-sound"><summary aria-label="Sound and volume settings"><span aria-hidden="true">♫</span><span id="sound-summary">Sound on</span></summary><div class="sound-settings"><button type="button" id="sound-mute" aria-pressed="false">Mute all sound</button><label for="sound-music">Background music <output id="sound-music-value">28%</output></label><input id="sound-music" type="range" min="0" max="100" value="28"><label for="sound-effects">Train sounds <output id="sound-effects-value">65%</output></label><input id="sound-effects" type="range" min="0" max="100" value="65"></div></details><span class="cab-trip-dates">25 Nov – 03 Dec 2026</span></header>
      <section class="windshield" aria-label="View from the driver's seat">
        <div class="windshield-landscape" id="windshield-landscape">
          <img class="landscape-image" id="landscape-0" src="${source(0)}" alt="A three-dimensional toy-brick railway arriving in Kuala Lumpur, with the Petronas towers ahead." style="object-position:${scenes[0].position}">
          <img class="landscape-image inactive" id="landscape-1" src="${source(1)}" alt="" aria-hidden="true" style="object-position:${scenes[1].position}">
        </div>
        <div class="windshield-glass" aria-hidden="true"></div>
        <div class="motion-rails" aria-hidden="true"><svg viewBox="0 0 1000 700" preserveAspectRatio="none"><g id="moving-sleepers"></g><path d="M495 420 150 700M505 420 850 700" stroke="#bdc4a1" stroke-width="4" fill="none" opacity=".4"/></svg></div><div class="travel-phase" id="travel-phase" aria-hidden="true"><i></i><span id="travel-phase-label"></span></div><div class="speed-lines" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>
        <div class="passing-posts" aria-hidden="true"><i></i><i></i></div>
        <div class="cab-window-heading"><p id="window-day">Day 01 / Wednesday, 25 Nov</p><h1 id="window-title">Hello, Kuala Lumpur.</h1></div>
        <div class="station-plaque" id="station-plaque"><span class="station-roundel" aria-hidden="true"><i></i></span><div><span id="station-number">Station 01</span><strong id="station-activity">City arrival</strong></div></div>
        <div class="windshield-bottom"><span id="scene-note">Your seat for a little adventure.</span><button type="button" id="skip-ride" hidden>Arrive now →</button></div>
        <p class="scenery-error" id="scenery-error" hidden>The scenery could not load. Your itinerary is still available below.</p>
        <div class="window-wiper" aria-hidden="true"></div>
      </section>
      <section class="driver-console" aria-label="Train driving controls">
        <div class="console-top-edge" aria-hidden="true"></div><i class="cab-screw screw-a" aria-hidden="true"></i><i class="cab-screw screw-b" aria-hidden="true"></i><i class="cab-screw screw-c" aria-hidden="true"></i><i class="cab-screw screw-d" aria-hidden="true"></i>
        <div class="instrument-cluster"><div class="speed-dial" aria-label="Train speed"><svg viewBox="0 0 180 180" aria-hidden="true"><circle cx="90" cy="90" r="80" fill="#e9e9d4"/><path d="M39 132a66 66 0 1 1 102 0" fill="none" stroke="#c8cbb5" stroke-width="8"/>${Array.from({length:9},(_,i)=>{const angle=(-140+i*35)*Math.PI/180;const x1=90+Math.sin(angle)*62;const y1=90-Math.cos(angle)*62;const x2=90+Math.sin(angle)*70;const y2=90-Math.cos(angle)*70;return `<path d="M${x1} ${y1} ${x2} ${y2}" stroke="#56786a" stroke-width="2"/>`;}).join('')}<g fill="#56786a" font-family="Trebuchet MS,sans-serif" font-size="11"><text x="28" y="145">0</text><text x="25" y="65">20</text><text x="83" y="30">40</text><text x="139" y="65">60</text><text x="142" y="145">80</text></g><g id="speed-needle" transform="rotate(-140 90 90)"><path d="M87 94 90 35 93 94Z" fill="#d5784b"/></g><circle cx="90" cy="90" r="9" fill="#456459"/></svg><div class="speed-readout"><strong id="speed-value">0</strong><span>km/h</span></div></div><div class="signal-pill"><i id="signal-lamp" aria-hidden="true"></i><span id="train-state">Parked at station</span></div></div>
        <div class="route-console"><div class="route-display"><div class="display-date"><span id="console-weekday">Wednesday</span><strong id="console-date">25 Nov</strong></div><div class="display-destination"><span id="destination-caption">You’ve arrived at</span><strong id="console-destination">Kuala Lumpur</strong><span id="next-stop-label">Next · 26 Nov / Skyline Luge</span></div><div class="display-day-count"><strong id="console-day-number">01</strong><span>of 07</span></div></div><div class="console-rail" aria-label="Choose a trip station"><div class="console-rail-line" aria-hidden="true"></div>${stationDays.map((day,i)=>`<button type="button" class="rail-day ${i===0?'current':''}" data-rail-day="${i}" aria-label="Go to ${day.date}: ${day.highlight}" ${i===0?'aria-current="step"':''}><i aria-hidden="true"></i><span class="rail-date">${day.date}</span><strong class="rail-highlight">${day.highlight}</strong></button>`).join('')}</div><div class="console-bottom-row"><button type="button" class="itinerary-button" id="open-itinerary"><span aria-hidden="true">▤</span> Open day’s itinerary</button><p id="cab-hint">You’re the driver. Push the lever to explore the next stop.</p></div></div>
        <div class="throttle-cluster"><div class="direction-control" role="group" aria-label="Travel direction"><button type="button" data-direction="-1" aria-pressed="false" title="Travel to the previous stop">Reverse</button><button type="button" data-direction="1" aria-pressed="true" title="Travel to the next stop">Forward</button></div><div class="throttle-well"><div class="throttle-slot" aria-hidden="true"><span>Go</span><i></i><span>Rest</span></div><div class="lever-mechanism" id="lever-mechanism"><div class="lever-foot" aria-hidden="true"></div><div class="lever-stem" aria-hidden="true"></div><button type="button" class="lever-grip" id="lever-grip" aria-label="Push lever to travel to the next stop"><span class="grip-highlight" aria-hidden="true"></span><span aria-hidden="true">▴</span></button></div></div><p class="lever-label" id="lever-label">Push to depart <span>or click the red handle</span></p></div>
      </section>
      <div class="cab-footnote"><span>Made for the memories.</span><span id="journey-status" role="status">Parked at Day 1. Open the itinerary or push the lever to depart.</span><span>Est. 2026 / JB + KL</span></div>
      <dialog class="itinerary-dialog" id="itinerary-dialog" aria-labelledby="itinerary-title"><div class="itinerary-sheet"><header class="sheet-header"><div><p id="sheet-date"></p><h2 id="itinerary-title"></h2></div><button type="button" class="sheet-sound" id="sheet-sound" aria-label="Mute sound" aria-pressed="false">♫</button><button type="button" class="sheet-close" id="close-itinerary" aria-label="Close itinerary">×</button></header><div class="sheet-basecamp"><span>Tonight’s base camp</span><strong id="sheet-stay"></strong></div><div class="sheet-scroll" tabindex="0" role="region" aria-label="Scrollable daily activities" id="sheet-scroll"></div><footer class="sheet-footer"><span id="sheet-footnote">Times and prices from your plan.</span><button type="button" id="back-to-cab">Back to the driver’s seat</button></footer></div></dialog>
    </div>`;
  const cab=document.querySelector('#cab');
  const images=[document.querySelector('#landscape-0'),document.querySelector('#landscape-1')];
  const dialog=document.querySelector('#itinerary-dialog');
  let dismissOnBackdrop=false;
  let dialogPointerDown=false;
  const lever=document.querySelector('#lever-grip');
  const directionButtons=[...document.querySelectorAll('[data-direction]')];
  const audio=createCabAudio();
  const foodMap=createFoodMap({toggleMute:audio.toggleMute,isMuted:audio.isMuted});
  document.querySelector('#open-food-map').addEventListener('click',()=>foodMap.open());
  let railProgress=0;
  const sleeperGroup=document.querySelector('#moving-sleepers');
  sleeperGroup.innerHTML=Array.from({length:19},()=>'<path stroke="#876549" stroke-linecap="square"/>').join('');
  const sleepers=[...sleeperGroup.children];
  function animateRails(time,deltaTime) {
    if(document.hidden)return;
    railProgress=(railProgress+direction*Math.min(deltaTime,40)/1000*(speed.value/58)*.9+1)%1;
    sleepers.forEach((sleeper,index)=>{
      const depth=((index/sleepers.length+railProgress)%1)**2;
      const y=420+depth*310;
      const half=depth*405;
      sleeper.setAttribute('d',`M${500-half} ${y}H${500+half}`);
      sleeper.setAttribute('stroke-width',String(1+depth*12));
      sleeper.setAttribute('opacity',String(depth*.65));
    });
  }
  function setTravelPhase(phase) {
    cab.dataset.phase=phase;
    const next=targetIndex===null?current:targetIndex;
    const labels={departing:`Leaving ${stationDays[current].date} station`,cruising:'On the adventure line',arriving:`Arriving at ${stationDays[next].date} station`,parked:'Parked at station'};
    document.querySelector('#travel-phase-label').textContent=labels[phase];
    document.querySelector('#train-state').textContent=labels[phase];
    if(phase==='arriving') {
      document.querySelector('#window-day').textContent=`Stop ${String(next+1).padStart(2,'0')} / ${stationDays[next].weekday}, ${stationDays[next].date}`;
      document.querySelector('#window-title').textContent=scenes[next].title;
    }
  }
  const escapeContext = value => escapeText(value);
  images.forEach(image=>image.addEventListener('error',()=>document.querySelector('#scenery-error').hidden=false));
  function paintSpeed() {
    document.querySelector('#speed-value').textContent=Math.round(speed.value);
    audio.setSpeed(speed.value);
    document.querySelector('#speed-needle').setAttribute('transform',`rotate(${-140+speed.value*3.5} 90 90)`);
  }
  function setLever(value) {
    pushAmount=value;
    document.querySelector('#lever-mechanism').style.setProperty('--push',String(value));
  }
  function springLever() {
    if(window.gsap&&!motionQuery.matches){
      leverAnimation?.kill();
      const state={value:pushAmount};
      leverAnimation=gsap.to(state,{value:0,duration:.5,ease:'elastic.out(1,.5)',onUpdate:()=>setLever(state.value)});
    }else setLever(0);
  }
  function updateControls() {
    const atEnd=current+direction<0||current+direction>=stationDays.length;
    lever.disabled=travelling||atEnd;
    directionButtons.forEach(button=>{button.disabled=travelling;button.setAttribute('aria-pressed',Number(button.dataset.direction)===direction);});
    document.querySelector('#open-itinerary').disabled=travelling;
    document.querySelector('#open-food-map').disabled=travelling;
    document.querySelectorAll('[data-rail-day]').forEach(button=>{button.disabled=travelling;button.classList.toggle('pending',Number(button.dataset.railDay)===targetIndex);});
    document.querySelector('#skip-ride').hidden=!travelling;
    document.querySelector('#signal-lamp').classList.toggle('moving',travelling);
    document.querySelector('#train-state').textContent=travelling?'On the adventure line':'Parked at station';
    document.querySelector('#lever-label').innerHTML=travelling?'Enjoy the ride <span>Next station coming up</span>':atEnd?(direction===1?'End of the line <span>Switch to reverse to revisit a day</span>':'First station <span>Switch to forward to begin</span>'):'Push to depart <span>or click the red handle</span>';
    lever.setAttribute('aria-label',direction===1?'Push lever to travel to the next stop':'Push lever to travel to the previous stop');
    document.querySelector('#cab-hint').textContent=travelling?'Watch the world go by. Your itinerary opens when you arrive.':atEnd?(direction===1?'Home sweet home. Reverse to revisit your favourite day.':'Your adventure starts here. Switch to forward to depart.'):'You’re the driver. Push the lever to explore '+(direction===1?'the next stop.':'the previous stop.');
  }
  function updateStation() {
    const day=stationDays[current];
    const scene=scenes[current];
    document.title=`${day.date} · ${scene.activity} | Brickbound`;
    document.querySelector('#window-day').textContent=`Stop ${String(current+1).padStart(2,'0')} / ${day.weekday}, ${day.date}`;
    document.querySelector('#window-title').textContent=scene.title;
    document.querySelector('#station-number').textContent=`Station ${String(current+1).padStart(2,'0')}`;
    document.querySelector('#station-activity').textContent=scene.activity;
    document.querySelector('#console-weekday').textContent=day.weekday;
    document.querySelector('#console-date').textContent=day.date;
    document.querySelector('#console-destination').textContent=current===6?'Singapore':current>=4?'Johor Bahru':'Kuala Lumpur';
    document.querySelector('#console-day-number').textContent=String(current+1).padStart(2,'0');
    document.querySelector('#destination-caption').textContent='You’ve arrived at';
    const next=current+direction;
    document.querySelector('#next-stop-label').textContent=next>=0&&next<scenes.length?`${direction===1?'Next':'Back'} · ${stationDays[next].date} / ${scenes[next].activity}`:'End of this adventure line';
    document.querySelectorAll('[data-rail-day]').forEach(dot=>{
      const index=Number(dot.dataset.railDay);
      dot.classList.toggle('current',index===current);
      dot.classList.toggle('passed',index<current);
      dot.setAttribute('aria-label',`Go to ${stationDays[index].date}: ${stationDays[index].highlight}${index===current?', current station':''}`);
      if(index===current)dot.setAttribute('aria-current','step');else dot.removeAttribute('aria-current');
    });
    cab.dataset.day=String(current);
    document.querySelector('#scene-note').textContent=current===5?'30 Nov–2 Dec / Three days at your Legoland base.':'Your seat for a little adventure.';
    document.querySelector('#journey-status').textContent=`Arrived at stop ${current+1}, ${day.date}. ${scene.activity}.`;
    updateControls();
  }
  function openItinerary() {
    if(travelling||dialog.open)return;
    const day=stationDays[current];
    document.querySelector('#sheet-date').textContent=`Stop ${String(current+1).padStart(2,'0')} / ${day.weekday}, ${day.date} 2026`;
    document.querySelector('#itinerary-title').textContent=day.title;
    document.querySelector('#sheet-stay').textContent=day.stay;
    document.querySelector('#sheet-scroll').innerHTML=day.items.length?`<table class="activities-table"><caption class="cab-sr-only">Activities for ${escapeContext(day.date)}</caption><thead><tr><th scope="col">When</th><th scope="col">The plan</th></tr></thead><tbody>${day.items.map(item=>`<tr><th scope="row">${escapeContext(item.time)}</th><td><strong>${escapeContext(item.title)}</strong>${item.booked?'<span class="activity-booked">Booked</span>':''}<p>${escapeContext(item.note)}</p>${item.options?`<ul>${item.options.map(option=>`<li>${escapeContext(option)}</li>`).join('')}</ul>`:''}</td></tr>`).join('')}</tbody></table>`:`<div class="free-day-card"><span aria-hidden="true">▦</span><h3>A day with room to play.</h3><p>No activities planned yet.<br>Your Legoland Hotel base is set. The rest is yours to build.</p><small>The scene shows your base, not a booked park visit.</small></div>`;
    if(day.groupedDays) document.querySelector('#sheet-scroll').innerHTML=`<p class="grouped-legoland-note">One Legoland stop for 30 November–2 December. Detailed activities can be added later.</p><table class="activities-table"><thead><tr><th scope="col">Date</th><th scope="col">The plan</th></tr></thead><tbody>${day.groupedDays.map(d=>`<tr><th scope="row">${escapeContext(d.date)}</th><td><strong>Legoland</strong><p>Daily details to come.</p></td></tr>`).join('')}</tbody></table>`;
    document.querySelector('#sheet-footnote').textContent=day.items.some(item=>item.options)?'Prices are from your plan, not live quotes. “$” currency is as supplied.':'Your plan, ready when you need it.';
    dismissOnBackdrop=false;
    dialogPointerDown=false;
    dialog.showModal();
    document.querySelector('#sheet-scroll').scrollTop=0;
    if(window.gsap&&!motionQuery.matches){dialogAnimation?.revert();dialogAnimation=gsap.from('.itinerary-sheet',{y:32,scale:.97,autoAlpha:0,duration:.45,ease:'power3.out'});}
  }
  function closeItinerary() { dialogAnimation?.revert();dialog.close();lever.focus({preventScroll:true}); }
  function finishArrival(index,newLayer,token) {
    if(token!==driveToken||!travelling)return;
    journey?.kill();cabShake?.kill();
    if(window.gsap)gsap.ticker.remove(animateRails);
    audio.approach();audio.parked();
    if(window.gsap)gsap.set('#windshield-landscape',{clearProps:'transform'});
    if(window.gsap)gsap.set('#station-plaque',{clearProps:'transform,opacity,visibility'});
    if(window.gsap)gsap.set('.passing-posts i',{clearProps:'transform,opacity,visibility'});
    images[activeLayer].classList.add('inactive');
    if(window.gsap)gsap.set(images[activeLayer],{autoAlpha:0});
    images[newLayer].classList.remove('inactive');
    images[newLayer].style.opacity='1';
    if(window.gsap)gsap.set(images[newLayer],{autoAlpha:1,clearProps:'transform,filter'});
    else images[newLayer].style.transform='';
    images[newLayer].alt=`Toy-brick railway at ${scenes[index].activity}.`;
    images[newLayer].removeAttribute('aria-hidden');
    images[activeLayer].setAttribute('aria-hidden','true');
    activeLayer=newLayer;
    current=index;targetIndex=null;travelling=false;
    speed.value=0;paintSpeed();
    cab.classList.remove('is-travelling');
    setTravelPhase('parked');
    updateStation();
    openItinerary();
  }
  async function drive(target=null,express=false) {
    if(travelling||dialog.open)return;
    const next=Number.isInteger(target)?target:current+direction;
    if(next===current){openItinerary();return;}
    if(next<0||next>=scenes.length)return;
    direction=next>current?1:-1;
    travelling=true;targetIndex=next;
    const token=++driveToken;
    const nextLayer=1-activeLayer;
    const incoming=images[nextLayer];
    incoming.src=source(next);
    incoming.style.objectPosition=scenes[next].position;
    document.querySelector('#scenery-error').hidden=true;
    document.querySelector('#destination-caption').textContent=direction===1?'On our way to':'Rolling back to';
    document.querySelector('#console-destination').textContent=scenes[next].activity;
    document.querySelector('#next-stop-label').textContent=`Arriving · ${stationDays[next].date}`;
    document.querySelector('#journey-status').textContent=`Departing for ${stationDays[next].date}, ${scenes[next].activity}.`;
    updateControls();
    cab.classList.add('is-travelling');
    try { await incoming.decode(); } catch { document.querySelector('#scenery-error').hidden=false; }
    if(!travelling||token!==driveToken)return;
    if(!window.gsap||motionQuery.matches){finishArrival(next,nextLayer,token);return;}
    audio.depart();
    setTravelPhase('departing');
    gsap.ticker.add(animateRails);
    incoming.classList.remove('inactive');
    gsap.set(incoming,{scale:1,autoAlpha:0,xPercent:0,filter:'blur(2px)',transformOrigin:'50% 58%'});
    gsap.set(images[activeLayer],{scale:1.12,autoAlpha:1,filter:'blur(0px)'});
    journey=gsap.timeline({defaults:{ease:'power2.inOut'},onComplete:()=>finishArrival(next,nextLayer,token)})
      .addLabel('depart',0).addLabel('cruise',2.1).addLabel('approach',4.7).addLabel('stop',7.2)
      .to(speed,{value:58,duration:1.8,onUpdate:paintSpeed},'depart')
      .to(images[activeLayer],{scale:1.65,xPercent:direction===1?-4:4,filter:'blur(3px)',duration:3.3,ease:'power2.in'},'depart')
      .to('#station-plaque',{xPercent:direction===1?-180:180,autoAlpha:0,duration:1.5,ease:'power2.in'},'depart')
      .call(()=>setTravelPhase('cruising'),null,'cruise')
      .to(images[activeLayer],{autoAlpha:0,duration:1.2},2.3)
      .to(incoming,{autoAlpha:1,scale:1.05,filter:'blur(0px)',duration:2.2},2.3)
      .fromTo('.passing-posts i',{xPercent:0,autoAlpha:0},{xPercent:i=>i===0?-220:220,autoAlpha:.45,duration:.65,stagger:.15,repeat:4,ease:'power2.in'},.9)
      .call(()=>{setTravelPhase('arriving');audio.approach();},null,'approach')
      .to('.passing-posts i',{autoAlpha:0,duration:.5},'approach')
      .to(speed,{value:0,duration:2.5,onUpdate:paintSpeed,ease:'power2.out'},'approach')
      .to(incoming,{scale:1.12,duration:2.7,ease:'power2.out'},4.5)
      .to({}, {duration:.4},'stop');
    cabShake=gsap.to('#windshield-landscape',{y:1.7,x:1,duration:.12,repeat:57,yoyo:true,ease:'sine.inOut'});
    if(express){journey.timeScale(3.4);cabShake.timeScale(3.4);}
  }
  function setDirection(value) {
    if(travelling)return;
    direction=value;
    updateStation();
  }
  document.querySelector('#open-itinerary').addEventListener('click',openItinerary);
  document.querySelector('#close-itinerary').addEventListener('click',closeItinerary);
  document.querySelector('#back-to-cab').addEventListener('click',closeItinerary);
  dialog.addEventListener('cancel',()=>{dialogAnimation?.revert();});
  // An instant touch arrival may open the dialog before the lever's click lands.
  dialog.addEventListener('pointerdown',event=>{
    dialogPointerDown=true;
    const rect=dialog.getBoundingClientRect();
    dismissOnBackdrop=event.target===dialog&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom);
  });
  dialog.addEventListener('click',event=>{
    if(event.detail>0&&!dialogPointerDown){event.preventDefault();event.stopImmediatePropagation();}
  },true);
  dialog.addEventListener('click',event=>{const dismiss=dismissOnBackdrop;dismissOnBackdrop=false;dialogPointerDown=false;if(dismiss&&event.target===dialog)closeItinerary();});
  directionButtons.forEach(button=>button.addEventListener('click',()=>setDirection(Number(button.dataset.direction))));
  document.querySelectorAll('[data-rail-day]').forEach(button=>button.addEventListener('click',()=>drive(Number(button.dataset.railDay),true)));
  lever.addEventListener('pointerdown',event=>{
    if(travelling||lever.disabled)return;
    pointerStart={y:event.clientY,id:event.pointerId};
    leverAnimation?.kill();
    lever.setPointerCapture(event.pointerId);
    lever.classList.add('grabbing');
  });
  lever.addEventListener('pointermove',event=>{if(!pointerStart)return;setLever(Math.max(0,Math.min(1,(pointerStart.y-event.clientY)/70)));});
  lever.addEventListener('pointerup',event=>{
    if(!pointerStart)return;
    const movement=pointerStart.y-event.clientY;
    pointerStart=null;
    lever.classList.remove('grabbing');
    if(lever.hasPointerCapture(event.pointerId))lever.releasePointerCapture(event.pointerId);
    const depart=movement>26||Math.abs(movement)<8;
    if(depart)setLever(1);
    springLever();
    if(depart)drive();
  });
  lever.addEventListener('pointercancel',()=>{pointerStart=null;lever.classList.remove('grabbing');springLever();});
  lever.addEventListener('click',event=>{if(event.detail===0){setLever(1);springLever();drive();}});
  lever.addEventListener('keydown',event=>{
    if(event.key==='ArrowUp'||event.key==='ArrowDown'){
      event.preventDefault();setDirection(event.key==='ArrowUp'?1:-1);setLever(1);springLever();drive();
    }
  });
  document.querySelector('#skip-ride').addEventListener('click',()=>{if(travelling&&targetIndex!==null)finishArrival(targetIndex,1-activeLayer,driveToken);});
  motionQuery.addEventListener('change',()=>{
    if(motionQuery.matches){
      leverAnimation?.kill();setLever(0);dialogAnimation?.revert();
      if(travelling&&targetIndex!==null)finishArrival(targetIndex,1-activeLayer,driveToken);
    }
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){journey?.pause();cabShake?.pause();}
    else if(travelling){journey?.resume();cabShake?.resume();}
  });
  const preload = new Set();
  scenes.forEach((scene,index)=>{if(!preload.has(scene.image)){preload.add(scene.image);const image=new Image();image.src=source(index);}});
  updateStation();
  paintSpeed();
}
