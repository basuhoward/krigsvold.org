import { readFile, readdir } from 'node:fs/promises';
import { parse as parseYAML } from 'yaml';
import MarkdownIt from 'markdown-it';
import { parseFragment } from 'parse5';

export const site = parseYAML(await readFile('_config.yml','utf8'));
/** @typedef {{title:string,url?:string,submenu_items?:MenuItem[],target?:string,relationship?:string,data?:Record<string,string|null>}} MenuItem */
/** @type {{main_menu_settings:{menu_items:MenuItem[]},footer_menu_settings:{menu_items:MenuItem[]},[key:string]:any}} */
export const settings = parseYAML(await readFile('_data/settings.yml','utf8'));
/** @type {{value:string,label:string,context:string,source_url:string,source_name:string,verified:string}[]} */
export const metrics = parseYAML(await readFile('_data/metrics.yml','utf8'));
export const briefings = parseYAML(await readFile('_data/briefings.yml','utf8'));
export const faq = parseYAML(await readFile('_data/faq.yml','utf8'));
export const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function plainText(html) {
  const walk=n=>n.nodeName==='#text'?n.value:['script','style'].includes(n.tagName)||n.attrs?.some(a=>a.name==='aria-hidden'&&a.value==='true')?'':(n.childNodes||[]).map(walk).join(' ');
  return walk(parseFragment(html)).replace(/\s+/g,' ').trim();
}
export const slugify = value => String(value).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,'').trim().replace(/[\s-]+/g,'-');
/** @param {string|number|Date} value @param {Intl.DateTimeFormatOptions} [options] */
export const date = (value, options={month:'long',day:'numeric',year:'numeric'}) => value ? new Intl.DateTimeFormat('en-US',{...options,timeZone:'UTC'}).format(new Date(value)) : '';
export const prettyRoute = url => url==='/404.html'?url:'/'+url.replace(/^\/+|\/+$/g,'')+(url==='/'?'':'/');
const md = new MarkdownIt({html:true,linkify:false,typographer:false});
md.core.ruler.push('source-heading-identifiers', state=>{
  const counts = new Map();
  for(let i=0;i<state.tokens.length;i++) {
    const t=state.tokens[i];if(t.type!=='heading_open')continue;
    const inline=state.tokens[i+1],explicit=inline.content.match(/\s*\{#([^}]+)\}\s*$/);
    if(explicit){inline.content=inline.content.slice(0,explicit.index);for(const child of inline.children||[])if(child.type==='text')child.content=child.content.replace(/\s*\{#[^}]+\}\s*$/,'');}
    const base=explicit?.[1]||slugify(inline.content),count=counts.get(base)||0;counts.set(base,count+1);
    t.attrSet('id',base+(count?'-'+count:''));
  }
});
export const markdown = value => md.render(String(value ?? ''));
function frontMatter(raw) {
  const match=raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  return match ? {data:parseYAML(match[1])||{},content:match[2]} : null;
}
const sourceFiles=[];
for(const file of await readdir('.')) if(/\.(md|html)$/.test(file))sourceFiles.push({file,kind:'page'});
sourceFiles.push({file:'news/index.html',kind:'news'});
for(const [dir,kind] of [['_posts','post'],['_fellows','fellow'],['_positions','position']])
  for(const file of await readdir(dir))if(file.endsWith('.md'))sourceFiles.push({file:dir+'/'+file,kind});
export const documents=[];
for(const {file,kind} of sourceFiles) {
  const parsed=frontMatter(await readFile(file,'utf8'));if(!parsed||parsed.data.published===false)continue;
  const {data,content}=parsed;
  const stem=file.split('/').at(-1).replace(/\.(md|html)$/,'');
  let url=data.permalink;
  if(!url)url=kind==='post'?'/news/'+stem.slice(0,10).replaceAll('-','/')+'/'+stem.slice(11)+'/':kind==='fellow'?'/fellows/'+stem+'/':kind==='position'?'/positions/'+stem+'/':file==='index.md'?'/':kind==='news'?'/news/':'/'+stem+'/';
  if(!url.startsWith('/'))url='/'+url;
  const record={...data,file,kind,content,url,route:prettyRoute(url)};
  if(kind==='post')record.date=data.date||stem.slice(0,10);
  if(kind==='post'&&new Date(record.date)>new Date())continue;
  documents.push(record);
}
export const posts=documents.filter(p=>p.kind==='post').sort((a,b)=>new Date(b.date)-new Date(a.date));
export const fellows=documents.filter(p=>p.kind==='fellow').sort((a,b)=>b.year-a.year);
export const positions=documents.filter(p=>p.kind==='position').sort((a,b)=>new Date(b.date)-new Date(a.date));
const figure = parameters => {
  const args=Object.fromEntries([...parameters.matchAll(/(\w+)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g)].map(m=>[m[1],m[2]??m[3]??m[4]]));
  const width=Number(args.width||12),col=width<=12?width:width<40?4:width<65?6:12;
  const img=`<img class="featured-img my-3 mx-auto ${args.border==='true'?'img-border p-3 mb-3':''}" src="/assets/img/${escape(args.image)}" alt="${escape(args.alt||'no description')}" loading="${escape(args.load?'lazy':args.loading||'lazy')}"/>`;
  return `<div class="m-3"><div class="item col-md-${col} ${args.placement==='right'?'pull-right':''} px-4 py-2"><div class="card p-4 figure-img"><figure class="m-0">${args.link?`<a href="${escape(args.link)}" class="header">${img}</a>`:img}<div class="content">${args.cap?`<figcaption class="images-caption">${md.renderInline(args.cap)}</figcaption>`:''}</div></figure></div></div></div>`;
};
function listing(kind) {
  if(kind==='fellows')return fellows.map(f=>`<article class="fellow-listing"><p class="fellow-listing__year">${f.year}</p><div><h2><a href="${escape(f.url)}">${escape(f.title)}</a></h2><p class="lead">${escape(f.summary)}</p><p>${escape(f.project)}</p><a class="quiet-link" href="${escape(f.url)}">Fellow profile <span aria-hidden="true">→</span></a></div></article>`).join('\n');
  if(kind==='positions')return positions.map(p=>`<article class="briefing-card"><div><img src="${escape(p.featured_image)}" alt="" loading="lazy"></div><div><p class="eyebrow">Position ${escape(p.position_number)} · Published ${date(p.date)}</p><h2><a href="${escape(p.url)}">${escape(p.title)}</a></h2><p>${escape(p.summary||p.description)}</p><a class="quiet-link" href="${escape(p.url)}">Read the position <span aria-hidden="true">→</span></a></div></article>`).join('\n');
  if(kind==='antarctica')return briefings.map(b=>`<article class="briefing-card"><img src="${escape(b.image)}" alt="" loading="lazy"><div><p class="eyebrow">Reviewed ${date(b.reviewed,{month:'long',year:'numeric'})}</p><h2><a href="${escape(b.url)}">${escape(b.title)}</a></h2><p>${escape(b.summary)}</p></div></article>`).join('\n');
  if(kind==='news')return `<div class="news-list">${posts.map(p=>`<article class="news-listing"><div class="news-listing__image"><img src="${escape(p.featured_image||'/assets/img/news.webp')}" alt="" loading="lazy"></div><div><p class="eyebrow">${date(p.date)}</p><h2><a href="${escape(p.url)}">${escape(p.title)}</a></h2><p>${escape(p.description||plainText(markdown(p.content)).split(' ').slice(0,34).join(' '))}</p><a class="quiet-link" href="${escape(p.url)}">Read the announcement <span aria-hidden="true">→</span></a></div></article>`).join('\n')}</div>`;
  throw new Error('Unknown listing '+kind);
}
function renderBody(record) {
  let source=record.content.replace(/\{%\s*include figure\.html\s+([\s\S]*?)%\}/g,(_,args)=>figure(args));
  if(record.file==='faq.html')source=faq.groups.map((group,i)=>`<h2 class="my-4">${escape(group.name)}</h2><div class="accordion" id="accordionFaq-${i+1}">${group.questions.map(q=>{const id=slugify(q.question);return `<details class="krigsvold-faq accordion-item mb-3" id="collapse-${id}"><summary class="accordion-button font-weight-bold" id="heading-${id}">${escape(q.question)}</summary><div class="accordion-body">${markdown(q.answer)}</div></details>`;}).join('')}</div>`).join('\n');
  if(['fellows.md','positions.md','antarctica.md'].includes(record.file)) {
    const kind=record.file.slice(0,-3);
    source=source.replace(/\{%\s*assign[\s\S]*?%\}/g,'').replace(/\{%\s*for[\s\S]*?\{%\s*endfor\s*%\}/g,listing(kind));
  }
  if(record.kind==='news')source=listing('news');
  source=source.replace(/\{\{\s*'now'\s*\|\s*date:\s*"%Y"\s*\}\}/g,String(new Date().getUTCFullYear()));
  if(record.file==='search.md')source=source.replace(/<script[\s\S]*?<\/script>/g,'');
  source=source.replace(/<section\s+markdown="1">([\s\S]*?)<\/section>/g,(_,body)=>'<section>\n'+markdown(body)+'\n</section>');
  if(/\{%|\{\{/.test(source))throw new Error('Unconverted template syntax in '+record.file);
  return record.file.endsWith('.html')?source:markdown(source);
}
for(const record of documents)record.html=renderBody(record);
export const redirects=documents.flatMap(p=>(Array.isArray(p.redirect_from)?p.redirect_from:p.redirect_from?[p.redirect_from]:[]).map(from=>({from,to:p.url})));
export function structuredData(page) {
  const url=new URL(page.url,site.url).href,org={'@type':'Organization','@id':site.url+'/#organization',name:'Office of the Count of Krigsvold',url:site.url+'/'};
  const profile={'@context':'https://schema.org','@type':'ProfilePage','@id':url+'#profilepage',url,name:page.title===site.title?site.title:`${page.title} · ${site.title}`,description:page.description||site.description,inLanguage:'en-US'};
  if(page.kind==='fellow')return {...profile,mainEntity:{'@type':'Person','@id':url+'#person',name:page.title,description:page.description||page.summary,url,award:page.year+' Count of Krigsvold Fellowship',affiliation:{'@type':'Organization',name:page.institution},...(page.featured_image?{image:new URL(page.featured_image,site.url).href}:{}),...(page.external_url?{sameAs:page.external_url}:{})}};
  if(page.kind==='post')return {'@context':'https://schema.org','@type':'PressRelease','@id':url+'#pressrelease',mainEntityOfPage:{'@type':'WebPage','@id':url},url,headline:page.title,description:page.description||page.title,inLanguage:'en-US',isAccessibleForFree:true,datePublished:new Date(page.date).toISOString(),dateModified:new Date(page.last_modified_at||page.date).toISOString(),author:{'@type':'Person',name:'James P. Howard, II, Count of Krigsvold'},publisher:{...org,logo:{'@type':'ImageObject',url:new URL('/assets/img/identity/favicon.svg',site.url).href}},image:[new URL(page.featured_image||'/assets/img/home-banner.webp',site.url).href],articleSection:'News',keywords:page.tags||null};
  if(page.route==='/')return {'@context':'https://schema.org','@graph':[{'@type':'WebSite','@id':site.url+'/#website',url:site.url+'/',name:site.title,description:site.description,publisher:{'@id':org['@id']},inLanguage:'en-US'},{...profile,'@context':undefined,isPartOf:{'@id':site.url+'/#website'},mainEntity:{'@id':org['@id']}},{...org,alternateName:'The Count of Krigsvold',description:site.description,logo:{'@type':'ImageObject',url:new URL('/assets/img/identity/favicon.svg',site.url).href},email:'mailto:'+site.email,sameAs:['https://www.facebook.com/CountKrigsvoldWestarctica','https://bsky.app/profile/krigsvold.org','https://mastodon.social/@krigsvold','https://pinterest.com/countofkrigsvold']}]};
  return null;
}
