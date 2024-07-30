/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `View Users Page` component. The `page` 
    component returns the `View Users Page` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import Users from './ViewUser/ViewUser';

const ViewUserPage = () => {
  return <Users />;
};

export default ViewUserPage;
