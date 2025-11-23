'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslate';
import axiosInstance from '@/services/axiosInstance';
import {
  ADD_MEMORIAL,
  GET_MEMORIAL,
  GET_MY_MEMORIAL,
} from '@/services/apiEndPoint';
import { getUserDetails } from '@/services/userService';
import { useToast } from '@/components/ui/use-toast';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import LanguageDropdown from '@/components/languageDropdown/page';
import InteractiveMap from '@/components/InteractiveMap';

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
    ACCEPTED_TYPES: [
      'video/mp4',
      'video/quicktime',
      'video/x-msvideo',
      'video/avi',
      'video/x-msvideo',
    ],
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
    ACCEPTED_TYPES: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
    MAX_COUNT_FREE: 0,
    MAX_COUNT_PLUS: 0,
    MAX_COUNT_PREMIUM: 20,
  },
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
  subscriptionPlan: 'Free' | 'Plus' | 'Premium';
}

const LoadingOverlay = () => (
  <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="flex flex-col items-center bg-white p-6 rounded-lg">
      <div className="mb-4 border-[#547455] border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      <p className="font-medium text-gray-700">Saving memorial...</p>
      <p className="mt-1 text-gray-500 text-sm">This may take a few moments</p>
    </div>
  </div>
);

export default function CreateMemorialPage() {
  const router = useRouter();

  const params = useParams();

  const pathName = usePathname();
  const isCreate = pathName.includes('/memorial/create');
  const isEdit = pathName.includes('/memorial/edit');

  const memorialId = params.memorialId as string;

  const { t } = useTranslation();
  const { toast } = useToast();
  const createMemorialTranslations = (t as any)('createMemorial');
  const editMemorialTranslations = (t as any)('editMemorial');

  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingMemorial, setIsLoadingMemorial] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // States for the geocoding feature
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState('');

  const [formData, setFormData] = useState({
    _id: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
    biography: '',
    epitaph: '',
    location: '',
    isPublic: true,
    profileImage: null as File | null,
    gps: {
      lat: null as number | null,
      lng: null as number | null,
    },
  });

  const [mediaFiles, setMediaFiles] = useState({
    photos: [] as File[],
    videos: [] as VideoItem[],
    documents: [] as DocumentItem[],
    familyTree: [] as FamilyMember[],
  });

  const [newFamilyMember, setNewFamilyMember] = useState<FamilyMember>({
    name: '',
    relationship: '',
  });

  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [userSubscription, setUserSubscription] = useState<
    'Free' | 'Plus' | 'Premium'
  >('Free');
  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAchievement, setNewAchievement] = useState<string>('');
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
      setGeocodingError('Please enter a location first');
      return;
    }

    setIsGeocoding(true);
    setGeocodingError('');

    try {
      // Using OpenStreetMap's Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.location
        )}`
      );

      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const firstResult = data[0];
        setFormData((prev) => ({
          ...prev,
          gps: {
            lat: parseFloat(firstResult.lat),
            lng: parseFloat(firstResult.lon),
          },
        }));
        toast({
          title: 'Location found',
          description: 'GPS coordinates have been auto-filled',
          variant: 'default',
        });
      } else {
        setGeocodingError(
          'No location found. Please try a more specific location.'
        );
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setGeocodingError(
        'Failed to fetch location data. Please enter coordinates manually.'
      );
    } finally {
      setIsGeocoding(false);
    }
  };

  // Function to handle reverse geocoding (GPS coordinates to location string)
  const handleReverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using OpenStreetMap's Nominatim reverse geocoding API
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding service unavailable');
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

        const locationString =
          locationParts.length > 0
            ? locationParts.join(', ')
            : data.display_name || '';

        if (locationString) {
          setFormData((prev) => ({
            ...prev,
            location: locationString,
          }));
        }
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Silently fail - location string will remain empty or user can enter manually
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
        if (
          isNaN(video.duration) ||
          !isFinite(video.duration) ||
          video.duration <= 0
        ) {
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
  const validateFiles = (
    files: FileList,
    type: 'photo' | 'video' | 'document'
  ) => {
    const errors: string[] = [];
    const limits =
      type === 'photo'
        ? MEDIA_LIMITS.PHOTO
        : type === 'video'
        ? MEDIA_LIMITS.VIDEO
        : MEDIA_LIMITS.DOCUMENT;

    // This check is correct as is
    if (type === 'document' && userSubscription !== 'Premium') {
      errors.push('Documents require a Premium plan');
      return { valid: false, errors };
    }

    // Check file count limits using the correct plan names
    const currentCount =
      type === 'photo'
        ? mediaFiles.photos.length
        : type === 'video'
        ? mediaFiles.videos.length
        : mediaFiles.documents.length;

    const maxCount =
      type === 'photo'
        ? userSubscription === 'Free'
          ? limits.MAX_COUNT_FREE
          : userSubscription === 'Plus'
          ? limits.MAX_COUNT_PLUS
          : limits.MAX_COUNT_PREMIUM
        : type === 'video'
        ? userSubscription === 'Free'
          ? limits.MAX_COUNT_FREE
          : userSubscription === 'Plus'
          ? limits.MAX_COUNT_PLUS
          : limits.MAX_COUNT_PREMIUM
        : limits.MAX_COUNT_PREMIUM;

    if (currentCount + files.length > maxCount) {
      errors.push(
        `You can only upload up to ${maxCount} ${type}s with your current plan.`
      );
    }

    Array.from(files).forEach((file) => {
      if (!limits.ACCEPTED_TYPES.includes(file.type)) {
        errors.push(`Unsupported file type: ${file.name}`);
        return;
      }

      // Check file size using the correct plan names
      const maxSize =
        type === 'photo'
          ? userSubscription === 'Free'
            ? limits.MAX_SIZE_FREE
            : userSubscription === 'Plus'
            ? limits.MAX_SIZE_PLUS
            : limits.MAX_SIZE_PREMIUM
          : type === 'video'
          ? userSubscription === 'Free'
            ? limits.MAX_SIZE_FREE
            : userSubscription === 'Plus'
            ? limits.MAX_SIZE_PLUS
            : limits.MAX_SIZE_PREMIUM
          : limits.MAX_SIZE_PREMIUM;

      if (file.size > maxSize) {
        errors.push(
          `${file.name} exceeds the maximum size of ${
            maxSize / (1024 * 1024)
          }MB.`
        );
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  };
  // Subscription check functions
  const canUploadMedia = () => userSubscription !== 'Free';
  const canUploadDocuments = () => userSubscription === 'Premium';
  const canAddFamilyMembers = () => userSubscription !== 'Free';

  const showUpgradeToast = (requiredPlan: 'Plus' | 'Premium' = 'Plus') => {
    toast({
      title: 'Upgrade Required',
      description: `This feature requires a ${requiredPlan} subscription.`,
      variant: 'destructive',
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
          title: 'File Too Large',
          description: `Profile image must be less than ${
            MEDIA_LIMITS.PHOTO.MAX_SIZE_PLUS / (1024 * 1024)
          }MB`,
          variant: 'destructive',
        });
        return;
      }
      handleInputChange('profileImage', file);
    }
  };

  const removeProfileImage = () => {
    handleInputChange('profileImage', null);
  };

  // Function to check if form is valid - only profileImage and firstName are required
  const isFormValid = () => {
    return formData.profileImage !== null && formData.firstName.trim() !== '';
  };

  const handlePhotosUpload = (files: FileList | null) => {
    if (!files) return;

    const validation = validateFiles(files, 'photo');
    if (!validation.valid) {
      toast({
        title: 'Upload Error',
        description: validation.errors.join('\n'),
        variant: 'destructive',
      });
      return;
    }

    if (!canUploadMedia()) {
      showUpgradeToast();
      return;
    }

    const newPhotos = Array.from(files);
    setMediaFiles((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  const handleVideosUpload = async (files: FileList | null) => {
    if (!files) return;

    const validation = validateFiles(files, 'video');
    if (!validation.valid) {
      toast({
        title: 'Upload Error',
        description: validation.errors.join('\n'),
        variant: 'destructive',
      });
      return;
    }

    if (!canUploadMedia()) {
      showUpgradeToast();
      return;
    }

    const maxDuration =
      userSubscription === 'Free'
        ? MEDIA_LIMITS.VIDEO.MAX_DURATION_FREE
        : userSubscription === 'Plus'
        ? MEDIA_LIMITS.VIDEO.MAX_DURATION_PLUS
        : MEDIA_LIMITS.VIDEO.MAX_DURATION_PREMIUM;

    const videoItems = await Promise.all(
      Array.from(files).map(async (file) => {
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
            title: 'Video Too Long',
            description: `${file.name} exceeds maximum duration of ${maxDuration} seconds`,
            variant: 'destructive',
          });
          return null;
        }
        return {
          title: file.name.split('.')[0],
          file,
          duration,
          startTime: 0,
          endTime: duration,
          url: URL.createObjectURL(file),
        };
      })
    );

    setMediaFiles((prev) => ({
      ...prev,
      videos: [
        ...prev.videos,
        ...(videoItems.filter((item) => item !== null) as VideoItem[]),
      ],
    }));
  };

  const handleDocumentsUpload = (files: FileList | null) => {
    if (!files) return;

    const validation = validateFiles(files, 'document');
    if (!validation.valid) {
      toast({
        title: 'Upload Error',
        description: validation.errors.join('\n'),
        variant: 'destructive',
      });
      return;
    }

    // if (!canUploadDocuments()) {
    //   showUpgradeToast("Premium");
    //   return;
    // }

    const newDocuments = Array.from(files).map((file) => ({
      fileName: file.name,
      file,
    }));

    setMediaFiles((prev) => {
      const updatedDocuments = [...prev.documents, ...newDocuments];
      return {
        ...prev,
        documents: updatedDocuments,
      };
    });
  };

  const handleAddFamilyMember = () => {
    if (!canAddFamilyMembers()) {
      showUpgradeToast();
      return;
    }

    if (newFamilyMember.name && newFamilyMember.relationship) {
      setMediaFiles((prev) => ({
        ...prev,
        familyTree: [...prev.familyTree, newFamilyMember],
      }));
      setNewFamilyMember({ name: '', relationship: '' });
    }
  };

  const removeFamilyMember = (index: number) => {
    setMediaFiles((prev) => ({
      ...prev,
      familyTree: prev.familyTree.filter((_, i) => i !== index),
    }));
  };

  const removePhoto = (index: number) => {
    setMediaFiles((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const removeVideo = (index: number) => {
    // Clean up object URL to prevent memory leaks
    const video = mediaFiles.videos[index];
    if (video.url) {
      URL.revokeObjectURL(video.url);
    }

    setMediaFiles((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const removeDocument = (index: number) => {
    setMediaFiles((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements((prev) => [...prev, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAchievement = (index: number, value: string) => {
    setAchievements((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();
        setUserDetails(userData.user);
        setUserSubscription(userData.user.subscriptionPlan);
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast({
          title: 'Error',
          description: 'Could not fetch user subscription details',
          variant: 'destructive',
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
      mediaFiles.videos.forEach((video) => {
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
        firstName: memorial.firstName || '',
        lastName: memorial.lastName || '',
        birthDate: memorial.birthDate
          ? new Date(memorial.birthDate).toISOString().split('T')[0]
          : '',
        deathDate: memorial.deathDate
          ? new Date(memorial.deathDate).toISOString().split('T')[0]
          : '',
        biography: memorial.biography || '',
        epitaph: memorial.epitaph || '',
        location: memorial.location || '',
        isPublic: memorial.isPublic !== undefined ? memorial.isPublic : true,
        profileImage: memorial.profileImage || null,
        gps: memorial.gps || { lat: null, lng: null },
      });

      if (memorial.achievements) {
        setAchievements(memorial.achievements);
      }

      if (memorial.familyTree) {
        setMediaFiles((prev) => ({
          ...prev,
          familyTree: memorial.familyTree,
        }));
      }
    } catch (error) {
      console.error('Error fetching memorial data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load memorial data',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingMemorial(false);
    }
  };

  const prepareFormData = () => {
    const formDataToSend = new FormData();

    if (memorialId) {
      formDataToSend.append('_id', memorialId);
    }

    if (isCreate) {
      formDataToSend.append('createReq', 'true');
    }

    if (isEdit) {
      formDataToSend.append('editReq', 'true');
    }

    // firstName is required - always append it
    formDataToSend.append('firstName', formData.firstName);

    // All other fields are optional - only append if they have values
    if (formData.lastName) {
      formDataToSend.append('lastName', formData.lastName);
    }
    if (formData.birthDate) {
      formDataToSend.append('birthDate', formData.birthDate);
    }
    if (formData.deathDate) {
      formDataToSend.append('deathDate', formData.deathDate);
    }
    if (formData.biography) {
      formDataToSend.append('biography', formData.biography);
    }
    if (formData.epitaph) {
      formDataToSend.append('epitaph', formData.epitaph);
    }
    formDataToSend.append('isPublic', String(formData.isPublic));
    if (formData.location) {
      formDataToSend.append('location', formData.location);
    }

    if (formData.gps?.lat && formData.gps?.lng) {
      formDataToSend.append('gps', JSON.stringify(formData.gps));
    }

    achievements.forEach((achievement, index) => {
      formDataToSend.append(`achievements[${index}]`, achievement);
    });

    if (formData.profileImage instanceof File) {
      formDataToSend.append('profileImage', formData.profileImage);
    } else if (typeof formData.profileImage === 'string') {
      formDataToSend.append('profileImageUrl', formData.profileImage);
    }

    mediaFiles.photos.forEach((photo) => {
      formDataToSend.append('photoGallery', photo);
    });

    mediaFiles.videos.forEach((video) => {
      formDataToSend.append('videoGallery', video.file);
    });

    mediaFiles.documents.forEach((doc) => {
      formDataToSend.append('documents', doc.file);
    });

    mediaFiles.familyTree.forEach((member, index) => {
      formDataToSend.append(`familyTree[${index}][name]`, member.name);
      formDataToSend.append(
        `familyTree[${index}][relationship]`,
        member.relationship
      );
    });

    return formDataToSend;
  };

  const handleSaveMemorial = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Check if required fields are filled (photo and firstname)
    if (!isFormValid()) {
      const missingFields = [];
      if (formData.profileImage === null) {
        missingFields.push('Photo');
      }
      if (formData.firstName.trim() === '') {
        missingFields.push('First Name');
      }

      toast({
        title: 'Missing Required Fields',
        description: `Please provide: ${missingFields.join(' and ')}`,
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      const formDataToSend = prepareFormData();
      const response = await axiosInstance.post(
        '/api/memorials/create-update',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast({
        title: 'Success',
        description: `Memorial ${
          isEditing ? 'updated' : 'created'
        } successfully!`,
        variant: 'default',
      });

      console.log('Debug info:', {
        isCreate,
        isEditing,
        memorialId,
        responseData: response.data,
        pathName,
      });

      // If creating a new memorial, handle the flow based on preselected plan
      if (isCreate) {
        // Use the memorial ID from the response if available, otherwise use the URL param
        const redirectMemorialId = response.data?.data?._id || memorialId;
        console.log(
          'Redirecting to subscription with memorialId:',
          redirectMemorialId
        );
        console.log('Selected plan ID:', selectedPlanId);

        if (!redirectMemorialId) {
          console.error('No memorialId available for redirect');
          toast({
            title: 'Error',
            description: 'No memorial ID available for redirect',
            variant: 'destructive',
          });
          return;
        }

        // If a plan was preselected, redirect to subscription page with the plan preselected
        if (selectedPlanId) {
          try {
            router.push(
              `/subscription?memorialId=${redirectMemorialId}&preselectedPlan=${selectedPlanId}`
            );
          } catch (routerError) {
            console.error(
              'Router push failed, using window.location:',
              routerError
            );
            window.location.href = `/subscription?memorialId=${redirectMemorialId}&preselectedPlan=${selectedPlanId}`;
          }
        } else {
          // No preselected plan, go to regular subscription page
          try {
            router.push(`/subscription?memorialId=${redirectMemorialId}`);
          } catch (routerError) {
            console.error(
              'Router push failed, using window.location:',
              routerError
            );
            window.location.href = `/subscription?memorialId=${redirectMemorialId}`;
          }
        }
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      if (error.response?.data?.actionCode === 'UPGRADE_REQUIRED') {
        Swal.fire({
          icon: 'warning',
          title: 'Upgrade Required',
          text:
            error.response?.data?.message ||
            'You need a premium subscription to use this feature',
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
      } else if (error.response?.data?.actionCode === 'VIDEO_TOO_LONG') {
        Swal.fire({
          icon: 'error',
          title: 'Video Too Long',
          text:
            error.response?.data?.message ||
            'Video exceeds the maximum allowed duration of 1 minute',
          confirmButtonText: 'OK',
          confirmButtonColor: '#E53935',
        });
      } else {
        toast({
          title: 'Error',
          description:
            error.response?.data?.message ||
            'Failed to create memorial. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const SubscriptionRestricted = ({
    requiredPlan = 'Plus',
  }: {
    requiredPlan?: 'Plus' | 'Premium';
  }) => (
    <div className="bg-gray-50 p-6 rounded-lg text-center">
      <div className="flex justify-center items-center bg-gray-100 mx-auto mb-4 rounded-full w-12 h-12">
        <Lock className="w-6 h-6 text-gray-500" />
      </div>
      <h3 className="mb-2 font-medium text-gray-900 text-lg">
        {requiredPlan === 'Premium' ? 'Premium Feature' : 'Upgrade Required'}
      </h3>
      <p className="mb-4 text-gray-500">
        {requiredPlan === 'Premium'
          ? 'This feature is only available with a Premium subscription.'
          : 'Upgrade to Plus or Premium to access this feature.'}
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
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-[#547455] border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-50 min-h-screen">
      {isSaving && <LoadingOverlay />}
      <header className="top-0 z-50 sticky bg-[#243b31] py-4">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white text-base hover:underline"
              >
                <ArrowLeft className="w-5 h-5" />
                {createMemorialTranslations.header.back}
              </Link>
            </div>
            <div className="flex gap-3">
              <LanguageDropdown />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="mb-2 font-bold text-gray-900 text-2xl md:text-3xl">
              {createMemorialTranslations.title}
            </h1>
            <p className="text-gray-600 text-base">
              {isEditing
                ? 'Update the memorial for your loved one'
                : createMemorialTranslations.subtitle}
            </p>
          </div>

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="basic">
                {createMemorialTranslations.tabs.basic}
              </TabsTrigger>
              <TabsTrigger value="media" disabled={userSubscription === 'Free'}>
                {createMemorialTranslations.tabs.media}
                {userSubscription === 'Free' && (
                  <span className="ml-1 text-yellow-600 text-xs">
                    (Upgrade)
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="family"
                disabled={userSubscription === 'Free'}
              >
                {createMemorialTranslations.tabs.family}
                {userSubscription === 'Free' && (
                  <span className="ml-1 text-yellow-600 text-xs">
                    (Upgrade)
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="mr-2 w-5 h-5 text-[#547455]" />
                    {createMemorialTranslations.basicInfo.title}
                  </CardTitle>
                  <CardDescription>
                    {createMemorialTranslations.basicInfo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex md:flex-row flex-col justify-center md:justify-start items-center gap-3 md:space-x-6">
                    <div className="relative flex justify-center items-center bg-gray-50 border-2 border-gray-300 border-dashed rounded-lg w-32 h-32">
                      {formData.profileImage ? (
                        <img
                          src={
                            typeof formData.profileImage === 'string'
                              ? formData.profileImage
                              : URL.createObjectURL(formData.profileImage)
                          }
                          alt="Profile preview"
                          className="rounded-lg w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col justify-center items-center text-gray-400">
                          <ImageIcon className="mb-2 w-8 h-8" />
                          <span className="text-xs text-center">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center md:justify-start">
                      <label htmlFor="profileImageUpload" className="w-fit">
                        <Button
                          variant="outline"
                          className="relative bg-transparent mb-2 overflow-hidden cursor-pointer"
                        >
                          <Upload className="mr-2 w-4 h-4" />
                          {createMemorialTranslations.basicInfo.uploadPhoto}
                          <input
                            id="profileImageUpload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="top-0 right-0 bottom-0 left-0 absolute opacity-0 w-full h-full cursor-pointer"
                          />
                        </Button>
                      </label>

                      {formData.profileImage && (
                        <Button
                          variant="outline"
                          className="bg-transparent hover:bg-red-50 text-red-600 hover:text-red-700"
                          onClick={removeProfileImage}
                        >
                          <Trash2 className="mr-2 w-4 h-4" />
                          {createMemorialTranslations?.buttons?.removeImage ||
                            'Remove Image'}
                        </Button>
                      )}

                      {!formData.profileImage && (
                        <p className="text-gray-500 text-sm md:text-left text-center">
                          {
                            createMemorialTranslations.basicInfo
                              .photoDescription
                          }
                          <br />
                          Max {userSubscription === 'Free' ? '5MB' : '10MB'} •
                          JPEG, PNG, WebP
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
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
                          handleInputChange('firstName', e.target.value)
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
                          handleInputChange('lastName', e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="gap-4 grid grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="flex items-center">
                        <Calendar className="mr-2 w-4 h-4" />
                        {createMemorialTranslations.basicInfo.birthDate}
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) =>
                          handleInputChange('birthDate', e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deathDate" className="flex items-center">
                        <Calendar className="mr-2 w-4 h-4" />
                        {createMemorialTranslations.basicInfo.deathDate}
                      </Label>
                      <Input
                        id="deathDate"
                        max={getYesterdayDate()}
                        type="date"
                        value={formData.deathDate}
                        onChange={(e) =>
                          handleInputChange('deathDate', e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Input
                      id="epitaph"
                      placeholder={
                        createMemorialTranslations.basicInfo.epitaphPlaceholder
                      }
                      value={formData.epitaph}
                      onChange={(e) =>
                        handleInputChange('epitaph', e.target.value)
                      }
                      className="h-12"
                    />
                  </div>

                  {/* --- INTERACTIVE MAP FOR PRECISE LOCATION --- */}
                  <div className="space-y-4">
                    <Label className="flex items-center font-semibold text-lg">
                      <MapPin className="mr-2 w-5 h-5" />
                      {createMemorialTranslations.basicInfo.location?.title ||
                        createMemorialTranslations.basicInfo.location}{' '}
                      -{' '}
                      {createMemorialTranslations?.location
                        ?.setPreciseLocation || 'Set Precise Location'}
                    </Label>
                    <p className="text-gray-600 text-sm">
                      {createMemorialTranslations?.basicInfo?.location
                        ?.description ||
                        'Click on the map to set the exact GPS coordinates for the memorial location.'}
                    </p>
                    <InteractiveMap
                      initialLat={formData.gps?.lat || 41.7151}
                      initialLng={formData.gps?.lng || 44.8271}
                      initialLocation={formData.location || ''}
                      onLocationChange={(lat, lng) => {
                        setFormData((prev) => ({
                          ...prev,
                          gps: { lat, lng },
                        }));
                        // Automatically populate location string from GPS coordinates
                        handleReverseGeocode(lat, lng);
                      }}
                      height="400px"
                      showCoordinateInputs={true}
                      translations={
                        createMemorialTranslations?.basicInfo?.location
                      }
                    />
                  </div>
                  {/* --- END OF INTERACTIVE MAP --- */}

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
                        handleInputChange('biography', e.target.value)
                      }
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="font-semibold text-lg">
                      {editMemorialTranslations.basicInfo.achievements}
                    </Label>
                    <p className="text-gray-500 text-sm">
                      {editMemorialTranslations.basicInfo.achievement}
                    </p>

                    <div className="flex gap-2">
                      <Input
                        value={newAchievement}
                        onChange={(e) => setNewAchievement(e.target.value)}
                        placeholder={
                          editMemorialTranslations.basicInfo.nobelPrice
                        }
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={addAchievement}
                        disabled={!newAchievement.trim()}
                      >
                        {createMemorialTranslations?.buttons?.add || 'Add'}
                      </Button>
                    </div>

                    {achievements.length > 0 && (
                      <div className="space-y-2 mt-4">
                        {achievements.map((achievement, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-2 border rounded"
                          >
                            <Input
                              value={achievement}
                              onChange={(e) =>
                                updateAchievement(index, e.target.value)
                              }
                              className="flex-1 border-none focus-visible:ring-0"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAchievement(index)}
                              className="p-0 w-8 h-8 text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
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
                      onCheckedChange={(value) =>
                        handleInputChange('isPublic', value)
                      }
                    />
                    <Label htmlFor="isPublic">
                      {createMemorialTranslations.settings.publicMemorial.label}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              {userSubscription === 'Free' ? (
                <SubscriptionRestricted />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ImageIcon className="mr-2 w-5 h-5 text-blue-500" />
                      {createMemorialTranslations.media.title}
                    </CardTitle>
                    <CardDescription>
                      {createMemorialTranslations.media.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
                      {/* Photo Upload */}
                      <Card className="border-2 border-gray-300 hover:border-gray-400 border-dashed transition-colors">
                        <CardContent className="flex flex-col justify-center items-center p-6 text-center">
                          <ImageIcon className="mb-4 w-12 h-12 text-gray-400" />
                          <h3 className="mb-2 font-semibold text-gray-900">
                            {createMemorialTranslations.media.photos.title}
                          </h3>
                          <p className="mb-4 text-gray-500 text-sm">
                            {
                              createMemorialTranslations.media.photos
                                .description
                            }
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.multiple = true;
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                handlePhotosUpload(
                                  (e.target as HTMLInputElement).files
                                );
                              };
                              input.click();
                            }}
                          >
                            <Upload className="mr-2 w-4 h-4" />
                            {createMemorialTranslations.media.photos.button}
                          </Button>
                          <p className="mt-2 text-gray-500 text-xs">
                            {createMemorialTranslations?.mediaSupport?.photos ||
                              'Supported: JPEG, PNG, WebP'}
                          </p>
                          {mediaFiles.photos.length > 0 && (
                            <div className="mt-4 w-full">
                              <p className="mb-2 font-medium text-xs">
                                Selected Photos
                              </p>
                              <div className="space-y-1">
                                {mediaFiles.photos.map((photo, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                                  >
                                    <span className="text-xs truncate">
                                      {photo.name}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="w-4 h-4"
                                      onClick={() => removePhoto(index)}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Video Upload */}
                      <Card className="border-2 border-gray-300 hover:border-gray-400 border-dashed transition-colors">
                        <CardContent className="flex flex-col justify-center items-center p-6 text-center">
                          <Video className="mb-4 w-12 h-12 text-gray-400" />
                          <h3 className="mb-2 font-semibold text-gray-900">
                            {createMemorialTranslations.media.videos.title}
                          </h3>
                          <p className="mb-4 text-gray-500 text-sm">
                            {
                              createMemorialTranslations.media.videos
                                .description
                            }
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.multiple = true;
                              input.accept = 'video/*';
                              input.onchange = (e) => {
                                handleVideosUpload(
                                  (e.target as HTMLInputElement).files
                                );
                              };
                              input.click();
                            }}
                          >
                            <Upload className="mr-2 w-4 h-4" />
                            {createMemorialTranslations.media.videos.button}
                          </Button>
                          <p className="mt-2 text-gray-500 text-xs">
                            {createMemorialTranslations?.mediaSupport?.videos ||
                              'Supported: MP4, MOV • Max 1min'}
                          </p>
                          {mediaFiles.videos.length > 0 && (
                            <div className="mt-4 w-full">
                              <p className="mb-2 font-medium text-xs">
                                Selected Videos ({mediaFiles.videos.length})
                              </p>
                              <div className="space-y-2">
                                {mediaFiles.videos.map((video, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
                                  >
                                    <div className="flex flex-1 items-center gap-2 min-w-0">
                                      <Video className="flex-shrink-0 w-4 h-4 text-blue-500" />
                                      <span
                                        className="font-medium text-gray-900 text-sm truncate"
                                        title={video.title}
                                      >
                                        {video.title}
                                      </span>
                                    </div>
                                    <div className="ml-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeVideo(index)}
                                        className="hover:bg-red-50 p-0 w-8 h-8 text-red-500 hover:text-red-700"
                                        title="Remove video"
                                      >
                                        <X className="w-4 h-4" />
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
                      <Card className="border-2 border-gray-300 hover:border-gray-400 border-dashed transition-colors">
                        <CardContent className="flex flex-col justify-center items-center p-6 text-center">
                          <FileText className="mb-4 w-12 h-12 text-gray-400" />
                          <h3 className="mb-2 font-semibold text-gray-900">
                            {createMemorialTranslations.media.documents.title}
                          </h3>
                          <p className="mb-4 text-gray-500 text-sm">
                            {
                              createMemorialTranslations.media.documents
                                .description
                            }
                          </p>
                          <Button
                            variant="outline"
                            disabled={userSubscription !== 'Premium'}
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.multiple = true;
                              input.accept = '.pdf,.doc,.docx,.txt';
                              input.onchange = (e) => {
                                handleDocumentsUpload(
                                  (e.target as HTMLInputElement).files
                                );
                              };
                              input.click();
                            }}
                          >
                            <Upload className="mr-2 w-4 h-4" />
                            {createMemorialTranslations.media.documents.button}
                          </Button>
                          <p className="mt-2 text-gray-500 text-xs">
                            {createMemorialTranslations?.mediaSupport
                              ?.documents || 'Supported: PDF, DOC, DOCX, TXT'}
                          </p>
                          {mediaFiles.documents.length > 0 && (
                            <div className="mt-4 w-full">
                              <p className="mb-2 font-medium text-xs">
                                Selected Documents
                              </p>
                              <div className="space-y-1">
                                {mediaFiles.documents.map((doc, index) => (
                                  <div
                                    key={`doc-${index}-${doc.fileName}`}
                                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                                  >
                                    <span className="text-xs truncate">
                                      {doc.fileName}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="w-4 h-4"
                                      onClick={() => removeDocument(index)}
                                    >
                                      <X className="w-3 h-3" />
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
              {userSubscription === 'Free' ? (
                <SubscriptionRestricted />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 w-5 h-5 text-green-500" />
                      {createMemorialTranslations.familyTree.title}
                    </CardTitle>
                    <CardDescription>
                      {createMemorialTranslations.familyTree.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="familyMemberName">
                            {createMemorialTranslations.familyTree.familyMember}
                          </Label>
                          <Input
                            id="familyMemberName"
                            placeholder={
                              createMemorialTranslations.familyTree.placeholder
                                .name
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
                            {createMemorialTranslations.familyTree.relationship}
                          </Label>
                          <Input
                            id="familyMemberRelationship"
                            placeholder={
                              createMemorialTranslations.familyTree.placeholder
                                .relationship
                            }
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
                        <Users className="mr-2 w-4 h-4" />
                        {
                          createMemorialTranslations?.familyTree?.placeholder
                            ?.button
                        }
                      </Button>

                      {mediaFiles.familyTree.length > 0 && (
                        <div className="mt-6">
                          <h3 className="mb-4 font-semibold text-gray-900">
                            {
                              createMemorialTranslations?.familyTree?.members
                                ?.title
                            }
                          </h3>
                          <div className="space-y-2">
                            {mediaFiles.familyTree.map((member, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center bg-gray-100 p-3 rounded"
                              >
                                <div>
                                  <p className="font-medium">{member.name}</p>
                                  <p className="text-gray-500 text-sm">
                                    {member.relationship}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="w-8 h-8"
                                  onClick={() => removeFamilyMember(index)}
                                >
                                  <X className="w-4 h-4" />
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

          <div className="flex justify-center mt-8">
            <Button
              className="bg-[#547455] hover:bg-[#243b31] px-8 py-3 text-white text-lg"
              onClick={(e) => handleSaveMemorial(e)}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="mr-2 border-white border-b-2 rounded-full w-5 h-5 animate-spin"></div>
                  {createMemorialTranslations?.buttons?.saving || 'Saving...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 w-5 h-5" />
                  {isEditing
                    ? createMemorialTranslations?.buttons?.updateMemorial ||
                      'Update Memorial'
                    : createMemorialTranslations.header.save}
                </>
              )}
            </Button>
          </div>

          {!isFormValid() && (
            <div className="mt-4 text-center">
              <p className="text-red-500 text-sm">
                ⚠️ Required: Upload a photo and enter first name
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
