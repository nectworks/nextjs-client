'use client';
/*
  File: CreateBlogPost.js
  Description: This file contains a rich text editor to create blog posts.
*/

import JoditEditor from 'jodit-react';
import AdminDashboardMenu from '../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import './CreateBlogPost.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { privateAxios, publicAxios } from '@/config/axiosInstance';
import showBottomMessage from '@/Utils/showBottomMessage';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

function CreateBlogPost() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // state to differentiate between new blog and old blog being edited
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  const editor = useRef(null);

  // state variables for blog details
  const [title, setTitle] = useState('');
  const [timeTakenToRead, setTimeTakenToRead] = useState(0);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // New state for image file
  const [imageUrl, setImageUrl] = useState(''); // New state for image URL

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
      setImageUrl(blog.imageUrl || ''); // Set image URL if available
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
      // const res = await privateAxios.post(url, {
      //   title,
      //   content,
      //   status: 'draft',
      //   timeTakenToRead,
      //   imageUrl, // Include image URL
      // });
      console.log('Data to submit saveBlogAsDraft: ', {
        title,
        content,
        timeTakenToRead,
        imageUrl, // Include image URL
      });
      showBottomMessage(`Successfully submitted blog as draft`);
      setTitle('');
      setContent('');
      setTimeTakenToRead(0);
      setImageUrl(''); // Clear image URL
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
        imageUrl, // Include image URL
      };

      if (isEditing === true) {
        params = `?edit=true&blogId=${editingBlogId}`;
        url += params;
      }

      console.log('Data to submit submitBlogToReview: ', data);

      // const res = await privateAxios.post(url, data);

      showBottomMessage(`Successfully submitted blog for review`);
      setTitle('');
      setContent('');
      setTimeTakenToRead(0);
      setImageUrl(''); // Clear image URL
    } catch (error) {
      showBottomMessage(`Couldn't submit blog for review`);
    }
  }

  async function handleImageUpload(e) {
    const blogImageField = document.getElementById('blog_image_field');
    const uploadedFile = blogImageField.files[0];

    try {
      if (!uploadedFile) {
        console.log('No file uploaded');
        return;
      }

      console.log('Uploaded Image inside try: ', uploadedFile);

      // Step 1: Fetch the signed URL from the backend
      let res = await publicAxios.get('/blog/s3-url-put-blog', {
        headers: {
          fileContentType: uploadedFile.type,
          fileSubType: 'blog',
          fileName: uploadedFile.name,
          addTimeStamp: true,
        },
      });

      console.log('Response of the signed URL: ', res);
      const { signedUrl, fileName } = res.data;

      // Step 2: Upload the file directly to S3 using the signed URL
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: uploadedFile,
        headers: {
          'Content-Type': uploadedFile.type,
          'Content-Disposition': 'inline',
        },
      });

      if (uploadRes.status !== 200) {
        throw new Error("Couldn't upload file. Try again!!");
      }

      console.log('Uploaded Image uploadRes: ', uploadRes);

      // Step 3: Notify the backend that the image has been uploaded
      const uploadResponse = await publicAxios.post(
        `/blog/upload-image/?fileName=${fileName}`,
        {},
        {
          headers: {
            fileContentType: uploadedFile.type,
            fileSubType: 'blog',
          },
        }
      );
      console.log('Response of the uploaded image final: ', uploadResponse);
      if (res.status !== 200) {
        throw new Error("Couldn't save image info. Try again!!");
      }

      // Update the UI with the new image URL or other relevant information
      const { url } = res.data;
      setImageUrl(url); // Set the URL or filename for the blog image
      showBottomMessage('Image uploaded successfully');
    } catch (error) {
      console.error('Error in handleImageUpload: ', error);
      showBottomMessage("Couldn't upload image. Try again!!", error);
    }
  }

  // if the user is editing previously saved blog, fetch it and fill the state
  useEffect(() => {
    const isEditing = searchParams.get('edit');
    const blogId = searchParams.get('blogId');

    if (isEditing && isEditing === 'true') {
      setIsEditing(true);
      setEditingBlogId(blogId);
      fetchBlogToEdit(blogId);
    } else {
      setTitle('');
      setContent('');
      setTimeTakenToRead(0);
      setImageUrl(''); // Clear image URL
    }
  }, [searchParams]);

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

        <div className="create_blog_time_container">
          <label htmlFor="timeTaken">
            Time taken to read the blog (in minutes)
          </label>
          <input
            type="number"
            value={timeTakenToRead}
            onChange={(e) => setTimeTakenToRead(e.target.value)}
          />
        </div>

        <div className="create_blog_image_container">
          <label htmlFor="image">Upload Image</label>
          <input
            id="blog_image_field"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {imageUrl && (
            <img src={imageUrl} alt="Blog" style={{ maxWidth: '100%' }} />
          )}
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
