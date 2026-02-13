---
layout: page
title: Teaching
permalink: /teaching/
---

## Teaching Record

<div class="research-section">
{% for course in site.data.teaching %}
{% if course.type == "record" %}
<div class="teaching-entry">
  <div class="course-title">{{ course.title }}</div>
  <div class="course-meta">{{ course.role }} &middot; {{ course.institution }} &middot; {{ course.term }}</div>
  {% if course.description %}
  <p class="course-description">{{ course.description }}</p>
  {% endif %}
</div>
{% endif %}
{% endfor %}
</div>

---

## Course Proposals

<div class="research-section">
{% for course in site.data.teaching %}
{% if course.type == "proposal" %}
<div class="teaching-entry">
  <div class="course-title">{{ course.title }}</div>
  <div class="course-meta">{{ course.level }}</div>
  {% if course.description %}
  <p class="course-description">{{ course.description }}</p>
  {% endif %}
</div>
{% endif %}
{% endfor %}
</div>

<!-- To update, edit _data/teaching.yml -->
