// "use client";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Check, Crown, Star, Zap, X, Tag, ChevronDown, ChevronUp, Info } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "react-toastify";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import axiosInstance from "@/services/axiosInstance";
// import { useQuery } from "@tanstack/react-query";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useTranslation } from "@/hooks/useTranslate";

// const fadeInUp = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.6 },
// };

// // --- Type Definitions ---
// type Feature = {
//   text: string;
//   included: boolean;
//   _id?: string;
// };

// type Plan = {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   planType: "minimal" | "medium" | "premium";
//   ctaButtonText: string;
//   features: Feature[];
//   isActive: boolean;
//   isPopular?: boolean;
//   maxPhotos: number;
//   allowSlideshow: boolean;
//   allowVideos: boolean;
//   maxVideoDuration: number;
// };

// type PromoCode = {
//   _id: string;
//   code: string;
//   discountType: "percentage" | "fixed" | "free";
//   discountValue: number;
//   expiryDate: string;
//   maxUsage: number | null;
//   currentUsage: number;
//   isActive: boolean;
//   appliesToPlan: string | null;
//   appliesToUser: string | null;
// };

// type AppliedPromoCode = {
//   code: string;
//   discountType: "percentage" | "fixed" | "free";
//   discountValue: number;
//   appliesToPlan: string | null;
// };

// export default function PlanSelection() {
//   const [isProcessing, setIsProcessing] = useState<string | null>(null);
//   const [promoCodeInput, setPromoCodeInput] = useState("");
//   const [appliedPromoCode, setAppliedPromoCode] = useState<AppliedPromoCode | null>(null);
//   const [isPromoSectionOpen, setIsPromoSectionOpen] = useState(false);
//   const [promoError, setPromoError] = useState("");
//   const [isValidating, setIsValidating] = useState(false);
//   const { t } = useTranslation();
//   const router = useRouter();
//   const translations = t("planSelection");
//   const translationsAd = t("adminSubscriptionPage");

//   const searchParams = useSearchParams();
//   const memorialId = searchParams.get("memorialId");

//   // Fetch all active plans using React Query
//   const { data: plans, isLoading, error } = useQuery<Plan[]>({
//     queryKey: ['allActivePlans'],
//     queryFn: async () => {
//       const response = await axiosInstance.get("/api/admin/subscription");
//       // We only want to show active plans to the user
//       return response.data.filter((plan: Plan) => plan.isActive);
//     },
//   });

//   // Function to apply promo code
//   const handleApplyPromoCode = async () => {
//     if (!promoCodeInput.trim()) {
//       setPromoError("Please enter a promo code");
//       return;
//     }

//     if (!memorialId) {
//       setPromoError("Memorial ID is required to apply promo code");
//       return;
//     }

//     setIsValidating(true);
//     setPromoError("");

//     try {
//       const response = await axiosInstance.post('/api/admin/validate-promo', {
//         promoCode: promoCodeInput,
//         memorialId
//       });

//       if (response.data.isValid) {
//         setAppliedPromoCode({
//           code: promoCodeInput,
//           discountType: response.data.discountType,
//           discountValue: response.data.discountValue,
//           appliesToPlan: response.data.appliesToPlan
//         });
//         toast.success("Promo code applied successfully!");
//       } else {
//         setPromoError(response.data.message || "Invalid promo code");
//         setAppliedPromoCode(null);
//       }
//     } catch (err: any) {
//       setPromoError(err.response?.data?.message || "Failed to apply promo code");
//       setAppliedPromoCode(null);
//     } finally {
//       setIsValidating(false);
//     }
//   };

//   // Function to remove applied promo code
//   const handleRemovePromoCode = () => {
//     setAppliedPromoCode(null);
//     setPromoCodeInput("");
//     setPromoError("");
//   };

//   // Check if promo code applies to a specific plan
//   const doesPromoApplyToPlan = (planId: string) => {
//     if (!appliedPromoCode) return true;
//     if (!appliedPromoCode.appliesToPlan) return true; // Global code
//     return appliedPromoCode.appliesToPlan === planId;
//   };

