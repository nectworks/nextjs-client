import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the component with no SSR
const GoogleRedirect = dynamic(() => import('./GoogleRedirect'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Processing authentication...</div>
    </div>
  )
});

const GoogleAuthRedirectPage = () => {
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
      <GoogleRedirect />
    </Suspense>
  );
};

export default GoogleAuthRedirectPage;