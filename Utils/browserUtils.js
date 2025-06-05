/*
  File: utils/browserUtils.js
  Description: SSR-safe utilities for browser API access with enhanced storage pattern
*/

// SSR-safe localStorage wrapper with better error handling
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
      return true;
    } catch (error) {
      console.warn('Error setting localStorage:', error);
      return false;
    }
  },
  
  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
      return false;
    }
  },
  
  // New method to check if storage is available
  isAvailable: () => {
    if (typeof window === 'undefined') return false;
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }
};

// SSR-safe sessionStorage wrapper with enhanced functionality
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
      return true;
    } catch (error) {
      console.warn('Error setting sessionStorage:', error);
      return false;
    }
  },
  
  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Error removing from sessionStorage:', error);
      return false;
    }
  },
  
  // New method to check if storage is available
  isAvailable: () => {
    if (typeof window === 'undefined') return false;
    try {
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, testKey);
      sessionStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },
  
  // Get an item with an expiration check
  getItemWithExpiry: (key) => {
    if (typeof window === 'undefined') return null;
    try {
      const itemStr = sessionStorage.getItem(key);
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      const now = new Date().getTime();
      
      // Check if the item has expired
      if (item.expiry && now > item.expiry) {
        sessionStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.warn('Error accessing sessionStorage with expiry:', error);
      return null;
    }
  },
  
  // Set an item with an expiration time in milliseconds
  setItemWithExpiry: (key, value, expiryTime) => {
    if (typeof window === 'undefined') return;
    try {
      const now = new Date().getTime();
      const item = {
        value: value,
        expiry: expiryTime ? now + expiryTime : null
      };
      
      sessionStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.warn('Error setting sessionStorage with expiry:', error);
      return false;
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

// Enhanced SSR-safe cookie utilities
export const safeCookies = {
  get: (name) => {
    if (typeof document === 'undefined') return null;
    try {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    } catch (error) {
      console.warn('Error accessing cookies:', error);
      return null;
    }
  },
  
  set: (name, value, options = {}) => {
    if (typeof document === 'undefined') return;
    try {
      let cookieStr = `${name}=${value}`;
      
      if (options.expires) {
        if (options.expires instanceof Date) {
          cookieStr += `; expires=${options.expires.toUTCString()}`;
        } else {
          const date = new Date();
          date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
          cookieStr += `; expires=${date.toUTCString()}`;
        }
      }
      
      if (options.path) cookieStr += `; path=${options.path}`;
      if (options.domain) cookieStr += `; domain=${options.domain}`;
      if (options.secure) cookieStr += '; secure';
      if (options.sameSite) cookieStr += `; samesite=${options.sameSite}`;
      
      document.cookie = cookieStr;
      return true;
    } catch (error) {
      console.warn('Error setting cookie:', error);
      return false;
    }
  },
  
  remove: (name, options = {}) => {
    if (typeof document === 'undefined') return;
    try {
      const opts = { ...options, expires: new Date(0) };
      return safeCookies.set(name, '', opts);
    } catch (error) {
      console.warn('Error removing cookie:', error);
      return false;
    }
  }
};

// Auth storage utilities specifically for handling authentication state
export const authStorage = {
  // Check if user is authenticated based on storage
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    
    try {
      // Check cookies first (most reliable)
      if (safeCookies.get('access')) return true;
      
      // Then check session storage
      const authStatus = safeSessionStorage.getItem('auth_status');
      if (authStatus === 'authenticated') return true;
      
      return false;
    } catch (error) {
      console.warn('Error checking authentication status:', error);
      return false;
    }
  },
  
  // Store Google One Tap state
  storeGoogleOneTapState: (attempted = true, expiryMinutes = 60) => {
    if (typeof window === 'undefined') return;
    
    try {
      // Store in session storage with expiry
      safeSessionStorage.setItemWithExpiry(
        'googleOneTapAttempted', 
        attempted.toString(), 
        expiryMinutes * 60 * 1000
      );
    } catch (error) {
      console.warn('Error storing Google One Tap state:', error);
    }
  },
  
  // Check if Google One Tap was recently attempted
  wasGoogleOneTapAttempted: () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const status = safeSessionStorage.getItemWithExpiry('googleOneTapAttempted');
      return status === 'true';
    } catch (error) {
      console.warn('Error checking Google One Tap state:', error);
      return false;
    }
  },
  
  // Clear Google One Tap state
  clearGoogleOneTapState: () => {
    if (typeof window === 'undefined') return;
    
    try {
      safeSessionStorage.removeItem('googleOneTapAttempted');
    } catch (error) {
      console.warn('Error clearing Google One Tap state:', error);
    }
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