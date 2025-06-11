/*
    FileName - robots.js
    Desc - This file defines a function that generates the robots.txt configuration 
    for the Nectworks website. It specifies rules for web crawlers, allowing them to 
    access a set of specified URLs on the site, such as the homepage, about us, contact us, 
    FAQ, and other important pages. It does not disallow any specific paths. Additionally, 
    it includes the URL for the site's sitemap to help search engines index the site more 
    effectively.

    Enhanced robots.txt configuration with comprehensive rules
    for different user agents, proper crawl directives, and optimized
    sitemap references for better search engine optimization.
*/

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';
  
  return {
    rules: [
      // General rules for all crawlers
      {
        userAgent: '*',
        allow: [
          '/',
          '/about-us',
          '/contact-us',
          '/faq',
          '/help',
          '/features',
          '/pricing',
          '/how-it-works',
          '/testimonials',
          '/case-studies',
          '/blog',
          '/blog/*',
          '/resources',
          '/guides',
          '/fraudulent-activity',
          '/log-in',
          '/sign-up',
          '/privacy-policy',
          '/terms-and-conditions',
          '/professional',
          '/jobseeker',
          '/for-companies',
          '/careers',
          '/team',
          '/industries/*',
          '/jobs/*',
          '/companies/*',
          '/user/*', // Public user profiles only
          
          // Static assets
          '/favicon.ico',
          '/robots.txt',
          '/sitemap.xml',
          '/*.css',
          '/*.js',
          '/*.png',
          '/*.jpg',
          '/*.jpeg',
          '/*.gif',
          '/*.webp',
          '/*.svg',
          '/*.ico',
          '/*.woff',
          '/*.woff2',
          '/*.ttf',
          '/*.eot',
        ],
        disallow: [
          // Private user areas
          '/dashboard',
          '/dashboard/*',
          '/profile',
          '/profile/*',
          '/account-settings',
          '/account-settings/*',
          '/admin-panel',
          '/admin-panel/*',
          '/nectcoins',
          '/nectcoins/*',
          
          // Authentication and sensitive pages
          '/logout',
          '/account-deletion-confirmation',
          '/google/auth-redirect',
          '/linkedin/*',
          
          // API endpoints
          '/api/*',
          '/_next/*',
          
          // Development and testing
          '/test/*',
          '/dev/*',
          '/staging/*',
          
          // Search and filter pages that might create duplicate content
          '/search?*',
          '/*?utm_*',
          '/*?ref=*',
          '/*?source=*',
          '/*?campaign=*',
          
          // Temporary or maintenance pages
          '/maintenance',
          '/coming-soon',
          
          // Admin and internal tools
          '/admin',
          '/internal/*',
          
          // File directories
          '/files/*',
          '/uploads/*',
          '/temp/*',
          
          // Version control and system files
          '/.git',
          '/.env',
          '/package.json',
          '/package-lock.json',
          '/*.log',
        ],
        crawlDelay: 1, // 1 second delay between requests
      },
      
      // Specific rules for Google
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/about-us',
          '/contact-us',
          '/faq',
          '/help',
          '/features',
          '/pricing',
          '/how-it-works',
          '/testimonials',
          '/case-studies',
          '/blog',
          '/blog/*',
          '/resources',
          '/guides',
          '/professional',
          '/jobseeker',
          '/for-companies',
          '/industries/*',
          '/jobs/*',
          '/companies/*',
          '/user/*',
        ],
        disallow: [
          '/dashboard/*',
          '/profile/*',
          '/admin-panel/*',
          '/api/*',
          '/search?*',
          '/*?utm_*',
        ],
      },
      
      // Specific rules for Bing
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/about-us',
          '/contact-us',
          '/faq',
          '/features',
          '/blog/*',
          '/professional',
          '/jobseeker',
          '/for-companies',
        ],
        disallow: [
          '/dashboard/*',
          '/profile/*',
          '/admin-panel/*',
          '/api/*',
        ],
        crawlDelay: 2,
      },
      
      // Rules for social media crawlers
      {
        userAgent: 'facebookexternalhit',
        allow: [
          '/',
          '/about-us',
          '/blog/*',
          '/user/*',
          '/companies/*',
        ],
        disallow: [
          '/dashboard/*',
          '/profile/*',
          '/admin-panel/*',
        ],
      },
      
      {
        userAgent: 'Twitterbot',
        allow: [
          '/',
          '/about-us',
          '/blog/*',
          '/user/*',
          '/companies/*',
        ],
        disallow: [
          '/dashboard/*',
          '/profile/*',
          '/admin-panel/*',
        ],
      },
      
      {
        userAgent: 'LinkedInBot',
        allow: [
          '/',
          '/about-us',
          '/professional',
          '/for-companies',
          '/blog/*',
        ],
        disallow: [
          '/dashboard/*',
          '/profile/*',
          '/admin-panel/*',
        ],
      },
      
      // Block problematic bots
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot', 
          'MJ12bot',
          'DotBot',
          'BLEXBot',
        ],
        disallow: ['/'],
        crawlDelay: 86400, // 24 hours
      },
      
      // Allow archive bots but with restrictions
      {
        userAgent: 'ia_archiver',
        allow: [
          '/',
          '/about-us',
          '/blog/*',
          '/faq',
        ],
        disallow: [
          '/dashboard/*',
          '/profile/*',
          '/admin-panel/*',
          '/api/*',
        ],
        crawlDelay: 10,
      },
    ],
    
    // Sitemap references
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      // Add additional sitemaps when implemented
      // `${baseUrl}/sitemap-blog.xml`,
      // `${baseUrl}/sitemap-jobs.xml`,
      // `${baseUrl}/sitemap-companies.xml`,
    ],
    
    // Additional directives
    host: baseUrl,
  };
}

/*
  ROBOTS.TXT BEST PRACTICES:
  
  1. Allow vs Disallow Strategy:
     - Use allow for important pages you want indexed
     - Use disallow for private/sensitive content
     - Be specific with paths to avoid blocking important content
  
  2. User Agent Targeting:
     - Different rules for different bots based on their behavior
     - Allow social media bots for better social sharing
     - Block or limit aggressive SEO bots that don't add value
  
  3. Crawl Delay:
     - Set appropriate delays to prevent server overload
     - Different delays for different bot types
     - Higher delays for less important bots
  
  4. Dynamic Content Considerations:
     - Allow public user profiles (/user/*) for social proof
     - Allow job listings (/jobs/*) for discovery
     - Allow company pages (/companies/*) for networking
     - Block private dashboards and admin areas
  
  5. SEO Parameters:
     - Block tracking parameters (?utm_*, ?ref=*, etc.)
     - Block search result pages that might create duplicate content
     - Allow clean URLs for better indexing
  
  6. Performance Optimization:
     - Block resource-heavy endpoints
     - Limit access to API endpoints
     - Consider server capacity when setting crawl delays
  
  7. Security:
     - Always block admin areas
     - Block sensitive file types and directories
     - Don't expose internal tools or development endpoints
  
  8. Regular Maintenance:
     - Update robots.txt when adding new page types
     - Monitor server logs for crawler behavior
     - Adjust crawl delays based on server performance
     - Review and update blocked bot list regularly
  
  NOTES:
  - Test robots.txt using Google Search Console
  - Monitor crawl errors and adjust rules accordingly
  - Keep robots.txt simple and focused on essential rules
  - Remember: robots.txt is a public file visible to anyone
*/