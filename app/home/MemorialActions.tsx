'use client';

import { Plus, Tag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslate';
import axiosInstance from '@/services/axiosInstance';
import { useState } from 'react';
import { toast } from 'react-toastify';

const MemorialActions = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const translations = t('memorialActions');
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  const handleCreateDraftMemorial = async () => {
    setIsCreatingDraft(true);
    try {
      const response = await axiosInstance.post('/api/memorials/create-draft');
      const { memorialId } = response.data;

      router.push(`/memorial/create/${memorialId}`);
    } catch (error: any) {
      console.error('Failed to create draft memorial:', error);
      toast.error(
        error.response?.data?.message || 'Failed to create draft memorial'
      );
    } finally {
      setIsCreatingDraft(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center bg-[#ecefdc] mt-8 lg:mt-20 w-full overflow-hidden">
      <div className="relative flex flex-col justify-center items-center gap-10 lg:gap-16 px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full max-w-[1440px]">
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-4 w-full max-w-4xl">
            <div className="flex-1 bg-gradient-to-r from-transparent via-[#547455]/30 to-[#547455]/30 h-px"></div>
            <div className="bg-[#547455]/40 rounded-full w-2 h-2"></div>
            <div className="bg-[#547455]/40 rounded-full w-2 h-2"></div>
            <div className="bg-[#547455]/40 rounded-full w-2 h-2"></div>
            <div className="flex-1 bg-gradient-to-l from-transparent via-[#547455]/30 to-[#547455]/30 h-px"></div>
          </div>

          <h2 className="font-bold text-gray-900 text-3xl sm:text-4xl lg:text-5xl text-center tracking-tight">
            {translations?.heading || 'შექმენი ციფრული მემორიალი'}
          </h2>

          <p className="mt-2 max-w-2xl text-gray-600 text-base sm:text-lg text-center">
            {translations?.description ||
              'დაიმახსოვრე და აღნიშნე შენი საყვარელი ადამიანების მოგონებები'}
          </p>
        </div>

        <div className="flex sm:flex-row flex-col justify-center items-center gap-5 sm:gap-8 lg:gap-10 w-full">
          <button
            onClick={handleCreateDraftMemorial}
            disabled={isCreatingDraft}
            className="group relative flex justify-center items-center gap-2 hover:bg-[#547455] shadow-lg hover:shadow-xl px-8 py-4 border-[#547455] border-2 rounded-2xl w-full sm:w-auto overflow-hidden font-semibold text-[#000000] hover:text-white text-lg transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            {translations?.buttons?.create || 'start create memorial'}
          </button>

          <Link
            href="/planDetails"
            className="group relative hover:bg-[#547455] shadow-lg hover:shadow-xl px-8 py-4 border-[#547455] border-2 rounded-2xl w-full sm:w-auto overflow-hidden font-semibold text-[#000000] hover:text-white text-lg transition-all duration-300"
          >
            <span className="relative flex justify-center items-center gap-2">
              <Tag className="w-5 h-5" />
              {translations?.buttons?.price || 'show memorial price'}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemorialActions;
