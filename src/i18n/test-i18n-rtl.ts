import i18n from 'i18next';
import { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';

const config: InitOptions = {
  lng: 'ar', // Arabic for RTL testing
  fallbackLng: 'tr',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  returnEmptyString: false,
  returnObjects: true,
  saveMissing: true,
  missingKeyHandler: (lngs: readonly string[], ns: string, key: string) => {
    console.warn(`Missing translation: ${key} for language: ${lngs.join(', ')}`);
    return `[missing]: ${key}`;
  },
  resources: {
    ar: {
      translation: {
        'direction': 'rtl',
        'insight.close': 'إغلاق',
        'insight.metrics': 'المقاييس ذات الصلة',
        'insight.dismiss': 'إغلاق',
        'insight.details': 'التفاصيل',
        'insight.action.view': 'عرض'
      },
    },
    tr: {
      translation: {
        'direction': 'ltr',
        'insight.close': 'Kapat',
        'insight.metrics': 'İlgili Metrikler',
        'insight.dismiss': 'Kapat',
        'insight.details': 'Detaylar',
        'insight.action.view': 'Görüntüle'
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init(config);

export default i18n; 