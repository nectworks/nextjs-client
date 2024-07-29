/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Users` component. The `page` 
    component returns the `Users` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import Users from './Users/Users';
const UsersPage = () => {
  return <Users />;
};

export default UsersPage;
