import http from 'node:http';
import { Readable } from 'node:stream';
import { createStore } from './store.mjs';
import { handleRegistry } from './registry.mjs';

if (!process.env.REGISTRY_SIGNING_KEY || !process.env.REGISTRY_ADMIN_KEY) throw new Error('Registry secrets missing');
const STORE=createStore(process.env.NAIWA_DATABASE_PATH || '/var/lib/naiwa/students.sqlite');
const origin=process.env.NAIWA_PUBLIC_ORIGIN || 'https://api.xn--1lq90ic7f9iv6f088h.cn';
const server=http.createServer({maxHeaderSize:8192},async(req,res)=>{
  try {
    const headers=new Headers();
    for(const [name,value] of Object.entries(req.headers)) if(value) headers.set(name,Array.isArray(value)?value.join(','):value);
    // Only Caddy can reach the loopback listener; it overwrites client-supplied IP headers.
    headers.set('X-Naiwa-Source-IP',req.headers['x-naiwa-source-ip'] || req.socket.remoteAddress);
    const url=new URL(req.url,origin);
    if(url.origin!==origin) { res.writeHead(400); res.end(); return; }
    const request=new Request(url,{method:req.method,headers,
      ...(!['GET','HEAD'].includes(req.method)?{body:Readable.toWeb(req),duplex:'half'}:{})});
    const response=await handleRegistry(request,{...process.env,STORE});
    res.writeHead(response.status,Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch(error) {
    console.error('HTTP adapter failed',error.name);
    if(!res.headersSent) res.writeHead(400,{'Content-Type':'application/json','Cache-Control':'no-store'});
    res.end('{"message":"请求没有读完整，请再试一次。"}');
  }
});
server.requestTimeout=15000;
server.headersTimeout=10000;
server.listen(Number(process.env.NAIWA_PORT||8787),'127.0.0.1',()=>console.log('Naiwa registry ready on loopback'));
for(const signal of ['SIGTERM','SIGINT']) process.on(signal,()=>server.close(()=>{STORE.close();process.exit(0);}));
