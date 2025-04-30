'use client';
/*
 * File: RequestReferral.js
 * Description: Component for handling referral requests in a multi-step form
 * Features:
 * - Three-step form process (Personal Info, Job Details, Resume Upload)
 * - Email verification with OTP
 * - Dynamic job detail entries (add/remove jobs)
 * - Resume upload and validation
 * - Responsive design for mobile and desktop
 */
import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';

// Icons and images
import plusIcon from '@/public/PublicProfile/plusIcon.png';
import deleteIcon from '@/public/PublicProfile/deleteIcon.png';
import greenTick from '@/public/AccountSettings/greenTick.webp';
import secondComer from '@/public/PublicProfile/secondComer.webp';

// Styles
import './RequestReferral.css';

// Context, utils and hooks
import { UserContext } from '@/context/User/UserContext';
import showBottomMessage from '@/Utils/showBottomMessage';
import ProfileImage from '../../_components/Profile/ProfileImage/ProfileImage';
import checkFileExtension from '@/Utils/checkFileExtension';
import checkFileSize from '@/Utils/checkFileSize';
import { publicAxios } from '@/config/axiosInstance';
import usePrivateAxios from '@/Utils/usePrivateAxios';

const RequestReferral = () => {
  const router = useRouter();
  const privateAxios = usePrivateAxios();
  const { username } = useParams();
  const pathname = usePathname();

  // Step-based navigation state
  const [currentStep, setCurrentStep] = useState(1);
  
  // Context and user states
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  // Verification states
  const [otpVerified, setOtpVerified] = useState(false);
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [currId, setCurrId] = useState(0);
  const [isSubmittingReferral, setIsSubmittingReferral] = useState(false);

  // User information states
  const [userInformation, setUserInformation] = useState({
    firstName: '',
    lastName: '',
    message: '',
    email: '',
  });

  // Job details states
  const jobDetails = {
    jobId: '',
    jobUrl: '',
  };
  const [totalJobs, setTotalJobs] = useState([jobDetails]);

  // Form validation error states
  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  // OTP verification states
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [otpSent, setOtpSent] = useState(false);
  const [showOtpSentMessage, setShowOtpSentMessage] = useState(false);
  const [addResendButton, setAddResendButton] = useState(false);
  const [enableResendButton, setEnableResendButton] = useState(true);
  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSpinnerToVerify, setShowSpinnerToVerify] = useState(false);

  // Popup and warning states
  const [showPopup, setShowPopup] = useState(false);
  const [sameUserWarning, setSameUserWarning] = useState(false);
  const [unRegisteredUserId, setUnRegisteredUserId] = useState(null);

  // Professional user data
  const [professionalUserData, setProfessionalUserData] = useState(null);

  // Resume upload states
  const fileInputRef = useRef(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Registered user states
  const [isRegisteredUser, setIsRegisteredUser] = useState(false);
  const [emailOfRegisteredUser, setEmailOfRegisteredUser] = useState('');
  const [registeredUserId, setRegisteredUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Validation functions
   */
  const isEmailValid = (email) => {
    const emailPattern = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return emailPattern.test(email) && email.endsWith('.com');
  };

  const isNameValid = (name) => {
    return name.length > 0 && name.length <= 30;
  };

  const isJobUrlValid = (jobUrl) => {
    const jobUrlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return jobUrlPattern.test(jobUrl);
  };

  const isJobIdValid = (jobId) => {
    const jobIdPattern = /^[A-Za-z0-9_-]+$/;
    return jobIdPattern.test(jobId);
  };

  /**
   * Step navigation functions
   */
  const goToNextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!validateStep1()) return;
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  /**
   * Step validation functions
   */
  const validateStep1 = () => {
    let isValid = true;
    
    if (!user && !otpVerified) {
      if (!isNameValid(userInformation.firstName)) {
        setFirstNameError('First name is required');
        isValid = false;
      }
      
      if (!isNameValid(userInformation.lastName)) {
        setLastNameError('Last name is required');
        isValid = false;
      }
      
      if (!isEmailValid(userInformation.email)) {
        setEmailError('Email is required and must be valid');
        isValid = false;
      }

      if (!otpVerified) {
        showBottomMessage('Please verify your email before proceeding');
        isValid = false;
      }
    }
    
    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    
    // Check if each job has a URL (required field)
    for (let i = 0; i < totalJobs.length; i++) {
      if (!totalJobs[i].jobUrl) {
        showBottomMessage('Please provide a Job URL for all positions');
        isValid = false;
        break;
      } else if (!isJobUrlValid(totalJobs[i].jobUrl)) {
        showBottomMessage('Please provide a valid Job URL for all positions');
        isValid = false;
        break;
      }
    }
    
    return isValid;
  };

  /**
   * Job field error message handler
   */
  function getErrorMessage(inputEle) {
    const parentDiv = inputEle.closest('div');
    const errorContainer = parentDiv.querySelector('.errorMessage');
    const name = inputEle.name;
    const value = inputEle.value;

    if (name === 'jobId') {
      if (value && !isJobIdValid(value)) {
        errorContainer.textContent = 'Job ID is not valid';
      } else {
        errorContainer.textContent = '';
      }
    }
    if (name === 'jobUrl') {
      if (value === '') {
        errorContainer.textContent = 'Job URL is required';
      } else if (!isJobUrlValid(value)) {
        errorContainer.textContent = 'Job URL is not valid';
      } else {
        errorContainer.textContent = '';
      }
    }
  }

  /**
   * Job input handlers
   */
  const handleJobChangeInput = (event, id) => {
    const name = event.target.name;
    const value = event.target.value;

    const updatedJobs = totalJobs.map((job, index) => {
      if (index == id) {
        return { ...job, [name]: value };
      } else {
        return job;
      }
    });
    setTotalJobs(updatedJobs);
    getErrorMessage(event.target);
  };

  const addJobs = (e) => {
    e.preventDefault();
    if (totalJobs.length < 3) {
      setTotalJobs([...totalJobs, jobDetails]);
      setCurrId(totalJobs.length);
    }
  };

  const deleteJob = (id) => {
    const updatedJobs = totalJobs.filter((job, index) => index !== id);
    setTotalJobs(updatedJobs);
    setCurrId(totalJobs.length - 2);
  };

  /**
   * User info input handler
   */
  const handleUserInfoInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    // Validate and set error messages
    if (name === 'email') {
      if (value === '') {
        setEmailError('Email is required');
      } else if (!isEmailValid(value)) {
        setEmailError('Email is not valid');
      } else {
        setEmailError('');
      }
    } else if (name === 'firstName') {
      if (value === '') {
        setFirstNameError('First name is required');
      } else if (!isNameValid(value)) {
        setFirstNameError('First name is invalid');
      } else {
        setFirstNameError('');
      }
    } else if (name === 'lastName') {
      if (value === '') {
        setLastNameError('Last name is required');
      } else if (!isNameValid(value)) {
        setLastNameError('Last name is invalid');
      } else {
        setLastNameError('');
      }
    }

    setUserInformation({ ...userInformation, [name]: value });
  };

  /**
   * OTP handlers
   */
  const handleInputChange = (index, event) => {
    const value = event.target.value;

    // Only allow single numeric digits
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value !== '') {
        if (index < 3) {
          inputRefs[index + 1].current.focus();
        }
      } else {
        if (index > 0) {
          inputRefs[index - 1].current.focus();
        }
      }
    }
    setInvalidOtp(false);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
    setInvalidOtp(false);
  };

  /**
   * Email verification function - sends OTP
   */
  const verifyEmail = async (event) => {
    // Validate inputs first
    if (!isEmailValid(userInformation.email)) {
      return;
    }
    if (!isNameValid(userInformation.firstName)) {
      setFirstNameError('First name is required');
      return;
    }
    if (!isNameValid(userInformation.lastName)) {
      setLastNameError('Last name is required');
      return;
    }

    // Update UI state
    setShowSpinner(true);
    setAddResendButton(true);
    setEnableResendButton(true);
    setIsActive(false);

    try {
      const sendOTP = await publicAxios.post(`/generateCommonOtp/${username}`, {
        email: userInformation.email,
      });
      
      if (sendOTP.status === 200 || event?.key === 'Enter') {
        setShowSpinner(false);
        setIsActive(true);
        setOtpSent(true);
        setShowOtpSentMessage(true);
        
        // Hide "OTP sent" message after 2 seconds
        setTimeout(() => {
          setShowOtpSentMessage(false);
        }, 2000);
        
        // Enable resend button after 60 seconds
        setTimeout(() => {
          setEnableResendButton(false);
          setSeconds(0);
        }, 60000);
      }
    } catch (err) {
      setShowSpinner(false);
      showBottomMessage(err.response.data.message);
      setOtpSent(false);
    }
  };

  /**
   * OTP verification function - verifies entered OTP
   */
  const verifyOTP = async () => {
    setShowSpinnerToVerify(true);
    try {
      const enteredOTP = otp.join('');

      const verifyOTP = await publicAxios.post(`/verifyCommonOtp`, {
        email: userInformation.email,
        enteredOTP: enteredOTP,
      });

      if (verifyOTP.status === 200) {
        const { firstName, lastName, email } = userInformation;
        const unRegisteredData = await publicAxios.post(`/unRegisteredData`, {
          firstName,
          lastName,
          email,
          secondComer: true,
        });
        
        if (unRegisteredData.status === 200) {
          setUnRegisteredUserId(unRegisteredData.data._id);
          setOtpSent(false);
          setOtpVerified(true);
          setInvalidOtp(false);
          setShowSpinnerToVerify(false);
        }
      }
    } catch (err) {
      setInvalidOtp(true);
      setShowSpinnerToVerify(false);
    }
  };

  /**
   * Go to signup function - redirects to signup page
   */
  const goToSignup = () => {
    document.body.style.overflow = 'auto';
    router.push('/sign-up', {
      state: {
        from: `/${username}/request-referral`,
        username: username,
      },
    });
  };

  /**
   * Check for registered user function
   */
  const checkForRegisteredUser = async () => {
    if (user) {
      return;
    }

    try {
      const res = await publicAxios.post(`/checkForRegisteredUser`, {
        email: userInformation.email,
      });

      if (res.status === 200) {
        setIsRegisteredUser(true);
        document.body.style.overflow = 'auto';
        setEmailOfRegisteredUser(res.data.email);
        setRegisteredUserId(res.data._id);
      }
    } catch (err) {
      getUnregisteredUserData();
      setIsRegisteredUser(false);
    }
  };

  /**
   * Check unregistered user data function
   */
  const getUnregisteredUserData = async () => {
    if (user) {
      return;
    }

    try {
      const res = await publicAxios.get(
        `/unRegisteredData?email=${userInformation.email}`
      );

      if (res.status === 200 && res.data.secondComer === true) {
        setShowPopup(true);
        document.body.style.overflow = 'hidden';
        window.scroll({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * File input handler - validates file type and size
   */
  const handleFileInputChange = async (event) => {
    const uploadedFile = event.target.files[0];

    // Check if the file has a valid extension (PDF only)
    const isValidExtension = checkFileExtension(uploadedFile, true);
    if (isValidExtension === false) {
      showBottomMessage('Invalid file type. Only PDF files are accepted');
      event.target.value = '';
      return;
    }

    // Check the size of the file (5MB limit)
    const isValidSize = checkFileSize(uploadedFile);
    if (isValidSize === false) {
      showBottomMessage('File exceeds the limit of 5MB');
      event.target.value = '';
      return;
    }

    setUploadedFileName(uploadedFile.name);
    setResumeUploaded(true);
  };

  /**
   * Resume upload function - handles S3 upload
   */
  async function uploadResume(data) {
    const resume = document.getElementById('resumeUpload').files[0];

    // 1. Fetch a signed URL
    let res = await privateAxios.get(`/file/s3-url-put`, {
      headers: {
        fileContentType: resume.type,
        fileSubType: 'resume',
        fileName: resume.name,
        unRegisteredUserId: data.unRegisteredUserId,
      },
    });

    showBottomMessage('Uploading resume...');

    const { signedUrl, fileName } = res.data;

    // Save the resume in the context for logged-in users
    if (user) {
      setUser({
        ...user,
        resume: fileName,
      });
    }

    // 2. Using the signed URL, upload the file directly to S3
    res = await fetch(signedUrl, {
      method: 'PUT',
      body: resume,
      headers: {
        'Content-Type': resume.type,
        'Content-Disposition': 'inline',
      },
    });

    if (res.status !== 200) {
      throw new Error(`Couldn't upload file. Try again!!`);
    }

    // 3. Send info after successful file upload to the server
    res = await privateAxios.post(
      `/referrals/private/upload-resume?fileName=${fileName}`,
      {},
      {
        headers: {
          fileContentType: resume.type,
          fileSubType: 'resume',
          unRegisteredUserId: data.unRegisteredUserId,
        },
      }
    );
  }

  /**
   * Submit referral request function
   */
  const submitReferralRequest = async () => {
    // Validate resume requirement
    if (!resumeUploaded && !user?.resume) {
      showBottomMessage('Please upload your resume!');
      return;
    }

    // Validate that at least job URL or job ID is provided
    for (let i = 0; i < totalJobs.length; i += 1) {
      const job = totalJobs[i];
      if (!job.jobId && !job.jobUrl) {
        showBottomMessage(
          `Kindly include either the Job ID, Job URL, or both.`
        );
        return;
      }
    }

    // Construct the data to be sent to the API
    const data = {
      jobsAskedForReferral: {
        jobDetails: totalJobs,
        message: userInformation.message,
      },
      professionalUserId: professionalUserData._id,
      unRegisteredUserId: unRegisteredUserId,
    };

    // Network request starts
    setIsSubmittingReferral(true);

    try {
      // Upload the resume to S3 if a new one was selected
      if (resumeUploaded) {
        await uploadResume(data);
      }

      showBottomMessage('Saving data...');

      // Submit referral data to the backend
      const res = await privateAxios.post(`/referrals/private`, data);

      if (res.status === 200) {
        showBottomMessage('Successfully submitted referral request');

        // Deduct a coin for the user if logged in
        if (user) {
          setUser((prevState) => {
            return {
              ...prevState,
              totalCoins: prevState.totalCoins - 1,
            };
          });
        }
      }

      // Network request ends
      setIsSubmittingReferral(false);
      
      // Show success state for a moment before resetting the form
      setTimeout(() => {
        resetForm();
      }, 2000);
    } catch (error) {
      const { data, status } = error.response;

      if (status === 403) {
        showBottomMessage(data.message);
      } else {
        showBottomMessage(`Couldn't submit referral request.`);
      }

      setIsSubmittingReferral(false);
    }
  };
  
  /**
   * Reset form after submission
   */
  const resetForm = () => {
    // Clear the fields and reset other state
    if (user) {
      setUserInformation({
        ...userInformation,
        message: '',
      });
    } else {
      setUserInformation({
        firstName: '',
        lastName: '',
        message: '',
        email: '',
      });

      setOtpVerified(false);
      setIsRegisteredUser(false);
      setUnRegisteredUserId(null);
    }

    setTotalJobs([jobDetails]);
    setOtpSent(false);
    setAddResendButton(false);

    setUploadedFileName('');
    setResumeUploaded(false);
    setCurrentStep(1);

    // Discard the uploaded file
    document.getElementById('resumeUpload').value = '';
  };

  /**
   * Get user via username function - fetches professional's info
   */
  const getUserViaUsername = async () => {
    try {
      const res = await publicAxios.get(`/getUser/${username}`);

      if (res.status === 200) {
        setProfessionalUserData(res.data.user);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      router.push('/page-not-found', { replace: true });
    }
  };

  // Effect to fetch professional's data on mount
  useEffect(() => {
    getUserViaUsername();
  }, []);

  // Effect to check if user is registered when email changes
  useEffect(() => {
    if (isEmailValid(userInformation.email)) {
      checkForRegisteredUser();
    }
  }, [userInformation.email]);

  // Effect to auto-verify OTP when all digits are entered
  useEffect(() => {
    const enteredOTP = otp.join('');
    if (enteredOTP.length === 4) {
      verifyOTP();
    }
  }, [otp]);

  // Effect to handle OTP timer countdown
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => Math.max(0, prevSeconds - 1));
      }, 1000);
    } else {
      clearInterval(interval);
      setSeconds(60);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  // Effect to prefill fields when user is logged in
  useEffect(() => {
    if (user) {
      setUserInformation({
        firstName: user.firstName,
        lastName: user.lastName,
        message: '',
        email: user.email,
      });
      
      // Auto-verify if user is logged in
      setOtpVerified(true);
    }

    // Check if user is trying to request a referral from themselves
    if (user && professionalUserData) {
      if (user._id === professionalUserData._id) {
        setSameUserWarning(true);
      }
    }
  }, [user, professionalUserData]);

  // Check if user can proceed (either logged in or email verified)
  const canProceed = user || otpVerified;

  return (
    <>
      {!isLoading ? (
        <div className={`referral-request-container ${showPopup ? 'blur-background' : ''}`}>
          {/* Header with professional's info */}
          <div className="referral-header">
            <Link href={`/user/${username}`} className="professional-info">
              <div className="professional-avatar">
                <ProfileImage
                  isLoggedInUser={false}
                  otherUser={professionalUserData}
                />
              </div>
              <div className="professional-name">
                <h2>{professionalUserData.firstName} {professionalUserData.lastName}</h2>
                {professionalUserData.currentRole && (
                  <p className="professional-role">{professionalUserData.currentRole}</p>
                )}
              </div>
            </Link>
            <button className="close-button" onClick={() => router.push(`/user/${username}`)}>
              <span>×</span>
            </button>
          </div>

          {/* Main content */}
          <div className="referral-content">
            {/* Progress Steps indicator */}
            <div className="progress-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Your Info</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Job Details</div>
              </div>
              <div className="step-line"></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Resume</div>
              </div>
            </div>

            {/* Warning message if user is same as professional */}
            {sameUserWarning && (
              <div className="same-user-warning">
                <p>You are not permitted to send referrals to your own account.</p>
              </div>
            )}
            
            {/* Warning message if professional is not accepting referrals */}
            {!isLoading && !professionalUserData.isExperienced && (
              <div className="not-accepting-referrals">
                <p>
                  {professionalUserData.firstName} is not accepting referral
                  requests at this moment.
                </p>
              </div>
            )}

            {/* Step content container */}
            <div className="step-content">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="step-form">
                  <h3 className="step-title">Your Information</h3>
                  
                  {/* Login prompt for registered non-logged-in users */}
                  {!user && isRegisteredUser && (
                    <div className="login-prompt">
                      <p>
                        Log in to your account to pre-fill your details and continue
                        with the referral request
                      </p>
                      <Link href={'/log-in'} state={{ from: pathname }}>
                        <button className="login-button">Login</button>
                      </Link>
                    </div>
                  )}
                  
                  {/* Name fields */}
                  <div className="name-fields">
                    <div className="input-group">
                      <label htmlFor="firstName">
                        First Name <span className="required">*</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={userInformation.firstName}
                        onChange={handleUserInfoInput}
                        disabled={isRegisteredUser || otpVerified || user || (!isLoading && !professionalUserData.isExperienced)}
                        className={firstNameError ? 'error' : ''}
                        placeholder="Enter your first name"
                      />
                      {firstNameError && <p className="error-message">{firstNameError}</p>}
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="lastName">
                        Last Name <span className="required">*</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={userInformation.lastName}
                        onChange={handleUserInfoInput}
                        disabled={isRegisteredUser || otpVerified || user || (!isLoading && !professionalUserData.isExperienced)}
                        className={lastNameError ? 'error' : ''}
                        placeholder="Enter your last name"
                      />
                      {lastNameError && <p className="error-message">{lastNameError}</p>}
                    </div>
                  </div>
                  
                  {/* Email with verification */}
                  <div className="input-group full-width">
                    <label htmlFor="email">
                      Email <span className="required">*</span>
                    </label>
                    <div className="email-verification">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={userInformation.email}
                        onChange={handleUserInfoInput}
                        onKeyPress={(e) => e.key === 'Enter' && verifyEmail(e)}
                        disabled={isRegisteredUser || otpVerified || user || (!isLoading && !professionalUserData.isExperienced)}
                        className={emailError ? 'error' : ''}
                        placeholder="Enter your email address"
                      />
                      
                      {!isRegisteredUser && !user && !addResendButton && !otpVerified && (
                        <button
                          onClick={verifyEmail}
                          disabled={!isEmailValid(userInformation.email) || !isLoading && !professionalUserData.isExperienced}
                          className="verify-button"
                        >
                          {showSpinner ? <ClipLoader size={12} color="#fff" /> : 'Verify'}
                        </button>
                      )}
                      
                      {(isRegisteredUser || user || (addResendButton && otpVerified)) && (
                        <button className="verified-button">
                          Verified
                        </button>
                      )}
                      
                      {addResendButton && !otpVerified && (
                        <button
                          className="resend-button"
                          disabled={enableResendButton}
                          onClick={verifyEmail}
                        >
                          {showSpinner ? <ClipLoader size={12} color="#fff" /> : `Resend ${seconds > 0 ? `(${seconds}s)` : ''}`}
                        </button>
                      )}
                    </div>
                    {emailError && <p className="error-message">{emailError}</p>}
                  </div>
                  
                  {/* OTP input section */}
                  {otpSent && (
                    <div className="otp-container">
                      <p className="otp-title">Enter the verification code sent to your email</p>
                      <div className="otp-inputs">
                        {inputRefs.map((ref, index) => (
                          <input
                            key={index}
                            ref={ref}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={otp[index]}
                            onChange={(e) => handleInputChange(index, e)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={invalidOtp ? 'error' : ''}
                          />
                        ))}
                        {showSpinnerToVerify && (
                          <div className="otp-loader">
                            <ClipLoader size={12} color="#0057B1" />
                          </div>
                        )}
                      </div>
                      {showOtpSentMessage && (
                        <div className="otp-sent-message">
                          <p>OTP sent to email</p>
                          <Image src={greenTick} alt="otp sent successfully" width={16} height={16} />
                        </div>
                      )}
                      <p className="otp-timer">Valid for {seconds} seconds</p>
                      {invalidOtp && <p className="error-message">Invalid OTP. Please try again.</p>}
                    </div>
                  )}
                  
                  {/* Step navigation */}
                  <div className="step-navigation">
                    <div></div> {/* Empty div for flex spacing */}
                    <button 
                      className="next-button"
                      onClick={goToNextStep}
                      disabled={!canProceed || sameUserWarning || (!isLoading && !professionalUserData.isExperienced)}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 2: Job Details */}
              {currentStep === 2 && (
                <div className="step-form">
                  <h3 className="step-title">Job Details</h3>
                  <p className="step-description">
                    Add job details for the position you&apos;d like a referral for
                  </p>
                  
                  <div className="job-details-container">
                    {totalJobs.map((job, id) => (
                      <div key={id} className="job-detail">
                        <div className="job-fields">
                          <div className="input-group">
                            <label htmlFor={`jobId-${id}`}>Job ID (Optional)</label>
                            <input
                              id={`jobId-${id}`}
                              type="text"
                              name="jobId"
                              value={job.jobId}
                              onChange={(e) => handleJobChangeInput(e, id)}
                              disabled={(!otpVerified && !user) || !professionalUserData.isExperienced}
                              placeholder="Enter job ID if available"
                            />
                            <p className="error-message errorMessage">&nbsp;</p>
                          </div>
                          
                          <div className="input-group">
                            <label htmlFor={`jobUrl-${id}`}>
                              Job URL <span className="required">*</span>
                            </label>
                            <input
                              id={`jobUrl-${id}`}
                              type="text"
                              name="jobUrl"
                              value={job.jobUrl}
                              onChange={(e) => handleJobChangeInput(e, id)}
                              disabled={(!otpVerified && !user) || !professionalUserData.isExperienced}
                              placeholder="Paste the job URL from company website"
                              required
                            />
                            <p className="error-message errorMessage">{!job.jobUrl ? 'Job URL is required' : ''}</p>
                          </div>
                        </div>
                        
                        {/* Delete/Add job buttons */}
                        <div className="job-actions">
                          {totalJobs.length > 1 && (
                            <button
                              className="delete-job"
                              onClick={() => deleteJob(id)}
                              disabled={(!otpVerified && !user) || !professionalUserData.isExperienced}
                            >
                              <Image
                                src={deleteIcon}
                                alt="Remove job"
                                width={16}
                                height={16}
                              />
                            </button>
                          )}
                          
                          {totalJobs.length < 3 && id === totalJobs.length - 1 && (
                            <button
                              className="add-job"
                              onClick={addJobs}
                              disabled={(!otpVerified && !user) || !professionalUserData.isExperienced}
                            >
                              <Image
                                src={plusIcon}
                                alt="Add job"
                                width={16}
                                height={16}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="job-hint">
                    <p>
                      Please visit the career site of the company to discover the job you&apos;d like 
                      to be referred for. After finding the job of interest, copy the URL and 
                      insert it in the field above.
                    </p>
                  </div>
                  
                  {/* Message field */}
                  <div className="input-group full-width">
                    <label htmlFor="message">Add a message (Optional)</label>
                    <textarea
                      id="message"
                      name="message"
                      value={userInformation.message}
                      onChange={handleUserInfoInput}
                      disabled={(!otpVerified && !user) || !professionalUserData.isExperienced}
                      placeholder="Feel free to expand on your requirements by adding a message"
                      maxLength={300}
                    ></textarea>
                    <p className="char-count">Max 300 characters</p>
                  </div>
                  
                  {/* Step navigation */}
                  <div className="step-navigation">
                    <button 
                      className="back-button"
                      onClick={goToPrevStep}
                    >
                      Back
                    </button>
                    <button 
                      className="next-button"
                      onClick={goToNextStep}
                      disabled={sameUserWarning || (!isLoading && !professionalUserData.isExperienced)}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
              
              {/* Step 3: Resume Upload */}
              {currentStep === 3 && (
                <div className="step-form">
                  <h3 className="step-title">Upload Your Resume</h3>
                  <p className="step-description">
                    Upload your current resume for the referrer to view
                  </p>
                  
                  <div className="resume-upload-container">
                    <input
                      id="resumeUpload"
                      type="file"
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={handleFileInputChange}
                      ref={fileInputRef}
                    />
                    
                    <div 
                      className={`resume-dropzone ${resumeUploaded || (user && user.resume) ? 'has-file' : ''}`}
                      onClick={() => (!isSubmittingReferral && canProceed && professionalUserData.isExperienced) && fileInputRef.current.click()}
                    >
                      {!(resumeUploaded || (user && user.resume)) ? (
                        <>
                          <div className="upload-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M16 16L12 12M12 12L8 16M12 12V21M20 16.7428C21.2215 15.734 22 14.2079 22 12.5C22 9.46243 19.5376 7 16.5 7C16.2815 7 16.0771 6.886 15.9661 6.69774C14.6621 4.48484 12.2544 3 9.5 3C5.35786 3 2 6.35786 2 10.5C2 12.5661 2.83545 14.4371 4.18695 15.7935" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="upload-text">
                            {canProceed ? 'Drag & drop your resume here or click to browse' : 'Please complete previous steps first'}
                          </p>
                          <p className="upload-hint">PDF format, max 5MB</p>
                        </>
                      ) : (
                        <>
                          <div className="file-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7 21C5.89543 21 5 20.1046 5 19V3C5 1.89543 5.89543 1 7 1H14L19 6V19C19 20.1046 18.1046 21 17 21H7Z" stroke="#0057B1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M19 6H14V1" stroke="#0057B1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 13H16" stroke="#0057B1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 17H16" stroke="#0057B1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M8 9H16" stroke="#0057B1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <p className="file-name">
                            {uploadedFileName || (user && user.resume ? 'Your resume is uploaded' : '')}
                          </p>
                          <button 
                            className="replace-file"
                            onClick={(e) => {
                              e.stopPropagation();
                              canProceed && professionalUserData.isExperienced && fileInputRef.current.click();
                            }}
                            disabled={isSubmittingReferral}
                          >
                            Replace
                          </button>
                        </>
                      )}
                    </div>
                    
                    <p className="resume-required">
                      <span className="required">*</span> Required
                    </p>
                  </div>
                  
                  {/* Step navigation */}
                  <div className="step-navigation">
                    <button 
                      className="back-button"
                      onClick={goToPrevStep}
                      disabled={isSubmittingReferral}
                    >
                      Back
                    </button>
                    <button 
                      className="submit-button"
                      onClick={submitReferralRequest}
                      disabled={
                        isSubmittingReferral || 
                        sameUserWarning || 
                        (!resumeUploaded && !user?.resume) || 
                        (!isLoading && !professionalUserData.isExperienced)
                      }
                    >
                      {isSubmittingReferral ? (
                        <ClipLoader size={16} color="#fff" />
                      ) : (
                        'Submit Request'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="loading-container">
          <ClipLoader size={30} />
        </div>
      )}

      {/* Second Comer Popup - Shown when user has exceeded free requests */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <div className="popup-header">
              <h2>Oops!</h2>
              <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
            </div>
            
            <div className="popup-body">
              <div className="popup-image">
                <Image src={secondComer} alt="signup to continue" />
              </div>
              
              <p>
                It looks like you&apos;re ready to take the next step in your
                career journey by seeking more referrals.
              </p>
              <p>
                But, you have exceeded the number of times you can send a
                referral request with the same email ID.
              </p>
              <p className="popup-highlight">
                Sign Up on Nectworks to send more.
              </p>
              
              <button className="signup-button" onClick={goToSignup}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RequestReferral;