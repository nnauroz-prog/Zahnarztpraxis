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
    safe(initHeroParallax);
    safe(initScrollProgress);
    safe(initStickyCta);
    safe(initHoursToday);
    safe(initConsent);
    safe(initNoticeBanner);
    safe(initTerminForm);
    safe(initMapConsent);
    safe(initFaqExclusive);
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

  /* ---------- Scroll Reveal (mit Varianten: default, --left, --right, --scale) ---------- */
  function initReveal() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale');
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

  /* ---------- Hero Parallax (sehr subtil) ---------- */
  function initHeroParallax() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const hero = document.querySelector('.hero__inner');
    if (!hero) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY * 0.18, 60);
        hero.style.transform = 'translateY(' + y + 'px)';
        hero.style.opacity = String(Math.max(1 - window.scrollY / 600, 0.4));
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
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

  /* ---------- Termin-Formular ---------- */
  function initTerminForm() {
    const form = document.getElementById('terminForm');
    if (!form) return;
    const successCard = document.getElementById('terminSuccess');
    const errorEl     = document.getElementById('terminError');

    const setError = (msg) => {
      if (!errorEl) return;
      errorEl.textContent = msg || '';
      errorEl.hidden = !msg;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setError('');

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = {
        name: form.elements.name.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: (form.elements.email.value || '').trim(),
        request_type: form.elements.request_type.value,
        preferred_date: form.elements.preferred_date.value || null,
        preferred_time: form.elements.preferred_time.value || null,
        message: (form.elements.message.value || '').trim(),
        privacy_accepted: !!form.elements.privacy.checked
      };

      const submitBtn = form.querySelector('[type="submit"]');
      const origLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Wird gesendet&nbsp;…';

      try {
        if (window.dentalDb && window.dentalDb.isProd) {
          await window.dentalDb.addAppointmentRequest(data);
        } else {
          // Demo-Fallback: mailto öffnen, damit Anfrage trotzdem ankommt
          await new Promise((r) => setTimeout(r, 500));
          const subject = encodeURIComponent('Terminanfrage über die Website');
          const lines = [
            'Name: ' + data.name,
            'Telefon: ' + data.phone,
            data.email ? 'E-Mail: ' + data.email : null,
            'Anliegen: ' + data.request_type,
            data.preferred_date ? 'Wunschdatum: ' + data.preferred_date : null,
            data.preferred_time ? 'Wunschzeit: ' + data.preferred_time : null,
            data.message ? '\nNachricht:\n' + data.message : null
          ].filter(Boolean).join('\n');
          window.location.href = 'mailto:info@dentalharmonie.de?subject=' + subject + '&body=' + encodeURIComponent(lines);
        }

        form.hidden = true;
        if (successCard) {
          successCard.hidden = false;
          successCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (err) {
        setError((err && err.message) ? err.message : 'Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origLabel;
      }
    });
  }

  /* ---------- Scroll-Progress (oben, fein) ---------- */
  function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = 'scaleX(' + pct + ')';
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  /* ---------- Sticky Mobile-CTA ---------- */
  function initStickyCta() {
    const cta = document.querySelector('.sticky-cta');
    if (!cta) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const show = scrolled > 480 && scrolled < max - 240;
      cta.classList.toggle('is-visible', show);
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ---------- FAQ: nur ein <details> gleichzeitig offen ---------- */
  function initFaqExclusive() {
    const items = document.querySelectorAll('.faq .faq__item');
    if (!items.length) return;
    items.forEach((d) => {
      d.addEventListener('toggle', () => {
        if (d.open) {
          items.forEach((o) => { if (o !== d) o.open = false; });
        }
      });
    });
  }

  /* ---------- Map-Consent (Click-to-Load OSM) ---------- */
  function initMapConsent() {
    document.querySelectorAll('.map').forEach((map) => {
      const btn = map.querySelector('[data-load-map]');
      if (!btn) return;
      btn.addEventListener('click', () => {
        const iframe = map.querySelector('iframe');
        const src = map.getAttribute('data-src');
        if (iframe && src) {
          iframe.src = src;
          map.classList.add('is-loaded');
        }
      });
    });
  }
})();
