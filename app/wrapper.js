'use client';

import { useEffect, useState } from 'react';
import ProgressBar from './_components/ProgressBar/ProgressBar';
import UserContextProvider from '@/context/User/UserContext';
import DashboardContextProvider from '@/context/Dashboard/DashboardContext';
import ProfileContextProvider from '@/context/UpdateProfile/ProfileContext';

const Wrapper = ({ children }) => {
  // State to track loading status
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    if (document.location.hostname.search('nectworks.com') !== -1) {
      ReactGA.initialize(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
    }
  }, []);

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
            <DashboardContextProvider>
              <ProfileContextProvider>{children}</ProfileContextProvider>
            </DashboardContextProvider>
          </UserContextProvider>
        </>
      )}
    </>
  );
};

export default Wrapper;
