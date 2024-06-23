'use client';
/*
   File: ProfilePreferences.js
   Description: This file consists of the input elements required for
   taking preferences from the users.
*/

import { useContext, useEffect, useState } from 'react';
import './ProfilePreferences.css';
import Image from 'next/image';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import { UserContext } from '@/context/User/UserContext';
import showBottomMessage from '@/Utils/showBottomMessage';
import usePrivateAxios from '@/Utils/usePrivateAxios';

function ProfilePreferences({
  isDataUpdated,
  setShowPreferencesForm,
  userPreferences,
  setUserPreferences,
}) {
  // get the userMode from the UserContext
  const { userModeState } = useContext(UserContext);
  const [userMode, setUserMode] = userModeState;
  const privateAxios = usePrivateAxios();

  const [isProfessional, setIsProfessional] = useState(false);

  // These states represent the input values.
  const [functionalArea, setFunctionalArea] = useState('IT');
  const [experienceLevel, setExperienceLevel] = useState('0-3 years');
  const [location, setLocation] = useState('');

  const [skill, setSkill] = useState('');

  const [company, setCompany] = useState('');
  const [workType, setWorkType] = useState('Onsite');

  /* These states are array that represent all the multiple values
    given as input by the user */
  const [allSkills, setAllSkills] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [allCompanies, setAllCompanies] = useState([]);

  // These states represent the auto suggestions for different fields
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // state to display error messages on form submit
  const [showErrorMessages, setShowErrorMessages] = useState(false);

  // represents the validity of the input data
  const [isDataValid, setIsDataValid] = useState(false);

  /* since professionals and seekers have different preference model,
    they also have different data validation requirements */
  const proValidation = {
    positionsCount: [1, 1], // the array contains min and max required count,
    locationsCount: [1, 3],
    skillsCount: [1, 5],
  };

  const seekerValidation = {
    positionsCount: [1, 3],
    locationsCount: [1, 3],
    companiesCount: [1, 3],
    skillsCount: [1, 5],
  };

  const [validationObj, setValidationObj] = useState(
    isProfessional === true ? proValidation : seekerValidation
  );

  // maintain the array of all the inputs, to display it below the input element
  function addInputs(e) {
    if (e.target.value.trim().length == 0) return;
    const attributeToAdd = e.target.dataset.attribute;
    if (e.keyCode === 13) {
      switch (attributeToAdd) {
        case 'skills': {
          const skillSet = new Set();
          [...allSkills, e.target.value].forEach((val) => {
            skillSet.add(val.trim());
          });

          setAllSkills(Array.from(skillSet));
          setSkill('');
          break;
        }

        case 'location': {
          const locationSet = new Set();
          [...allLocations, e.target.value].forEach((val) => {
            locationSet.add(val.trim());
          });

          setAllLocations(Array.from(locationSet));
          setLocation('');
          break;
        }

        case 'companies': {
          const companySet = new Set();
          [...allCompanies, e.target.value].forEach((val) => {
            companySet.add(val.trim());
          });

          setAllCompanies(Array.from(companySet));
          setCompany('');
          break;
        }
      }
    }
  }

  // function to remove the input.
  function removeInputs(e) {
    const inputTag = e.target.closest('.preference_input_tag');

    // The position of the element in the array.
    const index = parseInt(inputTag.dataset.index);

    // The attribute from which the element should be deleted from.
    const attribute = inputTag.dataset.attribute;

    switch (attribute) {
      case 'skills': {
        setAllSkills(allSkills?.filter((skill, idx) => idx !== index));
        break;
      }

      case 'location': {
        setAllLocations(allLocations?.filter((location, idx) => idx !== index));
        break;
      }

      case 'companies': {
        setAllCompanies(allCompanies?.filter((company, idx) => idx !== index));
        break;
      }
    }
  }

  // function to save the preferences.
  async function savePreferences() {
    // show error messages
    setShowErrorMessages(true);

    // if the data is not valid, return
    if (isDataValid === false) return;

    try {
      const data = {
        functionalArea: functionalArea,
        locations: allLocations,
        experience: experienceLevel,

        skills: allSkills,

        companies: allCompanies,
        workType,
      };

      const url = '/profile/preferences';
      const headers = { isProfessional: isProfessional };

      let res = null;
      if (isDataUpdated) {
        res = await privateAxios.patch(url, data, { headers });
      } else {
        res = await privateAxios.post(url, data, { headers });
      }

      if (res?.status === 200) {
        if (isProfessional) {
          setUserPreferences({
            ...userPreferences,
            professional: res.data.data.preferences,
          });
        } else {
          setUserPreferences({
            ...userPreferences,
            seeker: res.data.data.preferences,
          });
        }

        // close the preference form
        setShowPreferencesForm(false);
      }
    } catch (err) {
      const { error } = err.response.data;
      const errorKeys = Object.keys(error);
      const errorVals = Object.values(error);

      /* Multiple error message could be recieved from the server.
         Display anyone of them. The first message is a generic one and
         do not specify where the error is, therefore if there are multiple
         messages present, display from non-generic ones */
      if (errorKeys.length > 0) {
        showBottomMessage(errorVals[errorVals.length - 1]);
      } else {
        showBottomMessage("Couldn't save preferences.");
      }
    }
  }

  // function to discard the preference
  function clearState() {
    // reset the state.
    setFunctionalArea('');
    setExperienceLevel('0-3 years');
    setLocation('');
    setSkill('');
    setCompany('');
    setWorkType('Onsite');

    setAllSkills([]);
    setAllLocations([]);
    setAllCompanies([]);
  }

  // This is a utility function to format error message than hardcoding it.
  /*
    params:
      list -> the list's length we are validating
      limit -> the limits of the length of the list (could be min or max limits)
      attribute -> this is required to generate error message.
  */
  function formatArrLengthMessage(list, limit, attribute = '') {
    const [minLen, maxLen] = limit;

    if (list.length < minLen) {
      return `You should add atleast ${minLen} 
      preferred ${attribute}`;
    } else if (list.length >= maxLen) {
      return `You can add a maximum of ${maxLen} 
      preferred ${attribute}`;
    }

    // if the length is valid, then there is no error.
    return null;
  }

  // function to validate the input
  function validateInputData() {
    /* The validation is simple, it checks if the length is of the arrays are
       in allowed range. */

    // common fields for both seekers and referrers [location, position]
    const isLocationValid =
      allLocations?.length >= validationObj?.locationsCount?.[0] &&
      allLocations?.length <= validationObj?.locationsCount?.[1];

    if (!isLocationValid) {
      return setIsDataValid(false);
    }

    if (isProfessional === true) {
      // professional only field [skills]
      const isSkillValid =
        allSkills?.length >= validationObj?.skillsCount?.[0] &&
        allSkills?.length <= validationObj?.skillsCount?.[1];

      if (!isSkillValid) {
        return setIsDataValid(false);
      }
    } else {
      // seeker only field [companies]
      const isCompaniesValid =
        allCompanies?.length >= validationObj?.companiesCount?.[0] &&
        allCompanies?.length <= validationObj?.companiesCount?.[1];

      if (!isCompaniesValid) {
        return setIsDataValid(false);
      }
    }

    return setIsDataValid(true);
  }

  // function to fetch auto suggestions from the backend
  async function fetchAutoSuggestions(url, data) {
    try {
      // the input text is sent as query parameter
      const res = await privateAxios.get(url, { params: data });

      if (res.status === 200) {
        // return the array with suggestions here
        return res.data.suggestions;
      }
    } catch (error) {
      // return the empty array implying there's no suggestions
      return [];
    }
  }

  // functions to provide users with auto suggestions
  /*
    This function depends on 3 parameters,
    1. inputText -> input provided by the user
    2. attribute -> the field in which the user is typing
    (positions, locations, skills...etc.,)
  */
  async function updateAutoSuggestions(inputText, attribute) {
    // if the length of the text is 0, return
    if (inputText.length === 0) return;

    /* in each case make a network request to the server
    and load appropriate suggestions */

    const url = `/suggestions/${attribute}`;
    const data = { text: inputText, functionalArea: functionalArea };
    const suggestions = await fetchAutoSuggestions(url, data);

    // after retrieving the suggestions, update the state with the suggestions.
    switch (attribute) {
      case 'skills': {
        // remove the already added values from the suggestions
        const filteredSuggestions = [];

        suggestions.forEach((suggestion) => {
          /* for each suggestion, check if the user has
            already added that value. */
          const idx = allSkills.findIndex((skill) => {
            return skill.toLowerCase() === suggestion.skill.toLowerCase();
          });

          if (idx === -1) {
            filteredSuggestions.push(suggestion);
          }
        });

        setSkillSuggestions(filteredSuggestions);
        break;
      }

      case 'locations': {
        const filteredSuggestions = [];

        suggestions.forEach((suggestion) => {
          const city = suggestion.city;
          const idx = allLocations.findIndex((location) => {
            const temp = location.split('(');
            return temp[0].toLowerCase().trim() === city.toLowerCase().trim();
          });

          if (idx === -1) {
            filteredSuggestions.push(suggestion);
          }
        });

        setLocationSuggestions(filteredSuggestions);
        break;
      }

      default:
        return;
    }
  }

  // convert first letter in each word to upper case.
  function formatString(str) {
    return str
      .split(' ')
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(' ');
  }

  useEffect(() => {
    // add the event listeners for 'enter' key in all the input elements
    const allInputs = document.querySelectorAll(
      '.dashboard_preference_form_control input'
    );
    allInputs.forEach((inputEle) => {
      inputEle.addEventListener('keyup', addInputs);
    });

    return () => {
      allInputs.forEach((inputEle) => {
        inputEle.removeEventListener('keyup', addInputs);
      });
    };
  }, [addInputs]);
  /* <- adding function as dependency is important, or else the
    variables used inside the function will not be updated
    and used from the closure */

  useEffect(() => {
    // when data is being changed, check it's validity
    validateInputData();
  }, [allLocations, allSkills, allCompanies]);

  useEffect(() => {
    // if the data is being updated, pre fill the state with previous values
    if (isDataUpdated) {
      if (isProfessional) {
        const proPreferences = userPreferences?.professional;
        setExperienceLevel(proPreferences?.experience);
        setAllLocations(proPreferences?.locations);
        setAllSkills(proPreferences?.skills);
        setFunctionalArea(proPreferences?.functionalArea);
      } else {
        const seekerPreferences = userPreferences?.seeker;
        setExperienceLevel(seekerPreferences?.experience);
        setAllLocations(seekerPreferences?.locations);
        setWorkType(seekerPreferences?.workType);
        setAllCompanies(seekerPreferences?.companies);
        setFunctionalArea(seekerPreferences?.functionalArea);
        setAllSkills(seekerPreferences?.skills);
      }
    }
  }, [isProfessional]);

  useEffect(() => {
    // update the state when the context is changed
    setIsProfessional(userMode === 'professional');

    // change the validation object depending on the user mode
    setValidationObj(
      userMode === 'professional' ? proValidation : seekerValidation
    );
  }, [userMode]);

  return (
    <div className="dashboard_profile_preferences">
      <div className="dashboard_preference_form_row">
        <div className="dashboard_preference_form_control">
          <label>
            Functional area <span>*</span>
          </label>
          <select
            value={functionalArea}
            onChange={(e) => {
              setFunctionalArea(e.target.value);

              // on changing this field, remove the skills from previous value.
              setAllSkills([]);
            }}
          >
            <option value={'IT'}>IT</option>
            <option value={'Project Management'}>Project Management</option>
            <option value={'Digital Marketing'}>Digital Marketing</option>
            <option value={'Graphic Design'}>Graphic Design</option>
            <option value={'UI/UX Design'}>UI/UX Design</option>
            <option value={'Sales'}>Sales</option>
            <option value={'Product Manager'}>Product Manager</option>
          </select>
        </div>

        <div className="dashboard_preference_form_control">
          <label>
            Experience level <span>*</span>
          </label>
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
          >
            <option value={'0-3 years'}>0-3 years</option>
            <option value={'3-5 years'}>3-5 years</option>
            <option value={'5-7 years'}>5-7 years</option>
            <option value={'7-10 years'}>7-10 years</option>
            <option value={'10+ years'}>10+ years</option>
          </select>
        </div>
      </div>

      <div className="dashboard_preference_form_row">
        {/* This field should be displayed for professionals only */}
        <div className="dashboard_preference_form_control">
          <label>
            Skills <span>*</span>
          </label>
          <input
            type="text"
            data-attribute="skills"
            value={skill}
            onChange={(e) => {
              setSkill(e.target.value);

              // update the suggestions, everytime input is updated
              updateAutoSuggestions(e.target.value.trim(), 'skills');
            }}
            disabled={allSkills?.length >= validationObj?.skillsCount?.[1]}
          />
          <span
            className="form_enter_help"
            style={{
              display: `${skill.length == 0 ? 'none' : 'inline'}`,
            }}
          >
            Enter
          </span>
          <span className="form_warning_message">
            {(showErrorMessages ||
              allSkills?.length >= validationObj?.skillsCount?.[1]) &&
              formatArrLengthMessage(
                allSkills,
                validationObj?.skillsCount,
                'skill(s)'
              )}
          </span>

          {/* auto suggestion box */}
          {skill.length > 0 && skillSuggestions.length > 0 ? (
            <div className="dashboard_preferences_auto_suggestions">
              {/* {skillSuggestions.length} */}
              {/* iterate over the suggestions array and display it here */}
              {skillSuggestions.length > 0 &&
                skillSuggestions.map((suggestion) => {
                  return (
                    <p
                      key={suggestion._id}
                      onClick={(e) => {
                        setAllSkills([...allSkills, e.target.textContent]);
                        setSkill('');

                        // add the focus back to the input element
                        e.target
                          .closest('.dashboard_preference_form_control')
                          .querySelector('input')
                          .focus();
                      }}
                    >
                      {formatString(suggestion.skill)}
                    </p>
                  );
                })}
            </div>
          ) : null}

          <div>
            {allSkills?.map((skill, index) => {
              return (
                <span
                  data-index={index}
                  data-attribute="skills"
                  className="preference_input_tag"
                  key={index}
                >
                  {skill}
                  <Image
                    src={crossIcon}
                    onClick={removeInputs}
                    alt={`remove ${skill}`}
                  />
                </span>
              );
            })}
          </div>
        </div>

        <div className="dashboard_preference_form_control">
          <label>
            Location <span>*</span>
          </label>
          <input
            type="text"
            data-attribute="location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value.trim());
              updateAutoSuggestions(e.target.value.trim(), 'locations');
            }}
            disabled={
              allLocations?.length >= validationObj?.locationsCount?.[1]
            }
          />
          <span
            className="form_enter_help"
            style={{
              display: `${location.length == 0 ? 'none' : 'inline'}`,
            }}
          >
            Enter
          </span>

          <span className="form_warning_message">
            {(showErrorMessages ||
              allLocations?.length >= validationObj?.locationsCount?.[1]) &&
              formatArrLengthMessage(
                allLocations,
                validationObj?.locationsCount,
                'location(s)'
              )}
          </span>

          {/* auto suggestion box */}
          <div
            style={{
              display:
                locationSuggestions.length > 0 && location.length > 0
                  ? 'block'
                  : 'none',
            }}
            className="dashboard_preferences_auto_suggestions"
          >
            {/* iterate over the suggestions array and display it here */}
            {locationSuggestions.map((suggestion) => {
              return (
                <p
                  key={suggestion._id}
                  onClick={(e) => {
                    setAllLocations([...allLocations, e.target.textContent]);
                    setLocation('');

                    // add the focus back to the input element
                    e.target
                      .closest('.dashboard_preference_form_control')
                      .querySelector('input')
                      .focus();
                  }}
                >
                  {`${suggestion.city} (${suggestion.country})`}
                </p>
              );
            })}
          </div>

          <div>
            {allLocations?.map((location, index) => {
              return (
                <span
                  data-index={index}
                  data-attribute="location"
                  className="preference_input_tag"
                  key={index}
                >
                  {location}
                  <Image
                    src={crossIcon}
                    onClick={removeInputs}
                    alt={`remove ${location}`}
                  />
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* This field should be displayed for job seekers only */}
      {isProfessional === false && (
        <div className="dashboard_preference_form_row">
          <div className="dashboard_preference_form_control">
            <label>
              Companies <span>*</span>
            </label>
            <input
              type="text"
              data-attribute="companies"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={
                allCompanies?.length >= validationObj?.companiesCount?.[1]
              }
            />
            <span
              className="form_enter_help"
              style={{
                display: `${company.length == 0 ? 'none' : 'inline'}`,
              }}
            >
              Enter
            </span>
            <span className="form_warning_message">
              {(showErrorMessages ||
                allCompanies?.length >= validationObj?.companiesCount?.[1]) &&
                formatArrLengthMessage(
                  allCompanies,
                  validationObj?.companiesCount,
                  'companies'
                )}
            </span>

            <div>
              {allCompanies?.map((company, index) => {
                return (
                  <span
                    data-index={index}
                    data-attribute="companies"
                    className="preference_input_tag"
                    key={index}
                  >
                    {company}
                    <Image
                      src={crossIcon}
                      onClick={removeInputs}
                      alt={`remove ${company}`}
                    />
                  </span>
                );
              })}
            </div>
          </div>

          <div className="dashboard_preference_form_control">
            <label>
              Work Type <span>*</span>
            </label>
            <div className="preference_worktype_options">
              <span
                onClick={() => setWorkType('Onsite')}
                className={
                  workType == 'Onsite' ? 'preference_active_worktype' : ''
                }
              >
                Onsite
              </span>
              <span
                onClick={() => setWorkType('Work from home')}
                className={
                  workType == 'Work from home'
                    ? 'preference_active_worktype'
                    : ''
                }
              >
                Work from home
              </span>
              <span
                onClick={() => setWorkType('Hybrid')}
                className={
                  workType == 'Hybrid' ? 'preference_active_worktype' : ''
                }
              >
                Hybrid
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard_preference_form_row">
        <span className="preferences_discard_option" onClick={clearState}>
          Discard preference
        </span>

        <button
          onClick={savePreferences}
          className={`preferences_save_button 
          ${isDataValid === false ? 'disable_save_button' : ''}`}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ProfilePreferences;
