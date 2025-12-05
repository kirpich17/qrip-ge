'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/services/axiosInstance';
import IsAdminAuth from '@/lib/IsAdminAuth/page';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface FooterInfo {
  phone: string | number;
  email: string;
  isVisibleEmail: boolean;
  isVisiblePhone: boolean;
}

const fetchFooterInfo = async (): Promise<FooterInfo> => {
  const { data } = await axiosInstance.get('/api/footerInfo');
  return data[0];
};

const updateFooterInfo = async (updatedData: Partial<FooterInfo>) => {
  const { data } = await axiosInstance.patch(
    '/api/footerInfoUpdate',
    updatedData
  );
  return data;
};

export default function AdminFooterInfoPage() {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FooterInfo>({
    phone: '',
    email: '',
    isVisibleEmail: true,
    isVisiblePhone: true,
  });

  // ✅ GET footer info
  const { isLoading } = useQuery({
    queryKey: ['footerInfo'],
    queryFn: fetchFooterInfo,
    onSuccess: (data) => {
      setFormData({
        phone: data.phone || '',
        email: data.email || '',
        isVisibleEmail: data.isVisibleEmail ?? true,
        isVisiblePhone: data.isVisiblePhone ?? true,
      });
    },
    onError: () => {
      toast.error('Failed to load footer info');
    },
  });

  // ✅ UPDATE mutation
  const updateMutation = useMutation({
    mutationFn: updateFooterInfo,
    onSuccess: (data) => {
      toast.success('Footer info updated successfully');
      setFormData({
        phone: data.phone,
        email: data.email,
        isVisibleEmail: data.isVisibleEmail,
        isVisiblePhone: data.isVisiblePhone,
      });
      queryClient.invalidateQueries({ queryKey: ['footerInfo'] });
    },
    onError: () => {
      toast.error('Failed to update footer info');
    },
  });

  const handleSubmit = () => {
    updateMutation.mutate(formData);
  };

  const toggleVisibility = (field: 'isVisibleEmail' | 'isVisiblePhone') => {
    const newValue = !formData[field];
    const updatedData = { ...formData, [field]: newValue };
    setFormData(updatedData);
    updateMutation.mutate({
      phone: formData.phone,
      email: formData.email,
      [field]: newValue,
    });
  };

  return (
    <IsAdminAuth>
      <div className="bg-gray-50 min-h-screen">
        <div className="flex justify-center mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <div className="flex flex-col items-center mb-8">
              <h1 className="mb-2 font-bold text-gray-900 text-xl md:text-3xl">
                Footer Info
              </h1>
              <p className="text-gray-600">Manage phone number and email</p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Footer Contact Info</CardTitle>
                <CardDescription>
                  Update the phone number and email displayed on the website
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto border-[#547455] border-b-2 rounded-full w-8 h-8 animate-spin"></div>
                    <p className="mt-2 text-gray-600">Loading footer info...</p>
                  </div>
                ) : (
                  <div className="gap-4 grid max-w-md">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Enter email"
                      />
                    </div>
                    <Button
                      onClick={handleSubmit}
                      className="bg-[#547455] hover:bg-[#243b31] mt-2"
                      disabled={updateMutation.isLoading}
                    >
                      {updateMutation.isLoading ? 'Updating...' : 'Update'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Toggle Settings</CardTitle>
                <CardDescription>
                  Control visibility of contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleVisibility('isVisibleEmail')}
                  disabled={updateMutation.isLoading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    formData.isVisibleEmail
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } ${
                    updateMutation.isLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {formData.isVisibleEmail ? 'Visible Email' : 'Hidden Email'}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleVisibility('isVisiblePhone')}
                  disabled={updateMutation.isLoading}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                    formData.isVisiblePhone
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } ${
                    updateMutation.isLoading
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {formData.isVisiblePhone ? 'Visible Phone' : 'Hidden Phone'}
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </IsAdminAuth>
  );
}
