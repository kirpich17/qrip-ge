// components/subscription/CurrentSubscriptionDetails.tsx
"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";

// Helper function to format dates
const formatDisplayDate = (dateString?: string): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
};

// Interfaces for the API response
interface PlanDetails {
  name: string;
  price: number;
  billingPeriod: string;
  description: string;
}

interface Transaction {
  _id: string;
  bogTransactionId: string;
  bogOrderId: string;
  amount: number;
  status: string;
  date: string;
}

interface UserSubscription {
  planId: PlanDetails;
  status: string;
  startDate?: string;
  lastPaymentDate?: string;
  nextBillingDate?: string;
}

interface ApiResponse {
  currentSubscription: UserSubscription | null;
  transactions: Transaction[];
}

interface Props {
  setActiveTab: (tab: "current" | "plans") => void;
}

export default function CurrentSubscriptionDetails({ setActiveTab }: Props) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axiosInstance.get('/api/user/subscription-details'); // Use your actual API endpoint
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch subscription details", error);
        toast.error("Could not load your subscription details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, []);

  if (isLoading) {
    return <div className="text-center p-10">Loading your subscription...</div>;
  }

  if (!data?.currentSubscription) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl font-semibold mb-2">No Active Subscription</h2>
        <p className="text-gray-600 mb-4">You do not have an active subscription plan.</p>
        <button
          onClick={() => setActiveTab("plans")}
          className="bg-[#243b31] text-white px-6 py-2 rounded-lg hover:bg-[#243b31]-700"
        >
          View Plans
        </button>
      </div>
    );
  }

  const { currentSubscription, transactions } = data;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Subscription Details</h2>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <div><strong className="text-gray-600">Plan Name:</strong> {currentSubscription.planId.name}</div>
          <div><strong className="text-gray-600">Price:</strong> ${currentSubscription.planId.price} / {currentSubscription.planId.billingPeriod}</div>
          <div className="md:col-span-2"><strong className="text-gray-600">Description:</strong> {currentSubscription.planId.description}</div>
          <div><strong className="text-gray-600">Start Date:</strong> {formatDisplayDate(currentSubscription.startDate)}</div>
          <div><strong className="text-gray-600">Last Payment:</strong> {formatDisplayDate(currentSubscription.lastPaymentDate)}</div>
          <div><strong className="text-gray-600">Next Billing:</strong> {formatDisplayDate(currentSubscription.nextBillingDate)}</div>
          <div><strong className="text-gray-600">Status:</strong> <span className="font-semibold text-green-600 capitalize">{currentSubscription.status}</span></div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map(tx => (
              <tr key={tx._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDisplayDate(tx.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{tx.amount} GEL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="font-semibold text-green-600 capitalize">{tx.status.replace(/_/g, ' ')}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.bogTransactionId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.bogOrderId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}