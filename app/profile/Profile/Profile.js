'use client';
/*
File: Profile.js
Description: This file contains the profile component and is rendered
at /profile. The profile page lets user's to add additional information
about themselves.

This version includes improvements for:
- Accessibility with ARIA attributes
- Error handling for API calls
- Better handling of empty/undefined values
- Performance optimizations with useCallback
- Security enhancements for external links
*/

import './Profile.css';
import { Fragment, useContext, useEffect, useState, useRef, useCallback } from 'react';
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
import locationIcon from '@/public/Profile/locationIcon.svg';
import emailIcon from '@/public/Profile/emailIcon.svg';
import phoneIcon from '@/public/Profile/phoneIcon.svg';
import resumeUploadIcon from '@/public/Profile/resumeUploadIcon.svg';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import { UserContext } from '@/context/User/UserContext';
import { DashboardContext } from '@/context/Dashboard/DashboardContext';
import ProfileHeaderWrapper from '@/app/_components/ProfileHeaderWrapper/ProfileHeaderWrapper';
import ProfileImage from '../../_components/Profile/ProfileImage/ProfileImage';
import ProfileUploadDialog from '../../_components/Profile/ProfileUploadDialog/ProfileUploadDialog';
import viewDocumentInNewTab from '@/Utils/viewDocument';
import showBottomMessage from '@/Utils/showBottomMessage';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import SignUpFormPopup from '../../_components/SignUpConfirmPopup/SignUpFormPopup';
import { publicAxios } from '@/config/axiosInstance';
import downloadDocument from '@/Utils/downloadDocument';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Import all social icons
import linkedInIcon from '@/public/linkedinImage.webp';
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
import otherLinkIcon from '@/public/Profile/otherLinkIcon.svg';

// Custom loading indicator component
const LoadingIndicator = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClass = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8',
  };
  
  return (
    <div className="flex items-center justify-center flex-col p-4">
      <div className={`loader ${sizeClass[size]}`} aria-label="Loading"></div>
      <p className="text-gray-600 mt-2">{message}</p>
    </div>
  );
};

