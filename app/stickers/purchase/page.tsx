"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  MapPin,
  CreditCard,
  Check,
  AlertCircle,
  Package,
  Truck,
  Heart,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslate";
import axiosInstance from "@/services/axiosInstance";
import { getUserDetails } from "@/services/userService";
import { toast } from "react-toastify";
import IsUserAuth from "@/lib/IsUserAuth/page";
import LanguageDropdown from "@/components/languageDropdown/page";

interface StickerOption {
  _id: string;
  name: string;
  description: string;
  type: string;
  size: string;
  price: number;
  image?: string;
  specifications: {
    material: string;
    dimensions: string;
    durability: string;
    weatherResistance: string;
  };
}

interface Memorial {
  _id: string;
  firstName: string;
  lastName: string;
  slug: string;
  profileImage?: string;
}

interface UserDetails {
  shippingDetails?: {
    fullName: string;
    address: string;
    phone: string;
    zipCode: string;
    city: string;
    country: string;
  };
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

function StickerPurchasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [stickerOptions, setStickerOptions] = useState<StickerOption[]>([]);
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [selectedMemorial, setSelectedMemorial] = useState<string>("");
  const [selectedSticker, setSelectedSticker] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping address form
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Georgia",
    phone: "",
  });

  const memorialId = searchParams.get("memorialId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch sticker options
        const stickerResponse = await axiosInstance.get("/api/stickers/options");
        setStickerOptions(stickerResponse.data.data);

        // Fetch user's memorials
        const memorialsResponse = await axiosInstance.get("/api/memorials/my-memorials");
        setMemorials(memorialsResponse.data.data);

        // Fetch user details
        const userResponse = await getUserDetails();
        setUserDetails(userResponse.user);

        // Auto-fill shipping address if available
        if (userResponse.user.shippingDetails) {
          setShippingAddress(userResponse.user.shippingDetails);
        }

        // Auto-select memorial if provided in URL
        if (memorialId) {
          setSelectedMemorial(memorialId);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memorialId]);

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const selectedStickerOption = stickerOptions.find(option => option._id === selectedSticker);
  const selectedMemorialData = memorials.find(memorial => memorial._id === selectedMemorial);
  const totalPrice = selectedStickerOption ? selectedStickerOption.price * quantity : 0;

  const handlePurchase = async () => {
    if (!selectedMemorial || !selectedSticker) {
      toast.error("Please select a memorial and sticker option");
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
      toast.error("Please fill in all required shipping details");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        memorialId: selectedMemorial,
        stickerOptionId: selectedSticker,
        quantity,
        shippingAddress,
      };

      const response = await axiosInstance.post("/api/stickers/orders", orderData);
      
      console.log("🚀 Order creation response:", response.data);
      
      if (response.data.status && response.data.data._id) {
        toast.success("Order created successfully! Initiating payment...");
        
        // Initiate payment
        try {
          const paymentResponse = await axiosInstance.post("/api/stickers/payment/initiate", {
            orderId: response.data.data._id
          });
          
          console.log("🚀 Payment initiation response:", paymentResponse.data);
          
          if (paymentResponse.data.status && paymentResponse.data.data.paymentUrl) {
            // Redirect to BOG payment page
            window.location.href = paymentResponse.data.data.paymentUrl;
          } else {
            console.error("❌ Payment response missing paymentUrl:", paymentResponse.data);
            throw new Error(`Failed to get payment URL. Response: ${JSON.stringify(paymentResponse.data)}`);
          }
        } catch (paymentError: any) {
          console.error("Payment initiation error:", paymentError);
          toast.error("Payment initiation failed. Please try again.");
        }
      } else {
        throw new Error("Failed to create order");
      }

    } catch (error: any) {
      console.error("Error creating order:", error);
      toast.error(error.response?.data?.message || "Failed to create order");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#547455] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (stickerOptions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-[#243b31] py-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:underline gap-2 text-base"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Link>
              <LanguageDropdown />
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
              <p className="text-gray-600 mb-4">
                QR Stickers are not available at the moment. Please check back later.
              </p>
              <Link href="/dashboard">
                <Button className="bg-[#547455] hover:bg-[#243b31]">
                  Back to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
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
              href="/dashboard"
              className="flex items-center text-white hover:underline gap-2 text-base"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
            <LanguageDropdown />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buy QR Sticker
          </h1>
          <p className="text-gray-600">
            Order a physical QR code sticker for your memorial
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Memorial Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-[#547455]" />
                  Select Memorial
                </CardTitle>
                <CardDescription>
                  Choose which memorial this sticker will be for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedMemorial}
                  onValueChange={setSelectedMemorial}
                  className="space-y-3"
                >
                  {memorials.map((memorial) => (
                    <div key={memorial._id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={memorial._id} id={memorial._id} />
                      <div className="flex items-center space-x-3 flex-1">
                        <img
                          src={memorial.profileImage || "/placeholder.svg"}
                          alt={memorial.firstName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <Label htmlFor={memorial._id} className="font-medium cursor-pointer">
                            {memorial.firstName} {memorial.lastName}
                          </Label>
                          <p className="text-sm text-gray-500">/{memorial.slug}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Sticker Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2 text-blue-500" />
                  Choose Sticker Type
                </CardTitle>
                <CardDescription>
                  Select the type and size of QR sticker you want
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedSticker}
                  onValueChange={setSelectedSticker}
                  className="space-y-4"
                >
                  {stickerOptions.map((option) => (
                    <div key={option._id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-4">
                        <RadioGroupItem value={option._id} id={option._id} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={option._id} className="font-medium cursor-pointer">
                            {option.name}
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{option.type}</Badge>
                            <Badge variant="outline">{option.size}</Badge>
                            <span className="font-semibold text-[#547455]">
                              ${option.price}
                            </span>
                          </div>
                          {option.specifications && (
                            <div className="mt-3 text-xs text-gray-500">
                              <p><strong>Material:</strong> {option.specifications.material}</p>
                              <p><strong>Dimensions:</strong> {option.specifications.dimensions}</p>
                              <p><strong>Durability:</strong> {option.specifications.durability}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Quantity */}
            <Card>
              <CardHeader>
                <CardTitle>Quantity</CardTitle>
                <CardDescription>
                  How many stickers would you like?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Shipping & Order Summary */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-500" />
                  Shipping Address
                </CardTitle>
                <CardDescription>
                  Confirm your shipping details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) => handleAddressChange("fullName", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) => handleAddressChange("address", e.target.value)}
                    placeholder="123 Main Street, Apartment 4B"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => handleAddressChange("city", e.target.value)}
                      placeholder="Tbilisi"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                      placeholder="0100"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={shippingAddress.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                    placeholder="Georgia"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={shippingAddress.phone}
                    onChange={(e) => handleAddressChange("phone", e.target.value)}
                    placeholder="+995 555 123 456"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-purple-500" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMemorialData && (
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={selectedMemorialData.profileImage || "/placeholder.svg"}
                      alt={selectedMemorialData.firstName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{selectedMemorialData.firstName} {selectedMemorialData.lastName}</p>
                      <p className="text-sm text-gray-500">/{selectedMemorialData.slug}</p>
                    </div>
                  </div>
                )}

                {selectedStickerOption && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{selectedStickerOption.name}</span>
                      <span>${selectedStickerOption.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quantity: {quantity}</span>
                      <span>× {quantity}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePurchase}
                  disabled={!selectedMemorial || !selectedSticker || isProcessing}
                  className="w-full bg-[#547455] hover:bg-[#243b31]"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>

                <div className="flex items-center text-sm text-gray-500">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Secure payment processing
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const StickerPurchasePageWrapper = () => {
  return (
    <IsUserAuth>
      <StickerPurchasePage />
    </IsUserAuth>
  );
};

export default StickerPurchasePageWrapper;
