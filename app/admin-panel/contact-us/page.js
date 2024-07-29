/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Contact Us` component. The `page` 
    component returns the `Contact Us` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import ContactUs from './ContactUs/ContactUs';

const ContactPage = () => {
  return <ContactUs />;
};

export default ContactPage;