const ProfilePage = () => {
  // State for opening profile image upload dialog box
  const [openProfileUploadDialog, setOpenFileUploadDialog] = useState(false);
  
  // Loading states for various sections
  const [isLoading, setIsLoading] = useState({
    userInfo: false,
    resume: false,
    toggles: false,
    profile: false
  });

  // Decides the state of subsection windows for user input
  const [actionPopup, setActionPopup] = useState(false);

  // Decide the state of the signup confirmation popup
  const [signUpPopup, setSignUpPopup] = useState(false);

  // User information fetched from the API
  const [userInfo, setUserInfo] = useContext(DashboardContext);

  // Decides the subsection the user is making changes in
  const [subSection, setSubSection] = useState(1);

  /* Decides the index of the sub section data we are updating.
     -1 implies we are adding new data */
  const [subSectionIndex, setSubSectionIndex] = useState(-1);

  // State to indicate that data is begin changed
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  // Use the 'UserContext' to get information about current logged in user
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [openDateForm, setOpenDateForm] = useState(false);
  const router = useRouter();

  const privateAxios = usePrivateAxios();

  // State for active section (for scrolling and highlighting in mobile nav)
  const [activeSection, setActiveSection] = useState('about');

  // Added state for showing the signup form
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  // Function to fix and debug profile picture upload
  const handleProfileImageClick = useCallback(() => {
    try {
      // Force close dialog first in case it's stuck in a bad state
      setOpenFileUploadDialog(false);

      // Small delay to ensure state is updated properly before opening
      setTimeout(() => {
        setOpenFileUploadDialog(true);
      }, 100);
    } catch (error) {
      console.error("Error in handleProfileImageClick:", error);
      showBottomMessage("Error opening profile upload dialog. Please try again.");
    }
  }, []);

  // Function to get appropriate icon based on the link with error handling
  function getLinkIcon(url) {
    if (!url || typeof url !== 'string' || url.length === 0) return otherLinkIcon;
    
    try {
      const { hostname } = new URL(url);
      // Map the hostname to the appropriate icon
      return socialIcons[hostname.replace('www.', '')] || socialIcons.default;
    } catch (error) {
      console.error('Invalid URL format:', error);
      return socialIcons.default;
    }
  }

  const [revealDeleteMsg, setRevealDeleteMsg] = useState(false);

  // Confirm delete message handlers
  function showDeleteConfirmationMessage() {
    setRevealDeleteMsg(true);
  }

  function notShowDeleteConfirmationMessage() {
    setRevealDeleteMsg(false);
  }

  // Function to open window to edit data - memoized to improve performance
  const openSectionToEdit = useCallback((e) => {
    // Get the subSection we are making changes in
    const subSectionNumber = parseInt(e.currentTarget.dataset.subsection, 10);

    // Get the index of the data we are updating
    const subSectionDataIndex = parseInt(e.currentTarget.dataset.dataindex, 10);

    // Open the correct subsection on click
    setSubSection(subSectionNumber);
    setSubSectionIndex(subSectionDataIndex);
    setIsDataUpdated(true);
    setActionPopup(true);
  }, []);

  // All months for date calculations
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

  /* Calculate the time difference between the start and end of the experience,
     format it into string and return */
  function getTimeDifference(data) {
    // Handle missing or invalid data
    if (!data || !data.startMonth || !data.endMonth || !data.startYear || !data.endYear) {
      return '';
    }
    // Destructure the data object
    const { startMonth, startYear, endMonth, endYear } = data;

    // Find month indices in the allMonths array
    let startMonthIdx = allMonths.findIndex(month => month === startMonth);
    let endMonthIdx = allMonths.findIndex(month => month === endMonth);

    // Return empty string if months are not found
    if (startMonthIdx === -1 || endMonthIdx === -1) {
      return '';
    }

    // Calculate months difference
    let monthsDiff = endMonthIdx - startMonthIdx + 1;
    let yearDiff = endYear - startYear;

    // Adjust for year crossover
    if (startYear < endYear && startMonthIdx > endMonthIdx) {
      monthsDiff = 12 - startMonthIdx + endMonthIdx + 1;
      yearDiff -= 1;
    }

    // Format the time difference string
    let timeDiff = [];
    if (yearDiff > 0) timeDiff.push(`${yearDiff} ${yearDiff === 1 ? 'yr' : 'yrs'}`);
    if (monthsDiff > 0) timeDiff.push(`${monthsDiff} ${monthsDiff === 1 ? 'mo' : 'mos'}`);

    return timeDiff.join(' ');
  }

  // Iterate over user's experience and return the latest experience
  function getLatestExperience() {
    // If userInfo is completely missing or experience array is empty
    if (!userInfo || !userInfo.experience || userInfo.experience.length === 0) {
      return "Add your professional experience";
    }

    // Look for active positions first (currently working)
    const currentPosition = userInfo.experience.find(
      experience => experience && experience.currentlyWorking === true
    );

    if (currentPosition) {
      const title = currentPosition.jobTitle || "Position";
      const company = currentPosition.companyName || "Company";
      return `${title} at ${company}`;
    }

    // Fall back to the most recent experience
    const mostRecent = userInfo.experience[0];
    if (mostRecent) {
      const title = mostRecent.jobTitle || "Position";
      const company = mostRecent.companyName || "Company";
      return `${title} at ${company}`;
    }

    // Ultimate fallback
    return "Add your professional experience";
  }

  // For downloading the resume
  async function handleDownloadResume() {
    // Check if user has a resume
    if (!user?.userDetails?.fileKey) {
      showBottomMessage(`No resume available to download`);
      return;
    }

    setIsLoading(prev => ({ ...prev, resume: true }));
    showBottomMessage(`Downloading resume...`, 10000);

    // Create a suitable filename
    const fileName =
      `${user?.firstName || 'User'}_${user?.lastName || ''}_resume.pdf`;

    try {
      await downloadDocument(user.userDetails.fileKey, fileName);
      showBottomMessage(`Successfully downloaded resume`);
    } catch (error) {
      console.error('Resume download error:', error);
      showBottomMessage(`Couldn't download resume. Please try again.`);
    } finally {
      setIsLoading(prev => ({ ...prev, resume: false }));
    }
  }

  // This function is used to handle delete resume
  async function handleDeleteResume() {
    if (!user?._id) {
      showBottomMessage(`User information not available`);
      return;
    }

    setIsLoading(prev => ({ ...prev, resume: true }));
    showBottomMessage(`Deleting resume...`, 10000);

    try {
      const response = await publicAxios.delete(
        `/signUpCards/deleteResume/${user._id}`
      );

      if (response.status === 200) {
        setShowDeleteConfirmation(false);
        showBottomMessage('Resume deleted successfully');

        // Update local state instead of refreshing the page
        setResumeFileUrl(null);

        // Update user state if needed
        if (user.userDetails) {
          setUser({
            ...user,
            userDetails: {
              ...user.userDetails,
              fileKey: null
            }
          });
        }
      }
    } catch (error) {
      console.error('Resume deletion error:', error);
      showBottomMessage(`Couldn't delete resume. Please try again.`);
    } finally {
      setIsLoading(prev => ({ ...prev, resume: false }));
    }
  }

  /* A simple function to reduce the character length in a paragraph
     and implement show more/show less feature. */
  function toggleDescription(e) {
    // Get the closest paragraph
    const revealBtn = e.target;
    const closestParagraph = revealBtn.previousSibling;

    if (!closestParagraph) return;

    // Toggle the hide class
    closestParagraph.classList.toggle('dashboard_info_hide_text');

    // Change the text inside the button based on its status
    const oldStatus = revealBtn.dataset.status;

    if (oldStatus === 'hide') {
      // If the section was previously hidden, reveal it
      revealBtn.innerText = 'Show less';
      revealBtn.dataset.status = 'reveal';
      revealBtn.setAttribute('aria-expanded', 'true');
    } else {
      // If the section was previously revealed, hide it
      revealBtn.innerText = 'Show more';
      revealBtn.dataset.status = 'hide';
      revealBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // Share profile functions with LinkedIn
  const getLinkedinShareUrl = useCallback(() => {
    if (!user?.username) {
      showBottomMessage('Username not available for sharing');
      return;
    }

    try {
      const userProfileUrl = encodeURIComponent(
        `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user.username}`
      );
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${userProfileUrl}`;
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error sharing to LinkedIn:', error);
      showBottomMessage('Failed to open sharing window. Please try again.');
    }
  }, [user?.username]);

  useEffect(() => {
    const initializeNewUserProfile = async () => {
      if (!user || !user._id) return;
      
      try {
        // Make a call to initialize the profile for new users
        await publicAxios.post(`/signUpCards/initializeProfile/${user._id}`);
        
        // No need to handle the response - this just ensures the UserInfo document exists
      } catch (error) {
        // Silently handle errors - this is just a helper operation
        console.log('Profile initialization error (non-critical):', error);
      }
    };
    
    initializeNewUserProfile();
  }, [user]);

  // State to track whether we've checked the user's profile data
  const [profileChecked, setProfileChecked] = useState(false);

  // This useEffect will check if the user needs to complete their profile
  useEffect(() => {
    // Skip if no user, no user ID, or we've already checked the profile
    if (!user || !user._id || profileChecked) return;
  
    const checkProfileCompletion = async () => {
      try {
        // Make request to get user details
        const response = await publicAxios.get(`/signUpCards/get/${user._id}`);
        const { userDetails, username } = response.data;
        
        // Check if essential profile data is present
        const hasCompletedBasicProfile = Boolean(
          userDetails?.mobileNumber &&
          username &&
          (
            // Either professional path is complete
            (userDetails?.jobTitle && userDetails?.companyName) ||
            // Or student path is complete
            (userDetails?.desiredIndustry && userDetails?.educationLevel)
          )
        );
        
        // Always show popup for new users who haven't completed their profile
        // Remove the comingFromSignup check that was allowing skipping
        if (!hasCompletedBasicProfile) {
          setSignUpPopup(true);
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
      } finally {
        setProfileChecked(true);
      }
    };

    checkProfileCompletion();
  }, [user, profileChecked]);

  // Set max date for notice period (3 months from now)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);

  // States for job seeking status and notice period
  const [activelySeekingJob, setActivelySeekingJob] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedButton, setSelectedButton] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Fetch job status information
  useEffect(() => {
    // Fetch initial value of activelySeekingJob from the database
    const fetchJobStatus = async () => {
      if (user && user._id) {
        setIsLoading(prev => ({ ...prev, toggles: true }));

        try {
          // Use Promise.all to make parallel requests for better performance
          const [activelySeekingResponse, immediateJoinerResponse] = await Promise.all([
            publicAxios.get('/signUpCards/getActivelySeekingJob', {
              params: { userId: user._id }
            }),
            publicAxios.get('/signUpCards/getImmediatejoiner', {
              params: { userId: user._id }
            })
          ]);

          // Update the states with the response data
          setActivelySeekingJob(activelySeekingResponse.data.activelySeekingJob);
          setToggle(immediateJoinerResponse.data.isOpen);

          // Handle the date if available
          if (immediateJoinerResponse.data.date) {
            setSelectedDate(new Date(immediateJoinerResponse.data.date));
          }
        } catch (error) {
          console.error('Error fetching job status information:', error);
          // Don't show error to user as this is non-critical
        } finally {
          setIsLoading(prev => ({ ...prev, toggles: false }));
        }
      }
    };

    fetchJobStatus();
  }, [user]);

  const [shouldDisplayMessage, setShouldDisplayMessage] = useState(false);
  const switchRef = useRef(null);

  // Handle actively seeking job toggle change
  const handleActivelySeekingToggleChange = async (event) => {
    if (!user?._id) {
      showBottomMessage('User information not available');
      return;
    }

    const newValue = event.target.checked;

    // Optimistically update the UI
    setActivelySeekingJob(newValue);

    try {
      // Make PUT request to update activelySeekingJob status
      const response = await publicAxios.put('/signUpCards/updateActivelySeekingJob', {
        userId: user._id,
        activelySeekingJob: newValue,
      });

      if (response.status !== 200) {
        console.error('Failed to update job status');
        // Revert the state if the update failed
        setActivelySeekingJob(!newValue);
        showBottomMessage('Failed to update job seeking status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating actively seeking job status:', error);
      // Revert the state if an error occurred
      setActivelySeekingJob(!newValue);
      showBottomMessage('Failed to update job seeking status. Please try again.');
    }
  };

  // Sync the switch state with the activelySeekingJob value
  useEffect(() => {
    if (switchRef.current) {
      switchRef.current.checked = activelySeekingJob;
    }
  }, [activelySeekingJob]);

  // Handle immediate joiner toggle change
  const handleImmediateJoinerToggleChange = async () => {
    if (!user?._id) {
      showBottomMessage('User information not available');
      return;
    }

    if (!toggle) {
      // Show popup to confirm notice period if it's being turned on
      setShouldDisplayMessage(true);
      return;
    }

    try {
      // Toggle isOpen value
      const newIsOpenValue = !toggle;

      // Make the PUT request to updateImmediateJoiner
      await publicAxios.put('/signUpCards/updateImmediateJoiner', {
        userId: user._id,
        isOpen: newIsOpenValue,
      });

      // Update the toggle state
      setToggle(newIsOpenValue);
    } catch (error) {
      console.error('Error updating immediate joiner status:', error);
      showBottomMessage('Failed to update immediate joiner status. Please try again.');
    }
  };

  // Close the notice period popup
  const handlePopupClose = () => {
    setShouldDisplayMessage(false);
    setToggle(false);
    setSelectedButton(null);
    setSelectedDate(new Date());
  };

  // Handle notice period button click
  const handleButtonClick = (buttonName) => {
    setOpenDateForm(buttonName === 'noticePeriod');
    setSelectedButton(buttonName);
  };

  // Update notice period settings
  const handleUpdateButtonClick = async () => {
    if (!user?._id) {
      showBottomMessage('User information not available');
      return;
    }

    try {
      let updateData = {
        userId: user._id,
        isOpen: true
      };

      if (openDateForm && selectedDate) {
        // User selected notice period option
        updateData = {
          ...updateData,
          immediateJoiner: false,
          noticePeriod: selectedDate
        };
      } else if (!openDateForm) {
        // User selected immediate joiner option
        updateData = {
          ...updateData,
          immediateJoiner: true
        };
      }

      // Check if selected date is in the past
      const currentDate = new Date();
      if (selectedDate && selectedDate < currentDate) {
        updateData.isOpen = false;
      }

      // Make the API call
      const response = await publicAxios.put(
        '/signUpCards/updateImmediateJoiner', 
        updateData
      );
      
      if (response.status === 200) {
        showBottomMessage('Successfully updated joining status.');
        setToggle(updateData.isOpen);
      }
      
      setShouldDisplayMessage(false);
    } catch (error) {
      console.error('Error updating immediate joiner status:', error);
      showBottomMessage('Failed to update joining status. Please try again.');
    }
  };
  
  // Handle date change in the date picker
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Handle social media sharing options toggle
  const toggleShareOptions = () => {
    setShareOpen(!shareOpen);
  };

  // Handle Twitter sharing
  const handleShareTwitter = () => {
    if (!user?.username) {
      showBottomMessage('Username not available for sharing');
      return;
    }
    
    try {
      const url = encodeURIComponent(
        `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user.username}`
      );
      const text = encodeURIComponent('Check out my professional profile on Nectworks!');
      const via = encodeURIComponent('nectworks');

      const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=${via}`;
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error sharing to Twitter:', error);
      showBottomMessage('Failed to open sharing window. Please try again.');
    }
  };

  // Handle Facebook sharing
  const handleShareFacebook = () => {
    if (!user?.username) {
      showBottomMessage('Username not available for sharing');
      return;
    }
    
    try {
      const userProfileUrl = encodeURIComponent(
        `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user.username}`
      );
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${userProfileUrl}`;
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      showBottomMessage('Failed to open sharing window. Please try again.');
    }
  };

  // State for resume file URL
  const [resumeFileUrl, setResumeFileUrl] = useState(null);

  // Enhanced file key fetching with better error handling
  const fetchFileKey = useCallback(async () => {
    const userId = user?._id;
    if (!userId) return;
    
    setIsLoading(prev => ({ ...prev, resume: true }));
    
    try {
      const response = await publicAxios.get(`/signUpCards/getFileKey/${userId}`);
      
      if (response.status === 200 && response.data.fileKey) {
        try {
          const fileUrl = await publicAxios.put('/signUpCards/getResume', {
            fileKey: response.data.fileKey,
          });
          
          if (fileUrl && fileUrl.status === 200) {
            setResumeFileUrl(fileUrl.data.signedUrl);
          }
        } catch (fileError) {
          // Silently handle file URL errors
          console.log("Error fetching file URL - resume might not be accessible");
        }
      }
    } catch (error) {
      // Silently handle expected errors for new users
      if (error.response && (error.response.status === 400 || error.response.status === 404)) {
        console.log("Status: No resume uploaded.");
      } else {
        // Log unexpected errors
        console.error('Unexpected error fetching file key:', error);
      }
    } finally {
      setIsLoading(prev => ({ ...prev, resume: false }));
    }
  }, [user?._id]);

  // Fetch resume when user information is available
  useEffect(() => {
    if (user && user._id) {
      fetchFileKey();
    }
  }, [user, fetchFileKey]);

  // Function to handle opening the resume URL
  const handleOpenResume = () => {
    if (resumeFileUrl) {
      window.open(resumeFileUrl, '_blank', 'noopener,noreferrer');
      showBottomMessage('Opening resume...');
    } else {
      showBottomMessage('Resume URL is not available');
    }
  };

  // States for resume upload
  const [resumeFile, setResumeFile] = useState(null);
  const fileInputRef = useRef(null);

  // Handle file selection for resume upload
  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    
    // Check file size (5MB limit)
    if (selectedFile.size <= 5 * 1024 * 1024) {
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
      });
    }
  };

  // Handle click on resume upload box
  const handleHeaderClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // State for drag and drop functionality
  const [isDragging, setIsDragging] = useState(false);

  // Function to handle file drop
  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (!droppedFile) return;
    
    // Check file size (5MB limit)
    if (droppedFile.size <= 5 * 1024 * 1024) {
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
      });
    }
    setIsDragging(false);
  };

  // Function to handle drag over
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  // Function to handle drag leave
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // CSS classes for styling the resume upload box
  const resumeUploadBoxClass = `resume-upload-box ${isDragging ? 'drag-over' : ''}`;
  
  // State for resume upload status
  const [resumeUploadStatus, setResumeUploadStatus] = useState(false);
  
  // Enhanced file upload function with better error handling
  const uploadFile = async () => {
    if (!user?._id) {
      showBottomMessage('User information not available');
      return;
    }
    
    const resume = document.getElementById('fileInput')?.files?.[0];
    if (!resume) {
      return;
    }
    
    setResumeUploadStatus(true);
    
    try {
      // Step 1: Get signed URL for upload
      const uploadUrlResponse = await privateAxios.get('/file/s3-url-put', {
        headers: {
          fileContentType: resume.type,
          fileSubType: 'resume',
          fileName: resume.name,
          unRegisteredUserId: user._id,
        },
      });
      
      if (uploadUrlResponse.status !== 200) {
        throw new Error('Failed to get signed URL for upload');
      }
      
      const { signedUrl, fileName } = uploadUrlResponse.data;
      
      // Step 2: Save file key to user profile
      await publicAxios.put('/signUpCards/saveFileKey', {
        fileName,
        userId: user._id,
        fileUrl: signedUrl,
      });
      
      // Step 3: Upload file to S3
      const res = await fetch(signedUrl, {
        method: 'PUT',
        body: resume,
        headers: {
          'Content-Type': resume.type,
          'Content-Disposition': 'inline',
        },
      });
      
      if (res.status === 200) {
        toast.success('Resume uploaded successfully.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Update local state
        fetchFileKey();
        
        // Update user state if needed
        if (user) {
          setUser({
            ...user,
            userDetails: {
              ...user.userDetails,
              fileKey: fileName
            }
          });
        }
      } else {
        throw new Error('Failed to upload file to storage');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setResumeUploadStatus(false);
    }
  };

  // State for profile completion percentage
  const [completion, setCompletion] = useState(0);

  // Enhanced user info fetch with proper error handling and completion calculation
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user || !user._id) return;
      
      const userId = user._id;
      setIsLoading(prev => ({ ...prev, userInfo: true }));
      
      try {
        const response = await publicAxios.get(`/signUpCards/getUserInfo/${userId}`);
        const userInfo = response.data.userInfo;
        
        // Calculate completion percentage
        let filledFieldsCount = 0;
        let totalFieldsCount = 7; // Total number of profile sections
        
        // Check each section
        if (userInfo.about && userInfo.about.bio) filledFieldsCount++;
        if (userInfo.experience && userInfo.experience.length > 0) filledFieldsCount++;
        if (userInfo.education && userInfo.education.length > 0) filledFieldsCount++;
        if (userInfo.skills && userInfo.skills.length > 0) filledFieldsCount++;
        if (userInfo.socials && userInfo.socials.length > 0) filledFieldsCount++;
        if (userInfo.achievements && userInfo.achievements.length > 0) filledFieldsCount++;
        if (userInfo.projects && userInfo.projects.length > 0) filledFieldsCount++;
        
        // Add resume as a bonus if present
        if (user?.userDetails?.fileKey) filledFieldsCount++;
        totalFieldsCount++; // Account for resume in total
        
        const completionPercentage = Math.ceil((filledFieldsCount / totalFieldsCount) * 100);
        setCompletion(completionPercentage);
        
        // Set user info from response
        setUserInfo(userInfo);
      } catch (error) {
        // Silently handle 404 errors for new users
        if (error.response && error.response.status === 404) {
          // Set default empty userInfo to prevent rendering errors
          setUserInfo({
            about: {},
            experience: [],
            education: [],
            skills: [],
            socials: [],
            achievements: [],
            projects: []
          });
          setCompletion(0);
        } else {
          // Log actual errors (not 404)
          console.error('Unexpected error fetching user information:', error);
        }
      } finally {
        setIsLoading(prev => ({ ...prev, userInfo: false }));
      }
    };
    
    fetchUserInfo();
  }, [user, setUserInfo]);

  // Improved section scrolling with debounce
  const handleScrollToSection = useCallback((sectionId) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Update active section based on scroll position
  useEffect(() => {
    let isScrolling = false;
    
    const handleScroll = () => {
      if (isScrolling) return;
      
      isScrolling = true;
      
      // Use requestAnimationFrame for better performance
      window.requestAnimationFrame(() => {
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
        
        isScrolling = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to close signup popup properly
  const closeSignUpPopup = (updatedData) => {
    if (updatedData) {
      // Update the userData state with the new data
      setUserData(prev => ({
        ...prev,
        ...updatedData
      }));
      setSignUpPopup(false);
    } else {
      // Original validation logic for cases where no data is passed
      if (userData?.mobileNumber && 
          user?.username && 
          ((userData?.jobTitle && userData?.companyName) || 
          (userData?.desiredIndustry && userData?.educationLevel))) {
        setSignUpPopup(false);
      } else {
        showBottomMessage('Please complete all required profile information first');
      }
    }
  };

  // Handle edit profile button click
  const handleEditClick = () => {
    setShowSignUpForm(true);
  };

  // State for user profile data
  const [userData, setUserData] = useState(null);

  // Fetch user profile data
  useEffect(() => {
    if (!user || !user._id) return;
    
    const fetchData = async () => {
      setIsLoading(prev => ({ ...prev, profile: true }));
      
      try {
        // Make request to get user details
        const experiencedResponse = await publicAxios.get(`/signUpCards/get/${user._id}`);
        setUserData(experiencedResponse.data.userDetails);
      } catch (error) {
        console.error('Error fetching experienced user data:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, profile: false }));
      }
    };
    
    fetchData();
  }, [user]);

  // Main component render
  return (
    <ProfileContextProvider initialState={initialState} reducer={reducer}>
      <>
      <DashboardMenu />
      <div className="dashboard-layout">

        {/* Main container */}
        <div className="dashboard_profile_container">
          {/* Header */}
          <ProfileHeaderWrapper />

          {/* Profile content */}
          <div className="profile-content">
            {/* Left sidebar */}
            <div className="profile-sidebar">
              {/* Profile image and info */}
              <div className="profile-header">
                <div 
                  className="profile-image-container"
                  onClick={handleProfileImageClick}
                  role="button"
                  aria-label="Upload profile picture"
                  tabIndex="0"
                >
                  <ProfileImage isLoggedInUser={true} />
                </div>
                <h1 className="profile-name">{user?.firstName || ''} {user?.lastName || ''}</h1>
                <p className="profile-title">{getLatestExperience()}</p>
                
                {/* Progress bar */}
                <div className="progress-bar-container" role="progressbar" aria-valuenow={completion} aria-valuemin="0" aria-valuemax="100">
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
                      aria-label="Toggle actively seeking job status"
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
                      aria-label="Toggle immediate joiner status"
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
                    {userData?.location ? userData.location : (
                      <span className="popupFormNotFilled" onClick={handleEditClick} role="button" tabIndex="0">
                        Add Location
                      </span>
                    )}
                  </span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">
                    <Image src={emailIcon} alt="Email" width={18} height={18} />
                  </span>
                  <span>{user?.email || 'No email provided'}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">
                    <Image src={phoneIcon} alt="Phone" width={18} height={18} />
                  </span>
                  <span>
                    {userData?.mobileNumber ? (
                      `${userData.mobileNumber}`
                    ) : (
                      <span className="popupFormNotFilled" onClick={handleEditClick} role="button" tabIndex="0">
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
                      aria-label="View resume"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  )}
                </div>
                
                {isLoading.resume ? (
                  <LoadingIndicator size="small" message="Loading resume..." />
                ) : resumeFileUrl ? (
                  <div>
                    <div className="resume-actions">
                      <button 
                        className="resume-button download-button" 
                        onClick={handleDownloadResume} 
                        title="Download Resume"
                        aria-label="Download resume"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="7 10 12 15 17 10"></polyline>
                          <line x1="12" y1="15" x2="12" y2="3"></line>
                        </svg>
                        <span>Download</span>
                      </button>
                      
                      <button 
                        className="resume-button delete-button" 
                        onClick={() => setShowDeleteConfirmation(true)} 
                        title="Delete Resume"
                        aria-label="Delete resume"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="button-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                    
                    {showDeleteConfirmation && (
                      <div className="delete-confirmation" role="alert">
                        <p>Are you sure you want to delete your resume?</p>
                        <div className="delete-confirmation-buttons">
                          <button className="delete-confirm-button" onClick={handleDeleteResume}>Yes</button>
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
                    onDragLeave={handleDragLeave}
                    role="button"
                    tabIndex="0"
                    aria-label="Upload resume"
                  >
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleFileSelect}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept=".pdf"
                      aria-hidden="true"
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
              
              {/* Complete profile CTA button */}
              <div className="complete-profile-cta">
                <button 
                  className={`complete-profile-button ${completion < 50 ? 'complete-profile-button-highlight' : ''}`}
                  onClick={handleEditClick}
                  aria-label="Update your job status"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="button-icon">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span>Update Your Job Status</span>
                </button>
              </div>
              
              {/* Share profile button */}
              <div className="share-profile">
                <button 
                  className="share-button" 
                  onClick={toggleShareOptions}
                  aria-expanded={shareOpen}
                  aria-controls="share-options"
                >
                  <span>Share Profile</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </button>
                
                {shareOpen && (
                  <div className="share-options" id="share-options">
                    <div 
                      className="share-option" 
                      onClick={getLinkedinShareUrl} 
                      title="Share on LinkedIn"
                      role="button"
                      tabIndex="0"
                      aria-label="Share on LinkedIn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#0077B5">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </div>
                    <div 
                      className="share-option" 
                      onClick={handleShareTwitter} 
                      title="Share on Twitter"
                      role="button"
                      tabIndex="0"
                      aria-label="Share on Twitter"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#1DA1F2">
                        <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05 1.883 0 3.616-.636 5.001-1.721-1.771-.037-3.255-1.197-3.767-2.793.249.037.499.062.761.062.361 0 .724-.05 1.061-.137-1.847-.374-3.23-1.995-3.23-3.953v-.05c.537.299 1.16.486 1.82.511-1.086-.722-1.8-1.957-1.8-3.355 0-.748.199-1.434.548-2.032 1.983 2.443 4.964 4.04 8.306 4.215-.062-.3-.1-.599-.1-.898 0-2.168 1.757-3.929 3.93-3.929 1.133 0 2.158.474 2.877 1.234.898-.175 1.747-.499 2.507-.946-.294.932-.92 1.721-1.745 2.22.799-.087 1.571-.299 2.295-.574-.536.799-1.209 1.497-1.995 2.057z"/>
                      </svg>
                    </div>
                    <div 
                      className="share-option" 
                      onClick={handleShareFacebook} 
                      title="Share on Facebook"
                      role="button"
                      tabIndex="0"
                      aria-label="Share on Facebook"
                    >
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
              <nav className="section-nav" aria-label="Profile sections">
                <div className="section-nav-inner">
                  {['about', 'experience', 'education', 'skills', 'social', 'achievements', 'projects'].map(
                    section => (
                      <a 
                        key={section}
                        className={`section-nav-item ${activeSection === section ? 'active' : ''}`}
                        onClick={() => handleScrollToSection(section)}
                        role="button"
                        tabIndex="0"
                        aria-current={activeSection === section ? 'true' : 'false'}
                      >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </a>
                    )
                  )}
                </div>
              </nav>
              
              {isLoading.userInfo ? (
                <LoadingIndicator message="Loading your profile..." />
              ) : (
                <>
                  {/* About section */}
                  <section id="about" className="content-section">
                    <div className="section-header">
                      <div className="section-title">
                        <div className="section-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                        aria-label="Edit about section"
                      >
                        <Image src={editIcon} alt="Edit" width={18} height={18} />
                      </button>
                    </div>
                    
                    {!userInfo?.about?.bio || userInfo?.about?.bio?.length === 0 ? (
                      <p style={{ opacity: 0.4 }}>
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
                            aria-expanded="false"
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                        aria-label="Add experience"
                      >
                        <Image src={addIcon} alt="Add" width={20} height={20} />
                      </button>
                    </div>
                    
                    {!userInfo?.experience || userInfo?.experience?.length === 0 ? (
                      <p style={{ opacity: 0.4 }}>
                        Mention your employment history, including the present
                        and prior companies you have worked for.
                      </p>
                    ) : (
                      <div className="timeline">
                        {userInfo?.experience?.map((experience, index) => (
                          <div className="timeline-item" key={`exp-${experience._id || index}`}>
                            <div className="timeline-dot" aria-hidden="true"></div>
                            <div className="timeline-content">
                              <h3 className="timeline-title">{experience?.jobTitle || 'Untitled Position'}</h3>
                              <p className="timeline-subtitle">
                                {experience?.companyName || ''}
                                {experience?.employmentType && (
                                  <> • {experience?.employmentType}</>
                                )}
                              </p>
                              <p className="timeline-date">
                                {experience?.startMonth?.substr(0, 3) || ''} {experience?.startYear || ''} - 
                                {experience?.currentlyWorking ? ' Present' : ` ${experience?.endMonth?.substr(0, 3) || ''} ${experience?.endYear || ''}`}
                                {!experience?.currentlyWorking && experience?.startYear && experience?.endYear && (
                                  <> • {getTimeDifference(experience)}</>
                                )}
                              </p>
                              
                              {experience?.description?.length > 0 && (
                                <div className="timeline-description">
                                  <ul className={experience?.description?.length > 150 ? 'dashboard_info_hide_text' : ''}>
                                    {experience?.description
                                      .split('\n')
                                      .map((sentence, idx) => (
                                        <li key={`exp-${index}-desc-${idx}`}>{sentence}</li>
                                      ))}
                                  </ul>
                                  
                                  {experience?.description?.length > 150 && (
                                    <button
                                      className="dashboard_info_truncate_btn"
                                      data-status="hide"
                                      onClick={toggleDescription}
                                      aria-expanded="false"
                                    >
                                      Show more
                                    </button>
                                  )}
                                </div>
                              )}
                              
                              {experience?.skills?.length > 0 && (
                                <div className="skill-tags">
                                  {experience?.skills.map((skill, skillIdx) => (
                                    <span className="skill-tag" key={`exp-${index}-skill-${skillIdx}`}>
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
                                aria-label={`Edit ${experience?.jobTitle || 'experience'}`}
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                        aria-label="Add education"
                      >
                        <Image src={addIcon} alt="Add" width={20} height={20} />
                      </button>
                    </div>
                    
                    {!userInfo?.education || userInfo?.education?.length === 0 ? (
                      <p style={{ opacity: 0.4 }}>
                        Fill in your education details (school, college, degree)
                        to strengthen your profile.
                      </p>
                    ) : (
                      <div className="timeline">
                        {userInfo?.education?.map((education, index) => (
                          <div className="timeline-item" key={`edu-${education._id || index}`}>
                            <div className="timeline-dot" aria-hidden="true"></div>
                            <div className="timeline-content">
                              <h3 className="timeline-title">{education?.school || 'School/Institution'}</h3>
                              {education?.degree && (
                                <p className="timeline-subtitle">
                                  {education?.degree}
                                  {education?.fieldOfStudy && (
                                    <>, in {education?.fieldOfStudy}</>
                                  )}
                                </p>
                              )}
                              <p className="timeline-date">
                                {education?.startYear || ''} - {education?.endYear || ''}
                              </p>
                              
                              <button
                                className="item-edit-button"
                                data-subsection={3}
                                data-dataindex={index}
                                onClick={openSectionToEdit}
                                aria-label={`Edit ${education?.school || 'education'}`}
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                        aria-label="Add skills"
                      >
                        <Image src={addIcon} alt="Add" width={20} height={20} />
                      </button>
                    </div>
                    
                    {!userInfo?.skills || userInfo?.skills?.length === 0 ? (
                      <p style={{ opacity: 0.4 }}>
                        Specify details about programming languages (such as
                        Java, Python, C/C++, node.js, SQL etc), softwares
                        (Microsoft Word, Excel, Figma etc) or any other work
                        related skills.
                      </p>
                    ) : (
                      <div className="skills-grid" role="list">
                        {userInfo?.skills?.map((skill, index) => (
                          <div className="skill-card" key={`skill-${index}`} role="listitem">
                            <h3 className="skill-name">{skill || 'Skill'}</h3>
                            <div className="skill-level" role="progressbar" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                        aria-label="Add social links"
                      >
                        <Image src={addIcon} alt="Add" width={20} height={20} />
                      </button>
                    </div>
                    
                    {!userInfo?.socials || userInfo?.socials?.length === 0 ? (
                      <p style={{ opacity: 0.4 }}>
                        Enter the usernames for your LinkedIn, Behance, GitHub,
                        and other profiles.
                      </p>
                    ) : (
                      <div className="social-links" role="list">
                        {userInfo?.socials?.map((social, index) => {
                          // Safely handle URL parsing
                          let hostname = '';
                          try {
                            hostname = new URL(social).hostname.replace('www.', '');
                          } catch (e) {
                            hostname = 'website';
                          }
                          
                          return (
                            <Link 
                              href={social} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              key={`social-${index}`} 
                              className="social-link"
                              role="listitem"
                            >
                              <Image 
                                src={getLinkIcon(social)} 
                                alt="" 
                                width={24} 
                                height={24} 
                                aria-hidden="true"
                              />
                              <span className="social-link-text">{hostname}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </section>
                  
                  {/* Achievements section */}
                  <section id="achievements" className="content-section">
                    <div className="section-header">
                      <div className="section-title">
                        <div className="section-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                        aria-label="Add achievement"
                      >
                        <Image src={addIcon} alt="Add" width={20} height={20} />
                      </button>
                    </div>
                    
                    {!userInfo?.achievements || userInfo?.achievements?.length === 0 ? (
                      <p style={{ opacity: 0.4 }}>
                        Share information about any honors or awards you&apos;ve
                        received. 🏆
                      </p>
                    ) : (
                      <div className="timeline">
                        {userInfo?.achievements?.map((achievement, index) => (
                          <div className="timeline-item" key={`achievement-${achievement._id || index}`}>
                            <div className="timeline-dot" aria-hidden="true"></div>
                            <div className="timeline-content">
                              <h3 className="timeline-title">{achievement?.heading || 'Achievement'}</h3>
                              
                              <div className="timeline-description">
                                {achievement?.description?.length > 0 && (
                                  <ul className={achievement?.description?.length > 150 ? 'dashboard_info_hide_text' : ''}>
                                    {achievement?.description
                                      .split('\n')
                                      .map((sentence, idx) => (
                                        <li key={`achievement-${index}-desc-${idx}`}>{sentence}</li>
                                      ))}
                                  </ul>
                                )}
                                
                                {achievement?.description?.length > 150 && (
                                  <button
                                    className="dashboard_info_truncate_btn"
                                    data-status="hide"
                                    onClick={toggleDescription}
                                    aria-expanded="false"
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
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        viewDocumentInNewTab(achievement.document.key);
                                      }
                                    }}
                                    role="button"
                                    tabIndex="0"
                                    aria-label="View document"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }} aria-hidden="true">
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
                                  <Link 
                                    href={achievement?.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="skill-tag"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }} aria-hidden="true">
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
                                aria-label={`Edit ${achievement?.heading || 'achievement'}`}
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                        aria-label="Add project"
                      >
                        <Image src={addIcon} alt="Add" width={20} height={20} />
                      </button>
                    </div>
                    
                    {!userInfo?.projects || userInfo?.projects?.length === 0 ? (
                      <p style={{ opacity: 0.4 }}>
                        Add details about projects you have done in college,
                        internship or at work.
                      </p>
                    ) : (
                      <div className="timeline">
                        {userInfo?.projects?.map((project, index) => (
                          <div className="timeline-item" key={`project-${project._id || index}`}>
                            <div className="timeline-dot" aria-hidden="true"></div>
                            <div className="timeline-content">
                              <h3 className="timeline-title">{project?.heading || 'Project'}</h3>
                              
                              <div className="timeline-description">
                                {project?.description?.length > 0 && (
                                  <ul className={project?.description?.length > 150 ? 'dashboard_info_hide_text' : ''}>
                                    {project?.description
                                      .split('\n')
                                      .map((sentence, idx) => (
                                        <li key={`project-${index}-desc-${idx}`}>{sentence}</li>
                                      ))}
                                  </ul>
                                )}
                                
                                {project?.description?.length > 150 && (
                                  <button
                                    className="dashboard_info_truncate_btn"
                                    data-status="hide"
                                    onClick={toggleDescription}
                                    aria-expanded="false"
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
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        viewDocumentInNewTab(project.document.key);
                                      }
                                    }}
                                    role="button"
                                    tabIndex="0"
                                    aria-label="View document"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }} aria-hidden="true">
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
                                  <Link 
                                    href={project?.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="skill-tag"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }} aria-hidden="true">
                                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                    </svg>
                                    Link
                                  </Link>
                                )}
                                
                                {project?.skills?.length > 0 && project?.skills.map((skill, skillIdx) => (
                                  <span className="skill-tag" key={`project-${index}-skill-${skillIdx}`}>
                                    {skill}
                                  </span>
                                ))}
                              </div>
                              
                              <button
                                className="item-edit-button"
                                data-subsection={7}
                                data-dataindex={index}
                                onClick={openSectionToEdit}
                                aria-label={`Edit ${project?.heading || 'project'}`}
                              >
                                <Image src={editIcon} alt="Edit" width={18} height={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )}
            </div>
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
        <div className="joining_toggle_message_bg" role="dialog" aria-labelledby="notice-period-dialog-title">
          <div className="joining_toggle_message">
            <h4 id="notice-period-dialog-title">Please confirm your notice period</h4>
            <button
              className="closeFormOptionForPopup_joining_toggle"
              onClick={handlePopupClose}
              aria-label="Close dialog"
            >
              <Image src={crossIcon} alt="close" />
            </button>
            <div className="buttons_for_joining_toggle_message" role="radiogroup" aria-label="Joining options">
              <button
                className={`joining_toggle_message_button ${selectedButton === 'immediateJoiner'
                  ? 'joining_toggle_message_buttonselected'
                  : ''}`}
                onClick={() => handleButtonClick('immediateJoiner')}
                aria-checked={selectedButton === 'immediateJoiner'}
                role="radio"
              >
                Immediate Joiner
              </button>
              <button
                className={`joining_toggle_message_button ${selectedButton === 'noticePeriod'
                  ? 'joining_toggle_message_buttonselected'
                  : ''}`}
                onClick={() => handleButtonClick('noticePeriod')}
                aria-checked={selectedButton === 'noticePeriod'}
                role="radio"
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
                  aria-label="Select notice period end date"
                />
              </div>
            )}
            <button
              className="joining_toggle_message_update_button"
              onClick={handleUpdateButtonClick}
              disabled={!selectedButton}
              aria-label="Update joining status"
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
          closePopUp={closeSignUpPopup}
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
      
      {/* Profile upload dialog - rendered conditionally with proper z-index */}
      {openProfileUploadDialog && (
        <div className="profile-upload-container">
          <ProfileUploadDialog
            setOpenFileUploadDialog={setOpenFileUploadDialog}
          />
        </div>
      )}
      
      <ToastContainer />
    </>
  </ProfileContextProvider>
);
};

// Map of social platform hostnames to their icon components
export const socialIcons = {
  'linkedin.com': linkedInIcon,
  'twitter.com': twitterLogo,
  'github.com': githubLogo,
  'dev.to': devLogo,
  'instagram.com': instagramLogo,
  'facebook.com': facebookLogo,
  'medium.com': mediumLogo,
  'figma.com': figmaLogo,
  'substack.com': substackLogo,
  'tiktok.com': tiktokLogo,
  'twitch.tv': twitchLogo,
  'youtube.com': youtubeLogo,
  'behance.net': behanceLogo,
  'dribbble.com': dribbleLogo,
  'crunchbase.com': crunchbaseLogo,
  'hashnode.com': hashnodeLogo,
  // Default icon for other websites
  'default': otherLinkIcon
};

export default ProfilePage;