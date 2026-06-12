# Changelog · DentalHarmonie

Cache-Version steht im `<head>` jeder HTML-Seite (`?v=2026-01-01-rNN`).
Nach größeren Änderungen Cache hochziehen — sonst sieht der Patient
beim Refresh die alte Version.

---

## r92 · Fremdblick-QA: DSGVO-Lücke geschlossen

Kritischer Review-Durchgang mit frischen Augen vor der Präsentation:

**Schriften selbst gehostet (wichtigster Fix)**
- Google Fonts wurde bedingungslos im `<head>` geladen, obwohl Banner
  und Datenschutzerklärung behaupteten, Fonts kämen erst nach
  Zustimmung — reale Abmahn-Angriffsfläche (LG-München-Rechtsprechung)
- Jetzt: woff2-Dateien lokal in `fonts/` (Inter als Variable Font,
  Instrument Serif, JetBrains Mono · Subsets latin + latin-ext)
- Kein Preconnect/Request mehr an Google beim Seitenaufruf

**Texte an Realität angeglichen**
- Datenschutz §4 nannte „Fraunces" — eine Schrift, die die Site gar
  nicht nutzt. Jetzt korrekt: lokale Schriften, keine Übertragung
- Datenschutz §7 beschrieb eine Click-to-Load-OSM-Karte, die es nicht
  gibt. Jetzt korrekt: externe Karten-Links öffnen erst auf Klick
- Datenschutz §5 ergänzt: auch Inhalte (Status, Hinweise) laden über
  Supabase
- Consent-Banner ehrlich umformuliert: kein Tracking, ein Button
  („Alles klar") statt Schein-Wahl ohne Wirkung

**Kleinere Korrekturen**
- `team.html`: Porträt-Maße 1024×1280 → echte 353×530 (Layout-Shift)
- `leistungen.html`: Kinderzahnheilkunde-Label „Erwachsene + Kinder"
  → „ab Milchzahn"
- `index.html`: Canonical/og:url auf Domain-Root statt `/index.html`
- Datenschutz-Stand auf Juni 2026

---

## r91 · Stunden-Polish-Pass · Sales-ready

24 Iterations-Runden über zwei Stunden:

**Tokens komplett überarbeitet**
- Aubergine richer: `#3F2A4A` → `#4A2F58`
- Border-Radii deutlich größer: r-1 4→8 px, r-2 10→16 px, r-3 18→26 px
- Schatten dreilagig diffuser
- Neuer `--shadow-accent` Token mit Aubergine-Glow

**Komponenten softer**
- Primary-Button mit 3-Stop-Gradient + Mehrlagen-Glow
- Hero-Cover-Caption mit Frosted-Glass + Backdrop-Blur
- Pull-Quote als Lavendel-Aubergine-Card statt Border-Box
- Note, FAQ, Treatments-Liste, Anchor-Liste, Form-Inputs: alle Borders auf 0.55-0.7 Opazität
- Section-Trennlinien als zentrierter Fade-Gradient statt 1px-Border
- Footer mit Multi-Radial-Background (Aubergine + Sage)
- Form-Check als eigene Card, Form-Error mit ⚠-Icon, Form-Success mit Sage-Gradient-Check-Icon
- Skip-Link als Aubergine-Pill mit Glow
- Cookie-Consent als Frosted-Glass-Banner

**Typografie unified**
- Eyebrows, Form-Labels, Footer-H4, Hours-Day, Treatments-Cat: alle auf Italic Serif Aubergine umgestellt (statt Uppercase-Inter-Caps)
- Mobile-Menü auf Italic Serif normal-case
- Hero-Lead auf Instrument Serif
- Hover-Underlines durchgehend animierte Background-Gradient-Linien (1 px → 2 px)

**Texte persönlicher**
- Sieben FAQ-Antworten konversationaler umformuliert
- Über uns Lead: „substanzschonend, mit ehrlicher Prophylaxe statt schneller Eingriffe"
- Kontakt: „rufen Sie einfach kurz an — wir lotsen Sie hin"
- Termin-Notfall: „Bei Schmerzen lieber anrufen. Wenn es akut ist … finden wir noch heute eine Lösung"
- Berufsrechtliches: „Was der Gesetzgeber verlangt — und für Sie heißt das: alles ist nachvollziehbar geregelt"
- Doctolib-Hint: „Sie buchen lieber selbst? Geht auch direkt über Doctolib"
- Status-Loading: „Sprechzeit wird geprüft …" statt „Status wird geladen …"

---

## r68 → r88 (erste Polish-Stunde) · siehe Git-Log

Komponenten-für-Komponente-Softening, Detail-Anchor-Routing für
Treatments-Items, Inner-Page-Hero-Tiefe, Form-Komponenten-Polish,
Manifesto-Quote-Ornament-Refinement.

---

## r67 — UX-Prefill-Bestätigung mit Auto-Scroll

`?anliegen=...` URL-Parameter füllt Formular vor, scrollt smooth
zum Formular, fokussiert Name-Feld, zeigt Aubergine-Bestätigungs-
Note oberhalb des Forms, räumt URL via `history.replaceState` auf.

---

## r66 — Treatments-Items routen sinnvoll

42 Behandlungs-Items über 4 Seiten leiteten alle auf „die gleiche
Seite" (häufigster User-Bug). Fix: alle routen zu
`termin-anfragen.html?anliegen=<Name>` mit URL-encoded Parameter.
Später (r68) differenziert: Behandlungs-Items mit Detail-Seite →
spezifischer Anchor; ohne Detail-Seite → Termin-anfragen.

---

## r58 — Aubergine-Focus-Rings + Scroll-Spy

Alle Focus-Rings auf 2 px Aubergine. Anchor-Liste auf Leistungen
hebt aktive Sektion mit Aubergine-Dot pulsierend hervor.

---

## r57 — Custom-Selection + Paper-Grain + Portrait-Clip-Reveal

Markierter Text in Aubergine. Sehr subtile SVG-Noise-Textur als
Editorial-Patina. Hero-Portrait offenbart sich beim Load mit
horizontaler Wipe-Maske über 1,4 s.

---

## r54 — Hero-Headline Word-Stagger + 3D-Portrait-Tilt

Jedes Wort im H1 fadet sequenziell ein (70 ms Versatz). Portrait
neigt sich subtil in 3D zum Cursor (max 4°).

---

## r47 → r48 — Chapter-Marks + Italic-em-Konsequenz

Editorial-Struktur „Kapitel 01 / 02 / 03" über allen Sektionen.
Italic em-Akzent in Aubergine auf allen H1s/H2s konsistent.

---

## r45 → r46 — Magazin-Cover-Hero + Manifesto-Block

Startseite-Hero von Text-Only auf zweispaltiges Magazin-Cover mit
Portrait. Letter-Sektion durch typografisches Manifesto auf
Lavendel ersetzt (Portrait erscheint nicht mehr doppelt).

---

## r40 → r41 — Ich-Stimme durchgängig

Alle „wir"-Pluralis-Sätze auf „ich" umgestellt. Texte gestrafft.
FAQ-JSON-LD synchronisiert.

---

## r39 → r40 — Reife durch Reduktion

Premium-Polish-Pass, dann Revert nach User-Feedback „komplett
kaputt". Zurück auf robuste arabische Ziffern + 1.8rem Serif-Num.
