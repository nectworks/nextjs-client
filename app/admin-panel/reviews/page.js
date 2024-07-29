/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Reviews` component. The `page` 
    component returns the `Reviews` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import Reviews from './Reviews/Reviews';

const ReviewPage = () => {
  return <Reviews />;
};

export default ReviewPage;
