"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import enTranslations from "@/locales/en.json";
import kaTranslations from "@/locales/ka.json";
import ruTranslations from "@/locales/ru.json";
import { Translations } from "@/types/translations";
import axiosInstance from "@/services/axiosInstance";

type TranslationKey = keyof typeof enTranslations;

// Cache for translations to avoid repeated API calls
const translationCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

export const useTranslation = () => {
  const { language } = useLanguage();
  const [apiTranslations, setApiTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch translations from API
  const fetchTranslations = useCallback(async (lang: string) => {
    const cacheKey = `translations_${lang}`;
    const now = Date.now();
    
    // Check cache first
    const cached = translationCache.get(cacheKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      setApiTranslations(cached.data);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/api/translation/${lang}`);
      
      if (response.data.success) {
        const translationData = response.data.data;
        setApiTranslations(translationData);
        
        // Cache the result
        translationCache.set(cacheKey, {
          data: translationData,
          timestamp: now
        });
      } else {
        throw new Error('Failed to fetch translations');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.warn('API translations not available, using static translations:', errorMessage);
      setError(null); // Don't show error, just use static translations
      setApiTranslations(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get language code
  const getLanguageCode = useCallback(() => {
    return language === "English" ? "en" : 
           language === "Georgian" ? "ka" : 
           language === "Russian" ? "ru" : "en";
  }, [language]);

  // Load translations when language changes (only if API is available)
  useEffect(() => {
    const langCode = getLanguageCode();
    // Only try to fetch from API if we're in a context where API should be available
    // For now, always try to fetch but gracefully fallback to static
    fetchTranslations(langCode);
  }, [language, fetchTranslations, getLanguageCode]);

  // Function to get static translations as fallback
  const getStaticTranslations = useCallback(() => {
    if (language === "English") {
      return enTranslations;
    } else if (language === "Georgian") {
      return kaTranslations;
    } else if (language === "Russian") {
      return ruTranslations;
    } else {
      return enTranslations;
    }
  }, [language]);

  const t = <K extends keyof Translations>(namespace: K): Translations[K] | undefined => {
    // Use static translations as primary source, API as enhancement
    // This ensures we always have translations even if API fails
    const staticTranslations = getStaticTranslations();
    
    // If API translations are available and not loading, use them
    if (apiTranslations && !isLoading && !error) {
      // Merge API translations with static translations (API overrides static)
      const mergedTranslations = { ...staticTranslations, ...apiTranslations };
      return mergedTranslations[namespace as keyof typeof mergedTranslations] as Translations[K] | undefined;
    }
    
    // Fallback to static translations
    return staticTranslations[namespace as keyof typeof staticTranslations] as Translations[K] | undefined;
  };

  // Function to refresh translations (clear cache and refetch)
  const refreshTranslations = useCallback(() => {
    const langCode = getLanguageCode();
    const cacheKey = `translations_${langCode}`;
    translationCache.delete(cacheKey);
    fetchTranslations(langCode);
  }, [getLanguageCode, fetchTranslations]);

  // Function to clear all translation cache
  const clearCache = useCallback(() => {
    translationCache.clear();
  }, []);

  return { 
    t, 
    isLoading, 
    error,
    refreshTranslations,
    clearCache,
    isUsingAPI: !!apiTranslations,
    debug: {
      language,
      apiTranslations: !!apiTranslations,
      isLoading,
      error: !!error
    }
  };
};
