'use client';
/*
   File: DashboardMenu.js
   Description: This file contains the navigation menu
   for the dashboard and is served at /dashboard
*/

import { useContext, useEffect, useState } from 'react';
import companyLogo from '@/public/Dashboard/companyLogo.webp';
import companyName from '@/public/Dashboard/companyName.webp';
import myProfileIcon from '@/public/Dashboard/myProfile.svg';
import dashboardIcon from '@/public/Dashboard/dashboard.svg';
import helpIcon from '@/public/Dashboard/help.svg';
import postAJobIcon from '@/public/Dashboard/postAJob.svg';
import settingsIcon from '@/public/Dashboard/settings.svg';
import arrowIcon from '@/public/Dashboard/arrow.svg';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import hamburgerIcon from '@/public/Dashboard/hamburgerIcon.svg';
import logoutIcon from '@/public/Dashboard/logout.svg';
import toggleIcon from '@/public/Dashboard/toggleIcon.svg';
import './DashboardMenu.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserContext } from '@/context/User/UserContext';

function DashboardMenu() {
  const { userModeState } = useContext(UserContext);
  const [userMode, setUserMode] = userModeState;
  const [pathName, setPathName] = useState('');

  const router = useRouter();

  // state to indicate if the user is a professional
  const [isProfessional, setIsProfessional] = useState(false);

  // function to toggle the dashboard menu in desktop view
  function toggleDashboardMenu(e = null) {
    e?.stopPropagation();
    /* changes in UI to toggle dashboard menu
     1. display/hide the menu item text and all sub sections
     2. change the width of the menu
     3. toggle the company name (done in css) */

    const dashboardContainer = document.querySelector(
      '.dashboard_menu_container'
    );

    const allDashboardMenuItems = dashboardContainer.querySelectorAll(
      '.dashboard_menu_item_text'
    );

    const allDashboardMenuSubSections = dashboardContainer.querySelectorAll(
      '.dashboard_menu_subsection'
    );

    const allItemsToHide = [
      ...allDashboardMenuItems,
      ...allDashboardMenuSubSections,
    ];

    /* change 1.
    if the menu is closed, hide the text in each menu item
     else display the text in items */
    allItemsToHide.forEach((dashboardItem) => {
      dashboardItem.classList.toggle('hide');
    });

    /* change 2.
     reduce the width of the menu */
    dashboardContainer.classList.toggle('dashboard_menu_container_mini');
  }

  // function to reveal the subsection in dashboard menu item
  /*
    This function is reused twice
    1. as a onClick listener
    2. to reveal the subsection on certain pathways
    (see useEffect for more info)
  */
  function revealSubSection(e = null) {
    // get the reference to the subsection
    const sectionParent = e.target.closest('li');
    const subSection = sectionParent.querySelector(
      '.dashboard_menu_subsection'
    );

    // toggle the display property of the subsection
    if (window.getComputedStyle(subSection).display === 'none') {
      subSection.style.display = 'block';
    } else {
      subSection.style.display = 'none';
    }
  }

  // function to open the dashboard on mouse hover
  function openMenuOnMouseHover() {
    const dashboardContainer = document.querySelector(
      '.dashboard_menu_container'
    );
    // open the dashboard menu only if it is minimised
    if (
      dashboardContainer.classList.contains('dashboard_menu_container_mini')
    ) {
      toggleDashboardMenu();
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
    } else {
      /* if menu has positive 'left' value, it is visible
       hide the menu */
      menuContainer.style.left = '-250px';
    }
  }

  // when window is below certain width, display a popup message
  const handleResize = (e) => {
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
  }, [handleResize]);

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

    /* pathname and the corresponding menu items are linked
     using data-path attribute */

    // get the corresponding menu item from dashboard
    const menuItem = document.querySelector(`[data-path='${pathName}']`);

    /* each menu item has 2 classes, representing 2 states
      active state and non-active state
     name of the active class is <non-active class> + '_active' */
    if (menuItem && menuItem.classList) {
      const nonActiveClass = menuItem.classList[0];
      const activeClass = `${nonActiveClass}_active`;
      menuItem.classList.add(activeClass);
    }

    /* if the items in sub section of the 'dashboard' menu item is selected
     reveal the subsection on start */
    if (pathName.includes('dashboard/')) {
      const target = document.querySelectorAll('li')[1];
      const subSection = target.querySelector('.dashboard_menu_subsection');

      // reveal the subsection only if it's hidden
      if (window.getComputedStyle(subSection).display === 'none') {
        revealSubSection({ target });
      }
    }
  }, [pathName, router.asPath, router.pathname]);

  const [disableFeedbackCard, setDisableFeedbackCard] = useState(true);

  useEffect(() => {
    // when the user mode changes, update the local state.
    setIsProfessional(userMode === 'professional');
  }, [userMode]);

  return (
    <>
      <Image
        onClick={toggleDashboardMenuMobile}
        className="dashboard_menu_hamburger_icon"
        src={hamburgerIcon}
        alt="menu icon"
      />
      <div className="dashboard_menu_container" onClick={openMenuOnMouseHover}>
        <div className="dashboard_menu_icons_container">
          <Link className="dashboard_menu_logo" href="/profile">
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
          </Link>

          {/* toggle icon in desktop view */}
          <Image
            className="dashboard_menu_toggle_icon"
            src={toggleIcon}
            onClick={toggleDashboardMenu}
            alt="menu toggle icon"
          />

          {/* close icon in tablet/mobile view */}
          <Image
            src={toggleIcon}
            onClick={toggleDashboardMenuMobile}
            className="dashboard_menu_close_icon"
            alt="menu close icon"
          />
        </div>

        <hr></hr>

        <ul className="dashboard_menu_item_list">
          <li>
            <Link href="/profile">
              <div className="dashboard_menu_item" data-path="profile">
                <span className="dashboard_menu_item_icon">
                  <Image
                    className="image"
                    src={myProfileIcon}
                    alt="user profile"
                  />
                </span>
                <span className="dashboard_menu_item_text">My Profile</span>
              </div>
            </Link>
          </li>

          <li>
            <div
              className="dashboard_menu_item"
              onClick={revealSubSection}
              data-path="dashboard"
            >
              <span className="dashboard_menu_item_icon">
                <Image src={dashboardIcon} alt="user dashboard" />
              </span>
              <span className="dashboard_menu_item_text">Dashboard</span>
              <span className="dashboard_arrow_icon">
                <Image src={arrowIcon} alt="arrow icon" />
              </span>
            </div>

            <div className="dashboard_menu_subsection">
              {/* <Link href='/dashboard/job'> */}
              <div
                className="dashboard_menu_item dashboard_menu_item_beta"
                data-path="dashboard/job"
              >
                <span className="dashboard_menu_item_text">
                  Looking for a job
                </span>
                <span className="dashboard_beta_feature_alert">BETA</span>
              </div>
              {/* </Link> */}

              <Link
                href={isProfessional ? '/dashboard/refer' : '/profile'}
                onClick={(e) => {
                  // disable this link, if the userMode is 'seeker'
                  if (isProfessional === false) {
                    e.preventDefault();
                    return;
                  }
                }}
              >
                <div
                  className={`dashboard_menu_item 
                  ${
                    isProfessional === false ? 'dashboard_menu_item_beta' : ''
                  }`}
                  data-path="dashboard/refer"
                >
                  <span className="dashboard_menu_item_text">
                    Refer candidates
                  </span>
                </div>
              </Link>
            </div>
          </li>

          <li>
            <Link href="/help">
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
            <Link href="/account-settings">
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
