'use client';
/*
  File: ReferCandidates.js
  Description: This file contains component that is served at /dashboard/refer.
  In this page, a professional user can see the referral requests he has
  received and update it.
*/

import { useCallback, useEffect, useState } from 'react';
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
import devOngoingImg from '@/public/ReferCandidates/underDevImg.webp';
import refreshIcon from '@/public/ReferCandidates/refreshIcon.svg';
import viewDocumentInNewTab from '@/Utils/viewDocument';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import ReportPopup from '../../../_components/ReportPopup/ReportPopup';
import sendGAEvent from '@/Utils/gaEvents';
import downloadDocument from '@/Utils/downloadDocument';

const ReferCandidates = () => {
  const privateAxios = usePrivateAxios();

  const [showTalentPoolSection, setShowTalentPoolSection] = useState(true);
  const [showjobPostingSection, setShowjobPostingSection] = useState(false);
  const [goRight, setGoRight] = useState(false);
  const [goLeft, setGoLeft] = useState(false);
  const [talentPoolClicked, setTalentPoolClicked] = useState(false);

  // state to switch between pending referrals and completed referrals.
  const [showReferredCandidates, setShowReferredCandidates] = useState(false);
  const [showPendingCandidates, setShowPendingCandidates] = useState(true);

  // store all the referrals retreived so far, seperate them based on the status
  const [pendingReferrals, setPendingReferrals] = useState([]);
  const [referredCandidates, setReferredCandidates] = useState([]);

  // referrals to display in current page
  const [currPageData, setCurrPageData] = useState([]);

  // Create a state variable for the search query
  const [searchQuery, setSearchQuery] = useState('');

  // State to indicate a user is being searched.
  const [searchValue, setSearchValue] = useState(false);

  // use two seperate temperary states to avoid bugs while searching
  const [tempRefsOne, setTempRefsOne] = useState([]); // store unreferred candidates
  const [tempRefsTwo, setTempRefsTwo] = useState([]); // store referred candidates

  // number of documents present in each page.
  const itemsPerPage = 5;

  // keep track of the page number the user is currently viewing
  const [currentPage, setCurrentPage] = useState(
    parseInt(sessionStorage.getItem('currentPage')) || 1
  );

  /*
    These states indicate total number of pages available.
    Initially it is -1, indicating we never retreived any details from db.
    It could be initialised to 0, but we are using this property to check
    if there are >= documents in db compared to client. If there are no
    documents in db, the comparison doesn't work.
  */
  const [pendingCount, setPendingCount] = useState(-1);
  const [referredCount, setReferredCount] = useState(-1);

  // references to next page, maintained for 2 seperate sections
  const [pendingPageRef, setPendingPageRef] = useState(null);
  const [referredPageRef, setReferredPageRef] = useState(null);

  // state do define the display property of the spinner
  const [isLoading, setIsLoading] = useState(false);

  // state to determine to open/close the report popup
  const [showReportPopup, setShowReportPopup] = useState(false);

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

  function getPagesCount(items) {
    return Math.ceil(items / itemsPerPage);
  }

  // decrease the current page
  const prevPage = () => {
    if (currentPage <= 1) return;
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // increase the page number
  const nextPage = () => {
    const totalPages = getPagesCount(
      showPendingCandidates ? pendingCount : referredCount
    );
    if (currentPage >= totalPages) return;
    setCurrentPage((prevPage) => prevPage + 1);
  };

  //function to get data about referrals received.
  const getReferralData = useCallback(async () => {
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

        /* update the correct array of referrals,
        segregate based on referral status */
        if (showPendingCandidates) {
          setPendingReferrals((prevReferrals) => {
            return [...prevReferrals, ...referralData];
          });
          setPendingPageRef(next);
          setPendingCount(count);
        } else {
          setReferredCandidates((prevReferrals) => {
            return [...prevReferrals, ...referralData];
          });
          setReferredPageRef(next);
          setReferredCount(count);
        }

        // return the newly fetched referrals
        return referralData;
      }
    } catch (err) {
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    pendingPageRef,
    privateAxios,
    referredPageRef,
    showPendingCandidates,
    showReferredCandidates,
  ]);

  // this function is used to update data displayed
  const updateCurrentPageItems = useCallback(
    (retreivedReferrals, dbReferralCount) => {
      const currPageStart = (currentPage - 1) * itemsPerPage;
      const currPageEnd = currPageStart + itemsPerPage;

      /*
      (1). currPageStart and currPageEnd are indices of the objects for
        the current page. (ex., for page 1, currPageStart = 0, currPageEnd = 5).
      (2). retreivedReferrals -> reflects the array of objects that's
        already retreived from db and is stored in state.
      (3). dbRefferalCount -> reflects total number of objects in database.

      fetch the data if
      (i). current page items is not fetched yet.
      (ii). the no. of items retreived is less than required and
          more items are available in db (i.e., in the current page,
        no. of items < 5, but there are items in db)

      logic:

      ((retreivedReferrals.length - 1 < currPageEnd - 1) &&
      (retreivedReferrals.length - 1 < dbReferralCount)) -> true when
      (no. of objects retreived) < (no. of items required per page) and
      (no. of objects retreived) < (no. of items in the db)

      edge case:
      (1). initial request won't occur because of the checks implemented above,
      for initial request to occur, we have simple condition that surpasses the
      above conditions. (dbReferralCount === -1) indicates that we never checked
      the database and should do it at least once.
      (2). (!searchValue): if we are searching, all the matching candidates
      are already fetched and there's no need to fetch again.
    */

      if (
        dbReferralCount === -1 ||
        (retreivedReferrals.length - 1 < currPageEnd - 1 &&
          retreivedReferrals.length < dbReferralCount &&
          !searchValue)
      ) {
        getReferralData();
      } else {
        setCurrPageData(retreivedReferrals.slice(currPageStart, currPageEnd));
      }
    },
    [currentPage, getReferralData, searchValue]
  );

  // function to refresh the section
  const [rotateAngle, setRotateAngle] = useState(0);
  function refreshSection() {
    // get the image and rotate it by 180 degree on click
    const refreshIcon = document.querySelector('.referralsRefreshImage');
    const newAngle = rotateAngle + 180;
    refreshIcon.style.transform = `rotate(${newAngle}deg)`;
    setRotateAngle(newAngle);

    /* By removing these states, the `useEffect` below this function is
      triggered which in turn calls `updateCurrentPageItems` which refreshes
      the section */
    if (showPendingCandidates == true) {
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

  // update the data on current page, when the following state changes
  useEffect(() => {
    // set the currentPage value in session storage
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
    pendingCount,
    updateCurrentPageItems,
    referredCount,
  ]);

  // function to get users based on the search input value
  const searchUsers = useCallback(async () => {
    // if the search bar is empty, do not search users.
    if (!searchQuery || searchQuery.length === 0) return;

    setIsLoading(true);

    // send search seekers event
    sendGAEvent('search_seekers');

    try {
      const queryParams = `search=${searchQuery}&isReferred=${showReferredCandidates}`;
      const url = `/refer/private/search/?${queryParams}`;
      const res = await privateAxios.get(url);

      if (res.status === 200) {
        const { searchedReferrals } = res.data;

        if (showPendingCandidates) {
          // setTempRefs(pendingReferrals);
          setTempRefsOne(pendingReferrals);

          /* update the pending referrals, and currPageData will be updated
          by useEffect */
          setPendingReferrals(searchedReferrals);
        } else {
          setTempRefsTwo(referredCandidates);
          // setTempRefs(referredCandidates);
          setReferredCandidates(searchedReferrals);
        }
      }
    } catch (error) {
      showBottomMessage(`Couldn't search users.`);
    } finally {
      setIsLoading(false);
    }
  }, [
    pendingReferrals,
    privateAxios,
    referredCandidates,
    searchQuery,
    showPendingCandidates,
    showReferredCandidates,
  ]);

  // when there are changes in search input, fetch the users based on it
  useEffect(() => {
    // if the search just contains empty characters, return
    if (searchQuery.trim().length === 0) {
      if (!searchValue) return;

      // if the search query is empty, display the retreived referrals so far
      setPendingReferrals(tempRefsOne);
      setTempRefsOne([]);
      setReferredCandidates(tempRefsTwo);
      setTempRefsTwo([]);

      setSearchValue(false);
      return;
    } else {
      setSearchValue(true);
    }
  }, [searchQuery, searchValue, tempRefsOne, tempRefsTwo]);

  // Calculating Total Experience
  const allMonths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
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

  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [noUserId, setNoUserId] = useState(false);

  // state to store selected seeker information
  const [seekerInfo, setSeekerInfo] = useState({});

  const [isUserProfile, setIsUserProfile] = useState(false);
  const [userId, setUserId] = useState(null);
  const [publicProfileUsername, setPublicProfileUsername] = useState(null);
  const [showCloseModalOfJobDetails, setShowCloseModalOfJobDetails] =
    useState(false);

  // store the selected seeker's information
  const [selectedSeeker, setSelectedSeeker] = useState(null);
  const [selectedReferral, setSelectedReferral] = useState(null);

  const showUserProfile = async (referral, idx) => {
    // get the firstName, lastName and username of the seeker.
    const seeker = referral.userId ? referral.user : referral.unRegisteredUser;
    const { username } = seeker;

    // update the selected seeker and referral information
    setSelectedSeeker(seeker);
    setSelectedReferral(referral);

    setShowCloseModalOfJobDetails(false);
    setShowUserProfileModal(true);
    window.scroll({
      top: 0, // Scroll to the top (y-coordinate = 0).
      left: 0, // Scroll to the left edge (x-coordinate = 0).
      behavior: 'smooth',
      // Use smooth scrolling animation for a nicer user experience.
    });

    if (!referral.userId) {
      setNoUserId(true);
      return;
    }

    setNoUserId(false);
    setPublicProfileUsername(username);

    // if the current user information is already fetched, return
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

  const closeProfileModal = () => {
    setShowUserProfileModal(false);
  };

  const closeModalJobDetails = () => {
    setShowCloseModalOfJobDetails(false);
  };

  const [jobsAskedForReferral, setJobsAskedForReferral] = useState(null);
  const handlePersonSelect = (curr) => {
    setShowCloseModalOfJobDetails(true);
    setShowUserProfileModal(false);
    setJobsAskedForReferral(curr.jobsAskedForReferral);
    window.scroll({
      top: 0, // Scroll to the top (y-coordinate = 0).
      left: 0, // Scroll to the left edge (x-coordinate = 0).
      behavior: 'smooth',
      // Use smooth scrolling animation for a nicer user experience.
    });
  };

  // Function to handle checkbox when one checkbox is clicked
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showJobsSectionDeleteButton, setShowJobsSectionDeleteButton] =
    useState(false);
  const [selectedCheckItemsCheck, showSelectedCheckItemsCheck] =
    useState(false);

  // if the checkbox in header is clicked, handle it
  const handleMainCheckboxChange = () => {
    // show the delete button
    setShowJobsSectionDeleteButton(true);

    // select or unselect all the checkboxes
    const toggleSelectAll = !selectAll;
    setSelectAll(toggleSelectAll);
    if (!selectAll) {
      showSelectedCheckItemsCheck(false);
    }

    // update selected items
    setSelectedItems(
      toggleSelectAll ? currPageData.map((curr, idx) => idx) : []
    );
  };

  // function to handle when checkbox is selected
  const handleCheckboxChange = (itemId) => {
    // show the delete button
    setShowJobsSectionDeleteButton(true);

    /* update the selected items, if the item is already
    present add the element, else remove it */
    const updatedSelectedItems = selectedItems.includes(itemId)
      ? selectedItems.filter((id) => id !== itemId)
      : [...selectedItems, itemId];

    if (updatedSelectedItems.length === 0) {
      showSelectedCheckItemsCheck(false);
    } else {
      showSelectedCheckItemsCheck(true);
    }

    // if all the items are checked, then select the checkbox in header.
    setSelectAll(updatedSelectedItems.length === currPageData.length);
    setSelectedItems(updatedSelectedItems);
  };

  // Function to remove referrals from frontend, without refreshing the page
  const removeReferralsInState = (itemsToDelete) => {
    // update the correct array of referrals
    if (showPendingCandidates === true) {
      const updatedPendingReferrals = [...pendingReferrals];

      // for each item to delete
      itemsToDelete.forEach((itemIdToDelete) => {
        // find the id in fetched referrals and delete it if found
        const findIdx = updatedPendingReferrals.findIndex(
          (referral) => referral._id === itemIdToDelete
        );

        // if the element is found, delete the element from the array
        if (findIdx !== -1) updatedPendingReferrals.splice(findIdx, 1);
      });

      // after filtering out the items, update state
      setPendingReferrals(updatedPendingReferrals);
      setPendingCount((prevVal) => prevVal - itemsToDelete.length);
    } else {
      const updatedReferredCandidates = [...referredCandidates];

      itemsToDelete.forEach((itemIdToDelete) => {
        const findIdx = updatedReferredCandidates.findIndex(
          (referral) => referral._id === itemIdToDelete
        );

        // if the element is found, delete the element from the array
        if (findIdx !== -1) updatedReferredCandidates.splice(findIdx, 1);
      });

      // after filtering out the items, update state
      setReferredCandidates(updatedReferredCandidates);
      setReferredCount((prevVal) => prevVal - itemsToDelete.length);
    }
  };

  // Function to delete the cards
  const handleDelete = async () => {
    // in the current page data, get the id of selectedItems to delete
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
        // display a message to the user.
        showBottomMessage('Sucessfully deleted referrals.');

        // update the state
        removeReferralsInState(itemsToDelete);
      }

      setSelectAll(false);
      setSelectedItems([]);
      setShowJobsSectionDeleteButton(false);
    } catch (error) {
      showBottomMessage(`Couln't delete referrals.`);
    }
  };

  // function to make ui changes after a referral is reported
  const reportedReferral = () => {
    // remove the reported referral from the state
    removeReferralsInState([selectedReferral._id]);

    // clear selected referral and selected user
    setSelectedReferral(null);
    setSelectedSeeker(null);
    setShowCloseModalOfJobDetails(false);
    setShowUserProfileModal(false);
  };

  // functions to switch between sections in talent pool
  const showReferredCandidatesPage = () => {
    setShowReferredCandidates(true);
    setShowPendingCandidates(false);
    setCurrentPage(1);
  };

  const showPendingCandidatesPage = () => {
    setShowReferredCandidates(false);
    setShowPendingCandidates(true);
    setCurrentPage(1);
  };

  // function to update the status of the pending referral
  const moveCardToPage = async (card) => {
    sendGAEvent('refer_candidate');

    const seeker = card.userId ? card.user : card.unRegisteredUser;
    const seekerName = `${seeker.firstName} ${seeker.lastName}`;

    try {
      const res = await privateAxios.patch(`/refer/private/${card._id}`);

      /* when the seeker was successfully referred, move the element */
      if (res.status === 200) {
        // update pending referrals and referred count
        const updatedPendingRefCount = pendingCount - 1;
        setPendingCount(updatedPendingRefCount);

        // the first referral from this user
        if (referredCount === -1) {
          setReferredCount(1);
        } else {
          setReferredCount((prevCount) => prevCount + 1);
        }

        // update pending referrals fetched so far
        const updatedPendingReferrals = pendingReferrals.filter((referral) => {
          return referral._id !== card._id;
        });
        setPendingReferrals(updatedPendingReferrals);

        // add this referral to referred to candidate
        setReferredCandidates([card, ...referredCandidates]);
      }

      showBottomMessage(`Successfully referred, ${seekerName}`);
    } catch (error) {
      showBottomMessage(`Couldn't refer, ${seekerName}`);
    }
  };

  /* function to calculate the number of days difference between dates
  and return appropriate message */
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

    // calculate the time difference in milliseconds
    const timeDiff = utcDate1 - utcDate2;

    // convert the difference from milliseconds to days
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

  useEffect(() => {
    // add event listener for enter key press while searching for users
    const searchInputContainer = document.querySelector(
      '.searchReferCandidatesInput'
    );
    const searchInput = searchInputContainer.querySelector('input');

    // function to search users when enter key is pressed in input element.
    function searchUsersOnEnter(e) {
      if (e.key === 'Enter') {
        searchUsers();
      }
    }

    searchInput.addEventListener('keydown', searchUsersOnEnter);

    return () => {
      searchInput.removeEventListener('keydown', searchUsersOnEnter);
    };
  }, [searchUsers]);

  /* function to send 'view resume' event to google analytics
    and view document in new tab */
  function sendViewResumeEvent(resume) {
    // send event to Google analytics
    sendGAEvent('view_resume');
    viewDocumentInNewTab(resume);
  }

  // function to get key attribute of the resume in a selected referral
  function getResumeKey() {
    let resumeKey = null;

    if (selectedReferral.userId) {
      resumeKey = selectedReferral.user.resume?.key;
    } else {
      resumeKey = selectedReferral.unRegisteredUser.resume?.key;
    }

    return resumeKey;
  }

  // function to download seeker's resume.
  async function downloadResume() {
    showBottomMessage(`Downloading resume...`, 10000);

    // create file name according to the seeker's name
    const fileName =
      (selectedSeeker?.firstName || '') +
      '_' +
      (selectedSeeker?.lastName || '') +
      '_resume.pdf';

    // get the key of the document.
    const key = getResumeKey();

    try {
      await downloadDocument(key, fileName);
      showBottomMessage(`Successfully downloaded resume.`);
    } catch (error) {
      showBottomMessage(`Couldn't download resume.`);
    }
  }

  // state to display information about ongoing development
  const [showDevMessage, setShowDevMessage] = useState(false);

  // when window is below certain width, display a popup message
  function handleResize() {
    if (window.innerWidth <= 1200) {
      setShowDevMessage(true);
    } else {
      setShowDevMessage(false);
    }
  }

  useEffect(() => {
    handleResize();
  }, []);

  return (
    <>
      {/* This displays popup that allows users to submit report */}
      {showReportPopup && (
        <ReportPopup
          setShowReportPopup={setShowReportPopup}
          referral={selectedReferral}
          reportedReferral={reportedReferral}
        />
      )}

      {showDevMessage && (
        <div className="referCandidatesPopupContainer">
          <div className="referCandidatesPopupWindow">
            <div className="referCandidatesPopupHeader">
              <h2>Hold on!</h2>
              <button onClick={() => setShowDevMessage(false)}>Continue</button>
            </div>

            <p>
              Your mobile dashboard is under construction. Watch this space for
              the latest developments. Continue to our desktop site to
              effortlessly refer candidates.
            </p>

            <Image src={devOngoingImg} alt="page under development" />
          </div>
        </div>
      )}

      <div
        className={`dashboard_outer_container referCandidatesOuterContainer  
        ${showDevMessage ? 'blurBackgroundContainer' : ''}`}
      >
        {/* import dashboard menu */}
        <DashboardMenu />

        <div className="referCandidatesContainer">
          <div className="profileHeaderReferCandidates">
            <ProfileHeader />
          </div>

          <div className="referCandidatesContent">
            <div className="referralHeadingContent">
              <h1>Your Dashboard</h1>
              <p>
                Browse through candidates who have submitted requests for
                referrals.
              </p>

              {/* Title section of the page */}
              {!showReferredCandidates && showTalentPoolSection && (
                <p
                  style={{
                    marginBottom: '10px',
                    marginTop: '-5px',
                    color: '#6C6C6C',
                  }}
                >
                  Dashboard/Pending Requests
                </p>
              )}

              {!showReferredCandidates && showjobPostingSection && (
                <p
                  style={{
                    marginBottom: '10px',
                    marginTop: '-5px',
                    color: '#6C6C6C',
                  }}
                >
                  Dashboard/Job Posting
                </p>
              )}

              {showReferredCandidates && (
                <p
                  style={{
                    marginBottom: '10px',
                    marginTop: '-5px',
                    color: '#6C6C6C',
                  }}
                >
                  Dashboard/Referred Candidates
                </p>
              )}

              {showCloseModalOfJobDetails ? (
                <div
                  className={`jobDetailsTemplate ${
                    showCloseModalOfJobDetails ? 'addPopupDelay' : ''
                  }`}
                >
                  <div className="jobDetailsTemplateDesc">
                    <p style={{ fontWeight: 'bold' }}>Job Details</p>
                    <button onClick={closeModalJobDetails}>
                      <Image src={crossIcon} alt="close job details" />
                    </button>
                  </div>

                  <div className="jobDetailsHorizontalLine">&nbsp;</div>

                  {/* Display job details, which was asked for referrals */}
                  <div className="jobDetailsDesc">
                    <div className="jobDetailsHeading">
                      <p className="jobID">Job ID</p>
                      <p className="jobUrl">Job URL</p>
                    </div>

                    <div className="jobDetailsContainer">
                      {jobsAskedForReferral.jobDetails.map((ele, idx) => {
                        return (
                          <div className="jobDetailsContent" key={idx}>
                            <div className="jobDetailsContent_first">
                              <Image
                                className="firstImage"
                                src={rightArrowDashed}
                                alt="job id"
                              />
                            </div>
                            <div className="jobDetailsContent_second">
                              <p>
                                {ele.jobId
                                  ? ele.jobId.length > 10
                                    ? ele.jobId.slice(0, 10) + '...'
                                    : ele.jobId
                                  : '-'}
                              </p>
                            </div>
                            <div className="jobDetailsContent_third">
                              <Image
                                className="secondImage"
                                src={addFilesIcon}
                                alt="job url"
                              />
                            </div>
                            <div className="jobDetailsContent_fourth">
                              {ele.jobUrl ? (
                                <a
                                  href={ele.jobUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {ele.jobUrl.length > 20
                                    ? ele.jobUrl.slice(0, 20) + '...'
                                    : ele.jobUrl}
                                </a>
                              ) : (
                                '-'
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div className="jobDetailsContent_fifth">
                        <span>Message</span>
                        <p>{jobsAskedForReferral.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {showUserProfileModal && (
                <div
                  className={`showProfileSection ${
                    showUserProfileModal ? 'addPopupDelay' : ''
                  }`}
                >
                  <div className="closeProfileSection">
                    {!noUserId && (
                      <Link href={publicProfileUrl} target="_blank">
                        <p
                          style={{
                            color: '#0057B1',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                          }}
                        >
                          Open profile in new tab
                        </p>
                      </Link>
                    )}
                    <button onClick={closeProfileModal}>
                      <Image
                        src={crossIcon}
                        alt="close user information window"
                      />
                    </button>
                  </div>

                  {!noUserId && (
                    <div className="showProfileDetails">
                      <div className="leftProfileContent">
                        <div className="nameCompany">
                          <h1>
                            {selectedSeeker?.firstName || ''}
                            {' ' + selectedSeeker?.lastName || ''}
                          </h1>
                          <p style={{ color: '#898989' }}>
                            Total work experience:&nbsp;
                            {calcTotalExperience().countYear === 0
                              ? null
                              : calcTotalExperience().countYear + 'y '}
                            {calcTotalExperience().countMonth}mos
                          </p>

                          <p>
                            {isUserProfile &&
                              seekerInfo?.experience &&
                              seekerInfo?.experience[0]?.companyName}
                          </p>

                          <p>
                            {isUserProfile &&
                              seekerInfo?.education &&
                              seekerInfo?.education[0]?.school}
                          </p>

                          <div className="sendEmailAndShareProfileButtons">
                            <a href={`mailto:${selectedSeeker?.email}`}>
                              <button className="emailButton">
                                <p>Say Hi!</p>
                                <Image src={emailIcon} alt="email icon" />
                              </button>
                            </a>
                          </div>
                        </div>

                        {/* Display selected seeker's info */}
                        <div className="profileAboutSection">
                          <p style={{ color: '#0057B1', fontWeight: 'bold' }}>
                            About
                          </p>
                          <pre>{seekerInfo?.about?.bio}</pre>
                        </div>

                        <div className="profileEducationSection">
                          <p
                            style={{
                              color: '#0057B1',
                              fontWeight: 'bold',
                            }}
                          >
                            Education
                          </p>
                          {seekerInfo?.education &&
                            seekerInfo?.education.map((ele, idx) => {
                              if (idx < 2) {
                                return (
                                  <div
                                    className="profileEducationDetails"
                                    key={idx}
                                  >
                                    <p className="profileEducationDetailsCollegeName">
                                      {ele.school}
                                    </p>
                                    <p>{ele.fieldOfStudy}</p>
                                    <span className="profileEducationDetailsDuration">
                                      {ele.startYear} - {ele.endYear}
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                        </div>

                        <div className="profileExperienceSection">
                          <p
                            style={{
                              color: '#0057B1',
                              fontWeight: 'bold',
                            }}
                          >
                            Experience
                          </p>
                          {seekerInfo?.experience &&
                            seekerInfo?.experience.map((ele, idx) => {
                              if (idx < 2) {
                                return (
                                  <div
                                    className="profileEducationDetails"
                                    key={idx}
                                  >
                                    <p className="profileEducationDetailsCollegeName">
                                      {ele.jobTitle}
                                    </p>
                                    <p>
                                      {ele.companyName}
                                      <Image
                                        style={{ margin: '3px 4px' }}
                                        src={hollowCircle}
                                        alt="company name"
                                      />
                                      {ele.employmentType}
                                    </p>
                                    <span className="profileEducationDetailsDuration">
                                      {ele.startMonth}&nbsp;
                                      {ele.startYear} -&nbsp;
                                      {!ele.endMonth ? 'Present' : ele.endMonth}
                                      &nbsp;
                                      {ele.endYear ? ele.endYear : null}
                                    </span>
                                  </div>
                                );
                              }
                              return null;
                            })}
                        </div>
                      </div>
                      <div className="rightProfileContent">
                        <div className="rightProfileMergedSections">
                          <div className="profileSkillsSection">
                            <p style={{ fontWeight: 'bold' }}>Skills</p>
                            {seekerInfo?.skills &&
                              seekerInfo?.skills.map((ele, idx) => {
                                return (
                                  <div
                                    className="profileSkillsDetails"
                                    key={idx}
                                  >
                                    <p>{ele}</p>
                                  </div>
                                );
                              })}
                          </div>
                          <div className="profileSocialLinks">
                            <p style={{ fontWeight: 'bold' }}>Social Links</p>
                            <div className="socialLinksDetails">
                              {seekerInfo?.socials &&
                                seekerInfo?.socials.map((ele, idx) => {
                                  return ele.includes('linkedin.com') ? (
                                    <a href={ele} key={idx}>
                                      <Image
                                        src={linkedInIcon}
                                        alt="linked in link"
                                      />
                                    </a>
                                  ) : (
                                    <a href={ele} key={idx}>
                                      <Image
                                        src={generalLinkIcon}
                                        alt="other social link"
                                      />
                                    </a>
                                  );
                                })}
                            </div>
                          </div>
                          <div className="viewAndDownloadResume">
                            <button
                              className="viewResume"
                              onClick={() => {
                                const resumeKey = getResumeKey();

                                if (resumeKey) {
                                  sendViewResumeEvent(resumeKey);
                                } else {
                                  showBottomMessage(
                                    "Couldn't find resume of the seeker"
                                  );
                                }
                              }}
                            >
                              View Resume
                            </button>
                            <div className="tooltip-container ">
                              <button
                                onClick={downloadResume}
                                className="downloadResume tooltip-text"
                              >
                                <Image
                                  src={downloadResumeIconWhite}
                                  alt="download resume"
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="reportButton">
                          <p onClick={() => setShowReportPopup(true)}>Report</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {noUserId && (
                    <div className="showProfileDetailsWhenNothingFilled">
                      <div className="nameCompanyWhenNothingFilled">
                        <h1>
                          {(selectedSeeker?.firstName || '') +
                            ' ' +
                            (selectedSeeker?.lastName || '')}
                        </h1>

                        <div className="sendEmailAndShareProfileButtonsWhenNothingFilled">
                          <a href={`mailto:${selectedSeeker?.email}`}>
                            <button className="emailButton">
                              <p>Say Hi!</p>
                              <Image src={emailIcon} alt="email icon" />
                            </button>
                          </a>
                          <div className="viewAndDownloadResumeWhenNothingFilled">
                            <button
                              className="viewResume"
                              onClick={() => {
                                const resumeKey = getResumeKey();

                                if (resumeKey) {
                                  sendViewResumeEvent(resumeKey);
                                } else {
                                  showBottomMessage(
                                    "Couldn't find resume of the seeker"
                                  );
                                }
                              }}
                            >
                              View Resume
                            </button>
                            <div className="tooltip-container ">
                              <button
                                onClick={downloadResume}
                                className="downloadResume tooltip-text"
                              >
                                <Image
                                  src={downloadResumeIconWhite}
                                  alt="download resume"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="reportButton">
                        <p onClick={() => setShowReportPopup(true)}>Report</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Display the following options, if the user
                is in talent pool section */}
              {showTalentPoolSection && (
                <div className="referredCandidateButtonAndInput">
                  <button
                    className={`${
                      showPendingCandidates ? 'makeBgBlueOfButton' : ''
                    }`}
                    onClick={showPendingCandidatesPage}
                  >
                    Pending Requests
                  </button>

                  <button
                    className={`${
                      showReferredCandidates ? 'makeBgBlueOfButton' : ''
                    }`}
                    onClick={showReferredCandidatesPage}
                  >
                    Referred Candidates
                  </button>

                  <div className="searchReferCandidatesInput">
                    <input
                      type="text"
                      placeholder="Search by name"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Image
                      src={searchIcon}
                      alt="search candidates"
                      onClick={searchUsers}
                    />
                  </div>

                  <button
                    className="referralsRefreshButton"
                    onClick={refreshSection}
                  >
                    <Image
                      className="referralsRefreshImage"
                      style={{
                        width: '20px',
                        transition: 'transform 0.5s linear',
                      }}
                      src={refreshIcon}
                      alt="refresh referrals"
                    />
                  </button>
                </div>
              )}

              {/* Display these options when user is in job postings section */}
              {showjobPostingSection && (
                <div className="referredCandidateButtonAndInput jobPostingButtonAndInput">
                  <button className="addJobButton">
                    Add a job
                    <Image src={plusIcon} alt="add a job" />
                  </button>

                  <div className="searchReferCandidatesInput">
                    <Image src={searchIcon} alt="search for candidates" />
                    <input type="text" placeholder="Search by job" />
                  </div>
                </div>
              )}
              <button className="betaIcon">BETA</button>
            </div>

            <div className={`talentPoolAndJobPostingSection`}>
              <div
                className={`talentPoolSection ${
                  goRight && !goLeft ? 'rightTransform' : ''
                }`}
              >
                <button className="jobPostingPara">
                  <p>Job Postings</p>
                </button>
                <button className="switchTalentPoolJobButton">
                  <Image
                    src={switchJobPostreferralButton}
                    alt="switch from talent pool"
                  />
                </button>
                {/*
                <div className='preferencesTable'>
                    <p>
                    Add preferences for specific roles to receive refer requests
                    </p>
                    <button>Add Preferences</button>
                </div> */}
                <div className="candidateListForReferRequest">
                  <div className="candidateListForReferContent">
                    <div className="candidateListForReferContentFields">
                      <div className="nameWithCheckbox">
                        <div
                          className={`${
                            showJobsSectionDeleteButton
                              ? 'visibleJobs'
                              : 'hideJobs'
                          }
                                                deleteIconForJobs ${
                                                  selectAll ||
                                                  selectedCheckItemsCheck
                                                    ? 'deleteIconGoLeft'
                                                    : 'deleteIconGoRight'
                                                }`}
                        >
                          <button onClick={handleDelete}>
                            <Image
                              src={deleteIcon}
                              alt="delete referral requests"
                            />
                          </button>
                        </div>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleMainCheckboxChange}
                        />
                        <p>Name</p>
                      </div>
                      <p>Job Details</p>
                      <p>Resume</p>
                      <p style={{ marginRight: '35px' }}>Tag Candidate</p>
                    </div>

                    {isLoading && (
                      <ClipLoader className="fetch_referral_loader" size={50} />
                    )}

                    {/* Display referrals that are still pending */}
                    {!showReferredCandidates &&
                      !isLoading &&
                      currPageData.map((referral, idx) => {
                        return (
                          <div
                            className="candidateListForReferContentFieldsValues"
                            key={idx}
                          >
                            <div className="nameWithCheckboxAndReferralAskedTime">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(idx)}
                                onChange={() => handleCheckboxChange(idx)}
                              />
                              <div className="nameWithAskedReferralTime">
                                <button
                                  onClick={() => showUserProfile(referral, idx)}
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    color: '#0057B1',
                                    fontSize: '1rem',
                                    textAlign: 'left',
                                  }}
                                >
                                  {/* display the firstName and lastName of the seeker */}
                                  {referral.userId
                                    ? `${referral.user?.firstName} ${referral.user?.lastName}`
                                    : `${referral.unRegisteredUser?.firstName} ${referral.unRegisteredUser?.lastName}`}
                                </button>

                                <span>
                                  {calculateDaysDifference(
                                    referral.referralAskedDate
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="jobListButton">
                              <button
                                onClick={() => handlePersonSelect(referral)}
                              >
                                <Image
                                  className="jobListIcon"
                                  src={jobListIcon}
                                  alt="job list"
                                />
                              </button>
                            </div>
                            <div className="downloadResumeButton">
                              <button
                                onClick={() => {
                                  let resumeKey = null;

                                  if (referral.userId) {
                                    resumeKey = referral.user.resume?.key;
                                  } else {
                                    resumeKey =
                                      referral.unRegisteredUser.resume?.key;
                                  }

                                  if (resumeKey) {
                                    sendViewResumeEvent(resumeKey);
                                  } else {
                                    showBottomMessage(
                                      "Couldn't find resume of the seeker"
                                    );
                                  }
                                }}
                              >
                                <Image
                                  className="downloadResumeIcon"
                                  src={downloadResumeIcon}
                                  alt="download resume"
                                />
                              </button>
                            </div>
                            <div className="referredButton">
                              <button onClick={() => moveCardToPage(referral)}>
                                Referred
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    {/* if there are no referrals found, display this message */}
                    {!showReferredCandidates &&
                      !searchValue &&
                      !isLoading &&
                      pendingReferrals.length == 0 && (
                        <div className="notReferredMessage">
                          <p>
                            While there are no referrals as of now, continue
                            sharing your profile within your network to gather
                            all your potential referrals in one place here.
                          </p>
                        </div>
                      )}

                    {/* if the user searches and no user was found, display this message */}
                    {searchValue && !isLoading && currPageData.length == 0 && (
                      <div className="notReferredMessage">
                        <p>No user found.</p>
                      </div>
                    )}

                    {/* Display already referred candidates */}
                    {showReferredCandidates &&
                      !isLoading &&
                      currPageData.map((referral, idx) => {
                        return (
                          <div
                            key={idx}
                            className="candidateListForReferContentFieldsValues"
                          >
                            <div className="nameWithCheckboxAndReferralAskedTime">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(idx)}
                                onChange={() => handleCheckboxChange(idx)}
                              />
                              <div className="nameWithAskedReferralTime">
                                <button
                                  onClick={() => showUserProfile(referral, idx)}
                                  style={{
                                    border: 'none',
                                    background: 'none',
                                    color: '#0057B1',
                                    fontSize: '1rem',
                                  }}
                                >
                                  {referral.userId
                                    ? `${referral.user?.firstName} ${referral.user?.lastName}`
                                    : `${referral.unRegisteredUser?.firstName} ${referral.unRegisteredUser?.lastName}`}
                                </button>
                                <span>
                                  {calculateDaysDifference(
                                    referral.referralAskedDate
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="jobListButton">
                              <button
                                onClick={() => handlePersonSelect(referral)}
                              >
                                <Image
                                  className="jobListIconReferred"
                                  src={jobListIcon}
                                  alt="job list"
                                />
                              </button>
                            </div>

                            <div className="downloadResumeButton">
                              <button
                                style={{ background: 'none' }}
                                onClick={() => {
                                  let resumeKey = null;

                                  if (referral.userId) {
                                    resumeKey = referral.user.resume?.key;
                                  } else {
                                    resumeKey =
                                      referral.unRegisteredUser.resume?.key;
                                  }

                                  if (resumeKey) {
                                    sendViewResumeEvent(resumeKey);
                                  } else {
                                    showBottomMessage(
                                      "Couldn't find resume of the seeker"
                                    );
                                  }
                                }}
                              >
                                <Image
                                  style={{ marginLeft: '2px' }}
                                  src={downloadResumeIcon}
                                  alt="download resume"
                                />
                              </button>
                            </div>
                            <div className="referredButtonGreenTick">
                              <button>
                                <Image
                                  src={greenTickIcon}
                                  alt="referred candidate"
                                />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                    {/* Display this message when there are no
                      referred candidates yet */}
                    {showReferredCandidates &&
                      !isLoading &&
                      referredCandidates.length == 0 &&
                      !searchValue && (
                        <div className="notReferredMessage">
                          <p>
                            Great start! You haven&apos;t referred anyone yet,
                            but there are plenty of opportunities to share and
                            invite your friends and colleagues. Every referral
                            counts, and your support can make a big difference.
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Switch between job postings and talent pool */}
              <div
                className={` ${
                  talentPoolClicked ? 'showJobPosting' : 'hideJobPosting'
                } jobPostingSection ${
                  goLeft && !goRight ? 'leftTransform' : ''
                }`}
              >
                <div className="preferencesTable">
                  <p>Post a job to receive referral requests</p>
                  <button>Job Postings</button>
                </div>

                <button
                  onClick={toggleTalentPoolAndJobSection2}
                  className="switchTalentPoolJobButton2"
                >
                  <Image
                    src={switchJobPostreferralButton}
                    alt="switch to job section"
                  />
                </button>
                <button
                  onClick={toggleTalentPoolAndJobSection2}
                  className="jobPostingPara"
                >
                  <p>Talent Pool</p>
                </button>
              </div>
            </div>

            {/* Display previous and next buttons */}
            {showTalentPoolSection && (
              <div className="paginationSection">
                <div className="paginationSectionContent">
                  <button
                    style={{
                      opacity: currentPage > 1 ? 1 : 0,
                    }}
                    onClick={prevPage}
                  >
                    <Image src={leftArrow} alt="left arrow" />
                  </button>

                  {/* Display the page number when there are more
                    than 0 pages */}
                  {currentPage > 0 && (
                    <p>
                      {currentPage}/
                      {getPagesCount(
                        showPendingCandidates ? pendingCount : referredCount
                      )}
                    </p>
                  )}

                  {/* compare the current page to total pages available and hide
                    this button based on that

                    if (showPendingCandidates) {
                      if (totalAvailablepages === currentPage) hide the button
                      else display the button
                    }
                    if (showReferredCandidates) {
                      if (totalAvailablepages === currentPage) hide the button
                      else display the button
                    }
                  */}
                  <button
                    onClick={nextPage}
                    style={{
                      opacity:
                        showPendingCandidates &&
                        getPagesCount(pendingCount) !== currentPage
                          ? 1
                          : 0,
                    }}
                  >
                    <Image src={rightArrow} alt="right arrow" />
                  </button>
                  <button
                    onClick={nextPage}
                    style={{
                      opacity:
                        showReferredCandidates &&
                        getPagesCount(referredCount) !== currentPage
                          ? 1
                          : 0,
                    }}
                  >
                    <Image src={rightArrow} alt="right arrow" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReferCandidates;
