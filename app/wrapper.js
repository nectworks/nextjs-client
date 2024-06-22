'use client';

import { useEffect, useState } from 'react';
import ProgressBar from './_components/ProgressBar/ProgressBar';
import Footer from './_components/Footer/Footer';
import Header from './_components/Header/Header';
import UserContextProvider from '@/context/User/UserContext';
import DashboardContextProvider from '@/context/Dashboard/DashboardContext';

const Wrapper = ({ children }) => {
  // State to track loading status
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <ProgressBar />
      ) : (
        <>
          <UserContextProvider>
            <DashboardContextProvider />
            <Header />
            {children}
            <Footer />
          </UserContextProvider>
        </>
      )}
    </>
  );
};

export default Wrapper;
