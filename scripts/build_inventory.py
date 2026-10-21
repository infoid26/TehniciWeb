"""Inventory all teaching sources, without walking the excluded Dana directory."""
import os, json, hashlib, re, zipfile, posixpath
from pathlib import Path
from xml.etree import ElementTree as ET

SOURCE=Path(r'C:\Users\Axi\iCloudDrive\Family\FMI\Dana.an1\Anul1Sem1\TechniciWebFMI')
TEXT={'.html','.js','.css','.scss','.ejs','.sql','.json','.vtt','.txt','.md','.webmanifest','.map'}
def build():
 items=[]; manifest=[]; excluded=[]
 for base,dirs,names in os.walk(SOURCE):
  # Do not inspect even the contents of the excluded folder.
  for name in list(dirs):
   if name in {'Dana','.git','node_modules','Recordings'}:
    dirs.remove(name); excluded.append(str((Path(base)/name).relative_to(SOURCE)))
  for name in sorted(names):
   p=Path(base)/name;relative=p.relative_to(SOURCE).as_posix()
   entry={'path':relative,'extension':p.suffix.lower(),'bytes':p.stat().st_size}
   manifest.append(entry)
   if p.suffix.lower() in TEXT:
    raw=p.read_bytes();entry['sha256']=hashlib.sha256(raw).hexdigest()
    try:text=raw.decode('utf-8-sig')
    except UnicodeDecodeError:text=raw.decode('cp1252',errors='replace')
    items.append({'title':relative,'path':relative,'text':text,'kind':'file','sha256':entry['sha256'],'lessons':[]})
   elif p.suffix.lower()=='.pptx':
    with zipfile.ZipFile(p) as z:
     slides=sorted((n for n in z.namelist() if re.fullmatch(r'ppt/slides/slide\d+\.xml',n)),key=lambda n:int(re.search(r'(\d+)\.xml$',n)[1]))
     for n in slides:
      num=int(re.search(r'(\d+)\.xml$',n)[1]);root=ET.fromstring(z.read(n))
      paragraphs=[]
      for paragraph in root.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}p'):
       paragraphs.append(''.join(t.text or '' for t in paragraph.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}t')))
      text='\n'.join(paragraphs)
      images=[];relationships={}
      relpath=f'ppt/slides/_rels/slide{num}.xml.rels'
      if relpath in z.namelist():
       for rel in ET.fromstring(z.read(relpath)):
        if rel.get('Type','').endswith('/image') and rel.get('TargetMode')!='External':relationships[rel.get('Id')]=rel.get('Target')
      for blip in root.iter('{http://schemas.openxmlformats.org/drawingml/2006/main}blip'):
       rid=blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
       if rid not in relationships:continue
       target=posixpath.normpath(posixpath.join('ppt/slides',relationships[rid]));suffix=Path(target).suffix.lower()
       if target not in z.namelist():continue
       raw=z.read(target);filename='source-'+hashlib.sha256(raw).hexdigest()[:20]+suffix
       Path('site',filename).write_bytes(raw)
       images.append({'url':'site/'+filename,'supported':suffix in {'.png','.jpg','.jpeg','.gif','.svg','.webp'},'name':Path(target).name})
      items.append({'title':f'{name} · slide {num}','path':relative,'slide':num,'text':text,'kind':'slide','images':images,'lessons':[]})
 result={'version':1,'items':items,'files':manifest,'excluded':excluded}
 Path('.audit/source-inventory.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf8')
 return result
if __name__=='__main__':
 d=build();print(len(d['files']),'files;',len(d['items']),'text sources/slides')
