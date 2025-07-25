"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import enTranslations from "@/locales/en.json";
import kaTranslations from "@/locales/ka.json";
import { Translations } from "@/types/translations";

type TranslationKey = keyof typeof enTranslations;

export const useTranslation = () => {
  const { language } = useLanguage();

  //   const t = (key: TranslationKey) => {
  //     const translations = language === "English" ? enTranslations : kaTranslations;
  //     return translations[key] || key;
  //   };

  const t = <K extends keyof Translations>(namespace: K): Translations[K] => {
    const translations =
      language !== "English" ? enTranslations : kaTranslations;
      // language === "English" ? enTranslations : kaTranslations;
    return translations[namespace];
    // return translations[namespace];
  };

  return { t };
};
