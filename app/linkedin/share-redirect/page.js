import { Suspense } from 'react';
import dynamic from 'next/dynamic';

const LinkedInShareRedirect = dynamic(() => import('./SocialRedirect/LinkedInRedirect'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Processing share...</div>
    </div>
  )
});

const LinkedInShareRedirectPage = () => {
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
      <LinkedInShareRedirect />
    </Suspense>
  );
};

export default LinkedInShareRedirectPage;