"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, QrCode } from "lucide-react";
import {
  FaHeart,
  FaMemory,
  FaTree,
  FaCamera,
  FaVideo,
  FaUsers,
  FaQrcode,
} from "react-icons/fa";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslate";

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
  const { t } = useTranslation();
  const heroTranslations = t("hero") as any;
  const { language, setLanguage } = useLanguage();

  return (
    <>
      <section className="px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-cover bg-no-repeat bg-center sm:py-20 py-10" style={{ backgroundImage: "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url('/hero-bg.png')" }}>
        {/* Background Elements */}
        {/* <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate="animate"
            className="absolute top-20 left-10 opacity-10"
          >
            <FaHeart className="h-32 w-32 text-[#547455]" />
          </motion.div>
          <motion.div
            animate="animate"
            style={{ animationDelay: "1s" }}
            className="absolute top-40 right-20 opacity-10"
          >
            <FaMemory className="h-24 w-24 text-[#547455]" />
          </motion.div>
          <motion.div
            animate="animate"
            style={{ animationDelay: "2s" }}
            className="absolute bottom-40 left-1/4 opacity-10"
          >
            <FaTree className="h-28 w-28 text-green-300" />
          </motion.div>
        </div> */}

        <div className="max-w-7xl mx-auto relative">
          <div className="grid sm:grid-cols-2 md:gap-12 items-end">
            {/* Left Side - Content */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-8 lg:pt-24 lg:pb-20 py-8"
            >
              <motion.div
                variants={fadeInLeft}
                className="md:space-y-6 space-y-4"
              >
                <div className="inline-flex items-center space-x-2 bg-[#243b31] text-white px-4 py-2 rounded-full text-sm font-medium">
                  <FaHeart className="h-4 w-4" />
                  <span>{heroTranslations?.tagline}</span>
                </div>

                <h1 className="md:text-3xl text-2xl lg:text-5xl xl:text-6xl font-bold text-white">
                  {heroTranslations?.title1}
                  <span className="block ">
                    {heroTranslations?.title2}
                  </span>
                </h1>

                <p className="text-base md:text-xl text-white leading-relaxed max-w-xl">
                  {heroTranslations?.description}
                </p>
              </motion.div>

              {/* <motion.div
                variants={fadeInLeft}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-[#547455] text-lg px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-white hover:text-black"
                  >
                    <FaHeart className="mr-2 h-5 w-5" />
                    {heroTranslations.createButton}
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
                    {heroTranslations.demoButton}
                  </Button>
                </Link>
              </motion.div> */}

              {/* <motion.div
                variants={fadeInLeft}
                className="flex items-center space-x-8 pt-4"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">
                    {heroTranslations.stats.memorials}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">
                    {heroTranslations.stats.families}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100K+</div>
                  <div className="text-sm text-gray-600">
                    {heroTranslations.stats.memories}
                  </div>
                </div>
              </motion.div> */}
            </motion.div>

            {/* Right Side - Tudor-style Memorial Stone */}
            {/* <motion.div
              variants={fadeInRight}
              className="relative flex lg:justify-end  justify-center items-end h-full"
            >
              <div className="relative w-full max-w-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="bg-gradient-to-b from-stone-700 to-stone-900 shadow-2xl px-8 py-12 relative z-10 h-[600px] flex flex-col justify-center "
                  style={{
                    borderRadius: "250px 250px 0 0",
                    borderBottom: "12px solid #2c2c2c",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stone-wall.png')]"></div>
                  </div>

                  <div
                    className="absolute top-0 left-0 right-0 h-16 bg-stone-800 z-10"
                    style={{
                      borderRadius: "100px 1000px 0 0",
                      clipPath: "ellipse(65% 60% at 50% 40%)",
                    }}
                  />

                  <div className="text-center space-y-6 relative z-20">
                    <div className="relative mx-auto w-[180px] h-[180px] bg-white rounded-lg flex items-center justify-center p-2 border-4 border-[#547455] shadow-lg">
                      <QrCode className="h-[140px] w-[140px] text-gray-800" />
                    </div>


                    <div className="text-white">
                    <h3 className="text-4xl font-bold tracking-wider">
                        QRIP.GE
                      </h3>
                      <h3 className="text-3xl font-bold tracking-wider">
                        {heroTranslations.memorialExample.name}
                      </h3>
                      <p className="text-xl mt-2">
                        {heroTranslations.memorialExample.years}
                      </p>
                      <p className="text-lg italic mt-4">
                        "{heroTranslations.memorialExample.quote}"
                      </p>
                    </div>

                    <div className="flex justify-center space-x-8 pt-4">
                      <div className="flex flex-col items-center text-sm text-white">
                        <FaCamera className="h-5 w-5 text-gray-300" />
                        <span>
                          24 {heroTranslations.memorialExample.photos}
                        </span>
                      </div>
                      <div className="flex flex-col items-center text-sm text-white">
                        <FaVideo className="h-5 w-5 text-gray-300" />
                        <span>3 {heroTranslations.memorialExample.videos}</span>
                      </div>
                      <div className="flex flex-col items-center text-sm text-white">
                        <FaUsers className="h-5 w-5 text-gray-300" />
                        <span>
                          12 {heroTranslations.memorialExample.family}
                        </span>
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-4 text-2xl">🌹</div>
                    <div className="absolute bottom-0  right-4 text-2xl">
                      🌹
                    </div>

                    <div className="mt-8 bg-white/90 rounded-lg p-3 mx-auto max-w-xs shadow-md">
                      <div className="flex items-center justify-center space-x-2">
                        <FaQrcode className="h-5 w-5 text-gray-800" />
                        <span className="text-sm font-medium text-gray-800">
                          {heroTranslations.memorialExample.scanCta}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Herobanner;
