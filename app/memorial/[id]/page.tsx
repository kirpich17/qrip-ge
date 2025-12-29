'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import { Lightbox } from '@/components/ui/lightbox';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslate';
import {
  getSingleMemorial,
  getMyMemorialById,
  recordMemorialView,
} from '@/services/memorialService';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Image from 'next/image';
import LanguageDropdown from '@/components/languageDropdown/page';
import { Dialog, DialogContent } from '@/components/ui/dialog';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
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
  allowSlideshow: boolean;
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
  allowSlideshow = false,
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
  const memorialTranslations = t('memorial');
  const [isInitialView, setIsInitialView] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const premiumSlides = useMemo(() => {
    const slides = [
      {
        image: profilePhoto || '/placeholder.svg',
        text: `Remembering ${firstName} ${lastName}`,
        years: `${new Date(birthDate).getFullYear()} - ${new Date(
          deathDate
        ).getFullYear()}`,
      },
    ];
    if (photoGallery.length > 0) {
      slides.push({
        image: photoGallery[0],
        text: 'Celebrating a life well lived',
        years: '',
      });
    }
    if (photoGallery.length > 1) {
      slides.push({
        image: photoGallery[1],
        text: 'Honoring their legacy',
        years: '',
      });
    }

    return slides;
  }, [profilePhoto, firstName, lastName, birthDate, deathDate, photoGallery]);

  useEffect(() => {
    if (!isInitialView || premiumSlides.length <= 1 || !allowSlideshow) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % premiumSlides.length);
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
      y: direction > 0 ? 50 : -50,
    }),
    center: {
      opacity: 1,
      y: 0,
    },
    exit: (direction: number) => ({
      opacity: 0,
      y: direction < 0 ? 50 : -50,
    }),
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
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
                src={
                  hasPremium
                    ? premiumSlides[currentSlide].image
                    : profilePhoto || '/default-profile.jpg'
                }
                alt={`${firstName} ${lastName} memorial`}
                fill
                className="blur-md object-cover"
                quality={30}
                priority
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}

            <div className="z-10 relative flex flex-col justify-center items-center p-4 h-full text-white text-center">
              {premiumSlides.length > 1 && allowSlideshow ? (
                <div className="mx-auto max-w-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      custom={1}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="space-y-6"
                    >
                      <div className="relative shadow-xl mx-auto border-4 border-white rounded-lg w-64 h-64 overflow-hidden">
                        <Image
                          src={premiumSlides[currentSlide].image}
                          alt="Memorial slide"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <h1 className="mt-6 font-bold text-4xl">
                        {memorialTranslations?.inLovingMemory ||
                          'In Loving Memory'}
                      </h1>
                      <h2 className="font-semibold text-3xl">
                        {firstName} {lastName}
                      </h2>
                      <p className="mt-2 text-xl">
                        {new Date(birthDate).getFullYear()} -{' '}
                        {new Date(deathDate).getFullYear()}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {premiumSlides.length > 1 && (
                    <>
                      <div className="flex justify-center space-x-2 mt-4">
                        {premiumSlides.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentSlide(index);
                            }}
                            className={`w-3 h-3 rounded-full transition-colors ${
                              currentSlide === index
                                ? 'bg-white'
                                : 'bg-white/50'
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
                        {memorialTranslations?.premiumSlides?.tapToView ||
                          'Tap to view memorial'}
                      </motion.p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <div className="relative bg-white shadow-xl border-4 border-white rounded-[10px] w-64 h-64 overflow-hidden">
                    <Image
                      src={profilePhoto || '/default-profile.jpg'}
                      alt={`${firstName} ${lastName}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <h1 className="mt-6 font-bold text-4xl">
                    {memorialTranslations?.inLovingMemory || 'In Loving Memory'}
                  </h1>
                  <h2 className="font-semibold text-3xl">
                    {firstName} {lastName}
                  </h2>
                  <p className="mt-2 text-xl">
                    {new Date(birthDate).getFullYear()} -{' '}
                    {new Date(deathDate).getFullYear()}
                  </p>
                  <motion.p
                    className="mt-8 text-lg"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {memorialTranslations?.tapToViewMemorial ||
                      'Tap to view memorial'}
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
  const memorialTranslations = t('memorial');
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
  const isScan = searchParams.get('isScan') === 'true';
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
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
                isScan,
              });
              viewRecordedRef.current = true; // Mark as recorded
            } catch (scanError) {
              console.error('Failed to record scan view:', scanError);
            }
          }
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (err: any) {
        console.error('Error fetching memorial:', err);
        // Use the specific error message from the API response
        const errorMessage =
          err.response?.data?.message || 'Failed to load memorial data';
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

  // Video slideshow functionality

  // Auto-start video slideshow თუ მრავალი ვიდეოა

  // Auto-start slideshow when there are multiple images
  useEffect(() => {
    if (
      apiMemorial?.photoGallery &&
      apiMemorial.photoGallery.length > 1 &&
      !isSlideshowPlaying
    ) {
      setIsSlideshowPlaying(true);
    }
  }, [apiMemorial?.photoGallery?.length, isSlideshowPlaying]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthDate: string, deathDate: string) => {
    const birth = new Date(birthDate);
    const death = new Date(deathDate);
    let age = death.getFullYear() - birth.getFullYear();
    const monthDiff = death.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && death.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    // Determine if it's a deactivation error
    const isDeactivated = error.includes('deactivated by the administrator');
    const isNotPublic = error.includes('not publicly accessible');

    return (
      <div className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                isDeactivated
                  ? 'bg-orange-100'
                  : isNotPublic
                  ? 'bg-yellow-100'
                  : 'bg-gray-200'
              }`}
            >
              <Lock
                className={`h-8 w-8 ${
                  isDeactivated
                    ? 'text-orange-600'
                    : isNotPublic
                    ? 'text-yellow-600'
                    : 'text-gray-400'
                }`}
              />
            </div>
            <h2 className="mb-2 font-semibold text-gray-900 text-xl">
              {isDeactivated
                ? 'Memorial Deactivated'
                : isNotPublic
                ? 'Memorial Not Public'
                : 'Error Loading Memorial'}
            </h2>
            <p className="mb-6 text-gray-600">{error}</p>
            <div className="space-y-3">
              {isDeactivated && (
                <Button variant="outline" className="bg-transparent w-full">
                  Contact Support
                </Button>
              )}
              <Link href="/">
                <Button className="bg-gradient-to-r from-indigo-600 hover:from-indigo-700 to-purple-600 hover:to-purple-700 w-full">
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
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div>
          {memorialTranslations?.noMemorialData || 'No memorial data found'}
        </div>
      </div>
    );
  }

  if (apiMemorial.status === 'inactive') {
    return (
      <div className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="flex justify-center items-center bg-gray-200 mx-auto mb-4 rounded-full w-16 h-16">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="mb-2 font-semibold text-gray-900 text-xl">
              {memorialTranslations?.memorialUnavailable ||
                'Memorial Unavailable'}
            </h2>
            <p className="mb-6 text-gray-600">
              {memorialTranslations?.memorialInactive ||
                'This memorial profile is currently inactive.'}
            </p>
            <div className="space-y-3">
              <Button variant="outline" className="bg-transparent w-full">
                {memorialTranslations?.contactSupport || 'Contact Support'}
              </Button>
              <Link href="/">
                <Button className="bg-gradient-to-r from-indigo-600 hover:from-indigo-700 to-purple-600 hover:to-purple-700 w-full">
                  {memorialTranslations?.returnHome || 'Return Home'}
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
        hasPremium={apiMemorial.plan === 'Premium'}
        birthDate={apiMemorial.birthDate}
        deathDate={apiMemorial.deathDate}
        photoGallery={apiMemorial.photoGallery}
        allowSlideshow={apiMemorial.allowSlideshow}
      />
    );
  }

  const age = calculateAge(apiMemorial.birthDate, apiMemorial.deathDate);
  const formattedDates = `${formatDate(apiMemorial.birthDate)} - ${formatDate(
    apiMemorial.deathDate
  )}`;
  const name = `${apiMemorial.firstName} ${apiMemorial.lastName}`;
  const isPremium =
    apiMemorial.planName === 'Premium' ||
    apiMemorial.planName === 'Premium Plan';

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
    setCurrentImageIndex(
      (prev) => (prev + 1) % apiMemorial.photoGallery.length
    );
  };

  const prevImage = () => {
    if (!apiMemorial.photoGallery?.length) return;
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + apiMemorial.photoGallery.length) %
        apiMemorial.photoGallery.length
    );
  };

  const nextVideo = () => {
    if (!apiMemorial?.videoGallery?.length) return;
    setCurrentVideoIndex(
      (prev) => (prev + 1) % apiMemorial.videoGallery.length
    );
  };

  const prevVideo = () => {
    if (!apiMemorial?.videoGallery?.length) return;
    setCurrentVideoIndex(
      (prev) =>
        (prev - 1 + apiMemorial.videoGallery.length) %
        apiMemorial.videoGallery.length
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="top-0 z-[9999] sticky bg-[#243b31]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-2 rounded-xl"
              >
                <QrCode className="w-5 h-5 text-[#243b31]" />
              </motion.div>
              <span className="font-bold text-white text-2xl">QRIP.ge</span>
            </Link>
            <div className="flex gap-3">
              <LanguageDropdown />
              <div className="flex items-center space-x-3">
                <Badge
                  variant="secondary"
                  className="bg-indigo-100 text-indigo-800"
                >
                  {apiMemorial.viewsCount?.toLocaleString() || 0}{' '}
                  {memorialTranslations?.header?.views || 'Views'}
                </Badge>
                {/* <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4" />
                {memorialTranslations.header.share}
              </Button> */}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
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
                    <div className="flex md:flex-row flex-col items-center md:space-x-8 space-y-6 md:space-y-0">
                      <div
                        className="group cursor-pointer"
                        onClick={() => {
                          // Create a combined array with profile image first, then gallery images
                          const allImages = [
                            apiMemorial.profileImage,
                            ...(apiMemorial.photoGallery || []),
                          ].filter(Boolean);
                          if (allImages.length > 0) {
                            setLightboxIndex(0); // Profile image is always first
                            setIsLightboxOpen(true);
                          }
                        }}
                      >
                        <Avatar className="ring-4 ring-white/20 group-hover:ring-white/40 w-32 md:w-40 h-32 md:h-40 transition-all duration-300">
                          <AvatarImage
                            src={apiMemorial.profileImage || '/placeholder.svg'}
                          />
                          <AvatarFallback className="text-4xl">
                            {name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="flex-1 md:text-left text-center">
                        <div className="flex justify-center md:justify-start items-center space-x-2 mb-2">
                          <h1 className="font-bold text-3xl md:text-4xl">
                            {name}
                          </h1>
                          {isPremium && (
                            <Crown className="w-6 h-6 text-yellow-300" />
                          )}
                        </div>
                        <p className="mb-2 text-white/90 text-xl">
                          {formattedDates}
                        </p>
                        {apiMemorial.location && (
                          <p className="flex justify-center md:justify-start items-center text-white/80">
                            <MapPin className="mr-1 w-4 h-4" />
                            {apiMemorial.location}
                          </p>
                        )}
                        <p className="mt-2 text-white/80">
                          {memorialTranslations?.profile?.age?.replace(
                            '{age}',
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
          <div className="gap-8 lg:grid lg:grid-cols-3 w-full max-w-[1440px]">
            {/* Left Column - Main Content */}
            <div className="space-y-8 lg:col-span-2">
              {/* Media Gallery */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {memorialTranslations?.tabs?.memories || 'Memories'}
                    </CardTitle>
                    <CardDescription>
                      {memorialTranslations?.tabs?.description ||
                        'View photos and videos'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="photos" className="w-full">
                      <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="photos">
                          {memorialTranslations?.tabs?.photos || 'Photos'}
                        </TabsTrigger>
                        <TabsTrigger value="video">
                          {memorialTranslations?.tabs?.video || 'Video'}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="photos" className="mt-6">
                        <div className="space-y-4">
                          {/* Slideshow Controls */}
                          {apiMemorial.photoGallery?.length > 1 && (
                            <div className="flex justify-center items-center bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={prevImage}
                                  disabled={!apiMemorial.photoGallery?.length}
                                  className="flex items-center space-x-1"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                  <span className="hidden sm:inline text-xs">
                                    {memorialTranslations?.navigation?.prev ||
                                      'Prev'}
                                  </span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={nextImage}
                                  disabled={!apiMemorial.photoGallery?.length}
                                  className="flex items-center space-x-1"
                                >
                                  <span className="hidden sm:inline text-xs">
                                    {memorialTranslations?.navigation?.next ||
                                      'Next'}
                                  </span>
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Main Image */}
                          <div
                            className="group relative cursor-pointer"
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
                                '/placeholder.svg'
                              }
                              alt={`Memory ${currentImageIndex + 1}`}
                              className="hover:opacity-90 rounded-lg w-full h-96 object-cover transition-opacity duration-300"
                            />

                            {/* Navigation overlay - only show on hover for desktop */}
                            {apiMemorial.photoGallery?.length > 1 && (
                              <div className="absolute inset-0 flex justify-between items-center opacity-0 group-hover:opacity-100 p-4 transition-opacity duration-300">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={prevImage}
                                  className="bg-black/50 hover:bg-black/70 text-white"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={nextImage}
                                  className="bg-black/50 hover:bg-black/70 text-white"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Thumbnail Strip */}
                          {apiMemorial.photoGallery?.length > 1 && (
                            <div className="space-y-3">
                              <div className="flex space-x-2 pb-2 overflow-x-auto scrollbar-hide">
                                {apiMemorial.photoGallery.map(
                                  (image, index) => (
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
                                          ? 'border-[#547455] ring-2 ring-[#547455]/20'
                                          : 'border-gray-200 hover:border-gray-300'
                                      }`}
                                    >
                                      <img
                                        src={image || '/placeholder.svg'}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </button>
                                  )
                                )}
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
                                        ? 'bg-[#547455] w-6'
                                        : 'bg-gray-300 hover:bg-gray-400'
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
                            {/* Slideshow Controls - მხოლოდ თუ მრავალი ვიდეოა */}
                            {apiMemorial.videoGallery.length > 1 && (
                              <div className="flex justify-center items-center bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={prevVideo}
                                    className="flex items-center space-x-1"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                    <span className="hidden sm:inline text-xs">
                                      {memorialTranslations?.navigation?.prev ||
                                        'Prev'}
                                    </span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={nextVideo}
                                    className="flex items-center space-x-1"
                                  >
                                    <span className="hidden sm:inline text-xs">
                                      {memorialTranslations?.navigation?.next ||
                                        'Next'}
                                    </span>
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Main Video */}
                            <div
                              className="group relative bg-black rounded-lg aspect-video overflow-hidden cursor-pointer"
                              onClick={() => setIsVideoDialogOpen(true)}
                            >
                              <video
                                ref={videoRef}
                                src={formatVideoUrl(
                                  apiMemorial.videoGallery[currentVideoIndex]
                                )}
                                className="absolute inset-0 w-full h-full object-contain"
                                muted={isVideoMuted}
                                onPlay={() => setIsVideoPlaying(true)}
                                onPause={() => setIsVideoPlaying(false)}
                                onLoadStart={() => {
                                  setVideoLoading(true);
                                  setVideoError(null);
                                }}
                                onCanPlay={() => setVideoLoading(false)}
                                onError={(e) => {
                                  setVideoLoading(false);
                                  setVideoError('Video failed to load');
                                  const fallback = document.getElementById(
                                    'video-error-fallback'
                                  );
                                  if (fallback)
                                    fallback.classList.remove('hidden');
                                }}
                              />

                              {/* Loading */}
                              {videoLoading && (
                                <div className="absolute inset-0 flex justify-center items-center bg-black/50">
                                  <div className="border-white border-b-2 rounded-full w-8 h-8 animate-spin"></div>
                                </div>
                              )}

                              {!videoLoading && !videoError && (
                                <div className="absolute inset-0 flex justify-center items-center">
                                  <Button
                                    size="lg"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (videoRef.current) {
                                        isVideoPlaying
                                          ? videoRef.current.pause()
                                          : videoRef.current.play();
                                      }
                                    }}
                                    className="bg-[#8c85858a] hover:bg-white/30 backdrop-blur-sm text-white"
                                  >
                                    {isVideoPlaying ? (
                                      <Pause className="w-8 h-8" />
                                    ) : (
                                      <Play className="ml-1 w-8 h-8" />
                                    )}
                                  </Button>
                                </div>
                              )}

                              <div className="right-4 bottom-4 absolute">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsVideoMuted(!isVideoMuted);
                                  }}
                                  className="bg-black/50 hover:bg-black/70 text-white"
                                >
                                  {isVideoMuted ? (
                                    <VolumeX className="w-4 h-4" />
                                  ) : (
                                    <Volume2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </div>

                              {/* Navigation overlay on hover */}
                              {apiMemorial.videoGallery.length > 1 && (
                                <div className="absolute inset-0 flex justify-between items-center opacity-0 group-hover:opacity-100 p-4 transition-opacity duration-300">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      prevVideo();
                                    }}
                                    className="bg-black/50 hover:bg-black/70 text-white"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      nextVideo();
                                    }}
                                    className="bg-black/50 hover:bg-black/70 text-white"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}

                              <div
                                id="video-error-fallback"
                                className="hidden absolute inset-0 flex justify-center items-center bg-red-100 p-4 text-red-800"
                              >
                                <div className="text-center">
                                  <p className="font-semibold">
                                    Video failed to load
                                  </p>
                                  <p className="text-sm">
                                    Please check the video URL or try refreshing
                                    the page
                                  </p>
                                </div>
                              </div>
                            </div>

                            {apiMemorial.videoGallery.length > 1 && (
                              <div className="space-y-3">
                                <div className="flex space-x-2 pb-2 overflow-x-auto scrollbar-hide">
                                  {apiMemorial.videoGallery.map(
                                    (videoUrl, index) => (
                                      <button
                                        key={index}
                                        onClick={() => {
                                          setCurrentVideoIndex(index);
                                        }}
                                        className={`flex-shrink-0 w-24 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                                          index === currentVideoIndex
                                            ? 'border-[#547455] ring-2 ring-[#547455]/20'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                      >
                                        <video
                                          src={formatVideoUrl(videoUrl)}
                                          className="w-full h-full object-cover"
                                          muted
                                          preload="metadata"
                                        />
                                      </button>
                                    )
                                  )}
                                </div>

                                {/* Dots */}
                                <div className="flex justify-center space-x-2">
                                  {apiMemorial.videoGallery.map((_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => {
                                        setCurrentVideoIndex(index);
                                      }}
                                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        index === currentVideoIndex
                                          ? 'bg-[#547455] w-6'
                                          : 'bg-gray-300 hover:bg-gray-400'
                                      }`}
                                      aria-label={`Go to video ${index + 1}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <h3 className="font-semibold text-gray-900">
                                Memorial Video
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {memorialTranslations?.video?.description ||
                                  'Memorial video'}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 py-12 rounded-lg text-center">
                            <Lock className="mx-auto mb-4 w-12 h-12 text-gray-300" />
                            <h3 className="mb-2 font-semibold text-gray-900 text-lg">
                              {memorialTranslations?.video?.noVideosTitle ||
                                'No Videos Available'}
                            </h3>
                            <p className="mb-4 text-gray-600">
                              {memorialTranslations?.video?.noVideosMessage ||
                                "This memorial doesn't have any videos yet"}
                            </p>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="mr-2 w-5 h-5 text-[#243b31]" />
                      {memorialTranslations?.tabs?.lifeStory || 'Life Story'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-w-none prose prose-gray">
                      {apiMemorial.biography ? (
                        apiMemorial.biography
                          .split('\n\n')
                          .map((paragraph, index) => (
                            <p
                              key={index}
                              className="mb-4 text-gray-700 leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          ))
                      ) : (
                        <p className="text-gray-500 italic">
                          {(memorialTranslations as any)?.sections?.biography
                            ?.noBiography || 'No biography available'}
                        </p>
                      )}
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
                      <Users className="mr-2 w-5 h-5 text-green-500" />
                      {memorialTranslations?.sections?.family?.title ||
                        'Family'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {apiMemorial.familyTree?.length > 0 ? (
                      <div className="space-y-3">
                        {apiMemorial.familyTree.map((member, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {member.name || 'Family Member'}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {member.relationship || 'Relative'}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-gray-600 text-sm">
                          {memorialTranslations?.sections?.family?.noFamily ||
                            'No family members added yet'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Location */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 w-5 h-5 text-blue-500" />
                      {memorialTranslations?.sections?.location?.title ||
                        'Location'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {
                      // isPremium ? (
                      apiMemorial?.gps?.lat && apiMemorial?.gps?.lng ? (
                        <div className="space-y-4">
                          <div className="border rounded-lg h-64 overflow-hidden map-container">
                            <MapContainer
                              center={[
                                apiMemorial.gps.lat,
                                apiMemorial.gps.lng,
                              ]}
                              zoom={15}
                              style={{ height: '100%', width: '100%' }}
                              className="map-container"
                            >
                              <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              />
                              <Marker
                                position={[
                                  apiMemorial.gps.lat,
                                  apiMemorial.gps.lng,
                                ]}
                              >
                                <Popup>
                                  <div className="text-center">
                                    <strong>
                                      {apiMemorial.location ||
                                        'Memorial Location'}
                                    </strong>
                                    <br />
                                    <small className="text-gray-600">
                                      {apiMemorial.gps.lat.toFixed(6)},{' '}
                                      {apiMemorial.gps.lng.toFixed(6)}
                                    </small>
                                  </div>
                                </Popup>
                              </Marker>
                            </MapContainer>
                          </div>

                          {/* Coordinate Display */}
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center text-sm">
                              <div>
                                <span className="font-medium text-gray-700">
                                  {memorialTranslations?.sections?.location
                                    ?.preciseLocation || 'Precise Location:'}
                                </span>
                                <div className="text-gray-600">
                                  <div>
                                    Lat: {apiMemorial.gps?.lat.toFixed(6)}
                                  </div>
                                  <div>
                                    Lng: {apiMemorial.gps?.lng.toFixed(6)}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `${apiMemorial.gps?.lat}, ${apiMemorial.gps?.lng}`
                                  );
                                  // You could add a toast notification here
                                }}
                              >
                                {memorialTranslations?.sections?.location
                                  ?.copyCoordinates || 'Copy Coordinates'}
                              </Button>
                            </div>
                          </div>

                          <div className="flex sm:flex-row flex-col gap-2">
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
                              {memorialTranslations?.sections?.location
                                ?.getDirections || 'Get Directions'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-center"
                              onClick={() => {
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${apiMemorial.gps?.lat},${apiMemorial.gps?.lng}`,
                                  '_blank'
                                );
                              }}
                            >
                              {memorialTranslations?.sections?.location
                                ?.viewOnGoogleMaps || 'View on Google Maps'}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-6 text-center">
                          <MapPin className="mx-auto mb-2 w-8 h-8 text-gray-300" />
                          <p className="text-gray-600 text-sm">
                            {memorialTranslations?.sections?.location
                              ?.noLocation || 'No location specified'}
                          </p>
                        </div>
                      )
                    }
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {memorialTranslations?.sections?.achievements?.title ||
                        'Achievements'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {apiMemorial.achievements?.length > 0 ? (
                      <div className="space-y-2">
                        {apiMemorial.achievements.map((achievement, index) => (
                          <div
                            key={index}
                            className="flex items-start space-x-2"
                          >
                            <div className="flex-shrink-0 bg-[#547455] mt-2 rounded-full w-2 h-2"></div>
                            <p className="text-gray-700 text-sm break-all">
                              {achievement}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-6 text-center">
                        <p className="text-gray-600 text-sm">
                          {memorialTranslations?.sections?.achievements
                            ?.noAchievements || 'No achievements listed'}
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
                      {memorialTranslations?.sections?.info?.title ||
                        'Memorial Info'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {memorialTranslations?.sections?.info?.qrCode ||
                          'QR Code'}
                      </span>
                      <Badge variant="outline">{apiMemorial.slug}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {memorialTranslations?.sections?.info?.plan || 'Plan'}
                      </span>
                      <Badge variant={isPremium ? 'default' : 'secondary'}>
                        {apiMemorial.plan}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {memorialTranslations?.sections?.info?.lastUpdated ||
                          'Last Updated'}
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
                          className="bg-transparent w-full"
                        >
                          {memorialTranslations?.sections?.info
                            ?.createMemorial || 'Create Memorial'}
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
        const allImages = [
          apiMemorial.profileImage,
          ...(apiMemorial.photoGallery || []),
        ].filter(Boolean);
        return (
          allImages.length > 0 && (
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
              title={`${apiMemorial.firstName} ${apiMemorial.lastName} - ${
                lightboxIndex === 0
                  ? 'Profile Photo'
                  : `Memory ${lightboxIndex}`
              }`}
            />
          )
        );
      })()}

      {/* Video Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent className="bg-black p-0 w-[90vw] sm:w-[80vw] max-w-[90vw] sm:max-w-[80vw]">
          <div className="flex justify-center items-center bg-black w-full h-full">
            <video
              src={formatVideoUrl(
                apiMemorial.videoGallery?.[currentVideoIndex] || ''
              )}
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
