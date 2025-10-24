// app/dashboard/subscription/success/page.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useQueryClient } from '@tanstack/react-query'; 
import { useTranslation } from '@/hooks/useTranslate';

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
  const planUpdated = searchParams.get('update'); // New: Check for planUpdated param
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();
  
  const subscriptionManageTranslations = t("subscription_management" as any);
  const subscriptionManage: any = subscriptionManageTranslations;
  console.log("🚀 ~ SubscriptionSuccessPage ~ subscriptionManage:", subscriptionManage)

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['userSubscriptionDetails'] });
    queryClient.invalidateQueries({ queryKey: ['userMemorials'] });
  }, [queryClient]);

  const handleProceed = () => {
    setIsLoading(true); // Set loading state for the button
    router.push(`/dashboard`); // Always redirect to dashboard
  };

  // Determine content based on whether it's a plan update or initial purchase
  const isPlanUpdate = planUpdated === 'true';

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
          
              {subscriptionManage.plan_updated_success }
                
            </h1>
            
            <p className="text-gray-600 mb-6">
              {
                 subscriptionManage.plan_updated_msg 
                }
            </p>
            
            <Button
              onClick={handleProceed}
              className="w-full bg-[#243b31] hover:bg-green-700 text-white"
              size="lg"
              disabled={isLoading}
            >
              {isLoading 
                ? subscriptionManage.loading 
                :
                  subscriptionManage.go_to_dashboard 
                  }
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}