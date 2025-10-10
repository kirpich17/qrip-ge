"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslate";
import { getPublicTestimonials, getPublicSiteSettings, Testimonial } from "@/services/testimonialService";
import TestimonialForm from "../components/TestimonialForm";

const Testimonials = () => {
  const { t } = useTranslation();
  const testimonialsTranslations = t("testimonials");
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [settings, setSettings] = useState<{ testimonialsEnabled: boolean; testimonialsMaxDisplay: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both testimonials and settings
        const [testimonialsResponse, settingsResponse] = await Promise.all([
          getPublicTestimonials(3),
          getPublicSiteSettings()
        ]);

        // Check if testimonials are enabled
        if (settingsResponse.status && settingsResponse.data) {
          setSettings(settingsResponse.data);
          
          // Only fetch testimonials if enabled
          if (settingsResponse.data.testimonialsEnabled) {
            if (testimonialsResponse.status && testimonialsResponse.data) {
              setTestimonials(testimonialsResponse.data);
            } else {
              setTestimonials([]);
            }
          } else {
            // Testimonials disabled, don't fetch testimonials
            setTestimonials([]);
          }
        } else {
          // If settings fetch fails, still try to fetch testimonials
          if (testimonialsResponse.status && testimonialsResponse.data) {
            setTestimonials(testimonialsResponse.data);
          } else {
            setTestimonials([]);
          }
        }
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load testimonials");
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Don't render the section if there are no testimonials or if there's an error
  if (loading) {
    return (
      <section className="md:py-20 py-8 px-4 sm:px-6 lg:px-8 bg-[#ecefdc]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-8"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 bg-gray-300 rounded-lg"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null; // Don't render the section if there's an error
  }

  // Don't render the section if testimonials are disabled by admin
  if (settings && !settings.testimonialsEnabled) {
    return null;
  }

  return (
    <section className="md:py-20 py-8 px-4 sm:px-6 lg:px-8 bg-[#ecefdc]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center md:mb-16 mb-5"
        >
          <h2 className="md:text-4xl text-2xl font-bold text-gray-900 md:mb-4 mb-2">
            {testimonialsTranslations?.title || "What Our Users Say"}
          </h2>
          <p className="md:text-xl text-base text-gray-600 max-w-2xl mx-auto">
            {testimonialsTranslations?.subtitle || "Read testimonials from families who have used our memorial services"}
          </p>
        </motion.div>

        {testimonials.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-[#547455] rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.avatar || testimonial.name.charAt(0).toUpperCase()}
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
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= (testimonial.rating || 5)
                              ? "fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Testimonials Yet</h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your experience with our memorial services
            </p>
          </motion.div>
        )}

        {/* Add Testimonial Button */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => setShowForm(true)}
              className="bg-[#547455] hover:bg-[#243b31] text-white px-8 py-3 rounded-lg"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Share Your Experience
            </Button>
          </motion.div>
        )}

        {/* Testimonial Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-12"
          >
            <TestimonialForm onSuccess={() => setShowForm(false)} />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
