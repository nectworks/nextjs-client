/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Fraudulent` component. The `page` 
    component returns the `Fraudulent` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import Fraudulent from './Fraudulent/Fraudulent';

const page = () => {
  return <Fraudulent />;
};

export default page;
