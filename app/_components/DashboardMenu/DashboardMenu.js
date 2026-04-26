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
import { usePathname } from 'next/navigation';
import { UserContext } from '../../../context/User/UserContext';
import io from 'socket.io-client';
import showBottomMessage from '@/Utils/showBottomMessage';

let socket;

function DashboardMenu() {
  const { userModeState } = useContext(UserContext);
  const [userMode] = userModeState;
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const URL = process.env.NEXT_PUBLIC_SOCKET_URL;

  // state to indicate if the user is a professional
  const [isProfessional, setIsProfessional] = useState(false);

  // state to indicate if the user has a new referral
  const [newReferral, setNewReferral] = useState(false);

  function toggleDashboardMenu(e = null) {
    e?.stopPropagation();
    setIsCollapsed((prevState) => !prevState);
  }

  function toggleDashboardMenuMobile() {
    setIsMobileOpen((prevState) => !prevState);
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 800) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const [disableFeedbackCard, setDisableFeedbackCard] = useState(true);

  useEffect(() => {
    // when the user mode changes, update the local state.
    setIsProfessional(userMode === 'professional');
  }, [userMode]);

  useEffect(() => {
    if (!URL) return;

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
  }, [URL]);

  useEffect(() => {
    if (pathname === '/dashboard/refer') {
      setNewReferral(false);
      localStorage.removeItem('hasNewReferral');
    }
  }, [pathname]);

  useEffect(() => {
    setIsMobileOpen(false);

    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.body.style.overflow = isMobileOpen ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileOpen]);

  // Function to open Nectworks in new tab
  const openNectworksWebsite = () => {
    window.open('https://nectworks.com', '_blank');
  };

  const isActivePath = (path) => {
    if (path === '/profile') return pathname === '/profile';
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const menuTextClassName = `dashboard_menu_item_text ${
    isCollapsed ? 'hide' : ''
  }`;

  const dashboardMenuClassName = [
    'dashboard_menu_container',
    isCollapsed ? 'dashboard_menu_container_mini' : '',
    isMobileOpen ? 'dashboard_menu_container_mobile_open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const getMenuItemClassName = (path, extraClass = '') => {
    return [
      'dashboard_menu_item',
      isActivePath(path) ? 'dashboard_menu_item_active' : '',
      extraClass,
    ]
      .filter(Boolean)
      .join(' ');
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

      <div className={dashboardMenuClassName}>
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
            <Link href="/profile">
              <div className={getMenuItemClassName('/profile')}>
                <span className="dashboard_menu_item_icon">
                  <Image src={myProfileIcon} alt="user profile" />
                </span>
                <span className={menuTextClassName}>My Profile</span>
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
              }}
            >
              <div
                className={getMenuItemClassName(
                  '/dashboard/refer',
                  isProfessional === false ? 'dashboard_menu_item_beta' : ''
                )}
              >
                <span className="dashboard_menu_item_icon">
                  <Image src={referIcon} alt="refer candidates" />
                </span>
                <span className={menuTextClassName}>
                  Refer Candidates
                </span>
                {newReferral && (
                  <span className="notification-badge">New</span>
                )}
              </div>
            </Link>
          </li>

          <li>
            <Link href="/help">
              <div className={getMenuItemClassName('/help')}>
                <span className="dashboard_menu_item_icon">
                  <Image src={helpIcon} alt="help" />
                </span>
                <span className={menuTextClassName}>Help</span>
              </div>
            </Link>
          </li>

          <li>
            <div className="dashboard_menu_item dashboard_menu_item_beta">
              <span className="dashboard_menu_item_icon">
                <Image src={postAJobIcon} alt="post icon" />
              </span>
              <span className={menuTextClassName}>Jobs</span>
              <span className="dashboard_beta_feature_alert">BETA</span>
            </div>
          </li>

          <li>
            <Link href="/account-settings">
              <div className={getMenuItemClassName('/account-settings')}>
                <span className="dashboard_menu_item_icon">
                  <Image src={settingsIcon} alt="settings icon" />
                </span>
                <span className={menuTextClassName}>
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
            <span className={menuTextClassName}>Log out</span>
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
