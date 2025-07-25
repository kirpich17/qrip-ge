import axiosInstance from "./axiosInstance";

export const getMemorials = async () => {
  try {
    const response = await axiosInstance.get('/api/memorials/my-memorials');
    return response.data;
  } catch (error) {
    console.error("Error fetching memorials:", error);
    throw error;
  }
};

export const getSingleMemorial = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/memorials/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching memorial with ID ${id}:`, error);
    throw error;
  }
};

export const getDeleteMemorial = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/api/memorials/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching memorial with ID ${id}:`, error);
    throw error;
  }
};
