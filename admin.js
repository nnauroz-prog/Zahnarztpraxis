(() => {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const STATUS_LABELS = {
    new: 'Neu',
    in_progress: 'In Bearbeitung',
    done: 'Erledigt',
    archived: 'Archiviert'
  };

  const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initPwToggle();
    initLogin();
    initForgot();
    bootSession();
  }

  function setStatus(el, msg, kind) {
    if (!el) return;
    el.textContent = msg || '';
    el.dataset.kind = kind || '';
    el.hidden = !msg;
  }

  function initPwToggle() {
    const btn = $('.pw-toggle');
    const input = $('#adminPassword');
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(isPw));
      btn.textContent = isPw ? 'verbergen' : 'anzeigen';
    });
  }

  function initLogin() {
    const form = $('#adminLoginForm');
    if (!form) return;
    const status = $('#adminStatus');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus(status, '');
      const email = (form.email.value || '').trim();
      const password = form.password.value || '';
      if (!email || !password) { setStatus(status, 'Bitte E-Mail und Passwort eingeben.', 'error'); return; }
      if (!window.dentalDb) { setStatus(status, 'Datenmodul nicht geladen.', 'error'); return; }
      if (!window.dentalDb.isProd) {
        setStatus(status, 'Supabase ist nicht konfiguriert (Demo-Mode). Bitte URL und Anon-Key in config.js eintragen.', 'error');
        return;
      }
      const submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      const orig = submit.innerHTML;
      submit.innerHTML = 'Anmeldung …';
      try {
        await window.dentalDb.auth.signIn(email, password);
        showDashboard();
      } catch (err) {
        setStatus(status, (err && err.message) ? err.message : 'Anmeldung fehlgeschlagen.', 'error');
      } finally {
        submit.disabled = false;
        submit.innerHTML = orig;
      }
    });
  }

  function initForgot() {
    const btn = $('#adminForgot');
    if (!btn) return;
    const status = $('#adminStatus');
    btn.addEventListener('click', async () => {
      const email = (($('#adminEmail') || {}).value || '').trim();
      if (!email) { setStatus(status, 'Bitte zuerst die E-Mail oben eintragen.', 'error'); return; }
      if (!window.dentalDb || !window.dentalDb.isProd) {
        setStatus(status, 'Supabase nicht konfiguriert.', 'error'); return;
      }
      try {
        await window.dentalDb.auth.resetPassword(email);
        setStatus(status, 'Wir haben einen Link an ' + email + ' geschickt.', '');
      } catch (err) {
        setStatus(status, (err && err.message) || 'Fehler beim Senden.', 'error');
      }
    });
  }

  async function bootSession() {
    if (!window.dentalDb || !window.dentalDb.isProd) return;
    try {
      const authed = await window.dentalDb.auth.isAuthed();
      if (authed) showDashboard();
    } catch (e) {}
  }

  /* ============================================================
     DASHBOARD
     ============================================================ */
  let dashState = {
    requests: [],
    statusFilter: '',
    realtimeStop: null
  };

  async function showDashboard() {
    $('#adminLoginView').hidden = true;
    const dash = $('#adminDashView');
    if (!dash) return;
    dash.hidden = false;

    try {
      const email = await window.dentalDb.auth.getEmail();
      $('#dashUser').textContent = email || 'Angemeldet';
    } catch (e) {}

    initDashTabs();
    initLogout();
    initBannerForm();
    initHoursForm();
    initContactForm();
    initUploadForm();
    initRequests();
    initRealtime();
  }

  function initDashTabs() {
    $$('.dash__tab').forEach((btn) => {
      btn.addEventListener('click', () => switchPanel(btn.dataset.panel));
    });
    $$('[data-goto]').forEach((el) => {
      el.addEventListener('click', () => switchPanel(el.dataset.goto));
    });
  }

  function switchPanel(name) {
    $$('.dash__tab').forEach((b) => b.classList.toggle('is-active', b.dataset.panel === name));
    $$('.dash__panel').forEach((p) => {
      const on = p.dataset.panel === name;
      p.classList.toggle('is-active', on);
      p.hidden = !on;
    });
    if (name === 'banner')  loadBanner();
    if (name === 'hours')   loadHours();
    if (name === 'contact') loadContact();
    if (name === 'requests') refreshRequests();
  }

  function initLogout() {
    const btn = $('#adminLogout');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      if (dashState.realtimeStop) { try { dashState.realtimeStop(); } catch (e) {} dashState.realtimeStop = null; }
      try { await window.dentalDb.auth.signOut(); } catch (e) {}
      location.reload();
    });
  }

  /* ============================================================
     Banner
     ============================================================ */
  async function loadBanner() {
    try {
      const data = await window.dentalDb.get('notice-banner') || { enabled: false, text: '' };
      $('#bannerEnabled').checked = !!data.enabled;
      $('#bannerText').value = data.text || '';
      $('#statBanner').textContent = data.enabled ? 'aktiv' : 'aus';
    } catch (e) { console.error(e); }
  }
  function initBannerForm() {
    const form = $('#bannerForm');
    if (!form) return;
    const status = $('#bannerStatus');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus(status, '');
      try {
        await window.dentalDb.set('notice-banner', {
          enabled: $('#bannerEnabled').checked,
          text: $('#bannerText').value.trim()
        });
        setStatus(status, 'Gespeichert.', '');
        $('#statBanner').textContent = $('#bannerEnabled').checked ? 'aktiv' : 'aus';
      } catch (err) {
        setStatus(status, (err && err.message) || 'Speichern fehlgeschlagen.', 'error');
      }
    });
  }

  /* ============================================================
     Sprechzeiten
     ============================================================ */
  function renderHoursRows(rows) {
    const wrap = $('#hoursRows');
    wrap.innerHTML = '';
    rows.forEach((r, i) => {
      const row = document.createElement('div');
      row.className = 'hours-row';
      row.innerHTML =
        '<span class="hours-row__day">' + (r.day || '') + '</span>' +
        '<input type="time" data-i="' + i + '" data-k="open"  value="' + (r.open || '') + '">' +
        '<span class="hours-row__sep">–</span>' +
        '<input type="time" data-i="' + i + '" data-k="close" value="' + (r.close || '') + '">';
      wrap.appendChild(row);
    });
  }
  async function loadHours() {
    try {
      let data = await window.dentalDb.get('opening-hours');
      if (!Array.isArray(data) || !data.length) {
        data = (window.dentalConfig && window.dentalConfig.PRACTICE && window.dentalConfig.PRACTICE.hours) || [];
      }
      // Sicherstellen: 7 Tage, beginnend Montag
      const order = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
      const map = {};
      data.forEach((r) => { if (r && r.day) map[r.day] = r; });
      const rows = order.map((d) => map[d] || { day: d, open: null, close: null });
      renderHoursRows(rows);
      $('#statHours').textContent = String(rows.filter((r) => r.open && r.close).length);
    } catch (e) { console.error(e); }
  }
  function initHoursForm() {
    const form = $('#hoursForm');
    if (!form) return;
    const status = $('#hoursStatus');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus(status, '');
      const rows = $$('.hours-row', $('#hoursRows')).map((row) => {
        const day = row.querySelector('.hours-row__day').textContent.trim();
        const open  = row.querySelector('[data-k="open"]').value  || null;
        const close = row.querySelector('[data-k="close"]').value || null;
        return { day, open, close };
      });
      try {
        await window.dentalDb.set('opening-hours', rows);
        setStatus(status, 'Gespeichert.', '');
        $('#statHours').textContent = String(rows.filter((r) => r.open && r.close).length);
      } catch (err) {
        setStatus(status, (err && err.message) || 'Speichern fehlgeschlagen.', 'error');
      }
    });
  }

  /* ============================================================
     Kontakt
     ============================================================ */
  async function loadContact() {
    try {
      let data = await window.dentalDb.get('contact');
      if (!data || !Object.keys(data).length) {
        data = (window.dentalConfig && window.dentalConfig.PRACTICE) || {};
      }
      ['name','owner','street','city','phone','email'].forEach((k) => {
        const el = $('#c' + k.charAt(0).toUpperCase() + k.slice(1));
        if (el) el.value = data[k] || '';
      });
    } catch (e) { console.error(e); }
  }
  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;
    const status = $('#contactStatus');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus(status, '');
      const data = {};
      ['name','owner','street','city','phone','email'].forEach((k) => {
        const el = $('#c' + k.charAt(0).toUpperCase() + k.slice(1));
        if (el) data[k] = (el.value || '').trim();
      });
      try {
        await window.dentalDb.set('contact', data);
        setStatus(status, 'Gespeichert.', '');
      } catch (err) {
        setStatus(status, (err && err.message) || 'Speichern fehlgeschlagen.', 'error');
      }
    });
  }

  /* ============================================================
     Bild-Upload
     ============================================================ */
  function initUploadForm() {
    const form = $('#uploadForm');
    if (!form) return;
    const status = $('#uploadStatus');
    const result = $('#uploadResult');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus(status, '');
      result.hidden = true;
      const file = $('#uploadFile').files[0];
      const slot = $('#uploadSlot').value.trim();
      if (!file) { setStatus(status, 'Bitte eine Datei auswählen.', 'error'); return; }
      const submit = form.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        const { url, path } = await window.dentalDb.uploadImage(file, slot || null);
        setStatus(status, 'Hochgeladen.', '');
        result.hidden = false;
        result.innerHTML =
          '<p class="muted" style="font-size:.85rem; margin:0 0 .4rem;">Pfad: <code>' + path + '</code></p>' +
          '<p style="margin:0;"><a href="' + url + '" target="_blank" rel="noopener" style="color: var(--ink); border-bottom:1px solid var(--gold); padding-bottom:1px;">URL öffnen</a></p>' +
          '<img src="' + url + '" alt="" style="margin-top:.8rem; max-width:280px; border-radius: var(--r-2);">';
        form.reset();
      } catch (err) {
        setStatus(status, (err && err.message) || 'Upload fehlgeschlagen.', 'error');
      } finally {
        submit.disabled = false;
      }
    });
  }

  /* ============================================================
     Termin-Anfragen
     ============================================================ */
  function initRequests() {
    const filter = $('#filterStatus');
    const refresh = $('#refreshRequests');
    if (filter) filter.addEventListener('change', () => { dashState.statusFilter = filter.value; refreshRequests(); });
    if (refresh) refresh.addEventListener('click', refreshRequests);
    refreshRequests();
  }

  async function refreshRequests() {
    const list = $('#requestsList');
    if (!list) return;
    list.innerHTML = '<p class="muted">Wird geladen …</p>';
    try {
      const opts = {};
      if (dashState.statusFilter) opts.status = dashState.statusFilter;
      const rows = await window.dentalDb.listAppointmentRequests(opts);
      dashState.requests = rows;
      renderRequests(rows);
      updateNewBadge(rows);
    } catch (err) {
      list.innerHTML = '<p class="dash__err">' + ((err && err.message) || 'Anfragen konnten nicht geladen werden.') + '</p>';
    }
  }

  function updateNewBadge(rows) {
    const newCount = rows.filter((r) => r.status === 'new').length;
    const badge = $('#badgeNew');
    if (badge) { badge.textContent = String(newCount); badge.hidden = newCount === 0; }
    const stat = $('#statNew');
    if (stat) stat.textContent = String(newCount);
  }

  function renderRequests(rows) {
    const list = $('#requestsList');
    if (!rows.length) {
      list.innerHTML = '<p class="muted">Keine Anfragen.</p>';
      return;
    }
    list.innerHTML = '';
    rows.forEach((r) => {
      const el = document.createElement('article');
      el.className = 'req';
      el.dataset.id = r.id;
      el.dataset.status = r.status;
      const dt = r.received_at ? new Date(r.received_at) : null;
      const dtStr = dt ? dt.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
      el.innerHTML =
        '<header class="req__head">' +
          '<span class="req__status req__status--' + r.status + '">' + (STATUS_LABELS[r.status] || r.status) + '</span>' +
          '<time>' + dtStr + '</time>' +
        '</header>' +
        '<h3 class="req__name">' + escapeHtml(r.name) + '</h3>' +
        '<dl class="req__data">' +
          '<dt>Telefon</dt><dd><a href="tel:' + cleanTel(r.phone) + '">' + escapeHtml(r.phone) + '</a></dd>' +
          (r.email ? '<dt>E-Mail</dt><dd><a href="mailto:' + escapeHtml(r.email) + '">' + escapeHtml(r.email) + '</a></dd>' : '') +
          '<dt>Anliegen</dt><dd>' + escapeHtml(r.request_type) + '</dd>' +
          (r.preferred_date ? '<dt>Wunschdatum</dt><dd>' + escapeHtml(r.preferred_date) + '</dd>' : '') +
          (r.preferred_time ? '<dt>Wunschzeit</dt><dd>' + escapeHtml(r.preferred_time) + '</dd>' : '') +
          (r.message ? '<dt>Nachricht</dt><dd>' + escapeHtml(r.message) + '</dd>' : '') +
        '</dl>' +
        '<div class="req__actions">' +
          '<select data-action="status" data-id="' + r.id + '">' +
            Object.keys(STATUS_LABELS).map((k) =>
              '<option value="' + k + '"' + (k === r.status ? ' selected' : '') + '>' + STATUS_LABELS[k] + '</option>'
            ).join('') +
          '</select>' +
          '<button class="btn btn--ghost" data-action="delete" data-id="' + r.id + '" type="button">Löschen</button>' +
        '</div>';
      list.appendChild(el);
    });
    list.querySelectorAll('[data-action="status"]').forEach((sel) => {
      sel.addEventListener('change', async () => {
        try {
          await window.dentalDb.updateAppointmentRequestStatus(sel.dataset.id, sel.value);
        } catch (err) { alert((err && err.message) || 'Fehler beim Aktualisieren.'); }
      });
    });
    list.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Diese Anfrage wirklich löschen?')) return;
        try {
          await window.dentalDb.deleteAppointmentRequest(btn.dataset.id);
        } catch (err) { alert((err && err.message) || 'Fehler beim Löschen.'); }
      });
    });
  }

  function initRealtime() {
    if (dashState.realtimeStop) return;
    dashState.realtimeStop = window.dentalDb.subscribe((evt) => {
      if (evt.table === 'appointment_requests') refreshRequests();
    });
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }
  function cleanTel(s) { return String(s || '').replace(/[^\d+]/g, ''); }
})();
