from pathlib import Path
p=Path('site/app.js');s=p.read_text(encoding='utf8')
needle='    window.TW_EDITOR?.clear();\n    main.innerHTML ='
s=s.replace(needle,'''    if (step === 0 && l.referenceText) body += `<h3>Materialul profesoarei</h3><pre class="source-original">${esc(l.referenceText)}</pre>`;
    if (l.relatedLessons?.length && step < 2) body += `<h3>Explicații și exerciții practice</h3><div class="source-lesson-links">${l.relatedLessons.map(id=>byId.has(id)?`<a class="secondary" href="#lectie/${id}/0">${esc(byId.get(id).title)}</a>`:'').join('')}</div>`;
'''+needle)
s=s.replace("    if (location.hash === '#surse') { sourceLibrary(); return; }\n",'')
s=s.replace("    const [page,id,requested] = location.hash.slice(1).split('/');","    const [page,id,requested] = location.hash.slice(1).split('/');\n    if (page === 'surse') { sourceLibrary(); updateProgress(); window.scrollTo(0,0); return; }")
# A short note makes the different exercise types visible.
s=s.replace("${esc(c.subtitle)}</p>","${esc(c.subtitle)}</p>${c.id.startsWith('source-')||c.id.startsWith('slides-')?'<p class=\"chapter-kind\">Lectură și recunoașterea sintaxei · cu lecții practice asociate</p>':''}")
p.write_text(s,encoding='utf8')
