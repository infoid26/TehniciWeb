"""Ticket statements and illustrations, separate from the student's starting files."""
import re


def prepare_presentation(exercises):
    statements={
        'badge':'În catalogul de mai jos, modificați doar CSS-ul astfel încât primul produs, „Tort”, să primească eticheta „Nou” în colțul din dreapta sus al propriului card, ca în exemplu. Eticheta are fundal navy și text alb; celelalte două produse nu primesc etichetă. Generați textul prin ::before, fără să adăugați elemente HTML. Poziționați eticheta față de card, nu față de fereastra browserului.',
        'animation':'Faceți ca textul „Bine ați venit” de mai jos să devină treptat mai transparent, de la opacity: 1 la 0.4, apoi să revină la opacitatea inițială. Fiecare trecere durează 2 secunde, este liniară și se repetă continuu, alternând sensul. Numiți animația welcomePulse și aplicați-o numai elementului #welcome, nu întregului h1.',
        'fixed':'În fragmentul de mai jos există meniul cu legăturile „Orar” și „Produse” și legătura „Sus” (#back). Modificați CSS-ul astfel încât „Sus” să rămână la 100px de partea de sus și la 0px de marginea stângă a ferestrei, inclusiv la derulare. Așezați elementele meniului #menu pe un rând, centrate pe orizontală, cu 16px între ele.'
    }
    heights={'welcome':100,'columns':160,'timetable':420,'words':110,'responsive':200,'fixed':150,'cards':480,'video':230,'print':450,'focus':110,'sticky':540,'alternating':420,'badge':480,'reorder':200,'variables':550,'animation':100}
    source_needed={'timetable','badge','reorder','variables'}
    for item in exercises:
        task=item['task']
        if task['mode']=='css':
            key=item['id'].removeprefix('ticket-css-')
            if key in statements:task['prompt']=statements[key]
            task['exampleLabel']='Exemplu de rezultat'
            task['previewHeight']=heights[key]
            task['exampleCss']=task['solution']
            active_hover=next((t['hover'] for t in task.get('tests',[]) if t['kind']=='hoverStyle'),None)
            for test in task.get('tests',[]):
                if test['kind']=='hoverStyle' and test['hover']==active_hover:
                    task['exampleCss']+='\n'+test['selector']+'{'+test['name']+':'+test['value']+'!important}'
            if key=='welcome':
                task['exampleCss']+='\n#welcome{transform:scale(2);transform-origin:left top}'
            if key=='focus':
                task['exampleCss']+='\n#menu a:first-of-type{outline:3px solid blue;outline-offset:4px}'
            if key=='print':
                task['exampleLabel']='Exemplu la imprimare'
                task['exampleCss']+='\n#menu,#back,#video{display:none!important}#products{display:block}body{color:black;background:white}'
            if key in source_needed:
                raw=re.sub(r'<style>.*?</style>','',task['fixture'],flags=re.S).strip()
                task['referenceHtml']=re.sub(r'>\s*<','>\n<',raw)
        elif task.get('fixture'):
            task['exampleLabel']='Fragmentul paginii'
            task['previewHeight']=220
            if task['mode']=='dom':
                raw=re.sub(r'<style>.*?</style>','',task['fixture'],flags=re.S).strip()
                task['referenceHtml']=re.sub(r'>\s*<','>\n<',raw)
