'use client';
/*
    FileName - Wrapper.js
    Desc - This file defines the Wrapper component which wraps its children with 
    multiple context providers: UserContextProvider, DashboardContextProvider, and 
    ProfileContextProvider. It initializes Google Analytics (ReactGA) for page views 
    if the hostname matches the specified client URL. The component tracks a loading 
    state, displaying a ProgressBar component during loading and rendering the 
    children within the context providers after a simulated loading time.
*/

import { useEffect } from 'react';
import UserContextProvider from '@/context/User/UserContext';
import DashboardContextProvider from '@/context/Dashboard/DashboardContext';
import ProfileContextProvider from '@/context/UpdateProfile/ProfileContext';
import ReactGA from 'react-ga4';

const Wrapper = ({ children }) => {
  useEffect(() => {
    // Initialize Google Analytics if on the client URL
    if (
      document.location.hostname.search(process.env.NEXT_PUBLIC_CLIENT_URL) !==
      -1
    ) {
      ReactGA.initialize(process.env.NEXT_PUBLIC_VITE_GA_MEASUREMENT_ID);
      ReactGA.send('pageview');
    }
  }, []);

  return (
    <UserContextProvider>
      <DashboardContextProvider>
        <ProfileContextProvider>{children}</ProfileContextProvider>
      </DashboardContextProvider>
    </UserContextProvider>
  );
};

export default Wrapper;