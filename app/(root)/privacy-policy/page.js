/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Privacy Policy` component. The `page` 
    component returns the `Privacy Policy` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy';

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';
export const metadata = {
  title: 'Privacy Policy | Nectworks',
  description:
    "Understand Nectworks' privacy practices, how we protect user data, and our commitment to data security.",
  keywords: [
    'Nectworks privacy policy',
    'Data protection',
    'Privacy practices',
    'User data security',
    'Recruitment software privacy',
  ],
  openGraph: {
    title: 'Contact Us | Nectworks',
    description:
      'Have questions or need support? Contact Nectworks for inquiries about our employee referral platform and recruitment software services.',
    url: 'https://nectworks.com/privacy-policy',
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
const PrivacyPage = () => {
  return <PrivacyPolicy />;
};

export default PrivacyPage;
