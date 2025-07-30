
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Crown, Star, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";
import { sub } from "date-fns";
import axiosInstance from "@/services/axiosInstance";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

type Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isOneTime: boolean;
  features: string[];
  limitations: string[];
  isActive: boolean;
  isPopular?: boolean;
  color?: string;
  bgColor?: string;
  borderColor?: string;
};


export default function SubscriptionPage() {
  const { t } = useTranslation();
  const subscriptionTranslations = t("subscription");
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("");

  const fetchPlans = async () => {
    try {
      const response = await axiosInstance.get("/api/admin/subscription");
      setPlans(response.data);
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


  useEffect(() => {
    const loginDataString = localStorage.getItem("loginData");
    if (loginDataString) {
      try {
        const loginData = JSON.parse(loginDataString);
        setCurrentPlan(loginData.subscriptionPlan || "");
      } catch (err) {
        console.error("Error parsing loginData:", err);
      }
    }
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between  flex-wrap gap-3">
            <div className="flex items-center ">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:underline gap-2 text-base"
              >
                <ArrowLeft className="h-5 w-5 " />
                {subscriptionTranslations.header.back}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="md:h-6 md:w-6 w-4 h-4 text-white" />
              <span className="md:text-xl text-base font-bold text-white">
                {subscriptionTranslations.header.title}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="md:text-4xl text-2xl font-bold text-gray-900 md:mb-4 mb-3">
              {subscriptionTranslations.title}
            </h1>
            <p className="md:text-xl text-base text-gray-600 max-w-3xl mx-auto mb-8">
              {subscriptionTranslations.description}
            </p>

            {/* Billing Toggle */}
            {/* <div className="flex items-center justify-center space-x-4 mb-8 flex-wrap">
              <span
                className={`text-sm font-medium ${!isYearly ? "text-gray-900" : "text-gray-500"
                  }`}
              >
                {subscriptionTranslations.billing.monthly}
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span
                className={`text-sm font-medium ${isYearly ? "text-gray-900" : "text-gray-500"
                  }`}
              >
                {subscriptionTranslations.billing.yearly}
                <Badge
                  variant="secondary"
                  className="ml-2 bg-green-100 text-[#243b31]"
                >
                  {subscriptionTranslations.billing.save}
                </Badge>
              </span>
            </div> */}
          </div>

          {/* Current Plan Status */}
          <motion.div variants={fadeInUp} className="mb-8">
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="md:p-6 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center  flex-wrap gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {subscriptionTranslations.currentPlan.title}
                      </h3>
                      <p className="text-gray-600">
                        {subscriptionTranslations.currentPlan.description}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-gray-200 text-gray-800"
                  >
                    {subscriptionTranslations.currentPlan.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-3 md:gap-8 gap-5 mb-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full ${plan.popular
                    ? "border-[#243b31] shadow-lg "
                    : `${plan.borderColor} hover:shadow-md`
                    } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#547455]  text-white px-4 py-1">
                        {subscriptionTranslations.plans.basic.popular}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`md:w-16 md:h-16 w-12 h-12 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      {plan.name === "Free" && (
                        <Star className="md:h-8 md:w-8 w-5 h-5 text-black" />
                      )}
                      {plan.name === "Monthly Premium" && (
                        <Crown className="md:h-8 md:w-8 w-5 h-5 text-black" />
                      )}
                      {plan.name === "Life Time" && (
                        <Zap className="md:h-8 md:w-8 w-5 h-5 text-black" />
                      )}
                    </div>
                    <CardTitle className="text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.isOneTime
                            ? plan.monthlyPrice
                            : isYearly
                              ? plan.yearlyPrice
                              : plan.monthlyPrice}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {plan.isOneTime
                            ? subscriptionTranslations.plans.legacy.period
                            : `${isYearly
                              ? subscriptionTranslations.plans.free.period
                              : subscriptionTranslations.plans.basic.period
                            }`}
                        </span>
                      </div>
                      {isYearly && !plan.isOneTime && plan.monthlyPrice > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          Save ${plan.monthlyPrice * 12 - plan.yearlyPrice} per
                          year
                        </p>
                      )}
                      {plan.isOneTime && (
                        <p className="text-sm text-[#547455] mt-1 font-medium">
                          {subscriptionTranslations.plans.legacy.lifetime}
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          ✅ {subscriptionTranslations.comparison.title}
                        </h4>
                        <ul className="space-y-2">
                          {plan.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-start space-x-3"
                            >
                              <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 text-sm">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Limitations */}
                      {plan.limitations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            ❌ {subscriptionTranslations.comparison.notincluded}
                          </h4>
                          <ul className="space-y-2">
                            {plan.limitations.map(
                              (limitation, limitationIndex) => (
                                <li
                                  key={limitationIndex}
                                  className="flex items-start space-x-3"
                                >
                                  <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                  <span className="text-gray-500 text-sm">
                                    {limitation}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                      <Separator />

                      {/* Action Button */}
                      <div className="pt-2">
                        {currentPlan.toLowerCase() === plan.name.toLowerCase().replace(/\s+/g, "") ? (
                          <Button variant="outline" className="w-full" disabled>
                            {subscriptionTranslations.plans.current}
                          </Button>
                        ) : (
                          <Button
                            className={`w-full ${plan.isPopular
                                ? "bg-[#547455] hover:bg-white hover:text-[#547455] border border-[#547455]"
                                : "bg-black hover:bg-white hover:text-black border border-black"
                              }`}
                            size="lg"
                            onClick={() => {
                              console.log(`Upgrading to ${plan.name} plan`);
                              alert(`Redirecting to payment for ${plan.name}...`);
                            }}
                          >
                            {plan.isPopular && <Crown className="h-4 w-4 mr-2" />}
                            {plan.isOneTime && <Zap className="h-4 w-4 mr-2" />}
                            {subscriptionTranslations.plans.choose}
                          </Button>
                        )}
                      </div>

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
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
