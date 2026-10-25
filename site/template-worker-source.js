import * as sass from '../node_modules/sass/sass.default.js';
import ejs from '../node_modules/ejs/ejs.min.js';

self.onmessage=async event=>{
 const {task,code}=event.data;
 try{
  if(task.mode==='scss'){
   if(task.bootstrap){
    const response=await fetch(new URL('bootstrap-scss.json',import.meta.url));
    if(!response.ok)throw new Error('Sursele Bootstrap nu s-au putut încărca.');
    task.files={...await response.json(),...task.files};
   }
   const compiled=sass.compileString(code,{url:new URL('virtual:///exercise.scss'),logger:sass.Logger.silent,importers:[{
    canonicalize(url,options){
     const base=options.containingUrl||new URL('virtual:///');
     const resolved=url.startsWith('virtual:')?new URL(url):new URL(url,base);
     const name=resolved.pathname.slice(1).replace(/\.scss$/,'');
     const slash=name.lastIndexOf('/');
     const partial=name.slice(0,slash+1)+'_'+name.slice(slash+1)+'.scss';
     const candidate=[name+'.scss',partial,name+'/index.scss',name+'/_index.scss'].find(key=>Object.hasOwn(task.files||{},key));
     return candidate?new URL(candidate,'virtual:///'):null;
    },
    load(url){const content=task.files?.[url.pathname.slice(1)];return content===undefined?null:{contents:content,syntax:'scss'};}
   }],style:'expanded'}).css;
   self.postMessage({compiled});
  }else{
   // No filesystem filename: browser EJS must resolve only the provided partials.
   const rendered=ejs.render(code,task.data||{},{includer(name){const content=task.partials?.[name];if(content===undefined)throw new Error(`Unknown training partial: ${name}`);return {template:content};}});
   self.postMessage({rendered});
  }
 }catch(e){self.postMessage({results:[{label:task.mode.toUpperCase(),passed:false,error:e.message.slice(0,1200)}]});}
};
