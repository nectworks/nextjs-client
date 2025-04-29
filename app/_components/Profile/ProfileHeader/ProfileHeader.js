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
import hamburgerIcon from '@/public/Dashboard/hamburgerIcon.svg';
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
import formatNectCoins from '@/Utils/formatNectCoins';

function ProfileHeader() {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [handleDiv, setHandleDiv] = useState(false);
  const privateAxios = usePrivateAxios();
  const notificationListRef = useRef(null);
  const [referredReferrals, setReferredReferrals] = useState([]);
  const profileImageRef = useRef(null);
  const dropdownOptionsRef = useRef(null);

  // State to control dropdown visibility - Set initial state to false to prevent auto-opening
  const [showDropdown, setShowDropdown] = useState(false);
  
  // State to decide if profile options should be enabled
  const [unlockProfile, setUnlockProfile] = useState(false);

  // For handling the notification div toggle
  const handleNotificationToggle = () => {
    setHandleDiv(!handleDiv);
  };

  // Function to toggle the dashboard menu in mobile view
  function toggleDashboardMenuMobile() {
    const menuContainer = document.querySelector('.dashboard_menu_container');

    const menuContainerLeft = parseFloat(
      window.getComputedStyle(menuContainer, null).getPropertyValue('left')
    );

    // if menu has negative 'left' value, it is hidden
    if (menuContainerLeft < 0) {
      // reveal the hidden menu
      menuContainer.style.left = '0px';
    } else {
      /* if menu has positive 'left' value, it is visible
         hide the menu */
      menuContainer.style.left = '-250px';
    }
  }

  // Function to adjust dropdown position based on profile image position
  const adjustDropdownPosition = () => {
    if (profileImageRef.current && dropdownOptionsRef.current) {
      // For mobile view (≤768px)
      if (window.innerWidth <= 800) {
        // Use the same positioning as in CSS for consistency
        dropdownOptionsRef.current.style.right = '1rem';
        dropdownOptionsRef.current.style.top = '0.75rem';
      } else {
        // Desktop view - standard positioning
        dropdownOptionsRef.current.style.right = '20px';
        dropdownOptionsRef.current.style.top = '-3px';
      }
    }
  };

  // Effect hook to establish a server-sent events (SSE) connection for receiving
  // referred referrals in real-time
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

  // Effect for dropdown positioning
  useEffect(() => {
    // Adjust dropdown position when visibility changes
    if (showDropdown) {
      adjustDropdownPosition();
    }
    
    // Add resize listener to adjust position when window resizes
    window.addEventListener('resize', adjustDropdownPosition);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', adjustDropdownPosition);
    };
  }, [showDropdown]);

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
    }
  };

  // Improved click outside handler for notifications and profile dropdown
  useEffect(() => {
    // Function to handle clicks outside the notification list div and profile dropdown
    const handleClickOutside = (event) => {
      // Check if the notification list is open and if the clicked target is outside
      // the notification list and header
      if (
        handleDiv &&
        notificationListRef.current &&
        !notificationListRef.current.contains(event.target) &&
        !event.target.closest('.notification-icon')
      ) {
        // Close the notification list
        setHandleDiv(false);
      }
      
      // Handle outside clicks for profile dropdown
      if (
        showDropdown &&
        profileImageRef.current &&
        !profileImageRef.current.contains(event.target) &&
        (!dropdownOptionsRef.current || !dropdownOptionsRef.current.contains(event.target))
      ) {
        setShowDropdown(false);
      }
    };

    // Add event listener to listen for mousedown events
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleDiv, showDropdown]);

  // Toggle profile dropdown ONLY on explicit click
  const handleProfileClick = () => {
    if (unlockProfile) {
      setShowDropdown(!showDropdown);
    }
  };

  const publicProfileURL = `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`;

  // function to get time of the day, i.e., Morning, Afternoon, Evening
  function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();

    if (hours <= 12) return 'Morning';
    else if (hours <= 16) return 'Afternoon';
    else return 'Evening';
  }

  // copy the url of the public profile on click
  function copyProfileUrl(e) {
    e.stopPropagation(); // Prevent event bubbling
    navigator.clipboard.writeText(publicProfileURL);
    showBottomMessage('Public URL copied!');
    // Close the dropdown after action
    setTimeout(() => setShowDropdown(false), 300);
  }

  // Function to open the public profile in a new tab
  function openPublicProfile(e) {
    e.stopPropagation(); // Prevent event bubbling
    window.open(publicProfileURL, '_blank');
    // Close the dropdown after action
    setTimeout(() => setShowDropdown(false), 300);
  }

  useEffect(() => {
    // the profile will be unlocked only if the user has a username
    setUnlockProfile(
      user?.username?.length > 0 && !!user?.userDetails?.emailID
    );
  }, [user]);

  return (
    <div className="dashboard_profile_header">
      {/* Hamburger icon for mobile view at the beginning of the header */}
      <Image
        onClick={toggleDashboardMenuMobile}
        className="dashboard_profile_hamburger_icon"
        src={hamburgerIcon}
        alt="menu icon"
      />
      
      <p>
        Good {getTimeOfDay()}, {user?.firstName}
      </p>

      <div className="notification-container">
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
        <Image src={nectCoinImg} alt="nect_coins" width={30} height={30} />
        <span>{formatNectCoins(user?.totalCoins)}</span>
      </Link>

      <div
        ref={profileImageRef}
        onClick={handleProfileClick}
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
          ref={dropdownOptionsRef}
          className={`profile_header_options${
            showDropdown ? ' display_profile_header_options' : ''
          }`}
        >
          <div
            className="profile_header_option"
            onClick={openPublicProfile}
          >
            <Image src={shareProfile} alt="share profile" />
            <span>View Page</span>
          </div>
          <div
            className="profile_header_option"
            onClick={copyProfileUrl}
          >
            <Image src={copyProfile} alt="copy page link" />
            <span>Copy page url</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileHeader;