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
import { useRouter } from 'next/navigation';
import { Card, CardContent, Grid, TextField, Typography } from '@mui/material';

function CreateBlogPost() {
  const router = useRouter();

  // state to differentiate between new blog and old blog being edited
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);

  const editor = useRef(null);

  // state variables for blog details
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(''); // New state for author's name
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
      setAuthor(blog.author || ''); // Set author if available
      setTimeTakenToRead(blog.timeTakenToRead || 0);
      setContent(blog.content);
      setImageUrl(blog.imageUrl || ''); // Set image URL if available
    } catch (error) {
      showBottomMessage(`Couldn't fetch draft to edit`);
    }
  }

  // function to save the current blog as draft in database
  async function saveBlogAsDraft(updateBlog = false) {
    console.log('here');
    let url = `/blog/draft`;

    if (updateBlog === true) {
      url = `/blog/edit/${editingBlogId}`;
    }

    if (!title) {
      showBottomMessage('Title of blog post can not be empty');
      return;
    } else if (title.length < 20) {
      showBottomMessage('Title should be atleast 20 characters');
      return;
    }

    if (!author) {
      showBottomMessage('Author of blog post can not be empty');
      return;
    } else if (author.length < 10) {
      showBottomMessage('Author should be atleast 10 characters');
      return;
    }

    if (timeTakenToRead < 0) {
      showBottomMessage('Time taken to read should be atleast 0');
      return;
    }

    if (!content) {
      showBottomMessage('Content of blog post can not be empty');
      return;
    } else if (content.length < 100) {
      showBottomMessage('Content should be atleast 100 characters');
      return;
    }

    try {
      // const res = await privateAxios.post(url, {
      //   title,
      //   author, // Include author
      //   content,
      //   status: 'draft',
      //   timeTakenToRead,
      //   imageUrl, // Include image URL
      // });

      console.log(
        'response of the submit: ',
        title,
        author, // Include author
        content,
        timeTakenToRead,
        imageUrl // Include image URL
      );

      showBottomMessage(`Successfully submitted blog as draft`);
      setTitle('');
      setAuthor(''); // Clear author
      setContent('');
      setTimeTakenToRead(0);
      setImageUrl(''); // Clear image URL
    } catch (error) {
      showBottomMessage(`Couldn't submit blog as draft`);
    }
  }

  // function to submit the blog for review before publishing
  async function submitBlogToReview() {
    if (!title) {
      showBottomMessage('Title of blog post can not be empty');
      return;
    } else if (title.length < 20) {
      showBottomMessage('Title should be atleast 20 characters');
      return;
    }

    if (!author) {
      showBottomMessage('Author of blog post can not be empty');
      return;
    } else if (author.length < 10) {
      showBottomMessage('Author should be atleast 10 characters');
      return;
    }

    if (timeTakenToRead < 0) {
      showBottomMessage('Time taken to read should be atleast 0');
      return;
    }

    if (!content) {
      showBottomMessage('Content of blog post can not be empty');
      return;
    } else if (content.length < 100) {
      showBottomMessage('Content should be atleast 100 characters');
      return;
    }

    console.log('here');
    try {
      let url = `/blog/review`;
      let params = '';
      const data = {
        title,
        author, // Include author
        content,
        status: 'under review',
        timeTakenToRead,
        imageUrl, // Include image URL
      };

      if (isEditing === true) {
        params = `?edit=true&blogId=${editingBlogId}`;
        url += params;
      }

      const res = await privateAxios.post(url, data);

      showBottomMessage(`Successfully submitted blog for review`);
      setTitle('');
      setAuthor(''); // Clear author
      setContent('');
      setTimeTakenToRead(0);
      setImageUrl(''); // Clear image URL
    } catch (error) {
      showBottomMessage(`Couldn't submit blog for review`);
    }
  }

  async function handleImageUpload(e) {
    const profileImageField = document.getElementById('blog_image_field');
    const uploadedFile = profileImageField.files[0];
    console.log('uploaded Image: ', uploadedFile);

    try {
      if (!uploadedFile) {
        console.log('No file uploaded');
      }
      console.log('uploaded Image inside try: ', uploadedFile);
      // Fetch a signed URL for the image upload
      let res = await publicAxios.get('/blog/s3-url-put-blog', {
        headers: {
          fileContentType: uploadedFile.type,
          fileSubType: 'profile',
          fileName: uploadedFile.name,
          addTimeStamp: true, // add timestamp to the image name
        },
      });

      const { signedUrl, fileName } = res.data;

      // Upload the image to S3
      res = await fetch(signedUrl, {
        method: 'PUT',
        body: uploadedFile,
        headers: {
          'Content-Type': uploadedFile.type,
          'Content-Disposition': 'inline',
        },
      });

      if (res.status !== 200) {
        throw new Error("Couldn't upload file. Try again!!");
      }

      // Set the image URL in state
      setImageUrl(fileName);
      showBottomMessage('Image uploaded successfully');
    } catch (error) {
      console.error('Error in handleImageUpload: ', error);
      showBottomMessage("Couldn't upload image. Try again!!", error);
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
      setAuthor(''); // Clear author
      setContent('');
      setTimeTakenToRead(0);
      setImageUrl(''); // Clear image URL
    }
  }, [router]);

  return (
    <div className="create_blog_outer_container">
      <AdminDashboardMenu />
      <Card variant="elevation" style={{ padding: '20px', maxWidth: '1070px' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create a new blog post
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
                InputProps={{
                  style: {
                    borderRadius: '15px',
                    fontSize: '1rem',
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: 'grey',
                    fontWeight: 'normal',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'grey',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#0057b1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0057b1',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, 16px) scale(1)',
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -6px) scale(0.75)',
                      backgroundColor: 'white',
                      padding: '0 4px',
                    },
                  },
                  '& .MuiInputLabel-outlined': {
                    transform: 'translate(14px, 16px) scale(1)',
                  },
                  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                variant="outlined"
                InputProps={{
                  style: {
                    borderRadius: '15px',
                    fontSize: '1rem',
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: 'grey',
                    fontWeight: 'normal',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'grey',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#0057b1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0057b1',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, 16px) scale(1)',
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -6px) scale(0.75)',
                      backgroundColor: 'white',
                      padding: '0 4px',
                    },
                  },
                  '& .MuiInputLabel-outlined': {
                    transform: 'translate(14px, 16px) scale(1)',
                  },
                  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Time taken to read (minutes)"
                type="number"
                value={timeTakenToRead}
                onChange={(e) => setTimeTakenToRead(e.target.value)}
                variant="outlined"
                InputProps={{
                  style: {
                    borderRadius: '15px',
                    fontSize: '1rem',
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: 'grey',
                    fontWeight: 'normal',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'grey',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#0057b1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0057b1',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, 16px) scale(1)',
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -6px) scale(0.75)',
                      backgroundColor: 'white',
                      padding: '0 4px',
                    },
                  },
                  '& .MuiInputLabel-outlined': {
                    transform: 'translate(14px, 16px) scale(1)',
                  },
                  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="file"
                helperText="Upload Image"
                onChange={handleImageUpload}
                variant="outlined"
                InputProps={{
                  id: 'blog_image_field',
                  accept: 'image/*',
                  style: {
                    borderRadius: '15px',
                    fontSize: '1rem',
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: 'grey',
                    fontWeight: 'normal',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'grey',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#0057b1',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0057b1',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, 16px) scale(1)',
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -6px) scale(0.75)',
                      backgroundColor: 'white',
                      padding: '0 4px',
                    },
                  },
                  '& .MuiInputLabel-outlined': {
                    transform: 'translate(14px, 16px) scale(1)',
                  },
                  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                    transform: 'translate(14px, -6px) scale(0.75)',
                  },
                }}
              />
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Blog"
                  style={{ maxWidth: '100%', marginTop: 10 }}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={(newContent) => setContent(newContent)}
              />
            </Grid>
            <Grid item style={{ display: 'flex', gap: '10px' }}>
              <button
                variant="contained"
                onClick={
                  isEditing ? () => saveBlogAsDraft(true) : saveBlogAsDraft
                }
                className="save_btn"
              >
                {isEditing ? 'Update Draft' : 'Save as Draft'}
              </button>
              <button className="review_btn" onClick={submitBlogToReview}>
                Submit for Review
              </button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateBlogPost;
