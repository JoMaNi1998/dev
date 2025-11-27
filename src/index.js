/**
 * SurveyJS Initialisierung
 * Rendert das Bewerbungsformular im Browser
 */

import { Model } from 'survey-core';
import { cpApplicationTutor } from './survey-config.js';

// SurveyJS Styles
import 'survey-core/survey-core.min.css';

// Survey Model erstellen
const survey = new Model(cpApplicationTutor);

// Event: Wert geändert
survey.onValueChanged.add((sender, options) => {
  console.log(`[Survey] ${options.name} = "${options.value}"`);

  // Position-Logik in Konsole anzeigen
  if (options.name === 'Position') {
    const subjectsPage = sender.getPageByName('subjects');
    const experiencesPage = sender.getPageByName('experiences');
    const qualificationsPage = sender.getPageByName('qualifications');

    console.log(`[Survey] Pages Sichtbarkeit:`);
    console.log(`  - subjects: ${subjectsPage?.isVisible}`);
    console.log(`  - experiences: ${experiencesPage?.isVisible}`);
    console.log(`  - qualifications: ${qualificationsPage?.isVisible}`);
  }
});

// Event: Seite gewechselt
survey.onCurrentPageChanged.add((sender, options) => {
  console.log(`[Survey] Seite: ${options.newCurrentPage.name}`);
});

// Event: Survey abgeschlossen
survey.onComplete.add((sender, options) => {
  console.log('[Survey] Abgeschlossen!');
  console.log('[Survey] Daten:', JSON.stringify(sender.data, null, 2));
});

// Survey im DOM rendern
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('survey-container');
  if (container) {
    survey.render(container);
    console.log('[Survey] Formular geladen');
  } else {
    console.error('[Survey] Container #survey-container nicht gefunden');
  }
});

// Für Tests exportieren
export { survey, cpApplicationTutor };
