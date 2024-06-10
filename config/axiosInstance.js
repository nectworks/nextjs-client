const axios = require("axios")

// Set the base URL for API requests
const baseURL = process.env.NEXT_PUBLIC_APP_URL || '/api/v1';
/* 
  Axios instance without credentials.
  This instance doesn't send cookies on each request.
*/
const publicAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios instance with credentials and a response interceptor
const privateAxios = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include credentials in cross-origin requests
});

/* This interceptor would be utilized when the access token expires
  and request will be sent to refresh the token and then retry the
  previous request which failed due to expired token.

  (1). Access to API (if token expired, client receives `unauthorized` error).
  (2). If the client has a valid refresh token, retrieve a new access token (which is done inside the interceptor).
  (3). If an access token is received successfully, retry the (1) network call.
*/
const tokenResInterceptor = async (error) => {
  const prevRequest = error?.config;
  const prevStatus = error?.response?.status;

  // This error code implies the access token has expired
  if (prevStatus === 401 && !prevRequest.retry) {
    prevRequest.retry = true;

    // Send a network request to refresh token
    return axios.get(`${baseURL}/auth/refresh`, { withCredentials: true })
      .then((res) => {
        /* If the access token was successfully retrieved, retry the
          previous request */
        if (res.status === 200) {
          return privateAxios(prevRequest);
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  // Reject other errors
  return Promise.reject(error);
};

module.exports = { privateAxios, publicAxios, tokenResInterceptor };

