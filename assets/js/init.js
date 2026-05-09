/* Synchronous Init · DentalHarmonie
 * Lädt früh im <head> (vor DOMContentLoaded):
 *   - Cookie-Consent: lädt Google Fonts nur, wenn der Nutzer zugestimmt hat
 *   - Edit-Mode Auth-Gate: bei ?edit=1 wird ohne Login sofort umgeleitet
 */
(function () {
  'use strict';

  // ---------- Cookie-Consent · Google Fonts ----------
  try {
    var consent = localStorage.getItem('dh_consent');
    if (consent === 'all') {
      var pre1 = document.createElement('link');
      pre1.rel = 'preconnect';
      pre1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(pre1);

      var pre2 = document.createElement('link');
      pre2.rel = 'preconnect';
      pre2.href = 'https://fonts.gstatic.com';
      pre2.crossOrigin = 'anonymous';
      document.head.appendChild(pre2);

      var fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Fraunces:opsz,wght@9..144,400;9..144,500&display=swap';
      document.head.appendChild(fontLink);
    }
  } catch (e) { /* localStorage unavailable */ }

  // ---------- Edit-Mode Auth-Gate ----------
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('edit') === '1') {
      var unlocked = sessionStorage.getItem('dh_intern_unlocked') === 'unlocked';
      if (!unlocked) {
        // Zur Login-Seite umleiten, mit Rücksprung-Information
        var here = encodeURIComponent(window.location.pathname);
        window.location.replace('intern.html?next=edit&from=' + here);
      }
    }
  } catch (e) { /* SSR / no window */ }
})();
