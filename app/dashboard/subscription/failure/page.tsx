"use client";

import React from 'react';
import Link from 'next/link';
import { FaTimesCircle } from 'react-icons/fa';
import { useTranslation } from '@/hooks/useTranslate';

const SubscriptionFailurePage = () => {

      const { t } = useTranslation();
    
      const subscriptionManageTranslations = t("subscription_management" as any);
    const subscriptionManage: any = subscriptionManageTranslations;

   const paymentFailedTranslations = subscriptionManageTranslations.paymentFailed;
    console.log("🚀 ~ SubscriptionSuccessPage ~ subscriptionManage:", paymentFailedTranslations)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg max-w-lg w-full text-center">
        
        {/* --- Icon and Title --- */}
        <FaTimesCircle className="text-[#547455] text-6xl mx-auto mb-5" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{paymentFailedTranslations.payment_failed}</h1>

        {/* --- Informative Message --- */}
        <p className="text-gray-600 mb-6">

          {paymentFailedTranslations.msg}
        </p>

        {/* --- Troubleshooting Suggestions --- */}
        <div className="text-left bg-gray-100 p-4 rounded-lg mb-8">
          <p className="font-semibold text-gray-700 mb-2"> {paymentFailedTranslations.troubleshooting_title}</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
               <li>{paymentFailedTranslations.check_card_details}</li>
            <li>{paymentFailedTranslations.check_sufficient_funds}</li>
            <li>{paymentFailedTranslations.check_card_expiry}</li>
            <li>{paymentFailedTranslations.check_bank_block}</li>
          </ul>
        </div>

        {/* --- Action Buttons --- */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* Primary Action: Go back to plans to try again */}
          <Link
             href="/dashboard"
            className="w-full sm:w-auto bg-[#243b31] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#243b31] transition-colors duration-300"
          >
         {paymentFailedTranslations.try_again_button}
          </Link>

          {/* Secondary Action: Go back to the main dashboard */}
        
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFailurePage;