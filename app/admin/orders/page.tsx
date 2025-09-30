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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
  const ordersTranslations = t("adminOrders") || {
    header: { back: "Back to Admin Dashboard", title: "QR Sticker Orders" },
    main: { title: "QR Sticker Orders", description: "Manage all QR sticker orders and track their status" },
    stats: { totalOrders: "Total Orders", pending: "Pending", paid: "Paid", shipped: "Shipped", totalRevenue: "Total Revenue" },
    filters: { searchPlaceholder: "Search by name, email, or tracking number...", orderStatus: "Order Status", paymentStatus: "Payment Status", allStatuses: "All Statuses", allPayments: "All Payments" },
    table: { title: "Orders", description: "Manage and track all QR sticker orders", headers: { orderId: "Order ID", customer: "Customer", memorial: "Memorial", sticker: "Sticker", quantity: "Quantity", total: "Total", payment: "Payment", status: "Status", date: "Date", actions: "Actions" }, actions: { ship: "Ship", markDelivered: "Mark Delivered", viewDetails: "View Details & Download QR", deleteOrder: "Delete Order" } },
    status: { pending: "Pending", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" },
    paymentStatus: { pending: "Pending", paid: "Paid", failed: "Failed", refunded: "Refunded" },
    messages: { loading: "Loading orders...", loadError: "Failed to load orders", updateSuccess: "Order status updated successfully", updateError: "Failed to update order status", deleteSuccess: "Order deleted successfully", deleteError: "Failed to delete order", deleteConfirm: "Are you sure you want to delete this order?", trackingPrompt: "Enter tracking number:" },
    pagination: { previous: "Previous", next: "Next", page: "Page", of: "of", showing: "Showing", to: "to", results: "results" }
  };

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<StickerOrder[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const limit = 4;

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [currentPage, statusFilter, paymentFilter]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

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
      setTotalItems(response.data.pagination.totalItems || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(ordersTranslations.messages.loadError);
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

      toast.success(ordersTranslations.messages.updateSuccess);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(ordersTranslations.messages.updateError);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    const confirmed = window.confirm(ordersTranslations.messages.deleteConfirm);

    if (!confirmed) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/stickers/admin/orders/${orderId}`);
      toast.success(ordersTranslations.messages.deleteSuccess);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(ordersTranslations.messages.deleteError);
    }
  };

  const generatePaginationItems = () => {
    const items = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentPage(1);
          }}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Show pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(totalPages);
            }}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
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

    const statusText = type === 'payment'
      ? ordersTranslations?.paymentStatus?.[status as keyof typeof ordersTranslations.paymentStatus] || status
      : ordersTranslations?.status?.[status as keyof typeof ordersTranslations.status] || status;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {statusText}
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
          <p className="mt-4 text-gray-600">{ordersTranslations.messages.loading}</p>
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
              {ordersTranslations?.header?.back || "Back to Admin Dashboard"}
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
            {ordersTranslations?.main?.title || "QR Sticker Orders"}
          </h1>
          <p className="text-gray-600">
            {ordersTranslations?.main?.description || "Manage all QR sticker orders and track their status"}
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
                      <p className="text-sm font-medium text-gray-600">{ordersTranslations.stats.totalOrders}</p>
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
                      <p className="text-sm font-medium text-gray-600">{ordersTranslations.stats.pending}</p>
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
                      <p className="text-sm font-medium text-gray-600">{ordersTranslations.stats.paid}</p>
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
                      <p className="text-sm font-medium text-gray-600">{ordersTranslations.stats.shipped}</p>
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
                      <p className="text-sm font-medium text-gray-600">{ordersTranslations.stats.totalRevenue}</p>
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
                  placeholder={ordersTranslations.filters.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={ordersTranslations.filters.orderStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{ordersTranslations.filters.allStatuses}</SelectItem>
                  <SelectItem value="pending">{ordersTranslations?.status?.pending || "Pending"}</SelectItem>
                  <SelectItem value="processing">{ordersTranslations?.status?.processing || "Processing"}</SelectItem>
                  <SelectItem value="shipped">{ordersTranslations?.status?.shipped || "Shipped"}</SelectItem>
                  <SelectItem value="delivered">{ordersTranslations?.status?.delivered || "Delivered"}</SelectItem>
                  <SelectItem value="cancelled">{ordersTranslations?.status?.cancelled || "Cancelled"}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={ordersTranslations.filters.paymentStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{ordersTranslations.filters.allPayments}</SelectItem>
                  <SelectItem value="pending">{ordersTranslations?.paymentStatus?.pending || "Pending"}</SelectItem>
                  <SelectItem value="paid">{ordersTranslations?.paymentStatus?.paid || "Paid"}</SelectItem>
                  <SelectItem value="failed">{ordersTranslations?.paymentStatus?.failed || "Failed"}</SelectItem>
                  <SelectItem value="refunded">{ordersTranslations?.paymentStatus?.refunded || "Refunded"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            {ordersTranslations.table.title.replace('{count}', orders.length.toString())}
            <CardDescription>
              {ordersTranslations.table.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{ordersTranslations.table.headers.orderId}</TableHead>
                    <TableHead>{ordersTranslations.table.headers.customer}</TableHead>
                    <TableHead>{ordersTranslations.table.headers.memorial}</TableHead>
                    <TableHead>{ordersTranslations.table.headers.sticker}</TableHead>
                    <TableHead>{ordersTranslations.table.headers.quantity}</TableHead>
                    <TableHead>{ordersTranslations.table.headers.total}</TableHead>
                    <TableHead>{ordersTranslations.table.headers.payment}</TableHead>
                    {/* <TableHead>{ordersTranslations.table.headers.status}</TableHead> */}
                    <TableHead>{ordersTranslations.table.headers.date}</TableHead>
                    <TableHead>{ordersTranslations.table.headers.actions}</TableHead>
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
                              {order.user ? `${order.user.firstname?.[0] || ''}${order.user.lastname?.[0] || ''}` : 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            {order.user ? (
                              <>
                                <p className="font-medium">{order.user.firstname} {order.user.lastname}</p>
                                <p className="text-sm text-gray-500">{order.user.email}</p>
                                <p className="text-sm text-gray-500">{order.user.phone}</p>
                              </>
                            ) : (
                              <p className="text-sm text-gray-500 italic">User not found</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {order.memorial ? (
                            <>
                              <p className="font-medium">{order.memorial.firstName} {order.memorial.lastName}</p>
                              <p className="text-sm text-gray-500">/{order.memorial.slug}</p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500 italic">Memorial not found</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {order.stickerOption ? (
                            <>
                              <p className="font-medium">{order.stickerOption.name}</p>
                              <p className="text-sm text-gray-500">{order.stickerOption.type} • {order.stickerOption.size}</p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500 italic">Sticker option not found</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell className="font-semibold">${order.totalAmount}</TableCell>
                      <TableCell>{getStatusBadge(order.paymentStatus, 'payment')}</TableCell>
                      {/* <TableCell>{getStatusBadge(order.orderStatus, 'order')}</TableCell> */}
                      <TableCell>
                        <div className="text-sm">
                          <p>{formatDate(order.createdAt)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          
                          {order.orderStatus === 'shipped' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order._id, 'delivered')}
                              disabled={updatingOrder === order._id}
                            >
                              {ordersTranslations.table.actions.markDelivered}
                            </Button>
                          )}
                          <Link href={`/admin/orders/${order._id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              title={ordersTranslations.table.actions.viewDetails}
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteOrder(order._id)}
                            className="ml-2"
                            title={ordersTranslations.table.actions.deleteOrder}
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
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    {ordersTranslations?.pagination?.showing || "Showing"} {((currentPage - 1) * limit) + 1} {ordersTranslations?.pagination?.to || "to"} {Math.min(currentPage * limit, totalItems)} {ordersTranslations?.pagination?.of || "of"} {totalItems} {ordersTranslations?.pagination?.results || "results"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {ordersTranslations?.pagination?.page || "Page"} {currentPage} {ordersTranslations?.pagination?.of || "of"} {totalPages}
                  </div>
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {generatePaginationItems()}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
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
