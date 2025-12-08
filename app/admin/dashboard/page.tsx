// @ts-nocheck
'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Heart,
  Banknote,
  Search,
  Bell,
  QrCode,
  Package,
  MessageCircle,
  RefreshCw,
  Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslate';
import { StatsCards } from './StatsCards';
import { UserManagementTable } from './UserManagementTable';
import { MemorialsTable } from './MemorialsTable';
import { QrManagement } from './QrManagement';
import { AnalyticsCharts } from './AnalyticsCharts';
import { PlatformSettings } from './PlatformSettings';
import { NotificationModal } from './NotificationModal';
import { ProfileDropdown } from './ProfileDropdown';
import IsAdminAuth from '@/lib/IsAdminAuth/page';
import axiosInstance from '@/services/axiosInstance';
import LanguageDropdown from '@/components/languageDropdown/page';

function AdminDashboardPage() {
  const { t } = useTranslation();
  const admindashTranslations = t('admindash', { returnObjects: true }) as any;

  const dashboardTranslations = t('adminDashboard') || {
    orders: {
      tabTitle: 'Orders',
      title: 'QR Sticker Orders',
      description: 'Manage and track all QR sticker orders',
      viewAllOrders: 'View All Orders',
      manageStickers: 'Manage Stickers',
      orderManagement: 'Order Management',
      orderManagementDescription:
        'View and manage all QR sticker orders in the dedicated orders page.',
      goToOrders: 'Go to Orders',
    },
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryMemorial, setSearchQueryMemorial] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [stats, setStats] = useState([]);
  const [recentMemorials, setRecentMemorials] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(new Date());

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
      setIsLoadingStats(true);
      const res = await axiosInstance.get('/api/admin/stats');

      // Format revenue with number formatting (no currency text)
      const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount);
      };

      const revenueTotal = Number(res.data?.revenue?.total) || 0;
      const revenueChange = Number(res.data?.revenue?.percentageChange) || 0;

      setStats([
        {
          label: admindashTranslations.stats.totalUsers,
          value: res.data.users.total,
          change:
            (res.data.users.percentageChange >= 0 ? '+' : '') +
            res.data.users.percentageChange +
            '%',
          icon: Users,
          color: 'text-blue-600',
          changeFromLastMonth: admindashTranslations.stats.changeFromLastMonth,
        },
        {
          label: admindashTranslations.stats.activeMemorials,
          value: res.data.activeMemorials.total,
          change:
            (res.data.activeMemorials.percentageChange >= 0 ? '+' : '') +
            res.data.activeMemorials.percentageChange +
            '%',
          icon: Heart,
          color: 'text-red-600',
          changeFromLastMonth: admindashTranslations.stats.changeFromLastMonth,
        },
        {
          label: admindashTranslations.stats.monthlyRevenue,
          value: formatCurrency(revenueTotal),
          change: (revenueChange >= 0 ? '+' : '') + revenueChange + '%',
          icon: Banknote,
          color: 'text-green-600',
          changeFromLastMonth: admindashTranslations.stats.changeFromLastMonth,
          showCurrencyIcon: true,
        },
      ]);
      setLastRefreshTime(new Date());
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch statistics');
    } finally {
      setIsLoadingStats(false);
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
      const res = await axiosInstance.patch(
        `/api/admin/toggle-status-memorial/${id}`
      );
      fetchAllMemorials();
      console.log('🚀 ~ memorailStatusToggle ~ res:', res);
      if (res.data.status == 'active') toast.success(res.data.message);
      else if (res.data.status == 'inactive') {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleManualRefresh = () => {
    fetchStats();
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-[#243b31]">
        <div className="mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white p-2 rounded-xl"
              >
                <QrCode className="w-5 h-5 text-[#243b31]" />
              </motion.div>
              <span className="font-bold text-white text-xs md:text-2xl">
                {admindashTranslations.header.title}
              </span>
            </div>
            <div className="flex gap-0 sm:gap-3">
              <LanguageDropdown />
              <div className="flex items-center space-x-4">
                {/* <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex gap-1 text-white"
                onClick={() => setIsNotificationOpen(true)}
              >
                <Bell className="w-4 h-4" />
                {admindashTranslations.header.notifications}
              </Button> */}

                <ProfileDropdown />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="mb-2 font-bold text-2xl md:text-3xl">
            {admindashTranslations.welcome.title}
          </h1>
          <p>{admindashTranslations.welcome.description}</p>
        </motion.div>

        {/* Stats Cards */}
        <StatsCards
          stats={stats}
          isLoading={isLoadingStats}
          lastRefreshTime={lastRefreshTime}
          onRefresh={handleManualRefresh}
          translations={admindashTranslations.stats}
        />

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {admindashTranslations.quickAccess?.title || 'Quick Access'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/admin/testimonials">
                  <Button variant="outline" className="justify-start w-full">
                    <MessageCircle className="mr-2 w-4 h-4" />
                    {admindashTranslations.quickAccess?.manageTestimonials ||
                      'Manage Testimonials'}
                  </Button>
                </Link>
                <Link href="/admin/adminsubscription">
                  <Button variant="outline" className="justify-start w-full">
                    <Package className="mr-2 w-4 h-4" />
                    {admindashTranslations.quickAccess?.subscriptionPlans ||
                      'Subscription Plans'}
                  </Button>
                </Link>
                <Link href="/admin/stickers">
                  <Button variant="outline" className="justify-start w-full">
                    <QrCode className="mr-2 w-4 h-4" />
                    {admindashTranslations.quickAccess?.qrStickers ||
                      'QR Stickers'}
                  </Button>
                </Link>
                <Link href="/admin/translations">
                  <Button variant="outline" className="justify-start w-full">
                    <Languages className="mr-2 w-4 h-4" />
                    {admindashTranslations.quickAccess?.translations ||
                      'Language Management'}
                  </Button>
                </Link>
                <Link href="/admin/footerManagement">
                  <Button variant="outline" className="justify-start w-full">
                    <Languages className="mr-2 w-4 h-4" />
                    {admindashTranslations.quickAccess?.footerManagement ||
                      'Footer Management'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6 w-full">
          <TabsList className="w-full md:w-auto overflow-x-auto">
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
              <Package className="mr-2 w-4 h-4" />
              {dashboardTranslations?.orders?.tabTitle || 'Orders'}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <CardTitle>
                      {admindashTranslations.userManagement.title}
                    </CardTitle>
                    <CardDescription>
                      {admindashTranslations.userManagement.description}
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="top-1/2 left-3 absolute w-4 h-4 -translate-y-1/2 transform" />
                    <Input
                      type="search"
                      placeholder={
                        admindashTranslations?.userManagement
                          ?.searchPlaceholder || 'Search users...'
                      }
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
                  <div className="py-8 text-center">
                    <p className="text-gray-500">
                      {admindashTranslations.userManagement.noResults ||
                        'No users found'}
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
                    {/* <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600 text-sm">
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
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memorials Tab */}
          <TabsContent value="memorials" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap justify-between items-center gap-3">
                  <div>
                    <CardTitle>
                      {admindashTranslations.recentMemorials.title}
                    </CardTitle>
                    <CardDescription>
                      {admindashTranslations.recentMemorials.description}
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="top-1/2 left-3 absolute w-4 h-4 -translate-y-1/2 transform" />
                    <Input
                      type="search"
                      placeholder={
                        admindashTranslations?.recentMemorials
                          ?.searchPlaceholder || 'Search memorials...'
                      }
                      value={searchQueryMemorial}
                      onChange={(e) => {
                        setSearchQueryMemorial(e.target.value);
                        setUserPage(1);
                        setHasSearched(false);
                      }}
                      className="pl-10 text-black"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <MemorialsTable
                  memorials={recentMemorials}
                  memorailStatusToggle={memorailStatusToggle}
                  fetchAllMemorials={fetchAllMemorials}
                  translations={admindashTranslations.recentMemorials}
                />
                {/* <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-600 text-sm">
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {dashboardTranslations?.orders?.title ||
                        'QR Sticker Orders'}
                    </CardTitle>
                    <CardDescription>
                      {dashboardTranslations?.orders?.description ||
                        'Manage and track all QR sticker orders'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/admin/orders">
                      <Button className="bg-[#547455] hover:bg-[#243b31]">
                        <Package className="mr-2 w-4 h-4" />
                        {dashboardTranslations?.orders?.viewAllOrders ||
                          'View All Orders'}
                      </Button>
                    </Link>
                    <Link href="/admin/stickers">
                      <Button variant="outline">
                        <Package className="mr-2 w-4 h-4" />
                        {dashboardTranslations?.orders?.manageStickers ||
                          'Manage Stickers'}
                      </Button>
                    </Link>
                    <Link href="/admin/sticker-types">
                      <Button variant="outline">
                        <Package className="mr-2 w-4 h-4" />
                        {dashboardTranslations?.orders?.manageTypes ||
                          'Manage Types'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <Package className="mx-auto mb-4 w-16 h-16 text-gray-400" />
                  <h3 className="mb-2 font-medium text-gray-900 text-lg">
                    {dashboardTranslations?.orders?.orderManagement ||
                      'Order Management'}
                  </h3>
                  <p className="mb-4 text-gray-500">
                    {dashboardTranslations?.orders
                      ?.orderManagementDescription ||
                      'View and manage all QR sticker orders in the dedicated orders page.'}
                  </p>
                  <Link href="/admin/orders">
                    <Button className="bg-[#547455] hover:bg-[#243b31]">
                      {dashboardTranslations?.orders?.goToOrders ||
                        'Go to Orders'}
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
