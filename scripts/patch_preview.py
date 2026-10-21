from pathlib import Path
p=Path('site/app.js');s=p.read_text(encoding='utf8')
start=s.index('    const preview = () =>')
end=s.index('\n    updateLines();',start)
s=s[:start]+'''    const preview = async () => {
      const frame=document.querySelector('#preview');
      if(!frame || !['html','css','dom','scss','ejs'].includes(l.task.mode))return;
      try { await window.TW_RUNNER.preview(l.task,field.value,frame); }
      catch(e) { const status=document.querySelector('#task-status'); if(status)status.textContent=e.message; }
    };'''+s[end:]
p.write_text(s,encoding='utf8')
