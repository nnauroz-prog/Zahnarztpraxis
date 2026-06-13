# Übergabe · DentalHarmonie

## Status: Sales-ready (Cache r95)

Auf Branch `claude/improve-website-presentation-Yp4UY`. 13 HTML-Seiten,
1 Stylesheet (~3.900 Zeilen), 1 Script (~700 Zeilen), 1 Konfiguration,
1 SQL-Setup. Plus 6 Verkaufsdokumente im Repo-Root.

---

## Was steht

### Seiten (13)

| Seite | Zweck |
| --- | --- |
| `index.html` | Magazin-Cover-Hero mit Portrait, drei Kapitel, Manifesto auf Lavendel, CTA-Band |
| `leistungen.html` | Anchor-Inhaltsverzeichnis + 4 Kapitel (Vorsorge, Zahnmedizin, Ästhetik, Zahnersatz), Honorar-Note, FAQ |
| `zahnmedizin.html` | „Bestandsaufnahme zuerst" 3-Schritt-Block + Treatments-Liste mit Anchor-IDs für tief verlinkte Items |
| `prophylaxe.html` | PZR-Detail-Block + Treatments-Liste mit Anchor-IDs |
| `ueber-uns.html` | Hero, Prose-Intro mit Pull-Quote, 4-Schritt „Wie ich arbeite", Standards-Liste, Berufsrechtliches |
| `team.html` | Hero, Letter mit Portrait, Prose-Intro Team-Stationen, 3-Schritt „Wie ein Termin abläuft" |
| `kontakt.html` | Hero, Sprechzeiten + Adresse, drei Routen-Karten, Map-CTA, Notfall-Note |
| `termin-anfragen.html` | Form mit Prefill-Logik (`?anliegen=...`), Side-Aside mit Doctolib-Link |
| `impressum.html` | Pflichtangaben nach DDG |
| `datenschutz.html` | DSGVO-konform |
| `sitemap.html` | Vier Bereiche der Site auf einer Seite |
| `404.html` | Mit Sitemap-Übersicht |
| `admin.html` | Supabase-basiertes Dashboard für Termine, Inhalte, Sprechzeiten |

### Design-System

- **Farben:** Aubergine `#4A2F58` als Hauptakzent, Paper `#FBF9F6` als Background, dezenter Sage als Sekundär
- **Typografie:** Instrument Serif (Display/Italic) + Inter (Body) — beide selbst gehostet in `fonts/`
- **Komponenten:** Hero-Cover, Chapter-Marks, Manifesto, Pull-Quote, Notes, Treatments-Liste, Hours-Liste, Anchor-Liste, FAQ, Form, Letter, Visit, CTA-Band, Footer
- **Effekte:** 24 sorgfältig dosierte Mikro-Animationen — Magnet-Buttons, Counter-Parallax, Word-Stagger, 3D-Tilt, Chapter-Hairline, Page-Transition-Fade, Anchor-Scroll-Spy, Prefill-Bestätigung, Status-Badge-Pulse, „Heute"-Pulse u.v.m.
- **Tokens:** Generöse Border-Radii (8/16/26 px), diffuse Mehrlagen-Schatten, Aubergine-Glow für Hover-States

### Funktionen

- Termin-Anfrage-Formular mit URL-Param-Prefill (`?anliegen=Wurzelkanalbehandlung` → Dropdown vorausgewählt, Nachrichtenfeld vorbefüllt, Aubergine-Glow auf Dropdown, Auto-Scroll zum Form, Focus auf Name-Feld)
- Automatische Sprechzeiten-Logik (`Jetzt geöffnet bis 18:00` / `Heute ab 08:00` / `Aktuell geschlossen · Donnerstag ab 08:00`)
- „Heute"-Markierung in der Sprechzeiten-Liste mit Pulse
- Karten- und Routen-Links (Google Maps, Apple Maps, OpenStreetMap, HVV) öffnen externe Dienste erst auf Klick — DSGVO-sauber ohne eingebettete Karte
- Daten-Hinweis-Banner (ehrlich: kein Tracking, Schriften lokal, ein Bestätigen-Button)
- Header-Auto-Hide auf Scroll-Down
- Smooth-Anchor-Scroll mit Header-Offset
- Page-Transition-Fade beim Navigieren zwischen Seiten
- Anchor-Scroll-Spy auf Leistungen-Anchor-Liste

