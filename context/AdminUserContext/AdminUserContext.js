'use client';
/*
  File: AdminUserContext.js
  Description: This file contains a context provider that stores data to
    identify the authenticated admin user.
*/

import { createContext, useEffect, useState } from 'react';
import { privateAxios } from '../../config/axiosInstance.js';
import { useRouter } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';

export const AdminUserContext = createContext(null);

export default function AdminUserContextProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Start loading state as true

  async function authenticateAdmin() {
    try {
      const res = await privateAxios.get('/admin/authenticate');
      if (res.status === 200) {
        setAdmin(res.data.admin);
      } else {
        throw new Error('Not authenticated');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      router.push('/admin-panel/login');
    } finally {
      setIsLoading(false); // Always stop loading, regardless of success or error
    }
  }

  useEffect(() => {
    authenticateAdmin();
  }, []);

  return (
    <AdminUserContext.Provider value={[admin, setAdmin]}>
      {isLoading ? (
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
      ) : (
        children
      )}
    </AdminUserContext.Provider>
  );
}
