---
layout: page
title: Search
eyebrow: Find a page
description: Search Krigsvold's briefings, positions, Fellow profiles, news, and institutional pages.
sitemap: false
featured_image: /assets/img/search-banner.webp
---

<label for="search-input">Search this site</label>
<input type="search" id="search-input" class="form-control site-search-input" data-index-url="/data/search.json" autocomplete="off">
<div class="search-results" aria-live="polite">
  <section class="result-line">
    <h2 class="toc-line"><a></a></h2>
    <p class="search-meta"><span class="search-date"></span></p>
    <p class="search-preview"></p>
  </section>
</div>
<noscript><p>Site search requires JavaScript. The primary navigation and <a href="/antarctica/">briefings index</a> remain available without it.</p></noscript>
<script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2" defer></script>
<script src="{{ '/assets/js/search.js' | relative_url }}" defer></script>
