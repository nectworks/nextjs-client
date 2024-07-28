'use client';

import { useEffect, useState } from 'react';
import ProgressBar from './_components/ProgressBar/ProgressBar';
import UserContextProvider from '@/context/User/UserContext';
import DashboardContextProvider from '@/context/Dashboard/DashboardContext';
import ProfileContextProvider from '@/context/UpdateProfile/ProfileContext';
import ReactGA from 'react-ga4';

const Wrapper = ({ children }) => {
  // State to track loading status
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (
      document.location.hostname.search(process.env.NEXT_PUBLIC_CLIENT_URL) !==
      -1
    ) {
      ReactGA.initialize(process.env.NEXT_PUBLIC_VITE_GA_MEASUREMENT_ID);
      ReactGA.send('pageview');
    }
  }, []);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <ProgressBar />
      ) : (
        <UserContextProvider>
          <DashboardContextProvider>
            <ProfileContextProvider>{children}</ProfileContextProvider>
          </DashboardContextProvider>
        </UserContextProvider>
      )}
    </>
  );
};

export default Wrapper;
