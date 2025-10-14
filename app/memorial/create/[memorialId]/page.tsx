"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Swal from 'sweetalert2';
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
  Search, // Added import for the Search icon
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
import { ADD_MEMORIAL, GET_MEMORIAL, GET_MY_MEMORIAL } from "@/services/apiEndPoint";
import { getUserDetails } from "@/services/userService";
import { useToast } from "@/components/ui/use-toast";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import LanguageDropdown from "@/components/languageDropdown/page";
import InteractiveMap from "@/components/InteractiveMap";

// Media limits configuration
const MEDIA_LIMITS = {
  PHOTO: {
    MAX_SIZE_FREE: 5 * 1024 * 1024, // 5MB
    MAX_SIZE_PLUS: 10 * 1024 * 1024, // 10MB
    MAX_SIZE_PREMIUM: 10 * 1024 * 1024, // 10MB
    ACCEPTED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
    MAX_COUNT_FREE: 10,
    MAX_COUNT_PLUS: 50,
    MAX_COUNT_PREMIUM: Infinity,
  },
  VIDEO: {
    MAX_SIZE_FREE: 50 * 1024 * 1024, // 50MB
    MAX_SIZE_PLUS: 200 * 1024 * 1024, // 200MB
    MAX_SIZE_PREMIUM: 500 * 1024 * 1024, // 500MB
    ACCEPTED_TYPES: ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi', 'video/x-msvideo'],
    MAX_DURATION_FREE: 30, // seconds
    MAX_DURATION_PLUS: 120, // seconds
    MAX_DURATION_PREMIUM: 300, // seconds
    MAX_COUNT_FREE: 3,
    MAX_COUNT_PLUS: 10,
    MAX_COUNT_PREMIUM: Infinity,
  },
  DOCUMENT: {
    MAX_SIZE_FREE: 0, // No documents for free
    MAX_SIZE_PLUS: 0, // No documents for plus
    MAX_SIZE_PREMIUM: 10 * 1024 * 1024, // 10MB
    ACCEPTED_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    MAX_COUNT_FREE: 0,
    MAX_COUNT_PLUS: 0,
    MAX_COUNT_PREMIUM: 20,
  }
};

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
  duration?: number;
  startTime?: number;
  endTime?: number;
  url?: string;
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

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#547455] mb-4"></div>
      <p className="text-gray-700 font-medium">Saving memorial...</p>
      <p className="text-gray-500 text-sm mt-1">This may take a few moments</p>
    </div>
  </div>
);

