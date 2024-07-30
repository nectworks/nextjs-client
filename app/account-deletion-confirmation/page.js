/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Account Deletion Confirmation` component. The `page` 
    component returns the `Account Deletion Confirmation` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import AccountDeletionConfirmation from './AccountDeletionConfirmation';

const AccountDeletionPage = () => {
  return <AccountDeletionConfirmation />;
};

export default AccountDeletionPage;
