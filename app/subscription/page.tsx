"use client";

import { useState } from "react";
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export default function SubscriptionPage() {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      description: "Basic memorial features",
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Star,
      color: "text-black",
      bgColor: "bg-green-50",
      borderColor: "border-gray-200",
      features: [
        "Biography & photo",
        "QR code generation",
        "Basic memorial page",
        "Public directory listing",
      ],
      limitations: [
        "No video upload",
        "No family tree/genealogy",
        "No GPS location & map pin",
        "No multiple admins/collaborators",
        "No lifetime access",
      ],
    },
    {
      name: "Basic Premium",
      description: "Enhanced memorial experience",
      monthlyPrice: 9,
      yearlyPrice: 90,
      icon: Crown,
      color: "text-black",
      bgColor: "bg-green-50",
      borderColor: "border-gray-200",
      popular: true,
      features: [
        "Biography & photo",
        "QR code generation",
        "Video upload",
        "Family tree / genealogy",
        "GPS location & map pin",
        "Advanced customization",
        "Priority support",
      ],
      limitations: ["No multiple admins/collaborators", "No lifetime access"],
    },
    {
      name: "Legacy+",
      description: "Complete memorial solution",
      monthlyPrice: 199,
      yearlyPrice: 199,
      isOneTime: true,
      icon: Zap,
      color: "text-black",
      bgColor: "bg-green-50",
      borderColor: "border-gray-200",
      features: [
        "Biography & photo",
        "QR code generation",
        "Video upload",
        "Family tree / genealogy",
        "GPS location & map pin",
        "Multiple admins/collaborators",
        "Lifetime access (one-time pay)",
        "Premium customization",
        "White-glove setup service",
        "Dedicated support",
      ],
      limitations: [],
    },
  ];

  const currentPlan = "free"; // This would come from user data

  const featureComparison = [
    { feature: "Biography & photo", free: true, basic: true, legacy: true },
    { feature: "QR code", free: true, basic: true, legacy: true },
    { feature: "Video upload", free: false, basic: true, legacy: true },
    {
      feature: "Family tree / genealogy",
      free: false,
      basic: true,
      legacy: true,
    },
    {
      feature: "GPS location & map pin",
      free: false,
      basic: true,
      legacy: true,
    },
    {
      feature: "Multiple admins/collaborators",
      free: false,
      basic: false,
      legacy: true,
    },
    {
      feature: "Lifetime access (one-time pay)",
      free: false,
      basic: false,
      legacy: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:underline"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">
                Subscription Plans
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Memorial Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Select the perfect plan to honor your loved ones with dignity and
              preserve their memories forever
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <span
                className={`text-sm font-medium ${
                  !isYearly ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <Switch checked={isYearly} onCheckedChange={setIsYearly} />
              <span
                className={`text-sm font-medium ${
                  isYearly ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Yearly
                <Badge
                  variant="secondary"
                  className="ml-2 bg-green-100 text-[#243b31]"
                >
                  Save 20%
                </Badge>
              </span>
            </div>
          </div>

          {/* Current Plan Status */}
          <motion.div variants={fadeInUp} className="mb-8">
            <Card className="border-gray-200 bg-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Current Plan: Free
                      </h3>
                      <p className="text-gray-600">
                        Upgrade to unlock premium features
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-gray-200 text-gray-800"
                  >
                    Active
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full ${
                    plan.popular
                      ? "border-[#243b31] shadow-lg "
                      : `${plan.borderColor} hover:shadow-md`
                  } transition-all duration-300`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#547455]  text-white px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      <plan.icon className={`h-8 w-8 ${plan.color}`} />
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
                          $
                          {plan.isOneTime
                            ? plan.monthlyPrice
                            : isYearly
                            ? plan.yearlyPrice
                            : plan.monthlyPrice}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {plan.isOneTime
                            ? "one-time"
                            : `/${isYearly ? "year" : "month"}`}
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
                          Lifetime Access - Pay Once, Own Forever
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          ✅ Included Features
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
                            ❌ Not Included
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
                        {currentPlan ===
                        plan.name.toLowerCase().replace(/\s+/g, "") ? (
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            disabled
                          >
                            Current Plan
                          </Button>
                        ) : plan.name === "Basic Premium" ? (
                          <Button
                            className="w-full bg-[#547455] hover:bg-white hover:text-[#547455] border border-[#547455]"
                            size="lg"
                            onClick={() => {
                              console.log("Upgrading to Basic Premium plan");
                              alert(
                                "Redirecting to payment for Basic Premium..."
                              );
                            }}
                          >
                            <Crown className="h-4 w-4 mr-2" />
                            Upgrade to Basic Premium
                          </Button>
                        ) : plan.name === "Legacy+" ? (
                          <Button
                            className="w-full bg-black hover:bg-white hover:text-black border border-black"
                            size="lg"
                            onClick={() => {
                              console.log("Upgrading to Legacy+ plan");
                              alert(
                                "Redirecting to payment for Legacy+ (One-time payment)..."
                              );
                            }}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Get Legacy+ (Lifetime)
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full bg-transparent"
                            size="lg"
                            disabled
                          >
                            Current Plan
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Feature Comparison</CardTitle>
                <CardDescription>
                  Compare what's included with each plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">
                          Feature
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">
                          Free
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">
                          Basic Premium
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">
                          Legacy+
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {featureComparison.map((row, index) => (
                        <tr key={index}>
                          <td className="py-3 px-4 text-gray-900">
                            {row.feature}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {row.free ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {row.basic ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {row.legacy ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div variants={fadeInUp} className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What's the difference between plans?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Free includes basic features, Basic Premium adds video and
                    family tree, Legacy+ includes everything plus lifetime
                    access and multiple collaborators.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Is Legacy+ really lifetime access?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Yes! Legacy+ is a one-time payment of $199 that gives you
                    lifetime access to all features with no recurring fees.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Can I upgrade or downgrade anytime?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Yes, you can change your plan at any time. Upgrades take
                    effect immediately, and we'll prorate any billing
                    differences.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What happens if I don't pay my subscription?
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Your memorial will show as "unavailable" to visitors. You'll
                    have 30 days to update payment before premium features are
                    disabled.
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
