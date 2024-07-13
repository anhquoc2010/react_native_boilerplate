import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import languages from '@locales';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    ...Object.entries(languages).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          translation: value,
        },
      }),
      {},
    ),
  },
  interpolation: {
    escapeValue: false, // not needed for react as it does escape per default to prevent xss!
  },
});

export default i18n;
