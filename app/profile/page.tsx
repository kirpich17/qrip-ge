"use client";

import { useState } from "react";
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

export default function ProfilePage() {
  const { t } = useTranslation();
  const profileTranslations = t("profile");
  
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+995 555 123 456",
    location: "Tbilisi, Georgia",
    bio: "Memorial creator and family historian dedicated to preserving memories for future generations.",
    joinDate: "2024-01-15",
    plan: "Basic Premium",
    avatar: null,
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
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
                className="flex items-center text-white hover:underline"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                {profileTranslations.header.backButton}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">
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
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {profileData.firstName} {profileData.lastName}
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
                      console.log("Upload avatar");
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = "image/*";
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          console.log("Selected avatar:", file);
                          // Handle avatar upload
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

              <Card className="mt-6">
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
              </Card>
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
                      <Label htmlFor="firstName">
                        {profileTranslations.personalInfo.firstName}
                      </Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {profileTranslations.personalInfo.lastName}
                      </Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
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
                      onClick={() => {
                        console.log("Save profile:", profileData);
                        alert("Profile updated successfully!");
                      }}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {profileTranslations.personalInfo.saveChanges}
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
//       "firstName":
//       "lastName":
//       "email":
//       "phone":
//       "location":
//       "bio":
//       "bioPlaceholder":
//       "saveChanges":
//     }
//   }
