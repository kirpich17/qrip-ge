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
  maxVideoDuration: number; // in seconds
  color?: string;
  bgColor?: string;
  borderColor?: string;
};

type NewPlan = Omit<Plan, "_id">;

function AdminSubscription() {
  const { t } = useTranslation();
  const translations = t("adminSubscriptionPage");

  const [editingPlan, setEditingPlan] = useState<Plan | NewPlan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
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
      } else if ("_id" in editingPlan) {
        await axiosInstance.put(`/api/admin/subscription/${editingPlan._id}`, payload);
      }
      fetchPlans();
      setEditingPlan(null);
      setIsAddingPlan(false);
    } catch (err) {
      setError(isAddingPlan ? "Failed to create new plan" : "Failed to update plan");
    }
  };

  // --- MODAL STATE UPDATE HANDLERS ---
  const handlePlanChange = (field: keyof (Plan | NewPlan), value: any) => {
    if (editingPlan) {
      setEditingPlan({ ...editingPlan, [field]: value });
    }
  };

  const handleAllowPhotosToggle = (checked: boolean) => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        maxPhotos: checked ? 1 : 0, // Default to 1 photo when enabled
        allowSlideshow: checked ? editingPlan.allowSlideshow : false, // Disable slideshow if photos are off
      });
    }
  };

  const handleAllowVideosToggle = (checked: boolean) => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        allowVideos: checked,
        maxVideoDuration: checked ? editingPlan.maxVideoDuration : 0, // Reset duration if videos are off
      });
    }
  };

  const addFeatureToPlan = () => {
    if (editingPlan) {
      handlePlanChange("features", [...editingPlan.features, { text: "", included: true }]);
    }
  };

  const removeFeatureFromPlan = (index: number) => {
    if (editingPlan) {
      const newFeatures = [...editingPlan.features];
      newFeatures.splice(index, 1);
      handlePlanChange("features", newFeatures);
    }
  };

  const updateFeatureInPlan = (index: number, field: keyof Feature, value: string | boolean) => {
    if (editingPlan) {
      const newFeatures = [...editingPlan.features];
      (newFeatures[index] as any)[field] = value;
      handlePlanChange("features", newFeatures);
    }
  };

    if (isLoading) return <div className="p-8 text-center">{translations.states.loading}</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error} <Button onClick={fetchPlans}>{translations.states.retry}</Button></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#243b31] py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center text-white hover:underline gap-2">
            <ArrowLeft size={20} /> {translations.header.back}
          </Link>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown size={24} /> {translations.header.title}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div {...fadeInUp}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">{translations.main.title}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            {translations.main.description}
            </p>
            {/* <Button onClick={handleAddPlan} className="bg-[#243b31] hover:bg-[#547455]">
              <Plus size={16} className="mr-2" /> Add New Plan
            </Button> */}
          </div>

          {/* --- ADD/EDIT PLAN MODAL --- */}
          {editingPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">{isAddingPlan ? "Add New Plan" : "Edit Plan"}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setEditingPlan(null)}>
                    <X size={20} />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Section: Basic Details */}
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-800">{translations.modal.sectionBasic}</h4>
                    <Input placeholder={translations.modal.placeholders.name}  value={editingPlan.name} onChange={(e) => handlePlanChange("name", e.target.value)} />
                    <Textarea placeholder={translations.modal.placeholders.description}  value={editingPlan.description} onChange={(e) => handlePlanChange("description", e.target.value)} />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Input type="number" placeholder={translations.modal.placeholders.price} value={editingPlan.price} onChange={(e) => handlePlanChange("price", Number(e.target.value))} />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">{translations.modal.currency}</span>
                      </div>
                      <select value={editingPlan.planType} onChange={(e) => handlePlanChange("planType", e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md">
                        <option value="minimal">{translations.modal.planTypes.minimal}</option>
                        <option value="medium">{translations.modal.planTypes.medium}</option>
                        <option value="premium">{translations.modal.planTypes.premium}</option>
                      </select>
                    </div>
                  </div>

                  {/* Section: Feature Configuration */}
                  <div className="space-y-4 p-4 border rounded-lg">
                     <h4 className="font-semibold text-gray-800">{translations.modal.sectionCoreFeatures}</h4>
                     <div className="space-y-4">
                        {/* Photo Settings */}
                        <div className={`p-3 rounded-lg ${editingPlan.maxPhotos > 0 ? 'bg-green-50' : 'bg-gray-100'}`}>
                           <div className="flex items-center justify-between">
                              <label htmlFor="allowPhotos" className="flex items-center gap-2 font-medium"><ImageIcon size={16} />{translations.modal.photos.label}</label>
                              <Switch id="allowPhotos" checked={editingPlan.maxPhotos > 0} onCheckedChange={handleAllowPhotosToggle} />
                           </div>
                           {editingPlan.maxPhotos > 0 && (
                              <div className="mt-4 pl-6 space-y-3">
                                 <div className="flex items-center gap-4">
                                    <label htmlFor="maxPhotos" className="text-sm">{translations.modal.photos.maxLabel}</label>
                                    <Input id="maxPhotos" type="number" min={1} value={editingPlan.maxPhotos} onChange={(e) => handlePlanChange("maxPhotos", Number(e.target.value))} className="w-24 h-8" />
                                 </div>
                                 <div className="flex items-center justify-between">
                                    <label htmlFor="allowSlideshow" className="text-sm">{translations.modal.photos.slideshowLabel}</label>
                                    <Switch id="allowSlideshow" checked={editingPlan.allowSlideshow} onCheckedChange={(c) => handlePlanChange("allowSlideshow", c)} />
                                 </div>
                              </div>
                           )}
                        </div>
                        {/* Video Settings */}
                        <div className={`p-3 rounded-lg ${editingPlan.allowVideos ? 'bg-green-50' : 'bg-gray-100'}`}>
                           <div className="flex items-center justify-between">
                              <label htmlFor="allowVideos" className="flex items-center gap-2 font-medium"><Video size={16} /> {translations.modal.videos.label}</label>
                              <Switch id="allowVideos" checked={editingPlan.allowVideos} onCheckedChange={handleAllowVideosToggle} />
                           </div>
                           {editingPlan.allowVideos && (
                              <div className="mt-4 pl-6 flex items-center gap-4">
                                 <label htmlFor="maxDuration" className="text-sm">{translations.modal.videos.maxDurationLabel}</label>
                                 <Input id="maxDuration" type="number" min={1} value={editingPlan.maxVideoDuration} onChange={(e) => handlePlanChange("maxVideoDuration", Number(e.target.value))} className="w-24 h-8" />
                              </div>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Section: Additional Features */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">{translations.modal.sectionAdditionalFeatures}</h4>
                    <div className="space-y-2 mb-3">
                      {editingPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={feature.text} onChange={(e) => updateFeatureInPlan(index, "text", e.target.value)} placeholder={translations.modal.placeholders.feature} />
                          <Switch checked={feature.included} onCheckedChange={(c) => updateFeatureInPlan(index, "included", c)} />
                          <Button variant="ghost" size="icon" onClick={() => removeFeatureFromPlan(index)}><Trash2 size={16} className="text-red-500" /></Button>
                        </div>
                      ))}
                    </div>
                    <Button onClick={addFeatureToPlan} variant="outline" size="sm"><Plus size={16} className="mr-1" />{translations.modal.addFeature}</Button>
                  </div>

                  {/* Section: Plan Settings */}
                  <div className="space-y-4 p-4 border rounded-lg">
                     <h4 className="font-semibold text-gray-800">{translations.modal.sectionSettings}</h4>
                      <Input placeholder={translations.modal.placeholders.cta} value={editingPlan.ctaButtonText} onChange={(e) => handlePlanChange("ctaButtonText", e.target.value)} />
                      <div className="flex items-center justify-between">
                          <label htmlFor="popular" className="font-medium">{translations.modal.markPopular}</label>
                          <Switch id="popular" checked={editingPlan.isPopular} onCheckedChange={(c) => handlePlanChange("isPopular", c)} />
                      </div>
                      <div className="flex items-center justify-between">
                          <label htmlFor="active" className="font-medium">{translations.modal.setActive}</label>
                          <Switch id="active" checked={editingPlan.isActive} onCheckedChange={(c) => handlePlanChange("isActive", c)} />
                      </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={handleSavePlan} className="w-full bg-[#243b31] hover:bg-[#547455]">
                      <Save size={16} className="mr-2" />
                      {isAddingPlan ? translations.modal.buttonSaveNew : translations.modal.buttonSaveChanges}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* --- PLANS GRID --- */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <motion.div key={plan._id} {...fadeInUp}>
                <Card className={`relative h-full flex flex-col ${plan.isPopular ? "border-2 border-[#243b31] shadow-xl" : "border"} ${!plan.isActive ? "bg-gray-100 opacity-70" : "bg-white"}`}>
                  {plan.isPopular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#547455]">{translations.card.popular}</Badge>}
                  {!plan.isActive && <Badge variant="destructive" className="absolute top-3 right-3">{translations.card.inactive}</Badge>}
                  
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      {plan.planType === "premium" && <Crown className="text-black" size={32} />}
                      {plan.planType === "medium" && <Zap className="text-black" size={32} />}
                      {plan.planType === "minimal" && <Star className="text-black" size={32} />}
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}  {translations.modal.currency}</span>
                      <span className="text-gray-600">{translations.card.oneTime}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 flex-grow flex flex-col">
                    <ul className="space-y-2 flex-grow">
                      {/* Dynamically generated features based on configuration */}
              

                         <FeatureListItem included={plan.maxPhotos > 0} text={plan.maxPhotos >= 999 ? translations.card.features.unlimitedPhotos : translations.card.features.photoUploads.replace('{count}', String(plan.maxPhotos))} />

                       <FeatureListItem included={plan.allowSlideshow} text={translations.card.features.slideshow} />
                       <FeatureListItem included={plan.allowVideos}  text={translations.card.features.videoUploads.replace('{duration}', String(plan.maxVideoDuration))} />
                      {/* Additional features */}
                      {plan.features.map((feature, idx) => (
                        <FeatureListItem key={idx} included={feature.included} text={feature.text} />
                      ))}
                    </ul>
                    {/* <Separator className="my-6" />
                    <Button variant="outline" onClick={() => handleEditPlan(plan)}>
                      <Edit size={16} className="mr-2" /> Edit Plan
                    </Button> */}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Helper component for feature list items in cards
const FeatureListItem = ({ included, text }: { included: boolean, text: string }) => (
  <li className="flex items-start space-x-3">
    {included ? <Check className="h-5 w-5 text-green-500 mt-0.5" /> : <X className="h-5 w-5 text-red-400 mt-0.5" />}
    <span className={`text-sm ${included ? 'text-gray-700' : 'text-gray-500 line-through'}`}>{text}</span>
  </li>
);

const AdminSubscriptionPage = () => (
  <IsAdminAuth>
    <AdminSubscription />
  </IsAdminAuth>
);

export default AdminSubscriptionPage;