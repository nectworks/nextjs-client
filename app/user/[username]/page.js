/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Public Profile` component. The `page` 
    component returns the `Public Profile` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import PublicProfile from './PublicProfile';

const PublicProfilePage = () => {
  return <PublicProfile />;
};

export default PublicProfilePage;
