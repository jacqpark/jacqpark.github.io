---
layout: page
title: Teaching
permalink: /teaching/
theme: lavender
---

## Instats Webinars

<div class="research-section">
{% for course in site.data.teaching %}
{% if course.type == "webinar" %}
<div class="teaching-entry">
  <div class="course-title">
    {% if course.url %}<a href="{{ course.url }}" target="_blank" rel="noopener">{{ course.title }}</a>{% else %}{{ course.title }}{% endif %}
  </div>
  {% if course.description %}
  <p class="course-description">{{ course.description }}</p>
  {% endif %}
</div>
{% endif %}
{% endfor %}
</div>

---

## Teaching Record

### Instructor

<div class="research-section">
{% for course in site.data.teaching %}
{% if course.type == "record" and course.role == "Instructor" %}
<div class="teaching-entry">
  <div class="course-title">{{ course.title }}</div>
  <div class="course-meta">{{ course.level }} &middot; {{ course.institution }} &middot; {{ course.term }}</div>
  {% if course.description %}
  <p class="course-description">{{ course.description }}</p>
  {% endif %}
</div>
{% endif %}
{% endfor %}
</div>

### Teaching Assistant

<div class="research-section">
{% for course in site.data.teaching %}
{% if course.type == "record" and course.role == "Teaching Assistant" %}
<div class="teaching-entry">
  <div class="course-title">{{ course.title }}</div>
  <div class="course-meta">{{ course.level }} &middot; {{ course.institution }} &middot; {{ course.term }}</div>
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
