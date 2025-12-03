'use client';

import { useTranslation } from '@/hooks/useTranslate';
import { useQuery } from '@tanstack/react-query';
import { FooterInfo } from '../../api';
import { ArrowUp, Phone, Mail, QrCode } from 'lucide-react';
import { navigationLinks, socialLinks } from '../../data/navigation';

const Footer = () => {
  const { t } = useTranslation();
  const { isLoading, data } = useQuery({
    queryKey: ['data'],
    queryFn: FooterInfo,
  });
  const { phone, email } = data?.[0] || {};

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#243b31] mt-[60px] px-4 sm:px-6 lg:px-12 py-12 sm:py-16 overflow-hidden text-white">
      <div className="top-10 left-10 absolute opacity-5">
        <QrCode className="w-28 sm:w-32 h-28 sm:h-32 text-[#4fa167]" />
      </div>

      <div className="relative flex flex-wrap justify-between gap-8 sm:gap-12 lg:gap-16 mx-auto max-w-[1440px]">
        <div className="flex-1 min-w-[220px]">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="bg-[#4fa167] rounded-full w-1 h-6 sm:h-8"></div>
            <h3 className="font-bold text-white text-2xl sm:text-3xl lg:text-4xl">
              კონტაქტი
            </h3>
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            {!isLoading && data && phone && (
              <div className="group flex items-center gap-3 sm:gap-4 hover:bg-[#4fa167] px-3 sm:px-4 py-2 sm:py-3 rounded-xl hover:text-white transition-all duration-300">
                <div className="flex justify-center items-center bg-[#4fa167]/20 group-hover:bg-white rounded-lg w-10 h-10 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-[#4fa167] group-hover:text-[#243b31] transition-colors duration-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-300 text-xs sm:text-sm md:text-base">
                    ტელეფონი
                  </p>
                  <p className="font-semibold text-white text-sm sm:text-base md:text-lg">
                    {phone}
                  </p>
                </div>
              </div>
            )}
            {!isLoading && data && email && (
              <div className="group flex items-center gap-3 sm:gap-4 hover:bg-[#4fa167] px-3 sm:px-4 py-2 sm:py-3 rounded-xl hover:text-white transition-all duration-300">
                <div className="flex justify-center items-center bg-[#4fa167]/20 group-hover:bg-white rounded-lg w-10 h-10 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-[#4fa167] group-hover:text-[#243b31] transition-colors duration-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-300 text-xs sm:text-sm md:text-base">
                    ელფოსტა
                  </p>
                  <p className="font-semibold text-white text-sm sm:text-base md:text-lg">
                    {email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 min-w-[180px]">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="bg-[#4fa167] rounded-full w-1 h-6 sm:h-8"></div>
            <h3 className="font-bold text-white text-2xl sm:text-3xl lg:text-4xl">
              ნავიგაცია
            </h3>
          </div>
          <nav className="flex flex-col gap-2 sm:gap-3">
            {navigationLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="group flex items-center gap-2 sm:gap-3 hover:bg-[#4fa167] px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-gray-300 hover:text-white text-sm sm:text-base md:text-lg transition-all duration-300"
              >
                <div className="bg-[#4fa167]/40 group-hover:bg-white rounded-full w-1.5 h-1.5 group-hover:scale-150 transition-all duration-300"></div>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Social Links */}
        <div className="flex-1 min-w-[180px]">
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="bg-[#4fa167] rounded-full w-1 h-6 sm:h-8"></div>
            <h3 className="font-bold text-white text-2xl sm:text-3xl lg:text-4xl">
              სოც ქსელები
            </h3>
          </div>
          <nav className="flex flex-col gap-2 sm:gap-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="group flex items-center gap-2 sm:gap-3 hover:bg-[#4fa167] px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium text-gray-300 hover:text-white text-sm sm:text-base md:text-lg transition-all duration-300"
              >
                <div className="bg-[#4fa167]/40 group-hover:bg-white rounded-full w-1.5 h-1.5 group-hover:scale-150 transition-all duration-300"></div>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex justify-center items-start mt-4 sm:mt-0 min-w-[70px]">
          <button
            onClick={scrollToTop}
            className="group relative flex justify-center items-center bg-[#4fa167] hover:bg-white shadow-lg hover:shadow-xl rounded-full w-14 h-14 overflow-hidden transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="relative w-6 h-6 text-white group-hover:text-[#243b31] group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-4 sm:gap-6 mx-auto mt-12 sm:mt-16 max-w-[1440px]">
        <div className="flex items-center gap-2 sm:gap-4 w-full">
          <div className="flex-1 bg-gradient-to-r from-transparent via-[#4fa167]/30 to-[#4fa167]/30 h-px"></div>
          <QrCode className="w-5 sm:w-6 h-5 sm:h-6 text-[#4fa167]/40" />
          <div className="flex-1 bg-gradient-to-l from-transparent via-[#4fa167]/30 to-[#4fa167]/30 h-px"></div>
        </div>

        <div className="flex sm:flex-row flex-col justify-center items-center gap-2 sm:gap-4 text-center">
          <p className="font-light text-gray-400 text-xs sm:text-sm md:text-base">
            {/* @ts-ignore */}
            {t('footer').copyright}
          </p>
          <span className="hidden sm:block text-gray-500">•</span>
          <p className="flex items-center gap-2 font-medium text-[#4fa167] text-xs sm:text-sm md:text-base">
            <QrCode className="w-4 h-4" />
            QR Memorial Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
