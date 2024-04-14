---
    layout: null
---
/* global instantsearch algoliasearch */

const search = instantsearch({
    indexName: '{{ site.algolia.index_name }}',
    searchClient: algoliasearch('{{ site.algolia.application_id }}', '{{ site.algolia.search_only_api_key }}'),

    searchFunction: function (helper) {
        if (helper.state.query) {
            helper.search();
        }
    },
});

{% raw %}
search.addWidgets([
    instantsearch.widgets.searchBox({
        container: '#searchbox',
        placeholder: 'Search...',
        searchAsYouType: false,
        showReset: true,
        showSubmit: true,
    }),

    instantsearch.widgets.poweredBy({
        container: '#powered-by',
    }),
    
    instantsearch.widgets.hits({
        container: '#hits',
        transformItems: function (items) {
            return items.map(item => ({
                ...item,
                humandate: new Date(item.date * 1000).toDateString(),
            }));
        },
        templates: {
            item: `<div class="post">
                   <h1 class="post-title"><a href="{{url}}">{{title}}</a></h1>
                   <span class="post-date">{{humandate}}</span>
                   <p>{{content}}</p>
                   </div>`,
        },
    }),

    instantsearch.widgets.pagination({
        container: '#pagination',
    }),
]);

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

search.start();

var searchQuery = decodeURI(getUrlVars()["q"]);
if (typeof searchQuery !== 'undefined' && searchQuery !== 'undefined') { 
    search.helper.setQuery(searchQuery); 
    search.helper.search();
}
{% endraw %}
