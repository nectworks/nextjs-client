'use client';
/*
  File: ProfileActions.js
  Description: This is a component rendered inside the profile page.
  This contains all the pop up windows to add information
  (like experience, education...etc.,)
*/

import './ProfileActions.css';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import ProfileAbout from '../../_components/Profile/ProfileAbout/ProfileAbout.js';
import ProfileEducation from '../../_components/Profile/ProfileEducation/ProfileEducation.js';
import ProfileExperience from '../../_components/Profile/ProfileExperience/ProfileExperience.js';
import ProfileAchievements from '../../_components/Profile/ProfileAchievements/ProfileAchievements.js';
import ProfileSocials from '../../_components/Profile/ProfileSocials/ProfileSocials.js';
import ProfileSkills from '../../_components/Profile/ProfileSkills/ProfileSkills.js';
import ProfileProjects from '../../_components/Profile/ProfileProjects/ProfileProjects.js';
import { useContext, useEffect, useState } from 'react';
import { ProfileContext } from '@/context/UpdateProfile/ProfileContext';
import usePrivateAxios from '@/Utils/usePrivateAxios.js';
import { DashboardContext } from '@/context/Dashboard/DashboardContext.js';
import showBottomMessage from '@/Utils/showBottomMessage.js';
import sendGAEvent from '@/Utils/gaEvents.js';
import Image from 'next/image';

/*
  A JSX function to get the corresponding action based on step number
*/
function GetProfileAction({ step, ...otherProps }) {
  switch (step) {
    case 1:
      return <ProfileAbout {...otherProps} />;
    case 2:
      return <ProfileExperience {...otherProps} />;
    case 3:
      return <ProfileEducation {...otherProps} />;
    case 4:
      return <ProfileSocials {...otherProps} />;
    case 5:
      return <ProfileSkills {...otherProps} />;
    case 6:
      return <ProfileAchievements {...otherProps} />;
    case 7:
      return <ProfileProjects {...otherProps} />;

    default:
      return <></>;
  }
}

