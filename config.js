(() => {
  'use strict';
  window.dentalConfig = {
    SUPABASE_URL: 'PASTE_HERE',
    SUPABASE_ANON_KEY: 'PASTE_HERE',
    CACHE_VERSION: '2026-01-01-r1',
    PRACTICE: {
      name: 'DentalHarmonie',
      owner: 'Dr. Delaram Mostafaei',
      street: 'Ifflandstraße 75',
      city: '22087 Hamburg-Hohenfelde',
      phone: '+49 40 221528',
      phoneHref: 'tel:+494022 1528',
      fax: '+49 40 22698898',
      email: 'info@dentalharmonie.de',
      doctolib: 'https://www.doctolib.de/zahnmedizin/hamburg/delaram-mostafaei',
      hours: [
        { day: 'Montag',     open: '08:00', close: '18:00' },
        { day: 'Dienstag',   open: '08:00', close: '18:00' },
        { day: 'Mittwoch',   open: '08:00', close: '13:00' },
        { day: 'Donnerstag', open: '08:00', close: '18:00' },
        { day: 'Freitag',    open: '08:00', close: '13:00' },
        { day: 'Samstag',    open: null,    close: null },
        { day: 'Sonntag',    open: null,    close: null }
      ]
    }
  };
})();
