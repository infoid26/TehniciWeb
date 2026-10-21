import * as sass from '../node_modules/sass/sass.default.js';
import ejs from '../node_modules/ejs/ejs.min.js';

self.onmessage=event=>{
 const {task,code}=event.data;
 try{
  if(task.mode==='scss'){
   const compiled=sass.compileString(code,{importers:[{
    canonicalize(url){return Object.hasOwn(task.files||{},url)||Object.hasOwn(task.files||{},'_'+url.replace(/\.scss$/,'')+'.scss')?new URL(url,'virtual:///'):null;},
    load(url){const name=url.pathname.slice(1),content=task.files?.[name]??task.files?.['_'+name.replace(/\.scss$/,'')+'.scss'];return content===undefined?null:{contents:content,syntax:'scss'};}
   }],style:'expanded'}).css;
   self.postMessage({compiled});
  }else{
   // No filesystem filename: browser EJS must resolve only the provided partials.
   const rendered=ejs.render(code,task.data||{},{includer(name){const content=task.partials?.[name];if(content===undefined)throw new Error(`Unknown training partial: ${name}`);return {template:content};}});
   self.postMessage({rendered});
  }
 }catch(e){self.postMessage({results:[{label:task.mode.toUpperCase(),passed:false,error:e.message.slice(0,1200)}]});}
};
