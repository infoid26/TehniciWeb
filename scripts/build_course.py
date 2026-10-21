from course_model import chapters
import course_start, course_html, course_css, course_javascript, course_dom
import course_data, course_backend, course_templates_sql, course_details, course_css_details, course_project, course_sources
import json
from pathlib import Path
from standalone_course import adapt
adapt()
learning=[c for c in chapters if not c['lessons'] or not c['lessons'][0].get('reading')]
references=[c for c in chapters if c['lessons'] and c['lessons'][0].get('reading')]
course=dict(version=2,title="Tehnici Web",teacher="Irina Ciocan",chapters=learning,references=references)
Path("site/course.js").write_text("window.TW_COURSE = "+json.dumps(course,ensure_ascii=False,indent=2)+";\n",encoding="utf-8")
print(len(learning),"capitole;",sum(len(c["lessons"]) for c in learning),"lectii;",sum(len(c['lessons']) for c in references),"lecturi optionale")
