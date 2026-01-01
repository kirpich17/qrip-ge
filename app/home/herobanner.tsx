'use client';

import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';

import { useTranslation } from '@/hooks/useTranslate';

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
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

const Herobanner = () => {
  const { t } = useTranslation();
  const heroTranslations = t('hero') as any;

  return (
    <>
      <section
        className="relative bg-cover bg-no-repeat bg-center px-4 sm:px-6 lg:px-8 py-10 sm:py-20 overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url('/hero-bg.webp')",
        }}
      >
        <div className="relative mx-auto max-w-7xl">
          <div className="items-end md:gap-12 grid sm:grid-cols-2">
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-8 py-8 lg:pt-24 lg:pb-20"
            >
              <motion.div
                variants={fadeInLeft}
                className="space-y-4 md:space-y-6"
              >
                <div className="inline-flex items-center space-x-2 bg-[#243b31] px-4 py-2 rounded-full font-medium text-white text-sm">
                  <FaHeart className="w-4 h-4" />
                  <span>{heroTranslations?.tagline}</span>
                </div>

                <h1 className="font-bold text-white text-2xl md:text-3xl lg:text-5xl xl:text-6xl">
                  {heroTranslations?.title1}
                  <span className="block">{heroTranslations?.title2}</span>
                </h1>

                <p className="max-w-xl text-white text-base md:text-xl leading-relaxed">
                  {heroTranslations?.description}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Herobanner;
