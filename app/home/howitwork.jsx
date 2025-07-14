"use client";

import { motion } from "framer-motion";

import { FaHeart, FaQrcode, FaMobile } from "react-icons/fa";

const Howitwork = () => {
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
              How QRIP.ge Works
            </h2>
            <p className="md:text-xl text-base text-gray-600 max-w-2xl mx-auto">
              Three simple steps to create a lasting digital memorial that
              honors your loved one's memory
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: FaHeart,
                title: "Create Memorial",
                description:
                  "Share their story, upload photos and videos, build their family tree, and add meaningful details about their life.",
                color: "rose",
              },
              {
                step: "02",
                icon: FaQrcode,
                title: "Generate QR Code",
                description:
                  "Get a unique QR code that links to the memorial. Print it on durable material for the gravesite or memorial location.",
                color: "blue",
              },
              {
                step: "03",
                icon: FaMobile,
                title: "Share & Remember",
                description:
                  "Family and friends can scan the QR code with any smartphone to visit the memorial and share their own memories.",
                color: "purple",
              },
            ].map((item, index) => (
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
                    <item.icon className="h-10 w-10 text-white" />
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
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Howitwork;
