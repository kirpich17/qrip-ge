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

interface StickerOption {
  _id: string;
  name: string;
  description: string;
  type: string;
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
  
  const [loading, setLoading] = useState(true);
  const [stickerOptions, setStickerOptions] = useState<StickerOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<StickerOption | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

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

  useEffect(() => {
    fetchStickerOptions();
  }, [searchQuery]);

  const fetchStickerOptions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await axiosInstance.get(`/api/admin/sticker-options?${params}`);
      setStickerOptions(response.data.data);
    } catch (error) {
      console.error("Error fetching sticker options:", error);
      toast.error("Failed to load sticker options");
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
      toast.success("Sticker option created successfully");
      setIsCreateDialogOpen(false);
      resetForm();
      fetchStickerOptions();
    } catch (error: any) {
      console.error("Error creating sticker option:", error);
      toast.error(error.response?.data?.message || "Failed to create sticker option");
    }
  };

  const handleEdit = (option: StickerOption) => {
    setEditingOption(option);
    setFormData({
      name: option.name,
      description: option.description,
      type: option.type,
      size: option.size,
      price: option.price.toString(),
      stock: option.stock.toString(),
      material: option.specifications.material,
      dimensions: option.specifications.dimensions,
      durability: option.specifications.durability,
      weatherResistance: option.specifications.weatherResistance,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingOption) return;

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
      toast.success("Sticker option updated successfully");
      setIsEditDialogOpen(false);
      setEditingOption(null);
      resetForm();
      fetchStickerOptions();
    } catch (error: any) {
      console.error("Error updating sticker option:", error);
      toast.error(error.response?.data?.message || "Failed to update sticker option");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sticker option?")) return;

    try {
      await axiosInstance.delete(`/api/admin/sticker-options/${id}`);
      toast.success("Sticker option deleted successfully");
      fetchStickerOptions();
    } catch (error: any) {
      console.error("Error deleting sticker option:", error);
      toast.error(error.response?.data?.message || "Failed to delete sticker option");
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      setUpdating(id);
      await axiosInstance.patch(`/api/admin/sticker-options/${id}/toggle`);
      toast.success("Status updated successfully");
      fetchStickerOptions();
    } catch (error: any) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (loading && stickerOptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#547455] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sticker options...</p>
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
              Back to Admin Dashboard
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
                QR Sticker Options
              </h1>
              <p className="text-gray-600">
                Manage available QR sticker types and pricing
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#547455] hover:bg-[#243b31]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Sticker Option
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Sticker Option</DialogTitle>
                  <DialogDescription>
                    Add a new QR sticker option with pricing and specifications.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Standard Vinyl QR Sticker"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vinyl">Vinyl</SelectItem>
                          {/* <SelectItem value="engraving">Engraving</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="High-quality vinyl QR code sticker..."
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="size">Size</Label>
                      <Input
                        id="size"
                        value={formData.size}
                        onChange={(e) => handleInputChange("size", e.target.value)}
                        placeholder="3x3 inches"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="9.99"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleInputChange("stock", e.target.value)}
                        placeholder="100"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        value={formData.material}
                        onChange={(e) => handleInputChange("material", e.target.value)}
                        placeholder="Premium Vinyl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dimensions">Dimensions</Label>
                      <Input
                        id="dimensions"
                        value={formData.dimensions}
                        onChange={(e) => handleInputChange("dimensions", e.target.value)}
                        placeholder='3" x 3" (76mm x 76mm)'
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="durability">Durability</Label>
                      <Input
                        id="durability"
                        value={formData.durability}
                        onChange={(e) => handleInputChange("durability", e.target.value)}
                        placeholder="2-3 years outdoor"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weatherResistance">Weather Resistance</Label>
                      <Input
                        id="weatherResistance"
                        value={formData.weatherResistance}
                        onChange={(e) => handleInputChange("weatherResistance", e.target.value)}
                        placeholder="Waterproof, UV resistant"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} className="bg-[#547455] hover:bg-[#243b31]">
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search sticker options..."
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
            <CardTitle>Sticker Options ({stickerOptions.length})</CardTitle>
            <CardDescription>
              Manage all available QR sticker options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stickerOptions.map((option) => (
                    <TableRow key={option._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{option.name}</p>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{option.type}</Badge>
                      </TableCell>
                      <TableCell>{option.size}</TableCell>
                      <TableCell className="font-semibold">${option.price}</TableCell>
                      <TableCell>
                        <span className={option.stock > 10 ? "text-green-600" : option.stock > 0 ? "text-yellow-600" : "text-red-600"}>
                          {option.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge className={option.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {option.isActive ? "Active" : "Inactive"}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Sticker Option</DialogTitle>
              <DialogDescription>
                Update the sticker option details and specifications.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Standard Vinyl QR Sticker"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vinyl">Vinyl</SelectItem>
                      <SelectItem value="engraving">Engraving</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="High-quality vinyl QR code sticker..."
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-size">Size</Label>
                  <Input
                    id="edit-size"
                    value={formData.size}
                    onChange={(e) => handleInputChange("size", e.target.value)}
                    placeholder="3x3 inches"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="9.99"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-stock">Stock</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-material">Material</Label>
                  <Input
                    id="edit-material"
                    value={formData.material}
                    onChange={(e) => handleInputChange("material", e.target.value)}
                    placeholder="Premium Vinyl"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-dimensions">Dimensions</Label>
                  <Input
                    id="edit-dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleInputChange("dimensions", e.target.value)}
                    placeholder='3" x 3" (76mm x 76mm)'
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-durability">Durability</Label>
                  <Input
                    id="edit-durability"
                    value={formData.durability}
                    onChange={(e) => handleInputChange("durability", e.target.value)}
                    placeholder="2-3 years outdoor"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-weatherResistance">Weather Resistance</Label>
                  <Input
                    id="edit-weatherResistance"
                    value={formData.weatherResistance}
                    onChange={(e) => handleInputChange("weatherResistance", e.target.value)}
                    placeholder="Waterproof, UV resistant"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-[#547455] hover:bg-[#243b31]">
                Update
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
