(() => {
  'use strict';

  const header = document.getElementById('siteHeader');
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primaryNav');

  // Sticky shadow on scroll
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  // Auto-collapse other FAQ items when one opens (single-open behavior)
  document.querySelectorAll('.faq details').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) {
        document.querySelectorAll('.faq details').forEach(other => {
          if (other !== d) other.open = false;
        });
      }
    });
  });

  // Scroll Reveal via IntersectionObserver
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');
  if (reduceMotion) {
    targets.forEach(el => el.classList.add('in'));
  } else if ('IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add('in'));
  }
})();
