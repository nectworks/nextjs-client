'use client';
/*
   File: DashboardMenu.js
   Description: This file contains the navigation menu
   for the dashboard and is served at /dashboard
*/

import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import companyLogo from '../../../public/Dashboard/companyLogo.webp';
import companyName from '../../../public/Dashboard/companyName.webp';
import myProfileIcon from '../../../public/Dashboard/myProfile.svg';
import referIcon from '../../../public/Dashboard/dashboard.svg'; // Reusing icon for refer
import helpIcon from '../../../public/Dashboard/help.svg';
import postAJobIcon from '../../../public/Dashboard/postAJob.svg';
import settingsIcon from '../../../public/Dashboard/settings.svg';
import crossIcon from '../../../public/SignUpConfirmPopup/crossIcon.svg';
import logoutIcon from '../../../public/Dashboard/logout.svg';
import toggleIcon from '../../../public/Dashboard/toggleIcon.svg';
import './DashboardMenu.css'; // We'll update this CSS file
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserContext } from '../../../context/User/UserContext';
import io from 'socket.io-client';
import showBottomMessage from '@/Utils/showBottomMessage';

let socket;

function DashboardMenu() {
  const { userModeState } = useContext(UserContext);
  const [userMode, setUserMode] = userModeState;
  const [pathName, setPathName] = useState('');
  const router = useRouter();

  const URL = process.env.NEXT_PUBLIC_SOCKET_URL;

  // state to indicate if the user is a professional
  const [isProfessional, setIsProfessional] = useState(false);

  // state to indicate if the user has a new referral
  const [newReferral, setNewReferral] = useState(false);

  // function to toggle the dashboard menu in desktop view
  function toggleDashboardMenu(e = null) {
    e?.stopPropagation();
    
    const dashboardContainer = document.querySelector(
      '.dashboard_menu_container'
    );

    const allDashboardMenuItems = dashboardContainer.querySelectorAll(
      '.dashboard_menu_item_text'
    );

    const allItemsToHide = [...allDashboardMenuItems];

    // Toggle text visibility in menu items
    allItemsToHide.forEach((dashboardItem) => {
      dashboardItem.classList.toggle('hide');
    });

    // Toggle minimized class
    dashboardContainer.classList.toggle('dashboard_menu_container_mini');
    
    // Toggle menu-minimized class on the dashboard layout wrapper
    const dashboardLayout = document.querySelector('.dashboard-layout');
    if (dashboardLayout) {
      dashboardLayout.classList.toggle('menu-minimized');
    }
  }

  // function to view/hide dashboardMenu tablet and mobile view
  function toggleDashboardMenuMobile() {
    const menuContainer = document.querySelector('.dashboard_menu_container');

    const menuContainerLeft = parseFloat(
      window.getComputedStyle(menuContainer, null).getPropertyValue('left')
    );

    // if menu has negative 'left' value, it is hidden
    if (menuContainerLeft < 0) {
      // reveal the hidden menu
      menuContainer.style.left = '0px';
      // Add overlay class to body for mobile view
      document.body.classList.add('menu-overlay');
    } else {
      // hide the menu
      menuContainer.style.left = '-250px';
      // Remove overlay class from body
      document.body.classList.remove('menu-overlay');
    }
  }

  function clearActiveStates() {
    const allActiveMenuItems = document.querySelectorAll(
      '.dashboard_menu_item_active'
    );
    allActiveMenuItems.forEach((activeItem) => {
      activeItem.classList.remove('dashboard_menu_item_active');
    });
  }

  // when window is below certain width, adjust menu behavior
  const handleResize = () => {
    if (window.innerWidth <= 800) {
      const menu = document.querySelector('.dashboard_menu_container');
      if (menu.classList.contains('dashboard_menu_container_mini')) {
        toggleDashboardMenu();
      }
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // clear all the activated states
    clearActiveStates();

    // get the current path from the url and format it
    const pathname = router.asPath;

    if (pathname) {
      const allWords = pathname.split('/');
      const validWords = allWords.filter((word) => word.length > 0);
      const path = validWords.join('/');
      setPathName(path);
    }

    // get the corresponding menu item from dashboard
    const menuItem = document.querySelector(`[data-path='${pathName}']`);

    if (menuItem && menuItem.classList) {
      const nonActiveClass = menuItem.classList[0];
      const activeClass = `${nonActiveClass}_active`;
      menuItem.classList.add(activeClass);
    }
  }, [router.pathname]);

  const [disableFeedbackCard, setDisableFeedbackCard] = useState(true);

  useEffect(() => {
    // when the user mode changes, update the local state.
    setIsProfessional(userMode === 'professional');
  }, [userMode]);

  useEffect(() => {
    socket = io(URL);

    socket.on('new-referral', (data) => {
      setNewReferral(true);
      localStorage.setItem('hasNewReferral', 'true');
    });
    const hasNewReferral = localStorage.getItem('hasNewReferral') === 'true';
    setNewReferral(hasNewReferral);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Clear the notification when the user navigates to the 'Refer candidates' page
    if (location.pathname === '/dashboard/refer') {
      setNewReferral(false);
      localStorage.removeItem('hasNewReferral');
    }
  }, [location]);

  // Function to open Nectworks in new tab
  const openNectworksWebsite = () => {
    window.open('https://nectworks.com', '_blank');
  };

  // Function to handle hard refresh navigation
  const handleNavigation = (path, e) => {
    // Check if this is a link that needs hard refresh
    if (['/profile', '/help', '/account-settings', '/dashboard/refer'].includes(path)) {
      e.preventDefault(); // Prevent default Link behavior
      window.location.href = path; // Hard refresh
    }
    // For other links, let Next.js Link handle the navigation
  };

  return (
    <>
      {/* Mobile menu toggle button - only visible on mobile */}
      <div className="mobile_menu_toggle" onClick={toggleDashboardMenuMobile}>
        <Image
          src={toggleIcon}
          alt="menu toggle"
          width={20}
          height={20}
        />
      </div>

      <div className="dashboard_menu_container">
        <div className="dashboard_menu_icons_container">
          <div className="dashboard_menu_logo" onClick={openNectworksWebsite}>
            <Image
              className="brand_logo"
              src={companyLogo}
              alt="nectworks job referrals logo"
            />
            <Image
              className="brand_name"
              src={companyName}
              alt="nectworks technology"
            />
          </div>

          {/* toggle icon in desktop view */}
          <Image
            className="dashboard_menu_toggle_icon"
            src={toggleIcon}
            onClick={toggleDashboardMenu}
            alt="menu toggle icon"
          />

          {/* close icon in tablet/mobile view */}
          <Image
            src={crossIcon}
            onClick={toggleDashboardMenuMobile}
            className="dashboard_menu_close_icon"
            alt="menu close icon"
          />
        </div>

        <hr className="menu_divider"></hr>

        <ul className="dashboard_menu_item_list">
          <li>
            <Link href="/profile" onClick={(e) => handleNavigation('/profile', e)}>
              <div className="dashboard_menu_item" data-path="profile">
                <span className="dashboard_menu_item_icon">
                  <Image src={myProfileIcon} alt="user profile" />
                </span>
                <span className="dashboard_menu_item_text">My Profile</span>
              </div>
            </Link>
          </li>

          <li>
            <Link
              href={isProfessional ? '/dashboard/refer' : '/profile'}
              onClick={(e) => {
                // disable this link, if the userMode is 'student/seeker'
                if (isProfessional === false) {
                  e.preventDefault();
                  showBottomMessage('Verify work email. Go to Profile > Update your job status.');
                  return;
                }
                // Apply hard refresh for refer page too
                if (isProfessional) {
                  handleNavigation('/dashboard/refer', e);
                }
              }}
            >
              <div
                className={`dashboard_menu_item
                ${isProfessional === false ? 'dashboard_menu_item_beta' : ''}`}
                data-path="dashboard/refer"
              >
                <span className="dashboard_menu_item_icon">
                  <Image src={referIcon} alt="refer candidates" />
                </span>
                <span className="dashboard_menu_item_text">
                  Refer Candidates
                </span>
                {newReferral && (
                  <span className="notification-badge">New</span>
                )}
              </div>
            </Link>
          </li>

          <li>
            <Link href="/help" onClick={(e) => handleNavigation('/help', e)}>
              <div className="dashboard_menu_item" data-path="help">
                <span className="dashboard_menu_item_icon">
                  <Image src={helpIcon} alt="help" />
                </span>
                <span className="dashboard_menu_item_text">Help</span>
              </div>
            </Link>
          </li>

          <li>
            <div className="dashboard_menu_item dashboard_menu_item_beta">
              <span className="dashboard_menu_item_icon">
                <Image src={postAJobIcon} alt="post icon" />
              </span>
              <span className="dashboard_menu_item_text">Jobs</span>
              <span className="dashboard_beta_feature_alert">BETA</span>
            </div>
          </li>

          <li>
            <Link href="/account-settings" onClick={(e) => handleNavigation('/account-settings', e)}>
              <div className="dashboard_menu_item" data-path="account-settings">
                <span className="dashboard_menu_item_icon">
                  <Image src={settingsIcon} alt="settings icon" />
                </span>
                <span className="dashboard_menu_item_text">
                  Account settings
                </span>
              </div>
            </Link>
          </li>
        </ul>

        <hr className="dashboard_last_hr"></hr>
        <Link href="/logout">
          <div className="dashboard_menu_item dashboard_logout">
            <span className="dashboard_menu_item_icon">
              <Image src={logoutIcon} alt="logout" />
            </span>
            <span className="dashboard_menu_item_text">Log out</span>
          </div>
        </Link>
      </div>

      <div
        onClick={() => setDisableFeedbackCard(false)}
        className={`bottomBarFeedback
        ${disableFeedbackCard ? 'moveCardToRight' : ''}`}
      >
        <div className="bottomBarFeedbackDesc">
          <div className="descDiv">
            <p>Send Us Some Feedback</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDisableFeedbackCard(true);
              }}
              className="crossIconFeedback"
            >
              <Image src={crossIcon} alt="logo" />
            </button>
          </div>
          <Link href="/feedback">
            <button className="feedbackbutton">Send Feedback</button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default DashboardMenu;