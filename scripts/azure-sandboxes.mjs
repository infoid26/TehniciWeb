import {randomUUID} from 'node:crypto';
import {execFile} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;

function createdSandboxId(output){
  let id;
  try{id=JSON.parse(output)?.id;}
  catch{
    // ACA preview.4 prints this confirmation even with --output json.
    id=/^Created sandbox: ([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.exec(output.trim())?.[1];
  }
  if(typeof id!=='string'||!uuid.test(id))throw new Error('Missing sandbox ID.');
  return id;
}

// The CLI stays on the trusted App Service, never in the evaluator image.
// Pin/version/hash and supported flags are checked by install_aca.mjs in CI.
export function sandboxSettings(env=process.env){
  const values={subscription:env.LAB_AZURE_SUBSCRIPTION_ID,resourceGroup:env.LAB_AZURE_RESOURCE_GROUP,group:env.LAB_AZURE_SANDBOX_GROUP,diskId:env.LAB_AZURE_SANDBOX_DISK_ID,region:env.LAB_AZURE_REGION||'italynorth'};
  if(!values.group&&!values.diskId)return null;
  if(!uuid.test(values.subscription||'')||!uuid.test(values.diskId||'')||![values.resourceGroup,values.group].every(x=>typeof x==='string'&&/^[\w.-]{1,90}$/.test(x))||!/^[a-z0-9]+$/.test(values.region))throw new Error('Incomplete or invalid Azure Sandbox settings.');
  if(env.LAB_AZURE_CLIENT_ID&&!uuid.test(env.LAB_AZURE_CLIENT_ID))throw new Error('Invalid managed identity client ID.');
  return {...values,identity:env.LAB_AZURE_CLIENT_ID||'system'};
}

export function createSandboxEvaluator({env=process.env,runCommand,onCleanupError=()=>{}}={}){
  const config=sandboxSettings(env);
  if(!config)throw new Error('Azure Sandbox is not configured.');
  let binary;
  const run=runCommand||(async(args,{timeout=20000,signal}={})=>{
    if(!binary){
      const tools=fileURLToPath(new URL('../tools/',import.meta.url));
      const manifest=JSON.parse(await fs.readFile(path.join(tools,'aca-path.json'),'utf8'));
      binary=path.resolve(tools,manifest.path);
      if(!binary.startsWith(path.resolve(tools,'aca')+path.sep))throw new Error('Invalid ACA executable path.');
    }
    return new Promise((resolve,reject)=>{
    execFile(binary,args,{timeout,signal,maxBuffer:1500000,windowsHide:true,encoding:'utf8',env},(error,stdout)=>{
      // Do not expose CLI stderr (which can contain credentials) to the browser.
      if(error)reject(new Error('Azure Sandbox command failed.'));else resolve(stdout);
    });
    });
  });
  const common=['--subscription',config.subscription,'--resource-group',config.resourceGroup,'--group',config.group,'--region',config.region,'--managed-identity',config.identity,'--output','json'];
  const command=(args,options)=>run([...args,...common],options);
  let cleanupFailed=false;
  return async(_url,options)=>{
    // Refuse further work if cleanup failed, to avoid accumulating billed VMs.
    if(cleanupFailed)throw new Error('Evaluator paused after sandbox cleanup failure.');
    if(Buffer.byteLength(options.body||'')>524288)throw new Error('Evaluation input too large.');
    const name='tw-eval-'+randomUUID();
    const selector=['--selector','name='+name];
    const folder=await fs.mkdtemp(path.join(os.tmpdir(),'tw-eval-'));
    try{
      const id=createdSandboxId(await command(['sandbox','create','--disk-id',config.diskId,'--cpu','250m','--memory','512Mi','--label','name='+name,'--label','service=tehnici-web','--egress-default','Deny','--traffic-inspection','Full'],{timeout:20000,signal:options.signal}));
      await command(['sandbox','lifecycle','set',...selector,'--auto-suspend','enable','--mode','Disk','--idle-timeout-seconds','60'],{timeout:5000,signal:options.signal});
      // Upload data as a file, avoiding shell injection and OS argument-size limits.
      const inputFile=path.join(folder,'input.json');
      await fs.writeFile(inputFile,options.body,{mode:0o600});
      await command(['sandbox','fs','cp',inputFile,id+':/tmp/tw-input.json'],{timeout:8000,signal:options.signal});
      const shell='env -i PATH=/usr/local/bin:/usr/bin:/bin NODE_ENV=production node /app/evaluator/run.mjs < /tmp/tw-input.json';
      const output=await command(['sandbox','exec',...selector,'--command',shell],{timeout:12000,signal:options.signal});
      if(Buffer.byteLength(output)>1400000)throw new Error('Sandbox output too large.');
      const result=JSON.parse(output);
      if((result.exitCode??result.exit_code)!==0||typeof result.stdout!=='string'||Buffer.byteLength(result.stdout)>1048576)throw new Error('Sandbox evaluation failed.');
      return new Response(result.stdout,{headers:{'Content-Type':'application/json'}});
    }finally{
      // Unique label permits cleanup even if create timed out before returning an ID.
      // Cleanup has its own timeout; a canceled evaluation must still be destroyed.
      try{await command(['sandbox','delete',...selector,'--yes'],{timeout:10000});}
      catch{cleanupFailed=true;onCleanupError();}
      await fs.rm(folder,{recursive:true,force:true});
    }
  };
}
