/*
    FileName - layout.js
    Desc - This file defines two main exports: the `generateMetadata` function 
    and a default `Layout` component. The `generateMetadata` function dynamically 
    generates metadata for a blog post based on its ID by fetching data from the server. 
    It constructs the metadata including the title, description, open graph data, and 
    twitter card information. The `Layout` component is a simple wrapper that renders 
    its children components, serving as a layout container for the blog post.
*/


import { publicAxios } from '@/config/axiosInstance';

export async function generateMetadata({ params }) {
  const blogId = params.blogId;
  try {
    const res = await publicAxios.get(`/blog/${blogId}`);
    const blogData = res.data.blog;

    const baseUrl =
      process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';

    // Extract the first few words of the content for the description
    const contentText = blogData.content.replace(/<[^>]+>/g, '');
    const descriptionPreview =
      contentText.split(' ').slice(0, 30).join(' ') + '...';

    return {
      title: `${blogData.title} | Nectworks Blog`,
      description: descriptionPreview,
      openGraph: {
        title: blogData.title,
        description: descriptionPreview,
        url: `${baseUrl}/blog/${blogId}`,
        siteName: 'Nectworks',
        images: [
          {
            url: blogData.image.url || `${baseUrl}/nectworksOgImage.webp`,
            width: 1200,
            height: 630,
            alt: `Cover image for ${blogData.title}`,
          },
        ],
        locale: 'en_US',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: blogData.title,
        description: descriptionPreview,
        images: [blogData.image.url || `${baseUrl}/nectworksOgImage.webp`],
      },
      authors: [{ name: blogData.author }],
      publishedTime: blogData.createdOn,
      modifiedTime: blogData.lastUpdateOn,
    };
  } catch (error) {
    console.error('Error fetching blog data for metadata:', error);
    return {
      title: 'Blog Post | Nectworks',
      description: 'Read interesting articles on Nectworks',
    };
  }
}

export default function Layout({ children }) {
  return children;
}
