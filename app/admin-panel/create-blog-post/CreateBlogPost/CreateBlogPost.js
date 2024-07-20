'use client';

/*
  File: CreateBlogPost.js
  Description: This file contains a rich text editor to create blog posts.
*/

import JoditEditor from 'jodit-react';
import AdminDashboardMenu from '../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import './CreateBlogPost.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { privateAxios } from '@/config/axiosInstance';
import showBottomMessage from '@/Utils/showBottomMessage';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

function CreateBlogPost() {
  const router = useRouter();

  // state to differentiate between new blog and old blog being editedc
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  const editor = useRef(null);

  // title of the blog
  const [title, setTitle] = useState('');

  // time taken to read the blog (in minutes)
  const [timeTakenToRead, setTimeTakenToRead] = useState(0);

  // this state holds the content in the editor
  const [content, setContent] = useState('');

  // all options from https://xdsoft.net/jodit/docs/,
  const config = useMemo(
    () => ({
      width: 1000,
      height: 700,
      readonly: false,
      showPlaceholder: false,
      hidePoweredByJodit: true,
      allowResizeX: true,
      allowResizeY: true,
      minWidth: 700,
      maxWidth: 1200,
      minHeight: 500,
      maxHeight: 1000,
      spellcheck: true,
    }),
    []
  );

  // function to fetch the blog that is being edited
  async function fetchBlogToEdit(blogId) {
    try {
      const res = await privateAxios.get(`/blog/edit/${blogId}`);
      const { blog } = res.data;

      setTitle(blog.title);
      setTimeTakenToRead(blog.timeTakenToRead || 0);
      setContent(blog.content);
    } catch (error) {
      showBottomMessage(`Couldn't fetch draft to edit`);
    }
  }

  // function to save the current blog as draft in database
  async function saveBlogAsDraft(updateBlog = false) {
    let url = `/blog/draft`;

    if (updateBlog === true) {
      url = `/blog/edit/${editingBlogId}`;
    }

    if (!title) {
      showBottomMessage('Title of blog post can not be empty');
      return;
    }

    if (!content) {
      showBottomMessage('Content of blog post can not be empty');
      return;
    }

    try {
      const res = await privateAxios.post(url, {
        title,
        content,
        status: 'draft',
        timeTakenToRead,
      });

      showBottomMessage(`Successfully submitted blog as draft`);
      setTitle('');
      setContent('');
      setTimeTakenToRead(0);
    } catch (error) {
      showBottomMessage(`Couldn't submit blog as draft`);
    }
  }

  // function to submit the blog for review before publishing
  async function submitBlogToReview() {
    try {
      let url = `/blog/review`;
      let params = '';
      const data = {
        title,
        content,
        status: 'under review',
        timeTakenToRead,
      };

      if (isEditing === true) {
        params = `?edit=true&blogId=${editingBlogId}`;
        url += params;
      }

      const res = await privateAxios.post(url, data);

      showBottomMessage(`Successfully submitted blog for review`);
      setTitle('');
      setContent('');
      setTimeTakenToRead(0);
    } catch (error) {
      showBottomMessage(`Couldn't submit blog for review`);
    }
  }

  // if the user is editing previously saved blog, fetch it and fill the state
  useEffect(() => {
    const isEditing = router?.query?.edit;
    const blogId = router?.query?.blogId;

    if (isEditing && isEditing === true.toString()) {
      setIsEditing(true);
      setEditingBlogId(blogId);
      fetchBlogToEdit(blogId);
    } else {
      setTitle('');
      setContent('');
      setTimeTakenToRead(0);
    }
  }, [router]);

  return (
    <div className="create_blog_outer_container">
      <AdminDashboardMenu />

      <div className="create_blog_inner_container">
        <h1>Create a new blog post</h1>

        <div className="create_blog_title_container">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            placeholder="Enter title of the blog"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="create_blog_title_container">
          <label htmlFor="timeTaken">
            Time taken to read the blog (in minutes)
          </label>
          <input
            type="number"
            value={timeTakenToRead}
            onChange={(e) => setTimeTakenToRead(e.target.value)}
          />
        </div>

        <JoditEditor
          className="jodit_editor"
          ref={editor}
          value={content}
          config={config}
          tabIndex={1}
          onChange={(newContent) => setContent(newContent)}
        />
        {isEditing === true ? (
          <button onClick={(e) => saveBlogAsDraft(true)}>Update draft</button>
        ) : (
          <button onClick={saveBlogAsDraft}>Save as draft</button>
        )}
        <button onClick={submitBlogToReview}>Submit for review</button>
      </div>
    </div>
  );
}

export default CreateBlogPost;
