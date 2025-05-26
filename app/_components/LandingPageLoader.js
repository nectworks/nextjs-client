'use client';
/*
  FileName - LandingPageLoader.js
  Desc - This component manages the loading process for the Home component
  with intelligent loading detection to avoid unnecessary loading on refreshes.
*/

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Logo from '@/public/nectworks-ssar04a-mil-11@2x.webp';
import './LandingPageProgress.css';

  const LandingPageLoader = ({ onLoadComplete }) => {
    const [progress, setProgress] = useState(0);
    const phrases = [
    "Vibing up your referrals...",
    "Zero spam. All glow-ups ✨",
    "Referrals, but make it aesthetic 💼",
    "Quiet hustle loading 🔇",
    "Smart connects on the way 🔗",
    "Magic referrals incoming 🧙"
  ];

  const [loadingStatus, setLoadingStatus] = useState(phrases[0]);
  const statusIndex = useRef(0);
  
  // Component loading statuses
  const [components, setComponents] = useState({
    heroSection: { loaded: false, error: null },
    dataIntelligence: { loaded: false, error: null },
    howItWorks: { loaded: false, error: null },
    testimonials: { loaded: false, error: null },
  });
  
  // References for tracking
  const retryCount = useRef({});
  const MAX_RETRIES = 2;
  const timeoutIds = useRef([]);
  const isFirstLoad = useRef(true);
  
  // Calculate progress based on component loading status
  const calculateProgress = (componentStatus) => {
    const totalComponents = Object.keys(componentStatus).length;
    const loadedComponents = Object.values(componentStatus).filter(c => c.loaded).length;
    return 5 + Math.floor((loadedComponents / totalComponents) * 90);
  };
  
  // Handle component load success
  const handleComponentLoaded = (componentName) => {
    setComponents(prev => ({
      ...prev,
      [componentName]: { loaded: true, error: null }
    }));
    
    // Save component load status to session storage
    sessionStorage.setItem(`component_${componentName}_loaded`, 'true');
    
    //setLoadingStatus(`Loaded ${formatComponentName(componentName)}...`);
  };
  
  // Handle component load failure
  const handleComponentError = (componentName, error) => {
    console.error(`Error loading ${componentName}:`, error);
    
    // Retry logic for failed components
    const currentRetries = retryCount.current[componentName] || 0;
    
    if (currentRetries < MAX_RETRIES) {
      retryCount.current[componentName] = currentRetries + 1;
      setLoadingStatus(`Retrying ${formatComponentName(componentName)}...`);
      
      // Retry loading after a short delay
      setTimeout(() => {
        loadComponent(componentName);
      }, 1000);
    } else {
      // Max retries exceeded, mark as failed but continue with other components
      setComponents(prev => ({
        ...prev,
        [componentName]: { loaded: false, error: error.message || 'Failed to load' }
      }));
      setLoadingStatus(`Failed to load ${formatComponentName(componentName)}. Continuing...`);
    }
  };
  
  // Format component name for display
  const formatComponentName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  };
  
  // Check if component is already loaded/cached
  const isComponentCached = (componentName) => {
    // Check session storage for this component
    return sessionStorage.getItem(`component_${componentName}_loaded`) === 'true';
  };
  
  // Simulate/check loading of components
  const loadComponent = (componentName) => {
    // If component is already loaded/cached, mark it immediately
    if (isComponentCached(componentName)) {
      handleComponentLoaded(componentName);
      return;
    }
    
    //setLoadingStatus(`Loading ${formatComponentName(componentName)}...`);
    
    // Set a timeout to prevent hanging indefinitely on a component
    const timeoutId = setTimeout(() => {
      if (!components[componentName].loaded) {
        handleComponentError(componentName, new Error('Loading timeout exceeded'));
      }
    }, 5000);
    
    timeoutIds.current.push(timeoutId);
    
    try {
      // In production, check if component exists in DOM or is available to import
      // Here we'll simulate loading with setTimeout
      
      // Use shorter loading times for better UX on refreshes
      const loadingTime = isFirstLoad.current ? 
        Math.random() * 800 + 400 : // First load: 400-1200ms
        Math.random() * 200 + 100;  // Subsequent loads: 100-300ms
        
      setTimeout(() => {
        // Verify the component is available (in real implementation, check DOM or imports)
        handleComponentLoaded(componentName);
      }, loadingTime);
    } catch (error) {
      handleComponentError(componentName, error);
    }
  };
  
  // Check if all critical components are loaded
  const checkEssentialComponentsLoaded = () => {
    // Define your critical components
    const essentialComponents = ['heroSection', 'dataIntelligence', 'testimonials'];
    return essentialComponents.every(component => components[component].loaded);
  };
  
  // Quickly check if all components are already cached
  const checkAllComponentsCached = () => {
    return Object.keys(components).every(component => isComponentCached(component));
  };
  
  // Start loading process
  useEffect(() => {
    // Check if all components are already cached
    // If so, complete loading quickly
    if (checkAllComponentsCached()) {
      setLoadingStatus('Components already loaded');
      
      // Mark all components as loaded
      const updatedComponents = {};
      Object.keys(components).forEach(component => {
        updatedComponents[component] = { loaded: true, error: null };
      });
      setComponents(updatedComponents);
      
      // Skip long loading process
      setTimeout(() => {
        setProgress(100);
        onLoadComplete();
      }, 500);
      
      return;
    }
    
    // Set initial progress
    setProgress(5);
    
    // Define component loading sequence
    const componentSequence = [
      'heroSection',
      'dataIntelligence',
      'testimonials',
      'howItWorks',
    ];
    
    // Start loading each component with a slight delay between starts
    componentSequence.forEach((component, index) => {
      setTimeout(() => {
        loadComponent(component);
      }, index * 200);
    });
    
    // Safety timeout - if loading takes too long, complete anyway
    const safetyTimeout = setTimeout(() => {
      onLoadComplete();
    }, 8000); // 8 seconds max loading time
    
    timeoutIds.current.push(safetyTimeout);
    
    // Mark as not first load for subsequent loads
    isFirstLoad.current = false;
    
    // Rotate status message every 2 seconds
    const statusInterval = setInterval(() => {
      statusIndex.current = (statusIndex.current + 1) % phrases.length;
      setLoadingStatus(phrases[statusIndex.current]);
    }, 2000);

    timeoutIds.current.push(statusInterval);

    return () => {
      // Clean up all timeouts
      timeoutIds.current.forEach(id => clearTimeout(id));
    };
  }, []);
  
  // Update progress based on component loading status
  useEffect(() => {
    // Calculate real progress based on component loading
    const calculatedProgress = calculateProgress(components);
    
    // Use intermediate steps to create smoother animation
    const updateProgress = () => {
      setProgress(current => {
        if (current < calculatedProgress) {
          return current + 1;
        }
        return current;
      });
    };
    
    const progressInterval = setInterval(updateProgress, 30);
    
    // Check if all components are loaded enough to show the page
    if (checkEssentialComponentsLoaded() && progress >= 85) {
      // Complete loading and notify parent component
      setLoadingStatus('Almost there...');
      
      setTimeout(() => {
        setProgress(100);
        setLoadingStatus('Ready!');
        
        // Wait for animation to complete before notifying parent
        setTimeout(() => {
          if (onLoadComplete) onLoadComplete();
        }, 500);
      }, 800);
      
      clearInterval(progressInterval);
    }
    
    return () => clearInterval(progressInterval);
  }, [components, progress, onLoadComplete]);
  
  return (
    <div className="lp-progress-overlay">
      <div className="lp-progress-content">
        <Image src={Logo} alt="Nectworks" className="lp-progress-logo" priority />
        <div className="lp-progress-container">
          <div className="lp-progress" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="lp-loading-status">{loadingStatus}</div>
        
        {/* Show error summary if any component failed to load */}
        {Object.entries(components).some(([_, status]) => status.error) && (
          <div className="lp-loading-errors">
            <p>Some components failed to load. The page may have limited functionality.</p>
            {Object.entries(components)
              .filter(([_, status]) => status.error)
              .map(([name, status]) => (
                <div key={name} className="lp-error-item">
                  {formatComponentName(name)}: {status.error}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPageLoader;