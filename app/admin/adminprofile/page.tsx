"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  Lock,
  Bell,
  Shield,
  Settings,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};


export default function AdminProfile() {
  const { t } = useTranslation();
  const adminprofileTranslations = t("adminprofile");

  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState({
    name: "Admin User",
    email: "admin@qrip.ge",
    phone: "+995 123 456 789",
    location: "Tbilisi, Georgia",
    bio: "Platform administrator with full system access and management privileges.",
    avatar: "/admin-avatar.jpg",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    systemAlerts: true,
    userActivity: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showEmail: false,
    showActivity: false,
  });

  // Security states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showLoginActivity, setShowLoginActivity] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginActivities, setLoginActivities] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "Tbilisi, Georgia",
      ip: "192.168.1.1",
      time: "Today, 10:30 AM",
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "Batumi, Georgia",
      ip: "192.168.1.2",
      time: "Yesterday, 3:45 PM",
    },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, you would save to API here
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    // In a real app, you would verify current password and update
    alert("Password changed successfully!");
    setShowChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    alert(
      twoFactorEnabled
        ? "Two-factor authentication disabled"
        : "Two-factor authentication enabled"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="flex items-center text-white hover:underline gap-2 text-base"
              >
                <ArrowLeft className="h-5 w-5" />
                {adminprofileTranslations?.header?.back || "Back to Dashboard"}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <User className="md:h-6 md:w-6 w-4 h-4 text-white" />
              <span className="md:text-xl text-base font-bold text-white">
                {adminprofileTranslations?.header?.title || "Admin Profile"}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 md:gap-8 gap-4">
            {/* Left Column - Profile Overview */}
            <div className="lg:col-span-1 md:space-y-6 space-y-4">
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {adminprofileTranslations?.profileOverview?.title ||
                        "Profile Overview"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={adminData.avatar} />
                        <AvatarFallback>AU</AvatarFallback>
                      </Avatar>

                      {isEditing ? (
                        <Input
                          name="name"
                          value={adminData.name}
                          onChange={handleInputChange}
                          className="text-center text-lg font-semibold"
                        />
                      ) : (
                        <h3 className="text-lg font-semibold">
                          {adminData.name}
                        </h3>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4 text-[#547455]" />
                        <span>
                          {adminprofileTranslations?.common?.administrator}
                        </span>
                      </div>

                      <div className="w-full pt-4">
                        <h4 className="font-medium text-sm mb-2">
                          {
                            adminprofileTranslations?.profileOverview
                              ?.accountStats
                          }
                        </h4>
                        <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 text-sm">
                          <div className="bg-gray-100 p-2 rounded">
                            <div className="font-medium">
                              {
                                adminprofileTranslations?.profileOverview
                                  ?.memberSince
                              }
                            </div>
                            <div>Jan 2023</div>
                          </div>
                          <div className="bg-gray-100 p-2 rounded">
                            <div className="font-medium">
                              {
                                adminprofileTranslations?.profileOverview
                                  ?.lastActive
                              }
                            </div>
                            <div>Today</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      {adminprofileTranslations?.security?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showChangePassword ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {
                              adminprofileTranslations?.security
                                ?.currentPassword
                            }
                          </label>
                          <div className="relative">
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              value={currentPassword}
                              onChange={(e) =>
                                setCurrentPassword(e.target.value)
                              }
                              placeholder={
                                adminprofileTranslations?.security
                                  ?.currentPassword
                              }
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-2.5"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {adminprofileTranslations?.security?.newPassword}
                          </label>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder={
                                adminprofileTranslations?.security?.newPassword
                              }
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-2.5"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {
                              adminprofileTranslations?.security
                                ?.confirmPassword
                            }
                          </label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              placeholder={
                                adminprofileTranslations?.security
                                  ?.confirmPassword
                              }
                            />
                            <button
                              type="button"
                              className="absolute right-2 top-2.5"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={handlePasswordChange}
                            className="bg-[#243b31] hover:bg-[#547455]"
                          >
                            {adminprofileTranslations?.security?.savePassword}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowChangePassword(false)}
                          >
                            {adminprofileTranslations?.security?.cancel}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowChangePassword(true)}
                        >
                          {adminprofileTranslations?.security?.changePassword}
                        </Button>
                      </div>
                    )}

                    {showTwoFactor ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {
                                adminprofileTranslations?.security
                                  ?.twoFactorAuth
                              }
                            </h4>
                            <p className="text-sm text-gray-600">
                              {
                                adminprofileTranslations?.security
                                  ?.twoFactorDesc
                              }
                            </p>
                          </div>
                          <Switch
                            checked={twoFactorEnabled}
                            onCheckedChange={toggleTwoFactor}
                          />
                        </div>
                        {twoFactorEnabled && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              {
                                adminprofileTranslations?.security
                                  ?.verificationCode
                              }
                            </label>
                            <Input
                              type="text"
                              placeholder={
                                adminprofileTranslations?.security
                                  ?.verificationCode
                              }
                            />
                            <Button className="w-full bg-[#243b31] hover:bg-[#547455]">
                              {adminprofileTranslations?.security?.verify}
                            </Button>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowTwoFactor(false)}
                        >
                          {adminprofileTranslations?.security?.done}
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowTwoFactor(true)}
                        >
                          {adminprofileTranslations?.security?.twoFactorAuth}
                        </Button>
                      </div>
                    )}

                    {showLoginActivity ? (
                      <div className="space-y-4">
                        <h4 className="font-medium">
                          {adminprofileTranslations?.security?.loginActivity}
                        </h4>
                        <div className="space-y-3">
                          {loginActivities.map((activity) => (
                            <div
                              key={activity.id}
                              className="border rounded p-3 text-sm"
                            >
                              <div className="font-medium">
                                {activity.device}
                              </div>
                              <div className="text-gray-600">
                                {activity.location} ({activity.ip})
                              </div>
                              <div className="text-gray-500">
                                {activity.time}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowLoginActivity(false)}
                        >
                          {adminprofileTranslations?.security?.close}
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setShowLoginActivity(true)}
                        >
                          {adminprofileTranslations?.security?.loginActivity}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2 md:space-y-6 space-y-4">
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center flex-wrap">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {adminprofileTranslations?.personalInfo?.title ||
                          "Personal Information"}
                      </CardTitle>
                      {isEditing ? (
                        <Button
                          onClick={handleSave}
                          className="bg-[#243b31] hover:bg-[#547455]"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {adminprofileTranslations?.personalInfo?.saveChanges}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          {adminprofileTranslations?.personalInfo?.editProfile}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {adminprofileTranslations?.personalInfo?.fullName}
                        </label>
                        {isEditing ? (
                          <Input
                            name="name"
                            value={adminData.name}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <User className="h-4 w-4 text-gray-500" />
                            <span>{adminData.name}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {adminprofileTranslations?.personalInfo?.email}
                        </label>
                        {isEditing ? (
                          <Input
                            name="email"
                            value={adminData.email}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{adminData.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {adminprofileTranslations?.personalInfo?.phone}
                        </label>
                        {isEditing ? (
                          <Input
                            name="phone"
                            value={adminData.phone}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span>{adminData.phone}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {adminprofileTranslations?.personalInfo?.location}
                        </label>
                        {isEditing ? (
                          <Input
                            name="location"
                            value={adminData.location}
                            onChange={handleInputChange}
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-2 border rounded">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{adminData.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {adminprofileTranslations?.personalInfo?.bio}
                      </label>
                      {isEditing ? (
                        <Textarea
                          name="bio"
                          value={adminData.bio}
                          onChange={handleInputChange}
                          rows={3}
                        />
                      ) : (
                        <div className="p-3 border rounded bg-gray-50 text-sm">
                          {adminData.bio}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      {adminprofileTranslations?.notifications?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {
                            adminprofileTranslations?.notifications
                              ?.emailNotifications
                          }
                        </h4>
                        <p className="text-sm text-gray-600">
                          {adminprofileTranslations?.notifications?.emailDesc}
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.email}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            email: checked,
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {
                            adminprofileTranslations?.notifications
                              ?.pushNotifications
                          }
                        </h4>
                        <p className="text-sm text-gray-600">
                          {adminprofileTranslations?.notifications?.pushDesc}
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.push}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            push: checked,
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {
                            adminprofileTranslations?.notifications
                              ?.systemAlerts
                          }
                        </h4>
                        <p className="text-sm text-gray-600">
                          {adminprofileTranslations?.notifications?.systemDesc}
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.systemAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            systemAlerts: checked,
                          })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          {
                            adminprofileTranslations?.notifications
                              ?.userActivity
                          }
                        </h4>
                        <p className="text-sm text-gray-600">
                          {
                            adminprofileTranslations?.notifications
                              ?.userActivityDesc
                          }
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.userActivity}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            userActivity: checked,
                          })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
