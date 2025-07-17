"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Heart,
  DollarSign,
  TrendingUp,
  Search,
  MoreHorizontal,
  Shield,
  Settings,
  Bell,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/hooks/useTranslate";

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

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const admindashTranslations = t("admindash");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    {
      label: admindashTranslations.stats.totalUsers,
      value: "1,247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: admindashTranslations.stats.activeMemorials,
      value: "3,891",
      change: "+8%",
      icon: Heart,
      color: "text-red-600",
    },
    {
      label: admindashTranslations.stats.monthlyRevenue,
      value: "$12,450",
      change: "+15%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      label: admindashTranslations.stats.qrScans,
      value: "28,392",
      change: "+23%",
      icon: TrendingUp,
      color: "text-purple-600",
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
                <QrCode className="h-5 w-5 text-[#243b31]" />{" "}
              </motion.div>
              <span className="text-2xl font-bold text-white">
                {admindashTranslations.header.title}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className=" text-white"
                onClick={() => {
                  console.log("Open notifications");
                  // Handle notifications logic
                }}
              >
                <Bell className="h-4 w-4 " />
                {admindashTranslations.header.notifications}
              </Button>

              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-indigo-600">AD</AvatarFallback>
              </Avatar>
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
          <h1 className="text-3xl font-bold mb-2">
            {admindashTranslations.welcome.title}
          </h1>
          <p className="">{admindashTranslations.welcome.description}</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium ">{stat.label}</p>
                      <p className="text-3xl font-bold ">{stat.value}</p>
                      <p className="text-sm text-[#547455]">
                        {stat.change}{" "}
                        {admindashTranslations.stats.changeFromLastMonth}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full bg-[#efefef]  ${stat.color}`}
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
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="">
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
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-[#547455] data-[state=active]:text-white"
            >
              {admindashTranslations.tabs.analytics}
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-[#547455] data-[state=active]:text-white"
            >
              {admindashTranslations.tabs.settings}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card className="">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className=" mb-2">
                      {admindashTranslations.userManagement.title}
                    </CardTitle>
                    <CardDescription className="">
                      {admindashTranslations.userManagement.description}
                    </CardDescription>
                  </div>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 
                     h-4 w-4"
                    />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10  text-black focus-visible:outline-none"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="">
                      <TableHead className="">
                        {admindashTranslations.userManagement.tableHeaders.user}
                      </TableHead>
                      <TableHead className="">
                        {admindashTranslations.userManagement.tableHeaders.plan}
                      </TableHead>
                      <TableHead className="">
                        {
                          admindashTranslations.userManagement.tableHeaders
                            .memorials
                        }
                      </TableHead>
                      <TableHead className="">
                        {
                          admindashTranslations.userManagement.tableHeaders
                            .status
                        }
                      </TableHead>
                      <TableHead className="">
                        {
                          admindashTranslations.userManagement.tableHeaders
                            .joined
                        }
                      </TableHead>
                      <TableHead className="">
                        {
                          admindashTranslations.userManagement.tableHeaders
                            .actions
                        }
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={user.avatar || "/placeholder.svg"}
                              />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className=" font-medium">{user.name}</p>
                              <p className=" text-sm">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.plan === "Premium" ? "default" : "secondary"
                            }
                            className={
                              user.plan === "Premium" ? "bg-yellow-600 " : ""
                            }
                          >
                            {user.plan}
                          </Badge>
                        </TableCell>
                        <TableCell className="">{user.memorials}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className={
                              user.status === "active" ? "bg-green-600" : ""
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="">{user.joined}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="
                                 "
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="">
                              <DropdownMenuItem
                                className=" hover:text-white cursor-pointer"
                                onClick={() => {
                                  console.log(
                                    "View profile for user:",
                                    user.id
                                  );
                                  // Handle view profile logic
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                {
                                  admindashTranslations.userManagement
                                    .actionsMenu.viewProfile
                                }
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className=" hover:text-white cursor-pointer"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Are you sure you want to suspend ${user.name}?`
                                    )
                                  ) {
                                    console.log("Suspend user:", user.id);
                                    // Handle suspend logic
                                  }
                                }}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                {
                                  admindashTranslations.userManagement
                                    .actionsMenu.suspend
                                }
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-400 hover:text-red-300 cursor-pointer"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Are you sure you want to delete ${user.name}? This action cannot be undone.`
                                    )
                                  ) {
                                    console.log("Delete user:", user.id);
                                    // Handle delete logic
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {
                                  admindashTranslations.userManagement
                                    .actionsMenu.delete
                                }
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="memorials" className="space-y-6">
            <Card className=" ">
              <CardHeader>
                <CardTitle className="">
                  {admindashTranslations.recentMemorials.title}
                </CardTitle>
                <CardDescription className="">
                  {admindashTranslations.recentMemorials.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="">
                      <TableHead className="">
                        {
                          admindashTranslations.recentMemorials.tableHeaders
                            .memorial
                        }
                      </TableHead>
                      <TableHead className="">
                        {
                          admindashTranslations.recentMemorials.tableHeaders
                            .creator
                        }
                      </TableHead>
                      <TableHead className="">
                        {
                          admindashTranslations.recentMemorials.tableHeaders
                            .status
                        }
                      </TableHead>
                      <TableHead className="">
                        {
                          admindashTranslations.recentMemorials.tableHeaders
                            .views
                        }
                      </TableHead>
                      <TableHead className="">
                        {
                          admindashTranslations.recentMemorials.tableHeaders
                            .created
                        }
                      </TableHead>
                      <TableHead className="">
                        {
                          admindashTranslations.recentMemorials.tableHeaders
                            .actions
                        }
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMemorials.map((memorial) => (
                      <TableRow key={memorial.id} className="">
                        <TableCell className=" font-medium">
                          {memorial.name}
                        </TableCell>
                        <TableCell className="">{memorial.creator}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              memorial.status === "approved"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              memorial.status === "approved"
                                ? "bg-green-600"
                                : "bg-yellow-600"
                            }
                          >
                            {memorial.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="">{memorial.views}</TableCell>
                        <TableCell className="">{memorial.created}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-green-600 text-green-400 hover:bg-green-600 bg-transparent"
                              onClick={() => {
                                console.log("Approve memorial:", memorial.id);
                                // Handle approve logic
                              }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 bg-transparent"
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to reject the memorial for ${memorial.name}?`
                                  )
                                ) {
                                  console.log("Reject memorial:", memorial.id);
                                  // Handle reject logic
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr-codes" className="space-y-6">
            <Card className=" ">
              <CardHeader>
                <CardTitle className="">
                  {admindashTranslations.qrManagement.title}
                </CardTitle>
                <CardDescription
                  className="
                "
                >
                  {admindashTranslations.qrManagement.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4  rounded-lg">
                    <p className="text-2xl font-bold ">3,891</p>
                    <p
                      className="text-sm 
                    "
                    >
                      {admindashTranslations.qrManagement.totalQrCodes}
                    </p>
                  </div>
                  <div className="text-center p-4  rounded-lg">
                    <p className="text-2xl font-bold ">28,392</p>
                    <p
                      className="text-sm 
                    "
                    >
                      {admindashTranslations.qrManagement.totalScans}
                    </p>
                  </div>
                  <div className="text-center p-4  rounded-lg">
                    <p className="text-2xl font-bold ">1,247</p>
                    <p
                      className="text-sm 
                    "
                    >
                      {admindashTranslations.qrManagement.thisMonth}
                    </p>
                  </div>
                </div>
                <div className="text-center py-8">
                  <QrCode
                    className="h-16 w-16 
                   mx-auto mb-4"
                  />
                  <p
                    className="
                  "
                  >
                    {admindashTranslations.qrManagement.analyticsText}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="0 ">
                <CardHeader>
                  <CardTitle className="">
                    {admindashTranslations.analytics.platformGrowth}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="h-64 flex items-center justify-center 
                  "
                  >
                    {admindashTranslations.analytics.platformGrowth}
                  </div>
                </CardContent>
              </Card>
              <Card className=" ">
                <CardHeader>
                  <CardTitle className="">
                    {admindashTranslations.analytics.revenueTrends}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="h-64 flex items-center justify-center 
                  "
                  >
                    {admindashTranslations.analytics.revenueTrends}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className=" ">
              <CardHeader>
                <CardTitle className="">
                  {admindashTranslations.platformSettings.title}
                </CardTitle>
                <CardDescription
                  className="
                "
                >
                  {admindashTranslations.platformSettings.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold  mb-4">
                      {admindashTranslations.platformSettings.generalSettings}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="">
                            {
                              admindashTranslations.platformSettings
                                .publicDirectory.label
                            }
                          </p>
                          <p
                            className="text-sm 
                          "
                          >
                            {
                              admindashTranslations.platformSettings
                                .publicDirectory.description
                            }
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log("Configure public directory settings");
                            // Handle configuration logic
                          }}
                        >
                          {admindashTranslations.platformSettings.configure}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="">
                            {
                              admindashTranslations.platformSettings
                                .emailNotifications.label
                            }
                          </p>
                          <p
                            className="text-sm 
                          "
                          >
                            {
                              admindashTranslations.platformSettings
                                .emailNotifications.description
                            }
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log(
                              "Configure email notification settings"
                            );
                            // Handle configuration logic
                          }}
                        >
                          {admindashTranslations.platformSettings.configure}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
