import axiosInstance from './axiosInstance';

export interface Activity {
  id: string;
  type: 'memorial_created' | 'memorial_viewed' | 'memorial_scanned';
  description: string;
  memorialName: string;
  memorialId: string;
  createdAt: string;
}

export interface ActivityResponse {
  status: boolean;
  message: string;
  data: Activity[];
}

/**
 * Fetch recent activities for the authenticated user
 */
export const getUserRecentActivities = async (limit: number = 5): Promise<ActivityResponse> => {
  try {
    const response = await axiosInstance.get('/api/user/activities', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user activities:', error);
    throw error;
  }
};
