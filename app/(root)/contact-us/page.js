/*
    FileName - page.js
    Desc - This file defines a simple functional component named `page` which 
    serves as an entry point for rendering the `Contact Us` component. The `page` 
    component returns the `Contact Us` component, effectively making it the main content 
    of the page. It is the default export of the file.
*/
import ContactUs from './ContactUs';

const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';

export const metadata = {
  title: 'Contact Us | Nectworks',
  description:
    'Have questions or need support? Contact Nectworks for inquiries about our employee referral platform and recruitment software services.',
  keywords: [
    'Contact Nectworks',
    'Get in touch with Nectworks',
    'Nectworks support',
    'Recruitment software inquiries',
    'Employee referral platform contact',
  ],
  openGraph: {
    title: 'Contact Us | Nectworks',
    description:
      'Have questions or need support? Contact Nectworks for inquiries about our employee referral platform and recruitment software services.',
    url: 'https://nectworks.com/contact-us',
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
const ContactPage = () => {
  return <ContactUs />;
};

export default ContactPage;
