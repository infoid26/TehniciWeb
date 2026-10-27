(() => {
  'use strict';
  function create({accountPromise,onStatus=()=>{}}){
    const baseKey='tw-exam-history-v1';
    let user=null,key=baseKey+':guest',completed=new Set(),pending=new Set(),syncing;
    const persist=()=>{try{localStorage.setItem(key,JSON.stringify({completed:[...completed],pending:[...pending]}));}catch{onStatus('Istoricul nu poate fi salvat în acest browser.');}};
    const request=async(method,body)=>{
      const response=await fetch('/api/exam/tickets',{method,credentials:'same-origin',cache:'no-store',redirect:'error',signal:AbortSignal.timeout(10000),headers:{'X-TW-Account':user.id,'Content-Type':'application/json','X-TW-Exam':'1'},...(body?{body:JSON.stringify(body)}:{})});
      const value=await response.json();
      if(!response.ok){const error=new Error(value.error||'Istoricul biletelor nu poate fi sincronizat.');error.code=value.code;throw error;}
      return value;
    };
    const merge=ids=>{for(const id of ids)completed.add(id);persist();};
    async function flush(){
      if(!user)return;
      if(syncing){await syncing;if(pending.size)return flush();return;}
      syncing=(async()=>{
        for(const id of [...pending]){
          const value=await request('POST',{action:'complete',ticketId:id});
          pending.delete(id);merge(value.completed);
        }
      })();
      try{await syncing;}finally{syncing=null;}
    }
    const ready=(async()=>{
      const account=await accountPromise;
      if(!account||account.unavailable)throw new Error('Nu pot verifica starea contului. Reîncarcă pagina pentru a extrage fără repetări.');
      user=account.user;
      if(user)key=baseKey+':account:'+user.id;
      try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved){completed=new Set(saved.completed||[]);pending=new Set(saved.pending||[]);}}catch{}
      if(user){await flush();merge((await request('GET')).completed);}
      return user;
    })();
    return {
      ready,
      async draw(category){
        await ready;
        if(user){await flush();const value=await request('POST',{action:'draw',category,exclude:[...completed]});merge(value.completed);return value.ticketId;}
        const pool=window.TW_EXAM.tickets.filter(t=>t.category===category&&!completed.has(t.id));
        if(!pool.length)throw new Error('Ai parcurs toate biletele acestei probe. Nu mai sunt bilete noi.');
        return pool[Math.floor(Math.random()*pool.length)].id;
      },
      async complete(ticketId){
        await ready;completed.add(ticketId);if(user)pending.add(ticketId);persist();
        try{await flush();onStatus('');}catch{onStatus('Biletul predat este salvat local. Istoricul contului va fi sincronizat înainte de următoarea extragere.');}
      }
    };
  }
  window.TW_EXAM_HISTORY={create};
})();
