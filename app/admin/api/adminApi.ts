import axiosInstance from '@/services/axiosInstance';
import { FooterInfo } from '../type/adminType';

export const fetchFooterInfo = async (): Promise<FooterInfo> => {
  const { data } = await axiosInstance.get('/api/footerInfo');
  return data[0];
};

export const updateFooterInfo = async (updatedData: Partial<FooterInfo>) => {
  const { data } = await axiosInstance.patch(
    '/api/footerInfoUpdate',
    updatedData
  );
  return data;
};
