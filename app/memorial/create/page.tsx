"use client";

import { useState } from "react";
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

export default function CreateMemorialPage() {
  const { t } = useTranslation();
  const createMemorialTranslations = t("createMemorial");
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

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between  flex-wrap gap-3">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:underline gap-2 text-base"
              >
                <ArrowLeft className="h-5 w-5 " />
                {createMemorialTranslations.header.back}
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  console.log("Preview memorial with current data:", formData);
                  // Handle preview logic - could open modal or navigate to preview
                  alert("Preview functionality - would show memorial preview");
                }}
              >
                <Eye className="h-4 w-4" />
                {createMemorialTranslations.header.preview}
              </Button>
              <Button
                className="bg-[#547455] hover:bg-white hover:text-[#547455]"
                onClick={() => {
                  console.log("Save memorial:", formData);
                  // Handle save logic
                  alert("Memorial saved successfully!");
                }}
              >
                <Save className="h-4 w-4 " />
                {createMemorialTranslations.header.save}
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
            <h1 className="md:text-3xl text-2xl font-bold text-gray-900 mb-2">
              {createMemorialTranslations.title}
            </h1>
            <p className="text-gray-600 text-base">
              {createMemorialTranslations.subtitle}
            </p>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">
                {createMemorialTranslations.tabs.basic}
              </TabsTrigger>
              <TabsTrigger value="media">
                {createMemorialTranslations.tabs.media}
              </TabsTrigger>
              <TabsTrigger value="family">
                {createMemorialTranslations.tabs.family}
              </TabsTrigger>
              <TabsTrigger value="settings">
                {createMemorialTranslations.tabs.settings}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-[#547455]" />
                    {createMemorialTranslations.basicInfo.title}
                  </CardTitle>
                  <CardDescription>
                    {createMemorialTranslations.basicInfo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center md:space-x-6 md:flex-row flex-col md:justify-start justify-center gap-3">
                    <Avatar className="md:h-24 md:w-24 h-12 w-12">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-2xl">
                        {formData.firstName[0]}
                        {formData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex md:justify-start justify-center flex-col">
                      <Button
                        variant="outline"
                        className="mb-2 bg-transparent "
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {createMemorialTranslations.basicInfo.uploadPhoto}
                      </Button>
                      <p className="text-sm text-gray-500 md:text-left text-center">
                        {createMemorialTranslations.basicInfo.photoDescription}
                      </p>
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {createMemorialTranslations.basicInfo.firstName}
                      </Label>
                      <Input
                        id="firstName"
                        placeholder={
                          createMemorialTranslations.basicInfo.firstName
                        }
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {createMemorialTranslations.basicInfo.lastName}
                      </Label>
                      <Input
                        id="lastName"
                        placeholder={
                          createMemorialTranslations.basicInfo.lastName
                        }
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
                        {createMemorialTranslations.basicInfo.birthDate}
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
                        {createMemorialTranslations.basicInfo.deathDate}
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
                      {createMemorialTranslations.basicInfo.location}
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
                      {createMemorialTranslations.basicInfo.biography}
                    </Label>
                    <Textarea
                      id="biography"
                      placeholder={
                        createMemorialTranslations.basicInfo
                          .biographyPlaceholder
                      }
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
                    {createMemorialTranslations.media.title}
                  </CardTitle>
                  <CardDescription>
                    {createMemorialTranslations.media.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Photo Upload */}
                    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {createMemorialTranslations.media.photos.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {createMemorialTranslations.media.photos.description}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("Upload photos");
                            // Handle photo upload
                            const input = document.createElement("input");
                            input.type = "file";
                            input.multiple = true;
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement)
                                .files;
                              console.log("Selected photos:", files);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {createMemorialTranslations.media.photos.button}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Video Upload */}
                    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <Video className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {createMemorialTranslations.media.videos.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {createMemorialTranslations.media.videos.description}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("Upload videos");
                            // Handle video upload
                            const input = document.createElement("input");
                            input.type = "file";
                            input.multiple = true;
                            input.accept = "video/*";
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement)
                                .files;
                              console.log("Selected videos:", files);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {createMemorialTranslations.media.videos.button}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {createMemorialTranslations.media.documents.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {
                            createMemorialTranslations.media.documents
                              .description
                          }
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            console.log("Upload documents");
                            // Handle document upload
                            const input = document.createElement("input");
                            input.type = "file";
                            input.multiple = true;
                            input.accept = ".pdf,.doc,.docx,.txt";
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement)
                                .files;
                              console.log("Selected documents:", files);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {createMemorialTranslations.media.documents.button}
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
                    {createMemorialTranslations.familyTree.title}
                  </CardTitle>
                  <CardDescription>
                    {createMemorialTranslations.familyTree.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {createMemorialTranslations.familyTree.placeholder.title}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {
                        createMemorialTranslations.familyTree.placeholder
                          .description
                      }
                    </p>
                    <Button
                      className="bg-[#547455] hover:bg-[#243b31] text-white"
                      onClick={() => {
                        console.log("Start building family tree");
                        // Handle family tree builder
                        alert("Family Tree Builder - Coming Soon!");
                      }}
                    >
                      <Users className="h-4 w-4" />
                      {createMemorialTranslations.familyTree.placeholder.button}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {createMemorialTranslations.settings.title}
                  </CardTitle>
                  <CardDescription>
                    {createMemorialTranslations.settings.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">
                        {
                          createMemorialTranslations.settings.publicMemorial
                            .label
                        }
                      </Label>
                      <p className="text-sm text-gray-500">
                        {
                          createMemorialTranslations.settings.publicMemorial
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
                        {
                          createMemorialTranslations.settings.allowComments
                            .label
                        }
                      </Label>
                      <p className="text-sm text-gray-500">
                        {
                          createMemorialTranslations.settings.allowComments
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
                          createMemorialTranslations.settings.emailNotifications
                            .label
                        }
                      </Label>
                      <p className="text-sm text-gray-500">
                        {
                          createMemorialTranslations.settings.emailNotifications
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

// "createMemorial": {
//   "header": {
//     "back":
//     "preview":
//     "save":
//   },
//   "title":
//   "subtitle":
//   "tabs": {
//     "basic":
//     "media":
//     "family":
//     "settings":
//   },
//   "basicInfo": {
//     "title":
//     "description":
//     "uploadPhoto":
//     "photoDescription":
//     "firstName":
//     "lastName":
//     "birthDate":
//     "deathDate":
//     "location":
//     "biography":
//     "biographyPlaceholder":
//   },
//   "media": {
//     "title":
//     "description":
//     "photos": {
//       "title":
//       "description":
//       "button":
//     },
//     "videos": {
//       "title":
//       "description":
//       "button":
//     },
//     "documents": {
//       "title":
//       "description":
//       "button":
//     }
//   },
//   "familyTree": {
//     "title":
//     "description":
//     "placeholder": {
//       "title":
//       "description":
//       "button":
//     }
//   },
//   "settings": {
//     "title":
//     "description":
//     "publicMemorial": {
//       "label":
//       "description":
//     },
//     "allowComments": {
//       "label":
//       "description":
//     },
//     "emailNotifications": {
//       "label":
//       "description":
//     }
//   }
// }
