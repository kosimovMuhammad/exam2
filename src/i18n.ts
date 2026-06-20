import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';
import tg from './locales/tg.json';

function detectBrowserLanguage(): string {
  const saved = localStorage.getItem('language');
  if (saved && ['en', 'ru', 'tg'].includes(saved)) {
    return saved;
  }

  const browserLang = navigator.language || (navigator as unknown as { userLanguage?: string }).userLanguage || 'en';
  const langCode = browserLang.split('-')[0].toLowerCase();

  if (langCode === 'ru') return 'ru';
  if (langCode === 'tg' || langCode === 'tj') return 'tg';
  return 'en';
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      ru,
      tg,
    },
    lng: detectBrowserLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
});

export default i18n;
