'use client';
/*
  File: ManageBlogPosts.js
  Description: This file consists of the page that displays the saved drafts and
  the blogs under review.
*/

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import AdminDashboardMenu from '../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import './ManageBlogPosts.css';
import { privateAxios } from '@/config/axiosInstance';
import { useRouter } from 'next/navigation';
import { AdminUserContext } from '@/context/AdminUserContext/AdminUserContext';
import showBottomMessage from '@/Utils/showBottomMessage';

function ManageBlogPosts() {
  const router = useRouter();

  const [admin, setAdmin] = useContext(AdminUserContext);

  const [drafts, setDrafts] = useState([]);
  const [blogsUnderReview, setBlogsUnderReview] = useState([]);
  const [publishedBlogs, setPublishedBlogs] = useState([]);

  // state to indicate if the logged in user is the admin
  const [isAdmin, setIsAdmin] = useState(false);

  // function to fetch all the saved drafts
  async function fetchAllDrafts() {
    try {
      const res = await privateAxios.get('/blog/drafts');

      if (res.status === 200) {
        setDrafts(res.data.drafts);
      }
    } catch (error) {
      showBottomMessage(`Couldn't fetch drafts`);
    }
  }

  // function to fetch all the blogs submitted for review
  async function fetchBlogsUnderReview() {
    try {
      const res = await privateAxios.get('/blog/review');

      if (res.status === 200) {
        setBlogsUnderReview(res.data.blogs);
      }
    } catch (error) {
      showBottomMessage(`Couldn't fetch blogs under review`);
    }
  }

  // function to fetch all the blogs published so far
  async function fetchPublishedBlogs() {
    try {
      const res = await privateAxios.get('/blog/publish');

      if (res.status === 200) {
        setPublishedBlogs(res.data.blogs);
      }
    } catch (error) {
      showBottomMessage(`Couldn't fetch blogs under review`);
    }
  }

  // function to publish a blog post
  async function publishBlogPost(blogId) {
    try {
      const res = await privateAxios.post(`/blog/publish/${blogId}`);

      showBottomMessage(res.data.message);

      // remove the blog from the array of blogs under review
      const updatedBlogsUnderReview = blogsUnderReview.filter((blog) => {
        return blog._id !== blogId;
      });

      setBlogsUnderReview(updatedBlogsUnderReview);
    } catch (error) {
      let { message } = error?.response?.data;

      if (!message || message.length === 0) {
        message = `Couldn't publish blog with id ${blogId}`;
      }

      showBottomMessage(message);
    }
  }

  useEffect(() => {
    fetchAllDrafts().then(fetchBlogsUnderReview).then(fetchPublishedBlogs);

    // check if the loggedin user is an admin
    if (admin?.role?.privilegeLvl === 1) {
      setIsAdmin(true);
    }
  }, [admin?.role?.privilegeLvl]);

  return (
    <div className="manage_blog_outer_container">
      <AdminDashboardMenu />

      <div className="manage_blog_inner_container">
        <h1>Saved drafts</h1>

        {drafts.map((blog, idx) => {
          return (
            <div className="blog_draft" key={idx}>
              <p>
                {blog.title}
                <button
                  onClick={() => {
                    router.push(
                      `/admin-panel/create-blog-post?edit=true&blogId=${blog._id}`
                    );
                    return;
                  }}
                >
                  Edit
                </button>
              </p>
            </div>
          );
        })}

        <h1>Blogs under review</h1>

        {blogsUnderReview.map((blog, idx) => {
          return (
            <div className="blog_draft" key={idx}>
              <p>
                {blog.title}
                <button
                  onClick={() => {
                    const encodedContent = encodeURIComponent(blog.content);
                    router.push(
                      `/admin-panel/preview-blog-post?content=${encodedContent}`
                    );
                  }}
                >
                  Preview
                </button>

                {isAdmin === true && (
                  <button onClick={(e) => publishBlogPost(blog._id)}>
                    Publish
                  </button>
                )}
              </p>
            </div>
          );
        })}

        <h1>Published blogs</h1>
        {publishedBlogs?.map((blog, idx) => {
          return (
            <>
              <Link
                target="_blank"
                href={`/blog/${blog._id}`}
                style={{ textDecoration: 'underline' }}
              >
                {blog.title}
              </Link>
              <br />
            </>
          );
        })}
      </div>
    </div>
  );
}

export default ManageBlogPosts;
