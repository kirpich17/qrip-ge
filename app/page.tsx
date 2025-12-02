'use client';

import Herobanner from './home/herobanner';
import Howitwork from './home/howitwork';
import Features from './home/features';
import Plans from './home/plans';
import Testimonials from './home/testimonials';
import PublicMemorials from './home/publicMemorials';
import { Suspense } from 'react';
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
      ease: 'easeInOut',
    },
  },
};

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen">
        <Herobanner />
        <Plans />
        <Howitwork />
        <Features />
        <PublicMemorials />
        <Testimonials />
        {/* <Memories /> */}
      </div>
    </Suspense>
  );
}
