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
| `pitch.html` | Internes Pitch-Mockup (nicht für Patienten) – via robots.txt ausgeschlossen |

## Assets

- `IMG_9504.png` – Praxis-Logo
- `IMG_9505.jpeg` – Portraitfoto Dr. Delaram Mostafaei
- `praxis-behandlung-1.jpg` / `-2.jpg` / `-3.jpg` – Behandlungsräume
- `praxis-wartezimmer.jpg` – Wartezimmer
- `assets/css/style.css` – Design-System (Aubergine + warmes Grau)
- `assets/js/main.js` – Sticky Header, Mobile-Nav-Toggle
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

## Designgrundsätze (für künftige Änderungen)

- **Farben**: Aubergine `#3F2A4A` (Akzent), Champagner-Taupe `#8A7868` (Trennlinien, Eyebrows), warmes Off-White `#FCFAF7`. Mint, Blau und kräftige Highlights vermeiden.
- **Typografie**: `Fraunces` für Headlines (Serife, ruhig), `Inter` für Lauftext. Italic nur sehr sparsam.
- **Whitespace**: lieber zu viel als zu wenig. Section-Padding 48–80 px.
- **Bildbehandlung**: Subtile Schatten, keine Versatz-Farb-Blöcke hinter Fotos. Aspect-Ratio 3/4 für Portraits, 4/3 für Räume.
- **Trust statt Sales**: keine erfundenen Sterne, keine ausgedachten Patientenstimmen, keine "höchstes Niveau"-Floskeln. Heil- und Kostenplan, Berufsbezeichnung, Kammer prominent.
