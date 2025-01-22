(e => {
    const t = e.querySelector("#search-input"),
        n = e.querySelector(".search-results");
    if (!t || !n) return;
    const i = t.dataset;
    let o;

    // Helper function to get the value of a query parameter from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Get the "q" parameter from the URL and prepopulate the search input field
    const queryParam = getQueryParam("q");
    if (queryParam) {
        t.value = queryParam;  // Prepopulate the search input with the value from "q"
    }

    function r(e, t, n) {
        let i;
        for (let n of e.matches) n.key === t && (i = n.indices);
        const o = e.item[t];
        if (!i) return o.substr(0, n);
        let r, s, l = 0,
            c = Math.ceil(n / 2);
        for (; s = i.shift();) s[1] - s[0] >= l && (r = s, l = r[1] - r[0]);
        return (r[0] - c > 0 ? "[...] " : "") + o.substring(r[0] - c, r[0]) + "<b>" + o.substring(r[0], r[1] + 1) + "</b>" + o.substring(r[1] + 1, r[1] + 1 + c) + (r[1] + 1 + c < o.length ? " [...] " : "");
    }

    function triggerSearch() {
        if (queryParam) {
            u();  // Trigger the search with the prefilled query
        }
    }

    t.addEventListener("focus", (e => {
        if (o) return;
        t.placeholder = i.infoInit || "Loading search index... Please hold on.";
        const n = new XMLHttpRequest;
        n.responseType = "json", n.addEventListener("load", (e => {
            const r = n.response;
            r && 0 !== r.length ? (t.placeholder = i.infoOk || "SEARCH...", o = new Fuse(r, {
                keys: [{
                    name: "title",
                    weight: 5
                }, "content"],
                useExtendedSearch: !0,
                includeMatches: !0,
                ignoreLocation: !0,
                threshold: .1
            }), triggerSearch()) : t.placeholder = i.infoFail || "Failed to load search index!";
        }), !1), n.open("GET", i.indexUrl || "/data/search.json"), n.send(null);
    }));

    const s = i.textLength || 300,
        l = i.limit || 50,
        c = i.delay || 500,
        a = n.firstElementChild.cloneNode(!0);

    function u() {
        if (o) {
            n.innerHTML = "";
            for (let e of o.search(t.value, {
                    limit: l
                })) {
                const t = a.cloneNode(!0),
                    i = t.querySelector("a");
              i.href = e.item.uri, i.innerHTML = r(e, "title", s), t.querySelector(".search-date").innerHTML = r(e, "date", s), t.querySelector(".search-preview").innerHTML = r(e, "content", s), n.appendChild(t);
            }
        }
    }

    n.innerHTML = "";
    const d = /Mobi/i.test(navigator.userAgent);
    t.addEventListener(d ? "change" : "input", d ? u : function(e, t) {
        let n;
        return function(...i) {
            clearTimeout(n), n = setTimeout((() => e(...i)), t);
        }
    }(u, c));

    // Automatically trigger focus on the search input if "q" parameter exists
    if (queryParam) {
        t.dispatchEvent(new Event('focus'));  // Trigger the focus event to load the index
    }

})(document);
