import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { localStorageAuthUserData, logoutUser } from './AuthUserData';

export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const config = {
  headers: { 'content-type': 'multipart/form-data' },
};

// Helper function to normalize URLs and avoid double slashes
const normalizeUrl = (base: string | undefined, path: string): string => {
  if (!base) return path;
  const baseUrl = base.endsWith('/') ? base.slice(0, -1) : base;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const authData = localStorageAuthUserData();
    const { token, user } = authData || {};

    if (!token) {
      throw new Error('No token available for refresh');
    }

    const refreshEndpoint =
      user?.userType === 'admin'
        ? '/api/admin/refresh-token'
        : '/api/auth/refresh-token';

    const refreshUrl = normalizeUrl(BASE_URL, refreshEndpoint);

    const response = await axios.post(
      refreshUrl,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { status, token: newToken, user: newUser } = response.data || {};

    if (status && newToken) {
      if (newUser) {
        // ✅ შევინახოთ სრულად ყველა საჭირო ველი, _id ჩათვლით
        const userDataToStore = {
          _id: newUser._id || user?._id, // თუ newUser._id არ არსებობს, გამოვიყენოთ ძველი
          firstname: newUser.firstname || user?.firstname,
          lastname: newUser.lastname || user?.lastname,
          email: newUser.email || user?.email,
          userType: newUser.userType || user?.userType,
        };
        localStorage.setItem('loginData', JSON.stringify(userDataToStore));
      }

      localStorage.setItem('authToken', newToken);
      console.log('✅ Token refreshed successfully');
      return newToken;
    }

    throw new Error('Token refresh failed: No token in response');
  } catch (error: any) {
    console.error('❌ Token refresh error:', error);

    logoutUser();

    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      if (userRole === 'admin') {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }

    return null;
  }
};

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authData = localStorageAuthUserData();
    const { token } = authData || {};

    console.log(
      '🔑 Token from localStorage:',
      token ? token.substring(0, 20) + '...' : 'NO TOKEN'
    );
    console.log('📤 Request URL:', config.url);
    console.log(
      '📤 Full URL:',
      config.baseURL ? `${config.baseURL}${config.url}` : config.url
    );

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        '✅ Authorization header set:',
        `Bearer ${token.substring(0, 20)}...`
      );
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error: any) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR - Handles 401/403 and token refresh
axiosInstance.interceptors.response.use(
  (response: any) => {
    console.log('✅ Response success:', response.config.url, response.status);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Debug logging
    if (error.response) {
      console.log('🔍 Response error detected:', {
        status: error.response.status,
        url: originalRequest?.url,
        hasRetry: originalRequest?._retry,
        errorData: error.response.data,
      });
    }

    // Check if error is 401/403 and we haven't already retried
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      originalRequest &&
      !originalRequest._retry
    ) {
      console.log('✅ 401/403 detected, checking if refresh should trigger...');

      // Skip refresh for login/refresh endpoints to avoid infinite loops
      if (
        originalRequest.url?.includes('/signin') ||
        originalRequest.url?.includes('/signIn') ||
        originalRequest.url?.includes('/refresh-token') ||
        originalRequest.url?.includes('/login')
      ) {
        console.log('⏭️ Skipping refresh for login/refresh endpoint');
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        console.log(
          '⏳ Token refresh in progress, queuing request:',
          originalRequest.url
        );
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            console.log('✅ Retrying queued request:', originalRequest.url);
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log(
        '🔄 Starting token refresh for failed request:',
        originalRequest.url
      );

      try {
        const newToken = await refreshToken();

        if (newToken) {
          processQueue(null, newToken);

          // Update the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          console.log(
            '🔄 Retrying original request with new token:',
            originalRequest.url
          );
          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          processQueue(new Error('Token refresh failed'), null);
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed completely:', refreshError);
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
