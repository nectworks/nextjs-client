/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Account Settings` component. The `page` 
    component returns the `Account Settings` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import dynamic from 'next/dynamic';

const AccountSettings = dynamic(() => import('./AccountSettings'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Loading account settings...</div>
    </div>
  )
});

const AccountSettingsPage = () => {
  return <AccountSettings />;
};

export default AccountSettingsPage;