'use client';
/*
    File - RequestReferral.js
    Desc - This file is likely related to job searching and referral requests.
    It handles user input validation, OTP verification, and the submission
    of referral requests. Additionally, it displays modals and popups
    to communicate with the user.
*/
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import deleteIcon from '@/public/PublicProfile/deleteIcon.png';
import dashedInsideCircle from '@/public//PublicProfile/dashedInsideCircle.png';
import plusIcon from '@/public/PublicProfile/plusIcon.png';
import greenTick from '@/public/AccountSettings/greenTick.webp';
import crossIcon from '@/public/PublicProfile/crossIcon.svg';
import secondComer from '@/public/PublicProfile/secondComer.webp';
import './RequestReferral.css';
import ClipLoader from 'react-spinners/ClipLoader';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { UserContext } from '@/context/User/UserContext';
import showBottomMessage from '@/Utils/showBottomMessage';
import defaultProfile from '@/public/Profile/defaultProfile.webp';
import ProfileImage from '../../_components/Profile/ProfileImage/ProfileImage';
import checkFileExtension from '@/Utils/checkFileExtension';
import checkFileSize from '@/Utils/checkFileSize';
import { publicAxios } from '@/config/axiosInstance';
import usePrivateAxios from '@/Utils/usePrivateAxios';

