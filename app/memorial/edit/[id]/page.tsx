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
  X,
  Trash2,
  Lock,
  Loader2,
  Pencil
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
import { getMyMemorialById } from "@/services/memorialService";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/services/axiosInstance";
import { ADD_MEMORIAL } from "@/services/apiEndPoint";
import { getUserDetails } from "@/services/userService";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import LanguageDropdown from "@/components/languageDropdown/page";
import InteractiveMap from "@/components/InteractiveMap";

interface Memorial {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  deathDate: string;
  biography: string;
  location: string;
  isPublic: boolean;
  allowComments: boolean;
  enableEmailNotifications: boolean;
  allowSlideshow: boolean;
  photoGallery: string[];
  videoGallery: string[];
  documents: string[];
  familyTree: any[];
  status: string;
  plan: string;
  planType?: string;
  views: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  gps?: {
    lat: number;
    lng: number;
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

export default function EditMemorialPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState<Memorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newFamilyMember, setNewFamilyMember] = useState<FamilyMember>({
    name: "",
    relationship: "",
  });
  const { t } = useTranslation();
  const editMemorialTranslations = t("editMemorial");
  const [mediaFiles, setMediaFiles] = useState({
    photos: [] as File[],
    videos: [] as VideoItem[],
    documents: [] as DocumentItem[],
    familyTree: [] as FamilyMember[],
  });


  const [selectedProfileImage, setSelectedProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [isEditingFamilyMember, setIsEditingFamilyMember] = useState<string | null>(null);

  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userSubscription, setUserSubscription] = useState<"Free" | "Plus" | "Premium">("Free");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState("");

