/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `FAQ` component. The `page` 
    component returns the `FAQ` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import Faq from './Faq/Faq';

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';

export const metadata = {
  title: 'FAQ | Nectworks',
  description:
    'Find answers to common questions about Nectworks, our employee referral platform, and how our recruitment software can benefit your company.',
  keywords: [
    'Nectworks FAQ',
    'Employee referral platform questions',
    'Recruitment software help',
    'Common questions about Nectworks',
    'Nectworks support',
  ],
  openGraph: {
    title: 'FAQ | Nectworks',
    description:
      'Find answers to common questions about Nectworks, our employee referral platform, and how our recruitment software can benefit your company.',
    url: 'https://nectworks.com/faq',
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

export default function FaqPage() {
  return <Faq />;
}
