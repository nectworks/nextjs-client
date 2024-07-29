/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Create Blog Post` component. The `page` 
    component returns the `Create Blog Post` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/
import CreateBlogPost from './CreateBlogPost/CreateBlogPost';

const CreateBlogPage = () => {
  return <CreateBlogPost />;
};

export default CreateBlogPage;
