const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const entry = pathToFileURL(path.join(__dirname, '2026JB-KL.html')).href + '?concept=brickbound&preview=railway';
  const errors = [];
  const settle = page => page.waitForFunction(() => document.querySelector('#rk-stop-panel').getAttribute('aria-busy') !== 'true' && !gsap.globalTimeline.getChildren().some(animation => animation.isActive()));
  fs.mkdirSync(path.join(__dirname, 'previews'), { recursive: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(entry);
    await page.waitForFunction(() => document.querySelector('#rk-map-status').textContent.includes('You’ve arrived'));
    await settle(page);
    assert.equal(await page.locator('.rk-station').count(), 9);
    assert.equal(await page.locator('.rk-station[role="button"]').count(), 1);
    assert.equal(await page.locator('[data-stop]').count(), 6);
    assert.match(await page.locator('#rk-map-status').textContent(), /arrived/);
    await page.screenshot({ path: path.join(__dirname, 'previews/25nov-railway.png'), fullPage: true });
    const parked = await page.locator('#rk-route-train').getAttribute('transform');
    await page.locator('.rk-station.available').click();
    assert.notEqual(await page.locator('#rk-route-train').getAttribute('transform'), parked);
    await page.waitForFunction(() => document.querySelector('#rk-map-status').textContent.includes('You’ve arrived'));
    await settle(page);
    assert.equal(await page.locator('#rk-route-train').getAttribute('transform'), parked);
    const captions = ['Shuttle Tebrau', 'Oriental Kopi', 'JB → KL train', 'Berjaya Times Square', 'Tangkak Beef Noodle House', 'Supermarket + Mixue'];
    for (let index = 0; index < 6; index++) {
      assert.equal(await page.locator('#rk-venue').textContent(), captions[index]);
      assert.equal(await page.locator(`[data-stop="${index}"]`).getAttribute('aria-pressed'), 'true');
      await settle(page);
      await page.waitForFunction(index => {
        const car = document.querySelector(`[data-stop="${index}"]`).getBoundingClientRect();
        const viewport = document.querySelector('.rk-carousel-window').getBoundingClientRect();
        return Math.abs(car.x + car.width / 2 - viewport.x - viewport.width / 2) < 2;
      }, index);
      const selected = await page.locator(`[data-stop="${index}"]`).boundingBox();
      const viewport = await page.locator('.rk-carousel-window').boundingBox();
      assert.ok(Math.abs(selected.x + selected.width / 2 - viewport.x - viewport.width / 2) < 2, 'Active carriage centered');
      if (index < 5) await page.locator('[data-stop-next]').click();
    }
    assert.equal(await page.locator('[data-stop-next]').isDisabled(), true);
    assert.match(await page.locator('#rk-description').textContent(), /Level 2/);
    await page.locator('#rk-collect').click();
    assert.equal(await page.locator('[data-stamp="5"]').getAttribute('aria-label'), 'Supermarket + Mixue: collected');
    await page.reload();
    assert.match(await page.locator('#rk-progress').textContent(), /1 of 6/);
    await settle(page);
    await page.locator('[data-stop="1"]').click();
    await settle(page);
    await page.screenshot({ path: path.join(__dirname, 'previews/25nov-kopi.png'), fullPage: true });
    await page.locator('#rk-day').screenshot({ path: path.join(__dirname, 'previews/25nov-day-detail.png') });
    await page.locator('[data-stop="1"]').focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await page.locator('#rk-venue').textContent(), 'JB → KL train');
    await page.locator('.rk-station.available').focus();
    await page.keyboard.press('Enter');
    await settle(page);
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No page overflow at ${width}`);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('[data-stop-prev]').click();
    await settle(page);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: path.join(__dirname, 'previews/25nov-mobile.png'), fullPage: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('[data-stop-next]').click();
    assert.equal(await page.evaluate(() => gsap.globalTimeline.getChildren().some(animation => animation.isActive())), false);
    await context.close();
    const fallback = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 390, height: 844 } });
    await fallback.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
    const backup = await fallback.newPage();
    backup.on('pageerror', error => errors.push(error.message));
    await backup.route('**/gsap.min.js', route => route.abort());
    await backup.goto(entry);
    await backup.locator('[data-stop-next]').click();
    assert.equal(await backup.locator('#rk-venue').textContent(), 'Oriental Kopi');
    await backup.locator('#rk-collect').click();
    assert.match(await backup.locator('#rk-saved-note').textContent(), /this visit only/);
    const swipe = backup.locator('.rk-carousel-window');
    await swipe.dispatchEvent('pointerdown', { pointerType: 'touch', clientX: 230, clientY: 100 });
    await swipe.dispatchEvent('pointerup', { pointerType: 'touch', clientX: 110, clientY: 104 });
    assert.equal(await backup.locator('#rk-venue').textContent(), 'JB → KL train');
    assert.deepEqual(errors, []);
    console.log('Passed railway arrival, all six scenes, centered carriage navigation, keyboard and swipe controls, saved memories, reduced motion, blocked storage, missing GSAP and five viewport sizes.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
