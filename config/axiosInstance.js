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
    const prevStatus = error?.response?.status;

    if (prevStatus === 401 && !prevRequest._retry) {
      prevRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const res = await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });

          if (res.status === 200) {
            const newToken = res.data.accessToken; // Extract the new token
            // Save the token (e.g., localStorage.setItem or cookies)
            // localStorage.setItem('accessToken', newToken);

            // Notify subscribers
            onTokenRefreshed(newToken);
            isRefreshing = false;

            return privateAxios(prevRequest);
          }
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);
        }
      }

      // Queue the request until the token refresh is complete
      return new Promise((resolve) => {
        addRefreshSubscriber(() => {
          resolve(privateAxios(prevRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export { publicAxios, privateAxios };
