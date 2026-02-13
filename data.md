---
layout: page
title: Data
permalink: /data/
---

## My Datasets

<ul class="dataset-list">
{% for dataset in site.data.datasets %}
{% if dataset.source == "github" %}
<li class="dataset-item">
  <div class="dataset-name"><a href="{{ dataset.url }}">{{ dataset.name }}</a></div>
  <div class="dataset-desc">{{ dataset.description }}</div>
</li>
{% endif %}
{% endfor %}
</ul>

{% if site.data.datasets.size == 0 %}
*Datasets will appear here when added to the `_data/datasets.yml` file.*
{% endif %}

---

## External Datasets

<ul class="dataset-list">
{% for dataset in site.data.datasets %}
{% if dataset.source == "external" %}
<li class="dataset-item">
  <div class="dataset-name"><a href="{{ dataset.url }}" target="_blank" rel="noopener">{{ dataset.name }}</a></div>
  <div class="dataset-desc">{{ dataset.description }}</div>
</li>
{% endif %}
{% endfor %}
</ul>

<!-- To add datasets, edit _data/datasets.yml -->
