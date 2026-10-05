const { chromium } = require('playwright');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const groups = vm.runInNewContext(fs.readFileSync('apps-data.js', 'utf8') + ';APP_DATA');
const selected = process.argv[2];
(async () => {
  const browser = await chromium.launch({channel:'msedge', headless:true});
  fs.mkdirSync('images/apps', {recursive:true});
  const results = [];
  for (const app of groups.flatMap(g => g.apps).filter(app => !selected || app.id === selected)) {
    const page = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
    const slug = new URL(app.url).pathname.split('/').filter(Boolean)[0] || 'chinese-practice';
    try {
      await page.goto(app.url, {waitUntil:'networkidle',timeout:45000});
      await page.screenshot({path:path.join('images/apps',slug+'.jpg'),type:'jpeg',quality:85});
      results.push({name:app.name, screenshot:'images/apps/'+slug+'.jpg', title:await page.title(), scripts:await page.locator('script[src]').evaluateAll(nodes => nodes.map(n=>n.src)), text:(await page.locator('body').innerText()).slice(0,900)});
    } catch(e) { results.push({name:app.name,error:e.message}); }
    await page.close();
  }
  fs.writeFileSync('mockups/capture-results.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify(results,null,2));
  await browser.close();
})();
