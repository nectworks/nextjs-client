'use client';
/*
    FileName - Page.js
    Desc - This file defines the HomePage component with a smart loading system
    that only displays the loader when necessary, avoiding showing it on refreshes
    when components are already cached.
*/

import { useState, useEffect } from 'react';
import Home from './(root)/home/Home';
import Header from './_components/Header/Header';
import Footer from './_components/Footer/Footer';
import LandingPageLoader from './_components/LandingPageLoader';

const LOADER_VERSION = '1.0'; // Change this when your components are updated

const HomePage = () => {
  // Start with null and determine if loader is needed after first render
  const [showLoader, setShowLoader] = useState(null);
  
  useEffect(() => {
    // Check if we've loaded the page before in this browser
    const previousLoad = localStorage.getItem('landing_page_loaded');
    const storedVersion = localStorage.getItem('landing_page_version');
    
    // Skip loader if already loaded the same version
    if (previousLoad === 'true' && storedVersion === LOADER_VERSION) {
      // Components were previously loaded successfully
      setShowLoader(false);
    } else {
      // First time visit or version changed - show loader
      setShowLoader(true);
    }
  }, []);
  
  // Handle load completion
  const handleLoadComplete = () => {
    // Mark as loaded in localStorage for future visits
    localStorage.setItem('landing_page_loaded', 'true');
    localStorage.setItem('landing_page_version', LOADER_VERSION);
    setShowLoader(false);
  };

  // If showLoader is null, we're still determining if loader is needed
  if (showLoader === null) {
    return (
      <>
        <Header />
        <div style={{ minHeight: '100vh' }}></div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      {/* Show our custom loader only if needed */}
      {showLoader && (
        <div className="lp-home-container">
          <LandingPageLoader onLoadComplete={handleLoadComplete} />
        </div>
      )}
      
      {/* Render Home with fade-in effect when loading is complete */}
      <div 
        style={{ 
          opacity: showLoader ? 0 : 1,
          transition: 'opacity 0.5s ease-in-out',
          visibility: showLoader ? 'hidden' : 'visible'
        }}
      >
        <Home />
      </div>
      
      <Footer />
    </>
  );
};

export default HomePage;