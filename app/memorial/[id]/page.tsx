"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MapPin,
  Users,
  Share2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  QrCode,
  Crown,
  Lock,
} from "lucide-react";
import { Lightbox } from "@/components/ui/lightbox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";
import { getSingleMemorial, getMyMemorialById, recordMemorialView } from "@/services/memorialService";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Image from 'next/image';
import LanguageDropdown from "@/components/languageDropdown/page";
import { Dialog, DialogContent } from "@/components/ui/dialog";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface Memorial {
  _id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  deathDate: string;
  biography: string;
  profileImage: string;
  photoGallery: string[];
  videoGallery: string[];
  status: string;
  plan: string;
  planName?: string;
  views: number;
  viewsCount?: number;
  slug: string;
  isPublic: boolean;
  allowComments: boolean;
  enableEmailNotifications: boolean;
  achievements: string[];
  familyTree: any[];
  gps?: { lat: number; lng: number };
  location?: string;
  createdAt: string;
  updatedAt: string;
  allowSlideshow: boolean
}

function QRPageTransition({
  profilePhoto,
  memorialId,
  firstName,
  lastName,
  hasPremium,
  birthDate,
  deathDate,
  photoGallery = [],
  allowSlideshow = false
}: {
  profilePhoto: string;
  memorialId: string;
  firstName: string;
  lastName: string;
  hasPremium: boolean;
  birthDate: string;
  deathDate: string;
  photoGallery?: string[];
  allowSlideshow?: boolean;
}) {
  const { t } = useTranslation();
  const memorialTranslations = t("memorial");
  const [isInitialView, setIsInitialView] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const premiumSlides = useMemo(() => {
    const slides = [
      {
        image: profilePhoto || '/placeholder.svg',
        text: `Remembering ${firstName} ${lastName}`,
        years: `${new Date(birthDate).getFullYear()} - ${new Date(deathDate).getFullYear()}`
      }
    ];
    // Add up to 2 gallery images if they exist
    if (photoGallery.length > 0) {
      slides.push({
        image: photoGallery[0],
        text: "Celebrating a life well lived",
        years: ""
      });
    }
    if (photoGallery.length > 1) {
      slides.push({
        image: photoGallery[1],
        text: "Honoring their legacy",
        years: ""
      });
    }

    return slides;
  }, [profilePhoto, firstName, lastName, birthDate, deathDate, photoGallery]);

  useEffect(() => {
    if (!isInitialView || premiumSlides.length <= 1 || !allowSlideshow) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % premiumSlides.length);
    }, 4000); // 4 seconds per slide

    return () => clearInterval(interval);
  }, [isInitialView, premiumSlides.length, allowSlideshow]);

  const handleClick = () => {
    setIsInitialView(false);
    setTimeout(() => {
      router.push(`/memorial/${memorialId}`);
    }, 500);
  };

  // Custom animation variants with TypeScript type
  const slideVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      y: direction > 0 ? 50 : -50
    }),
    center: {
      opacity: 1,
      y: 0
    },
    exit: (direction: number) => ({
      opacity: 0,
      y: direction < 0 ? 50 : -50
    })
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {isInitialView ? (
          <motion.div
            key="initial-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full cursor-pointer"
            onClick={handleClick}
          >
            {/* Background blur */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={hasPremium ? premiumSlides[currentSlide].image : profilePhoto || '/default-profile.jpg'}
                alt={`${firstName} ${lastName} memorial`}
                fill
                className="object-cover blur-md"
                quality={30}
                priority
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}

            <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center text-white">
              {premiumSlides.length > 1 && allowSlideshow ? (
                <div className="max-w-2xl mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                      className="space-y-6"
                    >
                      <div className="relative h-64 w-64 mx-auto rounded-lg overflow-hidden border-4 border-white shadow-xl">
                        <Image
                          src={premiumSlides[currentSlide].image}
                          alt="Memorial slide"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <h1 className="mt-6 text-4xl font-bold">{memorialTranslations?.inLovingMemory || "In Loving Memory"}</h1>
                      <h2 className="text-3xl font-semibold">
                        {firstName} {lastName}
                      </h2>
                      <p className="text-xl mt-2">
                        {new Date(birthDate).getFullYear()} - {new Date(deathDate).getFullYear()}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {premiumSlides.length > 1 && (
                    <>
                      <div className="flex justify-center mt-4 space-x-2">
                        {premiumSlides.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentSlide(index);
                            }}
                            className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-white' : 'bg-white/50'
                              }`}
                            aria-label={`Go to slide ${index + 1}`}
                          />
                        ))}
                      </div>
                      <motion.p
                        className="mt-4 text-lg"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {memorialTranslations?.premiumSlides?.tapToView || "Tap to view memorial"}
                      </motion.p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="relative h-64 w-64 rounded-[10px] overflow-hidden border-4 border-white shadow-xl bg-white">
                    <Image
                      src={profilePhoto || '/default-profile.jpg'}
                      alt={`${firstName} ${lastName}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <h1 className="mt-6 text-4xl font-bold">{memorialTranslations?.inLovingMemory || "In Loving Memory"}</h1>
                  <h2 className="text-3xl font-semibold">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-xl mt-2">
                    {new Date(birthDate).getFullYear()} - {new Date(deathDate).getFullYear()}
                  </p>
                  <motion.p
                    className="mt-8 text-lg"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {memorialTranslations?.tapToViewMemorial || "Tap to view memorial"}
                  </motion.p>
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-white"
          />
        )}
      </AnimatePresence>
    </div>
  );
}




