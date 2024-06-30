'use client';

/*
  File: Blog.js
  Description: This page displays the blog post by taking
  the id from the url
*/

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import showBottomMessage from '@/Utils/showBottomMessage';
import { publicAxios } from '@/config/axiosInstance';

const Blog = () => {
  const params = useParams();
  const { blogId } = params;
  const [blogData, setBlogData] = useState(null);

  const fetchBlog = async () => {
    try {
      const res = await publicAxios.get(`/blog/${blogId}`);
      setBlogData(res.data.blog);
    } catch (error) {
      let { message } = error?.response?.data;
      if (!message) message = `Couldn't fetch blog by id: ${blogId}`;

      showBottomMessage(message);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: blogData?.content }} />;
};

export default Blog;
