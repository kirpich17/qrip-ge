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

export default function ProfilePage() {
  const { t } = useTranslation();
  const profileTranslations = t("profile");
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(false);


  const fetchUserData = async () => {
    try {
      const userData = await getUserDetails();
      setProfileData(userData.user)
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };


  const handleAvatarUpload = async (file: File) => {
    if (!profileData._id) {
      console.error("User ID is missing");
      return;
    }
    setIsLoading(true);
    try {
      const updatedUser = await uploadProfileImage(profileData._id, file);
      setProfileData(prev => ({
        ...prev,
        profileImage: updatedUser.data.profileImage 
      }));
      fetchUserData()
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
                    <AvatarImage src={profileData.profileImage || "/placeholder.svg?height=96&width=96"} />
                    <AvatarFallback className="text-2xl">
                      {profileData.firstname}
                      {profileData.lastname}
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
                        const file = (e.target as HTMLInputElement).files?.[0];
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

              {/* <Card className="mt-6">
                <CardHeader>
                  <CardTitle>
                    {profileTranslations.accountStats.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {profileTranslations.accountStats.memberSince}
                    </span>
                    <span className="font-medium">
                      {new Date(profileData.joinDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {profileTranslations.accountStats.memorialsCreated}
                    </span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {profileTranslations.accountStats.totalViews}
                    </span>
                    <span className="font-medium">1,247</span>
                  </div>
                  <Separator />
                  <Link href="/subscription">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      {profileTranslations.accountStats.manageSubscription}
                    </Button>
                  </Link>
                </CardContent>
              </Card> */}
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
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
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstname">
                        {profileTranslations.personalInfo.firstname}
                      </Label>
                      <Input
                        id="firstname"
                        value={profileData.firstname}
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
                        value={profileData.lastname}
                        onChange={(e) =>
                          handleInputChange("lastname", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {profileTranslations.personalInfo.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
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
                      value={profileData.phone}
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
                      value={profileData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      className="h-12"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">
                      {profileTranslations.personalInfo.bio}
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself..."
                      value={profileData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Separator />

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button
                      className="bg-[#547455] hover:bg-white hover:text-[#547455] border border-[#547455]"
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? profileTranslations.personalInfo.saving : profileTranslations.personalInfo.saveChanges}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

//  "profilepage": {
//     "header": {
//       "backButton":
//       "title":
//     },
//     "page": {
//       "title":
//       "description":
//     },
//     "profileOverview": {
//       "title":
//       "changeAvatar":
//     },
//     "accountStats": {
//       "title":
//       "memberSince":
//       "memorialsCreated":
//       "totalViews":
//       "manageSubscription":
//     },
//     "personalInfo": {
//       "title":
//       "description":
//       "firstname":
//       "lastname":
//       "email":
//       "phone":
//       "location":
//       "bio":
//       "bioPlaceholder":
//       "saveChanges":
//     }
//   }
