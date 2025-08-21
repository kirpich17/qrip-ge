// app/dashboard/subscription/success/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryClient } from '@tanstack/react-query'; 

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const memorialId = searchParams.get('memorialId');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // When this page loads, it's a good idea to invalidate any cached
    // user data or subscription data to ensure the rest of the app 
    // knows about the new purchase.
    queryClient.invalidateQueries({ queryKey: ['userSubscriptionDetails'] });
    queryClient.invalidateQueries({ queryKey: ['userMemorials'] });
  }, [queryClient]);

  const handleProceed = () => {
    // Store the memorialId in localStorage or context to use in the create page
   if (memorialId) {
      // Navigate to memorial creation with the memorialId
      router.push(`/memorial/edit/${memorialId}`);
    } 
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h1>
            
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. You can now create a beautiful memorial for your loved one.
            </p>
            
            <Button
              onClick={handleProceed}
              className="w-full bg-[#243b31] hover:bg-green-700 text-white"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Create Your Memorial'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}