'use client';
/*
  File: ProfileEducation.js
  Description: This file contains the pop up window to add 'education'
  in the user's profile.
*/

import { useContext, useEffect, useState } from 'react';
import './ProfileEducation.css';
import { ProfileContext } from '@/context/UpdateProfile/ProfileContext';
import { DashboardContext } from '@/context/Dashboard/DashboardContext';

function ProfileEducation({
  setHeader,
  setDescription,
  setMessage,
  setDisableNext,
  setDisableSkip,
  isDataUpdated,
  subSectionIndex,
  setHasUnsavedChanges,
}) {
  const [state, dispatch] = useContext(ProfileContext);
  const [userInfo, setUserInfo] = useContext(DashboardContext);

  const initialFormInput = {
    school: '',
    degree: '',
    fieldOfStudy: '',
    startYear: new Date().getFullYear().toString(),
    endYear: new Date().getFullYear().toString(),
    grade: '',
    description: '',
  };

  // by default get the latest education added or the empty input for the form
  const [formInput, setFormInput] = useState(
    state?.education?.[0] || initialFormInput
  );
  const [eduIndex, setEduIndex] = useState(0);

  // function to handle form input change
  function handleFormInputChange(e, field) {
    const newFormInput = formInput;
    newFormInput[`${field}`] = e.target.value;

    // update current state in the component and the context
    setFormInput({ ...newFormInput });
    saveChanges(newFormInput);
    setHasUnsavedChanges(true);
  }

  // function to save the current changes to context
  function saveChanges() {
    dispatch({
      type: 'UPDATE_EDUCATION',
      payload: {
        education: formInput,
        index: eduIndex,
      },
    });

    setMessage(['Data saved successfully', 'success']);
  }

  function validateFormData() {
    const requiredFields = ['school', 'startYear', 'endYear'];

    for (const requiredField of requiredFields) {
      if (formInput[requiredField].length == 0) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    /* if any of the required fields is missing, or if there
     was no data input from user, disable next button
    */
    if (validateFormData() === false) {
      setDisableNext(true);
      setMessage(['Add all the required fields or skip for now', 'error']);
    } else {
      setDisableNext(false);
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

  useEffect(() => {
    const header = 'Education';
    const description =
      'Let others know about your latest academic qualifications.';

    setHeader(header);
    setDescription(description);

    // scroll to top on first render
    const firstFormControl = document.querySelectorAll(
      '.dashboard_education_form_control'
    )[0];
    firstFormControl.scrollIntoView({ behavior: 'smooth' });

    // if the data is being updated, prepopulate the fields
    if (isDataUpdated) {
      if (!userInfo) return;

      const allCurrEducation = userInfo.education;

      /* update the context with current education,
      before adding or updating */
      allCurrEducation.forEach((education, index) => {
        dispatch({
          type: 'UPDATE_EDUCATION',
          payload: { education, index },
        });
      });

      if (subSectionIndex == -1) {
        // add new education
        setEduIndex(allCurrEducation.length);
        setFormInput(formInput);
      } else {
        // edit education at 'subSectionIndex' index
        const currEducation = userInfo?.education?.[subSectionIndex];
        setEduIndex(subSectionIndex);
        setFormInput(currEducation);
      }
    }
  }, []);

  return (
    <div className="dashboard_profile_education_container">
      <form className="dashboard_profile_education_form">
        <div
          className="dashboard_education_form_control
          dashboard_education_job_title"
        >
          <label style={{ marginTop: '0' }}>
            School
            <span className="form_control_label_required"> *</span>
          </label>
          <input
            type="text"
            value={formInput?.school}
            onChange={(e) => handleFormInputChange(e, 'school')}
          />
        </div>

        <div className="dashboard_education_form_control">
          <label>
            Degree
            <span> (ex, B.Com, Mechanical Engineering)</span>
          </label>
          <input
            type="text"
            value={formInput?.degree}
            onChange={(e) => handleFormInputChange(e, 'degree')}
          />
        </div>

        <div className="dashboard_education_form_control">
          <label>
            Field of study
            <span> (ex, Marketing, Finance, Engineering)</span>
          </label>
          <input
            type="text"
            value={formInput?.fieldOfStudy}
            onChange={(e) => handleFormInputChange(e, 'fieldOfStudy')}
          />
        </div>

        <div className="dashboard_education_form_row">
          <div
            className="dashboard_education_form_control"
            style={{ marginRight: '2rem' }}
          >
            <label>
              Start Year
              <span className="form_control_label_required"> *</span>
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

          <div className="dashboard_education_form_control">
            <label>
              End Year
              <span className="form_control_label_required"> *</span>
            </label>
            <select
              id="end_year"
              name="end_year"
              value={formInput?.endYear}
              onChange={(e) => handleFormInputChange(e, 'endYear')}
            >
              {/* create an array of years from start year to current year */}
              {Array.from(
                { length: new Date().getFullYear() - formInput?.startYear + 1 },
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

        <div className="dashboard_education_form_control">
          <label>Grade (CGPA)</label>
          <input
            type="number"
            min="0"
            step="0.02"
            value={formInput?.grade || ''}
            onChange={(e) => handleFormInputChange(e, 'grade')}
          />
        </div>

        <div className="dashboard_education_form_control">
          <label>Description </label>
          <textarea
            rows={10}
            cols={50}
            maxLength={1000}
            placeholder="Tell others about your educational experience..."
            value={formInput?.description}
            onChange={(e) => handleFormInputChange(e, 'description')}
          />
        </div>
      </form>
    </div>
  );
}

export default ProfileEducation;
