/**
 * Form Widget - Generic Engine (v2 Native)
 * Generisches, einbettbares Formular-Widget basierend auf SurveyJS v2
 */

import { Serializer } from 'survey-core';
import { SurveyModel } from 'survey-js-ui';

// Styles
import 'survey-core/survey-core.min.css';
import './styles/widget.css';

// Custom Property "helpText" für Fragen registrieren
Serializer.addProperty("question", {
  name: "helpText",
  type: "text",
  category: "general",
  visibleIndex: 3
});

// Custom Property "popupMode" für paneldynamic
Serializer.addProperty("paneldynamic", {
  name: "popupMode",
  type: "boolean",
  default: false,
  category: "general"
});

/**
 * Zeigt ein Modal mit Hilfetext an
 */
function showHelpModal(title, text) {
  let modal = document.getElementById('fw-help-modal');

  if (!modal) {
    const modalHtml = `
      <dialog id="fw-help-modal" class="fw-modal">
        <div class="fw-modal-header">
          <span id="fw-modal-title"></span>
          <button onclick="document.getElementById('fw-help-modal').close()" class="fw-modal-close">&times;</button>
        </div>
        <div class="fw-modal-content" id="fw-modal-content"></div>
        <div class="fw-modal-footer">
          <button onclick="document.getElementById('fw-help-modal').close()" class="fw-modal-btn">Verstanden</button>
        </div>
      </dialog>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    modal = document.getElementById('fw-help-modal');

    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom ||
          e.clientX < rect.left || e.clientX > rect.right) {
        modal.close();
      }
    });
  }

  document.getElementById('fw-modal-title').innerText = title;
  document.getElementById('fw-modal-content').innerHTML = text;
  modal.showModal();
}

/**
 * Erstellt das Dynamic Popup Modal (einmalig)
 */
function createDynamicModal() {
  if (document.getElementById('fw-dynamic-modal')) return;

  const modalHtml = `
    <dialog id="fw-dynamic-modal" class="fw-modal">
      <div class="fw-modal-header">
        <span id="fw-dynamic-title">Eintrag hinzufügen</span>
        <button id="fw-dynamic-close" class="fw-modal-close">&times;</button>
      </div>
      <div id="fw-dynamic-body" class="fw-popup-survey-container"></div>
      <div class="fw-modal-actions">
        <button class="fw-btn-secondary" id="fw-dynamic-cancel">Abbrechen</button>
        <button class="fw-btn-primary" id="fw-dynamic-save">Hinzufügen</button>
      </div>
    </dialog>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const modal = document.getElementById('fw-dynamic-modal');

  // Close Button
  document.getElementById('fw-dynamic-close').onclick = () => modal.close();
  document.getElementById('fw-dynamic-cancel').onclick = () => modal.close();

  // Click außerhalb schließt Modal
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    if (e.clientY < rect.top || e.clientY > rect.bottom ||
        e.clientX < rect.left || e.clientX > rect.right) {
      modal.close();
    }
  });
}

/**
 * Öffnet das Popup für einen neuen Panel-Eintrag
 */
