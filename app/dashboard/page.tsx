'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenu } from '@/components/user-menu';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslate';
import { getDeleteMemorial, getMemorials } from '@/services/memorialService';
import { getUserRecentActivities, Activity } from '@/services/activityService';
import { toast } from 'react-toastify';
import IsUserAuth from '@/lib/IsUserAuth/page';
import { getUserDetails } from '@/services/userService';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/services/axiosInstance';
import LanguageDropdown from '@/components/languageDropdown/page';

// const fadeInUp = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.5 },
// };

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
  const dashboardTranslations = t('dashboard' as any);
  const commonTranslations = t('common');
  const helpTranslations = t('help');
  const dashboard: any = dashboardTranslations;
  const [searchQuery, setSearchQuery] = useState('');
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const [isCreatingDraft2, setIsCreatingDraft2] = useState(false);
  const limit = 1000; // Set a very high limit to show all memorials (effectively removes pagination)
  const [profileData, setProfileData] = useState({});
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      label: dashboard.stats.totalMemorials,
      value: '0',
      icon: Heart,
      color: 'text-red-600',
    },
    {
      label: dashboard.stats.totalViews,
      value: '0',
      icon: Eye,
      color: 'text-blue-600',
    },
    {
      label: dashboard.stats.qrScans,
      value: '0',
      icon: QrCode,
      color: 'text-green-600',
    },
    {
      label: dashboard.stats.familyMembers,
      value: '0',
      icon: Users,
      color: 'text-purple-600',
    },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserDetails();
        setProfileData(userData.user);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch recent activities
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const response = await getUserRecentActivities(5); // Get 5 most recent activities
        if (response.status && response.data) {
          setRecentActivities(response.data);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        // Set empty array on error to show no activities
        setRecentActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchMemorials = async () => {
      setLoading(true);
      try {
        const data = await getMemorials(currentPage, limit, searchQuery);
        setMemorials(data.data);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        setError('Failed to load memorials');
      } finally {
        setLoading(false);
      }
    };

    fetchMemorials();
  }, [currentPage, searchQuery]);

  // FIX: Create a derived state for memorials that are not "Untitled" drafts and have active payment status.
  // The backend now only returns memorials with successful payments, so we just filter out "Untitled" drafts
  const filteredMemorials = memorials.filter(
    (memorial) => memorial.firstName !== 'Untitled'
  );

  const handleDeleteMemorial = async (memorialId: string) => {
    if (
      confirm(
        'Are you sure you want to delete this memorial? This action cannot be undone.'
      )
    ) {
      try {
        await getDeleteMemorial(memorialId);
        toast.success('Memorial deleted successfully');
        setMemorials(memorials.filter((m) => m._id !== memorialId));
      } catch (error) {
        console.error('Failed to delete memorial:', error);
        toast.error('Failed to delete memorial');
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
      console.error('Failed to create draft memorial:', error);
      toast.error(
        error.response?.data?.message || 'Failed to create draft memorial'
      );
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
      console.error('Failed to create draft memorial:', error);
      toast.error(
        error.response?.data?.message || 'Failed to create draft memorial'
      );
    } finally {
      setIsCreatingDraft2(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const loginData = localStorage.getItem('loginData');
        if (!loginData) {
          console.error('No login data found in localStorage.');
          return;
        }
        const user = JSON.parse(loginData);
        const userId = user._id;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/auth/stats/${userId}`
        );
        const result = await response.json();

        if (result.status && result.data) {
          const apiData = result.data;
          setStats([
            {
              label: dashboard.stats.totalMemorials,
              value: String(apiData.totalMemorials),
              icon: Heart,
              color: 'text-red-600',
            },
            {
              label: dashboard.stats.totalViews,
              value: String(apiData.totalViews),
              icon: Eye,
              color: 'text-blue-600',
            },
            {
              label: dashboard.stats.qrScans,
              value: String(apiData.totalScans),
              icon: QrCode,
              color: 'text-green-600',
            },
            {
              label: dashboard.stats.familyMembers,
              value: String(apiData.totalFamilyTreeCount),
              icon: Users,
              color: 'text-purple-600',
            },
          ]);
        } else {
          console.error('Failed to fetch dashboard stats');
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
  }, [dashboard]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-[#243b31] border-b">
        <div className="mx-auto px-2 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex justify-center items-center space-x-2 md:space-x-3 my-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white p-2 rounded-xl"
                  onClick={() => router.push('/')}
                >
                  <QrCode className="w-5 h-5 text-[#243b31]" />{' '}
                </motion.div>
                <span className="font-bold text-white text-lg md:text-2xl whitespace-nowrap">
                  QRIP.ge
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <LanguageDropdown />
              <div className="flex items-center gap-2 space-x-0 sm:space-x-2">
                <UserMenu user={profileData} />
                <Link
                  target="_blank"
                  href="https://m.me/qrip.ge"
                  className="text-white"
                >
                  {helpTranslations.helpButton}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3 md:mb-8"
        >
          <h1 className="mb-2 font-bold text-gray-900 text-xl md:text-3xl">
            {dashboard.header.welcome}
            <span className="ml-2">
              {profileData.firstname} {profileData.lastname}
            </span>
          </h1>
          <p className="text-gray-600 text-base">{dashboard.header.subtitle}</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="gap-3 md:gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-4 md:mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-600 text-sm">
                        {stat.label}
                      </p>
                      <p className="font-bold text-gray-900 text-xl md:text-3xl">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full bg-gray-100 ${stat.color}`}
                    >
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="gap-4 md:gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Memorials List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
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
                    <Plus className="w-4 h-4" />
                    {isCreatingDraft
                      ? 'Creating...'
                      : dashboard.memorials.newMemorial}
                  </Button>
                </div>
                <div className="relative">
                  <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2 transform" />
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
                    <motion.div key={memorial._id}>
                      <Link href={`/memorial/${memorial._id}`} target="_blank">
                        <div className="md:items-center gap-1 md:gap-3 grid grid-cols-[auto_1fr_auto] hover:shadow-md p-2 md:p-4 border border-gray-200 rounded-lg transition-shadow">
                          <Avatar className="w-5 md:w-16 h-5 md:h-16">
                            <AvatarImage
                              src={memorial.profileImage || '/placeholder.svg'}
                            />
                            <AvatarFallback>
                              {memorial.firstName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>

                          <div className="sm:flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1 mb-1">
                              <h3 className="font-semibold text-gray-900 text-xs sm:text-base md:text-lg truncate">
                                {memorial.firstName}
                              </h3>
                              {memorial.plan === 'premium' && (
                                <Crown className="w-4 h-4 text-yellow-500" />
                              )}
                              <Badge
                                variant={
                                  memorial.status === 'active'
                                    ? 'default text-xs'
                                    : 'secondary text-xs'
                                }
                                className={
                                  memorial.status === 'active'
                                    ? '!bg-green-600 text-white'
                                    : '!bg-red-600 text-white'
                                }
                              >
                                {memorial.status}
                              </Badge>

                              <Badge
                                variant={
                                  memorial.status === 'active'
                                    ? 'default text-xs'
                                    : 'secondary text-xs'
                                }
                                className="!bg-yellow-600 text-white"
                              >
                                {memorial.purchase?.planId?.name}
                              </Badge>
                            </div>
                            <p className="mb-2 text-gray-600 text-sm">
                              {memorial.dates}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
                              <span className="flex items-center">
                                <Eye className="mr-1 w-4 h-4" />
                                {memorial.viewsCount} views
                              </span>
                              <span className="flex items-center">
                                <QrCode className="mr-1 w-4 h-4" />
                                {memorial.scanCount}
                              </span>
                              <span className="flex items-center">
                                <MapPin className="mr-1 w-4 h-4" />
                                {memorial.location}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-end items-center w-full">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-0"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/memorial/edit/${memorial._id}`}
                                    className="flex items-center"
                                  >
                                    <Edit className="mr-2 w-4 h-4" />
                                    {dashboard.memorials.edit}
                                  </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/subscription?memorialId=${memorial._id}`}
                                    className="flex items-center"
                                  >
                                    <Crown className="mr-2 w-4 h-4" />
                                    {dashboard.memorials.managePlan}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild></DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href="/qr-generator"
                                    className="flex items-center"
                                  >
                                    <QrCode className="mr-2 w-4 h-4" />
                                    {dashboard.memorials.downloadQR}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/stickers/purchase?memorialId=${memorial._id}`}
                                    className="flex items-center"
                                  >
                                    <ShoppingCart className="mr-2 w-4 h-4" />
                                    {dashboard.memorials.buyQrSticker}
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 cursor-pointer"
                                  onClick={() =>
                                    handleDeleteMemorial(memorial._id)
                                  }
                                >
                                  <Trash2 className="mr-2 w-4 h-4" />
                                  {dashboard.memorials.delete}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}

                  {/* FIX: New robust logic for pagination and "No Memorials Found" message */}
                  {!loading && filteredMemorials.length === 0 && (
                    <p className="py-8 text-gray-500 text-center">
                      {dashboard.memorials.noMemorialsFound}
                    </p>
                  )}

                  {/* Pagination controls hidden since we're showing all memorials */}
                  {false && filteredMemorials.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                      <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                      >
                        Previous
                      </Button>
                      <span className="text-gray-700 text-sm">
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
                  className="justify-start bg-transparent mb-2 w-full"
                  variant="outline"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  {isCreatingDraft2
                    ? 'Creating...'
                    : dashboard.quickActions.createMemorial}
                </Button>
                <Link href="/qr-generator">
                  <Button
                    className="justify-start bg-transparent mb-2 w-full"
                    variant="outline"
                  >
                    <QrCode className="mr-2 w-4 h-4" />
                    {dashboard.quickActions.generateQR}
                  </Button>
                </Link>
                <Link href="/stickers/purchase">
                  <Button
                    className="justify-start bg-transparent mb-2 w-full"
                    variant="outline"
                  >
                    <ShoppingCart className="mr-2 w-4 h-4" />
                    {dashboard.quickActions.buyQrSticker}
                  </Button>
                </Link>
                {/* <Link href="/subscription">
                  <Button
                    className="justify-start bg-transparent w-full"
                    variant="outline"
                  >
                    <Crown className="mr-2 w-4 h-4" />
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
                {activitiesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 text-sm"
                      >
                        <div className="bg-gray-300 rounded-full w-2 h-2 animate-pulse"></div>
                        <div className="flex-1 bg-gray-200 rounded h-4 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : recentActivities.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivities.map((activity) => {
                      // Get color based on activity type
                      const getActivityColor = (type: string) => {
                        switch (type) {
                          case 'memorial_created':
                            return 'bg-green-500';
                          case 'memorial_viewed':
                            return 'bg-blue-500';
                          case 'memorial_scanned':
                            return 'bg-green-500';
                          default:
                            return 'bg-gray-500';
                        }
                      };

                      // Format time ago
                      const formatTimeAgo = (dateString: string) => {
                        const date = new Date(dateString);
                        const now = new Date();
                        const diffInSeconds = Math.floor(
                          (now.getTime() - date.getTime()) / 1000
                        );

                        if (diffInSeconds < 60) return 'Just now';
                        if (diffInSeconds < 3600)
                          return `${Math.floor(diffInSeconds / 60)}m ago`;
                        if (diffInSeconds < 86400)
                          return `${Math.floor(diffInSeconds / 3600)}h ago`;
                        return `${Math.floor(diffInSeconds / 86400)}d ago`;
                      };

                      return (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-3 text-sm"
                        >
                          <div
                            className={`w-2 h-2 ${getActivityColor(
                              activity.type
                            )} rounded-full`}
                          ></div>
                          <div className="flex-1">
                            <span className="text-gray-600">
                              {activity.description}
                            </span>
                            <div className="mt-1 text-gray-400 text-xs">
                              {formatTimeAgo(activity.createdAt)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <div className="mb-2 text-gray-400">
                      <Heart className="mx-auto w-8 h-8" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      No recent activity yet
                    </p>
                    <p className="mt-1 text-gray-400 text-xs">
                      Create a memorial to see activity here
                    </p>
                  </div>
                )}
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
  );
};
export default DashboardPage;
