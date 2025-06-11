'use client';
/*
  File: SignUp.js (OPTIMIZED)
  Description: Fast-loading signup wrapper that renders immediately while
  handling auth redirects in the background for optimal user experience.
*/

import { useState, useEffect } from 'react';
import SignUpDesktop from './SignUpDesktop';
import SignUpMobile from './SignUpMobile';
import useAuthRedirect from '@/hooks/useAuthRedirect';

const SignUp = () => {
  // OPTIMIZED: Non-blocking auth redirect
  const { user: redirectUser, shouldShowAuthPage } = useAuthRedirect();
  
  // Screen size detection with SSR-safe initialization
  const [innerWidth, setInnerWidth] = useState(1024); // Default to desktop for SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark as mounted and set actual window width
    setIsMounted(true);
    
    if (typeof window !== 'undefined') {
      setInnerWidth(window.innerWidth);
      
      const handleResize = () => {
        setInnerWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  // OPTIMIZED: Render immediately without waiting for auth checks
  // The auth redirect will happen in the background if user is already logged in
  
  if (!isMounted) {
    // SSR/hydration-safe initial render
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <SignUpDesktop />
      </div>
    );
  }

  return (
    <div>
      {innerWidth > 950 ? <SignUpDesktop /> : <SignUpMobile />}
    </div>
  );
};

export default SignUp;