function openDynamicPopup(question) {
  createDynamicModal();

  const modal = document.getElementById('fw-dynamic-modal');
  const bodyEl = document.getElementById('fw-dynamic-body');
  const titleEl = document.getElementById('fw-dynamic-title');
  const saveBtn = document.getElementById('fw-dynamic-save');

  // Titel setzen (Emoji entfernen falls vorhanden)
  const titleText = (question.panelAddText || 'Eintrag hinzufügen').replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, '');
  titleEl.innerText = titleText;

  // Mini-Survey Config aus den templateElements erstellen
  const elements = [];
  for (let i = 0; i < question.templateElements.length; i++) {
    const el = question.templateElements[i];

    // Manuell die wichtigsten Properties extrahieren
    const json = {
      type: el.getType(),
      name: el.name,
      title: el.title || el.name,
      isRequired: el.isRequired || false
    };

    // Choices für Dropdowns/Radiobuttons
    if (el.choices && el.choices.length > 0) {
      json.choices = el.choices.map(c => {
        if (typeof c === 'object' && c !== null) {
          return { value: c.value, text: c.text || c.value };
        }
        return c;
      });
    }

    // Placeholder
    if (el.placeholder) {
      json.placeholder = el.placeholder;
    }

    elements.push(json);
  }

  console.log('[FormWidget] Popup elements:', elements);

  const popupConfig = {
    elements: elements,
    showNavigationButtons: false,
    showQuestionNumbers: 'off',
    questionErrorLocation: 'bottom'
  };

  // Mini-Survey erstellen und rendern
  const popupSurvey = new SurveyModel(popupConfig);

  // Container leeren und neu rendern
  bodyEl.innerHTML = '';

  // Wrapper für das Survey erstellen
  const surveyWrapper = document.createElement('div');
  surveyWrapper.className = 'fw-popup-survey';
  bodyEl.appendChild(surveyWrapper);

  // Survey rendern
  popupSurvey.render(surveyWrapper);

  console.log('[FormWidget] Popup survey rendered:', popupSurvey.getAllQuestions().length, 'questions');

  // Save Button Handler (neu binden)
  const newSaveBtn = saveBtn.cloneNode(true);
  saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

  newSaveBtn.onclick = () => {
    // Validierung
    const isValid = popupSurvey.validate(true, true);

    if (isValid) {
      // Daten holen und zur Liste hinzufügen
      const newData = popupSurvey.data;
      const currentValue = question.value || [];
      question.value = [...currentValue, newData];

      modal.close();
    }
  };

  modal.showModal();
}

/**
 * Fügt den Custom Add-Button für paneldynamic mit popupMode hinzu
 */
function setupDynamicPopupButton(question, htmlElement) {
  // Prüfen ob Button schon existiert
  if (htmlElement.querySelector('.fw-add-button-container')) return;

  // Popup-Mode Klasse auf das paneldynamic Element setzen
  const panelDynamic = htmlElement.querySelector('.sd-paneldynamic');
  if (panelDynamic) {
    panelDynamic.classList.add('fw-popup-mode');
  }

  // Lösch-Buttons zu bestehenden Panels hinzufügen
  addDeleteButtonsToPanels(question, htmlElement);

  // Bei Änderungen der Panel-Anzahl neu rendern (MutationObserver)
  const observer = new MutationObserver(() => {
    addDeleteButtonsToPanels(question, htmlElement);
  });
  const panelsContainer = htmlElement.querySelector('.sd-paneldynamic__panels-container');
  if (panelsContainer) {
    observer.observe(panelsContainer, { childList: true, subtree: true });
  }

  // Button Container erstellen
  const btnContainer = document.createElement('div');
  btnContainer.className = 'fw-add-button-container';
  btnContainer.innerHTML = `
    <button type="button" class="fw-add-btn">
      ${question.panelAddText || '➕ Eintrag hinzufügen'}
    </button>
  `;

  // Click Handler
  btnContainer.querySelector('button').onclick = () => openDynamicPopup(question);

  // Am Ende der Frage einfügen
  const panelRoot = panelDynamic || htmlElement;
  panelRoot.appendChild(btnContainer);
}

/**
 * Fügt Lösch-Buttons zu den Panel-Einträgen hinzu
 */
function addDeleteButtonsToPanels(question, htmlElement) {
  const panels = htmlElement.querySelectorAll('.sd-paneldynamic__panel-wrapper');

  panels.forEach((panel, index) => {
    // Prüfen ob Button schon existiert
    if (panel.querySelector('.fw-delete-btn')) return;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'fw-delete-btn';
    deleteBtn.innerHTML = '🗑️';
    deleteBtn.title = 'Entfernen';
    deleteBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      question.removePanel(index);
    };

    // Button zum Panel hinzufügen
    const sdPanel = panel.querySelector('.sd-panel');
    if (sdPanel) {
      sdPanel.appendChild(deleteBtn);
    }
  });
}

/**
 * Aktiviert den Preview-Modus (CSS übernimmt das Styling)
 */
function enablePreviewMode(container) {
  container.classList.add('fw-preview-mode');
  console.log('[FormWidget] Preview-Modus aktiviert');
}

/**
 * Deaktiviert den Preview-Modus
 */
function disablePreviewMode(container) {
  container.classList.remove('fw-preview-mode');
  console.log('[FormWidget] Preview-Modus deaktiviert');
}

