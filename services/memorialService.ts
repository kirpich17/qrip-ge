import axiosInstance from "./axiosInstance";

export const getMemorials = async (page = 1, limit = 5, search = "") => {
  try {
    const response = await axiosInstance.get(`/api/memorials/my-memorials`, {
      params: { page, limit, search },
    });
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

export const getMyMemorialById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/memorials/my-memorial/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching my memorial with ID ${id}:`, error);
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

interface RecordViewPayload {
  memorialId: string;
  isScan: boolean;
}

export const recordMemorialView = async ({ memorialId, isScan }: RecordViewPayload) => {
  try {
    const response = await axiosInstance.post(`/api/memorials/view`, {
      memorialId,
      isScan,
    });
    return response.data;
  } catch (error) {
    console.error("Error recording memorial view:", error);
    throw error;
  }
};