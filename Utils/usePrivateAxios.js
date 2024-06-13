'use client';
/*
  File: usePrivateAxios.js
  Description: This contains a custom hook that mounts and unmounts the
    interceptor to the axios request and refreshes access token if
    it has expired.
*/

import { useContext, useEffect } from 'react';
import { privateAxios, tokenResInterceptor } from '../config/axiosInstance.js';
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/User/UserContext';

const usePrivateAxios = () => {
  const router = useRouter();
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  // add the interceptor on mount and remove it on unmount
  useEffect(() => {
    const responseInterceptor = privateAxios.interceptors.response.use(
      (response) => response,
      async (error) => {
        try {
          await tokenResInterceptor(error);
        } catch (error) {
          /* if the server returned 'unauthorised', navigate user to login
               not for all errors */
          if (error.response.status === 401) {
            // remove user from context
            setUser(null);

            /* if there was an error in refreshing tokens,
                navigate the user to login page */
            router.push('/log-in');
          } else {
            /* reject other errors to be handled by the
                component calling this hook */
            return Promise.reject(error);
          }
        }
      }
    );

    return () => {
      privateAxios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return privateAxios;
};

export default usePrivateAxios;
