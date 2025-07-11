"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { FaQrcode, FaGlobe } from "react-icons/fa";
import { MdFamilyRestroom, MdLocationOn, MdPhotoLibrary } from "react-icons/md";

import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <>
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Remember
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools to create meaningful, lasting tributes that
              celebrate life and preserve memories
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: MdPhotoLibrary,
                title: "Photo & Video Galleries",
                description:
                  "Upload unlimited photos and videos to create beautiful visual stories of their life",
                color: "blue",
              },
              {
                icon: MdFamilyRestroom,
                title: "Interactive Family Tree",
                description:
                  "Build comprehensive family trees showing relationships and connections across generations",
                color: "green",
              },
              {
                icon: MdLocationOn,
                title: "GPS Memorial Locations",
                description:
                  "Mark exact memorial locations with GPS coordinates and interactive maps",
                color: "red",
              },
              {
                icon: FaQrcode,
                title: "Custom QR Codes",
                description:
                  "Generate beautiful, customizable QR codes that link directly to the memorial page",
                color: "purple",
              },
              {
                icon: FaGlobe,
                title: "Global Accessibility",
                description:
                  "Memorials are accessible worldwide, allowing distant family to stay connected",
                color: "indigo",
              },
              {
                icon: Shield,
                title: "Privacy Controls",
                description:
                  "Complete control over who can view and contribute to each memorial",
                color: "gray",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group hover:-translate-y-2">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-8 w-8 text-[#f43f5e]" />
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
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Features;
