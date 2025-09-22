"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  MapPin,
  Calendar,
  Filter,
  Trash2,
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
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/useTranslate";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "react-toastify";
import IsAdminAuth from "@/lib/IsAdminAuth/page";
import LanguageDropdown from "@/components/languageDropdown/page";

interface StickerOrder {
  _id: string;
  user: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
  };
  memorial: {
    _id: string;
    firstName: string;
    lastName: string;
    slug: string;
  };
  stickerOption: {
    _id: string;
    name: string;
    type: string;
    size: string;
  };
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  shippedOrders: number;
  totalRevenue: number;
}

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

function AdminOrdersPage() {
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<StickerOrder[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const limit = 20;

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [currentPage, searchQuery, statusFilter, paymentFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (searchQuery) params.append('search', searchQuery);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (paymentFilter !== 'all') params.append('paymentStatus', paymentFilter);

      const response = await axiosInstance.get(`/api/stickers/admin/orders?${params}`);
      setOrders(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/api/stickers/admin/statistics");
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, trackingNumber?: string) => {
    try {
      setUpdatingOrder(orderId);
      await axiosInstance.put(`/api/stickers/admin/orders/${orderId}`, {
        orderStatus: newStatus,
        trackingNumber,
      });
      
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingOrder(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?\n\n" +
      "This action cannot be undone and will permanently remove:\n" +
      "• Order details\n" +
      "• Payment information\n" +
      "• Shipping address\n" +
      "• All associated data\n\n" +
      "Click OK to confirm deletion."
    );
    
    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/stickers/admin/orders/${orderId}`);
      toast.success("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  const getStatusBadge = (status: string, type: 'payment' | 'order') => {
    const statusConfig = {
      payment: {
        pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
        paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        failed: { color: "bg-red-100 text-red-800", icon: XCircle },
        refunded: { color: "bg-gray-100 text-gray-800", icon: XCircle },
      },
      order: {
        pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
        processing: { color: "bg-blue-100 text-blue-800", icon: Package },
        shipped: { color: "bg-purple-100 text-purple-800", icon: Truck },
        delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
        cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
      },
    };

    const config = (statusConfig[type] as any)[status] || statusConfig[type].pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#547455] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#243b31] py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/dashboard"
              className="flex items-center text-white hover:underline gap-2 text-base"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Admin Dashboard
            </Link>
            <LanguageDropdown />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QR Sticker Orders
          </h1>
          <p className="text-gray-600">
            Manage all QR sticker orders and track their status
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
                    </div>
                    <div className="p-3 rounded-full bg-yellow-100">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Paid</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.paidOrders}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Shipped</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.shippedOrders}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <Truck className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or tracking number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orders ({orders.length})</CardTitle>
            <CardDescription>
              Manage and track all QR sticker orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Memorial</TableHead>
                    <TableHead>Sticker</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-mono text-sm">
                        <Link 
                          href={`/admin/orders/${order._id}`}
                          className="text-[#547455] hover:underline"
                        >
                          {order._id.slice(-8).toUpperCase()}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3 h-12 px-4 text-left align-middle font-medium text-muted-foreground  whitespace-nowrap 2xl:whitespace-normal 2xl:break-words [&:has([role=checkbox])]:pr-0">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {order.user.firstname?.[0]}{order.user.lastname?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{order.user.firstname} {order.user.lastname}</p>
                            <p className="text-sm text-gray-500">{order.user.email}</p>
                            <p className="text-sm text-gray-500">{order.user.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.memorial.firstName} {order.memorial.lastName}</p>
                          <p className="text-sm text-gray-500">/{order.memorial.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.stickerOption.name}</p>
                          <p className="text-sm text-gray-500">{order.stickerOption.type} • {order.stickerOption.size}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell className="font-semibold">${order.totalAmount}</TableCell>
                      <TableCell>{getStatusBadge(order.paymentStatus, 'payment')}</TableCell>
                      <TableCell>{getStatusBadge(order.orderStatus, 'order')}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatDate(order.createdAt)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {order.orderStatus === 'processing' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const trackingNumber = prompt("Enter tracking number:");
                                if (trackingNumber) {
                                  updateOrderStatus(order._id, 'shipped', trackingNumber);
                                }
                              }}
                              disabled={updatingOrder === order._id}
                            >
                              Ship
                            </Button>
                          )}
                          {order.orderStatus === 'shipped' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                              disabled={updatingOrder === order._id}
                            >
                              Mark Delivered
                            </Button>
                          )}
                          <Link href={`/admin/orders/${order._id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              title="View Details & Download QR"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteOrder(order._id)}
                            className="ml-2"
                            title="Delete Order"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const AdminOrdersPageWrapper = () => {
  return (
    <IsAdminAuth>
      <AdminOrdersPage />
    </IsAdminAuth>
  );
};

export default AdminOrdersPageWrapper;
