"""Exerciții mici pentru detaliile pe care lecțiile introductive le grupează."""
from course_model import *
c=chapter('js-details','JavaScript · fiecare metodă, separat','Exersează metodele de text, colecții, numere și timp fără să le ascunzi într-un singur exemplu.','JavaScript - general.pptx; resurse/js și index.js','braces')
def J(key,title,idea,expression,cases):
 code='function solve(input) { return '+expression+'; }'
 lesson(c,'detail-'+key,title,idea,code,idea,q('Ce operație verificăm aici?',title,'Generarea unei pagini EJS','Compilarea unui fișier CSS'),js('Scrie solve(input). '+idea,code,cases))
J('endsWith','endsWith · sfârșitul textului','Returnează true dacă input se termină cu .scss; comparația distinge literele mari.','input.endsWith(".scss")',[('menu.scss',True),('menu.css',False),('SCSS',False)])
J('lastIndexOf','lastIndexOf · ultima apariție','Returnează indicele ultimei litere a din input, sau -1 dacă lipsește. Primul caracter are indicele zero.','input.lastIndexOf("a")',[('banana',5),('tea',2),('xy',-1)])
J('charAt','charAt · caracterul la o poziție','Primești {text,index}. Returnează caracterul de la index folosind charAt; în afara șirului rezultatul este șirul gol.','input.text.charAt(input.index)',[({'text':'Cake','index':1},'a'),({'text':'Cake','index':9},'')])
J('charCodeAt','charCodeAt · cod UTF-16','Returnează codul UTF-16 al primului caracter. Pentru caractere în afara BMP un singur code unit nu reprezintă întregul code point.','input.charCodeAt(0)',[('A',65),('a',97)])
J('codePointAt','codePointAt · punct de cod','Returnează punctul de cod Unicode de la poziția zero. Exemplul cu emoji arată de ce diferă de charCodeAt.','input.codePointAt(0)',[('A',65),('😀',128512)])
J('fromCharCode','String.fromCharCode · din cod în text','Transformă codul UTF-16 input într-un caracter cu String.fromCharCode.','String.fromCharCode(input)',[(65,'A'),(97,'a')])
J('fromCodePoint','String.fromCodePoint · Unicode complet','Transformă punctul de cod input în text. Poate produce două unități UTF-16 pentru un singur simbol.','String.fromCodePoint(input)',[(65,'A'),(128512,'😀')])
J('padStart','padStart · completează la început','Returnează textul input completat în stânga cu 0 până la lungimea 4. Un text deja mai lung nu este scurtat.','input.padStart(4,"0")',[('7','0007'),('12345','12345')])
J('padEnd','padEnd · completează la sfârșit','Completează input în dreapta cu puncte până la lungimea 5.','input.padEnd(5,".")',[('Tea','Tea..'),('Cake!','Cake!')])
J('trimStart','trimStart · doar la început','Elimină numai spațiile din stânga textului input, păstrând spațiile finale.','input.trimStart()',[('  Tea  ','Tea  '),('Cake','Cake')])
J('trimEnd','trimEnd · doar la sfârșit','Elimină numai spațiile din dreapta textului input, păstrând spațiile inițiale.','input.trimEnd()',[('  Tea  ','  Tea'),('Cake','Cake')])
J('substring','substring · două poziții','Returnează caracterele dintre pozițiile 1 inclusiv și 4 exclusiv cu substring. Nu trata al doilea argument drept lungime.','input.substring(1,4)',[('Chocolate','hoc'),('Tea','ea')])
J('substr','substr · sintaxă veche din prezentare','Recunoaște substr(start,length): al doilea argument este o lungime. Pentru cod nou preferă slice. Returnează trei caractere de la poziția 1 folosind slice(1,4).','input.slice(1,4)',[('Chocolate','hoc'),('Tea','ea')])
J('match','match · toate potrivirile','Returnează toate grupurile consecutive de cifre din input cu /\\d+/g și match; când nu există potriviri returnează [].','input.match(/\d+/g) || []',[('A12 B3',['12','3']),('Cake',[])])
J('localeUpper','toLocaleUpperCase · reguli de limbă','Transformă input în litere mari folosind explicit limba en. Metoda întoarce text nou.','input.toLocaleUpperCase("en")',[('cake','CAKE'),('Tea','TEA')])
J('localeLower','toLocaleLowerCase · reguli de limbă','Transformă input în litere mici folosind explicit limba en.','input.toLocaleLowerCase("en")',[('CAKE','cake'),('Tea','tea')])
J('array-fill','fill · umple o copie','Copiază input și înlocuiește toate elementele copiei cu zero folosind fill. Nu modifica input.','[...input].fill(0)',[([1,2,3],[0,0,0]),([],[])])
J('copyWithin','copyWithin · copiere în același vector','Copiază input și execută copyWithin(0,1,3) pe copie. Intervalul sursă include 1 și exclude 3.','[...input].copyWithin(0,1,3)',[([1,2,3,4],[2,3,3,4]),([7,8],[8,8])])
J('flatMap','flatMap · map urmat de o aplatizare','Pentru fiecare număr din input produce [number,number*2], apoi aplatizează un nivel folosind flatMap.','input.flatMap(number => [number,number*2])',[([1,3],[1,2,3,6]),([],[])])
J('reduceRight','reduceRight · acumulare din dreapta','Concatenează textele din input de la dreapta la stânga, cu valoare inițială șirul gol.','input.reduceRight((text,item)=>text+item,"")',[(['A','B','C'],'CBA'),([],'')])
J('array-from','Array.from · colecție nouă','Transformă input într-un vector de caractere folosind Array.from. Nu folosi split pe unități UTF-16 pentru exemplul cu emoji.','Array.from(input)',[('Tea',['T','e','a']),('😀',['😀'])])
J('array-entries','entries · indice și valoare','Returnează perechile [index,value] din vectorul input folosind entries și Array.from.','Array.from(input.entries())',[(['Cake','Tea'],[[0,'Cake'],[1,'Tea']]),([],[])])
J('array-keys','keys · indicii vectorului','Returnează indicii vectorului input sub forma unui vector folosind keys și Array.from.','Array.from(input.keys())',[(['Cake','Tea'],[0,1]),([],[])])
J('math-abs','Math.abs · valoare absolută','Returnează valoarea absolută a numărului input.','Math.abs(input)',[(-7,7),(3,3),(0,0)])
J('math-trunc','Math.trunc · elimină zecimalele','Returnează partea întreagă prin eliminarea zecimalelor. Pentru numere negative diferă de floor.','Math.trunc(input)',[(-1.8,-1),(2.9,2)])
J('math-sqrt','Math.sqrt · rădăcină pătrată','Returnează rădăcina pătrată a numărului nenegativ input.','Math.sqrt(input)',[(9,3),(0,0),(16,4)])
J('math-cbrt','Math.cbrt · rădăcină cubică','Returnează rădăcina cubică a lui input; poate primi și numere negative.','Math.cbrt(input)',[(8,2),(-27,-3)])
J('math-pow','Math.pow · putere','Primești {base,exponent}. Returnează base la puterea exponent.','Math.pow(input.base,input.exponent)',[({'base':2,'exponent':3},8),({'base':5,'exponent':0},1)])
J('math-sin','Math.sin · sinus în radiani','Returnează sinusul lui input. Argumentul este în radiani, nu în grade.','Math.sin(input)',[(0,0)])
J('math-cos','Math.cos · cosinus în radiani','Returnează cosinusul lui input, exprimat în radiani.','Math.cos(input)',[(0,1)])
J('math-tan','Math.tan · tangentă','Returnează tangenta lui input, exprimat în radiani.','Math.tan(input)',[(0,0)])
J('math-asin','Math.asin · inversa sinusului','Returnează arcsinusul lui input în radiani; domeniul real este [-1,1].','Math.asin(input)',[(0,0),(1,1.5707963267948966)])
J('math-acos','Math.acos · inversa cosinusului','Returnează arccosinusul lui input în radiani.','Math.acos(input)',[(1,0),(0,1.5707963267948966)])
J('math-log','Math.log · logaritm natural','Returnează logaritmul natural al numărului pozitiv input.','Math.log(input)',[(1,0)])
J('math-exp','Math.exp · exponențială','Returnează e la puterea input. Nu există o metodă standard Math.exp1; pentru e^x−1 există Math.expm1.','Math.exp(input)',[(0,1),(1,2.718281828459045)])
lesson(c,'detail-date-setTime','Date.setTime · schimbă momentul','setTime schimbă momentul unui obiect Date existent. Argumentul este în milisecunde de la epoca Unix.','function solve(input) { const date = new Date(0); date.setTime(input); return date.getTime(); }','setTime modifică obiectul Date; getTime citește timestamp-ul rezultat.',q('În ce unitate primește setTime valoarea?','Milisecunde','Secunde','Zile'),js('Creează o dată, setează timestamp-ul input cu setTime și returnează getTime.','function solve(input) { const date = new Date(0); date.setTime(input); return date.getTime(); }',[(0,0),(1000,1000)]))
J('date-utcString','toUTCString · dată pentru expirare','Returnează reprezentarea UTC a timestamp-ului input. Este utilă pentru atributul Expires al cookie-urilor.','new Date(input).toUTCString()',[(0,'Thu, 01 Jan 1970 00:00:00 GMT')])

