"use client";

import { useTranslation } from "@/hooks/useTranslate";
import { useEffect, useState } from "react";

const Footer = () => {
  const { t } = useTranslation();
  const [info, setInfo] = useState<{ phone?: number; email?: string }>({});

  useEffect(() => {
    fetch("http://localhost:4040/api/footerInfo")
      .then((res) => res.json())
      .then((data) => setInfo(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bg-gray-900 text-white py-[20px] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between gap-6 max-w-[900px] mx-auto ">
        <div>
          <h3 className="text-lg font-semibold mb-2">Footer Information</h3>
          <div className="text-sm space-y-1">
            <p>
              <span className="font-medium">Phone: </span>
              {info.phone}
            </p>
            <p>
              <span className="font-medium">Email: </span>
              {info.email}
            </p>
          </div>
        </div>

        <div className="bg-[aqua] w-[300px] h-[300px] shrink-0"></div>
      </div>
    </div>
  );
};

export default Footer;
