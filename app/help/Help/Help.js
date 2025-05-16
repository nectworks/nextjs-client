'use client';

/*
  FileName - Help.js
  Desc - This component serves as a user interface for requesting help or
  support within the web application, allowing users to describe their issues,
  upload files if necessary, and submit their requests for assistance.
  It handles user interactions, communicates with the server, and
  provides feedback to the user throughout the process.
*/

import { useEffect, useRef, useState } from 'react';
import DashboardMenu from '../../_components/DashboardMenu/DashboardMenu';
import './Help.css';
import Image from 'next/image';
import green_tick from '@/public/greenTick.svg';
import ClipLoader from 'react-spinners/ClipLoader';
import ProfileHeaderWrapper from '@/app/_components/ProfileHeaderWrapper/ProfileHeaderWrapper';
import showBottomMessage from '@/Utils/showBottomMessage';
import checkFileSize from '@/Utils/checkFileSize';
import checkFileExtension from '@/Utils/checkFileExtension';
import Link from 'next/link';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import sendGAEvent from '@/Utils/gaEvents';

const Help = () => {
  const privateAxios = usePrivateAxios();

  const [isButtonActive, setIsButtonActive] = useState(false);
  const [heading, setHeading] = useState(''); // State for heading input
  const [description, setDescription] = useState(''); // State for description input
  const maxHeadingCharacters = 100; // Maximum character limit for the heading
  const maxDescriptionCharacters = 800; // Maximum character limit for the description
  const [isHeadingValid, setIsHeadingValid] = useState(true); // State to track heading validity
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const handleTextareaChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxDescriptionCharacters) {
      setIsButtonActive(true);
      setDescription(inputText); // Update description state
    }
  };

  const handleHeadingChange = (e) => {
    const inputText = e.target.value;
    if (!inputText) {
      setIsHeadingValid(false);
    }
    if (inputText) {
      setIsHeadingValid(true);
    }
    if (inputText.length <= maxHeadingCharacters) {
      setIsButtonActive(true);
      setHeading(inputText); // Update heading state
    }
  };

  // Function for uploading the file
  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      if (checkFileExtension(uploadedFile, false)) {
        // Valid file extension, set the file and clear any previous error
        setUploadedFileName(uploadedFile.name);
      } else {
        // Invalid file extension, show an error
        setUploadedFileName(null);
        showBottomMessage(
          'Please upload a file with a .jpg, .jpeg, or .png extension.'
        );
        return;
      }

      if (checkFileSize(uploadedFile) === false) {
        // Display an error message or take the appropriate action
        showBottomMessage(
          'File size exceeds 5MB. Please select a smaller file.'
        );
        return;
      }
    }
    setUploadedFile(uploadedFile);
    setFileUploaded(true);
  };

  const uploadFile = async () => {
    let res = await privateAxios.get(`/file/s3-url-put`, {
      headers: {
        fileContentType: uploadedFile.type,
        fileSubType: 'other',
        fileName: uploadedFile.name,
        addTimeStamp: true,
      },
    });

    const { signedUrl, fileName } = res.data;

    res = await fetch(signedUrl, {
      method: 'PUT',
      body: uploadedFile,
      headers: {
        'Content-Type': uploadedFile.type,
        'Content-Disposition': 'inline',
      },
    });

    if (res.status !== 200) {
      throw new Error(`Couldn't upload file. Try again!!`);
    }

    res = await privateAxios.post(
      `/others/help/upload-image/?fileName=${fileName}`,
      {},
      {
        headers: {
          fileContentType: uploadedFile.type,
          fileSubType: 'other',
        },
      }
    );

    if (res.status === 200) {
      return res.data.attachmentId;
    } else {
      showBottomMessage(`Couldn't upload file`);
      return -1;
    }
  };

  // Function for sending the contents of help request
  const handleButtonClick = async () => {
    sendGAEvent('help');

    if (!heading) {
      // Check if heading is empty
      setIsHeadingValid(false); // Set heading as invalid
      return; // Exit function to prevent further processing
    }
    setIsHeadingValid(true); // Set heading as valid
    setIsButtonActive(true);
    setIsLoading(true);

    try {
      let attachmentId = null;

      if (uploadedFile) {
        attachmentId = await uploadFile();
        if (attachmentId === -1) return;
      }

      setIsLoading(false);
      setRequestSent(true);

      const res = await privateAxios.post(`/others/help`, {
        heading,
        description,
        attachment: attachmentId,
      });

      if (res.status === 200) {
        showBottomMessage('Your response has been recorded!');
        setDescription('');
        setHeading('');
        setUploadedFileName('');
        setRequestSent(false);
        setFileUploaded(false);
        setRequestUnderProcess(true);
      }
    } catch (err) {
      setRequestSent(false);
      setIsLoading(false);
    }
  };

  const [requestUnderProcess, setRequestUnderProcess] = useState(false);

  const getUserData = async () => {
    try {
      const res = await privateAxios.get(`/others/help`);

      /* if the previous issue submitted by the user is still not resolved, display a message
        and do not allow user to submit another help request
      */

      const { data } = res.data;

      if (data && data?.status === 'pending') {
        setRequestUnderProcess(true);
      } else {
        setRequestUnderProcess(false);
      }
    } catch (err) {
      showBottomMessage(`Couldn't fetch previously submitted data...`);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="dashboard_outer_container">
      <DashboardMenu />
      <div className="starting_heading">
        {/* Use the ProfileHeaderWrapper instead of ProfileHeader directly */}
        <ProfileHeaderWrapper />
        <div className="helpContainer">
          <h3>Help</h3>
          {!requestUnderProcess ? (
            <p>
              Encountering an issue? Don&apos;t worry; we&apos;ve got you
              covered! Let us know.
            </p>
          ) : (
            <div>
              <p>
                Your message means a lot to us! We&apos;re actively working on
                your query, and if we need any extra info, we&apos;ll reach out.
              </p>
              <p style={{ marginTop: '2px' }}>
                In the meantime, feel free to explore Nectworks, and if
                you&apos;ve got any thoughts or feedback to share, we&apos;re
                all ears and here to listen!
              </p>
            </div>
          )}
          {requestUnderProcess && (
            <div className="underProcessingBlock">
              <Link href="/feedback">
                <button>Feedback</button>
              </Link>
            </div>
          )}

          {!requestUnderProcess && (
            <div className="heading_inputbox" style={{ marginTop: '20px' }}>
              <h3>
                Heading<span className="span_help">*</span>
              </h3>
              <input
                type="text"
                className={`straight-line-input ${isHeadingValid ? '' : ' invalid'}`} // Add "invalid" class if heading is not valid
                placeholder=""
                maxLength={maxHeadingCharacters} // Set the maximum character limit
                onChange={handleHeadingChange} // Add onChange event handler
                value={heading} // Bind the input value to the state
              />
              {!isHeadingValid && (
                <p className="error-mms">
                  Please fill in the mandatory heading.
                </p>
              )}
              <h3 style={{ marginTop: '20px' }}>Description</h3>
              <textarea
                rows={10}
                cols={132}
                className="text_area non-resizable"
                style={{ resize: 'none' }}
                wrap="soft"
                maxLength={maxDescriptionCharacters} // Set the maximum character limit
                placeholder="Tell us more about your concern"
                onChange={handleTextareaChange}
                value={description} // Bind the textarea value to the state
              />
              <div className="btn-Help">
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png" // Set accepted file types here
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                />
                <button
                  className={`Help-btn${isButtonActive ? ' active' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                >
                  Upload Image
                </button>
                <button
                  className={`Help-btn${isButtonActive ? ' active' : ''}`}
                  onClick={handleButtonClick}
                >
                  {isLoading ? <ClipLoader size={12} /> : 'Send'}
                </button>
              </div>
              {fileUploaded && (
                <p className="upload-message">
                  <span>{uploadedFileName}</span>
                  {requestSent && (
                    <Image
                      src={green_tick}
                      alt="File uploaded"
                      className="greenTick"
                    />
                  )}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;