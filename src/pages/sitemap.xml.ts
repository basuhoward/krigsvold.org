import { documents, site, escape } from '../lib/content.mjs';
export function GET() {
  const body=documents.filter(p=>p.sitemap!==false&&p.sitemap?.exclude!=='yes').map(p=>`<url><loc>${escape(new URL(p.url,site.url).href)}</loc>${p.last_reviewed||p.last_modified_at||p.date?`<lastmod>${new Date(p.last_reviewed||p.last_modified_at||p.date).toISOString().slice(0,10)}</lastmod>`:''}</url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`,{headers:{'Content-Type':'application/xml; charset=utf-8'}});
}
