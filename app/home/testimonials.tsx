"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  return (
    <>
      <section className="md:py-20 py-8 px-4 sm:px-6 lg:px-8 bg-[#ecefdc]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center md:mb-16  mb-5"
          >
            <h2 className="md:text-4xl text-2xl font-bold text-gray-900 md:mb-4 mb-2">
              Families Trust QRIP.ge
            </h2>
            <p className="md:text-xl text-base text-gray-600 max-w-2xl mx-auto">
              See how families around the world are preserving and sharing
              precious memories
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "Tbilisi, Georgia",
                text: "QRIP.ge helped us create a beautiful memorial for my grandmother. Now our whole family can visit her memorial page and share memories, no matter where they are in the world.",
                avatar: "SJ",
              },
              {
                name: "Michael Chen",
                location: "Batumi, Georgia",
                text: "The QR code on my father's headstone has been scanned over 200 times. It's amazing how many people have been able to learn about his life and leave their own memories.",
                avatar: "MC",
              },
              {
                name: "Elena Kvirikashvili",
                location: "Kutaisi, Georgia",
                text: "The family tree feature is incredible. We've connected with distant relatives we never knew existed, all through my uncle's memorial page. It's brought our family closer together.",
                avatar: "EK",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-[#547455] rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex text-yellow-400 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
