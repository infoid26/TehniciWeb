from course_model import chapters
import course_start, course_html, course_css, course_javascript, course_dom
import course_data, course_backend, course_templates_sql, course_details, course_css_details, course_project
import course_complete_web, course_complete_programming, course_complete_backend
import course_audit_gaps
import course_sources
import json
from pathlib import Path
from standalone_course import adapt
adapt()
learning=[c for c in chapters if not c['lessons'] or not c['lessons'][0].get('reading')]
order=['start','web-foundations','html-start','html-semantics-complete','html-media','html-controls-complete','mathml','mathml-details','css-basics','css-selectors-complete','css-layout','css-effects-complete','css-details','js-start','js-scope-complete','js-functions-complete','js-arrays','js-collections-complete','js-text','regex-complete','dates-complete','js-details','dom','browser-integration','storage','json','json-complete','scss','scss-complete','node','node-files-complete','node-integration','express','http-routing-complete','ejs','templates-data-complete','sql','sql-schema-complete','sql-queries-complete','project']
assert set(order)=={c['id'] for c in learning},'Update the chapter order when adding curriculum'
learning.sort(key=lambda c:order.index(c['id']))
references=[c for c in chapters if c['lessons'] and c['lessons'][0].get('reading')]
course=dict(version=2,title="Tehnici Web",teacher="Irina Ciocan",chapters=learning,references=references)
Path("site/course.js").write_text("window.TW_COURSE = "+json.dumps(course,ensure_ascii=False,indent=2)+";\n",encoding="utf-8")
print(len(learning),"capitole;",sum(len(c["lessons"]) for c in learning),"lectii;",sum(len(c['lessons']) for c in references),"lecturi optionale")
import update_readme
