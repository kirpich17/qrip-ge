'use client';

import { useTranslation } from '@/hooks/useTranslate';
import { useQuery } from '@tanstack/react-query';
import { FooterInfo } from '../../api';

const Footer = () => {
  const { t } = useTranslation();
  const { isLoading, error, isError, data } = useQuery({
    queryKey: ['data'],
    queryFn: FooterInfo,
  });
  const { phone, email } = data?.[0] || {};

  if (isError) return <p>Something went wrong: {error?.message}</p>;

  return (
    <div className="bg-gray-900 px-4 sm:px-6 lg:px-8 py-[20px] text-white">
      <div className="flex md:flex-row flex-col justify-between gap-6 mx-auto max-w-[900px]">
        <div>
          <h3 className="mb-2 font-semibold text-lg">Footer Information</h3>
          <div className="space-y-1 text-sm">
            {isLoading || !data ? (
              ''
            ) : (
              <p>
                <span className="font-medium">Phone: </span>
                {phone}
              </p>
            )}
            {isLoading || !data ? (
              ''
            ) : (
              <p>
                <span className="font-medium">Email: </span>
                {email}
              </p>
            )}
          </div>
        </div>

        <div className="bg-[aqua] w-[300px] h-[300px] shrink-0"></div>
      </div>
    </div>
  );
};

export default Footer;
