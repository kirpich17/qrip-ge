'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslate';
import axiosInstance from '@/services/axiosInstance';
import { getUserDetails } from '@/services/userService';
import { toast } from 'react-toastify';
import IsUserAuth from '@/lib/IsUserAuth/page';
import LanguageDropdown from '@/components/languageDropdown/page';

interface StickerOption {
  _id: string;
  name: string;
  description: string;
  type: {
    _id: string;
    name: string;
    displayName: string;
    description: string;
  };
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
  const purchaseTranslations = t('stickerPurchase') || {
    header: {
      back: 'Back to Dashboard',
      title: 'Buy QR Sticker',
      description: 'Order a physical QR code sticker for your memorial',
    },
    loading: { message: 'Loading...' },
    comingSoon: {
      title: 'Coming Soon',
      message:
        'QR Stickers are not available at the moment. Please check back later.',
      backButton: 'Back to Dashboard',
    },
    sections: {
      memorialSelection: {
        title: 'Select Memorial',
        description: 'Choose which memorial this sticker will be for',
      },
      stickerOptions: {
        title: 'Choose Sticker Type',
        description: 'Select the type and size of QR sticker you want',
        specifications: {
          material: 'Material:',
          dimensions: 'Dimensions:',
          durability: 'Durability:',
        },
      },
      quantity: {
        title: 'Quantity',
        description: 'How many stickers would you like?',
      },
      shippingAddress: {
        title: 'Shipping Address',
        description: 'Confirm your shipping details',
        form: {
          fullName: 'Full Name *',
          fullNamePlaceholder: 'John Doe',
          address: 'Address *',
          addressPlaceholder: '123 Main Street, Apartment 4B',
          city: 'City *',
          cityPlaceholder: 'Tbilisi',
          zipCode: 'ZIP Code',
          zipCodePlaceholder: '0100',
          country: 'Country',
          countryPlaceholder: 'Georgia',
          phone: 'Phone Number *',
          phonePlaceholder: '+995 555 123 456',
        },
      },
      orderSummary: {
        title: 'Order Summary',
        quantity: 'Quantity:',
        total: 'Total',
        proceedToPayment: 'Proceed to Payment',
        processing: 'Processing...',
        securePayment: 'Secure payment processing',
      },
    },
    messages: {
      loadError: 'Failed to load data',
      selectMemorialAndSticker: 'Please select a memorial and sticker option',
      fillShippingDetails: 'Please fill in all required shipping details',
      orderCreated: 'Order created successfully! Initiating payment...',
      paymentInitiationFailed: 'Payment initiation failed. Please try again.',
      orderCreationFailed: 'Failed to create order',
    },
  };

