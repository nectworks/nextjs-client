'use client';
/*
  File: userContext.js
  Description: This file contains the state for user and the userMode.
  Utilising react's context API this state is accessible in all components.
  Fixed version to prevent intermittent logout for new users.
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
  // Track if initial auth check is complete
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
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
    // Prevent multiple concurrent authentication checks
    if (!isInitialLoad && isLoading) {
      console.log('Authentication check already in progress, skipping...');
      return;
    }
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    if (isInitialLoad) {
      setIsLoading(true);
    }

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
          console.log('User authenticated successfully');
        }
        
        if (isInitialLoad) {
          setIsLoading(false);
          setAuthCheckComplete(true);
        }
      })
      .catch((err) => {
        // Only update state if component is still mounted and not aborted
        if (!isMountedRef.current || err.name === 'AbortError') return;
        
        console.log('Authentication check failed:', err.response?.status || err.message);
        
        // Only clear user state if this is an initial load or explicit auth failure (401/403)
        // Don't clear user state for network errors, 500 errors, etc.
        if (isInitialLoad || (err.response && [401, 403].includes(err.response.status))) {
          setUser(null);
        }
        
        if (isInitialLoad) {
          setIsLoading(false);
          setAuthCheckComplete(true);
        }
      });
      
    // Set a timeout to prevent infinite loading (only for initial load)
    if (isInitialLoad) {
      setTimeout(() => {
        if (isMountedRef.current && isLoading && !authCheckComplete) {
          console.warn('Authentication check timed out');
          setIsLoading(false);
          setAuthCheckComplete(true);
        }
      }, 10000); // 10 second timeout
    }
  };

  // Initial authentication check
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
      setAuthCheckComplete(true);
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

  // REMOVED: The problematic useEffect that was calling checkCredentials on pathname change
  // This was causing double authentication calls and race conditions
  
  // Optional: Add a function to manually refresh user data if needed
  const refreshUser = () => {
    if (authCheckComplete && !isLoading) {
      checkCredentials(false);
    }
  };

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

  // Add debug logging for user state changes (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('UserContext: User state changed:', user ? `User ID: ${user._id}` : 'User is null');
      if (!user && authCheckComplete) {
        console.log('UserContext: User cleared after auth check completion');
      }
    }
  }, [user, authCheckComplete]);

  return (
    <UserContext.Provider
      value={{
        userState: [user, setUser],
        userModeState: [userMode, setUserMode],
        refreshUser, // Expose refresh function if needed
        authCheckComplete, // Expose auth status
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