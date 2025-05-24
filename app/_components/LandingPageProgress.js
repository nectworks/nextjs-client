'use client';
/*
  FileName: LandingPageProgress.js
  Desc: Loading indicator specifically for the landing page that tracks component loading
  status and provides detailed feedback. This component is separate from the general
  ProgressBar used elsewhere in the application.
*/

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Logo from '@/public/nectworks-ssar04a-mil-11@2x.webp';
import './LandingPageProgress.css';

// Import components to preload (consider making these imports dynamic in production)
import TestimonialSection from '../components/TestimonialSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CTASection from '../components/CTASection';
import DataIntelligenceSection from '../components/DataIntelligenceSection';
import CompanySection from '../components/CompanySection';

const LandingPageProgress = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Loading...');
  const [components, setComponents] = useState({
    dataIntelligence: { loaded: false, error: null },
    howItWorks: { loaded: false, error: null },
    testimonials: { loaded: false, error: null },
    company: { loaded: false, error: null },
    cta: { loaded: false, error: null }
  });
  
  // Track retries to prevent infinite loops
  const retryCount = useRef({});
  const MAX_RETRIES = 2;
  
  // Track timeouts to ensure loading doesn't get stuck
  const timeoutIds = useRef([]);
  
  // Calculate real progress based on component loading status
  const calculateProgress = (componentStatus) => {
    const totalComponents = Object.keys(componentStatus).length;
    const loadedComponents = Object.values(componentStatus).filter(c => c.loaded).length;
    
    // Start at 5% and go to 95% based on component loading
    // Last 5% is reserved for final rendering
    return 5 + Math.floor((loadedComponents / totalComponents) * 90);
  };
  
  // Handle component load success
  const handleComponentLoaded = (componentName) => {
    setComponents(prev => ({
      ...prev,
      [componentName]: { loaded: true, error: null }
    }));
    setLoadingStatus(`Loaded ${formatComponentName(componentName)}...`);
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
  
  // Load a specific component
  const loadComponent = (componentName) => {
    setLoadingStatus(`Loading ${formatComponentName(componentName)}...`);
    
    // Set a timeout to prevent hanging indefinitely on a component
    const timeoutId = setTimeout(() => {
      // If still not loaded after timeout, consider it an error and move on
      if (!components[componentName].loaded) {
        handleComponentError(componentName, new Error('Loading timeout exceeded'));
      }
    }, 5000); // 5 second timeout per component
    
    timeoutIds.current.push(timeoutId);
    
    try {
      // In production, replace this with actual dynamic imports
      // For now, since components are already imported at the top, 
      // we'll simulate the loading with a timeout
      setTimeout(() => {
        // Get a reference to the component based on name
        let Component;
        switch(componentName) {
          case 'dataIntelligence':
            Component = DataIntelligenceSection;
            break;
          case 'howItWorks':
            Component = HowItWorksSection;
            break;  
          case 'testimonials':
            Component = TestimonialSection;
            break;
          case 'company':
            Component = CompanySection;
            break;
          case 'cta':
            Component = CTASection;
            break;
          default:
            throw new Error(`Unknown component: ${componentName}`);
        }
        
        // Verify the component loaded successfully
        if (Component) {
          handleComponentLoaded(componentName);
        } else {
          throw new Error(`Component ${componentName} loaded but is invalid`);
        }
      }, Math.random() * 500 + 300); // Random delay between 300-800ms for simulation
    } catch (error) {
      handleComponentError(componentName, error);
    }
  };
  
  // Check if all essential components are loaded
  const checkAllComponentsLoaded = () => {
    const essentialComponents = ['dataIntelligence', 'howItWorks', 'testimonials'];
    return essentialComponents.every(component => components[component].loaded);
  };
  
  // Initiate loading sequence
  useEffect(() => {
    // Set up the loading sequence
    const loadSequence = async () => {
      // Start with basic progress
      setProgress(5);
      
      // Load components in sequence (this could be parallelized as needed)
      const componentSequence = [
        'dataIntelligence',
        'howItWorks', 
        'testimonials',
        'company',
        'cta'
      ];
      
      // Start loading each component
      componentSequence.forEach((component, index) => {
        // Stagger the loading starts slightly for more realistic loading effect
        setTimeout(() => {
          loadComponent(component);
        }, index * 200);
      });
    };
    
    loadSequence();
    
    // Cleanup function
    return () => {
      // Clear all timeout ids
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
        // Move progress toward target in small increments
        if (current < calculatedProgress) {
          return current + 1;
        }
        return current;
      });
    };
    
    // Update progress at animation-friendly intervals
    const progressInterval = setInterval(updateProgress, 30);
    
    // Check if all components are loaded enough to show the page
    if (checkAllComponentsLoaded() && progress >= 90) {
      // Complete loading and notify parent component
      setLoadingStatus('Almost there...');
      
      // Add a small delay before completion for better UX
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
  );
};

export default LandingPageProgress;