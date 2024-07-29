/*
    FileName - Page.js
    Desc - This file defines the HomePage component, which serves as the landing page 
    of the Nectworks website. It includes the Header, Home, and Footer components 
    to create a complete page layout. The file also defines and exports the metadata 
    for the page, including the title, description, keywords, and open graph data 
    for social media sharing. The metadata is designed to enhance SEO and provide 
    detailed information for social sharing.
*/


import Home from './(root)/home/Home';
import Header from './_components/Header/Header';
import Footer from './_components/Footer/Footer';

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

const HomePage = () => {
  return (
    <>
      <Header />
      <Home />
      <Footer />
    </>
  );
};

export default HomePage;
