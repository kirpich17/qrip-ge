"use client";

import { motion } from "framer-motion";
import { ArrowRight, Eye, Check } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";

const Memories = () => {
  const { t } = useTranslation();
  const memoriesTranslations = t("memories");

  return (
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
              {memoriesTranslations.title}
            </h2>
            <p className="md:text-xl text-base text-white max-w-2xl mx-auto leading-relaxed">
              {memoriesTranslations.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white text-[#243b31] hover:bg-gray-50 sm:text-lg text-sm px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 whitespace-break-spaces"
              >
                <FaHeart className="mr-2 h-5 w-5" />
                {memoriesTranslations.primaryButton}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/memorial/demo">
              <Button
                size="lg"
                variant="outline"
                className="sm:text-lg text-sm px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#243b31] bg-transparent backdrop-blur-sm"
              >
                <Eye className="mr-2 h-5 w-5" />
                {memoriesTranslations.secondaryButton}
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 md:pt-8 text-rose-100 flex-wrap">
            {memoriesTranslations.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-5 w-5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Memories;
