/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Account Settings` component. The `page` 
    component returns the `Account Settings` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import AccountSettings from './AccountSettings';

const AccountSettingsPage = () => {
  return <AccountSettings />;
};

export default AccountSettingsPage;
