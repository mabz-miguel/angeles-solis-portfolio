const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({reducedMotion:'reduce'});
 for(const lang of ['', 'en/']){
 await page.goto((process.env.TEST_BASE||'http://127.0.0.1:8765/')+lang+'index.html');
 assert.equal(await page.locator('.room-panel:not(.is-active)').evaluateAll(els=>els.every(el=>getComputedStyle(el).opacity==='0')),true,'inactive galleries must remain hidden with reduced motion');
 assert.equal(await page.locator('#stage-dark').evaluate(el=>getComputedStyle(el).opacity),'0');
 }
 await browser.close();console.log('PASS: reduced-motion galleries remain distinct in ES/EN');
})().catch(e=>{console.error(e);process.exit(1)});
