"""Generate learner documentation for the published course."""
import json
from pathlib import Path

course=json.loads(Path('site/course.js').read_text(encoding='utf8').split(' = ',1)[1].rstrip(';\n'))
chapters=course['chapters']
total=sum(len(c['lessons']) for c in chapters)
exam=json.loads(Path('site/exam-data.js').read_text(encoding='utf-8').split(' = ',1)[1].rstrip(';\n'))
exam_total=len(exam['tickets'])
exam_counts={category:sum(ticket['category']==category for ticket in exam['tickets']) for category in ['css','server','client']}

Path('README.md').write_text(f'''# Tehnici Web · INFO ID 26

Material de studiu cu explicații în română și exerciții interactive.

**[Deschide cursul](https://tw.infoid26.ro/)** · **[Simulare examen](https://tw.infoid26.ro/examen)** · **[Proiect demonstrativ](https://tw.infoid26.ro/project/)**

- {total} de lecții în {len(chapters)} de capitole.
- HTML, CSS, JavaScript, DOM, JSON, Sass/SCSS, Node.js, Express, EJS și PostgreSQL.
- {exam_total} de bilete pentru simulare: {exam_counts['css']} CSS, {exam_counts['server']} Node + EJS și {exam_counts['client']} BD + JavaScript client.

Lecțiile includ explicații, exemple, întrebări, exerciții, indicii și rezolvări. Progresul se păstrează în browser; conectarea cu Microsoft permite salvarea în cont.

Simularea oferă extragerea biletelor, pregătire, probe cronometrate și rezultate la final.

[Programa](CURRICULUM.md) · [Index de sintaxă](SYNTAX.md) · [Metoda de învățare](PEDAGOGY.md)
''',encoding='utf8')

lines=['# Programa cursului','',f'{len(chapters)} de capitole; {total} de lecții cu exerciții.','',
       'Fiecare legătură deschide o lecție din curs.','']
for c in chapters:
 lines.extend([f"## {c['title']} · {len(c['lessons'])} lecții",'',c['subtitle'],''])
 for l in c['lessons']:
  lines.append(f"- [{l['title']}](https://tw.infoid26.ro/#lectie/{l['id']}/0)")
 lines.append('')
Path('CURRICULUM.md').write_text('\n'.join(lines),encoding='utf8')