### Technik & Standards

- Schema.org strukturierte Daten: `Dentist`, `Person`, `FAQPage`, `BreadcrumbList`, `MedicalProcedure`
- Open-Graph-Tags für Social-Vorschau (WhatsApp, Facebook, LinkedIn) mit eigens komponierter Social-Card 1200×630 (`og-card.png`)
- Web-App-Manifest (Mobile-App-Add-to-Home)
- Druck-Stylesheet (`@media print`) für saubere Patient-PDFs
- Schriften selbst gehostet (`fonts/` · woff2, Subsets latin + latin-ext) — kein Google-CDN, keine IP-Übertragung an Dritte beim Seitenaufruf
- Cache-Busting via `?v=2026-01-01-r95`
- Service-Worker-Unregister im Head (verhindert Old-Cache-Stalking)
- WCAG-2.1-konforme Focus-Rings in Aubergine

---

## Manuelle Schritte zur Inbetriebnahme

1. **Supabase-Projekt** erstellen unter https://supabase.com
2. URL und Anon-Key aus `Settings → API` kopieren
3. In `config.js` beide Werte eintragen (Platzhalter `PASTE_HERE` ersetzen)
4. `setup.sql` im SQL-Editor des Projekts ausführen — legt an:
   - Tabelle `content` (öffentlich lesbar, Auth-Schreibzugriff)
   - Tabelle `appointment_requests` (Anon-Insert mit Privacy-Checkbox, Auth-CRUD)
   - Storage-Bucket `images`
   - Realtime-Publication auf beiden Tabellen
   - Alle Row-Level-Security-Policies
5. Ersten Admin-Nutzer in Supabase **Authentication → Users → „Add user"** anlegen
6. Auf `https://www.dentalharmonie.de/admin.html` mit dieser E-Mail/Passwort anmelden
7. Inhalte einpflegen, Sprechzeiten überprüfen, ggf. Bild hochladen

Detaillierte Schritt-für-Schritt-Anleitung steht in `GO-LIVE-CHECKLISTE.md`.

---

## Verkaufsdokumente

| Datei | Zweck |
| --- | --- |
| `PITCH.md` | Gesprächsleitfaden für den Termin mit Dr. Mostafaei (30 Min, Tour-Reihenfolge, Hooks, Einwand-Antworten) |
| `EINBLICK.md` | One-Pager für die Inhaberin (kann sie ihrem Steuerberater zeigen) |
| `ANGEBOT.md` | Formelles Angebot zum Ausdrucken und Unterschreiben |
| `ANSCHREIBEN.md` | Drei E-Mail-Bausteine (Vorab, Follow-up, SMS-Kurzform) |
| `GO-LIVE-CHECKLISTE.md` | Was vor dem Start passiert (Domain, DNS, Supabase, Tests) |
| `LAUNCH-KOMMUNIKATION.md` | Acht ready-to-use Bausteine für Launch-Tag (Instagram, Facebook, LinkedIn, MyBusiness, Patientenkarte mit QR, Wartezimmer-Aushang) |
| `TEXT-AUDIT-VERGLEICH.md` | Vergleich der Texte mit 8 realen Hamburger Konkurrenz-Praxen |

---

## Erkenntnisse aus dem Konkurrenz-Audit (Hamburg)

Untersuchte Praxis-Sites: Förster & Wollenberger (Uhlenhorst), Karlstraße, Dr. Janina Magdanz (Immenhof), Zahnarztpraxis Uhlenhorst (Diestel & Frank), Dr. Maryam Taleh (Gänsemarkt), Praxis Dr. Humsi, Lieblings-Zahnarzt (Stephansplatz), Zahnarztpraxis Ottensen.

