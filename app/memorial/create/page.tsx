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
  X,
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
import axiosInstance from "@/services/axiosInstance";
import { ADD_MEMORIAL } from "@/services/apiEndPoint";

interface CreateMemorialTranslations {
  header: {
    back: string;
    preview: string;
    save: string;
  };
  title: string;
  subtitle: string;
  tabs: {
    basic: string;
    media: string;
    family: string;
    settings: string;
  };
  basicInfo: {
    title: string;
    description: string;
    uploadPhoto: string;
    photoDescription: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    deathDate: string;
    epitaph: string;
    location: string;
    biography: string;
    biographyPlaceholder: string;
  };
  media: {
    title: string;
    description: string;
    photos: {
      title: string;
      description: string;
      button: string;
    };
    videos: {
      title: string;
      description: string;
      button: string;
    };
    documents: {
      title: string;
      description: string;
      button: string;
    };
  };
  familyTree: {
    title: string;
    description: string;
    placeholder: {
      name: string;
      relationship: string;
      button: string;
    };
    members: {
      title: string;
      description: string;
    };
  };
  settings: {
    title: string;
    description: string;
    publicMemorial: {
      label: string;
      description: string;
    };
    allowComments: {
      label: string;
      description: string;
    };
    emailNotifications: {
      label: string;
      description: string;
    };
  };
}

interface VideoItem {
  title: string;
  file: File;
}

interface DocumentItem {
  fileName: string;
  file: File;
}

interface FamilyMember {
  name: string;
  relationship: string;
}


