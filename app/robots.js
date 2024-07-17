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
