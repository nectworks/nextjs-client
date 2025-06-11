/*
    FileName - page.js
    Desc - Entry point for the JobSeeker component with updated metadata
*/

import JobSeeker from './JobSeeker';

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';

export const metadata = {
  title: 'Get Referred',
  description:
    'Tap into our powerful referral network to get noticed by hiring managers and land your dream job with quality referrals from company insiders.',
  keywords: [
    'Job referrals',
    'Employee referrals',
    'Get referred to jobs',
    'Job application referrals',
    'Tech job referrals',
    'Career networking',
  ],
  openGraph: {
    title: 'Get Referred to Your Dream Jobs',
    description:
      'Skip the application black hole. Get personally referred by employees at top companies through our referral network.',
    keywords: [
      'Job referrals',
      'Employee referrals',
      'Get referred to jobs',
      'Job application referrals',
      'Tech job referrals',
      'Career networking',
    ],
    url: 'https://nectworks.com/jobseeker',
    siteName: 'Nectworks',
    images: [
      {
        url: `${baseURL}/nectworksOgImage.webp`,
        width: 1200,
        height: 630,
        alt: 'Nectworks Job Referral Platform',
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