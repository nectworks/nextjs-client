// config/axiosInstance.js (UPDATED)
// Fixed axios configuration for production admin authentication

import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_APP_URL;

const publicAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const privateAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

privateAxios.interceptors.response.use(
  (response) => response, // Forward successful responses
  async (error) => {
    const prevRequest = error?.config;
    
    // Better error handling - check if error.response exists
    if (!error.response) {
      console.error('Network error or request failed:', error.message);
      return Promise.reject(error);
    }
    
    const prevStatus = error.response.status;

    // Handle 401 errors differently for admin vs user routes
    if (prevStatus === 401 && !prevRequest._retry) {
      
      // For admin routes, don't attempt token refresh - redirect to admin login
      if (prevRequest.url?.includes('/admin/')) {
        console.log('Admin authentication failed, redirecting to login');
        
        // Only redirect if we're not already on the login page
        if (typeof window !== 'undefined' && 
            !window.location.pathname.includes('/admin-panel') || 
            !window.location.pathname.includes('/login')) {
          // Clear any existing admin state
          if (window.localStorage) {
            window.localStorage.removeItem('admin');
          }
          // Don't redirect automatically - let the component handle it
        }
        
        return Promise.reject(error);
      }
      
      // For user routes, attempt token refresh
      prevRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.get(`${baseURL}/auth/refresh`, { 
            withCredentials: true 
          });

          if (res.status === 200) {
            const newToken = res.data.accessToken;
            
            // Notify subscribers
            onTokenRefreshed(newToken);
            isRefreshing = false;

            return privateAxios(prevRequest);
          }
        } catch (refreshError) {
          isRefreshing = false;
          console.error('Token refresh failed:', refreshError.message);
          
          // Only redirect to user login for user routes
          if (typeof window !== 'undefined' && 
              !window.location.pathname.includes('/admin-panel')) {
            window.location.href = '/signin';
          }
          
          return Promise.reject(refreshError);
        }
      }

      // Queue the request until the token refresh is complete
      return new Promise((resolve, reject) => {
        addRefreshSubscriber(() => {
          resolve(privateAxios(prevRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

// Add request interceptor for debugging in development
if (process.env.NODE_ENV === 'development') {
  privateAxios.interceptors.request.use(
    (config) => {
      console.log(`🔍 API Request: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('🔍 API Request Error:', error);
      return Promise.reject(error);
    }
  );
}

export { publicAxios, privateAxios };
