"""Restrict each CSS objective to the fragment it actually modifies."""
from html.parser import HTMLParser
import re


class Roots(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.roots=[];self.depth=0;self.parts=[]
    def handle_starttag(self,tag,attrs):
        if not self.depth:self.parts=[]
        self.parts.append(self.get_starttag_text())
        if tag not in {'br','hr','img','input','meta','link','source','wbr'}:self.depth+=1
        elif not self.depth:self.roots.append(''.join(self.parts))
    def handle_startendtag(self,tag,attrs):
        self.parts.append(self.get_starttag_text())
    def handle_endtag(self,tag):
        self.parts.append('</'+tag+'>');self.depth-=1
        if not self.depth:self.roots.append(''.join(self.parts))
    def handle_data(self,data):
        if self.depth:self.parts.append(data)
    def handle_entityref(self,name):
        if self.depth:self.parts.append('&'+name+';')
    def handle_charref(self,name):
        if self.depth:self.parts.append('&#'+name+';')


def focus_fragments(exercises,common,base_style):
    parser=Roots();parser.feed(common)
    mapping={
        'welcome':['welcome'],'columns':['topics'],'timetable':['orar'],
        'words':['words'],'responsive':['products'],'fixed':['menu','back'],
        'cards':['products'],'video':['video'],'print':['menu','products','back','video'],
        'focus':['menu'],'sticky':['menu','products'],'alternating':['orar'],
        'badge':['products'],'reorder':['products'],'variables':['menu','products'],
        'animation':['welcome']
    }
    for item in exercises:
        if item['task']['mode']!='css':continue
        selected=mapping[item['id'].removeprefix('ticket-css-')]
        chunks=[chunk for chunk in parser.roots if not chunk.startswith('<style') and any('id="'+key+'"' in chunk for key in selected)]
        rules=[]
        for match in re.finditer(r'([^{}]+)\{([^{}]*)\}',base_style.removeprefix('<style>').removesuffix('</style>')):
            selector=match[1]
            relevant=selector=='body' or any('#'+key in selector for key in selected) or ('products' in selected and '.product' in selector) or ('orar' in selected and selector in ['table','td,th']) or (any(key in selected for key in ['menu','back','video']) and selector=='a')
            if relevant:rules.append(match.group())
        styles='<style>'+''.join(rules)+'</style>'
        item['task']['fixture']=styles+'\n'+'\n'.join(chunks)
        item['task']['baseStyles']=styles
