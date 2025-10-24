import React from 'react'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslate";

const LanguageDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const toggleLanguage = () => setIsLanguageOpen((prev) => !prev);

  const handleLanguageChange = (lang: "English" | "Georgian" | "Russian") => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className="text-white px-2 hover:bg-[#354f44]"
        onClick={toggleLanguage}
      >
        {language}
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
      <AnimatePresence>
        {isLanguageOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-30 bg-white rounded-md shadow-lg z-50"
          >
            <div className="py-1">
              <button
                onClick={() => handleLanguageChange("English")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                English
              </button>
              <button
                onClick={() => handleLanguageChange("Georgian")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Georgian
              </button>

              <button
                onClick={() => handleLanguageChange("Russian")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Russian
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LanguageDropdown