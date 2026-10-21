"""Model comun: explicații românești, cod și identificatori în engleză."""
chapters=[]
def chapter(id,title,subtitle,source,icon='code'):
 c=dict(id=id,title=title,subtitle=subtitle,source=source,icon=icon,lessons=[]);chapters.append(c);return c
def q(question,right,wrong1,wrong2):return (question,right,wrong1,wrong2)
def lesson(c,id,title,idea,example,explain,question,task,slides='',points=None):
 index=sum(len(c['lessons']) for c in chapters)%3
 options=list(question[1:]);right=options.pop(0);options.insert(index,right)
 item=dict(id=id,title=title,intro=idea,example=example,explain=explain,
  points=points or [],source=c['source']+(' · '+slides if slides else ''),
  quiz=dict(question=question[0],options=options,correct=index,explanation=explain),
  task=task,hint=task.pop('hint',explain),duration='3–6 min')
 task['id']=id;c['lessons'].append(item);return item
def html(prompt,solution,tests,starter='',**extra):return dict(mode='html',prompt=prompt,solution=solution,tests=tests,starter=starter,**extra)
def css(prompt,solution,fixture,tests,starter='',mode='css',**extra):return dict(mode=mode,prompt=prompt,solution=solution,fixture=fixture,tests=tests,starter=starter,**extra)
def js(prompt,solution,cases,starter='function solve(input) {\n  // Write your code here.\n}\n',mode='js',**extra):return dict(mode=mode,prompt=prompt,solution=solution,cases=[dict(input=a,expected=b) for a,b in cases],starter=starter,**extra)
def text(prompt,solution,starter='',**extra):return dict(mode='text',prompt=prompt,solution=solution,starter=starter,**extra)
def dom(prompt,solution,fixture,tests,actions=None,starter='',**extra):return dict(mode='dom',prompt=prompt,solution=solution,fixture=fixture,tests=tests,actions=actions or [],starter=starter,**extra)
def ejs(prompt,solution,data,tests,starter='',partials=None):return dict(mode='ejs',prompt=prompt,solution=solution,data=data,tests=tests,starter=starter,partials=partials or {})
def sql(prompt,solution,expected,setup='',checkQuery=None,starter=''):
 return dict(mode='sql',prompt=prompt,solution=solution,expected=expected,setup=setup,checkQuery=checkQuery,starter=starter)
def express(prompt,solution,requests,starter='const express = require("express");\nconst app = express();\n\n// Add your routes here.\n\nmodule.exports = app;\n'):
 return dict(mode='express',prompt=prompt,solution=solution,requests=requests,starter=starter)
def count(s,n=1,label=None):return dict(kind='count',selector=s,min=n,label=label or f'Elementul `{s}` există'+(f' de cel puțin {n} ori' if n>1 else ''))
def exact(s,v,label=None):return dict(kind='text',selector=s,value=v,label=label or f'`{s}` afișează `{v}`')
def attr(s,n,v,label=None):return dict(kind='attr',selector=s,name=n,value=v,label=label or f'`{s}` are `{n}="{v}"`')
def prop(s,n,v,label=None):return dict(kind='style',selector=s,name=n,value=v,label=label or f'`{s}`: `{n}: {v}`')
def contains(s,v,label=None):return dict(kind='textContains',selector=s,value=v,label=label or f'`{s}` conține `{v}`')
def absent(s,label=None):return dict(kind='absent',selector=s,label=label or f'`{s}` nu există')
def cols(s,n,width=800):return dict(kind='columns',selector=s,count=n,viewport=width,label=f'La {width}px, `{s}` are {n} coloane egale')
