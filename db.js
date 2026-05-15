(() => {
  'use strict';

  const cfg = window.dentalConfig || {};
  const isPlaceholder = !cfg.SUPABASE_URL || cfg.SUPABASE_URL === 'PASTE_HERE';
  const isProd = !isPlaceholder;

  const SUPABASE_CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';

  /* ============================================================
     Defaults (für Demo-Mode und als Fallback bei leerem Content)
     ============================================================ */
  const defaults = {
    'notice-banner': { text: '', enabled: false },
    'hero-home': null,
    'opening-hours': (cfg.PRACTICE && cfg.PRACTICE.hours) || [],
    'contact': cfg.PRACTICE || {}
  };

  /* ============================================================
     Supabase-Client (lazy load aus CDN, gecached auf window._supa)
     ============================================================ */
  let clientPromise = null;
  function loadSupabaseScript() {
    return new Promise((resolve, reject) => {
      if (window.supabase && typeof window.supabase.createClient === 'function') return resolve();
      const s = document.createElement('script');
      s.src = SUPABASE_CDN;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Supabase-Library konnte nicht geladen werden.'));
      document.head.appendChild(s);
    });
  }
  function getClient() {
    if (!isProd) return Promise.reject(new Error('Demo-Mode (SUPABASE_URL nicht gesetzt).'));
    if (!clientPromise) {
      clientPromise = loadSupabaseScript().then(() => {
        return window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
        });
      });
    }
    return clientPromise;
  }

  /* ============================================================
     Hilfsfunktionen
     ============================================================ */
  function demoWarnOnce() {
    if (demoWarnOnce._done) return;
    demoWarnOnce._done = true;
    console.warn('[dentalDb] Supabase nicht konfiguriert – Demo-Mode aktiv. Lesezugriffe liefern Defaults, Schreibzugriffe lehnen ab.');
  }

  const DEMO_REJECT = (action) =>
    Promise.reject(new Error('Demo-Mode: ' + action + ' braucht Supabase-Konfiguration in config.js.'));

  /* ============================================================
     Content (Tabelle "content")
     ============================================================ */
  function get(key) {
    if (!isProd) { demoWarnOnce(); return Promise.resolve(defaults[key] != null ? defaults[key] : null); }
    return getClient().then((c) =>
      c.from('content').select('data').eq('id', key).maybeSingle().then(({ data, error }) => {
        if (error) throw error;
        return data && data.data != null ? data.data : (defaults[key] != null ? defaults[key] : null);
      })
    );
  }

  function set(key, value) {
    if (!isProd) return DEMO_REJECT('set ' + key);
    return getClient().then((c) =>
      c.from('content').upsert({ id: key, data: value, updated_at: new Date().toISOString() }, { onConflict: 'id' })
        .then(({ error }) => { if (error) throw error; return true; })
    );
  }

  function remove(key) {
    if (!isProd) return DEMO_REJECT('remove ' + key);
    return getClient().then((c) =>
      c.from('content').delete().eq('id', key).then(({ error }) => { if (error) throw error; return true; })
    );
  }

  /* ============================================================
     Storage (Bucket "images")
     ============================================================ */
  function uploadImage(file, slot) {
    if (!isProd) return DEMO_REJECT('uploadImage');
    if (!file) return Promise.reject(new Error('Keine Datei übergeben.'));
    return getClient().then((c) => {
      const ext = (file.name || '').split('.').pop() || 'bin';
      const path = (slot ? slot.replace(/[^a-z0-9_-]/gi, '_') + '/' : '') + Date.now() + '.' + ext.toLowerCase();
      return c.storage.from('images').upload(path, file, { upsert: true, cacheControl: '3600' })
        .then(({ data, error }) => {
          if (error) throw error;
          const { data: pub } = c.storage.from('images').getPublicUrl(data.path);
          return { path: data.path, url: pub.publicUrl };
        });
    });
  }

  /* ============================================================
     Realtime
     ============================================================ */
  function subscribe(cb) {
    if (!isProd) return () => {};
    let channel = null;
    let cancelled = false;
    getClient().then((c) => {
      if (cancelled) return;
      channel = c.channel('dh-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointment_requests' },
            (p) => { try { cb({ table: 'appointment_requests', event: p.eventType, record: p.new || p.old }); } catch (e) {} })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'content' },
            (p) => { try { cb({ table: 'content', event: p.eventType, record: p.new || p.old }); } catch (e) {} })
        .subscribe();
    });
    return () => {
      cancelled = true;
      if (channel) channel.unsubscribe();
    };
  }

  /* ============================================================
     Auth
     ============================================================ */
  const auth = {
    signIn(email, password) {
      if (!isProd) return DEMO_REJECT('signIn');
      return getClient().then((c) =>
        c.auth.signInWithPassword({ email, password }).then(({ data, error }) => {
          if (error) throw error;
          return data.user;
        })
      );
    },
    signOut() {
      if (!isProd) return Promise.resolve();
      return getClient().then((c) => c.auth.signOut().then(() => true));
    },
    isAuthed() {
      if (!isProd) return Promise.resolve(false);
      return getClient().then((c) => c.auth.getSession().then(({ data }) => !!(data && data.session)));
    },
    getEmail() {
      if (!isProd) return Promise.resolve(null);
      return getClient().then((c) => c.auth.getUser().then(({ data }) => data && data.user ? data.user.email : null));
    },
    resetPassword(email) {
      if (!isProd) return DEMO_REJECT('resetPassword');
      return getClient().then((c) =>
        c.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/admin.html' })
          .then(({ error }) => { if (error) throw error; return true; })
      );
    },
    updatePassword(newPassword) {
      if (!isProd) return DEMO_REJECT('updatePassword');
      return getClient().then((c) =>
        c.auth.updateUser({ password: newPassword })
          .then(({ error }) => { if (error) throw error; return true; })
      );
    },
    inviteUser() {
      // Admin-API benötigt service_role-Key; mit Anon-Key nicht möglich.
      return Promise.reject(new Error('Neue Benutzer bitte über das Supabase-Dashboard anlegen.'));
    },
    onChange(cb) {
      if (!isProd) return () => {};
      let sub = null;
      let cancelled = false;
      getClient().then((c) => {
        if (cancelled) return;
        const r = c.auth.onAuthStateChange((_evt, session) => cb(session));
        sub = r.data && r.data.subscription;
      });
      return () => {
        cancelled = true;
        if (sub) sub.unsubscribe();
      };
    }
  };

  /* ============================================================
     Appointment Requests
     ============================================================ */
  function addAppointmentRequest(payload) {
    if (!isProd) return DEMO_REJECT('addAppointmentRequest');
    return getClient().then((c) =>
      c.from('appointment_requests').insert(payload).select().single()
        .then(({ data, error }) => { if (error) throw error; return data; })
    );
  }

  function listAppointmentRequests(opts) {
    if (!isProd) return Promise.resolve([]);
    opts = opts || {};
    return getClient().then((c) => {
      let q = c.from('appointment_requests').select('*').order('received_at', { ascending: false });
      if (opts.status) q = q.eq('status', opts.status);
      if (opts.limit)  q = q.limit(opts.limit);
      return q.then(({ data, error }) => { if (error) throw error; return data || []; });
    });
  }

  function updateAppointmentRequestStatus(id, status) {
    if (!isProd) return DEMO_REJECT('updateAppointmentRequestStatus');
    return getClient().then((c) =>
      c.from('appointment_requests').update({ status }).eq('id', id).select().single()
        .then(({ data, error }) => { if (error) throw error; return data; })
    );
  }

  function deleteAppointmentRequest(id) {
    if (!isProd) return DEMO_REJECT('deleteAppointmentRequest');
    return getClient().then((c) =>
      c.from('appointment_requests').delete().eq('id', id)
        .then(({ error }) => { if (error) throw error; return true; })
    );
  }

  function ready() {
    if (!isProd) { demoWarnOnce(); return Promise.resolve(false); }
    return getClient().then(() => true).catch((e) => { console.error('[dentalDb]', e); return false; });
  }

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
