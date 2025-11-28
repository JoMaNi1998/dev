/**
 * Form Widget
 * Generisches, einbettbares Formular-Widget basierend auf SurveyJS
 */

// Styles (werden automatisch gebündelt)
import 'survey-jquery/defaultV2.min.css';
import './styles/widget.css';

// Config
import { cpApplicationTutor } from './config/tutor-application.js';

// jQuery und SurveyJS werden dynamisch geladen
let $, Model, Serializer, dependenciesLoaded = false;

async function loadDependencies() {
  if (dependenciesLoaded) return;

  // jQuery zuerst laden und global machen
  const jQueryModule = await import('jquery');
  $ = jQueryModule.default;
  window.jQuery = window.$ = $;

  // survey-core für Model und Serializer
  const surveyCore = await import('survey-core');
  Model = surveyCore.Model;
  Serializer = surveyCore.Serializer;

  // survey-jquery für jQuery Plugin (muss nach jQuery global ist)
  await import('survey-jquery');

  // Custom Property registrieren
  Serializer.addProperty("question", {
    name: "helpText",
    type: "text",
    category: "general",
    visibleIndex: 3
  });

  dependenciesLoaded = true;
}

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

    // Klick auf Backdrop schließt Modal
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
 * @param {Object} options - Optionale Konfiguration
 * @param {Object} options.theme - Farb-Theme { primary, primaryHover, primaryLight, primaryDark }
 * @param {Function} options.onComplete - Callback bei Formular-Abschluss
 * @returns {Promise<Model>} - Survey-Instanz für externe Kontrolle
 */
export async function initForm(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[FormWidget] Container #${containerId} nicht gefunden.`);
    return null;
  }

  // Dependencies laden
  await loadDependencies();

  // Theme anwenden
  if (options.theme) {
    applyTheme(options.theme);
  }

  const survey = new Model(cpApplicationTutor);

  // HTML in Beschreibungen rendern
  survey.onTextMarkdown.add((survey, options) => {
    options.html = options.text;
  });

  // Hilfe-Icon in Titel einfügen wenn helpText vorhanden
  survey.onGetQuestionTitleActions.add((sender, options) => {
    if (!options.question.helpText) return;

    const helpAction = {
      id: "help-action",
      title: "Hilfe anzeigen",
      innerCss: "fw-help-icon",
      action: () => {
        showHelpModal(options.question.title, options.question.helpText);
      }
    };

    options.titleActions.push(helpAction);
  });

  // Event: Wert geändert
  survey.onValueChanged.add((sender, options) => {
    if (options.name === 'Position') {
      console.log(`[FormWidget] Position: ${options.value}`);
    }
  });

  // Event: Formular abgeschlossen
  survey.onComplete.add((sender) => {
    console.log('[FormWidget] Formular abgeschlossen');
    if (options.onComplete && typeof options.onComplete === 'function') {
      options.onComplete(sender.data);
    }
  });

  // Mit jQuery rendern
  $(`#${containerId}`).Survey({ model: survey });
  console.log('[FormWidget] Widget initialisiert');

  return survey;
}

// Global verfügbar machen
if (typeof window !== 'undefined') {
  window.FormWidget = { init: initForm };

  // Alias für ChancenPilot (Abwärtskompatibilität)
  window.ChancenPilot = window.FormWidget;
}

export default initForm;
