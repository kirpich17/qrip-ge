"use client";

import { useTranslation } from "@/hooks/useTranslate";
import { useQuery } from "@tanstack/react-query";
import { FooterInfo } from "../../api";
import Image from "next/image";

const Footer = () => {
  const { t } = useTranslation();
  const { isLoading, error, isError, data } = useQuery({
    queryKey: ["data"],
    queryFn: FooterInfo,
  });
  const { phone, email } = data?.[0] || {};

  if (isError) return <p>Something went wrong: {error?.message}</p>;

  return (
    <div className="bg-gray-900 px-4 sm:px-6 lg:px-8 py-[20px] text-white">
      <div className="flex md:flex-row flex-col justify-between items-center gap-6 mx-auto max-w-[800px]">
        <div className="">
          <h3 className="mb-10 font-semibold text-[32px] text-gray-400">
            კონტაქტი
          </h3>
          <div className="space-y-1 text-sm flex gap-6 flex-col">
            {isLoading || !data ? (
              ""
            ) : (
              <p className="text-[20px] text-gray-400">
                <span className="text-[20px] text-gray-400">ტელეფონი: </span>
                {phone}
              </p>
            )}
            {isLoading || !data ? (
              ""
            ) : (
              <p className="text-[20px] text-gray-400">
                <span className="text-[20px] text-gray-400">ელფოსტა: </span>
                {email}
              </p>
            )}
          </div>
        </div>

        <Image src="/qrip-footer.jpg" width={400} height={300} alt="qr" />
      </div>
      <div className="flex flex-col items-center gap-4 mt-8 lg:mt-12 w-full px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="w-full max-w-[1440px]">
          <Image
            src="Line.svg"
            width={1220}
            height={1}
            alt="divider"
            className="w-full"
          />
        </div>
        <p className="font-[300] text-gray-400 text-[14px] sm:text-[16px] lg:text-[18px] text-center ">
          {/* @ts-ignore */}
          {t("footer").copyright}
        </p>
      </div>
    </div>
  );
};

export default Footer;
