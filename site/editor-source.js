import {basicSetup} from 'codemirror';
import {EditorView,keymap} from '@codemirror/view';
import {EditorState} from '@codemirror/state';
import {indentWithTab} from '@codemirror/commands';
import {html} from '@codemirror/lang-html';
import {css} from '@codemirror/lang-css';
import {javascript} from '@codemirror/lang-javascript';
import {json} from '@codemirror/lang-json';
import {StreamLanguage,syntaxHighlighting,HighlightStyle} from '@codemirror/language';
import {sql} from '@codemirror/legacy-modes/mode/sql';
import {tags,highlightTree,classHighlighter} from '@lezer/highlight';
import {parse} from 'acorn';
const mounted=[];
const language=mode=>({html:html(),ejs:html(),css:css(),scss:css(),js:javascript(),dom:javascript(),node:javascript(),express:javascript(),json:json(),sql:StreamLanguage.define(sql({}))}[mode] || []);
const theme=EditorView.theme({
 '&':{background:'#111520',color:'#e5eaf7',fontSize:'15px'},'.cm-content':{fontFamily:'Consolas,"Cascadia Code",monospace',minHeight:'270px',caretColor:'#fff',padding:'16px 0'},
 '.cm-scroller':{overflow:'auto',fontFamily:'Consolas,monospace',lineHeight:'1.8',maxHeight:'560px'},'.cm-gutters':{background:'#111520',color:'#7987a7',border:'none',paddingRight:'8px'},
 '.cm-activeLine,.cm-activeLineGutter':{background:'#ffffff07'},'.cm-selectionBackground':{background:'#56447f !important'},'.cm-cursor':{borderLeftColor:'#fff'},
 '.cm-tooltip':{background:'#20283b',color:'#eef0ff',border:'1px solid #475270'},'.cm-tooltip-autocomplete ul li[aria-selected]':{background:'#53468c',color:'#fff'}
},{dark:true});
const colors=HighlightStyle.define([{tag:tags.keyword,color:'#c5a1ff'},{tag:tags.string,color:'#9de3b6'},{tag:tags.number,color:'#ffcb91'},{tag:tags.comment,color:'#8994ae',fontStyle:'italic'},{tag:tags.tagName,color:'#ff9aa9'},{tag:tags.attributeName,color:'#d4c58b'},{tag:tags.propertyName,color:'#91cfff'},{tag:tags.bool,color:'#ffcb91'},{tag:tags.function(tags.variableName),color:'#93cfff'}]);
function mount(field,mode,onCheck){
 const host=document.createElement('div');host.className='code-mirror';field.after(host);
 const original=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value');let syncing=false;
 const view=new EditorView({parent:host,state:EditorState.create({doc:field.value,extensions:[basicSetup,language(mode),syntaxHighlighting(colors),theme,
  keymap.of([indentWithTab,{key:'Mod-Enter',run:()=>{onCheck();return true;}}]),EditorView.contentAttributes.of({'aria-label':field.getAttribute('aria-label')||'Code editor',spellcheck:'false'}),
  EditorView.updateListener.of(update=>{if(update.docChanged&&!syncing){original.set.call(field,update.state.doc.toString());field.dispatchEvent(new Event('input',{bubbles:true}));}})]})});
 Object.defineProperty(field,'value',{configurable:true,get:()=>view.state.doc.toString(),set:value=>{value=String(value);original.set.call(field,value);if(view.state.doc.toString()!==value){syncing=true;view.dispatch({changes:{from:0,to:view.state.doc.length,insert:value}});syncing=false;}}});
 field.hidden=true;field.focus=()=>view.focus();mounted.push(view);
 return view;
}
function clear(){for(const view of mounted.splice(0))view.destroy();}
function highlight(code,mode){
 const lang=language(mode);const parser=lang.language?.parser;if(!parser)return escape(code);
 const tree=parser.parse(code);let cursor=0,out='';
 highlightTree(tree,classHighlighter,(from,to,classes)=>{out+=escape(code.slice(cursor,from))+`<span class="${classes}">${escape(code.slice(from,to))}</span>`;cursor=to;});
 return out+escape(code.slice(cursor));
}
function escape(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
// Limite de pas introduse prin AST: buclele accidentale nu blochează laboratorul DOM.
function guard(code){
 const tree=parse(code,{ecmaVersion:'latest',sourceType:'script'});const id='__twGuard'+Math.random().toString(36).slice(2);const changes=[];
 const visit=node=>{
  if(!node||typeof node.type!=='string')return;
  if(['ForStatement','WhileStatement','DoWhileStatement','ForInStatement','ForOfStatement'].includes(node.type)){
   if(node.body.type==='BlockStatement')changes.push({at:node.body.start+1,text:`${id}();`});
   else{changes.push({at:node.body.start,text:`{${id}();`});changes.push({at:node.body.end,text:'}'});}
  }
  for(const value of Object.values(node)){if(Array.isArray(value))value.forEach(visit);else if(value&&typeof value==='object')visit(value);}
 };
 visit(tree);changes.sort((a,b)=>b.at-a.at);for(const change of changes)code=code.slice(0,change.at)+change.text+code.slice(change.at);
 return `let ${id}Count=0;function ${id}(){if(++${id}Count>50000)throw new Error("Too many loop iterations. Check your loop condition.");}\n`+code;
}
window.TW_EDITOR={mount,clear,highlight,guard};
