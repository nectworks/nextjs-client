import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const LinkedInRedirect = dynamic(() => import('./LinkedInRedirect'), {
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

const LinkedInAuthRedirectPage = () => {
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
      <LinkedInRedirect />
    </Suspense>
  );
};

export default LinkedInAuthRedirectPage;