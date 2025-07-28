import axiosInstance from "./axiosInstance";

export const getUserDetails = async () => {
  try {
    const response = await axiosInstance.get('/api/auth/details');
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};