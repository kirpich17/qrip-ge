'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslate';
import LanguageDropdown from '../languageDropdown/page';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const toggleLanguage = () => setIsLanguageOpen((prev) => !prev);

  const handleLanguageChange = (lang: 'English' | 'Georgian' | 'Russian') => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="top-0 z-50 sticky bg-[#243b31] w-full"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href={'/'}
              className="flex items-center space-x-2 md:space-x-3"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-2 rounded-xl"
              >
                <QrCode className="w-5 h-5 text-[#243b31]" />
              </motion.div>
              <span className="font-bold text-white text-xl md:text-2xl">
                QRIP.ge
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Language Dropdown */}
              <LanguageDropdown />

              {/* <Link href="/admin/login">
                <Button
                  variant="outline"
                  className="bg-[#243b31] border-white text-white"
                >
                  {t("header").admin}
                </Button>
              </Link> */}
              <Link href="/login">
                <Button className="bg-white hover:bg-[#243b31] shadow-lg border border-white text-[#243b31] hover:text-white">
                  {t('header')?.getStarted ?? 'Get Started'}
                </Button>
              </Link>
            </div>

            {/* Mobile Toggle Button */}
            <div className="md:hidden flex items-center space-x-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  className="hover:bg-[#354f44] text-white"
                  onClick={toggleLanguage}
                >
                  {language}
                  <ChevronDown className="ml-1 w-4 h-4" />
                </Button>
                <AnimatePresence>
                  {isLanguageOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="right-0 z-50 absolute bg-white shadow-lg mt-2 rounded-md w-20"
                    >
                      <div className="py-1">
                        <button
                          onClick={() => handleLanguageChange('English')}
                          className="block hover:bg-gray-100 px-4 py-2 w-full text-gray-700 text-sm text-left"
                        >
                          EN
                        </button>
                        <button
                          onClick={() => handleLanguageChange('Georgian')}
                          className="block hover:bg-gray-100 px-4 py-2 w-full text-gray-700 text-sm text-left"
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
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden top-16 left-0 z-40 absolute bg-[#243b31] px-4 pb-4 w-full"
            >
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="border-[#354f44] border-b rounded-0"
                >
                  <Button
                    variant="ghost"
                    className="justify-start w-full text-white"
                  >
                    {t('header')?.getStarted ?? 'Get Started'}
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