m=chapter('mathml-details','MathML · tagurile din prezentare','Fiecare familie de taguri are propria lecție; verificarea urmărește structura, nu suportul grafic al tuturor extensiilor.','MathML si CSS.pptx, slide-urile 3–22','formula')
math_tags={
'mi':('Identificator matematic','<mi>x</mi>'), 'mn':('Număr matematic','<mn>12</mn>'), 'mo':('Operator matematic','<mo>+</mo>'), 'mtext':('Text obișnuit în formulă','<mtext>Total</mtext>'), 'ms':('Șir matematic între ghilimele','<ms>Cake</ms>'),
'mglyph':('Glif dintr-o imagine: sintaxă istorică MathML','<mglyph src="symbol.svg" alt="Symbol"/>'),
'mrow':('Gruparea unei expresii','<mrow><mi>x</mi><mo>+</mo><mn>1</mn></mrow>'),
'mfrac':('Fracție: numărător și numitor','<mfrac><mn>1</mn><mn>2</mn></mfrac>'),
'msqrt':('Rădăcină pătrată','<msqrt><mn>9</mn></msqrt>'),
'mroot':('Radical cu indice explicit','<mroot><mn>8</mn><mn>3</mn></mroot>'),
'mstyle':('Stil pentru un grup matematic','<mstyle mathcolor="navy"><mi>x</mi></mstyle>'),
'merror':('Încadrarea unei erori matematice','<merror><mtext>Invalid formula</mtext></merror>'),
'mpadded':('Ajustarea spațiului unui grup','<mpadded width="+1em"><mi>x</mi></mpadded>'),
'mphantom':('Spațiu rezervat de conținut invizibil','<mphantom><mi>x</mi></mphantom>'),
'mspace':('Spațiu matematic explicit','<mspace width="1em"/>'),
'mfenced':('Delimitatori: sintaxă MathML veche','<mfenced open="[" close="]"><mi>x</mi></mfenced>'),
'menclosed':('Încadrarea expresiei într-un simbol','<menclosed notation="circle"><mi>x</mi></menclosed>'),
'msub':('Indice inferior: bază, apoi indice','<msub><mi>x</mi><mn>1</mn></msub>'),
'msup':('Exponent: bază, apoi putere','<msup><mi>x</mi><mn>2</mn></msup>'),
'msubsup':('Indice și exponent: trei copii','<msubsup><mi>x</mi><mn>1</mn><mn>2</mn></msubsup>'),
'munder':('Adnotare sub bază','<munder><mo>∑</mo><mi>i</mi></munder>'),
'mover':('Adnotare deasupra bazei','<mover><mi>x</mi><mo>¯</mo></mover>'),
'munderover':('Adnotări sub și deasupra bazei','<munderover><mo>∑</mo><mn>1</mn><mi>n</mi></munderover>'),
'mmultiscripts':('Perechi de indici înainte și după bază','<mmultiscripts><mi>x</mi><mn>1</mn><mn>2</mn><mprescripts/><mn>3</mn><none/></mmultiscripts>'),
'mprescripts':('Începutul perechilor de indici dinaintea bazei','<mmultiscripts><mi>x</mi><mprescripts/><mn>1</mn><mn>2</mn></mmultiscripts>'),
'none':('Poziție de indice lăsată liberă','<mmultiscripts><mi>x</mi><none/><mn>2</mn></mmultiscripts>'),
'mtable':('Tabel matematic: rânduri și celule','<mtable><mtr><mtd><mn>1</mn></mtd><mtd><mn>2</mn></mtd></mtr></mtable>'),
'mtr':('Rând al matricei','<mtable><mtr><mtd><mn>1</mn></mtd></mtr></mtable>'),
'mtd':('Celulă a matricei','<mtable><mtr><mtd><mi>x</mi></mtd></mtr></mtable>'),
'mlabeledtr':('Rând cu etichetă: extensie MathML','<mtable><mlabeledtr><mtd><mtext>Row</mtext></mtd><mtd><mn>1</mn></mtd></mlabeledtr></mtable>'),
'maligngroup':('Grup de aliniere: extensie MathML','<mtable><mtr><mtd><maligngroup/><mi>x</mi><malignmark/><mo>=</mo><mn>1</mn></mtd></mtr></mtable>'),
'malignmark':('Punct de aliniere: extensie MathML','<mtable><mtr><mtd><maligngroup/><mi>x</mi><malignmark/><mo>=</mo><mn>1</mn></mtd></mtr></mtable>'),
'mstack':('Operație aliniată pe coloane de cifre','<mstack><msrow><mn>12</mn><mo>+</mo></msrow><mn>3</mn><msline/><mn>15</mn></mstack>'),
'msrow':('Rând într-o operație elementară','<mstack><msrow><mn>12</mn><mo>+</mo></msrow><mn>3</mn><msline/><mn>15</mn></mstack>'),
'msline':('Linia rezultatului unei operații','<mstack><mn>12</mn><msline length="2"/><mn>12</mn></mstack>'),
'msgroup':('Grup de rânduri cu deplasare comună','<mstack><msgroup position="1" shift="-1"><mn>12</mn><mn>3</mn></msgroup></mstack>'),
'mscarries':('Adnotări de transport pe coloane','<mstack><mscarries><mn>1</mn><none/></mscarries><mn>19</mn><mn>1</mn><msline/><mn>20</mn></mstack>'),
'mscarry':('Stilul unei adnotări de transport','<mstack><mscarries><mscarry crossout="none"><mn>1</mn></mscarry></mscarries><mn>9</mn></mstack>'),
'mlongdiv':('Împărțire desfășurată: divizor, cât, deîmpărțit','<mlongdiv longdivstyle="lefttop"><mn>4</mn><mn>3</mn><mn>12</mn></mlongdiv>'),
'maction':('Interactivitate: sintaxă MathML istorică','<maction actiontype="toggle"><mn>1</mn><mn>2</mn></maction>'),
}
for tag,(meaning,fragment) in math_tags.items():
 code='<math xmlns="http://www.w3.org/1998/Math/MathML">'+fragment+'</math>'
 note='Tagurile din MathML complet și configurațiile MathJax vechi din slide-uri nu au toate redare nativă. Aici verificăm prezența și structura, fără să pretindem că extensia este randată de browser.'
 lesson(m,'math-detail-'+tag,tag+' · '+meaning,meaning+'. Citește ordinea copiilor din exemplu: schimbarea ei schimbă sensul formulei.',code,note,q('Care este tagul studiat în exemplu?',tag,'div','script'),html('Reconstituie formula din exemplu, păstrând tagul '+tag+' și elementul math cu namespace.',code,[attr('math','xmlns','http://www.w3.org/1998/Math/MathML'),count(tag)],note=note))
