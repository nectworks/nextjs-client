'use client';
/*
  File: ReferCandidates.js
  Description: This file contains component that is served at /dashboard/refer.
  In this page, a professional user can see the referral requests he has
  received and update it.
*/

import { useEffect, useState } from 'react';
import DashboardMenu from '../../../_components/DashboardMenu/DashboardMenu';
import './ReferCandidates.css';
import Image from 'next/image';
import searchIcon from '@/public/ReferCandidates/searchIcon.svg';
import plusIcon from '@/public/ReferCandidates/plusIcon.png';
import switchJobPostreferralButton from '@/public/ReferCandidates/switchJobPostreferralButton.png';
import downloadResumeIcon from '@/public/ReferCandidates/downloadResumeIcon.png';
import jobListIcon from '@/public/ReferCandidates/jobListIcon.png';
import leftArrow from '@/public/ReferCandidates/leftArrow.png';
import rightArrow from '@/public/ReferCandidates/rightArrow.png';
import rightArrowDashed from '@/public/ReferCandidates/rightArrowDashed.png';
import addFilesIcon from '@/public/ReferCandidates/addFilesIcon.png';
import deleteIcon from '@/public/ReferCandidates/deleteIcon.png';
import greenTickIcon from '@/public/ReferCandidates/greenTickIcon.png';
import emailIcon from '@/public/ReferCandidates/emailIcon.png';
import shareProfileIcon from '@/public/ReferCandidates/shareProfileIcon.png';
import linkedInIcon from '@/public/ReferCandidates/linkedInIcon.png';
import hollowCircle from '@/public/Profile/speratorIcon.svg';
import downloadResumeIconWhite from '@/public/ReferCandidates/downloadResumeIconWhite.svg';
import ClipLoader from 'react-spinners/ClipLoader';
import { publicAxios } from '@/config/axiosInstance';
import ProfileHeader from '../../../_components/Profile/ProfileHeader/ProfileHeader';
import generalLinkIcon from '@/public/PublicProfile/generalLinkIcon.svg';
import Link from 'next/link';
import showBottomMessage from '@/Utils/showBottomMessage';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import refreshIcon from '@/public/ReferCandidates/refreshIcon.svg';
import viewDocumentInNewTab from '@/Utils/viewDocument';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import ReportPopup from '../../../_components/ReportPopup/ReportPopup';
import sendGAEvent from '@/Utils/gaEvents';
import ProfileImage from '../../../_components/Profile/ProfileImage/ProfileImage';
import downloadDocument from '@/Utils/downloadDocument';
import io from 'socket.io-client';

let socket;

