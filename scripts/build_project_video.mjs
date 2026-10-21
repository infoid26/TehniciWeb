// Generate our own small VP8/WebM animation from SVG frames; no teaching media.
import fs from 'node:fs/promises';
import sharp from 'sharp';

const hex=value=>Buffer.from(value.replaceAll(' ',''),'hex');
const size=n=>{
 for(let width=1;width<=8;width++)if(n<2**(7*width)-1){
  const value=Buffer.alloc(width);let rest=BigInt(n);
  for(let i=width-1;i>=0;i--){value[i]=Number(rest&255n);rest>>=8n;}
  value[0]|=1<<(8-width);return value;
 }
 throw new Error('EBML size overflow');
};
const element=(id,data)=>Buffer.concat([hex(id),size(data.length),data]);
const uint=(id,n)=>{const b=Buffer.alloc(4);b.writeUInt32BE(n);return element(id,b);};
const text=(id,s)=>element(id,Buffer.from(s));
const duration=Buffer.alloc(8);duration.writeDoubleBE(6000);
const header=element('1A45DFA3',Buffer.concat([uint('4286',1),uint('42F7',1),uint('42F2',4),uint('42F3',8),text('4282','webm'),uint('4287',2),uint('4285',2)]));
const info=element('1549A966',Buffer.concat([uint('2AD7B1',1000000),text('4D80','Sweet Corner'),text('5741','Sweet Corner'),element('4489',duration)]));
const track=element('1654AE6B',element('AE',Buffer.concat([uint('D7',1),uint('73C5',1),uint('83',1),text('86','V_VP8'),element('E0',Buffer.concat([uint('B0',640),uint('BA',360)]))])));
const blocks=[];
for(let frame=0;frame<6;frame++){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#13151e"/><circle cx="320" cy="174" r="116" fill="#29223c"/><ellipse cx="320" cy="260" rx="130" ry="18" fill="#bba1ff"/><rect x="230" y="140" width="180" height="110" rx="14" fill="#bb815f"/><path d="M230 155 Q250 185 270 155 T310 155 T350 155 T390 155 L410 140 L410 130 Q320 100 230 130Z" fill="#573530"/><circle cx="320" cy="${102-frame%3*4}" r="13" fill="#e998ae"/><text x="320" y="42" text-anchor="middle" font-family="sans-serif" font-size="22" fill="#f1edf8">A little sweetness, every day.</text><rect x="190" y="310" width="260" height="6" rx="3" fill="#3b374a"/><rect x="190" y="310" width="${(frame+1)*260/6}" height="6" rx="3" fill="#bba1ff"/></svg>`;
 const webp=await sharp(Buffer.from(svg)).webp({quality:85,lossless:false}).toBuffer();
 let vp8;
 for(let p=12;p+8<=webp.length;){const length=webp.readUInt32LE(p+4);if(webp.toString('ascii',p,p+4)==='VP8 ')vp8=webp.subarray(p+8,p+8+length);p+=8+length+(length%2);}
 if(!vp8)throw new Error('Expected VP8 keyframe');
 const prefix=Buffer.alloc(4);prefix[0]=0x81;prefix.writeInt16BE(frame*1000,1);prefix[3]=0x80;
 blocks.push(element('A3',Buffer.concat([prefix,vp8])));
}
const cluster=element('1F43B675',Buffer.concat([uint('E7',0),...blocks]));
await fs.writeFile('project-reference/public/media/bakery.webm',Buffer.concat([header,element('18538067',Buffer.concat([info,track,cluster]))]));
console.log('Generated original six-second Sweet Corner animation.');
