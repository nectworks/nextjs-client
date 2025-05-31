/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Logout` component. The `page` 
    component returns the `Logout` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const Logout = dynamic(() => import('./Logout'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Logging out...</div>
    </div>
  )
});

const LogoutPage = () => {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    }>
      <Logout />
    </Suspense>
  );
};

export default LogoutPage;
