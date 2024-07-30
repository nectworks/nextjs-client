'use client';
/*
  File: Profile.js
  Description: This file contains the profile component and is rendered
  at /profile. The profile page lets user's to add additional information
  about themselves.
*/

import './Profile.css';
import { Fragment, useContext, useEffect, useState, useRef } from 'react';
import editIcon from '@/public/Profile/editIcon.svg';
import addIcon from '@/public/Profile/addIcon.svg';
import DashboardMenu from '../../_components/DashboardMenu/DashboardMenu';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import SignUpConfirmPopup from '../../_components/SignUpConfirmPopup/SignUpConfirmPopup';
import ProfileActions from './ProfileActions';
import ProfileContextProvider from '@/context/UpdateProfile/ProfileContext';
import { initialState, reducer } from '@/context/UpdateProfile/ProfileReducer';
import seperatorIcon from '@/public/Profile/speratorIcon.svg';
import linkedInIcon from '@/public/linkedinImage.webp';
import otherLinkIcon from '@/public/Profile/otherLinkIcon.svg';
import documentLinkIcon from '@/public/Profile/documentLinkIcon.svg';
import { UserContext } from '@/context/User/UserContext';
import { DashboardContext } from '@/context/Dashboard/DashboardContext';
import ProfileHeader from '../../_components/Profile/ProfileHeader/ProfileHeader';
import ProfileImage from '../../_components/Profile/ProfileImage/ProfileImage';
import ProfileUploadDialog from '../../_components/Profile/ProfileUploadDialog/ProfileUploadDialog';
import viewDocumentInNewTab from '@/Utils/viewDocument';
import showBottomMessage from '@/Utils/showBottomMessage';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import SignUpFormPopup from '../../_components/SignUpConfirmPopup/SignUpFormPopup';
import { publicAxios } from '@/config/axiosInstance';
import axios from 'axios';
import locationIcon from '@/public/Profile/locationIcon.svg';
import workIcon from '@/public/Profile/workIcon.svg';
import emailIcon from '@/public/Profile/emailIcon.svg';
import phoneIcon from '@/public/Profile/phoneIcon.svg';
import editProfileIcon from '@/public/Profile/editIcon.svg';
import resumeUploadIcon from '@/public/Profile/resumeUploadIcon.svg';
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
import {
  FaBriefcase,
  FaMedal,
  FaUsers,
  FaTools,
  FaGraduationCap,
  FaProjectDiagram,
  FaFacebookF,
  FaLinkedin,
} from 'react-icons/fa';
import deleteResume from '@/public/Profile/deleteResume.svg';
import downloadResume from '@/public/Profile/downloadResume.svg';
import {
  FaRegMessage,
  FaXTwitter,
  FaArrowUpRightFromSquare,
} from 'react-icons/fa6';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import downloadDocument from '@/Utils/downloadDocument';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

/*
  Note about using localStorage and sessionStorage:
  (1). localStorage: The initial user input process in Profile page (when they
      login for the first time) should be persisted even if the user leaves the website in between and comes back later. Hence, this input data will be
      saved in the localStorage.
  (2). sessionStorage: The information related to user's profile and preferences,
      are stored in sessionStorage and is persisted until the user closes their
      browser.
*/

