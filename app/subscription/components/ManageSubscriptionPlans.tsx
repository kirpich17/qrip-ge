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
import { useSubscriptionMutations } from "@/app/hooks/useSubscriptionMutations";
import { useQuery } from "@tanstack/react-query";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

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

interface PlanDetails {
  name: string;
  price: number;
  billingPeriod: string;
  description: string;
  _id: string; // Added for better type safety
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
  _id: string;
  bogInitialOrderId?: string;
  endDate?: string;
  gracePeriodEnd?: string;
}

interface PlanStatus {
  planId: string;
  subscriptionId: string;
  planName: string;
  status: string;
  startDate?: string;
  endDate?: string;
  lastPaymentDate?: string;
  canResume: boolean;
}

interface ApiResponse {
  currentSubscription: UserSubscription | null;
  transactions: Transaction[];
  otherPlanCurrentStatus?: {
    monthly?: PlanStatus;
    one_time?: PlanStatus;
  };
}

export default function SubscriptionPage() {
  const { t } = useTranslation();
  const subscriptionTranslations = t("subscription");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Track client-side status to prevent hydration errors
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { cancelSubscription, resumeSubscription, retryPayment, isRetrying } = useSubscriptionMutations();
  const isCanceling = cancelSubscription?.isPending;
  const isResuming = resumeSubscription?.isPending;

  // Check if user is in grace period (can resume subscription)
  const isInGracePeriod = (subscription: UserSubscription | null) => {
    if (!subscription?.gracePeriodEnd || !isClient) return false;
    return new Date(subscription.gracePeriodEnd) > new Date();
  };

  // Fetch data using React Query
  const { 
    data: subscriptionData, 
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
    refetch: refetchSubscription  
  } = useQuery<ApiResponse>({
    queryKey: ['userSubscriptionDetails'],
    queryFn: async () => {
      const response = await axiosInstance.get('/api/user/subscription-details');
      return response.data;
    },
  });

  const { 
    data: plans, 
    isLoading: isPlansLoading,
    error: plansError 
  } = useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/admin/subscription");
      return response.data.filter((plan: Plan) => plan.isActive);
    },
  });

  // Compute grace period status
  const hasActiveGracePeriod = isClient && subscriptionData ? (
    (subscriptionData.currentSubscription?.status === 'canceled' && 
     isInGracePeriod(subscriptionData.currentSubscription)) ||
    (subscriptionData.otherPlanCurrentStatus?.monthly?.status === 'canceled' && 
     subscriptionData.otherPlanCurrentStatus?.monthly?.canResume) ||
    (subscriptionData.otherPlanCurrentStatus?.one_time?.status === 'canceled' && 
     subscriptionData.otherPlanCurrentStatus?.one_time?.canResume)
  ) : false;

  const handleCancelSubscription = (subscriptionId: string) => {
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      cancelSubscription(subscriptionId);
    }
  };

  const handleResumeSubscription = (subscriptionId: string) => {
    resumeSubscription(subscriptionId);
  };

  const handleRetryPayment = (subscriptionId: string) => {
    retryPayment(subscriptionId);
  };
  
  if (isSubscriptionLoading || isPlansLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading Plans...</p>
      </div>
    );
  }

  if (subscriptionError || plansError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500">
          {subscriptionError?.message || plansError?.message || "Failed to load data"}
        </p>
      </div>
    );
  }

  const handlePayment = async (planId: string, planName: string) => {
    setIsProcessing(planId);
    try {
      const response = await axiosInstance.post('/api/payments/initiate', { planId });
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        toast.error("Could not get payment URL. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to start payment for ${planName}.`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleLifeTimePayment = async (planId: string, planName: string) => {
    setIsProcessing(planId);
    try {
      const response = await axiosInstance.post('/api/payments/initiate-one-time-payment', { planId });
      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        toast.error("Could not get payment URL. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to start payment for ${planName}.`);
    } finally {
      setIsProcessing(null);
    }
  };

  const handleRestartFreePlan = async () => {
    setIsProcessing('free');
    try {
      await axiosInstance.post('/api/payments/restart-free');
      toast.success("Free plan restarted successfully!");
      refetchSubscription();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to restart free plan.");
    } finally {
      setIsProcessing(null);
    }
  };

  const currentSubscription = subscriptionData?.currentSubscription;
  const currentPlanName = currentSubscription?.planId.name || "Free";
  const isPaymentFailed = currentSubscription?.status === 'payment_failed';
  
  const showFreePlanButton = !currentSubscription || 
                           (currentSubscription?.planId?.billingPeriod === 'free' && 
                            currentSubscription.status === 'active') ||
                           (currentSubscription?.status === 'canceled' && 
                            !isInGracePeriod(currentSubscription));

  return (
    <div className="min-h-screen bg-gray-50">
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
                        {subscriptionTranslations.currentPlan.title.replace('{plan}', currentPlanName)}
                      </h3>
                      <p className="text-gray-600">
                        {subscriptionTranslations.currentPlan.description}
                      </p>
                      
                      {isPaymentFailed && (
                        <p className="text-sm text-red-600 mt-1">
                          Your last payment attempt failed. Please retry payment to avoid service interruption.
                        </p>
                      )}
                      
                      {isClient && currentSubscription?.status === 'canceled' && currentSubscription?.endDate && (
                        <p className="text-sm text-orange-600 mt-1">
                          {isInGracePeriod(currentSubscription) ? (
                            `You can resume until ${new Date(currentSubscription.gracePeriodEnd).toLocaleDateString()}`
                          ) : (
                            `Access ended on ${new Date(currentSubscription.endDate).toLocaleDateString()}`
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      currentSubscription?.status === 'active' 
                        ? 'border-green-300 bg-green-50 text-green-800'
                        : currentSubscription?.status === 'canceled'
                          ? 'border-gray-300 bg-gray-100 text-gray-800'
                        : isPaymentFailed
                          ? 'border-red-300 bg-red-50 text-red-800'
                          : 'border-yellow-300 bg-yellow-50 text-yellow-800'
                    }`}
                  >
                    {currentSubscription?.status === 'active' 
                      ? subscriptionTranslations.currentPlan.status 
                      : isPaymentFailed
                        ? "Payment Failed"
                        : currentSubscription?.status?.charAt(0).toUpperCase() + currentSubscription?.status?.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-3 md:gap-8 gap-5 mb-12">
            {plans.map((plan, index) => {
              const isCurrentPlan = currentSubscription?.planId._id === plan._id;
              const isFreePlan = plan.billingPeriod === "free";
              const hasActivePaid = currentSubscription && 
                                  currentSubscription?.planId?.billingPeriod !== "free" && 
                                  currentSubscription?.status === "active";
              
              const planStatus = subscriptionData?.otherPlanCurrentStatus?.[plan.billingPeriod as 'monthly' | 'one_time'];
              const isCanceledAndCanResume = planStatus?.status === 'canceled' && planStatus?.canResume;
              
              return (
                <motion.div key={plan._id} {...fadeInUp} transition={{ delay: index * 0.1 }}>
                  <Card className={`relative h-full flex flex-col 
                    ${isCurrentPlan && currentSubscription?.status === 'active' 
                      ? "border-[#243b31] shadow-lg" 
                      : plan.isPopular 
                        ? "shadow-lg" 
                        : "border-gray-200 hover:shadow-md"
                    } transition-all duration-300`}
                  >
                    {isCurrentPlan && currentSubscription?.status === 'active' && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#547455] text-white px-4 py-1 z-10 shadow-md">
                        <span className="flex items-center">
                          <Check className="h-4 w-4 mr-1" />
                          {subscriptionTranslations.plans.current || "Current Plan"}
                        </span>
                      </Badge>
                    )}

                    {plan.isPopular && !isCurrentPlan && (
                      <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 z-10 shadow-md transition-all">
                        <span className="flex items-center">
                          <Crown className="h-4 w-4 mr-1" />
                          {subscriptionTranslations.plans.basic.popular}
                        </span>
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center pb-4">
                      <div className={`md:w-16 md:h-16 w-12 h-12 ${plan.bgColor || 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {isFreePlan && <Star className="md:h-8 md:w-8 w-5 h-5 text-black" />}
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
                      <div className="pt-2 space-y-2">
                        {isCurrentPlan ? (
                          <>
                            {currentSubscription?.status === 'active' && plan.billingPeriod === 'monthly' && (
                              <Button
                                variant="outline"
                                className="w-full border-red-500 text-red-600 hover:bg-red-50"
                                onClick={() => handleCancelSubscription(currentSubscription._id)}
                                disabled={isCanceling}
                              >
                                {isCanceling ? "Canceling..." : "Cancel Subscription"}
                              </Button>
                            )}
                            
                            {currentSubscription?.status === 'active' && plan.billingPeriod === 'one_time' && (
                              <Button variant="outline" className="w-full" disabled>
                                Lifetime Access (Active)
                              </Button>
                            )}
                            
                            {isPaymentFailed && (
                              <Button
                                className="w-full bg-red-600 hover:bg-red-700 text-white"
                               onClick={() => retryPayment(currentSubscription._id)}
                                 disabled={isRetrying}
                              >
                                {isRetrying ? "Processing..." : "Retry Payment"}
                              </Button>
                            )}
                            
                            {currentSubscription?.status === 'canceled' && isInGracePeriod(currentSubscription) && (
                              <Button
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleResumeSubscription(currentSubscription._id)}
                                disabled={isResuming}
                              >
                                {isResuming ? "Resuming..." : "Resume Subscription"}
                              </Button>
                            )}
                            
                            {(currentSubscription?.status === 'active' && isFreePlan) && (
                              <Button variant="outline" className="w-full" disabled>
                                {isCurrentPlan ? "Your Current Plan" : "Start with Free"}
                              </Button>
                            )}
                          </>
                        ) : isFreePlan ? (
                          hasActivePaid ? (
                            <Button
                              variant="outline"
                              className="w-full"
                              disabled
                              title="Cancel your paid plan first"
                            >
                              {isCurrentPlan ? "Your Current Plan" : "Start with Free"}
                            </Button>
                          ) :  (
                            <Button
                              className="w-full bg-black hover:bg-gray-800 text-white"
                              size="lg"
                              onClick={handleRestartFreePlan}
                              disabled={isProcessing === 'free' || !showFreePlanButton}
                            >
                              {isProcessing === 'free' 
                                ? "Processing..." 
                                : showFreePlanButton
                                  ? subscriptionTranslations.plans.restartFree
                                  : subscriptionTranslations.plans.current}
                            </Button>
                          )
                        ) : (
                          isCanceledAndCanResume ? (
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleResumeSubscription(planStatus?.subscriptionId)}
                              disabled={isResuming}
                            >
                              {isResuming ? "Resuming..." : "Resume Subscription"}
                            </Button>
                          ) : (
                            <Button
                              className={`w-full ${plan.isPopular ? "bg-[#547455] hover:bg-green-600 text-white" : "bg-black hover:bg-gray-800 text-white"}`}
                              size="lg"
                              onClick={() => 
                                plan.billingPeriod === 'monthly' 
                                  ? handlePayment(plan._id, plan.name)
                                  : handleLifeTimePayment(plan._id, plan.name)
                              }
                              disabled={
                                isProcessing === plan._id || 
                                (currentSubscription?.status === 'active' && 
                                  currentSubscription?.planId?.billingPeriod !== 'free') ||
                                hasActiveGracePeriod
                              }
                            >
                              {isProcessing === plan._id 
                                ? "Processing..." 
                                : plan.ctaButtonText || subscriptionTranslations.plans.choose}
                            </Button>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* FAQ Section */}
          <motion.div variants={fadeInUp} className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>{subscriptionTranslations.faq.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {subscriptionTranslations.faq.questions.map((question, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {question.question}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {question.answer}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}