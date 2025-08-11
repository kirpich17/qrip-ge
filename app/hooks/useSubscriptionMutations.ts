    // hooks/useSubscriptionMutations.ts
    import { useMutation, useQueryClient } from '@tanstack/react-query';
    import axiosInstance from '@/services/axiosInstance';
    import { toast } from 'react-toastify';

    // API call to cancel the subscription
    const cancelSubscriptionAPI = async (subscriptionId: string) => {
        // Note: Your API expects `userSubscriptionId` in the body
        const { data } = await axiosInstance.put('/api/subscription/cancel', {
            userSubscriptionId: subscriptionId
        });
        return data;
    };

    // API call to resume the subscription
    const resumeSubscriptionAPI = async (subscriptionId: string) => {
        // Note: Your API for resume might also need the ID in the body
        const { data } = await axiosInstance.put('/api/subscription/resume', {
            userSubscriptionId: subscriptionId
        });
        return data;
    };

    export const useSubscriptionMutations = () => {
        const queryClient = useQueryClient();

        // --- Cancel Mutation ---
        const { mutate: cancelSubscription, isPending: isCanceling } = useMutation({
            mutationFn: cancelSubscriptionAPI,
            onSuccess: (data) => {
                toast.success(data.message || 'Subscription canceled successfully!');
                // Invalidate queries to refetch fresh data from the server
                queryClient.invalidateQueries({ queryKey: ['userSubscriptionDetails'] });
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to cancel subscription.');
            },
        });

        // --- Resume Mutation ---
        const { mutate: resumeSubscription, isPending: isResuming } = useMutation({
            mutationFn: resumeSubscriptionAPI,
            onSuccess: (data) => {
                toast.success(data.message || 'Subscription resumed successfully!');
                queryClient.invalidateQueries({ queryKey: ['userSubscriptionDetails'] });
            },
            onError: (error: any) => {
                toast.error(error.response?.data?.message || 'Failed to resume subscription.');
            },
        });

        return {
            cancelSubscription,
            isCanceling,
            resumeSubscription,
            isResuming,
        };
    };