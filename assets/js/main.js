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

  // Map-Consent (Klick-zu-Laden für OpenStreetMap)
  document.querySelectorAll('.map-embed .map-consent').forEach(btn => {
    btn.addEventListener('click', () => {
      const wrap = btn.closest('.map-embed');
      if (!wrap) return;
      const iframe = wrap.querySelector('iframe');
      const src = wrap.dataset.osmSrc;
      if (iframe && src) {
        iframe.src = src;
        wrap.classList.add('is-loaded');
      }
    });
  });

  // PDF-Stub-Links (vorerst Hinweis, bis echte PDFs vorhanden sind)
  document.querySelectorAll('[data-pdf-stub]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('PDF wird noch hinterlegt.');
    });
  });

  /* =========================================================
     Hinweis-Banner (Praxis-Status, ganz oben)
     ========================================================= */
  const BANNER_KEY = 'dh_intern_data_banner';
  const BANNER_DISMISS_KEY = 'dh_banner_dismissed_v';
  function renderNoticeBanner() {
    const raw = localStorage.getItem(BANNER_KEY) || '';
    // HTML-Reste (z.B. <br>) zu Plaintext konvertieren
    const tmp = document.createElement('div');
    tmp.innerHTML = raw;
    const text = (tmp.textContent || '').trim();
    if (!text) return;
    const dismissedFor = sessionStorage.getItem(BANNER_DISMISS_KEY);
    if (dismissedFor === text) return; // gleiche Nachricht bereits weggeklickt
    const banner = document.createElement('div');
    banner.className = 'notice-banner';
    banner.setAttribute('role', 'status');
    banner.innerHTML = `
      <div class="container">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16.5" r="1" fill="currentColor"/></svg>
        <span class="notice-banner-text"></span>
        <button type="button" class="notice-banner-close" aria-label="Hinweis schließen">×</button>
      </div>`;
    banner.querySelector('.notice-banner-text').textContent = text;
    banner.querySelector('.notice-banner-close').addEventListener('click', () => {
      sessionStorage.setItem(BANNER_DISMISS_KEY, text);
      banner.remove();
    });
    document.body.insertBefore(banner, document.body.firstChild);
  }
  renderNoticeBanner();

  /* =========================================================
     Cookie-Consent-Banner
     ========================================================= */
  const CONSENT_KEY = 'dh_consent';
  function loadGoogleFontsRuntime() {
    if (document.querySelector('link[data-gf]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,500&display=swap';
    link.setAttribute('data-gf', '1');
    document.head.appendChild(link);
  }
  function showConsentBanner() {
    if (document.querySelector('.consent-banner')) {
      document.querySelector('.consent-banner').classList.add('visible');
      return;
    }
    const el = document.createElement('aside');
    el.className = 'consent-banner';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-labelledby', 'consentTitle');
    el.innerHTML = `
      <div class="consent-grid">
        <div>
          <h3 id="consentTitle">Datenschutz &amp; Komfort</h3>
          <p>
            Wir laden Schriftarten von Google Fonts, damit die Seite einheitlich erscheint.
            Dabei wird Ihre IP-Adresse an Google übertragen. Mit „Nur notwendige" verwenden wir nur lokale System-Schriften. Mehr in den <a href="datenschutz.html">Datenschutzhinweisen</a>.
          </p>
        </div>
        <div class="consent-actions">
          <button type="button" class="consent-accept">Alle akzeptieren</button>
          <button type="button" class="consent-essential">Nur notwendige</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('visible'));

    el.querySelector('.consent-accept').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'all');
      loadGoogleFontsRuntime();
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 300);
    });
    el.querySelector('.consent-essential').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'necessary');
      el.classList.remove('visible');
      setTimeout(() => el.remove(), 300);
    });
  }

  // Banner zeigen, wenn noch keine Wahl getroffen
  if (!localStorage.getItem(CONSENT_KEY)) {
    // kurz verzögern, damit Hauptinhalt zuerst erscheint
    setTimeout(showConsentBanner, 700);
  }

  // "Cookies anpassen"-Link im Footer (data-consent-reopen)
  document.querySelectorAll('[data-consent-reopen]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      // bestehende Wahl löschen, Banner erneut anzeigen
      localStorage.removeItem(CONSENT_KEY);
      showConsentBanner();
    });
  });

  /* =========================================================
     Inline-Edit-Mode auf öffentlichen Seiten (?edit=1)
     ========================================================= */
  const params = new URLSearchParams(window.location.search);
  const wantEdit = params.get('edit') === '1';
  const isUnlocked = sessionStorage.getItem('dh_intern_unlocked') === 'unlocked';

  if (wantEdit && isUnlocked) {
    initPublicEditMode();
  }

  function initPublicEditMode() {
    document.body.classList.add('editing-public');

    // Gespeicherte Texte aus localStorage laden
    document.querySelectorAll('[data-editable]').forEach(el => {
      const k = el.getAttribute('data-editable');
      const stored = localStorage.getItem('dh_inline_' + k);
      if (stored !== null) el.innerHTML = stored;
    });

    // Editier-FAB einfügen
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'edit-fab';
    fab.setAttribute('aria-haspopup', 'menu');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = `<span class="pulse-dot" aria-hidden="true"></span><span>Bearbeiten</span>`;
    document.body.appendChild(fab);

    const menu = document.createElement('div');
    menu.className = 'edit-fab-menu';
    menu.setAttribute('role', 'menu');
    menu.innerHTML = `
      <div class="edit-fab-status">Klicken Sie in einen Text zum Ändern. Speichert automatisch.</div>
      <button type="button" data-edit-action="reset">↺ Texte zurücksetzen</button>
      <button type="button" data-edit-action="finish">✓ Fertig</button>`;
    document.body.appendChild(menu);

    fab.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
      fab.setAttribute('aria-expanded', menu.classList.contains('open') ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== fab) menu.classList.remove('open');
    });

    // Editierbar machen + Auto-Save
    document.querySelectorAll('[data-editable]').forEach(el => {
      el.setAttribute('contenteditable', 'plaintext-only');
      el.addEventListener('input', () => {
        const k = el.getAttribute('data-editable');
        localStorage.setItem('dh_inline_' + k, el.innerHTML);
      });
      // Tab + Enter Verhalten: Enter sollte nicht <div> generieren in plaintext-only
    });

    // Aktionen
    menu.querySelector('[data-edit-action="reset"]').addEventListener('click', () => {
      if (!confirm('Alle Inline-Bearbeitungen auf dieser Seite verwerfen?')) return;
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith('dh_inline_')) localStorage.removeItem(k);
      });
      // URL ohne ?edit=1 neu laden
      const url = new URL(window.location);
      url.searchParams.delete('edit');
      window.location.replace(url.toString());
    });
    menu.querySelector('[data-edit-action="finish"]').addEventListener('click', () => {
      const url = new URL(window.location);
      url.searchParams.delete('edit');
      window.location.assign(url.toString());
    });
  }

  // Auf öffentlichen Seiten: gespeicherte Inline-Bearbeitungen IMMER anwenden,
  // nicht nur im Edit-Mode (sonst sehen Patient:innen alte Texte)
  if (!wantEdit) {
    document.querySelectorAll('[data-editable]').forEach(el => {
      const k = el.getAttribute('data-editable');
      const stored = localStorage.getItem('dh_inline_' + k);
      if (stored !== null) el.innerHTML = stored;
    });
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
