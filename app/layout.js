/*
    FileName - layout.js
    Desc - This file defines two main exports: the `generateMetadata` function
    and a default `Layout` component. The `generateMetadata` function dynamically
    generates metadata for a user's profile page based on their username by fetching
    user and profile data from the server. It constructs the metadata including the title,
    description, open graph data, and twitter card information to provide detailed
    and optimized information for social sharing and SEO. The `Layout` component is
    a simple wrapper that renders its children components, serving as a layout container
    for the profile page.
*/

import { Inter } from 'next/font/google';
import './globals.css';
import Wrapper from './wrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';
const keywords = [
  'Employee referral platform',
  'Streamlined job referrals',
  'Professional networking tool',
  'Referral management software',
  'Boost employee referrals',
  'Recruitment process software',
];

export const metadata = {
  title: 'Nectworks - Job Referrals and more',
  //   icons: {
  //     icon: [
  //       {
  //         url: '/faviconLogo.png',
  //         sizes: '16x16 32x32 48x48',
  //         type: 'image/png',
  //       },
  //     ],
  //   },
  icons: {
    icon: '/icon.ico',
  },
  description:
    'Nectworks offers a centralized platform for managing employee referrals, connecting job seekers with company insiders, and streamlining the recruitment process.',
  keywords: keywords,
  openGraph: {
    title: 'Nectworks - Job Referrals and more',
    description:
      'Nectworks offers a centralized platform for managing employee referrals, connecting job seekers with company insiders, and streamlining the recruitment process.',
    url: 'https://nectworks.com/',
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Wrapper>{children}</Wrapper>
        <div className="info-box" id="info-box"></div>
      </body>
    </html>
  );
}
