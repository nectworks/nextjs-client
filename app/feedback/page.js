/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Feedback` component. The `page` 
    component returns the `Feedback` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import Feedback from './Feedback/Feedback';

const FeedbackPage = () => {
  return <Feedback />;
};

export default FeedbackPage;
