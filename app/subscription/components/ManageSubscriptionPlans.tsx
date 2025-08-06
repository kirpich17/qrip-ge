"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Crown, Star, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";
import axiosInstance from "@/services/axiosInstance";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

// 1. UPDATED PLAN AND FEATURE TYPES to match the API
type Feature = {
  text: string;
  included: boolean;
  _id?: string;
};

type Plan = {
  _id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: "free" | "monthly" | "one_time";
  ctaButtonText: string;
  features: Feature[];
  isActive: boolean;
  isPopular?: boolean;
  color?: string;
  bgColor?: string;
  borderColor?: string;
};

export default function SubscriptionPage() {
  const { t } = useTranslation();
  const subscriptionTranslations = t("subscription");

    const [isProcessing, setIsProcessing] = useState<string | null>(null); // To disable button during API call

  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 2. STATES TO PREVENT HYDRATION ERROR
  const [currentPlan, setCurrentPlan] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  // This effect runs only on the client, setting isClient to true.
  useEffect(() => {
    setIsClient(true);
  }, []);

  
  // This effect now depends on `isClient` to safely access localStorage.
  useEffect(() => {
    if (isClient) {
      const loginDataString = localStorage.getItem("loginData");
      if (loginDataString) {
        try {
          const loginData = JSON.parse(loginDataString);
          // Example plan name from user data might be "MonthlyPremium", API name is "Monthly Premium".
          // We normalize it by removing spaces and making it lowercase for comparison.
          setCurrentPlan(loginData.subscriptionPlan?.toLowerCase().replace(/\s+/g, '') || "free");
        } catch (err) {
          console.error("Error parsing loginData:", err);
          setCurrentPlan("free");
        }
      } else {
        setCurrentPlan("free");
      }
    }
  }, [isClient]);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/admin/subscription");
      // Filter for active plans only
      setPlans(response.data.filter((plan: Plan) => plan.isActive));
    } catch (err) {
      setError("Failed to fetch plans");
      console.error("Error fetching plans:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);
  
  const handlePayment = async (planId: string, planName: string) => {
    setIsProcessing(planId);
    try {
      const response = await axiosInstance.post('/api/payments/initiate', { planId });
      const { redirectUrl } = response.data;
      if (redirectUrl) {
        window.location.href = redirectUrl; // Redirect user to BOG payment page
      } else {
        toast.error("Could not get payment URL. Please try again.");
      }
    } catch (err: any) {
      console.error("Payment initiation failed:", err);
      toast.error(err.response?.data?.message || `Failed to start payment for ${planName}.`);
    } finally {
      setIsProcessing(null);
    }
  };

  if (!isClient || isLoading) {
    // Render a loading state or skeleton screen on the server and during initial client load
    return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading Plans...</p>
      </div>
    );
  }

  if (error) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div {...fadeInUp}>
          <div className="text-center mb-12">
            <h1 className="md:text-4xl text-2xl font-bold text-gray-900 md:mb-4 mb-3">
              {subscriptionTranslations.title}
            </h1>
            <p className="md:text-xl text-base text-gray-600 max-w-3xl mx-auto mb-8">
              {subscriptionTranslations.description}
            </p>
          </div>

          {/* Current Plan Status */}
          <motion.div variants={fadeInUp} className="mb-8">
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {subscriptionTranslations.currentPlan.title.replace('{plan}', currentPlan || 'Free')}
                      </h3>
                      <p className="text-gray-600">
                        {subscriptionTranslations.currentPlan.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-green-300 bg-green-50 text-green-800">
                    {subscriptionTranslations.currentPlan.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-3 md:gap-8 gap-5 mb-12">
            {plans.map((plan, index) => (
              <motion.div key={plan._id} {...fadeInUp} transition={{ delay: index * 0.1 }}>
                <Card className={`relative h-full flex flex-col ${plan.isPopular ? "border-[#243b31] shadow-lg" : "border-gray-200 hover:shadow-md"} transition-all duration-300`}>
                  {plan.isPopular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#547455] text-white px-4 py-1">
                      {subscriptionTranslations.plans.basic.popular}
                    </Badge>
                  )}

                  <CardHeader className="text-center pb-4">
                     <div className={`md:w-16 md:h-16 w-12 h-12 ${plan.bgColor || 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {plan.name.toLowerCase().includes("free") && <Star className="md:h-8 md:w-8 w-5 h-5 text-black" />}
                        {plan.name.toLowerCase().includes("premium") && <Crown className="md:h-8 md:w-8 w-5 h-5 text-black" />}
                        {plan.name.toLowerCase().includes("life") && <Zap className="md:h-8 md:w-8 w-5 h-5 text-black" />}
                      </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600 ml-2">
                          {plan.billingPeriod === 'one_time' ? 'one-time' : plan.billingPeriod === 'monthly' ? '/month' : 'forever'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 flex-grow flex flex-col">
                    <div className="space-y-6 flex-grow">
                      {/* Included Features */}
                      <div>
                        <ul className="space-y-2">
                          {plan.features.filter(f => f.included).map((feature) => (
                            <li key={feature._id} className="flex items-start space-x-3">
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 text-sm">{feature.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Excluded Features */}
                      {plan.features.filter(f => !f.included).length > 0 && (
                        <div>
                          <ul className="space-y-2">
                            {plan.features.filter(f => !f.included).map((feature) => (
                              <li key={feature._id} className="flex items-start space-x-3">
                                <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-500 text-sm line-through">{feature.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    <Separator className="my-6" />

                    {/* Action Button */}
                    <div className="pt-2">
                      {currentPlan === plan.name.toLowerCase().replace(/\s+/g, '') ? (
                        <Button variant="outline" className="w-full" disabled>
                          {plan.ctaButtonText ||subscriptionTranslations.plans.current}
                        </Button>
                      ) : (
                        // <Button
                        //   className={`w-full ${plan.isPopular ? "bg-[#547455] hover:bg-green-600 text-white" : "bg-black hover:bg-gray-800 text-white"}`}
                        //   size="lg"
                        //   onClick={() => alert(`Redirecting to payment for ${plan.name}...`)}
                        // >
                        //   {plan.ctaButtonText || subscriptionTranslations.plans.choose}
                        // </Button>
                        plan.name == 'Monthly Premium' ?
                       ( <Button
                            className={`w-full ${plan.isPopular ? "bg-[#547455] hover:bg-green-600 text-white" : "bg-black hover:bg-gray-800 text-white"}`}
                            size="lg"
                            onClick={() => handlePayment(plan._id, plan.name)}
                            disabled={isProcessing === plan._id}
                          >
                            {isProcessing === plan._id ? "Processing..." : plan.ctaButtonText || subscriptionTranslations.plans.choose}
                          </Button>
):(<Button
                            className={`w-full ${plan.isPopular ? "bg-[#547455] hover:bg-green-600 text-white" : "bg-black hover:bg-gray-800 text-white"}`}
                            size="lg"
                            onClick={() =>alert(`Redirecting to payment for ${plan.name}...`)}
                            disabled={isProcessing === plan._id}
                          >
                            {isProcessing === plan._id ? "Processing..." : plan.ctaButtonText || subscriptionTranslations.plans.choose}
                          </Button>)

                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
     {/* FAQ Section */}
          <motion.div variants={fadeInUp} className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>{subscriptionTranslations.faq.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {subscriptionTranslations.faq.questions[0].question}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {subscriptionTranslations.faq.questions[0].answer}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {subscriptionTranslations.faq.questions[1].question}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {subscriptionTranslations.faq.questions[1].answer}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {subscriptionTranslations.faq.questions[2].question}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {subscriptionTranslations.faq.questions[2].answer}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {subscriptionTranslations.faq.questions[3].question}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {subscriptionTranslations.faq.questions[3].answer}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>        </motion.div>
      </div>
    </div>
  );
}


