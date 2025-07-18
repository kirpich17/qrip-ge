import axios from "axios";
import { localStorageAuthUserData } from "./AuthUserData";

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const config = {
  headers: { "content-type": "multipart/form-data" },
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    const authData = localStorageAuthUserData();
    const { token } = authData || {};

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // removeToken();
      // window.location.href = "/logins"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
