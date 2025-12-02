'use client';

import { useTranslation } from '@/hooks/useTranslate';
import { useQuery } from '@tanstack/react-query';
import { FooterInfo } from '../../api';
import Image from 'next/image';
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
    <footer className="relative bg-[#ecefdc] mt-[60px] px-4 sm:px-6 lg:px-8 py-16 lg:pt-20 lg:pb-[30px] overflow-hidden text-white">
      <div className="top-10 left-10 absolute opacity-5">
        <QrCode className="w-32 h-32 text-[#547455]" />
      </div>

      <div className="relative flex justify-between gap-12 lg:gap-16 mx-auto max-w-[1440px]">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#547455] rounded-full w-1 h-8"></div>
            <h3 className="font-bold text-gray-800 text-3xl lg:text-4xl">
              კონტაქტი
            </h3>
          </div>
          <div className="flex flex-col gap-5">
            {!isLoading && data && phone && (
              <div className="group flex items-center gap-3 hover:bg-white/50 px-4 py-3 rounded-xl transition-all duration-300">
                <div className="flex justify-center items-center bg-[#547455]/10 group-hover:bg-[#547455] rounded-lg w-10 h-10 transition-colors duration-300">
                  <Phone className="w-5 h-5 text-[#547455] group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-500 text-xs">ტელეფონი</p>
                  <p className="font-semibold text-gray-800 text-lg">{phone}</p>
                </div>
              </div>
            )}
            {!isLoading && data && email && (
              <div className="group flex items-center gap-3 hover:bg-white/50 px-4 py-3 rounded-xl transition-all duration-300">
                <div className="flex justify-center items-center bg-[#547455]/10 group-hover:bg-[#547455] rounded-lg w-10 h-10 transition-colors duration-300">
                  <Mail className="w-5 h-5 text-[#547455] group-hover:text-white transition-colors duration-300" />
                </div>
                <div>
                  <p className="font-medium text-gray-500 text-xs">ელფოსტა</p>
                  <p className="font-semibold text-gray-800 text-lg">{email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#547455] rounded-full w-1 h-8"></div>
            <h3 className="font-bold text-gray-800 text-3xl lg:text-4xl">
              ნავიგაცია
            </h3>
          </div>
          <nav className="flex flex-col gap-3">
            {navigationLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="group flex items-center gap-3 hover:bg-white/50 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#547455] text-lg transition-all duration-300"
              >
                <div className="bg-[#547455]/40 group-hover:bg-[#547455] rounded-full w-1.5 h-1.5 group-hover:scale-150 transition-all duration-300"></div>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#547455] rounded-full w-1 h-8"></div>
            <h3 className="font-bold text-gray-800 text-3xl lg:text-4xl">
              ნავიგაცია
            </h3>
          </div>
          <nav className="flex flex-col gap-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="group flex items-center gap-3 hover:bg-white/50 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#547455] text-lg transition-all duration-300"
              >
                <div className="bg-[#547455]/40 group-hover:bg-[#547455] rounded-full w-1.5 h-1.5 group-hover:scale-150 transition-all duration-300"></div>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#547455] rounded-full w-1 h-8"></div>
            <h3 className="font-bold text-gray-800 text-3xl lg:text-4xl">
              სოც ქსელები
            </h3>
          </div>
          <nav className="flex flex-col gap-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="group flex items-center gap-3 hover:bg-white/50 px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#547455] text-lg transition-all duration-300"
              >
                <div className="bg-[#547455]/40 group-hover:bg-[#547455] rounded-full w-1.5 h-1.5 group-hover:scale-150 transition-all duration-300"></div>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex justify-center items-start">
          <button
            onClick={scrollToTop}
            className="group relative flex justify-center items-center bg-[#547455] hover:bg-[#243b31] shadow-lg hover:shadow-xl rounded-full w-14 h-14 overflow-hidden transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="relative w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-col items-center gap-6 mx-auto mt-16 max-w-[1440px]">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1 bg-gradient-to-r from-transparent via-[#547455]/30 to-[#547455]/30 h-px"></div>
          <QrCode className="w-6 h-6 text-[#547455]/40" />
          <div className="flex-1 bg-gradient-to-l from-transparent via-[#547455]/30 to-[#547455]/30 h-px"></div>
        </div>

        <div className="flex sm:flex-row flex-col justify-center items-center gap-4 text-center">
          <p className="font-light text-gray-600 text-sm sm:text-base">
            {/* @ts-ignore */}
            {t('footer').copyright}
          </p>
          <span className="hidden sm:block text-gray-400">•</span>
          <p className="flex items-center gap-2 font-medium text-[#547455] text-sm">
            <QrCode className="w-4 h-4" />
            QR Memorial Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
