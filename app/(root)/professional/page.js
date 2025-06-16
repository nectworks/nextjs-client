/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Professional` component. The `page` 
    component returns the `Professional` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import Professional from './Professional/Professional';

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';

export const metadata = {
  title: 'Become a Referrer',
  description:
    'Join the Nectworks referral network as a professional. Help candidates get noticed at your company while streamlining your referral process and tracking progress.',
  keywords: [
    'Employee referrals',
    'Referral management',
    'Professional networking',
    'Company referral program',
    'Talent acquisition',
    'Hiring referrals',
  ],
  openGraph: {
    title: 'Become a Referrer at Your Company',
    description:
      'Simplify your referral process. Create your profile, manage candidate referrals, and help great talent find opportunities at your company.',
    keywords: [
      'Employee referrals',
      'Referral management',
      'Professional networking',
      'Company referral program',
      'Talent acquisition',
      'Hiring referrals',
    ],
    url: 'https://nectworks.com/professional',
    siteName: 'Nectworks',
    images: [
      {
        url: `${baseURL}/nectworksOgImage.webp`,
        width: 1200,
        height: 630,
        alt: 'Nectworks Professional Referral Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

const ProfessionalPage = () => {
  return <Professional />;
};

export default ProfessionalPage;