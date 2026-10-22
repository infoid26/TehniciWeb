import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {createServer,closeProject} from './serve.mjs';
import {inject} from './inject.mjs';

const server=createServer({production:true});
const handler=server.listeners('request')[0];
const request=path=>inject(handler,{path,timeout:30000});
const require=createRequire(import.meta.url);
assert(!require.cache[require.resolve('../project-reference/app.js')],'Starting the course must not initialize the demo project');
const preparedFiles=['css/site.css',...['cake','tea','icecream'].flatMap(name=>[300,600].map(width=>`images/${name}-${width}.webp`))];
const assetStats=()=>Promise.all(preparedFiles.map(async file=>{const stat=await fs.stat('project-reference/public/'+file);return {size:stat.size,mtime:stat.mtimeMs};}));
const beforeAssets=await assetStats();
try{
 for(const [route,status,text] of [
  ['/project/',200,'Fresh notes'],['/project/home',200,'A little sweetness'],['/project/about',200,'Our collection'],['/project/contact',200,'hello@example.com'],
  ['/project/recipe/fruit',200,'Fruit bowl'],['/project/recipe/chocolate',200,'Chocolate cup'],['/project/recipe/vanilla',200,'Vanilla sundae'],['/project/recipe/missing',404,'Page not found'],
  ['/project/products?type=pastry',200,'Almond pastry'],['/project/product/1',200,'Added on'],['/project/product/abc',400,'Invalid request'],['/project/product/999',404,'Page not found'],['/project/products?type=bad',400,'Invalid request'],['/project/missing',404,'Page not found'],['/project/home.ejs',400,'Invalid request'],['/project/assets',403,'Access denied'],['/project/assets/images',403,'Access denied'],
  ['/site/sources.js',404,null],['/site/source-old.png',404,null],['/project/assets/css/site.css',200,'.product-card'],
 ]){const response=await request(route);assert.equal(response.status,status,route);if(text)assert(response.body.includes(text),route);}
 assert.deepEqual(await assetStats(),beforeAssets,'Opening the demo must use prepared assets without recompiling or rewriting them');
 assert(!require.cache[require.resolve('../project-reference/lib/assets.js')],'Runtime must not load the Sass/Sharp build module');
 const products=(await request('/project/products')).body;
 const cards=[...products.matchAll(/<article class="product-card"([^>]+)>/g)].map(match=>{
  const dataset={};for(const attr of match[1].matchAll(/data-([\w-]+)="([^"]*)"/g))dataset[attr[1]]=attr[2];
  return {dataset,hidden:false};
 });
 assert.equal(cards.length,8);
 assert.equal(((await request('/project/products?type=pastry')).body.match(/class="product-card"/g)||[]).length,2);
 const home=(await request('/project/')).body;
  assert.equal((home.match(/target="recipe-frame"/g)||[]).length,3);assert(home.includes('<iframe'));
 for(const id of ['welcome','offers','range','gallery','announcements','hours','faq','recipes'])assert(home.includes(`id="${id}"`),id);
 assert(home.includes('bakery.webm')&&!home.includes('bakery.mp4'));
 assert.equal(((await request('/project/')).body.match(/<tr><th scope="row">/g)||[]).length,7);
 const video=await fs.readFile('project-reference/public/media/bakery.webm');assert.equal(video.subarray(0,4).toString('hex'),'1a45dfa3');assert(video.includes(Buffer.from('V_VP8')));assert(video.length<100000);

 // Drive the shipped JS using rendered catalog data and browser event interfaces.
 // This tests behavior without claiming a browser layout or rendering check.
 const elements=new Map();let timers=[];let clock=0;
 const create=()=>({value:'',textContent:'',hidden:false,checked:false,attrs:{},listeners:{},
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);},
  fire(type,event={}){for(const fn of this.listeners[type]||[])fn({preventDefault(){},...event});},
  getAttribute(name){return this.attrs[name]??null;},setAttribute(name,value){this.attrs[name]=value;},
  classList:{values:new Set(),toggle(name,force){const active=force??!this.values.has(name);if(active)this.values.add(name);else this.values.delete(name);return active;},contains(name){return this.values.has(name);}},
 });
 for(const id of ['cart-count','theme-toggle','menu-toggle','main-menu','cookie-banner','accept-cookies','dismiss-cookies','filters','product-list','search-name','min-price','max-price','category','ingredients','sort','summary','empty-state','price-value','min-price-value','calculate-total','total-notice'])elements.set('#'+id,create());
 const by=id=>elements.get('#'+id);let order=[...cards];
 const boxes=cards.map(c=>Object.assign(create(),{dataset:{id:c.dataset.id}}));
 const diet=create(),calories=create();diet.value='all';calories.value='all';
 by('min-price').value='0';by('max-price').value='70';by('category').value='all';by('sort').value='default';
 by('product-list').querySelectorAll=()=>cards;
 by('product-list').appendChild=card=>{order=order.filter(x=>x!==card);order.push(card);};
 const storage=new Map();const body=create();const doc=create();doc.body=body;doc.cookie='';
 doc.querySelector=selector=>selector==='input[name="diet"]:checked'?diet:selector==='input[name="calories"]:checked'?calories:elements.get(selector);
 doc.querySelectorAll=selector=>selector==='.cart-choice'?boxes:[];
 const context={document:doc,localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},setTimeout:(fn,ms)=>{const id=++clock;timers.push({id,fn,ms});return id;},clearTimeout:id=>{timers=timers.filter(t=>t.id!==id);}};
 const start=()=>vm.runInNewContext(code,context);
 const code=await fs.readFile('project-reference/public/js/site.js','utf8');start();
 const visible=()=>cards.filter(c=>!c.hidden);
 const filter=()=>by('filters').fire('input');
 by('search-name').value='Chocolate';filter();assert.equal(visible().length,2);
 by('search-name').value='cake';filter();assert.equal(visible().length,0);
 by('search-name').value='';
 for(const [value,count] of [['0:350',4],['350:700',2],['700:Infinity',2]]){calories.value=value;filter();assert.equal(visible().length,count,value);}
 calories.value='all';by('min-price').value='12';filter();assert.equal(visible().length,3);
 by('max-price').value='12';filter();assert.equal(visible().length,2);
 by('min-price').value='0';by('max-price').value='70';by('category').value='diet';filter();assert.equal(visible().length,2);
 by('category').value='all';by('ingredients').value='almond';filter();assert.equal(visible().length,1);
 by('ingredients').value='';diet.value='yes';filter();assert.equal(visible().length,2);
 diet.value='all';by('sort').value='desc';filter();
 assert.deepEqual(order.filter(c=>c.dataset.price==='12.00').map(c=>c.dataset.name),['chocolate celebration','chocolate cake']);
 assert(order.every((c,i)=>!i||Number(order[i-1].dataset.price)>=Number(c.dataset.price)));
 by('sort').value='asc';filter();assert(order.every((c,i)=>!i||Number(order[i-1].dataset.price)<=Number(c.dataset.price)));
 doc.fire('keydown',{altKey:true,key:'c'});assert.equal(by('total-notice').textContent,'Visible total: 80.00 EUR');assert.equal(by('total-notice').hidden,false);
 timers.find(t=>t.ms===2000).fn();assert.equal(by('total-notice').hidden,true);
 boxes[0].checked=true;boxes[0].fire('change');assert.equal(by('cart-count').textContent,1);assert.deepEqual(JSON.parse(storage.get('sweet-corner-cart')),['1']);
 boxes[0].checked=false;boxes[0].fire('change');assert.equal(by('cart-count').textContent,0);
 by('theme-toggle').fire('click');assert(body.classList.contains('light'));assert.equal(JSON.parse(storage.get('sweet-corner-theme')),'light');
 by('accept-cookies').fire('click');assert(doc.cookie.includes('sweet_consent=yes'));assert(by('cookie-banner').hidden);
 by('menu-toggle').fire('click');assert(by('main-menu').classList.contains('open'));
 by('filters').fire('reset');assert(timers.some(t=>t.ms===0));
 console.log('PASS: rendered EJS/SQL routes and errors, complete home sections, original WebM structure; shipped JS filters at calorie/price boundaries, sort ties in both directions, Alt+C timer, cart, theme, consent and menu. Browser layout not tested.');
}finally{server.close();await closeProject();}
