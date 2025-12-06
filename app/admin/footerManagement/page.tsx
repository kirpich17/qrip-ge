'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import IsAdminAuth from '@/lib/IsAdminAuth/page';
import Header from '@/components/header/page';
import { Phone, Mail, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { fetchFooterInfo, updateFooterInfo } from '../api/adminApi';
import { FooterInfo } from '../type/adminType';

export default function AdminFooterInfoPage() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<FooterInfo>({
    phone: '',
    email: '',
    isVisibleEmail: true,
    isVisiblePhone: true,
  });

  const {
    data: footerData,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ['footerInfo'],
    queryFn: fetchFooterInfo,
  });

  useEffect(() => {
    if (footerData) {
      setFormData({
        phone: footerData.phone || '',
        email: footerData.email || '',
        isVisibleEmail: footerData.isVisibleEmail ?? true,
        isVisiblePhone: footerData.isVisiblePhone ?? true,
      });
    }
  }, [footerData]);

  const updateMutation = useMutation({
    mutationFn: updateFooterInfo,
    onSuccess: () => {
      toast.success('Updated successfully');
      queryClient.invalidateQueries({ queryKey: ['footerInfo'] });
    },
    onError: () => toast.error('Update failed'),
  });

  const handleSubmit = () => updateMutation.mutate(formData);

  const toggleVisibility = (field: 'isVisibleEmail' | 'isVisiblePhone') => {
    const newValue = !formData[field];
    setFormData({ ...formData, [field]: newValue });
    updateMutation.mutate({ ...formData, [field]: newValue });
  };

  return (
    <IsAdminAuth>
      <Header />
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8 min-h-screen">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-bold text-gray-900 text-3xl">
              Footer Settings
            </h1>
            <p className="text-gray-600">Manage contact information</p>
          </div>

          <Card className="shadow-lg mb-6">
            <CardHeader className="bg-[#547455]/5 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Phone className="w-5 h-5 text-[#547455]" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="mx-auto w-8 h-8 text-[#547455] animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="phone"
                      className="flex items-center gap-2 mb-2 font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="border-gray-300 focus:border-[#547455] focus:ring-[#547455]"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 mb-2 font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="border-gray-300 focus:border-[#547455] focus:ring-[#547455]"
                    />
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={updateMutation.isPending}
                    className="bg-[#547455] hover:bg-[#243b31] w-full"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />{' '}
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 w-4 h-4" /> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Eye className="w-5 h-5 text-gray-700" />
                Visibility
              </CardTitle>
            </CardHeader>
            <CardContent className="gap-3 grid sm:grid-cols-2 pt-6">
              <button
                onClick={() => toggleVisibility('isVisibleEmail')}
                disabled={updateMutation.isPending}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  formData.isVisibleEmail
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } ${
                  updateMutation.isPending
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {formData.isVisibleEmail ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
                {formData.isVisibleEmail ? 'Email Visible' : 'Email Hidden'}
              </button>

              <button
                onClick={() => toggleVisibility('isVisiblePhone')}
                disabled={updateMutation.isPending}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  formData.isVisiblePhone
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-md'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                } ${
                  updateMutation.isPending
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {formData.isVisiblePhone ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
                {formData.isVisiblePhone ? 'Phone Visible' : 'Phone Hidden'}
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </IsAdminAuth>
  );
}
