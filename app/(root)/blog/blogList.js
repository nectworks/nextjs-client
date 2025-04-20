'use client';
/*
  File: BlogList.js
  Description: This page displays a list of all published blogs.
*/

import { useEffect, useState } from 'react';
import Link from 'next/link';
import showBottomMessage from '@/Utils/showBottomMessage';
import { publicAxios } from '@/config/axiosInstance';
import Image from 'next/image';
import './blogList.css'; // Import CSS module

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 8;

  async function fetchBlogs() {
    try {
      const res = await publicAxios.get(`/blog/all`);
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

  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const viewingCount = () => {
    const start = (currentPage - 1) * blogsPerPage + 1;
    const end = Math.min(currentPage * blogsPerPage, blogs.length);
    return `Viewing ${start} - ${end} of ${blogs.length}`;
  };

  const createSlug = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="blogList">
      <h1 className="title">Nectworks Blog</h1>
      <div className="blogGrid">
        {currentBlogs.map((blog, index) => (
          <div key={`${blog._id}-${index}`} className="blogCard">
            {blog.image && blog.image.url && (
              <Image
                src={blog.image.url}
                alt={blog.title}
                width={400}
                height={200}
                className="blogImage"
              />
            )}
            <div className="blogCard-header">
              <h2 className="blogTitle">
                <Link href={`/blog/${createSlug(blog.title)}`}>{blog.title}</Link>
              </h2>
              <div className="blogExcerpt">
                <div
                  dangerouslySetInnerHTML={{
                    __html: getSnippet(blog.content, 30),
                  }}
                ></div>
                <Link href={`/blog/${createSlug(blog.title)}`} className="readMore">
                  Read more
                </Link>
              </div>
            </div>
            <div className="blogCard-footer">
              <p className="blogAuthor">{blog.author}</p>
              <p className="blogDate">{formattedDate(blog.createdOn)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          className="pageButton"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(
            Math.max(0, currentPage - 2),
            Math.min(totalPages, currentPage + 1)
          )
          .map((page) => (
            <button
              key={page}
              className={`pageButton ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        <button
          className="pageButton"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
      <div className="viewingCount">{viewingCount()}</div>
    </div>
  );
}

export default BlogList;
