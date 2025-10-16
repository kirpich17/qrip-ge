"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
  DollarSign,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "react-toastify";
import IsAdminAuth from "@/lib/IsAdminAuth/page";
import LanguageDropdown from "@/components/languageDropdown/page";
import { debounce } from "lodash"; // Import lodash for debouncing

interface StickerOption {
  _id: string;
  name: string;
  description: string;
  type: {
    _id: string;
    name: string;
    displayName: string;
    description: string;
  };
  size: string;
  price: number;
  isActive: boolean;
  isInStock: boolean;
  stock: number;
  specifications: {
    material: string;
    dimensions: string;
    durability: string;
    weatherResistance: string;
  };
  createdAt: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function AdminStickersPage() {
  const { t } = useTranslation();
  const stickersTranslations = t("adminStickersPage") || {
    header: { back: "Back to Admin Dashboard", title: "QR Sticker Options", description: "Manage available QR sticker types and pricing" },
    loading: { message: "Loading sticker options..." },
    search: { placeholder: "Search sticker options..." },
    table: { title: "Sticker Options ({count})", description: "Manage all available QR sticker options", headers: { name: "Name", type: "Type", size: "Size", price: "Price", stock: "Stock", status: "Status", actions: "Actions" }, status: { active: "Active", inactive: "Inactive" } },
    createDialog: { title: "Create New Sticker Option", description: "Add a new QR sticker option with pricing and specifications.", form: { name: "Name", namePlaceholder: "Standard Vinyl QR Sticker", type: "Type", typePlaceholder: "Select type", description: "Description", descriptionPlaceholder: "High-quality vinyl QR code sticker...", size: "Size", sizePlaceholder: "3x3 inches", price: "Price ($)", pricePlaceholder: "9.99", stock: "Stock", stockPlaceholder: "100", material: "Material", materialPlaceholder: "Premium Vinyl", dimensions: "Dimensions", dimensionsPlaceholder: "3\" x 3\" (76mm x 76mm)", durability: "Durability", durabilityPlaceholder: "2-3 years outdoor", weatherResistance: "Weather Resistance", weatherResistancePlaceholder: "Waterproof, UV resistant" }, buttons: { cancel: "Cancel", create: "Create" } },
    editDialog: { title: "Edit Sticker Option", description: "Update the sticker option details and specifications.", buttons: { cancel: "Cancel", update: "Update" } },
    types: { vinyl: "Vinyl", engraving: "Engraving", premium: "Premium" },
    messages: { loading: "Loading sticker options...", createSuccess: "Sticker option created successfully", updateSuccess: "Sticker option updated successfully", deleteSuccess: "Sticker option deleted successfully", statusUpdateSuccess: "Status updated successfully", createError: "Failed to create sticker option", updateError: "Failed to update sticker option", deleteError: "Failed to delete sticker option", statusUpdateError: "Failed to update status", loadError: "Failed to load sticker options. Please try again.", deleteConfirm: "Are you sure you want to delete this sticker option?" }
  };

  const [loading, setLoading] = useState(true);
  const [stickerOptions, setStickerOptions] = useState<StickerOption[]>([]);
  const [stickerTypes, setStickerTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<StickerOption | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    size: "",
    price: "",
    stock: "",
    material: "",
    dimensions: "",
    durability: "",
    weatherResistance: "",
  });