const ProfileActions = ({
  setActionPopup,
  setUserInfo,
  subSection,
  subSectionIndex,
  isDataUpdated,
}) => {
  /* This component is reused for the user input process initially
     and to edit and add new information later. */

  const [state, dispatch] = useContext(ProfileContext);
  const [userInfo, setUser] = useContext(DashboardContext);

  const privateAxios = usePrivateAxios();

  // state to show the correct information based on the subsection number
  /* for initial process we start from 1,
    else if we are editing/adding new info we display that subsection */
  const [step, setStep] = useState(subSection);

  // header and description content changes based on the 'step'
  const [header, setHeader] = useState('');
  const [description, setDescription] = useState('');

  // state of the next button is controlled by children components
  const [disableNext, setDisableNext] = useState(true);
  // message array contains, message string and the type of the message
  const [message, setMessage] = useState([]);

  // set the loader to indicate the network call
  const [isLoading, setIsLoading] = useState(false);

  // state of the skip button is controlled based on the form's input validity
  const [disableSkip, setDisableSkip] = useState(false);

  // function to increase/decrease the 'step'
  function changeStep(e, type) {
    if (type === 'previous') {
      setStep((prevStep) => prevStep - 1);

      // clear the message when navigating back
      setMessage([]);
    } else if (type === 'next') {
      // before moving if there are any messages display it
      if (message?.[0]?.length > 0) displayMessage();

      // move only if the next button is enabled
      if (disableNext) return;
      setStep((prevStep) => prevStep + 1);
    }
  }

  // delete the document linked with any subsection
  async function deleteDocument(document) {
    if (!document) return;

    try {
      const data = { file: document };

      await privateAxios.delete(`/profile/delete-file`, { data });
    } catch (error) {
      const errorData = error?.response?.data;
      displayMessage([errorData?.message, 'error']);
    }
  }

  // function to skip the current window
  function skipStep(e) {
    /* 1. disable the skip button when form input is invalid
    2. display the message before enabling the button
    3. enable the skip button after displaying the message */

    if (disableSkip === true) {
      displayMessage(
        [
          `Current input data will be lost, press 'skip' again to continue`,
          'error',
        ],
        5500
      );
      setDisableSkip(false);
      return;
    }

    /* if the user chooses to skip the section after prompt,
      remove the local data */

    /* if the section being skipped has a document associated, remove
      the document associated with it */
    if (step >= 6) {
      let sectionToRemove = '';

      if (step == 6) sectionToRemove = 'achievements';
      else if (step == 7) sectionToRemove = 'projects';
      deleteDocument(state?.[sectionToRemove]?.[0]?.document);
    }

    dispatch({
      type: 'REMOVE_SECTION',
      payload: { step: step - 1 },
    });

    // move to the next step
    setStep((prevVal) => prevVal + 1);
  }

  // function to show/hide message
  const [prevTimeOut, setPrevTimeOut] = useState(null);
  function displayMessage(_message = [], time = 4000) {
    const msg = _message.length === 0 ? message : _message;

    // display the message provided in the parameter or in the state.
    const msgEle = document.querySelector('.dashboard_profile_message');
    msgEle.textContent = msg[0];
    msgEle.classList.remove('hide_message_window');

    // decide the text color base on the message type
    let textColor = '';

    switch (msg?.[1]) {
      case 'success': {
        textColor = 'green';
        break;
      }

      case 'error': {
        textColor = 'red';
        break;
      }

      default: {
        textColor = 'black';
        break;
      }
    }

    msgEle.style.color = textColor;

    // clear the previous timeout
    if (prevTimeOut) clearTimeout(prevTimeOut);

    // clear the message after 4 seconds
    const messageTimeOut = setTimeout(() => {
      msgEle.textContent = '';
      msgEle.classList.add('hide_message_window');
      setMessage([]);
    }, time);

    setPrevTimeOut(messageTimeOut);
  }

  // function to save data to the server
  async function sendData() {
    setIsLoading(true);

    try {
      const data = state;

      /* socials is saved as object in the frontend,
     convert it to array and send to backend. */
      if (data.socials) data.socials = Object.values(data?.socials);

      const res = await privateAxios.post(`/profile/user-info`, data);

      if (res.status === 200) {
        // close the popup if the data was sent successfully
        setActionPopup(false);

        // display the data after submitting
        const { data } = res.data;
        setUserInfo(data?.userInfo);

        // change the data in sessionStorage
        dispatch({ type: 'CLEAR_STATE' });

        // Reload the page
        window.location.reload();
      }
    } catch (error) {
      const errorData = error?.response?.data?.error;
      displayMessage([errorData?.message, 'error']);
    }
    setIsLoading(false);
  }

  // function to update data to the server
  async function updateData(e) {
    e.stopPropagation();

    // if the button is disabled, don't save the data.
    if (disableNext) {
      if (message?.[0]?.length > 0) displayMessage();
      return;
    }

    try {
      // retrieve the changes from the localStorage and remove it.
      const data = JSON.parse(localStorage.getItem('dashboard'));
      localStorage.removeItem('dashboard');
      dispatch({ type: 'CLEAR_STATE' });

      // convert the socials object to array
      if (data?.socials) data.socials = Object.values(data?.socials);
      const res = await privateAxios.patch(`/profile/user-info`, data);

      const resData = res.data.data;
      setActionPopup(false);

      // save the new data into state
      setUserInfo(resData.userInfo);

      // Reload the page
      window.location.reload();
    } catch (error) {
      console.log(error);
      // TODO: remove log statement with popup message
    }
  }

  /* Function to delete user data. This is primarily used by fields that
     have array of objects as values. To delete an object inside an array
     we need the `arrFieldName` (array name) and `subDocumentId` (the _id of the
     object that needs to be deleted from the array)  */
  async function deleteData(e) {
    e.stopPropagation();

    // we can obtain the `arrFieldName` value using the below 'mapping'
    const stepsToSectionMap = {
      1: 'about',
      2: 'experience',
      3: 'education',
      4: 'skills',
      5: 'socials',
      6: 'achievements',
      7: 'projects',
    };

    const arrFieldName = stepsToSectionMap[subSection];
    const subDocument = userInfo[arrFieldName][subSectionIndex];
    const subDocumentId = subDocument._id;

    try {
      const res = await privateAxios.delete(`/profile/user-info`, {
        data: {
          field: arrFieldName,
          subDocumentId,
        },
      });

      if (res.status === 200) {
        const updatedUserInfo = { ...userInfo };
        const idx = updatedUserInfo[arrFieldName].findIndex((doc) => {
          return doc._id === subDocumentId;
        });
        updatedUserInfo[arrFieldName].splice(idx, 1);

        // save updated user info
        setUserInfo(updatedUserInfo);

        // display a message to the user
        showBottomMessage('Successfully deleted data.');

        // close the popup
        setActionPopup(false);

        // clear the `edit data` state.
        dispatch({ type: 'CLEAR_STATE' });

        // Reload the page
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [revealDeleteMsg, setRevealDeleteMsg] = useState(false);
  function showDeleteConfirmationMessage(e) {
    setRevealDeleteMsg(true);
  }

  useEffect(() => {
    // after each step, send event where the user stops
    sendGAEvent('profile_steps', { vaule: step });
  }, [step]);

  return (
    <div className="dashboard_profile_actions_container">
      <div
        style={{ display: `${!isLoading ? 'none' : 'block'}` }}
        className="loader"
      ></div>

      <div
        style={{ display: `${isLoading ? 'none' : 'block'}` }}
        className="dashboard_profile_actions_window"
      >
        {/* display the loader if the page is loading */}
        <div className="dashboard_profile_actions_header">
          <h4>Add {header}</h4>
          <p>{description}</p>

          <Image
            onClick={() => {
              if (isDataUpdated) {
                // Display confirmation dialog
                if (
                  window.confirm(
                    'Are you sure you want to close? Any unsaved changes will be lost.'
                  )
                ) {
                  // Clear the changes if confirmed
                  dispatch({
                    type: 'CLEAR_STATE',
                  });
                  setActionPopup(false); // Close the window
                }
              } else {
                // Close the window without confirmation if no data is being updated
                setActionPopup(false);
              }
            }}
            src={crossIcon}
            alt="close window"
          />
        </div>

        <section className="dashboard_profile_actions_main_section">
          <GetProfileAction
            step={step}
            setHeader={setHeader}
            setDescription={setDescription}
            setMessage={setMessage}
            displayMessage={displayMessage}
            setDisableNext={setDisableNext}
            setDisableSkip={setDisableSkip}
            isDataUpdated={isDataUpdated}
            subSectionIndex={subSectionIndex}
          />
        </section>

        {/* Footer is different based on the scenario in which
          this component is used

          The 2 cases as of now are:
          1. During the initial data input process -> primary footer
          2. During editing/adding new data from profile page -> secondary footer
        */}
        <div className="dashboard_profile_actions_footer">
          {/* This footer is displayed when the user
             is in initial input process */}
          <div
            className="dashboard_profile_primary_footer"
            style={{ display: isDataUpdated ? 'none' : 'flex' }}
          >
            <div>
              {step > 1 && step < 7 && (
                <span
                  onClick={skipStep}
                  className="dashboard_profile_actions_skip"
                >
                  Skip
                </span>
              )}
              <span>{step} of 7</span>
            </div>

            {isDataUpdated === false && (
              <span className="dashboard_profile_message hide_message_window"></span>
            )}

            <div>
              {step > 1 && (
                <button
                  className="dashboard_profile_actions_prev_button"
                  onClick={(e) => changeStep(e, 'previous')}
                >
                  Previous
                </button>
              )}
              {step < 7 && (
                <button
                  className={
                    `dashboard_profile_actions_next_button ` +
                    `${disableNext ? 'dashboard_disable_button' : ''}`
                  }
                  onClick={(e) => changeStep(e, 'next')}
                >
                  Next
                </button>
              )}
              {step == 7 && (
                <button
                  className="dashboard_profile_actions_save_button"
                  onClick={sendData}
                >
                  Finish
                </button>
              )}
            </div>
          </div>

          {/* This footer is displayed when editing/adding new data */}
          {isDataUpdated === true && (
            <div className="dashboard_profile_secondary_footer">
              <span className="dashboard_profile_message hide_message_window"></span>

              <button
                style={{ display: isDataUpdated ? 'inline-block' : 'none' }}
                className={
                  `dashboard_profile_actions_save_button ` +
                  `${disableNext ? 'dashboard_disable_button' : ''}`
                }
                onClick={updateData}
              >
                Save
              </button>
              <button
                className="dashboard_profile_actions_close_button2"
                onClick={(e) => {
                  if (isDataUpdated) {
                    // Display confirmation dialog
                    if (
                      window.confirm(
                        'Are you sure you want to close? Any unsaved changes will be lost.'
                      )
                    ) {
                      // Clear the changes if confirmed
                      dispatch({
                        type: 'CLEAR_STATE',
                      });
                      setActionPopup(false); // Close the window
                    }
                  } else {
                    // Close the window without confirmation if no data is being updated
                    setActionPopup(false);
                  }
                }}
              >
                Close
              </button>

              {/* subSectionIndex === -1 when the user is adding new data
                  else it contains, the index of the data being edit */}
              <div className="dashboard_profile_delete_action">
                {isDataUpdated === true && subSectionIndex !== -1 && (
                  <>
                    {revealDeleteMsg === false ? (
                      <button
                        className="delete_data_button"
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
                        <button onClick={deleteData}>Yes</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileActions;
