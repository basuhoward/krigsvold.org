"""Compare independently built Jekyll and Astro output, following redirect aliases."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote,urljoin
import json,sys,re,unicodedata

class Page(HTMLParser):
    def __init__(self,text):
        super().__init__(convert_charrefs=True);self.stack=[];self.main=[];self.title=[];self.canonical=None;self.description=None;self.redirect=None;self.links=[];self.anchors=set();self.feed(text)
    def handle_starttag(self,tag,pairs):
        a=dict(pairs)
        if a.get('id'):self.anchors.add(a['id'])
        for key in ['href','src','poster']:
            if a.get(key):self.links.append(a[key])
        if tag=='link' and a.get('rel')=='canonical':self.canonical=a.get('href')
        if tag=='meta' and a.get('name')=='description':self.description=a.get('content')
        if tag=='meta' and a.get('http-equiv','').lower()=='refresh':self.redirect=a.get('content','').split('url=',1)[-1]
        if tag not in ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']:self.stack.append((tag,a.get('aria-hidden')=='true'))
    def handle_endtag(self,tag):
        for i in range(len(self.stack)-1,-1,-1):
            if self.stack[i][0]==tag:self.stack=self.stack[:i];break
    def handle_data(self,data):
        if any(t in ['script','style'] or hidden for t,hidden in self.stack):return
        if any(t=='main' for t,_ in self.stack):self.main.append(data)
        if any(t=='title' for t,_ in self.stack):self.title.append(data)

def normalize(parts):
    s=unicodedata.normalize('NFKC',' '.join(parts))
    s=s.translate(str.maketrans({'“':'"','”':'"','‘':"'",'’':"'",'–':'-','—':'-','…':'...'}))
    return re.sub(r'\s+',' ',s).strip()

before,after=map(Path,sys.argv[1:3]);errors=[]
def find(root,path):
    p=root/unquote(path).lstrip('/')
    return next((x for x in [p,p/'index.html',p.with_suffix('.html') if not p.suffix else p] if x.is_file()),None)
def load(p):return Page(p.read_text())
def follow(p,root):
    seen=set()
    for _ in range(5):
        page=load(p)
        if not page.redirect:return page
        path=urlsplit(urljoin('https://krigsvold.org/',page.redirect)).path
        nxt=find(root,path)
        if not nxt or nxt in seen:break
        seen.add(p);p=nxt
    return page

checked=0
for old in sorted(before.rglob('*.html')):
    rel=old.relative_to(before).as_posix();new=after/rel
    if not new.is_file():
        path='/'+rel
        if path.endswith('/index.html'):path=path[:-10]
        new=find(after,path)
    if not new:errors.append('Missing old URL: /'+rel);continue
    original=load(old);proposed=follow(new,after)
    if original.redirect:continue
    checked+=1
    for key,a,b in [('main',normalize(original.main),normalize(proposed.main)),('title',normalize(original.title),normalize(proposed.title)),('canonical',original.canonical,proposed.canonical),('description',original.description,proposed.description)]:
        if a!=b:
            errors.append(f'{key} changed: /{rel}')
            if key=='main':
                import difflib
                print('\n'.join(difflib.unified_diff(a.split(),b.split(),fromfile='Jekyll '+rel,tofile='Astro '+rel,n=2))[:6000])
    for ref in original.links:
        url=urlsplit(urljoin('https://krigsvold.org/'+rel,ref))
        if url.hostname not in ['krigsvold.org','www.krigsvold.org']:continue
        old_target=find(before,url.path)
        if not old_target:continue
        new_target=find(after,url.path)
        if not new_target:errors.append('Lost linked target: '+ref+' from '+rel)
        elif url.fragment and old_target.suffix=='.html' and unquote(url.fragment) in load(old_target).anchors:
            if unquote(url.fragment) not in follow(new_target,after).anchors:errors.append('Lost anchor: '+ref+' from '+rel)
print(json.dumps({'legacy_html_files':len(list(before.rglob('*.html'))),'content_pages_compared':checked,'errors':errors},indent=2))
if errors:sys.exit(1)