**Was alle anderen tun:**
- „Vertrauen" als zentrales Wort
- „Wir nehmen uns Zeit" als pauschales Versprechen
- Wir-Pluralis selbst bei Ein-Behandler-Praxen
- Keine Honorartransparenz auf der Startseite
- Marketing-Floskeln statt eigener Aussagen

**Was DentalHarmonie macht (Differenzierung):**
- Ich-Stimme statt Wir-Pluralis (im Markt selten)
- Konkrete Zahlen („zehn Minuten zu viel pro Termin", „30–45 Min Erstgespräch")
- Ehrliche Grenzen („Was außerhalb meines Bereichs liegt, schicke ich offen weiter")
- Statement-Headline „Erst zuhören. *Dann behandeln.*" statt Schlagworte
- Honorar-Note prominent auf Leistungen-Seite
- Pull-Quote als Manifest („Eine kleine Praxis ist kein Mangel an Größe. Es ist eine Entscheidung.")
- Magazin-Cover-Hero mit Portrait — im Hamburger Zahnarzt-Markt nirgendwo zu finden

---

## Was Sie pflegen können

Über das Admin-Dashboard ohne Code-Kenntnisse:

- Texte aller Sektionen
- Sprechzeiten und Sonderzeiten
- Praxis-Status (Geöffnet, Urlaub, Sonderöffnung)
- Termin-Anfragen einsehen und exportieren
- Fotos austauschen (Storage-Bucket)

Was Code-Eingriff bräuchte:

- Brand-Farbe (in `styles.css` Tokens-Block)
- Neue Seiten (HTML kopieren als Vorlage)
- Schema.org-Strukturdaten ändern
- E-Mail-Adressen umstellen

---

## Test-Checklist für die Präsentation

1. Live-Site mit Hard-Reload öffnen (vermeidet Cache-Lag-Probleme bei Demos)
2. Hero-Portrait einmal scrollen (Magazin-Cover + Counter-Parallax + Word-Stagger sollten greifen)
3. „Wurzelkanalbehandlung" auf der Startseite anklicken → springt zu `zahnmedizin.html#wurzelkanal` und pulst dort
4. Auf Termin-anfragen.html ein Behandlungs-Item aus prophylaxe.html anklicken → Formular bekommt Prefill-Note + Aubergine-Glow am Dropdown
5. Mobile-Hochformat testen — alles stapelt sauber, Hero-Portrait passt unter den Text
6. Cookie-Consent erscheint nach 700 ms; nach Klick verschwindet er
7. „Heute" pulst in der Sprechzeiten-Liste am korrekten Wochentag
8. Sticky-CTA-Pill erscheint nach Scroll auf Mobile

---

## Bekannte Einschränkungen

- Keine eingebettete Karte auf der Kontaktseite — bewusste Entscheidung: nur externe Karten-Links (öffnen auf Klick), dadurch keine Drittanbieter-Anfragen beim Seitenaufruf
- Doctolib-Link nur sinnvoll, falls Frau Mostafaei ein Doctolib-Profil hat (aktuell verlinkt: `delaram-mostafaei`) — vor Go-Live verifizieren
- Porträtfoto liegt nur in 353 × 530 px vor — für gestochen scharfe Darstellung auf großen Screens wäre eine höher aufgelöste Aufnahme gut (die Social-Card nutzt das vorhandene Foto, kommt damit aber an die Auflösungs-Grenze des Originals)
- Telefonnummer, Faxnummer und E-Mail-Adresse vor Go-Live mit der Praxis abgleichen
- Aussagen im Text, die die Inhaberin bestätigen sollte: „Wartezeit höchstens 5–10 Minuten", Team-Beschreibung (Praxis-Managerinnen, Dentalhygienikerinnen, eigene Prophylaxe-Räume), Ratenzahlung über externe Abrechnungsstellen
