(() => {
  'use strict';

  const cfg = window.dentalConfig || {};
  const isPlaceholder = !cfg.SUPABASE_URL || cfg.SUPABASE_URL === 'PASTE_HERE';
  const isProd = !isPlaceholder;

  const DEMO_REJECT = (action) =>
    Promise.reject(new Error('Supabase nicht konfiguriert (' + action + '). Bitte SUPABASE_URL und SUPABASE_ANON_KEY in config.js setzen.'));

  const defaults = {
    'notice-banner': { text: '', enabled: false },
    'hero-home': {
      eyebrow: '01 · Praxis',
      title: 'Ruhige Zahnmedizin. Klar erklärt.',
      lead:  'Zahnarztpraxis DentalHarmonie in Hamburg-Hohenfelde — Behandlung in einer Atmosphäre, die zur Ruhe kommt.'
    },
    'opening-hours': cfg.PRACTICE && cfg.PRACTICE.hours ? cfg.PRACTICE.hours : [],
    'contact': cfg.PRACTICE || {}
  };

  function get(key) {
    return Promise.resolve(defaults[key] != null ? defaults[key] : null);
  }

  function set(key)      { return DEMO_REJECT('set ' + key); }
  function remove(key)   { return DEMO_REJECT('remove ' + key); }
  function uploadImage() { return DEMO_REJECT('uploadImage'); }
  function subscribe()   { return () => {}; }

  function ready() {
    if (!isProd) {
      if (!ready._warned) {
        console.warn('[dentalDb] Supabase nicht konfiguriert – Demo-Mode aktiv. Lesezugriffe liefern Defaults, Schreibzugriffe lehnen ab.');
        ready._warned = true;
      }
      return Promise.resolve(false);
    }
    return Promise.resolve(true);
  }

  const auth = {
    signIn()          { return DEMO_REJECT('signIn'); },
    signOut()         { return Promise.resolve(); },
    isAuthed()        { return Promise.resolve(false); },
    getEmail()        { return Promise.resolve(null); },
    resetPassword()   { return DEMO_REJECT('resetPassword'); },
    updatePassword()  { return DEMO_REJECT('updatePassword'); },
    inviteUser()      { return DEMO_REJECT('inviteUser'); }
  };

  function addAppointmentRequest()           { return DEMO_REJECT('addAppointmentRequest'); }
  function listAppointmentRequests()         { return Promise.resolve([]); }
  function updateAppointmentRequestStatus()  { return DEMO_REJECT('updateAppointmentRequestStatus'); }
  function deleteAppointmentRequest()        { return DEMO_REJECT('deleteAppointmentRequest'); }

  window.dentalDb = {
    isProd,
    ready,
    get, set, remove,
    uploadImage,
    subscribe,
    auth,
    addAppointmentRequest,
    listAppointmentRequests,
    updateAppointmentRequestStatus,
    deleteAppointmentRequest
  };
})();
