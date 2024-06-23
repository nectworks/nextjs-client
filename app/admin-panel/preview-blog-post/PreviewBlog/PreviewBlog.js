'use client';
/*
  File: PreviewBlog.js
  Description: This file contains a component used to preview the content
    of the blog
*/

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

function PreviewBlog() {
  const router = useRouter();
  const { content } = router.query;
  const [blogContent, setBlogContent] = useState('');

  useEffect(() => {
    if (typeof content === 'string') {
      setBlogContent(content);
    }
  }, [content]);

  return <div dangerouslySetInnerHTML={{ __html: blogContent }} />;
}

export default PreviewBlog;
