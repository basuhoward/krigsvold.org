import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, extname } from 'node:path';
import { parse } from 'parse5';
import { documents, plainText, site, redirects, prettyRoute } from '../src/lib/content.mjs';
const root=resolve('dist'),failures=[];
async function walk(dir){const all=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);all.push(...e.isDirectory()?await walk(p):[p]);}return all;}
const files=await walk(root),fileSet=new Set(files),pages=new Map();
const attrs=n=>Object.fromEntries((n.attrs||[]).map(a=>[a.name,a.value]));
const nodes=n=>[n,...(n.childNodes||[]).flatMap(nodes)];
const htmlPath=route=>join(root,route==='/404.html'?'404.html':route==='/'?'index.html':route.slice(1)+'index.html');
for(const file of files.filter(p=>p.endsWith('.html'))) {
  const html=await readFile(file,'utf8');const tree=parse(html),all=nodes(tree);
  pages.set(file,{all,html,ids:new Set(all.map(n=>attrs(n).id).filter(Boolean))});
  if(/\{%|\{\{/.test(html))failures.push('Unconverted template syntax: '+file);
  if(/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html))failures.push('Remote font dependency: '+file);
  for(const n of all.filter(n=>n.tagName==='script'&&attrs(n).type==='application/ld+json'))try{JSON.parse((n.childNodes||[]).map(x=>x.value||'').join(''));}catch{failures.push('Invalid structured data: '+file);}
}
for(const page of documents) {
  const found=pages.get(htmlPath(page.route));if(!found){failures.push('Missing source route: '+page.url);continue;}
  const title=found.all.find(n=>n.tagName==='title');
  const expected=page.title===site.title?site.title:page.title+' · '+site.title;
  if(plainText((title?.childNodes||[]).map(n=>n.value||'').join(''))!==expected)failures.push('Incorrect title: '+page.url);
  const canonical=found.all.find(n=>n.tagName==='link'&&attrs(n).rel==='canonical');
  if(attrs(canonical||{}).href!==new URL(page.url,site.url).href)failures.push('Incorrect canonical: '+page.url);
  if(!found.all.some(n=>n.tagName==='main'&&attrs(n).id==='main-content'))failures.push('Missing main landmark: '+page.url);
}
for(const {from} of redirects)if(!fileSet.has(htmlPath(prettyRoute(from))))failures.push('Missing redirect: '+from);
let references=0;
for(const [file,{all}] of pages)for(const n of all) {
  const a=attrs(n);const referencesToCheck=[a.href,a.src,a.poster,...(a.srcset&&!a.srcset.startsWith('data:')?a.srcset.split(',').map(s=>s.trim().split(/\s+/)[0]):[])].filter(Boolean);
  for(const ref of referencesToCheck) {
    const url=new URL(ref,new URL(file.slice(root.length),site.url));if(!['krigsvold.org','www.krigsvold.org'].includes(url.hostname)||!['http:','https:'].includes(url.protocol))continue;
    references++;const target=resolve(root,'.'+decodeURIComponent(url.pathname));if(!target.startsWith(root+'/')&&target!==root){failures.push('Reference escapes site root: '+ref);continue;}
    const candidates=[target,join(target,'index.html'),target+'.html'];const found=candidates.find(p=>fileSet.has(p));
    if(!found){failures.push('Missing local target '+ref+' from '+file.slice(root.length));continue;}
    const fragment=decodeURIComponent(url.hash.slice(1));if(fragment&&!fragment.startsWith(':~:text=')&&extname(found)==='.html'&&!pages.get(found)?.ids.has(fragment))failures.push('Missing anchor '+ref+' from '+file.slice(root.length));
  }
}
const search=JSON.parse(await readFile(join(root,'data/search.json'),'utf8'));
for(const p of documents.filter(p=>p.sitemap!==false))if(!search.some(x=>x.uri===p.url))failures.push('Search index missing '+p.url);
for(const filename of ['feed.xml','sitemap.xml','robots.txt','llms.txt','CNAME'])if(!fileSet.has(join(root,filename)))failures.push('Missing public metadata '+filename);
if(files.some(p=>p.includes('/.prerender/')))failures.push('Temporary prerender output remains');
const css=(await Promise.all(files.filter(p=>p.endsWith('.css')&&p.includes('/_astro/')).map(p=>readFile(p,'utf8')))).join('\n');
for(const family of ['Roboto','Roboto Slab','Roboto Mono'])if(!css.includes(family))failures.push('Missing local font family '+family);
console.log(JSON.stringify({source_pages:documents.length,html_files:pages.size,local_references:references,search_records:search.length,failures:[...new Set(failures)]},null,2));
if(failures.length)process.exitCode=1;
