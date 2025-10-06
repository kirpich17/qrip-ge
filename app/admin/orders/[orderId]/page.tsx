"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Truck,
  Download,
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "react-toastify";
import IsAdminAuth from "@/lib/IsAdminAuth/page";
import { QRCodeSVG } from 'qrcode.react';
import { saveAs } from 'file-saver';
import axios from "axios";
import { useTranslation } from "@/hooks/useTranslate";

// Helper function to get authentication token
const getAuthToken = () => {
  // Try to get token from authToken (regular user login)
  let token = localStorage.getItem("authToken");
  
  // If no authToken, try to get it from loginData (admin login)
  if (!token) {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      try {
        const parsed = JSON.parse(loginData);
        token = parsed.token;
      } catch (error) {
        console.error("Error parsing loginData:", error);
      }
    }
  }
  
  return token;
};

interface Order {
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
    price: number;
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
  paymentId?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

function OrderDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const orderDetailTranslations = t("adminOrderDetail") || {
    header: { back: "Back to Orders", title: "Order Details" },
    loading: { message: "Loading order details..." },
    notFound: { title: "Order Not Found", message: "The order you're looking for doesn't exist.", backButton: "Back to Orders" },
    orderHeader: { orderNumber: "Order #{orderId}", createdOn: "Created on {date}" },
    sections: {
      customerInfo: { title: "Customer Information", name: "Name", email: "Email", phone: "Phone", userId: "User ID" },
      memorialInfo: { title: "Memorial Information", memorialName: "Memorial Name", slug: "Slug", memorialId: "Memorial ID" },
      shippingAddress: { title: "Shipping Address", phone: "Phone" },
      orderSummary: { title: "Order Summary", sticker: "Sticker", type: "Type", size: "Size", quantity: "Quantity", unitPrice: "Unit Price", total: "Total" },
      qrCodeDownload: { title: "QR Code Download", description: "Download the QR code for this memorial", memorialLabel: "Memorial: {name}", qualityNote: "High quality QR codes suitable for printing on stickers" },
      paymentInfo: { title: "Payment Information", status: "Status", paymentId: "Payment ID" },
      orderActions: { title: "Order Actions", deleteOrder: "Delete Order" },
      timeline: { title: "Timeline", orderCreated: "Order Created", lastUpdated: "Last Updated" }
    },
    status: { pending: "Pending", processing: "Processing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" },
    paymentStatus: { pending: "Pending", paid: "Paid", failed: "Failed", refunded: "Refunded" },
    messages: { orderNotFound: "Order not found", loadError: "Failed to load order details", deleteConfirm: "Are you sure you want to delete this order?", deleteSuccess: "Order deleted successfully", deleteError: "Failed to delete order", notLoggedIn: "You are not logged in", downloadSuccess: "QR code downloaded as {fileName}", downloadError: "Failed to generate QR code" }
  };
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/stickers/admin/orders/${orderId}`);
      
      if (response.data.status && response.data.data) {
        setOrder(response.data.data);
      } else {
        toast.error(orderDetailTranslations.messages.orderNotFound);
        router.push("/admin/orders");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error(orderDetailTranslations.messages.loadError);
      router.push("/admin/orders");
    } finally {
      setLoading(false);
    }
  };


  const deleteOrder = async () => {
    const confirmed = window.confirm(orderDetailTranslations.messages.deleteConfirm);
    
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/api/stickers/admin/orders/${orderId}`);
      toast.success(orderDetailTranslations.messages.deleteSuccess);
      router.push("/admin/orders");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(orderDetailTranslations.messages.deleteError);
    }
  };

  const handleDownloadQR = async (format: 'png' | 'svg') => {
    if (!order) return;
    
    setDownloadingFormat(format);
    
    const token = getAuthToken();
    if (!token) {
      toast.error(orderDetailTranslations.messages.notLoggedIn);
      setDownloadingFormat(null);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/qrcode/generate`,
        {
          memorialId: order.memorial._id,
          format,
          size: 512, 
          style: 'default',
        },
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob',
        }
      );
      
      const fileName = `QR_Sticker_${order.memorial.firstName}_${order.memorial.lastName}_${order._id.slice(-8)}.${format}`;
      saveAs(response.data, fileName);
      toast.success(orderDetailTranslations.messages.downloadSuccess.replace('{fileName}', fileName));
    } catch (error) {
      console.error("Download failed:", error);
      toast.error(orderDetailTranslations.messages.downloadError);
    } finally {
      setDownloadingFormat(null);
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

    const statusText = type === 'payment' 
      ? orderDetailTranslations.paymentStatus[status as keyof typeof orderDetailTranslations.paymentStatus]
      : orderDetailTranslations.status[status as keyof typeof orderDetailTranslations.status];

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#547455] mx-auto"></div>
          <p className="mt-4 text-gray-600">{orderDetailTranslations.loading.message}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{orderDetailTranslations.notFound.title}</h2>
          <p className="text-gray-600 mb-4">{orderDetailTranslations.notFound.message}</p>
          <Link href="/admin/orders">
            <Button className="bg-[#547455] hover:bg-[#243b31]">
              {orderDetailTranslations.notFound.backButton}
            </Button>
          </Link>
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
              href="/admin/orders"
              className="flex items-center text-white hover:underline gap-2 text-base"
            >
              <ArrowLeft className="h-5 w-5" />
{orderDetailTranslations.header.back}
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-white">{orderDetailTranslations.header.title}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
{orderDetailTranslations.orderHeader.orderNumber.replace('{orderId}', order._id.slice(-8).toUpperCase())}
                  </CardTitle>
                  <CardDescription>
{orderDetailTranslations.orderHeader.createdOn.replace('{date}', formatDate(order.createdAt))}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.paymentStatus, 'payment')}
                  {getStatusBadge(order.orderStatus, 'order')}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
{orderDetailTranslations.sections.customerInfo.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{orderDetailTranslations.sections.customerInfo.name}</p>
                      <p className="font-semibold">{order.user.firstname} {order.user.lastname}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{orderDetailTranslations.sections.customerInfo.email}</p>
                      <p className="font-semibold">{order.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{orderDetailTranslations.sections.customerInfo.phone}</p>
                      <p className="font-semibold">{order.user.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{orderDetailTranslations.sections.customerInfo.userId}</p>
                      <p className="font-mono text-sm">{order.user._id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Memorial Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
{orderDetailTranslations.sections.memorialInfo.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{orderDetailTranslations.sections.memorialInfo.memorialName}</p>
                      <p className="font-semibold">{order.memorial.firstName} {order.memorial.lastName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{orderDetailTranslations.sections.memorialInfo.slug}</p>
                      <p className="font-mono text-sm">/{order.memorial.slug}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{orderDetailTranslations.sections.memorialInfo.memorialId}</p>
                      <p className="font-mono text-sm">{order.memorial._id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
{orderDetailTranslations.sections.shippingAddress.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-semibold">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                    <p className="mt-2 font-medium">{orderDetailTranslations.sections.shippingAddress.phone}: {order.shippingAddress.phone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>{orderDetailTranslations.sections.orderSummary.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{orderDetailTranslations.sections.orderSummary.sticker}:</span>
                    <span className="font-semibold">{order.stickerOption?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{orderDetailTranslations.sections.orderSummary.type}:</span>
                    <span>{order.stickerOption?.type?.displayName || order.stickerOption?.type?.name || order.stickerOption?.type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{orderDetailTranslations.sections.orderSummary.size}:</span>
                    <span>{order.stickerOption?.size || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{orderDetailTranslations.sections.orderSummary.quantity}:</span>
                    <span>{order.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{orderDetailTranslations.sections.orderSummary.unitPrice}:</span>
                    <span>₾{order.unitPrice}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{orderDetailTranslations.sections.orderSummary.total}:</span>
                    <span>₾{order.totalAmount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code Download */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
{orderDetailTranslations.sections.qrCodeDownload.title}
                  </CardTitle>
                  <CardDescription>
{orderDetailTranslations.sections.qrCodeDownload.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <QRCodeSVG
                      value={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/memorial/${order.memorial._id}?isScan=true`}
                      size={128}
                      className="mx-auto"
                    />
                    <p className="text-xs text-gray-500 mt-2">
{orderDetailTranslations.sections.qrCodeDownload.memorialLabel.replace('{name}', `${order.memorial.firstName} ${order.memorial.lastName}`)}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDownloadQR('png')}
                      disabled={downloadingFormat === 'png'}
                    >
                      {downloadingFormat === 'png' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      PNG
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleDownloadQR('svg')}
                      disabled={downloadingFormat === 'svg'}
                    >
                      {downloadingFormat === 'svg' ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      SVG
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 text-center">
{orderDetailTranslations.sections.qrCodeDownload.qualityNote}
                  </p>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
{orderDetailTranslations.sections.paymentInfo.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{orderDetailTranslations.sections.paymentInfo.status}:</span>
                    {getStatusBadge(order.paymentStatus, 'payment')}
                  </div>
                  {order.paymentId && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">{orderDetailTranslations.sections.paymentInfo.paymentId}</p>
                      <p className="font-mono text-sm">{order.paymentId}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>{orderDetailTranslations.sections.orderActions.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={deleteOrder}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
{orderDetailTranslations.sections.orderActions.deleteOrder}
                  </Button>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
{orderDetailTranslations.sections.timeline.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">{orderDetailTranslations.sections.timeline.orderCreated}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  {order.updatedAt !== order.createdAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">{orderDetailTranslations.sections.timeline.lastUpdated}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function OrderDetailPageWrapper() {
  return (
    <IsAdminAuth>
      <OrderDetailPage />
    </IsAdminAuth>
  );
}
