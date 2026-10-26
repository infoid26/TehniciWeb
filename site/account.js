(() => {
  'use strict';
  const clone=value=>JSON.parse(JSON.stringify(value));
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const empty=()=>({version:2,records:{},resume:''});

  // Merge independent lessons automatically; never silently replace conflicting code.
  function mergeProgress(base,local,remote){
    const progress=clone(remote),conflicts=[];
    for(const id of new Set([...Object.keys(base.records),...Object.keys(local.records),...Object.keys(remote.records)])){
      const before=base.records[id],ours=local.records[id],theirs=remote.records[id];
      if(same(ours,before))continue;
      if(!same(theirs,before)&&!same(ours,theirs)){conflicts.push(id);continue;}
      if(ours===undefined)delete progress.records[id];else progress.records[id]=clone(ours);
    }
    if(local.resume!==base.resume)progress.resume=local.resume;
    return {progress,conflicts};
  }

  function signOutControl(controls,label,onLogout){
    const form=document.createElement('form');form.method='post';form.action='/account/logout';form.className='account-signout-form';
    const submit=document.createElement('button');submit.type='submit';submit.className='secondary';submit.textContent=label;
    if(onLogout)form.addEventListener('submit',onLogout);
    form.append(submit);controls.append(form);return submit;
  }
  function renderControls(controls,{user=null,enabled=true,returnTo='/',onLogout}={}){
    controls.replaceChildren();
    if(user){
      const signOut=signOutControl(controls,'',onLogout);
      signOut.className='secondary account-signout';signOut.title=user.email;
      signOut.ariaLabel='Logout: '+(user.name||user.email);
      const label=document.createElement('span');label.className='account-name';label.textContent=user.name||user.email;
      const action=document.createElement('span');action.className='account-signout-label';action.textContent='Logout';
      signOut.append(label);signOut.append(action);
    }else{
      const signIn=document.createElement(enabled?'a':'button');
      signIn.className='secondary account-signin';signIn.textContent='Conectare cu Microsoft';
      if(enabled)signIn.href='/.auth/login/aad?post_login_redirect_uri='+encodeURIComponent(returnTo);
      else{signIn.type='button';signIn.disabled=true;signIn.title='Conectarea Microsoft nu este activă pe această adresă.';}
      controls.append(signIn);
    }
  }
  async function mountHeader({returnTo='/',onLogout}={}){
    const controls=document.querySelector('#account-controls');
    const status=document.querySelector('#account-header-status');
    if(!controls)return;
    const message=text=>{if(status){status.textContent=text;status.hidden=!text;}};
    const unavailable=text=>{renderControls(controls,{enabled:false});message(text);};
    if(location.protocol==='file:'){unavailable('Conectarea cu Microsoft este disponibilă pe site-ul public.');return;}
    try{
      const response=await fetch('/api/account',{credentials:'same-origin',cache:'no-store',redirect:'error',signal:AbortSignal.timeout(10000)});
      const account=await response.json();
      if(!response.ok){const error=new Error(account.error||'Conectarea nu este disponibilă momentan.');error.status=response.status;throw error;}
      renderControls(controls,{user:account.user,enabled:account.enabled,returnTo,onLogout});
      message(account.enabled?'':'Conectarea cu Microsoft este disponibilă pe site-ul public.');
    }catch(error){
      if(error.status===403){controls.replaceChildren();signOutControl(controls,'Schimbă contul Microsoft',onLogout);message(error.message);}
      else unavailable('Conectarea nu este disponibilă momentan. Poți continua simularea.');
    }
  }

  function create({getState,setState,normalize,storageKey,refresh,download}){
    const panel=document.querySelector('#account-panel');
    const controls=document.querySelector('#account-controls');
    const actions=document.querySelector('#account-actions');
    const status=document.querySelector('#account-status');
    let user=null,base=empty(),version=0,ready=false,stopped=false,busy=false,timer,retry=2000,conflict=null,imported=false;
    const message=text=>{status.textContent=text;};
    const button=(label,fn)=>{const el=document.createElement('button');el.type='button';el.className='secondary';el.textContent=label;el.addEventListener('click',fn);actions.append(el);return el;};
    const beforeLogout=()=>{persist();stopped=true;clearTimeout(timer);};
    const logoutControl=label=>signOutControl(controls,label,beforeLogout);
    const cacheKey=()=>storageKey+':account:'+user.id;
    const exportLocal=()=>download('TehniciWeb-progres-local.json',JSON.stringify(getState(),null,2),'application/json');
    function persist(){
      try{
        localStorage.setItem(user?cacheKey():storageKey,JSON.stringify(user?{progress:getState(),base,version,imported}:getState()));
        return true;
      }catch{message('Nu pot salva copia locală. Descarcă progresul pentru o copie de siguranță.');return false;}
    }
    const request=async(path,options={})=>{
      const response=await fetch(path,{credentials:'same-origin',cache:'no-store',redirect:'error',signal:AbortSignal.timeout(10000),...options});
      const value=await response.json();
      if(!response.ok){const error=new Error(value.error||'Sincronizarea nu este disponibilă.');error.status=response.status;error.value=value;throw error;}
      return value;
    };
    const headers=()=>({'X-TW-Account':user.id});
    function showConflict(value){
      conflict=value;stopped=true;clearTimeout(timer);
      actions.replaceChildren();
      button('Descarcă varianta locală',exportLocal);
      button('Încarcă varianta din cont',()=>{
        if(!confirm('Descarc întâi o copie a variantei locale, apoi încarc progresul din cont. Continui?'))return;
        exportLocal();setState(normalize(conflict.progress));base=clone(getState());version=conflict.version;conflict=null;stopped=false;persist();render();refresh();message('Progresul din cont a fost încărcat. Copia locală anterioară a fost descărcată.');
      });
      message('Aceeași lecție a fost modificată pe alt dispozitiv. Am oprit sincronizarea pentru a păstra ambele variante.');
    }
    function render(preview=false){
      panel.hidden=!user;
      const signinHint=document.querySelector('#account-signin-hint');
      if(signinHint){
        signinHint.hidden=Boolean(user);
        signinHint.textContent=preview?'Conectarea cu Microsoft este disponibilă pe site-ul public.':'Conectează-te cu Microsoft pentru a salva progresul în cont.';
      }
      actions.replaceChildren();
      renderControls(controls,{user,enabled:!preview,onLogout:beforeLogout});
    }
    function importAnonymous(){
      if(imported)return;
      let guest;
      try{
        const owner=localStorage.getItem(storageKey+':anonymous-owner');
        // The same anonymous history must not be assigned to a second account.
        if(owner&&owner!==user.id){imported=true;persist();return;}
        const saved=localStorage.getItem(storageKey);
        if(!saved){imported=true;persist();return;}
        guest=normalize(JSON.parse(saved));
        if(Object.keys(guest.records).length)localStorage.setItem(storageKey+':anonymous-owner',user.id);
      }catch{return;}
      const current=clone(getState());
      for(const [id,record] of Object.entries(guest.records))if(!Object.hasOwn(current.records,id))current.records[id]=record;
      if(!current.resume)current.resume=guest.resume;
      imported=true;setState(current);persist();refresh();
    }
    function schedule(delay=1200){
      clearTimeout(timer);
      if(user&&!stopped)timer=setTimeout(()=>void sync(),delay);
    }
    function save(){
      const localSaved=persist();
      if(user&&!stopped){message(localSaved?'Modificări salvate local. Se sincronizează…':'Se sincronizează…');schedule();}
    }
    function acceptRemote(value){
      if(!Number.isSafeInteger(value.version)||value.version<0)throw new Error('Răspuns de sincronizare invalid.');
      const remote=normalize(value.progress);
      const merged=mergeProgress(base,getState(),remote);
      if(merged.conflicts.length){showConflict({version:value.version,progress:remote});return false;}
      const changed=!same(merged.progress,getState());
      base=clone(remote);version=value.version;setState(merged.progress);persist();
      if(changed)refresh();
      return true;
    }
    async function sync(){
      if(!user||stopped||busy)return;
      busy=true;
      try{
        if(!ready){
          if(!acceptRemote(await request('/api/progress',{headers:headers()})))return;
          ready=true;
          importAnonymous();
        }
        if(same(getState(),base)){message('Progres sincronizat cu contul.');return;}
        const snapshot=clone(getState());
        const saved=await request('/api/progress',{method:'PUT',headers:{...headers(),'Content-Type':'application/json','X-TW-Progress':'1'},body:JSON.stringify({version,progress:snapshot})});
        base=normalize(saved.progress);version=saved.version;persist();retry=2000;
        if(same(getState(),base))message('Progres sincronizat cu contul.');else schedule();
      }catch(error){
        if(error.status===409&&error.value.code!=='account-changed'){
          if(acceptRemote(error.value))schedule(100);
        }else if([401,403,409].includes(error.status)){
          stopped=true;message(error.message+' Copia locală rămâne pe acest dispozitiv.');
        }else if([400,413,415].includes(error.status)){
          stopped=true;message(error.message);button('Descarcă progresul',exportLocal);
        }else{
          message('Sincronizarea nu este disponibilă. Progresul rămâne salvat local; reîncerc automat.');
          schedule(retry);retry=Math.min(retry*2,60000);
        }
      }finally{busy=false;}
    }
    async function start(){
      if(location.protocol==='file:'){panel.hidden=true;return;}
      try{
        const account=await request('/api/account');
        if(!account.enabled){render(true);message('Conectarea Microsoft nu este activă pe această adresă. Progresul este salvat în acest browser.');return;}
        user=account.user;
        if(!user){render();message('');return;}
        // Restore this account's pending edits before loading and merging cloud data.
        let local;
        try{local=JSON.parse(localStorage.getItem(cacheKey())||'null');}catch{}
        try{
          if(local&&Number.isSafeInteger(local.version)&&local.version>=0){base=normalize(local.base);version=local.version;setState(normalize(local.progress));imported=local.imported===true;}
          else setState(empty());
        }catch{setState(empty());base=empty();version=0;message('Copia locală a contului nu a putut fi citită.');}
        render();await sync();
      }catch(error){
        if(error.status===403){controls.replaceChildren();logoutControl('Schimbă contul Microsoft');message(error.message);}
        else message('Conectarea nu este disponibilă momentan. Poți continua cu progres local.');
      }
    }
    window.addEventListener('online',()=>schedule(0));
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')void sync();});
    return {start,save,flush:sync};
  }
  window.TW_ACCOUNTS={create,mergeProgress,mountHeader};
})();
