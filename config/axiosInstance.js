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

// Helper function to handle logout across tabs
const handleLogoutAllTabs = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userAuthenticated');
    localStorage.removeItem('lastAuthCheck');
    // Trigger storage event for other tabs
    localStorage.setItem('userLoggedOut', Date.now().toString());
  }
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

    // ✅ FIXED: Simplified 401 handling to prevent loops
    if (prevStatus === 401 && !prevRequest._retry) {
      prevRequest._retry = true;
      
      // For admin routes, don't attempt token refresh - let context handle it
      if (prevRequest.url?.includes('/admin/')) {
        console.log('Admin authentication failed - letting context handle redirect');
        handleLogoutAllTabs(); // Add cross-tab logout
        return Promise.reject(error);
      }
      
      // For user routes, attempt token refresh only if not already refreshing
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.get(`${baseURL}/auth/refresh`, { 
            withCredentials: true 
          });

          if (res.status === 200) {
            const newToken = res.data.accessToken;
            
            // Update localStorage for cross-tab sync
            if (typeof window !== 'undefined') {
              localStorage.setItem('userAuthenticated', 'true');
              localStorage.setItem('lastAuthCheck', Date.now().toString());
            }
            
            // Notify subscribers
            onTokenRefreshed(newToken);
            isRefreshing = false;

            return privateAxios(prevRequest);
          }
        } catch (refreshError) {
          isRefreshing = false;
          console.error('Token refresh failed:', refreshError.message);
          
          // ✅ Enhanced logout handling with cross-tab support
          handleLogoutAllTabs();
          
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            
            // Only redirect for specific protected routes
            const isProtectedRoute = currentPath.includes('/dashboard') || 
                                   currentPath.includes('/profile') || 
                                   currentPath.includes('/account-settings') ||
                                   currentPath.includes('/nectcoins');
            
            const isOnAuthPage = currentPath.includes('/signin') ||
                               currentPath.includes('/signup') ||
                               currentPath.includes('/admin-panel');

            // Only redirect if user is on a protected route and not already on auth page
            if (isProtectedRoute && !isOnAuthPage) {
              setTimeout(() => {
                window.location.href = '/signin';
              }, 100);
            }
          }
          
          return Promise.reject(refreshError);
        }
      }

      // Queue the request until the token refresh is complete
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((newToken) => {
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