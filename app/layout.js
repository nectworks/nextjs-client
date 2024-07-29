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


import inter from '@/lib/font/Inter';
import './globals.css';
import Wrapper from './wrapper';

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
