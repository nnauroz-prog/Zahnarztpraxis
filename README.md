# Zahnarztpraxis · Dental Harmonie – neuer Webauftritt

Pitch-Mockup für die Zahnarztpraxis **Dental Harmonie** (Ifflandstraße 75, 22087 Hamburg-Hohenfelde).
Ziel: Eine moderne, "Clean &amp; medizinisch" gestaltete Website plus Verkaufs-Pitch, mit dem die Praxis von der neuen Lösung überzeugt werden kann.

## Dateien

| Datei | Zweck |
| --- | --- |
| `index.html` | Die neue Website (Hero, Praxis, Leistungen, Team, Ablauf, Bewertungen, FAQ, Kontakt) |
| `pitch.html` | Verkaufs-Pitch mit Vorher/Nachher-Vergleich, Argumenten, Wirtschaftlichkeit, Lieferumfang und CTA |
| `impressum.html` | Impressum (Pflichtseite, DSGVO/TMG) |
| `datenschutz.html` | Datenschutzhinweise (DSGVO) |
| `assets/css/style.css` | Komplettes Design-System (Farben, Typografie, Komponenten) |
| `assets/js/main.js` | Sticky-Header, mobile Navigation, FAQ-Verhalten |
| `IMG_9504.png`, `IMG_9505.jpeg` | Screenshots der bestehenden Seite (für den Vorher-Vergleich im Pitch) |

## So präsentieren Sie der Praxis

1. **Pitch öffnen** – `pitch.html` zuerst zeigen. Der Vorher/Nachher-Block macht den Unterschied sofort sichtbar.
2. **Live-Demo** – aus dem Pitch heraus per Klick `index.html` öffnen und durch die Sektionen scrollen:
   - Hero mit "Termin online vereinbaren"
   - Leistungen mit allen 13 Behandlungen
   - Detail-Sektionen Veneers · Ästhetik · Stressfreie Behandlung · Implantologie
   - Online-Anfrageformular
3. **Mobil zeigen** – Browser-DevTools auf iPhone-Größe stellen oder direkt am Smartphone öffnen. Die Praxis sieht: 70 % der Patient:innen kommen vom Handy – die alte Seite hat dort die größten Schwächen.
4. **Argumente** – im Pitch sind die sechs Kernargumente (Mobile-first, Sicherheit, Online-Termin, lokales SEO, Speed, Vertrauen) plus Wirtschaftlichkeitskennzahlen verlinkt.
5. **Abschluss** – Call-to-Action im Pitch mit Mailto-Link, der den Termin direkt anbahnt.

## Lokal ausprobieren

Reine HTML/CSS/JS-Seite – kein Build nötig:

```sh
# Im Projektordner
python3 -m http.server 8080
# danach im Browser:
# http://localhost:8080/pitch.html
# http://localhost:8080/index.html
```

(Das `iframe` mit der Live-Vorschau im Pitch funktioniert am zuverlässigsten über einen lokalen Server – nicht per `file://`.)

## Designgrundsätze

- **Stilrichtung**: Clean &amp; medizinisch – Weiß, klares Blau (#1F6FB8 / #0E3A6B), Akzent in Mint-Türkis (#2EB1A6).
- **Typografie**: *Fraunces* für Überschriften (vertrauensvoll, leicht warm), *Inter* für Lauftext.
- **Mobile-first**, semantisches HTML, ARIA-Labels, `prefers-reduced-motion` respektiert.
- **SEO &amp; Lokal**: Schema.org `Dentist`-Markup mit Adresse, Telefon, Öffnungszeiten – damit Google Maps und Suche die Praxis sauber indizieren.
- **DSGVO-bewusst**: Kein Tracking, klares Datenschutz-Dokument, Hinweis auf Consent für Google Fonts (für die Produktivversion lokales Hosten der Fonts empfohlen).

## Anpassen

Texte stammen weitgehend aus der bestehenden dentalharmonie.de (Veneers, Stressfreie Behandlung, Behandlungsspektrum). In der finalen Auftragsversion empfehlen wir:

- Echte Praxis- und Teamfotos (Avatare in `index.html` durch `<img>`-Tags ersetzen)
- Echte Patientenstimmen (Sektion `#bewertungen`)
- Anbindung an ein echtes Terminsystem (z. B. Doctolib, jameda) statt `mailto:`-Formular
- Lokales Hosten der Schriftarten für volle DSGVO-Konformität ohne Hinweis
