# Changelog · DentalHarmonie

Cache-Version steht im `<head>` jeder HTML-Seite (`?v=2026-01-01-rNN`).
Nach größeren Änderungen Cache hochziehen — sonst sieht der Patient
beim Refresh die alte Version.

---

## r99 · Senior-Audit-Pass: Trust-Anker, weniger Reibung, vollstaendige Leistungs-Texte

**Vier Eingriffe an den groessten Conversion-Bremsen.**

**1. Trust-Zeile im Hero — drei Anker auf die haeufigsten Patientensorgen.**
Direkt unter den CTAs jetzt eine Reihe mit drei sage-gruenen Check-Chips:

- ✓ Gesetzlich & privat (beantwortet: „nimmt die meine Kasse?")
- ✓ Schriftlicher Kostenplan (beantwortet: „weiss ich vorher was es kostet?")
- ✓ Zahnärztekammer Hamburg (beantwortet: „ist das eine offizielle Praxis?")

Alle drei Aussagen sind aus den vorhandenen Praxis-Daten in ueber-uns.html
abgeleitet — nichts erfunden. Auf Mobile wrappt die Reihe automatisch in
zwei Zeilen.

**2. Mikro-Reassurance unter den Hero-CTAs.** „Erstgespräch unverbindlich ·
30–45 Minuten" — eine Zeile in italic Serif Slate. Senkt die Hemmschwelle
„was kostet mich der Klick?" und entkoppelt das Erstgespraech von der
Vorstellung eines teuren Erstbesuchs.

**3. Cookie-Banner deutlich schlanker.** War vorher fast vollbreit am
unteren Rand, ueberdeckte auf Mobile die Hero-CTAs beim First-Visit.
Jetzt: 380px max-Width, rechte untere Ecke, kleinerer Padding/Schrift —
sichtbar, aber nicht blockierend. Auf Mobile wieder vollbreit aber mit
deutlich kleinerer Hoehe.

**4. Leistungs-Seite mit vollstaendigen Beschreibungen.** Die 18 Eintraege
auf leistungen.html hatten nur Titel + Kategorie-Label. Jetzt jeder mit
einer faktischen 1-Satz-Beschreibung was die Leistung ist — z.B.

> Veneers · Vollkeramik
> Hauchdünne Keramikschalen für Frontzähne — bei Verfärbungen, kleinen
> Lücken oder Form-Korrektur.

Schliesst die r98-Luecke: Wer aus Home auf #veneers landet, sieht jetzt
nicht nur den Namen mit „Hier sind Sie"-Marker, sondern auch was Veneers
ueberhaupt sind. Der Anker-Landing-Pfad transportiert jetzt echte
Information.

Verifiziert in QtWebEngine an Mobile (420px) und Desktop (1280px).

---

## r98 · IA-Nachzug: Doppel-Ziele und Naming-Kollision aufgeloest

Drei Folgefehler aus dem r97-Audit gefixt:

**Doppel-Ziele auf Home.** „Kronen, Brücken, Vollkeramik" und
„Implantatversorgung" zeigten beide auf `leistungen.html#zahnersatz`
(gleiches Anker, zwei Eintraege). Veneers landete auf der breiten
Ästhetik-Section, nicht auf Veneers selbst. Jetzt haben die Eintraege
in leistungen.html eigene IDs (`#veneers`, `#kronen`, `#implantat`,
`#prothesen`) und der Klick aus Home landet auf der spezifischen Zeile —
mit dem r97-Hier-sind-Sie-Marker.

**Naming-Kollision aufgeloest.** zahnmedizin.html Kapitel 02 hiess
„Was ich behandle." — identisch zur Home-Section. Verwirrend.
Umbenannt zu „Diagnose, Therapie, Erhalt." (passt zur leistungen.html
Zahnmedizin-Sektion). Dazu eine direkte Handlungs-Anweisung im Intro:
„Klicken Sie eine Leistung an — das Termin-Formular ist mit Ihrem
Anliegen vorbefuellt."

**Gleiche Klarstellung auf prophylaxe.html Kapitel 02.** Intro ergaenzt
um „Klicken Sie eine Leistung an — das Termin-Formular ist vorbefuellt."
— damit niemand denkt, hier sei noch ein weiteres Auswahl-Menue.

---

## r97 · IA-Fix: „Was ich behandle" fuehrt jetzt zur Antwort, nicht zu noch einem Menue

**Das Problem (Nutzer-Feedback):** Klick auf Kapitel 02 / „Was ich behandle"
landete auf einer Unterseite, die ein **weiteres Menue** zeigte — Besucher
mussten nochmal waehlen, bevor sie endlich die Leistung erklaert bekamen.
Verbindungen funktionierten nicht intuitiv.

**Drei strukturelle Aenderungen:**

**1. Home-Link „Professionelle Zahnreinigung" geht jetzt direkt zur
PZR-Erklaerung** statt zur Prophylaxe-Hero. Konkret:
- `prophylaxe.html` Kapitel-01-Section bekam `id="pzr"`
- Eyebrow umbenannt von „PZR · 45 – 60 Minuten" zu „Professionelle
  Zahnreinigung · 45 – 60 Minuten" — sofort klar, was hier erklaert wird
- Termin-CTA „Termin fuer PZR anfragen" am Ende des Abschnitts
- Home-Link `prophylaxe.html` → `prophylaxe.html#pzr`

**2. Leistungen-Seite vereinheitlicht.** Vorher waren die ersten zwei
Kapitel (Vorsorge, Zahnmedizin) Cross-Links zu den Unterseiten, die
letzten zwei (Aesthetik, Zahnersatz) direkt zur Termin-Anfrage —
inkonsistent. Jetzt: **alle 18 Eintraege fuehren direkt zur Termin-Anfrage**
mit passendem Anliegen-Prefill. Wer trotzdem mehr lesen will, findet
unter jeder Kategorie einen kleinen Link „Mehr zur Vorsorge / Zahnmedizin
lesen →".

**3. Ziel-Highlight verstaerkt.** Wer ueber einen Anker auf einer
Unterseite landet (z.B. `zahnmedizin.html#karies`), sieht den Eintrag
jetzt klar markiert: Aubergine-Linke-Kante, helle Aubergine-Schattierung,
Hinweis „✓ Hier sind Sie · zur Anfrage klicken" in italic Serif und
Chevron rechts. Die umliegenden Eintraege sehen normal aus — das macht
sichtbar, dass der gelandete Eintrag die Antwort ist und nicht Teil
eines Auswahl-Menues.

Klick-Pfad jetzt: Home → ein einziger Klick → Erklaerung der gewuenschten
Leistung, klar markiert, mit direktem Booking-Button. Verifiziert in
QtWebEngine.

---

## r96 · Behandlungslisten lesbarer + Klick-Affordanz

**Kategorie-Labels (`.cat`) bekamen mehr Stimme.** Vorher in `--mute`
(#888B96 — fast unsichtbar), jetzt in `--slate` (#56596A). Die kleinen
Annotations rechts neben jeder Behandlung („halbjährlich",
„PZR · 45–60 Min", „kindgerecht", „auf Befund abgestimmt") sind jetzt
lesbar statt nur dekorativ.

**Hover-Chevron als Klickhinweis.** Behandlungs-Listen-Eintraege
fadeten beim Hover bisher nur dezent Farbe und Padding — kein
klassisches Pfeil-Signal. Jetzt schiebt sich beim Hover ein dezenter
`›`-Chevron in Aubergine am rechten Rand rein.

**Mobile: Kategorie-Labels als Uppercase-Caps.** Auf schmalen Screens
schon vorher untenstehend, aber im italic-Serif kaum von der
Beschreibung zu unterscheiden — jetzt klare Uppercase-Caps in
`--mute`-Grau (`PROPHYLAXE`, `ZAHNMEDIZIN`, `ÄSTHETIK`). Mehr Rhythmus
in der gestapelten Liste, ohne den Eintrag selbst zu ueberblenden.

---

## r95 · Bug-Hunt: drei echte Fehler gefixt

**Teilen-Button verliert SVG-Icon nach Kopier-Fallback.** Auf Browsern
ohne Web-Share-API (Desktop) wurde nach dem Klick auf „Teilen" das
Pfeil-Symbol fuer immer zerstoert: `btn.textContent = '...'`
ueberschrieb alle Kindknoten inkl. `<svg>`. Fix: innerHTML statt
textContent zum Wiederherstellen — Icon bleibt erhalten.

**Demo-Mode-Erfolgskarte log uebers Termin-Formular.** Solange Supabase
nicht konfiguriert ist, oeffnet der Submit-Button das E-Mail-Programm
(mailto-Fallback). Die Erfolgskarte zeigte trotzdem „Danke fuer Ihre
Nachricht. Ich melde mich werktags innerhalb von 24 Stunden mit einer
Bestaetigung." — obwohl der Versand am Mail-Client des Besuchers haengt.
Fix: im Demo-Mode wird die Karte zu „Fast geschafft." mit ehrlichem Text:
„Ihr E-Mail-Programm sollte sich gerade geoeffnet haben — bitte tippen
Sie dort auf ‚Senden'…" plus Telefon-Link als Fallback.

**Stagger-Listen flackerten beim Page-Load.** Treatments-, Hours- und
Anchor-Listen bekamen alle Items per JS auf `opacity:0`, auch die schon
im sichtbaren Viewport. Auf langsamen Geraeten kurzer
Sichtbar-Unsichtbar-Sichtbar-Sprung. Fix: getBoundingClientRect() vor
dem Verstecken — Items im initialen Viewport bleiben durchgehend zu
sehen, nur unterhalb wird animiert eingeblendet.

**Nebenbei:** `phoneHref: 'tel:+494022 1528'` in config.js (Tippfehler
mit Leerzeichen in der Nummer) wurde nirgends gelesen — komplett raus,
zusammen mit der inkonsistenten internationalen Telefonnummern-Form.

Alle drei Fixes in QtWebEngine (Chromium-Engine) am realen DOM
verifiziert.

---

## r94 · [hidden]-Schutzregel

Komponentenregeln mit `display: flex/grid` (`.form__error`,
`.form-success`) ueberschrieben das `hidden`-Attribut aus dem
UA-Stylesheet. Auf der Termin-Seite waren dadurch leere Fehlerbox UND
Danke-Karte dauerhaft sichtbar (vor jedem Absenden). Globale Reset-Regel:
`[hidden] { display: none !important; }` — schliesst auch die analogen
Stellen im Admin-Dashboard.

---

## r93 · Social-Card eingebunden

Eigens komponiertes Open-Graph-Bild `og-card.png` (1200 × 630, PNG)
mit Paper-Background, Aubergine-Wordmark (Dental + Italic *Harmonie*),
Headline „Erst zuhören. *Dann behandeln.*", Porträt rechts gerundet
mit Aubergine-Glow-Shadow, Telefonnummer + Domain in der Fußzeile.

Alle 13 Seiten verlinken `og-card.png` als `og:image` (mit
`width/height/type`), `twitter:card` von `summary` auf
`summary_large_image` umgestellt. WhatsApp, Facebook und LinkedIn
zeigen die Vorschau jetzt im richtigen Querformat statt das Hochformat
zu beschneiden.

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
