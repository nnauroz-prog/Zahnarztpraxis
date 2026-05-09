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
    sessionStorage.setItem(STORAGE_KEY, SESSION_FLAG);

    // Wenn Login von edit-gate kommt: zurück zur ursprünglichen Seite mit ?edit=1
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('next') === 'edit') {
        let from = params.get('from');
        if (from) {
          try { from = decodeURIComponent(from); } catch (e) {}
          if (/^\/[a-zA-Z0-9_\-./]*$/.test(from)) {
            const sep = from.includes('?') ? '&' : '?';
            window.location.replace(from + sep + 'edit=1');
            return;
          }
        }
      }
    } catch (e) {}

    loginEl.hidden = true;
    dashboardEl.hidden = false;
    document.title = 'Mitarbeiter · DentalHarmonie';
    if (inputEl) inputEl.value = '';
    if (errorEl) errorEl.hidden = true;
    if (logoutEl) logoutEl.hidden = false;
    const editBtn = document.getElementById('toggleEdit');
    if (editBtn) editBtn.hidden = false;
  }

  function lock() {
    sessionStorage.removeItem(STORAGE_KEY);
    loginEl.hidden = false;
    dashboardEl.hidden = true;
    if (logoutEl) logoutEl.hidden = true;
    const editBtn = document.getElementById('toggleEdit');
    if (editBtn) editBtn.hidden = true;
    document.body.classList.remove('editing');
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

  /* =========================================================
     Bearbeitungs-Modus (Edit-Mode)
     - localStorage pro Block (innerHTML)
     - Texte bearbeitbar via contenteditable
     - Zeilen hinzufügen / löschen
     - Export / Import als JSON, Reset auf Default
     ========================================================= */

  const STORAGE_PREFIX = 'dh_intern_data_';

  // Templates für neue Einträge (HTML-Strings)
  const TEMPLATES = {
    schichtRow: () => `
      <tr>
        <th contenteditable="true">Tag</th>
        <td><span class="shift-pill" contenteditable="true">08:30 – 18:30</span></td>
        <td><span class="shift-pill" contenteditable="true">09:00 – 17:00</span></td>
        <td><span class="shift-pill" contenteditable="true">08:00 – 18:30</span></td>
        <td><span class="shift-pill" contenteditable="true">08:30 – 18:30</span></td>
        <td class="col-actions"><button type="button" class="row-remove" aria-label="Zeile entfernen">×</button></td>
      </tr>`,
    contactRow: () => `
      <li>
        <strong contenteditable="true">Neuer Kontakt</strong>
        <span contenteditable="true">[Telefon / Bemerkung]</span>
        <button type="button" class="row-remove" aria-label="Eintrag entfernen">×</button>
      </li>`,
    datedRow: () => `
      <li>
        <span class="date" contenteditable="true">Datum</span>
        <span contenteditable="true">Inhalt eintragen.</span>
        <button type="button" class="row-remove" aria-label="Eintrag entfernen">×</button>
      </li>`,
  };

  function getEditBlocks() {
    return Array.from(document.querySelectorAll('[data-edit-block]'));
  }

  function makeBlockEditable(block, on) {
    const tag = block.tagName.toLowerCase();
    if (tag === 'tbody' || tag === 'table') {
      const cells = block.querySelectorAll('th, td:not(.col-actions), .shift-pill');
      cells.forEach(c => {
        if (c.classList.contains('row-remove')) return;
        if (on) c.setAttribute('contenteditable', 'true');
        else c.removeAttribute('contenteditable');
      });
    } else if (tag === 'ul' || tag === 'ol') {
      const cells = block.querySelectorAll('li > strong, li > span, li > em');
      cells.forEach(c => {
        if (c.classList.contains('row-remove')) return;
        if (on) c.setAttribute('contenteditable', 'true');
        else c.removeAttribute('contenteditable');
      });
    } else {
      // einfacher Text-Block (z.B. Hinweis-Banner)
      if (on) block.setAttribute('contenteditable', 'plaintext-only');
      else block.removeAttribute('contenteditable');
    }
  }

  function saveBlock(block) {
    const key = block.getAttribute('data-edit-block');
    if (!key) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + key, block.innerHTML);
      flashSaved();
    } catch (e) {
      console.warn('Speichern fehlgeschlagen:', e);
    }
  }

  function loadBlocks() {
    getEditBlocks().forEach(block => {
      const key = block.getAttribute('data-edit-block');
      const stored = localStorage.getItem(STORAGE_PREFIX + key);
      if (stored !== null) {
        block.innerHTML = stored;
      }
    });
  }

  // Save-Toast (klein unten rechts)
  let saveTimeout;
  const saveToast = document.createElement('div');
  saveToast.className = 'save-toast';
  saveToast.textContent = 'Gespeichert';
  saveToast.setAttribute('role', 'status');
  saveToast.setAttribute('aria-live', 'polite');
  document.body.appendChild(saveToast);

  function flashSaved() {
    saveToast.textContent = 'Gespeichert ✓';
    saveToast.classList.add('show');
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => saveToast.classList.remove('show'), 1400);

    const status = document.getElementById('saveStatus');
    if (status) {
      status.textContent = 'Gespeichert ✓';
      status.classList.remove('is-saving');
      status.classList.add('is-saved');
    }
  }

  function setEditMode(on) {
    document.body.classList.toggle('editing', on);
    getEditBlocks().forEach(block => makeBlockEditable(block, on));
    const toggle = document.getElementById('toggleEdit');
    if (toggle) toggle.textContent = on ? '✓ Fertig' : '✎ Bearbeiten';
    const status = document.getElementById('saveStatus');
    if (status && on) status.textContent = 'Bereit';
  }

  // Initial laden
  loadBlocks();

  // Listen auf alle Edits + Add/Remove via Delegation
  getEditBlocks().forEach(block => {
    block.addEventListener('input', () => saveBlock(block));
  });

  document.addEventListener('click', (e) => {
    // Remove-Button
    if (e.target.matches('.row-remove')) {
      const row = e.target.closest('tr, li');
      const block = row && row.closest('[data-edit-block]');
      if (row && block) {
        row.remove();
        saveBlock(block);
      }
      return;
    }
    // Add-Button
    if (e.target.matches('.row-add')) {
      const blockKey = e.target.getAttribute('data-add-target');
      const tplKey = e.target.getAttribute('data-add-template');
      const block = document.querySelector(`[data-edit-block="${blockKey}"]`);
      const tpl = TEMPLATES[tplKey];
      if (!block || !tpl) return;
      block.insertAdjacentHTML('beforeend', tpl());
      // Re-apply contenteditable wenn editing aktiv
      if (document.body.classList.contains('editing')) {
        makeBlockEditable(block, true);
      }
      saveBlock(block);
      // Fokus auf erstes editierbares Feld der neuen Zeile
      const newRow = block.lastElementChild;
      const firstEditable = newRow && newRow.querySelector('[contenteditable]');
      if (firstEditable) firstEditable.focus();
      return;
    }
  });

  // Edit-Mode Toggle (Header + Toolbar)
  const toggleBtn = document.getElementById('toggleEdit');
  const finishBtn = document.getElementById('finishEdit');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      setEditMode(!document.body.classList.contains('editing'));
    });
  }
  if (finishBtn) {
    finishBtn.addEventListener('click', () => setEditMode(false));
  }

  // Export
  const exportBtn = document.getElementById('exportData');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const data = {};
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(STORAGE_PREFIX)) {
          data[k.slice(STORAGE_PREFIX.length)] = localStorage.getItem(k);
        }
      });
      const exportObj = {
        exportedAt: new Date().toISOString(),
        version: 1,
        data: data,
      };
      const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dentalharmonie-intern-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Import
  const importInput = document.getElementById('importData');
  if (importInput) {
    importInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const json = JSON.parse(ev.target.result);
          const blob = json.data || json; // unterstütze beide Formate
          if (typeof blob !== 'object') throw new Error('Ungültiges Format');
          if (!confirm('Aktuelle Bearbeitungen werden überschrieben. Fortfahren?')) {
            importInput.value = '';
            return;
          }
          // Alle bestehenden dh_intern_data_-Keys löschen
          Object.keys(localStorage).forEach(k => {
            if (k.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k);
          });
          // Neue eintragen
          Object.keys(blob).forEach(k => {
            const fullKey = k.startsWith(STORAGE_PREFIX) ? k : STORAGE_PREFIX + k;
            localStorage.setItem(fullKey, blob[k]);
          });
          alert('Import erfolgreich. Seite wird neu geladen.');
          location.reload();
        } catch (err) {
          alert('Import fehlgeschlagen: ' + err.message);
        } finally {
          importInput.value = '';
        }
      };
      reader.readAsText(file);
    });
  }

  // Reset
  const resetBtn = document.getElementById('resetData');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (!confirm('Alle Bearbeitungen löschen und Standardinhalte wiederherstellen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(STORAGE_PREFIX)) localStorage.removeItem(k);
      });
      location.reload();
    });
  }

  // Print
  const printBtn = document.getElementById('printData');
  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  // PDF-Stub-Links
  document.querySelectorAll('[data-pdf-stub]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      alert('PDF wird noch hinterlegt.');
    });
  });
})();
