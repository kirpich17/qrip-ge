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
  baseURL: 'http://localhost:4040',
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

    // Determine which refresh endpoint to use based on user type
    const refreshEndpoint =
      user?.userType === 'admin'
        ? '/api/admin/refresh-token'
        : '/api/auth/refresh-token';

    console.log('🔄 Token refresh triggered for:', user?.userType || 'user');
    console.log('🔄 Using endpoint:', refreshEndpoint);

    // Use the baseURL from axiosInstance
    const refreshUrl = `http://localhost:4040${refreshEndpoint}`;
    console.log('🔄 Full refresh URL:', refreshUrl);

    const response = await axios.post(
      refreshUrl,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.status && response.data.token) {
      const newToken = response.data.token;
      const newUser = response.data.user;

      // Update localStorage with new token
      localStorage.setItem('authToken', newToken);
      if (newUser) {
        localStorage.setItem('loginData', JSON.stringify(newUser));
      }

      console.log('✅ Token refreshed successfully');
      return newToken;
    }

    throw new Error('Token refresh failed');
  } catch (error: any) {
    console.error('❌ Token refresh error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    // Check if it's a completely invalid token (not a JWT)
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || '';
      if (
        errorMessage.includes('Invalid token format') ||
        errorMessage.includes('Invalid token payload')
      ) {
        console.warn(
          '⚠️ Token is not a valid JWT. Cannot refresh. Redirecting to login...'
        );
      }
    }

    // If refresh fails, logout user
    logoutUser();

    // Redirect to appropriate login page
    if (typeof window !== 'undefined') {
      const userRole = localStorage.getItem('userRole');
      console.log('🚪 Redirecting to login page. User role:', userRole);
      if (userRole === 'admin') {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }

    return null;
  }
};

// ✅ SINGLE REQUEST INTERCEPTOR - Adds token to all requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authData = localStorageAuthUserData();
    const { token } = authData || {};

    console.log(
      '🔑 Token from localStorage:',
      token ? token.substring(0, 20) + '...' : 'NO TOKEN'
    );
    console.log('📤 Request URL:', config.url);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        '📤 Authorization header set:',
        `Bearer ${token.substring(0, 20)}...`
      );
    } else {
      console.warn('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR - Handles 401/403 and token refresh
axiosInstance.interceptors.response.use(
  (response: any) => {
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
