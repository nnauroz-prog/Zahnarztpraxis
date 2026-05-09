# DentalHarmonie · Webauftritt

Multi-Page Praxis-Website für **DentalHarmonie** (Inhaberin Dr. Delaram Mostafaei, Ifflandstraße 75, 22087 Hamburg-Hohenfelde).

Stilrichtung: **Privatklinik clean** – pure White, viel Weißraum, dezenter Aubergine-Akzent (passend zum Praxis-Logo: violetter Zahn auf Zen-Steinen). Inhalt 1:1 von [dentalharmonie.de](http://www.dentalharmonie.de) übernommen, nicht ausgedacht.

## Seitenstruktur

| Datei | Zweck |
| --- | --- |
| `index.html` | Startseite – Hero, Drei Säulen, Praxisrundgang, Brief der Inhaberin, FAQ, Kontakt-CTA |
| `praxis.html` | Über die Praxis – Praxisrundgang (Galerie), Behandlungskonzept, Werdegang, berufsrechtliche Pflichtangaben |
| `team.html` | Team – Lead-Karte Dr. Mostafaei + Team-Statement aus dem Original |
| `leistungen.html` | Alle 14 Behandlungen, gruppiert. Detailblöcke für Veneers, Ästhetik, Bleaching, Implantologie, Stressfreie Behandlung, PZR |
| `termin.html` | Erstgespräch in 3 Schritten, Anfrageformular mit DSGVO- und Schweigepflicht-Hinweis |
| `kontakt.html` | Adresse, Sprechzeiten, Notdienst-Nummern, OpenStreetMap (Klick-zu-Laden) |
| `impressum.html` | Pflichtangaben nach § 5 TMG |
| `datenschutz.html` | Datenschutzhinweise (DSGVO) |
| `intern.html` | Mitarbeiter-Bereich – Dienstplan, Notfall-Kontakte, Lieferanten, Hygiene-Protokoll, Fortbildungen, News (passwortgeschützt, `noindex`) |
| `pitch.html` | Internes Pitch-Mockup (nicht für Patienten) – via robots.txt ausgeschlossen |

## Assets

- `IMG_9504.png` – Praxis-Logo
- `IMG_9505.jpeg` – Portraitfoto Dr. Delaram Mostafaei
- `praxis-behandlung-1.jpg` / `-2.jpg` / `-3.jpg` – Behandlungsräume
- `praxis-wartezimmer.jpg` – Wartezimmer
- `assets/css/style.css` – Design-System (Aubergine + warmes Grau)
- `assets/js/main.js` – Sticky Header, Mobile-Nav-Toggle, FAQ-Verhalten, Scroll-Reveal
- `assets/js/intern.js` – Login-Logic für `intern.html` (SHA-256 clientseitig)
- `robots.txt` + `sitemap.xml` – SEO

## Lokal ausprobieren

Reine HTML/CSS/JS-Site, kein Build:

```sh
python3 -m http.server 8080
# Browser: http://localhost:8080/
```

## Was funktioniert

- Multi-Page-Architektur mit globaler Nav + aktiver Seitenmarkierung
- Schema.org `Dentist` auf Index, Praxis, Kontakt
- Open Graph + Twitter Card Meta-Tags auf allen Seiten
- Sitemap.xml + robots.txt
- Echte Praxis-Bilder (Galerie auf Praxis + Index)
- WCAG 2.1: Skip-Link, Focus-Indikatoren, ARIA-Labels, prefers-reduced-motion respektiert
- DSGVO: kein Tracking, keine Marketing-Cookies, OpenStreetMap mit Klick-zu-Laden, Schweigepflicht-Hinweis am Formular
- Telefonnummer im Header sichtbar (Desktop) + Sticky-Header
- FAQ-Sektion (8 Fragen) auf Index
- Berufsrechtlicher Block + Heil- und Kostenplan-Hinweis
- Notfallnummern: zahnärztlicher Notdienst Hamburg, 116 117, 112

## Was Frau Mostafaei oder der Hosting-Anbieter noch tun sollte

### Inhalt
- [ ] Konkrete Approbations- und Studienjahre in `praxis.html` ergänzen
- [ ] Klinische Stationen vor 2016 (welche Hamburger Praxen) konkretisieren
- [ ] Echte Patientenstimmen mit Einwilligung (z.B. aus Trustindex.io) einbauen
- [ ] Team-Mitarbeiterinnen mit Namen + Rolle ergänzen, sofern gewünscht
- [ ] og:image als 1200×630 Banner mit Logo + „Dr. Mostafaei · Hamburg" erstellen (ersetzt aktuell IMG_9505.jpeg)

### Technik (beim Deployment)
- [ ] **Google Fonts self-hosten** (DSGVO-Sicherheit nach BGH-Urteil 2022)
- [ ] **WebP/AVIF-Versionen** der Praxis-Bilder generieren + `<picture>` einbauen
- [ ] **Logo als SVG** statt 82-KB-PNG (Vektor-Original ist nötig)
- [ ] CSS minifizieren (–30 % Größe)
- [ ] HTTP-Header beim Hosting: HSTS, CSP, X-Frame-Options
- [ ] Static-Site-Generator (Eleventy/Astro) prüfen, um Header/Footer-Duplikation zu beenden
- [ ] Form-Backend (Formspree, Resend, eigener Endpoint) statt `mailto:`
- [ ] Doctolib- oder jameda-Integration für echte Online-Buchung in Echtzeit prüfen

### SEO
- [ ] Google Search Console: Property anlegen + sitemap.xml einreichen
- [ ] Google Business Profile pflegen (Adresse, Sprechzeiten, Bilder)
- [ ] Backlink-Strategie (KZV Hamburg, Champions Implant Expert Verzeichnis, Praxis-Verzeichnisse)

## Mitarbeiter-Bereich (`intern.html`)

Passwortgeschützte Übersicht für das Praxis-Team mit Dienstplan, Notfall-Telefonen, Lieferanten-Liste, Hygiene-Tagesablauf, Fortbildungen und Praxis-News.

### Wichtig zur Sicherheit

> Diese Anmeldung ist eine **UX-Schwelle, kein kryptografisch sicherer Login**. Inhalte stehen im HTML/JS-Quellcode und sind für jeden mit Browser-Dev-Tools sichtbar. **Keine Patienten-Daten** dort einpflegen — das gehört in die Praxis-Software.

### Standardpasswort

`harmonie2026`

### Passwort ändern

1. Neues Passwort wählen (mindestens 12 Zeichen).
2. SHA-256-Hash erzeugen — Terminal:
   ```sh
   echo -n "neuesPasswort" | shasum -a 256
   ```
   Oder im Browser-Devtool:
   ```js
   const hex = Array.from(new Uint8Array(
     await crypto.subtle.digest('SHA-256', new TextEncoder().encode('neuesPasswort'))
   )).map(b => b.toString(16).padStart(2,'0')).join('');
   console.log(hex);
   ```
3. In `assets/js/intern.js` die Konstante `PW_HASH` durch den neuen Hex-Hash ersetzen.
4. Commit + Deploy.

Empfehlung: Passwort vierteljährlich rotieren und nie per E-Mail versenden.

### Inhalte pflegen — direkt im Browser

Im Mitarbeiter-Bereich gibt es nach dem Login einen **Bearbeiten-Knopf** (oben rechts neben „Abmelden"). Damit:

- **Texte ändern**: einfach in eine Zelle/Zeile klicken und tippen.
- **Zeilen hinzufügen**: über die gestrichelten „+ Tag/Kontakt/Eintrag hinzufügen"-Buttons unter jeder Liste.
- **Zeilen löschen**: über das `×` rechts neben jeder Zeile (nur im Bearbeiten-Modus sichtbar).
- **Drucken**: Print-optimiertes Layout (Header, Toolbar etc. werden ausgeblendet).
- **Export / Import**: Bearbeitungen als JSON-Datei herunterladen und auf einem anderen Gerät einspielen.
- **Zurücksetzen**: alle Bearbeitungen verwerfen, Standardinhalte werden wiederhergestellt.

> ⚠ **Wichtig**: Bearbeitungen liegen im `localStorage` des Browsers, also **nur auf diesem Gerät**. Frau Mostafaeis Praxis-PC und das Smartphone der ZFA sind getrennte Speicher. Zum Synchronisieren: Export → Datei via Mail/Slack/USB an die anderen → Import.

Die Original-Inhalte bleiben im HTML-Quellcode von `intern.html`. Wenn jemand „Zurücksetzen" wählt, kommen genau diese zurück.

## Inline-Edit-Modus auf der öffentlichen Seite

Frau Mostafaei kann ausgewählte Texte direkt auf der Startseite ändern (nicht nur im Mitarbeiter-Bereich):

1. Im Mitarbeiter-Bereich anmelden (Login bleibt für die Browser-Session aktiv).
2. URL `?edit=1` an eine öffentliche Seite anhängen, z.B. `index.html?edit=1`. Ohne Login erfolgt eine automatische Weiterleitung zum Login mit Rücksprung.
3. Nach dem Anklicken eines markierten Texts (Eyebrow, Headlines, Lead, Säulen-Texte, Pull-Quote) erscheint eine Markierung; Tippen ändert den Text live.
4. Auto-save in `localStorage` unter `dh_inline_<key>`. Patient:innen sehen die geänderten Texte **auf demselben Gerät** sofort, andere Geräte über Export/Import (siehe Mitarbeiter-Bereich).
5. Floating-Button unten rechts: „↺ Texte zurücksetzen" oder „✓ Fertig" zum Schließen.

Editierbare Felder auf `index.html` (Stand jetzt):
- `hero.eyebrow`, `hero.h1.line1`, `hero.h1.line2`, `hero.lead`
- `saeulen.h2`, `saeulen.lead`
- `saeule.aesthetik.desc`, `saeule.implantologie.desc`, `saeule.prophylaxe.desc`
- `pullquote.text`, `brief.h2`, `cta.h2`

Neue editierbare Stellen lassen sich über das Attribut `data-editable="<key>"` auf einem beliebigen Text-Element hinzufügen.

## Cookie-Consent &amp; Hinweis-Banner

- **Cookie-Consent**: erscheint beim ersten Besuch unten als Karte. „Alle akzeptieren" lädt Google Fonts; „Nur notwendige" verwendet System-Schriften (Inter/Fraunces fallen auf system-ui/Georgia zurück). Wahl wird in `localStorage` (`dh_consent`) gespeichert. Im Footer „Cookies anpassen" zeigt das Banner erneut.
- **Hinweis-Banner**: ganz oben auf jeder öffentlichen Seite, wenn im Mitarbeiter-Bereich Text eingetragen wurde. Beispiel: „Praxis vom 24. – 26. Mai geschlossen." `×` blendet das Banner für die laufende Tab-Session aus.

## Deployment auf Netlify

- `_headers` definiert HSTS, CSP, X-Frame-Options, Cache-Control für Assets/HTML
- `netlify.toml` mit Redirects (`/admin → /intern.html`, `/team → /team.html` etc.) und 404-Fallback
- Hochladen: GitHub-Repo mit Netlify verknüpfen, Branch wählen → deployt automatisch
- Nach Go-Live: securityheaders.com prüfen → Ziel A oder besser

## Designgrundsätze (für künftige Änderungen)

- **Farben**: Aubergine `#3F2A4A` (Akzent), Champagner-Taupe `#8A7868` (Trennlinien, Eyebrows), warmes Off-White `#FCFAF7`. Mint, Blau und kräftige Highlights vermeiden.
- **Typografie**: `Fraunces` für Headlines (Serife, ruhig), `Inter` für Lauftext. Italic nur sehr sparsam.
- **Whitespace**: lieber zu viel als zu wenig. Section-Padding 48–80 px.
- **Bildbehandlung**: Subtile Schatten, keine Versatz-Farb-Blöcke hinter Fotos. Aspect-Ratio 3/4 für Portraits, 4/3 für Räume.
- **Trust statt Sales**: keine erfundenen Sterne, keine ausgedachten Patientenstimmen, keine "höchstes Niveau"-Floskeln. Heil- und Kostenplan, Berufsbezeichnung, Kammer prominent.
