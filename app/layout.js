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
    
    Enhanced layout with comprehensive SEO optimization including
    improved metadata, structured data, and performance optimizations.
    The layout now includes better meta descriptions, Open Graph optimization,
    Twitter Cards, and comprehensive SEO meta tags for better search visibility.
*/

import { Inter } from 'next/font/google';
import './globals.css';
import Wrapper from './wrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
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

// Enhanced metadata with better SEO optimization
export const metadata = {
  title: {
    default: "Nectworks | One Profile for Jobs & Referrals. That’s It.",
    template: '%s | Nectworks'
  },
  description: 'Tired of messy job hunts? Nectworks makes it easy — one profile, one link, zero chaos. Share, connect, and get referred by real people, not bots. Welcome to the future of job moves.',
  keywords: keywords,
  authors: [{ name: 'Nectworks Team' }],
  creator: 'Nectworks',
  publisher: 'Nectworks',
  applicationName: 'Nectworks',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  
  // Enhanced robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Updated icons with comprehensive favicon support
  icons: {
    icon: [
      { url: '/favicon/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon/favicon.svg', color: '#0057B1' },
    ],
  },
  
  // Enhanced Open Graph metadata
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseURL,
    siteName: 'Nectworks',
    title: "Nectworks | One Profile for Jobs & Referrals. That’s It.",
    description: 'Tired of messy job hunts? Nectworks makes it easy — one profile, one link, zero chaos. Share, connect, and get referred by real people, not bots. Welcome to the future of job moves.',
    images: [
      {
        url: `${baseURL}/nectworksOgImage.webp`,
        width: 1200,
        height: 630,
        alt: 'Nectworks - AI-Powered Job Referral Platform Dashboard',
        type: 'image/webp',
      },
      {
        url: `${baseURL}/heroSectionHeroImg.webp`,
        width: 800,
        height: 600,
        alt: 'Nectworks Platform Interface',
        type: 'image/webp',
      },
    ],
  },
  
  // Enhanced Twitter metadata
  twitter: {
    card: 'summary_large_image',
    site: '@nectworks',
    creator: '@nectworks',
    title: "Nectworks | One Profile for Jobs & Referrals. That’s It.",
    description: 'Tired of messy job hunts? Nectworks makes it easy — one profile, one link, zero chaos. Share, connect, and get referred by real people, not bots. Welcome to the future of job moves.',
    images: [`${baseURL}/nectworksOgImage.webp`],
  },
  
  // Additional metadata for rich snippets
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Nectworks',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#0057B1',
    'msapplication-TileImage': `${baseURL}/favicon/apple-touch-icon.png`,
    'theme-color': '#0057B1',
    'color-scheme': 'light',
    'format-detection': 'telephone=no',
    'HandheldFriendly': 'true',
    'MobileOptimized': '320',
    'viewport': 'width=device-width, initial-scale=1.0, maximum-scale=5.0',
  },
  
  // Verification tags (add your actual verification codes)
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  
  // App metadata for PWA optimization
  manifest: '/manifest.json',
  
  // Category for app stores
  category: 'Business',
  
  // Classification
  classification: 'Business, Technology, Recruitment, HR',
  
  // Canonical URL will be set per page
  alternates: {
    canonical: baseURL,
    languages: {
      'en-US': baseURL,
      'en': baseURL,
    },
  },
};

// Structured data for the application
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseURL}/#organization`,
      "name": "Nectworks",
      "url": baseURL,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseURL}/nectworks-ssar04a-mil-11@2x.webp`,
        "width": 240,
        "height": 80
      },
      "description": "AI-powered job referral platform connecting talent with opportunities",
      "foundingDate": "2024",
      "industry": "Technology",
      "numberOfEmployees": "1-10",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": "India"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "url": `${baseURL}/contact-us`,
        "availableLanguage": "English"
      },
      "sameAs": [
        "https://www.linkedin.com/company/nectworks/",
        "https://twitter.com/nectworks"
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${baseURL}/#website`,
      "url": baseURL,
      "name": "Nectworks",
      "description": "AI-powered job referral platform",
      "publisher": {
        "@id": `${baseURL}/#organization`
      },
      "inLanguage": "en-US",
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${baseURL}/search?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      ]
    },
    {
      "@type": "SoftwareApplication",
      "name": "Nectworks",
      "operatingSystem": "Web Browser",
      "applicationCategory": "BusinessApplication",
      "description": "AI-powered job referral platform for streamlined hiring and career advancement",
      "url": baseURL,
      "publisher": {
        "@id": `${baseURL}/#organization`
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "25",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://accounts.google.com" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* Enhanced favicon support */}
        <link rel="icon" href="/favicon/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        {/* Performance hints */}
        <link rel="preload" href="/nectworks-ssar04a-mil-11@2x.webp" as="image" />
        <link rel="preload" href="/heroSectionHeroImg.webp" as="image" />
      </head>
      <body itemScope itemType="https://schema.org/WebPage">
        {/* Skip to main content for accessibility */}
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        
        <Wrapper>{children}</Wrapper>
        
        {/* Info box for notifications */}
        <div className="info-box" id="info-box" role="status" aria-live="polite"></div>
        
        {/* Additional structured data for breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": baseURL
                }
              ]
            })
          }}
        />
      </body>
    </html>
  );
}