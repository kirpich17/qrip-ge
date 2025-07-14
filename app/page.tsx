"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Eye,
  Check,
  Crown,
  Star,
  Zap,
  QrCode,
} from "lucide-react";
import { FaHeart, FaQrcode, FaMobile, FaGlobe } from "react-icons/fa";
import { MdFamilyRestroom, MdLocationOn, MdPhotoLibrary } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Herobanner from "./home/herobanner";
import Howitwork from "./home/howitwork";
import Features from "./home/features";
import Plans from "./home/plans";
import Testimonials from "./home/testimonials";
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
};

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
      features: [
        "Everything in Free",
        "Video upload",
        "Family tree",
        "GPS location",
      ],
    },
    {
      name: "Legacy+",
      price: "$199",
      period: "one-time",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      features: [
        "Everything in Premium",
        "Multiple admins",
        "Lifetime access",
        "White-glove setup",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f3cf] via-[#b1c99d] to-indigo-50">
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 w-full bg-[#243b31] z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white rounded-xl"
              >
                <QrCode className="h-5 w-5 text-[#243b31]" />{" "}
              </motion.div>
              <span className="text-2xl font-bold text-white">QRIP.ge</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button
                  variant="outline"
                  className="border-white text-white bg-[#243b31] "
                >
                  Admin
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-white shadow-lg text-[#243b31] hover:bg-[#243b31] hover:text-white border-white border hidden md:block">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      <Herobanner />
      <Howitwork />
      <Features />
      <Plans />
      <Testimonials />

      {/* CTA Section - Enhanced */}
      <section className="md:py-20 py-8 px-4 sm:px-6 lg:px-8 bg-[#243b31] relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 50,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute -top-40 -left-40 w-80 h-80 border border-white/10 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 60,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
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
            <div className="md:space-y-6 space-y-2">
              <h2 className="md:text-4xl lg:text-5xl text-2xl font-bold text-white leading-tight">
                Start Honoring Memories Today
              </h2>
              <p className="md:text-xl text-base text-white max-w-2xl mx-auto leading-relaxed">
                Join thousands of families who trust QRIP.ge to preserve and
                share their most precious memories. Create your first memorial
                in minutes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-white text-[#243b31]  hover:bg-gray-50 text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
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
                  className="text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#243b31]  bg-transparent backdrop-blur-sm"
                >
                  <Eye className="mr-2 h-5 w-5" />
                  View Demo Memorial
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 md:pt-8 text-rose-100 flex-wrap">
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
      <footer className="bg-gray-900 text-white py-[20px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* <div className="grid md:grid-cols-2 gap-8 mb-8 justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold">QRIP.ge</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Honoring memories with respect and dignity. Preserving legacies
                for future generations.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/subscription"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/memorial/demo"
                    className="hover:text-white transition-colors"
                  >
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div> */}

          <div className="">
            <div className="text-gray-400 mb-4 md:mb-0 text-center">
              © 2025 QRIP.ge. All rights reserved.
            </div>
            {/* <div className="flex space-x-6 text-gray-400">
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
