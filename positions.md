---
title: Position Statements
eyebrow: Evidence into judgment
description: Krigsvold's formal positions state a proposition, present its evidentiary basis, recommend action, and identify limits and tradeoffs.
featured_image: /assets/img/research-response-banner.webp
last_reviewed: 2026-09-02
---

Briefings explain what the evidence shows. Position statements address the next
question: **what should follow from it?**

This section makes Krigsvold's advocacy explicit and testable. A position is not
presented as a scientific finding merely because science informs it. Each
statement separates its factual basis from its judgment and includes:

- a proposition that can be accepted, rejected, or revised;
- supporting evidence linked to primary institutions and sources;
- a recommended course of action;
- limits, costs, uncertainties, and tradeoffs;
- publication and review dates; and
- a route for corrections.

Positions may change when the evidence, available choices, or consequences
change. A revision should be visible rather than silently passed off as the
position that was always held.

<div class="news-list">
{% assign positions = site.positions | sort: "date" | reverse %}
{% for position in positions %}
  <article class="news-listing">
    <div class="news-listing__image">
      <img src="{{ position.featured_image | relative_url }}" alt="" loading="lazy">
    </div>
    <div>
      <p class="eyebrow">Position {{ position.position_number }} · Published {{ position.date | date: "%B %-d, %Y" }}</p>
      <h2><a href="{{ position.url | relative_url }}">{{ position.title }}</a></h2>
      <p>{{ position.summary | default: position.description }}</p>
      <a class="quiet-link" href="{{ position.url | relative_url }}">Read the position <span aria-hidden="true">→</span></a>
    </div>
  </article>
{% endfor %}
</div>

The relationship among the site's three records is deliberate:
**[Briefings](/antarctica/) explain; positions argue; the [Annual
Record](/record/) shows what was done.**
