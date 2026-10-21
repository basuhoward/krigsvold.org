import Fuse from 'fuse.js';
const input=document.querySelector('#search-input');
const results=document.querySelector('.search-results');
if(input instanceof HTMLInputElement && results) {
  let indexPromise;
  const getIndex=()=>indexPromise??=fetch(input.dataset.indexUrl||'/data/search.json').then(r=>{if(!r.ok)throw Error('Search index unavailable');return r.json();}).then(items=>new Fuse(items,{keys:[{name:'title',weight:5},'content'],ignoreLocation:true,threshold:.25}));
  let generation=0,timer;
  const render=async()=>{
    const current=++generation,query=input.value.trim();
    results.replaceChildren();if(!query)return;
    try {
      const index=await getIndex();if(current!==generation)return;
      const matches=index.search(query,{limit:50});
      if(!matches.length){const p=document.createElement('p');p.textContent='No matching pages.';results.append(p);}
      for(const {item} of matches) {
        const section=document.createElement('section');section.className='result-line';
        const heading=document.createElement('h2'),link=document.createElement('a');link.href=item.uri;link.textContent=item.title;heading.append(link);
        const meta=document.createElement('p');meta.className='search-meta';meta.textContent=item.date;
        const preview=document.createElement('p');preview.className='search-preview';preview.textContent=item.content.slice(0,300)+(item.content.length>300?' …':'');
        section.append(heading,meta,preview);results.append(section);
      }
      input.placeholder='Search Krigsvold';
    } catch {input.placeholder='Search is unavailable. Please try again.';}
  };
  input.addEventListener('focus',()=>{getIndex().catch(()=>{});},{once:true});
  input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(render,250);});
  const query=new URLSearchParams(location.search).get('q');if(query){input.value=query;render();}else results.replaceChildren();
}
