import Professional from './Professional/Professional';

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';

export const metadata = {
  title: 'Professional | Nectworks',
  description:
    "Discover how professionals can refer candidates to their companies using Nectworks' streamlined referral process and centralized dashboard.",
  keywords: [
    'Employee referral process',
    'How to refer candidates',
    'Referral dashboard',
    'Professional networking',
    'Boost employee referrals',
  ],
  openGraph: {
    title: 'Professional | Nectworks',
    description:
      "Discover how professionals can refer candidates to their companies using Nectworks' streamlined referral process and centralized dashboard.",
    url: 'https://nectworks.com/professional',
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

const ProfessionalPage = () => {
  return <Professional />;
};

export default ProfessionalPage;
