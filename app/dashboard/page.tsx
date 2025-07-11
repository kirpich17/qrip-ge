"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserMenu } from "@/components/user-menu"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const memorials = [
    {
      id: 1,
      name: "John Smith",
      dates: "1945 - 2023",
      image: "/placeholder.svg?height=100&width=100",
      qrCode: "QR001",
      views: 245,
      status: "active",
      plan: "premium",
      location: "Tbilisi, Georgia",
    },
    {
      id: 2,
      name: "Mary Johnson",
      dates: "1952 - 2024",
      image: "/placeholder.svg?height=100&width=100",
      qrCode: "QR002",
      views: 89,
      status: "active",
      plan: "basic",
      location: "Batumi, Georgia",
    },
    {
      id: 3,
      name: "Robert Wilson",
      dates: "1938 - 2023",
      image: "/placeholder.svg?height=100&width=100",
      qrCode: "QR003",
      views: 156,
      status: "draft",
      plan: "premium",
      location: "Kutaisi, Georgia",
    },
  ]

  const stats = [
    { label: "Total Memorials", value: "3", icon: Heart, color: "text-red-600" },
    { label: "Total Views", value: "490", icon: Eye, color: "text-blue-600" },
    { label: "QR Scans", value: "127", icon: QrCode, color: "text-green-600" },
    { label: "Family Members", value: "12", icon: Users, color: "text-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <QrCode className="h-8 w-8 text-indigo-600" />
                <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  QRIP.ge
                </span>
              </Link>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                Dashboard
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
              <UserMenu user={{ name: "John Doe", email: "john@example.com", plan: "Basic Premium" }} />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John</h1>
          <p className="text-gray-600">Manage your memorials and honor the memories of your loved ones</p>
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
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Memorials List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Memorials</CardTitle>
                    <CardDescription>Manage and view your created memorials</CardDescription>
                  </div>
                  <Link href="/memorial/create">
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      New Memorial
                    </Button>
                  </Link>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search memorials..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
                  {memorials.map((memorial) => (
                    <motion.div key={memorial.id} variants={fadeInUp}>
                      <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={memorial.image || "/placeholder.svg"} />
                          <AvatarFallback>
                            {memorial.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{memorial.name}</h3>
                            {memorial.plan === "premium" && <Crown className="h-4 w-4 text-yellow-500" />}
                            <Badge
                              variant={memorial.status === "active" ? "default" : "secondary"}
                              className={memorial.status === "active" ? "bg-green-100 text-green-800" : ""}
                            >
                              {memorial.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{memorial.dates}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {memorial.views} views
                            </span>
                            <span className="flex items-center">
                              <QrCode className="h-4 w-4 mr-1" />
                              {memorial.qrCode}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {memorial.location}
                            </span>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/memorial/${memorial.qrCode.toLowerCase()}`} className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                View Memorial
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/memorial/edit/${memorial.id}`} className="flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/qr-generator" className="flex items-center">
                                <QrCode className="h-4 w-4 mr-2" />
                                Download QR
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 cursor-pointer"
                              onClick={() => {
                                if (confirm("Are you sure you want to delete this memorial?")) {
                                  console.log("Delete memorial:", memorial.id)
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/memorial/create">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Memorial
                  </Button>
                </Link>
                <Link href="/qr-generator">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Button>
                </Link>
                <Link href="/subscription">
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Crown className="h-4 w-4 mr-2" />
                    Manage Subscription
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">QR code scanned for John Smith</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">Memorial updated for Mary Johnson</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">New photo added to Robert Wilson</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
