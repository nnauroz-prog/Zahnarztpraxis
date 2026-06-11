# Go-Live-Checkliste · DentalHarmonie

Was vor dem öffentlichen Start passieren muss.
Geteilt zwischen mir und der Praxis.

---

## Was die Praxis liefert

### Inhalte und Freigaben

- [ ] **Praxis-Portrait freigegeben** — das Foto `IMG_9505.jpeg` darf live gehen
- [ ] **Impressumsangaben bestätigt** — Berufsbezeichnung, Kammer, KZV (siehe `impressum.html`)
- [ ] **Fax-Nummer aktiv?** — aktuell `040 22698898`, ggf. streichen
- [ ] **E-Mail-Adresse** `info@dentalharmonie.de` empfangsbereit
- [ ] **Doctolib-Link** korrekt? Aktuell: `https://www.doctolib.de/zahnmedizin/hamburg/delaram-mostafaei`
- [ ] **Foto-Freigaben Team** (sobald Profile ergänzt werden)

### Domain und Zugänge

- [ ] **Domain `dentalharmonie.de` bei wem registriert?**
- [ ] **Auth-Code / Login-Daten** für DNS-Wechsel oder Nameserver-Anpassung
- [ ] **Bestehende Website?** Falls ja: bei welchem Hoster, was darf abgeschaltet werden
- [ ] **E-Mail-Postfach** existiert bei welchem Anbieter

### Optional, aber empfohlen

- [ ] **Google-My-Business-Eintrag** — vorhanden? Adresse aktuell?
- [ ] **Patientenstamm informieren** — wenn alte Site existierte, kurze Hinweis-Mail
- [ ] **Mitarbeiter-Briefing** — neuer Termin-Anfrage-Weg, Admin-Zugang für Empfang

---

## Was ich vor Go-Live mache

### Technik

- [ ] **Supabase-Projekt** für DentalHarmonie anlegen
- [ ] **Datenbank-Schema** über `setup.sql` einspielen
- [ ] **Storage-Bucket** für Bild-Uploads konfigurieren
- [ ] **Admin-Nutzer** anlegen (E-Mail von Frau Dr. Mostafaei)
- [ ] **`config.js`** mit Live-Credentials befüllen
- [ ] **Cache-Version** auf finalen Stand prüfen
- [ ] **404.html** als Fallback in Hosting-Konfiguration eintragen

### Domain

- [ ] **DNS-Records** setzen (A oder CNAME auf Hosting)
- [ ] **HTTPS-Zertifikat** automatisch oder über Let's Encrypt
- [ ] **`www.dentalharmonie.de`** → `dentalharmonie.de` Weiterleitung
- [ ] **Robots.txt** erlaubt Indexierung (`Allow: /`)
- [ ] **Sitemap** in Google Search Console einreichen

### Test

- [ ] **Form-Submit-Test** mit Test-Eintrag in Datenbank prüfen
- [ ] **Mobile-Test** auf iOS Safari und Android Chrome
- [ ] **Druck-Test** — `cmd+P` auf jeder Seite ergibt sauberes PDF
- [ ] **Lighthouse-Audit** — Mindestens 90er Werte für Performance, A11y, SEO
- [ ] **Open-Graph-Vorschau** in WhatsApp und LinkedIn testen
- [ ] **Schema.org-Validator** (`https://validator.schema.org/`) durchlaufen

---

## Erste 7 Tage nach Go-Live

- [ ] **Google Search Console**: Property hinzufügen, Sitemap einreichen
- [ ] **Bing Webmaster Tools**: dito
- [ ] **Erstes Termin-Anfrage-Test** mit Frau Dr. Mostafaei durchspielen
- [ ] **Admin-Schulung** (45 Min, Video-Call oder vor Ort)
- [ ] **Erste-Hilfe-Karte** für den Empfang ausdrucken (wie kann das Team eine Anfrage im Admin sehen)

---

## Erste 30 Tage

- [ ] **Performance-Check** — Lighthouse erneut, ggf. Bildgrößen optimieren
- [ ] **Inhaltliche Korrektur-Schleife** — was ist im echten Betrieb auffällig
- [ ] **Sprechzeiten-Daten prüfen** — Heute-Marker stimmt? Sonderzeiten Weihnachten / Sommerferien
- [ ] **Erste Patientenrückmeldungen** sammeln

---

## Notfall-Plan

Falls die Site einmal nicht erreichbar ist:

1. **Hosting-Status** bei [Hoster] prüfen
2. **DNS-Resolver** mit `dig dentalharmonie.de` oder über `dnschecker.org`
3. **Datenbank-Status** über Supabase-Dashboard
4. **Fallback-Vereinbarung**: Patientendaten am Telefon `040 221 528` aufnehmen, später in Admin nachtragen

Mein direkter Draht für Notfälle: [IHRE NOTFALL-NUMMER · IHRE E-MAIL]

---

## Übergabe-Dokumente

Was bei Vertragsende oder auf Wunsch jederzeit übergeben wird:

- Komplettes Code-Repository (Git-Bundle)
- Datenbank-Export (SQL-Dump)
- Alle Bilder im Original
- `config.js` mit Production-Credentials (an wen genau übertragen)
- Admin-Liste (welche E-Mail-Adressen haben Zugang)
- DNS-Konfiguration als Screenshot
- Diese Checkliste als ausgefüllter Stand
