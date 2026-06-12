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
    safe(initLiveStatus);
    safe(initConsent);
    safe(initNoticeBanner);
    safe(initTerminForm);
    safe(initMapConsent);
    safe(initFaqExclusive);
    safe(initShare);
    safe(initYear);
    safe(initMagneticButtons);
    safe(initPortraitParallax);
    safe(initStaggerLists);
    safe(initHeadlineWordReveal);
    safe(initPortraitTilt);
    safe(initChapterMarkDraw);
    safe(initPageTransition);
    safe(initHeaderAutoHide);
    safe(initButtonRipple);
    safe(initAnchorSmoothScroll);
    safe(initPortraitReveal);
    safe(initAnchorScrollSpy);
    safe(initTerminPrefill);
  }

  /* ---------- Sticky Header ---------- */
  function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Active Nav (+ aria-current) ---------- */
  function initActiveNav() {
    const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.header__nav a[href], .menu__list a[href]').forEach((a) => {
      const target = (a.getAttribute('href') || '').toLowerCase();
      if (target === here) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------- Web Share API (Teilen-Button) ---------- */
  function initShare() {
    const btn = document.querySelector('[data-share]');
    if (!btn) return;
    if (!navigator.share) {
      // Fallback: zur Kopie der URL
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(location.href);
          const orig = btn.textContent;
          btn.textContent = 'Link kopiert ✓';
          setTimeout(() => { btn.textContent = orig; }, 1800);
        } catch (e) {
          alert('Link konnte nicht kopiert werden.');
        }
      });
      return;
    }
    btn.addEventListener('click', async () => {
      try {
        await navigator.share({
          title: document.title,
          text: 'Zahnarztpraxis DentalHarmonie in Hamburg-Hohenfelde',
          url: location.href
        });
      } catch (e) {
        if (e.name !== 'AbortError') console.error(e);
      }
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
    const hero = document.querySelector('.hero__inner, .hero__cover-text');
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
          '<h3 id="consentTitle">Kurz zu Daten</h3>' +
          '<p>Diese Seite kommt ohne Tracking und ohne Werbe-Cookies aus. Schriften liegen lokal, gespeichert wird nur Technisch-Nötiges — zum Beispiel, dass Sie diesen Hinweis gesehen haben. Details in den <a href="datenschutz.html">Datenschutzhinweisen</a>.</p>' +
        '</div>' +
        '<div class="consent__actions">' +
          '<button type="button" class="btn btn--primary" data-consent="necessary">Alles klar</button>' +
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

  /* ---------- Live-Praxis-Status ("Jetzt geöffnet bis HH:MM") ---------- */
  function initLiveStatus() {
    const targets = document.querySelectorAll('[data-status]');
    if (!targets.length) return;
    const DAYS = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];
    const cfgHours = (window.dentalConfig && window.dentalConfig.PRACTICE && window.dentalConfig.PRACTICE.hours) || [];
    const dbReady = window.dentalDb && window.dentalDb.get ? window.dentalDb.get('opening-hours') : Promise.resolve(null);
    Promise.resolve(dbReady).then((live) => {
      let hours = Array.isArray(live) && live.length ? live : cfgHours;
      if (!Array.isArray(hours) || !hours.length) return;
      render(hours);
    }).catch(() => render(cfgHours));

    function render(hours) {
      const now = new Date();
      const today = hours.find((h) => h && h.day === DAYS[now.getDay()]);
      const nowMin = now.getHours() * 60 + now.getMinutes();
      let label = '';
      let mode  = 'closed';
      if (today && today.open && today.close) {
        const [oh, om] = today.open.split(':').map(Number);
        const [ch, cm] = today.close.split(':').map(Number);
        const openMin  = oh * 60 + om;
        const closeMin = ch * 60 + cm;
        if (nowMin >= openMin && nowMin < closeMin) {
          mode = 'open';
          label = 'Jetzt geöffnet bis ' + today.close;
        } else if (nowMin < openMin) {
          mode = 'soon';
          label = 'Heute ab ' + today.open + ' geöffnet';
        }
      }
      if (!label) {
        // Nächsten Öffnungstag finden
        for (let i = 1; i <= 7; i++) {
          const d = (now.getDay() + i) % 7;
          const candidate = hours.find((h) => h && h.day === DAYS[d]);
          if (candidate && candidate.open && candidate.close) {
            label = 'Aktuell geschlossen · ' + DAYS[d] + ' ab ' + candidate.open;
            break;
          }
        }
        if (!label) label = 'Aktuell geschlossen';
      }
      targets.forEach((el) => {
        el.textContent = label;
        el.setAttribute('data-status', mode);
      });
    }
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

  /* ---------- Magnetic Primary Buttons (Pointer only, kein Touch, kein Reduce-Motion) ---------- */
  function initMagneticButtons() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine   = window.matchMedia('(pointer: fine)').matches;
    if (reduce || !fine) return;
    const targets = document.querySelectorAll('.btn--primary, .header__cta');
    if (!targets.length) return;

    const STRENGTH = 6; // max Pixel-Pull in jede Richtung
    targets.forEach((btn) => {
      let raf = null;
      btn.style.willChange = 'transform';
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
        const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          btn.style.transform = 'translate(' + (dx * STRENGTH).toFixed(1) + 'px, ' + (dy * STRENGTH).toFixed(1) + 'px)';
        });
      });
      btn.addEventListener('pointerleave', () => {
        if (raf) cancelAnimationFrame(raf);
        btn.style.transform = '';
      });
    });
  }

  /* ---------- Hero-Portrait Counter-Parallax (subtil, max 24px) ---------- */
  function initPortraitParallax() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const img = document.querySelector('.hero__cover-media img');
    if (!img) return;
    img.style.willChange = 'transform';
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY * 0.08, 24);
        img.style.transform = 'translateY(' + (-y).toFixed(1) + 'px) scale(1.02)';
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Hero-Headline Word-by-Word Reveal ---------- */
  function initHeadlineWordReveal() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const h1 = document.querySelector('.hero--cover h1, .hero__inner h1');
    if (!h1) return;
    if (h1.dataset.split === '1') return;
    h1.dataset.split = '1';

    // Erkenne <br> als Zeilen-Trenner, em als Akzent-Wrapper
    const nodes = Array.from(h1.childNodes);
    let wordIndex = 0;
    const out = document.createDocumentFragment();
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach((w) => {
          if (/^\s+$/.test(w) || w === '') {
            out.appendChild(document.createTextNode(w));
          } else {
            const span = document.createElement('span');
            span.className = 'hwr';
            span.textContent = w;
            span.style.setProperty('--i', wordIndex++);
            out.appendChild(span);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
        out.appendChild(node.cloneNode());
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM') {
        const words = (node.textContent || '').split(/(\s+)/);
        const wrap = document.createElement('em');
        words.forEach((w) => {
          if (/^\s+$/.test(w) || w === '') {
            wrap.appendChild(document.createTextNode(w));
          } else {
            const span = document.createElement('span');
            span.className = 'hwr';
            span.textContent = w;
            span.style.setProperty('--i', wordIndex++);
            wrap.appendChild(span);
          }
        });
        out.appendChild(wrap);
      } else {
        out.appendChild(node.cloneNode(true));
      }
    });
    h1.innerHTML = '';
    h1.appendChild(out);

    requestAnimationFrame(() => h1.classList.add('hwr-in'));
  }

  /* ---------- 3D-Tilt fuer Hero-Portrait (sehr subtil, max 4 Grad) ---------- */
  function initPortraitTilt() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine   = window.matchMedia('(pointer: fine)').matches;
    if (reduce || !fine) return;
    const fig = document.querySelector('.hero__cover-media');
    if (!fig) return;

    const MAX_DEG = 4;
    let raf = null;
    fig.style.willChange = 'transform';
    fig.style.transformStyle = 'preserve-3d';
    fig.style.transition = 'transform .35s cubic-bezier(.2,.7,.2,1)';

    fig.addEventListener('pointermove', (e) => {
      const r = fig.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2;  // -1..1
      const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        fig.style.transform = 'perspective(900px) rotateY(' + (dx * MAX_DEG).toFixed(2) + 'deg) rotateX(' + (-dy * MAX_DEG).toFixed(2) + 'deg)';
      });
    });
    fig.addEventListener('pointerleave', () => {
      if (raf) cancelAnimationFrame(raf);
      fig.style.transform = '';
    });
  }

  /* ---------- Termin-Form Prefill aus ?anliegen=...-URL-Param ---------- */
  function initTerminPrefill() {
    const form = document.getElementById('terminForm');
    if (!form) return;
    const params = new URLSearchParams(window.location.search);
    const anliegen = params.get('anliegen');
    if (!anliegen) return;

    const select = document.getElementById('terminType');
    const msg    = document.getElementById('terminMsg');
    const nameInput = document.getElementById('terminName');

    // Versuche, im Dropdown einen Treffer zu finden (case-insensitive)
    if (select) {
      const wanted = anliegen.toLowerCase();
      let matched = false;
      Array.from(select.options).forEach((opt) => {
        if ((opt.value && opt.value.toLowerCase().includes(wanted)) ||
            opt.textContent.toLowerCase().includes(wanted)) {
          select.value = opt.value || opt.textContent;
          matched = true;
        }
      });
      // Kein Treffer → 'Anderes Anliegen' auswaehlen (falls vorhanden)
      if (!matched) {
        Array.from(select.options).forEach((opt) => {
          if (opt.textContent.toLowerCase().includes('anderes')) {
            select.value = opt.value || opt.textContent;
          }
        });
      }
    }

    // Nachrichten-Feld vorbefuellen
    if (msg && !msg.value) {
      msg.value = 'Mein Anliegen: ' + anliegen;
    }

    // Visuelle Bestaetigung oberhalb des Formulars
    const prefillNote = document.createElement('div');
    prefillNote.className = 'prefill-note';
    prefillNote.innerHTML =
      '<span class="prefill-note__icon" aria-hidden="true">✓</span>' +
      '<span><strong>Anliegen vorausgewählt:</strong> ' + escapeHtml(anliegen) + '</span>' +
      '<button type="button" class="prefill-note__close" aria-label="Hinweis schliessen">×</button>';
    form.parentNode.insertBefore(prefillNote, form);
    prefillNote.querySelector('.prefill-note__close').addEventListener('click', () => {
      prefillNote.style.opacity = '0';
      setTimeout(() => prefillNote.remove(), 300);
    });

    // Sanft zum Formular scrollen (mit Header-Offset)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      const header = document.getElementById('header');
      const headerH = header ? header.getBoundingClientRect().height : 68;
      const target = prefillNote.getBoundingClientRect().top + window.scrollY - headerH - 24;
      window.scrollTo({ top: target, behavior: reduce ? 'auto' : 'smooth' });
      // Name-Feld fokussieren — Patient kann direkt tippen
      if (nameInput) setTimeout(() => nameInput.focus({ preventScroll: true }), reduce ? 0 : 700);
    }, 250);

    // Kleine Hervorhebung am Anliegen-Select fuer 2.2s
    if (select) {
      select.style.transition = 'box-shadow .4s ease, border-color .4s ease';
      select.style.boxShadow = '0 0 0 4px rgba(63, 42, 74, .18)';
      select.style.borderColor = 'var(--accent)';
      setTimeout(() => {
        select.style.boxShadow = '';
        select.style.borderColor = '';
      }, 2200);
    }

    // URL aufraeumen: '?anliegen=...' raus, damit ein Refresh nicht erneut prefiled
    if (history.replaceState) {
      const cleanUrl = window.location.pathname;
      history.replaceState(null, '', cleanUrl);
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  /* ---------- Anchor Scroll-Spy (markiert aktive Sektion in der Anchor-List) ---------- */
  function initAnchorScrollSpy() {
    const list = document.querySelector('.anchor-list');
    if (!list || !('IntersectionObserver' in window)) return;
    const links = Array.from(list.querySelectorAll('a[href^="#"]'));
    const sections = links
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);
    if (!sections.length) return;

    const setActive = (id) => {
      links.forEach((a) => {
        a.classList.toggle('is-current', a.getAttribute('href') === '#' + id);
      });
    };

    const io = new IntersectionObserver((entries) => {
      // Sortiere nach Position, nimm das oberste sichtbare Element
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) setActive(visible[0].target.id);
    }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Portrait Clip-Path Reveal beim Load ---------- */
  function initPortraitReveal() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const fig = document.querySelector('.hero__cover-media');
    if (!fig) return;
    const img = fig.querySelector('img');
    const reveal = () => requestAnimationFrame(() => fig.classList.add('is-revealed'));
    if (img && !img.complete) {
      img.addEventListener('load', () => setTimeout(reveal, 80), { once: true });
      img.addEventListener('error', reveal, { once: true });
      setTimeout(reveal, 1200); // Fallback falls Load-Event nie kommt
    } else {
      setTimeout(reveal, 120);
    }
  }

  /* ---------- Header Auto-Hide on Scroll Down, Show on Scroll Up ---------- */
  function initHeaderAutoHide() {
    const header = document.getElementById('header');
    if (!header) return;
    let lastY = window.scrollY;
    let ticking = false;
    const THRESH = 8;
    const TOP_LIMIT = 80;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY;
        if (y < TOP_LIMIT) {
          header.classList.remove('is-hidden');
        } else if (Math.abs(delta) > THRESH) {
          if (delta > 0) header.classList.add('is-hidden');
          else header.classList.remove('is-hidden');
        }
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Button Klick-Welle (subtile Aubergine-Ripple auf Primary) ---------- */
  function initButtonRipple() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    document.querySelectorAll('.btn--primary, .header__cta').forEach((btn) => {
      btn.addEventListener('pointerdown', (e) => {
        const r = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(r.width, r.height) * 1.8;
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
        ripple.style.top  = (e.clientY - r.top  - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  /* ---------- Smooth Anchor Scroll mit Header-Offset ---------- */
  function initAnchorSmoothScroll() {
    const header = document.getElementById('header');
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      if (href === '#' || href.length < 2) return;
      a.addEventListener('click', (e) => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const headerH = header ? header.getBoundingClientRect().height : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
        if (history.pushState) history.pushState(null, '', href);
      });
    });
  }

  /* ---------- Page-Transition Fade (vor interner Navigation) ---------- */
  function initPageTransition() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    // Interne Links: vor Navigation kurz ausfaden
    document.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href') || '';
      const target = a.getAttribute('target') || '';
      const isHash = href.startsWith('#');
      const isMail = href.startsWith('mailto:');
      const isTel  = href.startsWith('tel:');
      const isJs   = href.startsWith('javascript:');
      const isAbs  = /^(https?:)?\/\//i.test(href);
      if (isHash || isMail || isTel || isJs || isAbs || target === '_blank' || a.hasAttribute('download')) return;
      a.addEventListener('click', (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        document.body.classList.add('pt-leaving');
        setTimeout(() => { window.location.href = a.href; }, 220);
      });
    });

    // Falls die Seite ueber Back-Button restauriert wird, Klasse entfernen
    window.addEventListener('pageshow', () => document.body.classList.remove('pt-leaving'));
  }

  /* ---------- Chapter-Mark Hairline draws in on enter ---------- */
  function initChapterMarkDraw() {
    if (!('IntersectionObserver' in window)) return;
    const marks = document.querySelectorAll('.chapter-mark');
    if (!marks.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-drawn');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.2 });
    marks.forEach((m) => io.observe(m));
  }

  /* ---------- Staggered Reveal fuer Listen-Items (Treatments + Hours + Anchor) ---------- */
  function initStaggerLists() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;

    const groups = document.querySelectorAll('.treatments__list, .hours-list, .anchor-list');
    if (!groups.length) return;

    groups.forEach((group) => {
      const items = group.querySelectorAll('li');
      items.forEach((li, i) => {
        li.style.opacity = '0';
        li.style.transform = 'translateY(8px)';
        li.style.transition = 'opacity .55s cubic-bezier(.2,.7,.2,1) ' + (i * 50) + 'ms, transform .55s cubic-bezier(.2,.7,.2,1) ' + (i * 50) + 'ms';
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('li').forEach((li) => {
          li.style.opacity = '1';
          li.style.transform = '';
        });
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    groups.forEach((group) => io.observe(group));

    // Fallback nach 3s: alles sichtbar
    setTimeout(() => {
      groups.forEach((group) => {
        group.querySelectorAll('li').forEach((li) => {
          li.style.opacity = '1';
          li.style.transform = '';
        });
      });
    }, 3000);
  }
})();
