'use client';
/*
  File: UserContext.js (SSR-SAFE VERSION)
  Description: Completely SSR-safe user context that prevents all build errors
  while maintaining optimized performance.
*/

import { createContext, useEffect, useState, useRef } from 'react';
import {
  privateAxios,
  tokenResInterceptor,
} from '../../config/axiosInstance.js';
import { usePathname } from 'next/navigation';

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  // User state - starts as null (unknown)
  const [user, setUser] = useState(null);
  const [userMode, setUserMode] = useState('seeker');
  
  // Auth states - Start with safe defaults for SSR
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const pathname = usePathname();
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  
  // Pages that should render immediately without waiting for auth
  const publicPages = ['/', '/home', '/sign-up', '/log-in'];
  const isPublicPage = publicPages.includes(pathname);
  
  // SSR-SAFE: Helper function to safely access sessionStorage
  const safeSessionStorage = {
    getItem: (key) => {
      if (typeof window === 'undefined') return null;
      try {
        return sessionStorage.getItem(key);
      } catch (error) {
        console.warn('Error accessing sessionStorage:', error);
        return null;
      }
    },
    setItem: (key, value) => {
      if (typeof window === 'undefined') return;
      try {
        sessionStorage.setItem(key, value);
      } catch (error) {
        console.warn('Error setting sessionStorage:', error);
      }
    },
    removeItem: (key) => {
      if (typeof window === 'undefined') return;
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.warn('Error removing from sessionStorage:', error);
      }
    }
  };
  
  // OPTIMIZED: Fast auth check function
  const checkCredentials = async (isBackground = false) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      const res = await privateAxios.get('/authentication', {
        signal: abortControllerRef.current.signal,
        timeout: 3000, // OPTIMIZED: Shorter timeout
      });
      
      if (!isMountedRef.current) return;
      
      if (res.status === 200) {
        setUser(res.data.user);
        
        // Store successful auth in sessionStorage for faster subsequent loads
        safeSessionStorage.setItem('auth_status', 'authenticated');
        safeSessionStorage.setItem('user_data', JSON.stringify(res.data.user));
      }
      
      setAuthCheckComplete(true);
      setIsInitialLoad(false);
      
    } catch (err) {
      if (!isMountedRef.current || err.name === 'AbortError') return;
      
      // Clear any cached auth status on auth failure
      safeSessionStorage.removeItem('auth_status');
      safeSessionStorage.removeItem('user_data');
      
      // Only clear user on explicit auth failures, not network errors
      if (err.response && [401, 403].includes(err.response.status)) {
        setUser(null);
      }
      
      setAuthCheckComplete(true);
      setIsInitialLoad(false);
    }
  };

  // OPTIMIZED: Check for cached auth state first (CLIENT-SIDE ONLY)
  const loadCachedAuthState = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const authStatus = safeSessionStorage.getItem('auth_status');
      const userData = safeSessionStorage.getItem('user_data');
      
      if (authStatus === 'authenticated' && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        return true; // Found cached auth
      }
    } catch (error) {
      console.warn('Error loading cached auth state:', error);
      // Clear invalid cache
      safeSessionStorage.removeItem('auth_status');
      safeSessionStorage.removeItem('user_data');
    }
    
    return false;
  };

  // SSR-SAFE: Initialize auth state only on client side
  useEffect(() => {
    setIsMounted(true);
    isMountedRef.current = true;
    
    // Set up axios interceptor
    const customInterceptor = privateAxios.interceptors.response.use(
      (response) => response,
      tokenResInterceptor
    );
    
    // OPTIMIZED: Check cache first for instant loading (CLIENT-SIDE ONLY)
    const hasCachedAuth = loadCachedAuthState();
    
    if (hasCachedAuth) {
      // If we have cached auth, mark as complete immediately for better UX
      setAuthCheckComplete(true);
      setIsInitialLoad(false);
      
      // Still verify in background, but don't block UI
      setTimeout(() => {
        checkCredentials(true);
      }, 100);
    } else {
      // No cached auth, check immediately but don't block public pages
      if (isPublicPage) {
        // For public pages, set auth as complete immediately and check in background
        setAuthCheckComplete(true);
        setIsInitialLoad(false);
        
        // Background auth check
        setTimeout(() => {
          checkCredentials(true);
        }, 50);
      } else {
        // For protected pages, check auth immediately
        checkCredentials(false);
      }
    }
    
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      privateAxios.interceptors.response.eject(customInterceptor);
    };
  }, []); // Empty dependency array to run only once

  // Update user mode when user changes
  useEffect(() => {
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

  // Manual refresh function
  const refreshUser = () => {
    if (isMounted && !isInitialLoad) {
      checkCredentials(false);
    }
  };

  // SSR-SAFE: Don't render context until mounted on client
  if (!isMounted) {
    // Return a safe default context during SSR
    return (
      <UserContext.Provider
        value={{
          userState: [null, () => {}],
          userModeState: ['seeker', () => {}],
          refreshUser: () => {},
          authCheckComplete: false,
          isInitialLoad: true,
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }

  return (
    <UserContext.Provider
      value={{
        userState: [user, setUser],
        userModeState: [userMode, setUserMode],
        refreshUser,
        authCheckComplete,
        isInitialLoad,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}