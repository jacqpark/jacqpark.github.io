// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
});

// Roadmap timeline alignment
// Each item after the first sits at 80% down the previous item
// (20% overlap), so same-side cards never collide back-to-back.
const ROADMAP_OVERLAP = 0.20;
function alignRoadmap() {
  const items = document.querySelectorAll('.roadmap-item');
  if (items.length < 2) return;

  items.forEach(function (it) { it.style.marginTop = ''; });

  if (window.innerWidth <= 640) return;

  void document.body.offsetHeight;

  const heights = Array.from(items).map(function (it) {
    return it.getBoundingClientRect().height;
  });

  for (let i = 1; i < items.length; i++) {
    items[i].style.marginTop = '-' + (heights[i - 1] * ROADMAP_OVERLAP) + 'px';
  }
}

window.alignRoadmap = alignRoadmap;

window.addEventListener('load', alignRoadmap);

document.querySelectorAll('.roadmap-img').forEach(function (el) {
  if (el.tagName === 'IMG' && !el.complete) {
    el.addEventListener('load', alignRoadmap);
  }
});

let _roadmapTimer = null;
window.addEventListener('resize', function () {
  clearTimeout(_roadmapTimer);
  _roadmapTimer = setTimeout(alignRoadmap, 100);
});
