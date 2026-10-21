import {build} from 'esbuild';
import fs from 'node:fs/promises';
await build({entryPoints:['site/editor-source.js'],bundle:true,minify:true,format:'iife',outfile:'site/editor.js',legalComments:'eof'});
const packages=['codemirror','@codemirror/lang-html','@codemirror/lang-css','@codemirror/lang-javascript','@codemirror/lang-json','@codemirror/legacy-modes','acorn'];
const require=(await import('node:module')).createRequire(import.meta.url);
const path=await import('node:path');let licenses='Bundled editor dependencies. CodeMirror is MIT licensed; Acorn is MIT licensed.\n';
for(const pkg of packages){try{let dir=path.dirname(require.resolve(pkg));for(let i=0;i<4;i++){try{const text=await fs.readFile(path.join(dir,'LICENSE'),'utf8');licenses+=`\n--- ${pkg} ---\n${text}\n`;break;}catch{}dir=path.dirname(dir);}}catch{}}
await fs.writeFile('site/editor-licenses.txt',licenses);
console.log('Editor HTML/CSS/JS/JSON/SCSS/SQL generat.');
