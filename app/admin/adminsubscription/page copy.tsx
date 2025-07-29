"use client";

import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/hooks/useTranslate";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

type Plan = {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isOneTime: boolean;
  features: string[];
  limitations: string[];
  isActive: boolean;
  isPopular?: boolean;
  color?: string;
  bgColor?: string;
  borderColor?: string;
};

export default function AdminSubscription() {
  const { t } = useTranslation();
  const adsubscriptionTranslations = t("adsubscription");
  const [isYearly, setIsYearly] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newLimitation, setNewLimitation] = useState("");

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: "1",
      name: "Free",
      description: "Basic memorial features",
      monthlyPrice: 0,
      yearlyPrice: 0,
      isOneTime: false,
      isActive: true,
      features: [
        adsubscriptionTranslations.plans.free.features[0],
        adsubscriptionTranslations.plans.free.features[1],
        adsubscriptionTranslations.plans.free.features[2],
      ],
      limitations: [
        adsubscriptionTranslations.plans.free.limitations[0],
        adsubscriptionTranslations.plans.free.limitations[1],
        adsubscriptionTranslations.plans.free.limitations[2],
        adsubscriptionTranslations.plans.free.limitations[3],
        adsubscriptionTranslations.plans.free.limitations[4],
      ],
      color: "text-black",
      bgColor: "bg-green-50",
      borderColor: "border-gray-200",
    },
    {
      id: "2",
      name: "Basic Premium",
      description: "Enhanced memorial experience",
      monthlyPrice: 9,
      yearlyPrice: 90,
      isOneTime: false,
      isActive: true,
      isPopular: true,
      features: [
        adsubscriptionTranslations.plans.basic.features[0],
        adsubscriptionTranslations.plans.basic.features[1],
        adsubscriptionTranslations.plans.basic.features[2],
        adsubscriptionTranslations.plans.basic.features[3],
        adsubscriptionTranslations.plans.basic.features[4],
        adsubscriptionTranslations.plans.basic.features[5],
        adsubscriptionTranslations.plans.basic.features[6],
      ],
      limitations: [
        adsubscriptionTranslations.plans.basic.limitations[0],
        adsubscriptionTranslations.plans.basic.limitations[1],
      ],
      color: "text-black",
      bgColor: "bg-green-50",
      borderColor: "border-gray-200",
    },
    {
      id: "3",
      name: "Legacy+",
      description: "Complete memorial solution",
      monthlyPrice: 199,
      yearlyPrice: 199,
      isOneTime: true,
      isActive: true,
      features: [
        adsubscriptionTranslations.plans.legacy.features[0],
        adsubscriptionTranslations.plans.legacy.features[1],
        adsubscriptionTranslations.plans.legacy.features[2],
        adsubscriptionTranslations.plans.legacy.features[3],
        adsubscriptionTranslations.plans.legacy.features[4],
        adsubscriptionTranslations.plans.legacy.features[5],
        adsubscriptionTranslations.plans.legacy.features[6],
        adsubscriptionTranslations.plans.legacy.features[7],
        adsubscriptionTranslations.plans.legacy.features[8],
        adsubscriptionTranslations.plans.legacy.features[9],
      ],
      limitations: [],
      color: "text-black",
      bgColor: "bg-green-50",
      borderColor: "border-gray-200",
    },
  ]);

  const featureComparison = [
    {
      feature: adsubscriptionTranslations.comparison.features[0].name,
      free: true,
      basic: true,
      legacy: true,
    },
    {
      feature: adsubscriptionTranslations.comparison.features[1].name,
      free: true,
      basic: true,
      legacy: true,
    },
    {
      feature: adsubscriptionTranslations.comparison.features[2].name,
      free: false,
      basic: true,
      legacy: true,
    },
    {
      feature: adsubscriptionTranslations.comparison.features[3].name,
      free: false,
      basic: true,
      legacy: true,
    },
    {
      feature: adsubscriptionTranslations.comparison.features[4].name,
      free: false,
      basic: true,
      legacy: true,
    },
    {
      feature: adsubscriptionTranslations.comparison.features[5].name,
      free: false,
      basic: false,
      legacy: true,
    },
    {
      feature: adsubscriptionTranslations.comparison.features[6].name,
      free: false,
      basic: false,
      legacy: true,
    },
  ];

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
  };

  const handleSavePlan = () => {
    if (editingPlan) {
      setPlans(plans.map((p) => (p.id === editingPlan.id ? editingPlan : p)));
      setEditingPlan(null);
    }
  };

  const handleAddPlan = () => {
    const newPlan: Plan = {
      id: `new-${Date.now()}`,
      name: "New Plan",
      description: "Plan description",
      monthlyPrice: 0,
      yearlyPrice: 0,
      isOneTime: false,
      isActive: true,
      features: [],
      limitations: [],
      color: "text-black",
      bgColor: "bg-green-50",
      borderColor: "border-gray-200",
    };
    setEditingPlan(newPlan);
    setIsAddingPlan(true);
  };

  const handleSaveNewPlan = () => {
    if (editingPlan) {
      setPlans([...plans, editingPlan]);
      setEditingPlan(null);
      setIsAddingPlan(false);
    }
  };

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter((p) => p.id !== id));
  };

  const togglePlanStatus = (id: string) => {
    setPlans(
      plans.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const addFeature = () => {
    if (newFeature.trim() && editingPlan) {
      setEditingPlan({
        ...editingPlan,
        features: [...editingPlan.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    if (editingPlan) {
      const newFeatures = [...editingPlan.features];
      newFeatures.splice(index, 1);
      setEditingPlan({
        ...editingPlan,
        features: newFeatures,
      });
    }
  };

  const addLimitation = () => {
    if (newLimitation.trim() && editingPlan) {
      setEditingPlan({
        ...editingPlan,
        limitations: [...editingPlan.limitations, newLimitation.trim()],
      });
      setNewLimitation("");
    }
  };

  const removeLimitation = (index: number) => {
    if (editingPlan) {
      const newLimitations = [...editingPlan.limitations];
      newLimitations.splice(index, 1);
      setEditingPlan({
        ...editingPlan,
        limitations: newLimitations,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="flex items-center text-white hover:underline gap-2 text-base"
              >
                <ArrowLeft className="h-5 w-5" />
                {adsubscriptionTranslations.header.back}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="md:h-6 md:w-6 w-4 h-4 text-white" />
              <span className="md:text-xl text-base font-bold text-white">
                {adsubscriptionTranslations.header.title}
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
            <h1 className="md:text-4xl text-2xl font-bold text-gray-900 md:mb-4 mb-3">
              {adsubscriptionTranslations.title}
            </h1>
            <p className="md:text-xl text-base text-gray-600 max-w-3xl mx-auto mb-8">
              {adsubscriptionTranslations.description}
            </p>

            {/* Admin Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                onClick={handleAddPlan}
                className="bg-[#243b31] hover:bg-[#547455]"
              >
                <Plus className="h-4 w-4 mr-2" />
                {adsubscriptionTranslations.admin.addPlan}
              </Button>
            </div>
          </div>

          {/* Edit Plan Modal */}
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {isAddingPlan
                      ? adsubscriptionTranslations.admin.addPlan
                      : adsubscriptionTranslations.admin.editPlan}
                  </h2>
                  <button
                    onClick={() => {
                      setEditingPlan(null);
                      setIsAddingPlan(false);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {adsubscriptionTranslations.admin.planName}
                    </label>
                    <Input
                      value={editingPlan.name}
                      onChange={(e) =>
                        setEditingPlan({ ...editingPlan, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {adsubscriptionTranslations.admin.planDescription}
                    </label>
                    <Textarea
                      value={editingPlan.description}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {adsubscriptionTranslations.admin.monthlyPrice}
                      </label>
                      <Input
                        type="number"
                        value={editingPlan.monthlyPrice}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            monthlyPrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {adsubscriptionTranslations.admin.yearlyPrice}
                      </label>
                      <Input
                        type="number"
                        value={editingPlan.yearlyPrice}
                        onChange={(e) =>
                          setEditingPlan({
                            ...editingPlan,
                            yearlyPrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="one-time"
                      checked={editingPlan.isOneTime}
                      onCheckedChange={(checked) =>
                        setEditingPlan({ ...editingPlan, isOneTime: checked })
                      }
                    />
                    <label
                      htmlFor="one-time"
                      className="text-sm font-medium text-gray-700"
                    >
                      {adsubscriptionTranslations.admin.oneTimePayment}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="popular"
                      checked={editingPlan.isPopular || false}
                      onCheckedChange={(checked) =>
                        setEditingPlan({ ...editingPlan, isPopular: checked })
                      }
                    />
                    <label
                      htmlFor="popular"
                      className="text-sm font-medium text-gray-700"
                    >
                      {adsubscriptionTranslations.admin.markPopular}
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={editingPlan.isActive}
                      onCheckedChange={(checked) =>
                        setEditingPlan({ ...editingPlan, isActive: checked })
                      }
                    />
                    <label
                      htmlFor="active"
                      className="text-sm font-medium text-gray-700"
                    >
                      {adsubscriptionTranslations.admin.planActive}
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {adsubscriptionTranslations.admin.features}
                    </label>
                    <div className="space-y-2 mb-2">
                      {editingPlan.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <span>{feature}</span>
                          <button
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                      />
                      <Button onClick={addFeature}>
                        <Plus className="h-4 w-4 mr-1" />
                        {adsubscriptionTranslations.admin.addFeature}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {adsubscriptionTranslations.admin.limitations}
                    </label>
                    <div className="space-y-2 mb-2">
                      {editingPlan.limitations.map((limitation, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                          <span>{limitation}</span>
                          <button
                            onClick={() => removeLimitation(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newLimitation}
                        onChange={(e) => setNewLimitation(e.target.value)}
                      />
                      <Button onClick={addLimitation}>
                        <Plus className="h-4 w-4 mr-1" />
                        {adsubscriptionTranslations.admin.addLimitation}
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={
                        isAddingPlan ? handleSaveNewPlan : handleSavePlan
                      }
                      className="w-full bg-[#243b31] hover:bg-[#547455]"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isAddingPlan
                        ? adsubscriptionTranslations.admin.addPlan
                        : adsubscriptionTranslations.admin.savePlan}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Plans Grid */}
          <div className="grid lg:grid-cols-3 md:gap-8 gap-5 mb-12">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full ${
                    plan.isPopular
                      ? "border-[#243b31] shadow-lg"
                      : `${plan.borderColor} hover:shadow-md`
                  } transition-all duration-300 ${
                    !plan.isActive ? "opacity-70" : ""
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#547455] text-white px-4 py-1">
                        {adsubscriptionTranslations.plans.basic.popular}
                      </Badge>
                    </div>
                  )}

                  {!plan.isActive && (
                    <div className="absolute -top-4 right-4 transform">
                      <Badge variant="destructive" className="px-4 py-1">
                        {adsubscriptionTranslations.plans.basic.inactive}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div
                      className={`md:w-16 md:h-16 w-12 h-12 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                    >
                      {plan.name === "Free" && (
                        <Star className="md:h-8 md:w-8 w-5 h-5 text-black" />
                      )}
                      {plan.name === "Basic Premium" && (
                        <Crown className="md:h-8 md:w-8 w-5 h-5 text-black" />
                      )}
                      {plan.name === "Legacy+" && (
                        <Zap className="md:h-8 md:w-8 w-5 h-5 text-black" />
                      )}
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
                          {plan.isOneTime
                            ? `$${plan.monthlyPrice}`
                            : isYearly
                            ? `$${plan.yearlyPrice}`
                            : `$${plan.monthlyPrice}`}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {plan.isOneTime
                            ? adsubscriptionTranslations.admin.oneTimePayment
                            : isYearly
                            ? adsubscriptionTranslations.admin.yearly
                            : adsubscriptionTranslations.admin.monthly}
                        </span>
                      </div>
                      {isYearly && !plan.isOneTime && plan.monthlyPrice > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          {adsubscriptionTranslations.admin.save}
                          {plan.monthlyPrice * 12 - plan.yearlyPrice}
                          {adsubscriptionTranslations.admin.perYear}
                        </p>
                      )}
                      {plan.isOneTime && (
                        <p className="text-sm text-[#547455] mt-1 font-medium">
                          {adsubscriptionTranslations.plans.legacy.lifetime}
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          ✅ {adsubscriptionTranslations.comparison.title}
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
                            ❌{" "}
                            {adsubscriptionTranslations.comparison.notincluded}
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

                      {/* Admin Actions */}
                      <div className="flex gap-2 pt-2 flex-wrap">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleEditPlan(plan)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {adsubscriptionTranslations.admin.editPlan}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => togglePlanStatus(plan.id)}
                        >
                          {plan.isActive
                            ? adsubscriptionTranslations.admin.deactivatePlan
                            : adsubscriptionTranslations.admin.activatePlan}
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {adsubscriptionTranslations.admin.deletePlan}
                        </Button>
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
                <CardTitle>
                  {adsubscriptionTranslations.comparison.title}
                </CardTitle>
                <CardDescription>
                  {adsubscriptionTranslations.comparison.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead className="text-center">Free</TableHead>
                        <TableHead className="text-center">
                          Basic Premium
                        </TableHead>
                        <TableHead className="text-center">Legacy+</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {featureComparison.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.feature}</TableCell>
                          <TableCell className="text-center">
                            {row.free ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.basic ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {row.legacy ? (
                              <Check className="h-5 w-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 mx-auto" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Subscribers Table */}
          <motion.div variants={fadeInUp} className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>
                  {adsubscriptionTranslations.admin.subscribers.title}
                </CardTitle>
                <CardDescription>
                  {adsubscriptionTranslations.admin.subscribers.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {adsubscriptionTranslations.admin.subscribers.user}
                      </TableHead>
                      <TableHead>
                        {adsubscriptionTranslations.admin.subscribers.plan}
                      </TableHead>
                      <TableHead>
                        {adsubscriptionTranslations.admin.subscribers.status}
                      </TableHead>
                      <TableHead>
                        {adsubscriptionTranslations.admin.subscribers.billing}
                      </TableHead>
                      <TableHead>
                        {adsubscriptionTranslations.admin.subscribers.startDate}
                      </TableHead>
                      <TableHead>
                        {adsubscriptionTranslations.admin.subscribers.endDate}
                      </TableHead>
                      <TableHead>
                        {adsubscriptionTranslations.admin.subscribers.actions}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>john.doe@example.com</TableCell>
                      <TableCell>Basic Premium</TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>Monthly</TableCell>
                      <TableCell>2023-10-15</TableCell>
                      <TableCell>2023-11-15</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>jane.smith@example.com</TableCell>
                      <TableCell>Legacy+</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Lifetime</Badge>
                      </TableCell>
                      <TableCell>One-time</TableCell>
                      <TableCell>2023-09-01</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>mike.johnson@example.com</TableCell>
                      <TableCell>Free</TableCell>
                      <TableCell>
                        <Badge variant="outline">Inactive</Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
