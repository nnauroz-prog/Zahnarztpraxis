# Übergabe · DentalHarmonie Relaunch

## Etappe 1 — Grundgerüst (Status: abgeschlossen, v2)

Auf Branch `claude/improve-website-presentation-Yp4UY` liegt jetzt ein
lauffähiges Grundgerüst mit 12 Seiten, einem auf Premium getrimmten
Designsystem, einem komplett neu gebauten Navigations-/Menü-System,
einem Supabase-Datenmodul (im Demo-Mode) und sauber getrennten JS-Modulen.

Die **Startseite** ist als Showcase ausgebaut (Hero · drei Säulen · Doctor-
Strip mit Porträt · Sprechzeiten + Anfahrt · CTA-Band · Wordmark-Footer);
alle anderen Seiten zeigen Hero + dezenten „Inhalt folgt"-Block, der in
Etappe 2 durch echte Inhalte ersetzt wird.

### Was enthalten ist

- 12 statische Seiten:
  `index.html`, `leistungen.html`, `zahnmedizin.html`, `prophylaxe.html`,
  `termin-anfragen.html`, `kontakt.html`, `ueber-uns.html`, `team.html`,
  `impressum.html`, `datenschutz.html`, `admin.html`, `404.html`.
- Designsystem in `styles.css`: Fraunces (variable Serif für Headlines)
  + Inter (Sans für Body), warmes Paper-Weiß, gezielte Sage- und Gold-
  Akzente, edge-to-edge Header mit Backdrop-Blur on Scroll, großzügige
  vertikale Rhythmik.
- Navigations-System komplett neu:
  - Desktop (≥ 1025 px): Inline-Nav mit feiner Underline-Animation,
    Telefonnummer + „Termin"-Pille rechts.
  - Mobile (≤ 1024 px): runder Hamburger-Button öffnet ein Fullscreen-
    Sheet mit nummerierten Menüpunkten und gestaffelter Einblende-
    Animation. ESC, Backdrop, Link-Klick und Resize schließen.
  - Saubere Aria-Semantik (`aria-expanded` am Button, `aria-hidden`
    am Sheet), Fokus-Rückgabe nach Schließen.
- `script.js`: Sticky-Header (`is-scrolled`-Klasse), Menu-Handler,
  Scroll-Reveal mit Stagger-Delays, „Heute"-Markierung für
  Sprechzeiten-Liste, Cookie-Consent-Banner, Hinweisbanner-Renderer.
- `db.js` mit vollständiger API-Oberfläche; Demo-Mode aktiv solange
  `SUPABASE_URL === 'PASTE_HERE'`.
- `admin.html` mit Login-Card; `admin.js` mit Password-Toggle.
- `setup.sql` für Supabase (Tabellen, RLS-Policies, Realtime, Bucket).
- `_headers`, `netlify.toml`, `sitemap.xml`, `robots.txt`.

### Lokale Vorschau

```
python3 -m http.server 8765
```

Dann im Browser `http://localhost:8765/` öffnen. Erwartetes Verhalten:
- Header, Footer, Hero, Platzhalterblock auf jeder Seite.
- Burger-Menü ab 880px Breite (per DevTools simulierbar).
- Cookie-Banner beim ersten Besuch sichtbar.
- Konsole zeigt **einmal** den Hinweis „Supabase nicht konfiguriert –
  Demo-Mode aktiv". Das ist erwartet, solange die Supabase-Keys fehlen.

### Manuelle Schritte vor Etappe 2

1. Supabase-Projekt erstellen (https://supabase.com).
2. `SUPABASE_URL` und `SUPABASE_ANON_KEY` aus dem Projekt in
   `config.js` eintragen (Platzhalter `PASTE_HERE` ersetzen).
3. `setup.sql` im SQL-Editor des Projekts ausführen.
4. Ersten Admin-User in Supabase Auth anlegen
   (Authentication → Users → „Add user").

### Bekannte Lücken (für Etappe 2 und später)

- Echte Inhalte aller Seiten (Leistungen-Karten, Über-uns-Texte,
  Team-Profile, vollständiges Impressum, vollständige Datenschutz-
  Erklärung mit Supabase-Klausel).
- Funktionsfähiges Termin-Formular mit Supabase-Insert.
- Echte Öffnungszeiten-Karten mit „Heute geöffnet"-Status.
- Google-Map mit Click-to-Load-Consent auf Kontakt.
- Admin-Dashboard mit den sechs CRUD-Bereichen.
- Realtime-Updates der Anfragen-Liste.
- Open-Graph-Bilder.
- Lighthouse-Tuning.

### Datei-Karte

| Datei | Zweck |
|---|---|
| `config.js` | Praxis-Stammdaten, Supabase-Schlüssel, Cache-Version |
| `db.js` | Datenmodul (Supabase-Wrapper, Demo-Mode) |
| `script.js` | Öffentliche Seiten — Drawer, Reveal, Consent, Banner |
| `admin.js` | Mitgliederbereich — Login, Password-Toggle |
| `styles.css` | Designsystem + Layout |
| `setup.sql` | Supabase-Schema |
| `_headers` | HSTS, CSP, Cache-Header, Robots-Tag |
| `netlify.toml` | Netlify-Build und 404-Fallback |
| `sitemap.xml` | 10 öffentliche Seiten |
| `robots.txt` | Admin-Bereich ausgeschlossen |
