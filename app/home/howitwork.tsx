'use client';

import { motion } from 'framer-motion';
import { FaHeart, FaQrcode, FaMobile } from 'react-icons/fa';
import { useTranslation } from '@/hooks/useTranslate';

const Howitwork = () => {
  const { t } = useTranslation();
  const howItWorksTranslations = t('howitworks');
  const icons = [FaHeart, FaQrcode, FaMobile];

  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 font-bold text-gray-900 text-2xl lg:text-4xl">
            {howItWorksTranslations.title}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600 text-base md:text-xl">
            {howItWorksTranslations.subtitle}
          </p>
        </motion.div>

        <div className="flex md:flex-row flex-col gap-6 md:gap-8">
          {howItWorksTranslations.steps.map((item, index) => {
            const IconComponent = icons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.15,
                  ease: 'easeOut',
                }}
                viewport={{ once: true, margin: '-50px' }}
                className="group flex-1 hover:shadow-lg px-6 py-8 border border-gray-200 rounded-xl text-center transition-shadow duration-300"
              >
                <div className="inline-block relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center items-center bg-[#547455] shadow-lg mx-auto rounded-2xl w-20 h-20"
                  >
                    <IconComponent className="w-10 h-10 text-white" />
                  </motion.div>
                  <div className="-top-2 -right-2 absolute flex justify-center items-center bg-gray-900 rounded-full w-8 h-8 font-bold text-white text-sm">
                    {item.step}
                  </div>
                </div>
                <h3 className="mb-3 font-semibold text-gray-900 text-xl">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Howitwork;
