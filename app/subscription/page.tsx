"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslate";
import Link from "next/link";
import { ArrowLeft, Crown } from "lucide-react";
import ManageSubscriptionPlans from "./components/ManageSubscriptionPlans";
import { Suspense } from "react";
import LanguageDropdown from "@/components/languageDropdown/page";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

// A simple loading component to use as a fallback
const LoadingPlans = () => {
  const { t } = useTranslation();
  const pageTranslations = t("selectPlanPage");
  return (
    <div className="text-center py-10">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-4 text-gray-600">
        {/* Use optional chaining for safety in a fallback component */}
        {pageTranslations?.loading?.text || 'Loading...'}
      </p>
    </div>
  );
}


export default function SelectMemorialPlanPage() {
  const { t } = useTranslation();
  // Fetch translations from the new 'selectPlanPage' object
  const translations = t("selectPlanPage");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-white hover:underline gap-2 sm:text-base text-xs">
            <ArrowLeft className="h-5 w-5" />
            {translations.header.back}
          </Link>
          <div className="flex gap-3">
            <LanguageDropdown />
            <div className="flex items-center space-x-2">
              <Crown className="md:h-6 md:w-6 w-4 h-4 text-white" />
              <span className="md:text-xl text-xs font-bold text-white">
                {translations.header.title}
              </span>
            </div>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div {...fadeInUp}>
          <div className="text-center mb-12">
            <h1 className="md:text-4xl text-xl font-bold text-gray-900 md:mb-4 mb-3">
              {translations.main.title}
            </h1>
            <p className="md:text-lg text-base text-gray-600 max-w-3xl mx-auto">
              {translations.main.description}
            </p>
          </div>

          {/* Render the simplified plan selection component */}
          <Suspense fallback={<LoadingPlans />}>
            <ManageSubscriptionPlans />

          </Suspense>
        </motion.div>
      </main>
    </div>
  );
}