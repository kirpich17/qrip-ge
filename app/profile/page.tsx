"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  Crown,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";
import { getUserDetails, updateUserDetails, uploadProfileImage } from "@/services/userService";
import { toast } from "react-toastify";
import LanguageDropdown from "@/components/languageDropdown/page";

export default function ProfilePage() {
  const { t } = useTranslation();
  const profileTranslations = t("profile");

  const [profileData, setProfileData] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profileImage: "",
    plan: "",
    shippingDetails: {
      fullName: "",
      address: "",
      phone: "",
      zipCode: "",
      city: "",
      country: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    try {
      const userData = await getUserDetails();
      // Ensure shippingDetails is at least an empty object if null/undefined
      setProfileData({ ...userData.user, shippingDetails: userData.user.shippingDetails || {} });
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleShippingInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      shippingDetails: {
        ...prev.shippingDetails,
        [field]: value,
      },
    }));
  };

  const handleAvatarUpload = async (file) => {
    if (!profileData._id) {
      console.error("User ID is missing");
      return;
    }
    setIsLoading(true);
    try {
      const updatedUser = await uploadProfileImage(profileData._id, file);
      setProfileData((prev) => ({
        ...prev,
        profileImage: updatedUser.data.profileImage,
      }));
      fetchUserData();
      toast.success("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to update profile image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData._id) {
      console.error("User ID is missing");
      return;
    }
    setIsLoading(true);
    try {
      const updatedUser = await updateUserDetails(profileData._id, profileData);
      setProfileData(updatedUser.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:underline text-xs sm:text-lg gap-1"
              >
                <ArrowLeft className="h-5 w-5" />
                {profileTranslations.header.backButton}
              </Link>
            </div>
            <LanguageDropdown/>
            <div className="flex items-center gap-1">
              <User className="h-5 w-5 text-white" />
              <span className="text-xs sm:text-lg font-bold text-white">
                {profileTranslations.header.title}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profileTranslations.page.title}
            </h1>
            <p className="text-gray-600">
              {profileTranslations.page.description}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {profileTranslations.profileOverview.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage
                      src={
                        profileData.profileImage ||
                        "/placeholder.svg?height=96&width=96"
                      }
                    />
                    <AvatarFallback className="text-2xl">
                      {profileData.firstname?.[0]}
                      {profileData.lastname?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {profileData.firstname} {profileData.lastname}
                  </h3>
                  <p className="text-gray-600 mb-3">{profileData.email}</p>
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800"
                    >
                      {profileData.plan}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) => {
                        const file = (e.target).files?.[0];
                        if (file) {
                          handleAvatarUpload(file);
                        }
                      };
                      input.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {profileTranslations.profileOverview.changeAvatar}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Profile & Shipping Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Info Form */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {profileTranslations.personalInfo.title}
                  </CardTitle>
                  <CardDescription>
                    {profileTranslations.personalInfo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstname">
                        {profileTranslations.personalInfo.firstname}
                      </Label>
                      <Input
                        id="firstname"
                        value={profileData.firstname || ""}
                        onChange={(e) =>
                          handleInputChange("firstname", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastname">
                        {profileTranslations.personalInfo.lastname}
                      </Label>
                      <Input
                        id="lastname"
                        value={profileData.lastname || ""}
                        onChange={(e) =>
                          handleInputChange("lastname", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {profileTranslations.personalInfo.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {profileTranslations.personalInfo.phone}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone || ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {profileTranslations.personalInfo.location}
                    </Label>
                    <Input
                      id="location"
                      value={profileData.location || ""}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">
                      {profileTranslations.personalInfo.bio}
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself..."
                      value={profileData.bio || ""}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Home className="h-5 w-5 mr-2" />
                    {profileTranslations.shippingInfo.title}
                  </CardTitle>
                  <CardDescription>
                    {profileTranslations.shippingInfo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      {profileTranslations.shippingInfo.fullName}
                    </Label>
                    <Input
                      id="fullName"
                      value={profileData.shippingDetails.fullName || ""}
                      onChange={(e) =>
                        handleShippingInputChange("fullName", e.target.value)
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">
                      {profileTranslations.shippingInfo.address}
                    </Label>
                    <Input
                      id="address"
                      value={profileData.shippingDetails.address || ""}
                      onChange={(e) =>
                        handleShippingInputChange("address", e.target.value)
                      }
                      className="h-12"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shipping-phone">
                        {profileTranslations.shippingInfo.phone}
                      </Label>
                      <Input
                        id="shipping-phone"
                        type="tel"
                        value={profileData.shippingDetails.phone || ""}
                        onChange={(e) =>
                          handleShippingInputChange("phone", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">
                        {profileTranslations.shippingInfo.zipCode}
                      </Label>
                      <Input
                        id="zipCode"
                        value={profileData.shippingDetails.zipCode || ""}
                        onChange={(e) =>
                          handleShippingInputChange("zipCode", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">
                        {profileTranslations.shippingInfo.city}
                      </Label>
                      <Input
                        id="city"
                        value={profileData.shippingDetails.city || ""}
                        onChange={(e) =>
                          handleShippingInputChange("city", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">
                        {profileTranslations.shippingInfo.country}
                      </Label>
                      <Input
                        id="country"
                        value={profileData.shippingDetails.country || ""}
                        onChange={(e) =>
                          handleShippingInputChange("country", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  className="bg-[#547455] hover:bg-white hover:text-[#547455] border border-[#547455]"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading
                    ? profileTranslations.personalInfo.saving
                    : profileTranslations.personalInfo.saveChanges}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}