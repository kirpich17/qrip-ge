"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/services/axiosInstance";
import IsAdminAuth from "@/lib/IsAdminAuth/page";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface FooterInfo {
  phone: string | number;
  email: string;
}

export default function AdminFooterInfoPage() {
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState<FooterInfo>({
    phone: "",
    email: "",
  });

  // GET request
  const { isLoading } = useQuery({
    queryKey: ["footerInfo"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        "http://localhost:4040/api/footerInfo"
      );
      return response.data;
    },
    onSuccess: (data: FooterInfo) => {
      setFormData({ phone: data.phone, email: data.email }); // set default values
    },
    onError: () => {
      toast.error("Failed to load footer info");
    },
  });

  // PATCH request
  const updateMutation = useMutation({
    mutationFn: async (updatedData: FooterInfo) => {
      const response = await axiosInstance.patch(
        "http://localhost:4040/api/footerInfo",
        updatedData
      );
      return response.data;
    },
    onSuccess: (data: FooterInfo) => {
      toast.success("Footer info updated successfully");
      setFormData({ phone: data.phone, email: data.email });
      queryClient.invalidateQueries({ queryKey: ["footerInfo"] });
    },
    onError: () => {
      toast.error("Failed to update footer info");
    },
  });

  const handleSubmit = () => {
    updateMutation.mutate(formData);
  };

  return (
    <IsAdminAuth>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <div className="mb-8 flex flex-col items-center">
              <h1 className="md:text-3xl text-xl font-bold text-gray-900 mb-2">
                Footer Info
              </h1>
              <p className="text-gray-600">Manage phone number and email</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Footer Contact Info</CardTitle>
                <CardDescription>
                  Update the phone number and email displayed on the website
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#547455] mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading footer info...</p>
                  </div>
                ) : (
                  <div className="grid gap-4 max-w-md">
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
                      {updateMutation.isLoading ? "Updating..." : "Update"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </IsAdminAuth>
  );
}
