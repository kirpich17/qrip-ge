"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Star, Zap, X, Tag, Info, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type DurationOption = {
  duration: string;
  price: number;
  discountPercentage: number;
  isActive: boolean;
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
  durationOptions?: DurationOption[];
  defaultDuration?: string;
};

type AppliedPromoCode = {
  code: string;
  discountType: "percentage" | "fixed" | "free";
  discountValue: number;
  appliesToPlan: string | null;
};

type PlanPromoState = {
  input: string;
  appliedPromo: AppliedPromoCode | null;
  error: string;
  isValidating: boolean;
  selectedDuration: string;
};

export default function PlanSelection() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [planPromoStates, setPlanPromoStates] = useState<Record<string, PlanPromoState>>({});
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const memorialId = searchParams.get("memorialId");

  // Get translations
  const translations = t("planSelection");
  const commonTranslations = t("common");
  const promoTranslations = t("promoCodeManagement");

  // Fetch all active plans using React Query
  const { data: plans, isLoading, error } = useQuery<Plan[]>({
    queryKey: ['allActivePlans'],
    queryFn: async () => {
      const response = await axiosInstance.get("/api/admin/subscription");
      // We only want to show active plans to the user
      return response.data.filter((plan: Plan) => plan.isActive);
    },
  });

  // Initialize promo states when plans are loaded
  useEffect(() => {
    if (plans && !Object.keys(planPromoStates).length) {
      const initialStates: Record<string, PlanPromoState> = {};
      plans.forEach(plan => {
        initialStates[plan._id] = {
          input: "",
          appliedPromo: null,
          error: "",
          isValidating: false,
          selectedDuration: plan.defaultDuration || '1_month'
        };
      });
      setPlanPromoStates(initialStates);
    }
  }, [plans, planPromoStates]);

  // Function to apply promo code to a specific plan
  const handleApplyPromoCode = async (planId: string) => {
    const state = planPromoStates[planId];
    if (!state.input.trim()) {
      setPlanPromoStates(prev => ({
        ...prev,
        [planId]: { ...state, error: "Please enter a promo code" }
      }));
      return;
    }

    if (!memorialId) {
      setPlanPromoStates(prev => ({
        ...prev,
        [planId]: { ...state, error: "Memorial ID is required to apply promo code" }
      }));
      return;
    }

    setPlanPromoStates(prev => ({
      ...prev,
      [planId]: { ...state, isValidating: true, error: "" }
    }));

    try {
      const response = await axiosInstance.post('/api/admin/validate-promo', {
        promoCode: state.input,
        memorialId,
        planId
      });

      if (response.data.isValid) {
        setPlanPromoStates(prev => ({
          ...prev,
          [planId]: {
            ...state,
            appliedPromo: {
              code: state.input,
              discountType: response.data.discountType,
              discountValue: response.data.discountValue,
              appliesToPlan: response.data.appliesToPlan
            },
            error: "",
            isValidating: false
          }
        }));
        toast.success("Promo code applied successfully!");
      } else {
        setPlanPromoStates(prev => ({
          ...prev,
          [planId]: {
            ...state,
            error: response.data.message || "Invalid promo code",
            appliedPromo: null,
            isValidating: false
          }
        }));
      }
    } catch (err: any) {
      setPlanPromoStates(prev => ({
        ...prev,
        [planId]: {
          ...state,
          error: err.response?.data?.message || "Failed to apply promo code",
          appliedPromo: null,
          isValidating: false
        }
      }));
    }
  };

  // Function to remove applied promo code
  const handleRemovePromoCode = (planId: string) => {
    const state = planPromoStates[planId];
    setPlanPromoStates(prev => ({
      ...prev,
      [planId]: {
        ...state,
        appliedPromo: null,
        input: "",
        error: ""
      }
    }));
  };

  // Check if promo code applies to a specific plan
  const doesPromoApplyToPlan = (planId: string, appliedPromo: AppliedPromoCode | null) => {
    if (!appliedPromo) return true;
    if (!appliedPromo.appliesToPlan) return true; // Global code
    return appliedPromo.appliesToPlan === planId;
  };

  // Calculate discounted price for a plan
  const calculateDiscountedPrice = (plan: Plan) => {
    const state = planPromoStates[plan._id];
    if (!state || !state.appliedPromo || !doesPromoApplyToPlan(plan._id, state.appliedPromo)) {
      const selectedDurationOption = plan.durationOptions?.find(opt => 
        opt.duration === (state?.selectedDuration || plan.defaultDuration || '1_month') && opt.isActive
      );
      return selectedDurationOption?.price || plan.price;
    }

    const selectedDurationOption = plan.durationOptions?.find(opt => 
      opt.duration === state.selectedDuration && opt.isActive
    );
    const basePrice = selectedDurationOption?.price || plan.price;

    switch (state.appliedPromo.discountType) {
      case "percentage":
        return basePrice * (1 - state.appliedPromo.discountValue / 100);
      case "fixed":
        return Math.max(0, basePrice - state.appliedPromo.discountValue);
      case "free":
        return 0;
      default:
        return basePrice;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} GEL`;
  };

  // Handle duration selection
  const handleDurationChange = (planId: string, duration: string) => {
    setPlanPromoStates(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        selectedDuration: duration
      }
    }));
  };

  // --- Payment Handler ---
  const handleSelectPlan = async (planId: string) => {
    setIsProcessing(planId);
    try {
      const state = planPromoStates[planId];
      const plan = plans?.find(p => p._id === planId);
      const requestBody: any = { 
        planId, 
        memorialId,
        duration: state?.selectedDuration || plan?.defaultDuration || '1_month'
      };
      
      if (state?.appliedPromo) {
        requestBody.promoCode = state.appliedPromo.code;
      }

      const response = await axiosInstance.post(
        '/api/payments/initiate-memorial-payment', 
        requestBody
      );

      if (response.data.redirectUrl) {
        // Redirect the user to the payment gateway
        window.location.href = response.data.redirectUrl;
      } else {
        toast.error(translations.paymentError?.initiate || "Failed to initiate payment");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || translations.paymentError?.process || "Payment processing failed");
    } finally {
      setIsProcessing(null);
    }
  };

  const clickHandler = () => {
    if (typeof window !== "undefined") {
      const loginData = localStorage.getItem("loginData");
      if (loginData) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">{translations.loading || "Loading..."}</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{translations.error || "Error loading plans"}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Plans Grid */}
      <div className="grid lg:grid-cols-3 md:gap-8 gap-6">
        {plans?.map((plan, index) => {
          const promoState = planPromoStates[plan._id] || {
            input: "",
            appliedPromo: null,
            error: "",
            isValidating: false,
            selectedDuration: plan.defaultDuration || '1_month'
          };
          
          const hasDiscount = promoState?.appliedPromo;
          const selectedDurationOption = plan.durationOptions?.find(opt => 
            opt.duration === (promoState?.selectedDuration || plan.defaultDuration || '1_month') && opt.isActive
          );
          const originalPrice = selectedDurationOption?.price || plan.price;
          const discountedPrice = calculateDiscountedPrice(plan);
          const discountAmount = originalPrice - discountedPrice;
          
          return (
            <motion.div key={plan._id} {...fadeInUp} transition={{ delay: index * 0.1 }}>
              <Card className={`relative h-full flex flex-col ${plan.isPopular ? "border-2 border-[#243b31] shadow-xl" : "border-gray-200 hover:shadow-md"} transition-all duration-300`}>
                {plan.isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#547455] text-white px-4 py-1 z-10">
                    {translations.badgePopular || "Popular"}
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
                  
                  {/* Duration Selection */}
                  {plan.durationOptions && plan.durationOptions.length > 0 && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Select Duration:</label>
                      <Select
                        value={promoState?.selectedDuration || plan.defaultDuration || '1_month'}
                        onValueChange={(value) => handleDurationChange(plan._id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {plan.durationOptions.filter(opt => opt.isActive).map((option) => (
                            <SelectItem key={option.duration} value={option.duration}>
                              <div className="flex justify-between items-center w-full">
                                <span className="capitalize">{option.duration.replace('_', ' ')}</span>
                                <span className="ml-2 font-medium">{option.price} GEL</span>
                                {option.discountPercentage > 0 && (
                                  <span className="ml-2 text-green-600 text-xs">({option.discountPercentage}% off)</span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="mt-4">
                    {hasDiscount ? (
                      <div>
                        <span className="text-4xl font-bold text-green-600">{formatCurrency(discountedPrice)}</span>
                        <span className="text-gray-600"> / {(promoState?.selectedDuration || plan.defaultDuration || '1_month').replace('_', ' ')}</span>
                        <div className="text-sm text-gray-500 line-through">{formatCurrency(originalPrice)}</div>
                        <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                          You save {formatCurrency(discountAmount)}
                        </Badge>
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold text-gray-900">{formatCurrency(originalPrice)}</span>
                        <span className="text-gray-600"> / {(promoState?.selectedDuration || plan.defaultDuration || '1_month').replace('_', ' ')}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0 flex-grow">
                  <ul className="space-y-3 mb-6">
                    <FeatureListItem included={plan.maxPhotos > 0} text={`${plan.maxPhotos >= 999 ? 'Unlimited' : plan.maxPhotos} Photo Uploads`} />
                    <FeatureListItem included={plan.allowSlideshow} text="Photo Slideshow" />
                    <FeatureListItem included={plan.allowVideos} text={`Video Uploads (Max ${plan.maxVideoDuration}s)`} />
                    {plan.features.map((feature) => (
                      <FeatureListItem key={feature._id} included={feature.included} text={feature.text} />
                    ))}
                  </ul>

                  {/* Promo Code Section */}
                  {memorialId && (
                    <div className="border-t pt-4">
                      <div className="flex items-center mb-2">
                        <Tag className="mr-2 h-4 w-4 text-[#243b31]" />
                        <span className="text-sm font-medium">Promo Code</span>
                      </div>
                      
                      {promoState?.appliedPromo ? (
                        <div className="bg-green-50 p-3 rounded-md border border-green-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-green-800 font-medium text-sm">
                                Applied: {promoState.appliedPromo.code}
                              </p>
                              <p className="text-green-600 text-xs">
                                {promoState.appliedPromo.discountType === "percentage" 
                                  ? `${promoState.appliedPromo.discountValue}% off` 
                                  : promoState.appliedPromo.discountType === "fixed"
                                    ? `${promoState.appliedPromo.discountValue} GEL off`
                                    : "100% off - FREE"}
                                {promoState.appliedPromo.appliesToPlan && " (Plan specific)"}
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleRemovePromoCode(plan._id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter promo code"
                              value={promoState?.input || ""}
                              onChange={(e) => {
                                setPlanPromoStates(prev => ({
                                  ...prev,
                                  [plan._id]: {
                                    ...prev[plan._id],
                                    input: e.target.value.toUpperCase(),
                                    error: ""
                                  }
                                }));
                              }}
                              className="flex-1"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') handleApplyPromoCode(plan._id);
                              }}
                            />
                            <Button 
                              onClick={() => handleApplyPromoCode(plan._id)}
                              disabled={promoState?.isValidating || false}
                              size="sm"
                            >
                              {promoState?.isValidating ? "Applying..." : "Apply"}
                            </Button>
                          </div>
                          
                          {promoState?.error && (
                            <p className="text-red-500 text-xs">{promoState.error}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    className="w-full bg-[#243b31] hover:bg-green-700 text-white py-3 text-lg"
                    onClick={() => memorialId ? handleSelectPlan(plan._id) : clickHandler()}
                    disabled={isProcessing === plan._id || (promoState?.appliedPromo?.appliesToPlan && promoState.appliedPromo.appliesToPlan !== plan._id)}
                  >
                    {isProcessing === plan._id
                      ? (translations.cta?.processing || "Processing...")
                      : promoState?.appliedPromo?.discountType === "free" && doesPromoApplyToPlan(plan._id, promoState.appliedPromo)
                        ? "Get For Free"
                        : (plan.planType === "minimal" && (translations.cta?.getStarted || "Get Started")) ||
                          (plan.planType === "premium" && (translations.cta?.goPremium || "Go Premium")) ||
                          (plan.planType === "medium" && (translations.cta?.medium || "Choose Medium")) ||
                          plan.ctaButtonText ||
                          (translations.cta?.selectPlan || "Select Plan")}
                  </Button>
                  
                  {promoState?.appliedPromo?.appliesToPlan && promoState.appliedPromo.appliesToPlan !== plan._id && (
                    <p className="text-xs text-center text-gray-500 mt-2">
                      This promo code doesn't apply to {plan.name} plan
                    </p>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
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