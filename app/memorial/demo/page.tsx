"use client";

import { useState } from "react";
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
  ArrowLeft,
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

export default function DemoMemorialPage() {
  const { t } = useTranslation();
  const demomemorialTranslations = t("demomemorial");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Demo memorial data
  const memorial = {
    name: "Eleanor Grace Thompson",
    dates: "April 22, 1935 - November 18, 2023",
    birthDate: "April 22, 1935",
    deathDate: "November 18, 2023",
    age: 88,
    location: "Tbilisi, Georgia",
    coordinates: { lat: 41.7151, lng: 44.8271 },
    plan: "premium",
    status: "active",
    profileImage: "/placeholder.svg?height=200&width=200",
    biography: `Eleanor Grace Thompson was a remarkable woman whose life was defined by love, service, and an unwavering commitment to her community. Born in 1935 in a small village outside Tbilisi, she grew up during challenging times but always maintained an optimistic spirit and a generous heart.
As a young woman, Eleanor became a nurse, dedicating over 45 years of her life to caring for others at Tbilisi Central Hospital. Her colleagues remember her as someone who could bring comfort to any patient with just her presence and gentle words. She had a special gift for making people feel heard and valued, whether they were patients, family members, or fellow healthcare workers.
Eleanor was also a devoted wife to her husband George for 58 years, and a loving mother to four children. She taught them the importance of kindness, hard work, and giving back to the community. Her home was always open to friends, neighbors, and anyone in need of a warm meal or a listening ear.
In her later years, Eleanor became passionate about preserving Georgian cultural traditions. She organized community events, taught traditional cooking classes, and mentored young women in her neighborhood. Her legacy lives on through the countless lives she touched and the traditions she helped preserve for future generations.`,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    video: {
      url: "/placeholder-video.mp4",
      thumbnail: "/placeholder.svg?height=300&width=500",
      title: "Eleanor's Message to Her Family",
    },
    family: [
      {
        name: "George Thompson",
        relation: "Husband",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: "Maria Kvirikashvili",
        relation: "Daughter",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: "David Thompson",
        relation: "Son",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: "Anna Georgadze",
        relation: "Daughter",
        image: "/placeholder.svg?height=60&width=60",
      },
      {
        name: "Michael Thompson",
        relation: "Son",
        image: "/placeholder.svg?height=60&width=60",
      },
    ],
    achievements: [
      "45 Years of Nursing Service",
      "Community Service Award 2015",
      "Mentor to 200+ Young Nurses",
      "Cultural Preservation Advocate",
      "Volunteer of the Year 2018",
    ],
    qrCode: "DEMO001",
    views: 2847,
    lastUpdated: "2024-01-20",
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % memorial.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + memorial.images.length) % memorial.images.length
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-[#111827]  text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                DEMO
              </Badge>
              <span className="text-sm font-medium">
                {demomemorialTranslations.demoBanner.title}
              </span>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:[#547455] bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {demomemorialTranslations.demoBanner.backButton}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-[#243b31] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white  rounded-xl"
              >
                <QrCode className="h-5 w-5 text-[#243b31]" />{" "}
              </motion.div>
              <span className="text-2xl font-bold text-white">QRIP.ge</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Badge
                variant="secondary"
                className="bg-indigo-100 text-indigo-800"
              >
                {memorial.views.toLocaleString()}{" "}
                {demomemorialTranslations.header.views}
              </Badge>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 " />
                {demomemorialTranslations.header.share}
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
                <div className="relative bg-gradient-to-br from-[#acc09c] to-[#bce09e]  text-white">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                      <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-white/20">
                        <AvatarImage
                          src={memorial.profileImage || "/placeholder.svg"}
                        />
                        <AvatarFallback className="text-4xl">ET</AvatarFallback>
                      </Avatar>
                      <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                          <h1 className="text-3xl md:text-4xl font-bold">
                            {memorial.name}
                          </h1>
                          <Crown className="h-6 w-6 text-yellow-300" />
                        </div>
                        <p className="text-xl text-white/90 mb-2">
                          {memorial.dates}
                        </p>
                        <p className="text-white/80 flex items-center justify-center md:justify-start">
                          <MapPin className="h-4 w-4 mr-1" />
                          {memorial.location}
                        </p>
                        <p className="text-white/80 mt-2">
                          {demomemorialTranslations.hero.age.replace(
                            "{age}",
                            memorial.age
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
                      <Heart className="h-5 w-5 mr-2 text-red-500" />
                      {demomemorialTranslations.biography.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      {memorial.biography
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
                    <CardTitle>
                      {demomemorialTranslations.mediaGallery.title}23233
                    </CardTitle>
                    <CardDescription>
                      {demomemorialTranslations.mediaGallery.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="photos" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="photos">
                          {demomemorialTranslations.mediaGallery.photosTab}
                        </TabsTrigger>
                        <TabsTrigger value="video">
                          {demomemorialTranslations.mediaGallery.videoTab}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="photos" className="mt-6">
                        <div className="space-y-4">
                          {/* Main Image */}
                          <div className="relative">
                            <img
                              src={
                                memorial.images[currentImageIndex] ||
                                "/placeholder.svg"
                              }
                              alt={`Memory ${currentImageIndex + 1}`}
                              className="w-full h-96 object-cover rounded-lg"
                            />
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
                          </div>

                          {/* Thumbnail Strip */}
                          <div className="flex space-x-2 overflow-x-auto">
                            {memorial.images.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${index === currentImageIndex
                                  ? "border-[#547455] "
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
                        </div>
                      </TabsContent>

                      <TabsContent value="video" className="mt-6">
                        <div className="space-y-4">
                          <div className="relative bg-black rounded-lg overflow-hidden">
                            <img
                              src={
                                memorial.video.thumbnail || "/placeholder.svg"
                              }
                              alt="Video thumbnail"
                              className="w-full h-64 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Button
                                size="lg"
                                onClick={() =>
                                  setIsVideoPlaying(!isVideoPlaying)
                                }
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
                              {memorial.video.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {
                                demomemorialTranslations.mediaGallery
                                  .videoDescription
                              }
                            </p>
                          </div>
                        </div>
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
                      {demomemorialTranslations.family.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {memorial.family.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={member.image || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {member.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {member.relation}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Location */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                      {demomemorialTranslations.location.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                        <p className="text-gray-600">Interactive Map</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {memorial.location}
                        </p>
                        <p className="text-sm text-gray-600">
                          {memorial.coordinates.lat}, {memorial.coordinates.lng}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        {demomemorialTranslations.location.getDirections}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {demomemorialTranslations.achievements.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {memorial.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-[#243b31] rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-sm text-gray-700">{achievement}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Memorial Info */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {demomemorialTranslations.memorialInfo.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {demomemorialTranslations.memorialInfo.qrCode}
                      </span>
                      <Badge variant="outline">{memorial.qrCode}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {demomemorialTranslations.memorialInfo.plan}
                      </span>
                      <Badge className="bg-yellow-600">Premium</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {demomemorialTranslations.memorialInfo.lastUpdated}
                      </span>
                      <span className="text-gray-900">
                        {memorial.lastUpdated}
                      </span>
                    </div>
                    <Separator />
                    <div className="text-center space-y-2">
                      <Link href="/signup">
                        <Button className="w-full bg-[#547455] hover:bg-[#243b31]">
                          {demomemorialTranslations.memorialInfo.createButton}
                        </Button>
                      </Link>
                      <p className="text-xs text-gray-500">
                        {demomemorialTranslations.memorialInfo.demoNote}
                      </p>
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
