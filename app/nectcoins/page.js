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
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Loading NectCoins...</div>
    </div>
  )
});

const NectCoinsPage = () => {
  return <NectCoins />;
};

export default NectCoinsPage;