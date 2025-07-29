"use client";

import { useEffect, useState } from "react";
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
  AlertCircle,
  Lock,
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
import { getUserDetails } from "@/services/userService";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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

interface UserDetails {
  id: string;
  firstname: string;
  email: string;
  subscriptionPlan: "Free" | "Plus" | "Premium";
}




export default function CreateMemorialPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { toast } = useToast();
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
    gps: {
      lat: null as number | null,
      lng: null as number | null
    }
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

  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userSubscription, setUserSubscription] = useState<"Free" | "Plus" | "Premium">("Free");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<string>("");


  const addAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements(prev => [...prev, newAchievement.trim()]);
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements(prev => prev.filter((_, i) => i !== index));
  };

  const updateAchievement = (index: number, value: string) => {
    setAchievements(prev => prev.map((item, i) =>
      i === index ? value : item
    ));
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();
        setUserDetails(userData.user);
        setUserSubscription(userData.user.subscriptionPlan);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast({
          title: "Error",
          description: "Could not fetch user subscription details",
          variant: "destructive",
        });
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchUserData();
  }, [toast]);

  // Subscription check functions
  const canUploadMedia = () => userSubscription !== "Free";
  const canUploadDocuments = () => userSubscription === "Premium";
  const canAddFamilyMembers = () => userSubscription !== "Free";

  const showUpgradeToast = (requiredPlan: "Plus" | "Premium" = "Plus") => {
    toast({
      title: "Upgrade Required",
      description: `This feature requires a ${requiredPlan} subscription.`,
      variant: "destructive",
      action: (
        <Link href="/pricing">
          <Button variant="outline" size="sm">
            Upgrade Now
          </Button>
        </Link>
      ),
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getYesterdayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split('T')[0];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleInputChange("profileImage", e.target.files[0]);
    }
  };

  const handlePhotosUpload = (files: FileList | null) => {
    if (!files) return;

    if (!canUploadMedia()) {
      showUpgradeToast();
      return;
    }

    const newPhotos = Array.from(files);
    setMediaFiles(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const handleVideosUpload = (files: FileList | null) => {
    if (!files) return;

    if (!canUploadMedia()) {
      showUpgradeToast();
      return;
    }

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

    if (!canUploadDocuments()) {
      showUpgradeToast("Premium");
      return;
    }

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
    if (!canAddFamilyMembers()) {
      showUpgradeToast();
      return;
    }

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
    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("birthDate", formData.birthDate);
    formDataToSend.append("deathDate", formData.deathDate);
    formDataToSend.append("biography", formData.biography);
    formDataToSend.append("epitaph", formData.epitaph);
    formDataToSend.append("isPublic", String(formData.isPublic));
    formDataToSend.append("status", formData.status);
    formDataToSend.append("location", formData.location)

    if (formData.gps?.lat && formData.gps?.lng) {
      formDataToSend.append('gps[lat]', formData.gps.lat.toString());
      formDataToSend.append('gps[lng]', formData.gps.lng.toString());
    }

    achievements.forEach((achievement, index) => {
      formDataToSend.append(`achievements[${index}]`, achievement);
    });

    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }
    mediaFiles.photos.forEach((photo) => {
      formDataToSend.append("photoGallery", photo);
    });

    mediaFiles.videos.forEach((video) => {
      formDataToSend.append("videoGallery", video.file);
    });

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
      const response = await axiosInstance.post(ADD_MEMORIAL, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      console.log("Memorial created:", response.data);
      toast({
        title: "Success",
        description: "Memorial created successfully!",
        variant: "default",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating memorial:", error);
      toast({
        title: "Error",
        description: "Failed to create memorial. Please try again.",
        variant: "destructive",
      });
    }
  };

  const SubscriptionRestricted = ({ requiredPlan = "Plus" }: { requiredPlan?: "Plus" | "Premium" }) => (
    <div className="bg-gray-50 rounded-lg p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
        <Lock className="h-6 w-6 text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {requiredPlan === "Premium" ? "Premium Feature" : "Upgrade Required"}
      </h3>
      <p className="text-gray-500 mb-4">
        {requiredPlan === "Premium"
          ? "This feature is only available with a Premium subscription."
          : "Upgrade to Plus or Premium to access this feature."}
      </p>
      <Link href="/subscription">
        <Button className="bg-[#547455] hover:bg-[#243b31]">
          Upgrade to {requiredPlan}
        </Button>
      </Link>
    </div>
  );

  if (loadingSubscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#547455] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your subscription details...</p>
        </div>
      </div>
    );
  }

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
                <ArrowLeft className="h-5 w-5" />
                {createMemorialTranslations.header.back}
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                className="bg-[#547455] hover:bg-white hover:text-[#547455]"
                onClick={handleSaveMemorial}
              >
                <Save className="h-4 w-4" />
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
              <TabsTrigger
                value="media"
                disabled={userSubscription === "Free"}
              >
                {createMemorialTranslations.tabs.media}
                {userSubscription === "Free" && (
                  <span className="ml-1 text-xs text-yellow-600">(Upgrade)</span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="family"
                disabled={userSubscription === "Free"}
              >
                {createMemorialTranslations.tabs.family}
                {userSubscription === "Free" && (
                  <span className="ml-1 text-xs text-yellow-600">(Upgrade)</span>
                )}
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
                        placeholder={createMemorialTranslations.basicInfo.firstName}
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {createMemorialTranslations.basicInfo.lastName}
                      </Label>
                      <Input
                        id="lastName"
                        placeholder={createMemorialTranslations.basicInfo.lastName}
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
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
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
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
                        onChange={(e) => handleInputChange("deathDate", e.target.value)}
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
                      onChange={(e) => handleInputChange("epitaph", e.target.value)}
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
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biography">
                      {createMemorialTranslations.basicInfo.biography}
                    </Label>
                    <Textarea
                      id="biography"
                      placeholder={createMemorialTranslations.basicInfo.biographyPlaceholder}
                      value={formData.biography}
                      onChange={(e) => handleInputChange("biography", e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Achievements</Label>
                    <p className="text-sm text-gray-500">
                      Add notable achievements or awards (e.g., "Nobel Prize", "Olympic Gold Medal")
                    </p>

                    {/* Add new achievement input */}
                    <div className="flex gap-2">
                      <Input
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        placeholder="e.g. Nobel Prize in Physics"
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addAchievement}
                        disabled={!newAchievement.trim()}
                      >
                        Add
                      </Button>
                    </div>

                    {/* List of achievements */}
                    {achievements.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <Input
                              value={achievement}
                              onChange={(e) => updateAchievement(index, e.target.value)}
                              className="flex-1 border-none focus-visible:ring-0"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAchievement(index)}
                              className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude" className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Latitude
                      </Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        placeholder="e.g. 41.7151"
                        value={formData.gps?.lat ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            gps: {
                              ...prev.gps,
                              lat: value ? parseFloat(value) : null
                            }
                          }));
                        }}
                        className="h-12"
                        min="-90"
                        max="90"
                      />
                      {formData.gps?.lat && (formData.gps.lat < -90 || formData.gps.lat > 90) && (
                        <p className="text-sm text-red-500">Latitude must be between -90 and 90</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude" className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Longitude
                      </Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        placeholder="e.g. 44.8271"
                        value={formData.gps?.lng ?? ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            gps: {
                              ...prev.gps,
                              lng: value ? parseFloat(value) : null
                            }
                          }));
                        }}
                        className="h-12"
                        min="-180"
                        max="180"
                      />
                      {formData.gps?.lng && (formData.gps.lng < -180 || formData.gps.lng > 180) && (
                        <p className="text-sm text-red-500">Longitude must be between -180 and 180</p>
                      )}
                    </div>
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
              {userSubscription === "Free" ? (
                <SubscriptionRestricted />
              ) : (
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

                      {/* Documents - Premium only */}

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
              )}
            </TabsContent>

            <TabsContent value="family" className="space-y-6">
              {userSubscription === "Free" ? (
                <SubscriptionRestricted />
              ) : (
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
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}