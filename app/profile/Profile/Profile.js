// Add a specific effect for profile upload dialog
useEffect(() => {
  if (openProfileUploadDialog) {
    console.log("Profile upload dialog state is true");
    
    // Add event listener to handle clicks on the dialog
    const handleDialogClick = (e) => {
      console.log("Dialog click detected");
    };
    
    document.addEventListener('click', handleDialogClick);
    
    return () => {
      document.removeEventListener('click', handleDialogClick);
      console.log("Profile upload dialog being closed");
    };
  }
}, [openProfileUploadDialog]);'use client';
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
import StyledIOSSwitch from '../../_components/Switch/switch';
import deleteResume from '@/public/Profile/deleteResume.svg';
import downloadResume from '@/public/Profile/downloadResume.svg';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import downloadDocument from '@/Utils/downloadDocument';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

// State for active section (for scrolling and highlighting in mobile nav)
const [activeSection, setActiveSection] = useState('about');

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
  const subSectionNumber = parseInt(e.currentTarget.dataset.subsection);

  // get the index of the data we are updating
  const subSectionDataIndex = parseInt(e.currentTarget.dataset.dataindex);

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
      window.location.reload();
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
const [shareOpen, setShareOpen] = useState(false);

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
const switchRef = useRef(null);
const handleActivelySeekingToggleChange = async (event) => {
  try {
    const newValue = event.target.checked;

    // Optimistically update the UI
    setActivelySeekingJob(newValue);

    // Make PUT request to update activelySeekingJob status
    const response = await publicAxios.put('/signUpCards/updateActivelySeekingJob', {
      userId: user._id,
      activelySeekingJob: newValue,
    });

    if (response.status !== 200) {
      console.error('Failed to update job status');
      // Optionally, revert the state if the update failed
      setActivelySeekingJob(!newValue);
    }
  } catch (error) {
    console.error('Error updating actively seeking job status:', error);
    // Optionally, revert the state if an error occurred
    setActivelySeekingJob(!newValue);
  }
};

useEffect(() => {
  // Manually change the switch state if needed
  if (switchRef.current) {
    switchRef.current.checked = activelySeekingJob;
  }
}, [activelySeekingJob]);

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

const toggleShareOptions = () => {
  setShareOpen(!shareOpen);
};

