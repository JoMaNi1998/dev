# Project Context: Chancen-Pilot Form Widget

## 1. Projektüberblick
Ein eigenständiges, einbettbares Formular-Widget für "Chancen-Pilot", basierend auf **SurveyJS (v2 Native)** und **Vite**. Das Ziel ist ein leichtgewichtiges Widget, das ohne Framework-Abhängigkeiten (wie React/Vue) auf beliebigen Webseiten eingebunden werden kann.

## 2. Tech Stack
- **Build Tool:** Vite 5.x
- **Sprache:** Vanilla JavaScript (ES Modules)
- **Kern-Bibliotheken:**
  - `survey-core` (Logik & Model)
  - `survey-js-ui` (Rendering)
- **Testing:** Vitest
- **Styling:** Natives CSS mit CSS Custom Properties (Variables)

## 3. Architektur & Dateistruktur

### Kern-Dateien
- **`src/widget.js`**: Der Entry-Point.
  - Initialisiert das Survey-Model.
  - Registriert Custom Properties (`helpText`, `popupMode`) im SurveyJS Serializer.
  - Handhabt DOM-Manipulationen (Custom Modals, Preview-Logik).
- **`src/config/*.js`**: Enthält die Survey-JSON-Konfigurationen (getrennt von der Logik).
- **`src/styles/widget.css`**: Zentrales Stylesheet.
  - Definiert CSS-Variablen (`--fw-*`) für Theming.
  - Überschreibt SurveyJS-Styles (`.sd-*`) gescoped auf `.fw-container`.

### Design-System
- **Prefixing:** Eigene CSS-Klassen nutzen `fw-` (Form Widget), um Konflikte zu vermeiden.
- **Scoping:** Das Widget lebt innerhalb eines Containers mit der ID, die an `initForm` übergeben wird. Dieser erhält die Klasse `.fw-container`.
- **Theming:** Farben und Fonts werden über CSS-Variablen gesteuert (`--fw-primary`, `--fw-font-family`), die zur Laufzeit überschrieben werden können.

## 4. Coding Guidelines & Patterns

### SurveyJS Customization
- Wir nutzen **keine** Framework-Komponenten, sondern manipulieren das DOM direkt über SurveyJS-Events (z.B. `onAfterRenderQuestion`).
- **Custom Panel Mode:** Für `paneldynamic` Fragen wurde ein `popupMode` implementiert. Statt der Standard-Liste wird ein Modal geöffnet, um neue Einträge hinzuzufügen.

### Best Practices für dieses Projekt
1.  **Logic vs. Style:** Keine Inline-Styles (`style.cssText`) in JS verwenden, wenn möglich. Klassen toggeln und Styles in `widget.css` definieren.
2.  **Sicherheit:** Vorsicht bei `innerHTML`. Benutzereingaben dürfen nicht ungeprüft in Modals gerendert werden.
3.  **Performance:** Bevorzuge native SurveyJS-Events (`onAfterRenderPanel`) gegenüber `MutationObserver` oder `setTimeout`.

## 5. Build & Run
- **Development:** `npm run dev` (Startet Vite Server mit `index.html` als Playground).
- **Production Build:** `npm run build` (Erzeugt optimiertes JS/CSS im `dist/` Ordner für die Einbettung).
- **Tests:** `npm run test` (Vitest Unit Tests).

## 6. Bekannte "Gotchas"
- Das Widget muss robust gegenüber dem CSS der Host-Seite sein (daher hohe Spezifität oder `!important` in `widget.css` bei Overrides).
- Der "Preview Mode" ist eine reine CSS/DOM-Transformation, keine native SurveyJS-Funktion. Änderungen hier erfordern Anpassungen in `enablePreviewMode` (`widget.js`) und den entsprechenden CSS-Klassen.