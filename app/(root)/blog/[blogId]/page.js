/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Blog` component. The `page` 
    component returns the `Blog` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import Blog from './blog';

const page = () => {
  return <Blog />;
};

export default page;
