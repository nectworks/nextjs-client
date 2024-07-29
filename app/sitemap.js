/*
    FileName - sitemap.js
    Desc - This file defines a function that generates a static sitemap for the 
    Nectworks website. It returns an array of objects, each representing a URL 
    on the website with its last modified date set to the current date. This 
    sitemap includes URLs for the homepage, about us, contact us, FAQ, fraudulent 
    activity, login, logout, privacy policy, professional page, sign-up, and terms 
    and conditions pages. There is a placeholder comment indicating that blog URLs 
    should be dynamically generated in the future.
*/

export default function sitemap() {
  return [
    {
      url: 'https://nectworks.com/',
      lastModified: new Date(),
    },
    {
      url: 'https://nectworks.com/about-us',
      lastModified: new Date(),
    },
    {
      url: 'https://nectworks.com/contact-us',
      lastModified: new Date(),
    },
    {
      url: 'https://nectworks.com/faq',
      lastModified: new Date(),
    },
    {
      url: 'https://nectworks.com/fraudulent-activity',
      lastModified: new Date(),
    },
    {
      url: 'https://nectworks.com/log-in',
      lastModified: new Date(),
    },
    {
      url: 'https://nectworks.com/logout',
      lastModified: new Date(),
    },
    {
      url: 'https://nectworks.com/privacy-policy',
      lastModified: new Date(),
    },
    {
      url: 'https://nectworks.com/professional',
      lastModified: new Date(),
    },
    {
      url: 'https://nectworks.com/sign-up',
      lastModified: new Date(),
    },
    {
      url: 'https://nectworks.com/terms-and-conditions',
      lastModified: new Date(),
    },
    // Todo Dynamically generate for blogs
  ];
}
