import {build} from 'esbuild';
import fs from 'node:fs/promises';
await build({entryPoints:['site/template-worker-source.js'],bundle:true,platform:'browser',format:'esm',minify:true,outfile:'site/template-worker.js',legalComments:'eof'});
await fs.writeFile('site/template-licenses.txt',(await fs.readFile('node_modules/sass/LICENSE','utf8'))+'\n\nEJS\n'+(await fs.readFile('node_modules/ejs/LICENSE','utf8')));
console.log('Sass and EJS browser worker built.');
