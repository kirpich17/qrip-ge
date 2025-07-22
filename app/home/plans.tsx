"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Crown, Star, Zap } from "lucide-react";
import { FaHeart } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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

const Plans = () => {
  const { t } = useTranslation();
  const plansTranslations = t("plans");
  const commonTranslations = t("common");

  const plans = [
    {
      name: plansTranslations.free.name,
      price: plansTranslations.free.price,
      period: plansTranslations.free.period,
      icon: Star,
      color: "text-black",
      bgColor: "bg-green-50",
      borderColor: "border-gray-200",
      features: plansTranslations.free.features,
    },
    {
      name: plansTranslations.premium.name,
      price: plansTranslations.premium.price,
      period: plansTranslations.premium.period,
      icon: Crown,
      color: "text-black",
      bgColor: "bg-green-50",
      popular: true,
      features: plansTranslations.premium.features,
    },
    {
      name: plansTranslations.legacy.name,
      price: plansTranslations.legacy.price,
      period: plansTranslations.legacy.period,
      icon: Zap,
      color: "text-black",
      bgColor: "bg-green-50",
      borderColor: "border-gray-200",
      features: plansTranslations.legacy.features,
    },
  ];

  return (
    <section className="md:py-20 py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center md:mb-16 mb-6"
        >
          <div className="inline-flex items-center space-x-2 bg-[#243b31] text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Crown className="h-4 w-4" />
            <span>{plansTranslations.choosePlan}</span>
          </div>
          <h2 className="lg:text-4xl text-2xl font-bold text-gray-900 mb-4">
            {plansTranslations.title}
          </h2>
          <p className="md:text-xl text-base text-gray-600 max-w-2xl mx-auto">
            {plansTranslations.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card
                className={`relative h-full ${
                  plan.popular
                    ? "border border-[#547455] md:scale-105"
                    : `${plan.borderColor} hover:shadow-xl border-2`
                } transition-all duration-300 hover:-translate-y-1`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#547455] text-white px-4 py-2 text-xs font-medium hover:bg-black text-center">
                      {plansTranslations.mostPopular}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4 pt-8">
                  <div
                    className={`w-16 h-16 ${plan.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <plan.icon className={`h-8 w-8 ${plan.color}`} />
                  </div>
                  <CardTitle className="lg:text-2xl md:text-xl text-lg font-bold">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="lg:text-5xl md:text-3xl text-xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600 ml-2 md:text-lg text-sm">
                        {plan.period}
                      </span>
                    </div>
                    {plan.name === plansTranslations.legacy.name && (
                      <p className="text-sm text-black mt-2 font-medium">
                        {plansTranslations.lifetimeAccess}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0 pb-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="h-3 w-3 text-[#243b31]" />
                        </div>
                        <span className="text-gray-700 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/subscription">
                    <Button
                      className={`w-full xl:text-lg text-sm py-3 px-2 !gap-2 shadow-lg hover:shadow-xl transition-all duration-300 flex-wrap h-auto whitespace-normal   ${
                        plan.popular
                          ? "bg-[#547455] hover:bg-white hover:text-[#547455] border border-[#547455]"
                          : plan.name === plansTranslations.legacy.name
                          ? "bg-black hover:bg-white hover:text-black border border-black"
                          : "bg-black hover:bg-white hover:text-black border border-black"
                      }`}
                      size="lg"
                    >
                      {plan.name === plansTranslations.free.name ? (
                        <>
                          <FaHeart className=" h-4 w-4" />
                          {plansTranslations.startFree}
                        </>
                      ) : (
                        <>
                          <Crown className=" h-4 w-4" />
                          {plansTranslations.choose} {plan.name}
                        </>
                      )}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/subscription">
            <Button
              variant="outline"
              size="lg"
              className="bg-[#547455] text-white border border-[#547455] hover:white"
            >
              {plansTranslations.viewComparison}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Plans;
