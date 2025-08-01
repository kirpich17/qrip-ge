"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface QRPageTransitionProps {
  profilePhoto: string;
  memorialId: string;
  firstName: string;
  lastName: string;
  hasPremium: boolean;
  birthDate: string;
  deathDate: string;
}

export default function QRPageTransition({
  profilePhoto,
  memorialId,
  firstName,
  lastName,
  hasPremium,
  birthDate,
  deathDate
}: QRPageTransitionProps) {
  const [isInitialView, setIsInitialView] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // For premium users - slideshow logic
  useEffect(() => {
    if (hasPremium && isInitialView) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 3); // Rotate through 3 slides
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [hasPremium, isInitialView]);

  const handleClick = () => {
    setIsInitialView(false);
    setTimeout(() => {
      router.push(`/memorial/${memorialId}`);
    }, 500); // Match this with animation duration
  };

  // Slides for premium users
  const premiumSlides = [
    { 
      image: profilePhoto || '/default-profile.jpg', 
      text: `Remembering ${firstName} ${lastName}`,
      years: `${new Date(birthDate).getFullYear()} - ${new Date(deathDate).getFullYear()}`
    },
    { 
      image: '/default-slide2.jpg', 
      text: "Celebrating a life well lived",
      years: ""
    },
    { 
      image: '/default-slide3.jpg', 
      text: "Honoring their legacy",
      years: ""
    }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <AnimatePresence>
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
              {hasPremium ? (
                <div className="max-w-2xl mx-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl">
                        <Image
                          src={premiumSlides[currentSlide].image}
                          alt="Memorial slide"
                          fill
                          className="object-cover"
                          priority
                        />
                      </div>
                      <h2 className="text-3xl font-bold">
                        {premiumSlides[currentSlide].text}
                      </h2>
                      {premiumSlides[currentSlide].years && (
                        <p className="text-xl">
                          {premiumSlides[currentSlide].years}
                        </p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <motion.p 
                    className="mt-8 text-lg"
                    animate={{ opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Tap to view full memorial
                  </motion.p>
                </div>
              ) : (
                <>
                  <div className="relative h-64 w-64 rounded-full overflow-hidden border-4 border-white shadow-xl">
                    <Image
                      src={profilePhoto || '/default-profile.jpg'}
                      alt={`${firstName} ${lastName}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <h1 className="mt-6 text-4xl font-bold">In Loving Memory</h1>
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
                    Tap to view memorial
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