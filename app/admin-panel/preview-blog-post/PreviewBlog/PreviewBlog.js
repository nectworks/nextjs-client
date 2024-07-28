'use client';
/*
  File: PreviewBlog.js
  Description: This file contains a component used to preview the content
    of the blog
*/

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function PreviewBlog() {
  const searchParams = useSearchParams();
  const [blogContent, setBlogContent] = useState('');

  useEffect(() => {
    const content = searchParams.get('content');
    if (content) {
      setBlogContent(decodeURIComponent(content));
    }
  }, [searchParams]);

  return <div dangerouslySetInnerHTML={{ __html: blogContent }} />;
}

export default PreviewBlog;
