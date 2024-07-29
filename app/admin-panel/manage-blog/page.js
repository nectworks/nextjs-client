/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Manage Blog Post` component. The `page` 
    component returns the `Manage Blog Post` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import ManageBlogPosts from './ManageBlogPosts/ManageBlogPosts';
const ManageBlogPage = () => {
  return <ManageBlogPosts />;
};

export default ManageBlogPage;