/**
 * Wendet Theme-Einstellungen als CSS-Variablen auf den Container an (nicht global!)
 * Ermöglicht Corporate Identity Anpassung für verschiedene Kunden-Webseiten
 */
function applyTheme(container, theme = {}) {
  const defaults = {
    // 1. Farben (Branding)
    primary: '#2a667b',
    primaryHover: '#78b8bf',
    primaryLight: '#e6f2f4',
    primaryDark: '#1e4a56',

    // 2. Form (Stil: Modern vs. Klassisch)
    radius: '12px',           // Standard: Leicht abgerundet

    // 3. Typografie (Integration)
    fontFamily: 'inherit',    // Standard: Nimm die Font der Webseite! (Best Practice)

    // 4. Farben (Dark Mode / Kontrast)
    background: '#ffffff',
    text: '#111827',
    border: '#e5e7eb'
  };

  const s = { ...defaults, ...theme };

  // CSS Variablen direkt auf Container setzen -> kein Konflikt mit Host-Seite
  const style = container.style;

  // Branding Farben
  style.setProperty('--fw-primary', s.primary);
  style.setProperty('--fw-primary-hover', s.primaryHover);
  style.setProperty('--fw-primary-light', s.primaryLight);
  style.setProperty('--fw-primary-dark', s.primaryDark);

  // Form & Typografie
  style.setProperty('--fw-radius', s.radius);
  style.setProperty('--fw-font-family', s.fontFamily);

  // Dark Mode / Kontrast
  style.setProperty('--fw-bg', s.background);
  style.setProperty('--fw-text', s.text);
  style.setProperty('--fw-border', s.border);
}

/**
 * Initialisiert das Formular-Widget
 * @param {string} containerId - ID des Container-Elements
 * @param {Object} formConfig - Das SurveyJS JSON Config-Objekt
 * @param {Object} options - Optionale Konfiguration
 * @returns {Model} - Survey-Instanz
 */
export function initForm(containerId, formConfig, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[FormWidget] Container #${containerId} nicht gefunden.`);
    return null;
  }

  // Container-Klasse hinzufügen (für Widget-Styles)
  container.classList.add('fw-container');

  // Theme anwenden (immer, damit Defaults gesetzt werden)
  applyTheme(container, options.theme || {});

  // Survey Model erstellen (SurveyModel direkt mit JSON)
  const survey = new SurveyModel(formConfig);

  // HTML in Beschreibungen rendern
  survey.onTextMarkdown.add((sender, opts) => {
    opts.html = opts.text;
  });

  // Hilfe-Icon mit Fragezeichen
  survey.onGetQuestionTitleActions.add((sender, opts) => {
    if (!opts.question.helpText) return;

    opts.titleActions.push({
      id: "help-action",
      component: "sv-action-bar-item",
      title: "Hilfe anzeigen",
      showTitle: false,
      data: { title: "❓" },
      innerCss: "fw-help-icon",
      action: () => showHelpModal(opts.question.title, opts.question.helpText)
    });
  });

  // Dynamic Popup für paneldynamic mit popupMode
  survey.onAfterRenderQuestion.add((sender, opts) => {
    const question = opts.question;

    // Nur für paneldynamic mit popupMode: true
    if (question.getType() === 'paneldynamic' && question.popupMode) {
      setupDynamicPopupButton(question, opts.htmlElement);
    }
  });

  // Preview-Mode aktivieren
  survey.onShowingPreview.add((sender) => {
    enablePreviewMode(container);
  });

  // Preview-Mode deaktivieren wenn man "Bearbeiten" klickt
  survey.onCurrentPageChanged.add((sender, options) => {
    if (!sender.isShowingPreview) {
      disablePreviewMode(container);
    }
  });

  // Event: Formular abgeschlossen
  survey.onComplete.add((sender) => {
    console.log('[FormWidget] Formular abgeschlossen');
    if (options.onComplete && typeof options.onComplete === 'function') {
      options.onComplete(sender.data);
    }
  });

  // V2 Vanilla Rendering (benötigt DOM-Element, nicht ID-String)
  survey.render(container);

  console.log('[FormWidget] Widget initialisiert (v2 Vanilla)');

  return survey;
}

// Global verfügbar machen
if (typeof window !== 'undefined') {
  window.FormWidget = { init: initForm };
  window.ChancenPilot = window.FormWidget;
}

export default initForm;
