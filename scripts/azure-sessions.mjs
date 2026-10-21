import {randomUUID} from 'node:crypto';

// Runs on the trusted App Service. Never copy this module into the sandbox image.
export function createSessionEvaluator({endpoint,env=process.env,fetchImpl=fetch,onCleanupError=()=>{}}) {
  const base=new URL(endpoint);
  if(base.protocol!=='https:'||base.username||base.password||base.search||base.hash||!base.hostname.endsWith('.azurecontainerapps.io'))throw new Error('Invalid Azure custom session pool management endpoint.');
  base.pathname=base.pathname.replace(/\/$/,'')+'/';
  const token=async()=>{
    if(!env.IDENTITY_ENDPOINT||!env.IDENTITY_HEADER)throw new Error('App Service managed identity is not configured.');
    const url=new URL(env.IDENTITY_ENDPOINT);
    url.searchParams.set('api-version','2019-08-01');
    url.searchParams.set('resource','https://dynamicsessions.io');
    if(env.LAB_AZURE_CLIENT_ID)url.searchParams.set('client_id',env.LAB_AZURE_CLIENT_ID);
    const response=await fetchImpl(url,{headers:{'X-IDENTITY-HEADER':env.IDENTITY_HEADER},redirect:'error',signal:AbortSignal.timeout(5000)});
    if(!response.ok)throw new Error('Managed identity token request failed.');
    const value=await response.json();
    if(typeof value.access_token!=='string'||!value.access_token)throw new Error('Missing managed identity token.');
    return value.access_token;
  };
  return async (_url,options)=>{
    const bearer=await token();
    const identifier=randomUUID();
    const url=new URL('evaluate',base);url.searchParams.set('identifier',identifier);
    const headers={'Content-Type':'application/json',Authorization:'Bearer '+bearer};
    try{
      const response=await fetchImpl(url,{...options,headers,redirect:'error'});
      // Consume the bounded result before destroying its session.
      const chunks=[];let size=0;
      for await(const chunk of response.body||[]){size+=chunk.byteLength;if(size>1048576)throw new Error('Session response too large');chunks.push(Buffer.from(chunk));}
      return new Response(Buffer.concat(chunks),{status:response.status});
    }finally{
      const stop=new URL('.management/stopSession',base);
      stop.searchParams.set('identifier',identifier);stop.searchParams.set('api-version','2025-02-02-preview');
      try{
        const response=await fetchImpl(stop,{method:'POST',headers,redirect:'error',signal:AbortSignal.timeout(3000)});
        if(!response.ok)onCleanupError();
        await response.body?.cancel();
      }catch{onCleanupError();}
    }
  };
}
