"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "../locales/en.json";
import daTranslations from "../locales/da.json";

const initOptions = {
  resources: {
    en: { translation: enTranslations },
    da: { translation: daTranslations },
  },
  fallbackLng: "en",
  lng: "en",
  supportedLngs: ["en", "da"],
  interpolation: { escapeValue: true },
  react: { useSuspense: false },
  debug: false,
};

i18n.use(LanguageDetector).use(initReactI18next).init(initOptions);

export default i18n;
