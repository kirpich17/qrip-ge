// app/dashboard/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  Search,
  Bell,
  QrCode,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslate";
import { StatsCards } from "./StatsCards";
import { UserManagementTable } from "./UserManagementTable";
import { MemorialsTable } from "./MemorialsTable";
import { QrManagement } from "./QrManagement";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { PlatformSettings } from "./PlatformSettings";
import { NotificationModal } from "./NotificationModal";
import { ProfileDropdown } from "./ProfileDropdown";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const admindashTranslations = t("admindash");
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const stats = [
    {
      label: admindashTranslations.stats.totalUsers,
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      changeFromLastMonth: admindashTranslations.stats.changeFromLastMonth,
    },
    {
      label: admindashTranslations.stats.activeMemorials,
      value: "3,891",
      change: "+8%",
      icon: Heart,
      color: "text-red-600",
      changeFromLastMonth: admindashTranslations.stats.changeFromLastMonth,
    },
    {
      label: admindashTranslations.stats.monthlyRevenue,
      value: "$12,450",
      change: "+15%",
      icon: DollarSign,
      color: "text-green-600",
      changeFromLastMonth: admindashTranslations.stats.changeFromLastMonth,
    },
    {
      label: admindashTranslations.stats.qrScans,
      value: "28,392",
      change: "+23%",
      icon: TrendingUp,
      color: "text-purple-600",
      changeFromLastMonth: admindashTranslations.stats.changeFromLastMonth,
    },
  ];

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      plan: "Premium",
      memorials: 3,
      status: "active",
      joined: "2024-01-15",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      plan: "Basic",
      memorials: 1,
      status: "active",
      joined: "2024-02-20",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      plan: "Premium",
      memorials: 5,
      status: "suspended",
      joined: "2023-12-10",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  const recentMemorials = [
    {
      id: 1,
      name: "Robert Wilson",
      creator: "Sarah Wilson",
      status: "pending",
      created: "2024-01-20",
      views: 45,
    },
    {
      id: 2,
      name: "Mary Johnson",
      creator: "Tom Johnson",
      status: "approved",
      created: "2024-01-19",
      views: 123,
    },
    {
      id: 3,
      name: "David Smith",
      creator: "Lisa Smith",
      status: "approved",
      created: "2024-01-18",
      views: 89,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white rounded-xl"
              >
                <QrCode className="h-5 w-5 text-[#243b31]" />
              </motion.div>
              <span className="md:text-2xl text-base font-bold text-white">
                {admindashTranslations.header.title}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white md:flex hidden gap-1"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="h-4 w-4" />
                {admindashTranslations.header.notifications}
              </Button>

              <ProfileDropdown />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="md:text-3xl text-2xl font-bold mb-2">
            {admindashTranslations.welcome.title}
          </h1>
          <p className="">{admindashTranslations.welcome.description}</p>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6 w-full">
          <TabsList className="overflow-x-auto md:w-auto w-full">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-[#547455] data-[state=active]:text-white"
            >
              {admindashTranslations.tabs.users}
            </TabsTrigger>
            <TabsTrigger
              value="memorials"
              className="data-[state=active]:bg-[#547455] data-[state=active]:text-white"
            >
              {admindashTranslations.tabs.memorials}
            </TabsTrigger>
            <TabsTrigger
              value="qr-codes"
              className="data-[state=active]:bg-[#547455] data-[state=active]:text-white"
            >
              {admindashTranslations.tabs.qrCodes}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card className="">
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle className="mb-2">
                      {admindashTranslations.userManagement.title}
                    </CardTitle>
                    <CardDescription className="">
                      {admindashTranslations.userManagement.description}
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-black focus-visible:outline-none"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <UserManagementTable
                  users={users}
                  translations={admindashTranslations.userManagement}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memorials" className="space-y-6">
            <Card className="">
              <CardHeader>
                <CardTitle className="">
                  {admindashTranslations.recentMemorials.title}
                </CardTitle>
                <CardDescription className="">
                  {admindashTranslations.recentMemorials.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MemorialsTable
                  memorials={recentMemorials}
                  translations={admindashTranslations.recentMemorials}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr-codes" className="space-y-6">
            <QrManagement translations={admindashTranslations.qrManagement} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsCharts translations={admindashTranslations.analytics} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <PlatformSettings
              translations={admindashTranslations.platformSettings}
            />
          </TabsContent>
        </Tabs>
      </div>
      <NotificationModal
        open={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
