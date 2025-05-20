'use client';
/*
  File: userContext.js
  Description: This file contains the state for user and the userMode.
  Utilising react's context API this state is accessible in all components.
*/

import { createContext, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import {
  privateAxios,
  tokenResInterceptor,
} from '../../config/axiosInstance.js';
import { usePathname } from 'next/navigation';

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  // contains user information
  const [user, setUser] = useState(null);
  // maintains the usermode (i.e., professional or seeker)
  const [userMode, setUserMode] = useState('seeker');
  // is fetching the user
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  
  // Check if we're on the home/landing page - this must be after usePathname()
  const isHomePage = pathname === '/' || pathname === '/home';
  
  // Function to check if the user is logged in
  const checkCredentials = () => {
    setIsLoading(true);

    privateAxios
      .get('/authentication')
      .then((res) => {
        // the user is authenticated and save the data in context.
        if (res.status === 200) {
          setUser(res.data.user);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        // An error occurred during the request, user is not authenticated
        setUser(null);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    /* Since the context is out of the router, this can not
      utilise the `usePrivateAxios` hook */
    const customInterceptor = privateAxios.interceptors.response.use(
      (response) => response,
      tokenResInterceptor
    );
    checkCredentials();
    return () => {
      privateAxios.interceptors.response.eject(customInterceptor);
    };
  }, []);

  useEffect(() => {
    // Call checkCredentials only if the route is '/profile'
    if (pathname === '/profile') {
      checkCredentials();
    }
  }, [pathname]);

  useEffect(() => {
    /* whenever user state changes, update the usermode TODO: userMode is not persisted throught refresh. */
    setUserMode(!!user?.userDetails?.emailID ? 'professional' : 'seeker');
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        userState: [user, setUser],
        userModeState: [userMode, setUserMode],
      }}
    >
      {/* if the network request to authenticate the user is
      still ongoing, display the loader. */}
      {/* Skip showing the loader on the home page */}
      {isLoading && !isHomePage ? (
        <div className="authenticatingLoader">
          <ClipLoader size={50} />
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}