const handleShareTwitter = () => {
  const url = encodeURIComponent(
    `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`
  ); // URL of your website
  const text = encodeURIComponent(''); // Text for the tweet to add a placeholder text
  const via = encodeURIComponent('nectworks'); // Nectworks Twitter handle

  const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=${via}`;
  window.open(shareUrl, '_blank');
};

// function to share on Facebook as a post
const handleShareFacebook = () => {
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
    showBottomMessage('Opening resume...');
  } else {
    showBottomMessage('Resume URL is not available');
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
const resumeUploadBoxClass = `resume-upload-box ${isDragging ? 'drag-over' : ''}`;
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
        fileUrl: signedUrl,
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
        //It will refresh the page when resume is uploaded successfully
        window.location.reload();
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

// Handle scroll to section
const handleScrollToSection = (sectionId) => {
  setActiveSection(sectionId);
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  }
};

// Update active section based on scroll position
useEffect(() => {
  const handleScroll = () => {
    const sections = ['about', 'experience', 'education', 'skills', 'social', 'achievements', 'projects'];
    
    for (const sectionId of sections) {
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(sectionId);
          break;
        }
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);

useEffect(() => {
  const from = sessionStorage.getItem('from');
  // Check if the user came from the sign-up page
  if (from === '/sign-up') {
    setSignUpPopup(true);

    // Clear the 'from' value from session storage after using it
    sessionStorage.removeItem('from');
  }

  const sharePostParam = searchParams.get('post_shared');
  if (sharePostParam && sharePostParam === 'success') {
    showBottomMessage('Successfully shared the post');
    const newUrl = router.pathname;
    router.replace(newUrl, undefined, { shallow: true });
  }
}, [router, searchParams]);

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
      {/* Add dashboard menu */}
      <DashboardMenu />

      {/* Main container */}
      <div className="dashboard_profile_container">
        {/* Header */}
        <ProfileHeader />

        {/* Profile upload dialog - with renderProp to fix mounting issues */}
        {openProfileUploadDialog && (
          <div className="profile-upload-container">
            <ProfileUploadDialog
              setOpenFileUploadDialog={setOpenFileUploadDialog}
              key={`upload-dialog-${Date.now()}`} // Force new instance
            />
          </div>
        )}

        {/* Profile content */}
        <div className="profile-content">
          {/* Left sidebar */}
          <div className="profile-sidebar">
            {/* Profile image and info */}
            <div className="profile-header">
// Function to fix and debug profile picture upload
const handleProfileImageClick = () => {
  try {
    console.log("Attempting to open profile upload dialog");
    // Force close dialog first in case it's stuck in a bad state
    setOpenFileUploadDialog(false);
    
    // Small delay to ensure state is updated
    setTimeout(() => {
      setOpenFileUploadDialog(true);
      console.log("Profile upload dialog opened");
    }, 50);
  } catch (error) {
    console.error("Error in handleProfileImageClick:", error);
    showBottomMessage("Error opening profile upload dialog. Please try again.");
  }
};
              <h1 className="profile-name">{user?.firstName} {user?.lastName}</h1>
              <p className="profile-title">{userInfo && getLatestExperience()}</p>
              
              {/* Progress bar */}
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${completion}%` }}></div>
              </div>
              <div className="progress-percentage">Profile Completion: {completion}%</div>
            </div>
            
            {/* Toggle switches */}
            <div className="toggle-container">
              <div className="toggle-item">
                <span className="toggle-label">Are you actively looking for a job?</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={activelySeekingJob}
                    onChange={handleActivelySeekingToggleChange}
                    ref={switchRef}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-item">
                <span className="toggle-label">Available for immediate joining?</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={toggle}
                    onChange={handleImmediateJoinerToggleChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
            
            {/* Contact information */}
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">
                  <Image src={locationIcon} alt="Location" width={18} height={18} />
                </span>
                <span>
                  {userData?.location || (
                    <span className="popupFormNotFilled" onClick={handleEditClick}>
                      Add Location
                    </span>
                  )}
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">
                  <Image src={emailIcon} alt="Email" width={18} height={18} />
                </span>
                <span>{user?.email}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon">
                  <Image src={phoneIcon} alt="Phone" width={18} height={18} />
                </span>
                <span>
                  {userData?.mobileNumber ? (
                    `+${userData.mobileNumber}`
                  ) : (
                    <span className="popupFormNotFilled" onClick={handleEditClick}>
                      Add Mobile Number
                    </span>
                  )}
                </span>
              </div>
            </div>
            
            {/* Resume section */}
            <div className="resume-section">
              <div className="resume-title-container">
                <h3>Resume</h3>
                {resumeFileUrl && (
                  <button 
                    className="resume-view-button" 
                    onClick={handleOpenResume} 
                    title="View Resume"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </button>
                )}
              </div>
              
              {resumeFileUrl ? (
                <div>
                  <div className="resume-actions">
                    <button className="resume-button download-button" onClick={HandledownloadResume} title="Download Resume">
                      <svg xmlns="http://www.w3.org/2000/svg" className="button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                      <span>Download</span>
                    </button>
                    
                    <button className="resume-button delete-button" onClick={() => setShowDeleteConfirmation(true)} title="Delete Resume">
                      <svg xmlns="http://www.w3.org/2000/svg" className="button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                  
                  {showDeleteConfirmation && (
                    <div className="delete-confirmation">
                      <p>Are you sure you want to delete your resume?</p>
                      <div className="delete-confirmation-buttons">
                        <button className="delete-confirm-button" onClick={handleDeleteresume}>Yes</button>
                        <button className="delete-cancel-button" onClick={() => setShowDeleteConfirmation(false)}>No</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className={resumeUploadBoxClass}
                  onClick={handleHeaderClick}
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsDragging(false)}
                >
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".pdf"
                  />
                  <div className="resume-upload-icon">
                    <Image src={resumeUploadIcon} alt="Upload" width={30} height={30} />
                  </div>
                  <p className="resume-upload-text">
                    {resumeUploadStatus ? 'Uploading...' : 'Upload Your Resume Here'}
                  </p>
                  <p className="resume-upload-text" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    Supported Format: PDF, max 5MB
                  </p>
                </div>
              )}
            </div>
            
            {/* Share profile button */}
            <div className="share-profile">
              <button className="share-button" onClick={toggleShareOptions}>
                <span>Share Profile</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </button>
              
              {shareOpen && (
                <div className="share-options">
                  <div className="share-option" onClick={getLinkedinShareUrl} title="Share on LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#0077B5">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <div className="share-option" onClick={handleShareTwitter} title="Share on Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2">
                      <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05 1.883 0 3.616-.636 5.001-1.721-1.771-.037-3.255-1.197-3.767-2.793.249.037.499.062.761.062.361 0 .724-.05 1.061-.137-1.847-.374-3.23-1.995-3.23-3.953v-.05c.537.299 1.16.486 1.82.511-1.086-.722-1.8-1.957-1.8-3.355 0-.748.199-1.434.548-2.032 1.983 2.443 4.964 4.04 8.306 4.215-.062-.3-.1-.599-.1-.898 0-2.168 1.757-3.929 3.93-3.929 1.133 0 2.158.474 2.877 1.234.898-.175 1.747-.499 2.507-.946-.294.932-.92 1.721-1.745 2.22.799-.087 1.571-.299 2.295-.574-.536.799-1.209 1.497-1.995 2.057z"/>
                    </svg>
                  </div>
                  <div className="share-option" onClick={handleShareFacebook} title="Share on Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#3b5998">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Main content area */}
          <div className="profile-main-content">
            {/* Mobile section navigation */}
            <div className="section-nav">
              <div className="section-nav-inner">
                <a 
                  className={`section-nav-item ${activeSection === 'about' ? 'active' : ''}`}
                  onClick={() => handleScrollToSection('about')}
                >
                  About
                </a>
                <a 
                  className={`section-nav-item ${activeSection === 'experience' ? 'active' : ''}`}
                  onClick={() => handleScrollToSection('experience')}
                >
                  Experience
                </a>
                <a 
                  className={`section-nav-item ${activeSection === 'education' ? 'active' : ''}`}
                  onClick={() => handleScrollToSection('education')}
                >
                  Education
                </a>
                <a 
                  className={`section-nav-item ${activeSection === 'skills' ? 'active' : ''}`}
                  onClick={() => handleScrollToSection('skills')}
                >
                  Skills
                </a>
                <a 
                  className={`section-nav-item ${activeSection === 'social' ? 'active' : ''}`}
                  onClick={() => handleScrollToSection('social')}
                >
                  Social
                </a>
                <a 
                  className={`section-nav-item ${activeSection === 'achievements' ? 'active' : ''}`}
                  onClick={() => handleScrollToSection('achievements')}
                >
                  Achievements
                </a>
                <a 
                  className={`section-nav-item ${activeSection === 'projects' ? 'active' : ''}`}
                  onClick={() => handleScrollToSection('projects')}
                >
                  Projects
                </a>
              </div>
            </div>
            
            {/* About section */}
            <section id="about" className="content-section">
              <div className="section-header">
                <div className="section-title">
                  <div className="section-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span>About</span>
                </div>
                <button 
                  className="edit-button"
                  data-subsection={1}
                  data-dataindex={-1}
                  onClick={openSectionToEdit}
                >
                  <Image src={editIcon} alt="Edit" width={18} height={18} />
                </button>
              </div>
              
              {userInfo?.about?.bio?.length === 0 ? (
                <p style={{ opacity: 0.7 }}>
                  Tell people a bit about yourself! Sprinkle ✨ in some
                  relevant keywords from your field. This can help people
                  find you when searching for specific skills or expertise.
                </p>
              ) : (
                <>
                  {userInfo?.about?.bio?.length > 150 ? (
                    <p className="dashboard_info_hide_text">
                      {userInfo?.about?.bio || ''}
                    </p>
                  ) : (
                    <p>{userInfo?.about?.bio || ''}</p>
                  )}
                  
                  {userInfo?.about?.bio?.length > 150 && (
                    <button
                      className="dashboard_info_truncate_btn"
                      data-status="hide"
                      onClick={toggleDescription}
                    >
                      Show more
                    </button>
                  )}
                </>
              )}
            </section>
            
            {/* Experience section */}
            <section id="experience" className="content-section">
              <div className="section-header">
                <div className="section-title">
                  <div className="section-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span>Experience</span>
                </div>
                <button 
                  className="add-button"
                  data-subsection={2}
                  data-dataindex={-1}
                  onClick={openSectionToEdit}
                >
                  <Image src={addIcon} alt="Add" width={20} height={20} />
                </button>
              </div>
              
              {userInfo?.experience?.length === 0 ? (
                <p style={{ opacity: 0.7 }}>
                  Mention your employment history, including the present
                  and prior companies you have worked for.
                </p>
              ) : (
                <div className="timeline">
                  {userInfo?.experience?.map((experience, index) => (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h3 className="timeline-title">{experience?.jobTitle}</h3>
                        <p className="timeline-subtitle">
                          {experience?.companyName}
                          {experience?.employmentType && (
                            <> • {experience?.employmentType}</>
                          )}
                        </p>
                        <p className="timeline-date">
                          {experience?.startMonth?.substr(0, 3) + ' ' + experience?.startYear} - 
                          {experience?.currentlyWorking ? ' Present' : ' ' + experience?.endMonth?.substr(0, 3) + ' ' + experience?.endYear}
                          {!experience?.currentlyWorking && (
                            <> • {getTimeDifference(experience)}</>
                          )}
                        </p>
                        
                        {experience?.description?.length > 0 && (
                          <div className="timeline-description">
                            <ul className={experience?.description?.length > 150 ? 'dashboard_info_hide_text' : ''}>
                              {experience?.description
                                .split('\n')
                                .map((sentence, idx) => (
                                  <li key={idx}>{sentence}</li>
                                ))}
                            </ul>
                            
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
                        )}
                        
                        {experience?.skills?.length > 0 && (
                          <div className="skill-tags">
                            {experience?.skills.map((skill, skillIdx) => (
                              <span className="skill-tag" key={skillIdx}>
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <button
                          className="item-edit-button"
                          data-subsection={2}
                          data-dataindex={index}
                          onClick={openSectionToEdit}
                        >
                          <Image src={editIcon} alt="Edit" width={18} height={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {/* Education section */}
            <section id="education" className="content-section">
              <div className="section-header">
                <div className="section-title">
                  <div className="section-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <span>Education</span>
                </div>
                <button 
                  className="add-button"
                  data-subsection={3}
                  data-dataindex={-1}
                  onClick={openSectionToEdit}
                >
                  <Image src={addIcon} alt="Add" width={20} height={20} />
                </button>
              </div>
              
              {userInfo?.education?.length === 0 ? (
                <p style={{ opacity: 0.7 }}>
                  Fill in your education details (school, college, degree)
                  to strengthen your profile.
                </p>
              ) : (
                <div className="timeline">
                  {userInfo?.education?.map((education, index) => (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h3 className="timeline-title">{education?.school || ''}</h3>
                        {education?.degree && (
                          <p className="timeline-subtitle">
                            {education?.degree}
                            {education?.fieldOfStudy && (
                              <>, in {education?.fieldOfStudy}</>
                            )}
                          </p>
                        )}
                        <p className="timeline-date">
                          {education?.startYear} - {education?.endYear}
                        </p>
                        
                        <button
                          className="item-edit-button"
                          data-subsection={3}
                          data-dataindex={index}
                          onClick={openSectionToEdit}
                        >
                          <Image src={editIcon} alt="Edit" width={18} height={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {/* Skills section */}
            <section id="skills" className="content-section">
              <div className="section-header">
                <div className="section-title">
                  <div className="section-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span>Skills</span>
                </div>
                <button 
                  className="add-button"
                  data-subsection={5}
                  data-dataindex={-1}
                  onClick={openSectionToEdit}
                >
                  <Image src={addIcon} alt="Add" width={20} height={20} />
                </button>
              </div>
              
              {userInfo?.skills?.length === 0 ? (
                <p style={{ opacity: 0.7 }}>
                  Specify details about programming languages (such as
                  Java, Python, C/C++, node.js, SQL etc), softwares
                  (Microsoft Word, Excel, Figma etc) or any other work
                  related skills.
                </p>
              ) : (
                <div className="skills-grid">
                  {userInfo?.skills?.map((skill, index) => (
                    <div className="skill-card" key={index}>
                      <h3 className="skill-name">{skill}</h3>
                      <div className="skill-level">
                        <div className="skill-progress" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {/* Social section */}
            <section id="social" className="content-section">
              <div className="section-header">
                <div className="section-title">
                  <div className="section-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span>Social</span>
                </div>
                <button 
                  className="add-button"
                  data-subsection={4}
                  data-dataindex={-1}
                  onClick={openSectionToEdit}
                >
                  <Image src={addIcon} alt="Add" width={20} height={20} />
                </button>
              </div>
              
              {userInfo?.socials?.length === 0 ? (
                <p style={{ opacity: 0.7 }}>
                  Enter the usernames for your LinkedIn, Behance, GitHub,
                  and other profiles.
                </p>
              ) : (
                <div className="social-links">
                  {userInfo?.socials?.map((social, index) => (
                    <Link href={social} target="_blank" key={index} className="social-link">
                      <Image 
                        src={getLinkIcon(social)} 
                        alt="" 
                        width={24} 
                        height={24} 
                      />
                      <span className="social-link-text">{new URL(social).hostname.replace('www.', '')}</span>
                    </Link>
                  ))}
                </div>
              )}
            </section>
            
            {/* Achievements section */}
            <section id="achievements" className="content-section">
              <div className="section-header">
                <div className="section-title">
                  <div className="section-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <span>Achievements</span>
                </div>
                <button 
                  className="add-button"
                  data-subsection={6}
                  data-dataindex={-1}
                  onClick={openSectionToEdit}
                >
                  <Image src={addIcon} alt="Add" width={20} height={20} />
                </button>
              </div>
              
              {userInfo?.achievements?.length === 0 ? (
                <p style={{ opacity: 0.7 }}>
                  Share information about any honors or awards you've
                  received. 🏆
                </p>
              ) : (
                <div className="timeline">
                  {userInfo?.achievements?.map((achievement, index) => (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h3 className="timeline-title">{achievement?.heading}</h3>
                        
                        <div className="timeline-description">
                          {achievement?.description?.length > 0 && (
                            <ul className={achievement?.description?.length > 150 ? 'dashboard_info_hide_text' : ''}>
                              {achievement?.description
                                .split('\n')
                                .map((sentence, idx) => (
                                  <li key={idx}>{sentence}</li>
                                ))}
                            </ul>
                          )}
                          
                          {achievement?.description?.length > 150 && (
                            <button
                              className="dashboard_info_truncate_btn"
                              data-status="hide"
                              onClick={toggleDescription}
                            >
                              Show more
                            </button>
                          )}
                        </div>
                        
                        <div className="skill-tags">
                          {achievement?.document?.key?.length > 0 && (
                            <span 
                              className="skill-tag" 
                              style={{ cursor: 'pointer' }}
                              onClick={() => viewDocumentInNewTab(achievement.document.key)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                              View Document
                            </span>
                          )}
                          
                          {achievement?.link?.length > 0 && (
                            <Link href={achievement?.link} target="_blank" className="skill-tag">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                              </svg>
                              Link
                            </Link>
                          )}
                        </div>
                        
                        <button
                          className="item-edit-button"
                          data-subsection={6}
                          data-dataindex={index}
                          onClick={openSectionToEdit}
                        >
                          <Image src={editIcon} alt="Edit" width={18} height={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            
            {/* Projects section */}
            <section id="projects" className="content-section">
              <div className="section-header">
                <div className="section-title">
                  <div className="section-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <span>Projects</span>
                </div>
                <button 
                  className="add-button"
                  data-subsection={7}
                  data-dataindex={-1}
                  onClick={openSectionToEdit}
                >
                  <Image src={addIcon} alt="Add" width={20} height={20} />
                </button>
              </div>
              
              {userInfo?.projects?.length === 0 ? (
                <p style={{ opacity: 0.7 }}>
                  Add details about projects you have done in college,
                  internship or at work.
                </p>
              ) : (
                <div className="timeline">
                  {userInfo?.projects?.map((project, index) => (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <h3 className="timeline-title">{project?.heading}</h3>
                        
                        <div className="timeline-description">
                          {project?.description?.length > 0 && (
                            <ul className={project?.description?.length > 150 ? 'dashboard_info_hide_text' : ''}>
                              {project?.description
                                .split('\n')
                                .map((sentence, idx) => (
                                  <li key={idx}>{sentence}</li>
                                ))}
                            </ul>
                          )}
                          
                          {project?.description?.length > 150 && (
                            <button
                              className="dashboard_info_truncate_btn"
                              data-status="hide"
                              onClick={toggleDescription}
                            >
                              Show more
                            </button>
                          )}
                        </div>
                        
                        <div className="skill-tags">
                          {project?.document?.key?.length > 0 && (
                            <span 
                              className="skill-tag" 
                              style={{ cursor: 'pointer' }}
                              onClick={() => viewDocumentInNewTab(project.document.key)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                              View Document
                            </span>
                          )}
                          
                          {project?.link?.length > 0 && (
                            <Link href={project?.link} target="_blank" className="skill-tag">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                              </svg>
                              Link
                            </Link>
                          )}
                          
                          {project?.skills?.length > 0 && project?.skills.map((skill, skillIdx) => (
                            <span className="skill-tag" key={skillIdx}>
                              {skill}
                            </span>
                          ))}
                        </div>
                        
                        <button
                          className="item-edit-button"
                          data-subsection={7}
                          data-dataindex={index}
                          onClick={openSectionToEdit}
                        >
                          <Image src={editIcon} alt="Edit" width={18} height={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
      
      {/* Action popup for editing content */}
      {actionPopup && (
        <ProfileActions
          setActionPopup={setActionPopup}
          setUserInfo={setUserInfo}
          subSection={subSection}
          subSectionIndex={subSectionIndex}
          isDataUpdated={isDataUpdated}
        />
      )}
      
      {/* Notice period popup */}
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
                className={`joining_toggle_message_button ${selectedButton === 'immediateJoiner'
                  ? 'joining_toggle_message_buttonselected'
                  : ''}`}
                onClick={() => handleButtonClick('immediateJoiner')}
              >
                Immediate Joiner
              </button>
              <button
                className={`joining_toggle_message_button ${selectedButton === 'noticePeriod'
                  ? 'joining_toggle_message_buttonselected'
                  : ''}`}
                onClick={() => handleButtonClick('noticePeriod')}
              >
                Currently Serving Notice Period
              </button>
            </div>
            {openDateForm && (
              <div className="joining_toggle_message_dateForm">
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date()}
                  maxDate={maxDate}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Select a date"
                />
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
      
      {/* Signup confirmation popup */}
      {signUpPopup && (
        <SignUpFormPopup
          user={user}
          closePopUp={() => setSignUpPopup(false)}
        />
      )}
      
      {/* Signup form popup */}
      {showSignUpForm && (
        <SignUpFormPopup
          user={user}
          userData={userData}
          closePopUp={() => setShowSignUpForm(false)}
        />
      )}
      
      {/* Upload profile dialog */}
      {openProfileUploadDialog && (
        <ProfileUploadDialog
          setOpenFileUploadDialog={setOpenFileUploadDialog}
        />
      )}
      
      <ToastContainer />
    </div>
  </ProfileContextProvider>
);
};

export default ProfilePage;