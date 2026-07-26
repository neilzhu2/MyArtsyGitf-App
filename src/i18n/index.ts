import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import zh from './locales/zh.json';

const LANGUAGE_STORAGE_KEY = '@myartsygift_app_language';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

const getSavedLanguage = async (): Promise<string> => {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && (saved === 'en' || saved === 'zh')) {
      return saved;
    }
  } catch (e) {
    console.warn('Failed to load saved language:', e);
  }

  const deviceLocales = Localization.getLocales();
  const primaryLang = deviceLocales[0]?.languageCode;
  return primaryLang === 'zh' ? 'zh' : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  });

getSavedLanguage().then(lang => {
  i18n.changeLanguage(lang);
});

export const setAppLanguage = async (lang: 'en' | 'zh') => {
  await i18n.changeLanguage(lang);
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (e) {
    console.warn('Failed to persist language choice:', e);
  }
};

export default i18n;
