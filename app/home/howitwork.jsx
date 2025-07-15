"use client";

import { motion } from "framer-motion";
import { FaHeart, FaQrcode, FaMobile } from "react-icons/fa";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslate";

const Howitwork = () => {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const howItWorksTranslations = t("howItWorks");
  const colors = ["rose", "blue", "purple"];
  const icons = [FaHeart, FaQrcode, FaMobile];

  return (
    <>
      <section className="md:py-20 py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="lg:text-4xl text-2xl font-bold text-gray-900 mb-4">
              {howItWorksTranslations.title}
            </h2>
            <p className="md:text-xl text-base text-gray-600 max-w-2xl mx-auto">
              {howItWorksTranslations.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksTranslations.steps.map((item, index) => {
              const IconComponent = icons[index];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center group border border-[#efefef] px-[20px] py-[30px] rounded-[10px]"
                >
                  <div className="relative mb-8">
                    <div className="w-20 h-20 bg-[#547455] rounded-2xl mx-auto flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
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
    </>
  );
};

export default Howitwork;
