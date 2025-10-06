"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Package,
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
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "react-toastify";
import IsAdminAuth from "@/lib/IsAdminAuth/page";
import LanguageDropdown from "@/components/languageDropdown/page";

interface StickerType {
  _id: string;
  name: string;
  displayName: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  specifications: {
    material: string;
    durability: string;
    weatherResistance: string;
    specialFeatures: string;
  };
  createdAt: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

function AdminStickerTypesPage() {
  const { t } = useTranslation();
  const stickerTypesTranslations = t("adminStickerTypes") || {
    header: { back: "Back to Admin Dashboard", title: "Sticker Types", description: "Manage available sticker types" },
    loading: { message: "Loading sticker types..." },
    search: { placeholder: "Search sticker types..." },
    table: { title: "Sticker Types ({count})", description: "Manage all available sticker types", headers: { name: "Name", displayName: "Display Name", description: "Description", status: "Status", actions: "Actions" }, status: { active: "Active", inactive: "Inactive" } },
    createDialog: { title: "Create New Sticker Type", description: "Add a new sticker type with specifications.", form: { name: "Name", namePlaceholder: "vinyl", displayName: "Display Name", displayNamePlaceholder: "Vinyl", description: "Description", descriptionPlaceholder: "High-quality vinyl material...", material: "Material", materialPlaceholder: "Premium Vinyl", durability: "Durability", durabilityPlaceholder: "2-3 years outdoor", weatherResistance: "Weather Resistance", weatherResistancePlaceholder: "Waterproof, UV resistant", specialFeatures: "Special Features", specialFeaturesPlaceholder: "Custom colors available" }, buttons: { cancel: "Cancel", create: "Create" } },
    editDialog: { title: "Edit Sticker Type", description: "Update the sticker type details and specifications.", buttons: { cancel: "Cancel", update: "Update" } },
    messages: { loading: "Loading sticker types...", createSuccess: "Sticker type created successfully", updateSuccess: "Sticker type updated successfully", deleteSuccess: "Sticker type deleted successfully", statusUpdateSuccess: "Status updated successfully", createError: "Failed to create sticker type", updateError: "Failed to update sticker type", deleteError: "Failed to delete sticker type", statusUpdateError: "Failed to update status", loadError: "Failed to load sticker types", deleteConfirm: "Are you sure you want to delete this sticker type?" }
  };
  
  const [loading, setLoading] = useState(true);
  const [stickerTypes, setStickerTypes] = useState<StickerType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<StickerType | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    material: "",
    durability: "",
    weatherResistance: "",
    specialFeatures: "",
  });

  useEffect(() => {
    fetchStickerTypes();
  }, [searchQuery]);

  const fetchStickerTypes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await axiosInstance.get(`/api/admin/sticker-types?${params}`);
      setStickerTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching sticker types:", error);
      toast.error(stickerTypesTranslations?.messages?.loadError || "Failed to load sticker types");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      displayName: "",
      description: "",
      material: "",
      durability: "",
      weatherResistance: "",
      specialFeatures: "",
    });
  };

  const handleCreate = async () => {
    try {
      const payload = {
        ...formData,
        specifications: {
          material: formData.material,
          durability: formData.durability,
          weatherResistance: formData.weatherResistance,
          specialFeatures: formData.specialFeatures,
        }
      };
      delete payload.material;
      delete payload.durability;
      delete payload.weatherResistance;
      delete payload.specialFeatures;

      await axiosInstance.post('/api/admin/sticker-types', payload);
      toast.success(stickerTypesTranslations?.messages?.createSuccess || "Sticker type created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchStickerTypes();
    } catch (error) {
      console.error("Error creating sticker type:", error);
      toast.error(stickerTypesTranslations?.messages?.createError || "Failed to create sticker type");
    }
  };

  const handleEdit = (type: StickerType) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      displayName: type.displayName,
      description: type.description,
      material: type.specifications?.material || "",
      durability: type.specifications?.durability || "",
      weatherResistance: type.specifications?.weatherResistance || "",
      specialFeatures: type.specifications?.specialFeatures || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingType) return;

    try {
      const payload = {
        ...formData,
        specifications: {
          material: formData.material,
          durability: formData.durability,
          weatherResistance: formData.weatherResistance,
          specialFeatures: formData.specialFeatures,
        }
      };
      delete payload.material;
      delete payload.durability;
      delete payload.weatherResistance;
      delete payload.specialFeatures;

      await axiosInstance.put(`/api/admin/sticker-types/${editingType._id}`, payload);
      toast.success(stickerTypesTranslations?.messages?.updateSuccess || "Sticker type updated successfully");
      setIsEditDialogOpen(false);
      setEditingType(null);
      resetForm();
      fetchStickerTypes();
    } catch (error) {
      console.error("Error updating sticker type:", error);
      toast.error(stickerTypesTranslations?.messages?.updateError || "Failed to update sticker type");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(stickerTypesTranslations?.messages?.deleteConfirm || "Are you sure you want to delete this sticker type?")) {
      return;
    }

    try {
      setUpdating(id);
      await axiosInstance.delete(`/api/admin/sticker-types/${id}`);
      toast.success(stickerTypesTranslations?.messages?.deleteSuccess || "Sticker type deleted successfully");
      fetchStickerTypes();
    } catch (error) {
      console.error("Error deleting sticker type:", error);
      toast.error(stickerTypesTranslations?.messages?.deleteError || "Failed to delete sticker type");
    } finally {
      setUpdating(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setUpdating(id);
      await axiosInstance.patch(`/api/admin/sticker-types/${id}/toggle`);
      toast.success(stickerTypesTranslations?.messages?.statusUpdateSuccess || "Status updated successfully");
      fetchStickerTypes();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(stickerTypesTranslations?.messages?.statusUpdateError || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const filteredTypes = stickerTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <IsAdminAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#243b31] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 flex-wrap gap-2">
              <div className="flex items-center">
                <Link
                  href="/admin"
                  className="flex items-center text-white hover:underline text-xs sm:text-lg gap-1"
                >
                  <ArrowLeft className="h-5 w-5" />
                  {stickerTypesTranslations?.header?.back || "Back to Admin Dashboard"}
                </Link>
              </div>
              <div className="flex gap-3">
                <LanguageDropdown />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6 }}
            variants={fadeInUp}
          >
            <div className="mb-8">
              <h1 className="md:text-3xl text-xl font-bold text-gray-900 mb-2">
                {stickerTypesTranslations?.header?.title || "Sticker Types"}
              </h1>
              <p className="text-gray-600">
                {stickerTypesTranslations?.header?.description || "Manage available sticker types"}
              </p>
            </div>

            {/* Search and Create */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={stickerTypesTranslations?.search?.placeholder || "Search sticker types..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
                setIsCreateDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button className="bg-[#547455] hover:bg-[#243b31] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    {stickerTypesTranslations?.createDialog?.title || "Create New Sticker Type"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{stickerTypesTranslations?.createDialog?.title || "Create New Sticker Type"}</DialogTitle>
                    <DialogDescription>
                      {stickerTypesTranslations?.createDialog?.description || "Add a new sticker type with specifications."}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{stickerTypesTranslations?.createDialog?.form?.name || "Name"}</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder={stickerTypesTranslations?.createDialog?.form?.namePlaceholder || "vinyl"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="displayName">{stickerTypesTranslations?.createDialog?.form?.displayName || "Display Name"}</Label>
                        <Input
                          id="displayName"
                          value={formData.displayName}
                          onChange={(e) => handleInputChange("displayName", e.target.value)}
                          placeholder={stickerTypesTranslations?.createDialog?.form?.displayNamePlaceholder || "Vinyl"}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">{stickerTypesTranslations?.createDialog?.form?.description || "Description"}</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder={stickerTypesTranslations?.createDialog?.form?.descriptionPlaceholder || "High-quality vinyl material..."}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="material">{stickerTypesTranslations?.createDialog?.form?.material || "Material"}</Label>
                        <Input
                          id="material"
                          value={formData.material}
                          onChange={(e) => handleInputChange("material", e.target.value)}
                          placeholder={stickerTypesTranslations?.createDialog?.form?.materialPlaceholder || "Premium Vinyl"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="durability">{stickerTypesTranslations?.createDialog?.form?.durability || "Durability"}</Label>
                        <Input
                          id="durability"
                          value={formData.durability}
                          onChange={(e) => handleInputChange("durability", e.target.value)}
                          placeholder={stickerTypesTranslations?.createDialog?.form?.durabilityPlaceholder || "2-3 years outdoor"}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="weatherResistance">{stickerTypesTranslations?.createDialog?.form?.weatherResistance || "Weather Resistance"}</Label>
                        <Input
                          id="weatherResistance"
                          value={formData.weatherResistance}
                          onChange={(e) => handleInputChange("weatherResistance", e.target.value)}
                          placeholder={stickerTypesTranslations?.createDialog?.form?.weatherResistancePlaceholder || "Waterproof, UV resistant"}
                        />
                      </div>
                      <div>
                        <Label htmlFor="specialFeatures">{stickerTypesTranslations?.createDialog?.form?.specialFeatures || "Special Features"}</Label>
                        <Input
                          id="specialFeatures"
                          value={formData.specialFeatures}
                          onChange={(e) => handleInputChange("specialFeatures", e.target.value)}
                          placeholder={stickerTypesTranslations?.createDialog?.form?.specialFeaturesPlaceholder || "Custom colors available"}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      {stickerTypesTranslations?.createDialog?.buttons?.cancel || "Cancel"}
                    </Button>
                    <Button onClick={handleCreate} className="bg-[#547455] hover:bg-[#243b31]">
                      {stickerTypesTranslations?.createDialog?.buttons?.create || "Create"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-[#547455]" />
                  {stickerTypesTranslations?.table?.title?.replace('{count}', filteredTypes.length.toString()) || `Sticker Types (${filteredTypes.length})`}
                </CardTitle>
                <CardDescription>
                  {stickerTypesTranslations?.table?.description || "Manage all available sticker types"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#547455] mx-auto"></div>
                    <p className="mt-2 text-gray-600">{stickerTypesTranslations?.loading?.message || "Loading sticker types..."}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{stickerTypesTranslations?.table?.headers?.name || "Name"}</TableHead>
                          <TableHead>{stickerTypesTranslations?.table?.headers?.displayName || "Display Name"}</TableHead>
                          <TableHead>{stickerTypesTranslations?.table?.headers?.description || "Description"}</TableHead>
                          <TableHead>{stickerTypesTranslations?.table?.headers?.status || "Status"}</TableHead>
                          <TableHead>{stickerTypesTranslations?.table?.headers?.actions || "Actions"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTypes.map((type) => (
                          <TableRow key={type._id}>
                            <TableCell className="font-medium">{type.name}</TableCell>
                            <TableCell>{type.displayName}</TableCell>
                            <TableCell className="max-w-xs truncate">{type.description}</TableCell>
                            <TableCell>
                              <Badge variant={type.isActive ? "default" : "secondary"}>
                                {type.isActive 
                                  ? (stickerTypesTranslations?.table?.status?.active || "Active")
                                  : (stickerTypesTranslations?.table?.status?.inactive || "Inactive")
                                }
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(type)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleStatus(type._id)}
                                  disabled={updating === type._id}
                                >
                                  {updating === type._id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#547455]"></div>
                                  ) : type.isActive ? (
                                    <ToggleRight className="h-4 w-4" />
                                  ) : (
                                    <ToggleLeft className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(type._id)}
                                  disabled={updating === type._id}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
              setIsEditDialogOpen(open);
              if (!open) {
                setEditingType(null);
                resetForm();
              }
            }}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{stickerTypesTranslations?.editDialog?.title || "Edit Sticker Type"}</DialogTitle>
                  <DialogDescription>
                    {stickerTypesTranslations?.editDialog?.description || "Update the sticker type details and specifications."}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-name">{stickerTypesTranslations?.createDialog?.form?.name || "Name"}</Label>
                      <Input
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder={stickerTypesTranslations?.createDialog?.form?.namePlaceholder || "vinyl"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-displayName">{stickerTypesTranslations?.createDialog?.form?.displayName || "Display Name"}</Label>
                      <Input
                        id="edit-displayName"
                        value={formData.displayName}
                        onChange={(e) => handleInputChange("displayName", e.target.value)}
                        placeholder={stickerTypesTranslations?.createDialog?.form?.displayNamePlaceholder || "Vinyl"}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="edit-description">{stickerTypesTranslations?.createDialog?.form?.description || "Description"}</Label>
                    <Textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder={stickerTypesTranslations?.createDialog?.form?.descriptionPlaceholder || "High-quality vinyl material..."}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-material">{stickerTypesTranslations?.createDialog?.form?.material || "Material"}</Label>
                      <Input
                        id="edit-material"
                        value={formData.material}
                        onChange={(e) => handleInputChange("material", e.target.value)}
                        placeholder={stickerTypesTranslations?.createDialog?.form?.materialPlaceholder || "Premium Vinyl"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-durability">{stickerTypesTranslations?.createDialog?.form?.durability || "Durability"}</Label>
                      <Input
                        id="edit-durability"
                        value={formData.durability}
                        onChange={(e) => handleInputChange("durability", e.target.value)}
                        placeholder={stickerTypesTranslations?.createDialog?.form?.durabilityPlaceholder || "2-3 years outdoor"}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-weatherResistance">{stickerTypesTranslations?.createDialog?.form?.weatherResistance || "Weather Resistance"}</Label>
                      <Input
                        id="edit-weatherResistance"
                        value={formData.weatherResistance}
                        onChange={(e) => handleInputChange("weatherResistance", e.target.value)}
                        placeholder={stickerTypesTranslations?.createDialog?.form?.weatherResistancePlaceholder || "Waterproof, UV resistant"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-specialFeatures">{stickerTypesTranslations?.createDialog?.form?.specialFeatures || "Special Features"}</Label>
                      <Input
                        id="edit-specialFeatures"
                        value={formData.specialFeatures}
                        onChange={(e) => handleInputChange("specialFeatures", e.target.value)}
                        placeholder={stickerTypesTranslations?.createDialog?.form?.specialFeaturesPlaceholder || "Custom colors available"}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    {stickerTypesTranslations?.editDialog?.buttons?.cancel || "Cancel"}
                  </Button>
                  <Button onClick={handleUpdate} className="bg-[#547455] hover:bg-[#243b31]">
                    {stickerTypesTranslations?.editDialog?.buttons?.update || "Update"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </div>
    </IsAdminAuth>
  );
}

export default AdminStickerTypesPage;
