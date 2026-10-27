(() => {
  'use strict';
  function create({accountPromise,onStatus=()=>{}}){
    const baseKey='tw-exam-history-v2';
    let user=null,key=baseKey+':guest',completed=new Set(),recorded=new Set(),pending=new Map(),syncing;
    const persist=()=>{try{localStorage.setItem(key,JSON.stringify({completed:[...completed],recorded:[...recorded],pending:[...pending.values()]}));}catch{onStatus('Istoricul nu poate fi salvat în acest browser.');}};
    const request=async(method,body)=>{
      const response=await fetch('/api/exam/tickets',{method,credentials:'same-origin',cache:'no-store',redirect:'error',signal:AbortSignal.timeout(10000),headers:{'X-TW-Account':user.id,'Content-Type':'application/json','X-TW-Exam':'1'},...(body?{body:JSON.stringify(body)}:{})});
      const value=await response.json();
      if(!response.ok){const error=new Error(value.error||'Istoricul biletelor nu poate fi sincronizat.');error.code=value.code;throw error;}
      return value;
    };
    const replace=ids=>{completed=new Set(ids);persist();};
    async function flush(){
      if(!user)return;
      if(syncing){await syncing;if(pending.size)return flush();return;}
      syncing=(async()=>{
        for(const submission of [...pending.values()]){
          const value=await request('POST',{action:'complete',...submission});
          pending.delete(submission.submissionId);replace(value.completed);
        }
      })();
      try{await syncing;}finally{syncing=null;}
    }
    const ready=(async()=>{
      const account=await accountPromise;
      if(!account||account.unavailable)throw new Error('Nu pot verifica starea contului. Reîncarcă pagina pentru a extrage fără repetări.');
      user=account.user;
      if(user)key=baseKey+':account:'+user.id;
      try{
        const saved=JSON.parse(localStorage.getItem(key)||'null');
        if(saved){
          completed=new Set(saved.completed||[]);recorded=new Set(saved.recorded||[]);
          pending=new Map((saved.pending||[]).map(submission=>[submission.submissionId,submission]));
        }else if(!user){
          const legacy=JSON.parse(localStorage.getItem('tw-exam-history-v1:guest')||'null');
          completed=new Set(legacy?.completed||[]);
        }
      }catch{}
      if(user){await flush();replace((await request('GET')).completed);}
      return user;
    })();
    return {
      ready,
      async draw(category){
        await ready;
        if(user){await flush();const value=await request('POST',{action:'draw',category});replace(value.completed);return value.ticketId;}
        const categoryTickets=window.TW_EXAM.tickets.filter(t=>t.category===category);
        if(!categoryTickets.length)throw new Error('Proba nu are bilete disponibile.');
        let pool=categoryTickets.filter(t=>!completed.has(t.id));
        if(!pool.length){for(const ticket of categoryTickets)completed.delete(ticket.id);persist();pool=categoryTickets;}
        return pool[Math.floor(Math.random()*pool.length)].id;
      },
      async complete(submission){
        await ready;
        if(!recorded.has(submission.submissionId)){
          recorded.add(submission.submissionId);
          for(const id of submission.ticketIds)completed.add(id);
          if(user)pending.set(submission.submissionId,submission);
          persist();
        }
        try{await flush();onStatus('');}catch{onStatus('Simularea predată este salvată local. Istoricul contului va fi sincronizat înainte de următoarea extragere.');}
      }
    };
  }
  window.TW_EXAM_HISTORY={create};
})();
