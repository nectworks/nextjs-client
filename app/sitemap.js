/*
    FileName - sitemap.js
    Desc - This file defines a function that generates a static sitemap for the 
    Nectworks website. It returns an array of objects, each representing a URL 
    on the website with its last modified date set to the current date. This 
    sitemap includes URLs for the homepage, about us, contact us, FAQ, fraudulent 
    activity, login, logout, privacy policy, professional page, sign-up, and terms 
    and conditions pages. There is a placeholder comment indicating that blog URLs 
    should be dynamically generated in the future.
    
    Enhanced sitemap generator with priority and changeFrequency
    for better SEO optimization. Includes all important pages with
    appropriate priorities and update frequencies for search engines.
*/

export default function sitemap() {
  const baseUrl = 'https://nectworks.com';
  const currentDate = new Date();
  
  return [
    // Homepage - Highest priority, updates frequently
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    
    // Main service pages - High priority
    {
      url: `${baseUrl}/sign-up`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/log-in`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/professional`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jobseeker`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    
    // Company information pages - Medium-high priority
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/for-companies`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // Support and help pages - Medium priority
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    
    // Legal and policy pages - Lower priority but important for trust
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/fraudulent-activity`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    
    // Authentication pages - Lower priority (mostly for crawling)
    {
      url: `${baseUrl}/logout`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    
    // Feature and service pages
    {
      url: `${baseUrl}/features`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    
    // Blog and content pages (add when available)
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    
    
    // Career and company culture pages
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // Company-specific referral pages (examples)
    {
      url: `${baseUrl}/companies/google`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    
    // TODO: Add dynamic blog post URLs when blog is implemented
    // TODO: Add dynamic user profile URLs (but be careful with privacy)
    // TODO: Add dynamic job listing URLs when available
    // TODO: Add dynamic company profile URLs when available
  ];
}

/*
  NOTES for developers:
  
  1. Priority values (0.0 to 1.0):
     - 1.0: Homepage, most important landing pages
     - 0.8-0.9: Main service pages, key conversion pages
     - 0.6-0.7: Feature pages, company info, support
     - 0.4-0.5: Documentation, legal pages
     - 0.1-0.3: Less important utility pages
  
  2. Change Frequency:
     - daily: Homepage, job listings, active content
     - weekly: Service pages, features, blog categories
     - monthly: Company info, help pages, static content
     - yearly: Legal pages, rarely updated content
  
  3. Best Practices:
     - Keep total URLs under 50,000 per sitemap
     - Use lastModified with actual dates when content changes
     - Don't include URLs that return 404 or require authentication
     - Include only canonical URLs (no duplicates)
     - Update sitemap when adding new page types
  
  4. Dynamic Content:
     - For blog posts: Generate URLs from your CMS/database
     - For user profiles: Only include public profiles
     - For job listings: Include active listings only
     - For company pages: Include verified company profiles only
  
  5. Multiple Sitemaps:
     - Consider splitting into multiple sitemaps if you have many dynamic URLs
     - Create separate sitemaps for: static pages, blog posts, job listings, etc.
     - Use a sitemap index file to reference multiple sitemaps
*/