---
layout: page
title: Research
permalink: /research/
theme: lavender
---

<!-- Publications are auto-populated from _data/publications.yml -->
<!-- Working papers link to latest GitHub versions -->

{% assign book_chapters = site.data.publications | where: "category", "book-chapters" %}
{% assign peer_reviewed = site.data.publications | where: "category", "peer-reviewed" %}
{% assign working_papers = site.data.publications | where: "category", "working-papers" %}
{% assign in_progress = site.data.publications | where: "category", "in-progress" %}

## MNCs, States, and the Race for Sovereign AI

<div class="research-section">
<p>Governments now treat computing capacity as a matter of national security, yet every advanced economy depends on a short list of firms for the processors, fabrication tools, and cloud capacity at stake. Those firms also hold nearly all the technical information a regulator needs, so the rules that govern them are drafted largely from what the firms choose to disclose. My research asks whether the race for sovereign AI defends a national interest shared by the host state's constituents or advances the interests of a few firms under that name. Four projects pursue the question through the scope of US export controls, the uneven compliance of allied governments, US and Chinese financing of digital infrastructure in the Global South, and a conjoint survey of corporate and government decision makers.</p>
<a href="{{ '/sovereign-ai/' | relative_url }}" class="cv-download">Click for working drafts &#9656;</a>
</div>

{% if peer_reviewed.size > 0 %}
## Peer-Reviewed Articles

<div class="research-section">
{% for pub in peer_reviewed %}
<div class="publication-entry">
  <div class="pub-title">
    {% if pub.doi %}<a href="{{ pub.doi }}">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}
  </div>
  {% if pub.authors %}<div class="pub-authors">{{ pub.authors }}</div>{% endif %}
  {% if pub.venue %}<div class="pub-venue">{{ pub.venue }}{% if pub.year %}, {{ pub.year }}{% endif %}</div>{% endif %}
  {% if pub.abstract %}
  <details class="pub-abstract">
    <summary>Abstract</summary>
    <p>{{ pub.abstract }}</p>
  </details>
  {% endif %}
  {% if pub.pdf_url or pub.doi or pub.replication %}
  <div class="pub-links">
    {% if pub.pdf_url %}<a href="{{ pub.pdf_url }}" class="pub-link" target="_blank">PDF</a>{% endif %}
    {% if pub.doi %}<a href="{{ pub.doi }}" class="pub-link" target="_blank">DOI</a>{% endif %}
    {% if pub.replication %}<a href="{{ pub.replication }}" class="pub-link" target="_blank">Online Appendix</a>{% endif %}
  </div>
  {% endif %}
</div>
{% endfor %}
</div>
{% endif %}

## Working Papers

<div class="research-section">
{% assign sorted_wp = working_papers | sort: "sort_order" %}
{% for pub in sorted_wp %}
<div class="publication-entry">
  <div class="pub-title">
    {% if pub.github_pdf %}<a href="https://docs.google.com/gview?url=https://github.com/{{ site.github_username }}/{{ site.github_username }}.github.io/raw/main/{{ pub.github_pdf }}&embedded=false">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}
  </div>
  {% if pub.authors %}<div class="pub-authors">{{ pub.authors }}</div>{% endif %}
  {% if pub.status %}<div class="pub-venue">{% if pub.status contains "Revise & Resubmit," %}{% assign rr_journal = pub.status | remove_first: "Revise & Resubmit, " %}Revise & Resubmit, <span style="font-weight: 700;">{{ rr_journal }}</span>{% else %}{{ pub.status }}{% endif %}</div>{% endif %}
  {% if pub.abstract %}
  <details class="pub-abstract">
    <summary>Abstract</summary>
    <p>{{ pub.abstract }}</p>
  </details>
  {% endif %}
  <div class="pub-links">
    {% if pub.github_pdf %}<a href="https://docs.google.com/gview?url=https://github.com/{{ site.github_username }}/{{ site.github_username }}.github.io/raw/main/{{ pub.github_pdf }}&embedded=false" class="pub-link" target="_blank">Latest Draft</a>{% endif %}
    {% if pub.pdf_url %}<a href="{{ pub.pdf_url }}" class="pub-link" target="_blank">PDF</a>{% endif %}
  </div>
</div>
{% endfor %}

{% if working_papers.size == 0 %}
*Working papers will appear here automatically when PDFs are added to the `papers/working-papers/` folder in the GitHub repository.*
{% endif %}
</div>

{% if book_chapters.size > 0 %}
## Book Chapters

<div class="research-section">
{% for pub in book_chapters %}
<div class="publication-entry">
  <div class="pub-title">{{ pub.title }}</div>
  {% if pub.authors %}<div class="pub-authors">{{ pub.authors }}</div>{% endif %}
  {% if pub.venue %}<div class="pub-venue">{{ pub.venue }}</div>{% endif %}
  {% if pub.abstract %}
  <details class="pub-abstract">
    <summary>Abstract</summary>
    <p>{{ pub.abstract }}</p>
  </details>
  {% endif %}
  {% if pub.pdf_url or pub.doi %}
  <div class="pub-links">
    {% if pub.pdf_url %}<a href="{{ pub.pdf_url }}" class="pub-link" target="_blank">PDF</a>{% endif %}
    {% if pub.doi %}<a href="{{ pub.doi }}" class="pub-link" target="_blank">DOI</a>{% endif %}
  </div>
  {% endif %}
</div>
{% endfor %}
</div>
{% endif %}

## Works in Progress

<div class="research-section">
{% for pub in in_progress %}
<div class="publication-entry">
  <div class="pub-title">{{ pub.title }}</div>
  {% if pub.authors %}<div class="pub-authors">{{ pub.authors }}</div>{% endif %}
  {% if pub.description %}
  <details class="pub-abstract">
    <summary>Abstract</summary>
    <p>{{ pub.description }}</p>
  </details>
  {% endif %}
</div>
{% endfor %}

{% if in_progress.size == 0 %}
*Works in progress will be listed here.*
{% endif %}
</div>
