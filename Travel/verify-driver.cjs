const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const entry = pathToFileURL(path.join(__dirname, '2026JB-KL.html')).href + '?concept=brickbound&preview=driver';
  const errors = [];
  const arrive = async (page,index) => {
    try { await page.waitForFunction(index => document.querySelector('#cab').dataset.day === String(index) && document.querySelector('#itinerary-dialog').open, index); }
    catch(error) {
      console.error(await page.evaluate(()=>({day:document.querySelector('#cab').dataset.day,phase:document.querySelector('#cab').dataset.phase,hidden:document.hidden,dialog:document.querySelector('#itinerary-dialog').open,leverDisabled:document.querySelector('#lever-grip').disabled,direction:document.querySelector('[data-direction][aria-pressed="true"]').dataset.direction,status:document.querySelector('#journey-status').textContent})));
      await page.screenshot({path:path.join(__dirname,'previews/driver-check-failure.png')});
      throw error;
    }
  };
  const noMotion = page => page.waitForFunction(() => !gsap.globalTimeline.getChildren().some(animation => animation.isActive()));
  fs.mkdirSync(path.join(__dirname, 'previews'), { recursive: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, hasTouch: true });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(entry);
    await page.locator('#landscape-0').evaluate(image => image.decode());
    assert.equal(await page.locator('#cab').getAttribute('data-day'), '0');
    assert.equal(await page.locator('#itinerary-dialog').getAttribute('open'), null);
    await page.screenshot({ path: path.join(__dirname, 'previews/driver-cab-kl.png') });
    await page.locator('#open-itinerary').click();
    assert.equal(await page.locator('.activities-table tbody tr').count(), 6);
    assert.match(await page.locator('.activities-table').textContent(), /09:45/);
    await page.keyboard.press('Escape');
    const lever = page.locator('#lever-grip');
    const box = await lever.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 65, { steps: 8 });
    await page.mouse.up();
    await page.waitForFunction(() => Number(document.querySelector('#speed-value').textContent) > 0);
    assert.equal(await page.locator('#open-itinerary').isDisabled(), true);
    await arrive(page,1);
    assert.equal(await page.locator('.activities-table tbody tr').count(), 3);
    assert.match(await page.locator('.activities-table').textContent(), /RM175/);
    await noMotion(page);
    await page.screenshot({ path: path.join(__dirname, 'previews/driver-itinerary.png') });
    await page.locator('#back-to-cab').click();
    assert.equal(await page.locator('#speed-value').textContent(), '0');
    await page.screenshot({ path: path.join(__dirname, 'previews/driver-cab-luge.png') });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (let index=2; index<=6; index++) {
      await lever.focus();
      await page.keyboard.press('Enter');
      await arrive(page,index);
      assert.equal(await page.locator('#console-day-number').textContent(), String(index+1).padStart(2,'0'));
      const image=page.locator('.landscape-image:not(.inactive)');
      await image.evaluate(element => element.decode());
      assert.equal(await image.evaluate(element => getComputedStyle(element).visibility), 'visible');
      if(index===2) { assert.equal(await page.locator('.activity-booked').textContent(), 'Booked'); assert.match(await page.locator('.activities-table').textContent(), /11:45/); }
      if(index===3) assert.match(await page.locator('.activities-table').textContent(), /Go Kart/);
      if(index===5) { assert.equal(await page.locator('.activities-table tbody tr').count(), 3); assert.match(await page.locator('#sheet-date').textContent(), /30 Nov–2 Dec/); }
      if(index===6) assert.match(await page.locator('.activities-table').textContent(), /19:05/);
      await page.locator('#close-itinerary').click();
    }
    assert.equal(await lever.isDisabled(), true, 'Forward disabled at last day');
    await page.locator('[data-direction="-1"]').click();
    assert.equal(await lever.isEnabled(), true);
    for(let index=5;index>=0;index--) {
      await lever.focus();await page.keyboard.press('ArrowDown');await arrive(page,index);await page.keyboard.press('Escape');
    }
    assert.equal(await lever.isDisabled(), true, 'Reverse disabled at first day');
    await page.locator('[data-direction="1"]').click();
    for(const [width,height] of [[320,700],[390,844],[768,1024],[1024,768],[1440,1000]]) {
      await page.setViewportSize({width,height});
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth), `No horizontal overflow at ${width}`);
      const bounds=await lever.boundingBox();
      assert.ok(bounds.y>=0 && bounds.y+bounds.height<=height, `Lever reachable at ${width}`);
    }
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:path.join(__dirname,'previews/driver-cab-mobile.png')});
    await page.setViewportSize({width:390,height:640});
    await page.locator('#open-itinerary').click();
    const firstDayScroll=await page.locator('#sheet-scroll').evaluate(element=>{
      const result={client:element.clientHeight,total:element.scrollHeight};
      element.scrollTop=element.scrollHeight;
      return {...result,position:element.scrollTop};
    });
    assert.ok(firstDayScroll.total>firstDayScroll.client && firstDayScroll.position>0,'Long itinerary scrolls inside popup');
    await page.keyboard.press('Escape');
    await page.setViewportSize({width:390,height:844});
    await lever.tap();await arrive(page,1);
    await page.screenshot({path:path.join(__dirname,'previews/driver-itinerary-mobile.png')});
    const scroll=await page.locator('#sheet-scroll').evaluate(element=>({client:element.clientHeight,scroll:element.scrollHeight}));
    assert.ok(scroll.client>0 && scroll.client<=scroll.scroll);
    await page.keyboard.press('Escape');
    await page.emulateMedia({reducedMotion:'no-preference'});
    await lever.tap();
    await page.locator('#skip-ride').click();
    await arrive(page,2);
    assert.equal(await page.locator('.activity-booked').textContent(),'Booked');
    await context.close();
    const fallback=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});
    const backup=await fallback.newPage();
    backup.on('pageerror',error=>errors.push(error.message));
    await backup.route('**/gsap.min.js',route=>route.abort());
    await backup.goto(entry);
    await backup.locator('#lever-grip').click();await arrive(backup,1);
    assert.match(await backup.locator('.activities-table').textContent(),/Skyline Luge/);
    assert.deepEqual(errors,[]);
    await backup.goto(entry.split('?')[0]);
    assert.equal(await backup.locator('#cab').getAttribute('data-day'),'0','Travel file opens the cab by default');
    console.log('Passed image loading, lever drag/tap/keyboard, motion and speed, all seven stops, combined Legoland itinerary, automatic popups, reverse and end stops, skip ride, reduced motion, five viewport sizes and missing-GSAP fallback.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
