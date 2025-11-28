/**
 * Form Widget - Generic Engine (v2 Native)
 * Generisches, einbettbares Formular-Widget basierend auf SurveyJS v2
 */

import { Model, Serializer } from 'survey-core';
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
 * Wendet Theme-Farben als CSS-Variablen an
 */
function applyTheme(theme = {}) {
  const root = document.documentElement;
  const defaults = {
    primary: '#2a667b',
    primaryHover: '#78b8bf',
    primaryLight: '#e6f2f4',
    primaryDark: '#1e4a56'
  };

  const colors = { ...defaults, ...theme };

  root.style.setProperty('--fw-primary', colors.primary);
  root.style.setProperty('--fw-primary-hover', colors.primaryHover);
  root.style.setProperty('--fw-primary-light', colors.primaryLight);
  root.style.setProperty('--fw-primary-dark', colors.primaryDark);
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

  // Theme anwenden
  if (options.theme) {
    applyTheme(options.theme);
  }

  // Survey Model erstellen
  const survey = new Model(formConfig);

  // HTML in Beschreibungen rendern
  survey.onTextMarkdown.add((survey, opts) => {
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

  // Event: Formular abgeschlossen
  survey.onComplete.add((sender) => {
    console.log('[FormWidget] Formular abgeschlossen');
    if (options.onComplete && typeof options.onComplete === 'function') {
      options.onComplete(sender.data);
    }
  });

  // V2 Native Rendering (ohne jQuery!)
  const surveyUI = new SurveyModel(survey);
  surveyUI.render(containerId);

  console.log('[FormWidget] Widget initialisiert (v2 Native)');

  return survey;
}

// Global verfügbar machen
if (typeof window !== 'undefined') {
  window.FormWidget = { init: initForm };
  window.ChancenPilot = window.FormWidget;
}

export default initForm;
