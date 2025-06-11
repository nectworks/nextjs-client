/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Help Page` component. The `page` 
    component returns the `Help Page` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import dynamic from 'next/dynamic';

const Help = dynamic(() => import('./Help/Help'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Loading help...</div>
    </div>
  )
});

const HelpPage = () => {
  return <Help />;
};

export default HelpPage;
