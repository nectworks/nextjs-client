'use client';

/*
    FileName - Blog.js
    Desc - This file defines the Blog component that renders individual blog posts. 
    It fetches blog data from the server, manages state for the current blog and list 
    of all blogs, and provides navigation to previous and next blog posts. The component 
    includes social media sharing links, formatted timestamps, and dynamically displays 
    blog content using the fetched data. It also styles the blog post layout, integrates 
    social sharing icons, and manages navigation to adjacent blog posts.
*/

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import showBottomMessage from '@/Utils/showBottomMessage';
import { publicAxios } from '@/config/axiosInstance';
import Image from 'next/image';
import linkedinLogo from '@/public/socialsLogo/linkedinLogo.svg';
import twitterLogo from '@/public/socialsLogo/twitterLogo.svg';
import facebookLogo from '@/public/socialsLogo/facebookLogo.svg';
import {
  AiOutlineClockCircle,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from 'react-icons/ai';
import frame from '@/public/Frame.webp';
import './blog.css';

const Blog = () => {
  const params = useParams();
  const router = useRouter();
  const { blogId } = params;
  const [blogData, setBlogData] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [currentBlogIndex, setCurrentBlogIndex] = useState(null);

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const res = await publicAxios.get('/blog/all');
      setBlogs(res.data.blogs);
    } catch (error) {
      let { message } = error?.response?.data;
      if (!message) message = "Couldn't fetch blogs";
      showBottomMessage(message);
    }
  };

  // Fetch single blog data
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
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 0) {
      fetchBlog();
    }
  }, [blogs]);


  useEffect(() => {
    if (blogs.length > 0 && blogData) {
      const index = blogs.findIndex((blog) => createSlug(blog.title) === blogId);
      setCurrentBlogIndex(index);
    }
  }, [blogs, blogData]);

  const formattedDate = new Date(blogData?.lastUpdateOn).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const goToPreviousBlog = () => {
    if (currentBlogIndex > 0) {
      router.push(`/blog/${createSlug(blogs[currentBlogIndex - 1].title)}`);
    }
  };

  const goToNextBlog = () => {
    if (currentBlogIndex < blogs.length - 1) {
      router.push(`/blog/${createSlug(blogs[currentBlogIndex + 1].title)}`);
    }
  };

  const createSlug = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-');
  };

  if (!blogData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="blog-title-container">
        <div className="blog-title-frame">
          <Image
            src={blogData.image.url}
            alt="Frame"
            width={395}
            height={300}
          />
        </div>
        <div className="blog-title-content">
          <h1 className="blog-title">{blogData.title}</h1>
          <p className="timestamp">Posted by {blogData.author}</p>
          <p className="timestamp">
            Last Updated {formattedDate} | <AiOutlineClockCircle />{' '}
            {blogData.timeTakenToRead} min read
          </p>
        </div>
      </div>
      <div className="blog-container">
        <div className="social-share">
          <div className="social-icons">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blogData.title)}&url=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={twitterLogo} alt="Twitter" width={20} height={20} />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={facebookLogo} alt="Facebook" width={20} height={20} />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${window.location.href}&title=${encodeURIComponent(blogData.title)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src={linkedinLogo} alt="LinkedIn" width={20} height={20} />
            </a>
          </div>
        </div>
        <div className="blog-content">
          <div
            className="blog-text"
            dangerouslySetInnerHTML={{ __html: blogData.content }}
          />
        </div>
      </div>
      <div className="navigation-container">
        {currentBlogIndex > 0 && (
          <div className="navigation-button-left" onClick={goToPreviousBlog}>
            <AiOutlineArrowLeft className="icon" />
            <div className="navigation-content">
              <span className="navigation-text">Previous Article</span>
              <div className="navigation-title">
                {blogs[currentBlogIndex - 1].title}
              </div>
            </div>
          </div>
        )}
        <div className="navigation-divider"></div>
        {currentBlogIndex < blogs.length - 1 && (
          <div className="navigation-button-right" onClick={goToNextBlog}>
            <div className="navigation-content">
              <span className="navigation-text">Next Article</span>
              <div className="navigation-title">
                {blogs[currentBlogIndex + 1].title}
              </div>
            </div>
            <AiOutlineArrowRight className="icon" />
          </div>
        )}
      </div>
      <div className="tags-container">
        <span className="tags-label">Tags: </span>
        {blogData.tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag}
            {index < blogData.tags.length - 1 && (
              <span className="tag-divider">&nbsp;|</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Blog;
