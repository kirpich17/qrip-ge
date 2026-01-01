'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import enTranslations from '@/locales/en.json';
import kaTranslations from '@/locales/ka.json';
import ruTranslations from '@/locales/ru.json';
import { Translations } from '@/types/translations';
import axiosInstance from '@/services/axiosInstance';

type TranslationKey = keyof typeof enTranslations;

const translationCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

export const useTranslation = () => {
  const { language } = useLanguage();
  const [apiTranslations, setApiTranslations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTranslations = useCallback(async (lang: string) => {
    const cacheKey = `translations_${lang}`;
    const now = Date.now();

    const cached = translationCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_DURATION) {
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

        translationCache.set(cacheKey, {
          data: translationData,
          timestamp: now,
        });
      } else {
        throw new Error('Failed to fetch translations');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.warn(
        'API translations not available, using static translations:',
        errorMessage
      );
      setError(null);
      setApiTranslations(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLanguageCode = useCallback(() => {
    return language === 'English'
      ? 'en'
      : language === 'Georgian'
      ? 'ka'
      : language === 'Russian'
      ? 'ru'
      : 'en';
  }, [language]);

  useEffect(() => {
    const langCode = getLanguageCode();

    fetchTranslations(langCode);
  }, [language, fetchTranslations, getLanguageCode]);

  const getStaticTranslations = useCallback(() => {
    if (language === 'English') {
      return enTranslations;
    } else if (language === 'Georgian') {
      return kaTranslations;
    } else if (language === 'Russian') {
      return ruTranslations;
    } else {
      return enTranslations;
    }
  }, [language]);

  const t = <K extends keyof Translations>(
    namespace: K
  ): Translations[K] | undefined => {
    const staticTranslations = getStaticTranslations();

    if (apiTranslations && !isLoading && !error) {
      const mergedTranslations = { ...staticTranslations, ...apiTranslations };
      return mergedTranslations[
        namespace as keyof typeof mergedTranslations
      ] as Translations[K] | undefined;
    }

    return staticTranslations[namespace as keyof typeof staticTranslations] as
      | Translations[K]
      | undefined;
  };

  const refreshTranslations = useCallback(() => {
    const langCode = getLanguageCode();
    const cacheKey = `translations_${langCode}`;
    translationCache.delete(cacheKey);
    fetchTranslations(langCode);
  }, [getLanguageCode, fetchTranslations]);

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
      error: !!error,
    },
  };
};
