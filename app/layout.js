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
// Enhanced keywords for better SEO coverage
const keywords = [
  'employee referral platform',
  'job referrals',
  'professional networking',
  'referral management software',
  'AI-powered hiring',
  'streamlined recruitment',
  'job seeker platform',
  'career referrals',
  'hiring optimization',
  'talent acquisition',
  'employee referral program',
  'job matching platform',
  'professional referrals',
  'recruitment technology',
  'job referral network',
  'career opportunities India',
  'tech jobs referrals',
  'startup hiring platform',
  'referral bonus system',
  'job search optimization'
];

export const metadata = {
  title: {
    default: "Nectworks | One Profile for Jobs & Referrals. That's It.",
    template: '%s | Nectworks'
  },
  icons: {
    icon: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
    shortcut: '/favicon/favicon.ico',
  },
  description: 'Tired of messy job hunts? Nectworks makes it easy — one profile, one link, zero chaos. Share, connect, and get referred by real people, not bots. Welcome to the future of job moves.',
  keywords: keywords,
  openGraph: {
    title: "Nectworks | One Profile for Jobs & Referrals. That's It.",
    description: 'Tired of messy job hunts? Nectworks makes it easy — one profile, one link, zero chaos. Share, connect, and get referred by real people, not bots. Welcome to the future of job moves.',
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
  manifest: '/manifest.json',
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