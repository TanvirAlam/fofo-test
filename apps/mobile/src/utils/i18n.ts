import i18n from "i18next";
import LanguageDetector from "i18next-react-native-language-detector";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import da from "../locales/da.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      da: { translation: da },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
