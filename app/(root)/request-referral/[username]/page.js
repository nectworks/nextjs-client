/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Request Referral` component. The `page` 
    component returns the `Request Referral` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import RequestReferral from '../../referrals/RequestReferral';

const RequestReferralPage = () => {
  return <RequestReferral />;
};

export default RequestReferralPage;
