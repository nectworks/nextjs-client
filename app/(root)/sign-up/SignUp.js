'use client';
/*
  FileName - SignUp.js
  Desc - This file defines a React component (MainForm) responsible for rendering either a sign-in page or a sign-up form based on the width of the browser window. The component dynamically adapts its content based on the screen size to provide a responsive user experience.
*/

import { useState, useEffect } from 'react';
import SignUpDesktop from './SignUpDesktop';
import SignUpMobile from './SignUpMobile';

const SignUp = () => {
  // Initialize with a default value for SSR
  const [innerWidth, setInnerWidth] = useState(1024); // Default to desktop
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted
    setIsMounted(true);
    
    // Set initial width from window
    if (typeof window !== 'undefined') {
      setInnerWidth(window.innerWidth);
    }

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setInnerWidth(window.innerWidth);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div>{innerWidth > 950 ? <SignUpDesktop /> : <SignUpMobile />}</div>
    </>
  );
};

export default SignUp;