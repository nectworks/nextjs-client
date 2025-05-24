'use client';
/*
  File: userContext.js
  Description: This file contains the state for user and the userMode.
  Utilising react's context API this state is accessible in all components.
*/

import { createContext, useEffect, useState, useRef } from 'react';
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
  
  // Ref to track and cancel ongoing requests
  const abortControllerRef = useRef(null);
  // Ref to track if component is mounted
  const isMountedRef = useRef(true);
  
  // Check if we're on the home/landing page
  const isHomePage = pathname === '/' || pathname === '/home';
  
  // Pages that don't need authentication check
  const publicPages = ['/', '/home', '/sign-up', '/log-in'];
  const isPublicPage = publicPages.includes(pathname);
  
  // Function to check if the user is logged in
  const checkCredentials = (isInitialLoad = false) => {
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);

    privateAxios
      .get('/authentication', {
        signal: abortControllerRef.current.signal
      })
      .then((res) => {
        // Only update state if component is still mounted
        if (!isMountedRef.current) return;
        
        // the user is authenticated and save the data in context.
        if (res.status === 200) {
          setUser(res.data.user);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        // Only update state if component is still mounted and not aborted
        if (!isMountedRef.current || err.name === 'AbortError') return;
        
        // An error occurred during the request, user is not authenticated
        setUser(null);
        setIsLoading(false);
      });
      
    // Set a timeout to prevent infinite loading
    setTimeout(() => {
      if (isMountedRef.current && isLoading) {
        console.warn('Authentication check timed out');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout
  };

  useEffect(() => {
    isMountedRef.current = true;
    
    /* Since the context is out of the router, this can not
      utilise the `usePrivateAxios` hook */
    const customInterceptor = privateAxios.interceptors.response.use(
      (response) => response,
      tokenResInterceptor
    );
    
    // Only check credentials on initial load for non-public pages
    // or if we need to verify existing authentication
    if (!isPublicPage || localStorage.getItem('authToken')) {
      checkCredentials(true);
    } else {
      // For public pages without auth token, skip the check
      setIsLoading(false);
    }
    
    return () => {
      isMountedRef.current = false;
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      privateAxios.interceptors.response.eject(customInterceptor);
    };
  }, []);

  useEffect(() => {
    // Call checkCredentials only if the route is '/profile' or other protected routes
    if (pathname === '/profile') {
      checkCredentials();
    }
  }, [pathname]);

  useEffect(() => {
    /* whenever user state changes, update the usermode */
    setUserMode(!!user?.userDetails?.emailID ? 'professional' : 'seeker');
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        userState: [user, setUser],
        userModeState: [userMode, setUserMode],
      }}
    >
      {/* Show loader only for protected pages and when actually loading */}
      {isLoading && !isPublicPage ? (
        <div className="authenticatingLoader">
          <ClipLoader size={50} />
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}