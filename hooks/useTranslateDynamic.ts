"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Translations } from "@/types/translations";
import { useState, useEffect } from "react";

type TranslationKey = keyof typeof Translations;

export const useTranslationDynamic = () => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<{
    en: any;
    ka: any;
    ru: any;
  }>({
    en: {},
    ka: {},
    ru: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const [enRes, kaRes, ruRes] = await Promise.allSettled([
          import("@/locales/en.json"),
          import("@/locales/ka.json"),
          import("@/locales/ru.json")
        ]);

        setTranslations({
          en: enRes.status === "fulfilled" ? enRes.value.default || enRes.value : {},
          ka: kaRes.status === "fulfilled" ? kaRes.value.default || kaRes.value : {},
          ru: ruRes.status === "fulfilled" ? ruRes.value.default || ruRes.value : {}
        });
      } catch (error) {
        console.error("Error loading translations:", error);
        // Fallback to empty objects
        setTranslations({
          en: {},
          ka: {},
          ru: {}
        });
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, []);

  const t = <K extends keyof Translations>(namespace: K): Translations[K] | undefined => {
    if (loading) return undefined;

    let currentTranslations;

    if (language === "English") {
      currentTranslations = translations.en;
    } else if (language === "Georgian") {
      currentTranslations = translations.ka;
    } else if (language === "Russian") {
      currentTranslations = translations.ru;
    } else {
      currentTranslations = translations.en; // fallback
    }

    return currentTranslations[namespace as keyof typeof currentTranslations] as Translations[K] | undefined;
  };

  return { t, loading };
};
