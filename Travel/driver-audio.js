function createCabAudio() {
  const defaults = { muted: false, music: .28, effects: .65 };
  let settings = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem('brickbound-audio-v1') || '{}');
    settings.muted = typeof saved.muted === 'boolean' ? saved.muted : defaults.muted;
    for (const category of ['music','effects']) if (typeof saved[category] === 'number' && Number.isFinite(saved[category])) settings[category] = Math.max(0,Math.min(1,saved[category]));
  } catch {}
  const tracks = {};
  for (const [name,file,loop] of [['music','background-waltz.mp3',true],['running','train-running.mp3',true],['arrival','train-arrive-station.mp3',false]]) {
    const element = document.createElement('audio');
    element.id = `cab-audio-${name}`;
    element.src = `audio/${file}`;
    element.loop = loop;
    element.preload = name === 'music' ? 'metadata' : 'auto';
    element.volume = 0;
    element.muted = settings.muted;
    element.hidden = true;
    document.querySelector('#cab').append(element);
    tracks[name] = element;
  }
  let unlocked = false;
  let prime = Promise.resolve();
  let state = 'parked';
  let speed = 0;
  let musicDuck = 1;
  let runningGain = 0;
  let arrivalGain = 0;
  let musicFade;
  let runningFade;
  let arrivalFade;
  let runToken = 0;
  let cueToken = 0;
  const panel = document.querySelector('#cab-sound');
  function mix() {
    tracks.music.volume = settings.music * musicDuck;
    tracks.running.volume = settings.effects * runningGain * (.2 + .6 * Math.min(speed/58,1));
    tracks.arrival.volume = settings.effects * arrivalGain * .8;
    Object.values(tracks).forEach(track => { track.muted = settings.muted; });
  }
  function fade(from,to,duration,update,complete) {
    const start = performance.now();
    const animation = { frame: 0, cancelled: false };
    function tick(now) {
      if (animation.cancelled) return;
      const progress = Math.min(1,(now-start)/duration);
      update(from+(to-from)*(progress*progress*(3-2*progress)));
      if (progress<1) animation.frame=requestAnimationFrame(tick);
      else complete?.();
    }
    animation.frame=requestAnimationFrame(tick);
    return animation;
  }
  function cancel(animation) { if(animation) { animation.cancelled=true;cancelAnimationFrame(animation.frame); } }
  function duck(value,duration=500) {
    cancel(musicFade);
    musicFade=fade(musicDuck,value,duration,gain=>{musicDuck=gain;mix();});
  }
  function play(track) {
    if(!unlocked || settings.muted || document.hidden)return;
    const result=track.play();
    result?.catch(()=>{panel.dataset.playback='waiting';if(track===tracks.arrival)duck(1,500);});
  }
  function ensureMusic() { if(tracks.music.paused) play(tracks.music); }
  function stop(track) { track.pause();try { track.currentTime=0; } catch {} }
  function renderSettings() {
    document.querySelector('#sound-mute').setAttribute('aria-pressed',settings.muted);
    document.querySelector('#sound-mute').textContent=settings.muted?'Turn sound on':'Mute all sound';
    document.querySelector('#sound-summary').textContent=settings.muted?'Sound off':'Sound on';
    panel.classList.toggle('sound-muted',settings.muted);
    document.querySelector('#sheet-sound').setAttribute('aria-pressed',settings.muted);
    document.querySelector('#sheet-sound').setAttribute('aria-label',settings.muted?'Unmute sound':'Mute sound');
    document.querySelectorAll('[data-cab-mute]').forEach(button=>{button.setAttribute('aria-pressed',settings.muted);button.setAttribute('aria-label',settings.muted?'Unmute sound':'Mute sound');});
    for(const category of ['music','effects']) {
      document.querySelector(`#sound-${category}`).value=Math.round(settings[category]*100);
      document.querySelector(`#sound-${category}-value`).textContent=`${Math.round(settings[category]*100)}%`;
    }
    mix();
  }
  function save() { try { localStorage.setItem('brickbound-audio-v1',JSON.stringify(settings)); } catch {} }
  function unlock(event) {
    if(!event.isTrusted || event.type==='keydown' && !['Enter',' ','ArrowUp','ArrowDown'].includes(event.key))return;
    if(!unlocked) {
      unlocked=true;
      prime=Promise.allSettled([tracks.running,tracks.arrival].map(async track=>{
        track.muted=true;
        try { await track.play();track.pause();track.currentTime=0; } catch {}
        track.muted=settings.muted;
      }));
      panel.dataset.playback='ready';
    }
    ensureMusic();
  }
  function depart() {
    state='running';speed=0;
    const token=++runToken;
    ++cueToken;
    cancel(arrivalFade);arrivalGain=0;stop(tracks.arrival);
    cancel(runningFade);runningGain=0;
    duck(.38);
    prime.then(()=>{
      if(token!==runToken || state!=='running')return;
      stop(tracks.running);play(tracks.running);
      runningFade=fade(runningGain,1,600,gain=>{runningGain=gain;mix();});
    });
  }
  function approach() {
    if(state==='arriving')return;
    state='arriving';
    ++runToken;
    const token=++cueToken;
    cancel(runningFade);
    runningFade=fade(runningGain,0,500,gain=>{runningGain=gain;mix();},()=>stop(tracks.running));
    prime.then(()=>{
      if(token!==cueToken || state==='running')return;
      if(settings.muted||document.hidden){if(state==='parked')duck(1,500);return;}
      duck(.38,150);cancel(arrivalFade);stop(tracks.arrival);arrivalGain=1;mix();play(tracks.arrival);
    });
  }
  function parked() {
    if(state==='running')approach();
    state='parked';++runToken;
    cancel(runningFade);runningGain=0;stop(tracks.running);speed=0;mix();
    if(tracks.arrival.paused)duck(1,900);
  }
  tracks.arrival.addEventListener('ended',()=>{arrivalGain=0;mix();duck(1,900);});
  tracks.arrival.addEventListener('error',()=>duck(1,500));
  document.addEventListener('pointerdown',unlock,true);
  document.addEventListener('keydown',unlock,true);
  function toggleMute() {
    settings.muted=!settings.muted;save();renderSettings();
    if(!settings.muted){ensureMusic();if(state==='running')play(tracks.running);}
  }
  document.querySelector('#sound-mute').addEventListener('click',toggleMute);
  document.querySelector('#sheet-sound').addEventListener('click',toggleMute);
  for(const category of ['music','effects']) document.querySelector(`#sound-${category}`).addEventListener('input',event=>{
    settings[category]=Number(event.target.value)/100;save();renderSettings();
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) Object.values(tracks).forEach(track=>track.pause());
    else {ensureMusic();if(state==='running')play(tracks.running);else if(state==='arriving'&&!tracks.arrival.ended)play(tracks.arrival);else duck(1,500);}
  });
  window.addEventListener('pagehide',()=>{++runToken;++cueToken;Object.values(tracks).forEach(track=>track.pause());cancel(musicFade);cancel(runningFade);cancel(arrivalFade);});
  renderSettings();
  return { depart, approach, parked, toggleMute, isMuted:()=>settings.muted, setSpeed(value) { speed=value;mix(); } };
}
