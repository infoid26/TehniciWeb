from pathlib import Path
p=Path('site/app.js');s=p.read_text(encoding='utf8')
needle='  const codeBlock='
pos=s.index(needle)
s=s[:pos]+'''  const sourceImages = images => (images || []).map(im=>im.supported?`<figure class="source-figure"><img src="${esc(im.url)}" alt="Ilustrație din prezentarea profesoarei: ${esc(im.name)}" loading="lazy"><figcaption>${esc(im.name)}</figcaption></figure>`:`<p><a href="${esc(im.url)}" download>Ilustrație în formatul original: ${esc(im.name)}</a></p>`).join('');
'''+s[pos:]
s=s.replace('${esc(x.text)}</pre><p>Lecții asociate:', '${esc(x.text)}</pre>${sourceImages(x.images)}<p>Lecții asociate:')
s=s.replace('${esc(l.referenceText)}</pre>`;', '${esc(l.referenceText)}</pre>${sourceImages(l.referenceImages)}`;')
p.write_text(s,encoding='utf8')
