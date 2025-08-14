
"use client";

import React, { useState } from "react";
import CurrentSubscriptionDetails from "./components/CurrentSubscriptionDetails"; // We will create this
import ManageSubscriptionPlans from "./components/ManageSubscriptionPlans"; // We will create this
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslate";
import Link from "next/link";
import { ArrowLeft, Check, Crown, Star, Zap, X } from "lucide-react";
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function SubscriptionManagementPage() {
  const [activeTab, setActiveTab] = useState<"current" | "plans">("current");
    const { t } = useTranslation();
  const subscriptionTranslations = t("subscription");


    const subscriptionManageTranslations = t("subscription_management" as any);
  const subscriptionManage: any = subscriptionManageTranslations;
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div {...fadeInUp}>

           <header className="bg-[#243b31] py-4 sticky top-0 z-50 mb-6">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                      <Link href="/dashboard" className="flex items-center text-white hover:underline gap-2">
                        <ArrowLeft className="h-5 w-5" />
                        {subscriptionTranslations.header.back}
                      </Link>
                      <div className="flex items-center space-x-2">
                        <Crown className="h-6 w-6 text-white" />
                        <span className="text-lg font-bold text-white">
                          {subscriptionTranslations.header.title}
                        </span>
                      </div>
                  </div>
                </header>

          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium text-base transition-colors ${
                activeTab === "current"
                  ? "text-[#243b31] border-b-2 border-[#243b31]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("current")}
            >
              {/* My Subscription */}
               {subscriptionManage.my_subscription_tab}
            </button>
            <button
              className={`py-2 px-4 font-medium text-base transition-colors ${
                activeTab === "plans"
                  ? "text-[#243b31] border-b-2 border-[#243b31]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("plans")}
            >
              {/* Manage Plans */}
                   {subscriptionManage.manage_plans_tab}
            </button>
          </div>

          {/* Render component based on active tab */}
          {activeTab === "current" && <CurrentSubscriptionDetails setActiveTab={setActiveTab} />}
          {activeTab === "plans" && <ManageSubscriptionPlans />}
        </motion.div>
      </div>
    </div>
  );
}