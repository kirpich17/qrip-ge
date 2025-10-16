"use client";

import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslate";

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const Features = () => {
  const { t } = useTranslation();
  const featuresTranslations = t("features");
  const colors = ["blue", "green", "red", "purple", "indigo", "gray"];

  return (
    <>
      <section className="lg:py-20 py-8 px-4 sm:px-6 lg:px-8 bg-[#ecefdc]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center md:mb-16 mb-5"
          >
            <h2 className="lg:text-3xl text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              {featuresTranslations.title}
            </h2>
            <p className="md:text-xl text-base text-gray-600 max-w-2xl mx-auto">
              {featuresTranslations.subtitle}
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 gap-4"
          >
            {featuresTranslations.items.map((feature, index) => {
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-2">
                    <CardContent className="p-8 text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br from-${colors[index]}-400 to-${colors[index]}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <span className="text-2xl font-bold text-[#243b31]">{index + 1}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Features;
