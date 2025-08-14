

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

// --- REFACTORED TYPES ---
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
  billingPeriod: "free" | "monthly" | "one_time";
  ctaButtonText: string;
  features: Feature[];
  isActive: boolean;
  isPopular?: boolean;
  color?: string;
  bgColor?: string;
  borderColor?: string;
};

// This is a helper type for creating a new plan, as `_id` doesn't exist yet.
type NewPlan = Omit<Plan, "_id">;

function AdminSubscription() {
  const { t } = useTranslation();
  const adsubscriptionTranslations = t("adsubscription");

  // State for the modal, using the new Plan type
  const [editingPlan, setEditingPlan] = useState<Plan | NewPlan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plans from API
  const fetchPlans = async () => {
    setIsLoading(true);
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

  const handleEditPlan = (plan: Plan) => {
    // Clone the plan to avoid direct state mutation
    setEditingPlan(JSON.parse(JSON.stringify(plan)));
    setIsAddingPlan(false);
  };

  const handleSavePlan = async () => {
    if (!editingPlan || !("_id" in editingPlan)) return;

    // Filter out any features with empty text
    const payload = {
      ...editingPlan,
      features: editingPlan.features.filter((f) => f.text.trim() !== ""),
    };

    try {
      await axiosInstance.put(
        `/api/admin/subscription/${editingPlan._id}`,
        payload
      );
      fetchPlans();
      setEditingPlan(null);
    } catch (err) {
      setError("Failed to update plan");
      console.error("Error updating plan:", err);
    }
  };

  const handleAddPlan = () => {
    const newPlan: NewPlan = {
      name: "New Plan",
      description: "Plan description",
      price: 0,
      billingPeriod: "free",
      ctaButtonText: "Get Started",
      isActive: true,
      isPopular: false,
      features: [{ text: "", included: true }],
      color: "text-black",
      bgColor: "bg-green-50",
      borderColor: "border-gray-200",
    };
    setEditingPlan(newPlan);
    setIsAddingPlan(true);
  };

  const handleSaveNewPlan = async () => {
    if (!editingPlan) return;

    // Filter out any features with empty text
    const payload = {
      ...editingPlan,
      features: editingPlan.features.filter((f) => f.text.trim() !== ""),
    };

    try {
      await axiosInstance.post("/api/admin/subscription", payload);
      fetchPlans();
      setEditingPlan(null);
      setIsAddingPlan(false);
    } catch (err) {
      setError("Failed to create new plan");
      console.error("Error creating plan:", err);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      try {
        await axiosInstance.delete(`/api/admin/subscription/${id}`);
        fetchPlans();
      } catch (err) {
        setError("Failed to delete plan");
        console.error("Error deleting plan:", err);
      }
    }
  };

  const togglePlanStatus = async (id: string) => {
    try {
      const planToUpdate = plans.find((p) => p._id === id);
      if (!planToUpdate) return;

      // Note: This endpoint seems unusual. A standard PUT/PATCH to the main resource is more common.
      // Adjust if your API changes.
      const updatedPlan = { ...planToUpdate, isActive: !planToUpdate.isActive };
      await axiosInstance.put(
        `/api/admin/subscription/${id}`,
        updatedPlan
      );
      fetchPlans();
    } catch (err) {
      setError("Failed to update plan status");
      console.error("Error updating plan status:", err);
    }
  };

  // --- REFACTORED FEATURE HANDLERS FOR THE MODAL ---
  const addFeatureToPlan = () => {
    if (editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, { text: "", included: true }],
      });
    }
  };

  const removeFeatureFromPlan = (index: number) => {
    if (editingPlan) {
      const newFeatures = [...editingPlan.features];
      newFeatures.splice(index, 1);
      setEditingPlan({ ...editingPlan, features: newFeatures });
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
      setEditingPlan({ ...editingPlan, features: newFeatures });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button onClick={fetchPlans} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center text-white hover:underline gap-2">
              <ArrowLeft className="h-5 w-5" />
              {adsubscriptionTranslations.header.back}
            </Link>
            <div className="flex items-center space-x-2">
              <Crown className="md:h-6 md:w-6 w-4 h-4 text-white" />
              <span className="md:text-xl text-base font-bold text-white">
                {adsubscriptionTranslations.header.title}
              </span>
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div {...fadeInUp}>
          <div className="text-center mb-12">
            <h1 className="md:text-4xl text-2xl font-bold text-gray-900 md:mb-4 mb-3">
              {adsubscriptionTranslations.title}
            </h1>
            <p className="md:text-xl text-base text-gray-600 max-w-3xl mx-auto mb-8">
              {adsubscriptionTranslations.description}
            </p>
            {/* <Button onClick={handleAddPlan} className="bg-[#243b31] hover:bg-[#547455]">
              <Plus className="h-4 w-4 mr-2" />
              {adsubscriptionTranslations.admin.addPlan}
            </Button> */}
          </div>

          {/* --- REFACTORED ADD/EDIT PLAN MODAL --- */}
          {editingPlan && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {isAddingPlan ? "Add New Plan" : "Edit Plan"}
                  </h2>
                  <button onClick={() => setEditingPlan(null)} className="text-gray-500 hover:text-gray-700">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Plan Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                    <Input
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    />
                  </div>
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <Textarea
                      value={editingPlan.description}
                      onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    />
                  </div>

                  {/* Price & Billing Period */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <Input
                        type="number"
                        value={editingPlan.price}
                        onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Billing Period</label>
                      <select
                        value={editingPlan.billingPeriod}
                        onChange={(e) => setEditingPlan({ ...editingPlan, billingPeriod: e.target.value as Plan["billingPeriod"] })}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="free">Free</option>
                        <option value="monthly">Monthly</option>
                        <option value="one_time">One-Time</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* CTA Button Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button Text</label>
                    <Input
                      value={editingPlan.ctaButtonText}
                      onChange={(e) => setEditingPlan({ ...editingPlan, ctaButtonText: e.target.value })}
                    />
                  </div>

                  {/* Toggles */}
                  <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="popular" checked={editingPlan.isPopular} onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, isPopular: checked })}/>
                      <label htmlFor="popular" className="text-sm font-medium text-gray-700">Mark as Popular</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="active" checked={editingPlan.isActive} onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, isActive: checked })}/>
                      <label htmlFor="active" className="text-sm font-medium text-gray-700">Plan Active</label>
                    </div>
                  </div>

                  {/* Features Management */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    <div className="space-y-2 mb-3">
                      {editingPlan.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                          <Input
                            value={feature.text}
                            onChange={(e) => updateFeatureInPlan(index, "text", e.target.value)}
                            placeholder="Enter feature description"
                            className="flex-grow"
                          />
                          <Switch
                            checked={feature.included}
                            onCheckedChange={(checked) => updateFeatureInPlan(index, "included", checked)}
                            aria-label={feature.included ? "Included" : "Excluded"}
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeFeatureFromPlan(index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button onClick={addFeatureToPlan} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Feature
                    </Button>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t">
                    <Button
                      onClick={isAddingPlan ? handleSaveNewPlan : handleSavePlan}
                      className="w-full bg-[#243b31] hover:bg-[#547455]"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isAddingPlan ? "Add New Plan" : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* --- REFACTORED PLANS GRID --- */}
          <div className="grid lg:grid-cols-3 md:gap-8 gap-5 mb-12">
            {plans.map((plan, index) => (
              <motion.div key={plan._id} {...fadeInUp} transition={{ delay: index * 0.1 }}>
                <Card className={`relative h-full flex flex-col ${plan.isPopular ? "border-[#243b31] shadow-lg" : "border-gray-200 hover:shadow-md"} transition-all duration-300 ${!plan.isActive ? "bg-gray-100 opacity-70" : "bg-white"}`}>
                  {plan.isPopular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#547455] text-white px-4 py-1">Popular</Badge>
                  )}
                  {!plan.isActive && (
                    <Badge variant="destructive" className="absolute top-3 right-3 px-4 py-1">Inactive</Badge>
                  )}
                  <CardHeader className="text-center pb-4">
                     <div className={`md:w-16 md:h-16 w-12 h-12 ${plan.bgColor || 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        {plan.name.toLowerCase().includes("free") && <Star className="md:h-8 md:w-8 w-5 h-5 text-black" />}
                        {plan.name.toLowerCase().includes("premium") && <Crown className="md:h-8 md:w-8 w-5 h-5 text-black" />}
                        {plan.name.toLowerCase().includes("life") && <Zap className="md:h-8 md:w-8 w-5 h-5 text-black" />}
                      </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-600 ml-2">
                          {plan.billingPeriod === 'one_time' ? 'one-time' : plan.billingPeriod === 'monthly' ? '/month' : 'forever'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 flex-grow flex flex-col">
                    <div className="space-y-6 flex-grow">
                      {plan.features.filter(f => f.included).length > 0 && (
                        <div>
                          {/* <h4 className="font-semibold text-gray-900 mb-3">✅ Included Features</h4> */}
                          <ul className="space-y-2">
                            {plan.features.filter(f => f.included).map((feature, idx) => (
                              <li key={idx} className="flex items-start space-x-3">
                                <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 text-sm">{feature.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {plan.features.filter(f => !f.included).length > 0 && (
                        <div>
                          {/* <h4 className="font-semibold text-gray-900 mb-3">❌ Not Included</h4> */}
                          <ul className="space-y-2">
                            {plan.features.filter(f => !f.included).map((feature, idx) => (
                              <li key={idx} className="flex items-start space-x-3">
                                <X className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-500 text-sm line-through">{feature.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <Separator className="my-6"/>
                    <div className="flex flex-col gap-2 pt-2">
                      <Button variant="outline" onClick={() => handleEditPlan(plan)}>
                        <Edit className="h-4 w-4 mr-2" />
                        {adsubscriptionTranslations.admin.editPlan}
                      </Button>

                        {/* <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => togglePlanStatus(plan._id)}
                        >
                          {plan.isActive
                            ? adsubscriptionTranslations.admin.deactivatePlan
                            : adsubscriptionTranslations.admin.activatePlan}
                        </Button>
                       <Button variant="destructive" onClick={() => handleDeletePlan(plan._id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                         {adsubscriptionTranslations.admin.deletePlan}
                        </Button> */}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const AdminSubscriptionPage = () => {
  return (
    <IsAdminAuth>
      <AdminSubscription />
    </IsAdminAuth>
  );
};

export default AdminSubscriptionPage;