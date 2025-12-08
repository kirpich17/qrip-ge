"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Crown,
  Star,
  Zap,
  X,
  Edit,
  Trash2,
  Plus,
  Save,
  ImageIcon,
  Video,
  Gift,
  Calendar,
  Tag,
  Users,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/hooks/useTranslate";
import axiosInstance from "@/services/axiosInstance";
import IsAdminAuth from "@/lib/IsAdminAuth/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays, addWeeks, addMonths } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "sonner";
import LanguageDropdown from "@/components/languageDropdown/page";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

// --- TYPES TO MATCH BACKEND MODEL ---
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
  color?: string;
  bgColor?: string;
  borderColor?: string;
  durationOptions?: DurationOption[];
  defaultDuration?: string;
};

type NewPlan = Omit<Plan, "_id">;

// --- PROMO CODE TYPES ---
type PromoCode = {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed" | "free";
  discountValue: number;
  expiryDate: string;
  maxUsage?: number;
  currentUsage?: number;
  isActive: boolean;
  appliesToPlan: string; // Added to match backend requirement
};

type NewPromoCode = Omit<PromoCode, "_id" | "currentUsage">;

function AdminSubscription() {
  const { t } = useTranslation();
  const translations = t("adminSubscriptionPage" as any);
  const promoTranslations = t("promoCodeManagement" as any);
  const plansTranslations = t("plansTranslations");

  const [editingPlan, setEditingPlan] = useState<Plan | NewPlan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPromoCodes, setTotalPromoCodes] = useState(0);

  // Promo Code States
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  console.log("🚀 ~ AdminSubscription ~ totalPromoCodes:", promoCodes);
  const [editingPromoCode, setEditingPromoCode] = useState<
    PromoCode | NewPromoCode | null
  >(null);
  const [isAddingPromoCode, setIsAddingPromoCode] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/admin/subscription");
      setPlans(response.data);
    } catch (err) {
      setError("Failed to fetch plans");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPromoCodes = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/admin/promocode?page=${page}`
      );
      setPromoCodes(response?.data?.data);
      setTotalPages(response.data.totalPages);
      setTotalPromoCodes(response.data.total);
      setCurrentPage(response.data.page);
    } catch (err) {
      setError(promoTranslations.errors.failedFetch);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchPromoCodes();
  }, []);

  // --- PLAN MANAGEMENT HANDLERS ---
  const handleEditPlan = (plan: Plan) => {
    // If plan doesn't have duration options, initialize with default
    const planWithDefaults = {
      ...plan,
      durationOptions: plan.durationOptions || [
        {
          duration: "1_month",
          price: plan.price,
          discountPercentage: 0,
          isActive: true,
        },
      ],
      defaultDuration: plan.defaultDuration || "1_month",
    };
    setEditingPlan(JSON.parse(JSON.stringify(planWithDefaults)));
    setIsAddingPlan(false);
  };

  const handleAddPlan = () => {
    const newPlan: NewPlan = {
      name: "",
      description: "",
      price: 0,
      planType: "minimal",
      ctaButtonText: "Get Started",
      isActive: true,
      isPopular: false,
      features: [{ text: "Biography", included: true }],
      maxPhotos: 0,
      allowSlideshow: false,
      allowVideos: false,
      maxVideoDuration: 0,
      durationOptions: [
        {
          duration: "1_month",
          price: 0,
          discountPercentage: 0,
          isActive: true,
        },
      ],
      defaultDuration: "1_month",
    };
    setEditingPlan(newPlan);
    setIsAddingPlan(true);
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    const payload = {
      ...editingPlan,
      features: editingPlan.features.filter((f) => f.text.trim() !== ""),
    };

    try {
      if (isAddingPlan) {
        await axiosInstance.post("/api/admin/subscription", payload);
        toast.success("Plan created successfully");
      } else if ("_id" in editingPlan) {
        await axiosInstance.put(
          `/api/admin/subscription/${editingPlan._id}`,
          payload
        );
        toast.success("Plan updated successfully");
      }
      fetchPlans();
      setEditingPlan(null);
      setIsAddingPlan(false);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        (isAddingPlan
          ? translations.states.error.create
          : translations.states.error.update);
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // --- PLAN MODAL STATE UPDATE HANDLERS ---
  const handlePlanChange = (field: keyof (Plan | NewPlan), value: any) => {
    if (editingPlan) {
      setEditingPlan({ ...editingPlan, [field]: value });
    }
  };

  const handleAllowPhotosToggle = (checked: boolean) => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        maxPhotos: checked ? 1 : 0,
        allowSlideshow: checked ? editingPlan.allowSlideshow : false,
      });
    }
  };

  const handleAllowVideosToggle = (checked: boolean) => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        allowVideos: checked,
        maxVideoDuration: checked ? editingPlan.maxVideoDuration : 0,
      });
    }
  };

  const addFeatureToPlan = () => {
    if (editingPlan) {
      handlePlanChange("features", [
        ...editingPlan.features,
        { text: "", included: true },
      ]);
    }
  };

  const removeFeatureFromPlan = (index: number) => {
    if (editingPlan) {
      const newFeatures = [...editingPlan.features];
      newFeatures.splice(index, 1);
      handlePlanChange("features", newFeatures);
    }
  };

  const updateFeatureInPlan = (
    index: number,
    field: keyof Feature,
    value: string | boolean
  ) => {
    if (editingPlan) {
      const newFeatures = [...editingPlan.features];
      (newFeatures[index] as any)[field] = value;
      handlePlanChange("features", newFeatures);
    }
  };

  // --- PROMO CODE MANAGEMENT HANDLERS ---
  const handleAddPromoCode = () => {
    const newPromoCode: NewPromoCode = {
      code: "",
      discountType: "percentage",
      discountValue: 0,
      expiryDate: format(addMonths(new Date(), 1), "yyyy-MM-dd"),
      maxUsage: undefined,
      isActive: true,
      appliesToPlan: plans.length > 0 ? plans[0]._id : "", // Default to first plan
    };
    setEditingPromoCode(newPromoCode);
    setIsAddingPromoCode(true);
    setIsPromoModalOpen(true);
    setPromoError(null);
  };

  const handleEditPromoCode = (promo: PromoCode) => {
    setEditingPromoCode(JSON.parse(JSON.stringify(promo)));
    setIsAddingPromoCode(false);
    setIsPromoModalOpen(true);
    setPromoError(null);
  };

  const handleSavePromoCode = async () => {
    if (!editingPromoCode) return;

    // Validation
    if (!editingPromoCode.appliesToPlan) {
      setPromoError(promoTranslations.errors.selectPlanFirst);
      return;
    }

    try {
      if (isAddingPromoCode) {
        await axiosInstance.post("/api/admin/promocode", editingPromoCode);
        toast.success("Promo code created successfully");
      } else if ("_id" in editingPromoCode) {
        await axiosInstance.put(
          `/api/admin/promocode/${editingPromoCode._id}`,
          editingPromoCode
        );
        toast.success("Promo code updated successfully");
      }
      fetchPromoCodes(currentPage);
      setEditingPromoCode(null);
      setIsAddingPromoCode(false);
      setIsPromoModalOpen(false);
      setPromoError(null);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        (isAddingPromoCode
          ? promoTranslations.errors.failedCreate
          : promoTranslations.errors.failedUpdate);
      setPromoError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleDeletePromoCode = async (id: string) => {
    if (window.confirm(promoTranslations.deleteConfirm)) {
      try {
        await axiosInstance.delete(`/api/admin/promocode/${id}`);
        fetchPromoCodes(currentPage);
        toast.success("Promo code deleted successfully");
      } catch (err) {
        setError(promoTranslations.errors.failedDelete);
        toast.error(promoTranslations.errors.failedDelete);
      }
    }
  };

  const handlePromoCodeChange = (
    field: keyof (PromoCode | NewPromoCode),
    value: any
  ) => {
    if (editingPromoCode) {
      setEditingPromoCode({ ...editingPromoCode, [field]: value });
    }
  };

  const handleExpiryDateSelect = (date: Date | undefined) => {
    if (editingPromoCode && date) {
      handlePromoCodeChange("expiryDate", format(date, "yyyy-MM-dd"));
    }
  };

  if (isLoading)
    return <div className="p-8 text-center">{translations.states.loading}</div>;
  if (error)
    return (
      <div className="p-8 text-red-500 text-center">
        {error}{" "}
        <Button onClick={fetchPlans}>{translations.states.retry}</Button>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="top-0 z-40 sticky bg-[#243b31] py-4">
        <div className="flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2 text-white hover:underline whitespace-nowrap"
          >
            <ArrowLeft size={20} /> {translations.header.back}
          </Link>
          <div className="flex gap-3">
            <LanguageDropdown />
            <h1 className="flex items-center gap-2 font-bold text-white text-xs sm:text-xl">
              <Crown size={24} /> {translations.header.title}
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <motion.div {...fadeInUp}>
          <div className="mb-12 text-center">
            <h2 className="mb-3 font-bold text-gray-900 text-2xl sm:text-4xl">
              {translations.main.title}
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-gray-600 text-lg">
              {translations.main.description}
            </p>
          </div>

          {/* --- ADD/EDIT PLAN MODAL --- */}
          {editingPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-2xl">
                    {isAddingPlan
                      ? translations.modal.titleAdd
                      : translations.modal.titleEdit}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPlan(null)}
                  >
                    <X size={20} />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Section: Basic Details */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-800">
                      {translations.modal.sectionBasic}
                    </h4>
                    <Input
                      placeholder={translations.modal.placeholders.name}
                      value={editingPlan.name}
                      onChange={(e) => handlePlanChange("name", e.target.value)}
                    />
                    <Textarea
                      placeholder={translations.modal.placeholders.description}
                      value={editingPlan.description}
                      onChange={(e) =>
                        handlePlanChange("description", e.target.value)
                      }
                    />
                    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder={translations.modal.placeholders.price}
                          value={editingPlan.price}
                          onChange={(e) =>
                            handlePlanChange("price", Number(e.target.value))
                          }
                        />
                        <span className="top-1/2 right-3 absolute text-gray-500 -translate-y-1/2">
                          {translations.modal.currency}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section: Feature Configuration */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-800">
                      {translations.modal.sectionCoreFeatures}
                    </h4>
                    <div className="space-y-4">
                      {/* Photo Settings */}
                      <div
                        className={`p-3 rounded-lg ${
                          editingPlan.maxPhotos > 0
                            ? "bg-green-50"
                            : "bg-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <label
                            htmlFor="allowPhotos"
                            className="flex items-center gap-2 font-medium"
                          >
                            <ImageIcon size={16} />
                            {translations.modal.photos.label}
                          </label>
                          <Switch
                            id="allowPhotos"
                            checked={editingPlan.maxPhotos > 0}
                            onCheckedChange={handleAllowPhotosToggle}
                          />
                        </div>
                        {editingPlan.maxPhotos > 0 && (
                          <div className="space-y-3 mt-4 pl-6">
                            <div className="flex items-center gap-4">
                              <label htmlFor="maxPhotos" className="text-sm">
                                {translations.modal.photos.maxLabel}
                              </label>
                              <Input
                                id="maxPhotos"
                                type="number"
                                min={1}
                                value={editingPlan.maxPhotos}
                                onChange={(e) =>
                                  handlePlanChange(
                                    "maxPhotos",
                                    Number(e.target.value)
                                  )
                                }
                                className="w-24 h-8"
                              />
                            </div>
                            <div className="flex justify-between items-center">
                              <label
                                htmlFor="allowSlideshow"
                                className="text-sm"
                              >
                                {translations.modal.photos.slideshowLabel}
                              </label>
                              <Switch
                                id="allowSlideshow"
                                checked={editingPlan.allowSlideshow}
                                onCheckedChange={(c) =>
                                  handlePlanChange("allowSlideshow", c)
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Video Settings */}
                      <div
                        className={`p-3 rounded-lg ${
                          editingPlan.allowVideos
                            ? "bg-green-50"
                            : "bg-gray-100"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <label
                            htmlFor="allowVideos"
                            className="flex items-center gap-2 font-medium"
                          >
                            <Video size={16} />{" "}
                            {translations.modal.videos.label}
                          </label>
                          <Switch
                            id="allowVideos"
                            checked={editingPlan.allowVideos}
                            onCheckedChange={handleAllowVideosToggle}
                          />
                        </div>
                        {editingPlan.allowVideos && (
                          <div className="flex items-center gap-4 mt-4 pl-6">
                            <label htmlFor="maxDuration" className="text-sm">
                              {translations.modal.videos.maxDurationLabel}
                            </label>
                            <Input
                              id="maxDuration"
                              type="number"
                              min={1}
                              value={editingPlan.maxVideoDuration}
                              onChange={(e) =>
                                handlePlanChange(
                                  "maxVideoDuration",
                                  Number(e.target.value)
                                )
                              }
                              className="w-24 h-8"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section: Additional Features */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="mb-2 font-semibold text-gray-800">
                      {translations.modal.sectionAdditionalFeatures}
                    </h4>
                    <div className="space-y-2 mb-3">
                      {editingPlan.features.map((feature, index) => {
                        if (feature?.text !== "Family Tree") {
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={feature.text}
                                onChange={(e) =>
                                  updateFeatureInPlan(
                                    index,
                                    "text",
                                    e.target.value
                                  )
                                }
                                placeholder={
                                  translations.modal.placeholders.feature
                                }
                              />
                              <Switch
                                checked={feature.included}
                                onCheckedChange={(c) =>
                                  updateFeatureInPlan(index, "included", c)
                                }
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFeatureFromPlan(index)}
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </Button>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </div>

                  {/* Section: Duration Options */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-800">
                      {translations.modal.durationOptions?.title ||
                        "Duration Options"}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {translations.modal.durationOptions?.description ||
                        "Configure different pricing for various subscription durations"}
                    </p>

                    <div className="space-y-3">
                      {editingPlan.durationOptions?.map((option, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <label className="font-medium text-sm">
                              {translations.modal.durationOptions
                                ?.durationLabel || "Duration"}
                            </label>
                            <Select
                              value={option.duration}
                              onValueChange={(value) => {
                                const newOptions = [
                                  ...(editingPlan.durationOptions || []),
                                ];
                                newOptions[index] = {
                                  ...newOptions[index],
                                  duration: value,
                                };
                                handlePlanChange("durationOptions", newOptions);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1_month">
                                  {translations.modal.durationOptions
                                    ?.durations?.["1_month"] || "1 Month"}
                                </SelectItem>
                                <SelectItem value="3_months">
                                  {translations.modal.durationOptions
                                    ?.durations?.["3_months"] || "3 Months"}
                                </SelectItem>
                                <SelectItem value="6_months">
                                  {translations.modal.durationOptions
                                    ?.durations?.["6_months"] || "6 Months"}
                                </SelectItem>
                                <SelectItem value="1_year">
                                  {translations.modal.durationOptions
                                    ?.durations?.["1_year"] || "1 Year"}
                                </SelectItem>
                                <SelectItem value="2_years">
                                  {translations.modal.durationOptions
                                    ?.durations?.["2_years"] || "2 Years"}
                                </SelectItem>
                                <SelectItem value="life_time">
                                  {translations.modal.durationOptions
                                    ?.durations?.["life_time"] || "life_time"}
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex-1">
                            <label className="font-medium text-sm">
                              {translations.modal.durationOptions?.priceLabel ||
                                "Price (GEL)"}
                            </label>
                            <Input
                              type="number"
                              value={option.price}
                              onChange={(e) => {
                                const newOptions = [
                                  ...(editingPlan.durationOptions || []),
                                ];
                                newOptions[index] = {
                                  ...newOptions[index],
                                  price: Number(e.target.value),
                                };
                                handlePlanChange("durationOptions", newOptions);
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <label className="font-medium text-sm">
                              {translations.modal.durationOptions
                                ?.discountLabel || "Discount %"}
                            </label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={option.discountPercentage}
                              onChange={(e) => {
                                const newOptions = [
                                  ...(editingPlan.durationOptions || []),
                                ];
                                newOptions[index] = {
                                  ...newOptions[index],
                                  discountPercentage: Number(e.target.value),
                                };
                                handlePlanChange("durationOptions", newOptions);
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={option.isActive}
                              onCheckedChange={(checked) => {
                                const newOptions = [
                                  ...(editingPlan.durationOptions || []),
                                ];
                                newOptions[index] = {
                                  ...newOptions[index],
                                  isActive: checked,
                                };
                                handlePlanChange("durationOptions", newOptions);
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newOptions = [
                                  ...(editingPlan.durationOptions || []),
                                ];
                                newOptions.splice(index, 1);
                                handlePlanChange("durationOptions", newOptions);
                              }}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        onClick={() => {
                          const newOptions = [
                            ...(editingPlan.durationOptions || []),
                            {
                              duration: "1_month",
                              price: 0,
                              discountPercentage: 0,
                              isActive: true,
                            },
                          ];
                          handlePlanChange("durationOptions", newOptions);
                        }}
                        className="w-full"
                      >
                        <Plus size={16} className="mr-2" />
                        {translations.modal.durationOptions?.addButton ||
                          "Add Duration Option"}
                      </Button>
                    </div>
                  </div>

                  {/* Section: Plan Settings */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-800">
                      {translations.modal.sectionSettings}
                    </h4>
                    <div className="flex justify-between items-center">
                      <label htmlFor="active" className="font-medium">
                        {translations.modal.setActive}
                      </label>
                      <Switch
                        id="active"
                        checked={editingPlan.isActive}
                        onCheckedChange={(c) => handlePlanChange("isActive", c)}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleSavePlan}
                      className="bg-[#243b31] hover:bg-[#547455] w-full"
                    >
                      <Save size={16} className="mr-2" />
                      {isAddingPlan
                        ? translations.modal.buttonSaveNew
                        : translations.modal.buttonSaveChanges}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* --- PLANS GRID --- */}
          <div className="gap-8 grid md:grid-cols-2 lg:grid-cols-3 mb-12">
            {plans.map((plan) => (
              <motion.div key={plan._id} {...fadeInUp}>
                <Card
                  className={`relative h-full flex flex-col ${
                    plan.isPopular
                      ? "border-2 border-[#243b31] shadow-xl"
                      : "border"
                  } ${!plan.isActive ? "bg-gray-100 opacity-70" : "bg-white"}`}
                >
                  {plan.isPopular && (
                    <Badge className="-top-3 left-1/2 absolute bg-[#547455] -translate-x-1/2">
                      {translations.card.popular}
                    </Badge>
                  )}
                  {!plan.isActive && (
                    <Badge
                      variant="destructive"
                      className="top-3 right-3 absolute"
                    >
                      {translations.card.inactive}
                    </Badge>
                  )}

                  {/* <CardHeader className="pb-4 text-center">
                    <div className="flex justify-center items-center bg-gray-100 mx-auto mb-4 rounded-full w-16 h-16">
                      {plan.planType === "premium" && <Crown className="text-black" size={32} />}
                      {plan.planType === "medium" && <Zap className="text-black" size={32} />}
                      {plan.planType === "minimal" && <Star className="text-black" size={32} />}
                    </div>
                    <CardTitle className="font-bold text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="font-bold text-gray-900 text-4xl">{plan.price} {translations.modal.currency}</span>
                      <span className="text-gray-600">{translations.card.oneTime}</span>
                    </div>
                  </CardHeader> */}

                  <CardHeader className="pb-4 text-center">
                    <div className="flex justify-center items-center bg-gray-100 mx-auto mb-4 rounded-full w-16 h-16">
                      {plan.planType === "premium" && (
                        <Crown className="text-black" size={32} />
                      )}
                      {plan.planType === "medium" && (
                        <Zap className="text-black" size={32} />
                      )}
                      {plan.planType === "minimal" && (
                        <Star className="text-black" size={32} />
                      )}
                    </div>
                    <CardTitle className="font-bold text-2xl">
                      {plansTranslations?.[plan.planType]?.name || plan.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {plansTranslations?.[plan.planType]?.description ||
                        plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="font-bold text-gray-900 text-4xl">
                        {plan.price} GEL
                      </span>
                      <span className="text-gray-600">
                        {" "}
                        /{" "}
                        {plan.durationOptions && plan.durationOptions.length > 0
                          ? translations.card.basePrice || "base price"
                          : translations.card.oneTime}
                      </span>
                    </div>

                    {plan.durationOptions && plan.durationOptions.length > 0 ? (
                      <div className="mt-4">
                        <h5 className="mb-2 font-medium text-gray-700 text-sm">
                          {translations.card.durationOptionsLabel ||
                            "Duration Options:"}
                        </h5>
                        <div className="space-y-1">
                          {plan.durationOptions
                            .filter((opt) => opt.isActive)
                            .map((option, index) => (
                              <div
                                key={index}
                                className="flex justify-between text-sm"
                              >
                                <span>
                                  {translations.modal.durationOptions
                                    ?.durations?.[
                                    option.duration as keyof typeof translations.modal.durationOptions.durations
                                  ] || option.duration.replace("_", " ")}
                                </span>
                                <span className="font-medium">
                                  {option.price} GEL
                                </span>
                                {option.discountPercentage > 0 && (
                                  <span className="text-green-600">
                                    ({option.discountPercentage}% off)
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <div className="bg-yellow-50 p-3 border border-yellow-200 rounded-md">
                          <p className="mb-2 text-yellow-800 text-sm">
                            <strong>
                              {translations.card.noDurationOptions?.title ||
                                "No duration options configured."}
                            </strong>
                            <br />
                            {translations.card.noDurationOptions?.description ||
                              "Add duration options to enable flexible pricing."}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPlan(plan)}
                            className="hover:bg-yellow-100 border-yellow-300 text-yellow-800"
                          >
                            {translations.card.noDurationOptions?.button ||
                              "Configure Duration Options"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="flex flex-col flex-grow pt-0">
                    <ul className="flex-grow space-y-2">
                      {/* <FeatureListItem included={plan.maxPhotos > 0} text={plan.maxPhotos >= 999 ? translations.card.features.unlimitedPhotos : translations.card.features.photoUploads.replace('{count}', String(plan.maxPhotos))} />
                      <FeatureListItem included={plan.allowSlideshow} text={translations.card.features.slideshow} />
                      <FeatureListItem included={plan.allowVideos} text={translations.card.features.videoUploads.replace('{duration}', String(plan.maxVideoDuration))} />
                      {plan.features.map((feature, idx) => (
                        <FeatureListItem key={idx} included={feature.included} text={feature.text} />
                      ))} */}

                      <FeatureListItem
                        included={plan.maxPhotos > 0}
                        text={
                          plan.maxPhotos >= 999
                            ? plansTranslations?.[plan.planType]?.features
                                ?.photoUploads || "Unlimited Photo Uploads"
                            : plansTranslations?.[plan.planType]?.features
                                ?.photoUploads ||
                              `${plan.maxPhotos} Photo Uploads`
                        }
                      />
                      <FeatureListItem
                        included={plan.allowSlideshow}
                        text={
                          plansTranslations?.[plan.planType]?.features
                            ?.slideshow || "Photo Slideshow"
                        }
                      />
                      <FeatureListItem
                        included={plan.allowVideos}
                        text={
                          plansTranslations?.[
                            plan.planType
                          ]?.features?.videoUploads?.replace(
                            /{duration}/g,
                            plan.maxVideoDuration.toString()
                          ) || `Video Uploads (Max ${plan.maxVideoDuration}s)`
                        }
                      />
                      {plan.features.map((feature) => {
                        // Try to match feature text with translation keys
                        let translatedText = feature.text;
                        const planTranslations =
                          plansTranslations?.[plan.planType]?.features;

                        if (planTranslations) {
                          // Check if feature text matches any translation key
                          if (
                            feature.text.toLowerCase().includes("document") ||
                            feature.text
                              .toLowerCase()
                              .includes("document upload")
                          ) {
                            translatedText =
                              planTranslations.documentUpload || feature.text;
                          } else if (
                            feature.text.toLowerCase().includes("family") ||
                            feature.text.toLowerCase().includes("family tree")
                          ) {
                            translatedText =
                              planTranslations.familyTree || feature.text;
                          }
                        }

                        return (
                          <FeatureListItem
                            key={feature._id}
                            included={feature.included}
                            text={translatedText}
                          />
                        );
                      })}
                    </ul>
                    <Separator className="my-6" />
                    <Button
                      variant="outline"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit size={16} className="mr-2" />{" "}
                      {translations.modal.editPlan || "Edit Plan"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* --- PROMO CODE MANAGEMENT SECTION --- */}
          {promoTranslations && (
            <motion.div {...fadeInUp} className="mt-12">
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2 font-bold text-2xl">
                        <Gift size={24} /> {promoTranslations.title}
                      </CardTitle>
                      <CardDescription>
                        {promoTranslations.description}
                      </CardDescription>
                    </div>
                    <Button
                      onClick={handleAddPromoCode}
                      className="bg-[#243b31] hover:bg-[#547455]"
                    >
                      <Plus size={16} className="mr-2" />{" "}
                      {promoTranslations.addNewButton}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="py-8 text-center">
                      Loading promo codes...
                    </div>
                  ) : promoCodes.length === 0 ? (
                    <p className="py-8 text-gray-500 text-center">
                      {promoTranslations.noPromoCodes}
                    </p>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="divide-y divide-gray-200 min-w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider"
                              >
                                {promoTranslations.tableHeaders.code}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider"
                              >
                                {promoTranslations.tableHeaders.discount}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider"
                              >
                                {promoTranslations.tableHeaders.expires}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider"
                              >
                                {promoTranslations.tableHeaders.usage}
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider"
                              >
                                {promoTranslations.tableHeaders.status}
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">
                                  {promoTranslations.tableHeaders.actions}
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {promoCodes.map((promo) => (
                              <tr key={promo._id}>
                                <td className="px-6 py-4 font-medium text-gray-900 text-sm whitespace-nowrap">
                                  {promo.code}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                  {promo.discountType === "percentage" &&
                                    `${promo.discountValue}% Off`}
                                  {promo.discountType === "fixed" &&
                                    `${promo.discountValue} ${translations.modal.currency} Off`}
                                  {promo.discountType === "free" &&
                                    "100% Off (Free Plan)"}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                  {format(
                                    new Date(promo.expiryDate),
                                    "MMM dd, yyyy"
                                  )}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                  {promo.maxUsage
                                    ? `${promo.currentUsage || 0}/${
                                        promo.maxUsage
                                      }`
                                    : "Unlimited"}
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                                  <Badge
                                    variant={
                                      promo.isActive ? "default" : "destructive"
                                    }
                                  >
                                    {promo.isActive
                                      ? promoTranslations.status.active
                                      : promoTranslations.status.inactive}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 font-medium text-sm text-right whitespace-nowrap">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEditPromoCode(promo)}
                                    className="mr-2"
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDeletePromoCode(promo._id)
                                    }
                                  >
                                    <Trash2
                                      size={16}
                                      className="text-red-500"
                                    />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-gray-700 text-sm">
                            Showing {(currentPage - 1) * 10 + 1} to{" "}
                            {Math.min(currentPage * 10, totalPromoCodes)} of{" "}
                            {totalPromoCodes} entries
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchPromoCodes(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Previous
                            </Button>
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1
                            ).map((page) => (
                              <Button
                                key={page}
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => fetchPromoCodes(page)}
                              >
                                {page}
                              </Button>
                            ))}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchPromoCodes(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              Next
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* --- ADD/EDIT PROMO CODE MODAL --- */}
          {isPromoModalOpen && editingPromoCode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="z-50 fixed inset-0 flex justify-center items-center bg-black/60 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white p-6 rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-2xl">
                    {isAddingPromoCode
                      ? promoTranslations.modal.addTitle
                      : promoTranslations.modal.editTitle}
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPromoModalOpen(false)}
                  >
                    <X size={20} />
                  </Button>
                </div>

                <div className="space-y-6">
                  {promoError && (
                    <div className="bg-red-100 p-3 rounded-md text-red-700">
                      {promoError}
                    </div>
                  )}

                  {/* Code and Discount Type */}
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="promoCode"
                        className="block mb-1 font-medium text-gray-700 text-sm"
                      >
                        {promoTranslations.modal.codeLabel}
                      </label>
                      <Input
                        id="promoCode"
                        placeholder={promoTranslations.modal.codePlaceholder}
                        value={editingPromoCode.code}
                        onChange={(e) =>
                          handlePromoCodeChange(
                            "code",
                            e.target.value.toUpperCase()
                          )
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="discountType"
                        className="block mb-1 font-medium text-gray-700 text-sm"
                      >
                        {promoTranslations.modal.discountTypeLabel}
                      </label>
                      <Select
                        value={editingPromoCode.discountType}
                        onValueChange={(
                          value: "percentage" | "fixed" | "free"
                        ) => handlePromoCodeChange("discountType", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            {
                              promoTranslations.modal.discountTypeOptions
                                .percentage
                            }
                          </SelectItem>
                          <SelectItem value="fixed">
                            {promoTranslations.modal.discountTypeOptions.fixed.replace(
                              "{currency}",
                              translations.modal.currency
                            )}
                          </SelectItem>
                          <SelectItem value="free">
                            {promoTranslations.modal.discountTypeOptions.free}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div>
                    <label
                      htmlFor="appliesToPlan"
                      className="block mb-1 font-medium text-gray-700 text-sm"
                    >
                      {promoTranslations.modal.selectPlanLabel}
                    </label>
                    <Select
                      value={editingPromoCode.appliesToPlan}
                      onValueChange={(value) =>
                        handlePromoCodeChange("appliesToPlan", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            promoTranslations.modal.selectPlanPlaceholder
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((plan) => (
                          <SelectItem key={plan._id} value={plan._id}>
                            {plan.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Discount Value */}
                  {editingPromoCode.discountType !== "free" && (
                    <div>
                      <label
                        htmlFor="discountValue"
                        className="block mb-1 font-medium text-gray-700 text-sm"
                      >
                        {promoTranslations.modal.discountValueLabel.replace(
                          "{symbol}",
                          editingPromoCode.discountType === "percentage"
                            ? "%"
                            : translations.modal.currency
                        )}
                      </label>
                      <Input
                        id="discountValue"
                        type="number"
                        min={0}
                        max={
                          editingPromoCode.discountType === "percentage"
                            ? 100
                            : undefined
                        }
                        placeholder={
                          editingPromoCode.discountType === "percentage"
                            ? promoTranslations.modal
                                .discountValuePlaceholderPercentage
                            : promoTranslations.modal
                                .discountValuePlaceholderFixed
                        }
                        value={editingPromoCode.discountValue}
                        onChange={(e) =>
                          handlePromoCodeChange(
                            "discountValue",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  )}

                  {/* Expiry Date */}
                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="block mb-1 font-medium text-gray-700 text-sm"
                    >
                      {promoTranslations.modal.expiryDateLabel}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${
                            !editingPromoCode.expiryDate &&
                            "text-muted-foreground"
                          }`}
                        >
                          <Calendar className="mr-2 w-4 h-4" />
                          {editingPromoCode.expiryDate ? (
                            format(new Date(editingPromoCode.expiryDate), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-auto">
                        <CalendarComponent
                          mode="single"
                          selected={
                            editingPromoCode.expiryDate
                              ? new Date(editingPromoCode.expiryDate)
                              : undefined
                          }
                          onSelect={handleExpiryDateSelect}
                          initialFocus
                        />
                        <div className="flex justify-around p-2 border-t">
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleExpiryDateSelect(addDays(new Date(), 1))
                            }
                          >
                            {promoTranslations.modal.quickExpiryOptions["1day"]}
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleExpiryDateSelect(addWeeks(new Date(), 1))
                            }
                          >
                            {
                              promoTranslations.modal.quickExpiryOptions[
                                "1week"
                              ]
                            }
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              handleExpiryDateSelect(addMonths(new Date(), 1))
                            }
                          >
                            {
                              promoTranslations.modal.quickExpiryOptions[
                                "1month"
                              ]
                            }
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Max Usage */}
                  <div>
                    <label
                      htmlFor="maxUsage"
                      className="block mb-1 font-medium text-gray-700 text-sm"
                    >
                      {promoTranslations.modal.maxUsageLabel}
                    </label>
                    <Input
                      id="maxUsage"
                      type="number"
                      min={1}
                      placeholder={promoTranslations.modal.maxUsagePlaceholder}
                      value={editingPromoCode.maxUsage || ""}
                      onChange={(e) =>
                        handlePromoCodeChange(
                          "maxUsage",
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </div>

                  {/* Active Status */}
                  <div className="flex justify-between items-center">
                    <label htmlFor="promoActive" className="font-medium">
                      {promoTranslations.modal.activeLabel}
                    </label>
                    <Switch
                      id="promoActive"
                      checked={editingPromoCode.isActive}
                      onCheckedChange={(c) =>
                        handlePromoCodeChange("isActive", c)
                      }
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <Button
                      onClick={handleSavePromoCode}
                      className="bg-[#243b31] hover:bg-[#547455] w-full"
                    >
                      <Save size={16} className="mr-2" />
                      {isAddingPromoCode
                        ? promoTranslations.modal.saveButtonAdd
                        : promoTranslations.modal.saveButtonEdit}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

// Helper component for feature list items in cards
const FeatureListItem = ({
  included,
  text,
}: {
  included: boolean;
  text: string;
}) => (
  <li className="flex items-start space-x-3">
    {included ? (
      <Check className="mt-0.5 w-5 h-5 text-green-500" />
    ) : (
      <X className="mt-0.5 w-5 h-5 text-red-400" />
    )}
    <span
      className={`text-sm ${
        included ? "text-gray-700" : "text-gray-500 line-through"
      }`}
    >
      {text}
    </span>
  </li>
);

const AdminSubscriptionPage = () => (
  <IsAdminAuth>
    <AdminSubscription />
  </IsAdminAuth>
);

export default AdminSubscriptionPage;
