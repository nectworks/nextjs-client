'use client';
/*
  File: ProfileAbout.js
  Description: This file contains the pop up window to add 'about'
  in the user's profile.
*/

import { useContext, useEffect, useState } from 'react';
import './ProfileAbout.css';
import Image from 'next/image';
import { ProfileContext } from '@/context/UpdateProfile/ProfileContext';
import { DashboardContext } from '@/context/Dashboard/DashboardContext';
import { UserContext } from '@/context/User/UserContext';
import infoIcon from '@/public/SignIn/information.webp';

function ProfileAbout({
  setHeader,
  setDescription,
  setMessage,
  setDisableNext,
  isDataUpdated,
}) {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  const [isProfessional, setIsProfessional] = useState(
    user.professionalDetails.isVerifiedEmail
  );

  const [state, dispatch] = useContext(ProfileContext);
  const [userInfo, setUserInfo] = useContext(DashboardContext);

  const formInput = useMemo(
    () => ({
      bio: '',
      additionalInfo: '',
    }),
    []
  );

  // states contain the input value.
  const [aboutInput, setAboutInput] = useState(state?.about || formInput);

  const header = 'About';
  const description =
    "Tell your story! Highlight where you've worked, " +
    'the skills that shine, and any standout projects or achievements. ' +
    "It's all about painting a picture of your professional journey.";

  useEffect(() => {
    setHeader(header);
    setDescription(description);

    // if the current data is being updated, fetch and prepopulate the state
    if (isDataUpdated === true) {
      if (!userInfo) return;

      const currAbout = { ...userInfo.about };

      // if the user is not professional, hide the additional info
      if (isProfessional === false) {
        currAbout.additionalInfo = '';
      }

      dispatch({
        type: 'UPDATE_ABOUT',
        payload: { about: userInfo.about },
      });

      setAboutInput(currAbout || formInput);
    }
  }, [
    description,
    dispatch,
    formInput,
    isDataUpdated,
    isProfessional,
    setDescription,
    setHeader,
    userInfo,
  ]);

  // save the changes in state and context
  function handleFormInputChange(e, type) {
    // update the about state with new value.
    const updatedAbout = { ...state.about };
    updatedAbout[type] = e.target.value;

    setAboutInput(updatedAbout);
    dispatch({
      type: 'UPDATE_ABOUT',
      payload: { about: updatedAbout },
    });
  }

  useEffect(() => {
    if (aboutInput?.bio?.length === 0) {
      setDisableNext(true);
      setMessage(['About section is required', 'error']);
    } else {
      setMessage(['Data saved successfully', 'success']);
      setDisableNext(false);
    }
  }, [aboutInput, setDisableNext, setMessage]);

  return (
    <div className="dashboard_profile_about_container">
      <div>
        <textarea
          className="dashboard_profile_about_field"
          rows={10}
          cols={50}
          value={aboutInput.bio}
          onChange={(e) => handleFormInputChange(e, 'bio')}
          maxLength="3000"
          placeholder="Write your bio..."
        />

        <span className="dashboard_about_chars">
          {aboutInput.bio?.length}/3000
        </span>
      </div>

      <div className="dashboard_profile_additional_about">
        <div className="additional_about_heading">
          <h4>What do I love about my job?</h4>
          <p>(Recommended)</p>

          {/* if the user is not professional, display this message */}
          {isProfessional === false && (
            <>
              <div className="info_icon">
                <Image className="Info_icon_img" src={infoIcon} alt="info" />
              </div>
              <span className="email_verify_message">
                Verify your work email to add this field.
              </span>
            </>
          )}
        </div>

        <textarea
          className="dashboard_profile_about_field"
          rows={10}
          cols={50}
          value={aboutInput.additionalInfo}
          onChange={(e) => handleFormInputChange(e, 'additionalInfo')}
          maxLength="3000"
          placeholder={
            'I like the support I receive from peers ' +
            'and management here @xyzCompany. The job is challenging ' +
            'enough and pushes my limits, and I found myself growing fast.'
          }
          disabled={isProfessional === false}
        />

        <span className="dashboard_about_chars">
          {aboutInput.additionalInfo?.length || 0}/3000
        </span>
      </div>
    </div>
  );
}

export default ProfileAbout;
