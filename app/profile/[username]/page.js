/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Seeker Public Page` component. The `page` 
    component returns the `Seeker Public Page` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import SeekerPublicPage from '@/app/(root)/jobseeker/seekerPublicPage';

const ProfilePage = () => {
  return <SeekerPublicPage />;
};

export default ProfilePage;
