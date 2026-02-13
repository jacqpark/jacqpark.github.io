---
layout: page
title: Research
permalink: /research/
---

<!-- Publications are auto-populated from _data/publications.yml -->
<!-- Working papers link to latest GitHub versions -->

{% assign book_chapters = site.data.publications | where: "category", "book-chapters" %}
{% assign peer_reviewed = site.data.publications | where: "category", "peer-reviewed" %}
{% assign working_papers = site.data.publications | where: "category", "working-papers" %}
{% assign in_progress = site.data.publications | where: "category", "in-progress" %}

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

{% if peer_reviewed.size > 0 %}
## Peer-Reviewed Articles

<div class="research-section">
{% for pub in peer_reviewed %}
<div class="publication-entry">
  <div class="pub-title">
    {% if pub.doi %}<a href="{{ pub.doi }}">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}
  </div>
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

## Working Papers

<div class="research-section">
{% assign sorted_wp = working_papers | sort: "sort_order" %}
{% for pub in sorted_wp %}
<div class="publication-entry">
  <div class="pub-title">
    {% if pub.github_pdf %}<a href="https://docs.google.com/gview?url=https://github.com/{{ site.github_username }}/{{ site.github_username }}.github.io/raw/main/{{ pub.github_pdf }}&embedded=false">{{ pub.title }}</a>{% else %}{{ pub.title }}{% endif %}
  </div>
  {% if pub.authors %}<div class="pub-authors">{{ pub.authors }}</div>{% endif %}
  {% if pub.status %}<div class="pub-venue">{{ pub.status }}</div>{% endif %}
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

## Works in Progress

<div class="research-section">
{% for pub in in_progress %}
<div class="publication-entry">
  <div class="pub-title">{{ pub.title }}</div>
  {% if pub.authors %}<div class="pub-authors">{{ pub.authors }}</div>{% endif %}
  {% if pub.description %}<p class="course-description">{{ pub.description }}</p>{% endif %}
</div>
{% endfor %}

{% if in_progress.size == 0 %}
*Works in progress will be listed here.*
{% endif %}
</div>
