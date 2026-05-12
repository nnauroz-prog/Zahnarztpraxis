(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initPasswordToggle();
    initLoginForm();
  }

  function initPasswordToggle() {
    const btn = document.querySelector('.pw-toggle');
    const input = document.getElementById('adminPassword');
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(isPw));
      btn.classList.toggle('pw-eye-on', isPw);
      btn.classList.toggle('pw-eye-off', !isPw);
    });
  }

  function initLoginForm() {
    const form = document.getElementById('adminLoginForm');
    if (!form) return;
    const status = document.getElementById('adminStatus');
    const setStatus = (msg, kind) => {
      if (!status) return;
      status.textContent = msg || '';
      status.dataset.kind = kind || '';
      status.hidden = !msg;
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      setStatus('');
      const email = (form.email && form.email.value || '').trim();
      const password = (form.password && form.password.value || '');
      if (!email || !password) {
        setStatus('Bitte E-Mail und Passwort eingeben.', 'error');
        return;
      }
      if (!window.dentalDb) {
        setStatus('Datenmodul nicht geladen.', 'error');
        return;
      }
      try {
        await window.dentalDb.auth.signIn(email, password);
        location.reload();
      } catch (err) {
        setStatus(err && err.message ? err.message : 'Anmeldung fehlgeschlagen.', 'error');
      }
    });
  }
})();
