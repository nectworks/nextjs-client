'use client';
/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `NectCoins` component. The `page` 
    component returns the `NectCoins` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import dynamic from 'next/dynamic';

const NectCoins = dynamic(() => import('./NectCoins/NectCoins'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      gap: '1rem'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <div style={{
        color: '#64748b',
        fontSize: '1rem',
        fontWeight: '500'
      }}>
        Loading NectCoins...
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
});

const NectCoinsPage = () => {
  return <NectCoins />;
};

export default NectCoinsPage;