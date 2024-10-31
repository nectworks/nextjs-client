'use client';
/*
  File: ManageBlogPosts.js
  Description: This file consists of the page that displays the saved drafts and
  the blogs under review.
*/

import { useState, useEffect, useContext } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import AdminDashboardMenu from '../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import './ManageBlogPosts.css';
import { privateAxios } from '@/config/axiosInstance';
import { useRouter } from 'next/navigation';
import { AdminUserContext } from '@/context/AdminUserContext/AdminUserContext';
import showBottomMessage from '@/Utils/showBottomMessage';
import {
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiFillCloseCircle,
} from 'react-icons/ai';

function stripHtmlAndTruncate(html, maxLength = 100) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  return textContent.length > maxLength
    ? textContent.substring(0, maxLength) + '...'
    : textContent;
}

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
      showBottomMessage("Couldn't fetch drafts");
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
      showBottomMessage("Couldn't fetch blogs under review");
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
      showBottomMessage("Couldn't fetch blogs under review");
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

  async function handleDeleteDraft(blogId, event) {
    event.stopPropagation();
    try {
      const res = await privateAxios.delete(`/blog/delete/${blogId}`);
      showBottomMessage(res.data.message);
      setDrafts(drafts.filter((draft) => draft._id !== blogId));
    } catch (error) {
      let { message } = error?.response?.data;
      if (!message) {
        message = `Couldn't delete draft with id ${blogId}`;
      }
      showBottomMessage(message);
    }
  }

  async function handleDeleteReview(blogId, event) {
    event.stopPropagation();
    try {
      const res = await privateAxios.delete(`/blog/delete/${blogId}`);
      showBottomMessage(res.data.message);
      setBlogsUnderReview(
        blogsUnderReview.filter((blog) => blog._id !== blogId)
      );
    } catch (error) {
      let { message } = error?.response?.data;
      if (!message) {
        message = `Couldn't delete blog under review with id ${blogId}`;
      }
      showBottomMessage(message);
    }
  }

  async function hadleDeleteBlog(blogId) {
    try {
      const res = await privateAxios.delete(`/blog/delete/${blogId}`);
      showBottomMessage(res.data.message);
      setPublishedBlogs(publishedBlogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      let { message } = error?.response?.data;

      if (!message || message.length === 0) {
        message = `Couldn't delete blog with id ${blogId}`;
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

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div onClick={onClick} className={`arrow ${className}`}>
        <AiOutlineArrowLeft className="arrows" style={{ color: 'white' }} />
      </div>
    );
  }

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div onClick={onClick} className={`arrow ${className}`}>
        <AiOutlineArrowRight className="arrows" style={{ color: 'white' }} />
      </div>
    );
  }

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(drafts.length, 3),
    slidesToScroll: Math.min(drafts.length, 3),
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const reviewSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: blogsUnderReview.length,
    slidesToScroll: blogsUnderReview.length,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const publishedSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(publishedBlogs.length, 3),
    slidesToScroll: Math.min(publishedBlogs.length, 3),
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="manage_blog_outer_container">
      <AdminDashboardMenu />

      <div className="manage_blog_inner_container">
        <h1>Saved drafts</h1>

        {drafts.length > 0 ? (
          <Slider {...settings}>
            {drafts.map((blog, idx) => (
              <div className="blog_card" key={idx}>
                <button
                  onClick={(e) => handleDeleteDraft(blog._id, e)}
                  className="delete-button"
                >
                  <AiFillCloseCircle />
                </button>
                <img src={blog.image.url} alt={blog.title} />
                <div className="blog_content">
                  <h3>{blog.title}</h3>
                  <p>{stripHtmlAndTruncate(blog.content)}</p>
                  <div className="blog_metadata">
                    <span className="author">By {blog.author}</span>
                    <span className="date">
                      {new Date(blog.createdOn).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    className="cta_btn"
                    onClick={() =>
                      router.push(
                        `/admin-panel/create-blog-post?edit=true&blogId=${blog._id}`
                      )
                    }
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <p style={{ marginTop: '2rem', textAlign: 'center' }}>
            No drafts available.
          </p>
        )}

        <div style={{ marginTop: '2rem' }}>
          <h1>Blogs under review</h1>

          {blogsUnderReview.length > 0 ? (
            <Slider {...reviewSettings}>
              {blogsUnderReview.map((blog, idx) => (
                <div className="blog_card" key={idx}>
                  <button
                    onClick={(e) => handleDeleteReview(blog._id, e)}
                    className="delete-button"
                  >
                    <AiFillCloseCircle />
                  </button>
                  <img src={blog.image.url} alt={blog.title} />
                  <div className="blog_content">
                    <h3>{blog.title}</h3>
                    <p>{stripHtmlAndTruncate(blog.content)}</p>
                    <div className="blog_metadata">
                      <span className="author">By {blog.author}</span>
                      <span className="date">
                        {new Date(blog.createdOn).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="cta_group">
                      <button
                        className="cta_btn"
                        onClick={() => {
                          const encodedContent = encodeURIComponent(
                            blog.content
                          );
                          router.push(
                            `/admin-panel/preview-blog-post?content=${encodedContent}`
                          );
                        }}
                      >
                        Preview
                      </button>
                      {isAdmin && (
                        <button
                          className="cta_btn inverted"
                          onClick={() => publishBlogPost(blog._id)}
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p style={{ marginTop: '2rem', textAlign: 'center' }}>
              No blogs under review.
            </p>
          )}
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h1>Published blogs</h1>
          {publishedBlogs.length > 0 ? (
            <Slider {...publishedSettings}>
              {publishedBlogs.map((blog, idx) => (
                <div className="blog_card" key={idx}>
                  <Link href={`/blog/${blog._id}`} target="_blank">
                    <img src={blog.image.url} alt={blog.title} />
                    <div className="blog_content">
                      <h3>{blog.title}</h3>
                      <p>{stripHtmlAndTruncate(blog.content)}</p>
                      <div className="blog_metadata">
                        <span className="author">By {blog.author}</span>
                        <span className="date">
                          {new Date(blog.createdOn).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                  {isAdmin && (
                    <div className="cta_group">
                      <button
                        className="cta_btn"
                        onClick={() =>
                          router.push(
                            `/admin-panel/create-blog-post?edit=true&blogId=${blog._id}`
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="cta_btn_delete"
                        onClick={() => hadleDeleteBlog(blog._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </Slider>
          ) : (
            <p style={{ marginTop: '2rem', textAlign: 'center' }}>
              No published blogs.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageBlogPosts;