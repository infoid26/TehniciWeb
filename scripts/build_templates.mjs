import {build} from 'esbuild';
import fs from 'node:fs/promises';
await build({entryPoints:['site/template-worker-source.js'],bundle:true,platform:'browser',format:'esm',minify:true,supported:{'template-literal':false},outfile:'site/template-worker.js',legalComments:'eof'});
await fs.writeFile('site/template-licenses.txt',(await fs.readFile('node_modules/sass/LICENSE','utf8'))+'\n\nEJS\n'+(await fs.readFile('node_modules/ejs/LICENSE','utf8')));
console.log('Sass and EJS browser worker built.');

const bootstrapRoot=new URL('../node_modules/bootstrap/scss/',import.meta.url);
const bootstrapFiles={};
for(const file of await fs.readdir(bootstrapRoot,{recursive:true})){
 if(file.endsWith('.scss'))bootstrapFiles['bootstrap/scss/'+file.replaceAll('\\','/')]=await fs.readFile(new URL(file.replaceAll('\\','/'),bootstrapRoot),'utf8');
}
await fs.writeFile('site/bootstrap-scss.json',JSON.stringify(bootstrapFiles));
console.log('Bundled '+Object.keys(bootstrapFiles).length+' genuine Bootstrap Sass files.');
