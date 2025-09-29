import { supportedLanguages, type NewSupportedLanguage } from "../../schema/languages";
import type { SeederData } from "../types";

const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "dk", name: "Danish" },
];

export const generate = async (): Promise<SeederData<NewSupportedLanguage>> => {
  const records: NewSupportedLanguage[] = [];

  for (const lang of SUPPORTED_LANGUAGES) {
    const language: NewSupportedLanguage = {
      code: lang.code,
      name: lang.name,
    };

    records.push(language);
  }

  return { 
    tableName: "supported_languages", 
    records,
    table: supportedLanguages 
  };
};


