/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `BlogList` component. The `page` 
    component returns the `BlogList` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import BlogList from './blogList';

const page = () => {
  return <BlogList />;
};

export default page;