export default function MemorialPage() {
  const params = useParams();
  const { t } = useTranslation();
  const memorialTranslations = t("memorial");
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [apiMemorial, setApiMemorial] = useState<Memorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const slideshowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const viewRecordedRef = useRef<boolean>(false); // Track if view has been recorded
  const isScan = searchParams.get("isScan") === "true";
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);

  useEffect(() => {
    const fetchMemorial = async () => {
      if (!params?.id) return;
      
      // Reset view recording flag when memorial ID changes
      viewRecordedRef.current = false;
      
      try {
        setLoading(true);
        // First try to get the memorial using the private endpoint (for user's own memorials)
        // This allows viewing private memorials that the user owns
        let response;
        try {
          response = await getMyMemorialById(params.id as string);
        } catch (privateError) {
          // If private endpoint fails, try the public endpoint
          response = await getSingleMemorial(params.id as string);
        }
        
        if (response?.status && response.data) {
          setApiMemorial(response.data);
          
          // Only record view once per memorial load
          if (!viewRecordedRef.current) {
            try {
              await recordMemorialView({
                memorialId: params.id as string,
                isScan
              });
              viewRecordedRef.current = true; // Mark as recorded
            } catch (scanError) {
              console.error("Failed to record scan view:", scanError);
            }
          }
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (err: any) {
        console.error("Error fetching memorial:", err);
        // Use the specific error message from the API response
        const errorMessage = err.response?.data?.message || "Failed to load memorial data";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMemorial();
  }, [params?.id, isScan]);

  useEffect(() => {
    if (videoRef.current) {
      isVideoPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
  }, [isVideoPlaying]);

  // Slideshow functionality
  useEffect(() => {
    if (isSlideshowPlaying && apiMemorial?.photoGallery && apiMemorial.photoGallery.length > 1) {
      slideshowIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % apiMemorial.photoGallery!.length);
      }, 3000); // 3 seconds per slide
    } else {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
        slideshowIntervalRef.current = null;
      }
    }

    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    };
  }, [isSlideshowPlaying, apiMemorial?.photoGallery?.length]);

  // Auto-start slideshow when there are multiple images
  useEffect(() => {
    if (apiMemorial?.photoGallery && apiMemorial.photoGallery.length > 1 && !isSlideshowPlaying) {
      setIsSlideshowPlaying(true);
    }
  }, [apiMemorial?.photoGallery?.length, isSlideshowPlaying]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (birthDate: string, deathDate: string) => {
    const birth = new Date(birthDate);
    const death = new Date(deathDate);
    let age = death.getFullYear() - birth.getFullYear();
    const monthDiff = death.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && death.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    // Determine if it's a deactivation error
    const isDeactivated = error.includes("deactivated by the administrator");
    const isNotPublic = error.includes("not publicly accessible");
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDeactivated ? 'bg-orange-100' : isNotPublic ? 'bg-yellow-100' : 'bg-gray-200'
            }`}>
              <Lock className={`h-8 w-8 ${
                isDeactivated ? 'text-orange-600' : isNotPublic ? 'text-yellow-600' : 'text-gray-400'
              }`} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isDeactivated ? 'Memorial Deactivated' : isNotPublic ? 'Memorial Not Public' : 'Error Loading Memorial'}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              {isDeactivated && (
                <Button variant="outline" className="w-full bg-transparent">
                  Contact Support
                </Button>
              )}
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Return Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!apiMemorial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>{memorialTranslations?.noMemorialData || "No memorial data found"}</div>
      </div>
    );
  }

  if (apiMemorial.status === "inactive") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {memorialTranslations?.memorialUnavailable || "Memorial Unavailable"}
            </h2>
            <p className="text-gray-600 mb-6">
              {memorialTranslations?.memorialInactive || "This memorial profile is currently inactive."}
            </p>
            <div className="space-y-3">
              <Button variant="outline" className="w-full bg-transparent">
                {memorialTranslations?.contactSupport || "Contact Support"}
              </Button>
              <Link href="/">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  {memorialTranslations?.returnHome || "Return Home"}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isScan) {
    return (
      <QRPageTransition
        profilePhoto={apiMemorial.profileImage}
        memorialId={params.id as string}
        firstName={apiMemorial.firstName}
        lastName={apiMemorial.lastName}
        hasPremium={apiMemorial.plan === "Premium"}
        birthDate={apiMemorial.birthDate}
        deathDate={apiMemorial.deathDate}
        photoGallery={apiMemorial.photoGallery}
        allowSlideshow={apiMemorial.allowSlideshow}
      />
    );
  }

  const age = calculateAge(apiMemorial.birthDate, apiMemorial.deathDate);
  const formattedDates = `${formatDate(apiMemorial.birthDate)} - ${formatDate(apiMemorial.deathDate)}`;
  const name = `${apiMemorial.firstName} ${apiMemorial.lastName}`;
  const isPremium = apiMemorial.planName === "Premium" || apiMemorial.planName === "Premium Plan"
  
  // Helper function to format video URLs
  const formatVideoUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };
  

  const nextImage = () => {
    if (!apiMemorial.photoGallery?.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % apiMemorial.photoGallery.length);
  };

  const prevImage = () => {
    if (!apiMemorial.photoGallery?.length) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + apiMemorial.photoGallery.length) % apiMemorial.photoGallery.length
    );
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && apiMemorial.photoGallery?.length > 1) {
      nextImage();
      setIsSlideshowPlaying(false); // Pause slideshow on manual interaction
    }
    if (isRightSwipe && apiMemorial.photoGallery?.length > 1) {
      prevImage();
      setIsSlideshowPlaying(false); // Pause slideshow on manual interaction
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] sticky top-0 z-[9999]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white rounded-xl"
              >
                <QrCode className="h-5 w-5 text-[#243b31]" />
              </motion.div>
              <span className="text-2xl font-bold text-white">QRIP.ge</span>
            </Link>
            <div className="flex gap-3">
              <LanguageDropdown />
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                  {apiMemorial.viewsCount?.toLocaleString() || 0}{" "}
                  {memorialTranslations?.header?.views || "Views"}
                </Badge>
                {/* <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
                {memorialTranslations.header.share}
              </Button> */}
              </div>
            </div>

          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Hero Section */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-gradient-to-br from-[#acc09c] to-[#bce09e] text-white">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                      <div 
                        className="cursor-pointer group"
                        onClick={() => {
                          // Create a combined array with profile image first, then gallery images
                          const allImages = [apiMemorial.profileImage, ...(apiMemorial.photoGallery || [])].filter(Boolean);
                          if (allImages.length > 0) {
                            setLightboxIndex(0); // Profile image is always first
                            setIsLightboxOpen(true);
                          }
                        }}
                      >
                        <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-white/20 group-hover:ring-white/40 transition-all duration-300">
                          <AvatarImage
                            src={apiMemorial.profileImage || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-4xl">
                            {name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                          <h1 className="text-3xl md:text-4xl font-bold">
                            {name}
                          </h1>
                          {isPremium && (
                            <Crown className="h-6 w-6 text-yellow-300" />
                          )}
                        </div>
                        <p className="text-xl text-white/90 mb-2">
                          {formattedDates}
                        </p>
                        <p className="text-white/80 flex items-center justify-center md:justify-start">
                          <MapPin className="h-4 w-4 mr-1" />
                          {"Tbilisi, Georgia"}
                        </p>
                        <p className="text-white/80 mt-2">
                          {memorialTranslations?.profile?.age?.replace(
                            "{age}",
                            age.toString()
                          ) || `Age ${age}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">

              {/* Media Gallery */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>{memorialTranslations?.tabs?.memories || "Memories"}</CardTitle>
                    <CardDescription>
                      {memorialTranslations?.tabs?.description || "View photos and videos"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="photos" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="photos">
                          {memorialTranslations?.tabs?.photos || "Photos"}
                        </TabsTrigger>
                        <TabsTrigger
                          value="video"
                        >
                          {memorialTranslations?.tabs?.video || "Video"}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="photos" className="mt-6">
                        <div className="space-y-4">
                          {/* Slideshow Controls */}
                          {apiMemorial.photoGallery?.length > 1 && (
                            <div className="flex items-center justify-center bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={prevImage}
                                  disabled={!apiMemorial.photoGallery?.length}
                                  className="flex items-center space-x-1"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                  <span className="hidden sm:inline text-xs">{memorialTranslations?.navigation?.prev || "Prev"}</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={nextImage}
                                  disabled={!apiMemorial.photoGallery?.length}
                                  className="flex items-center space-x-1"
                                >
                                  <span className="hidden sm:inline text-xs">{memorialTranslations?.navigation?.next || "Next"}</span>
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Main Image */}
                          <div 
                            className="relative group cursor-pointer"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onClick={() => {
                              if (apiMemorial.photoGallery?.length) {
                                setLightboxIndex(currentImageIndex);
                                setIsLightboxOpen(true);
                              }
                            }}
                          >
                            <img
                              src={
                                apiMemorial.photoGallery?.[currentImageIndex] ||
                                "/placeholder.svg"
                              }
                              alt={`Memory ${currentImageIndex + 1}`}
                              className="w-full h-96 object-cover rounded-lg transition-opacity duration-300 hover:opacity-90"
                            />
                            
                            {/* Navigation overlay - only show on hover for desktop */}
                            {apiMemorial.photoGallery?.length > 1 && (
                              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={prevImage}
                                  className="bg-black/50 hover:bg-black/70 text-white"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={nextImage}
                                  className="bg-black/50 hover:bg-black/70 text-white"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Thumbnail Strip */}
                          {apiMemorial.photoGallery?.length > 1 && (
                            <div className="space-y-3">
                              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                                {apiMemorial.photoGallery.map((image, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      setCurrentImageIndex(index);
                                      setIsSlideshowPlaying(false); // Pause slideshow when manually selecting
                                    }}
                                    onDoubleClick={() => {
                                      setLightboxIndex(index);
                                      setIsLightboxOpen(true);
                                    }}
                                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                                      index === currentImageIndex
                                        ? "border-[#547455] ring-2 ring-[#547455]/20"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                                  >
                                    <img
                                      src={image || "/placeholder.svg"}
                                      alt={`Thumbnail ${index + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                              
                              {/* Slideshow Progress Dots */}
                              <div className="flex justify-center space-x-2">
                                {apiMemorial.photoGallery.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      setCurrentImageIndex(index);
                                      setIsSlideshowPlaying(false);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                      index === currentImageIndex
                                        ? "bg-[#547455] w-6"
                                        : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="video" className="mt-6">
                        {apiMemorial.videoGallery?.length > 0 ? (
                          <div className="space-y-4">
                            <div className="relative bg-black rounded-lg overflow-hidden aspect-video cursor-pointer" onClick={() => setIsVideoDialogOpen(true)}>
                              {/* Video Error Fallback */}
                              <div id="video-error-fallback" className="hidden absolute inset-0 flex items-center justify-center bg-red-100 text-red-800 p-4">
                                <div className="text-center">
                                  <p className="font-semibold">Video failed to load</p>
                                  <p className="text-sm">Please check the video URL or try refreshing the page</p>
                                </div>
                              </div>
                              <video
                                ref={videoRef}
                                src={formatVideoUrl(apiMemorial.videoGallery[0])}
                                className="absolute inset-0 w-full h-full object-contain"
                                muted={isVideoMuted}
                                poster="/placeholder.svg?height=300&width=500"
                                onPlay={() => setIsVideoPlaying(true)}
                                onPause={() => setIsVideoPlaying(false)}
                                onLoadStart={() => {
                                  setVideoLoading(true);
                                  setVideoError(null);
                                }}
                                onCanPlay={() => {
                                  setVideoLoading(false);
                                }}
                                onError={(e) => {
                                  setVideoLoading(false);
                                  setVideoError('Video failed to load');
                                  const fallback = document.getElementById('video-error-fallback');
                                  if (fallback) {
                                    fallback.classList.remove('hidden');
                                  }
                                }}
                              />
                              {/* Loading indicator */}
                              {videoLoading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                              )}
                              
                              {/* Play/Pause button */}
                              {!videoLoading && !videoError && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Button
                                    size="lg"
                                    onClick={() => {
                                      if (videoRef.current) {
                                        if (isVideoPlaying) {
                                          videoRef.current.pause();
                                        } else {
                                          videoRef.current.play();
                                        }
                                      }
                                    }}
                                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                                  >
                                    {isVideoPlaying ? (
                                      <Pause className="h-8 w-8" />
                                    ) : (
                                      <Play className="h-8 w-8 ml-1" />
                                    )}
                                  </Button>
                                </div>
                              )}
                              <div className="absolute bottom-4 right-4">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                                  className="bg-black/50 hover:bg-black/70 text-white"
                                >
                                  {isVideoMuted ? (
                                    <VolumeX className="h-4 w-4" />
                                  ) : (
                                    <Volume2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Memorial Video
                              </h3>
                              <p className="text-sm text-gray-600">
                                {memorialTranslations?.video?.description || "Memorial video"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {memorialTranslations?.video?.noVideosTitle || "No Videos Available"}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {memorialTranslations?.video?.noVideosMessage || "This memorial doesn't have any videos yet"}
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
              {/* Biography */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-[#243b31]" />
                      {memorialTranslations?.tabs?.lifeStory || "Life Story"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      {apiMemorial.biography
                        ? apiMemorial.biography.split("\n\n").map((paragraph, index) => (
                            <p
                              key={index}
                              className="text-gray-700 leading-relaxed mb-4"
                            >
                              {paragraph}
                            </p>
                          ))
                        : <p className="text-gray-500 italic">{(memorialTranslations as any)?.sections?.biography?.noBiography || "No biography available"}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>


            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Family Tree */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-green-500" />
                      {memorialTranslations?.sections?.family?.title || "Family"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {
                      apiMemorial.familyTree?.length > 0 ? (
                        <div className="space-y-3">
                          {apiMemorial.familyTree.map((member, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {member.name || "Family Member"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {member.relationship || "Relative"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-600">
                            {memorialTranslations?.sections?.family?.noFamily || "No family members added yet"}
                          </p>
                        </div>
                      )

                    }
                  </CardContent>
                </Card>
              </motion.div>

              {/* Location */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                      {memorialTranslations?.sections?.location?.title || "Location"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {
                      // isPremium ? (
                      apiMemorial?.gps?.lat && apiMemorial?.gps?.lng ? (
                        <div className="space-y-4">
                          <div className="h-64 rounded-lg overflow-hidden border map-container">
                            <MapContainer
                              center={[apiMemorial.gps.lat, apiMemorial.gps.lng]}
                              zoom={15}
                              style={{ height: '100%', width: '100%' }}
                              className="map-container"
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              />
                              <Marker position={[apiMemorial.gps.lat, apiMemorial.gps.lng]}>
                                <Popup>
                                  <div className="text-center">
                                    <strong>{apiMemorial.location || 'Memorial Location'}</strong>
                                    <br />
                                    <small className="text-gray-600">
                                      {apiMemorial.gps.lat.toFixed(6)}, {apiMemorial.gps.lng.toFixed(6)}
                                    </small>
                                  </div>
                                </Popup>
                              </Marker>
                            </MapContainer>
                          </div>
                          
                          {/* Coordinate Display */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                              <div>
                                <span className="font-medium text-gray-700">{memorialTranslations?.sections?.location?.preciseLocation || "Precise Location:"}</span>
                                <div className="text-gray-600">
                                    <div>Lat: {apiMemorial.gps?.lat.toFixed(6)}</div>
                                    <div>Lng: {apiMemorial.gps?.lng.toFixed(6)}</div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(`${apiMemorial.gps?.lat}, ${apiMemorial.gps?.lng}`);
                                  // You could add a toast notification here
                                }}
                              >
                                {memorialTranslations?.sections?.location?.copyCoordinates || "Copy Coordinates"}
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-center"
                              onClick={() => {
                                window.open(
                                  `https://www.google.com/maps/dir/?api=1&destination=${apiMemorial.gps?.lat},${apiMemorial.gps?.lng}`,
                                  '_blank'
                                );
                              }}
                            >
                              {memorialTranslations?.sections?.location?.getDirections || "Get Directions"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-center "
                              onClick={() => {
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${apiMemorial.gps?.lat},${apiMemorial.gps?.lng}`,
                                  '_blank'
                                );
                              }}
                            >
                              {memorialTranslations?.sections?.location?.viewOnGoogleMaps || "View on Google Maps"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            {memorialTranslations?.sections?.location?.noLocation || "No location specified"}
                          </p>
                        </div>
                      )
                      // ) : (
                      //   <div className="text-center py-6">
                      //     <Lock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      //     <p className="text-sm text-gray-600">
                      //       GPS location available with premium 
                      //     </p>
                      //   </div>
                      // )
                    }

                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {memorialTranslations?.sections?.achievements?.title || "Achievements"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {apiMemorial.achievements?.length > 0 ? (
                      <div className="space-y-2">
                        {apiMemorial.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#547455]"></div>
                            <p className="text-sm text-gray-700 break-all">{achievement}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-600">
                          {memorialTranslations?.sections?.achievements?.noAchievements || "No achievements listed"}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Memorial Info */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {memorialTranslations?.sections?.info?.title || "Memorial Info"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {memorialTranslations?.sections?.info?.qrCode || "QR Code"}
                      </span>
                      <Badge variant="outline">{apiMemorial.slug}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {memorialTranslations?.sections?.info?.plan || "Plan"}
                      </span>
                      <Badge variant={isPremium ? "default" : "secondary"}>
                        {apiMemorial.plan}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {memorialTranslations?.sections?.info?.lastUpdated || "Last Updated"}
                      </span>
                      <span className="text-gray-900">
                        {formatDate(apiMemorial.updatedAt)}
                      </span>
                    </div>


                    <Separator />
                    <div className="text-center">
                      <Link href="/">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          {memorialTranslations?.sections?.info?.createMemorial || "Create Memorial"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      {(() => {
        // Create combined images array with profile image first, then gallery images
        const allImages = [apiMemorial.profileImage, ...(apiMemorial.photoGallery || [])].filter(Boolean);
        return allImages.length > 0 && (
          <Lightbox
            isOpen={isLightboxOpen}
            onClose={() => setIsLightboxOpen(false)}
            images={allImages}
            currentIndex={lightboxIndex}
            onIndexChange={(index) => {
              setLightboxIndex(index);
              // Update currentImageIndex only if we're viewing gallery images (not profile image)
              if (index > 0) {
                setCurrentImageIndex(index - 1);
              }
            }}
            title={`${apiMemorial.firstName} ${apiMemorial.lastName} - ${lightboxIndex === 0 ? 'Profile Photo' : `Memory ${lightboxIndex}`}`}
          />
        );
      })()}

      {/* Video Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="max-w-[90vw] w-[90vw] sm:max-w-[80vw] sm:w-[80vw] p-0 bg-black">
          <div className="w-full h-full flex items-center justify-center bg-black">
            <video
              src={formatVideoUrl(apiMemorial.videoGallery?.[0] || '')}
              controls
              autoPlay
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}