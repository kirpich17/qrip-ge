// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, DollarSign, Search, Bell, QrCode, Package, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";
import { StatsCards } from "./StatsCards";
import { UserManagementTable } from "./UserManagementTable";
import { MemorialsTable } from "./MemorialsTable";
import { QrManagement } from "./QrManagement";
import { AnalyticsCharts } from "./AnalyticsCharts";
import { PlatformSettings } from "./PlatformSettings";
import { NotificationModal } from "./NotificationModal";
import { ProfileDropdown } from "./ProfileDropdown";
import IsAdminAuth from "@/lib/IsAdminAuth/page";
import axiosInstance from "@/services/axiosInstance";
import LanguageDropdown from "@/components/languageDropdown/page";

function AdminDashboardPage() {
  const { t } = useTranslation();
  const admindashTranslations: any = t("admindash" as any);
  const dashboardTranslations = t("adminDashboard") || {
    orders: {
      tabTitle: "Orders",
      title: "QR Sticker Orders",
      description: "Manage and track all QR sticker orders",
      viewAllOrders: "View All Orders",
      manageStickers: "Manage Stickers",
      orderManagement: "Order Management",
      orderManagementDescription: "View and manage all QR sticker orders in the dedicated orders page.",
      goToOrders: "Go to Orders"
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryMemorial, setSearchQueryMemorial] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [recentMemorials, setRecentMemorials] = useState([]);
  const [users, setUsers] = useState([]);

  // User Pagination
  const [userPage, setUserPage] = useState(1);
  const [userLimit] = useState(10);
  const [totalUserPages, setTotalUserPages] = useState(1);

  // Memorial Pagination
  const [memorialPage, setMemorialPage] = useState(1);
  const [memorialLimit] = useState(10);
  const [totalMemorialPages, setTotalMemorialPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/stats");
      setStats([
        {
          label: admindashTranslations.stats.totalUsers,
          value: res.data.users.total,
          change: "+" + res.data.users.percentageChange + "%",
          icon: Users,
          color: "text-blue-600",
          changeFromLastMonth: admindashTranslations.stats.changeFromLastMonth,
        },
        {
          label: admindashTranslations.stats.activeMemorials,
          value: res.data.activeMemorials.total,
          change: "+" + res.data.activeMemorials.percentageChange + "%",
          icon: Heart,
          color: "text-red-600",
          changeFromLastMonth: admindashTranslations.stats.changeFromLastMonth,
        },
        {
          label: admindashTranslations.stats.monthlyRevenue,
          value: "₾12,450",
          change: "+15%",
          icon: DollarSign,
          color: "text-green-600",
          changeFromLastMonth: admindashTranslations.stats.changeFromLastMonth,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/admin/allusers?page=${userPage}&limit=${userLimit}&search=${searchQuery}`
      );
      setUsers(res.data.users);
      // setTotalUserPages(res.data.pagination.totalPages);
      setHasSearched(true);
    } catch (error) {
      console.log(error);
      setUsers([]);
      setHasSearched(true);
    }
  };

  const fetchAllMemorials = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/admin/allmemorials?page=${memorialPage}&limit=${memorialLimit}&search=${searchQueryMemorial}`
      );
      setRecentMemorials(res.data.memorials || []);
      setTotalMemorialPages(res.data.pagination.totalPages);
    } catch (error) {
      console.log(error);
    }
  };

  const userStatusToggle = async (id) => {
    try {
      await axiosInstance.put(`/api/admin/toggle-user-status/${id}`);
      fetchAllUsers();
    } catch (error) {
      console.log(error);
    }
  };
  const memorailStatusToggle = async (id) => {
    try {
      const res = await axiosInstance.patch(`/api/admin/toggle-status-memorial/${id}`);
      fetchAllMemorials();
      console.log("🚀 ~ memorailStatusToggle ~ res:", res)
      if (res.data.status == 'active')
        toast.success(res.data.message);
      else if (res.data.status == 'inactive') {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [admindashTranslations]);

  useEffect(() => {
    fetchAllUsers();
  }, [userPage, searchQuery]);

  useEffect(() => {
    fetchAllMemorials();
  }, [memorialPage, searchQueryMemorial]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center sm:space-x-4 space-x-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white rounded-xl"
              >
                <QrCode className="h-5 w-5 text-[#243b31]" />
              </motion.div>
              <span className="md:text-2xl  text-xs font-bold text-white">
                {admindashTranslations.header.title}
              </span>
            </div>
            <div className="flex sm:gap-3 gap-0">
              <LanguageDropdown />
              <div className="flex items-center space-x-4">
                {/* <Button
                variant="ghost"
                size="sm"
                className="text-white md:flex hidden gap-1"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="h-4 w-4" />
                {admindashTranslations.header.notifications}
              </Button> */}

                <ProfileDropdown />
              </div>
            </div>

          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="md:text-3xl text-2xl font-bold mb-2">
            {admindashTranslations.welcome.title}
          </h1>
          <p>{admindashTranslations.welcome.description}</p>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>{admindashTranslations.quickAccess?.title || "Quick Access"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/testimonials">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {admindashTranslations.quickAccess?.manageTestimonials || "Manage Testimonials"}
                  </Button>
                </Link>
                <Link href="/admin/adminsubscription">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    {admindashTranslations.quickAccess?.subscriptionPlans || "Subscription Plans"}
                  </Button>
                </Link>
                <Link href="/admin/stickers">
                  <Button variant="outline" className="w-full justify-start">
                    <QrCode className="h-4 w-4 mr-2" />
                    {admindashTranslations.quickAccess?.qrStickers || "QR Stickers"}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
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
              value="orders"
              className="data-[state=active]:bg-[#547455] data-[state=active]:text-white"
            >
              <Package className="h-4 w-4 mr-2" />
              {dashboardTranslations?.orders?.tabTitle || "Orders"}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle>
                      {admindashTranslations.userManagement.title}
                    </CardTitle>
                    <CardDescription>
                      {admindashTranslations.userManagement.description}
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <Input
                      type='search'
                      placeholder={admindashTranslations?.userManagement?.searchPlaceholder || "Search users..."}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setUserPage(1);
                        setHasSearched(false);
                      }}
                      className="pl-10 text-black"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>

                {users.length === 0 && hasSearched ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {admindashTranslations.userManagement.noResults || "No users found"}
                    </p>
                  </div>
                ) : (
                  <>
                    <UserManagementTable
                      users={users}
                      fetchAllUsers={fetchAllUsers}
                      userStatusToggle={userStatusToggle}
                      translations={admindashTranslations.userManagement}
                    />
                    {/* <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600">
                    Page {userPage} of {totalUserPages}
                  </span>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
                      disabled={userPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setUserPage((p) => Math.min(p + 1, totalUserPages))
                      }
                      disabled={userPage === totalUserPages}
                    >
                      Next
                    </Button>
                  </div>
                </div> */}
                  </>)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memorials Tab */}
          <TabsContent value="memorials" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle>
                      {admindashTranslations.recentMemorials.title}
                    </CardTitle>
                    <CardDescription>
                      {admindashTranslations.recentMemorials.description}
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <Input
                      type='search'
                      placeholder={admindashTranslations?.recentMemorials?.searchPlaceholder || "Search memorials..."}
                      value={searchQueryMemorial}
                      onChange={(e) => {
                        setSearchQueryMemorial(e.target.value);
                        setUserPage(1);
                        setHasSearched(false);
                      }}
                      className="pl-10 text-black"
                    />
                  </div></div>

              </CardHeader>
              <CardContent>
                <MemorialsTable
                  memorials={recentMemorials}
                  memorailStatusToggle={memorailStatusToggle}
                  fetchAllMemorials={fetchAllMemorials}
                  translations={admindashTranslations.recentMemorials}
                />
                {/* <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600">
                    Page {memorialPage} of {totalMemorialPages}
                  </span>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setMemorialPage((p) => Math.max(p - 1, 1))}
                      disabled={memorialPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setMemorialPage((p) =>
                          Math.min(p + 1, totalMemorialPages)
                        )
                      }
                      disabled={memorialPage === totalMemorialPages}
                    >
                      Next
                    </Button>
                  </div>
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{dashboardTranslations?.orders?.title || "QR Sticker Orders"}</CardTitle>
                    <CardDescription>
                      {dashboardTranslations?.orders?.description || "Manage and track all QR sticker orders"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/admin/orders">
                      <Button className="bg-[#547455] hover:bg-[#243b31]">
                        <Package className="h-4 w-4 mr-2" />
                        {dashboardTranslations?.orders?.viewAllOrders || "View All Orders"}
                      </Button>
                    </Link>
                    <Link href="/admin/stickers">
                      <Button variant="outline">
                        <Package className="h-4 w-4 mr-2" />
                        {dashboardTranslations?.orders?.manageStickers || "Manage Stickers"}
                      </Button>
                    </Link>
                    <Link href="/admin/sticker-types">
                      <Button variant="outline">
                        <Package className="h-4 w-4 mr-2" />
                        {dashboardTranslations?.orders?.manageTypes || "Manage Types"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{dashboardTranslations?.orders?.orderManagement || "Order Management"}</h3>
                  <p className="text-gray-500 mb-4">
                    {dashboardTranslations?.orders?.orderManagementDescription || "View and manage all QR sticker orders in the dedicated orders page."}
                  </p>
                  <Link href="/admin/orders">
                    <Button className="bg-[#547455] hover:bg-[#243b31]">
                      {dashboardTranslations?.orders?.goToOrders || "Go to Orders"}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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

const page = () => {
  return (
    <IsAdminAuth>
      <AdminDashboardPage />
    </IsAdminAuth>
  );
};

export default page;
