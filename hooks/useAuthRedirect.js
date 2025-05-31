'use client';

/*
  File: useAuthRedirect.js (OPTIMIZED)
  Description: Non-blocking auth redirect hook that allows immediate rendering
  while handling redirects in the background for better UX.
*/

import { useContext, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserContext } from '@/context/User/UserContext';

export default function useAuthRedirect() {
  const { userState, authCheckComplete, isInitialLoad } = useContext(UserContext);
  const [user] = userState;
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // OPTIMIZED: Only redirect if auth check is complete AND we haven't redirected yet
    if (!authCheckComplete || hasRedirected.current) return;

    // If user is logged in and on auth pages, redirect them away
    if (user && (pathname === '/log-in' || pathname === '/sign-up')) {
      hasRedirected.current = true;
      
      console.log('User already logged in, redirecting to profile');
      
      // Check for redirect location
      let redirectTo = '/profile';
      
      if (typeof window !== 'undefined') {
        const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
        if (storedRedirect) {
          redirectTo = storedRedirect;
          sessionStorage.removeItem('redirectAfterLogin');
        }
      }
      
      // Use replace to avoid back button issues
      router.replace(redirectTo);
    }
  }, [user, pathname, authCheckComplete, router]);

  // Store redirect location for post-login navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const from = urlParams.get('from');
      if (from) {
        sessionStorage.setItem('redirectAfterLogin', from);
      }
    }
  }, []);

  // OPTIMIZED: Return state that allows immediate rendering
  return { 
    user, 
    authCheckComplete,
    isInitialLoad,
    isLoggedIn: !!user,
    // OPTIMIZED: Never return isAuthenticating as true for public pages
    shouldShowAuthPage: pathname === '/log-in' || pathname === '/sign-up',
  };
}