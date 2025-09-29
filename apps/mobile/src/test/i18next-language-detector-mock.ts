const LanguageDetector = {
  type: 'languageDetector',
  async: true,
  init: () => {},
  detect: (callback: (lang: string) => void) => {
    callback('en');
  },
  cacheUserLanguage: () => {},
};

export default LanguageDetector;