export default function CreateMemorialPage() {
  const router = useRouter();

  const params = useParams();

  const pathName = usePathname()
  const isCreate = pathName.includes("/memorial/create");
  const isEdit = pathName.includes("/memorial/edit");

  const memorialId = params.memorialId as string;

  const { t } = useTranslation();
  const { toast } = useToast();
  const createMemorialTranslations = (t as any)("createMemorial");
  const editMemorialTranslations = (t as any)("editMemorial");

  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingMemorial, setIsLoadingMemorial] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // States for the geocoding feature
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");

  const [formData, setFormData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    deathDate: "",
    biography: "",
    epitaph: "",
    location: "",
    isPublic: true,
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
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  // Load selected plan from localStorage on component mount
  useEffect(() => {
    const storedPlanId = localStorage.getItem('selectedPlanId');
    if (storedPlanId) {
      setSelectedPlanId(storedPlanId);
      console.log('Selected plan from localStorage:', storedPlanId);
    }
  }, []);

  // Function to handle geocoding from location text
  const handleGeocodeLocation = async () => {
    if (!formData.location) {
      setGeocodingError("Please enter a location first");
      return;
    }

    setIsGeocoding(true);
    setGeocodingError("");

    try {
      // Using OpenStreetMap's Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.location
        )}`
      );

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const firstResult = data[0];
        setFormData(prev => ({
          ...prev,
          gps: {
            lat: parseFloat(firstResult.lat),
            lng: parseFloat(firstResult.lon)
          }
        }));
        toast({
          title: "Location found",
          description: "GPS coordinates have been auto-filled",
          variant: "default",
        });
      } else {
        setGeocodingError("No location found. Please try a more specific location.");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setGeocodingError("Failed to fetch location data. Please enter coordinates manually.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      const timeout = setTimeout(() => {
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Video duration timeout'));
      }, 10000); // 10 second timeout
      
      video.onloadedmetadata = () => {
        clearTimeout(timeout);
        window.URL.revokeObjectURL(video.src);
        
        // Check if duration is valid
        if (isNaN(video.duration) || !isFinite(video.duration) || video.duration <= 0) {
          reject(new Error('Invalid video duration'));
        } else {
          resolve(video.duration);
        }
      };
      
      video.onerror = () => {
        clearTimeout(timeout);
        window.URL.revokeObjectURL(video.src);
        reject(new Error('Video load error'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  // File validation function
  const validateFiles = (files: FileList, type: 'photo' | 'video' | 'document') => {
    const errors: string[] = [];
    const limits = type === 'photo' ? MEDIA_LIMITS.PHOTO :
      type === 'video' ? MEDIA_LIMITS.VIDEO :
        MEDIA_LIMITS.DOCUMENT;

    // This check is correct as is
    if (type === 'document' && userSubscription !== 'Premium') {
      errors.push('Documents require a Premium plan');
      return { valid: false, errors };
    }

    // Check file count limits using the correct plan names
    const currentCount = type === 'photo' ? mediaFiles.photos.length :
      type === 'video' ? mediaFiles.videos.length :
        mediaFiles.documents.length;

    const maxCount = type === 'photo' ?
      (userSubscription === 'Free' ? limits.MAX_COUNT_FREE :
        userSubscription === 'Plus' ? limits.MAX_COUNT_PLUS : limits.MAX_COUNT_PREMIUM) :
      type === 'video' ?
        (userSubscription === 'Free' ? limits.MAX_COUNT_FREE :
          userSubscription === 'Plus' ? limits.MAX_COUNT_PLUS : limits.MAX_COUNT_PREMIUM) :
        limits.MAX_COUNT_PREMIUM;

    if (currentCount + files.length > maxCount) {
      errors.push(`You can only upload up to ${maxCount} ${type}s with your current plan.`);
    }

    Array.from(files).forEach(file => {
      if (!limits.ACCEPTED_TYPES.includes(file.type)) {
        errors.push(`Unsupported file type: ${file.name}`);
        return;
      }

      // Check file size using the correct plan names
      const maxSize = type === 'photo' ?
        (userSubscription === 'Free' ? limits.MAX_SIZE_FREE : 
          userSubscription === 'Plus' ? limits.MAX_SIZE_PLUS : limits.MAX_SIZE_PREMIUM) :
        type === 'video' ?
          (userSubscription === 'Free' ? limits.MAX_SIZE_FREE :
            userSubscription === 'Plus' ? limits.MAX_SIZE_PLUS : limits.MAX_SIZE_PREMIUM) :
          limits.MAX_SIZE_PREMIUM;

      if (file.size > maxSize) {
        errors.push(`${file.name} exceeds the maximum size of ${maxSize / (1024 * 1024)}MB.`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  };
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
      const file = e.target.files[0];
      if (file.size > MEDIA_LIMITS.PHOTO.MAX_SIZE_PLUS) {
        toast({
          title: "File Too Large",
          description: `Profile image must be less than ${MEDIA_LIMITS.PHOTO.MAX_SIZE_PLUS / (1024 * 1024)}MB`,
          variant: "destructive",
        });
        return;
      }
      handleInputChange("profileImage", file);
    }
  };

  const handlePhotosUpload = (files: FileList | null) => {
    if (!files) return;

    const validation = validateFiles(files, 'photo');
    if (!validation.valid) {
      toast({
        title: "Upload Error",
        description: validation.errors.join('\n'),
        variant: "destructive",
      });
      return;
    }

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

  const handleVideosUpload = async (files: FileList | null) => {
    if (!files) return;

    const validation = validateFiles(files, 'video');
    if (!validation.valid) {
      toast({
        title: "Upload Error",
        description: validation.errors.join('\n'),
        variant: "destructive",
      });
      return;
    }

    if (!canUploadMedia()) {
      showUpgradeToast();
      return;
    }

    const maxDuration = userSubscription === 'Free' ? MEDIA_LIMITS.VIDEO.MAX_DURATION_FREE :
      userSubscription === 'Plus' ? MEDIA_LIMITS.VIDEO.MAX_DURATION_PLUS :
        MEDIA_LIMITS.VIDEO.MAX_DURATION_PREMIUM;

    const videoItems = await Promise.all(Array.from(files).map(async (file) => {
      let duration;
      try {
        duration = await getVideoDuration(file);
        
        // If duration is NaN, Infinity, or invalid, use a default
        if (isNaN(duration) || duration <= 0 || !isFinite(duration)) {
          duration = 30; // Default to 30 seconds for Free plan
        }
      } catch (error) {
        duration = 30; // Fallback duration
      }
      
      if (duration > maxDuration) {
        toast({
          title: "Video Too Long",
          description: `${file.name} exceeds maximum duration of ${maxDuration} seconds`,
          variant: "destructive",
        });
        return null;
      }
      return {
        title: file.name.split('.')[0],
        file,
        duration,
        startTime: 0,
        endTime: duration,
        url: URL.createObjectURL(file)
      };
    }));

    setMediaFiles(prev => ({
      ...prev,
      videos: [...prev.videos, ...videoItems.filter(item => item !== null) as VideoItem[]]
    }));
  };

  const handleDocumentsUpload = (files: FileList | null) => {
    if (!files) return;

    const validation = validateFiles(files, 'document');
    if (!validation.valid) {
      toast({
        title: "Upload Error",
        description: validation.errors.join('\n'),
        variant: "destructive",
      });
      return;
    }

    // if (!canUploadDocuments()) {
    //   showUpgradeToast("Premium");
    //   return;
    // }

    const newDocuments = Array.from(files).map(file => ({
      fileName: file.name,
      file
    }));

    setMediaFiles(prev => {
      const updatedDocuments = [...prev.documents, ...newDocuments];
      return {
        ...prev,
        documents: updatedDocuments
      };
    });
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
    // Clean up object URL to prevent memory leaks
    const video = mediaFiles.videos[index];
    if (video.url) {
      URL.revokeObjectURL(video.url);
    }
    
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

  useEffect(() => {
    if (memorialId && isEdit) {
      setIsEditing(true);
      fetchMemorialData(memorialId);
    } else if (memorialId && isCreate) {
      // For create operations, we don't need to fetch existing data
      setIsEditing(false);
    }
  }, [memorialId, isEdit, isCreate]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      mediaFiles.videos.forEach(video => {
        if (video.url) {
          URL.revokeObjectURL(video.url);
        }
      });
    };
  }, []);

  const fetchMemorialData = async (id: string) => {
    setIsLoadingMemorial(true);
    try {
      const response = await axiosInstance.get(GET_MY_MEMORIAL(id));
      const memorial = response.data.data;

      setFormData({
        _id: memorial._id,
        firstName: memorial.firstName || "",
        lastName: memorial.lastName || "",
        birthDate: memorial.birthDate ? new Date(memorial.birthDate).toISOString().split('T')[0] : "",
        deathDate: memorial.deathDate ? new Date(memorial.deathDate).toISOString().split('T')[0] : "",
        biography: memorial.biography || "",
        epitaph: memorial.epitaph || "",
        location: memorial.location || "",
        isPublic: memorial.isPublic !== undefined ? memorial.isPublic : true,
        profileImage: memorial.profileImage || null,
        gps: memorial.gps || { lat: null, lng: null }
      });

      if (memorial.achievements) {
        setAchievements(memorial.achievements);
      }

      if (memorial.familyTree) {
        setMediaFiles(prev => ({
          ...prev,
          familyTree: memorial.familyTree
        }));
      }
    } catch (error) {
      console.error("Error fetching memorial data:", error);
      toast({
        title: "Error",
        description: "Failed to load memorial data",
        variant: "destructive",
      });
    } finally {
      setIsLoadingMemorial(false);
    }
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();

    if (memorialId) {
      formDataToSend.append("_id", memorialId);
    }

    if (isCreate) {
      formDataToSend.append("createReq", "true");
    }

    if (isEdit) {
      formDataToSend.append("editReq", "true");
    }

    formDataToSend.append("firstName", formData.firstName);
    formDataToSend.append("lastName", formData.lastName);
    formDataToSend.append("birthDate", formData.birthDate);
    formDataToSend.append("deathDate", formData.deathDate);
    formDataToSend.append("biography", formData.biography);
    formDataToSend.append("epitaph", formData.epitaph);
    formDataToSend.append("isPublic", String(formData.isPublic));
    formDataToSend.append("location", formData.location)

    if (formData.gps?.lat && formData.gps?.lng) {
      formDataToSend.append('gps', JSON.stringify(formData.gps));
    }

    achievements.forEach((achievement, index) => {
      formDataToSend.append(`achievements[${index}]`, achievement);
    });

    if (formData.profileImage instanceof File) {
      formDataToSend.append("profileImage", formData.profileImage);
    } else if (typeof formData.profileImage === 'string') {
      formDataToSend.append("profileImageUrl", formData.profileImage);
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
    setIsSaving(true);
    try {
      const formDataToSend = prepareFormData();
      const response = await axiosInstance.post('/api/memorials/create-update', formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast({
        title: "Success",
        description: `Memorial ${isEditing ? 'updated' : 'created'} successfully!`,
        variant: "default",
      });
      
      console.log('Debug info:', {
        isCreate,
        isEditing,
        memorialId,
        responseData: response.data,
        pathName
      });
      
      // If creating a new memorial, handle the flow based on preselected plan
      if (isCreate) {
        // Use the memorial ID from the response if available, otherwise use the URL param
        const redirectMemorialId = response.data?.data?._id || memorialId;
        console.log('Redirecting to subscription with memorialId:', redirectMemorialId);
        console.log('Selected plan ID:', selectedPlanId);
        
        if (!redirectMemorialId) {
          console.error('No memorialId available for redirect');
          toast({
            title: "Error",
            description: "No memorial ID available for redirect",
            variant: "destructive",
          });
          return;
        }
        
        // If a plan was preselected, redirect to subscription page with the plan preselected
        if (selectedPlanId) {
          try {
            router.push(`/subscription?memorialId=${redirectMemorialId}&preselectedPlan=${selectedPlanId}`);
          } catch (routerError) {
            console.error('Router push failed, using window.location:', routerError);
            window.location.href = `/subscription?memorialId=${redirectMemorialId}&preselectedPlan=${selectedPlanId}`;
          }
        } else {
          // No preselected plan, go to regular subscription page
          try {
            router.push(`/subscription?memorialId=${redirectMemorialId}`);
          } catch (routerError) {
            console.error('Router push failed, using window.location:', routerError);
            window.location.href = `/subscription?memorialId=${redirectMemorialId}`;
          }
        }
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      if (error.response?.data?.actionCode === "UPGRADE_REQUIRED") {
        Swal.fire({
          icon: 'warning',
          title: 'Upgrade Required',
          text: error.response?.data?.message || "You need a premium subscription to use this feature",
          showCancelButton: true,
          confirmButtonText: 'View Plans',
          cancelButtonText: 'Cancel',
          confirmButtonColor: '#E53935',
          cancelButtonColor: '#6e7881',
        }).then((result) => {
          if (result.isConfirmed) {
            router.push('/dashboard');
          }
        });
      } else if (error.response?.data?.actionCode === "VIDEO_TOO_LONG") {
        Swal.fire({
          icon: 'error',
          title: 'Video Too Long',
          text: error.response?.data?.message || "Video exceeds the maximum allowed duration of 1 minute",
          confirmButtonText: 'OK',
          confirmButtonColor: '#E53935',
        });
      } else {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to create memorial. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSaving(false);
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
      <Link href="/pricing">
        <Button className="bg-[#547455] hover:bg-[#243b31]">
          Upgrade to {requiredPlan}
        </Button>
      </Link>
    </div>
  );
  if (loadingSubscription || (isEdit && isLoadingMemorial)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#547455] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {isSaving && <LoadingOverlay />}
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
            <h1 className="md:text-3xl text-2xl font-bold text-gray-900 mb-2">
              {createMemorialTranslations.title}
            </h1>
            <p className="text-gray-600 text-base">
              {isEditing ? "Update the memorial for your loved one" : createMemorialTranslations.subtitle}
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
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      {/* <img
                        src={
                          typeof formData.profileImage === "string"
                            ? formData.profileImage
                            : formData.profileImage
                              ? URL.createObjectURL(formData.profileImage) // File → string URL
                              : "/default-avatar.png"
                        }

                        className="object-cover"
                      /> */}
                    </div>
                    <div className="flex md:justify-start justify-center flex-col">
                      <label htmlFor="profileImageUpload" className="w-fit">
                        <Button
                          variant="outline"
                          className="mb-2 bg-transparent cursor-pointer relative overflow-hidden"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          {createMemorialTranslations.basicInfo.uploadPhoto}
                          <input
                            id="profileImageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="opacity-0 absolute top-0 left-0 right-0 bottom-0 w-full h-full cursor-pointer"
                          />
                        </Button>
                      </label>

                      {!formData.profileImage &&
                        <p className="text-sm text-gray-500 md:text-left text-center">
                          {createMemorialTranslations.basicInfo.photoDescription}
                          <br />
                          Max {userSubscription === 'Free' ? '5MB' : '10MB'} • JPEG, PNG, WebP
                        </p>}
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

                  {/* --- INTERACTIVE MAP FOR PRECISE LOCATION --- */}
                  <div className="space-y-4">
                    <Label className="flex items-center text-lg font-semibold">
                      <MapPin className="h-5 w-5 mr-2" />
                      {createMemorialTranslations.basicInfo.location?.title || createMemorialTranslations.basicInfo.location} - Set Precise Location
                    </Label>
                    <p className="text-sm text-gray-600">
                      {createMemorialTranslations?.basicInfo?.location?.description || "Click on the map to set the exact GPS coordinates for the memorial location."}
                    </p>
                    <InteractiveMap
                      initialLat={formData.gps?.lat || 41.7151}
                      initialLng={formData.gps?.lng || 44.8271}
                      onLocationChange={(lat, lng) => {
                        setFormData(prev => ({
                          ...prev,
                          gps: { lat, lng }
                        }));
                      }}
                      height="400px"
                      showCoordinateInputs={true}
                      translations={createMemorialTranslations?.basicInfo?.location}
                    />
                  </div>
                  {/* --- END OF INTERACTIVE MAP --- */}

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
                    <Label className="text-lg font-semibold">{editMemorialTranslations.basicInfo.achievements}</Label>
                    <p className="text-sm text-gray-500">
                      {editMemorialTranslations.basicInfo.achievement}
                    </p>

                    <div className="flex gap-2">
                      <Input
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        placeholder={editMemorialTranslations.basicInfo.nobelPrice}
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
                          <p className="text-xs text-gray-500 mt-2">
                            Supported: JPEG, PNG, WebP
                          </p>
                          {mediaFiles.photos.length > 0 && (
                            <div className="mt-4 w-full">
                              <p className="text-xs font-medium mb-2">
                                Selected Photos
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
                          <p className="text-xs text-gray-500 mt-2">
                            Supported: MP4, MOV • Max {'1min'}
                          </p>
                            {mediaFiles.videos.length > 0 && (
                              <div className="mt-4 w-full">
                                <p className="text-xs font-medium mb-2">
                                  Selected Videos ({mediaFiles.videos.length})
                                </p>
                                <div className="space-y-2">
                                  {mediaFiles.videos.map((video, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                                      <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <Video className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                        <span className="text-sm font-medium text-gray-900 truncate" title={video.title}>
                                          {video.title}
                                        </span>
                                      </div>
                                      <div className="ml-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeVideo(index)}
                                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                          title="Remove video"
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
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
                            disabled={userSubscription !== 'Premium'}
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
                          <p className="text-xs text-gray-500 mt-2">
                            Supported: PDF, DOC, DOCX, TXT
                          </p>
                          {mediaFiles.documents.length > 0 && (
                            <div className="mt-4 w-full">
                              <p className="text-xs font-medium mb-2">
                                Selected Documents
                              </p>
                              <div className="space-y-1">
                                {mediaFiles.documents.map((doc, index) => (
                                  <div key={`doc-${index}-${doc.fileName}`} className="flex items-center justify-between bg-gray-100 p-2 rounded">
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
                            {createMemorialTranslations.familyTree.familyMember}
                          </Label>
                          <Input
                            id="familyMemberName"
                            placeholder={createMemorialTranslations.familyTree.placeholder.name}
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
                            {createMemorialTranslations.familyTree.relationship}
                          </Label>
                          <Input
                            id="familyMemberRelationship"
                            placeholder={createMemorialTranslations.familyTree.placeholder.relationship}
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
                        {createMemorialTranslations?.familyTree?.placeholder?.button}
                      </Button>

                      {mediaFiles.familyTree.length > 0 && (
                        <div className="mt-6">
                          <h3 className="font-semibold text-gray-900 mb-4">
                            {createMemorialTranslations?.familyTree?.members?.title}
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

          {/* Save Button at Bottom */}
          <div className="mt-8 flex justify-center">
            <Button
              className="bg-[#547455] hover:bg-[#243b31] text-white px-8 py-3 text-lg"
              onClick={(e) => handleSaveMemorial(e)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  {isEditing ? "Update Memorial" : createMemorialTranslations.header.save}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>

    </div>
  );
}