'use client';
/*
  File: BlogList.js
  Description: This page displays a list of all published blogs.
*/

import { useEffect, useState } from 'react';
import Link from 'next/link';
import showBottomMessage from '@/Utils/showBottomMessage';
import { publicAxios } from '@/config/axiosInstance';
import './blogList.css'; // Import CSS module

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  async function fetchBlogs() {
    try {
      const res = await publicAxios.get(`/blog/all`);
      console.log('blogs: ', res.data.blogs);
      setBlogs(res.data.blogs);
    } catch (error) {
      let { message } = error?.response?.data;
      if (!message) message = "Couldn't fetch blogs";

      showBottomMessage(message);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  const getSnippet = (html, wordCount) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.split(' ').slice(0, wordCount).join(' ') + ' ...';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const currentBlogs = blogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  return (
    <div className="blogList">
      <h1 className="title">Published Blogs</h1>
      <div className="blogGrid">
        {currentBlogs.map((blog, index) => (
          <div key={`${blog._id}-${index}`} className="blogCard">
            <h2 className="blogTitle">
              <Link href={`/blog/${blog._id}`}>{blog.title}</Link>
            </h2>
            <p className="blogDate">
              {new Date(blog.createdOn).toLocaleDateString()}
            </p>
            <div className="blogExcerpt">
              <div
                dangerouslySetInnerHTML={{
                  __html: getSnippet(blog.content, 50),
                }}
              ></div>
              <Link href={`/blog/${blog._id}`} className="readMore">
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`pageButton ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
