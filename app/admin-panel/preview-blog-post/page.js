/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Preview Blog Post` component. The `page` 
    component returns the `Preview Blog Post` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import PreviewBlog from './PreviewBlog/PreviewBlog';

const PreviewBlogpage = () => {
  return <PreviewBlog />;
};

export default PreviewBlogpage;
