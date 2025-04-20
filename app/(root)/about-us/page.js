import AboutUs from './About';

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';
const keywords = [
  'About Nectworks',
  'Recruitment software company',
  'Professional networking tool',
  'Referral management software',
  'Nectworks team',
  'Our mission and vision',
];

export const metadata = {
  title: 'About Us | Nectworks',
  description:
    'Learn more about Nectworks, our mission to revolutionize the recruitment process through employee referrals, and meet our dedicated team of experts.',
  keywords: keywords,
  openGraph: {
    title: 'About Us | Nectworks',
    description:
      'Learn more about Nectworks, our mission to revolutionize the recruitment process through employee referrals, and meet our dedicated team of experts.',
    url: 'https://nectworks.com/about-us',
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
export default function AboutPage() {
  return <AboutUs />;
}
