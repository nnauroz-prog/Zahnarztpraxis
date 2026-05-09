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
    const closeNav = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeNav);
    });
    // Outside click closes the drawer
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      if (!nav.contains(e.target) && !toggle.contains(e.target)) closeNav();
    });
    // ESC closes the drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
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

  // Member-Login (Seitenfuß-Leiste auf öffentlichen Seiten)
  // Hash muss synchron mit assets/js/intern.js sein.
  const MEMBER_PW_HASH = '7c38efd0657f4f3d8cf526a6791e67cd07c2ac9289eef5023d210fe0ccb95f52';
  const MEMBER_KEY = 'dh_intern_unlocked';
  const memberForm  = document.getElementById('memberForm');
  const memberPw    = document.getElementById('memberPw');
  const memberError = document.getElementById('memberError');
  if (memberForm && memberPw && window.crypto && crypto.subtle) {
    memberForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pw = memberPw.value.trim();
      if (!pw) return;
      try {
        const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
        const hex = Array.from(new Uint8Array(buf))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        if (hex === MEMBER_PW_HASH) {
          sessionStorage.setItem(MEMBER_KEY, 'unlocked');
          window.location.href = 'intern.html';
        } else {
          if (memberError) {
            memberError.hidden = false;
            memberError.textContent = 'Passwort nicht korrekt.';
          }
          memberPw.select();
        }
      } catch (err) {
        if (memberError) {
          memberError.hidden = false;
          memberError.textContent = 'Browser unterstützt SubtleCrypto nicht – bitte aktualisieren.';
        }
      }
    });
  }
})();
