const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const errors = [];
  const entry = pathToFileURL(path.join(__dirname, '2026JB-KL.html')).href;
  fs.mkdirSync(path.join(__dirname, 'previews'), { recursive: true });
  try {
    for (const concept of ['brickbound', 'platform', 'manual']) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(`${concept}: ${error.message}`));
      await page.goto(`${entry}?concept=${concept}${concept === 'brickbound' ? '&thumbnail=1' : ''}`);
      assert.equal(await page.evaluate(() => gsap.version), '3.13.0');
      assert.equal(await page.locator('[data-day]').count(), 9);
      await page.waitForFunction(() => !gsap.globalTimeline.getChildren().some(animation => animation.isActive()));
      await page.screenshot({ path: path.join(__dirname, `previews/${concept}.png`), fullPage: true });
      for (let index = 0; index < 9; index++) {
        await page.locator(`[data-day="${index}"]`).click();
        assert.equal(await page.locator(`[data-day="${index}"]`).getAttribute('aria-pressed'), 'true');
        assert.equal(await page.locator('#day-count').textContent(), `Day ${index + 1} of 9`);
        if (index >= 5 && index <= 7) {
          assert.match(await page.locator('#day-panel').textContent(), /No activities planned yet/);
          assert.equal(await page.locator('.mission').count(), 0);
        }
      }
      assert.equal(await page.locator('[data-next]').isDisabled(), true);
      await page.locator('[data-day="2"]').click();
      assert.equal(await page.locator('.booked').textContent(), 'Booked');
      assert.match(await page.locator('#day-panel').textContent(), /11:45/);
      await page.locator('[data-day="1"]').click();
      assert.equal(await page.locator('.options li').count(), 3);
      assert.match(await page.locator('.options').textContent(), /RM175/);
      await page.locator('[data-day="0"]').click();
      const checkbox = page.locator('input[data-mission]').first();
      await checkbox.check();
      await page.reload();
      assert.equal(await page.locator('input[data-mission]').first().isChecked(), true);
      await page.locator('input[data-mission]').first().uncheck();
      await page.locator('.replay').click();
      await page.waitForFunction(() => !gsap.globalTimeline.getChildren().some(animation => animation.isActive()));
      assert.ok(await page.locator('.scene').isVisible());
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: path.join(__dirname, `previews/${concept}-mobile.png`), fullPage: true });
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${concept}: overflow at ${width}`);
      }
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.locator('[data-day="3"]').click();
      assert.equal(await page.evaluate(() => gsap.globalTimeline.getChildren().some(animation => animation.isActive())), false);
      await context.close();
      console.log(`${concept}: itinerary, checklist persistence, motion and responsive layout passed`);
    }
    const blocked = await browser.newContext({ reducedMotion: 'reduce' });
    await blocked.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
    const blockedPage = await blocked.newPage();
    await blockedPage.goto(`${entry}?concept=brickbound&thumbnail=1`);
    await blockedPage.locator('input[data-mission]').first().check();
    assert.match(await blockedPage.locator('#save-note').textContent(), /this visit only/);
    await blockedPage.route('**/gsap.min.js', route => route.abort());
    await blockedPage.reload();
    await blockedPage.locator('[data-day="4"]').click();
    assert.match(await blockedPage.locator('#day-title').textContent(), /brick paradise/);
    const gallery = await browser.newPage({ viewport: { width: 1440, height: 1200 }, reducedMotion: 'reduce' });
    await gallery.goto(`${entry}?concept=compare`);
    assert.equal(await gallery.locator('.concept-card').count(), 3);
    await gallery.screenshot({ path: path.join(__dirname, 'previews/comparison.png'), fullPage: true });
    await gallery.setViewportSize({ width: 390, height: 844 });
    assert.ok(await gallery.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert.deepEqual(errors, []);
    console.log('Comparison, blocked storage and missing animation-library fallback passed');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
