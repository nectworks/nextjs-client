'use client';
/*
  File: ProfileProjects.js
  Description: This file contains the pop up window to add 'projects' section
  in the user's profile.
*/

import { useContext, useEffect, useState } from 'react';
import './ProfileProjects.css';
import fileUploadIcon from '@/public/Profile/fileUploadIcon.svg';
import { ProfileContext } from '@/context/UpdateProfile/ProfileContext';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import { DashboardContext } from '@/context/Dashboard/DashboardContext';
import ClipLoader from 'react-spinners/ClipLoader';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import Image from 'next/image';

function ProfileProjects({
  setHeader,
  setDescription,
  setMessage,
  setDisableNext,
  displayMessage,
  isDataUpdated,
  subSectionIndex,
  setHasUnsavedChanges,
}) {
  const [state, dispatch] = useContext(ProfileContext);
  const [userInfo, setUserInfo] = useContext(DashboardContext);
  const privateAxios = usePrivateAxios();

  const initialFormInput = {
    heading: '',
    description: '',
    skills: [],
    link: '',
  };

  const [isFileUploading, setIsFileUploading] = useState(false);

  const [formInput, setFormInput] = useState(
    state?.projects?.[0] || initialFormInput
  );
  const [projectIdx, setProjectIdx] = useState(0 || 0);

  const [skillInput, setSkillInput] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState([]);

  async function fetchAutoSuggestions(url, data) {
    try {
      const res = await privateAxios.get(url, { params: data });
      if (res.status === 200) {
        return res.data.suggestions;
      }
    } catch (error) {
      return [];
    }
  }

  async function updateAutoSuggestions(inputText) {
    if (inputText.length === 0) {
      setSkillSuggestions([]);
      return;
    }

    const url = '/suggestions/skills';
    const data = { text: inputText };
    const suggestions = await fetchAutoSuggestions(url, data);

    // Filter out the selected skill from the suggestions
    const filteredSuggestions = suggestions.filter(
      (suggestion) => !formInput.skills.includes(suggestion.skill)
    );

    setSkillSuggestions(filteredSuggestions);
  }

  const handleSkillInputChange = (e) => {
    const inputText = e.target.value;
    setSkillInput(inputText);
    updateAutoSuggestions(inputText);
  };

  // const handleSuggestionClick = (suggestion) => {
  //   setSkillInput(suggestion.skill);
  //   setSkillSuggestions([]); // Hide suggestions after selection
  // };
  const handleSuggestionClick = (suggestion) => {
    // Add the selected suggestion to the skills array
    const newSkills = [...formInput.skills, suggestion.skill];

    // Update the form input with the new skills
    const newFormInput = { ...formInput, skills: newSkills };
    setFormInput(newFormInput);

    // Clear the skill input and hide suggestions
    setSkillInput('');
    setSkillSuggestions([]);

    // Save the changes
    saveChanges(newFormInput);
  };

  // include new input update into the state
  function handleFormInputChange(e, field) {
    const newFormInput = { ...formInput };
    newFormInput[`${field}`] = e.target.value;

    setFormInput(newFormInput);
    saveChanges(newFormInput);
    setHasUnsavedChanges(true);
  }

  // function to save the current changes to context
  function saveChanges(data) {
    // update state in the context
    dispatch({
      type: 'UPDATE_PROJECTS',
      payload: {
        projects: data,
        index: projectIdx,
      },
    });

    setMessage(['Data saved successfully', 'success']);
  }

  // add skill on 'enter' keypress in the input element
  function addSkill(e) {
    if (e.keyCode === 13) {
      // get the input skill and add it to the formInput
      const newSkill = e.target.value.trim();

      // if the skill limit has reached do not add new skills
      if (formInput?.skills.length >= 5) return;

      // clear the input value on enter
      setSkillInput('');

      if (newSkill.length === 0) return;

      // save the newly added skill
      const currSkills = [...formInput.skills, newSkill];
      handleFormInputChange({ target: { value: currSkills } }, 'skills');
    }
  }

  // function to delete skills
  function deleteSkill(e, index) {
    const updatedSkills = [...formInput.skills];

    // remove the skill at the given index
    updatedSkills.splice(index, 1);

    // save the changes
    handleFormInputChange({ target: { value: updatedSkills } }, 'skills');
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
          fileSubType: 'project',
          fileName: uploadedFile.name,
          fileIndex: projectIdx,
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
            fileSubType: 'project',
            fileIndex: projectIdx,
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
    }
  }

  // delete the document linked with the project
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
    }
  }

  useEffect(() => {
    const header = 'Projects';
    const description =
      'Add your latest project that you have ' +
      'completed in your education or professional experience';

    setHeader(header);
    setDescription(description);

    // scroll to top on first render
    const firstFormControl = document.querySelectorAll(
      '.dashboard_projects_form_control'
    )[0];
    firstFormControl.scrollIntoView({ behavior: 'smooth' });

    // if the data is being updated, prepopulate the fields
    if (isDataUpdated) {
      if (!userInfo) return;

      const allCurrProjects = userInfo.projects;

      /* update the context with current projects,
      before adding or updating */
      allCurrProjects.forEach((project, index) => {
        dispatch({
          type: 'UPDATE_PROJECTS',
          payload: {
            projects: project,
            index,
          },
        });
      });

      if (subSectionIndex == -1) {
        // add new project
        setProjectIdx(allCurrProjects.length);
        setFormInput(formInput);
      } else {
        // edit project at 'subSectionIndex' index
        const currProject = userInfo?.projects?.[subSectionIndex];

        setProjectIdx(subSectionIndex);
        setFormInput(currProject);
      }
    }
  }, []);

  const [revealDeleteMsg, setRevealDeleteMsg] = useState(false);
  function showDeleteConfirmationMessage() {
    setRevealDeleteMsg(true);
  }

  useEffect(() => {
    /* if any of the required fields is missing, or there was no data input
    from the user disable the next button */
    if (validateFormData() === false) {
      setDisableNext(true);
      setMessage(['Add all the required fields.', 'error']);
    } else {
      setDisableNext(false);
    }
  }, [formInput]);

  useEffect(() => {
    // set 'enter' key listener for the input element
    const skillInputEle = document.querySelector('.projects_form_skills_input');
    skillInputEle.addEventListener('keyup', addSkill);
    return () => {
      skillInputEle.removeEventListener('keyup', addSkill);
    };
  }, [addSkill]);

  return (
    <div className="dashboard_profile_projects_container">
      <form>
        <div className="dashboard_projects_form_control dashboard_project_title">
          <label style={{ marginTop: '0' }}>
            Heading <span>*</span>
          </label>
          <input
            type="text"
            value={formInput?.heading || ''}
            onChange={(e) => handleFormInputChange(e, 'heading')}
          />
        </div>

        <div className="dashboard_projects_form_control">
          <label>Description </label>
          <textarea
            rows={10}
            cols={50}
            maxLength={1000}
            placeholder="Add details about your projects"
            value={formInput?.description || ''}
            onChange={(e) => handleFormInputChange(e, 'description')}
          />
        </div>

        <div className="dashboard_projects_form_control">
          <label>Skills </label>
          <input
            className="projects_form_skills_input"
            type="text"
            value={skillInput}
            onChange={handleSkillInputChange}
            onInput={(e) => addSkill(e)}
          />
          {skillSuggestions.length > 0 && (
            <div className="AutoSuggestions_profile_page">
              <ul>
                {skillSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <span>Add the top 5 skills that helped you in this role.</span>
          <br></br>
          {formInput?.skills?.map((skill, index) => {
            return (
              <span className="dashboard_projects_skill" key={index}>
                {skill}
                <Image
                  src={crossIcon}
                  onClick={(e) => deleteSkill(e, index)}
                  alt={`delete skill ${skill}`}
                />
              </span>
            );
          })}
        </div>

        <div className="dashboard_projects_form_control">
          <label>Add link</label>
          <input
            type="text"
            value={formInput?.link || ''}
            onChange={(e) => handleFormInputChange(e, 'link')}
          />
        </div>
      </form>

      <div className="dashboard_projects_last_row">
        {!formInput.document || formInput?.document?.length === 0 ? (
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
              onClick={() => {
                /* allow the user to upload document only if
                   they have added 'heading' */

                if (formInput?.heading?.length == 0) {
                  displayMessage([
                    'Add heading before ' + 'uploading document',
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
                    alt="upload a file"
                  />
                </>
              )}
            </button>
            <span className="dashboard_projects_upload_message">
              Upload certificates if any (pdf only)
            </span>
          </div>
        ) : (
          <div className="deleteProject">
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
            <span className="dashboard_projects_upload_message">
              File uploaded successfully
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileProjects;
