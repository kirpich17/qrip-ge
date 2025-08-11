"use client";

import React from 'react';
import Link from 'next/link';
import { FaTimesCircle } from 'react-icons/fa';

const SubscriptionFailurePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg max-w-lg w-full text-center">
        
        {/* --- Icon and Title --- */}
        <FaTimesCircle className="text-[#547455] text-6xl mx-auto mb-5" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Failed</h1>

        {/* --- Informative Message --- */}
        <p className="text-gray-600 mb-6">
          Unfortunately, we couldn't process your payment. This can happen for a few reasons.
        </p>

        {/* --- Troubleshooting Suggestions --- */}
        <div className="text-left bg-gray-100 p-4 rounded-lg mb-8">
          <p className="font-semibold text-gray-700 mb-2">Please check the following:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
            <li>Your card details (number, expiry date, CVC) are correct.</li>
            <li>You have sufficient funds in your account.</li>
            <li>Your card has not expired.</li>
            <li>Your bank has not blocked the transaction.</li>
          </ul>
        </div>

        {/* --- Action Buttons --- */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {/* Primary Action: Go back to plans to try again */}
          <Link
             href="/subscription"
            className="w-full sm:w-auto bg-[#243b31] text-white font-bold py-3 px-8 rounded-lg hover:bg-[#243b31] transition-colors duration-300"
          >
            Try Again
          </Link>

          {/* Secondary Action: Go back to the main dashboard */}
          <Link
            href="/dashboard"
            className="w-full sm:w-auto text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFailurePage;