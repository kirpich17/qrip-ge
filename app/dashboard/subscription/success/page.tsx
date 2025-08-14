"use client";

import React from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';

const SubscriptionSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 text-center">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full">
        <FaCheckCircle className="text-[#547455] text-6xl mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your subscription. Your plan is now active, and you can enjoy all the benefits.
        </p>
        {/* FIX: Move className to Link and remove the <a> tag */}
        <Link 
          href="/subscription"
          className="bg-[#243b31] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#243b31] transition-colors duration-300"
        >
          View Subscription Details
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;