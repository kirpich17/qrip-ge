import axiosInstance from './axiosInstance';

export const getUserDetails = async (userId?: string) => {
  if (!userId) {
    if (typeof window === 'undefined') {
      throw new Error('Cannot access localStorage on server side');
    }

    const loginData = localStorage.getItem('loginData');
    if (!loginData) {
      throw new Error('No login data found');
    }

    const user = JSON.parse(loginData);
    userId = user?.id;

    if (!userId) {
      throw new Error('User ID not found in login data');
    }
  }

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  if (!token) throw new Error('No auth token found');

  try {
    const response = await axiosInstance.get(`/api/auth/details/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const updateUserDetails = async (userId: string, data: FormData) => {
  try {
    const response = await axiosInstance.put(`/api/auth/users/${userId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
};

export const uploadProfileImage = async (userId: string, imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    const response = await axiosInstance.patch(
      `/api/auth/update-profile/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw error;
  }
};