const RequestReferral = (props) => {
  const router = useRouter();

  const privateAxios = usePrivateAxios();

  // get username from the url
  const { username } = useParams();
  const pathname = usePathname();

  const [otpVerified, setOtpVerified] = useState(false);
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [currId, setCurrId] = useState(0);

  // used to display a loader, when there is a network request
  const [isSubmittingReferral, setIsSubmittingReferral] = useState(false);

  // get the loggedin user from context
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  // stores information of the seeker, if the seeker is loggedin, prefill the fields.
  const [userInformation, setUserInformation] = useState({
    firstName: '',
    lastName: '',
    message: '',
    email: '',
  });

  // object representing each job detail
  const jobDetails = {
    jobId: '',
    jobUrl: '',
  };

  /* state to store all the jobs the seeker is asking referral for.
  each object will have structure similar to 'jobDetails' above */
  const [totalJobs, setTotalJobs] = useState([jobDetails]);

  // state to store and display errors in input fields
  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  // state required to send and verify otp to verify email address.
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

  /* decides the popup displayed when unRegisteredUser visits the
    page for more than once */
  const [showPopup, setShowPopup] = useState(false);

  // indicates if the seeker and professional are the same
  const [sameUserWarning, setSameUserWarning] = useState(false);

  // stores id if the user is unregistered.
  const [unRegisteredUserId, setUnRegisteredUserId] = useState(null);

  // stores information of the professional
  const [professionalUserData, setProfessionalUserData] = useState(null);

  // state to handle resume upload
  const fileInputRef = useRef(null);
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Function to check if the email is valid
  const isEmailValid = (email) => {
    const emailPattern = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return emailPattern.test(email) && email.endsWith('.com');
  };

  // Function to check if the firstName/ lastName length is valid
  const isNameValid = (name) => {
    return name.length > 0 && name.length <= 30;
  };

  // Function to check if the job url is valid
  const isJobUrlValid = (jobUrl) => {
    // Regular expression for a basic URL validation
    const jobUrlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return jobUrlPattern.test(jobUrl);
  };

  const isJobIdValid = (jobId) => {
    // You can define your validation criteria here
    const jobIdPattern = /^[A-Za-z0-9_-]+$/;
    return jobIdPattern.test(jobId);
  };

  // function to get error message for each input in job details.
  function getErrorMessage(inputEle) {
    /* for each 'input' element, get the closest 'errorContainer'
      to display error messages */
    const parentDiv = inputEle.closest('div');
    const errorContainer = parentDiv.querySelector('.errorMessage');
    const name = inputEle.name;
    const value = inputEle.value;

    if (name === 'jobId') {
      if (value === '') {
        errorContainer.textContent = 'Job id is required';
      } else if (!isJobIdValid(value)) {
        errorContainer.textContent = 'Job id is not valid';
      } else {
        errorContainer.textContent = '';
      }
    }
    if (name === 'jobUrl') {
      if (value === '') {
        errorContainer.textContent = 'Job url is required';
      } else if (!isJobUrlValid(value)) {
        errorContainer.textContent = 'Job url is not valid';
      } else {
        errorContainer.textContent = '';
      }
    }
  }

  // function to update a job details in the existing jobs.
  const handleJobChangeInput = (event, id) => {
    const name = event.target.name;
    const value = event.target.value;

    // at the right index, update the appropriate field
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

  // function to add new job details to existing jobs.
  const addJobs = (e) => {
    e.preventDefault();
    if (totalJobs.length < 3) {
      setTotalJobs([...totalJobs, jobDetails]);
      setCurrId(totalJobs.length);
    } else {
      return;
    }
  };

  // function to delete a job from 'totalJobs'
  const deleteJob = (id) => {
    const updatedJobs = totalJobs.filter((job, index) => index !== id);
    setTotalJobs(updatedJobs);
    setCurrId(totalJobs.length - 2);
  };

  const handleUserInfoInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === 'email') {
      if (value === '') {
        setEmailError('Email id is required');
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

  const handleInputChange = (index, event) => {
    const value = event.target.value;

    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

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

  // function to verify email entered by the user
  const verifyEmail = async (event) => {
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

    setShowSpinner(true);
    setAddResendButton(true);
    setEnableResendButton(true);
    setIsActive(false);

    try {
      const sendOTP = await publicAxios.post(`/generateCommonOtp/${username}`, {
        email: userInformation.email,
      });
      if (sendOTP.status === 200 || event.key === 'Enter') {
        setShowSpinner(false);
        setIsActive(true);
        setOtpSent(true);
        setShowOtpSentMessage(true);
        setTimeout(() => {
          setShowOtpSentMessage(false);
        }, 2000);
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

  // function to verify the otp entered by the user if they are unregistered
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

  /* function to redirect user to sign-up page, if they are not registered
    and requesting referral for the second time */
  const goToSignup = () => {
    document.body.style.overflow = 'auto';
    router.push('/sign-up', {
      state: {
        from: `/request-referral/${username}`,
        username: username,
      },
    });
  };

  const [isRegisteredUser, setIsRegisteredUser] = useState(false);
  const [firstNameOfRegisteredUser, setFirstNameOfRegisteredUser] =
    useState('');
  const [lastNameOfRegisteredUser, setLastNameOfRegisteredUser] = useState('');
  const [emailOfRegisteredUser, setEmailOfRegisteredUser] = useState('');
  const [registeredUserId, setRegisteredUserId] = useState(null);

  // function to check if the user is registered or not.
  const checkForRegisteredUser = useCallback(async () => {
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

        // setFirstNameOfRegisteredUser(res.data.firstName);
        // setLastNameOfRegisteredUser(res.data.lastName);
        setEmailOfRegisteredUser(res.data.email);
        setRegisteredUserId(res.data._id);
      }
    } catch (err) {
      getUnregisteredUserData();

      // if the user is not registered, check if he has already visited once
      setIsRegisteredUser(false);
    }
  }, [getUnregisteredUserData, user, userInformation.email]);

  /* check if the user with the entered email already used their free
    referral without registration, if yes display the popup */
  const getUnregisteredUserData = useCallback(async () => {
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
          top: 0, // Scroll to the top (y-coordinate = 0).
          left: 0, // Scroll to the left edge (x-coordinate = 0).
          behavior: 'smooth',
          // Use smooth scrolling animation for a nicer user experience.
        });
      }
    } catch (err) {
      console.log(err);
    }
  }, [user, userInformation.email]);

  // this function is an event handler for file input
  const handleFileInputChange = async (event) => {
    const uploadedFile = event.target.files[0];

    // check if the file has a valid extension
    const isValidExtension = checkFileExtension(uploadedFile, true);

    // if the extension is not valid, display the message and discard the file
    if (isValidExtension === false) {
      showBottomMessage('Invalid file type. Only pdf accepted');

      // clear the file input
      event.target.value = '';
      return;
    }

    // check the size of the file
    const isValidSize = checkFileSize(uploadedFile);

    // if the file size is more than the limit, display the message and discard the file
    if (isValidSize === false) {
      showBottomMessage('File exceeds limit of 5MB');

      // clear the file input
      event.target.value = '';
      return;
    }

    setUploadedFileName(uploadedFile.name);
    setResumeUploaded(true);
  };

  // function to upload resume
  async function uploadResume(data) {
    const resume = document.getElementById('resumeUpload').files[0];

    // (1). Fetch a signed url
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

    // save the resume in the context

    if (user) {
      setUser({
        ...user,
        resume: fileName,
      });
    }

    // (2). Using the signed url upload the file directly to s3
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

    // (3). Send info after successful file upload to the server
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

  // function to submit the referrals request
  const submitReferralRequest = async () => {
    if (!resumeUploaded && !user?.resume) {
      showBottomMessage('Please upload your resume!');
      return;
    }

    // if jobId and job url is not provided at any entry, show error message
    for (let i = 0; i < totalJobs.length; i += 1) {
      const job = totalJobs[i];

      if (!job.jobId && !job.jobUrl) {
        showBottomMessage(
          `Kindly include either the Job ID, Job URL, or both.`
        );
        return;
      }
    }

    // construct the data to be sent to the API
    const data = {
      jobsAskedForReferral: {
        jobDetails: totalJobs,
        message: userInformation.message,
      },
      professionalUserId: professionalUserData._id,
      unRegisteredUserId: unRegisteredUserId,
    };

    /*
      3 types of user can access this page:
      (1). unregistered users
      (2). registered users (and logged in)
      (3). registered users (but not logged in)
    */

    // network request starts
    setIsSubmittingReferral(true);

    try {
      // upload the resume to s3 and save infor in server
      if (resumeUploaded) {
        await uploadResume(data);
      }

      showBottomMessage('Saving data...');

      // submit other data to the backend
      const res = await privateAxios.post(`/referrals/private`, data);

      if (res.status === 200) {
        showBottomMessage('Successfully submitted referral request');

        // deduct a coin for the user
        if (user) {
          setUser((prevState) => {
            return {
              ...prevState,
              totalCoins: prevState.totalCoins - 1,
            };
          });
        }
      }

      // network request ends
      setIsSubmittingReferral(false);
    } catch (error) {
      const { data, status } = error.response;

      if (status === 403) {
        showBottomMessage(data.message);
      } else {
        showBottomMessage(`Couldn't submit referral request.`);
      }

      setIsSubmittingReferral(false);
    }

    // clear the fields and reset other state.
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

    // discard the uploaded file.
    document.getElementById('resumeUpload').value = '';
  };

  const [isLoading, setIsLoading] = useState(true);
  // function to fetch user information based on the 'username'
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

  // get professional's basic information based on the 'username' in the URL
  useEffect(() => {
    getUserViaUsername();
  }, []);

  // check if the user is registered or not after they enter a valid email
  useEffect(() => {
    if (isEmailValid(userInformation.email)) {
      checkForRegisteredUser();
    }
  }, [checkForRegisteredUser, userInformation.email]);

  // when user is entering otp, verify as soon as they enter 4 characters.
  useEffect(() => {
    const enteredOTP = otp.join('');
    if (enteredOTP.length === 4) {
      verifyOTP();
    }
  }, [otp]);

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

  useEffect(() => {
    // prefill the fields if the user is already logged in
    if (user) {
      setUserInformation({
        firstName: user.firstName,
        lastName: user.lastName,
        message: '',
        email: user.email,
      });
    }

    /* if the logged in user and the profile of the professional is
    same, display a popup and redirect the user */
    if (user && professionalUserData) {
      if (user._id === professionalUserData._id) {
        setSameUserWarning(true);
      }
    }
  }, [user, professionalUserData]);

  return (
    <>
      {!isLoading ? (
        <div
          className={`referralRequestModal 
      ${showPopup ? 'makeBgBlur' : ''}`}
        >
          <div className="referralRequestHeader">
            <div className="backToPublicProfile">
              <Link href={`/user/${username}`} className="linkToPublicProfile">
                {/* <Image src={defaultProfile} alt="logo" /> */}
                <ProfileImage
                  isLoggedInUser={false}
                  otherUser={professionalUserData}
                />
                <p>
                  {professionalUserData.firstName}{' '}
                  {professionalUserData.lastName}
                </p>
              </Link>
            </div>
          </div>
          <div className="referralRequestHeaderDesc">
            <h3 style={{ color: '#0057B1' }}>Have a Job ID?</h3>
            <p>Share your basic details along with your job ID or job URL</p>
          </div>
          <div className="referralRequestDesc">
            <div className="referralRequestDetails">
              {isLoading ? (
                <ClipLoader size={12} />
              ) : (
                !professionalUserData.isExperienced && (
                  <div className="notHavingProfessionalDetails">
                    <p>
                      {professionalUserData.firstName} is not accepting referral
                      requests at this moment.
                    </p>
                  </div>
                )
              )}
              <div
                className={`firstNameAndLastName 
              ${
                !isLoading && !professionalUserData.isExperienced
                  ? 'makeTextFade'
                  : ''
              }`}
              >
                <div className="firstName">
                  <label htmlFor="firstName">
                    First Name&nbsp;
                    <span style={{ color: '#F00' }}>*</span>
                  </label>
                  <input
                    disabled={
                      isRegisteredUser ||
                      otpVerified ||
                      user ||
                      (!isLoading && !professionalUserData.isExperienced)
                    }
                    className={`${
                      !isLoading && !professionalUserData.isExperienced
                        ? 'makeInputFade'
                        : ''
                    } ${otpVerified ? 'makeBgNone' : ''} `}
                    type="text"
                    name="firstName"
                    value={
                      isRegisteredUser
                        ? firstNameOfRegisteredUser
                        : userInformation.firstName
                    }
                    onChange={handleUserInfoInput}
                  />
                  {firstNameError ? (
                    <p className="errorMessage">{firstNameError}</p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </div>

                <div className="lastName">
                  <label htmlFor="lastName">
                    Last Name <span style={{ color: '#F00' }}>*</span>
                  </label>
                  <input
                    disabled={
                      isRegisteredUser ||
                      otpVerified ||
                      user ||
                      (!isLoading && !professionalUserData.isExperienced)
                    }
                    className={`${
                      !isLoading && !professionalUserData.isExperienced
                        ? 'makeInputFade'
                        : ''
                    } ${otpVerified ? 'makeBgNone' : ''}`}
                    type="text"
                    name="lastName"
                    value={
                      isRegisteredUser
                        ? lastNameOfRegisteredUser
                        : userInformation.lastName
                    }
                    onChange={handleUserInfoInput}
                  />
                  {lastNameError ? (
                    <p className="errorMessage">{lastNameError}</p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </div>
              </div>

              <div
                className={`emailDetailsAndUploadResume 
            ${
              !isLoading && !professionalUserData.isExperienced
                ? 'makeTextFade'
                : ''
            }`}
              >
                <label htmlFor="">
                  Email <span style={{ color: '#F00' }}>*</span>
                </label>
                <div className="emailDetailsAndUploadResumeInput">
                  <input
                    className={`${
                      !isLoading && !professionalUserData.isExperienced
                        ? 'makeInputFade'
                        : ''
                    }`}
                    onKeyPress={verifyEmail}
                    disabled={
                      isRegisteredUser ||
                      otpVerified ||
                      user ||
                      (!isLoading && !professionalUserData.isExperienced)
                    }
                    name="email"
                    value={
                      isRegisteredUser
                        ? emailOfRegisteredUser
                        : userInformation.email
                    }
                    onChange={handleUserInfoInput}
                    type="text"
                  />

                  {!isRegisteredUser &&
                    !user &&
                    !addResendButton &&
                    !otpVerified && (
                      <button
                        className={`${
                          !isEmailValid(userInformation.email)
                            ? 'cursorDefaultOfVerifyButton'
                            : ''
                        }`}
                        onClick={verifyEmail}
                      >
                        {showSpinner ? <ClipLoader size={12} /> : 'Verify'}
                      </button>
                    )}

                  {(isRegisteredUser ||
                    user ||
                    (addResendButton && otpVerified)) && (
                    <button
                      disabled={otpVerified}
                      className={`${
                        isRegisteredUser || otpVerified || user
                          ? 'makeButtonGreenColor'
                          : ''
                      }`}
                    >
                      Verified
                    </button>
                  )}

                  {addResendButton && !otpVerified && (
                    <button
                      className={`${enableResendButton ? 'disableButton' : ''}`}
                      disabled={enableResendButton}
                      onClick={verifyEmail}
                    >
                      {showSpinner ? <ClipLoader size={12} /> : 'Resend'}
                    </button>
                  )}
                </div>
                {emailError ? (
                  <p className="errorMessage">{emailError}</p>
                ) : (
                  <p className="errorMessage">&nbsp;</p>
                )}
              </div>

              {/* Login prompt */}
              {!user && isRegisteredUser && (
                <div className="loginPrompt">
                  <p>
                    Log in to your account to pre-fill your details and continue
                    with the referral request
                  </p>
                  {/* Send the current location to 'login' page */}
                  <Link href={'/log-in'} state={{ from: pathname }}>
                    <button>Login</button>
                  </Link>
                </div>
              )}

              {/* display this message when the seeker and professional are the same users */}
              {sameUserWarning && (
                <p className="sameUserWarningMessage">
                  You are not permitted to send referrals to your own account.
                </p>
              )}

              {otpSent && (
                <div className="otpInputsInRequestReferral">
                  <div className="otpInputs">
                    {inputRefs.map((ref, index) => (
                      <input
                        className={`${invalidOtp ? 'makeBgRed' : ''}`}
                        key={index}
                        ref={ref}
                        type="text"
                        value={otp[index]}
                        onChange={(e) => handleInputChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength={1}
                      />
                    ))}
                    {showSpinnerToVerify && (
                      <div style={{ marginLeft: '5px' }}>
                        <ClipLoader size={12} />
                      </div>
                    )}
                  </div>
                  {showOtpSentMessage && (
                    <div className="otpSentInfo">
                      <p>OTP sent to email</p>
                      <Image src={greenTick} alt="otp sent successfully" />
                    </div>
                  )}
                  <p style={{ marginTop: '10px', fontSize: '14px' }}>
                    Valid for {seconds} seconds
                  </p>
                </div>
              )}

              {sameUserWarning === false && (
                <Fragment>
                  {/* container to enter job details */}
                  <div className="jobDescriptionForReferral">
                    <p>
                      Add a job ID and the respective job URL for the referrer
                      to find the position at their company portal. Keep job ID
                      empty if it is not available.
                    </p>
                    {totalJobs.map((ele, id) => {
                      return (
                        <div key={id} className="jobDescription">
                          <div className="jobIdDesc">
                            <label
                              className={`${
                                !isLoading &&
                                !professionalUserData.isExperienced
                                  ? 'makeTextFade'
                                  : ''
                              }`}
                              htmlFor=""
                            >
                              Job ID
                            </label>
                            <input
                              className={`${
                                !isLoading &&
                                !professionalUserData.isExperienced
                                  ? 'makeInputFade'
                                  : ''
                              }`}
                              disabled={
                                (!otpVerified && !user) ||
                                !professionalUserData.isExperienced
                              }
                              type="text"
                              name="jobId"
                              value={ele.jobId}
                              onChange={(event) =>
                                handleJobChangeInput(event, id)
                              }
                            />
                            <p className="errorMessage">&nbsp;</p>
                          </div>

                          <button className="copyJobIdButton">
                            <Image
                              style={{ width: '19px', height: '11.601px' }}
                              src={dashedInsideCircle}
                              alt="job details"
                            />
                          </button>

                          <div className="jobUrlDesc">
                            <label
                              className={`${
                                !isLoading &&
                                !professionalUserData.isExperienced
                                  ? 'makeTextFade'
                                  : ''
                              }`}
                            >
                              Job URL
                            </label>
                            <input
                              className={`${
                                !isLoading &&
                                !professionalUserData.isExperienced
                                  ? 'makeInputFade'
                                  : ''
                              }`}
                              disabled={
                                (!otpVerified && !user) ||
                                !professionalUserData.isExperienced
                              }
                              type="text"
                              name="jobUrl"
                              value={ele.jobUrl}
                              onChange={(event) =>
                                handleJobChangeInput(event, id)
                              }
                            />
                            <p className="errorMessage">&nbsp;</p>
                          </div>

                          {currId === id ? (
                            id !== 2 ? (
                              <button
                                className={`addJobForReferral
                            ${!otpVerified && !user ? 'cursorDefault' : ''}`}
                                disabled={!otpVerified && !user}
                                onClick={addJobs}
                              >
                                <Image
                                  src={plusIcon}
                                  alt="add another job details"
                                />
                              </button>
                            ) : (
                              <button
                                className={`addJobForReferral 
                            ${!otpVerified && !user ? 'cursorDefault' : ''}`}
                                disabled={!otpVerified && !user}
                                onClick={() => deleteJob(id)}
                              >
                                <Image
                                  src={deleteIcon}
                                  alt="delete job details"
                                />
                              </button>
                            )
                          ) : (
                            <button
                              className={`addJobForReferral 
                            ${!otpVerified && !user ? 'cursorDefault' : ''}`}
                              disabled={!otpVerified && !user}
                              onClick={() => deleteJob(id)}
                            >
                              <Image
                                src={deleteIcon}
                                alt="delete job details"
                              />
                            </button>
                          )}
                        </div>
                      );
                    })}

                    <p>
                      {' '}
                      Please visit the career site of the company to discover
                      the job you&apos;d like to be referred for. After finding
                      the job of interest, kindly copy the URL and insert it in
                      the designated area here.
                    </p>
                  </div>

                  {/* container enter the message to the professional */}
                  <div className="messageDetails">
                    <label
                      className={`${
                        !isLoading && !professionalUserData.isExperienced
                          ? 'makeTextFade'
                          : ''
                      }`}
                    >
                      Add a message
                    </label>

                    <textarea
                      className={`${
                        !isLoading && !professionalUserData.isExperienced
                          ? 'makeInputFade'
                          : ''
                      }`}
                      disabled={
                        (!otpVerified && !user) ||
                        !professionalUserData.isExperienced
                      }
                      style={{ resize: 'none' }}
                      name="message"
                      value={userInformation.message}
                      onChange={handleUserInfoInput}
                      maxLength={400}
                      cols="30"
                      rows="10"
                      placeholder="Feel free to expand on your requirements by adding a message (Max. 300 characters)"
                    ></textarea>
                  </div>

                  {/* Upload resume section */}
                  <div className="uploadResume">
                    <div className="uploadResumeSection">
                      <div className="uploadResumeButton">
                        <input
                          id="resumeUpload"
                          type="file"
                          accept=".pdf" // Set accepted file types here
                          style={{ display: 'none' }}
                          onInput={handleFileInputChange}
                          ref={fileInputRef}
                        />

                        <button
                          className={`${
                            (!isLoading &&
                              !professionalUserData.isExperienced) ||
                            (user && user.resume && !uploadedFileName)
                              ? 'makeButtonFade'
                              : ''
                          } 
                        ${
                          (!otpVerified && !user) ||
                          professionalUserData.isExperienced == false
                            ? 'cursorDefault'
                            : ''
                        }
                              `}
                          /* if otp is not verified and there is no user, or
                             the professional has not verified their email, disable the button */
                          disabled={
                            (!otpVerified && !user) ||
                            professionalUserData.isExperienced == false ||
                            (user && user.resume && !uploadedFileName)
                          }
                          onClick={() => fileInputRef.current.click()}
                        >
                          <span style={{ marginRight: '3px' }}>&#8593;</span>
                          Upload Resume
                        </button>

                        <span style={{ color: '#F00', marginTop: '-3px' }}>
                          *
                        </span>
                      </div>

                      <p style={{ fontSize: '12px', marginTop: '5px' }}>
                        {user && user.resume && !uploadedFileName ? (
                          <p
                            className="replaceExistingResumeButton"
                            onClick={() => fileInputRef.current.click()}
                          >
                            Replace existing resume?
                          </p>
                        ) : (
                          <>
                            {resumeUploaded
                              ? `${uploadedFileName}`
                              : 'No file selected'}
                          </>
                        )}
                      </p>

                      <p style={{ fontSize: '12px', marginTop: '5px' }}>
                        (upto 5MB)
                      </p>
                    </div>

                    {/* Display this loader when the referral is being submitted. */}
                    {isSubmittingReferral ? (
                      <ClipLoader className="submitReferralLoader" size={20} />
                    ) : null}

                    <button
                      disabled={
                        (!otpVerified && !user) ||
                        professionalUserData.isExperienced == false
                      }
                      onClick={submitReferralRequest}
                      className={`submitButtonForReferral 
                    ${
                      (!otpVerified && !user) ||
                      professionalUserData.isExperienced == false
                        ? 'cursorDefault'
                        : ''
                    } 
                    ${
                      (otpVerified || user) &&
                      professionalUserData.isExperienced
                        ? 'makeBgBlue'
                        : ''
                    }`}
                    >
                      Submit Request
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="clipLoaderClass">
          <ClipLoader size={30} />
        </div>
      )}

      {/* Popup to redirect unregistered users to sign up page on
        their second visit */}
      {showPopup && (
        <div className="popUpContainer">
          <div className="popUpWindow" id="secondComerPopup">
            <Image
              className="secondComer"
              src={secondComer}
              alt="signup to continue"
            />

            <div className="messagePopupContentDetails">
              <div className="messagePopupClose">
                <h1 style={{ color: '#0057B1' }}>Oops!</h1>
              </div>

              <p style={{ marginTop: '30px', marginBottom: '20px' }}>
                It looks like you&apos;re ready to take the next step in your
                career journey by seeking more referrals.
              </p>
              <p style={{ marginBottom: '20px' }}>
                But, you have exceeded the number of times you can send a
                referral request with the same email ID.
              </p>
              <p style={{ fontWeight: 'bold' }}>
                Sign Up on Nectworks to send more.
              </p>

              <button className="goToSignupButton" onClick={goToSignup}>
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
