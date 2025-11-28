/**
 * SurveyJS Config: Tutor Application Form
 * Bewerbungsformular für Assistenz-Lehrkräfte und Therapeuten
 */

export const cpApplicationTutor = {
  title: "Bewerbung als Lehrkraft",
  description: "Chancen-Pilot Bewerbungsformular",
  logoPosition: "right",
  showProgressBar: "top",
  progressBarType: "questions",
  goNextPageAutomatic: false,
  showNavigationButtons: true,
  showQuestionNumbers: "off",
  questionErrorLocation: "bottom",

  // Zusammenfassung vor dem Absenden
  showPreviewBeforeComplete: "showAllQuestions",
  previewText: "Angaben prüfen",
  editText: "Bearbeiten",
  completeText: "Jetzt verbindlich absenden",

  // Completion
  completedHtml: `
    <div style="text-align: center; padding: 40px;">
      <h2>Bewerbung erfolgreich eingereicht!</h2>
      <p>Vielen Dank für deine Bewerbung als Nachhilfekraft. Wir haben deine Daten erhalten und werden uns in Kürze bei dir melden.</p>
    </div>
  `,

  pages: [
    // PAGE 1: Persönliche Daten
    {
      name: "personal",
      title: "Persönliche Daten",
      description: "Grundlegende Informationen über dich",
      elements: [
        {
          type: "radiogroup",
          name: "gender",
          title: "Anrede",
          isRequired: true,
          choices: [
            { value: "1", text: "Herr" },
            { value: "2", text: "Frau" },
            { value: "3", text: "Divers" }
          ],
          colCount: 3
        },
        {
          type: "text",
          name: "first_name",
          title: "Vorname",
          isRequired: true,
          placeholder: "Max"
        },
        {
          type: "text",
          name: "last_name",
          title: "Nachname",
          isRequired: true,
          placeholder: "Mustermann"
        },
        {
          type: "dropdown",
          name: "Position",
          title: "Bewerben als",
          isRequired: true,
          helpText: "<strong>Assistenz-Lehrkraft:</strong> Unterstütze Lehrkräfte im regulären Unterricht und bei der individuellen Förderung von Schülern.<br><br><strong>Therapeutische Unterstützung:</strong> Biete spezialisierte therapeutische Hilfe für Lernende mit besonderen Bedarfen (z.B. Logopädie, Ergotherapie, Lerntherapie).",
          choices: [
            { value: "Assistenz-Lehrkraft", text: "Assistenz-Lehrkraft" },
            { value: "Therapeutische Unterstützung", text: "Therapeutische Unterstützung" }
          ]
        }
      ]
    },

    // PAGE 2: Unterrichtsfächer (nur für Assistenz-Lehrkraft)
    {
      name: "subjects",
      title: "Unterrichtsfächer",
      description: "Welche Fächer kannst du unterrichten?",
      visibleIf: "{Position} = 'Assistenz-Lehrkraft'",
      elements: [
        {
          type: "paneldynamic",
          name: "subjects",
          title: "Fächer hinzufügen",
          panelAddText: "Fach hinzufügen",
          panelRemoveText: "Entfernen",
          minPanelCount: 1,
          maxPanelCount: 10,
          templateElements: [
            {
              type: "dropdown",
              name: "subject",
              title: "Fach",
              isRequired: true,
              choices: [
                { value: "mathematik", text: "Mathematik" },
                { value: "deutsch", text: "Deutsch" },
                { value: "daf", text: "Deutsch als Fremdsprache (DaF)" },
                { value: "daz", text: "Deutsch als Zweitsprache (DaZ)" },
                { value: "englisch", text: "Englisch" },
                { value: "franzoesisch", text: "Französisch" },
                { value: "spanisch", text: "Spanisch" },
                { value: "latein", text: "Latein" },
                { value: "physik", text: "Physik" },
                { value: "chemie", text: "Chemie" },
                { value: "biologie", text: "Biologie" },
                { value: "geschichte", text: "Geschichte" },
                { value: "erdkunde", text: "Erdkunde" },
                { value: "politik", text: "Politik" },
                { value: "wirtschaft", text: "Wirtschaft" },
                { value: "bwl", text: "BWL" },
                { value: "informatik", text: "Informatik" },
                { value: "technik", text: "Technik" },
                { value: "kunst", text: "Kunst" },
                { value: "musik", text: "Musik" },
                { value: "sport", text: "Sport" },
                { value: "religion", text: "Religion" },
                { value: "philosophie", text: "Philosophie" }
              ]
            },
            {
              type: "dropdown",
              name: "grade_from",
              title: "Klasse von",
              isRequired: true,
              choices: Array.from({ length: 13 }, (_, i) => ({
                value: String(i + 1),
                text: `${i + 1}. Klasse`
              }))
            },
            {
              type: "dropdown",
              name: "grade_to",
              title: "Klasse bis",
              isRequired: true,
              choices: Array.from({ length: 13 }, (_, i) => ({
                value: String(i + 1),
                text: `${i + 1}. Klasse`
              }))
            }
          ]
        }
      ]
    },

    // PAGE 3: Erfahrungen (für Assistenz-Lehrkraft)
    {
      name: "experiences",
      title: "Erfahrungen & Qualifikationen",
      description: "Deine bisherigen Erfahrungen",
      visibleIf: "{Position} = 'Assistenz-Lehrkraft'",
      elements: [
        {
          type: "paneldynamic",
          name: "experiences",
          title: "Erfahrungen hinzufügen",
          panelAddText: "Erfahrung hinzufügen",
          panelRemoveText: "Entfernen",
          minPanelCount: 1,
          maxPanelCount: 10,
          templateElements: [
            {
              type: "dropdown",
              name: "experience_type",
              title: "Art der Erfahrung",
              isRequired: true,
              choices: [
                { value: "teaching", text: "Unterrichtserfahrung" },
                { value: "tutoring", text: "Nachhilfe-Erfahrung" },
                { value: "education", text: "Ausbildung/Studium" },
                { value: "work", text: "Berufserfahrung" },
                { value: "volunteer", text: "Ehrenamtliche Tätigkeit" },
                { value: "other", text: "Sonstiges" }
              ]
            },
            {
              type: "dropdown",
              name: "experience_location",
              title: "Wo",
              isRequired: true,
              choices: [
                { value: "school", text: "Schule" },
                { value: "university", text: "Universität" },
                { value: "institute", text: "Nachhilfe-Institut" },
                { value: "private", text: "Privat" },
                { value: "online", text: "Online" },
                { value: "company", text: "Unternehmen" },
                { value: "other", text: "Sonstiges" }
              ]
            },
            {
              type: "dropdown",
              name: "experience_duration",
              title: "Wann/Dauer",
              isRequired: true,
              choices: [
                { value: "current", text: "Aktuell" },
                { value: "0-6months", text: "0-6 Monate" },
                { value: "6-12months", text: "6-12 Monate" },
                { value: "1-2years", text: "1-2 Jahre" },
                { value: "2-5years", text: "2-5 Jahre" },
                { value: "5plus", text: "Über 5 Jahre" }
              ]
            }
          ]
        }
      ]
    },

    // PAGE 3b: Qualifikationen (für Therapeutische Unterstützung)
    {
      name: "qualifications",
      title: "Qualifikationen & Erfahrungen",
      description: "Deine therapeutisch-pädagogischen Qualifikationen",
      visibleIf: "{Position} = 'Therapeutische Unterstützung'",
      elements: [
        {
          type: "paneldynamic",
          name: "qualifications",
          title: "Qualifikationen hinzufügen",
          panelAddText: "Qualifikation hinzufügen",
          panelRemoveText: "Entfernen",
          minPanelCount: 1,
          maxPanelCount: 10,
          templateElements: [
            {
              type: "dropdown",
              name: "qualification_type",
              title: "Art der Qualifikation",
              isRequired: true,
              choices: [
                { value: "therapy_education", text: "Therapeutische Ausbildung" },
                { value: "special_education", text: "Sonderpädagogik" },
                { value: "psychology", text: "Psychologie" },
                { value: "social_work", text: "Soziale Arbeit" },
                { value: "occupational_therapy", text: "Ergotherapie" },
                { value: "speech_therapy", text: "Logopädie" },
                { value: "physiotherapy", text: "Physiotherapie" },
                { value: "behavioral_therapy", text: "Verhaltenstherapie" },
                { value: "art_therapy", text: "Kunsttherapie" },
                { value: "music_therapy", text: "Musiktherapie" },
                { value: "other", text: "Sonstiges" }
              ]
            },
            {
              type: "dropdown",
              name: "qualification_location",
              title: "Wo erworben",
              isRequired: true,
              choices: [
                { value: "university", text: "Universität/Hochschule" },
                { value: "institute", text: "Therapeutisches Institut" },
                { value: "hospital", text: "Krankenhaus/Klinik" },
                { value: "private_practice", text: "Privatpraxis" },
                { value: "certification", text: "Zertifizierungskurs" },
                { value: "workshop", text: "Workshop/Seminar" },
                { value: "other", text: "Sonstiges" }
              ]
            },
            {
              type: "dropdown",
              name: "qualification_duration",
              title: "Erfahrungsdauer",
              isRequired: true,
              choices: [
                { value: "current", text: "Aktuell tätig" },
                { value: "0-1year", text: "0-1 Jahr" },
                { value: "1-3years", text: "1-3 Jahre" },
                { value: "3-5years", text: "3-5 Jahre" },
                { value: "5-10years", text: "5-10 Jahre" },
                { value: "10plus", text: "Über 10 Jahre" }
              ]
            }
          ]
        }
      ]
    },

    // PAGE 4: Kontaktdaten & Details
    {
      name: "contact",
      title: "Kontaktdaten & Details",
      description: "Vervollständige deine Bewerbung",
      elements: [
        {
          type: "text",
          name: "street",
          title: "Straße",
          isRequired: true,
          placeholder: "Musterstraße"
        },
        {
          type: "text",
          name: "house_number",
          title: "Hausnummer",
          isRequired: true,
          placeholder: "123"
        },
        {
          type: "text",
          name: "postal_code",
          title: "Postleitzahl",
          isRequired: true,
          placeholder: "12345",
          maxLength: 5,
          validators: [
            { type: "regex", regex: "^[0-9]{5}$", text: "Bitte gib eine gültige 5-stellige PLZ ein" }
          ]
        },
        {
          type: "text",
          name: "city",
          title: "Ort",
          isRequired: true,
          placeholder: "Musterstadt"
        },
        {
          type: "text",
          name: "phone",
          title: "Handynummer",
          isRequired: true,
          inputType: "tel",
          placeholder: "0123 456789"
        },
        {
          type: "text",
          name: "email",
          title: "E-Mail-Adresse",
          isRequired: true,
          inputType: "email",
          placeholder: "max@example.com",
          validators: [
            { type: "email", text: "Bitte gib eine gültige E-Mail-Adresse ein" }
          ]
        },
        {
          type: "text",
          name: "birthdate",
          title: "Geburtsdatum",
          isRequired: true,
          inputType: "date"
        },
        // Studienfelder - nur für Assistenz-Lehrkraft
        {
          type: "text",
          name: "university",
          title: "An welcher Hochschule/Universität?",
          isRequired: true,
          placeholder: "Universität/Hochschule",
          visibleIf: "{Position} = 'Assistenz-Lehrkraft'"
        },
        {
          type: "text",
          name: "study_subject",
          title: "Welcher Studiengang?",
          isRequired: true,
          placeholder: "Studiengang",
          visibleIf: "{Position} = 'Assistenz-Lehrkraft'"
        },
        {
          type: "dropdown",
          name: "semester",
          title: "Aktuelles/letztes Semester",
          isRequired: true,
          visibleIf: "{Position} = 'Assistenz-Lehrkraft'",
          choices: [
            ...Array.from({ length: 12 }, (_, i) => ({
              value: String(i + 1),
              text: `${i + 1}. Semester`
            })),
            { value: "abgeschlossen", text: "Studium abgeschlossen" }
          ]
        },
        {
          type: "checkbox",
          name: "mobility",
          title: "Welche Mobilitätsmöglichkeiten hast du?",
          isRequired: true,
          choices: [
            { value: "car", text: "Auto" },
            { value: "bike", text: "Fahrrad" },
            { value: "public_transport", text: "Öffentliche Verkehrsmittel" },
            { value: "walking", text: "Zu Fuß" },
            { value: "other", text: "Sonstiges" }
          ]
        },
        {
          type: "dropdown",
          name: "availability_hours",
          title: "Verfügbarkeit pro Woche",
          isRequired: true,
          choices: [
            { value: "1-5", text: "1-5 Stunden" },
            { value: "5-10", text: "5-10 Stunden" },
            { value: "10-15", text: "10-15 Stunden" },
            { value: "15-20", text: "15-20 Stunden" }
          ]
        },
        {
          type: "comment",
          name: "message",
          title: "Deine Nachricht an uns",
          isRequired: false,
          placeholder: "Erzähle uns etwas über dich und warum du bei uns arbeiten möchtest...",
          rows: 4
        },
        {
          type: "checkbox",
          name: "privacy_accepted",
          title: "Datenschutzerklärung",
          isRequired: true,
          choices: [
            {
              value: "yes",
              text: 'Ich habe die <a href="https://www.chancen-pilot.de/datenschutz" target="_blank" rel="noopener">Datenschutzerklärung</a> gelesen und bin mit der Speicherung und Nutzung meiner Daten einverstanden.'
            }
          ],
          validators: [
            { type: "expression", expression: "{privacy_accepted} contains 'yes'", text: "Bitte akzeptiere die Datenschutzerklärung" }
          ]
        }
      ]
    }
  ]
};

export default cpApplicationTutor;
