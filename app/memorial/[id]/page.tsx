"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function MemorialPage({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(true)

  // Mock data - in real app, this would be fetched based on params.id
  const memorial = {
    id: params.id,
    name: "John Smith",
    dates: "March 15, 1945 - December 3, 2023",
    birthDate: "March 15, 1945",
    deathDate: "December 3, 2023",
    age: 78,
    location: "Tbilisi, Georgia",
    coordinates: { lat: 41.7151, lng: 44.8271 },
    plan: "premium", // basic, premium
    status: "active", // active, inactive
    profileImage: "/placeholder.svg?height=200&width=200",
    biography: `John Smith was a beloved father, grandfather, and pillar of his community. Born in Tbilisi in 1945, he dedicated his life to education, serving as a high school mathematics teacher for over 40 years. 

His passion for learning and teaching touched the lives of thousands of students, many of whom went on to successful careers in science and engineering. John believed that education was the key to a better future, and he worked tirelessly to ensure that every student had the opportunity to succeed.

Beyond the classroom, John was an avid gardener and loved spending time in his greenhouse, cultivating rare orchids. He was also a devoted family man, married to his beloved wife Sarah for 52 years, and a loving father to three children and grandfather to seven grandchildren.

John's legacy lives on through the countless lives he touched, the students he inspired, and the family who will forever cherish his memory. His kindness, wisdom, and unwavering dedication to others will never be forgotten.`,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    video: {
      url: "/placeholder-video.mp4",
      thumbnail: "/placeholder.svg?height=300&width=500",
      title: "A Message from John",
    },
    family: [
      { name: "Sarah Smith", relation: "Wife", image: "/placeholder.svg?height=60&width=60" },
      { name: "Michael Smith", relation: "Son", image: "/placeholder.svg?height=60&width=60" },
      { name: "Jennifer Davis", relation: "Daughter", image: "/placeholder.svg?height=60&width=60" },
      { name: "Robert Smith", relation: "Son", image: "/placeholder.svg?height=60&width=60" },
    ],
    achievements: [
      "Teacher of the Year 1987, 1995, 2003",
      "Community Service Award 2010",
      "40 Years of Dedicated Service",
      "Mentor to over 5,000 students",
    ],
    qrCode: "QR001",
    views: 1247,
    lastUpdated: "2024-01-15",
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % memorial.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + memorial.images.length) % memorial.images.length)
  }

  // Check if memorial is inactive
  if (memorial.status === "inactive") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Memorial Unavailable</h2>
            <p className="text-gray-600 mb-6">
              This memorial profile is currently inactive. Please contact support or the family for more information.
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
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-indigo-600" />
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                QRIP.ge
              </span>
            </Link>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                {memorial.views.toLocaleString()} views
              </Badge>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
          {/* Hero Section */}
          <motion.div variants={fadeInUp}>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative p-8 md:p-12">
                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                      <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-white/20">
                        <AvatarImage src={memorial.profileImage || "/placeholder.svg"} />
                        <AvatarFallback className="text-4xl">
                          {memorial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                          <h1 className="text-3xl md:text-4xl font-bold">{memorial.name}</h1>
                          {memorial.plan === "premium" && <Crown className="h-6 w-6 text-yellow-300" />}
                        </div>
                        <p className="text-xl text-white/90 mb-2">{memorial.dates}</p>
                        <p className="text-white/80 flex items-center justify-center md:justify-start">
                          <MapPin className="h-4 w-4 mr-1" />
                          {memorial.location}
                        </p>
                        <p className="text-white/80 mt-2">Age {memorial.age} years</p>
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
                      Life Story
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-gray max-w-none">
                      {memorial.biography.split("\n\n").map((paragraph, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed mb-4">
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
                    <CardTitle>Memories</CardTitle>
                    <CardDescription>Photos and videos celebrating a life well-lived</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="photos" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="photos">Photos</TabsTrigger>
                        <TabsTrigger value="video" disabled={memorial.plan === "basic"}>
                          Video {memorial.plan === "basic" && <Lock className="h-3 w-3 ml-1" />}
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="photos" className="mt-6">
                        <div className="space-y-4">
                          {/* Main Image */}
                          <div className="relative">
                            <img
                              src={memorial.images[currentImageIndex] || "/placeholder.svg"}
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
                                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                                  index === currentImageIndex ? "border-indigo-500" : "border-gray-200"
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
                        {memorial.plan === "premium" ? (
                          <div className="space-y-4">
                            <div className="relative bg-black rounded-lg overflow-hidden">
                              <img
                                src={memorial.video.thumbnail || "/placeholder.svg"}
                                alt="Video thumbnail"
                                className="w-full h-64 object-cover"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Button
                                  size="lg"
                                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                                  className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                                >
                                  {isVideoPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                                </Button>
                              </div>
                              <div className="absolute bottom-4 right-4">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                                  className="bg-black/50 hover:bg-black/70 text-white"
                                >
                                  {isVideoMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                </Button>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{memorial.video.title}</h3>
                              <p className="text-sm text-gray-600">A personal message and memories shared</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <Lock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Feature</h3>
                            <p className="text-gray-600 mb-4">Video content is available with premium memorials</p>
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
                      Family
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {memorial.plan === "premium" ? (
                      <div className="space-y-3">
                        {memorial.family.map((member, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.image || "/placeholder.svg"} />
                              <AvatarFallback>
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.relation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Lock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Family tree available with premium</p>
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
                      Memorial Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {memorial.plan === "premium" ? (
                      <div className="space-y-4">
                        <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                          <p className="text-gray-600">Interactive Map</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{memorial.location}</p>
                          <p className="text-sm text-gray-600">
                            {memorial.coordinates.lat}, {memorial.coordinates.lng}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          Get Directions
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Lock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">GPS location available with premium</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Achievements */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements & Legacy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {memorial.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
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
                    <CardTitle>Memorial Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">QR Code:</span>
                      <Badge variant="outline">{memorial.qrCode}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Plan:</span>
                      <Badge variant={memorial.plan === "premium" ? "default" : "secondary"}>{memorial.plan}</Badge>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900">{memorial.lastUpdated}</span>
                    </div>
                    <Separator />
                    <div className="text-center">
                      <Link href="/">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          Create Your Own Memorial
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
  )
}
