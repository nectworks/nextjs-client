/*
  FileName: SEOHead.js
  Desc: Comprehensive SEO component that adds structured data, meta tags,
  and other SEO optimizations. This component should be imported and used
  in the main layout or specific pages for enhanced search engine optimization.
*/

'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

const SEOHead = ({ 
  title,
  description,
  keywords = [],
  canonical,
  ogImage,
  structuredData = null,
  noIndex = false 
}) => {
  const pathname = usePathname();
  const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';
  const canonicalUrl = canonical || `${baseURL}${pathname}`;

  // Default structured data for the organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nectworks",
    "description": "AI-powered job referral platform connecting talent with opportunities",
    "url": baseURL,
    "logo": `${baseURL}/nectworks-ssar04a-mil-11@2x.webp`,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": `${baseURL}/contact-us`
    },
    "sameAs": [
      "https://www.linkedin.com/company/nectworks/",
      "https://twitter.com/nectworks"
    ],
    "foundingDate": "2024",
    "industry": "Technology",
    "serviceArea": {
      "@type": "Country",
      "name": "India"
    }
  };

  // Service schema for the platform
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Job Referral Platform",
    "description": "AI-powered platform for streamlined job referrals and professional networking",
    "provider": {
      "@type": "Organization",
      "name": "Nectworks"
    },
    "serviceType": "Employment Services",
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Referral Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Job Referrals for Job Seekers"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Employee Referral Management for Companies"
          }
        }
      ]
    }
  };

  // Website schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Nectworks",
    "url": baseURL,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseURL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Combine all schemas
  const allSchemas = [organizationSchema, serviceSchema, websiteSchema];
  if (structuredData) {
    allSchemas.push(structuredData);
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robot Instructions */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage || `${baseURL}/nectworksOgImage.webp`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Nectworks - Job Referral Platform" />
      <meta property="og:site_name" content="Nectworks" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || `${baseURL}/nectworksOgImage.webp`} />
      <meta name="twitter:image:alt" content="Nectworks - Job Referral Platform" />
      <meta name="twitter:site" content="@nectworks" />
      <meta name="twitter:creator" content="@nectworks" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Nectworks" />
      <meta name="publisher" content="Nectworks" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#0057B1" />
      <meta name="msapplication-TileColor" content="#0057B1" />
      
      {/* Preconnect to External Domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://accounts.google.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(allSchemas)
        }}
      />
    </Head>
  );
};

export default SEOHead;