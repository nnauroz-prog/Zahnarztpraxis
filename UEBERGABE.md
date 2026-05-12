# Übergabe · DentalHarmonie Relaunch

## Etappe 1 — Grundgerüst (Status: abgeschlossen)

Auf Branch `claude/improve-website-presentation-Yp4UY` liegt jetzt ein
lauffähiges Grundgerüst mit 12 Seiten, neuem Designsystem, einem
Supabase-Datenmodul (im Demo-Mode) und sauber getrennten JS-Modulen.

Es sind **noch keine echten Inhalte** eingepflegt — jede Seite zeigt unterhalb
des Hero-Bereichs einen Platzhalter „Inhalt folgt in Etappe 2".

### Was enthalten ist

- 12 statische Seiten:
  `index.html`, `leistungen.html`, `zahnmedizin.html`, `prophylaxe.html`,
  `termin-anfragen.html`, `kontakt.html`, `ueber-uns.html`, `team.html`,
  `impressum.html`, `datenschutz.html`, `admin.html`, `404.html`.
- Designsystem in `styles.css` (Warm-White / Sage / Gold / Charcoal).
- `script.js` mit Sticky-Header, Mobile-Drawer (mit Ghost-Click-Schutz),
  Scroll-Reveal, Cookie-Consent-Banner und Hinweisbanner-Renderer.
- `db.js` mit der vollständigen API-Oberfläche (`get/set/remove`,
  `uploadImage`, `subscribe`, `auth.*`, Anfragen-CRUD). Im Demo-Mode
  liefern Reads Defaults; Writes lehnen mit einer klaren Fehlermeldung ab.
- `admin.html` mit Login-Card; `admin.js` mit Augen-Toggle und
  Login-Handler (Auth folgt in Etappe 3).
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
