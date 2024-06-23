'use client';
/*
  File: ProfileSocials.js
  Description: This file contains the pop up window to add 'social links'
  in the user's profile.
*/

import { useContext, useEffect, useState } from 'react';
import './ProfileSocials.css';
import { ProfileContext } from '@/context/UpdateProfile/ProfileContext';
import addIcon from '@/public/Profile/addIcon.svg';
import { DashboardContext } from '@/context/Dashboard/DashboardContext';
import Image from 'next/image';

function ProfileSocials({
  setHeader,
  setDescription,
  setMessage,
  setDisableNext,
  setDisableSkip,
  isDataUpdated,
}) {
  const [state, dispatch] = useContext(ProfileContext);
  const [userInfo, setUserInfo] = useContext(DashboardContext);

  /*
    Links are stored in a object, with index as keys.
    This is better to handle state from multiple input elements.
  */
  const [links, setLinks] = useState(state?.socials || {});

  /*
    The first link in the object is for linkedin.
    Other links start from index 1.
  */
  const [otherLinksLen, setOtherLinksLen] = useState(0);

  // update the links in local state and the context
  function updateLink(e, index) {
    const updatedLinks = {
      ...links,
      [index]: e.target.value,
    };

    setLinks(updatedLinks);
    saveChanges(updatedLinks);
  }

  // function to delete the link at the given index
  function deleteLink(e, index) {
    /*
      Since the links are stored as object, the delete operation distorts
      the ordering of the keys in the object. Therefore, convert it to array,
      remove the element at an index and convert it back to object.
    */
    const currLinksArr = Object.values(links);
    currLinksArr.splice(index, 1);

    const newLinksObj = Object.assign({}, currLinksArr);

    setLinks(newLinksObj);
    setOtherLinksLen((prevVal) => prevVal - 1);
    saveChanges(newLinksObj);
  }

  // function to save changes to context
  function saveChanges(data) {
    dispatch({
      type: 'UPDATE_SOCIALS',
      payload: { socials: data },
    });

    setMessage(['Data saved successfully', 'success']);
  }

  // function to check if the url is valid
  function isValidURL(url) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  }

  function isValidLinkedInURL(url) {
    const linkedInPattern =
      /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/i;
    return linkedInPattern.test(url);
  }

  useEffect(() => {
    // set the header and description for this component
    const header = 'Social Profile';
    const description = 'Let others find you online. 🔍';

    setHeader(header);
    setDescription(description);

    // scroll to top on first render
    const firstFormControl = document.querySelectorAll(
      '.dashboard_socials_form_control'
    )[0];
    firstFormControl.scrollIntoView({ behavior: 'smooth' });

    // if the data is being updated, prepopulate the fields
    if (isDataUpdated) {
      if (!userInfo) return;

      if (isDataUpdated) {
        /* the socials are stored as array in backend, but are manipulated as
        js object in the frontend, therefore convert it to object
        before using */
        const tempLinksObj = Object.assign({}, userInfo?.socials);
        setLinks(tempLinksObj);
      }
    }
  }, []);

  useEffect(() => {
    const linksSize = Math.max(Object.keys(links)?.length - 1, 0);
    setOtherLinksLen(linksSize);
  }, [links]);

  useEffect(() => {
    /* Check if the user input data is valid and disableSkip and
      disableNext based on it */
    const linksArr = Object.values(links);

    if (linksArr.length < 1) {
      setDisableNext(true);
      setDisableSkip(false);
      setMessage(['Add all the required fields or skip for now', 'error']);
    } else {
      setDisableNext(false);
      setDisableSkip(true);

      // check if the first link is a valid linkedin url
      if (!isValidLinkedInURL(linksArr[0])) {
        setMessage(['Invalid LinkedIn url', 'error']);
        setDisableNext(true);
        return;
      }

      // check if other urls are a valid url
      linksArr.slice(1).forEach((link) => {
        if (!isValidURL(link)) {
          setMessage(['Invalid url in other links', 'error']);
          setDisableNext(true);
          return;
        }
      });
    }
  }, [links]);

  return (
    <div className="dashboard_profile_socials_container">
      <div className="dashboard_socials_form_control">
        <label style={{ marginTop: '0' }}>
          LinkedIn <span> *</span>
        </label>
        <input
          type="text"
          value={links['0'] || ''}
          onChange={(e) => updateLink(e, 0)}
        />
      </div>

      <div className="dashboard_socials_other_links">
        {Array.from({ length: otherLinksLen }).map((_, idx) => {
          return (
            <div key={idx} className="dashboard_socials_form_control">
              <label>Other Links</label>
              <div>
                <input
                  type="text"
                  value={links[idx + 1] || ''}
                  onChange={(e) => updateLink(e, idx + 1)}
                />
                <span
                  className="dashboard_socials_delete"
                  onClick={(e) => deleteLink(e, idx + 1)}
                >
                  Delete Link
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* limit the number of links to 5 */}
      {otherLinksLen < 3 && (
        <button
          className="dashboard_socials_add"
          onClick={(e) => setOtherLinksLen((prevLen) => prevLen + 1)}
        >
          <Image src={addIcon} alt="add related links" />
          <span>Add More</span>
        </button>
      )}
    </div>
  );
}

export default ProfileSocials;
