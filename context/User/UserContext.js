'use client';
/*
  File: UserContext.js (ENHANCED FOR RELIABILITY)
  Description: Completely SSR-safe user context with improved state management
  and better handling of auth transitions to fix Google One Tap issues.
*/

import { createContext, useEffect, useState, useRef } from 'react';
import {
  privateAxios,
  tokenResInterceptor,
} from '../../config/axiosInstance.js';
import { usePathname } from 'next/navigation';
import { safeSessionStorage, safeCookies, authStorage } from '@/Utils/browserUtils.js';

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
  const authCheckTimeoutRef = useRef(null);
  
  // ENHANCED: Track authentication verification attempts
  const authVerifyAttempts = useRef(0);
  const MAX_AUTH_VERIFY_ATTEMPTS = 2;
  
  // Pages that should render immediately without waiting for auth
  const publicPages = ['/', '/home', '/sign-up', '/log-in'];
  const isPublicPage = publicPages.includes(pathname);
  
  // OPTIMIZED: Fast auth check function with better error handling
  const checkCredentials = async (isBackground = false) => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Increment verification attempts
    authVerifyAttempts.current += 1;
    
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
        
        // ENHANCED: Reset attempts counter on success
        authVerifyAttempts.current = 0;
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
      
      // ENHANCED: Handle network errors more gracefully
      if (!err.response) {
        console.warn('Network error during auth check:', err.message);
        
        // If we're on a public page, still mark auth as complete
        if (isPublicPage) {
          setAuthCheckComplete(true);
        } 
        // If we've exceeded max retries, mark as complete
        else if (authVerifyAttempts.current >= MAX_AUTH_VERIFY_ATTEMPTS) {
          console.warn(`Auth check failed after ${authVerifyAttempts.current} attempts. Proceeding anyway.`);
          setAuthCheckComplete(true);
        }
        // Otherwise, retry with exponential backoff (if not already at max attempts)
        else if (authVerifyAttempts.current < MAX_AUTH_VERIFY_ATTEMPTS && isMountedRef.current) {
          const retryDelay = Math.min(1000 * (2 ** (authVerifyAttempts.current - 1)), 5000);
          authCheckTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              checkCredentials(isBackground);
            }
          }, retryDelay);
          
          return; // Don't mark as complete yet, we're retrying
        }
      } else {
        // For standard HTTP errors, mark check as complete
        setAuthCheckComplete(true);
      }
      
      setIsInitialLoad(false);
    }
  };

  // OPTIMIZED: Check for cached auth state first (CLIENT-SIDE ONLY)
  const loadCachedAuthState = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      // ENHANCED: Check cookies first as they're most reliable
      const hasAccessCookie = !!safeCookies.get('access');
      
      if (hasAccessCookie) {
        // Cookie exists, but we still need user data
        const userData = safeSessionStorage.getItem('user_data');
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          return true; // Found cached auth
        }
      }
      
      // If no cookie or missing user data, fall back to session storage check
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
    
    // ENHANCED: Set up a periodic background auth check every 5 minutes
    // This helps keep the auth state fresh and prevents issues with expired tokens
    const authRefreshInterval = setInterval(() => {
      if (isMountedRef.current && user) {
        // Only refresh if we have a user (we're logged in)
        checkCredentials(true);
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => {
      isMountedRef.current = false;
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      if (authCheckTimeoutRef.current) {
        clearTimeout(authCheckTimeoutRef.current);
      }
      
      clearInterval(authRefreshInterval);
      privateAxios.interceptors.response.eject(customInterceptor);
    };
  }, []); // Empty dependency array to run only once

  // Update user mode when user changes
  useEffect(() => {
    setUserMode(!!user?.userDetails?.emailID ? 'professional' : 'seeker');
    
    // ENHANCED: When user changes, update Google One Tap state
    if (user) {
      // If user is authenticated, clear Google One Tap state
      // This prevents Google One Tap from showing after login
      if (typeof window !== 'undefined') {
        try {
          safeSessionStorage.setItem('googleOneTapAttempted', 'true');
        } catch (error) {
          console.warn('Error updating Google One Tap state:', error);
        }
      }
    }
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      if (authCheckTimeoutRef.current) {
        clearTimeout(authCheckTimeoutRef.current);
      }
    };
  }, []);

  // Manual refresh function
  const refreshUser = () => {
    if (isMounted && !isInitialLoad) {
      // Reset attempt counter when manually refreshing
      authVerifyAttempts.current = 0;
      checkCredentials(false);
    }
  };
  
  // ENHANCED: Add function to clear user state (useful for logout)
  const clearUser = () => {
    setUser(null);
    safeSessionStorage.removeItem('auth_status');
    safeSessionStorage.removeItem('user_data');
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
          clearUser: () => {},
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
        clearUser,
        authCheckComplete,
        isInitialLoad,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}