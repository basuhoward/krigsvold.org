---
layout: page
title: Search
sitemap: false
subtitle: Search the Count of Krigvold's site here
featured_image: /assets/img/search-banner.webp
---

<style type="text/css">
.main {
  width: 100%;
}
#search-input {
  width: 100%;
  font-size: 1em;
  padding: .5em;
}
.section { padding: 0px; }
.search-results b {
  background-color: #f2daa6;
}
.search-preview {
  display: inline;
  margin-bottom: 2em;
  font-size: 110%;
}
.search-date {
  margin-bottom: 0em;
  display: inline;
}
.result-line {
  margin-bottom: 2em;
}
.toc-line {
  margin-top: 0.5em;
  margin-bottom: 0;
}
.single .main a, .single .main h2 {
  border-bottom: none;
}
#search-input {
   border-color: #303030;
   border-width: 1px;
   border-style: solid;
}
</style>
<input type="search" id="search-input" class="form-control">
<div class="search-results">
<section class="result-line">
<h3 class="toc-line"><a target="_blank"></a><span class="dots"></span><span class="page-num small"></span></h3>
<div class="search-date"></div> &mdash; <div class="search-preview"></h5></div>
</section>
</div>
<script src="https://cdn.jsdelivr.net/npm/fuse.js@6.6.2" defer></script>
<script src="/assets/js/search.js" defer></script>
