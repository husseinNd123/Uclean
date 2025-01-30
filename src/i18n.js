import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18n
i18n
  .use(HttpApi) // Loads translations from external files
  .use(LanguageDetector) // Detects user's language
  .use(initReactI18next) // Passes i18n instance to React
  .init({
    fallbackLng: 'en', // Default language
    supportedLngs: ['en', 'it'], // Supported languages
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Translation file path
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
