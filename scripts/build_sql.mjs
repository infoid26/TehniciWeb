import {build} from 'esbuild';
import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
const require=createRequire(import.meta.url);
const dist=path.dirname(require.resolve('@electric-sql/pglite'));
await build({entryPoints:['site/sql-worker-source.js'],bundle:true,platform:'browser',format:'esm',minify:true,outfile:'site/sql-worker.js',legalComments:'eof',external:['node:*']});
for(const name of ['pglite.wasm','initdb.wasm','pglite.data'])await fs.copyFile(path.join(dist,name),path.join('site',name));
let license='PGlite is Apache-2.0 licensed and embeds PostgreSQL under the PostgreSQL License.\n';
for(const name of ['LICENSE','LICENSE.md'])try{license+=await fs.readFile(path.join(dist,'..',name),'utf8');break;}catch{}
await fs.writeFile('site/sql-licenses.txt',license);
console.log('SQL worker and PostgreSQL browser assets built.');
