'use client';

/*
  File: ProfileHeader.js
  Description: This component contains the generic header for all the pages in dashboard.
  Features:
  - User greeting with time-based message
  - Real-time notifications for referrals
  - NectCoins display with daily login bonus animation
  - Profile dropdown with sharing options
  - Mobile responsive hamburger menu integration
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
  // Get user context to access user data and state management
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  
  // Initialize private axios instance for authenticated requests
  const privateAxios = usePrivateAxios();
  
  // Ref declarations for DOM element access
  const notificationListRef = useRef(null);
  const profileImageRef = useRef(null);
  const dropdownOptionsRef = useRef(null);

  // STATE MANAGEMENT
  // ===============

  // Notification system state
  const [handleDiv, setHandleDiv] = useState(false); // Controls notification panel visibility
  const [referredReferrals, setReferredReferrals] = useState([]); // Stores incoming referral notifications

  // Profile dropdown state
  const [showDropdown, setShowDropdown] = useState(false); // Controls profile dropdown visibility
  const [unlockProfile, setUnlockProfile] = useState(false); // Determines if profile features are available

  // Daily login coin animation state
  const [showCoinAnimation, setShowCoinAnimation] = useState(false); // Controls animation visibility
  const [coinAnimationAmount, setCoinAnimationAmount] = useState(0); // Amount of coins to display in animation
  const [lastLoginDate, setLastLoginDate] = useState(null); // Tracks last login date
  const [hasShownTodayAnimation, setHasShownTodayAnimation] = useState(false); // Prevents multiple animations per day

  // EVENT HANDLERS
  // ==============

  /**
   * Toggles the notification panel visibility
   */
  const handleNotificationToggle = () => {
    setHandleDiv(!handleDiv);
  };

  /**
   * Checks if user has logged in today and shows coin reward animation
   * This function implements the daily login bonus system
   */
  const checkAndShowCoinAnimation = () => {
    // Early return if no user data or animation already shown today
    if (!user || hasShownTodayAnimation) return;

    const today = new Date().toDateString();
    const storedLastLogin = localStorage.getItem(`lastLogin_${user._id}`);
    
    // Check if this is the first login today
    if (storedLastLogin !== today) {
      // Update last login date in localStorage
      localStorage.setItem(`lastLogin_${user._id}`, today);
      
      // Calculate coin reward based on login streak
      const streak = user.loginStreak || 1;
      let coinReward = 1; // Base daily reward
      
      // Bonus rewards for streak milestones
      if (streak % 10 === 0) {
        coinReward = 10; // 10-day bonus
      } else if (streak % 5 === 0) {
        coinReward = 5; // 5-day bonus
      }
      
      // Display the coin animation
      setCoinAnimationAmount(coinReward);
      setShowCoinAnimation(true);
      setHasShownTodayAnimation(true);
      
      // Hide animation after 2.5 seconds (matches CSS animation duration)
      setTimeout(() => {
        setShowCoinAnimation(false);
      }, 2500);
    }
  };

  /**
   * Adjusts dropdown position based on screen size and profile image location
   * Ensures dropdown appears correctly on both desktop and mobile
   */
  const adjustDropdownPosition = () => {
    if (profileImageRef.current && dropdownOptionsRef.current) {
      // Mobile view positioning (screens ≤ 800px)
      if (window.innerWidth <= 800) {
        dropdownOptionsRef.current.style.right = '1rem';
        dropdownOptionsRef.current.style.top = '0.75rem';
      } else {
        // Desktop view positioning
        dropdownOptionsRef.current.style.right = '20px';
        dropdownOptionsRef.current.style.top = '-3px';
      }
    }
  };

  /**
   * Handles profile image click to toggle dropdown menu
   * Only works when profile is unlocked (username and email verified)
   */
  const handleProfileClick = () => {
    if (unlockProfile) {
      setShowDropdown(!showDropdown);
    }
  };

  /**
   * Copies the public profile URL to clipboard
   * @param {Event} e - Click event
   */
  function copyProfileUrl(e) {
    e.stopPropagation(); // Prevent event bubbling
    navigator.clipboard.writeText(publicProfileURL);
    showBottomMessage('Public URL copied!');
    // Close dropdown after successful copy
    setTimeout(() => setShowDropdown(false), 300);
  }

  /**
   * Opens the public profile in a new browser tab
   * @param {Event} e - Click event
   */
  function openPublicProfile(e) {
    e.stopPropagation(); // Prevent event bubbling
    window.open(publicProfileURL, '_blank');
    // Close dropdown after opening profile
    setTimeout(() => setShowDropdown(false), 300);
  }

  /**
   * Increments the total referred count for a specific referral
   * Called when user confirms they were referred by someone
   * @param {string} referralId - ID of the referral to confirm
   */
  const handleIncrement = async (referralId) => {
    try {
      // Send confirmation to server
      const res = await privateAxios.post(`/increaseTotalReferred/${referralId}`);

      // Remove confirmed referral from notifications
      setReferredReferrals((prevData) =>
        prevData.filter((referral) => referral._id !== referralId)
      );
    } catch (error) {
      console.error('Error confirming referral:', error);
    }
  };

  /**
   * Handles rejection of a referral notification
   * Removes the referral and opens request form for the user
   * @param {string} referralId - ID of the referral to reject
   * @param {string} username - Username of the referring user
   */
  const handleNoButtonClick = async (referralId, username) => {
    try {
      // Delete the incorrect referral
      await privateAxios.delete(`/refer/private?ids=${referralId}`);

      // Remove from local state
      setReferredReferrals((prevReferrals) =>
        prevReferrals.filter((referral) => referral._id !== referralId)
      );

      // Open referral request form in new tab
      const url = `${process.env.NEXT_PUBLIC_CLIENT_URL}/request-referral/${username}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error rejecting referral:', error);
    }
  };

  // UTILITY FUNCTIONS
  // =================

  /**
   * Determines the time of day for personalized greeting
   * @returns {string} Time period (Morning, Afternoon, or Evening)
   */
  function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();

    if (hours <= 12) return 'Morning';
    else if (hours <= 16) return 'Afternoon';
    else return 'Evening';
  }

  // DERIVED VALUES
  // ==============

  // Construct public profile URL for sharing
  const publicProfileURL = `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`;

  // EFFECT HOOKS
  // ============

  /**
   * Server-Sent Events (SSE) connection for real-time referral notifications
   * Establishes connection when user data is available and cleans up on unmount
   */
  useEffect(() => {
    if (!user) return;

    const userId = user._id;
    let url;

    // Construct SSE endpoint URL based on environment
    if (process.env.NODE_ENV !== 'production') {
      url = `http://localhost:5001/api/v1/refer/private/referred?userId=${userId}`;
    } else {
      url = `/api/v1/refer/private/referred?userId=${userId}`;
    }

    let eventSource;

    // Close existing connection if present
    if (eventSource) {
      eventSource.close();
      eventSource = undefined;
    }

    try {
      // Create new SSE connection
      eventSource = new EventSource(url, { withCredentials: true });

      // Handle incoming referral notifications
      eventSource.onmessage = async (event) => {
        const referralData = JSON.parse(event.data);

        // Check if referral is not already in state to prevent duplicates
        if (!referredReferrals.find((referral) => referral._id === referralData._id)) {
          try {
            // Fetch additional profile data for the referring user
            const profileResponse = await publicAxios.get(
              `/getUser/${referralData.professionalUserId.username}`
            );
            const profile = profileResponse.data.user.profile;

            // Enhance referral data with profile information
            referralData.professionalUserId.profile = profile;
          } catch (error) {
            console.error(`Error fetching profile for referral ${referralData._id}:`, error);
          }

          // Add new referral to state
          setReferredReferrals((prevReferrals) => [...prevReferrals, referralData]);
        }
      };

      // Handle SSE connection errors
      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        eventSource.close();
        eventSource = undefined;
      };
    } catch (err) {
      console.error('Error creating SSE connection:', err);
    }

    // Cleanup function to close SSE connection
    return () => {
      if (eventSource) {
        eventSource.close();
        eventSource = undefined;
      }
    };
  }, [referredReferrals, user]);

  /**
   * Dropdown positioning and window resize handling
   * Adjusts dropdown position when visibility changes or window resizes
   */
  useEffect(() => {
    if (showDropdown) {
      adjustDropdownPosition();
    }
    
    // Add resize listener for responsive positioning
    window.addEventListener('resize', adjustDropdownPosition);
    
    // Cleanup resize listener
    return () => {
      window.removeEventListener('resize', adjustDropdownPosition);
    };
  }, [showDropdown]);

  /**
   * Daily login coin animation trigger
   * Checks and shows animation when user data becomes available
   */
  useEffect(() => {
    if (user) {
      checkAndShowCoinAnimation();
    }
  }, [user, hasShownTodayAnimation]);

  /**
   * Click outside handler for notifications and profile dropdown
   * Closes panels when user clicks outside their boundaries
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close notification panel if clicked outside
      if (
        handleDiv &&
        notificationListRef.current &&
        !notificationListRef.current.contains(event.target) &&
        !event.target.closest('.notification-icon')
      ) {
        setHandleDiv(false);
      }
      
      // Close profile dropdown if clicked outside
      if (
        showDropdown &&
        profileImageRef.current &&
        !profileImageRef.current.contains(event.target) &&
        (!dropdownOptionsRef.current || !dropdownOptionsRef.current.contains(event.target))
      ) {
        setShowDropdown(false);
      }
    };

    // Add global click listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleDiv, showDropdown]);

  /**
   * Profile unlock status determination
   * Checks if user has completed required fields for profile sharing
   */
  useEffect(() => {
    setUnlockProfile(
      user?.username?.length > 0 && !!user?.userDetails?.emailID
    );
  }, [user]);

  // COMPONENT RENDER
  // ================

  return (
    <div className="dashboard_profile_header">
      {/* Time-based personalized greeting */}
      <p>
        Good {getTimeOfDay()}, {user?.firstName}
      </p>

      {/* Notification System */}
      <div className="notification-container">
        <div className="notification-icon" onClick={handleNotificationToggle}>
          <Image
            src={notification}
            alt="Notification"
            className="notificationImage"
          />
          {/* Show alert badge if there are pending notifications */}
          {referredReferrals.length > 0 && (
            <div className="notificationAlert"></div>
          )}
        </div>

        {/* Notification Panel */}
        {handleDiv && (
          <div
            className={`notification-list ${handleDiv ? 'slide-in' : ''}`}
            ref={notificationListRef}
          >
            {/* Panel Header */}
            <div className="NotificationBar" onClick={handleNotificationToggle}>
              Notifications
              <Image src={close} alt="close" className="close" />
            </div>

            {/* Notification Content */}
            {referredReferrals.length > 0 ? (
              <ul>
                {referredReferrals.map((referral) => (
                  <Slide direction="up" duration={300} key={referral._id}>
                    <li key={referral._id}>
                      {/* Referring user's profile image */}
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

                      {/* Referral confirmation question */}
                      <div>
                        Did you got referred by {referral.professionalUserId.firstName}?
                      </div>

                      {/* Action buttons for confirming/rejecting referral */}
                      <div className="booleanDiv">
                        <button
                          className="booleanButton"
                          onClick={() => handleIncrement(referral._id)}
                        >
                          Yes
                        </button>
                        <button
                          className="booleanButton"
                          onClick={() =>
                            handleNoButtonClick(
                              referral._id,
                              referral.professionalUserId.username
                            )
                          }
                        >
                          No
                        </button>
                      </div>
                    </li>
                  </Slide>
                ))}
              </ul>
            ) : (
              /* Empty state when no notifications */
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

      {/* NectCoins Display with Daily Login Animation */}
      <Link href={'/nectcoins'} className="dashboard_profile_header_nectcoins">
        <Image src={nectCoinImg} alt="nect_coins" width={30} height={30} />
        <span>{formatNectCoins(user?.totalCoins)}</span>
        
        {/* Daily Login Bonus Animation */}
        {showCoinAnimation && (
          <div className="coin_animation">
            <Image src={nectCoinImg} alt="bonus coin" width={20} height={20} />
            <span className="coin_animation_text">+{coinAnimationAmount}</span>
          </div>
        )}
      </Link>

      {/* Profile Image with Dropdown */}
      <div
        ref={profileImageRef}
        onClick={handleProfileClick}
        className="dashboard_profile_float_profile"
      >
        <ProfileImage isLoggedInUser={true} />

        {/* Profile Locked Message - shown when profile is incomplete */}
        {!unlockProfile && (
          <div className="profile_locked_message">
            <span></span>
            Please {!user?.username ? 'provide your username and ' : ''}
            verify your work email to share your page.
          </div>
        )}
      </div>
      
      {/* Profile Dropdown Options - only shown when profile is unlocked */}
      {unlockProfile && (
        <div
          ref={dropdownOptionsRef}
          className={`profile_header_options${
            showDropdown ? ' display_profile_header_options' : ''
          }`}
        >
          {/* View Public Profile Option */}
          <div className="profile_header_option" onClick={openPublicProfile}>
            <Image src={shareProfile} alt="share profile" />
            <span>View Page</span>
          </div>

          {/* Copy Profile URL Option */}
          <div className="profile_header_option" onClick={copyProfileUrl}>
            <Image src={copyProfile} alt="copy page link" />
            <span>Copy page url</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileHeader;