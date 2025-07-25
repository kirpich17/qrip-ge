"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
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
import { getSingleMemorial } from "@/services/memorialService";
import { useParams } from "next/navigation";

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
  profileImage:string;
  photoGallery: string[];
  videoGallery: string[];
  status: string;
  plan: string;
  views: number;
  slug: string;
  isPublic: boolean;
  allowComments: boolean;
  enableEmailNotifications: boolean;
  achievements: string[];
  familyTree: any[];
  createdAt: string;
  updatedAt: string;
}

export default function MemorialPage() {
  const params = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [apiMemorial, setApiMemorial] = useState<Memorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { t } = useTranslation();
  const memorialTranslations = t("memorial");

  useEffect(() => {
    if (!params?.id) return;
    const fetchMemorial = async () => {
      try {
        setLoading(true);
        const response = await getSingleMemorial(params.id as string);
        if (response?.status && response.data) {
          setApiMemorial(response.data);
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
  }, [params?.id]);

  useEffect(() => {
    if (videoRef.current) {
      isVideoPlaying ? videoRef.current.play() : videoRef.current.pause();
    }
  }, [isVideoPlaying]);

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
        <div>No memorial data found</div>
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
              Memorial Unavailable
            </h2>
            <p className="text-gray-600 mb-6">
              This memorial profile is currently inactive.
            </p>
            <div className="space-y-3">
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
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

  const age = calculateAge(apiMemorial.birthDate, apiMemorial.deathDate);
  const formattedDates = `${formatDate(apiMemorial.birthDate)} - ${formatDate(apiMemorial.deathDate)}`;
  const name = `${apiMemorial.firstName} ${apiMemorial.lastName}`;
  const isPremium = apiMemorial.plan === "Premium";

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] sticky top-0 z-40">
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
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                {apiMemorial.views?.toLocaleString() || 0}{" "}
                {memorialTranslations.header.views}
              </Badge>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
                {memorialTranslations.header.share}
              </Button>
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
                      <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-white/20">
                        <AvatarImage
                          src={apiMemorial.profileImage || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-4xl">
                          {name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
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
                          {memorialTranslations.profile.age.replace(
                            "{age}",
                            age.toString()
                          )}
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
              {/* Biography */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2 text-[#243b31]" />
                      {memorialTranslations.tabs.lifeStory}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      {apiMemorial.biography
                        .split("\n\n")
                        .map((paragraph, index) => (
                          <p
                            key={index}
                            className="text-gray-700 leading-relaxed mb-4"
                          >
                            {paragraph}
                          </p>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Media Gallery */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>{memorialTranslations.tabs.memories}</CardTitle>
                    <CardDescription>
                      {memorialTranslations.tabs.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="photos" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="photos">
                          {memorialTranslations.tabs.photos}
                        </TabsTrigger>
                        <TabsTrigger
                          value="video"
                          disabled={!isPremium}
                        >
                          {memorialTranslations.tabs.video}{" "}
                          {!isPremium && (
                            <Lock className="h-3 w-3 ml-1" />
                          )}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="photos" className="mt-6">
                        <div className="space-y-4">
                          {/* Main Image */}
                          <div className="relative">
                            <img
                              src={
                                apiMemorial.photoGallery?.[currentImageIndex] ||
                                "/placeholder.svg"
                              }
                              alt={`Memory ${currentImageIndex + 1}`}
                              className="w-full h-96 object-cover rounded-lg"
                            />
                            {apiMemorial.photoGallery?.length > 1 && (
                              <div className="absolute inset-0 flex items-center justify-between p-4">
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
                            <div className="flex space-x-2 overflow-x-auto">
                              {apiMemorial.photoGallery.map((image, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                    index === currentImageIndex
                                      ? "border-[#547455]"
                                      : "border-gray-200"
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
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="video" className="mt-6">
                        {isPremium ? (
                          apiMemorial.videoGallery?.length > 0 ? (
                            <div className="space-y-4">
                              <div className="relative bg-black rounded-lg overflow-hidden">
                                <video
                                  ref={videoRef}
                                  src={apiMemorial.videoGallery[0]}
                                  className="w-full h-64 object-cover"
                                  controls
                                  muted={isVideoMuted}
                                  poster="/placeholder.svg?height=300&width=500"
                                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Button
                                    size="lg"
                                    onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                                    className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                                  >
                                    {isVideoPlaying ? (
                                      <Pause className="h-8 w-8" />
                                    ) : (
                                      <Play className="h-8 w-8 ml-1" />
                                    )}
                                  </Button>
                                </div>
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
                                  {memorialTranslations.video.description}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                              <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No Videos Available
                              </h3>
                              <p className="text-gray-600 mb-4">
                                This memorial doesn't have any videos yet
                              </p>
                            </div>
                          )
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              Premium Feature
                            </h3>
                            <p className="text-gray-600 mb-4">
                              Video content is available with premium memorials
                            </p>
                            <Button variant="outline">Learn More</Button>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
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
                      {memorialTranslations.sections.family.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isPremium ? (
                      apiMemorial.familyTree?.length > 0 ? (
                        <div className="space-y-3">
                          {apiMemorial.familyTree.map((member, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={member.image || "/placeholder.svg"} />
                                <AvatarFallback>
                                  {member.name?.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {member.name || "Family Member"}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {member.relation || "Relative"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-sm text-gray-600">
                            No family members added yet
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="text-center py-6">
                        <Lock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Family tree available with premium
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
                      <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                      {memorialTranslations.sections.location.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isPremium ? (
                      <div className="space-y-4">
                        <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                          <p className="text-gray-600">Interactive Map</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {"Tbilisi, Georgia"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {41.7151}, {44.8271}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          {memorialTranslations.sections.location.getDirections}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Lock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          GPS location available with premium
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {memorialTranslations.sections.achievements.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {apiMemorial.achievements?.length > 0 ? (
                      <div className="space-y-2">
                        {apiMemorial.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-[#547455]"></div>
                            <p className="text-sm text-gray-700">{achievement}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-sm text-gray-600">
                          No achievements added yet
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
                      {memorialTranslations.sections.info.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {memorialTranslations.sections.info.qrCode}
                      </span>
                      <Badge variant="outline">{apiMemorial.slug}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {memorialTranslations.sections.info.plan}
                      </span>
                      <Badge variant={isPremium ? "default" : "secondary"}>
                        {apiMemorial.plan}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {memorialTranslations.sections.info.lastUpdated}
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
                          {memorialTranslations.sections.info.createMemorial}
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
    </div>
  );
}