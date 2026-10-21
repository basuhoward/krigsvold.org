import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=resolve('dist'),types={'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{
  const url=new URL(req.url,'http://localhost'),path=resolve(root,'.'+decodeURIComponent(url.pathname));
  if(path!==root&&!path.startsWith(root+sep))return res.writeHead(403).end();
  for(const file of [path,path+'/index.html',path+'.html'])try{const data=await readFile(file);if(file===path+'/index.html'&&!url.pathname.endsWith('/'))return res.writeHead(301,{Location:url.pathname+'/'+url.search}).end();return res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'}).end(data);}catch{}
  res.writeHead(404).end();
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`,tag='https://www.googletagmanager.com/gtag/js?id=G-13CWX5EBQG';
const browser=await chromium.launch({args:['--no-sandbox','--disable-dev-shm-usage']});
await mkdir('artifacts/qa',{recursive:true});
let count=0;
async function scenario(name,run,{gpc=false,javaScriptEnabled=true}={}){
  const context=await browser.newContext({viewport:{width:1440,height:1000},javaScriptEnabled}),requests=[],errors=[];
  await context.route('**/*',route=>{const url=route.request().url();if(url.startsWith(base+'/'))return route.continue();requests.push(url);return url===tag?route.fulfill({contentType:'application/javascript',body:'window.__testTagLoaded=true'}):route.abort();});
  if(gpc)await context.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{value:true}));
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  try{await page.goto(base+'/');await run({page,context,requests});assert.deepEqual(errors,[]);assert.ok(requests.every(r=>r===tag),'Unexpected external requests '+requests);console.log('PASS '+name);count++;}finally{await context.close();}
}
try{
  await scenario('consent rejection, acceptance, withdrawal and persistence',async({page,context,requests})=>{
    await page.locator('#gdpr-cookie').waitFor({state:'visible'});assert.deepEqual(requests,[]);
    await page.screenshot({path:'artifacts/qa/desktop-consent.png'});
    await page.locator('[data-cookie-reject]').click();await page.reload();assert.equal(await page.locator('#gdpr-cookie').isVisible(),false);assert.deepEqual(requests,[]);
    await page.locator('footer [data-cookie-preferences]').click();await page.locator('[data-cookie-accept]').click();await page.waitForFunction(()=>window.__testTagLoaded);assert.equal(requests.length,1);
    await page.locator('footer [data-cookie-preferences]').click();await page.locator('[data-cookie-reject]').click();assert.equal(await page.evaluate(()=>window['ga-disable-G-13CWX5EBQG']),true);
    await page.reload();assert.equal(await page.locator('#gdpr-cookie').isVisible(),false);assert.equal(requests.length,1);
    assert.ok((await context.cookies()).some(c=>c.name==='cookieConsent'));
  });
  await scenario('Global Privacy Control prevents analytics',async({page,requests})=>{assert.equal(await page.locator('#gdpr-cookie').isVisible(),false);await page.locator('footer [data-cookie-preferences]').click();await page.locator('[data-cookie-accept]').click();assert.deepEqual(requests,[]);},{gpc:true});
  await scenario('original navigation proportions and readable hero action',async({page})=>{
    await page.locator('[data-cookie-reject]').click();await page.evaluate(()=>document.fonts.ready);
    const nav=await page.locator('.site-navbar').boundingBox();
    assert.ok(Math.abs(nav.y-20)<1,'Navigation should retain the original inset from the top');
    assert.ok(Math.abs(nav.height-68)<1,'Search controls must not enlarge the original 68px navbar');
    assert.deepEqual(await page.locator('.site-search button svg').evaluate(e=>({width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})),{width:24,height:24});
    const fellows=page.locator('.home-hero .btn-outline-light');
    assert.equal(await fellows.evaluate(e=>getComputedStyle(e).color),'rgb(255, 255, 255)');
    assert.equal(await fellows.evaluate(e=>getComputedStyle(e).borderTopStyle),'solid');
    await page.screenshot({path:'artifacts/qa/navigation-and-hero.png'});
    await fellows.hover();
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('.home-hero .btn-outline-light')).color==='rgb(6, 19, 37)');
    assert.equal(await fellows.evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(217, 238, 244)');
    await page.mouse.move(0,900);await page.keyboard.press('Tab');await fellows.focus();
    assert.equal(await fellows.evaluate(e=>e===document.activeElement),true);
  });
  await scenario('published fonts, navigation, FAQ and bundled search',async({page})=>{
    await page.locator('[data-cookie-reject]').click();await page.evaluate(()=>document.fonts.ready);
    assert.match(await page.locator('h1').evaluate(e=>getComputedStyle(e).fontFamily),/Roboto Slab/);assert.match(await page.locator('body').evaluate(e=>getComputedStyle(e).fontFamily),/Roboto/);
    assert.ok(await page.evaluate(async()=>{const faces=await document.fonts.load('16px "Roboto Mono"');return faces.length>0&&document.fonts.check('16px "Roboto Mono"');}));
    await page.locator('#nav-krigsvold').click();await page.getByRole('link',{name:'What Is Krigsvold?',exact:true}).click();await page.waitForURL('**/what-is-krigsvold/**');
    await page.goto(base+'/faq/');const item=page.locator('details').first();await item.locator('summary').click();assert.equal(await item.getAttribute('open'),'');
    await page.goto(base+'/search/?q=Ria');await page.locator('.search-results a[href="/fellows/ria-raut/"]').waitFor();
    await page.screenshot({path:'artifacts/qa/search.png'});
  });
  await scenario('responsive layouts and mobile navigation',async({page})=>{
    await page.locator('[data-cookie-reject]').click();
    for(const width of [280,320,390,768,1440]){
      await page.setViewportSize({width,height:1000});
      for(const route of ['/','/about/','/heraldry/','/privacy-and-cookie-notice/','/faq/','/fellows/ria-raut/']){
        await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
        const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
        assert.ok(dimensions.scroll<=width+1,`${route} overflows at ${width}: ${JSON.stringify(dimensions)}`);
        if(width===390||width===1440)await page.screenshot({path:`artifacts/qa/${width}-${route==='/'?'home':route.split('/')[1]}.png`,fullPage:true});
      }
    }
    await page.setViewportSize({width:390,height:844});await page.goto(base+'/');await page.getByRole('button',{name:'Open navigation'}).click();await page.locator('#primaryNavigation').waitFor({state:'visible'});await page.locator('#nav-krigsvold').click();await page.getByRole('link',{name:'Heraldry',exact:true}).click();await page.waitForURL('**/heraldry/**');
  });
  await scenario('prose and FAQ remain available without JavaScript',async({page,requests})=>{await page.goto(base+'/faq/');const item=page.locator('details').first();await item.locator('summary').click();assert.equal(await item.getAttribute('open'),'');assert.deepEqual(requests,[]);},{javaScriptEnabled:false});
  console.log(`${count} browser scenarios passed`);
}finally{await browser.close();await new Promise(r=>server.close(r));}
