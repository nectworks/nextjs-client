/*
    FileName - robots.js
    Desc - This file defines a function that generates the robots.txt configuration 
    for the Nectworks website. It specifies rules for web crawlers, allowing them to 
    access a set of specified URLs on the site, such as the homepage, about us, contact us, 
    FAQ, and other important pages. It does not disallow any specific paths. Additionally, 
    it includes the URL for the site's sitemap to help search engines index the site more 
    effectively.
*/


export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/about-us',
        '/contact-us',
        '/faq',
        '/fraudulent-activity',
        '/log-in',
        '/logout',
        '/privacy-policy',
        'professional',
        '/sign-up',
        '/terms-and-conditions',
      ],
      disallow: [],
    },
    sitemap: 'https://nectworks.com/sitemap.xml',
  };
}
