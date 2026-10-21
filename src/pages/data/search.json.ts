import { documents, plainText, date } from '../../lib/content.mjs';
export function GET() {
  const items=documents.filter(p=>p.sitemap!==false).map(p=>({title:plainText(p.title),uri:p.url,date:p.kind==='fellow'?`${p.year} Fellow`:p.kind==='position'?`Position ${p.position_number} · ${date(p.date,{month:'short',day:'2-digit',year:'numeric'})}`:p.date?date(p.date,{month:'short',day:'2-digit',year:'numeric'}):'',content:plainText(p.html)}));
  return new Response(JSON.stringify(items),{headers:{'Content-Type':'application/json; charset=utf-8'}});
}
