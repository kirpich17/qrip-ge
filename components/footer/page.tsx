"use client";

import React from "react";
import { useTranslation } from "@/hooks/useTranslate";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-white py-[20px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-gray-400 text-center">
          {" "}
          {t("footer").copyright}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
