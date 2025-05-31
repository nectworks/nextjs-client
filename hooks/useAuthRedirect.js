'use client';

/*
  File: useAuthRedirect.js
  Description: Custom hook to handle automatic redirects for authenticated users
  who try to access login/signup pages. This prevents logged-in users from
  seeing authentication forms they don't need.
*/

import { useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { UserContext } from '@/context/User/UserContext';

export default function useAuthRedirect() {
  const { userState, authCheckComplete } = useContext(UserContext);
  const [user] = userState;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect after auth check is complete to avoid race conditions
    if (!authCheckComplete) return;

    // If user is logged in and on auth pages, redirect them away
    if (user && (pathname === '/log-in' || pathname === '/sign-up')) {
      console.log('User already logged in, redirecting to profile');
      
      // Check if there's a redirect location stored
      const redirectTo = typeof window !== 'undefined' 
        ? sessionStorage.getItem('redirectAfterLogin') || '/profile'
        : '/profile';
      
      // Clear the redirect location
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('redirectAfterLogin');
      }
      
      router.replace(redirectTo);
    }
  }, [user, pathname, authCheckComplete, router]);

  return { 
    user, 
    authCheckComplete,
    isAuthenticating: !authCheckComplete,
    isLoggedIn: !!user && authCheckComplete
  };
}