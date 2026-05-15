# Übergabe · DentalHarmonie Relaunch

## Status: Etappe 3 abgeschlossen — Site funktionsfähig + live-CMS

Auf Branch `claude/improve-website-presentation-Yp4UY` liegt ein
vollständiges, premiumiges Praxis-Portal mit:

- 12 Seiten mit echten Inhalten und editorialer Struktur
- Vollbild-Menü (Paper-Farbe, weiße Versalien Editorial-Look)
- Termin-Formular mit Supabase-Anbindung (Fallback auf mailto im Demo)
- Anfahrt-Plan auf Kontakt (U-Bahn Uhlandstraße als nächste, Bus, Auto)
- Click-to-Load OpenStreetMap-Karte
- FAQ-Sektion auf Leistungen
- Scroll-Progress, Sticky-Mobile-CTA, Reveal-Animationen
- Manifest + Theme-Color + OG-Image für Social-Share + Print-CSS
- **Admin-Dashboard** mit echtem Supabase-Backend

### Manuelle Schritte zur Inbetriebnahme

1. **Supabase-Projekt** erstellen unter https://supabase.com
2. URL und Anon-Key aus `Settings → API` kopieren
3. In **`config.js`** beide Werte eintragen (Platzhalter `PASTE_HERE` ersetzen)
4. **`setup.sql`** im SQL-Editor des Projekts ausführen — legt an:
   - Tabelle `content` (öffentlich lesbar, Auth-Schreibzugriff)
   - Tabelle `appointment_requests` (Anon-Insert mit Privacy-Checkbox, Auth-CRUD)
   - Storage-Bucket `images`
   - Realtime-Publication auf beiden Tabellen
   - Alle Row-Level-Security-Policies
5. Ersten Admin-Nutzer in Supabase **Authentication → Users → „Add user"** anlegen
6. Auf `https://www.dentalharmonie.de/admin.html` mit dieser E-Mail/Passwort
   anmelden
7. Im Dashboard:
   - **Banner**: bei Bedarf aktivieren (Praxis-Schließung etc.)
   - **Sprechzeiten**: aktuelle Zeiten eintragen oder bestätigen
   - **Kontakt**: Praxis-Stammdaten prüfen
   - **Bilder**: erste Praxis-Bilder (Empfang, Behandlungszimmer) hochladen
8. **Rechtstexte** (`impressum.html`, `datenschutz.html`) durch eine
   Anwältin oder einen Anwalt prüfen lassen

### Admin-Dashboard — was es kann

Nach dem Login (über `admin.html`) öffnet sich ein Dashboard mit
seitlicher Navigation und folgenden Bereichen:

- **Übersicht**: Zahl der neuen Anfragen, Banner-Status, Öffnungszeit-
  Einträge auf einen Blick. Click-Through in die jeweiligen Panels.
- **Terminanfragen**: alle eingegangenen Anfragen, neueste zuerst,
  mit Status-Update (Neu / In Bearbeitung / Erledigt / Archiviert),
  Lösch-Aktion und automatischer Live-Aktualisierung über Supabase
  Realtime. Filter nach Status.
- **Hinweisbanner**: Ein-/Aus-Schalter und Text-Eingabe. Wenn aktiv,
  erscheint der Text ganz oben auf allen öffentlichen Seiten.
- **Sprechzeiten**: Wochenpläne mit Time-Inputs. Leerlassen heißt
  geschlossen.
- **Kontakt**: Praxisname, Inhaberin, Adresse, Telefon, E-Mail —
  wird in der gesamten Site verwendet (Read über `dentalDb.get`).
- **Bilder**: Datei-Upload in den `images`-Bucket mit optionalem
  Slot/Kategorie-Prefix. Liefert direkt eine öffentliche URL zurück.

Realtime: das Dashboard abonniert beide Tabellen — wenn eine neue
Anfrage eingeht, taucht sie ohne Reload auf.

Abmelden: oben links per „Abmelden"-Button (löst Auth-Signout und Reload aus).

### Demo-Mode (vor Supabase-Konfiguration)

- Solange `SUPABASE_URL === 'PASTE_HERE'` in `config.js` steht,
  läuft alles im **Demo-Mode**:
- Lesezugriffe (`get(key)`) liefern sinnvolle Defaults
- Schreibzugriffe lehnen sauber mit Hinweis ab
- Das Termin-Formular fällt auf `mailto:info@dentalharmonie.de`
  zurück und öffnet das Mail-Programm vorausgefüllt
- Der Admin-Login zeigt eine klare Fehlermeldung

### Datei-Karte

| Datei | Zweck |
|---|---|
| `config.js` | Praxis-Stammdaten, Supabase-Schlüssel, Cache-Version |
| `db.js` | Vollständiger Supabase-Wrapper (Auth, Content, Storage, Realtime) — Demo-Fallback bei fehlender Konfiguration |
| `script.js` | Header, Menü, Reveal, Consent, Termin-Form, Map, Scroll-Progress, Sticky-CTA, FAQ |
| `admin.js` | Admin-Dashboard (Login, Panels, Realtime-Updates, CRUD für alle Inhalte) |
| `styles.css` | Designsystem + Layout + Inhalts-Komponenten + Editorial-Komponenten + Print + Admin |
| `setup.sql` | Supabase-Schema (Tabellen, RLS, Storage, Realtime) |
| `_headers` | HSTS, CSP, Cache-Header, Robots-Tag |
| `netlify.toml` | Netlify-Build und 404-Fallback |
| `manifest.webmanifest` | Web-App-Manifest |
| `sitemap.xml`, `robots.txt` | SEO |

### Was offen bleibt (auf Wunsch der Praxis)

- Echte Praxis-Fotos (Behandlungszimmer, Empfang) — über das Admin-
  Bilder-Panel hochladbar, dann von Hand auf den jeweiligen Seiten
  einsetzen oder als „hero-home"-Inhalt referenzieren
- Anwaltliche Prüfung von Impressum + Datenschutz
- Eventuell Doctolib-Integration über deren Embed-Widget
