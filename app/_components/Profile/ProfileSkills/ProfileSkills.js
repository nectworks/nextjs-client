'use client';
/*
  File: ProfileSkills.js
  Description: This file contains the pop up window to add 'skills'
  in the user's profile.
*/

import { useContext, useEffect, useState } from 'react';
import './ProfileSkills.css';
import { ProfileContext } from '@/context/UpdateProfile/ProfileContext';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import { DashboardContext } from '@/context/Dashboard/DashboardContext';
import { privateAxios } from '@/config/axiosInstance';
import Image from 'next/image';

function ProfileSkills({
  setHeader,
  setDescription,
  setMessage,
  setDisableNext,
  setDisableSkip,
  isDataUpdated,
  displayMessage,
}) {
  const [state, dispatch] = useContext(ProfileContext);
  const [userInfo, setUserInfo] = useContext(DashboardContext);
  const [skills, setSkills] = useState(state?.skills || []);
  const [inputVal, setInputVal] = useState('');

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

    // Filter out suggestions that are already in the skills array
    const filteredSuggestions = suggestions.filter(
      (suggestion) => !skills.includes(suggestion.skill)
    );

    setSkillSuggestions(filteredSuggestions);
  }

  const handleSkillInputChange = (e) => {
    const inputText = e.target.value;
    setInputVal(inputText);
    updateAutoSuggestions(inputText);
  };

  const handleSuggestionClick = (suggestion) => {
    const clickedValue = suggestion.skill;
    setInputVal(clickedValue);
    setSkillSuggestions([]); // Hide suggestions after selection
    handleSubmit({ preventDefault: () => {} }, clickedValue); // Simulate form submission event with clicked value
  };

  // on submit add the skill to the skills array.
  function handleSubmit(e, inputValue) {
    e.preventDefault();

    const valueToUse = inputValue !== undefined ? inputValue : inputVal;

    if (!valueToUse.trim()) {
      // If the input value is empty or contains only whitespace, do nothing
      return;
    }

    const updatedSkills = [...skills, valueToUse].sort();
    setSkills(updatedSkills);
    setInputVal('');
    saveChanges(updatedSkills);
  }

  // remove the skill at given index
  function removeSkill(e, index) {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);

    // save the updated skills in state.
    setSkills(updatedSkills);
    saveChanges(updatedSkills);
  }

  // function to save changes to context
  function saveChanges(data) {
    dispatch({
      type: 'UPDATE_SKILLS',
      payload: { skills: data },
    });

    setDisableNext(false);
    setMessage(['Data saved successfully', 'success']);
  }

  useEffect(() => {
    const header = 'Skills';
    const description = 'Let others know about the skills that you possess.';
    setHeader(header);
    setDescription(description);

    // if the data is being updated, prepopulate the fields
    if (isDataUpdated) {
      if (!userInfo) return;

      if (isDataUpdated) {
        setSkills(userInfo?.skills);
      }
    }
  }, []);

  useEffect(() => {
    if (skills.length <= 0) {
      setDisableNext(true);
      setDisableSkip(false);
      setMessage(['Add atleast one skill or skip for now', 'error']);
    } else {
      setDisableSkip(true);
      setDisableNext(false);
    }

    // limit the number of skills to 10
    if (skills.length >= 10) {
      // display the warning message
      displayMessage(['You can only add 10 skills', 'error']);
    }
  }, [displayMessage, setDisableNext, setDisableSkip, setMessage, skills]);

  return (
    <div className="dashboard_profile_skills_container">
      {/* <span>You can add {10 - skills.length} skills</span> */}
      <form onSubmit={handleSubmit}>
        <input
          id="dashboard_profile_skill_input"
          type="text"
          placeholder={skills.length < 10 ? 'Add your skills...' : ''}
          disabled={skills.length >= 10}
          value={inputVal}
          onChange={handleSkillInputChange}
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
      </form>

      <div className="dashboard_all_skills_container">
        <h6>Your Skills</h6>
        {skills.map((skill, index) => {
          return (
            <span className="dashboard_each_skill" key={index}>
              {skill}
              <Image
                onClick={(e) => removeSkill(e, index)}
                src={crossIcon}
                alt={`delete skill ${skill}`}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default ProfileSkills;