  const [deletedFiles, setDeletedFiles] = useState({
    photos: [] as string[],
    videos: [] as string[],
    documents: [] as string[]
  });



  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();
        setUserDetails(userData.user);
        setUserSubscription(userData.user.subscriptionPlan);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Could not fetch user subscription details");
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchUserData();
  }, [toast]);

  useEffect(() => {
    if (!params?.id) return;

    const fetchMemorial = async () => {
      try {
        setLoading(true);
        const response = await getMyMemorialById(params.id as string);
        if (response?.status && response.data) {
          const d = response.data;
          setFormData({
            _id: d._id,
            firstName: d.firstName || "",
            lastName: d.lastName && d.lastName.toLowerCase() !== "memorial" && d.lastName.toLowerCase() !== "memorail" ? d.lastName : "",
            birthDate: d.birthDate ? new Date(d.birthDate).toISOString() : "",
            deathDate: d.deathDate ? new Date(d.deathDate).toISOString() : "",
            biography: d.biography || "",
            location: d.location || "",
            isPublic: typeof d.isPublic === 'boolean' ? d.isPublic : true,
            allowComments: typeof d.allowComments === 'boolean' ? d.allowComments : true,
            enableEmailNotifications: typeof d.enableEmailNotifications === 'boolean' ? d.enableEmailNotifications : true,
            allowSlideshow: !!d.allowSlideshow,
            photoGallery: d.photoGallery || [],
            videoGallery: d.videoGallery || [],
            documents: d.documents || [],
            familyTree: d.familyTree || [],
            status: d.status,
            plan: d.plan,
            planType: d.planType,
            views: d.views,
            slug: d.slug,
            createdAt: d.createdAt,
            updatedAt: d.updatedAt,
            gps: d.gps || undefined
          });
          if (d.achievements) {
            setAchievements(response.data.achievements);
          }
          // Set the first photo as profile image preview if available
          setProfileImagePreview(d.profileImage || null);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error("Failed to fetch memorial:", err);
        setError("Failed to load memorial data");
      } finally {
        setLoading(false);
      }
    };

    fetchMemorial();
  }, [params.id]);

  // Auto-reverse geocode when GPS coordinates exist but location is missing or incorrect
  useEffect(() => {
    if (formData?.gps?.lat && formData?.gps?.lng) {
      const hasLocation = formData.location && formData.location.trim() !== '' && formData.location.trim() !== 'Tbilisi, Georgia';
      if (!hasLocation) {
        // Only reverse geocode if location is missing or is the default "Tbilisi, Georgia"
        handleReverseGeocode(formData.gps.lat, formData.gps.lng);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.gps?.lat, formData?.gps?.lng]); // Only run when GPS coordinates change

  const handleInputChange = (field: string, value: any) => {
    if (!formData) return;
    setFormData((prev) => ({ ...prev!, [field]: value }));
  };

  const handleSlideshowToggle = async (allowSlideshow: boolean) => {
    if (!formData) return;

    try {
      // Check if user has active subscription (Medium or Premium)
      if (userSubscription === "Free") {
        toast.error("This feature requires a Medium or Premium subscription.");
        return;
      }

      const response = await axiosInstance.put(
        `/api/memorials/${formData._id}/toggle-slideshow`,
        { allowSlideshow }
      );

      if (response.data.status) {
        setFormData(prev => ({ ...prev!, allowSlideshow }));
        toast.success(`Slideshow ${allowSlideshow ? 'enabled' : 'disabled'} successfully`);
      }
    } catch (error: any) {
      console.error("Error toggling slideshow:", error);
      const errorMessage = error.response?.data?.message || "Failed to update slideshow setting";
      toast.error(errorMessage);
    }
  };

  // Helper function to check if slideshow is allowed based on plan type
  const isSlideshowAllowed = () => {
    if (!formData) return false;
    // Check if user has Medium or Premium plan (hide for minimal plan)
    return formData.planType === 'medium' || formData.planType === 'premium';
  };

  // Helper function to check if slideshow toggle should be shown
  const shouldShowSlideshowToggle = () => {
    if (!formData) return false;
    // Show toggle only for Medium and Premium plans, hide for minimal and free plans
    return formData.planType === 'medium' || formData.planType === 'premium';
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedProfileImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const getYesterdayDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // subtract 1 day
    return today.toISOString().split('T')[0];
  };

  // Function to handle reverse geocoding (GPS coordinates to location string)
  const handleReverseGeocode = async (lat: number, lng: number) => {
    if (!formData) return;
    
    try {
      // Using OpenStreetMap's Nominatim reverse geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error("Reverse geocoding service unavailable");
      }

      const data = await response.json();

      if (data && data.address) {
        // Build location string from address components
        const address = data.address;
        const locationParts = [];
        
        if (address.city || address.town || address.village) {
          locationParts.push(address.city || address.town || address.village);
        }
        if (address.state || address.region) {
          locationParts.push(address.state || address.region);
        }
        if (address.country) {
          locationParts.push(address.country);
        }
        
        const locationString = locationParts.length > 0 
          ? locationParts.join(", ") 
          : data.display_name || "";

        if (locationString) {
          setFormData(prev => ({
            ...prev!,
            location: locationString
          }));
        }
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      // Silently fail - location string will remain empty or user can enter manually
    }
  };

  const removeProfileImage = () => {
    setSelectedProfileImage(null);
    setProfileImagePreview(formData?.photoGallery?.[0] || null);
  };

  const handlePhotosUpload = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files);
    setMediaFiles(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const removePhoto = (index: number) => {
    setMediaFiles(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
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

  const removeVideo = (index: number) => {
    setMediaFiles(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
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

  const removeDocument = (index: number) => {
    setMediaFiles(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Add these to your component
  // For existing photos
  const handleRemoveExistingPhoto = (index: number) => {
    if (!formData) return;

    const photoUrl = formData.photoGallery[index];
    setFormData(prev => ({
      ...prev!,
      photoGallery: prev!.photoGallery.filter((_, i) => i !== index)
    }));
    setDeletedFiles(prev => ({
      ...prev,
      photos: [...prev.photos, photoUrl]
    }));
  };

  // For existing videos
  const handleRemoveExistingVideo = (index: number) => {
    if (!formData) return;

    const videoUrl = formData.videoGallery[index];
    setFormData(prev => ({
      ...prev!,
      videoGallery: prev!.videoGallery.filter((_, i) => i !== index)
    }));
    setDeletedFiles(prev => ({
      ...prev,
      videos: [...prev.videos, videoUrl]
    }));
  };

  // For existing documents
  const handleRemoveExistingDocument = (index: number) => {
    if (!formData) return;

    const docUrl = formData.documents[index];
    setFormData(prev => ({
      ...prev!,
      documents: prev!.documents.filter((_, i) => i !== index)
    }));
    setDeletedFiles(prev => ({
      ...prev,
      documents: [...prev.documents, docUrl]
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

  const handleSubmit = async () => {
    if (!formData) return;

    try {
      setUpdating(true);
      const formDataToSend = new FormData();

      // Append basic fields
      formDataToSend.append('_id', formData._id);
      formDataToSend.append('firstName', formData.firstName);
      if (formData.lastName) formDataToSend.append('lastName', formData.lastName);
      if (formData.birthDate) formDataToSend.append('birthDate', formData.birthDate);
      if (formData.deathDate) formDataToSend.append('deathDate', formData.deathDate);
      if (formData.biography) formDataToSend.append('biography', formData.biography);
      if (formData.location) formDataToSend.append('location', formData.location);
      formDataToSend.append('isPublic', String(formData.isPublic));
      
      // Append GPS coordinates
      if (formData.gps && formData.gps.lat && formData.gps.lng) {
        formDataToSend.append('gps', JSON.stringify(formData.gps));
      }

      // Append achievements
      achievements.forEach((achievement) => {
        formDataToSend.append('achievements', achievement);
      });

      // Append profile image if selected
      if (selectedProfileImage) {
        formDataToSend.append('profileImage', selectedProfileImage);
      }

      // Append new photos
      mediaFiles.photos.forEach((photo) => {
        formDataToSend.append('photoGallery', photo);
      });

      // Append new videos
      mediaFiles.videos.forEach((video) => {
        formDataToSend.append('videoGallery', video.file);
      });

      // Append new documents
      mediaFiles.documents.forEach((doc) => {
        formDataToSend.append('documents', doc.file);
      });

      // Append family tree members
      formData.familyTree.forEach((member, index) => {
        formDataToSend.append(`familyTree[${index}][name]`, member.name);
        formDataToSend.append(`familyTree[${index}][relationship]`, member.relationship);
        if (member._id) {
          formDataToSend.append(`familyTree[${index}][_id]`, member._id);
        }
      });

      // Append deleted files information
      formDataToSend.append('deletedPhotos', JSON.stringify(deletedFiles.photos));
      formDataToSend.append('deletedVideos', JSON.stringify(deletedFiles.videos));
      formDataToSend.append('deletedDocuments', JSON.stringify(deletedFiles.documents));


      const response = await axiosInstance.post(
        `${ADD_MEMORIAL}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      if (response?.status) {
        toast.success("Memorial updated successfully");
        const updatedResponse = await getMyMemorialById(params.id as string);
        if (updatedResponse?.status && updatedResponse.data) {
          setFormData(updatedResponse.data);
          setSelectedProfileImage(null);
          setMediaFiles({
            photos: [],
            videos: [],
            documents: [],
            familyTree: []
          });
          // Reset deleted files tracking
          setDeletedFiles({
            photos: [],
            videos: [],
            documents: []
          });
        }
      } else {
        throw new Error((response as any)?.data?.message || "Failed to update memorial");
      }
    } catch (err: any) {
      console.error("Failed to update memorial:", err);
      if (err.response?.data?.actionCode === "UPGRADE_REQUIRED") {
        Swal.fire({
          icon: 'warning',
          title: 'Upgrade Required',
          text: err.response?.data?.message || "You need to upgrade your plan to use this feature",
          showCancelButton: true,
          confirmButtonText: 'View Plans',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#E53935',
          cancelButtonColor: '#6e7881',
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/dashboard'); // Redirect to pricing page
          }
        });
      }
      else if (err.response?.data?.actionCode === "VIDEO_TOO_LONG") {
        Swal.fire({
          icon: 'error',
          title: 'Video Too Long',
          text: err.response?.data?.message || "Video exceeds the maximum allowed duration of 1 minute",
          confirmButtonText: 'OK',
          confirmButtonColor: '#E53935',
        });
      }

      else {
        // Show generic error for other issues
        toast.error(err instanceof Error ? err.message : "Failed to update memorial");
      }
    }
    finally {
      setUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading memorial data...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Error Loading Memorial
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
              <Link href="/dashboard">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>No memorial data found</div>
      </div>
    );
  }



  const SubscriptionRestricted = ({
    requiredPlan = "Plus",
    currentPlan = "Free"
  }: {
    requiredPlan?: "Plus" | "Premium";
    currentPlan?: "Free" | "Plus" | "Premium";
  }) => {
    // Don't show anything if user already has required plan or higher
    if (
      (currentPlan === "Plus" && requiredPlan === "Plus") ||
      (currentPlan === "Premium") ||
      (currentPlan === "Plus" && requiredPlan === "Premium") // This case is debatable - you might want to still show for Plus users when Premium is required
    ) {
      return null;
    }

    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-4">
          <Lock className="h-6 w-6 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {requiredPlan === "Premium" ? editMemorialTranslations.subscriptionRestricted?.premiumFeature || "Premium Feature" : editMemorialTranslations.subscriptionRestricted?.upgradeRequired || "Upgrade Required"}
        </h3>
        <p className="text-gray-500 mb-4">
          {requiredPlan === "Premium"
            ? editMemorialTranslations.subscriptionRestricted?.premiumDescription || "This feature is only available with a Premium subscription."
            : editMemorialTranslations.subscriptionRestricted?.upgradeDescription || "Upgrade to Plus or Premium to access this feature."}
        </p>
        <Link href="/subscription">
          <Button className="bg-[#547455] hover:bg-[#243b31]">
            {editMemorialTranslations.subscriptionRestricted?.upgradeButton || "Upgrade to"} {requiredPlan}
          </Button>
        </Link>
      </div>
    );
  };

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
      {/* Header */}
      <header className="bg-[#243b31] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 flex-wrap gap-2">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:underline text-xs sm:text-lg gap-1 "
              >
                <ArrowLeft className="h-5 w-5" />
                {editMemorialTranslations.header.back}
              </Link>
            </div>
            <div className="flex gap-3">
              <LanguageDropdown />
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
            <h1 className="md:text-3xl text-xl font-bold text-gray-900 mb-2">
              {editMemorialTranslations.title}
            </h1>
            <p className="text-gray-600">
              {editMemorialTranslations.description}
            </p>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 overflow-x-auto md:w-auto">
              <TabsTrigger value="basic">
                {editMemorialTranslations.tabs.basic}
              </TabsTrigger>
              <TabsTrigger value="media">
                {editMemorialTranslations.tabs.media}
              </TabsTrigger>
              <TabsTrigger value="family">
                {editMemorialTranslations.tabs.family}
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
                  <div className="flex items-center flex-wrap gap-2 md:justify-normal justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={profileImagePreview || "/placeholder.svg"}
                        alt={`${formData.firstName} ${formData.lastName}`}
                      />
                      <AvatarFallback className="text-2xl">
                        {formData.firstName[0]}
                        {formData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="md:w-auto w-full text-center md:text-left">
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="profileImageUpload">
                          <Button
                            variant="outline"
                            className="mb-2 bg-transparent w-full"
                            asChild
                          >
                            <div>
                              <Upload className="h-4 w-4 mr-2" />
                              {editMemorialTranslations.basicInfo.profileImage.change}
                            </div>
                          </Button>
                        </label>
                        <input
                          id="profileImageUpload"
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          className="hidden"
                        />
                        {/* {profileImagePreview && (
                          <Button
                            variant="outline"
                            className="bg-transparent"
                            onClick={removeProfileImage}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Image
                          </Button>
                        )} */}
                      </div>
                      {!profileImagePreview && <p className="text-sm text-gray-500 text-center md:text-left">
                        {
                          editMemorialTranslations.basicInfo.profileImage
                            .description
                        }
                      </p>}
                    </div>
                  </div>

                  {/* Name Fields */}
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {editMemorialTranslations.basicInfo.firstName}
                      </Label>
                      <Input
                        id="firstName"
                        placeholder={editMemorialTranslations.basicInfo.firstName || "John"}
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
                        placeholder={editMemorialTranslations.basicInfo.lastName || "Smith"}
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Date Fields */}
                  <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {editMemorialTranslations.basicInfo.birthDate}
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate ? formData.birthDate.split('T')[0] : ''}
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
                        max={getYesterdayDate()}
                        type="date"
                        value={formData.deathDate ? formData.deathDate.split('T')[0] : ''}
                        onChange={(e) =>
                          handleInputChange("deathDate", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Interactive Map for Precise Location */}
                  <div className="space-y-4">
                    <Label className="flex items-center text-lg font-semibold">
                      <MapPin className="h-5 w-5 mr-2" />
                      {editMemorialTranslations.basicInfo.location?.title || editMemorialTranslations.basicInfo.location} - Set Precise Location
                    </Label>
                    <p className="text-sm text-gray-600">
                      {editMemorialTranslations?.basicInfo?.location?.description || "Click on the map to set the exact GPS coordinates for the memorial location."}
                    </p>
                    <InteractiveMap
                      initialLat={formData.gps?.lat || 41.7151}
                      initialLng={formData.gps?.lng || 44.8271}
                      initialLocation={formData.location || ""}
                      onLocationChange={(lat, lng) => {
                        setFormData(prev => ({
                          ...((prev as Memorial)),
                          gps: { lat, lng }
                        }));
                        // Automatically populate location string from GPS coordinates
                        handleReverseGeocode(lat, lng);
                      }}
                      height="400px"
                      showCoordinateInputs={true}
                      translations={editMemorialTranslations?.basicInfo?.location}
                    />
                  </div>

                  {/* Biography */}
                  <div className="space-y-2">
                    <Label htmlFor="biography">
                      {editMemorialTranslations.basicInfo.biography}
                    </Label>
                    <Textarea
                      id="biography"
                      placeholder={editMemorialTranslations.basicInfo.biographyPlaceholder || "Share the beautiful story of your loved one's life..."}
                      value={formData.biography}
                      onChange={(e) =>
                        handleInputChange("biography", e.target.value)
                      }
                      className="min-h-[120px]"
                    />
                  </div>


                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">{editMemorialTranslations.basicInfo.achievements}</Label>
                    <p className="text-sm text-gray-500">
                      {editMemorialTranslations.basicInfo.awards}
                    </p>

                    {/* Add new achievement */}
                    <div className="flex gap-2">
                      <Input
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        placeholder={editMemorialTranslations.basicInfo.nobelPrice}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (newAchievement.trim()) {
                            setAchievements([...achievements, newAchievement.trim()]);
                            setNewAchievement("");
                          }
                        }}
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
                              onChange={(e) => {
                                const updated = [...achievements];
                                updated[index] = e.target.value;
                                setAchievements(updated);
                              }}
                              className="flex-1 border-none focus-visible:ring-0"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updated = achievements.filter((_, i) => i !== index);
                                setAchievements(updated);
                              }}
                              className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Public Memorial Toggle */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPublic"
                      checked={formData.isPublic}
                      onCheckedChange={(value) => handleInputChange("isPublic", value)}
                    />
                    <Label htmlFor="isPublic">
                      {editMemorialTranslations?.settings?.publicMemorial?.label || "Make memorial public"}
                    </Label>
                  </div>

                  {/* Slideshow Settings - Only show for Medium and Premium plans */}
                  {shouldShowSlideshowToggle() && (
                    <div className="space-y-4">
                      <Label className="text-lg font-semibold flex items-center">
                        <Eye className="h-5 w-5 mr-2" />
                        {editMemorialTranslations?.displaySettings?.title || "Display Settings"}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {editMemorialTranslations?.displaySettings?.description || "Control how your memorial is displayed to visitors"}
                      </p>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <Label htmlFor="slideshow-toggle" className="text-base font-medium">
                            {editMemorialTranslations?.displaySettings?.enableSlideshow || "Enable Photo Slideshow"}
                          </Label>
                          <p className="text-sm text-gray-500">
                            {editMemorialTranslations?.displaySettings?.slideshowDescription || "Allow visitors to see a slideshow of photos instead of a static cover image"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                handleSlideshowToggle(!formData.allowSlideshow);
                              }}
                              className={`
                                relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 cursor-pointer hover:bg-opacity-80
                                ${formData.allowSlideshow 
                                  ? 'bg-green-600' 
                                  : 'bg-gray-200'
                                }
                              `}
                            >
                              <span
                                className={`
                                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                  ${formData.allowSlideshow ? 'translate-x-6' : 'translate-x-1'}
                                `}
                              />
                            </button>
                            <span className="text-sm text-gray-600">
                              {formData.allowSlideshow ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              {userSubscription === "Free" ? (
                <SubscriptionRestricted requiredPlan="Plus" />
              ) : (
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
                            {editMemorialTranslations.media.photos.button}
                          </Button>

                          {/* Show existing and new photos */}
                          {(formData.photoGallery?.length > 0 || mediaFiles.photos.length > 0) && (
                            <div className="mt-4 w-full">
                              {/* Existing photos */}
                              {formData.photoGallery?.map((photoUrl, index) => (
                                <div key={`existing-${index}`} className="flex items-center gap-2">
                                  <img src={photoUrl} alt={`Photo ${index}`} className="h-12 w-12 object-cover" />
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRemoveExistingPhoto(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}

                              {/* New photos */}
                              {mediaFiles.photos.map((photo, index) => (
                                <div key={`new-${index}`} className="flex items-center gap-2">
                                  <span>{photo.name}</span>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removePhoto(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Video Upload */}
                      {/* <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
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
                            {editMemorialTranslations.media.videos.button}
                          </Button>

                        
                          {(formData.videoGallery?.length > 0 || mediaFiles.videos.length > 0) && (
                            <div className="mt-4 w-full">
                            
                              {formData.videoGallery?.length > 0 && (
                                <>
                                  <p className="text-xs font-medium mb-2">Existing Videos</p>
                                  <div className="space-y-1 mb-4">
                                    {formData.videoGallery.map((videoUrl, index) => (
                                      <div key={`existing-video-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <div className="flex items-center gap-2">
                                          <Video className="h-4 w-4 text-gray-500" />
                                          <span className="text-xs truncate flex-1">
                                            {videoUrl.split('/').pop()?.slice(0, 20)}...
                                          </span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-4 w-4"
                                          onClick={() => handleRemoveExistingVideo(index)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                         
                              {mediaFiles.videos.length > 0 && (
                                <>
                                  <p className="text-xs font-medium mb-2">New Videos</p>
                                  <div className="space-y-1">
                                    {mediaFiles.videos.map((video, index) => (
                                      <div key={`new-video-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <span className="text-xs truncate flex-1">{video.title}</span>
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
                                </>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card> */}

                      {/* Video Upload Section */}
                      <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                          <Video className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="font-semibold text-gray-900 mb-2">  {editMemorialTranslations.media.videosCard.videos}</h3>
                          <p className="text-sm text-gray-500 mb-4">{editMemorialTranslations.media.videosCard.upload}</p>

                          <Button
                            variant="outline"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.multiple = true;
                              input.accept = "video/*";
                              input.onchange = (e) => handleVideosUpload((e.target as HTMLInputElement).files);
                              input.click();
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {editMemorialTranslations.media.videosCard.uploadVideo}
                          </Button>

                          {/* Existing Videos */}
                          {formData.videoGallery?.length > 0 && (
                            <div className="mt-4 w-full">
                              <p className="text-xs font-medium mb-2"> {editMemorialTranslations.media.videosCard.existingVideos}</p>
                              <div className="space-y-1 mb-4">
                                {formData.videoGallery.map((videoUrl, index) => (
                                  <div key={`existing-video-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                    <div className="flex items-center gap-2">
                                      <Video className="h-4 w-4 text-gray-500" />
                                      <span className="text-xs truncate flex-1">
                                        {videoUrl.split('/').pop()?.slice(0, 20)}...
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4"
                                      onClick={() => handleRemoveExistingVideo(index)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* New Videos */}
                          {mediaFiles.videos.length > 0 && (
                            <div className="mt-4 w-full">
                              <p className="text-xs font-medium mb-2">{editMemorialTranslations.media.videosCard.newVideos}</p>
                              <div className="space-y-1">
                                {mediaFiles.videos.map((video, index) => (
                                  <div key={`new-video-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                    <span className="text-xs truncate flex-1">{video.title}</span>
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




                      {/* Documents Upload */}
                      {/* <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
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
                            {editMemorialTranslations.media.documents.button}
                          </Button>


                          {(formData.documents?.length > 0 || mediaFiles.documents.length > 0) && (
                            <div className="mt-4 w-full">
                          
                          
                              {formData.documents?.length > 0 && (
                                <>
                                  <p className="text-xs font-medium mb-2">Existing Documents</p>
                                  <div className="space-y-1 mb-4">
                                    {formData.documents.map((docUrl, index) => (
                                      <div key={`existing-doc-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-gray-500" />
                                          <span className="text-xs truncate flex-1">
                                            {docUrl.split('/').pop()?.slice(0, 20)}...
                                          </span>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-4 w-4"
                                          onClick={() => handleRemoveExistingDocument(index)}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}

                     
                     
                              {mediaFiles.documents.length > 0 && (
                                <>
                                  <p className="text-xs font-medium mb-2">New Documents</p>
                                  <div className="space-y-1">
                                    {mediaFiles.documents.map((doc, index) => (
                                      <div key={`new-doc-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                        <span className="text-xs truncate flex-1">{doc.fileName}</span>
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
                                </>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card> */}
                      {/* Document Upload Section */}
                      <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                          <FileText className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="font-semibold text-gray-900 mb-2">{editMemorialTranslations.media.documentCard.document}</h3>
                          <p className="text-sm text-gray-500 mb-4">{editMemorialTranslations.media.documentCard.upload}</p>

                          <Button
                            variant="outline"
                            disabled={userSubscription !== 'Premium'}
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.multiple = true;
                              input.accept = ".pdf,.doc,.docx,.txt";
                              input.onchange = (e) => handleDocumentsUpload((e.target as HTMLInputElement).files);
                              input.click();
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {editMemorialTranslations.media.documentCard.uploadDocument}
                          </Button>

                          {/* Existing Documents */}
                          {formData.documents?.length > 0 && (
                            <div className="mt-4 w-full">
                              <p className="text-xs font-medium mb-2">{editMemorialTranslations.media.documentCard.existingDocument}</p>
                              <div className="space-y-1 mb-4">
                                {formData.documents.map((docUrl, index) => (
                                  <div key={`existing-doc-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      <span className="text-xs truncate flex-1">
                                        {docUrl.split('/').pop()?.slice(0, 20)}...
                                      </span>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4"
                                      onClick={() => handleRemoveExistingDocument(index)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* New Documents */}
                          {mediaFiles.documents.length > 0 && (
                            <div className="mt-4 w-full">
                              <p className="text-xs font-medium mb-2">New Documents</p>
                              <div className="space-y-1">
                                {mediaFiles.documents.map((doc, index) => (
                                  <div key={`new-doc-${index}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                                    <span className="text-xs truncate flex-1">{doc.fileName}</span>
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
                      {editMemorialTranslations.familyTree.title}
                    </CardTitle>
                    <CardDescription>
                      {editMemorialTranslations.familyTree.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="familyMemberName">
                            {editMemorialTranslations.familyTree?.familyMember}
                          </Label>
                          <Input
                            id="familyMemberName"
                            placeholder={editMemorialTranslations.familyTree?.updateFamilyMember
}
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
                            {editMemorialTranslations.familyTree?.relationship}
                          </Label>
                          <Input
                            id="familyMemberRelationship"
                            placeholder={editMemorialTranslations.familyTree?.updateRelationship}
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
                        onClick={() => {
                          if (isEditingFamilyMember) {
                            // Update existing member
                            setFormData(prev => ({
                              ...prev!,
                              familyTree: prev!.familyTree.map(member =>
                                member._id === isEditingFamilyMember ? newFamilyMember : member
                              )
                            }));
                            setIsEditingFamilyMember(null);
                          } else {
                            // Add new member
                            setFormData(prev => ({
                              ...prev!,
                              familyTree: [...prev!.familyTree, {
                                ...newFamilyMember,
                                // _id: `temp-${Date.now()}`
                              }]
                            }));
                          }
                          setNewFamilyMember({ name: "", relationship: "" });
                        }}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        {isEditingFamilyMember
                          ? editMemorialTranslations.familyTree?.updateFamilyMember || "Update Family Member"
                          : editMemorialTranslations.familyTree?.placeholder?.button || "Add Family Member"}
                      </Button>

                      {formData.familyTree?.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-semibold text-gray-900 mb-4">
                            {editMemorialTranslations.familyTree?.placeholder?.title || "Family Members"}
                          </h3>
                          <div className="space-y-2">
                            {formData.familyTree.map((member, index) => (
                              <div
                                key={member._id || index}
                                className="flex items-center justify-between bg-gray-100 p-3 rounded"
                              >
                                <div className="flex items-center space-x-4">
                                  <Avatar>
                                    <AvatarImage src={member.image} />
                                    <AvatarFallback>
                                      {member.name?.split(' ').map((part: string) => part[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{member.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {member.relationship}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      setNewFamilyMember({
                                        name: member.name,
                                        relationship: member.relationship
                                      });
                                      setIsEditingFamilyMember(member._id!);
                                    }}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => {
                                      setFormData(prev => ({
                                        ...prev!,
                                        familyTree: prev!.familyTree.filter((_, i) => i !== index)
                                      }));
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
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

          {/* Save Button at Bottom */}
          <div className="mt-8 flex justify-center">
            <Button
              className="bg-[#547455] hover:bg-[#243b31] text-white px-8 py-3 text-lg"
              onClick={handleSubmit}
              disabled={updating}
            >
              {updating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {editMemorialTranslations.header.save}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}