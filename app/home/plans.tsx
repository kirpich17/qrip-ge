"use client";

import { motion } from "framer-motion";
import { Check, Crown, Star, Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslate";
import { useRouter } from "next/navigation";
import ManageSubscriptionPlans from "../../app/subscription/components/ManageSubscriptionPlans";

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
  const plansTranslations = t("homePagePlan");
  const planSelectionTranslations = t("planSelection");
  const plansTranslationsData = t("plansTranslations");
  const router = useRouter();

  const plans: Plan[] = [
    {
      id: "1",
      name: plansTranslationsData?.minimal.name || "Minimal Plan",
      description: plansTranslationsData?.minimal.description || "1 photo + biography",
      price: 5,
      planType: "minimal",
      features: [
        { text: plansTranslationsData?.minimal.features.photoUploads || "1 Photo Uploads", included: true },
        { text: plansTranslationsData?.minimal.features.slideshow || "Photo Slideshow", included: false },
        { text: plansTranslationsData?.minimal.features.videoUploads || "Video Uploads (Max 0s)", included: false },
        { text: plansTranslationsData?.minimal.features.documentUpload || "Document Upload", included: false },
        { text: plansTranslationsData?.minimal.features.familyTree || "Family Tree", included: true },
      ],
    },
    {
      id: "2",
      name: plansTranslationsData?.medium.name || "Medium Plan",
      description: plansTranslationsData?.medium.description || "Up to 10 photos per memorial with slideshow",
      price: 15,
      planType: "medium",
      isPopular: true,
      features: [
        { text: plansTranslationsData?.medium.features.photoUploads || "10 Photo Uploads", included: true },
        { text: plansTranslationsData?.medium.features.slideshow || "Photo Slideshow", included: true },
        { text: plansTranslationsData?.medium.features.videoUploads || "Video Uploads (Max 0s)", included: false },
        { text: plansTranslationsData?.medium.features.documentUpload || "Document Upload", included: false },
        { text: plansTranslationsData?.medium.features.familyTree || "Family Tree", included: true },
      ],
    },
    {
      id: "3",
      name: plansTranslationsData?.premium.name || "Premium Plan",
      description: plansTranslationsData?.premium.description || "Unlimited photos, slideshow, videos",
      price: 30,
      planType: "premium",
      features: [
        { text: plansTranslationsData?.premium.features.photoUploads || "Unlimited Photo Uploads", included: true },
        { text: plansTranslationsData?.premium.features.slideshow || "Photo Slideshow", included: true },
        { text: plansTranslationsData?.premium.features.videoUploads || "Video Uploads (Max 60s)", included: true },
        { text: plansTranslationsData?.premium.features.documentUpload || "Document Upload", included: true },
        { text: plansTranslationsData?.premium.features.familyTree || "Family Tree", included: true },
      ],
    },
  ];

  const getButtonText = (planType: string) => {
    switch (planType) {
      case "minimal": return planSelectionTranslations?.cta.getStarted || "Get Started";
      case "medium": return planSelectionTranslations?.cta.medium || "Select Plan";
      case "premium": return planSelectionTranslations?.cta.goPremium || "Go Premium";
      default: return planSelectionTranslations?.cta.selectPlan || "Select Plan";
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
            {plansTranslations?.heading || "Choose Your Plan"}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {plansTranslations?.title || "Select the perfect plan to honor your loved ones"}
          </p>
        </motion.div>

        <ManageSubscriptionPlans />
      </div>
    </section>
  );
};

export default Plans;