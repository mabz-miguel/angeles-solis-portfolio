const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});
 const page=await browser.newPage({reducedMotion:'reduce'});
 const base=process.env.TEST_BASE||'http://127.0.0.1:8765/';
 fs.mkdirSync('../english-build',{recursive:true});
 const failures=[]; page.on('pageerror',e=>failures.push(e.message));
 page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)failures.push(r.status()+' '+r.url());});
 const es=JSON.parse(fs.readFileSync('assets/data/projects.json'));
 const en=JSON.parse(fs.readFileSync('assets/data/projects.en.json'));
 assert.deepEqual(es.map(p=>p.id),en.map(p=>p.id));
 for(const locale of ['', 'en/']){
  await page.goto(base+locale+'index.html');
  await page.locator('.pub-entry').first().waitFor();
  assert.equal(await page.locator('.pub-entry').count(),15);
  const cv=page.locator('a[href$=".pdf"]');
  assert.equal((await page.request.get(new URL(await cv.getAttribute('href'),page.url()).href)).status(),200);
  for(const width of [320,390,768,1024,1100,1440]){
   await page.setViewportSize({width,height:900});
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${locale} ${width}`);
   const box=await page.locator('.language-switch').boundingBox(); assert(box.x>=0&&box.x+box.width<=width,`switch ${width}`);
  }
  await page.goto(base+locale+'index.html?room=pintura#about');
  assert(await page.locator('#rp-pintura').evaluate(el=>el.classList.contains('is-active')));
  await page.locator(`[data-language="${locale?'es':'en'}"]`).click();
  assert.equal(new URL(page.url()).searchParams.get('room'),'pintura');
  assert.equal(new URL(page.url()).hash,'#about');
  for(const p of es){
   await page.goto(base+locale+'project-detail.html?id='+p.id);
   await page.locator('#detail-main').waitFor();
   await page.locator('#detail-main img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));
   await page.waitForFunction(()=>[...document.querySelectorAll('#detail-main img')].every(i=>i.complete));
   assert.equal(await page.locator('#detail-main img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).length),0,'images '+locale+p.id);
  }
 }
 await page.goto(base+'en/index.html');
 await page.setViewportSize({width:1440,height:1000});
 await page.waitForFunction(()=>document.fonts.status==='loaded');
 await page.screenshot({path:'../english-build/home-desktop.png',animations:'disabled'});
 await page.setViewportSize({width:390,height:844});
 await page.waitForFunction(()=>document.getAnimations().every(a=>a.playState!=='running'));
 await page.screenshot({path:'../english-build/home-mobile.png',animations:'disabled'});
 await page.goto(base+'en/complete-archive.html');
 await page.locator('.archive-entry').first().waitFor();
 await page.screenshot({path:'../english-build/archive-mobile.png'});
 assert.deepEqual(failures,[]);
 await browser.close();console.log('PASS: all 44 project pages/images, both publications/CVs, room/hash switching and 6 viewport widths');
})().catch(e=>{console.error(e);process.exit(1)});
