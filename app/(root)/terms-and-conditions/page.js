/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Terms and Conditions` component. The `page` 
    component returns the `Terms and Conditions` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import TermsAndConditions from './TermsAndConditions/TermsAndConditions';

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';

export const metadata = {
  title: 'Terms and Conditions | Nectworks',
  description:
    "Read the terms and conditions for using Nectworks' employee referral platform and recruitment software services.",
  keywords: [
    'Nectworks terms and conditions',
    'Service terms Nectworks',
    'User agreement',
    'Recruitment software terms',
    'Employee referral platform terms',
  ],
  openGraph: {
    title: 'Terms and Conditions | Nectworks',
    description:
      "Read the terms and conditions for using Nectworks' employee referral platform and recruitment software services.",
    url: 'https://nectworks.com/terms-and-conditions',
    siteName: 'Nectworks',
    images: [
      {
        url: `${baseURL}/nectworksOgImage.webp`,
        width: 1200,
        height: 630,
        alt: 'Nectworks OG Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const TermsAndConditionsPage = () => {
  return <TermsAndConditions />;
};

export default TermsAndConditionsPage;
