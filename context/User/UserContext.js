'use client';
/*
  File: userContext.js
  Description: This file contains the state for user and the userMode.
  Utilising react's context API this state is accessible in all components.
  Fixed version to prevent intermittent logout for new users.

  Fixed version with consistent authentication across all pages
  and cross-tab synchronization
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
  const [user, setUser] = useState(null);
  const [userMode, setUserMode] = useState('seeker');
  const [isLoading, setIsLoading] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  const pathname = usePathname();
  
  // Ref to track and cancel ongoing requests
  const abortControllerRef = useRef(null);
  // Ref to track if component is mounted
  const isMountedRef = useRef(true);
  
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
          
          // Set flag in localStorage for cross-tab communication
          if (typeof window !== 'undefined') {
            localStorage.setItem('userAuthenticated', 'true');
            localStorage.setItem('lastAuthCheck', Date.now().toString());
          }
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
        
        // Clear user state for auth failures (401/403) or initial load
        if (isInitialLoad || (err.response && [401, 403].includes(err.response.status))) {
          setUser(null);
          
          // Clear auth flags in localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('userAuthenticated');
            localStorage.removeItem('lastAuthCheck');
          }
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

  // Function to handle logout across tabs
  const handleLogout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userAuthenticated');
      localStorage.removeItem('lastAuthCheck');
      // Trigger storage event for other tabs
      localStorage.setItem('userLoggedOut', Date.now().toString());
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
    
    // ALWAYS check credentials on initial load for consistency
    checkCredentials(true);
    
    return () => {
      isMountedRef.current = false;
      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      privateAxios.interceptors.response.eject(customInterceptor);
    };
  }, []);

  // Cross-tab authentication synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e) => {
      // Handle logout across tabs
      if (e.key === 'userLoggedOut') {
        setUser(null);
      }
      
      // Handle login across tabs
      if (e.key === 'userAuthenticated' && e.newValue === 'true' && !user) {
        // Check credentials to sync the new login
        checkCredentials(false);
      }
      
      // Handle authentication state removed from another tab
      if (e.key === 'userAuthenticated' && e.newValue === null && user) {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

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

  // Expose logout function for components to use
  const logout = () => {
    handleLogout();
  };

  return (
    <UserContext.Provider
      value={{
        userState: [user, setUser],
        userModeState: [userMode, setUserMode],
        refreshUser,
        authCheckComplete,
        logout, // Expose logout function
      }}
    >
      {/* Only show loader on initial load, not for every page */}
      {isLoading ? (
        <div className="authenticatingLoader">
          <ClipLoader size={50} />
        </div>
      ) : (
        children
      )}
    </UserContext.Provider>
  );
}