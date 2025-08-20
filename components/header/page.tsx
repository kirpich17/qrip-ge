"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslate";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleLanguage = () => setIsLanguageOpen((prev) => !prev);

  const handleLanguageChange = (lang: "English" | "Georgian" | "Russian") => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };
  

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 w-full bg-[#243b31] z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center md:space-x-3 space-x-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white rounded-xl"
              >
                <QrCode className="h-5 w-5 text-[#243b31]" />
              </motion.div>
              <span className="md:text-2xl text-xl font-bold text-white">
                QRIP.ge
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-[#354f44]"
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

              <Link href="/admin/login">
                <Button
                  variant="outline"
                  className="border-white text-white bg-[#243b31]"
                >
                  {t("header").admin}
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-white shadow-lg text-[#243b31] hover:bg-[#243b31] hover:text-white border-white border">
                  {t("header").getStarted}
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle Button */}
            <div className="md:hidden flex items-center space-x-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-[#354f44]"
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
                      className="absolute right-0 mt-2 w-20 bg-white rounded-md shadow-lg z-50"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleLanguageChange("English")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          EN
                        </button>
                        <button
                          onClick={() => handleLanguageChange("Georgian")}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          KA
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={toggleMenu} className="text-white">
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="absolute top-16 left-0 w-full bg-[#243b31] px-4 pb-4 z-40 md:hidden"
            >
              <div className="flex flex-col space-y-2">
                <Link
                  href="/admin/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="border-b border-[#354f44] rounded-0"
                >
                  <Button variant="ghost" className="text-white ">
                    {t("header").admin}
                  </Button>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="border-b border-[#354f44] rounded-0"
                >
                  <Button
                    variant="ghost"
                    className="w-full text-white justify-start"
                  >
                    {t("header").getStarted}
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Header;
