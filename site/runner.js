/* Preview în iframe cu origine izolată. JavaScript-ul elevului rulează într-un worker cu timeout. */
(() => {
  'use strict';
  const nonce = 'tw-preview';
  // Sandboxed srcdoc frames have an opaque origin: allow the site's explicit
  // HTTP(S) origin for images instead of relying on 'self' inside the frame.
  const imageOrigin = /^https?:$/.test(location.protocol) ? location.origin : '';
  const workerBase = new URL('.', document.currentScript?.src || new URL('site/runner.js', location.href));
  function browserLab(task, code, onCancel) {
    return new Promise(resolve => {
      let worker, timer, settled=false;
      const finish=value=>{if(settled)return;settled=true;clearTimeout(timer);worker?.terminate();resolve(value);};
      const fail=error=>finish({results:[{label:task.mode.toUpperCase(),passed:false,error}]});
      try {
        worker=new Worker(new URL(task.mode==='sql'?'sql-worker.js':'template-worker.js',workerBase),{type:'module'});
        timer=setTimeout(()=>fail('Verificarea a depășit timpul disponibil. Verifică buclele și încearcă din nou după încărcarea componentelor.'),45000);
        worker.onmessage=event=>finish(event.data);
        worker.onerror=event=>{event.preventDefault();fail(event.message||'Componenta de evaluare nu s-a putut încărca.');};
        onCancel?.(()=>fail('Verificare oprită.'));
        worker.postMessage({task,code});
      } catch(e) { fail(e.message); }
    });
  }
  const stable = value => {
    if (Array.isArray(value)) return '[' + value.map(stable).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stable(value[k])).join(',') + '}';
    return JSON.stringify(value);
  };
  function cleanDocument(markup) {
    const doc = new DOMParser().parseFromString(markup, 'text/html');
    doc.querySelectorAll('script, iframe, object, embed, base, link, meta[http-equiv]').forEach(el => el.remove());
    doc.querySelectorAll('*').forEach(el => {
      for (const attr of Array.from(el.attributes)) {
        if (/^on/i.test(attr.name) || ['srcdoc','nonce'].includes(attr.name.toLowerCase()) || /^\s*javascript:/i.test(attr.value)) el.removeAttribute(attr.name);
      }
    });
    return doc;
  }
  function checkInFrame(tests, css, hasDoctype, token) {
    const results = tests.map(t => {
      let passed = false;
      try {
        const el = t.selector ? document.querySelector(t.selector) : null;
        switch (t.kind) {
          case 'doctype': passed = hasDoctype; break;
          case 'count': passed = document.querySelectorAll(t.selector).length >= t.min; break;
          case 'text': passed = !!el && el.textContent.trim() === t.value; break;
          case 'attr': passed = !!el && el.getAttribute(t.name) === t.value; break;
          case 'textContains': passed = !!el && el.textContent.includes(t.value); break;
          case 'absent': passed = !el; break;
          case 'value': passed = !!el && el.value === t.value; break;
          case 'storage': passed = localStorage.getItem(t.key) === t.value; break;
          case 'style': passed = !!el && getComputedStyle(el).getPropertyValue(t.name).trim() === t.value; break;
          case 'custom': passed = !!el && getComputedStyle(el).getPropertyValue(t.name).trim() === t.value; break;
          case 'pseudo': passed = !!el && getComputedStyle(el, t.pseudo).getPropertyValue(t.name).includes(t.includes); break;
          case 'cssIncludes': passed = css.replace(/\s+/g,'').includes(t.value.replace(/\s+/g,'')); break;
          case 'hoverStyle': {
            const hovered=document.querySelector(t.hover),style=document.createElement('style');
            const rules=[];
            const visit=list=>{for(const rule of list){if(rule.selectorText&&rule.selectorText.includes(':hover'))rules.push(rule.cssText.replaceAll(':hover','.tw-check-hover'));else if(rule.cssRules)visit(rule.cssRules);}};
            for(const sheet of document.styleSheets)visit(sheet.cssRules);
            style.textContent=rules.join('\n')+'\n*{transition:none!important;animation:none!important}';
            try {document.head.append(style);hovered?.classList.add('tw-check-hover');passed=!!el&&!!hovered&&getComputedStyle(el).getPropertyValue(t.name).trim()===t.value;}
            finally {hovered?.classList.remove('tw-check-hover');style.remove();}
            break;
          }
          case 'columns': {
            const cols = el ? getComputedStyle(el).gridTemplateColumns.split(/\s+/).filter(Boolean) : [];
            passed = !!el && getComputedStyle(el).display === 'grid' && cols.length === t.count && cols.every(n => Math.abs(parseFloat(n) - parseFloat(cols[0])) < 1);
            break;
          }
        }
      } catch { passed = false; }
      return { label:t.label, passed };
    });
    parent.postMessage({ type:'tw-check', token, results }, '*');
  }
  function sourceDoc(task, code, tests, token) {
    const markup = task.mode === 'html' ? code : task.fixture;
    const css = task.mode === 'css' ? code : '';
    const doc = cleanDocument(markup);
    const policy = doc.createElement('meta');
    policy.httpEquiv = 'Content-Security-Policy';
    policy.content = `default-src 'none'; style-src 'unsafe-inline'; img-src data: ${imageOrigin}; script-src 'nonce-${nonce}'; connect-src 'none'; form-action 'none'; base-uri 'none'`;
    doc.head.prepend(policy);
    const base = doc.createElement('style');
    base.textContent = (tests ? 'body{color:black;background:white;' : 'html{background:#000;color:#fff;color-scheme:dark}body{color:#fff;background:#000;') + 'font:16px/1.6 system-ui,sans-serif;margin:20px}*{overflow-wrap:break-word}';
    doc.head.insertBefore(base, policy.nextSibling);
    if (css) {
      const style = doc.createElement('style');
      style.textContent = css;
      doc.head.append(style);
    }
    if (tests) {
      const script = doc.createElement('script');
      script.setAttribute('nonce', nonce);
      const payload = JSON.stringify([tests, css, /<!doctype\s+html\s*>/i.test(markup), token]).replace(/</g,'\\u003c');
      let userCode='';
      if(task.mode==='dom'){
        try{userCode=window.TW_EDITOR.guard(code);}catch(e){userCode=`throw new Error(${JSON.stringify(e.message)});`;}
        const initial=JSON.stringify(task.storage||{}).replace(/</g,'\\u003c');
        userCode='const __twStorage='+initial+';Object.defineProperty(window,"localStorage",{value:{getItem:key=>Object.hasOwn(__twStorage,key)?String(__twStorage[key]):null,setItem:(key,value)=>{__twStorage[key]=String(value);},removeItem:key=>{delete __twStorage[key];},clear:()=>{for(const key of Object.keys(__twStorage))delete __twStorage[key];}},configurable:true});\n'+userCode;
        const actions=JSON.stringify(task.actions||[]).replace(/</g,'\\u003c');
        userCode=`let __twError='';try{${userCode}\n}catch(e){__twError=e.message;}\nsetTimeout(()=>{try{for(const action of ${actions}){const el=action.selector?document.querySelector(action.selector):document;if(action.type==='fill'){el.value=action.value;el.dispatchEvent(new Event(action.event||'input',{bubbles:true}));}if(action.type==='click')el.click();if(action.type==='check'){el.checked=action.checked;el.dispatchEvent(new Event('change',{bubbles:true}));}if(action.type==='key')document.dispatchEvent(new KeyboardEvent('keydown',{key:action.key,altKey:!!action.altKey,bubbles:true}));}}catch(e){__twError=e.message;}},40);`;
        userCode=`window.addEventListener('error',e=>{__twError=e.message;});\n`+userCode;
      }
      script.textContent = `${userCode}\nsetTimeout(() => {${task.mode==='dom'?`if(__twError){parent.postMessage({type:'tw-check',token:${JSON.stringify(token)},results:[{label:'JavaScript DOM',passed:false,error:__twError}]},'*');return;}`:''}(${checkInFrame.toString()})(...${payload});}, 280);`;
      script.textContent=script.textContent.replace(/<\/script/gi,'<\\/script');
      doc.body.append(script);
    } else if(task.mode==='dom'){
      const script=doc.createElement('script');script.setAttribute('nonce',nonce);
      const initial=JSON.stringify(task.storage||{}).replace(/</g,'\\u003c');
      script.textContent=('const __twStorage='+initial+';Object.defineProperty(window,"localStorage",{value:{getItem:key=>Object.hasOwn(__twStorage,key)?String(__twStorage[key]):null,setItem:(key,value)=>{__twStorage[key]=String(value);},removeItem:key=>{delete __twStorage[key];},clear:()=>{for(const key of Object.keys(__twStorage))delete __twStorage[key];}},configurable:true});\n'+window.TW_EDITOR.guard(code)).replace(/<\/script/gi,'<\\/script');doc.body.append(script);
    }
    return '<!doctype html>\n' + doc.documentElement.outerHTML;
  }
  async function preview(task, code, frame) {
    if (['scss','ejs'].includes(task.mode)) {
      const result=await browserLab(task,code);
      if(typeof result.compiled==='string')frame.srcdoc=sourceDoc({...task,mode:'css'},result.compiled,null,'');
      else if(typeof result.rendered==='string')frame.srcdoc=sourceDoc({...task,mode:'html'},result.rendered,null,'');
      else throw new Error(result.results?.[0]?.error || 'Codul nu a putut fi previzualizat.');
      return;
    }
    frame.srcdoc = sourceDoc(task, code, null, '');
  }
  async function checkWeb(task, code, onCancel) {
    const results = [];
    const rawTests=task.tests.filter(t=>t.kind.startsWith('source'));
    if(rawTests.length){
      const raw=new DOMParser().parseFromString(code,'text/html');
      for(const test of rawTests){const el=raw.querySelector(test.selector);results.push({label:test.label,passed:test.kind==='sourceAttr'?!!el&&el.getAttribute(test.name)===test.value:!!el&&el.textContent.trim()===test.value});}
    }
    const frameTests=task.tests.filter(t=>!t.kind.startsWith('source'));
    const widths = [...new Set(frameTests.map(t => t.viewport || 800))];
    for (const width of widths) {
      const group = frameTests.filter(t => (t.viewport || 800) === width);
      const frame = document.createElement('iframe');
      frame.setAttribute('sandbox','allow-scripts');
      frame.title = 'Verificare temporară';
      frame.style.cssText = `position:fixed;left:-20000px;top:0;width:${width}px;height:500px;border:0;visibility:hidden`;
      document.body.append(frame);
      const token = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
      try {
        const part = await new Promise(resolve => {
          let settled = false;
          const finish = data => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            window.removeEventListener('message', receive);
            resolve(data);
          };
          const receive = event => {
            if (event.source === frame.contentWindow && event.data?.type === 'tw-check' && event.data.token === token && Array.isArray(event.data.results)) finish(event.data.results);
          };
          const timer = setTimeout(() => finish(group.map(t => ({ label:t.label, passed:false, error:'Verificarea nu răspunde. Reîncarcă pagina și încearcă din nou.' }))), 2500);
          window.addEventListener('message', receive);
          onCancel?.(() => finish(group.map(t => ({ label:t.label, passed:false, error:'Verificare oprită.' }))));
          frame.srcdoc = sourceDoc(task, code, group, token);
        });
        results.push(...part);
      } finally { frame.remove(); }
    }
    return results;
  }
  function workerMain() {
    const canonical = value => {
      if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
      if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
      return JSON.stringify(value);
    };
    self.onmessage = async event => {
      const { code, cases } = event.data;
      const results = [];
      for (let i = 0; i < cases.length; i++) {
        const test = cases[i];
        let actual;
        let error;
        let passed = false;
        try {
          const input = structuredClone(test.input);
          const before = canonical(input);
          const run = new Function('input', '"use strict";\n' + code + '\n;if(typeof solve !== "function") throw new Error("Definește funcția solve(input)."); return solve(input);');
          actual = await run(input);
          if (before !== canonical(input)) error = 'Funcția a modificat input. Creează o copie înainte de modificare.';
          passed = !error && canonical(actual) === canonical(test.expected);
          if (actual === undefined) actual = '[undefined — lipsește return?]';
          else if (typeof actual === 'number' && !Number.isFinite(actual)) actual = String(actual);
          else actual = JSON.parse(JSON.stringify(actual));
        } catch (e) { error = `${e.name}: ${e.message}`.slice(0,700); }
        results.push({ label:`Testul ${i + 1}`, input:test.input, expected:test.expected, actual, error, passed });
      }
      self.postMessage(results);
    };
  }
  function checkJS(task, code, onCancel) {
    return new Promise(resolve => {
      const url = URL.createObjectURL(new Blob([`(${workerMain.toString()})();`], { type:'text/javascript' }));
      let worker;
      let timer;
      let settled = false;
      const finish = results => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        worker?.terminate();
        URL.revokeObjectURL(url);
        resolve(results);
      };
      const fail = message => finish([{ label:'Execuție JavaScript', passed:false, error:message }]);
      try {
        worker = new Worker(url);
        worker.onmessage = event => finish(event.data);
        worker.onerror = event => { event.preventDefault(); fail(event.message || 'Nu se poate porni verificarea JavaScript.'); };
        timer = setTimeout(() => fail('Execuția a depășit 2 secunde și a fost oprită. Verifică buclele și apelurile care nu se termină.'), 2200);
        onCancel?.(() => fail('Verificare oprită.'));
        worker.postMessage({ code, cases:task.cases });
      } catch (e) { fail(e.message); }
    });
  }
  async function checkSingle(task, code, onCancel) {
    if (['html','css','dom'].includes(task.mode)) return checkWeb(task, code, onCancel);
    if (task.mode === 'js') return checkJS(task, code, onCancel);
    if (['sql','scss','ejs'].includes(task.mode)) {
      const result=await browserLab(task,code,onCancel);
      if(typeof result.compiled==='string')return checkWeb({...task,mode:'css'},result.compiled,onCancel);
      if(typeof result.rendered==='string')return checkWeb({...task,mode:'html'},result.rendered,onCancel);
      return Array.isArray(result)?result:result.results;
    }
    if(['node','express'].includes(task.mode)){
      if(location.protocol==='file:')return [{label:'Laborator local',passed:false,error:'Pornește serverul cu node scripts/serve.mjs și deschide http://127.0.0.1:8088 pentru acest exercițiu.'}];
      const controller=new AbortController();onCancel?.(()=>controller.abort());
      try{
        const response=await fetch('/api/check',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:task.id,code}),signal:controller.signal});
        if(!response.ok){let message;try{message=(await response.json()).error;}catch{}throw new Error(message||'Laboratorul nu este disponibil: HTTP '+response.status);}
        const result=await response.json();
        if(typeof result.compiled==='string')return checkWeb({...task,mode:'css'},result.compiled,onCancel);
        if(typeof result.rendered==='string')return checkWeb({...task,mode:'html'},result.rendered,onCancel);
        return result.results||[{label:'Laborator',passed:false,error:'Răspuns incomplet de la server.'}];
      }catch(e){return [{label:'Laborator',passed:false,error:e.name==='AbortError'?'Verificare oprită.':e.message}];}
    }
    if (task.mode === 'json') {
      try {
        const actual = JSON.parse(code);
        return [{ label:'JSON valid și valorile cerute', expected:task.expected, actual, passed:stable(actual) === stable(task.expected) }];
      } catch (e) { return [{ label:'Sintaxa JSON', passed:false, error:e.message }]; }
    }
    return [{ label:'Răspunsul cerut', expected:task.solution, actual:code.trim(), passed:code.trim() === task.solution.trim() }];
  }
  async function check(task, code, onCancel) {
    if(!task.variants?.length || ['node','express'].includes(task.mode))return checkSingle(task,code,onCancel);
    const results=[];
    let cancelled=false,stop;
    onCancel?.(()=>{cancelled=true;stop?.();});
    for(const variant of [{},...task.variants]){
      if(cancelled)break;
      const output=await checkSingle({...task,...variant,variants:undefined},code,cancel=>{stop=cancel;if(cancelled)cancel();});
      results.push(...output.map(row=>({...row,label:(variant.label||'Date inițiale')+' · '+row.label})));
    }
    if(cancelled&&!results.some(row=>!row.passed))results.push({label:'Verificare oprită.',passed:false});
    return results;
  }
  window.TW_RUNNER = { check, preview };
})();
