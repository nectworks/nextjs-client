/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `JobSeeker` component. The `page` 
    component returns the `JobSeeker` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/

import JobSeeker from './JobSeeker';

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';

export const metadata = {
  title: 'Jobseeker | Nectworks',
  description:
    'Learn how job seekers can leverage Nectworks to ask for referrals, connect with company insiders, and find job opportunities.',
  keywords: [
    'Job seeker referrals',
    'Find job referrals',
    'Networking for job seekers',
    'Ask for job referrals',
    'Job search platform',
  ],
  openGraph: {
    title: 'Jobseeker | Nectworks',
    description:
      'Learn how job seekers can leverage Nectworks to ask for referrals, connect with company insiders, and find job opportunities.',
    keywords: [
      'Job seeker referrals',
      'Find job referrals',
      'Networking for job seekers',
      'Ask for job referrals',
      'Job search platform',
    ],
    url: 'https://nectworks.com/jobseeker',
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

const JobSeekerPage = () => {
  return <JobSeeker />;
};

export default JobSeekerPage;
