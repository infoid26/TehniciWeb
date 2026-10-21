// Runs once, INSIDE one disposable Azure Sandbox. No Azure credentials here.
import {createEvaluator} from './server.mjs';
import {inject} from '../scripts/inject.mjs';

const chunks=[];let size=0;
for await(const chunk of process.stdin){
  size+=chunk.byteLength;
  if(size>524288)throw new Error('Input too large');
  chunks.push(chunk);
}
const server=createEvaluator();
try{
  const response=await inject(server.listeners('request')[0],{
    path:'/evaluate',method:'POST',body:Buffer.concat(chunks).toString('utf8'),timeout:11000,
  });
  if(response.status!==200)throw new Error('Invalid evaluation request');
  process.stdout.write(response.body);
}finally{server.close();}