//   // Calculate discounted price
//   const calculateDiscountedPrice = (originalPrice: number, planId: string) => {
//     if (!appliedPromoCode || !doesPromoApplyToPlan(planId)) return originalPrice;

//     switch (appliedPromoCode.discountType) {
//       case "percentage":
//         return originalPrice * (1 - appliedPromoCode.discountValue / 100);
//       case "fixed":
//         return Math.max(0, originalPrice - appliedPromoCode.discountValue);
//       case "free":
//         return 0;
//       default:
//         return originalPrice;
//     }
//   };

//   // Format currency
//   const formatCurrency = (amount: number) => {
//     return `${amount.toFixed(2)} GEL`;
//   };

//   // --- Payment Handler ---
//   const handleSelectPlan = async (planId: string) => {
//     setIsProcessing(planId);
//     try {
//       const requestBody: any = { planId, memorialId };
      
//       if (appliedPromoCode) {
//         requestBody.promoCode = appliedPromoCode.code;
//       }

//       const response = await axiosInstance.post(
//         '/api/payments/initiate-memorial-payment', 
//         requestBody
//       );

//       if (response.data.redirectUrl) {
//         // Redirect the user to the payment gateway
//         window.location.href = response.data.redirectUrl;
//       } else {
//         toast.error(translations.paymentError.initiate);
//       }
//     } catch (err: any) {
//       toast.error(err.response?.data?.message || translations.paymentError.process);
//     } finally {
//       setIsProcessing(null);
//     }
//   };

//   const clickHandler = () => {
//     if (typeof window !== "undefined") {
//       const loginData = localStorage.getItem("loginData");
//       if (loginData) {
//         router.push("/dashboard");
//       } else {
//         router.push("/login");
//       }
//     }
//   };

//   if (isLoading) {
//     return <div className="text-center py-10">{translations.loading}</div>;
//   }

//   if (error) {
//     return <div className="text-center py-10 text-red-500">{translations.error}</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4">
//       {/* Promo Code Section - Only show when memorialId is present */}
//       {memorialId && (
//         <Card className="mb-8">
//           <CardContent className="p-6">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//               <div className="flex items-center">
//                 <Tag className="mr-2 h-5 w-5 text-[#243b31]" />
//                 <h3 className="font-semibold text-lg">Apply Promo Code</h3>
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Info className="ml-2 h-4 w-4 text-gray-400 cursor-help" />
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p className="max-w-xs">Enter a valid promo code to get discounts on your selected plan.</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//               </div>
              
//               <div className="flex-1 max-w-md">
//                 {appliedPromoCode ? (
//                   <div className="bg-green-50 p-3 rounded-md border border-green-200">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <p className="text-green-800 font-medium">
//                           Promo code applied: {appliedPromoCode.code}
//                         </p>
//                         <p className="text-green-600 text-sm">
//                           {appliedPromoCode.discountType === "percentage" 
//                             ? `${appliedPromoCode.discountValue}% off` 
//                             : appliedPromoCode.discountType === "fixed"
//                               ? `${appliedPromoCode.discountValue} GEL off`
//                               : "100% off - FREE"}
//                           {appliedPromoCode.appliesToPlan && " (Plan specific)"}
//                         </p>
//                       </div>
//                       <Button 
//                         variant="outline" 
//                         size="sm" 
//                         onClick={handleRemovePromoCode}
//                         className="text-red-600 border-red-200 hover:bg-red-50"
//                       >
//                         Remove
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex gap-2">
//                     <Input
//                       placeholder="Enter promo code"
//                       value={promoCodeInput}
//                       onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
//                       className="flex-1"
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter') handleApplyPromoCode();
//                       }}
//                     />
//                     <Button 
//                       onClick={handleApplyPromoCode}
//                       disabled={isValidating}
//                     >
//                       {isValidating ? "Applying..." : "Apply"}
//                     </Button>
//                   </div>
//                 )}
                
//                 {promoError && (
//                   <p className="text-red-500 text-sm mt-2">{promoError}</p>
//                 )}
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       )}