// Profile Modal Component
const ProfileModal = ({ 
  closeProfileModal, 
  selectedSeeker, 
  noUserId, 
  seekerInfo, 
  publicProfileUrl, 
  calcTotalExperience,
  getResumeKey,
  sendViewResumeEvent,
  downloadResume,
  setShowReportPopup
}) => {
  const [activeTab, setActiveTab] = useState('about');
  
  // Handle report button click
  const handleReportClick = () => {
    // First close the profile modal
    closeProfileModal();
    
    // Then open the report popup with a slight delay
    setTimeout(() => {
      setShowReportPopup(true);
    }, 100);
  };

  return (
    <div className="profile-modal">
      <div className="profile-modal-content">
        {/* Header with blue background */}
        <div className="profile-header">
          <div className="profile-header-title">
            Candidate Profile
          </div>
          <div className="profile-header-actions">
            {!noUserId && (
              <Link href={publicProfileUrl} target="_blank" className="open-profile-link">
                Open profile in new tab
              </Link>
            )}
            <button className="close-profile-button" onClick={closeProfileModal}>
              <Image src={crossIcon} alt="Close profile" width={18} height={18} />
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="profile-body">
          <div className="profile-main">
          <div className="profile-picture">
            <ProfileImage
              isLoggedInUser={false}
              otherUser={selectedSeeker}
            />
          </div>
            {/* Candidate name and basic info */}
            <div className="profile-name-section">
              <h2 className="profile-name">
                {selectedSeeker?.firstName || ''} {selectedSeeker?.lastName || ''}
              </h2>
              
              <div className="profile-info">
                {!noUserId && (
                  <>
                    <div className="profile-info-item">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Total work experience:&nbsp;
                      {calcTotalExperience().countYear > 0 && 
                        `${calcTotalExperience().countYear}y `}
                      {calcTotalExperience().countMonth}mos
                    </div>

                    {seekerInfo?.experience && seekerInfo.experience[0] && (
                      <div className="profile-info-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                        </svg>
                        {seekerInfo.experience[0].companyName}
                      </div>
                    )}

                    {seekerInfo?.education && seekerInfo.education[0] && (
                      <div className="profile-info-item">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                        </svg>
                        {seekerInfo.education[0].school}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Email action button */}
            <div className="profile-action-buttons">
              <a href={`mailto:${selectedSeeker?.email}`}>
                <button className="email-button">
                  Say Hi!
                  <Image src={emailIcon} alt="Email" width={18} height={18} />
                </button>
              </a>
            </div>

            {/* Tabs for profile sections */}
            {!noUserId && (
              <>
                <div className="profile-tabs">
                  <button 
                    className={`profile-tab ${activeTab === 'about' ? 'active' : ''}`}
                    onClick={() => setActiveTab('about')}
                  >
                    About
                  </button>
                  <button 
                    className={`profile-tab ${activeTab === 'education' ? 'active' : ''}`}
                    onClick={() => setActiveTab('education')}
                  >
                    Education
                  </button>
                  <button 
                    className={`profile-tab ${activeTab === 'experience' ? 'active' : ''}`}
                    onClick={() => setActiveTab('experience')}
                  >
                    Experience
                  </button>
                </div>

                {/* About section */}
                {activeTab === 'about' && (
                  <div className="profile-content-section">
                    <div className="profile-section-header">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <span className="profile-section-title">About</span>
                    </div>
                    <div className="profile-section-content">
                      {seekerInfo?.about?.bio ? 
                        seekerInfo.about.bio : 
                        <span className="no-info-message">No information provided.</span>
                      }
                    </div>
                  </div>
                )}

                {/* Education section */}
                {activeTab === 'education' && (
                  <div className="profile-content-section">
                    <div className="profile-section-header">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                      </svg>
                      <span className="profile-section-title">Education</span>
                    </div>
                    <div className="profile-section-content">
                      {seekerInfo?.education?.length > 0 ? (
                        seekerInfo.education.map((edu, idx) => (
                          <div className="education-item" key={idx}>
                            <div className="item-title">{edu.school}</div>
                            <div className="item-subtitle">{edu.fieldOfStudy}</div>
                            <div className="item-date">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              {edu.startYear} - {edu.endYear}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="no-info-message">No education history available.</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Experience section */}
                {activeTab === 'experience' && (
                  <div className="profile-content-section">
                    <div className="profile-section-header">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                      </svg>
                      <span className="profile-section-title">Experience</span>
                    </div>
                    <div className="profile-section-content">
                      {seekerInfo?.experience?.length > 0 ? (
                        seekerInfo.experience.map((exp, idx) => (
                          <div className="experience-item" key={idx}>
                            <div className="item-title">{exp.jobTitle}</div>
                            <div className="item-subtitle">
                              {exp.companyName}
                              <Image
                                src={hollowCircle}
                                alt="Separator"
                                width={12}
                                height={12}
                                style={{ margin: '0 4px', display: 'inline' }}
                              />
                              {exp.employmentType}
                            </div>
                            <div className="item-date">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              {exp.startMonth} {exp.startYear} -&nbsp;
                              {!exp.endMonth ? 'Present' : `${exp.endMonth} ${exp.endYear || ''}`}
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="no-info-message">No work experience available.</span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar for skills, social links, and resume */}
          <div className="profile-sidebar">
            {/* Skills section */}
            {!noUserId && seekerInfo?.skills && seekerInfo.skills.length > 0 && (
              <div className="sidebar-card">
                <div className="sidebar-card-header">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span className="sidebar-card-title">Skills</span>
                </div>
                <div className="skills-list">
                  {seekerInfo.skills.map((skill, idx) => (
                    <div className="skill-tag" key={idx}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links section */}
            {!noUserId && seekerInfo?.socials && seekerInfo.socials.length > 0 && (
              <div className="sidebar-card">
                <div className="sidebar-card-header">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  <span className="sidebar-card-title">Social Links</span>
                </div>
                <div className="social-links">
                  {seekerInfo.socials.map((social, idx) => (
                    <a href={social} key={idx} className="social-link" target="_blank" rel="noreferrer">
                      <Image
                        src={social.includes('linkedin.com') ? linkedInIcon : generalLinkIcon}
                        alt="Social link"
                        width={18}
                        height={18}
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Resume view and download */}
            <div className="resume-actions">
              <button
                className="view-resume-button"
                onClick={() => {
                  const resumeKey = getResumeKey();
                  if (resumeKey) {
                    sendViewResumeEvent(resumeKey);
                  } else {
                    showBottomMessage("Couldn't find resume of the seeker");
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                View Resume
              </button>
              <button 
                className="download-resume-button" 
                onClick={downloadResume}
                title="Download Resume"
              >
                <Image src={downloadResumeIconWhite} alt="Download resume" width={18} height={18} />
              </button>
            </div>

            {/* Report button */}
            <div className="report-button">
              <div className="report-link" onClick={handleReportClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path>
                  <path d="M18 9V4a2 2 0 0 0-2-2h-5l5 5zm-7.9 2H6"></path>
                  <path d="M9 17H6"></path>
                  <path d="M12 13H6"></path>
                  <circle cx="17" cy="17" r="5"></circle>
                  <line x1="17" y1="14" x2="17" y2="20"></line>
                  <line x1="14" y1="17" x2="20" y2="17"></line>
                </svg>
                Report
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReferCandidates = () => {
  const privateAxios = usePrivateAxios();
  const URL = process.env.NEXT_PUBLIC_SOCKET_URL;
  
  // Section visibility states
  const [showTalentPoolSection, setShowTalentPoolSection] = useState(true);
  const [showjobPostingSection, setShowjobPostingSection] = useState(false);
  const [goRight, setGoRight] = useState(false);
  const [goLeft, setGoLeft] = useState(false);
  const [talentPoolClicked, setTalentPoolClicked] = useState(false);

  // State to switch between pending referrals and completed referrals
  const [showReferredCandidates, setShowReferredCandidates] = useState(false);
  const [showPendingCandidates, setShowPendingCandidates] = useState(true);

  // Store all the referrals retrieved so far, separate them based on the status
  const [pendingReferrals, setPendingReferrals] = useState([]);
  const [referredCandidates, setReferredCandidates] = useState([]);

  // Referrals to display in current page
  const [currPageData, setCurrPageData] = useState([]);

  // Create a state variable for the search query
  const [searchQuery, setSearchQuery] = useState('');

  // State to indicate a user is being searched
  const [searchValue, setSearchValue] = useState(false);

  // Use two separate temporary states to avoid bugs while searching
  const [tempRefsOne, setTempRefsOne] = useState([]); // store unreferred candidates
  const [tempRefsTwo, setTempRefsTwo] = useState([]); // store referred candidates

  // Number of documents present in each page
  const itemsPerPage = 4;

  // Keep track of the page number the user is currently viewing
  const [currentPage, setCurrentPage] = useState(
    parseInt(sessionStorage.getItem('currentPage')) || 1
  );

  // States indicate total number of pages available
  const [pendingCount, setPendingCount] = useState(-1);
  const [referredCount, setReferredCount] = useState(-1);

  // References to next page, maintained for 2 separate sections
  const [pendingPageRef, setPendingPageRef] = useState(null);
  const [referredPageRef, setReferredPageRef] = useState(null);

  // State to define the display property of the spinner
  const [isLoading, setIsLoading] = useState(false);

  // State to determine to open/close the report popup
  const [showReportPopup, setShowReportPopup] = useState(false);

  // State for delete action visibility
  const [showDeleteActions, setShowDeleteActions] = useState(false);
  
  // State for floating select all button on mobile
  const [showFloatingSelectAll, setShowFloatingSelectAll] = useState(false);

  // Toggle between talent pool and job section
  const toggleTalentPoolAndJobSection1 = () => {
    setShowTalentPoolSection(false);
    setShowjobPostingSection(true);
    setGoRight(true);
    setGoLeft(false);
    setTalentPoolClicked(true);
  };

  const toggleTalentPoolAndJobSection2 = () => {
    setShowTalentPoolSection(true);
    setShowjobPostingSection(false);
    setGoLeft(true);
    setGoRight(false);
  };

  // Calculate pages count
  function getPagesCount(items) {
    return Math.ceil(items / itemsPerPage);
  }

  // Pagination controls
  const prevPage = () => {
    if (currentPage <= 1) return;
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const nextPage = () => {
    const totalPages = getPagesCount(
      showPendingCandidates ? pendingCount : referredCount
    );
    if (currentPage >= totalPages) return;
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Filter out duplicate referrals
  const filterUniqueReferrals = (referrals) => {
    const uniqueReferrals = [];
    const referralIds = new Set();

    referrals.forEach((referral) => {
      if (!referralIds.has(referral._id)) {
        referralIds.add(referral._id);
        uniqueReferrals.push(referral);
      }
    });

    return uniqueReferrals;
  };

  // Function to get data about referrals received
  const getReferralData = async () => {
    setIsLoading(true);

    try {
      const res = await privateAxios.get(`/refer/private`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          prevDocId: showPendingCandidates ? pendingPageRef : referredPageRef,
          isReferred: showReferredCandidates,
        },
      });

      if (res.status === 200) {
        const { referralData, count, next } = res.data.data;

        // Update the correct array of referrals based on referral status
        if (showPendingCandidates) {
          setPendingReferrals((prevReferrals) => {
            const updatedReferrals = [...prevReferrals, ...referralData];
            return filterUniqueReferrals(updatedReferrals);
          });
          setPendingPageRef(next);
          setPendingCount(count);
        } else {
          setReferredCandidates((prevReferrals) => {
            const updatedReferrals = [...prevReferrals, ...referralData];
            return filterUniqueReferrals(updatedReferrals);
          });
          setReferredPageRef(next);
          setReferredCount(count);
        }

        // Return the newly fetched referrals
        return referralData;
      }
    } catch (err) {
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // This function is used to update data displayed
  const updateCurrentPageItems = (retrievedReferrals, dbReferralCount) => {
    const currPageStart = (currentPage - 1) * itemsPerPage;
    const currPageEnd = currPageStart + itemsPerPage;

    // Fetch data if needed
    if (
      dbReferralCount === -1 ||
      (retrievedReferrals.length - 1 < currPageEnd - 1 &&
        retrievedReferrals.length < dbReferralCount &&
        !searchValue)
    ) {
      getReferralData();
    } else {
      setCurrPageData(retrievedReferrals.slice(currPageStart, currPageEnd));
    }
  };

  // Function to refresh the section
  const [rotateAngle, setRotateAngle] = useState(0);
  
  function refreshSection() {
    // Rotate refresh icon
    const newAngle = rotateAngle + 360;
    setRotateAngle(newAngle);

    // Reset states to trigger refresh
    if (showPendingCandidates === true) {
      setPendingReferrals([]);
      setPendingCount(-1);
      setPendingPageRef(null);
    } else {
      setReferredCandidates([]);
      setReferredCount(-1);
      setReferredPageRef(null);
    }

    setCurrentPage(1);
    setCurrPageData([]);
  }

  // Update data when states change
  useEffect(() => {
    // Set the currentPage value in session storage
    sessionStorage.setItem('currentPage', currentPage);

    if (showPendingCandidates) {
      if (pendingCount === 0) setCurrentPage(0);
      updateCurrentPageItems(pendingReferrals, pendingCount);
    } else {
      if (referredCount === 0) setCurrentPage(0);
      updateCurrentPageItems(referredCandidates, referredCount);
    }
  }, [
    currentPage,
    showPendingCandidates,
    pendingReferrals,
    referredCandidates,
  ]);

  // Socket connection for real-time updates
  useEffect(() => {
    socket = io(URL);

    socket.on('new-referral', () => {
      // Reset states to fetch new data
      setPendingReferrals([]);
      setPendingCount(-1);
      setPendingPageRef(null);
      setCurrentPage(1);
      setCurrPageData([]);
    });
    
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to get users based on the search input value
  const searchUsers = async () => {
    // If the search bar is empty, do not search users
    if (!searchQuery || searchQuery.length === 0) return;

    setIsLoading(true);

    // Send search seekers event
    sendGAEvent('search_seekers');

    try {
      const queryParams = `search=${searchQuery}&isReferred=${showReferredCandidates}`;
      const url = `/refer/private/search/?${queryParams}`;
      const res = await privateAxios.get(url);

      if (res.status === 200) {
        const { searchedReferrals } = res.data;

        if (showPendingCandidates) {
          setTempRefsOne(pendingReferrals);
          setPendingReferrals(searchedReferrals);
        } else {
          setTempRefsTwo(referredCandidates);
          setReferredCandidates(searchedReferrals);
        }
      }
    } catch (error) {
      showBottomMessage(`Couldn't search users.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search query changes
  useEffect(() => {
    // If the search just contains empty characters, return
    if (searchQuery.trim().length === 0) {
      if (!searchValue) return;

      // If the search query is empty, display the retrieved referrals so far
      setPendingReferrals(tempRefsOne);
      setTempRefsOne([]);
      setReferredCandidates(tempRefsTwo);
      setTempRefsTwo([]);

      setSearchValue(false);
      return;
    } else {
      setSearchValue(true);
    }
  }, [searchQuery]);

  // Calculating Total Experience
  const allMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const calcTotalExperience = () => {
    const experience = seekerInfo?.experience;
    let countMonth = 0;
    let countYear = 0;
    experience &&
      experience.map((ele, idx) => {
        if (idx < 2) {
          const startMonthIdx = allMonths.indexOf(ele.startMonth);
          const endMonthIdx = ele.endMonth
            ? allMonths.indexOf(ele.endMonth) + 1
            : currentMonth;
          countMonth +=
            startMonthIdx > endMonthIdx
              ? Math.abs(12 - startMonthIdx + endMonthIdx)
              : Math.abs(startMonthIdx - endMonthIdx);
          if (startMonthIdx <= endMonthIdx) {
            countYear +=
              (ele.endYear ? ele.endYear : currentYear) - ele.startYear;
          } else {
            countYear +=
              (ele.endYear ? ele.endYear : currentYear) - ele.startYear - 1;
          }
        }
      });

    if (countMonth >= 12) {
      countYear += Math.floor(countMonth / 12);
      countMonth = countMonth % 12;
    }
    return { countMonth, countYear };
  };

  // State for user profile modal
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [noUserId, setNoUserId] = useState(false);

  // State to store selected seeker information
  const [seekerInfo, setSeekerInfo] = useState({});

  const [isUserProfile, setIsUserProfile] = useState(false);
  const [userId, setUserId] = useState(null);
  const [publicProfileUsername, setPublicProfileUsername] = useState(null);
  const [showCloseModalOfJobDetails, setShowCloseModalOfJobDetails] = useState(false);

  // Store the selected seeker's information
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const [selectedReferral, setSelectedReferral] = useState(null);

  // Function to display user profile
  const showUserProfile = async (referral) => {
    // Get the firstName, lastName and username of the seeker
    const seeker = referral.userId ? referral.user : referral.unRegisteredUser;
    const { username } = seeker;

    // Update the selected seeker and referral information
    setSelectedSeeker(seeker);
    setSelectedReferral(referral);

    setShowCloseModalOfJobDetails(false);
    setShowUserProfileModal(true);
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });

    if (!referral.userId) {
      setNoUserId(true);
      return;
    }

    setNoUserId(false);
    setPublicProfileUsername(username);

    // If the current user information is already fetched, return
    if (publicProfileUsername === username) return;

    try {
      const res = await publicAxios.get(
        `/refer/private/seeker/${referral.userId}`
      );

      if (res.status === 200) {
        setUserId(userId);
        setSeekerInfo(res.data);
        setIsUserProfile(true);
      }
    } catch (err) {
      setIsUserProfile(true);
    }
  };

  const publicProfileUrl = `/profile/${publicProfileUsername}`;

  // Close profile modal
  const closeProfileModal = () => {
    setShowUserProfileModal(false);
  };

  // Close job details modal
  const closeModalJobDetails = () => {
    setShowCloseModalOfJobDetails(false);
  };

  // Handle job detail display
  const [jobsAskedForReferral, setJobsAskedForReferral] = useState(null);
  
  const handlePersonSelect = (curr) => {
    setShowCloseModalOfJobDetails(true);
    setShowUserProfileModal(false);
    setJobsAskedForReferral(curr.jobsAskedForReferral);
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  // Selection states
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showJobsSectionDeleteButton, setShowJobsSectionDeleteButton] = useState(false);
  const [selectedCheckItemsCheck, showSelectedCheckItemsCheck] = useState(false);

  // Handle main checkbox change
  const handleMainCheckboxChange = () => {
    // Show the delete button
    setShowJobsSectionDeleteButton(true);
    setShowDeleteActions(true);

    // Select or unselect all the checkboxes
    const toggleSelectAll = !selectAll;
    setSelectAll(toggleSelectAll);
    
    if (!selectAll) {
      showSelectedCheckItemsCheck(false);
    }

    // Update selected items
    setSelectedItems(
      toggleSelectAll ? currPageData.map((_, idx) => idx) : []
    );
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (itemId) => {
    // Show the delete button
    setShowJobsSectionDeleteButton(true);
    setShowDeleteActions(true);
    setShowFloatingSelectAll(true);

    // Update selected items
    const updatedSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    if (updatedSelectedItems.length === 0) {
      showSelectedCheckItemsCheck(false);
      setShowDeleteActions(false);
      setShowFloatingSelectAll(false);
    } else {
      showSelectedCheckItemsCheck(true);
    }

    // If all items are checked, select the header checkbox
    setSelectAll(updatedSelectedItems.length === currPageData.length);
    setSelectedItems(updatedSelectedItems);
  };

  // Function to remove referrals from frontend
  const removeReferralsInState = (itemsToDelete) => {
    // Update the correct array of referrals
    if (showPendingCandidates === true) {
      const updatedPendingReferrals = [...pendingReferrals];

      // For each item to delete
      itemsToDelete.forEach((itemIdToDelete) => {
        // Find the id in fetched referrals and delete it if found
        const findIdx = updatedPendingReferrals.findIndex(
          (referral) => referral._id === itemIdToDelete
        );

        // If the element is found, delete it from the array
        if (findIdx !== -1) updatedPendingReferrals.splice(findIdx, 1);
      });

      // After filtering out the items, update state
      setPendingReferrals(updatedPendingReferrals);
      setPendingCount((prevVal) => prevVal - itemsToDelete.length);
    } else {
      const updatedReferredCandidates = [...referredCandidates];

      itemsToDelete.forEach((itemIdToDelete) => {
        const findIdx = updatedReferredCandidates.findIndex(
          (referral) => referral._id === itemIdToDelete
        );

        // If the element is found, delete it from the array
        if (findIdx !== -1) updatedReferredCandidates.splice(findIdx, 1);
      });

      // After filtering out the items, update state
      setReferredCandidates(updatedReferredCandidates);
      setReferredCount((prevVal) => prevVal - itemsToDelete.length);
    }
  };

  // Function to delete selected referrals
  const handleDelete = async () => {
    // Get the ids of selected items to delete
    const itemsToDelete = [];
    selectedItems.forEach((idx) => {
      itemsToDelete.push(currPageData[idx]?._id);
    });

    try {
      const allIds = itemsToDelete.join(',');

      if (allIds.length === 0) {
        showBottomMessage(`No referrals selected to delete`);
        return;
      }

      const res = await privateAxios.delete(`/refer/private?ids=${allIds}`);

      if (res.status === 200) {
        // Display a message to the user
        showBottomMessage('Successfully deleted referrals.');

        // Update the state
        removeReferralsInState(itemsToDelete);
      }

      // Reset selection states
      setSelectAll(false);
      setSelectedItems([]);
      setShowJobsSectionDeleteButton(false);
      setShowDeleteActions(false);
      setShowFloatingSelectAll(false);
    } catch (error) {
      showBottomMessage(`Couldn't delete referrals.`);
    }
  };

  // Function to handle after a referral is reported
  const reportedReferral = () => {
    // Remove the reported referral from the state
    removeReferralsInState([selectedReferral._id]);

    // Clear selected referral and selected user
    setSelectedReferral(null);
    setSelectedSeeker(null);
    setShowCloseModalOfJobDetails(false);
    setShowUserProfileModal(false);
  };

  // Functions to switch between sections in talent pool
  const showReferredCandidatesPage = () => {
    setShowReferredCandidates(true);
    setShowPendingCandidates(false);
    setCurrentPage(1);
    // Reset selection states
    setSelectAll(false);
    setSelectedItems([]);
    setShowDeleteActions(false);
    setShowFloatingSelectAll(false);
  };

  const showPendingCandidatesPage = () => {
    setShowReferredCandidates(false);
    setShowPendingCandidates(true);
    setCurrentPage(1);
    // Reset selection states
    setSelectAll(false);
    setSelectedItems([]);
    setShowDeleteActions(false);
    setShowFloatingSelectAll(false);
  };

  // Function to update referral status
  const moveCardToPage = async (card) => {
    sendGAEvent('refer_candidate');

    const seeker = card.userId ? card.user : card.unRegisteredUser;
    const seekerName = `${seeker.firstName} ${seeker.lastName}`;

    try {
      const res = await privateAxios.patch(`/refer/private/${card._id}`);

      // When the seeker was successfully referred, move the element
      if (res.status === 200) {
        // Update pending referrals and referred count
        const updatedPendingRefCount = pendingCount - 1;
        setPendingCount(updatedPendingRefCount);

        // Update referred count
        if (referredCount === -1) {
          setReferredCount(1);
        } else {
          setReferredCount((prevCount) => prevCount + 1);
        }

        // Update pending referrals fetched so far
        const updatedPendingReferrals = pendingReferrals.filter((referral) => {
          return referral._id !== card._id;
        });
        setPendingReferrals(updatedPendingReferrals);

        // Add this referral to referred candidates
        setReferredCandidates([card, ...referredCandidates]);
      }

      showBottomMessage(`Successfully referred ${seekerName}`);
    } catch (error) {
      showBottomMessage(`Couldn't refer ${seekerName}`);
    }
  };

  // Calculate time difference in a human-readable format
  function calculateDaysDifference(inputDate) {
    // Parse the input date as a Date object
    const inputDateTime = new Date(inputDate);

    // Get the current date and time
    const today = new Date();

    const utcDate1 = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const utcDate2 = Date.UTC(
      inputDateTime.getFullYear(),
      inputDateTime.getMonth(),
      inputDateTime.getDate()
    );

    // Calculate the time difference in milliseconds
    const timeDiff = utcDate1 - utcDate2;

    // Convert the difference from milliseconds to days
    const daysDifference = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let message = '';

    if (daysDifference === 0) {
      message = 'Today';
    } else if (daysDifference === 1) {
      message = 'Yesterday';
    } else if (daysDifference <= 5) {
      message = 'Few days ago';
    } else if (daysDifference <= 7) {
      message = 'A week ago';
    } else if (daysDifference <= 14) {
      message = 'Two weeks ago';
    } else if (daysDifference < 30) {
      message = 'Few weeks ago';
    } else {
      const monthTimeDiff = Math.floor(daysDifference / 30);

      if (monthTimeDiff === 1) {
        message = 'A month ago';
      } else {
        message = `${monthTimeDiff} months ago`;
      }
    }

    return message;
  }

  // Add event listener for enter key in search
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        searchUsers();
      }
    };

    const searchInput = document.querySelector('.searchReferCandidatesInput input');
    if (searchInput) {
      searchInput.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      if (searchInput) {
        searchInput.removeEventListener('keydown', handleKeyPress);
      }
    };
  }, [searchQuery]);

  // View resume function
  function sendViewResumeEvent(resume) {
    // Send event to Google analytics
    sendGAEvent('view_resume');
    viewDocumentInNewTab(resume);
  }

  // Get resume key from selected referral
  function getResumeKey() {
    let resumeKey = null;

    if (selectedReferral.userId) {
      resumeKey = selectedReferral.user.resume?.key;
    } else {
      resumeKey = selectedReferral.unRegisteredUser.resume?.key;
    }

    return resumeKey;
  }

  // Download resume function
  async function downloadResume() {
    showBottomMessage(`Downloading resume...`, 10000);

    // Create file name according to the seeker's name
    const fileName =
      (selectedSeeker?.firstName || '') +
      '_' +
      (selectedSeeker?.lastName || '') +
      '_resume.pdf';

    // Get the key of the document
    const key = getResumeKey();

    try {
      await downloadDocument(key, fileName);
      showBottomMessage(`Successfully downloaded resume.`);
    } catch (error) {
      showBottomMessage(`Couldn't download resume.`);
    }
  }

  return (
    <>
      {/* Report Popup */}
      {showReportPopup && (
        <ReportPopup
          setShowReportPopup={setShowReportPopup}
          referral={selectedReferral}
          reportedReferral={reportedReferral}
        />
      )}

      <div className="dashboard_outer_container">
        {/* Dashboard Menu */}
        <DashboardMenu />

        <div className="referCandidatesContainer">
          <div className="profileHeaderReferCandidates">
            <ProfileHeader />
          </div>

          <div className="referCandidatesContent">
            {/* Dashboard Header */}
            <div className="dashboard-header">
              <h1 className="dashboard-title">Your Dashboard</h1>
              <p className="dashboard-subtitle">
                Browse through candidates who have submitted requests for
                referrals.
              </p>

              {/* Breadcrumb Navigation */}
              <div className="breadcrumb-navigation">
                {!showReferredCandidates && showTalentPoolSection && 'Dashboard/Pending Requests'}
                {!showReferredCandidates && showjobPostingSection && 'Dashboard/Job Posting'}
                {showReferredCandidates && 'Dashboard/Referred Candidates'}
                <span className="beta-badge">BETA</span>
              </div>
            </div>

            {/* Job Details Modal */}
            {showCloseModalOfJobDetails && (
              <div className="job-details-modal">
                <div className="job-details-header">
                  <div className="job-details-title">Job Details</div>
                  <button className="close-details-button" onClick={closeModalJobDetails}>
                    <Image src={crossIcon} alt="Close job details" width={20} height={20} />
                  </button>
                </div>

                <div className="job-details-content">
                  <div className="job-details-grid">
                    {jobsAskedForReferral.jobDetails.map((ele, idx) => (
                      <div className="job-detail-item" key={idx}>
                        <Image
                          src={idx % 2 === 0 ? rightArrowDashed : addFilesIcon}
                          alt={idx % 2 === 0 ? "Job ID" : "Job URL"}
                          width={16}
                          height={16}
                        />
                        <span className="job-detail-label">
                          {idx % 2 === 0 ? "Job ID:" : "Job URL:"}
                        </span>
                        <span className="job-detail-value">
                          {idx % 2 === 0 ? 
                            (ele.jobId ? ele.jobId : '-') :
                            (ele.jobUrl ? 
                              <a href={ele.jobUrl} target="_blank" rel="noreferrer">
                                {ele.jobUrl.length > 20 ? ele.jobUrl.slice(0, 20) + '...' : ele.jobUrl}
                              </a> : '-')
                          }
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="job-message-section">
                    <div className="job-message-label">Message</div>
                    <div className="job-message-content">
                      {jobsAskedForReferral.message}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* User Profile Modal - Improved version */}
            {showUserProfileModal && (
              <ProfileModal
                closeProfileModal={closeProfileModal}
                selectedSeeker={selectedSeeker}
                noUserId={noUserId}
                seekerInfo={seekerInfo}
                publicProfileUrl={publicProfileUrl}
                calcTotalExperience={calcTotalExperience}
                getResumeKey={getResumeKey}
                sendViewResumeEvent={sendViewResumeEvent}
                downloadResume={downloadResume}
                setShowReportPopup={setShowReportPopup}
              />
            )}

            {/* Tab Navigation for Talent Pool */}
            {showTalentPoolSection && (
              <div className="referral-tabs">
                <button
                  className={`tab-button ${showPendingCandidates ? 'active' : ''}`}
                  onClick={showPendingCandidatesPage}
                >
                  Pending Requests
                </button>
                <button
                  className={`tab-button ${showReferredCandidates ? 'active' : ''}`}
                  onClick={showReferredCandidatesPage}
                >
                  Referred Candidates
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="action-bar">
              <div className="search-and-refresh">
                <div className="searchReferCandidatesInput">
                  <input
                    type="text"
                    placeholder="Search by name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Image
                    src={searchIcon}
                    alt="Search"
                    onClick={searchUsers}
                  />
                </div>
                <button
                  className="referralsRefreshButton"
                  onClick={refreshSection}
                  title="Refresh"
                >
                  <Image
                    className="referralsRefreshImage"
                    src={refreshIcon}
                    alt="Refresh"
                    style={{ transform: `rotate(${rotateAngle}deg)` }}
                  />
                </button>
              </div>
            </div>

            {/* Delete Action Bar */}
            <div className={`delete-action-bar ${showDeleteActions ? 'visible' : ''}`}>
              <div className="selected-count">
                {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
              </div>
              <button className="delete-button" onClick={handleDelete}>
                <Image src={deleteIcon} alt="Delete" width={16} height={16} />
                Delete
              </button>
            </div>

            {/* Floating Select All Button (Mobile) */}
            <div 
                className={`floating-select-all ${showFloatingSelectAll ? 'visible' : ''}`} 
                onClick={handleMainCheckboxChange}
                style={{ bottom: showDeleteActions ? '4.5rem' : '1.5rem' }} // Adjust position based on delete bar visibility
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="floating-select-all-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {selectAll ? (
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <path d="M9 12l2 2 4-4"></path>
                    </>
                  ) : (
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  )}
                </svg>
              </div>
            {/* Candidate Cards */}
            <div className="cards-container">
              {/* Loading Spinner */}
              {isLoading && (
                <div className="loader-container">
                  <ClipLoader size={50} color="#0057b1" />
                </div>
              )}

              {/* No Results Message - Pending */}
              {!showReferredCandidates &&
                !isLoading &&
                !searchValue &&
                pendingReferrals.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h3 className="empty-state-title">No pending referral requests</h3>
                    <p>
                      While there are no referrals as of now, continue sharing your 
                      profile within your network to gather all your potential referrals 
                      in one place here.
                    </p>
                  </div>
                )}

              {/* No Results Message - Search */}
              {searchValue && !isLoading && currPageData.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      <line x1="8" y1="11" x2="14" y2="11"></line>
                    </svg>
                  </div>
                  <h3 className="empty-state-title">No results found</h3>
                  <p>No user found matching your search criteria.</p>
                </div>
              )}

              {/* No Results Message - Referred */}
              {showReferredCandidates &&
                !isLoading &&
                referredCandidates.length === 0 &&
                !searchValue && (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <polyline points="16 11 18 13 22 9"></polyline>
                      </svg>
                    </div>
                    <h3 className="empty-state-title">No referred candidates yet</h3>
                    <p>
                      Great start! You haven&apos;t referred anyone yet, but there are 
                      plenty of opportunities to share and invite your friends and colleagues. 
                      Every referral counts, and your support can make a big difference.
                    </p>
                  </div>
                )}

              {/* Card Grid */}
              {!isLoading && currPageData.length > 0 && (
                <div className="candidate-cards-grid">
                  {currPageData.map((referral, idx) => {
                    // Get user data
                    const user = referral.userId ? referral.user : referral.unRegisteredUser;
                    // Make sure the profile URL is correctly used if present
                    if (user && user.profile && user.profile.url) {
                      // If the backend provides the full profile object, use its URL
                      // This ensures the ProfileImage component has what it needs
                      user.profile = user.profile.url;
                    }
                    const name = `${user?.firstName || ''} ${user?.lastName || ''}`;
                    const company = referral.userId ? 
                      (seekerInfo?.experience && seekerInfo?.experience[0]?.companyName) || 'Job Seeker' :
                      'Guest User';
                      
                    // Get first 3 skills if available
                    const skills = referral.userId && seekerInfo?.skills 
                      ? seekerInfo.skills.slice(0, 3) 
                      : ['Resume Attached'];
                      
                    return (
                      <div className="candidate-card" key={referral._id}>
                        <div className="card-checkbox-wrapper">
                          <input
                            type="checkbox"
                            className="card-checkbox"
                            checked={selectedItems.includes(idx)}
                            onChange={() => handleCheckboxChange(idx)}
                          />
                        </div>
                        
                        <div 
                          className="card-header" 
                          onClick={() => showUserProfile(referral)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="card-time">
                            {calculateDaysDifference(referral.referralAskedDate)}
                          </span>
                          <div className="card-avatar">
                            <ProfileImage
                              isLoggedInUser={false}
                              otherUser={user}
                            />
                          </div>
                          <h3 className="card-name">
                            {name}
                          </h3>
                          <div className="card-company">{company}</div>
                        </div>
                        
                        <div className="card-body">
                          <div className="card-skills">
                            {skills.map((skill, skillIdx) => (
                              <div className="card-skill" key={skillIdx}>
                                {skill}
                              </div>
                            ))}
                          </div>
                          
                          <div className="card-meta">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                              <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                            {referral.jobsAskedForReferral.jobDetails.length} job(s) requested
                          </div>
                        </div>
                        
                        <div className="card-footer">
                          <div className="card-actions">
                            <button 
                              className="card-action-button" 
                              onClick={() => handlePersonSelect(referral)}
                              title="View job details"
                            >
                              <Image src={jobListIcon} alt="Job list" width={24} height={24} />
                            </button>
                            <button 
                              className="card-action-button"
                              onClick={() => {
                                let resumeKey = null;
                                if (referral.userId) {
                                  resumeKey = referral.user.resume?.key;
                                } else {
                                  resumeKey = referral.unRegisteredUser.resume?.key;
                                }

                                if (resumeKey) {
                                  sendViewResumeEvent(resumeKey);
                                } else {
                                  showBottomMessage("Couldn't find resume of the seeker");
                                }
                              }}
                              title="View resume"
                            >
                              <Image src={downloadResumeIcon} alt="View resume" width={24} height={24} />
                            </button>
                          </div>
                          
                          {/* Show either refer button or referred badge */}
                          {!showReferredCandidates ? (
                            <button
                              className="refer-button"
                              onClick={() => moveCardToPage(referral)}
                            >
                              Refer
                            </button>
                          ) : (
                            <div className="referred-badge">
                              <Image src={greenTickIcon} alt="Referred" width={20} height={20} />
                              Referred
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {showTalentPoolSection && currentPage > 0 && currPageData.length > 0 && (
              <div className="pagination">
                <button 
                  className="pagination-button" 
                  onClick={prevPage}
                  disabled={currentPage <= 1}
                >
                  <Image src={leftArrow} alt="Previous page" width={16} height={16} />
                </button>
                
                <span className="pagination-info">
                  {currentPage}/
                  {getPagesCount(
                    showPendingCandidates ? pendingCount : referredCount
                  )}
                </span>
                
                <button
                  className="pagination-button"
                  onClick={nextPage}
                  disabled={
                    currentPage >= getPagesCount(
                      showPendingCandidates ? pendingCount : referredCount
                    )
                  }
                >
                  <Image src={rightArrow} alt="Next page" width={16} height={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferCandidates;