import { mkdir, rm, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { documents, redirects, escape, prettyRoute } from '../src/lib/content.mjs';
export const htmlPath = route => route==='/404.html'?'404.html':route==='/'?'index.html':route.replace(/^\//,'')+'index.html';
const redirectHTML=to=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Redirecting</title><link rel="canonical" href="https://krigsvold.org${escape(to)}"><meta http-equiv="refresh" content="0;url=${escape(to)}"></head><body><a href="${escape(to)}">Continue</a></body></html>`;
for(const {from,to} of redirects) {
  const path=join('dist',htmlPath(prettyRoute(from)));await mkdir(dirname(path),{recursive:true});await writeFile(path,redirectHTML(to));
  if(!from.endsWith('/'))await writeFile(join('dist',from.slice(1)+'.html'),redirectHTML(to));
}
// Keep the .html form of extensionless legacy permalinks available as well.
for(const page of documents.filter(p=>p.permalink&&!p.url.endsWith('/')&&!p.url.endsWith('.html'))) {
  const path=join('dist',page.url.slice(1)+'.html');await mkdir(dirname(path),{recursive:true});await writeFile(path,redirectHTML(page.url));
}
// Legacy hosting may still upload _site; it receives the same Astro output.
await mkdir('artifacts',{recursive:true});
await writeFile('artifacts/route-inventory.json',JSON.stringify({pages:documents.map(({file,url,route,kind,title})=>({file,url,route,kind,title})),redirects},null,2)+'\n');
let absent=0;
for(let i=0;i<32&&absent<6;i++) {
  await rm('dist/.prerender',{recursive:true,force:true});await new Promise(r=>setTimeout(r,250));
  try{await stat('dist/.prerender');absent=0;}catch{absent++;}
}
if(absent<6)throw Error('Temporary prerender output did not settle');
