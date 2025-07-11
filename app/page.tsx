"use client"

import { motion } from "framer-motion"
import { ArrowRight, Shield, Eye, Check, Crown, Star, Zap, Play } from "lucide-react"
import {
  FaHeart,
  FaMemory,
  FaTree,
  FaMapMarkerAlt,
  FaCamera,
  FaVideo,
  FaUsers,
  FaQrcode,
  FaMobile,
  FaGlobe,
} from "react-icons/fa"
import { MdFamilyRestroom, MdLocationOn, MdPhotoLibrary } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
}

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
}

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const floatingAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

export default function HomePage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      icon: Star,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      features: ["Biography & photo", "QR code", "Basic memorial"],
    },
    {
      name: "Basic Premium",
      price: "$9",
      period: "/month",
      icon: Crown,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300",
      popular: true,
      features: ["Everything in Free", "Video upload", "Family tree", "GPS location"],
    },
    {
      name: "Legacy+",
      price: "$199",
      period: "one-time",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      features: ["Everything in Premium", "Multiple admins", "Lifetime access", "White-glove setup"],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-rose-100 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl"
              >
                <FaHeart className="h-5 w-5 text-white" />
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                QRIP.ge
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-rose-600">
                  Sign In
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 bg-transparent">
                  Admin
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Redesigned */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div variants={floatingAnimation} animate="animate" className="absolute top-20 left-10 opacity-10">
            <FaHeart className="h-32 w-32 text-rose-300" />
          </motion.div>
          <motion.div
            variants={floatingAnimation}
            animate="animate"
            style={{ animationDelay: "1s" }}
            className="absolute top-40 right-20 opacity-10"
          >
            <FaMemory className="h-24 w-24 text-blue-300" />
          </motion.div>
          <motion.div
            variants={floatingAnimation}
            animate="animate"
            style={{ animationDelay: "2s" }}
            className="absolute bottom-40 left-1/4 opacity-10"
          >
            <FaTree className="h-28 w-28 text-green-300" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-8">
              <motion.div variants={fadeInLeft} className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium">
                  <FaHeart className="h-4 w-4" />
                  <span>Preserving Memories Forever</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Honor Their
                  <span className="block bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Beautiful Legacy
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Create touching digital memorials that celebrate life, preserve precious memories, and connect
                  families across generations through the simple scan of a QR code.
                </p>
              </motion.div>

              <motion.div variants={fadeInLeft} className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    <FaHeart className="mr-2 h-5 w-5" />
                    Create Memorial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/memorial/demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-8 py-4 border-2 border-gray-300 hover:bg-gray-50 bg-white/80 backdrop-blur-sm"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    View Demo
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={fadeInLeft} className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Memorials Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Families Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100K+</div>
                  <div className="text-sm text-gray-600">Memories Preserved</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - Visual */}
            <motion.div variants={fadeInRight} className="relative">
              <div className="relative">
                {/* Main Memorial Card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="bg-white rounded-3xl shadow-2xl p-8 relative z-10"
                >
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full mx-auto flex items-center justify-center">
                        <FaHeart className="h-12 w-12 text-white" />
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="absolute -inset-4 border-2 border-dashed border-rose-300 rounded-full"
                      />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Eleanor Grace</h3>
                      <p className="text-gray-600">1935 - 2023</p>
                      <p className="text-sm text-gray-500 mt-2">Beloved Mother & Grandmother</p>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <FaCamera className="h-4 w-4 text-blue-500" />
                        <span>24 Photos</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <FaVideo className="h-4 w-4 text-purple-500" />
                        <span>3 Videos</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <FaUsers className="h-4 w-4 text-green-500" />
                        <span>12 Family</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <FaQrcode className="h-6 w-6 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Scan to Visit Memorial</span>
                      </div>
                      <div className="w-20 h-20 bg-gray-900 rounded-lg mx-auto flex items-center justify-center">
                        <div className="text-white text-xs">QR</div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="absolute -right-4 top-8 bg-blue-500 text-white p-3 rounded-2xl shadow-lg"
                >
                  <FaMobile className="h-6 w-6" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute -left-4 bottom-8 bg-green-500 text-white p-3 rounded-2xl shadow-lg"
                >
                  <FaGlobe className="h-6 w-6" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white p-3 rounded-2xl shadow-lg"
                >
                  <FaMapMarkerAlt className="h-6 w-6" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How QRIP.ge Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to create a lasting digital memorial that honors your loved one's memory
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: FaHeart,
                title: "Create Memorial",
                description:
                  "Share their story, upload photos and videos, build their family tree, and add meaningful details about their life.",
                color: "rose",
              },
              {
                step: "02",
                icon: FaQrcode,
                title: "Generate QR Code",
                description:
                  "Get a unique QR code that links to the memorial. Print it on durable material for the gravesite or memorial location.",
                color: "blue",
              },
              {
                step: "03",
                icon: FaMobile,
                title: "Share & Remember",
                description:
                  "Family and friends can scan the QR code with any smartphone to visit the memorial and share their own memories.",
                color: "purple",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="relative mb-8">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br from-${item.color}-400 to-${item.color}-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Redesigned */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Remember</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to create meaningful, lasting tributes that celebrate life and preserve memories
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: MdPhotoLibrary,
                title: "Photo & Video Galleries",
                description: "Upload unlimited photos and videos to create beautiful visual stories of their life",
                color: "blue",
              },
              {
                icon: MdFamilyRestroom,
                title: "Interactive Family Tree",
                description:
                  "Build comprehensive family trees showing relationships and connections across generations",
                color: "green",
              },
              {
                icon: MdLocationOn,
                title: "GPS Memorial Locations",
                description: "Mark exact memorial locations with GPS coordinates and interactive maps",
                color: "red",
              },
              {
                icon: FaQrcode,
                title: "Custom QR Codes",
                description: "Generate beautiful, customizable QR codes that link directly to the memorial page",
                color: "purple",
              },
              {
                icon: FaGlobe,
                title: "Global Accessibility",
                description: "Memorials are accessible worldwide, allowing distant family to stay connected",
                color: "indigo",
              },
              {
                icon: Shield,
                title: "Privacy Controls",
                description: "Complete control over who can view and contribute to each memorial",
                color: "gray",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section - Enhanced */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Crown className="h-4 w-4" />
              <span>Choose Your Memorial Plan</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Honor Their Memory Your Way</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From free basic memorials to comprehensive legacy preservation - find the perfect plan for your needs
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {plans.map((plan, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card
                  className={`relative h-full ${
                    plan.popular
                      ? "border-2 border-rose-300 shadow-2xl ring-4 ring-rose-100 scale-105"
                      : `${plan.borderColor} hover:shadow-xl border-2`
                  } transition-all duration-300 hover:-translate-y-1`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 text-sm font-medium">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4 pt-8">
                    <div
                      className={`w-16 h-16 ${plan.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <plan.icon className={`h-8 w-8 ${plan.color}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                        <span className="text-gray-600 ml-2 text-lg">{plan.period}</span>
                      </div>
                      {plan.name === "Legacy+" && (
                        <p className="text-sm text-purple-600 mt-2 font-medium">
                          ✨ Lifetime Access - Pay Once, Own Forever
                        </p>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 pb-8">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/subscription">
                      <Button
                        className={`w-full text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
                          plan.popular
                            ? "bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700"
                            : plan.name === "Legacy+"
                              ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                              : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                        }`}
                        size="lg"
                      >
                        {plan.name === "Free" ? (
                          <>
                            <FaHeart className="mr-2 h-4 w-4" />
                            Start Free
                          </>
                        ) : (
                          <>
                            <Crown className="mr-2 h-4 w-4" />
                            Choose {plan.name}
                          </>
                        )}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/subscription">
              <Button variant="outline" size="lg" className="bg-white border-2 border-gray-300 hover:bg-gray-50">
                View Detailed Comparison
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Families Trust QRIP.ge</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how families around the world are preserving and sharing precious memories
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "Tbilisi, Georgia",
                text: "QRIP.ge helped us create a beautiful memorial for my grandmother. Now our whole family can visit her memorial page and share memories, no matter where they are in the world.",
                avatar: "SJ",
              },
              {
                name: "Michael Chen",
                location: "Batumi, Georgia",
                text: "The QR code on my father's headstone has been scanned over 200 times. It's amazing how many people have been able to learn about his life and leave their own memories.",
                avatar: "MC",
              },
              {
                name: "Elena Kvirikashvili",
                location: "Kutaisi, Georgia",
                text: "The family tree feature is incredible. We've connected with distant relatives we never knew existed, all through my uncle's memorial page. It's brought our family closer together.",
                avatar: "EK",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic">"{testimonial.text}"</p>
                    <div className="flex text-yellow-400 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute -top-40 -left-40 w-80 h-80 border border-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute -bottom-40 -right-40 w-96 h-96 border border-white/10 rounded-full"
          />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">Start Honoring Memories Today</h2>
              <p className="text-xl text-rose-100 max-w-2xl mx-auto leading-relaxed">
                Join thousands of families who trust QRIP.ge to preserve and share their most precious memories. Create
                your first memorial in minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-rose-600 hover:bg-gray-50 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <FaHeart className="mr-2 h-5 w-5" />
                  Create Your First Memorial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/memorial/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-rose-600 bg-transparent backdrop-blur-sm"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Demo Memorial
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 pt-8 text-rose-100">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5" />
                <span>Setup in minutes</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl">
                  <FaHeart className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold">QRIP.ge</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Honoring memories with respect and dignity. Preserving legacies for future generations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/subscription" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/memorial/demo" className="hover:text-white transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">© 2024 QRIP.ge. All rights reserved.</div>
            <div className="flex space-x-6 text-gray-400">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
