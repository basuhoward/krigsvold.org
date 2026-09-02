---
title: Meet the Fellows
eyebrow: Research support
description: Meet the recipients of the Count of Krigsvold Fellowship for graduate research in climate change and global conservation.
featured_image: /assets/img/fellowship-banner.webp
---

The Count of Krigsvold Fellowship is an annual $1,000 grant for graduate
research in climate change and global conservation. It is administered in
partnership with the Grand Duchy of Westarctica.

The program is global by design. Its first two awards support field research in
tropical forest governance, biodiversity, and restoration—work far from
Antarctica, but directly connected to the same planetary climate and
conservation problems.

<div class="fellows-list">
{% assign fellows = site.fellows | sort: "year" | reverse %}
{% for fellow in fellows %}
  <article class="fellow-listing">
    <p class="fellow-listing__year">{{ fellow.year }}</p>
    <div>
      <h2><a href="{{ fellow.url | relative_url }}">{{ fellow.title }}</a></h2>
      <p class="lead">{{ fellow.summary }}</p>
      <p>{{ fellow.project }}</p>
      <a class="quiet-link" href="{{ fellow.url | relative_url }}">Fellow profile <span aria-hidden="true">→</span></a>
    </div>
  </article>
{% endfor %}
</div>

For eligibility and the next award cycle, see [The Fellowship](/fellowship/).
