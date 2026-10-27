import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {parse} from 'acorn';
const require=createRequire(import.meta.url);
const {parser}=createRequire(require.resolve('@codemirror/lang-html'))('@lezer/html');
const source=await fs.readFile('site/runner.js','utf8');
const declarations=new Map();
function visit(node){
 if(!node||typeof node!=='object')return;
 if(node.type==='FunctionDeclaration')declarations.set(node.id.name,source.slice(node.start,node.end));
 for(const value of Object.values(node))if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')visit(value);
}
visit(parse(source,{ecmaVersion:'latest'}));
// Parse the fixture with the shipped HTML grammar. Only the DOM operations used
// by these attribute/text cases are modeled; layout and browser loading are not.
class FixtureDocument{
 constructor(markup){
  this.elements=[];
  parser.parse(markup).iterate({enter:ref=>{
   if(!['OpenTag','SelfClosingTag'].includes(ref.name))return;
   const node=ref.node,tag=markup.slice(node.getChild('TagName').from,node.getChild('TagName').to).toLowerCase();
   const attrs=new Map();
   for(const attr of node.getChildren('Attribute')){
    const name=attr.getChild('AttributeName'),value=attr.getChild('AttributeValue');
    let text=value?markup.slice(value.from,value.to):'';
    if(/^['"]/.test(text))text=text.slice(1,-1);
    attrs.set(markup.slice(name.from,name.to).toLowerCase(),text);
   }
   const end=node.parent.getChild('CloseTag');
   this.elements.push({tag,removed:false,attrs,
    textContent:end?markup.slice(node.to,end.from).replace(/<[^>]*>/g,''):'',
    get attributes(){return [...attrs].map(([name,value])=>({name,value}));},
    getAttribute:name=>attrs.get(name)??null,setAttribute:(name,value)=>attrs.set(name,String(value)),
    removeAttribute:name=>attrs.delete(name),remove(){this.removed=true;}
   });
  }});
 }
 querySelectorAll(selector){
  const selectors=selector.split(',').map(part=>part.trim());
  return this.elements.filter(el=>!el.removed&&selectors.some(part=>{
   if(part==='*')return true;
   const match=part.match(/^([\w-]+)(?:\[([\w-]+)(?:=["']?([^"'\]]+)["']?)?\])?$/);
   assert(match,'Unsupported fixture selector: '+part);
   return el.tag===match[1]&&(!match[2]||(el.attrs.has(match[2])&&(match[3]===undefined||el.getAttribute(match[2])===match[3])));
  }));
 }
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}
const context={window:{},DOMParser:class{parseFromString(markup){return new FixtureDocument(markup);}},setTimeout,clearTimeout,crypto:{randomUUID:()=>String(++token)}};
let token=0,frames=0;
const listeners=new Set();
context.window.addEventListener=(type,receive)=>{assert.equal(type,'message');listeners.add(receive);};
context.window.removeEventListener=(type,receive)=>listeners.delete(receive);
vm.createContext(context);
vm.runInContext(declarations.get('cleanDocument'),context);
context.sourceDoc=(task,code,tests,token)=>({document:context.cleanDocument(task.mode==='html'?code:task.fixture),task,code,tests,token});
context.document={body:{append(){}},createElement:tag=>{
 assert.equal(tag,'iframe');frames++;
 const frame={contentWindow:{},style:{},setAttribute(){},remove(){}};
 Object.defineProperty(frame,'srcdoc',{set:payload=>{
  const {document,task,code,tests,token}=payload;
  const parent={postMessage:data=>{for(const receive of listeners)receive({source:frame.contentWindow,data});}};
  if(task.mode==='dom')vm.runInNewContext(code,{document});
  vm.runInNewContext('('+declarations.get('checkInFrame')+')(tests,"",true,token)',{document,parent,tests,token});
 }});
 return frame;
}};
vm.runInContext(declarations.get('checkWeb'),context);
const course={window:{}};vm.runInNewContext(await fs.readFile('site/course.js','utf8'),course);
const task=JSON.parse(JSON.stringify(course.window.TW_COURSE.chapters.flatMap(chapter=>chapter.lessons).find(lesson=>lesson.id==='html-metadata').task));
let checks=0;
async function verify(task,code,expected){
 const results=await context.checkWeb(task,code);
 assert.deepEqual(Array.from(results,row=>row.passed),expected,JSON.stringify(results));checks++;
}
await verify(task,task.solution,[true,true]);
await verify(task,task.solution.replace('<link rel="icon" href="/assets/icon.svg">',''),[true,false]);
await verify(task,task.solution.replace('/assets/icon.svg','/assets/wrong.svg'),[true,false]);
await verify(task,task.solution.replace('Fresh cakes','Wrong description'),[false,true]);
await verify(task,'',[false,false]);
await verify(task,task.solution.replaceAll('"',"'"),[true,true]);
assert.equal(frames,0,'HTML metadata is checked directly, without creating preview frames');
const mixed={...task,tests:[...task.tests,{kind:'text',selector:'h1',value:'Hello',label:'Heading'}]};
await verify(mixed,task.solution+'<h1>Hello</h1>',[true,true,true]);
assert.equal(frames,1,'Rendered text still uses the frame checker');
await verify({mode:'dom',fixture:'<button data-state="waiting">Check</button>',tests:[{kind:'attr',selector:'button',name:'data-state',value:'ready',label:'Updated attribute'}]},'document.querySelector("button").setAttribute("data-state","ready");',[true]);
assert.equal(frames,2,'DOM attributes are checked after the student code runs');
await verify({mode:'html',tests:[{kind:'sourceAttr',selector:'script',name:'src',value:'app.js',label:'Script declaration'},{kind:'sourceText',selector:'object',value:'Download',label:'Fallback'}]},'<script src="app.js"></script><object data="guide.pdf">Download</object>',[true,true]);
const cleaned=context.cleanDocument(task.solution+'<script>throw 1</script><p onclick="alert(1)">Hello</p>');
assert.equal(cleaned.querySelector('link'),null,'Preview still strips links');
assert.equal(cleaned.querySelector('script'),null,'Preview still strips scripts');
assert.equal(cleaned.querySelector('p').getAttribute('onclick'),null,'Preview still strips event handlers');
console.log('PASS: '+checks+' shipped HTML checker cases; correct/missing/wrong favicon and description; mixed frame checks; dynamic DOM attributes; source checks; preview filtering. Browser layout not tested.');
