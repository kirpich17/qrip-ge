"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  Calendar,
  MapPin,
  Users,
  Heart,
  Save,
  Eye,
  ImageIcon,
  Video,
  FileText,
  Trash2,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";

export default function EditMemorialPage({
  params,
}: {
  params: { id: string };
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    biography: "",
    location: "",
    isPublic: true,
    profileImage: null,
  });

  // Load existing memorial data
  useEffect(() => {
    // Mock data loading - in real app, fetch from API
    const mockData = {
      firstName: "John",
      lastName: "Smith",
      birthDate: "1945-03-15",
      deathDate: "2023-12-03",
      biography:
        "Beloved father, grandfather, and community leader who dedicated his life to education.",
      location: "Tbilisi, Georgia",
      isPublic: true,
      profileImage: null,
    };
    setFormData(mockData);
  }, [params.id]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const { t } = useTranslation();
  const editMemorialTranslations = t("editMemorial");
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:underline"
              >
                <ArrowLeft className="h-5 w-5" />
                {editMemorialTranslations.header.back}
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  console.log("Preview memorial with current data:", formData);
                  alert("Preview functionality - would show memorial preview");
                }}
              >
                <Eye className="h-4 w-4" />
                {editMemorialTranslations.header.preview}
              </Button>
              <Button
                className="bg-white text-black border border-white hover hover:bg-transparent hover:text-white"
                onClick={() => {
                  console.log("Save memorial changes:", formData);
                  alert("Memorial updated successfully!");
                }}
              >
                <Save className="h-4 w-4" />
                {editMemorialTranslations.header.save}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (
                    confirm(
                      "Are you sure you want to delete this memorial? This action cannot be undone."
                    )
                  ) {
                    console.log("Delete memorial:", params.id);
                    alert("Memorial deleted successfully!");
                  }
                }}
              >
                <Trash2 className="h-4 w-4 " />
                {editMemorialTranslations.header.delete}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {editMemorialTranslations.title}
            </h1>
            <p className="text-gray-600">
              {editMemorialTranslations.description}
            </p>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">
                {editMemorialTranslations.tabs.basic}
              </TabsTrigger>
              <TabsTrigger value="media">
                {editMemorialTranslations.tabs.media}
              </TabsTrigger>
              <TabsTrigger value="family">
                {editMemorialTranslations.tabs.family}
              </TabsTrigger>
              <TabsTrigger value="settings">
                {editMemorialTranslations.tabs.settings}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    {editMemorialTranslations.basicInfo.title}
                  </CardTitle>
                  <CardDescription>
                    {editMemorialTranslations.basicInfo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center space-x-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-2xl">
                        {formData.firstName[0]}
                        {formData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" className="mb-2 bg-transparent">
                        <Upload className="h-4 w-4 mr-2" />
                        {editMemorialTranslations.basicInfo.profileImage.change}
                      </Button>
                      <p className="text-sm text-gray-500">
                        {
                          editMemorialTranslations.basicInfo.profileImage
                            .description
                        }
                      </p>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {editMemorialTranslations.basicInfo.firstName}
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {editMemorialTranslations.basicInfo.lastName}
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Smith"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Date Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {editMemorialTranslations.basicInfo.birthDate}
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          handleInputChange("birthDate", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deathDate" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {editMemorialTranslations.basicInfo.deathDate}
                      </Label>
                      <Input
                        id="deathDate"
                        type="date"
                        value={formData.deathDate}
                        onChange={(e) =>
                          handleInputChange("deathDate", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {editMemorialTranslations.basicInfo.location}
                    </Label>
                    <Input
                      id="location"
                      placeholder="Tbilisi, Georgia"
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="h-12"
                    />
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <Label htmlFor="biography">
                      {editMemorialTranslations.basicInfo.biography}
                    </Label>
                    <Textarea
                      id="biography"
                      placeholder="Share the beautiful story of your loved one's life..."
                      value={formData.biography}
                      onChange={(e) =>
                        handleInputChange("biography", e.target.value)
                      }
                      className="min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
                    {editMemorialTranslations.media.title}
                  </CardTitle>
                  <CardDescription>
                    {editMemorialTranslations.media.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Photo Upload */}
                    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {editMemorialTranslations.media.photos.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {editMemorialTranslations.media.photos.description}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("Manage photos");
                            alert("Photo management interface would open here");
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {editMemorialTranslations.media.photos.button}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Video Upload */}
                    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <Video className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {editMemorialTranslations.media.videos.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {editMemorialTranslations.media.videos.description}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("Manage videos");
                            alert("Video management interface would open here");
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {editMemorialTranslations.media.videos.button}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {editMemorialTranslations.media.documents.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {editMemorialTranslations.media.documents.description}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("Manage documents");
                            alert(
                              "Document management interface would open here"
                            );
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {editMemorialTranslations.media.documents.button}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-500" />
                    {editMemorialTranslations.familyTree.title}
                  </CardTitle>
                  <CardDescription>
                    {editMemorialTranslations.familyTree.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {editMemorialTranslations.familyTree.placeholder.title}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {
                        editMemorialTranslations.familyTree.placeholder
                          .description
                      }
                    </p>
                    <Button
                      className="bg-[#547455] hover:bg-white hover:text-[#547455] border border-[#547455]"
                      onClick={() => {
                        console.log("Edit family tree");
                        alert("Family Tree Editor - Coming Soon!");
                      }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {editMemorialTranslations.familyTree.placeholder.button}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editMemorialTranslations.settings.title}
                  </CardTitle>
                  <CardDescription>
                    {editMemorialTranslations.settings.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        {editMemorialTranslations.settings.publicMemorial.label}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {
                          editMemorialTranslations.settings.publicMemorial
                            .description
                        }
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(checked) =>
                        handleInputChange("isPublic", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        {editMemorialTranslations.settings.allowComments.label}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {
                          editMemorialTranslations.settings.allowComments
                            .description
                        }
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        {
                          editMemorialTranslations.settings.emailNotifications
                            .label
                        }
                      </Label>
                      <p className="text-sm text-gray-500">
                        {
                          editMemorialTranslations.settings.emailNotifications
                            .description
                        }
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
