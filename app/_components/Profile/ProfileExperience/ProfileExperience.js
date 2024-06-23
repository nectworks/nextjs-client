'use client';
/*
  File: ProfileExperience.js
  Description: This file contains the pop up window to add 'experiences'
  in the user's profile.
*/

import { useContext, useEffect, useState } from 'react';
import './ProfileExperience.css';
import Image from 'next/image';
import { ProfileContext } from '@/context/UpdateProfile/ProfileContext';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import { DashboardContext } from '@/context/Dashboard/DashboardContext';
import { privateAxios } from '@/config/axiosInstance';

function ProfileExperience({
  setHeader,
  setDescription,
  setMessage,
  setDisableNext,
  setDisableSkip,
  isDataUpdated,
  subSectionIndex,
}) {
  // this context helps in storing the data, when the user is editing it
  const [state, dispatch] = useContext(ProfileContext);

  // this context stores the data from the db.
  const [userInfo, setUserInfo] = useContext(DashboardContext);

  const allMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const initialFormInput = {
    jobTitle: '',
    employmentType: 'Full Time',
    companyName: '',
    workType: 'Onsite',
    startMonth: allMonths[new Date().getMonth()],
    startYear: new Date().getFullYear().toString(),
    endMonth: allMonths[new Date().getMonth()],
    endYear: new Date().getFullYear().toString(),
    industry: '',
    skills: [],
    description: '',
    currentlyWorking: false,
  };

  // index of the experience object that is being updated/added.
  const [expIndex, setExpIndex] = useState(0);

  // by default get the latest experience added or empty input for the form
  const [formInput, setFormInput] = useState(
    state?.experience?.[0] || initialFormInput
  );

  // to enabled the functionality of adding skill on enter keydown
  const [skillInput, setSkillInput] = useState('');

  /*
    Small brief of the process flow (for reference)
    1. On user input, the data is saved automatically
    2. User can only move forward if they have filled all required fields.

    How messages are displayed
    1. setMessage function displays the message later
     (i.e., on next/skip button click)
    2. displayMessage function displays the message immediately
  */

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

  const handleSkillSelection = (selectedSkill) => {
    const newSkills = [...formInput.skills, selectedSkill];

    // Update the form input with the new skills
    const newFormInput = { ...formInput, skills: newSkills };
    setFormInput(newFormInput);

    // Clear the skill input and hide suggestions
    setSkillInput('');
    setSkillSuggestions([]);

    // Save the changes
    saveChanges(newFormInput);
  };

  const [jobTitleSuggestions, setJobTitleSuggestions] = useState([]);

  // Function to fetch job title suggestions from the backend
  async function fetchJobTitleSuggestions(inputText) {
    try {
      const url = '/suggestions/jobtitles';
      const data = { text: inputText };
      const response = await privateAxios.get(url, { params: data });
      if (response.status === 200) {
        return response.data.suggestions;
      }
    } catch (error) {
      console.error('Error fetching job title suggestions:', error);
      return [];
    }
  }

  // Function to update job title suggestions based on user input
  async function updateJobTitleSuggestions(inputText) {
    if (inputText.trim() === '') {
      setJobTitleSuggestions([]); // Clear job title suggestions when input is empty
      return;
    }
    const suggestions = await fetchJobTitleSuggestions(inputText);
    setJobTitleSuggestions(suggestions);
  }

  const handleJobTitleSelection = (selectedJobTitle) => {
    const newFormInput = { ...formInput, jobTitle: selectedJobTitle };
    setFormInput(newFormInput); // Update form input with the selected job title
    setJobTitleSuggestions([]); // Clear job title suggestions when a job title is selected
    saveChanges(newFormInput); // Save changes with the selected job title
  };

  // function to change work type
  function changeWorkType(e) {
    /* since this function is reused twice, remove previous
     active element only from current parent container without affecting
     the other active option */
    const optionsContainer = e.target.closest('.dashboard_experience_options');
    const prevActiveEle = optionsContainer.querySelector(
      '.dashboard_experience_active_opton'
    );
    const currSelectedEle = e.target;

    // if the previous and current active option are same, return
    if (prevActiveEle == currSelectedEle) return;

    // get the workType or employementType from data attribute
    const employmentType = currSelectedEle.dataset.employmentType;
    const workType = currSelectedEle.dataset.workType;

    /* if workType is not being changed, it's employement
     type that is being updated */
    if (!workType) {
      handleFormInputChange(
        { target: { value: employmentType } },
        'employmentType'
      );
    } else {
      handleFormInputChange({ target: { value: workType } }, 'workType');
    }

    // clear the previous active state
    prevActiveEle.classList.remove('dashboard_experience_active_opton');

    // add the active state to current option
    currSelectedEle.classList.add('dashboard_experience_active_opton');
  }

  // function to handle form input change
  function handleFormInputChange(e, field) {
    const newFormInput = formInput;
    newFormInput[field] = e.target.value;

    // this is a checkbox field, therefore toggle the input
    if (field === 'currentlyWorking') {
      newFormInput[field] = e.target.checked;

      if (newFormInput[field]) {
        newFormInput.endMonth = null;
        newFormInput.endYear = null;
      } else {
        newFormInput.endMonth = allMonths[new Date().getMonth()];
        newFormInput.endYear = new Date().getFullYear().toString();
      }
    }

    // update current state in the component and the context
    setFormInput({ ...newFormInput });

    if (field === 'jobTitle') {
      updateJobTitleSuggestions(newFormInput[field]);
    }
    saveChanges(newFormInput);
  }

  // function to save the current local state to context and local storage
  function saveChanges(data) {
    dispatch({
      type: 'UPDATE_EXPERIENCE',
      payload: {
        experience: data,
        index: expIndex,
      },
    });

    setMessage(['Data saved successfully.', 'success']);
  }

  // function to validate user input data
  function validateFormData() {
    const requiredFields = [
      'jobTitle',
      'companyName',
      'workType',
      'startMonth',
      'startYear',
      'industry',
    ];

    for (const requiredField of requiredFields) {
      if (formInput[requiredField].length == 0) {
        return false;
      }
    }

    return true;
  }

  // function to delete skills
  function deleteSkill(e, index) {
    const updatedSkills = [...formInput.skills];

    // remove the skill at the given index
    updatedSkills.splice(index, 1);

    // save the changes
    handleFormInputChange({ target: { value: updatedSkills } }, 'skills');
  }

  // function to add skill on 'enter' keypress on the input element
  function addSkill(e) {
    if (e.keyCode === 13) {
      // get the input skill and add it to the formInput
      const newSkill = e.target.value.trim();

      if (formInput?.skills?.length >= 5) return;

      // clear the input value on enter
      setSkillInput('');

      if (newSkill.length === 0) return;

      // save the newly added skill
      const currSkills = [...formInput.skills, newSkill];
      handleFormInputChange({ target: { value: currSkills } }, 'skills');
    }
  }

  useEffect(() => {
    // set the header and description of this window
    const header = 'Experience';
    const description =
      'Let others know about your recent professional experience.';

    setHeader(header);
    setDescription(description);

    // scroll to top on first render
    const firstFormControl = document.querySelectorAll(
      '.dashboard_experience_form_control'
    )[0];
    firstFormControl.scrollIntoView({ behavior: 'smooth' });

    // if the data is being updated, prepopulate the fields
    if (isDataUpdated) {
      if (!userInfo) return;

      const allCurrExperience = userInfo.experience;

      /* update the context with current experience,
      before adding or updating */
      allCurrExperience.forEach((experience, index) => {
        dispatch({
          type: 'UPDATE_EXPERIENCE',
          payload: { experience, index },
        });
      });

      if (subSectionIndex == -1) {
        // add new experience
        setExpIndex(allCurrExperience.length);
        setFormInput(formInput);
      } else {
        // edit experience at 'subSectionIndex' index
        const currExperience = userInfo?.experience?.[subSectionIndex];

        setExpIndex(subSectionIndex);
        setFormInput(currExperience);
      }
    }
  }, []);

  useEffect(() => {
    // set 'enter' key listener for the input element
    const skillInputEle = document.querySelector(
      '.experience_form_skills_input'
    );
    skillInputEle.addEventListener('keyup', addSkill);

    return () => {
      skillInputEle.removeEventListener('keyup', addSkill);
    };
  }, [addSkill]);

  useEffect(() => {
    /* if any of the required fields is missing, or there
     was no data input from user disable next button
    */
    if (validateFormData() === false) {
      setDisableNext(true);
      setMessage(['Add all the required fields or skip for now', 'error']);
    } else {
      // enable the next button, only if the form input is valid
      setDisableNext(false);
    }

    /* disable the skip button only if the user has input some data,
    but that is not valid */
    // convert JSON objects into string to compare them
    const a = JSON.stringify(formInput);
    const b = JSON.stringify(initialFormInput);

    if (a !== b) {
      setDisableSkip(true);
    }
  }, [formInput]);

  return (
    <div className="dashboard_profile_experience_container">
      <form className="dashboard_profile_experience_form">
        <div
          className="dashboard_experience_form_control
           dashboard_experience_job_title"
        >
          <label style={{ marginTop: '0' }}>
            Job Title <span>*</span>
          </label>
          <input
            type="text"
            value={formInput?.jobTitle || ''}
            onChange={(e) => handleFormInputChange(e, 'jobTitle')}
          />
          {jobTitleSuggestions.length > 0 && (
            <div className="AutoSuggestions_profile_page">
              <ul>
                {jobTitleSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleJobTitleSelection(suggestion.jobTitle)}
                  >
                    {suggestion.jobTitle}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="dashboard_experience_form_control">
          <label>Employment Type</label>
          {/* changeWorkType function could be reused with
          slight modifications */}
          <div className="dashboard_experience_options">
            <span
              onClick={changeWorkType}
              className="dashboard_experience_active_opton"
              data-employment-type="Full Time"
            >
              Full Time
            </span>
            <span onClick={changeWorkType} data-employment-type="Internship">
              Internship
            </span>
            <span onClick={changeWorkType} data-employment-type="Contractual">
              Contractual
            </span>
          </div>
        </div>

        <div className="dashboard_experience_form_control">
          <label>
            Company Name <span>*</span>
          </label>
          <input
            type="text"
            value={formInput?.companyName || ''}
            onChange={(e) => handleFormInputChange(e, 'companyName')}
          />
        </div>

        <div className="dashboard_experience_form_control">
          <label>Work Type</label>
          <div className="dashboard_experience_options">
            <span
              onClick={changeWorkType}
              className="dashboard_experience_active_opton"
              data-work-type="On site"
            >
              On site
            </span>
            <span onClick={changeWorkType} data-work-type="Work from home">
              Work from home
            </span>
            <span onClick={changeWorkType} data-work-type="Hybrid">
              Hybrid
            </span>
          </div>
        </div>

        <div
          className="dashboard_experience_form_control"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <p className="dashboard_experience_form_prompt">
            If this is your current company, click here
          </p>
          <input
            type="checkbox"
            checked={formInput?.currentlyWorking}
            onChange={(e) => handleFormInputChange(e, 'currentlyWorking')}
          />
        </div>

        <div className="dashboard_experience_form_row">
          <div
            className="dashboard_experience_form_control"
            style={{ marginRight: '2rem' }}
          >
            <label>
              Start Month <span>*</span>
            </label>
            <select
              id="start_month"
              name="start_month"
              value={formInput?.startMonth}
              onChange={(e) => handleFormInputChange(e, 'startMonth')}
            >
              {allMonths.map((month, idx) => {
                /* if the current year is selected do not
                  display upcomingmonths */
                const currYear = new Date().getFullYear().toString();
                const currMonthIdx = new Date().getMonth();

                if (formInput?.startYear === currYear && idx > currMonthIdx) {
                  return null;
                }

                return (
                  <option value={month} key={idx}>
                    {month}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="dashboard_experience_form_control">
            <label>
              Start Year <span>*</span>
            </label>
            <select
              id="start_year"
              name="start_year"
              value={formInput?.startYear}
              onChange={(e) => handleFormInputChange(e, 'startYear')}
            >
              {/* create an array of years from 1990 to current year */}
              {Array.from(
                { length: new Date().getFullYear() - 1989 },
                (_, i) => i + 1990
              ).map((year, idx) => {
                return (
                  <option key={idx} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {formInput?.currentlyWorking === false && (
          <div className="dashboard_experience_form_row">
            <div
              className="dashboard_experience_form_control"
              style={{ marginRight: '2rem' }}
            >
              <label>
                End Month <span>*</span>
              </label>
              <select
                id="end_month"
                name="end_month"
                value={formInput?.endMonth}
                onChange={(e) => handleFormInputChange(e, 'endMonth')}
              >
                {allMonths.map((month, idx) => {
                  const currYear = new Date().getFullYear().toString();
                  const currMonthIdx = new Date().getMonth();

                  /* if the current year is selected do not
                    display upcoming months */
                  if (formInput?.endYear === currYear && idx > currMonthIdx) {
                    return null;
                  }

                  /* if the start year and the end year are the same,
                      do not display months that are before start month
                    */
                  if (
                    parseInt(formInput?.startYear) ===
                    parseInt(formInput?.endYear)
                  ) {
                    const startMonthIdx = allMonths.findIndex((month) => {
                      return month === formInput?.startMonth;
                    });

                    if (idx < startMonthIdx) return null;
                  }

                  return (
                    <option value={month} key={idx}>
                      {month}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="dashboard_experience_form_control">
              <label>
                End Year <span>*</span>
              </label>
              <select
                id="end_year"
                name="end_year"
                value={formInput?.endYear}
                onChange={(e) => handleFormInputChange(e, 'endYear')}
              >
                {/* create an array of years from start year to current year */}
                {Array.from(
                  {
                    length: new Date().getFullYear() - formInput?.startYear + 1,
                  },
                  (_, i) => i + parseInt(formInput?.startYear)
                ).map((year, idx) => {
                  return (
                    <option key={idx} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        )}

        <div className="dashboard_experience_form_control">
          <label>
            Industry <span>*</span>
          </label>
          <input
            type="text"
            value={formInput?.industry || ''}
            onChange={(e) => handleFormInputChange(e, 'industry')}
          />
        </div>

        <div className="dashboard_experience_form_control">
          <label>Skills </label>
          <input
            className="experience_form_skills_input"
            type="text"
            value={skillInput}
            onChange={handleSkillInputChange}
          />
          {skillSuggestions.length > 0 && (
            <div className="AutoSuggestions_profile_page">
              <ul>
                {skillSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSkillSelection(suggestion.skill)}
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
              <span className="dashboard_experience_skill" key={index}>
                {skill}
                <Image
                  src={crossIcon}
                  onClick={(e) => deleteSkill(e, index)}
                  alt="delete skill"
                />
              </span>
            );
          })}
        </div>

        <div className="dashboard_experience_form_control">
          <label>Description </label>
          <textarea
            rows={10}
            cols={50}
            maxLength={1000}
            placeholder="Tell others about your professional experience"
            value={formInput?.description || ''}
            onChange={(e) => handleFormInputChange(e, 'description')}
          />
        </div>
      </form>
    </div>
  );
}

export default ProfileExperience;
