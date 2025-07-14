"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Crown, Star, Zap } from "lucide-react";
import { FaHeart } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

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

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Star,
    color: "text-black",
    bgColor: "bg-green-50",
    borderColor: "border-gray-200",
    features: ["Biography & photo", "QR code", "Basic memorial"],
  },
  {
    name: "Basic Premium",
    price: "$9",
    period: "/month",
    icon: Crown,
    color: "text-black",
    bgColor: "bg-green-50",

    popular: true,
    features: [
      "Everything Free in Basic Premium",
      "Video upload",
      "Family tree",
      "GPS location",
    ],
  },
  {
    name: "Legacy+",
    price: "$199",
    period: "one-time",
    icon: Zap,
    color: "text-black",
    bgColor: "bg-green-50",
    borderColor: "border-gray-200",
    features: [
      "Everything in Premium",
      "Multiple admins",
      "Lifetime access",
      "White-glove setup",
    ],
  },
];

const Plans = () => {
  return (
    <>
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
              <span>Choose Your Memorial Plan</span>
            </div>
            <h2 className="lg:text-4xl text-2xl font-bold text-gray-900 mb-4">
              Honor Their Memory Your Way
            </h2>
            <p className="md:text-xl text-base text-gray-600 max-w-2xl mx-auto">
              From free basic memorials to comprehensive legacy preservation -
              find the perfect plan for your needs
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
                      ? "border border-[#547455]  md:scale-105"
                      : `${plan.borderColor} hover:shadow-xl border-2`
                  } transition-all duration-300 hover:-translate-y-1`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-[#547455] text-white px-6 py-2 text-sm font-medium hover:bg-black">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4 pt-8">
                    <div
                      className={`w-16 h-16 ${plan.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <plan.icon className={`h-8 w-8 ${plan.color}`} />
                    </div>
                    <CardTitle className="md:text-2xl text-xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <div className="mt-4">
                      <div className="flex items-baseline justify-center">
                        <span className="md:text-5xl text-3xl font-bold text-gray-900">
                          {plan.price}
                        </span>
                        <span className="text-gray-600 ml-2 md:text-lg text-base">
                          {plan.period}
                        </span>
                      </div>
                      {plan.name === "Legacy+" && (
                        <p className="text-sm text-black mt-2 font-medium">
                          ✨ Lifetime Access - Pay Once, Own Forever
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
                            <Check className="h-3 w-3 text-[#243b31] " />
                          </div>
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/subscription">
                      <Button
                        className={`w-full text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
                          plan.popular
                            ? "bg-[#547455] hover:bg-white hover:text-[#547455] border border-[#547455]"
                            : plan.name === "Legacy+"
                            ? "bg-black hover:bg-white hover:text-black border border-black"
                            : "bg-black hover:bg-white hover:text-black border border-black"
                        }`}
                        size="lg"
                      >
                        {plan.name === "Free" ? (
                          <>
                            <FaHeart className="mr-2 h-4 w-4" />
                            Start Free
                          </>
                        ) : (
                          <>
                            <Crown className="mr-2 h-4 w-4" />
                            Choose {plan.name}
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
                className="bg-[#547455] text-white  border border-[#547455]  hover:white"
              >
                View Detailed Comparison
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Plans;