  const [loading, setLoading] = useState(true);
  const [stickerOptions, setStickerOptions] = useState<StickerOption[]>([]);
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [selectedMemorial, setSelectedMemorial] = useState<string>('');
  const [selectedSticker, setSelectedSticker] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping address form
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'Georgia',
    phone: '',
  });

  const memorialId = searchParams.get('memorialId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stickerResponse = await axiosInstance.get(
          '/api/stickers/options'
        );
        setStickerOptions(stickerResponse.data.data);

        const memorialsResponse = await axiosInstance.get(
          '/api/memorials/my-memorials'
        );
        setMemorials(memorialsResponse.data.data);

        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error('User ID not found in localStorage');

        const userResponse = await getUserDetails(userId);
        setUserDetails(userResponse.user);

        if (userResponse.user.shippingDetails) {
          setShippingAddress(userResponse.user.shippingDetails);
        }

        if (memorialId) {
          setSelectedMemorial(memorialId);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(
          purchaseTranslations?.messages?.loadError || 'Failed to load data'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [memorialId]);

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedStickerOption = stickerOptions.find(
    (option) => option._id === selectedSticker
  );
  const selectedMemorialData = memorials.find(
    (memorial) => memorial._id === selectedMemorial
  );
  const totalPrice = selectedStickerOption
    ? selectedStickerOption.price * quantity
    : 0;

  const handlePurchase = async () => {
    if (!selectedMemorial || !selectedSticker) {
      toast.error(
        purchaseTranslations?.messages?.selectMemorialAndSticker ||
          'Please select a memorial and sticker option'
      );
      return;
    }

    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone
    ) {
      toast.error(
        purchaseTranslations?.messages?.fillShippingDetails ||
          'Please fill in all required shipping details'
      );
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

      const response = await axiosInstance.post(
        '/api/stickers/orders',
        orderData
      );

      console.log('🚀 Order creation response:', response.data);

      if (response.data.status && response.data.data._id) {
        toast.success(
          purchaseTranslations?.messages?.orderCreated ||
            'Order created successfully! Initiating payment...'
        );

        // Initiate payment
        try {
          const paymentResponse = await axiosInstance.post(
            '/api/stickers/payment/initiate',
            {
              orderId: response.data.data._id,
            }
          );

          console.log('🚀 Payment initiation response:', paymentResponse.data);

          if (
            paymentResponse.data.status &&
            paymentResponse.data.data.paymentUrl
          ) {
            // Redirect to BOG payment page
            window.location.href = paymentResponse.data.data.paymentUrl;
          } else {
            console.error(
              '❌ Payment response missing paymentUrl:',
              paymentResponse.data
            );
            throw new Error(
              `Failed to get payment URL. Response: ${JSON.stringify(
                paymentResponse.data
              )}`
            );
          }
        } catch (paymentError: any) {
          console.error('Payment initiation error:', paymentError);
          toast.error(
            purchaseTranslations?.messages?.paymentInitiationFailed ||
              'Payment initiation failed. Please try again.'
          );
        }
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast.error(
        error.response?.data?.message ||
          purchaseTranslations?.messages?.orderCreationFailed ||
          'Failed to create order'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-[#547455] border-b-2 rounded-full w-12 h-12 animate-spin"></div>
          <p className="mt-4 text-gray-600">
            {purchaseTranslations?.loading?.message || 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (stickerOptions.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="top-0 z-50 sticky bg-[#243b31] py-4">
          <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex justify-between items-center">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-white text-base hover:underline"
              >
                <ArrowLeft className="w-5 h-5" />
                {purchaseTranslations?.header?.back || 'Back to Dashboard'}
              </Link>
              <LanguageDropdown />
            </div>
          </div>
        </header>

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="mx-auto mb-4 w-16 h-16 text-gray-400" />
              <h2 className="mb-2 font-bold text-gray-900 text-2xl">
                {purchaseTranslations?.comingSoon?.title || 'Coming Soon'}
              </h2>
              <p className="mb-4 text-gray-600">
                {purchaseTranslations?.comingSoon?.message ||
                  'QR Stickers are not available at the moment. Please check back later.'}
              </p>
              <Link href="/dashboard">
                <Button className="bg-[#547455] hover:bg-[#243b31]">
                  {purchaseTranslations?.comingSoon?.backButton ||
                    'Back to Dashboard'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="top-0 z-50 sticky bg-[#243b31] py-4">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-white text-base hover:underline"
            >
              <ArrowLeft className="w-5 h-5" />
              {purchaseTranslations?.header?.back || 'Back to Dashboard'}
            </Link>
            <LanguageDropdown />
          </div>
        </div>
      </header>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="mb-2 font-bold text-gray-900 text-3xl">
            {purchaseTranslations?.header?.title || 'Buy QR Sticker'}
          </h1>
          <p className="text-gray-600">
            {purchaseTranslations?.header?.description ||
              'Order a physical QR code sticker for your memorial'}
          </p>
        </motion.div>

        <div className="gap-8 grid lg:grid-cols-3">
          {/* Left Column - Selection */}
          <div className="space-y-6 lg:col-span-2">
            {/* Memorial Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 w-5 h-5 text-[#547455]" />
                  {purchaseTranslations?.sections?.memorialSelection?.title ||
                    'Select Memorial'}
                </CardTitle>
                <CardDescription>
                  {purchaseTranslations?.sections?.memorialSelection
                    ?.description ||
                    'Choose which memorial this sticker will be for'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedMemorial}
                  onValueChange={setSelectedMemorial}
                  className="space-y-3"
                >
                  {memorials.map((memorial) => (
                    <div
                      key={memorial._id}
                      className="flex items-center space-x-3 hover:bg-gray-50 p-3 border rounded-lg"
                    >
                      <RadioGroupItem value={memorial._id} id={memorial._id} />
                      <div className="flex flex-1 items-center space-x-3">
                        <img
                          src={memorial.profileImage || '/placeholder.svg'}
                          alt={memorial.firstName}
                          className="rounded-full w-12 h-12 object-cover"
                        />
                        <div>
                          <Label
                            htmlFor={memorial._id}
                            className="font-medium cursor-pointer"
                          >
                            {memorial.firstName} {memorial.lastName}
                          </Label>
                          <p className="text-gray-500 text-sm">
                            /{memorial.slug}
                          </p>
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
                  <Package className="mr-2 w-5 h-5 text-blue-500" />
                  {purchaseTranslations?.sections?.stickerOptions?.title ||
                    'Choose Sticker Type'}
                </CardTitle>
                <CardDescription>
                  {purchaseTranslations?.sections?.stickerOptions
                    ?.description ||
                    'Select the type and size of QR sticker you want'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={selectedSticker}
                  onValueChange={setSelectedSticker}
                  className="space-y-4"
                >
                  {stickerOptions.map((option) => (
                    <div
                      key={option._id}
                      className="hover:bg-gray-50 p-4 border rounded-lg"
                    >
                      <div className="flex items-start space-x-4">
                        <RadioGroupItem
                          value={option._id}
                          id={option._id}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={option._id}
                            className="font-medium cursor-pointer"
                          >
                            {option.name}
                          </Label>
                          <p className="mt-1 text-gray-600 text-sm">
                            {option.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline">{option.type.name}</Badge>
                            <Badge variant="outline">{option.size}</Badge>
                            <span className="font-semibold text-[#547455]">
                              ₾{option.price}
                            </span>
                          </div>
                          {option.specifications && (
                            <div className="mt-3 text-gray-500 text-xs">
                              <p>
                                <strong>
                                  {purchaseTranslations?.sections
                                    ?.stickerOptions?.specifications
                                    ?.material || 'Material:'}
                                </strong>{' '}
                                {option.specifications.material}
                              </p>
                              <p>
                                <strong>
                                  {purchaseTranslations?.sections
                                    ?.stickerOptions?.specifications
                                    ?.dimensions || 'Dimensions:'}
                                </strong>{' '}
                                {option.specifications.dimensions}
                              </p>
                              <p>
                                <strong>
                                  {purchaseTranslations?.sections
                                    ?.stickerOptions?.specifications
                                    ?.durability || 'Durability:'}
                                </strong>{' '}
                                {option.specifications.durability}
                              </p>
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
                <CardTitle>
                  {purchaseTranslations?.sections?.quantity?.title ||
                    'Quantity'}
                </CardTitle>
                <CardDescription>
                  {purchaseTranslations?.sections?.quantity?.description ||
                    'How many stickers would you like?'}
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
                  <span className="font-medium text-lg">{quantity}</span>
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
                  <MapPin className="mr-2 w-5 h-5 text-green-500" />
                  {purchaseTranslations?.sections?.shippingAddress?.title ||
                    'Shipping Address'}
                </CardTitle>
                <CardDescription>
                  {purchaseTranslations?.sections?.shippingAddress
                    ?.description || 'Confirm your shipping details'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">
                    {purchaseTranslations?.sections?.shippingAddress?.form
                      ?.fullName || 'Full Name *'}
                  </Label>
                  <Input
                    id="fullName"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      handleAddressChange('fullName', e.target.value)
                    }
                    placeholder={
                      purchaseTranslations?.sections?.shippingAddress?.form
                        ?.fullNamePlaceholder || 'John Doe'
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="address">
                    {purchaseTranslations?.sections?.shippingAddress?.form
                      ?.address || 'Address *'}
                  </Label>
                  <Textarea
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      handleAddressChange('address', e.target.value)
                    }
                    placeholder={
                      purchaseTranslations?.sections?.shippingAddress?.form
                        ?.addressPlaceholder || '123 Main Street, Apartment 4B'
                    }
                    rows={2}
                  />
                </div>
                <div className="gap-4 grid grid-cols-2">
                  <div>
                    <Label htmlFor="city">
                      {purchaseTranslations?.sections?.shippingAddress?.form
                        ?.city || 'City *'}
                    </Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleAddressChange('city', e.target.value)
                      }
                      placeholder={
                        purchaseTranslations?.sections?.shippingAddress?.form
                          ?.cityPlaceholder || 'Tbilisi'
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">
                      {purchaseTranslations?.sections?.shippingAddress?.form
                        ?.zipCode || 'ZIP Code'}
                    </Label>
                    <Input
                      id="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={(e) =>
                        handleAddressChange('zipCode', e.target.value)
                      }
                      placeholder={
                        purchaseTranslations?.sections?.shippingAddress?.form
                          ?.zipCodePlaceholder || '0100'
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">
                    {purchaseTranslations?.sections?.shippingAddress?.form
                      ?.country || 'Country'}
                  </Label>
                  <Input
                    id="country"
                    value={shippingAddress.country}
                    onChange={(e) =>
                      handleAddressChange('country', e.target.value)
                    }
                    placeholder={
                      purchaseTranslations?.sections?.shippingAddress?.form
                        ?.countryPlaceholder || 'Georgia'
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">
                    {purchaseTranslations?.sections?.shippingAddress?.form
                      ?.phone || 'Phone Number *'}
                  </Label>
                  <Input
                    id="phone"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      handleAddressChange('phone', e.target.value)
                    }
                    placeholder={
                      purchaseTranslations?.sections?.shippingAddress?.form
                        ?.phonePlaceholder || '+995 555 123 456'
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 w-5 h-5 text-purple-500" />
                  {purchaseTranslations?.sections?.orderSummary?.title ||
                    'Order Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedMemorialData && (
                  <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <img
                      src={
                        selectedMemorialData.profileImage || '/placeholder.svg'
                      }
                      alt={selectedMemorialData.firstName}
                      className="rounded-full w-10 h-10 object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {selectedMemorialData.firstName}{' '}
                        {selectedMemorialData.lastName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        /{selectedMemorialData.slug}
                      </p>
                    </div>
                  </div>
                )}

                {selectedStickerOption && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{selectedStickerOption.name}</span>
                      <span>₾{selectedStickerOption.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {purchaseTranslations?.sections?.orderSummary
                          ?.quantity || 'Quantity:'}{' '}
                        {quantity}
                      </span>
                      <span>× {quantity}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>
                        {purchaseTranslations?.sections?.orderSummary?.total ||
                          'Total'}
                      </span>
                      <span>₾{totalPrice}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handlePurchase}
                  disabled={
                    !selectedMemorial || !selectedSticker || isProcessing
                  }
                  className="bg-[#547455] hover:bg-[#243b31] w-full"
                >
                  {isProcessing ? (
                    <>
                      <div className="mr-2 border-white border-b-2 rounded-full w-4 h-4 animate-spin"></div>
                      {purchaseTranslations?.sections?.orderSummary
                        ?.processing || 'Processing...'}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 w-4 h-4" />
                      {purchaseTranslations?.sections?.orderSummary
                        ?.proceedToPayment || 'Proceed to Payment'}
                    </>
                  )}
                </Button>

                <div className="flex items-center text-gray-500 text-sm">
                  <Check className="mr-2 w-4 h-4 text-green-500" />
                  {purchaseTranslations?.sections?.orderSummary
                    ?.securePayment || 'Secure payment processing'}
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
