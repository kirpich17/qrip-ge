"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import enTranslations from "@/locales/en.json";
import kaTranslations from "@/locales/ka.json";
import ruTranslations from "@/locales/ru.json"; // ✅ Add Russian translations
import { Translations } from "@/types/translations";

type TranslationKey = keyof typeof enTranslations;

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = <K extends keyof Translations>(namespace: K): Translations[K] | undefined => {
    let translations;

    if (language === "English") {
      translations = enTranslations;
    } else if (language === "Georgian") {
      translations = kaTranslations;
    } else if (language === "Russian") {
      translations = ruTranslations;
    } else {
      translations = enTranslations; // fallback
    }

    return translations[namespace as keyof typeof translations] as Translations[K] | undefined;
  };

  return { t };
};
