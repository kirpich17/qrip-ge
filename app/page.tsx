'use client';

import Herobanner from './home/herobanner';
import Howitwork from './home/howitwork';
import Features from './home/features';
import Testimonials from './home/testimonials';
import PublicMemorials from './home/publicMemorials';
import { Suspense } from 'react';

import MemorialActions from './home/MemorialActions';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen">
        <Herobanner />
        <MemorialActions />
        <Howitwork />
        <Features />
        <PublicMemorials />
        <Testimonials />
      </div>
    </Suspense>
  );
}
