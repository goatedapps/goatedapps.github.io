function createFoodMap({toggleMute,isMuted}) {
  const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const original = file => `images/itinerary-images/${encodeURIComponent(file)}`;
  const thumbnail = file => `images/food-thumbs/${encodeURIComponent(file.toLowerCase().replace(/\.(png|jpe?g|webp)$/i,'.webp'))}`;
  let area = FOOD_MAP_AREAS[0];
  let restaurant = area.restaurants[0];
  let photo = 0;
  let photoCollection;
  let reveal;
  let swipeStart;
  const bowl = `<svg viewBox="0 0 80 70" aria-hidden="true"><path d="M10 32h60q-5 25-30 25T10 32" fill="#e9be67"/><ellipse cx="40" cy="32" rx="30" ry="9" fill="#f9edcc"/><path d="M23 29q6-10 12 0t12 0t12 0M28 20q-5-7 0-13m15 13q-5-7 0-13" stroke="#86976b" fill="none" stroke-width="3"/><path d="m57 28 12-23m-6 26 12-24" stroke="#536f58" stroke-width="3"/><path d="M25 59h30" stroke="#cfa551" stroke-width="4"/></svg>`;
  const mapArt='<img class="food-map-art" src="images/kl-food-compass.webp" alt="Illustrated toy-brick map of the five KL food areas">';
  const host=document.createElement('div');
  host.innerHTML=`<dialog class="food-map-dialog" id="food-map-dialog" aria-labelledby="food-map-title"><div class="food-map-sheet"><header class="food-map-header"><div><h2 id="food-map-title">KL Food Compass</h2></div><button type="button" class="food-map-mute" data-cab-mute aria-pressed="${isMuted()}" aria-label="${isMuted()?'Unmute sound':'Mute sound'}">♫</button><button type="button" class="food-map-close" aria-label="Close food map">×</button></header><div class="food-map-layout"><section class="food-map-board" aria-label="Illustrated map of five KL food areas"><div class="food-map-pan"><div class="food-map-canvas">${mapArt}${FOOD_MAP_AREAS.map(a=>`<button type="button" class="food-area-marker marker-${a.color}" data-area="${a.id}" aria-pressed="${a.id==='home'}" aria-label="Explore ${escape(a.name)}${a.id==='home'?', Home':''}" style="left:${a.x}%;top:${a.y}%"><span class="area-marker-name">${a.id==='home'?'<b class="home-badge">Home</b>':''}${escape(a.name)}</span><span class="area-map-dot" aria-hidden="true"></span></button>`).join('')}</div></div></section><aside class="food-map-sidebar"><button type="button" class="food-back-map" id="food-back-map">↑ Back to the map</button><div class="food-area-intro" id="food-area-intro"></div><div class="food-restaurant-list" id="food-restaurant-list" aria-label="Food options in selected area"></div><section class="food-photo-section" id="food-photo-section" aria-label="Selected restaurant photos"></section></aside></div><footer class="food-map-footer"><button type="button" id="food-map-done">Back to the driver’s seat</button></footer></div></dialog><dialog class="food-photo-dialog" id="food-photo-dialog" aria-labelledby="food-photo-title"><header><div><h3 id="food-photo-title"></h3><span id="food-photo-counter"></span></div><button type="button" class="food-photo-close" aria-label="Close photo">×</button></header><div class="food-full-photo"><div class="food-photo-image"><img id="food-full-photo" alt=""></div><button type="button" class="food-photo-arrow photo-arrow-left" id="food-photo-prev" aria-label="Previous photo">‹</button><button type="button" class="food-photo-arrow photo-arrow-right" id="food-photo-next" aria-label="Next photo">›</button></div></dialog>`;
  document.querySelector('#cab').append(host);
  const dialog=host.querySelector('#food-map-dialog');
  const viewer=host.querySelector('#food-photo-dialog');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  function showRestaurant(id,animate=true) {
    restaurant=area.restaurants.find(r=>r.id===id)||area.restaurants[0];
    document.querySelectorAll('[data-restaurant]').forEach(button=>button.setAttribute('aria-pressed',button.dataset.restaurant===restaurant.id));
    host.querySelector('#food-photo-section').innerHTML=`<div class="food-photo-heading"><h4>${escape(restaurant.name)}</h4></div>${restaurant.images.length?`<button type="button" class="food-feature-photo" data-photo="0" aria-label="View ${escape(restaurant.name)} photo 1 full size"><img src="${thumbnail(restaurant.images[0])}" alt="${escape(restaurant.name)}: supplied photo 1"></button><div class="food-photo-thumbnails">${restaurant.images.map((file,i)=>`<button type="button" data-photo="${i}" aria-label="View ${escape(restaurant.name)} photo ${i+1}"><img src="${thumbnail(file)}" alt="" loading="lazy"></button>`).join('')}</div>`:`<div class="food-no-photo">${bowl}<strong>No photos yet</strong></div>`}`;
    if(animate&&window.gsap&&!media.matches){reveal?.revert();reveal=gsap.from('#food-photo-section',{autoAlpha:0,y:8,duration:.25,ease:'power2.out'});}
  }
  function showArea(id,scrollToFood=false) {
    area=FOOD_MAP_AREAS.find(a=>a.id===id)||FOOD_MAP_AREAS[0];
    host.querySelectorAll('[data-area]').forEach(marker=>marker.setAttribute('aria-pressed',marker.dataset.area===area.id));
    host.querySelector('#food-area-intro').innerHTML=`${area.id==='home'?'<b class="home-badge">Home</b>':''}<h3>${escape(area.name)}</h3>`;
    host.querySelector('#food-restaurant-list').innerHTML=area.restaurants.map(r=>`<button type="button" data-restaurant="${r.id}" aria-pressed="false"><span>${escape(r.name)}${r.note?`<small>${escape(r.note)}</small>`:''}</span><span class="food-photo-badge">${r.images.length?'▧':''}</span></button>`).join('');
    showRestaurant(area.restaurants[0].id,false);
    host.querySelector('.food-map-sidebar').scrollTop=0;
    const marker=host.querySelector(`[data-area="${area.id}"]`);
    const pan=host.querySelector('.food-map-pan');
    const markerBounds=marker.getBoundingClientRect();
    const panBounds=pan.getBoundingClientRect();
    pan.scrollLeft+=markerBounds.x+markerBounds.width/2-panBounds.x-panBounds.width/2;
    if(scrollToFood&&matchMedia('(max-width:700px)').matches){
      const layout=host.querySelector('.food-map-layout');
      const sidebar=host.querySelector('.food-map-sidebar');
      layout.scrollTo({top:sidebar.offsetTop-layout.offsetTop,behavior:media.matches?'auto':'smooth'});
    }
  }
  function showPhoto(index) {
    photo=((index%photoCollection.images.length)+photoCollection.images.length)%photoCollection.images.length;
    const file=photoCollection.images[photo];
    host.querySelector('#food-photo-title').textContent=photoCollection.name;
    host.querySelector('#food-photo-counter').textContent=`Photo ${photo+1} of ${photoCollection.images.length}`;
    const image=host.querySelector('#food-full-photo');
    image.src=original(file);image.alt=`${photoCollection.name}, supplied photo ${photo+1}`;
    host.querySelector('#food-photo-prev').disabled=photoCollection.images.length<2;
    host.querySelector('#food-photo-next').disabled=photoCollection.images.length<2;
    if(!viewer.open)viewer.showModal();
  }
  function close() { reveal?.revert();dialog.close();document.querySelector('#open-food-map').focus({preventScroll:true}); }
  host.addEventListener('click',event=>{
    const marker=event.target.closest('[data-area]');
    const food=event.target.closest('[data-restaurant]');
    const image=event.target.closest('[data-photo]');
    if(marker)showArea(marker.dataset.area,true);
    else if(food)showRestaurant(food.dataset.restaurant);
    else if(image){photoCollection=restaurant;showPhoto(Number(image.dataset.photo));}
  });
  host.querySelector('#food-back-map').addEventListener('click',()=>host.querySelector('.food-map-layout').scrollTo({top:0,behavior:media.matches?'auto':'smooth'}));
  host.querySelector('.food-map-close').addEventListener('click',close);
  host.querySelector('#food-map-done').addEventListener('click',close);
  host.querySelector('[data-cab-mute]').addEventListener('click',toggleMute);
  host.querySelector('.food-photo-close').addEventListener('click',()=>viewer.close());
  host.querySelector('#food-photo-prev').addEventListener('click',()=>showPhoto(photo-1));
  host.querySelector('#food-photo-next').addEventListener('click',()=>showPhoto(photo+1));
  const photoSurface=host.querySelector('.food-full-photo');
  photoSurface.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'&&!event.target.closest('button'))swipeStart={x:event.clientX,y:event.clientY};});
  photoSurface.addEventListener('pointerup',event=>{if(!swipeStart)return;const dx=event.clientX-swipeStart.x;const dy=event.clientY-swipeStart.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy))showPhoto(photo+(dx<0?1:-1));swipeStart=null;});
  photoSurface.addEventListener('pointercancel',()=>{swipeStart=null;});
  viewer.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();showPhoto(photo+(event.key==='ArrowLeft'?-1:1));}
  });
  for(const modal of [dialog,viewer]){
    let outside=false;
    modal.addEventListener('pointerdown',event=>{const rect=modal.getBoundingClientRect();outside=event.target===modal&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom);});
    modal.addEventListener('click',event=>{if(outside&&event.target===modal){modal===dialog?close():viewer.close();}outside=false;});
  }
  showArea('home');
  return {openPhotos(collection,index=0){photoCollection=collection;showPhoto(index);},open(){if(!dialog.open){dialog.showModal();showArea(area.id);}}};
}
