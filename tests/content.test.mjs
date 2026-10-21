import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { documents, posts, fellows, positions, redirects, markdown, plainText } from '../src/lib/content.mjs';
test('every published source collection has a unique route and rendered content',()=>{
  assert.equal(posts.length,5);assert.equal(fellows.length,2);assert.equal(positions.length,1);
  assert.equal(new Set(documents.map(p=>p.route)).size,documents.length);
  for(const p of documents){assert.ok(p.title,p.file);assert.doesNotMatch(p.html,/\{%|\{\{/);if(p.layout!=='home')assert.ok(plainText(p.html).length>10,p.file);}
});
test('explicit legacy post permalinks and privacy redirects remain authoritative',()=>{
  assert.ok(posts.some(p=>p.url==='/2026/05/08/ria-raut-named-recipient-of-2026-count-of-krigsvold-fellowship'));
  for(const path of ['/cookies','/privacy','/privacy-policy','/privacy-notice'])assert.ok(redirects.some(r=>r.from===path&&r.to==='/privacy-and-cookie-notice'));
});
test('privacy headings and the FAQ keep useful anchor identifiers',()=>{
  assert.match(documents.find(p=>p.file==='privacy-notice.md').html,/id="cookie-settings"/);
  assert.match(documents.find(p=>p.file==='faq.html').html,/id="collapse-what-is-krigsvold"/);
});
test('figures retain image paths, captions and links without a template engine',()=>{
  const p=documents.find(p=>p.file==='heraldry.md');assert.match(p.html,/<figcaption/);assert.match(p.html,/primary-logo|assets\/img/);assert.doesNotMatch(p.html,/include figure/);
});
test('the static site consumes exact published core and Astro releases',async()=>{
  const p=JSON.parse(await readFile('package.json','utf8'));
  assert.equal(p.dependencies['@krigsvold/theme'],'2.0.0');assert.equal(p.dependencies['@krigsvold/astro'],'1.0.0');
  assert.match(await readFile('src/layouts/Page.astro','utf8'),/@krigsvold\/astro\/Layout\.astro/);
});
