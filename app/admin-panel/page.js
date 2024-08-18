/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Login` component. The `page` 
    component returns the `Login` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import Login from './login/Login/Login';

const AdminPage = () => {
  return <Login />;
};

export default AdminPage;