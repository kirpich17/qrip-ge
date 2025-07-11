"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, QrCode } from "lucide-react";
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
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const floatingAnimation = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
};

const Herobanner = () => {
  return (
    <>
      {/* Hero Section - Redesigned */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            variants={floatingAnimation}
            animate="animate"
            className="absolute top-20 left-10 opacity-10"
          >
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
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-8"
            >
              <motion.div variants={fadeInLeft} className="space-y-6">
                <div className="inline-flex items-center space-x-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium">
                  <FaHeart className="h-4 w-4" />
                  <span>Preserving Memories Forever</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                  Honor Their
                  <span className="block bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                    Beautiful Legacy
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                  Create touching digital memorials that celebrate life,
                  preserve precious memories, and connect families across
                  generations through the simple scan of a QR code.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInLeft}
                className="flex flex-col sm:flex-row gap-4"
              >
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

              <motion.div
                variants={fadeInLeft}
                className="flex items-center space-x-8 pt-4"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Memorials Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">
                    Families Connected
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100K+</div>
                  <div className="text-sm text-gray-600">
                    Memories Preserved
                  </div>
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
                        <QrCode className="h-12 w-12 text-white" />{" "}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Eleanor Grace
                      </h3>
                      <p className="text-gray-600">1935 - 2023</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Beloved Mother & Grandmother
                      </p>
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
                        <span className="text-sm font-medium text-gray-700">
                          Scan to Visit Memorial
                        </span>
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
    </>
  );
};

export default Herobanner;
