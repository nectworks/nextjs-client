'use client';
/*
  File: ProfileSocials.js
  Description: This file contains the pop-up window to add 'social links'
  to the user's profile.
*/

import { useContext, useEffect, useState } from 'react';
import './ProfileSocials.css';
import { ProfileContext } from '@/context/UpdateProfile/ProfileContext';
import { DashboardContext } from '@/context/Dashboard/DashboardContext';
import Image from 'next/image';
import addIcon from '@/public/Profile/addIcon.svg';
import linkedinLogo from '@/public/socialsLogo/linkedinLogo.svg';
import twitterLogo from '@/public/socialsLogo/twitterLogo.svg';
import githubLogo from '@/public/socialsLogo/githubLogo.svg';
import devLogo from '@/public/socialsLogo/devToLogo.svg';
import instagramLogo from '@/public/socialsLogo/instagramLogo.svg';
import facebookLogo from '@/public/socialsLogo/facebookLogo.svg';
import mediumLogo from '@/public/socialsLogo/mediumLogo.svg';
import figmaLogo from '@/public/socialsLogo/figmaLogo.svg';
import substackLogo from '@/public/socialsLogo/substackLogo.svg';
import tiktokLogo from '@/public/socialsLogo/tiktokLogo.svg';
import twitchLogo from '@/public/socialsLogo/twitchLogo.svg';
import youtubeLogo from '@/public/socialsLogo/youtubeLogo.svg';
import behanceLogo from '@/public/socialsLogo/behanceLogo.svg';
import dribbleLogo from '@/public/socialsLogo/dribbleLogo.svg';
import crunchbaseLogo from '@/public/socialsLogo/crunchbaseLogo.svg';
import hashnodeLogo from '@/public/socialsLogo/hashnodeLogo.svg';