const ProfilePage = () => {
  // state for opening profile image upload dialog box.
  const [openProfileUploadDialog, setOpenFileUploadDialog] = useState(false);

  // decides the state of subsection windows for user input.
  const [actionPopup, setActionPopup] = useState(false);

  // decide the state of the signup confirmation popup
  const [signUpPopup, setSignUpPopup] = useState(false);

  // user information fetched from the API
  const [userInfo, setUserInfo] = useContext(DashboardContext);

  // decides the subsection the user is making changes in.
  const [subSection, setSubSection] = useState(1);

  /* decides the index of the sub section data we are updating.
     -1 implies we are adding new data */
  const [subSectionIndex, setSubSectionIndex] = useState(-1);

  // state to indicate that data is begin changed.
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  // use the 'UserContext' to get information about current logged in user
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [openDateForm, setOpenDateForm] = useState(false);
  const router = useRouter();
  const { pathname, query } = router;
  const searchParams = new URLSearchParams(query);
  const privateAxios = usePrivateAxios();

  // function to get appropriate icon based on the link
  function getLinkIcon(url) {
    if (!url || url.length == 0) return null;
    const { hostname } = new URL(url);

    let linkIcon = otherLinkIcon;

    if (hostname.includes('linkedin')) {
      linkIcon = linkedInIcon;
    } else if (hostname.includes('twitter')) {
      linkIcon = twitterLogo;
    } else if (hostname.includes('github')) {
      linkIcon = githubLogo;
    } else if (hostname.includes('dev.to')) {
      linkIcon = devLogo;
    } else if (hostname.includes('instagram')) {
      linkIcon = instagramLogo;
    } else if (hostname.includes('facebook')) {
      linkIcon = facebookLogo;
    } else if (hostname.includes('medium')) {
      linkIcon = mediumLogo;
    } else if (hostname.includes('figma')) {
      linkIcon = figmaLogo;
    } else if (hostname.includes('substack')) {
      linkIcon = substackLogo;
    } else if (hostname.includes('tiktok')) {
      linkIcon = tiktokLogo;
    } else if (hostname.includes('twitch')) {
      linkIcon = twitchLogo;
    } else if (hostname.includes('youtube')) {
      linkIcon = youtubeLogo;
    } else if (hostname.includes('behance')) {
      linkIcon = behanceLogo;
    } else if (hostname.includes('dribbble')) {
      linkIcon = dribbleLogo;
    } else if (hostname.includes('crunchbase')) {
      linkIcon = crunchbaseLogo;
    } else if (hostname.includes('hashnode')) {
      linkIcon = hashnodeLogo;
    }

    return linkIcon;
  }

  const [revealDeleteMsg, setRevealDeleteMsg] = useState(false);
  function showDeleteConfirmationMessage(e) {
    setRevealDeleteMsg(true);
  }
  function notShowDeleteConfirmationMessage(e) {
    setRevealDeleteMsg(false);
  }

  // function to open window to edit data
  function openSectionToEdit(e) {
    // get the subSection we are making changes in
    const subSectionNumber = parseInt(e.target.dataset.subsection);

    // get the index of the data we are updating
    const subSectionDataIndex = parseInt(e.target.dataset.dataindex);

    // open the correct subsection on click
    setSubSection(subSectionNumber);
    setSubSectionIndex(subSectionDataIndex);
    setIsDataUpdated(true);
    setActionPopup(true);
  }

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

  /* calculate the time difference between the start and end of the experience,
  format it into string and return */
  function getTimeDifference(data) {
    const { startMonth, startYear, endMonth, endYear } = data;

    let startMonthIdx = 0;
    let endMonthIdx = 0;

    allMonths.forEach((month, index) => {
      if (month == startMonth) startMonthIdx = index;
      if (month == endMonth) endMonthIdx = index;
    });

    let monthsDiff = endMonthIdx - startMonthIdx + 1;
    let yearDiff = endYear - startYear;

    if (startYear < endYear && startMonthIdx > endMonthIdx) {
      monthsDiff = 12 - startMonthIdx + endMonthIdx + 1;
      yearDiff -= 1;
    }

    let timeDiff = '';
    if (yearDiff > 0) timeDiff += `${yearDiff} yrs `;
    if (monthsDiff > 0) timeDiff += `${monthsDiff} mo`;

    return timeDiff;
  }

  // iterate over user's experience and return the latest experience
  function getLatestExperience() {
    for (let i = 0; i < userInfo?.experience?.length; i += 1) {
      const experience = userInfo.experience[i];
      /* if the user is currently working somewhere,
      return their current role and company */
      if (experience.currentlyWorking === true) {
        return `${experience.jobTitle} at ${experience.companyName}`;
      }
    }

    return null;
  }

  //For downloading the resume
  async function HandledownloadResume() {
    showBottomMessage(`Downloading resume...`, 10000);

    const fileName =
      (user?.firstName || '') + '_' + (user?.lastName || '') + '_resume.pdf';
    try {
      await downloadDocument(user.userDetails.fileKey, fileName);
      showBottomMessage(`Successfully downloaded resume`);
    } catch (error) {
      showBottomMessage(`Couldn't download resume`);
    }
  }

  // This function is used to handle delete resume
  async function handleDeleteresume() {
    showBottomMessage(`Deleting resume...`, 10000);
    try {
      const response = await publicAxios.delete(
        `/signUpCards/deleteResume/${user._id}`
      );
      if (response.status === 200) {
        setShowDeleteConfirmation(false);
        showBottomMessage('Resume deleted successfully');
        //It will refresh the page when resume is deleted successfully
        setResumeFileUrl(null);
      }
    } catch (error) {
      showBottomMessage(`Couldn't delete resume`);
    }
  }

  /* A simple function to reduce the character length in a paragraph
    and implement show more/show less feature.
  */
  function toggleDescription(e) {
    // get the closest paragraph
    const revealBtn = e.target;
    const closestParagraph = revealBtn.previousSibling;
    closestParagraph.classList.toggle('dashboard_info_hide_text');

    // change the text inside the button based on it's status
    const oldStatus = revealBtn.dataset.status;

    if (oldStatus === 'hide') {
      /* if the section was previously hidden, it will be revealed
         and hence change the text and the status */
      revealBtn.innerText = 'Show less';
      revealBtn.dataset.status = 'reveal';
    } else {
      revealBtn.innerText = 'Show more';
      revealBtn.dataset.status = 'hide';
    }
  }

  // function to fetch authorization url from linkedin
  async function getDirectLinkedInShareUrl(e) {
    try {
      const url = `/linkedin/auth?share_post=true`;
      const res = await privateAxios.get(url);

      const { authUrl } = res.data;
      window.open(authUrl, '_blank');
    } catch (error) {
      showBottomMessage(`Couldn't share post. Try again.`);
    }
  }

  async function getLinkedinShareUrl(e) {
    const userProfileUrl = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`
    );
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${userProfileUrl}`;
    window.open(shareUrl, '_blank');
  }
  //funtion to set max date
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  const [activelySeekingJob, setActivelySeekingJob] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    // Fetch initial value of activelySeekingJob from the database
    const fetchData = async () => {
      if (user && user._id) {
        // Check if user and user._id exist
        try {
          const response = await publicAxios.get(
            '/signUpCards/getActivelySeekingJob',
            {
              params: {
                userId: user._id,
              },
            }
          );
          setActivelySeekingJob(response.data.activelySeekingJob);
        } catch (error) {
          console.error('Error fetching actively seeking job status:', error);
        }
        try {
          const response = await publicAxios.get(
            '/signUpCards/getImmediatejoiner',
            {
              params: {
                userId: user._id,
              },
            }
          );
          setToggle(response.data.isOpen);
          setSelectedDate(response.data.date);
        } catch (error) {
          console.error('Error fetching actively seeking job status:', error);
        }
      }
    };

    fetchData();
  }, [user]);

  const [shouldDisplayMessage, setShouldDisplayMessage] = useState(false);

  const handleActivelySeekingToggleChange = async () => {
    try {
      const value = !activelySeekingJob;
      // Make PUT request to update activelySeekingJob status
      const response = await publicAxios.put(
        '/signUpCards/updateActivelySeekingJob',
        {
          userId: user._id,
          activelySeekingJob: value,
        }
      );
      setActivelySeekingJob(response.data.activelySeekingJob);
    } catch (error) {
      console.error('Error updating actively seeking job status:', error);
    }
  };
  const handleImmediateJoinerToggleChange = async () => {
    if (!toggle) {
      setShouldDisplayMessage(true);
    }

    try {
      // Toggle isOpen value
      const newIsOpenValue = !user.userDetails.isOpen;
      // Make the PUT request to updateImmediateJoiner
      const response = await publicAxios.put(
        '/signUpCards/updateImmediateJoiner',
        {
          userId: user._id,
          isOpen: newIsOpenValue,
        }
      );

      // Update the toggle state
      if (toggle == true) {
        setToggle(false);
        setImmediatejoiner(false);
      } else {
        setToggle(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePopupClose = () => {
    setShouldDisplayMessage(false);
    setToggle(false);
    setSelectedButton(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleButtonClick = (buttonName) => {
    setOpenDateForm(buttonName === 'noticePeriod');
    setSelectedButton(buttonName);
  };

  const handleUpdateButtonClick = () => {
    try {
      let response;
      if (openDateForm) {
        response = publicAxios.put('/signUpCards/updateImmediateJoiner', {
          userId: user._id,
          immediateJoiner: false,
          noticePeriod: selectedDate,
          isOpen: true,
        });
      } else if (!openDateForm) {
        response = publicAxios.put('/signUpCards/updateImmediateJoiner', {
          userId: user._id,
          immediateJoiner: true,
          isOpen: true,
        });
      }

      const currentDate = new Date().toISOString().split('T')[0];
      if (selectedDate < currentDate) {
        response = publicAxios.put('/signUpCards/updateImmediateJoiner', {
          userId: user._id,
          isOpen: false,
        });
      }
      setShouldDisplayMessage(false);
      setImmediatejoiner(true);
    } catch (error) {
      console.error('Error updating immediate joiner status:', error);
    }
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // function to share on twitter with the user's handle
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleShareButtonClick = () => {
    const shareBtn = document.getElementById('profile-share-button');
    shareBtn.classList.toggle('open');
  };

  const handleClick = () => {
    const url = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`
    ); // URL of your website
    const text = encodeURIComponent(''); // Text for the tweet to add a placeholder text
    const via = encodeURIComponent('nectworks'); // Nectworks Twitter handle

    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=${via}`;
    window.open(shareUrl, '_blank');
  };

  // function to share on Facebook as a post
  const handleClickFacebook = () => {
    const userProfileUrl = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`
    );
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${userProfileUrl}`;
    window.open(shareUrl, '_blank');
  };

  const [resumeFileUrl, setResumeFileUrl] = useState(null);
  const fetchFileKey = async () => {
    const userId = user._id;
    try {
      const response = await publicAxios.get(
        `/signUpCards/getFileKey/${userId}`
      );
      if (response.status === 200) {
        const { fileKey } = response.data;
        const fileUrl = await publicAxios.put('/signUpCards/getResume', {
          fileKey: fileKey,
        });
        if (fileUrl.status == 200) {
          setResumeFileUrl(fileUrl.data.signedUrl);
        } else {
          console.error('Failed to fetch the URL of the file');
        }
      } else {
        console.error('Failed to fetch file key');
      }
    } catch (error) {
      console.error('Error fetching file key:', error);
    }
  };

  useEffect(() => {
    // Fetch file key on page startup or refresh
    fetchFileKey();
  }, []);

  // Function to handle opening the resume URL
  const handleOpenResume = () => {
    if (resumeFileUrl) {
      window.open(resumeFileUrl, '_blank');
    } else {
      console.error('Resume URL is not available');
    }
  };

  const [resumeFile, setResumeFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size <= 5 * 1024 * 1024) {
      setResumeFile(selectedFile);
      uploadFile(selectedFile);
    } else {
      toast.warn('Please select a file less than 5MB.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleHeaderClick = () => {
    fileInputRef.current.click();
  };

  const [isDragging, setIsDragging] = useState(false);

  // Function to handle file drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.size <= 5 * 1024 * 1024) {
      setResumeFile(droppedFile);
      uploadFile(droppedFile);
    } else {
      toast.warn('Please select a file less than 5MB.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    setIsDragging(false);
  };

  // Function to handle drag over
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const [showOptions, setShowOptions] = useState(false);

  const handleSwipeLeft = () => {
    setShowOptions(true);
  };

  const handleSwipeRight = () => {
    setShowOptions(false);
  };

  // CSS classes for styling
  const uploadBoxClass = `dashboard_info_resume_upload_box ${
    isDragging ? 'drag-over' : ''
  }`;
  const [resumeUploadStatus, setResumeUploadStatus] = useState(false);
  const uploadFile = async (selectedFile) => {
    setResumeUploadStatus(true);
    try {
      const resume = document.getElementById('fileInput').files[0];
      const uploadUrlResponse = await privateAxios.get('/file/s3-url-put', {
        headers: {
          fileContentType: resume.type,
          fileSubType: 'resume',
          fileName: resume.name,
          unRegisteredUserId: user._id,
        },
      });
      if (uploadUrlResponse.status === 200) {
        const { signedUrl, fileName } = uploadUrlResponse.data;
        await publicAxios.put('/signUpCards/saveFileKey', {
          fileName,
          userId: user._id,
        });
        const res = await fetch(signedUrl, {
          method: 'PUT',
          body: resume,
          headers: {
            'Content-Type': resume.type,
            'Content-Disposition': 'inline',
          },
        });
        if (res.status === 200) {
          setResumeUploadStatus(false);
          toast.success('Resume uploaded successfully.', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.log('Res: ', res);
          //It will refresh the page when resume is uploaded successfully
          setResumeFileUrl(res.url);
        } else {
          console.error('Failed final upload file');
        }
      } else {
        console.error('Failed to get signed URL for upload');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (user && user._id) {
        // Check if user and user._id exist
        const userId = user._id;
        try {
          const response = await publicAxios.get(
            `/signUpCards/getUserInfo/${userId}`
          );
          const userInfo = response.data.userInfo;
          // Count the number of filled fields
          let filledFieldsCount = 0;
          for (const key in userInfo) {
            if (Array.isArray(userInfo[key]) && userInfo[key].length > 0) {
              filledFieldsCount++;
            }
          }

          if (userInfo.about) {
            filledFieldsCount++;
          }

          if (user.userDetails.fileKey) {
            filledFieldsCount++;
          }

          // Calculate completion percentage
          let totalFieldsCount = Object.keys(userInfo).filter((key) =>
            Array.isArray(userInfo[key])
          ).length;
          totalFieldsCount += 2;

          const completionPercentage = Math.ceil(
            (filledFieldsCount / totalFieldsCount) * 100
          );
          setCompletion(completionPercentage);
        } catch (error) {
          console.error('Error fetching user information:', error);
        }
      }
    };
    fetchUserInfo();
  }, [user]);

  useEffect(() => {
    // show the pop up only if redirected from signup page
    if (location.state?.from === '/sign-up') {
      setSignUpPopup(true);

      /* useLocation() data is stored in browser session
       and can persist through render and refresh.
       since, the popup is displayed based on this state,
       clear the browser history after displaying the popup once */
      window.history.replaceState({}, '');
    }

    const sharePostParam = searchParams.get('post_shared');
    if (sharePostParam && sharePostParam === 'success') {
      showBottomMessage('Successfully shared the post');
    }
  }, [searchParams]);

  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const handleEditClick = () => {
    setShowSignUpForm(true);
  };

  const [userData, setUserData] = useState(null);
  const [userPopUpInfo, setUserPopUpInfo] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      const fetchData = async () => {
        try {
          // Make request to experienced/get/:userId
          const experiencedResponse = await publicAxios.get(
            `/signUpCards/get/${user._id}`
          );
          setUserData(experiencedResponse.data.userDetails);
        } catch (error) {
          console.error('Error fetching experienced user data:', error);
        }
      };
      fetchData();
    }
  }, [user]);

  return (
    <ProfileContextProvider initialState={initialState} reducer={reducer}>
      <div className="dashboard_outer_container">
        {/* add dashboard menu */}
        <DashboardMenu />

        {/* sign up confirmation on successful registration */}
        {signUpPopup && (
          <SignUpFormPopup
            user={user}
            closePopUp={() => setSignUpPopup(false)}
          />
        )}
        <div className="dashboard_profile_container">
          <ProfileHeader />

          {/* upload profile dialog box */}
          {openProfileUploadDialog && (
            <ProfileUploadDialog
              setOpenFileUploadDialog={setOpenFileUploadDialog}
            />
          )}

          <section className="dashboard_profile_main_section">
            {/* Intro with profile and title */}
            <div className="dashboard_profile_intro">
              <div className="intro_section-dashboard">
                <div onClick={() => setOpenFileUploadDialog(true)}>
                  <ProfileImage isLoggedInUser={true} />
                </div>
                <div className="dashboard_profile_description">
                  <div className="dashboard_profile_name_resumeButton-wrapper">
                    <div className="dashboard_profile_name_edit-wrapper">
                      <div className="dashboard_profile_name_edit">
                        <p className="dashboard_profile_name">
                          {user?.firstName + ' ' + user?.lastName}
                        </p>
                        <div
                          className="edit_popUp_formDetails"
                          onClick={handleEditClick}
                        >
                          <Image src={editProfileIcon} alt="" />
                        </div>
                        {showSignUpForm && (
                          <SignUpFormPopup
                            user={user}
                            closePopUp={() => setShowSignUpForm(false)}
                          />
                        )}
                      </div>
                      <p>{userInfo && getLatestExperience()}</p>
                      <p className="dashboard_timestamp">
                        Profile Last Update -{' '}
                        {userData && userData.timestamp
                          ? ` ${userData.timestamp.savedAt}`
                          : 'N/A'}
                      </p>
                    </div>
                    <button
                      className={`dashboard_resume_view_button${
                        !resumeFileUrl ? 'disabled' : ''
                      }`}
                      onClick={handleOpenResume}
                      disabled={!resumeFileUrl}
                    >
                      Your Resume
                    </button>
                  </div>

                  <div className="popUpFormDetailsSeperator">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="717"
                      height="2"
                      viewBox="0 0 717 2"
                      fill="none"
                    >
                      <path
                        d="M0.994141 1.06104H715.994"
                        stroke="#969696"
                        strokeWidth="0.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="popUpFormDetails">
                <div className="popUpFormDetail-wrapper_for_mobile">
                  <div className="popUpFormDetail">
                    <Image src={locationIcon} alt="" />
                    <p>
                      {userData?.location || (
                        <div
                          className="popupFormNotFilled"
                          onClick={handleEditClick}
                        >
                          Add Location
                        </div>
                      )}
                    </p>
                    {showSignUpForm && (
                      <SignUpFormPopup
                        user={user}
                        userData={userData}
                        closePopUp={() => setShowSignUpForm(false)}
                      />
                    )}
                  </div>
                  <div className="popUpFormDetail_2">
                    <Image src={workIcon} alt="" />
                    <p>
                      {user?.isExperienced
                        ? 'Experienced'
                        : 'Fresher' || (
                            <div
                              className="popupFormNotFilled"
                              onClick={handleEditClick}
                            >
                              Add Experience
                            </div>
                          )}
                    </p>
                    {showSignUpForm && (
                      <SignUpFormPopup
                        user={user}
                        closePopUp={() => setShowSignUpForm(false)}
                      />
                    )}
                  </div>
                </div>
                <div className="popUpFormDetail-wrapper_for_mobile">
                  <div className="popUpFormDetail">
                    <Image src={emailIcon} alt="" />
                    <p>{user?.email}</p>
                  </div>
                  <div className="popUpFormDetail">
                    <Image src={phoneIcon} alt="" />
                    <p>
                      {userData?.mobileNumber ? (
                        `+${userData.mobileNumber}`
                      ) : (
                        <div
                          className="popupFormNotFilled"
                          onClick={handleEditClick}
                        >
                          Add Mobile Number
                        </div>
                      )}
                    </p>
                    {showSignUpForm && (
                      <SignUpFormPopup
                        user={user}
                        closePopUp={() => setShowSignUpForm(false)}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="progressBar_wrapper">
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
                <span className="percentage">{completion}%</span>
              </div>
              <div className="dashboard_profile_buttons">
                <div className="dashboard_profile_button">
                  <p>Are you actively looking for a job?</p>
                  <label className="switch">
                    <input
                      type="checkbox"
                      className="job_toggle"
                      checked={activelySeekingJob}
                      onChange={handleActivelySeekingToggleChange}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="dashboard_profile_button">
                  <p>Are you available for immediate joining?</p>
                  <label className="switch">
                    <input
                      type="checkbox"
                      className="joining_toggle"
                      checked={toggle}
                      onChange={handleImmediateJoinerToggleChange}
                    />
                    <span className="slider round"></span>
                  </label>
                  {shouldDisplayMessage && (
                    <div className="joining_toggle_message_bg">
                      <div className="joining_toggle_message">
                        <h4>Please confirm your notice period</h4>
                        <div
                          className="closeFormOptionForPopup_joining_toggle"
                          onClick={handlePopupClose}
                        >
                          <Image src={crossIcon} alt="close" />
                        </div>
                        <div className="buttons_for_joining_toggle_message">
                          <button
                            className={`joining_toggle_message_button${
                              selectedButton === 'immediateJoiner'
                                ? 'selected'
                                : ''
                            }`}
                            onClick={() => handleButtonClick('immediateJoiner')}
                          >
                            Immediate Joiner
                          </button>
                          <button
                            className={`joining_toggle_message_button${
                              selectedButton === 'noticePeriod'
                                ? 'selected'
                                : ''
                            }`}
                            onClick={() => handleButtonClick('noticePeriod')}
                          >
                            Currently Serving Notice Period
                          </button>
                        </div>
                        {openDateForm && (
                          <div className="joining_toggle_message_dateForm">
                            {/* <DatePicker
                              selected={selectedDate}
                              onChange={handleDateChange}
                              minDate={new Date()} // Set minimum date to today
                              maxDate={maxDate}
                              dateFormat="yyyy-MM-dd" // Date format
                              placeholderText="Select a date" // Placeholder text
                            />*/}
                          </div>
                        )}
                        <button
                          className="joining_toggle_message_update_button"
                          onClick={handleUpdateButtonClick}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="SmoothScrollOptions">
                <a href="#about">About</a>
                <a href="#experience">Experience</a>
                <a href="#education">Education</a>
                <a href="#skills">Skills</a>
                <a href="#social">Social</a>
                <a href="#achievements">Achievements</a>
                <a href="#projects">Projects</a>
              </div>
              <div className="SmoothScrollOptions_mobile_view">
                <a href="#about" style={{ color: 'black' }}>
                  <FaRegMessage />
                </a>
                <a href="#experience" style={{ color: 'black' }}>
                  <FaBriefcase />
                </a>
                <a href="#education" style={{ color: 'black' }}>
                  <FaGraduationCap />
                </a>
                <a href="#skills" style={{ color: 'black' }}>
                  <FaTools />
                </a>
                <a href="#social" style={{ color: 'black' }}>
                  <FaUsers />
                </a>
                <a href="#achievements" style={{ color: 'black' }}>
                  <FaMedal />
                </a>
                <a href="#projects" style={{ color: 'black' }}>
                  <FaProjectDiagram />
                </a>
              </div>
            </div>
            <hr />
            <div className="Dashboard_profile_share">
              <span onClick={handleShareButtonClick}>Share</span>
              <button
                className="profile-share-button"
                id="profile-share-button"
                onClick={handleShareButtonClick}
              >
                <i className="fas fa-arrow-up-right-from-square share-icon">
                  <FaArrowUpRightFromSquare />
                </i>
                <span className="social-icons">
                  <i
                    className="fab fa-facebook-f"
                    onClick={handleClickFacebook}
                  >
                    <FaFacebookF />
                  </i>
                  <i className="fab fa-x-twitter" onClick={handleClick}>
                    <FaXTwitter />
                  </i>
                  <i className="fab fa-linkedin" onClick={getLinkedinShareUrl}>
                    <FaLinkedin />
                  </i>
                </span>
              </button>
            </div>

            {/* open profile in new tab, link */}
            <div className="dashboard_profile_info_message">
              <span>
                The information you add below will be visible to other users.
              </span>
              <a
                className="dashboard_profile_new_tab"
                href={`/profile/${user?.username}`}
                target="_blank"
                rel="noreferrer"
              >
                Open profile in new tab
              </a>
            </div>

            <div className="dashboard_profile_mid_section">
              {
                <div className="dashboard_info_main_container">
                  <div className="dashboard_info dashboard_info_resume_upload">
                    <div className="resumedisplay">
                      <h2>Resume</h2>
                      <button
                        className={`dashboard_resume_view_buttonmobile${
                          !resumeFileUrl ? 'disabled' : ''
                        }`}
                        onClick={handleOpenResume}
                        disabled={!resumeFileUrl}
                      >
                        Your Resume
                      </button>
                    </div>
                    <p>
                      Upload an updated resume to increase your chances of being
                      discovered by recruiters by 70%.
                    </p>

                    <div
                      onClick={handleHeaderClick}
                      onDrop={handleFileDrop}
                      onDragOver={handleDragOver}
                      className={uploadBoxClass}
                      onDragLeave={() => setIsDragging(false)}
                    >
                      <input
                        type="file"
                        id="fileInput"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                      />
                      <Image src={resumeUploadIcon} alt="" />
                      {resumeFileUrl ? (
                        <h4>
                          {resumeUploadStatus ? (
                            <h4>Uploading...</h4>
                          ) : (
                            <h4>Upload New Resume?</h4>
                          )}
                        </h4>
                      ) : (
                        <h4>
                          {resumeUploadStatus ? (
                            <h4>Uploading...</h4>
                          ) : (
                            <h4>Upload Your Resume Here</h4>
                          )}
                        </h4>
                      )}
                      <p style={{ color: '#475462' }}>
                        Supported Format: PDF, max 5MB
                      </p>
                    </div>
                    {resumeFileUrl && (
                      <div className="downloadDelete">
                        <Image
                          src={downloadResume}
                          className="downloadDeleteImage"
                          onClick={HandledownloadResume}
                          alt=""
                        />

                        {revealDeleteMsg === false ? (
                          <Image
                            src={deleteResume}
                            onClick={(e) => {
                              e.stopPropagation();
                              showDeleteConfirmationMessage(e);
                            }}
                            alt=""
                            className="downloadDeleteImage"
                          />
                        ) : (
                          <div>
                            <span>Are you sure?</span>
                            <button onClick={handleDeleteresume}>Yes</button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                notShowDeleteConfirmationMessage(e);
                              }}
                            >
                              No
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    id="about"
                    className="dashboard_info dashboard_info_about"
                  >
                    <h2>About</h2>
                    {userInfo?.about?.bio?.length === 0 && (
                      <p style={{ color: '#959697' }}>
                        Tell people a bit about yourself! Sprinkle ✨ in some
                        relevant keywords from your field. This can help people
                        find you when searching for specific skills or
                        expertise.
                      </p>
                    )}
                    <Image
                      data-subsection={1}
                      data-dataindex={-1}
                      onClick={(e) => openSectionToEdit(e)}
                      className="dashboard_info_section_action_edit"
                      src={editIcon}
                      style={{
                        position: 'absolute',
                        top: '2rem',
                        right: '3rem',
                        cursor: 'pointer',
                      }}
                      alt="update entered information"
                    />
                    {userInfo?.about?.bio?.length > 150 ? (
                      <pre className="dashboard_info_hide_text">
                        {userInfo?.about?.bio || ''}
                      </pre>
                    ) : (
                      <pre>{userInfo?.about?.bio || ''}</pre>
                    )}

                    {/* display this button only if the description contains
                        more than 200 characters */}
                    {userInfo?.about?.bio?.length > 150 && (
                      <button
                        className="dashboard_info_truncate_btn"
                        data-status="hide"
                        onClick={toggleDescription}
                      >
                        Show more
                      </button>
                    )}
                  </div>

                  <div
                    id="experience"
                    className="dashboard_info dashboard_info_experiences"
                  >
                    <h2>Experience</h2>
                    {userInfo?.experience?.length === 0 && (
                      <p style={{ color: '#959697' }}>
                        Mention your employment history, including the present
                        and prior companies you have worked for.
                      </p>
                    )}
                    <Image
                      data-subsection={2}
                      data-dataindex={-1}
                      onClick={(e) => openSectionToEdit(e)}
                      className="dashboard_info_section_action_add"
                      src={addIcon}
                      alt="add another experience information"
                    />
                    {userInfo?.experience?.map((experience, index) => {
                      return (
                        <div className="dashboard_info_experience" key={index}>
                          <h3>{experience?.jobTitle}</h3>
                          <div className="dashboard_info_actions">
                            <Image
                              data-subsection={2}
                              data-dataindex={index}
                              onClick={(e) => openSectionToEdit(e)}
                              className="dashboard_info_section_action_edit"
                              src={editIcon}
                              alt="update experience"
                            />
                          </div>

                          <p>
                            {experience?.companyName}

                            {/* display this part only if experience
                                includes the employmentType */}
                            {experience?.employmentType ? (
                              <>
                                <Image
                                  className="dashboard_info_seperator"
                                  src={seperatorIcon}
                                  alt=""
                                />
                                {experience.employmentType}
                              </>
                            ) : null}
                          </p>

                          <p className="subsection_time_stamp">
                            {/* format start date and end date
                              of the experience */}
                            {experience?.startMonth?.substr(0, 3) +
                              ' ' +
                              experience?.startYear}{' '}
                            -
                            {experience?.currentlyWorking === true
                              ? ' Present'
                              : ' ' +
                                experience?.endMonth?.substr(0, 3) +
                                ' ' +
                                experience?.endYear}
                            {/* display the time difference if the user
                              is not working here presently */}
                            {!experience?.currentlyWorking && (
                              <>
                                <Image
                                  className="dashboard_info_seperator"
                                  src={seperatorIcon}
                                  alt=""
                                />
                                {getTimeDifference(experience)}
                              </>
                            )}
                          </p>

                          <div className="dashboard_info_experience_description">
                            {experience?.description?.length > 0 ? (
                              <ul
                                id="description_sentences"
                                className={
                                  experience?.description?.length > 150
                                    ? 'dashboard_info_hide_text'
                                    : ''
                                }
                              >
                                {experience?.description
                                  .split('\n')
                                  .map((sentence, index) => {
                                    return (
                                      <li key={index}>
                                        {sentence} <br></br>
                                      </li>
                                    );
                                  })}
                              </ul>
                            ) : null}

                            {experience?.description.length > 150 && (
                              <button
                                className="dashboard_info_truncate_btn"
                                data-status="hide"
                                onClick={toggleDescription}
                              >
                                Show more
                              </button>
                            )}
                          </div>

                          {experience?.skills.length > 0 ? (
                            <p>
                              Skills: {'\t'}
                              {experience?.skills.map((skill, skillIdx) => {
                                return (
                                  <Fragment key={skillIdx}>
                                    <span style={{ fontWeight: '500' }}>
                                      {skill}
                                    </span>

                                    {skillIdx <
                                    experience?.skills?.length - 1 ? (
                                      <Image
                                        className="dashboard_info_seperator"
                                        src={seperatorIcon}
                                        alt="dashboard"
                                      />
                                    ) : null}
                                  </Fragment>
                                );
                              })}
                            </p>
                          ) : null}

                          {index < userInfo?.experience?.length - 1 ? (
                            <hr></hr>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    id="education"
                    className="dashboard_info dashboard_info_all_education"
                  >
                    <h2>Education</h2>
                    {userInfo?.education?.length === 0 && (
                      <p style={{ color: '#959697' }}>
                        Fill in your education details (school, college, degree)
                        to strengthen your profile.
                      </p>
                    )}
                    <Image
                      data-subsection={3}
                      data-dataindex={-1}
                      onClick={(e) => openSectionToEdit(e)}
                      className="dashboard_info_section_action_add"
                      src={addIcon}
                      alt="add new education"
                    />
                    <div>
                      {userInfo?.education?.map((education, index) => {
                        return (
                          <div className="dashboard_info_education" key={index}>
                            <h3>{education?.school || ''}</h3>
                            <div className="dashboard_info_actions">
                              <Image
                                data-subsection={3}
                                data-dataindex={index}
                                onClick={(e) => openSectionToEdit(e)}
                                className="dashboard_info_section_action_edit"
                                src={editIcon}
                                alt="update education info"
                              />
                            </div>
                            <p>
                              {/* display this if education object
                                includes degree */}
                              {education?.degree ? (
                                <>
                                  {education?.degree}
                                  {/* display this if education
                                    includes fieldOfStudy */}
                                  {education?.fieldOfStudy ? (
                                    <>{', in ' + education?.fieldOfStudy}</>
                                  ) : null}
                                </>
                              ) : null}
                            </p>
                            <p className="subsection_time_stamp">
                              {education?.startYear} - {education?.endYear}
                            </p>

                            {index < userInfo?.education?.length - 1 ? (
                              <hr></hr>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    id="skills"
                    className="dashboard_info dashboard_info_skills"
                  >
                    <h2>Skills</h2>
                    {userInfo?.skills?.length === 0 && (
                      <p style={{ color: '#959697' }}>
                        Specify details about programming languages (such as
                        Java, Python, C/C++, node.js, SQL etc), softwares
                        (Microsoft Word, Excel, Figma etc) or any other work
                        related skills.
                      </p>
                    )}
                    <Image
                      data-subsection={5}
                      data-dataindex={-1}
                      onClick={(e) => openSectionToEdit(e)}
                      className="dashboard_info_section_action_add"
                      src={addIcon}
                      alt="add skills"
                    />
                    {userInfo?.skills?.map((skill, index) => {
                      return (
                        <Fragment key={index}>
                          <h4>{skill}</h4>
                          <hr></hr>
                        </Fragment>
                      );
                    })}
                  </div>

                  <div
                    id="social"
                    className="dashboard_info dashboard_info_socials"
                  >
                    <h2>Social</h2>
                    {userInfo?.socials?.length === 0 && (
                      <p style={{ color: '#959697' }}>
                        Enter the usernames for your LinkedIn, Behance, GitHub,
                        and other profiles.
                      </p>
                    )}
                    <Image
                      data-subsection={4}
                      data-dataindex={-1}
                      onClick={(e) => openSectionToEdit(e)}
                      className="dashboard_info_section_action_add"
                      src={addIcon}
                      alt="add social links"
                    />
                    <div className="dashboard_info_all_socials">
                      {userInfo?.socials?.map((social, index) => {
                        return (
                          <div key={index} className="dashboard_info_social">
                            <Link href={social} target="_blank">
                              {/* display the icon based on the given link */}
                              <Image src={getLinkIcon(social)} alt="" />
                            </Link>

                            <span>{social.split('//')[1]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    id="achievements"
                    className="dashboard_info dashboard_info_achievements"
                  >
                    <h2>Achievements</h2>
                    {userInfo?.achievements?.length === 0 && (
                      <p style={{ color: '#959697' }}>
                        Share information about any honors or awards you&apos;ve
                        received. 🏆
                      </p>
                    )}
                    <Image
                      data-subsection={6}
                      data-dataindex={-1}
                      onClick={(e) => openSectionToEdit(e)}
                      className="dashboard_info_section_action_add"
                      src={addIcon}
                      alt="add achievements"
                    />
                    {userInfo?.achievements?.map((achievement, index) => {
                      return (
                        <div key={index} className="dashboard_info_achievement">
                          <div className="dashboard_info_actions">
                            <Image
                              data-subsection={6}
                              data-dataindex={index}
                              onClick={(e) => openSectionToEdit(e)}
                              className="dashboard_info_section_action_edit"
                              src={editIcon}
                              alt="update achievement"
                            />
                          </div>
                          <div className="dashboard_info_achievement_header">
                            <h3>{achievement?.heading}</h3>

                            <span>
                              {achievement?.document?.key?.length > 0 ? (
                                <button
                                  onClick={() => {
                                    viewDocumentInNewTab(
                                      achievement.document.key
                                    );
                                  }}
                                >
                                  <Image src={documentLinkIcon} alt="" />
                                </button>
                              ) : null}
                              {achievement?.link?.length > 0 ? (
                                <Link href={achievement?.link} target="_blank">
                                  <Image
                                    src={otherLinkIcon}
                                    alt="achievement link"
                                  />
                                </Link>
                              ) : null}
                            </span>
                          </div>
                          <div className="dashboard_achievement_description">
                            {achievement?.description?.length > 0 ? (
                              <ul
                                id="description_sentences"
                                className={
                                  achievement?.description?.length > 150
                                    ? 'dashboard_info_hide_text'
                                    : ''
                                }
                              >
                                {achievement?.description
                                  .split('\n')
                                  .map((sentence, index) => {
                                    return (
                                      <li key={index}>
                                        {sentence} <br></br>
                                      </li>
                                    );
                                  })}
                              </ul>
                            ) : null}

                            {achievement?.description.length > 150 && (
                              <button
                                className="dashboard_info_truncate_btn"
                                data-status="hide"
                                onClick={toggleDescription}
                              >
                                Show more
                              </button>
                            )}
                          </div>

                          {index < userInfo?.achievements?.length - 1 ? (
                            <hr></hr>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    id="projects"
                    className="dashboard_info dashboard_info_projects"
                  >
                    <h2>Projects</h2>
                    {userInfo?.projects?.length === 0 && (
                      <p style={{ color: '#959697' }}>
                        Add details about projects you have done in college,
                        internship or at work.
                      </p>
                    )}
                    <Image
                      data-subsection={7}
                      data-dataindex={-1}
                      onClick={(e) => openSectionToEdit(e)}
                      className="dashboard_info_section_action_add"
                      src={addIcon}
                      alt="Add projects"
                    />
                    {userInfo?.projects?.map((project, index) => {
                      return (
                        <div key={index} className="dashboard_info_project">
                          <div className="dashboard_info_actions">
                            <Image
                              data-subsection={7}
                              data-dataindex={index}
                              onClick={(e) => openSectionToEdit(e)}
                              className="dashboard_info_section_action_edit"
                              src={editIcon}
                              alt="update project info"
                            />
                          </div>

                          <div className="dashboard_info_project_header">
                            <h3>{project?.heading}</h3>
                            <span>
                              {project?.document?.key?.length > 0 ? (
                                <button
                                  onClick={() => {
                                    viewDocumentInNewTab(project.document.key);
                                  }}
                                  target="_blank"
                                >
                                  <Image src={documentLinkIcon} alt="" />
                                </button>
                              ) : null}
                              {project?.link?.length > 0 ? (
                                <Link href={project?.link} target="_blank">
                                  <Image src={otherLinkIcon} alt="" />
                                </Link>
                              ) : null}
                            </span>
                          </div>

                          <div className="dashboard_info_project_description">
                            {project?.description?.length > 0 ? (
                              <ul
                                id="description_sentences"
                                className={
                                  project?.description?.length > 150
                                    ? 'dashboard_info_hide_text'
                                    : ''
                                }
                              >
                                {project?.description
                                  .split('\n')
                                  .map((sentence, index) => {
                                    return (
                                      <li key={index}>
                                        {sentence} <br></br>
                                      </li>
                                    );
                                  })}
                              </ul>
                            ) : null}

                            {project?.description.length > 150 && (
                              <button
                                className="dashboard_info_truncate_btn"
                                data-status="hide"
                                onClick={toggleDescription}
                              >
                                Show more
                              </button>
                            )}
                          </div>

                          {project?.skills.length > 0 ? (
                            <p>
                              Skills: {'\t'}
                              {project?.skills.map((skill, skillIdx) => {
                                return (
                                  <Fragment key={skillIdx}>
                                    <span style={{ fontWeight: '500' }}>
                                      {skill}
                                    </span>

                                    {skillIdx < project?.skills?.length - 1 ? (
                                      <Image
                                        className="dashboard_info_seperator"
                                        src={seperatorIcon}
                                        alt=""
                                      />
                                    ) : null}
                                  </Fragment>
                                );
                              })}
                            </p>
                          ) : null}

                          {index < userInfo?.projects?.length - 1 ? (
                            <hr></hr>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              }
            </div>
          </section>

          {/* popup window for taking initial user input */}
          {/* we will reuse the components in ProfileActions to edit
            and add data  */}
          {actionPopup === true && (
            <ProfileActions
              setActionPopup={setActionPopup}
              setUserInfo={setUserInfo}
              subSection={subSection}
              subSectionIndex={subSectionIndex}
              isDataUpdated={isDataUpdated}
            />
          )}
        </div>
      </div>
    </ProfileContextProvider>
  );
};

export default ProfilePage;