export default function CreateMemorialPage() {
  const { t } = useTranslation();
  const createMemorialTranslations = t("createMemorial") as CreateMemorialTranslations;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    biography: "",
    epitaph: "",
    location: "",
    isPublic: true,
    status: "active",
    profileImage: null as File | null,
  });

  const [mediaFiles, setMediaFiles] = useState({
    photos: [] as File[],
    videos: [] as VideoItem[],
    documents: [] as DocumentItem[],
    familyTree: [] as FamilyMember[],
  });

  const [newFamilyMember, setNewFamilyMember] = useState<FamilyMember>({
    name: "",
    relationship: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getYesterdayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // subtract 1 day
    return today.toISOString().split('T')[0];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleInputChange("profileImage", e.target.files[0]);
    }
  };

  const handlePhotosUpload = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files);
    setMediaFiles(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const handleVideosUpload = (files: FileList | null) => {
    if (!files) return;
    const newVideos = Array.from(files).map(file => ({
      title: file.name.split('.')[0],
      file
    }));
    setMediaFiles(prev => ({
      ...prev,
      videos: [...prev.videos, ...newVideos]
    }));
  };

  const handleDocumentsUpload = (files: FileList | null) => {
    if (!files) return;
    const newDocuments = Array.from(files).map(file => ({
      fileName: file.name,
      file
    }));
    setMediaFiles(prev => ({
      ...prev,
      documents: [...prev.documents, ...newDocuments]
    }));
  };

  const handleAddFamilyMember = () => {
    if (newFamilyMember.name && newFamilyMember.relationship) {
      setMediaFiles(prev => ({
        ...prev,
        familyTree: [...prev.familyTree, newFamilyMember]
      }));
      setNewFamilyMember({ name: "", relationship: "" });
    }
  };

  
  const removeFamilyMember = (index: number) => {
    setMediaFiles(prev => ({
      ...prev,
      familyTree: prev.familyTree.filter((_, i) => i !== index)
    }));
  };

  const removePhoto = (index: number) => {
    setMediaFiles(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const removeVideo = (index: number) => {
    setMediaFiles(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const removeDocument = (index: number) => {
    setMediaFiles(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();
    // Append basic info
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("birthDate", formData.birthDate);
    formDataToSend.append("deathDate", formData.deathDate);
    formDataToSend.append("biography", formData.biography);
    formDataToSend.append("epitaph", formData.epitaph);
    formDataToSend.append("isPublic", String(formData.isPublic));
    formDataToSend.append("status", formData.status);
    // Append profile image if exists
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }
    // Append photos
    mediaFiles.photos.forEach((photo) => {
      formDataToSend.append("photoGallery", photo);
    });
    // Append videos
    mediaFiles.videos.forEach((video) => {
      formDataToSend.append("videoGallery", video.file);
    });
    // Append documents
    mediaFiles.documents.forEach((doc) => {
      formDataToSend.append("documents", doc.file);
    });

    mediaFiles.familyTree.forEach((member, index) => {
      formDataToSend.append(`familyTree[${index}][name]`, member.name);
      formDataToSend.append(`familyTree[${index}][relationship]`, member.relationship);
  
    });

    return formDataToSend;
  };

  const handleSaveMemorial = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      const formDataToSend = prepareFormData();
      // Log the form data for debugging
      for (const [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
      const response = await axiosInstance.post(ADD_MEMORIAL, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("Memorial created:", response.data);
      alert("Memorial created successfully!");
    } catch (error) {
      console.error("Error creating memorial:", error);
      alert("Failed to create memorial. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#243b31] py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
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
                  alert("Preview functionality - would show memorial preview");
                }}
              >
                <Eye className="h-4 w-4" />
                {createMemorialTranslations.header.preview}
              </Button>
              <Button
                className="bg-[#547455] hover:bg-white hover:text-[#547455]"
                onClick={handleSaveMemorial}
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">
                {createMemorialTranslations.tabs.basic}
              </TabsTrigger>
              <TabsTrigger value="media">
                {createMemorialTranslations.tabs.media}
              </TabsTrigger>
              <TabsTrigger value="family">
                {createMemorialTranslations.tabs.family}
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
                  <div className="flex items-center md:space-x-6 md:flex-row flex-col md:justify-start justify-center gap-3">
                    <Avatar className="md:h-24 md:w-24 h-12 w-12">
                      <AvatarImage
                        src={formData.profileImage ?
                          URL.createObjectURL(formData.profileImage) :
                          "/placeholder.svg?height=96&width=96"}
                      />
                      <AvatarFallback className="text-2xl">
                        {formData.firstName[0]}
                        {formData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex md:justify-start justify-center flex-col">
                      <label htmlFor="profileImageUpload">
                        <Button
                          variant="outline"
                          className="mb-2 bg-transparent cursor-pointer"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {createMemorialTranslations.basicInfo.uploadPhoto}
                        </Button>
                      </label>
                      <input
                        id="profileImageUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <p className="text-sm text-gray-500 md:text-left text-center">
                        {createMemorialTranslations.basicInfo.photoDescription}
                      </p>
                    </div>
                  </div>

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
                        max={getYesterdayDate()}
                        type="date"
                        value={formData.deathDate}
                        onChange={(e) =>
                          handleInputChange("deathDate", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="epitaph">
                      {createMemorialTranslations.basicInfo.epitaph}
                    </Label>
                    <Input
                      id="epitaph"
                      placeholder="Short memorial phrase"
                      value={formData.epitaph}
                      onChange={(e) =>
                        handleInputChange("epitaph", e.target.value)
                      }
                      className="h-12"
                    />
                  </div>

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

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(value) => handleInputChange("isPublic", value)}
                    />
                    <Label htmlFor="isPublic">
                      {createMemorialTranslations.settings.publicMemorial.label}
                    </Label>
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
                            const input = document.createElement("input");
                            input.type = "file";
                            input.multiple = true;
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              handlePhotosUpload((e.target as HTMLInputElement).files);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {createMemorialTranslations.media.photos.button}
                        </Button>
                        {mediaFiles.photos.length > 0 && (
                          <div className="mt-4 w-full">
                            <p className="text-xs font-medium mb-2">
                              Selected Photos:
                            </p>
                            <div className="space-y-1">
                              {mediaFiles.photos.map((photo, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                  <span className="text-xs truncate">{photo.name}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={() => removePhoto(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                            const input = document.createElement("input");
                            input.type = "file";
                            input.multiple = true;
                            input.accept = "video/*";
                            input.onchange = (e) => {
                              handleVideosUpload((e.target as HTMLInputElement).files);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {createMemorialTranslations.media.videos.button}
                        </Button>
                        {mediaFiles.videos.length > 0 && (
                          <div className="mt-4 w-full">
                            <p className="text-xs font-medium mb-2">
                              Selected Videos:
                            </p>
                            <div className="space-y-1">
                              {mediaFiles.videos.map((video, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                  <span className="text-xs truncate">{video.title}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={() => removeVideo(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                          {createMemorialTranslations.media.documents.description}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.multiple = true;
                            input.accept = ".pdf,.doc,.docx,.txt";
                            input.onchange = (e) => {
                              handleDocumentsUpload((e.target as HTMLInputElement).files);
                            };
                            input.click();
                          }}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {createMemorialTranslations.media.documents.button}
                        </Button>
                        {mediaFiles.documents.length > 0 && (
                          <div className="mt-4 w-full">
                            <p className="text-xs font-medium mb-2">
                              Selected Documents:
                            </p>
                            <div className="space-y-1">
                              {mediaFiles.documents.map((doc, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                  <span className="text-xs truncate">{doc.fileName}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4"
                                    onClick={() => removeDocument(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="familyMemberName">
                          {createMemorialTranslations.familyTree?.placeholder?.name || "Family Member Name"}
                        </Label>
                        <Input
                          id="familyMemberName"
                          placeholder="John Doe"
                          value={newFamilyMember.name}
                          onChange={(e) =>
                            setNewFamilyMember({
                              ...newFamilyMember,
                              name: e.target.value,
                            })
                          }
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="familyMemberRelationship">
                          {createMemorialTranslations.familyTree?.placeholder?.relationship || "Relationship"}
                        </Label>
                        <Input
                          id="familyMemberRelationship"
                          placeholder="Father"
                          value={newFamilyMember.relationship}
                          onChange={(e) =>
                            setNewFamilyMember({
                              ...newFamilyMember,
                              relationship: e.target.value,
                            })
                          }
                          className="h-12"
                        />
                      </div>
                    </div>
                    
                    <Button
                      className="bg-[#547455] hover:bg-[#243b31] text-white"
                      onClick={handleAddFamilyMember}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {createMemorialTranslations.familyTree.placeholder.button}
                    </Button>

                    {mediaFiles.familyTree.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900 mb-4">
                          {createMemorialTranslations.familyTree.placeholder.title}
                        </h3>
                        <div className="space-y-2">
                          {mediaFiles.familyTree.map((member, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-100 p-3 rounded"
                            >
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-sm text-gray-500">
                                  {member.relationship}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeFamilyMember(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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