function ProfileSocials({
  setHeader,
  setDescription,
  setMessage,
  setDisableNext,
  setDisableSkip,
  isDataUpdated,
  setHasUnsavedChanges,
}) {
  const [state, dispatch] = useContext(ProfileContext);
  const [userInfo, setUserInfo] = useContext(DashboardContext);

  const socialMedia = [
    { name: 'LinkedIn', baseURL: 'https://www.linkedin.com/in/', icon: linkedinLogo },
    { name: 'Twitter', baseURL: 'https://twitter.com/', icon: twitterLogo },
    { name: 'GitHub', baseURL: 'https://github.com/', icon: githubLogo }, 
    { name: 'Dev.to', baseURL: 'https://dev.to/', icon: devLogo },
    { name: 'Instagram', baseURL: 'https://www.instagram.com/', icon: instagramLogo },
    { name: 'Facebook', baseURL: 'https://www.facebook.com/', icon: facebookLogo },
    { name: 'Medium', baseURL: 'https://medium.com/@', icon: mediumLogo },
    { name: 'Figma', baseURL: 'https://www.figma.com/@', icon: figmaLogo },
    { name: 'Substack', baseURL: 'https://substack.com/profile/', icon: substackLogo },
    { name: 'TikTok', baseURL: 'https://www.tiktok.com/@', icon: tiktokLogo },
    { name: 'Twitch', baseURL: 'https://www.twitch.tv/', icon: twitchLogo },
    { name: 'YouTube', baseURL: 'https://www.youtube.com/c/', icon: youtubeLogo },
    { name: 'Behance', baseURL: 'https://www.behance.net/', icon: behanceLogo },
    { name: 'Dribble', baseURL: 'https://dribbble.com/', icon: dribbleLogo },
    { name: 'Crunchbase', baseURL: 'https://www.crunchbase.com/person/', icon: crunchbaseLogo },
    { name: 'Hashnode', baseURL: 'https://hashnode.com/@', icon: hashnodeLogo },
  ];

  const [links, setLinks] = useState(state?.socials || {});
  const [otherLinks, setOtherLinks] = useState({});
  const [otherLinksLen, setOtherLinksLen] = useState(0);

  // Update the links in local state and the context
  function updateLink(e, platform) {
    
    if (!platform.includes("other")){
      const platformData = socialMedia.find((social) => social.name === platform);
      const trimmedValue = e.target.value.trim();
      const updatedLinks = {
        ...links,
        [platform]: trimmedValue ? platformData.baseURL + trimmedValue : '',
      };
      setLinks(updatedLinks);
      saveChanges(updatedLinks);
      setHasUnsavedChanges(true);
    } else {
      // It's an "other" link
      const updatedOtherLinks = {
        ...otherLinks,
        [platform]: e.target.value.trim(),
      };
      setOtherLinks(updatedOtherLinks);
      saveChanges({ ...links, ...updatedOtherLinks });
      setHasUnsavedChanges(true);
    }
  }
  

  // Function to save changes to context
  function saveChanges(data) {
    dispatch({
      type: 'UPDATE_SOCIALS',
      payload: { socials: data },
    });

    setMessage(['Data saved successfully', 'success']);
  }

  // Function to check if the URL is valid
  function isValidURL(url) {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
  }

  function isValidLinkedInURL(url) {
    const linkedInPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/i;
    return linkedInPattern.test(url);
  }

  useEffect(() => {
    const initialOtherLinksCount = Object.keys(links).filter(key => key.startsWith('other_')).length;
    setOtherLinksLen(initialOtherLinksCount);
  }, [links]);

  function deleteLink(index) {
    const updatedLinks = { ...links };
    delete updatedLinks[index];

    setLinks(updatedLinks);
    setOtherLinksLen((prevVal) => prevVal - 1);
    saveChanges(updatedLinks);
  }

  useEffect(() => {
    // Set the header and description for this component
    const header = 'Social Profile';
    const description = 'Let others find you online. 🔍';
  
    setHeader(header);
    setDescription(description);
  
    // Scroll to top on first render
    const firstFormControl = document.querySelectorAll('.dashboard_socials_form_control')[0];
    firstFormControl.scrollIntoView({ behavior: 'smooth' });
  
    // If the data is being updated, prepopulate the fields
    if (isDataUpdated && userInfo) {
      const tempLinksObj = userInfo.socials.reduce((acc, link) => {
        const platform = socialMedia.find(social => link.startsWith(social.baseURL));
        if (platform) {
          acc[platform.name] = link;
        }
        return acc;
      }, {});

      // Separate "other" links and predefined social media links
      const tempOtherLinksObj = userInfo.socials.reduce((acc, link, index) => {
        if (!socialMedia.some(social => link.startsWith(social.baseURL))) {
          acc[`other_${index + 1}`] = link;
        }
        return acc;
      }, {});

      setLinks(tempLinksObj);
      setOtherLinks(tempOtherLinksObj);
    }
  }, [isDataUpdated, userInfo, setHeader, setDescription]);

  useEffect(() => {
    const linksArr = Object.entries({ ...links, ...otherLinks }).map(([key, value]) => ({
      platform: key,
      url: value,
    }));
  
    if (linksArr.length < 1 || !isValidLinkedInURL(links.LinkedIn)) {
      setDisableNext(true);
      setDisableSkip(false);
      setMessage(['Add a valid LinkedIn URL or skip for now', 'error']);
    } else {
      setDisableNext(false);
      setDisableSkip(true);
  
      // Check if other URLs are valid
      linksArr.slice(1).forEach((link) => {
        const platformData = socialMedia.find((social) => social.name === link.platform);
        if (link.url && !isValidURL(link.url)) {
          setMessage(['Invalid URL in other links', 'error']);
          setDisableNext(true);
        }
      });
    }
  }, [links, otherLinks, setDisableNext, setDisableSkip, setMessage]);

  return (
    <div className="dashboard_profile_socials_container">
      <div className="dashboard_profile_socials_container_links">
        {socialMedia.map((platform, index) => (
          <div key={index} className="dashboard_socials_form_control">
            <Image src={platform.icon} alt={`${platform.name} icon`} />
            <label style={{ marginTop: '0' }}>
              {platform.baseURL}
              <input
                type="text"
                value={links[platform.name]?.replace(platform.baseURL, '') || ''}
                onChange={(e) => updateLink(e, platform.name)}
              />
            </label>
          </div>
        ))}
        {Object.keys(otherLinks).map((key, index) => (
          <div key={index} className="dashboard_socials_form_control">
            <Image src={addIcon} alt="add related links" />
            <label style={{ marginTop: '0' }}>
              Other
              <input
                type="text"
                value={otherLinks[key] || ''}
                onChange={(e) => updateLink(e, key)}
              />
            </label>
          </div>
        ))}
      </div>

      {/* Limit the number of additional links */}
      {otherLinksLen < 3 && (
        <button
          className="dashboard_socials_add"
          onClick={() => {
            const newKey = `other_${otherLinksLen + 1}`;
            setOtherLinks({ ...otherLinks, [newKey]: '' });
            setOtherLinksLen((prevLen) => prevLen + 1);
          }}
        >
          <Image src={addIcon} alt="add related links" />
          <span>Add More</span>
        </button>
      )}
    </div>
  );
}


export default ProfileSocials;
