/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Profile` component. The `page` 
    component returns the `Profile` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import dynamic from 'next/dynamic';

const ProfilePage = dynamic(() => import('./Profile/Profile'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <div>Loading profile...</div>
    </div>
  )
});

const Profile = () => {
  return <ProfilePage />;
};

export default Profile;