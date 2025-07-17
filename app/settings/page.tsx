"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Settings, Bell, Shield, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";

export default function SettingsPage() {
  const { t } = useTranslation();
  const settingsTranslations = t("setting");
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    memorialVisits: true,
    newComments: true,
    weeklyDigest: false,
    publicProfile: true,
    showEmail: false,
    allowComments: true,
    language: "English",
    timezone: "Asia/Tbilisi",
    theme: "light",
  });

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
                {settingsTranslations.header.backButton}
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">
                {" "}
                {settingsTranslations.header.title}
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
              {settingsTranslations.page.title}
            </h1>
            <p className="text-gray-600">
              {settingsTranslations.page.description}
            </p>
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-blue-500" />
                  {settingsTranslations.notifications.title}
                </CardTitle>
                <CardDescription>
                  {settingsTranslations.notifications.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {settingsTranslations.notifications.email}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {settingsTranslations.notifications.emailDescription}
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {settingsTranslations.notifications.push}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {settingsTranslations.notifications.pushDescription}
                    </p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("pushNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {settingsTranslations.notifications.visits}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {settingsTranslations.notifications.visitsDescription}
                    </p>
                  </div>
                  <Switch
                    checked={settings.memorialVisits}
                    onCheckedChange={(checked) =>
                      handleSettingChange("memorialVisits", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {settingsTranslations.notifications.comments}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {settingsTranslations.notifications.commentsDescription}
                    </p>
                  </div>
                  <Switch
                    checked={settings.newComments}
                    onCheckedChange={(checked) =>
                      handleSettingChange("newComments", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {settingsTranslations.notifications.digest}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {settingsTranslations.notifications.digestDescription}
                    </p>
                  </div>
                  <Switch
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) =>
                      handleSettingChange("weeklyDigest", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  {settingsTranslations.privacy.title}
                </CardTitle>
                <CardDescription>
                  {settingsTranslations.privacy.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {settingsTranslations.privacy.publicProfile}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {settingsTranslations.privacy.publicProfileDescription}
                    </p>
                  </div>
                  <Switch
                    checked={settings.publicProfile}
                    onCheckedChange={(checked) =>
                      handleSettingChange("publicProfile", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {settingsTranslations.privacy.showEmail}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {settingsTranslations.privacy.showEmailDescription}
                    </p>
                  </div>
                  <Switch
                    checked={settings.showEmail}
                    onCheckedChange={(checked) =>
                      handleSettingChange("showEmail", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">
                      {settingsTranslations.privacy.allowComments}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {settingsTranslations.privacy.allowCommentsDescription}
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowComments}
                    onCheckedChange={(checked) =>
                      handleSettingChange("allowComments", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                className="bg-[#547455] hover:bg-white hover:text-[#547455] border border-[#547455]"
                onClick={() => {
                  console.log("Save settings:", settings);
                  alert("Settings saved successfully!");
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {settingsTranslations.saveButton}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
