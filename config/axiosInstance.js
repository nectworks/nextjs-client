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

const onTokenRefreshed = () => {
  refreshSubscribers.forEach(({ resolve, request }) => {
    resolve(privateAxios(request));
  });
  refreshSubscribers = [];
};

const onTokenRefreshFailed = (error) => {
  refreshSubscribers.forEach(({ reject }) => reject(error));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (request, resolve, reject) => {
  refreshSubscribers.push({ request, resolve, reject });
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

const redirectToLogin = () => {
  if (typeof window === 'undefined') return;

  const currentPath = `${window.location.pathname}${window.location.search}`;
  const isProtectedRoute =
    currentPath.includes('/dashboard') ||
    currentPath.includes('/profile') ||
    currentPath.includes('/account-settings') ||
    currentPath.includes('/feedback') ||
    currentPath.includes('/help') ||
    currentPath.includes('/nectcoins');

  const isOnAuthPage =
    currentPath.includes('/log-in') ||
    currentPath.includes('/sign-up') ||
    currentPath.includes('/admin-panel');

  if (!isProtectedRoute || isOnAuthPage) return;

  const detail = {
    redirectTo: `/log-in?redirect=${encodeURIComponent(currentPath)}`,
  };

  window.dispatchEvent(new CustomEvent('auth:expired', { detail }));
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
            // Update localStorage for cross-tab sync
            if (typeof window !== 'undefined') {
              localStorage.setItem('userAuthenticated', 'true');
              localStorage.setItem('lastAuthCheck', Date.now().toString());
            }
            
            // Notify subscribers
            onTokenRefreshed();
            isRefreshing = false;

            return privateAxios(prevRequest);
          }
        } catch (refreshError) {
          isRefreshing = false;
          console.error('Token refresh failed:', refreshError.message);
          onTokenRefreshFailed(refreshError);
          
          // ✅ Enhanced logout handling with cross-tab support
          handleLogoutAllTabs();
          
          redirectToLogin();
          
          return Promise.reject(refreshError);
        }
      }

      // Queue the request until the token refresh is complete
      return new Promise((resolve, reject) => {
        addRefreshSubscriber(prevRequest, resolve, reject);
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
