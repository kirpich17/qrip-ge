"use client";
import { useState, useEffect, useRef } from "react";
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
  const [memorialHasVideos, setMemorialHasVideos] = useState<boolean>(false);
  const toastShownRef = useRef(false);
  const promoAppliedRef = useRef(false);
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const memorialId = searchParams.get("memorialId");
  const preselectedPlanId = searchParams.get("preselectedPlan");
  
  // Debug memorialId and preselected plan
  console.log('MemorialId from URL:', memorialId);
  console.log('Preselected plan ID:', preselectedPlanId);
  console.log('Search params:', searchParams.toString());

  // Get translations
  const translations = t("planSelection");
  const commonTranslations = t("common");
  const promoTranslations = t("promoCodeManagement" as any);
  const plansTranslations = t("plansTranslations");

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

  // Check if memorial has videos
  useEffect(() => {
    const checkMemorialVideos = async () => {
      if (memorialId) {
        console.log('Checking memorial videos for ID:', memorialId);
        try {
          const memorialResponse = await axiosInstance.get(`/api/memorials/${memorialId}`);
          console.log('Full API response:', memorialResponse);
          const memorial = memorialResponse.data.data;
          console.log('Memorial data:', memorial);
          console.log('Video gallery:', memorial.videoGallery);
          console.log('Video gallery type:', typeof memorial.videoGallery);
          console.log('Video gallery length:', memorial.videoGallery?.length);
          console.log('Video gallery is array:', Array.isArray(memorial.videoGallery));
          
          const hasVideos = memorial.videoGallery && memorial.videoGallery.length > 0;
          console.log('Has videos:', hasVideos);
          setMemorialHasVideos(hasVideos);
        } catch (error: any) {
          console.error('Error checking memorial videos:', error);
          console.error('Error details:', error.response?.data);
        }
      } else {
        console.log('No memorialId found');
      }
    };
    
    checkMemorialVideos();
  }, [memorialId]);

  // Handle preselected plan
  useEffect(() => {
    if (preselectedPlanId && plans && !toastShownRef.current) {
      console.log('Preselected plan detected:', preselectedPlanId);
      // Clear the selectedPlanId from localStorage since we're using it
      localStorage.removeItem('selectedPlanId');
      
      // Show a message about the preselected plan only once
      toast.success(`Plan preselected! You can proceed with payment or choose a different plan.`);
      toastShownRef.current = true;
    }
  }, [preselectedPlanId, plans]);

  // Function to apply promo code to a specific plan
  const handleApplyPromoCode = async (planId: string, codeInput?: string) => {
    const state = planPromoStates[planId];
    const codeToUse = codeInput || state.input;
    if (!codeToUse.trim()) {
      setPlanPromoStates(prev => ({
        ...prev,
        [planId]: { ...state, error: "Please enter a promo code" }
      }));
      return;
    }

    // If no memorial yet, persist for later and inform the user
    if (!memorialId) {
      try {
        localStorage.setItem(`pendingPromoCode_${planId}`, codeToUse.trim().toUpperCase());
        toast.success("Promo saved. It will be applied at checkout.");
        setPlanPromoStates(prev => ({
          ...prev,
          [planId]: { ...state, error: "" }
        }));
      } catch (_) {
        setPlanPromoStates(prev => ({
          ...prev,
          [planId]: { ...state, error: "Could not save promo locally. Try again later." }
        }));
      }
      return;
    }

    setPlanPromoStates(prev => ({
      ...prev,
      [planId]: { ...state, isValidating: true, error: "" }
    }));

    try {
      const response = await axiosInstance.post('/api/admin/validate-promo', {
        promoCode: codeToUse,
        memorialId,
        planId
      });

      if (response.data.isValid) {
        setPlanPromoStates(prev => ({
          ...prev,
          [planId]: {
            ...state,
            appliedPromo: {
              code: codeToUse,
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

  // On subscription page: auto-apply promo if present in query/localStorage when memorialId is available
  useEffect(() => {
    if (!memorialId || !plans || promoAppliedRef.current) return;

    const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const promoFromQuery = urlParams.get('promoCode')?.toUpperCase();

    // Prefer promo from query for preselected plan
    if (preselectedPlanId && promoFromQuery) {
      promoAppliedRef.current = true;
      
      // First set the input
      setPlanPromoStates(prev => ({
        ...prev,
        [preselectedPlanId]: {
          ...(prev[preselectedPlanId] || { input: '', appliedPromo: null, error: '', isValidating: false, selectedDuration: plans.find(p => p._id === preselectedPlanId)?.defaultDuration || '1_month' }),
          input: promoFromQuery,
        }
      }));
      
      // Then after state update, validate the promo by calling the function
      setTimeout(() => {
        handleApplyPromoCode(preselectedPlanId, promoFromQuery);
      }, 100);
      return;
    }

    // Otherwise, check any stored pending promo per plan and try to apply
    plans.forEach(plan => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem(`pendingPromoCode_${plan._id}`) : null;
      if (stored && !promoAppliedRef.current) {
        promoAppliedRef.current = true;
        
        // First set the input
        setPlanPromoStates(prev => ({
          ...prev,
          [plan._id]: {
            ...(prev[plan._id] || { input: '', appliedPromo: null, error: '', isValidating: false, selectedDuration: plan.defaultDuration || '1_month' }),
            input: stored,
          }
        }));
        
        // Then after state update, validate the promo by calling the function
        setTimeout(() => {
          handleApplyPromoCode(plan._id, stored);
          // Clear after attempting apply
          try { localStorage.removeItem(`pendingPromoCode_${plan._id}`); } catch (_) {}
        }, 100);
      }
    });
  }, [memorialId, plans, preselectedPlanId]);

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
      
      if (!plan) {
        toast.error("Plan not found");
        setIsProcessing(null);
        return;
      }
      
      // Block minimal plan selection if memorial has videos
      // Video viewing is available for all plans, but video uploads require premium
      if (plan.planType === 'minimal' && memorialId) {
        console.log('🔍 Checking for videos in memorial:', memorialId);
        // Always check the API to ensure we have the latest data
        try {
          const memorialResponse = await axiosInstance.get(`/api/memorials/${memorialId}`);
          const memorial = memorialResponse.data.data;
          console.log('📹 Memorial videoGallery:', memorial.videoGallery);
          const hasVideos = memorial.videoGallery && Array.isArray(memorial.videoGallery) && memorial.videoGallery.length > 0;
          console.log('📹 Has videos:', hasVideos);
          
          if (hasVideos) {
            console.log('❌ Blocking minimal plan - videos detected');
            toast.error("Video upload feature is available for premium memorials. Please select a Premium plan to proceed.", {
              autoClose: 6000,
            });
            setIsProcessing(null);
            return;
          }
        } catch (error) {
          console.error('Error checking memorial videos:', error);
          // If we can't verify, still check the state as fallback
          if (memorialHasVideos) {
            console.log('❌ Blocking minimal plan - videos detected (from state)');
            toast.error("Video upload feature is available for premium memorials. Please select a Premium plan to proceed.", {
              autoClose: 6000,
            });
            setIsProcessing(null);
            return;
          }
        }
      }
      
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
        toast.error(translations?.paymentError?.initiate || "Failed to initiate payment");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || translations?.paymentError?.process || "Payment processing failed");
    } finally {
      setIsProcessing(null);
    }
  };

  const clickHandler = async (planId?: string) => {
    if (typeof window !== "undefined") {
      const loginData = localStorage.getItem("loginData");
      if (loginData) {
        try {
          // Create a draft memorial first
          const response = await axiosInstance.post('/api/memorials/create-draft');
          const memorialId = response.data.memorialId;
          
          // Store the selected plan in localStorage for the memorial creation form
          if (planId) {
            localStorage.setItem('selectedPlanId', planId);
          }
          
          // Redirect to memorial creation with the plan preselected
          router.push(`/memorial/create/${memorialId}`);
        } catch (error) {
          console.error('Error creating draft memorial:', error);
          // Fallback to dashboard if draft creation fails
          router.push("/dashboard");
        }
      } else {
        router.push("/login");
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">{translations?.loading || "Loading..."}</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{translations?.error || "Error loading plans"}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      
      {/* Preselected plan notification */}
      {preselectedPlanId && (
        <div className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start">
              <Check className="h-6 w-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Plan Preselected
                </h3>
                <p className="text-green-700">
                  Your memorial has been created and a plan has been preselected. 
                  You can proceed with payment or choose a different plan below.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
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
              <Card className={`relative h-full flex flex-col ${plan.isPopular ? "border-2 border-[#243b31] shadow-xl" : "border-gray-200 hover:shadow-md"} ${preselectedPlanId === plan._id ? "border-2 border-blue-500 shadow-xl bg-blue-50" : ""} transition-all duration-300`}>
                {plan.isPopular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#547455] text-white px-4 py-1 z-10">
                    {translations?.badgePopular || "Popular"}
                  </Badge>
                )}
                {preselectedPlanId === plan._id && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 z-10">
                    Preselected
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {plan.planType === "premium" && <Crown className="text-black" size={32} />}
                    {plan.planType === "medium" && <Zap className="text-black" size={32} />}
                    {plan.planType === "minimal" && <Star className="text-black" size={32} />}
                  </div>
                  <CardTitle className="text-2xl font-bold">
                    {plansTranslations?.[plan.planType]?.name || plan.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {plansTranslations?.[plan.planType]?.description || plan.description}
                  </CardDescription>
                  
                  {/* Duration Selection */}
                  {plan.durationOptions && plan.durationOptions.length > 0 && (
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        {translations?.selectDuration || "Select Duration"}:
                      </label>
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
                    <FeatureListItem 
                      included={plan.maxPhotos > 0} 
                      text={
                        plan.maxPhotos >= 999 
                          ? (plansTranslations?.[plan.planType]?.features?.photoUploads || translations?.features?.unlimitedPhotos || 'Unlimited Photo Uploads')
                          : (plansTranslations?.[plan.planType]?.features?.photoUploads || translations?.features?.photoUploads?.replace(/{count}/g, plan.maxPhotos.toString()) || `${plan.maxPhotos} Photo Uploads`)
                      } 
                    />
                    <FeatureListItem 
                      included={plan.allowSlideshow} 
                      text={plansTranslations?.[plan.planType]?.features?.slideshow || translations?.features?.slideshow || "Photo Slideshow"} 
                    />
                    <FeatureListItem 
                      included={plan.allowVideos} 
                      text={
                        plansTranslations?.[plan.planType]?.features?.videoUploads?.replace(/{duration}/g, plan.maxVideoDuration.toString()) ||
                        translations?.features?.videoUploads?.replace(/{duration}/g, plan.maxVideoDuration.toString()) ||
                        `Video Uploads (Max ${plan.maxVideoDuration}s)`
                      } 
                    />
                    {plan.features.map((feature) => {
                      // Try to match feature text with translation keys
                      let translatedText = feature.text;
                      const planTranslations = plansTranslations?.[plan.planType]?.features;
                      
                      if (planTranslations) {
                        // Check if feature text matches any translation key
                        if (feature.text.toLowerCase().includes('document') || feature.text.toLowerCase().includes('document upload')) {
                          translatedText = planTranslations.documentUpload || feature.text;
                        } else if (feature.text.toLowerCase().includes('family') || feature.text.toLowerCase().includes('family tree')) {
                          translatedText = planTranslations.familyTree || feature.text;
                        } else if (feature.text.toLowerCase().includes('photo') && !feature.text.toLowerCase().includes('slideshow')) {
                          translatedText = planTranslations.photoUploads || feature.text;
                        }
                      }
                      
                      return (
                        <FeatureListItem key={feature._id} included={feature.included} text={translatedText} />
                      );
                    })}
                  </ul>

                  {/* Promo Code Section (available without memorial; saved for later) */}
                  <div className="border-t pt-4">
                      <div className="flex items-center mb-2">
                        <Tag className="mr-2 h-4 w-4 text-[#243b31]" />
                        <span className="text-sm font-medium">{translations?.promoCode?.title || "Promo Code"}</span>
                      </div>
                      
                      {promoState?.appliedPromo ? (
                        <div className="bg-green-50 p-3 rounded-md border border-green-200">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-green-800 font-medium text-sm">
                                {translations?.promoCode?.applied || "Applied"}: {promoState.appliedPromo.code}
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
                              {translations?.promoCode?.remove || "Remove"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder={translations?.promoCode?.placeholder || "Enter promo code"}
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
                              {promoState?.isValidating 
                                ? (translations?.promoCode?.applying || "Applying...") 
                                : memorialId 
                                  ? (translations?.promoCode?.apply || "Apply") 
                                  : (translations?.promoCode?.save || "Save")}
                            </Button>
                          </div>
                          
                          {promoState?.error && (
                            <p className="text-red-500 text-xs">{promoState.error}</p>
                          )}
                          {!memorialId && !promoState?.error && promoState?.input && (
                            <p className="text-gray-500 text-xs">Promo will be applied at checkout.</p>
                          )}
                        </div>
                      )}
                    </div>
                  
                </CardContent>

                <CardFooter className="pt-0">
                  
                  <Button
                    className="w-full bg-[#243b31] hover:bg-green-700 text-white py-3 text-lg"
                    onClick={() => memorialId ? handleSelectPlan(plan._id) : clickHandler(plan._id)}
                    disabled={isProcessing === plan._id || Boolean(promoState?.appliedPromo?.appliesToPlan && promoState.appliedPromo.appliesToPlan !== plan._id)}
                  >
                    {isProcessing === plan._id
                      ? (translations?.cta?.processing || "Processing...")
                      : promoState?.appliedPromo?.discountType === "free" && doesPromoApplyToPlan(plan._id, promoState.appliedPromo)
                        ? "Get For Free"
                        : (plan.planType === "minimal" && (translations?.cta?.getStarted || "Get Started")) ||
                          (plan.planType === "premium" && (translations?.cta?.goPremium || "Go Premium")) ||
                          (plan.planType === "medium" && (translations?.cta?.medium || "Choose Medium")) ||
                          plan.ctaButtonText ||
                          (translations?.cta?.selectPlan || "Select Plan")}
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