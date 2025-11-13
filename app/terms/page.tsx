"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useTranslation } from "@/hooks/useTranslate";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import LanguageDropdown from "@/components/languageDropdown/page";
import { useRouter } from "next/navigation";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;
console.log("🚀 ~ API_BASE_URL:", API_BASE_URL)
const TermsAndConditions = () => {
  const { t } = useTranslation();
  const termPage = t("TermsPage" as any);
  const router = useRouter();

  const translations = t("adminSubscriptionPage" as any);
  const [TermsMainData, setTermsMainData] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermsData = async () => {
      try {
        const response = await axios.get(API_BASE_URL + "api/terms");
        setTermsMainData(response.data); // Save API response to state
      } catch (error) {
        console.error("Error fetching Terms data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsData();
  }, []);

  const { language, setLanguage } = useLanguage();

  const lang = {
    English: "en",
    Russian: "ru",
    Georgian: "ka",
  };

  // Handle back button - go to previous page or fallback to /signup
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push("/signup");
    }
  };

  const termsData = (TermsMainData as any)?.[lang[language]];
  return (<>
    <header className="bg-[#243b31] py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex items-center justify-between">
        <button onClick={handleBack} className="flex items-center text-white hover:underline gap-2 whitespace-nowrap">
          <ArrowLeft size={20} /> {translations.header.back}
        </button>
        <div className="flex sm:gap-3 gap-0">
          <LanguageDropdown />
          <h1 className="sm:text-xl text-xs font-bold text-white flex items-center gap-2">
            {termPage.termAndCondition}
          </h1>
        </div>

      </div>
    </header>

    <div className="max-w-4xl mx-auto p-6">
      <h1 className="sm:text-3xl text-2xl font-bold mb-6 text-center">
        {termPage.TermsConditions}
      </h1>

      <div className="bg-white rounded-lg shadow-md sm:p-6 p-3">
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">{termsData?.note?.title}</p>
          <p>{termsData?.note?.content}</p>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          Last updated: {termsData?.lastUpdated}
        </div>

        {termsData?.sections.map((section: any) => (
          <section key={section.id} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{section?.title}</h2>

            {section?.intro && <p className="mb-2">{section?.intro}</p>}

            {section?.type === "list" ? (
              <ul className="list-disc pl-6 space-y-2">
                {section?.items?.map((item: any, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{section?.content}</p>
            )}
          </section>
        ))}
      </div>
    </div>
  </>
  );
};

export default TermsAndConditions;
