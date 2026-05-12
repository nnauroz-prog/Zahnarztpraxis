/* ============================================================
   DentalHarmonie · Public Scripts
   ============================================================ */
(() => {
  'use strict';

  const safe = (fn) => { try { fn(); } catch (err) { console.error('[script]', err); } };

  window.addEventListener('error', (e) => console.error('[window]', e.message));
  window.addEventListener('unhandledrejection', (e) => console.error('[promise]', e.reason));

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  function init() {
    safe(initHeader);
    safe(initMenu);
    safe(initActiveNav);
    safe(initReveal);
    safe(initHoursToday);
    safe(initConsent);
    safe(initNoticeBanner);
    safe(initYear);
  }

  /* ---------- Sticky Header ---------- */
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Active Nav ---------- */
  function initActiveNav() {
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.header__nav a[href], .menu__list a[href]').forEach((a) => {
      const target = (a.getAttribute('href') || '').toLowerCase();
      if (target === here) a.classList.add('is-active');
    });
  }

  /* ---------- Menu (Fullscreen Sheet) ---------- */
  function initMenu() {
    const btn  = document.querySelector('.header__menu');
    const menu = document.getElementById('menu');
    if (!btn || !menu) return;

    let prevFocus = null;

    const open = () => {
      prevFocus = document.activeElement;
      btn.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      document.documentElement.classList.add('menu-open');
      const first = menu.querySelector('a, button');
      if (first) setTimeout(() => first.focus(), 300);
    };

    const close = () => {
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('menu-open');
      if (prevFocus && typeof prevFocus.focus === 'function') {
        try { prevFocus.focus(); } catch (e) {}
      }
    };

    btn.addEventListener('click', () => {
      if (btn.getAttribute('aria-expanded') === 'true') close();
      else open();
    });

    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') close();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && btn.getAttribute('aria-expanded') === 'true') close();
    });
  }

  /* ---------- Scroll Reveal ---------- */
  function initReveal() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.reveal');
    if (reduce || !targets.length || !('IntersectionObserver' in window)) return;

    document.body.classList.add('js-ready');
    requestAnimationFrame(() => {
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach((el) => { if (!el.classList.contains('in')) io.observe(el); });
    setTimeout(() => targets.forEach((el) => el.classList.add('in')), 2500);
  }

  /* ---------- "Heute"-Markierung in Sprechzeiten-Liste ---------- */
  function initHoursToday() {
    const list = document.querySelector('.hours-list');
    if (!list) return;
    const today = new Date().getDay(); // 0=So
    list.querySelectorAll('li[data-day]').forEach((li) => {
      const days = (li.getAttribute('data-day') || '').split(',').map((s) => Number(s.trim()));
      if (days.includes(today)) li.classList.add('is-today');
    });
  }

  /* ---------- Cookie Consent ---------- */
  function initConsent() {
    const KEY = 'dh-consent';
    if (localStorage.getItem(KEY)) return;

    setTimeout(show, 700);

    document.querySelectorAll('[data-consent-reopen]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem(KEY);
        show();
      });
    });

    function show() {
      if (document.querySelector('.consent')) return;
      const el = document.createElement('aside');
      el.className = 'consent';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-labelledby', 'consentTitle');
      el.innerHTML =
        '<div>' +
          '<h3 id="consentTitle">Hinweis zu Cookies</h3>' +
          '<p>Wir nutzen technisch notwendige Speicherung. Schriftarten werden von Google Fonts geladen — dabei wird Ihre IP an Google übertragen. Details in den <a href="datenschutz.html">Datenschutzhinweisen</a>.</p>' +
        '</div>' +
        '<div class="consent__actions">' +
          '<button type="button" class="btn btn--primary" data-consent="all">Zustimmen</button>' +
          '<button type="button" class="btn btn--ghost" data-consent="necessary">Nur notwendige</button>' +
        '</div>';
      document.body.appendChild(el);
      requestAnimationFrame(() => el.classList.add('is-visible'));
      el.addEventListener('click', (e) => {
        const choice = e.target.closest('[data-consent]');
        if (!choice) return;
        localStorage.setItem(KEY, choice.dataset.consent);
        el.classList.remove('is-visible');
        setTimeout(() => el.remove(), 280);
      });
    }
  }

  /* ---------- Notice Banner (aus Supabase content) ---------- */
  function initNoticeBanner() {
    if (!window.dentalDb) return;
    window.dentalDb.get('notice-banner').then((data) => {
      if (!data || !data.enabled || !data.text) return;
      const DISMISS_KEY = 'dh-notice-dismissed';
      if (sessionStorage.getItem(DISMISS_KEY) === data.text) return;
      const banner = document.createElement('div');
      banner.className = 'notice';
      banner.setAttribute('role', 'status');
      banner.innerHTML =
        '<div class="container">' +
          '<span class="notice__text"></span>' +
          '<button type="button" class="notice__close" aria-label="Hinweis schließen">×</button>' +
        '</div>';
      banner.querySelector('.notice__text').textContent = data.text;
      banner.querySelector('.notice__close').addEventListener('click', () => {
        sessionStorage.setItem(DISMISS_KEY, data.text);
        banner.remove();
      });
      document.body.insertBefore(banner, document.body.firstChild);
    }).catch(() => {});
  }

  function initYear() {
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
  }
})();