//       {/* Plans Grid */}
//       <div className="grid lg:grid-cols-3 md:gap-8 gap-6">
//         {plans?.map((plan, index) => {
//           const hasDiscount = appliedPromoCode && doesPromoApplyToPlan(plan._id);
//           const originalPrice = plan.price;
//           const discountedPrice = calculateDiscountedPrice(originalPrice, plan._id);
//           const discountAmount = originalPrice - discountedPrice;
          
//           return (
//             <motion.div key={plan._id} {...fadeInUp} transition={{ delay: index * 0.1 }}>
//               <Card className={`relative h-full flex flex-col ${plan.isPopular ? "border-2 border-[#243b31] shadow-xl" : "border-gray-200 hover:shadow-md"} transition-all duration-300`}>
//                 {plan.isPopular && (
//                   <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#547455] text-white px-4 py-1 z-10">
//                     {translations.badgePopular}
//                   </Badge>
//                 )}

//                 <CardHeader className="text-center pb-4">
//                   <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     {plan.planType === "premium" && <Crown className="text-black" size={32} />}
//                     {plan.planType === "medium" && <Zap className="text-black" size={32} />}
//                     {plan.planType === "minimal" && <Star className="text-black" size={32} />}
//                   </div>
//                   <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
//                   <CardDescription className="text-gray-600">{plan.description}</CardDescription>
//                   <div className="mt-4">
//                     {hasDiscount ? (
//                       <div>
//                         <span className="text-4xl font-bold text-green-600">{formatCurrency(discountedPrice)}</span>
//                         <span className="text-gray-600"> / one-time</span>
//                         <div className="text-sm text-gray-500 line-through">{formatCurrency(originalPrice)}</div>
//                         <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
//                           You save {formatCurrency(discountAmount)}
//                         </Badge>
//                       </div>
//                     ) : (
//                       <div>
//                         <span className="text-4xl font-bold text-gray-900">{formatCurrency(originalPrice)}</span>
//                         <span className="text-gray-600"> / one-time</span>
//                       </div>
//                     )}
//                   </div>
//                 </CardHeader>

//                 <CardContent className="pt-0 flex-grow">
//                   <ul className="space-y-3 mb-6">
//                     <FeatureListItem included={plan.maxPhotos > 0} text={`${plan.maxPhotos >= 999 ? 'Unlimited' : plan.maxPhotos} Photo Uploads`} />
//                     <FeatureListItem included={plan.allowSlideshow} text="Photo Slideshow" />
//                     <FeatureListItem included={plan.allowVideos} text={`Video Uploads (Max ${plan.maxVideoDuration}s)`} />
//                     {plan.features.map((feature) => (
//                       <FeatureListItem key={feature._id} included={feature.included} text={feature.text} />
//                     ))}
//                   </ul>
//                 </CardContent>

//                 <CardFooter className="pt-0">
//                   <Button
//                     className="w-full bg-[#243b31] hover:bg-green-700 text-white py-3 text-lg"
//                     onClick={() => memorialId ? handleSelectPlan(plan._id) : clickHandler()}
//                     disabled={isProcessing === plan._id || (appliedPromoCode?.appliesToPlan && appliedPromoCode.appliesToPlan !== plan._id)}
//                   >
//                     {isProcessing === plan._id
//                       ? translations.cta.processing
//                       : appliedPromoCode?.discountType === "free" && doesPromoApplyToPlan(plan._id)
//                         ? "Get For Free"
//                         : (plan.planType === "minimal" && translations.cta.getStarted) ||
//                           (plan.planType === "premium" && translations.cta.goPremium) ||
//                           (plan.planType === "medium" && translations.cta.medium) ||
//                           plan.ctaButtonText ||
//                           translations.cta.selectPlan}
//                   </Button>
                  
