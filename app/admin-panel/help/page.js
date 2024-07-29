/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Help` component. The `page` 
    component returns the `Help` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import Help from './Help/Help';

const HelpPage = () => {
  return <Help />;
};

export default HelpPage;
