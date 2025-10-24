"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import enTranslations from "@/locales/en.json";
import kaTranslations from "@/locales/ka.json";
import ruTranslations from "@/locales/ru.json"; // ✅ Add Russian translations
import { Translations } from "@/types/translations";
import axiosInstance from "@/services/axiosInstance";

type TranslationKey = keyof typeof enTranslations;

export const useTranslation = () => {
  const { language } = useLanguage();
  const [dynamicTranslations, setDynamicTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch dynamic translations from backend
  const fetchDynamicTranslations = async (lang: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/admin/preview-translation/${lang}`);
      if (response.data.success) {
        setDynamicTranslations(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dynamic translations:', error);
      // Fallback to static translations on error
      setDynamicTranslations(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if we should use dynamic translations (when in admin context)
  const shouldUseDynamic = typeof window !== 'undefined' && 
    (window.location.pathname.includes('/admin') || 
     localStorage.getItem('useDynamicTranslations') === 'true');

  useEffect(() => {
    if (shouldUseDynamic) {
      const langCode = language === "English" ? "en" : 
                      language === "Georgian" ? "ka" : 
                      language === "Russian" ? "ru" : "en";
      fetchDynamicTranslations(langCode);
    }
  }, [language, shouldUseDynamic]);

  const t = <K extends keyof Translations>(namespace: K): Translations[K] | undefined => {
    let translations;

    // Use dynamic translations if available and we're in admin context
    if (shouldUseDynamic && dynamicTranslations && !isLoading) {
      translations = dynamicTranslations;
    } else {
      // Use static translations as fallback
      if (language === "English") {
        translations = enTranslations;
      } else if (language === "Georgian") {
        translations = kaTranslations;
      } else if (language === "Russian") {
        translations = ruTranslations;
      } else {
        translations = enTranslations; // fallback
      }
    }

    return translations[namespace as keyof typeof translations] as Translations[K] | undefined;
  };

  return { t, isLoading, refreshTranslations: () => {
    if (shouldUseDynamic) {
      const langCode = language === "English" ? "en" : 
                      language === "Georgian" ? "ka" : 
                      language === "Russian" ? "ru" : "en";
      fetchDynamicTranslations(langCode);
    }
  }};
};
