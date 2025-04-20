'use client';
/*
  File: ProfileAchievements.js
  Description: This file contains the pop up window to add 'achievement'
  in the user's profile.
*/
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import './ProfileAchievements.css';
import { ProfileContext } from '@/context/UpdateProfile/ProfileContext';
import fileUploadIcon from '@/public/Profile/fileUploadIcon.svg';
import { DashboardContext } from '@/context/Dashboard/DashboardContext';
import ClipLoader from 'react-spinners/ClipLoader';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import { useRouter } from 'next/navigation';
import documentLinkIcon from '@/public/Profile/otherLinkIcon.svg';

function ProfileAchievements({
  setHeader,
  setDescription,
  setMessage,
  setDisableNext,
  displayMessage,
  setDisableSkip,
  isDataUpdated,
  subSectionIndex,
  setHasUnsavedChanges,
}) {
  const router = useRouter();
  const [state, dispatch] = useContext(ProfileContext);
  const [userInfo, setUserInfo] = useContext(DashboardContext);
  const privateAxios = usePrivateAxios();

  const initialFormInput = {
    heading: '',
    description: '',
    link: '',
  };

  // by default get the recently added achievement or empty form input
  const [formInput, setFormInput] = useState(
    state?.achievements?.[0] || initialFormInput
  );
  const [achievementIdx, setAchievementIdx] = useState(0);

  // state to indicate if the file is being uploaded.
  const [isFileUploading, setIsFileUploading] = useState(false);

  // function to handle form input change
  function handleFormInputChange(e, field) {
    const newFormInput = formInput;
    newFormInput[`${field}`] = e.target.value;

    // update current state in the component
    setFormInput({ ...newFormInput });
    saveChanges(newFormInput);
    setHasUnsavedChanges(true);
  }

  // function to save the current changes to context
  function saveChanges(data) {
    // update state in the context
    dispatch({
      type: 'UPDATE_ACHIEVEMENTS',
      payload: {
        achievements: data,
        index: achievementIdx,
      },
    });

    setMessage(['Data saved successfully', 'success']);
  }

  // simple validation of the form input
  const validateFormData = () => {
    const requiredFields = ['heading'];

    for (const requiredField of requiredFields) {
      if (formInput[requiredField]?.length == 0) {
        return false;
      }
    }

    return true;
  };

  const [revealDeleteMsg, setRevealDeleteMsg] = useState(false);
  function showDeleteConfirmationMessage(e) {
    setRevealDeleteMsg(true);
  }

  // function to upload document to backend
  async function uploadDocument(e) {
    const uploadedFile = e.target.files[0];

    // if there was no file uploaded, return
    if (!uploadedFile) return;

    setIsFileUploading(true);

    try {
      // uploading a file includes multiple steps

      // Fetch the signed URL
      let res = await privateAxios.get('/file/s3-url-put', {
        headers: {
          fileContentType: uploadedFile.type,
          fileSubType: 'achievement',
          fileName: uploadedFile.name,
          fileIndex: achievementIdx,
        },
      });

      const { signedUrl, fileName } = res.data;

      // Using the signed URL, upload the file to s3
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

      // (3). Send info after successful file upload to the server
      res = await privateAxios.post(
        `/profile/upload-file/?fileName=${fileName}`,
        {},
        {
          headers: {
            fileContentType: uploadedFile.type,
            fileSubType: 'achievement',
            fileIndex: achievementIdx,
          },
        }
      );

      if (res.status === 200) {
        displayMessage([res.data.message, 'success']);

        // save the document url in the context
        handleFormInputChange({ target: { value: res.data.file } }, 'document');
      }

      setIsFileUploading(false);
    } catch (error) {
      const errorData = error?.response?.data;
      displayMessage([errorData?.message, 'error']);

      setIsFileUploading(false);

      // if the user was unauthorised, redirect them to login page after 1s
      if (error.response.status === 401) {
        setTimeout(() => {
          return router.push('/log-in');
        }, [1400]);
      }
    }
  }

  // delete the document linked with the achievement
  async function deleteDocument() {
    try {
      const data = {
        file: formInput?.document,
      };

      const res = await privateAxios.delete('/profile/delete-file', { data });

      if (res.status === 200) {
        displayMessage([res.data.message, 'success']);

        // save the changes in context
        handleFormInputChange({ target: { value: null } }, 'document');
        setRevealDeleteMsg(false);
      }
    } catch (error) {
      const errorData = error?.response?.data;
      displayMessage([errorData?.message, 'error']);

      // if the user was unauthorised, redirect them to login page after 1s
      if (error.response.status === 401) {
        setTimeout(() => {
          return router.push('/log-in');
        }, [1400]);
      }
    }
  }

  useEffect(() => {
    // set header and description
    const header = 'Achievements';
    const description =
      'Add your latest achievement in your education or professional experience.';
    setHeader(header);
    setDescription(description);

    // scroll to top on first render
    const firstFormControl = document.querySelectorAll(
      '.dashboard_achievements_form_control'
    )[0];
    firstFormControl.scrollIntoView({ behavior: 'smooth' });

    // if the data is being updated, prepopulate the fields
    if (isDataUpdated) {
      if (!userInfo) return;

      const allCurrAchievements = userInfo.achievements;

      /* update the context with current achievements,
      before adding or updating */
      allCurrAchievements.forEach((achievement, index) => {
        dispatch({
          type: 'UPDATE_ACHIEVEMENTS',
          payload: {
            achievements: achievement,
            index,
          },
        });
      });

      if (subSectionIndex == -1) {
        // add new achievement
        setAchievementIdx(allCurrAchievements.length);
        setFormInput(formInput);
      } else {
        // edit achievement at 'subSectionIndex' index
        const currAchievement = userInfo.achievements?.[subSectionIndex];
        setAchievementIdx(subSectionIndex);
        setFormInput(currAchievement);
      }
    }
  }, []);

  useEffect(() => {
    /* if any of the required fields is missing, or there was no data input
    from the user disable the next button */
    if (validateFormData() === false) {
      setDisableNext(true);
      setMessage(['Add all the required fields or skip for now', 'error']);
    } else {
      setDisableNext(false);
      setMessage([]);
    }

    /* disable the skip button only if the user has input some data,
    but that is not valid */
    // convert JSON objects into string to compare them
    const a = JSON.stringify(formInput);
    const b = JSON.stringify(initialFormInput);

    if (a !== b) {
      setDisableSkip(true);
    } else {
      setDisableSkip(false);
    }
  }, [formInput]);

  return (
    <div className="dashboard_profile_achievements_container">
      <form>
        <div className="dashboard_achievements_form_control">
          <label style={{ marginTop: '0' }}>
            Heading <span>*</span>
          </label>
          <input
            type="text"
            value={formInput?.heading || ''}
            onChange={(e) => handleFormInputChange(e, 'heading')}
          />
        </div>

        <div className="dashboard_achievements_form_control">
          <label>Description </label>
          <textarea
            rows={10}
            cols={50}
            maxLength={1000}
            placeholder="Add details about your achievements"
            value={formInput?.description || ''}
            onChange={(e) => handleFormInputChange(e, 'description')}
          />
        </div>

        <div className="dashboard_achievements_form_control">
          <label>Add link</label>
          <Image src={documentLinkIcon} alt="document link" style={{marginLeft: '10px', paddingTop: '5px'}}/>
          <input
            type="text"
            value={formInput?.link || ''}
            onChange={(e) => handleFormInputChange(e, 'link')}
          />
        </div>
      </form>

      <div className="dashboard_achievements_last_row">
        {!formInput?.document || formInput?.document?.length === 0 ? (
          <div>
            <input
              id="document_input_field"
              type="file"
              accept=".pdf"
              name="document"
              onInput={uploadDocument}
              style={{ display: 'none' }}
            />
            <button
              className="impAcievement"
              onClick={(e) => {
                /* allow the user to upload document only if
                   they have added 'heading' */
                if (formInput?.heading?.length == 0) {
                  displayMessage([
                    'Add heading, description before ' + 'uploading document',
                    'error',
                  ]);
                  return;
                }

                document.getElementById('document_input_field').click();
              }}
            >
              {isFileUploading === true ? (
                <ClipLoader size={15} />
              ) : (
                <>
                  Upload
                  <Image
                    style={{ marginLeft: '0.5rem' }}
                    src={fileUploadIcon}
                    alt="upload file"
                  />
                </>
              )}
            </button>
            <span className="dashboard_achievements_upload_message">
              Upload certificates if any (pdf only)
            </span>
          </div>
        ) : (
          <div className="deleteAchievement">
            {revealDeleteMsg === false ? (
              <button
                className="dashboard_document_delete_button"
                onClick={(e) => {
                  e.stopPropagation();
                  showDeleteConfirmationMessage(e);
                }}
              >
                Delete
              </button>
            ) : (
              <div>
                <span>Are you sure?</span>
                <button onClick={deleteDocument}>Yes</button>
              </div>
            )}
            <span className="dashboard_achievements_upload_message">
              File uploaded successfully
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileAchievements;
