// Build-time only. Downloads the official, checksum-pinned Linux CLI for App Service.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const version='1.0.0-preview.4';
const digest='94807575393858e9973041f32327a0562c754017a1668e4d6b19870f231d8f8e';
if(process.platform!=='linux'||process.arch!=='x64')throw new Error('Run this build step on Linux x64.');
await fs.mkdir('tools/aca',{recursive:true});
const response=await fetch(`https://github.com/microsoft/azure-container-apps/releases/download/aca-cli-v${version}/aca-cli-v${version}-linux-x64.tar.gz`,{signal:AbortSignal.timeout(120000)});
if(!response.ok)throw new Error('Could not download ACA CLI.');
const bytes=Buffer.from(await response.arrayBuffer());
if(createHash('sha256').update(bytes).digest('hex')!==digest)throw new Error('ACA archive checksum mismatch.');
const archive=path.resolve('tools/aca.tar.gz');await fs.writeFile(archive,bytes);
try{
 const entries=execFileSync('tar',['-tzf',archive],{encoding:'utf8'}).trim().split('\n');
 if(entries.some(name=>path.posix.isAbsolute(name)||name.split('/').includes('..')))throw new Error('Unsafe archive paths.');
 execFileSync('tar',['-xzf',archive,'-C','tools/aca']);
 const entry=entries.find(name=>name.split('/').at(-1)==='aca');
 if(!entry)throw new Error('Missing ACA executable.');
 const binary=path.resolve('tools/aca',entry);await fs.chmod(binary,0o755);
 await fs.writeFile('tools/aca-path.json',JSON.stringify({path:path.relative('tools',binary)})+'\n');
 const versionText=execFileSync(binary,['--version'],{encoding:'utf8'}).trim();
 if(!versionText.includes(version))throw new Error('Unexpected ACA CLI version.');
 // Catch breaking flag changes before deploying; these checks create no resources.
 const help=execFileSync(binary,['sandbox','create','--help'],{encoding:'utf8'});
 for(const flag of ['--disk-id','--cpu','--memory','--egress-default','--traffic-inspection'])if(!help.includes(flag))throw new Error('ACA CLI missing '+flag);
 console.log('Verified ACA CLI',version,'and Sandbox creation flags. No Azure resources created.');
}finally{await fs.unlink(archive);}
