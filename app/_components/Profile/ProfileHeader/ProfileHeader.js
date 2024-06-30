'use client';

/*
  File: ProfileHeader.js
  Description: This component contains the generic header for
  all the pages in dashboard.
*/

import './ProfileHeader.css';
import shareProfile from '@/public/Profile/shareProfile.svg';
import copyProfile from '@/public/Profile/copyProfile.svg';
import nectCoinImg from '@/public/Profile/nectCoin.svg';
import { useContext, useEffect, useState, useRef } from 'react';
import ProfileImage from '../ProfileImage/ProfileImage';
import { UserContext } from '@/context/User/UserContext';
import showBottomMessage from '@/Utils/showBottomMessage';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import notification from '@/public/Profile/notification.png';
import close from '@/public/SignUpConfirmPopup/crossIcon.svg';
import noNotifications from '@/public/Profile/noNotifications.png';
import { publicAxios } from '@/config/axiosInstance';
import Link from 'next/link';
import Image from 'next/image';
import { Slide } from 'react-awesome-reveal';

function ProfileHeader() {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [handleDiv, setHandleDiv] = useState(false);
  const privateAxios = usePrivateAxios();
  const notificationListRef = useRef(null);
  const [referredReferrals, setReferredReferrals] = useState([]);

  //for handling the notification div toggle
  // for closing and opening
  const handleNotificationToggle = () => {
    setHandleDiv(!handleDiv);
  };

  // Effect hook to establish a server-sent events (SSE) connection for receiving
  //referred referrals in real-time
  useEffect(() => {
    if (!user) return;
    // Get the user ID from the user object
    const userId = user._id;
    let url;
    // Construct the URL for the server-sent events (SSE) endpoint
    if (process.env.NODE_ENV !== 'production') {
      url = `http://localhost:5001/api/v1/refer/private/referred?userId=${userId}`;
    } else {
      url = `/api/v1/refer/private/referred?userId=${userId}`;
    }

    // Declare a variable to hold the EventSource object
    let eventSource;

    // Close the existing EventSource connection if it exists
    if (eventSource) {
      eventSource.close();
      eventSource = undefined;
    }

    try {
      // Create a new EventSource object with the constructed URL
      eventSource = new EventSource(url, { withCredentials: true });

      // Event listener for incoming messages from the server
      eventSource.onmessage = async (event) => {
        // Parse the data received from the server
        const referralData = JSON.parse(event.data);

        // Check if the received referral is not already present in the state
        if (
          !referredReferrals.find(
            (referral) => referral._id === referralData._id
          )
        ) {
          try {
            // Fetch the page of the professional user associated with the referral
            const profileResponse = await publicAxios.get(
              `/getUser/${referralData.professionalUserId.username}`
            );
            const profile = profileResponse.data.user.profile;

            // Update the referral data with the fetched profile
            referralData.professionalUserId.profile = profile;
          } catch (error) {
            console.error(
              `Error fetching profile for referral with ID ${referralData._id}:`,
              error
            );
          }

          // Update the state with the new referral data
          setReferredReferrals((prevReferrals) => [
            ...prevReferrals,
            referralData,
          ]);
        }
      };

      // Event listener for handling errors from the EventSource connection
      eventSource.onerror = (error) => {
        console.error('SSE error:', error);

        // Close the EventSource connection on error
        eventSource.close();
        eventSource = undefined;
      };
    } catch (err) {
      console.error('Error creating EventSource:', err);
    }

    // Cleanup function to close the EventSource connection when the component unmounts
    return () => {
      if (eventSource) {
        eventSource.close();
        eventSource = undefined;
      }
    };
  }, [referredReferrals, user]); // Dependency array containing variables used inside the effect

  // Function to increment the total referred count for a specific referral
  const handleIncrement = async (referralId) => {
    try {
      // Send a POST request to the server to increment the total referred count
      const res = await privateAxios.post(
        `/increaseTotalReferred/${referralId}`
      );

      // Update the state to remove the referral that has been successfully incremented
      setReferredReferrals((prevData) =>
        prevData.filter((referral) => referral._id !== referralId)
      );
    } catch (error) {
      // Log and handle errors if they occur during the API request
      console.error('Error:', error);
    }
  };

  // Function to handle the "No" button click when a user does not confirm a referral
  const handleNoButtonClick = async (referralId, username) => {
    try {
      // Send a DELETE request to remove the referral
      await privateAxios.delete(`/refer/private?ids=${referralId}`);

      // Update the state to remove the referral that has been declined
      setReferredReferrals((prevReferrals) =>
        prevReferrals.filter((referral) => referral._id !== referralId)
      );

      // Redirect the user to the specified URL to request a referral
      const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/request-referral/${username}`;
      window.open(url, '_blank');
    } catch (error) {
      // Log and handle errors if they occur during the API request
      console.error('Error handling "No" button click:', error);
      // Additional error handling can be added if necessary
    }
  };

  // useEffect hook to handle clicks outside the notification list div
  useEffect(() => {
    // Function to handle clicks outside the notification list div
    const handleClickOutside = (event) => {
      // Check if the notification list is open and if the clicked target is outside
      //the notification list and header
      if (
        handleDiv &&
        notificationListRef.current &&
        !notificationListRef.current.contains(event.target) &&
        !event.target.closest('.dashboard_profile_header')
      ) {
        // Close the notification list
        setHandleDiv(false);
      }
    };

    // Add event listener to listen for mousedown events
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleDiv, notificationListRef]); // Dependency array containing handleDiv and notificationListRef

  /* If the user registers without a username,
    do not display the header options, instead display
    a message and ask users to add a username.

    After adding username, the header options can be displayed.
    But they will be enabled only if the user has verified
    their work email and filled in profile information.
  */

  // this state decides if the header options should be displayed or not
  const [unlockProfile, setUnlockProfile] = useState(false);
  const profileOptionsRef = useRef(null);

  const publicProfileURL = `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`;

  // function to get time of the day, i.e., Morning, Afternoon, Evening
  function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();

    if (hours <= 12) return 'Morning';
    else if (hours <= 16) return 'Afternoon';
    else return 'Evening';
  }

  // function to toggle header options on click
  function toggleHeaderOptions() {
    // keep the header options hidden if the profile is not locked
    if (unlockProfile === false) return;
  }

  // copy the url of the public profile on click
  function copyProfileUrl() {
    navigator.clipboard.writeText(publicProfileURL);

    // display a message after copying url successfully
    showBottomMessage('Public URL copied!');
  }

  const [displaySpan, setDisplaySpan] = useState(false);

  const handleProfileHeaderClick = () => {
    setDisplaySpan(!displaySpan);
  };

  useEffect(() => {
    // Add event listener to handle clicks outside profile options
    function handleClickOutside(event) {
      if (
        profileOptionsRef.current &&
        !profileOptionsRef.current.contains(event.target)
      ) {
        setDisplaySpan(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // the profile will be unlocked only if the user has a username
    setUnlockProfile(
      user?.username?.length > 0 && !!user?.userDetails?.emailID
    );
  }, [user]);

  return (
    <div className="dashboard_profile_header">
      <p>
        Good {getTimeOfDay()}, {user?.firstName}
      </p>

      <div className="notification-container ">
        <div className="notification-icon" onClick={handleNotificationToggle}>
          <Image
            src={notification}
            alt="Notification"
            className="notificationImage"
          />
          {referredReferrals.length > 0 ? (
            <div className="notificationAlert"></div>
          ) : (
            <p></p>
          )}
        </div>
        {handleDiv && (
          <div
            className={`notification-list ${handleDiv ? 'slide-in' : ''}`}
            ref={notificationListRef}
          >
            <div className="NotificationBar" onClick={handleNotificationToggle}>
              Notifications
              <Image src={close} alt="close" className="close" />
            </div>
            {referredReferrals.length > 0 ? (
              <ul>
                {referredReferrals.map((referral) => (
                  <Slide direction="up" duration={300} key={referral._id}>
                    <li key={referral._id}>
                      <span className="profileImage">
                        <a
                          href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${referral.professionalUserId.username}`}
                        >
                          <ProfileImage
                            isLoggedInUser={false}
                            otherUser={referral.professionalUserId}
                          />
                        </a>
                      </span>
                      <div>
                        Did you got referred by{' '}
                        {referral.professionalUserId.firstName}?
                      </div>

                      <div className="booleanDiv">
                        <button
                          className="booleanButton"
                          onClick={() => {
                            handleIncrement(referral._id);
                          }}
                        >
                          Yes
                        </button>
                        <button
                          className="booleanButton"
                          onClick={() => {
                            handleNoButtonClick(
                              referral._id,
                              referral.professionalUserId.username
                            );
                          }}
                        >
                          No
                        </button>
                      </div>
                    </li>
                  </Slide>
                ))}
              </ul>
            ) : (
              <div className="noNotificationDiv">
                <Image
                  src={noNotifications}
                  alt="noNotifications"
                  className="noNotificationsImage"
                />
                <p className="noNotifications">
                  No notifications were found! Please check back later for
                  real-time updates!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <Link href={'/nectcoins'} className="dashboard_profile_header_nectcoins">
        <Image src={nectCoinImg} alt="nect_coins" />
        <span>{user?.totalCoins}</span>
      </Link>

      <div
        onMouseEnter={toggleHeaderOptions}
        className="dashboard_profile_float_profile"
      >
        <ProfileImage isLoggedInUser={true} />

        {/* display this only if the profile is locked
          (i.e., username is not added)*/}
        {!unlockProfile && (
          <div className="profile_locked_message">
            <span></span>
            Please {!user?.username ? 'provide your username and ' : ''}
            verify your work email to share your page.
          </div>
        )}
      </div>
      {unlockProfile && (
        <div
          ref={profileOptionsRef}
          className={`profile_header_options${
            displaySpan ? ' display_profile_header_options' : ''
          }`}
          onClick={handleProfileHeaderClick}
        >
          <div
            className="profile_header_option"
            onClick={() => window.open(publicProfileURL, '_blank')}
          >
            <Image src={shareProfile} alt="share profile" />

            <span className={displaySpan ? 'display_span' : ''}>View Page</span>
          </div>
          <div
            onClick={() => copyProfileUrl()}
            className="profile_header_option"
          >
            <Image src={copyProfile} alt="copy page link" />
            <span className={displaySpan ? 'display_span' : ''}>
              Copy page url
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileHeader;
