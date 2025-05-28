'use client';
/*
  File: AdminUserContext.js (Fixed Version)
  Description: This file contains a context provider that stores data to
    identify the authenticated admin user.
*/

import { createContext, useEffect, useState, useRef } from 'react';
import { privateAxios } from '../../config/axiosInstance.js';
import { useRouter, usePathname } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';

export const AdminUserContext = createContext(null);

export default function AdminUserContextProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // Prevent multiple auth checks
  const authAttempted = useRef(false); // Use ref to prevent multiple authentication attempts

  async function authenticateAdmin() {
    // Prevent multiple simultaneous authentication attempts
    if (authAttempted.current) {
      return;
    }
    
    authAttempted.current = true;

    try {
      const res = await privateAxios.get('/admin/authenticate');
      if (res.status === 200 && res.data.admin) {
        setAdmin(res.data.admin);
        setAuthChecked(true);
      } else {
        throw new Error('Not authenticated');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Only redirect if not already on login page and auth fails
      if (!pathname.includes('/admin-panel/login')) {
        setAdmin(null);
        // Use a timeout to prevent immediate loops
        setTimeout(() => {
          router.push('/admin-panel/login');
        }, 100);
      }
    } finally {
      setIsLoading(false);
      setAuthChecked(true);
      authAttempted.current = false; // Reset for potential retry
    }
  }

  useEffect(() => {
    // Only authenticate if we haven't checked already and not on login page
    if (!authChecked && !pathname.includes('/admin-panel/login')) {
      authenticateAdmin();
    } else if (pathname.includes('/admin-panel/login')) {
      // If on login page, just stop loading
      setIsLoading(false);
      setAuthChecked(true);
    }
  }, [pathname, authChecked]);

  // Handle admin state changes
  useEffect(() => {
    if (authChecked && !admin && !pathname.includes('/admin-panel/login')) {
      // If auth check completed, no admin found, and not on login page, redirect
      router.push('/admin-panel/login');
    } else if (admin && pathname.includes('/admin-panel/login')) {
      // If admin is authenticated and on login page, redirect to appropriate panel
      const privilegeLvl = admin.role?.privilegeLvl;
      const redirectPath = privilegeLvl === 2 ? '/admin-panel/manage-blog' : '/admin-panel/users';
      router.push(redirectPath);
    }
  }, [admin, authChecked, pathname, router]);

  // Show loading spinner only during initial auth check
  if (isLoading && !authChecked) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ClipLoader size={50} />
      </div>
    );
  }

  return (
    <AdminUserContext.Provider value={[admin, setAdmin]}>
      {children}
    </AdminUserContext.Provider>
  );
}