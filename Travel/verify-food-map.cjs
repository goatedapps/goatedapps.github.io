const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');

(async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const url=pathToFileURL(path.join(__dirname,'2026JB-KL.html')).href;
  const errors=[];
  const arrive=(page,index)=>page.waitForFunction(index=>document.querySelector('#cab').dataset.day===String(index)&&document.querySelector('#itinerary-dialog').open,index);
  try {
    const page=await browser.newPage({viewport:{width:1440,height:1000},hasTouch:true});
    page.on('pageerror',error=>errors.push(error.message));
    await page.goto(url);
    assert.equal(await page.locator('button[data-rail-day]').count(),7);
    assert.match(await page.locator('[data-rail-day="5"]').textContent(),/30 Nov–2 Dec.*Legoland/);
    await page.evaluate(()=>{window.visited=[];new MutationObserver(mutations=>{for(const mutation of mutations)if(mutation.attributeName==='data-day')window.visited.push(document.querySelector('#cab').dataset.day);}).observe(document.querySelector('#cab'),{attributes:true,attributeFilter:['data-day']});});
    const start=Date.now();
    await page.locator('[data-rail-day="5"]').click();
    await arrive(page,5);
    assert.ok(Date.now()-start<5500,'Express journey skips the full-length ride');
    assert.deepEqual(await page.evaluate(()=>window.visited),['5'],'Direct travel does not visit intermediate dates');
    assert.equal(await page.locator('.activities-table tbody tr').count(),3);
    assert.match(await page.locator('#sheet-date').textContent(),/30 Nov–2 Dec/);
    await page.keyboard.press('Escape');
    await page.screenshot({path:path.join(__dirname,'previews/driver-seven-stops.png')});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.locator('[data-rail-day="2"]').click();await arrive(page,2);
    assert.equal(await page.locator('.activity-booked').textContent(),'Booked');
    await page.keyboard.press('Escape');
    await page.locator('[data-rail-day="2"]').click();
    assert.equal(await page.locator('#itinerary-dialog').getAttribute('open'),'');
    await page.keyboard.press('Escape');
    await page.locator('#open-food-map').click();
    assert.equal(await page.locator('[data-area]').count(),5);
    assert.equal(await page.locator('.home-badge').first().textContent(),'Home');
    assert.equal(await page.locator('#food-map-title').textContent(),'KL Food Compass');
    assert.equal(await page.locator('.food-map-legend,.food-map-caption,.food-map-footer>span').count(),0);
    await page.locator('.food-map-art').evaluate(image=>image.decode());
    assert.equal(await page.locator('[data-restaurant]').count(),4);
    await page.locator('.food-feature-photo img').evaluate(image=>image.decode());
    await page.screenshot({path:path.join(__dirname,'previews/food-map-desktop.png')});
    let photos=0;
    for(const [area,id,count] of [['home','tangkak',3],['home','tea-garden',3],['home','palates',3],['lalaport','sukiya',3],['lalaport','parathai',6],['lalaport','leten',3],['nu-sentral','dolly',2],['pavilion','fei-fei',5],['pudu','tangfei',4]]) {
      await page.locator(`[data-area="${area}"]`).click();
      await page.locator(`[data-restaurant="${id}"]`).click();
      assert.equal(await page.locator('.food-photo-thumbnails button').count(),count);
      await page.locator('.food-feature-photo').click();
      for(let index=0;index<count;index++) {
        const image=page.locator('#food-full-photo');
        await image.evaluate(element=>element.decode());
        assert.ok(await image.evaluate(element=>element.naturalWidth>0));
        photos++;
        if(index<count-1)await page.locator('#food-photo-next').click();
      }
      assert.equal(await page.locator('#food-photo-next').isEnabled(),true);
      await page.locator('#food-photo-next').click();
      assert.equal(await page.locator('#food-photo-counter').textContent(),`Photo 1 of ${count}`);
      await page.locator('#food-photo-prev').click();
      assert.equal(await page.locator('#food-photo-counter').textContent(),`Photo ${count} of ${count}`);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#food-map-dialog').getAttribute('open'),'');
    }
    assert.equal(photos,32);
    await page.locator('[data-area="lalaport"]').click();
    await page.locator('[data-restaurant="oiso"]').click();
    assert.match(await page.locator('.food-no-photo').textContent(),/No photos yet/);
    await page.locator('[data-area="nu-sentral"]').click();
    assert.match(await page.locator('#food-restaurant-list').textContent(),/Dolly Dim Sum/);
    await page.locator('[data-area="pavilion"]').click();
    const options=await page.locator('#food-restaurant-list').textContent();
    for(const name of ['Oriental Kopi','Madam Kwan’s','Fei Fei Crab','Ippudo'])assert.ok(options.includes(name));
    const music=await page.locator('#cab-audio-music').evaluate(track=>({paused:track.paused,time:track.currentTime}));
    assert.equal(music.paused,false,'Music continues in food map');
    await page.locator('[data-cab-mute]').click();
    assert.ok(await page.evaluate(()=>[...document.querySelectorAll('audio')].every(track=>track.muted)));
    await page.locator('[data-cab-mute]').click();
    await page.locator('#food-map-done').click();
    for(const width of [320,390,768,1024,1440]) {
      await page.setViewportSize({width,height:844});
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Cab fits ${width}`);
      assert.ok(await page.locator('[data-rail-day="0"] .rail-date').isVisible(),'Dates remain visible on phone');
    }
    await page.setViewportSize({width:390,height:844});
    await page.locator('[data-rail-day="6"]').tap();await arrive(page,6);
    assert.match(await page.locator('.activities-table').textContent(),/19:05/);
    await page.keyboard.press('Escape');
    await page.screenshot({path:path.join(__dirname,'previews/driver-stations-mobile.png')});
    await page.locator('#open-food-map').tap();
    await page.locator('[data-area="home"]').click();
    await page.locator('.food-feature-photo img').evaluate(image=>image.decode());
    await page.locator('#food-back-map').click();
    await page.screenshot({path:path.join(__dirname,'previews/food-map-mobile.png')});
    const modalBounds=await page.locator('#food-map-dialog').boundingBox();
    assert.ok(modalBounds.x>=0&&modalBounds.x+modalBounds.width<=390);
    await page.locator('[data-area="lalaport"]').click();
    await page.locator('[data-restaurant="parathai"]').click();
    await page.locator('.food-feature-photo').click();
    await page.locator('#food-full-photo').evaluate(image=>image.decode());
    for(const selector of ['#food-photo-prev','#food-photo-next']){
      const arrow=await page.locator(selector).boundingBox();
      assert.ok(arrow.x>=0&&arrow.x+arrow.width<=390&&arrow.height>=44,'Photo arrows are prominent and reachable on phones');
    }
    await page.locator('#food-photo-next').tap();
    assert.equal(await page.locator('#food-photo-counter').textContent(),'Photo 2 of 6');
    await page.locator('#food-photo-prev').tap();
    assert.equal(await page.locator('#food-photo-counter').textContent(),'Photo 1 of 6');
    await page.screenshot({path:path.join(__dirname,'previews/food-photo-mobile.png')});
    assert.deepEqual(errors,[]);
    console.log('Passed generated map artwork/title, removed helper text, seven direct-travel stations, all five areas and 14 options, all 32 originals, bidirectional photo carousel, phone arrows, placeholders and music/mute.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
