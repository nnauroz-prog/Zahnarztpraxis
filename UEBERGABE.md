# Übergabe · DentalHarmonie Relaunch

## Status: Etappe 2 abgeschlossen

Auf Branch `claude/improve-website-presentation-Yp4UY` liegt ein
vollständig befüllter Web-Auftritt mit 12 Seiten, premiumigem Designsystem,
einem neu gebauten Navigations-/Menü-System, einem funktionsfähigen
Termin-Formular (mailto-Fallback im Demo, Supabase live nach Konfiguration),
einer Click-to-Load-Karte auf der Kontaktseite, sowie vollständig ausgearbeiteten
Themenseiten und Rechtstexten (Entwurf — anwaltliche Prüfung empfohlen).

### Was enthalten ist

- **12 Seiten** mit echten Inhalten:
  - `index.html` — Showcase: Hero, drei Säulen, Doctor-Strip, Sprechzeiten,
    CTA-Band, Wordmark-Footer.
  - `leistungen.html` — Vorsorge, Zahnmedizin, Ästhetik, Zahnersatz, mit
    Honorar-Hinweis (GOZ / Heil- und Kostenplan).
  - `zahnmedizin.html` — Erstkontakt, Therapie-Übersicht, Notdienst-Hinweis.
  - `prophylaxe.html` — PZR, Kinder-Prophylaxe, Recall, Bleaching.
  - `termin-anfragen.html` — vollwertiges Formular + Erreichbarkeits-Aside +
    Doctolib-Link + Notfall-Hinweis.
  - `kontakt.html` — Adresse, Sprechzeiten (mit „Heute"-Highlight), Karte
    (Click-to-Load OSM), Notfall-Hinweis.
  - `ueber-uns.html` — Philosophie, Werte, berufsrechtliche Angaben.
  - `team.html` — Lead-Karte Dr. Mostafaei, ehrlich gehaltene Team-Karten.
  - `impressum.html` — § 5 DDG, berufsrechtliche Angaben, MStV-Verantwortlich,
    UStG-Hinweis, OS-Plattform, Haftung, Urheber, Bildnachweis.
  - `datenschutz.html` — 12 Sektionen: Verantwortlich, Server-Logs, Cookies,
    Google Fonts, Supabase, Doctolib, OSM, Behandlungsdaten,
    Datensicherheit, Speicherdauer, Betroffenenrechte, Änderungsvorbehalt.
  - `admin.html` — Login-Card mit Password-Toggle (noindex).
  - `404.html` — Serifen-Hero mit Rückwegen (noindex).

- **Designsystem in `styles.css`**:
  Fraunces variable Serif für Headlines, Inter Sans für Body. Warmes Paper-
  Weiß, sage- und gold-akzentuierte Detail-Markierungen, Charcoal-Ink.
  Edge-to-edge Header mit Backdrop-Blur on Scroll. Bento- und Listen-Layouts
  (Feature-Grid, List-Rich, Note-Callouts, Two-Col, Cards, Map).

- **Navigation komplett neu**:
  - Desktop (≥ 1025 px): inline-Nav mit Underline-Animation, Telefon und
    „Termin"-Pille rechts.
  - Mobile (≤ 1024 px): runder Hamburger → Fullscreen-Sheet mit nummerierten
    Menüpunkten und gestaffelter Animation. ESC / Resize / Link-Click
    schließen. Saubere ARIA-Semantik.

- **Termin-Formular**:
  - Felder: Name, Telefon (beide Pflicht), E-Mail (optional), Anliegen-Select
    (7 Optionen), Wunschdatum, Wunschzeit, Nachricht, Datenschutz-Checkbox.
  - Native HTML5-Validierung mit `reportValidity`.
  - Submit ruft `dentalDb.addAppointmentRequest(...)` auf — im Demo-Mode
    erfolgt eleganter Fallback auf `mailto:info@dentalharmonie.de` mit
    vorausgefüllter Subject + Body, damit Anfragen auch ohne Supabase
    direkt funktionieren.
  - Success-State mit Sage-Häkchen wird nach erfolgreichem Submit
    eingeblendet, Form ausgeblendet.

- **Karte (Kontakt)**:
  - Click-to-Load OpenStreetMap-iframe (DSGVO-konform, kein Datenfluss
    vor expliziter Zustimmung).
  - Direktlink „Bei OpenStreetMap öffnen".

- **Datenmodul (`db.js`)**:
  Vollständige API-Oberfläche (`get/set/remove/uploadImage/subscribe`,
  `auth.*`, Anfragen-CRUD). Im Demo-Mode (`SUPABASE_URL === 'PASTE_HERE'`)
  liefern Reads sinnvolle Defaults; Writes lehnen sauber mit Hinweis ab.

- **`script.js`**: Sticky-Header, Fullscreen-Menü mit ARIA, Scroll-Reveal
  mit Stagger, „Heute"-Markierung in Sprechzeiten, Cookie-Consent-Banner,
  Hinweisbanner-Renderer (über Supabase-`content`), Termin-Form-Handler,
  Map-Consent-Loader.

- **Supabase-Schema (`setup.sql`)**: Tabellen `content` und
  `appointment_requests` mit RLS-Policies (anon Insert + Privacy-Constraint;
  Auth Read/Update/Delete), Storage-Bucket `images`, Realtime-Publication.

- **Sicherheit (`_headers`)**: HSTS, X-Frame-DENY, strict-origin Referrer,
  Permissions-Policy minimal, CSP für eigene Domain + Google Fonts +
  Supabase + OSM-Frame, `noindex`-Tag auf Admin und 404, Immutable-Cache
  auf CSS/JS via Version-Query, no-store auf Admin.

### Lokale Vorschau

```
python3 -m http.server 8765
```

Browser: `http://localhost:8765/`. Erwartet:
- Premium-Look mit großzügiger Typografie.
- Mobile-Menü ab DevTools-Breite ≤ 1024 px verfügbar.
- Cookie-Banner bei erstem Besuch.
- Termin-Formular sendet sich im Demo per mailto.
- Konsole zeigt einmalig „Supabase nicht konfiguriert – Demo-Mode aktiv".

### Manuelle Schritte für Produktion

1. **Supabase-Projekt** erstellen (https://supabase.com).
2. `SUPABASE_URL` und `SUPABASE_ANON_KEY` in **`config.js`** eintragen
   (Platzhalter `PASTE_HERE` ersetzen).
3. **`setup.sql`** im SQL-Editor des Projekts ausführen.
4. Ersten Admin-User in Supabase **Authentication → Users → „Add user"** anlegen.
5. **Rechtstexte** (`impressum.html`, `datenschutz.html`) durch eine
   Anwältin oder einen Anwalt prüfen lassen. Der vorhandene Text ist ein
   sorgfältiger Entwurf, ersetzt aber keine Rechtsberatung. Speziell zu
   prüfen: Praxis-spezifische Aufsichtsbehörden-Bezeichnung,
   Supabase-Verarbeitungsstandort, Aufbewahrungsfristen für Anfragen.

### Offen / spätere Etappen

- **Echte Supabase-Anbindung in `db.js`**: aktuell sind die Methoden Stubs
  mit Demo-Verhalten. In Etappe 3 wird `@supabase/supabase-js` per CDN
  geladen und die Methoden gegen den realen Client implementiert.
- **Admin-Dashboard**: Login-Card existiert, aber das CMS-Backend
  (Banner-Editor, Bilder, Anfragen-Inbox mit Realtime, Sprechzeiten-Editor)
  kommt in Etappe 3.
- **Echte Praxis-Fotos** (Behandlungszimmer, Empfang, Team) — bislang nur
  Logo und Porträt vorhanden.
- **Open-Graph-Bilder** (1200×630 px) je Seite.
- **Lighthouse-Tuning** (Image-Compression, Font-Subset, Critical-CSS).
- **Cookie-Banner-Feinschliff** (Hash-Switch für Re-Open via Footer-Link).

### Datei-Karte

| Datei | Zweck |
|---|---|
| `config.js` | Praxis-Stammdaten, Supabase-Schlüssel, Cache-Version |
| `db.js` | Datenmodul (Demo-Mode / Supabase-Wrapper-Stub) |
| `script.js` | Öffentliche Seiten — Header, Menü, Reveal, Consent, Formular, Karte |
| `admin.js` | Mitgliederbereich — Login, Password-Toggle |
| `styles.css` | Designsystem + Layout + Inhalts-Komponenten |
| `setup.sql` | Supabase-Schema (Tabellen, RLS, Storage, Realtime) |
| `_headers` | HSTS, CSP, Cache-Header, Robots-Tag |
| `netlify.toml` | Netlify-Build und 404-Fallback |
| `sitemap.xml` | 10 öffentliche Seiten |
| `robots.txt` | Admin-Bereich ausgeschlossen |
