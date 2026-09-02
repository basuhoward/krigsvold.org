---
title: Antarctica Briefings
eyebrow: Evidence and interpretation
description: Krigsvold publishes sourced briefings on Antarctic ice, oceans, circulation, ecosystems, carbon, and scientific response.
featured_image: /assets/img/southern-ocean.webp
last_reviewed: 2026-09-02
---

Antarctica is remote in distance, not in consequence. Its ice affects global
sea level; the Southern Ocean moves heat, carbon, and nutrients between ocean
basins; its sea ice helps organize an entire food web.

These briefings explain that system for a general reader. Each page separates
measured change from projected change, links to primary scientific institutions,
and carries a review date so an old number cannot quietly masquerade as a new
one.

<div class="briefing-grid">
{% for briefing in site.data.briefings %}
  <article class="briefing-card">
    <img src="{{ briefing.image | relative_url }}" alt="" loading="lazy">
    <div>
      <p class="eyebrow">Reviewed {{ briefing.reviewed | date: "%B %Y" }}</p>
      <h2><a href="{{ briefing.url | relative_url }}">{{ briefing.title }}</a></h2>
      <p>{{ briefing.summary }}</p>
    </div>
  </article>
{% endfor %}
</div>

## Editorial standard

The briefings are interpretation, not original scientific research. Primary
sources are preferred, uncertainty is stated, and scientific claims are revised
when the underlying evidence changes. The full approach is described in
[Sources and Method](/sources-and-method/).
