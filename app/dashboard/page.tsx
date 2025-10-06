"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  QrCode,
  Users,
  Heart,
  Settings,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Crown,
  MapPin,
  ShoppingCart,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "@/components/user-menu";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslate";
import { getDeleteMemorial, getMemorials } from "@/services/memorialService";
import { toast } from "react-toastify";
import IsUserAuth from "@/lib/IsUserAuth/page";
import { getUserDetails } from "@/services/userService";
import { useRouter } from "next/navigation";
import axiosInstance from "@/services/axiosInstance";
import LanguageDropdown from "@/components/languageDropdown/page";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function Dashboard() {
  const router = useRouter();
  const { t } = useTranslation();
  const dashboardTranslations = t("dashboard" as any);
  const commonTranslations = t("common");
  const helpTranslations = t("help");
  const dashboard: any = dashboardTranslations;
  const [searchQuery, setSearchQuery] = useState("");
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isCreatingDraft2, setIsCreatingDraft2] = useState(false);
  const limit = 1000; // Set a very high limit to show all memorials (effectively removes pagination)
  const [profileData, setProfileData] = useState({});
  const [stats, setStats] = useState([
    {
      label: dashboard.stats.totalMemorials,
      value: "0",
      icon: Heart,
      color: "text-red-600",
    },
    {
      label: dashboard.stats.totalViews,
      value: "0",
      icon: Eye,
      color: "text-blue-600",
    },
    {
      label: dashboard.stats.qrScans,
      value: "0",
      icon: QrCode,
      color: "text-green-600",
    },
    {
      label: dashboard.stats.familyMembers,
      value: "0",
      icon: Users,
      color: "text-purple-600",
    },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();
        setProfileData(userData.user)
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchMemorials = async () => {
      setLoading(true);
      try {
        const data = await getMemorials(currentPage, limit, searchQuery);
        setMemorials(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError("Failed to load memorials");
      } finally {
        setLoading(false);
      }
    };

    fetchMemorials();
  }, [currentPage, searchQuery]);


  // FIX: Create a derived state for memorials that are not "Untitled" drafts and have active payment status.
  // The backend now only returns memorials with successful payments, so we just filter out "Untitled" drafts
  const filteredMemorials = memorials.filter(
    (memorial) => memorial.firstName !== "Untitled"
  );

  const handleDeleteMemorial = async (memorialId: string) => {
    if (confirm("Are you sure you want to delete this memorial? This action cannot be undone.")) {
      try {
        await getDeleteMemorial(memorialId);
        toast.success("Memorial deleted successfully");
        setMemorials(memorials.filter(m => m._id !== memorialId));
      } catch (error) {
        console.error("Failed to delete memorial:", error);
        toast.error("Failed to delete memorial");
      }
    }
  };

  // NEW: Function to create draft memorial and redirect to creation form
  const handleCreateDraftMemorial = async () => {
    setIsCreatingDraft(true);
    try {
      const response = await axiosInstance.post('/api/memorials/create-draft');
      const { memorialId } = response.data;

      // Redirect to memorial creation form first
      router.push(`/memorial/create/${memorialId}`);
    } catch (error: any) {
      console.error("Failed to create draft memorial:", error);
      toast.error(error.response?.data?.message || "Failed to create draft memorial");
    } finally {
      setIsCreatingDraft(false);
    }
  };


  const handleCreateDraftMemorial2 = async () => {
    setIsCreatingDraft2(true);
    try {
      const response = await axiosInstance.post('/api/memorials/create-draft');
      const { memorialId } = response.data;

      // Redirect to memorial creation form first
      router.push(`/memorial/create/${memorialId}`);
    } catch (error: any) {
      console.error("Failed to create draft memorial:", error);
      toast.error(error.response?.data?.message || "Failed to create draft memorial");
    } finally {
      setIsCreatingDraft2(false);
    }
  };


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const loginData = localStorage.getItem("loginData");
        if (!loginData) {
          console.error("No login data found in localStorage.");
          return;
        }
        const user = JSON.parse(loginData);
        const userId = user._id;
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/auth/stats/${userId}`);
        const result = await response.json();

        if (result.status && result.data) {
          const apiData = result.data;
          setStats([
            {
              label: dashboard.stats.totalMemorials,
              value: String(apiData.totalMemorials),
              icon: Heart,
              color: "text-red-600",
            },
            {
              label: dashboard.stats.totalViews,
              value: String(apiData.totalViews),
              icon: Eye,
              color: "text-blue-600",
            },
            {
              label: dashboard.stats.qrScans,
              value: String(apiData.totalScans),
              icon: QrCode,
              color: "text-green-600",
            },
            {
              label: dashboard.stats.familyMembers,
              value: String(apiData.totalFamilyTreeCount),
              icon: Users,
              color: "text-purple-600",
            },
          ]);
        } else {
          console.error("Failed to fetch dashboard stats");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [dashboard]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] border-b ">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center md:space-x-3 space-x-2 my-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white rounded-xl"

                  onClick={() => router.push("/")}
                >
                  <QrCode className="h-5 w-5 text-[#243b31]" />{" "}
                </motion.div>
                <span className="md:text-2xl text-lg font-bold text-white whitespace-nowrap">
                  QRIP.ge
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <LanguageDropdown />
              <div className="flex items-center sm:space-x-2 space-x-0 gap-2">
                <UserMenu
                  user={profileData}
                />
                <Link target="_blank" href="https://m.me/qrip.ge" className="text-white">{helpTranslations.helpButton}</Link>
              </div>
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
          className="md:mb-8 mb-3"
        >
          <h1 className="md:text-3xl text-xl font-bold text-gray-900 mb-2">
            {dashboard.header.welcome}{profileData.firstname} {profileData.lastname}
          </h1>
          <p className="text-gray-600 text-base">{dashboard.header.subtitle}</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-3 md:mb-8 mb-4"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.label}
                      </p>
                      <p className="md:text-3xl text-xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full bg-gray-100 ${stat.color}`}
                    >
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 grid-cols-1 md:gap-8 gap-4">
          {/* Memorials List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <CardTitle>{dashboard.memorials.title}</CardTitle>
                    <CardDescription>
                      {dashboard.memorials.subtitle}
                    </CardDescription>
                  </div>
                  {/* MODIFIED: Changed from Link to Button with onClick handler */}
                  <Button
                    onClick={handleCreateDraftMemorial}
                    disabled={isCreatingDraft}
                    className="bg-[#547455] hover:bg-[#243b31] text-white"
                  >
                    <Plus className="h-4 w-4" />
                    {isCreatingDraft ? "Creating..." : dashboard.memorials.newMemorial}
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={dashboard.memorials.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="space-y-4"
                >
                  {filteredMemorials.map((memorial) => (
                    <motion.div key={memorial._id} variants={fadeInUp}>
                      <Link href={`/memorial/${memorial._id}`} target="_blank">
                        <div className="grid grid-cols-[auto_1fr_auto] md:items-center  md:p-4 p-2 border border-gray-200 rounded-lg hover:shadow-md transition-shadow  md:gap-3 gap-1">
                          <Avatar className="md:h-16 md:w-16 h-5 w-5">
                            <AvatarImage
                              src={memorial.profileImage || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {memorial.firstName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="sm:flex-1 min-w-0">
                            <div className="flex items-center mb-1 flex-wrap gap-1">
                              <h3 className="md:text-lg sm:text-base text-xs font-semibold text-gray-900 truncate">
                                {memorial.firstName}
                              </h3>
                              {memorial.plan === "premium" && (
                                <Crown className="h-4 w-4 text-yellow-500" />
                              )}
                              <Badge
                                variant={
                                  memorial.status === "active"
                                    ? "default text-xs"
                                    : "secondary text-xs"
                                }
                                className={
                                  memorial.status === "active"
                                    ? "!bg-green-600 text-white"
                                    : "!bg-red-600 text-white"
                                }
                              >
                                {memorial.status}
                              </Badge>


                              <Badge
                                variant={
                                  memorial.status === "active"
                                    ? "default text-xs"
                                    : "secondary text-xs"
                                }
                                className=

                                "!bg-yellow-600 text-white"


                              >
                                {memorial.purchase?.planId?.name}
                              </Badge>

                            </div>
                            <p className="text-gray-600 mb-2 text-sm">
                              {memorial.dates}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                              <span className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {memorial.viewsCount} views
                              </span>
                              <span className="flex items-center">
                                <QrCode className="h-4 w-4 mr-1" />
                                {memorial.scanCount}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {memorial.location}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-end items-center w-full">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/memorial/edit/${memorial._id}`}
                                    className="flex items-center"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    {dashboard.memorials.edit}
                                  </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/subscription?memorialId=${memorial._id}`}
                                    className="flex items-center"
                                  >
                                    <Crown className="h-4 w-4 mr-2" />
                                    {dashboard.memorials.managePlan}

                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>

                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href="/qr-generator"
                                    className="flex items-center"
                                  >
                                    <QrCode className="h-4 w-4 mr-2" />
                                    {dashboard.memorials.downloadQR}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/stickers/purchase?memorialId=${memorial._id}`}
                                    className="flex items-center"
                                  >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    {dashboard.memorials.buyQrSticker}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer"
                                  onClick={() => handleDeleteMemorial(memorial._id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  {dashboard.memorials.delete}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Link>
                    </motion.div>)
                  )}

                  {/* FIX: New robust logic for pagination and "No Memorials Found" message */}
                  {!loading && filteredMemorials.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No Memorials Found</p>
                  )}

                  {/* Pagination controls hidden since we're showing all memorials */}
                  {false && filteredMemorials.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      >
                        Previous
                      </Button>
                      <span className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{dashboard.quickActions.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={handleCreateDraftMemorial2}
                  disabled={isCreatingDraft2}
                  className="w-full justify-start bg-transparent mb-2"
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isCreatingDraft2 ? "Creating..." : dashboard.quickActions.createMemorial}
                </Button>
                <Link href="/qr-generator">
                  <Button
                    className="w-full justify-start bg-transparent mb-2"
                    variant="outline"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    {dashboard.quickActions.generateQR}
                  </Button>
                </Link>
                <Link href="/stickers/purchase">
                  <Button
                    className="w-full justify-start bg-transparent mb-2"
                    variant="outline"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {dashboard.quickActions.buyQrSticker}
                  </Button>
                </Link>
                {/* <Link href="/subscription">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    {dashboard.quickActions.managePlan}
                  </Button>
                </Link> */}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>{dashboard.recentActivity.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">
                      {dashboard.recentActivity.qrScanned.replace(
                        "{name}",
                        "John Smith"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">
                      {dashboard.recentActivity.memorialUpdated.replace(
                        "{name}",
                        "Mary Johnson"
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">
                      {dashboard.recentActivity.photoAdded.replace(
                        "{name}",
                        "Robert Wilson"
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardPage = () => {
  return (
    <IsUserAuth>
      <Dashboard />
    </IsUserAuth>
  )
}
export default DashboardPage;