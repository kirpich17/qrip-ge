import axiosInstance from './axiosInstance';

export const getUserDetails = async (userId: any) => {
  try {
    const response = await axiosInstance.get(`/api/auth/details/${userId}`);
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
