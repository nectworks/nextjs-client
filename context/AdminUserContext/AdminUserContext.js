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
  const [isLoading, setIsLoading] = useState(false);

  async function authenticateAdmin() {
    setIsLoading(true);
    try {
      const res = await privateAxios.get('/admin/authenticate');

      if (res.status === 200) {
        setAdmin(res.data.admin);
      }

      setIsLoading(false);
    } catch (error) {
      // if the user in not authenticated, redirect them to login
      router.push('/admin-panel/login');
      setIsLoading(false);
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
        { children }
      )}
    </AdminUserContext.Provider>
  );
}
