import { describe, it, expect, beforeEach } from 'vitest';
import { Model } from 'survey-core';
import { cpApplicationTutor } from '../src/survey-config.js';

/**
 * Test Suite für das SurveyJS Bewerbungsformular
 * Testet Validierung, bedingte Logik und Formular-Struktur
 */
describe('SurveyJS: cp-application-tutor', () => {
  let survey;

  beforeEach(() => {
    // Frisches Survey-Model für jeden Test
    survey = new Model(cpApplicationTutor);
  });

  // ============================================
  // 1. FORMULAR-STRUKTUR
  // ============================================
  describe('1. Formular-Struktur', () => {
    it('sollte den korrekten Titel haben', () => {
      expect(survey.title).toBe('Bewerbung als Lehrkraft');
    });

    it('sollte 5 Pages haben', () => {
      expect(survey.pages.length).toBe(5);
    });

    it('sollte alle erwarteten Page-Namen haben', () => {
      const pageNames = survey.pages.map(p => p.name);
      expect(pageNames).toContain('personal');
      expect(pageNames).toContain('subjects');
      expect(pageNames).toContain('experiences');
      expect(pageNames).toContain('qualifications');
      expect(pageNames).toContain('contact');
    });

    it('sollte Progress-Bar anzeigen', () => {
      expect(survey.showProgressBar).toBeTruthy();
    });
  });

  // ============================================
  // 2. BEDINGTE LOGIK (visibleIf)
  // ============================================
  describe('2. Bedingte Logik', () => {

    describe('Position: Assistenz-Lehrkraft', () => {
      beforeEach(() => {
        survey.setValue('Position', 'Assistenz-Lehrkraft');
      });

      it('sollte Page "subjects" sichtbar machen', () => {
        const subjectsPage = survey.getPageByName('subjects');
        expect(subjectsPage.isVisible).toBe(true);
      });

      it('sollte Page "experiences" sichtbar machen', () => {
        const experiencesPage = survey.getPageByName('experiences');
        expect(experiencesPage.isVisible).toBe(true);
      });

      it('sollte Page "qualifications" verstecken', () => {
        const qualificationsPage = survey.getPageByName('qualifications');
        expect(qualificationsPage.isVisible).toBe(false);
      });

      it('sollte Studienfelder sichtbar machen', () => {
        const universityQuestion = survey.getQuestionByName('university');
        const studySubjectQuestion = survey.getQuestionByName('study_subject');
        const semesterQuestion = survey.getQuestionByName('semester');

        expect(universityQuestion.isVisible).toBe(true);
        expect(studySubjectQuestion.isVisible).toBe(true);
        expect(semesterQuestion.isVisible).toBe(true);
      });
    });

    describe('Position: Therapeutische Unterstützung', () => {
      beforeEach(() => {
        survey.setValue('Position', 'Therapeutische Unterstützung');
      });

      it('sollte Page "subjects" verstecken', () => {
        const subjectsPage = survey.getPageByName('subjects');
        expect(subjectsPage.isVisible).toBe(false);
      });

      it('sollte Page "experiences" verstecken', () => {
        const experiencesPage = survey.getPageByName('experiences');
        expect(experiencesPage.isVisible).toBe(false);
      });

      it('sollte Page "qualifications" sichtbar machen', () => {
        const qualificationsPage = survey.getPageByName('qualifications');
        expect(qualificationsPage.isVisible).toBe(true);
      });

      it('sollte Studienfelder verstecken', () => {
        const universityQuestion = survey.getQuestionByName('university');
        const studySubjectQuestion = survey.getQuestionByName('study_subject');
        const semesterQuestion = survey.getQuestionByName('semester');

        expect(universityQuestion.isVisible).toBe(false);
        expect(studySubjectQuestion.isVisible).toBe(false);
        expect(semesterQuestion.isVisible).toBe(false);
      });
    });

    describe('Keine Position ausgewählt', () => {
      it('sollte alle bedingten Pages verstecken', () => {
        // Ohne Position-Auswahl
        const subjectsPage = survey.getPageByName('subjects');
        const experiencesPage = survey.getPageByName('experiences');
        const qualificationsPage = survey.getPageByName('qualifications');

        expect(subjectsPage.isVisible).toBe(false);
        expect(experiencesPage.isVisible).toBe(false);
        expect(qualificationsPage.isVisible).toBe(false);
      });
    });
  });

  // ============================================
  // 3. VALIDIERUNG
  // ============================================
  describe('3. Validierung', () => {

    it('sollte Pflichtfelder als required markieren', () => {
      const firstName = survey.getQuestionByName('first_name');
      const lastName = survey.getQuestionByName('last_name');
      const position = survey.getQuestionByName('Position');
      const email = survey.getQuestionByName('email');

      expect(firstName.isRequired).toBe(true);
      expect(lastName.isRequired).toBe(true);
      expect(position.isRequired).toBe(true);
      expect(email.isRequired).toBe(true);
    });

    it('sollte E-Mail-Validator haben', () => {
      const email = survey.getQuestionByName('email');
      const hasEmailValidator = email.validators.some(v => v.getType() === 'emailvalidator');
      expect(hasEmailValidator).toBe(true);
    });

    it('sollte PLZ-Validator haben', () => {
      const postalCode = survey.getQuestionByName('postal_code');
      const hasRegexValidator = postalCode.validators.some(v => v.getType() === 'regexvalidator');
      expect(hasRegexValidator).toBe(true);
    });

    it('sollte Formular mit leeren Pflichtfeldern als ungültig erkennen', () => {
      // Erste Seite validieren ohne Daten
      const page = survey.getPageByName('personal');
      expect(page.hasErrors()).toBe(true);
    });

    it('sollte Formular mit gültigen Daten akzeptieren', () => {
      // Pflichtfelder ausfüllen
      survey.setValue('gender', '1');
      survey.setValue('first_name', 'Max');
      survey.setValue('last_name', 'Mustermann');
      survey.setValue('Position', 'Assistenz-Lehrkraft');

      const page = survey.getPageByName('personal');
      expect(page.hasErrors()).toBe(false);
    });
  });

  // ============================================
  // 4. DYNAMIC PANELS (Fächer/Erfahrungen)
  // ============================================
  describe('4. Dynamic Panels', () => {

    it('sollte Fächer als paneldynamic haben', () => {
      const subjects = survey.getQuestionByName('subjects');
      expect(subjects.getType()).toBe('paneldynamic');
    });

    it('sollte minPanelCount=1 für Fächer haben', () => {
      const subjects = survey.getQuestionByName('subjects');
      expect(subjects.minPanelCount).toBe(1);
    });

    it('sollte Erfahrungen als paneldynamic haben', () => {
      const experiences = survey.getQuestionByName('experiences');
      expect(experiences.getType()).toBe('paneldynamic');
    });

    it('sollte Qualifikationen als paneldynamic haben', () => {
      const qualifications = survey.getQuestionByName('qualifications');
      expect(qualifications.getType()).toBe('paneldynamic');
    });
  });

  // ============================================
  // 5. NAVIGATION
  // ============================================
  describe('5. Navigation', () => {

    it('sollte mit erster Page starten', () => {
      expect(survey.currentPageNo).toBe(0);
      expect(survey.currentPage.name).toBe('personal');
    });

    it('sollte zur nächsten sichtbaren Page navigieren können', () => {
      // Pflichtfelder ausfüllen
      survey.setValue('gender', '1');
      survey.setValue('first_name', 'Max');
      survey.setValue('last_name', 'Mustermann');
      survey.setValue('Position', 'Assistenz-Lehrkraft');

      // Zur nächsten Seite
      survey.nextPage();

      // Sollte bei "subjects" sein (da Assistenz-Lehrkraft)
      expect(survey.currentPage.name).toBe('subjects');
    });

    it('sollte versteckte Pages überspringen', () => {
      // Therapeutische Unterstützung wählen
      survey.setValue('gender', '1');
      survey.setValue('first_name', 'Max');
      survey.setValue('last_name', 'Mustermann');
      survey.setValue('Position', 'Therapeutische Unterstützung');

      survey.nextPage();

      // Sollte "subjects" und "experiences" überspringen und bei "qualifications" sein
      expect(survey.currentPage.name).toBe('qualifications');
    });
  });

  // ============================================
  // 6. DATEN-HANDLING
  // ============================================
  describe('6. Daten-Handling', () => {

    it('sollte Werte korrekt speichern', () => {
      survey.setValue('first_name', 'Max');
      survey.setValue('last_name', 'Mustermann');
      survey.setValue('email', 'max@test.de');

      expect(survey.getValue('first_name')).toBe('Max');
      expect(survey.getValue('last_name')).toBe('Mustermann');
      expect(survey.getValue('email')).toBe('max@test.de');
    });

    it('sollte alle Daten als JSON exportieren können', () => {
      survey.setValue('first_name', 'Max');
      survey.setValue('Position', 'Assistenz-Lehrkraft');

      const data = survey.data;

      expect(data.first_name).toBe('Max');
      expect(data.Position).toBe('Assistenz-Lehrkraft');
    });

    it('sollte Daten beim Reset leeren', () => {
      survey.setValue('first_name', 'Max');
      survey.clear();

      expect(survey.getValue('first_name')).toBeUndefined();
    });
  });

  // ============================================
  // 7. DROPDOWN OPTIONEN
  // ============================================
  describe('7. Dropdown Optionen', () => {

    it('sollte Position-Optionen haben', () => {
      const position = survey.getQuestionByName('Position');
      const choices = position.choices.map(c => c.value);

      expect(choices).toContain('Assistenz-Lehrkraft');
      expect(choices).toContain('Therapeutische Unterstützung');
    });

    it('sollte alle Fächer-Optionen haben', () => {
      const subjects = survey.getQuestionByName('subjects');
      const template = subjects.templateElements.find(e => e.name === 'subject');
      const choices = template.choices.map(c => c.value);

      expect(choices).toContain('mathematik');
      expect(choices).toContain('deutsch');
      expect(choices).toContain('englisch');
      expect(choices.length).toBeGreaterThan(10);
    });

    it('sollte 13 Klassenstufen haben', () => {
      const subjects = survey.getQuestionByName('subjects');
      const gradeFrom = subjects.templateElements.find(e => e.name === 'grade_from');

      expect(gradeFrom.choices.length).toBe(13);
    });
  });
});
