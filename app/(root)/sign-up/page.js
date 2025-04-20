/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Sign Up` component. The `page` 
    component returns the `Sign Up` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import SignUp from './SignUp';

export default function SignUpPage() {
  return <SignUp />;
}
