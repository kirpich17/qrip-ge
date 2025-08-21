"use client";

import { motion } from "framer-motion";
import { Check, Crown, Star, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  planType: "minimal" | "medium" | "premium";
  features: {
    text: string;
    included: boolean;
  }[];
  isPopular?: boolean;
};

const Plans = () => {
  const { t } = useTranslation();
  const plansTranslations = t("plans");
    const router = useRouter();

  // Sample plans data matching the image
  const plans: Plan[] = [
    {
      id: "1",
      name: "Minimal Plan",
      description: "1 photo + biography",
      price: 5,
      planType: "minimal",
      features: [
        { text: "1 Photo Uploads", included: true },
        { text: "Photo Slideshow", included: false },
        { text: "Video Uploads (Max 0s)", included: false },
        { text: "Document Upload", included: false },
        { text: "Family Tree", included: true },
      ],
    },
    {
      id: "2",
      name: "Medium Plan",
      description: "Up to 10 photos per memorial with slideshow",
      price: 15,
      planType: "medium",
      isPopular: true,
      features: [
        { text: "10 Photo Uploads", included: true },
        { text: "Photo Slideshow", included: true },
        { text: "Video Uploads (Max 0s)", included: false },
        { text: "Document Upload", included: false },
        { text: "Family Tree", included: true },
      ],
    },
    {
      id: "3",
      name: "Premium Plan",
      description: "Unlimited photos, slideshow, videos",
      price: 30,
      planType: "premium",
      features: [
        { text: "Unlimited Photo Uploads", included: true },
        { text: "Photo Slideshow", included: true },
        { text: "Video Uploads (Max 60s)", included: true },
        { text: "Document Upload", included: true },
        { text: "Family Tree", included: true },
      ],
    },
  ];

  const getButtonText = (planType: string) => {
    switch (planType) {
      case "minimal": return "Get Started";
      case "medium": return "Select Plan";
      case "premium": return "Go Premium";
      default: return "Choose Plan";
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case "premium": return Crown;
      case "medium": return Zap;
      case "minimal": 
      default: 
        return Star;
    }
  };
  const clickHandler=()=>{

    if (typeof window !== "undefined") {
    const loginData = localStorage.getItem("loginData");
    console.log("🚀 ~ clickHandler ~ loginData:", loginData)

    if (loginData) {
      // user is logged in → go to dashboard
      // window.location.href = "/dashboard";
      router.push("/dashboard")
    } else {
      // user not logged in → go to login
      // window.location.href = "/login";
      router.push("/login")
    }

  }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan to honor your loved ones
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => {
            const PlanIcon = getPlanIcon(plan.planType);
            
            return (
              <motion.div key={plan.id} variants={fadeInUp}>
                <Card
                  className={`relative h-full flex flex-col overflow-hidden ${
                    plan.isPopular
                      ? "border-2 border-green-600 shadow-xl md:scale-105"
                      : "border border-gray-200 shadow-md"
                  } transition-all duration-300 hover:shadow-xl`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-600 text-white px-3 py-1 text-xs font-medium">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4 pt-8">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PlanIcon className="h-7 w-7 text-green-700" />
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900">
                        {plan.name}
                      </CardTitle>
                      <p className="text-gray-600 mt-2">{plan.description}</p>
                    </div>
                    <div className="mt-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">
                          {plan.price} GEL
                        </span>
                        <span className="text-gray-600 ml-2">/ one-time</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 pb-8 flex flex-col flex-grow">
                    <ul className="space-y-4 mb-8 flex-grow">
                      {plan.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start space-x-3"
                        >
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                              feature.included
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            {feature.included ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <X className="h-3 w-3 text-red-600" />
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              feature.included
                                ? "text-gray-700"
                                : "text-gray-500"
                            }`}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full py-3 text-base font-medium ${
                        plan.isPopular
                          ? "bg-[#547455] hover:[#547455] text-white"
                          : plan.planType === "minimal"
                          ? "bg-[#547455] hover:bg-[#547455] text-white"
                          : "bg-[#547455] hover:bg-[#547455] text-white"
                      }`}
                      size="lg"
                      onClick={ clickHandler}
                    >
                      {getButtonText(plan.planType)}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Plans;