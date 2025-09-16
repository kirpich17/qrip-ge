"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useTranslation } from "@/hooks/useTranslate";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft } from "lucide-react";
import LanguageDropdown from "@/components/languageDropdown/page";
const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}`;
console.log("🚀 ~ API_BASE_URL:", API_BASE_URL)
const TermsAndConditions = () => {
  const { t } = useTranslation();
  const termPage=t("TermsPage")
  
  
     const translations = t("adminSubscriptionPage");
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

  const termsData = TermsMainData?.[lang[language]];
  return (<>
      <header className="bg-[#243b31] py-4 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              <Link href="/admin/dashboard" className="flex items-center text-white hover:underline gap-2">
                <ArrowLeft size={20} /> {translations.header.back}
              </Link>
              <LanguageDropdown/>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
               {termPage.termAndCondition}
              </h1>
            </div>
          </header>

    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {termPage.TermsConditions}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p className="font-bold">{termsData?.note?.title}</p>
          <p>{termsData?.note?.content}</p>
        </div>

        <div className="text-sm text-gray-500 mb-6">
          Last updated: {termsData?.lastUpdated}
        </div>

        {termsData?.sections.map((section) => (
          <section key={section.id} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{section?.title}</h2>

            {section?.intro && <p className="mb-2">{section?.intro}</p>}

            {section?.type === "list" ? (
              <ul className="list-disc pl-6 space-y-2">
                {section?.items?.map((item, index) => (
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
