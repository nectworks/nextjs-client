/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Manage Admins` component. The `page` 
    component returns the `Manage Admins` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import ManageAdmins from './ManageAdmins/ManageAdmins';

const ManageAdminPage = () => {
  return <ManageAdmins />;
};

export default ManageAdminPage;
