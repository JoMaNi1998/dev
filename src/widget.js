/**
 * ChancenPilot Widget
 * Einbettbares Bewerbungsformular für externe Webseiten
 */

import { Model } from 'survey-core';
import 'survey-jquery';
import $ from 'jquery';
import { cpApplicationTutor } from './survey-config.js';

// Styles importieren (Vite bündelt diese)
import 'survey-jquery/defaultV2.min.css';

/**
 * Initialisiert das ChancenPilot Bewerbungsformular
 * @param {string} containerId - ID des Container-Elements
 * @param {Object} options - Optionale Konfiguration
 * @returns {Model} - Survey-Instanz für externe Kontrolle
 */
export function initChancenPilotForm(containerId, options = {}) {
  // 1. Container prüfen
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[ChancenPilot] Container #${containerId} nicht gefunden.`);
    return null;
  }

  // 2. Survey Model erstellen
  const survey = new Model(cpApplicationTutor);

  // 3. HTML in Beschreibungen rendern
  survey.onTextMarkdown.add((survey, options) => {
    options.html = options.text;
  });

  // 4. Event: Wert geändert (für Debugging)
  survey.onValueChanged.add((sender, options) => {
    if (options.name === 'Position') {
      console.log(`[ChancenPilot] Position gewählt: ${options.value}`);
    }
  });

  // 5. Event: Formular abgeschlossen
  survey.onComplete.add((sender) => {
    console.log('[ChancenPilot] Formular abgeschlossen');
    console.log('[ChancenPilot] Daten:', sender.data);

    // Optional: Callback aus options aufrufen
    if (options.onComplete && typeof options.onComplete === 'function') {
      options.onComplete(sender.data);
    }
  });

  // 6. Mit jQuery rendern
  $(function() {
    $(`#${containerId}`).Survey({ model: survey });
    console.log('[ChancenPilot] Formular initialisiert');
  });

  return survey;
}

// Global verfügbar machen für Script-Tag Einbindung
if (typeof window !== 'undefined') {
  window.ChancenPilot = {
    init: initChancenPilotForm
  };
}

export default initChancenPilotForm;
