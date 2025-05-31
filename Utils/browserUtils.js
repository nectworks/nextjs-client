/*
  File: utils/browserUtils.js
  Description: SSR-safe utilities for browser API access
*/

// SSR-safe localStorage wrapper
export const safeLocalStorage = {
    getItem: (key) => {
      if (typeof window === 'undefined') return null;
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.warn('Error accessing localStorage:', error);
        return null;
      }
    },
    
    setItem: (key, value) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.warn('Error setting localStorage:', error);
      }
    },
    
    removeItem: (key) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('Error removing from localStorage:', error);
      }
    }
  };
  
  // SSR-safe sessionStorage wrapper
  export const safeSessionStorage = {
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
  
  // SSR-safe window object access
  export const safeWindow = {
    isClient: typeof window !== 'undefined',
    
    addEventListener: (event, callback, options) => {
      if (typeof window === 'undefined') return;
      window.addEventListener(event, callback, options);
    },
    
    removeEventListener: (event, callback, options) => {
      if (typeof window === 'undefined') return;
      window.removeEventListener(event, callback, options);
    },
    
    scroll: (options) => {
      if (typeof window === 'undefined') return;
      window.scroll(options);
    },
    
    location: {
      get href() {
        return typeof window !== 'undefined' ? window.location.href : '';
      },
      get search() {
        return typeof window !== 'undefined' ? window.location.search : '';
      },
      get pathname() {
        return typeof window !== 'undefined' ? window.location.pathname : '';
      }
    }
  };
  
  // SSR-safe document access
  export const safeDocument = {
    querySelector: (selector) => {
      if (typeof document === 'undefined') return null;
      return document.querySelector(selector);
    },
    
    querySelectorAll: (selector) => {
      if (typeof document === 'undefined') return [];
      return document.querySelectorAll(selector);
    },
    
    getElementById: (id) => {
      if (typeof document === 'undefined') return null;
      return document.getElementById(id);
    },
    
    createElement: (tag) => {
      if (typeof document === 'undefined') return null;
      return document.createElement(tag);
    },
    
    get body() {
      return typeof document !== 'undefined' ? document.body : null;
    }
  };
  
  // Hook for client-side only operations
  export const useClientSide = (callback, deps = []) => {
    const { useEffect } = require('react');
    
    useEffect(() => {
      if (typeof window !== 'undefined') {
        callback();
      }
    }, deps);
  };
  
  // HOC for client-side only components
  export const withClientSide = (Component, fallback = null) => {
    return function ClientSideComponent(props) {
      const { useState, useEffect } = require('react');
      const [isMounted, setIsMounted] = useState(false);
  
      useEffect(() => {
        setIsMounted(true);
      }, []);
  
      if (!isMounted) {
        return fallback;
      }
  
      return <Component {...props} />;
    };
  };