//                   {appliedPromoCode?.appliesToPlan && appliedPromoCode.appliesToPlan !== plan._id && (
//                     <p className="text-xs text-center text-gray-500 mt-2">
//                       This promo code doesn't apply to {plan.name} plan
//                     </p>
//                   )}
//                 </CardFooter>
//               </Card>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // Helper component for displaying feature list items consistently
// const FeatureListItem = ({ included, text }: { included: boolean, text: string }) => (
//   <li className="flex items-start space-x-3">
//     {included ? (
//       <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
//     ) : (
//       <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
//     )}
//     <span className={`text-sm ${included ? 'text-gray-700' : 'text-gray-500 line-through'}`}>
//       {text}
//     </span>
//   </li>
// );






"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Crown, Star, Zap, X, Tag, Info } from "lucide-react";
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
          isValidating: false
        };
      });
      setPlanPromoStates(initialStates);
    }
  }, [plans, planPromoStates]);

  // Function to apply promo code to a specific plan
  const handleApplyPromoCode = async (planId: string) => {
    if (!memorialId) {
      toast.error(translations.memorialIdRequired );
      return;
    }

    const promoCode = planPromoStates[planId]?.input;
    if (!promoCode.trim()) {
      setPlanPromoStates(prev => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          error: translations.promoCode?.enterCode}
      }));
      return;
    }

    setPlanPromoStates(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        isValidating: true,
        error: ""
      }
    }));

    try {
      const response = await axiosInstance.post('/api/admin/validate-promo', {
        promoCode,
        memorialId,
        planId // Pass the plan ID for validation
      });

      if (response.data.isValid) {
        setPlanPromoStates(prev => ({
          ...prev,
          [planId]: {
            ...prev[planId],
            appliedPromo: {
              code: promoCode,
              discountType: response.data.discountType,
              discountValue: response.data.discountValue,
              appliesToPlan: response.data.appliesToPlan
            },
            error: "",
            isValidating: false
          }
        }));
        toast.success(translations.promoCode?.success || "Promo code applied successfully!");
      } else {
        setPlanPromoStates(prev => ({
          ...prev,
          [planId]: {
            ...prev[planId],
            error: response.data.message || translations.promoCode?.invalid || "Invalid promo code",
            isValidating: false
          }
        }));
      }
    } catch (err: any) {
      setPlanPromoStates(prev => ({
        ...prev,
        [planId]: {
          ...prev[planId],
          error: err.response?.data?.message || translations.promoCode?.failed || "Failed to apply promo code",
          isValidating: false
        }
      }));
    }
  };

  // Function to remove applied promo code from a plan
  const handleRemovePromoCode = (planId: string) => {
    setPlanPromoStates(prev => ({
      ...prev,
      [planId]: {
        ...prev[planId],
        input: "",
        appliedPromo: null,
        error: ""
      }
    }));
  };

  // Calculate discounted price for a plan
  const calculateDiscountedPrice = (plan: Plan) => {
    const promoState = planPromoStates[plan._id];
    if (!promoState?.appliedPromo) return plan.price;

    switch (promoState.appliedPromo.discountType) {
      case "percentage":
        console.log("🚀 ~ calculateDiscountedPrice ~ promoState.appliedPromo.discountValue:", promoState.appliedPromo.discountValue)
        return plan.price * (1 - promoState.appliedPromo.discountValue / 100);
      case "fixed":
        return Math.max(0, plan.price - promoState.appliedPromo.discountValue);
      case "free":
        return 0;
      default:
        return plan.price;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} GEL`;
  };

  // --- Payment Handler ---
  const handleSelectPlan = async (planId: string) => {
    setIsProcessing(planId);
    try {
      const promoState = planPromoStates[planId];
      const requestBody: any = { planId, memorialId };
      
      if (promoState?.appliedPromo) {
        requestBody.promoCode = promoState.appliedPromo.code;
      }

      const response = await axiosInstance.post(
        '/api/payments/initiate-memorial-payment', 
        requestBody
      );

      if (response.data.redirectUrl) {
        // Redirect the user to the payment gateway
        window.location.href = response.data.redirectUrl;
      } else {
        toast.error(translations.paymentError?.initiate || "Could not initiate payment. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || translations.paymentError?.process || "Failed to start payment process.");
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
    return <div className="text-center py-10">{translations.loading}</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{translations.error}</div>;
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
            isValidating: false
          };
          
          const hasDiscount = promoState.appliedPromo;
          const originalPrice = plan.price;
          const discountedPrice = calculateDiscountedPrice(plan);
          const discountAmount = originalPrice - discountedPrice;
          
          return (
            <motion.div key={plan._id} {...fadeInUp} transition={{ delay: index * 0.1 }}>
              <Card className={`relative h-full flex flex-col ${plan.isPopular ? "border-2 border-[#243b31] shadow-xl" : "border-gray-200 hover:shadow-md"} transition-all duration-300`}>
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
                    {hasDiscount ? (
                      <div>
                        <span className="text-4xl font-bold text-green-600">{formatCurrency(discountedPrice)}</span>
                        <span className="text-gray-600"> / one-time</span>
                        <div className="text-sm text-gray-500 line-through">{formatCurrency(originalPrice)}</div>
                        <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                          {translations.promoCode?.youSave} {formatCurrency(discountAmount)}
                        </Badge>
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold text-gray-900">{formatCurrency(originalPrice)}</span>
                        <span className="text-gray-600"> / one-time</span>
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
                  
                  {/* Promo Code Section for this plan */}
                 { memorialId && <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center mb-2">
                      <Tag className="mr-2 h-4 w-4 text-[#243b31]" />
                      <span className="text-sm font-medium">{translations.promoCode?.sectionTitle}</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="ml-2 h-3 w-3 text-gray-400 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">{translations.promoCode?.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    {promoState.appliedPromo ? (
                      <div className="bg-green-50 p-3 rounded-md border border-green-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-green-800 font-medium text-sm">
                              {translations.promoCode?.applied?.replace('{code}', promoState.appliedPromo.code)}
                            </p>
                            <p className="text-green-600 text-xs">
                              {promoState.appliedPromo.discountType === "percentage" 
                                ? translations.promoCode?.discountPercentage?.replace('{value}', promoState.appliedPromo.discountValue.toString())
                                : promoState.appliedPromo.discountType === "fixed"
                                  ? translations.promoCode?.discountFixed?.replace('{value}', promoState.appliedPromo.discountValue.toString())
                                  : translations.promoCode?.discountFree}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRemovePromoCode(plan._id)}
                            className="text-red-600 border-red-200 hover:bg-red-50 h-7 text-xs"
                          >
                            {translations.promoCode?.removeButton}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder={translations.promoCode?.placeholder}
                          value={promoState.input}
                          onChange={(e) => setPlanPromoStates(prev => ({
                            ...prev,
                            [plan._id]: {
                              ...prev[plan._id],
                              input: e.target.value.toUpperCase(),
                              error: ""
                            }
                          }))}
                          className="flex-1 h-9 text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') handleApplyPromoCode(plan._id);
                          }}
                        />
                        <Button 
                          onClick={() => handleApplyPromoCode(plan._id)}
                          disabled={promoState.isValidating}
                          className="h-9 text-sm"
                        >
                          {promoState.isValidating 
                            ? translations.promoCode?.applying 
                            : translations.promoCode?.applyButton}
                        </Button>
                      </div>
                    )}
                    
                    {promoState.error && (
                      <p className="text-red-500 text-xs mt-2">{promoState.error}</p>
                    )}
                  </div>}
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    className="w-full bg-[#243b31] hover:bg-green-700 text-white py-3 text-lg"
                    onClick={() => memorialId ? handleSelectPlan(plan._id) : clickHandler()}
                    disabled={isProcessing === plan._id}
                  >
                    {isProcessing === plan._id
                      ? translations.cta.processing
                      : hasDiscount && promoState.appliedPromo?.discountType === "free"
                        ? translations.promoCode?.getForFree || "Get For Free"
                        : (plan.planType === "minimal" && translations.cta.getStarted) ||
                          (plan.planType === "premium" && translations.cta.goPremium) ||
                          (plan.planType === "medium" && translations.cta.medium) ||
                          plan.ctaButtonText ||
                          translations.cta.selectPlan}
                  </Button>
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