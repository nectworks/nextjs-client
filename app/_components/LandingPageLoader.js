'use client';
/*
  File: LandingPageLoader.js
  Description: Optimized loading component with intelligent caching and faster load times.
  Provides smooth loading experience while avoiding SSR issues.
*/

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Logo from '@/public/nectworks-ssar04a-mil-11@2x.webp';
import './LandingPageProgress.css';

const LandingPageLoader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const phrases = [
    "Whooosh... ✨",
    "Loading awesome features 🚀",
    "Almost ready to connect 🔗",
    "Preparing your dashboard 📊",
    "Final touches loading 🎨"
  ];

  const [loadingStatus, setLoadingStatus] = useState(phrases[0]);
  const statusIndex = useRef(0);
  const startTime = useRef(null);
  const timeoutIds = useRef([]);
  
  // OPTIMIZED: Faster loading detection
  const [componentsReady, setComponentsReady] = useState({
    hero: false,
    dataIntelligence: false,
    testimonials: false,
    features: false,
  });
  
  // Check if we should use fast loading (return visitor)
  const shouldUseFastLoading = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      // Check if user has visited recently
      const lastVisit = sessionStorage.getItem('lastHomePageVisit');
      const authStatus = sessionStorage.getItem('auth_status');
      
      if (lastVisit) {
        const timeDiff = Date.now() - parseInt(lastVisit);
        // If visited within last 5 minutes, use fast loading
        return timeDiff < 5 * 60 * 1000;
      }
      
      // If auth is cached, use fast loading
      return !!authStatus;
    } catch (error) {
      return false;
    }
  };
  
  // Simulate component loading with realistic timing
  const simulateComponentLoading = (componentName, baseDelay = 200) => {
    const isFastLoad = shouldUseFastLoading();
    const delay = isFastLoad ? baseDelay * 0.3 : baseDelay;
    
    const timeoutId = setTimeout(() => {
      setComponentsReady(prev => ({
        ...prev,
        [componentName]: true
      }));
    }, delay + Math.random() * 100);
    
    timeoutIds.current.push(timeoutId);
  };
  
  // Calculate progress based on loaded components
  const calculateProgress = () => {
    const totalComponents = Object.keys(componentsReady).length;
    const loadedComponents = Object.values(componentsReady).filter(Boolean).length;
    
    // Minimum progress of 10%, max of 95%
    return 10 + Math.floor((loadedComponents / totalComponents) * 85);
  };
  
  // Check if enough components are loaded to proceed
  const canProceed = () => {
    const criticalComponents = ['hero', 'dataIntelligence'];
    return criticalComponents.every(component => componentsReady[component]);
  };
  
  // Start loading process
  useEffect(() => {
    startTime.current = Date.now();
    
    // Check for fast loading conditions
    const isFastLoad = shouldUseFastLoading();
    
    if (isFastLoad) {
      // Fast loading for return visitors
      setLoadingStatus("Welcome back! Loading...");
      setProgress(30);
      
      // Simulate very fast component loading
      simulateComponentLoading('hero', 50);
      simulateComponentLoading('dataIntelligence', 100);
      simulateComponentLoading('testimonials', 150);
      simulateComponentLoading('features', 200);
      
    } else {
      // Normal loading for first-time visitors
      setProgress(5);
      
      // Stagger component loading
      simulateComponentLoading('hero', 200);
      simulateComponentLoading('dataIntelligence', 400);
      simulateComponentLoading('testimonials', 600);
      simulateComponentLoading('features', 800);
    }
    
    // Update status message periodically
    const statusInterval = setInterval(() => {
      statusIndex.current = (statusIndex.current + 1) % phrases.length;
      setLoadingStatus(phrases[statusIndex.current]);
    }, 1500);
    
    timeoutIds.current.push(statusInterval);
    
    // Safety timeout to prevent infinite loading
    const safetyTimeout = setTimeout(() => {
      if (!isComplete) {
        console.warn('Loading timeout reached, completing anyway');
        completeLoading();
      }
    }, isFastLoad ? 2000 : 5000);
    
    timeoutIds.current.push(safetyTimeout);
    
    // Mark visit time for fast loading next time
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lastHomePageVisit', Date.now().toString());
    }
    
    return () => {
      timeoutIds.current.forEach(id => clearTimeout(id));
    };
  }, []);
  
  // Update progress when components load
  useEffect(() => {
    const newProgress = calculateProgress();
    
    // Smooth progress updates
    const progressTimer = setInterval(() => {
      setProgress(current => {
        if (current < newProgress) {
          return current + 1;
        }
        clearInterval(progressTimer);
        return current;
      });
    }, 20);
    
    // Check if we can complete loading
    if (canProceed() && newProgress >= 80) {
      const elapsedTime = Date.now() - (startTime.current || Date.now());
      const minLoadTime = shouldUseFastLoading() ? 800 : 1500;
      
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);
      
      const completionTimeout = setTimeout(() => {
        completeLoading();
      }, remainingTime);
      
      timeoutIds.current.push(completionTimeout);
    }
    
    return () => clearInterval(progressTimer);
  }, [componentsReady]);
  
  // Complete the loading process
  const completeLoading = () => {
    if (isComplete) return;
    
    setIsComplete(true);
    setLoadingStatus("Ready! 🎉");
    
    // Animate to 100%
    const finalAnimation = setInterval(() => {
      setProgress(current => {
        if (current >= 100) {
          clearInterval(finalAnimation);
          
          // Small delay before notifying parent
          setTimeout(() => {
            if (onLoadComplete) {
              onLoadComplete();
            }
          }, 300);
          
          return 100;
        }
        return current + 2;
      });
    }, 30);
  };
  
  return (
    <div className="lp-progress-overlay">
      <div className="lp-progress-content">
        <Image 
          src={Logo} 
          alt="Nectworks" 
          className="lp-progress-logo" 
          priority
          width={120}
          height={40}
        />
        
        <div className="lp-progress-container">
          <div 
            className="lp-progress" 
            style={{ 
              width: `${progress}%`,
              transition: 'width 0.3s ease-out'
            }}
          />
        </div>
        
        <div className="lp-loading-status">
          {loadingStatus}
        </div>
        
        <div className="lp-progress-percentage">
          {Math.round(progress)}%
        </div>
        
        {/* Component loading indicators */}
        <div className="lp-component-indicators">
          {Object.entries(componentsReady).map(([component, isReady]) => (
            <div 
              key={component}
              className={`lp-component-dot ${isReady ? 'loaded' : 'loading'}`}
              title={`${component} ${isReady ? 'loaded' : 'loading'}`}
            />
          ))}
        </div>
        
        {/* Performance info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="lp-debug-info">
            <small>
              Fast Load: {shouldUseFastLoading() ? 'Yes' : 'No'} | 
              Components: {Object.values(componentsReady).filter(Boolean).length}/{Object.keys(componentsReady).length}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPageLoader;