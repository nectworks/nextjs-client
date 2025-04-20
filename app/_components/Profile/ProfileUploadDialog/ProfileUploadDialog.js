'use client';
/*
  File: ProfileUploadDialog.js
  Description: This component contains the window that is displayed to
  upload profile image with options 'change image', 'save' and 'delete'
*/

import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import deleteIcon from '@/public/Profile/deleteIcon.svg';
import profileUploadIcon from '@/public/Profile/profileUploadIcon.svg';
import './ProfileUploadDialog.css';
import Image from 'next/image';
import ProfileImage from '../ProfileImage/ProfileImage';
import { useContext, useRef, useState } from 'react';
import { UserContext } from '@/context/User/UserContext';
import ClipLoader from 'react-spinners/ClipLoader';
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
import showBottomMessage from '@/Utils/showBottomMessage';
import usePrivateAxios from '@/Utils/usePrivateAxios';

function ProfileUploadDialog({ setOpenFileUploadDialog }) {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const privateAxios = usePrivateAxios();

  /*
    Process flow of how image is previewed, edited and saved.
    (1). When the user uploads a image, it is previewed first.
    (2). If the user chooses to crop the image, then he can do so.
        - After cropping the image we get a dataURL of cropped image, which
          should be previewed again. We reuse the preview function previously
          defined and modify it to not only accept a file (blob), but
          also dataURL.
        - Here, if the user is not satisfied with the crop, he can crop again
          and continue from step (2).
    (3) The user can save after previewing the image.
  */

  // this contains the content of the uploaded image as dataURL
  const [imageContent, setImageContent] = useState('');

  // store cropper instance and croppedImage content
  const [cropperInstance, setCropperInstance] = useState(null);
  const [croppedImg, setCroppedImg] = useState(null);

  // state to show the user that the image is being uploaded
  const [isUploading, setIsUploading] = useState(false);

  // message to update user about various events
  const [message, setMessage] = useState('');

  const uploadPreview = useRef();

  /*
    Stages.
    (1). Preview already uploaded image [upload, delete]
    (2). Upload a image and preview it [edit, save, cancel]
        - 'edit': should take user to crop
        - 'save': save the profile image
        - 'cancel': go back to preview of old image
    (3). Cropping a image [crop, cancel]
        - 'crop': crop the image and preview cropped image
        - 'cancel': cancel crop and preview uploaded image
  */

  const [stage, setStage] = useState(1);

  // function to preview profile image
  function previewProfileImage(uploadedFile, imageDataURL) {
    setStage(2); // previewing uploaded image
    setIsUploading(true);
    setMessage('Loading image preview...');

    // FileReader to read file from user.
    const reader = new FileReader();

    // attach event listener, fired when file has been read successfully
    reader.addEventListener('load', () => {
      // set the source to preview
      uploadPreview.current.src = reader.result;

      // save the image content as it is useful for cropping image
      setImageContent(reader.result);

      // remove the loader and message
      setMessage('');
      setIsUploading(false);
    });

    // read only if the file is uploaded, else the parameter contains a data url
    if (uploadedFile) {
      reader.readAsDataURL(uploadedFile);
    } else if (imageDataURL) {
      uploadPreview.current.src = imageDataURL;

      // remove the loader and message
      setMessage('');
      setIsUploading(false);
    }
  }

  // function to save profile image on the backend
  async function saveProfileImage(e) {
    const profileImageField = document.getElementById('profile_image_field');
    const uploadedFile = profileImageField.files[0];

    setMessage('');
    setIsUploading(true);

    try {
      // Uploading a profile include these steps

      // (1). Fetch a signed url
      let res = await privateAxios.get('/file/s3-url-put', {
        headers: {
          fileContentType: uploadedFile.type,
          fileSubType: 'profile',
          fileName: uploadedFile.name,
          addTimeStamp: true, // add time stamp to profile image
        },
      });

      const { signedUrl, fileName } = res.data;

      // (2). Using the signed url upload the file directly to s3
      const fileBody = croppedImg !== null ? croppedImg : uploadedFile;

      res = await fetch(signedUrl, {
        method: 'PUT',
        body: fileBody,
        headers: {
          'Content-Type': uploadedFile.type,
          'Content-Disposition': 'inline',
        },
      });

      if (res.status !== 200) {
        throw new Error("Couldn't upload file. Try again!!");
      }

      // (3). Send info after successful file upload to the server
      res = await privateAxios.post(
        `/profile/upload-profile/?fileName=${fileName}`,
        {},
        {
          headers: {
            fileContentType: uploadedFile.type,
            fileSubType: 'profile',
          },
        }
      );

      setIsUploading(false);

      if (res.status === 200) {
        const newProfileImageUrl = res.data.url;
        // update user's profile
        setUser({
          ...user,
          profile: newProfileImageUrl,
        });

        // close the popup
        setOpenFileUploadDialog(false);

        showBottomMessage('Profile uploaded successfully');
      } else {
        throw new Error("Couldn't save profile information. Try again!!");
      }
    } catch (error) {
      setIsUploading(false);
      setMessage("Couldn't upload profile. Try again!!");
    }
  }

  // function to delete profile image on the backend
  async function deleteProfileImage(e) {
    setIsUploading(true);

    try {
      const res = await privateAxios.delete('/profile/delete-profile');

      setIsUploading(false);

      if (res.status === 200) {
        setMessage('Profile deleted successfully');

        // update user's profile
        setUser({
          ...user,
          profile: null,
        });
      }
    } catch (error) {
      setIsUploading(false);
      setMessage("Couldn't delete profile image");
    }
  }

  // function to crop profile image
  function initiateCropping() {
    // add source to the crop input image tag
    const inputImage = document.getElementById('crop_input');
    inputImage.src = imageContent;

    // initialise cropper with custom options
    if (cropperInstance === null) {
      const cropper = new Cropper(inputImage, {
        aspectRatio: 1,
        viewMode: 2,
        background: false,
      });

      // add cropper instance to the state, only one instance per element works.
      setCropperInstance(cropper);
    }

    // limit the zoom level
    inputImage.addEventListener('zoom', (event) => {
      const { ratio } = event.detail;
      if (ratio > 0.15) {
        event.preventDefault();
      }
    });
  }

  function dataURItoBlob(dataURI) {
    /* convert base64/URLEncoded data component to raw binary
    data held in a string */
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  function cropImage() {
    if (!cropperInstance) {
      setMessage("Couldn't crop image");
      return;
    }

    // get the cropped section of the image
    const croppedImage = cropperInstance
      .getCroppedCanvas()
      .toDataURL('image/jpeg');

    // croppedImage is of type dataURL, convert it to blob
    const blob = dataURItoBlob(croppedImage);

    // store the croppedImage in state and preview it
    setCroppedImg(blob); // store blob in state to upload to s3
    previewProfileImage(null, croppedImage);

    // editing is finished back to preview the cropped image.
    setStage(2);
  }

  return (
    <div className="dashboard_profile_dialog_container">
      <div className="dashboard_profile_dialog_window">
        <div className="dashboard_profile_dialog_header">
          <h3>Profile photo</h3>
          <Image
            src={crossIcon}
            onClick={() => setOpenFileUploadDialog((prevVal) => !prevVal)}
            alt="close profile upload dialog"
          />
        </div>

        {/* show the preview of current profile image */}
        <div className="dashboard_profile_dialog_preview">
          {/* This shows the preview of the image uploaded by the user */}
          <Image
            ref={uploadPreview}
            className="profile_upload_preview"
            style={{ display: stage === 2 ? 'block' : 'none' }}
            alt="preview of uploaded image"
          />

          {/* This displays the existing profile image */}
          {stage === 1 && <ProfileImage isLoggedInUser={true} />}

          {/* Container to crop images */}
          <div
            id="crop_image_container"
            style={{ display: stage === 3 ? 'block' : 'none' }}
          >
            <div>
              <Image id="crop_input" src="" alt="crop image" />
            </div>
          </div>

          {message.length > 0 && (
            <span
              id="profile_image_message"
              style={{ display: 'block', margin: '1rem -1rem' }}
            >
              {' '}
              {message}
            </span>
          )}

          {/* loader to show user that the image is being uploaded */}
          {isUploading && (
            <ClipLoader className="profile_image_loader" size={25} />
          )}
        </div>

        <hr />
        <div className="dashboard_profile_dialog_options">
          <input
            id="profile_image_field"
            type="file"
            accept=".jpg, .jpeg, .png"
            name="profileImage"
            onInput={(e) => previewProfileImage(e.target.files[0], null)}
            style={{ display: 'none' }}
          />

          {/* Upload button */}
          {stage === 1 && (
            <button
              className="dashboard_profile_dialog_upload_button"
              onClick={(e) => {
                document.getElementById('profile_image_field').click();
              }}
            >
              <Image src={profileUploadIcon} alt="upload profile image" />
              <span>Upload Image</span>
            </button>
          )}

          {/* Delete button */}
          {stage === 1 && (
            <button
              style={{
                display: user?.profile ? 'flex' : 'none',
              }}
              className="dashboard_profile_dialog_delete_button"
              onClick={deleteProfileImage}
            >
              <Image
                style={{ margin: 0 }}
                src={deleteIcon}
                alt="delete profile image"
              />
            </button>
          )}

          {/* Edit image button */}
          {stage === 2 && (
            <button
              className="dashboard_profile_dialog_edit_button"
              onClick={(e) => {
                setStage(3);
                initiateCropping();
              }}
            >
              <span>Edit</span>
            </button>
          )}

          {/* Crop image */}
          {stage === 3 && (
            <button
              className="dashboard_profile_dialog_crop_button"
              onClick={cropImage}
            >
              <span>Crop</span>
            </button>
          )}

          {/* Save image */}
          {stage === 2 && (
            <button
              className="dashboard_profile_dialog_save_button"
              onClick={saveProfileImage}
            >
              <span>Save</span>
            </button>
          )}

          {/* Cancel image */}
          {(stage === 2 || stage === 3) && (
            <button
              className="dashboard_profile_dialog_cancel_button"
              onClick={(e) => {
                /* if uploaded image was previewed, and cancel was clicked
                  take the user back to previewing their original profile */
                if (stage === 2) {
                  // clear the input field, if the user clicks 'cancel' on preview stage
                  document.getElementById('profile_image_field').value = '';

                  setStage(1);
                } else if (stage === 3) {
                  /* if cancel was pressed while editing, abort the edit */
                  setCroppedImg(null);
                  setStage(2);
                }
              }}
            >
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileUploadDialog;
