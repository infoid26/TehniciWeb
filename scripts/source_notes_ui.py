from pathlib import Path
p=Path('site/app.js');s=p.read_text(encoding='utf8')
needle='    if (l.relatedLessons?.length && step < 2)'
pos=s.index(needle)
s=s[:pos]+'''    if (step === 0 && l.syntaxNotes?.length) body += `<h3>Construcțiile din acest fragment</h3><div class="syntax-notes">${l.syntaxNotes.map(note=>`<details class="help-details"><summary><code>${esc(note.token)}</code></summary><p>${rich(note.explanation)}</p><a class="text-link" href="#lectie/${note.lesson}/0">Explicație și exercițiu →</a></details>`).join('')}</div>`;
'''+s[pos:]
p.write_text(s,encoding='utf8')