  // Retry mechanism for API calls
  const retryRequest = async (fn: () => Promise<any>, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i))); // Exponential backoff
      }
    }
  };

  // Debounced fetchStickerOptions to prevent excessive API calls
  const fetchStickerOptions = useCallback(
    debounce(async (query: string) => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (query) {
          // Sanitize search query to prevent invalid characters
          const sanitizedQuery = query.replace(/[<>{}]/g, "");
          params.append("search", sanitizedQuery);
        }
        const response = await retryRequest(() =>
          axiosInstance.get(`/api/admin/sticker-options?${params}`, { timeout: 10000 })
        );
        setStickerOptions(response.data.data || []);
      } catch (error: any) {
        console.error("Error fetching sticker options:", error);
        const errorMessage = error.response?.data?.message || stickersTranslations?.messages?.loadError || "Failed to load sticker options. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const fetchStickerTypes = async () => {
    try {
      const response = await retryRequest(() =>
        axiosInstance.get("/api/stickers/types", { timeout: 10000 })
      );
      setStickerTypes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching sticker types:", error);
      toast.error("Failed to load sticker types.");
    }
  };

  useEffect(() => {
    fetchStickerOptions(searchQuery);
    fetchStickerTypes();
  }, [searchQuery, fetchStickerOptions]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "",
      size: "",
      price: "",
      stock: "",
      material: "",
      dimensions: "",
      durability: "",
      weatherResistance: "",
    });
  };

  const handleCreate = async () => {
    // Client-side validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.type) {
      toast.error("Type is required");
      return;
    }
    if (!formData.size.trim()) {
      toast.error("Size is required");
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!formData.stock || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      toast.error("Valid stock quantity is required");
      return;
    }

    try {
      const optionData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        specifications: {
          material: formData.material,
          dimensions: formData.dimensions,
          durability: formData.durability,
          weatherResistance: formData.weatherResistance,
        },
      };

      await axiosInstance.post("/api/admin/sticker-options", optionData);
      toast.success(stickersTranslations?.messages?.createSuccess || "Sticker option created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchStickerOptions(searchQuery);
    } catch (error: any) {
      console.error("Error creating sticker option:", error);
      toast.error(error.response?.data?.message || stickersTranslations?.messages?.createError || "Failed to create sticker option");
    }
  };

  const handleEdit = (option: StickerOption) => {
    setEditingOption(option);
    setFormData({
      name: option.name,
      description: option.description,
      type: option.type?._id || option.type || "",
      size: option.size,
      price: option.price.toString(),
      stock: option.stock.toString(),
      material: option.specifications.material,
      dimensions: option.specifications.dimensions,
      durability: option.specifications.durability,
      weatherResistance: option.specifications.weatherResistance,
    });
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingOption) return;

    // Client-side validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.type) {
      toast.error("Type is required");
      return;
    }
    if (!formData.size.trim()) {
      toast.error("Size is required");
      return;
    }
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }
    if (!formData.stock || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      toast.error("Valid stock quantity is required");
      return;
    }

    try {
      const optionData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        specifications: {
          material: formData.material,
          dimensions: formData.dimensions,
          durability: formData.durability,
          weatherResistance: formData.weatherResistance,
        },
      };

      await axiosInstance.put(`/api/admin/sticker-options/${editingOption._id}`, optionData);
      toast.success(stickersTranslations?.messages?.updateSuccess || "Sticker option updated successfully");
      setIsEditDialogOpen(false);
      setEditingOption(null);
      resetForm();
      fetchStickerOptions(searchQuery);
    } catch (error: any) {
      console.error("Error updating sticker option:", error);
      toast.error(error.response?.data?.message || stickersTranslations?.messages?.updateError || "Failed to update sticker option");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(stickersTranslations?.messages?.deleteConfirm || "Are you sure you want to delete this sticker option?")) return;

    try {
      await axiosInstance.delete(`/api/admin/sticker-options/${id}`);
      toast.success(stickersTranslations?.messages?.deleteSuccess || "Sticker option deleted successfully");
      fetchStickerOptions(searchQuery);
    } catch (error: any) {
      console.error("Error deleting sticker option:", error);
      toast.error(error.response?.data?.message || stickersTranslations?.messages?.deleteError || "Failed to delete sticker option");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setUpdating(id);
      await axiosInstance.patch(`/api/admin/sticker-options/${id}/toggle`);
      toast.success(stickersTranslations?.messages?.statusUpdateSuccess || "Status updated successfully");
      fetchStickerOptions(searchQuery);
    } catch (error: any) {
      console.error("Error toggling status:", error);
      toast.error(error.response?.data?.message || stickersTranslations?.messages?.statusUpdateError || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading && stickerOptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#547455] mx-auto"></div>
          <p className="mt-4 text-gray-600">{stickersTranslations?.loading?.message || "Loading sticker options..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/dashboard"
              className="flex items-center text-white hover:underline gap-2 text-base"
            >
              <ArrowLeft className="h-5 w-5" />
              {stickersTranslations?.header?.back || "Back to Admin Dashboard"}
            </Link>
            <LanguageDropdown />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {stickersTranslations?.header?.title || "QR Sticker Options"}
              </h1>
              <p className="text-gray-600">
                {stickersTranslations?.header?.description || "Manage available QR sticker types and pricing"}
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open);
              if (open) {
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-[#547455] hover:bg-[#243b31]">
                  <Plus className="h-4 w-4 mr-2" />
                  {stickersTranslations?.createDialog?.buttons?.create || "Add Sticker Option"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{stickersTranslations?.createDialog?.title || "Create New Sticker Option"}</DialogTitle>
                  <DialogDescription>
                    {stickersTranslations?.createDialog?.description || "Add a new QR sticker option with pricing and specifications."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{stickersTranslations?.createDialog?.form?.name || "Name"} <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder={stickersTranslations?.createDialog?.form?.namePlaceholder || "Standard Vinyl QR Sticker"}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">{stickersTranslations?.createDialog?.form?.type || "Type"} <span className="text-red-500">*</span></Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder={stickersTranslations?.createDialog?.form?.typePlaceholder || "Select type"} />
                        </SelectTrigger>
                        <SelectContent>
                          {stickerTypes.map((type: any) => (
                            <SelectItem key={type._id} value={type._id}>
                              {type.displayName || type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">{stickersTranslations?.createDialog?.form?.description || "Description"} <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder={stickersTranslations?.createDialog?.form?.descriptionPlaceholder || "High-quality vinyl QR code sticker..."}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="size">{stickersTranslations?.createDialog?.form?.size || "Size"} <span className="text-red-500">*</span></Label>
                      <Input
                        id="size"
                        value={formData.size}
                        onChange={(e) => handleInputChange("size", e.target.value)}
                        placeholder={stickersTranslations?.createDialog?.form?.sizePlaceholder || "3x3 inches"}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">{stickersTranslations?.createDialog?.form?.price || "Price (₾)"} <span className="text-red-500">*</span></Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder={stickersTranslations?.createDialog?.form?.pricePlaceholder || "25.00"}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">{stickersTranslations?.createDialog?.form?.stock || "Stock"} <span className="text-red-500">*</span></Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", e.target.value)}
                        placeholder={stickersTranslations?.createDialog?.form?.stockPlaceholder || "100"}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="material">{stickersTranslations?.createDialog?.form?.material || "Material"}</Label>
                      <Input
                        id="material"
                        value={formData.material}
                        onChange={(e) => handleInputChange("material", e.target.value)}
                        placeholder={stickersTranslations?.createDialog?.form?.materialPlaceholder || "Premium Vinyl"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dimensions">{stickersTranslations?.createDialog?.form?.dimensions || "Dimensions"}</Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => handleInputChange("dimensions", e.target.value)}
                        placeholder={stickersTranslations?.createDialog?.form?.dimensionsPlaceholder || '3" x 3" (76mm x 76mm)'}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="durability">{stickersTranslations?.createDialog?.form?.durability || "Durability"}</Label>
                      <Input
                        id="durability"
                        value={formData.durability}
                        onChange={(e) => handleInputChange("durability", e.target.value)}
                        placeholder={stickersTranslations?.createDialog?.form?.durabilityPlaceholder || "2-3 years outdoor"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weatherResistance">{stickersTranslations?.createDialog?.form?.weatherResistance || "Weather Resistance"}</Label>
                      <Input
                        id="weatherResistance"
                        value={formData.weatherResistance}
                        onChange={(e) => handleInputChange("weatherResistance", e.target.value)}
                        placeholder={stickersTranslations?.createDialog?.form?.weatherResistancePlaceholder || "Waterproof, UV resistant"}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setIsCreateDialogOpen(false);
                    resetForm();
                  }}>
                    {stickersTranslations?.createDialog?.buttons?.cancel || "Cancel"}
                  </Button>
                  <Button onClick={handleCreate} className="bg-[#547455] hover:bg-[#243b31]">
                    {stickersTranslations?.createDialog?.buttons?.create || "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardContent className="p-4">
              <p className="text-red-600">{error}</p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => fetchStickerOptions(searchQuery)}
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={stickersTranslations?.search?.placeholder || "Search sticker options..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Sticker Options Table */}
        <Card>
          <CardHeader>
            <CardTitle>{stickersTranslations?.table?.title?.replace('{count}', stickerOptions.length.toString()) || `Sticker Options (${stickerOptions.length})`}</CardTitle>
            <CardDescription>
              {stickersTranslations?.table?.description || "Manage all available QR sticker options"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{stickersTranslations?.table?.headers?.name || "Name"}</TableHead>
                    <TableHead>{stickersTranslations?.table?.headers?.type || "Type"}</TableHead>
                    <TableHead>{stickersTranslations?.table?.headers?.size || "Size"}</TableHead>
                    <TableHead>{stickersTranslations?.table?.headers?.price || "Price"}</TableHead>
                    <TableHead>{stickersTranslations?.table?.headers?.stock || "Stock"}</TableHead>
                    <TableHead>{stickersTranslations?.table?.headers?.status || "Status"}</TableHead>
                    <TableHead>{stickersTranslations?.table?.headers?.actions || "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stickerOptions.length === 0 && !loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500">
                        {stickersTranslations.messages.noStickerOptionsFound}
                      </TableCell>
                    </TableRow>
                  ) : (
                    stickerOptions.map((option) => (
                      <TableRow key={option._id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{option.name}</p>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{option.type?.displayName || option.type?.name || "Unknown"}</Badge>
                        </TableCell>
                        <TableCell>{option.size}</TableCell>
                        <TableCell className="font-semibold">₾{option.price}</TableCell>
                        <TableCell>
                          <span className={option.stock > 10 ? "text-green-600" : option.stock > 0 ? "text-yellow-600" : "text-red-600"}>
                            {option.stock}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge className={option.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {option.isActive ? (stickersTranslations?.table?.status?.active || "Active") : (stickersTranslations?.table?.status?.inactive || "Inactive")}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleStatus(option._id)}
                              disabled={updating === option._id}
                            >
                              {option.isActive ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(option)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(option._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingOption(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{stickersTranslations?.editDialog?.title || "Edit Sticker Option"}</DialogTitle>
              <DialogDescription>
                {stickersTranslations?.editDialog?.description || "Update the sticker option details and specifications."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">{stickersTranslations?.createDialog?.form?.name || "Name"} <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={stickersTranslations?.createDialog?.form?.namePlaceholder || "Standard Vinyl QR Sticker"}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">{stickersTranslations?.createDialog?.form?.type || "Type"} <span className="text-red-500">*</span></Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={stickersTranslations?.createDialog?.form?.typePlaceholder || "Select type"} />
                    </SelectTrigger>
                    <SelectContent>
                      {stickerTypes.map((type: any) => (
                        <SelectItem key={type._id} value={type._id}>
                          {type.displayName || type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">{stickersTranslations?.createDialog?.form?.description || "Description"} <span className="text-red-500">*</span></Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder={stickersTranslations?.createDialog?.form?.descriptionPlaceholder || "High-quality vinyl QR code sticker..."}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-size">{stickersTranslations?.createDialog?.form?.size || "Size"} <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-size"
                    value={formData.size}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    placeholder={stickersTranslations?.createDialog?.form?.sizePlaceholder || "3x3 inches"}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price">{stickersTranslations?.createDialog?.form?.price || "Price (₾)"} <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder={stickersTranslations?.createDialog?.form?.pricePlaceholder || "25.00"}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">{stickersTranslations?.createDialog?.form?.stock || "Stock"} <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder={stickersTranslations?.createDialog?.form?.stockPlaceholder || "100"}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-material">{stickersTranslations?.createDialog?.form?.material || "Material"}</Label>
                  <Input
                    id="edit-material"
                    value={formData.material}
                    onChange={(e) => handleInputChange("material", e.target.value)}
                    placeholder={stickersTranslations?.createDialog?.form?.materialPlaceholder || "Premium Vinyl"}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dimensions">{stickersTranslations?.createDialog?.form?.dimensions || "Dimensions"}</Label>
                  <Input
                    id="edit-dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange("dimensions", e.target.value)}
                    placeholder={stickersTranslations?.createDialog?.form?.dimensionsPlaceholder || '3" x 3" (76mm x 76mm)'}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-durability">{stickersTranslations?.createDialog?.form?.durability || "Durability"}</Label>
                  <Input
                    id="edit-durability"
                    value={formData.durability}
                    onChange={(e) => handleInputChange("durability", e.target.value)}
                    placeholder={stickersTranslations?.createDialog?.form?.durabilityPlaceholder || "2-3 years outdoor"}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-weatherResistance">{stickersTranslations?.createDialog?.form?.weatherResistance || "Weather Resistance"}</Label>
                  <Input
                    id="edit-weatherResistance"
                    value={formData.weatherResistance}
                    onChange={(e) => handleInputChange("weatherResistance", e.target.value)}
                    placeholder={stickersTranslations?.createDialog?.form?.weatherResistancePlaceholder || "Waterproof, UV resistant"}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsEditDialogOpen(false);
                setEditingOption(null);
                resetForm();
              }}>
                {stickersTranslations?.editDialog?.buttons?.cancel || "Cancel"}
              </Button>
              <Button onClick={handleUpdate} className="bg-[#547455] hover:bg-[#243b31]">
                {stickersTranslations?.editDialog?.buttons?.update || "Update"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

const AdminStickersPageWrapper = () => {
  return (
    <IsAdminAuth>
      <AdminStickersPage />
    </IsAdminAuth>
  );
};

export default AdminStickersPageWrapper;