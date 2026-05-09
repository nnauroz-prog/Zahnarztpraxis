(() => {
  'use strict';

  // SHA-256 Hash des aktuellen Praxis-Passworts.
  // Standard: "harmonie2026" — bitte regelmäßig wechseln.
  // Neuen Hash erzeugen:
  //   echo -n "neuesPasswort" | shasum -a 256
  // Oder im Browser-Devtool:
  //   (await crypto.subtle.digest('SHA-256', new TextEncoder().encode('neuesPasswort')))
  const PW_HASH = '7c38efd0657f4f3d8cf526a6791e67cd07c2ac9289eef5023d210fe0ccb95f52';

  const STORAGE_KEY = 'dh_intern_unlocked';
  const SESSION_FLAG = 'unlocked';

  const loginEl    = document.getElementById('internLogin');
  const dashboardEl = document.getElementById('internDashboard');
  const formEl     = document.getElementById('internForm');
  const inputEl    = document.getElementById('internPw');
  const errorEl    = document.getElementById('internError');
  const logoutEl   = document.getElementById('internLogout');

  if (!loginEl || !dashboardEl || !formEl) return;

  async function sha256(text) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  function unlock() {
    loginEl.hidden = true;
    dashboardEl.hidden = false;
    sessionStorage.setItem(STORAGE_KEY, SESSION_FLAG);
    document.title = 'Mitarbeiter · DentalHarmonie';
    if (inputEl) inputEl.value = '';
    if (errorEl) errorEl.hidden = true;
    if (logoutEl) logoutEl.hidden = false;
  }

  function lock() {
    sessionStorage.removeItem(STORAGE_KEY);
    loginEl.hidden = false;
    dashboardEl.hidden = true;
    if (logoutEl) logoutEl.hidden = true;
    if (inputEl) inputEl.focus();
  }

  // Beim Laden prüfen, ob in dieser Session bereits entsperrt
  if (sessionStorage.getItem(STORAGE_KEY) === SESSION_FLAG) {
    unlock();
  } else if (inputEl) {
    inputEl.focus();
  }

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!inputEl) return;
    const pw = inputEl.value.trim();
    if (!pw) return;
    try {
      const hash = await sha256(pw);
      if (hash === PW_HASH) {
        unlock();
      } else {
        if (errorEl) {
          errorEl.hidden = false;
          errorEl.textContent = 'Passwort nicht korrekt.';
        }
        inputEl.select();
      }
    } catch (err) {
      if (errorEl) {
        errorEl.hidden = false;
        errorEl.textContent = 'Browser unterstützt SubtleCrypto nicht – bitte aktuelle Version verwenden.';
      }
    }
  });

  if (logoutEl) {
    logoutEl.addEventListener('click', (e) => {
      e.preventDefault();
      lock();
    });
  }

  // Aktuelle Kalenderwoche im Dienstplan-Header
  const kwEl = document.getElementById('currentKw');
  if (kwEl) {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - start) / 86400000);
    const week = Math.ceil((days + start.getDay() + 1) / 7);
    kwEl.textContent = 'KW ' + week + ' · ' + now.getFullYear();
  }
})();
