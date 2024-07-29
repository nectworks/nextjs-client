/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Profile` component. The `page` 
    component returns the `Profile` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/ 

import ProfilePage from './Profile/Profile';

const Profile = () => {
  return <ProfilePage />;
};

export default Profile;
