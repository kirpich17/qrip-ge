"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Star, Zap, X } from "lucide-react";
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
import axiosInstance from "@/services/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslate";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

// --- Type Definitions ---
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
  planType: "minimal" | "medium" | "premium";
  ctaButtonText: string;
  features: Feature[];
  isActive: boolean;
  isPopular?: boolean;
  maxPhotos: number;
  allowSlideshow: boolean;
  allowVideos: boolean;
  maxVideoDuration: number;
};

export default function PlanSelection() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const { t } = useTranslation();
     const router = useRouter();
  const translations = t("planSelection");
    const translationsAd = t("adminSubscriptionPage");

  

    const searchParams = useSearchParams();
  const memorialId = searchParams.get("memorialId");
  console.log("🚀 ~ PlanSelection ~ memorialId:", memorialId)

  // Fetch all active plans using React Query
  const { data: plans, isLoading, error } = useQuery<Plan[]>({
    queryKey: ['allActivePlans'],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/admin/subscription");
      // We only want to show active plans to the user
      return response.data.filter((plan: Plan) => plan.isActive);
    },
  });

  if (isLoading) {
        return <div className="text-center py-10">{translations.loading}</div>;
  }

  if (error) {
     return <div className="text-center py-10 text-red-500">{translations.error}</div>;
  }

  // --- Payment Handler ---
  // This function will be called when a user clicks to select a plan.
  // It should redirect to your payment provider (e.g., Stripe).
  const handleSelectPlan = async (planId: string) => {
    setIsProcessing(planId);
    try {
      // NOTE: This endpoint should create a one-time payment session and return a redirect URL.
      const response = await axiosInstance.post('/api/payments/initiate-memorial-payment', { planId, memorialId   });
      
      if (response.data.redirectUrl) {
        // Redirect the user to the payment gateway
        window.location.href = response.data.redirectUrl;
      } else {
             toast.error(translations.paymentError.initiate);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message  || translations.paymentError.process);
    } finally {
      setIsProcessing(null);
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
    <div className="grid lg:grid-cols-3 md:gap-8 gap-5">
      {plans?.map((plan, index) => (
        <motion.div key={plan._id} {...fadeInUp} transition={{ delay: index * 0.1 }}>
          <Card className={`relative h-full flex flex-col 
            ${plan.isPopular ? "border-2 border-[#243b31] shadow-xl" : "border-gray-200 hover:shadow-md"} 
            transition-all duration-300`}
          >
            {plan.isPopular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#547455] text-white px-4 py-1 z-10">
              {translations.badgePopular}
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {plan.planType === "premium" && <Crown className="text-black" size={32} />}
                {plan.planType === "medium" && <Zap className="text-black" size={32} />}
                {plan.planType === "minimal" && <Star className="text-black" size={32} />}
              </div>
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-gray-600">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price} GEL</span>
                <span className="text-gray-600"> / one-time</span>
              </div>
            </CardHeader>

            <CardContent className="pt-0 flex-grow flex flex-col">
              <ul className="space-y-2 flex-grow mb-6">
                <FeatureListItem included={plan.maxPhotos > 0} text={`${plan.maxPhotos >= 999 ? 'Unlimited' : plan.maxPhotos} Photo Uploads`} />
                <FeatureListItem included={plan.allowSlideshow} text="Photo Slideshow" />
                <FeatureListItem included={plan.allowVideos} text={`Video Uploads (Max ${plan.maxVideoDuration}s)`} />
                {plan.features.map((feature) => (
                  <FeatureListItem key={feature._id} included={feature.included} text={feature.text} />
                ))}
              </ul>

              {/* <ul className="space-y-2 flex-grow mb-6">
                      <FeatureListItem included={plan.maxPhotos > 0} text={plan.maxPhotos >= 999 ? translationsAd.card.features.unlimitedPhotos : translationsAd.card.features.photoUploads.replace('{count}', String(plan.maxPhotos))} />
                      <FeatureListItem included={plan.allowSlideshow} text={translationsAd.card.features.slideshow} />
                      <FeatureListItem included={plan.allowVideos} text={translationsAd.card.features.videoUploads.replace('{duration}', String(plan.maxVideoDuration))} />
                      {plan.features.map((feature, idx) => (
                        <FeatureListItem key={idx} included={feature.included} text={feature.text} />
                      ))}


                      
                    </ul> */}
              
              <Separator className="my-4" />

              <div className="pt-2">
                <Button
                  className="w-full bg-[#243b31] hover:bg-green-700 text-white"
                  size="lg"

                    onClick={() =>
                    memorialId ? handleSelectPlan(plan._id) : clickHandler()
                  }
                  disabled={isProcessing === plan._id}
                >
                     {isProcessing === plan._id
                        ? translations.cta.processing
                        : (plan.planType === "minimal" && translations.cta.getStarted) || // Example conditional text
                          (plan.planType === "premium" && translations.cta.goPremium) || // Example conditional text
                          (plan.planType === "medium" && translations.cta.medium) || // Example conditional text
                          plan.ctaButtonText ||
                          translations.cta.selectPlan}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Helper component for displaying feature list items consistently
const FeatureListItem = ({ included, text }: { included: boolean, text: string }) => (
  <li className="flex items-start space-x-3">
    {included ? (
      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
    ) : (
      <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
    )}
    <span className={`text-sm ${included ? 'text-gray-700' : 'text-gray-500 line-through'}`}>
      {text}
    </span>
  </li>
);