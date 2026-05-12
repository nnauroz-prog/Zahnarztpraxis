(() => {
  'use strict';

  function safeRun(fn) {
    try { fn(); } catch (err) { console.error('[script]', err); }
  }

  window.addEventListener('error', (e) => console.error('[window]', e.message));
  window.addEventListener('unhandledrejection', (e) => console.error('[promise]', e.reason));

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    safeRun(markActiveNav);
    safeRun(initStickyHeader);
    safeRun(initMobileDrawer);
    safeRun(initScrollReveal);
    safeRun(initCookieConsent);
    safeRun(initNoticeBanner);
    safeRun(initYear);
  }

  function markActiveNav() {
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.primary-nav a[href]').forEach((a) => {
      const target = (a.getAttribute('href') || '').toLowerCase();
      if (target === here || (here === '' && target === 'index.html')) {
        a.classList.add('is-active');
      }
    });
  }

  function initStickyHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile Drawer (Ghost-Click-Guard) ---------- */
  function initMobileDrawer() {
    const toggle = document.querySelector('.burger');
    const nav = document.getElementById('primaryNav');
    if (!toggle || !nav) return;

    const GUARD_MS = 400;
    let openedAt = 0;
    let lastToggleAt = 0;
    let lastFocused = null;

    const openNav = () => {
      lastFocused = document.activeElement;
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      openedAt = Date.now();
      const target = nav.querySelector('.drawer-close, a, button');
      if (target) setTimeout(() => target.focus(), GUARD_MS);
    };

    const closeNav = () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      openedAt = 0;
      if (lastFocused && typeof lastFocused.focus === 'function') {
        try { lastFocused.focus(); } catch (e) {}
      }
    };

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (now - lastToggleAt < 250) return;
      lastToggleAt = now;
      if (nav.classList.contains('open')) closeNav();
      else openNav();
    });

    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', (e) => {
        if (Date.now() - openedAt < GUARD_MS) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        closeNav();
      });
    });

    const closer = nav.querySelector('.drawer-close');
    if (closer) {
      closer.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (Date.now() - openedAt < GUARD_MS) return;
        closeNav();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) closeNav();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 880 && nav.classList.contains('open')) closeNav();
    });
  }

  /* ---------- Scroll Reveal ---------- */
  function initScrollReveal() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.reveal');
    if (reduceMotion || !targets.length || !('IntersectionObserver' in window)) return;

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
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0.05 });

    targets.forEach((el) => { if (!el.classList.contains('in')) io.observe(el); });

    setTimeout(() => targets.forEach((el) => el.classList.add('in')), 2500);
  }

  /* ---------- Cookie Consent ---------- */
  function initCookieConsent() {
    const KEY = 'dh-consent';
    if (localStorage.getItem(KEY)) return;
    setTimeout(showConsentBanner, 700);

    document.querySelectorAll('[data-consent-reopen]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem(KEY);
        showConsentBanner();
      });
    });

    function showConsentBanner() {
      if (document.querySelector('.consent-banner')) return;
      const el = document.createElement('aside');
      el.className = 'consent-banner';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-labelledby', 'consentTitle');
      el.innerHTML =
        '<div class="consent-grid">' +
          '<div>' +
            '<h3 id="consentTitle">Hinweis zu Cookies</h3>' +
            '<p>Wir nutzen nur technisch notwendige Speicherung. Schriftarten werden von Google Fonts geladen, dabei wird Ihre IP an Google übertragen. Details in den <a href="datenschutz.html">Datenschutzhinweisen</a>.</p>' +
          '</div>' +
          '<div class="consent-actions">' +
            '<button type="button" class="btn-primary consent-accept">Zustimmen</button>' +
            '<button type="button" class="btn-light consent-essential">Nur notwendige</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(el);
      requestAnimationFrame(() => el.classList.add('visible'));
      el.querySelector('.consent-accept').addEventListener('click', () => {
        localStorage.setItem(KEY, 'all');
        el.classList.remove('visible');
        setTimeout(() => el.remove(), 250);
      });
      el.querySelector('.consent-essential').addEventListener('click', () => {
        localStorage.setItem(KEY, 'necessary');
        el.classList.remove('visible');
        setTimeout(() => el.remove(), 250);
      });
    }
  }

  /* ---------- Notice Banner (aus Supabase content) ---------- */
  function initNoticeBanner() {
    if (!window.dentalDb) return;
    const slot = document.getElementById('noticeSlot') || document.body;
    window.dentalDb.get('notice-banner').then((data) => {
      if (!data || !data.enabled || !data.text) return;
      const DISMISS_KEY = 'dh-notice-dismissed';
      if (sessionStorage.getItem(DISMISS_KEY) === data.text) return;
      const banner = document.createElement('div');
      banner.className = 'notice-banner';
      banner.setAttribute('role', 'status');
      banner.innerHTML =
        '<div class="container">' +
          '<span class="notice-banner-text"></span>' +
          '<button type="button" class="notice-banner-close" aria-label="Hinweis schließen">×</button>' +
        '</div>';
      banner.querySelector('.notice-banner-text').textContent = data.text;
      banner.querySelector('.notice-banner-close').addEventListener('click', () => {
        sessionStorage.setItem(DISMISS_KEY, data.text);
        banner.remove();
      });
      if (slot === document.body) document.body.insertBefore(banner, document.body.firstChild);
      else slot.appendChild(banner);
    }).catch(() => {});
  }

  function initYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }
})();
