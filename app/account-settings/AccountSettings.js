'use client';

/*
    FileName - AccountSettings.js
    Desc - This file contains all the functions for Account Settings page such
    as sendingOTP, verifyingOTP, deletingUser, changingUsername. Toggle option
    is also provided for switching job seeker and job professional.
*/

import React, { useContext, useEffect, useRef, useState } from 'react';
import './AccountSettings.css';
import Image from 'next/image';
import cardGreenTickIcon from '@/public/AccountSettings/CardGreenTick.webp';
import greenTick from '@/public/AccountSettings/greenTick.webp';
import editIcon from '@/public/Profile/editIcon.svg';
import DashboardMenu from '../_components/DashboardMenu/DashboardMenu';
import ClipLoader from 'react-spinners/ClipLoader';
import infoIcon from '@/public/SignIn/information.webp';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { UserContext } from '@/context/User/UserContext.js';
import ProfileHeader from '../_components/Profile/ProfileHeader/ProfileHeader';
import addIcon from '@/public/Profile/addIcon.svg';
import ProfilePreferences from '../_components/Profile/ProfilePreferences/ProfilePreferences';
import seperatorIcon from '@/public/Profile/speratorIcon.svg';
import ProfileImage from '../_components/Profile/ProfileImage/ProfileImage';
import ProfileUploadDialog from '../_components/Profile/ProfileUploadDialog/ProfileUploadDialog';
import showBottomMessage from '@/Utils/showBottomMessage';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import { publicAxios } from '@/config/axiosInstance';

const useArrayOfRefs = (length) => {
  const refs = useRef([...Array(length)].map(() => React.createRef()));
  return refs.current;
};

const AccountSettings = () => {
  // get the user saved in the context
  const { userState, userModeState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [userMode, setUserMode] = userModeState;

  const privateAxios = usePrivateAxios();

  // decides if the user is professional or not
  const [isProfessional, setIsProfessional] = useState(false);

  const pathname = usePathname();

  /* state that decides if the verifyCompany input fields
   should be displayed or not */
  const [showCompanyInput, setShowCompanyInput] = useState(false);

  // this state decides the state of the remove professional details popup
  const [openRemoveDetailsPopup, setOpenRemoveDetailsPopup] = useState(false);

  // this state decides if the preferences form should be displayed or not
  const [showPreferencesForm, setShowPreferencesForm] = useState(false);

  // this state contains the user preferences saved in database
  const [userPreferences, setUserPreferences] = useState(null);

  // the preferences that should be displayed
  const [displayPreferences, setDisplayPreferences] = useState({});

  // state to represent if the data is being updated or newly added.
  const [preferencesUpdate, setPreferenceUpdate] = useState(false);

  // state for opening profile image upload dialog box.
  const [openProfileUploadDialog, setOpenFileUploadDialog] = useState(false);

  const [isPopoverVisible, setPopoverVisible] = useState(false);

  // view professional details
  const [viewProfessionalDetails, setViewProfessionalDetails] = useState(false);

  const showPopover = () => {
    setPopoverVisible(true);
  };

  const hidePopover = () => {
    setPopoverVisible(false);
  };

  const router = useRouter();

  // By default fill the input fields with current data
  const [professionalDetailsInput, setProfessionalDetailsInput] = useState({
    email: user?.userDetails?.emailID || '',
    company: user?.userDetails?.companyName || '',
  });
  const [
    visibilityHiddenProfessionalEmailError,
    setVisibilityHiddenProfessionalEmailError,
  ] = useState(false);
  const [
    visibilityHiddenProfessionalCompanyError,
    setVisibilityHiddenProfessionalCompanyError,
  ] = useState(false);
  const handleProfessionalInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === 'email' && value) {
      setVisibilityHiddenProfessionalEmailError(true);
    } else if (name === 'email' && !value) {
      setVisibilityHiddenProfessionalEmailError(false);
    }
    if (name === 'company' && value) {
      setVisibilityHiddenProfessionalCompanyError(true);
    } else if (name === 'company' && !value) {
      setVisibilityHiddenProfessionalCompanyError(false);
    }

    setProfessionalDetailsInput({ ...professionalDetailsInput, [name]: value });
  };

  const [isUsernameChanged, setIsUsernameChanged] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setIsUsernameChanged(true);
  };

  const [usernameError, setUsernameError] = useState('');
  // Function to check if the username is valid
  const isUsernameValid = (username) => {
    if (!username) return;

    const usernamePattern =
      /^(?!admin|founder|support|contact|webmaster|postmaster|abuse|sales|privacy|webmail|email|domain)[A-Za-z0-9]{3,20}$/;
    return usernamePattern.test(username);
  };

  const [otp, setOtp] = useState(['', '', '', '']);
  const otpInputs = useArrayOfRefs(4);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [signupOTPSuccessDelete, showSignupOTPSuccessDelete] = useState(false);
  const [signupOTPErrorDelete, showSignupOTPErrorDelete] = useState(false);
  const handleInputChange = (index, event) => {
    const value = event.target.value;
    if (index === 3) {
      setShowConfirmCancel(true);
    }
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '') {
        if (index < 3) {
          otpInputs[index + 1].current.focus();
          setShowSignupOTPSuccess(false);
          setShowSignupOTPError(false);
          showSignupOTPSuccessDelete(false);
          showSignupOTPErrorDelete(false);
        }
      } else {
        if (index > 0) {
          otpInputs[index - 1].current.focus();
          setShowConfirmCancel(false);
          setShowSignupOTPSuccess(false);
          setShowSignupOTPError(false);
          showSignupOTPErrorDelete(false);
          showSignupOTPSuccessDelete(false);
        }
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index]) {
      if (index > 0) {
        otpInputs[index - 1].current.focus();
      }
    }
  };

  const handleKeyDownPopup = (index, event) => {
    if (event.key === 'Backspace' && !otpPopup[index]) {
      if (index > 0) {
        otpInputsPopup[index - 1].current.focus();
      }
    }
  };

  const [otpPopup, setOtpPopup] = useState(['', '', '', '']);
  const otpInputsPopup = useArrayOfRefs(4);
  const [loginButtonBg, setLoginButtonBg] = useState(false);
  const handleInputChangePopup = (index, event) => {
    const value = event.target.value;
    if (index === 3) {
      setLoginButtonBg(true);
    }
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otpPopup];
      newOtp[index] = value;
      setOtpPopup(newOtp);

      if (value !== '') {
        if (index < 3) {
          otpInputsPopup[index + 1].current.focus();
          setShowSignupOTPSuccess(false);
          setShowSignupOTPError(false);
        }
      } else {
        if (index > 0) {
          otpInputsPopup[index - 1].current.focus();
          setLoginButtonBg(false);
          setShowSignupOTPSuccess(false);
          setShowSignupOTPError(false);
        }
      }
    }
  };

  const [seconds, setSeconds] = useState(60);
  const [isActive, setIsActive] = useState(false);

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

  const [showSpinner, setShowSpinner] = useState(false);
  const [showOtpScreenUp, setShowOtpScreenUp] = useState(false);
  const [showOtpSendPopup, setShowOtpSendPopup] = useState(false);

  /* function to decide if the verify button should be disabled
    disable the button, if
    - email field is empty,
    - company field is empty,
    - email is invalid
    - the otp screen is visible (already clicked verify button)
  */
  function disableVerifyBtn() {
    return (
      !professionalDetailsInput.email ||
      !professionalDetailsInput.company ||
      !isValidEmailFormat(professionalDetailsInput.email) ||
      !isAllowedDomain(professionalDetailsInput.email) ||
      showOtpScreenUp
    );
  }

  /* function to generate and send the email to the work email
  entered by the user. */
  const handleVerifyEmail = async (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault(); // Prevent the default Enter key behavior
      return;
    }

    setIsActive(false);
    setShowSpinner(true);
    try {
      const { email } = professionalDetailsInput;
      const sendOTP = await privateAxios.post('/account-settings/generateOTP', {
        email,
      });

      setShowSpinner(false);
      setOtpPopup(['', '', '', '']);

      if (sendOTP.status == 200) {
        setShowOtpSendPopup(true);
        setShowOtpScreenUp(true);
        setShowSignupOTPError(false);
        setShowSignupOTPSuccess(false);
        setIsActive(true);
        setResendButton(true);
        setTimeout(() => {
          setResendButton(false);
          setSeconds(0);
        }, 60000);
        setTimeout(() => {
          setShowOtpSendPopup(false);
        }, 2000);
      }
    } catch (err) {
      showBottomMessage(`Couldn't generate OTP. Try again!!`);
    }
  };

  const [isEmailVerified, setIsEmailVerified] = useState(
    !!user?.userDetails?.emailID
  );
  const [showSignupOTPError, setShowSignupOTPError] = useState(false);
  const [showSignupOTPSuccess, setShowSignupOTPSuccess] = useState(false);
  const [showSpinnerForVerifyOTP, setShowSpinnerForVerifyOTP] = useState(false);

  // Function to add and edit professional details of a user
  const closeModal = async (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault(); // Prevent the default Enter key behavior
      return;
    }

    setShowSpinnerForVerifyOTP(true);
    try {
      const { email, company } = professionalDetailsInput;
      const enteredOTP = otpPopup.join('');
      const payload = {
        email,
        enteredOTP,
        company,
      };

      const res = await privateAxios.post(
        `/account-settings/verifyOTP`,
        payload
      );

      if (res.status === 200) {
        setShowSignupOTPSuccess(true);
        setShowSpinnerForVerifyOTP(false);
        setShowOtpScreenUp(false);

        // when the email is verified successfully, hide the input fields
        setShowCompanyInput(false);

        // update the state in the context
        const { professionalDetails } = res.data;
        setUser({
          ...user,
          professionalDetails: {
            ...professionalDetails,
            decryptedEmail: email,
          },
        });

        /* since we already have the decrypted email in our
          state, display it to user */
        setViewProfessionalDetails(true);

        // display message to user about switch
        showBottomMessage('Switched to professional profile');

        document.body.style.overflow = 'auto';
      }
    } catch (err) {
      setShowSpinnerForVerifyOTP(false);
      setOtpPopup(['', '', '', '']);
      setShowSignupOTPError(true);
    }
  };

  // Function to remove company details of the user
  const removeCompanyDetails = async () => {
    // display the loader here
    const userVisualPrompt = document.querySelector('.userVisualPrompt');
    const loader = userVisualPrompt.querySelector('span');

    userVisualPrompt.style.display = 'block';

    try {
      const res = await privateAxios.delete(
        `/account-settings/removeCompanyDetails`
      );

      if (res.status === 200) {
        setProfessionalDetailsInput({
          email: '',
          company: '',
        });

        // update the user in the context with the new professional details.
        setUser({
          ...user,
          professionalDetails: res.data.professionalDetails,
        });

        // display the message about switch
        showBottomMessage(`Switched to seeker profile`);

        loader.style.display = 'none';
        setOpenRemoveDetailsPopup(false);
      }
    } catch (error) {
      const { message } = error.response.data;
      loader.style.display = 'none';
      setOpenRemoveDetailsPopup(false);
    }
  };

  const [showSendOTPAgainSignupSpinner, setShowSendOTPAgainSignupSpinner] =
    useState(false);
  const [resendButton, setResendButton] = useState(true);
  const [resendOTPForDeletionSpinner, setResendOTPForDeletionSpinner] =
    useState(false);
  const [showResendOtpSendPopupDeletion, setShowResendOtpSendPopupDeletion] =
    useState(false);
  const [
    disableResendButtonInAccountDeletion,
    setDisableResendButtonInAccountDeletion,
  ] = useState(true);
  const handleResendOTPToDeleteUser = async (e) => {
    setResendOTPForDeletionSpinner(true);
    try {
      const sendOTP = await privateAxios.post(`/account-settings/generateOTP`, {
        email: user?.email,
      });
      if (sendOTP.status === 200) {
        setDisableResendButtonInAccountDeletion(true);
        setResendOTPForDeletionSpinner(false);
        setShowResendOtpSendPopupDeletion(true);
        setInterval(() => {
          setShowResendOtpSendPopupDeletion(false);
        }, 2000);

        setInterval(() => {
          setDisableResendButtonInAccountDeletion(false);
        }, 60000);
      }
    } catch (err) {
      setResendOTPForDeletionSpinner(false);
    }
  };

  const [showResendOtpSendPopup, setShowResendOtpSendPopup] = useState(false);
  const handleSendOTPAgainSignup = async (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault(); // Prevent the default Enter key behavior
      return;
    }
    setIsActive(false);
    setShowSendOTPAgainSignupSpinner(true);
    try {
      const { email } = professionalDetailsInput;
      const sendOTP = await privateAxios.post(`/account-settings/generateOTP`, {
        email: email,
      });
      if (sendOTP.status === 200) {
        setShowResendOtpSendPopup(true);
        setShowSendOTPAgainSignupSpinner(false);
        setResendButton(true);
        setIsActive(true);
        setTimeout(() => {
          setResendButton(false);
          setSeconds(0);
        }, 60000);
        setOtpPopup(['', '', '', '']);
        setTimeout(() => {
          setShowResendOtpSendPopup(false);
        }, 2000); // Hide the OTP sent popup after 2 seconds
      }
    } catch (err) {
      setShowSendOTPAgainSignupSpinner(false);
    }
  };

  const isAllowedDomain = (email) => {
    const disallowedDomains = /(gmail|hotmail|yahoo|outlook|icloud|aol)/i;
    const domain = email.split('@')[1];
    return !disallowedDomains.test(domain);
  };

  const isValidEmailFormat = (email) => {
    // Basic email format validation using a regular expression
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const [changedUsername, setChangedUsername] = useState(user?.changedUsername);
  const [showUpdateUserNameLoading, setShowUpdateUserNameLoading] =
    useState(false);
  const updateUsername = async () => {
    if (!changedUsername) {
      setShowUpdateUserNameLoading(true);

      try {
        const updateUser = await privateAxios.patch(
          `/account-settings/updateUsername`,
          {
            username: username,
            changedUsername: true,
          }
        );

        if (updateUser.status === 200) {
          setChangedUsername(true);
          setShowUpdateUserNameLoading(false);

          // update user in context
          setUser({ ...user, username: username });
        }
      } catch (err) {
        setShowUpdateUserNameLoading(false);
      }
    }
  };

  const [showOTPDeletionInput, setShowOTPDeletionInput] = useState(true);
  const [showOTPOnce, setShowOTPOnce] = useState(true);
  const [showSpinnerForAccountDeletion, setShowSpinnerForAccountDeletion] =
    useState(false);
  const [showOtpSendPopupDeletion, setShowOtpSendPopupDeletion] =
    useState(false);

  const showOTPInputs = async (e) => {
    setShowOTPDeletionInput(!showOTPDeletionInput);
    if (showOTPOnce) {
      setShowSpinnerForAccountDeletion(true);
      try {
        const generateOTP = await privateAxios.post(
          `/account-settings/generateOTP`,
          { email: user?.email }
        );
        if (generateOTP.status === 200) {
          setDisableResendButtonInAccountDeletion(true);
          setShowOTPOnce(false);
          setShowSpinnerForAccountDeletion(false);
          setShowOtpSendPopupDeletion(true);
          setInterval(() => {
            setShowOtpSendPopupDeletion(false);
          }, 2000);

          setInterval(() => {
            setDisableResendButtonInAccountDeletion(false);
          }, 60000);
        }
      } catch (err) {
        setShowSpinnerForAccountDeletion(false);
      }
    }
  };

  const [
    accountConfirmationDeletionSpinner,
    setAccountConfirmationDeletionSpinner,
  ] = useState(false);

  // function to delete user's account.
  const deleteUser = async () => {
    setAccountConfirmationDeletionSpinner(true);
    try {
      const enteredOTP = otp.join('');
      const verifyOTPForDelete = await privateAxios.post(
        `/account-settings/deleteUser`,
        {
          email: user?.email,
          enteredOTP,
        }
      );
      if (verifyOTPForDelete.status === 200) {
        showSignupOTPErrorDelete(false);
        showSignupOTPSuccessDelete(true);
        setAccountConfirmationDeletionSpinner(false);
        localStorage.removeItem('filledForm');
        localStorage.removeItem('filledExperience');
        router.push('/account-deletion-confirmation');

        // remove the user from state
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch (err) {
      setAccountConfirmationDeletionSpinner(false);
      showSignupOTPErrorDelete(true);
      showSignupOTPSuccessDelete(false);
      setOtp(['', '', '', '']);
    }
  };

  // State and functions for resending OTP during account creation
  const [showUsername, setShowUsername] = useState(false);
  const [showLoadingOnusernameChange, setShowLoadingOnusernameChange] =
    useState(false);
  const checkUsername = async () => {
    setShowLoadingOnusernameChange(true);
    try {
      const checkUser = await publicAxios.post(`/signup/findusername`, {
        username,
      });

      if (checkUser.status === 200) {
        setShowLoadingOnusernameChange(false);
        setShowUsername(false);
        setUsernameError('This username is already taken!');
      }
    } catch (err) {
      setShowLoadingOnusernameChange(false);
      setShowUsername(true);
      setUsernameError('');
    } finally {
      if (user?.username === username) {
        setUsernameError('');
        setShowUsername(true);
      }
    }
  };
  useEffect(() => {
    if (isUsernameValid(username) && isUsernameChanged) {
      checkUsername();
    }
  }, [username]);

  // utility function to format camelCase object keys to seperate words
  function formatCamelCaseStr(str) {
    const seperatedStr = str.replace(/([A-Z])/g, ' $1');
    const strArr = seperatedStr.split(' ');
    const firstLowerCaseChar = strArr.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return firstLowerCaseChar.join(' ').trim();
  }

  // fetch preferences if not found
  function fetchPreferences() {
    // check if preferences exist in sessionStorage
    const savedPreferencesString = sessionStorage.getItem('preferences');
    if (savedPreferencesString) {
      try {
        const savedPreferences = JSON.parse(savedPreferencesString);
        setUserPreferences(savedPreferences);
        return;
      } catch (error) {
        console.error('Error parsing saved preferences:', error);
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // fetch preferences on component render
    fetch(`${appUrl}/profile/preferences`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        const savedPreferences = data?.data?.preferences;
        setUserPreferences(savedPreferences);

        if (isProfessional) {
          // show the form if there's no preferences data
          setShowPreferencesForm(data.data?.preferences?.professional == null);
        } else {
          setShowPreferencesForm(data.data?.preferences?.seeker == null);
        }

        // Save preferences to sessionStorage
        try {
          sessionStorage.setItem(
            'preferences',
            JSON.stringify(savedPreferences)
          );
        } catch (error) {
          console.error('Error saving preferences to sessionStorage:', error);
        }
      })
      .catch((error) => {
        console.error('Error fetching preferences:', error);
      });
  }

  useEffect(() => {
    fetchPreferences();

    /* add a event listener to close visible popup when clicker
    elsewhere on the window */
    const removeAccountContainer = document.querySelector(
      '.removeAccountBackground'
    );

    removeAccountContainer?.addEventListener('click', (e) => {
      if (e.target !== removeAccountContainer) return;
      setOpenRemoveDetailsPopup(false);
    });

    /* if a user was router.pushd to account-settings/ by other
    component and has any messages to display, display it */

    if (location.state && location.state?.displayMessage) {
      showBottomMessage(location.state.message);
    }
  }, []);

  useEffect(() => {
    /* change the preferences to be showed based on the
      user type (professional or seeker)

      if the preferences for any type was null, show the respective form
    */
    if (isProfessional) {
      setDisplayPreferences(userPreferences?.professional);
      setShowPreferencesForm(userPreferences?.professional == null);
    } else {
      setDisplayPreferences(userPreferences?.seeker);
      setShowPreferencesForm(userPreferences?.seeker == null);
    }
  }, [isProfessional, userPreferences]);

  useEffect(() => {
    // update the state when the context is changed
    setIsProfessional(userMode === 'professional');
  }, [userMode]);

  useEffect(() => {
    // when there are changes in userPreferences, sync it with sessionStorage
    sessionStorage.setItem('preferences', JSON.stringify(userPreferences));
  }, [userPreferences]);

  return (
    <div className="dashboard_outer_container">
      <DashboardMenu />

      <div className={`accountSettingsContainer`}>
        <ProfileHeader />

        {/* display a message when the user mode is changed */}
        <div className="info-box" id="info-box"></div>

        <div className="accountSettingContent">
          <div className="greetingsSection">
            <div className="accountSettingsInfo">
              <span>Account Settings</span>
              <p>Edit your account details</p>
            </div>
          </div>

          {/* The 2 cards to switch between seeker and professional */}
          <div className="cardsContainer">
            <div className="cardContent">
              {/* card one -> job seeker */}
              <div className={`card ${isProfessional == false ? 'card2' : ''}`}>
                <span>BETA</span>
                <div className="accountSettingsProfileContainer">
                  <ProfileImage isLoggedInUser={true} />
                </div>
                <button
                  onClick={(e) => {
                    // BETA FEATURE
                    /* if the user is a professional do not
                      switch to seeker profile */
                    if (isProfessional === true) {
                      showBottomMessage('Beta feature coming soon! Stay tuned');
                      return;
                    }

                    setUserMode('seeker');
                  }}
                >
                  {isProfessional == false ? 'Active' : 'Switch'}
                </button>
                <div className="cardPersonDetail">
                  {/* <h4>
                    {user?.firstName} {user?.lastName}
                  </h4> */}
                  <p style={{ fontSize: '14px' }}>Job Seeker</p>
                </div>
              </div>

              {/* card two -> professional */}
              <div
                className={`card 
                ${isProfessional == true ? 'card2' : ''}`}
              >
                <Image
                  className={`cardGreenTickIcon 
                  ${!isEmailVerified ? 'hideCompanyError' : ''}`}
                  src={cardGreenTickIcon}
                  alt="Verified check mark"
                />
                <div className="accountSettingsProfileContainer">
                  <ProfileImage isLoggedInUser={true} />
                </div>

                <button
                  onClick={() => {
                    /* if user does not have a verified email,
                    do not switch to professional */
                    if (isEmailVerified === false) {
                      showBottomMessage(
                        'Please add your professional ' +
                          'email to access more features'
                      );
                      return;
                    }
                    setUserMode('professional');
                  }}
                  style={{
                    backgroundColor: isProfessional == true ? 'white' : 'grey',
                  }}
                >
                  {isProfessional == true ? 'Active' : 'Switch'}
                </button>

                <div className="cardPersonDetail">
                  {/* <h4>
                    {user?.firstName} {user?.lastName}
                  </h4> */}
                  <p style={{ fontSize: '14px' }}>Professional</p>
                </div>
              </div>
            </div>
          </div>

          {/* Remove account container */}
          <div
            style={{ display: openRemoveDetailsPopup ? 'block' : 'none' }}
            className="removeAccountBackground"
          >
            <div className="removeAccountWindow">
              <h3>Remove professional details</h3>
              <p>
                This action is irreverisible, click continue to remove
                professional details, or cancel.
              </p>

              <div className="userVisualPrompt" style={{ display: 'none' }}>
                <ClipLoader size={20} />
              </div>

              <div className="removeAccountBtnsContainer">
                <button onClick={removeCompanyDetails} id="removeAccount">
                  Continue
                </button>
                <button
                  onClick={() => setOpenRemoveDetailsPopup(false)}
                  id="cancelRemoveAccount"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div className="verifyCompanyContainer">
            {showCompanyInput && (
              <div className="verifyCompanyContent">
                <div className="emailVerifyContainer">
                  <div className="inputFields">
                    <label htmlFor="">
                      Professional email ID :
                      <span className="starStyle">*</span>
                    </label>
                    <input
                      disabled={showOtpScreenUp}
                      type="text"
                      name="email"
                      onChange={handleProfessionalInputs}
                      value={professionalDetailsInput.email}
                    />
                    {!professionalDetailsInput.email && (
                      <span
                        className={`inputFieldsError ${
                          visibilityHiddenProfessionalEmailError
                            ? 'hideCompanyError'
                            : ''
                        }`}
                      >
                        For ex, user@google.com
                      </span>
                    )}

                    {professionalDetailsInput.email &&
                      !isValidEmailFormat(professionalDetailsInput.email) && (
                        <span
                          className={`inputFieldsError makeErrorColorRed ${
                            isValidEmailFormat(professionalDetailsInput.email)
                              ? 'hideCompanyError'
                              : ''
                          }`}
                        >
                          Invalid email format
                        </span>
                      )}

                    {isValidEmailFormat(professionalDetailsInput.email) &&
                      !isAllowedDomain(professionalDetailsInput.email) && (
                        <span
                          className={`inputFieldsError makeErrorColorRed 
                                        ${
                                          isValidEmailFormat(
                                            professionalDetailsInput.email
                                          ) &&
                                          isAllowedDomain(
                                            professionalDetailsInput.email
                                          )
                                            ? 'hideCompanyError'
                                            : ''
                                        }`}
                        >
                          Please enter a valid work email address
                        </span>
                      )}

                    {isValidEmailFormat(professionalDetailsInput.email) &&
                      isAllowedDomain(professionalDetailsInput.email) && (
                        <span className="fixingMarginInEmail">&nbsp;</span>
                      )}
                  </div>
                  <div className="inputFields">
                    <label htmlFor="">
                      Your Company : <span className="starStyle">*</span>
                    </label>
                    <input
                      disabled={showOtpScreenUp}
                      type="text"
                      name="company"
                      onChange={handleProfessionalInputs}
                      value={professionalDetailsInput.company}
                    />
                    {!professionalDetailsInput.company && (
                      <div
                        className={`inputFieldsError ${
                          visibilityHiddenProfessionalCompanyError
                            ? 'hideCompanyError'
                            : ''
                        }`}
                      >
                        <span>Add your company</span>
                        <div className="info-icon-container">
                          <div className="popover-wrapper">
                            <h4 className="popover-text">Why work email</h4>
                            <div className="popover">
                              <p>
                                Participate in safe communities with other
                                verified professionals. Flexible identity
                                preferences allow honest conversations with
                                other seekers.
                              </p>
                            </div>
                            <Image
                              src={infoIcon}
                              alt="info about adding professional details"
                              className="info-icon"
                              onMouseEnter={showPopover}
                              onMouseLeave={hidePopover}
                              style={{ height: '15px', width: '15px' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    className={`verifyButton 
                    ${disableVerifyBtn() ? 'verifyButtonDisabled' : ''}`}
                    disabled={disableVerifyBtn()}
                    onClick={handleVerifyEmail}
                  >
                    {/* Show spinner when there is a network request. */}
                    {showSpinner ? <ClipLoader size={12} /> : 'Verify'}
                  </button>
                </div>

                {/* This the popover message that is been shown up
                    till here */}

                {showOtpScreenUp && (
                  <div className="otpStyling">
                    <p className="otp__expiry__desc">
                      Valid for&nbsp;
                      <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {seconds + ' '}
                      </span>
                      seconds
                    </p>
                    <div
                      className="otp__input-container"
                      style={{ width: '0px' }}
                    >
                      {otpInputsPopup.map((ref, index) => (
                        <input
                          className={`otp__inputs ${
                            showSignupOTPSuccess ? 'makeInputGreenWhole' : ''
                          } ${showSignupOTPError ? 'makeInputRedWhole' : ''} `}
                          key={index}
                          ref={ref}
                          type="text"
                          value={otpPopup[index]}
                          onChange={(e) => handleInputChangePopup(index, e)}
                          onKeyDown={(e) => handleKeyDownPopup(index, e)}
                          maxLength={1}
                        />
                      ))}
                    </div>
                    <div className="otp__button-container  otp__button__account">
                      <button
                        className={`confirmProfessional ${
                          showSendOTPAgainSignupSpinner
                            ? 'increaseResendOTPWidthPopup'
                            : ''
                        } ${resendButton ? 'changeButtonColor' : ''}`}
                        onClick={handleSendOTPAgainSignup}
                        disabled={resendButton}
                      >
                        {showSendOTPAgainSignupSpinner ? (
                          <ClipLoader size={12} />
                        ) : (
                          'Resend code'
                        )}
                      </button>
                      <button
                        className="confirmProfessional"
                        disabled={!loginButtonBg}
                        onClick={closeModal}
                      >
                        {showSpinnerForVerifyOTP ? (
                          <ClipLoader size={12} />
                        ) : (
                          'Confirm'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {(showOtpSendPopup || showResendOtpSendPopup) && (
            <div className="otpSentPopup">
              <span className="otpSendText">OTP sent ✅</span>
            </div>
          )}
          <hr className="showHrMobile" />

          {/* User Profile Details section start here */}
          <h2 className="sectionHeader">Profile details</h2>

          {/* Dialog box to upload profile picture */}
          {openProfileUploadDialog && (
            <ProfileUploadDialog
              setOpenFileUploadDialog={setOpenFileUploadDialog}
            />
          )}

          <div className="userInformationSection accountSettingsSection">
            <div className="userInfoContent">
              <div className="manipulateSection">
                <div
                  onClick={() => setOpenFileUploadDialog(true)}
                  style={{ cursor: 'pointer' }}
                  className="accountSettingsProfileContainer"
                >
                  <ProfileImage isLoggedInUser={true} />
                  <Image
                    className="editProfileIcon"
                    src={editIcon}
                    alt="update profile image"
                  />
                </div>
              </div>

              <div className="userInfo">
                <div className="userInfoYourself">
                  <h4>User Information</h4>
                  <p>Here you can view public information about yourself.</p>
                </div>
                <div className="userDetails">
                  <div className="userInfoSection">
                    <div className="userInfoSectionInputs">
                      <label>Email Address</label>
                      <input
                        disabled
                        style={{
                          border: 'none',
                          borderBottom: '1px solid gray',
                          background: 'none',
                        }}
                        type="text"
                        name="email"
                        value={user?.email}
                      />
                    </div>
                    <div className="userInfoSectionInputs usernameInputSection">
                      <label>Username</label>
                      <div>
                        <input
                          maxLength={15}
                          disabled={changedUsername}
                          style={{
                            background: 'none',
                          }}
                          className={`makeBgNoneForMobile 
                          ${changedUsername ? 'removeBorder' : ''}`}
                          type="text"
                          name="username"
                          value={username || ''}
                          onChange={handleUsernameChange}
                        />

                        <span
                          style={{ position: 'absolute', right: 0, top: '55%' }}
                        >
                          {isUsernameValid(username) && showUsername ? (
                            showLoadingOnusernameChange ? (
                              <div className="cliploaderclassProfile">
                                <ClipLoader size={10} />
                              </div>
                            ) : (
                              !changedUsername && (
                                <div className="green-circle-profile"></div>
                              )
                            )
                          ) : null}
                        </span>

                        <span
                          style={{ position: 'absolute', right: 0, top: '35%' }}
                        >
                          {isUsernameValid(username) &&
                          !showUsername &&
                          isUsernameChanged ? (
                            showLoadingOnusernameChange ? (
                              <div className="cliploaderclassProfile">
                                <ClipLoader size={10} />
                              </div>
                            ) : (
                              !changedUsername && (
                                <div className="red-circle-profile"></div>
                              )
                            )
                          ) : null}
                        </span>
                      </div>
                      {usernameError && !changedUsername ? (
                        <div className="errorMessageAccount">
                          {usernameError}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className="userInfoSection"
                    style={{ marginTop: '1rem' }}
                  >
                    <div className="userInfoSectionInputs">
                      <label htmlFor="">First Name</label>
                      <input
                        disabled
                        style={{
                          border: 'none',
                          borderBottom: '1px solid gray',
                          background: 'none',
                        }}
                        type="text"
                        name="firstName"
                        value={user?.firstName}
                      />
                    </div>
                    <div className="userInfoSectionInputs usernameInputSection">
                      <label htmlFor="">Last Name</label>
                      <input
                        disabled
                        style={{
                          border: 'none',
                          background: 'none',
                          borderBottom: '1px solid gray',
                        }}
                        type="text"
                        name="lastName"
                        value={user?.lastName}
                      />
                    </div>
                  </div>
                </div>
                {!changedUsername && isUsernameValid(username) && (
                  <button onClick={updateUsername} className="saveButton">
                    {showUpdateUserNameLoading ? (
                      <ClipLoader size={12} />
                    ) : (
                      'Save'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          <hr className="showHrMobile" />

          {/* User Preferences section is displayed here */}
          <h2 className="sectionHeader">Preferences</h2>
          <div>
            <p
              style={{
                display: 'inline-block',
                marginRight: '10px',
                marginBottom: '5px',
              }}
            >
              {isProfessional === true
                ? 'Based on your preference settings, you will' +
                  ' receive relevant candidate suggestions in your talent pool.'
                : 'Based on your preference settings, you will be matched with' +
                  ' relevant job professionals and companies.'}
            </p>

            {/* display this icon only for professionals */}
            {isProfessional === true && (
              <div className="proPreferencesInfo">
                <Image
                  className="info-icon"
                  src={infoIcon}
                  alt="info about adding preferences"
                />
                <span className="proPreferncesInfoMessage">
                  Looking for a job? Just switch to ‘job seeker’ and update your
                  preferences here.
                  <span className="downArrow"></span>
                </span>
              </div>
            )}
          </div>

          {/* display/toggle the proferences form */}
          {showPreferencesForm === true && (
            <div className="accountSettingsSection">
              <ProfilePreferences
                isDataUpdated={preferencesUpdate}
                setShowPreferencesForm={setShowPreferencesForm}
                userPreferences={userPreferences}
                setUserPreferences={setUserPreferences}
              />
            </div>
          )}

          {/* Display the preferences based on the user type */}
          {showPreferencesForm === false &&
            (userPreferences?.professional || userPreferences?.seeker) && (
              <div className="dashboard_info_preferences accountSettingsSection">
                <div className="preferences_action_container">
                  {/* <label className = "switch">
                  <div className = 'slider_message'>
                    <span className = 'slider_message_pointer'></span>
                    Turn off preferences to stop
                    receiving candidate suggestions.
                  </div>
                  <input type="checkbox" />
                  <span className = "slider round"></span>
                </label> */}
                  <span
                    onClick={(e) => {
                      setPreferenceUpdate(true);
                      setShowPreferencesForm(true);
                    }}
                    className="preferences_edit_container"
                  >
                    <Image
                      className="preferences_action_edit"
                      src={editIcon}
                      alt="edit preferences"
                    />
                  </span>
                </div>
                {displayPreferences &&
                  Object.keys(displayPreferences).map((field, index) => {
                    return (
                      <div key={index} className="dashboard_preference_row">
                        <h3>{formatCamelCaseStr(field)}</h3>
                        <Image src={seperatorIcon} />
                        <div className="dashboard_preference_values">
                          {
                            /* if the values is an array, map over
                            it and display them */
                            Array.isArray(displayPreferences[field]) ? (
                              displayPreferences[field].map((val, idx) => {
                                return <span key={idx}>{val}</span>;
                              })
                            ) : (
                              <span>{displayPreferences[field]}</span>
                            )
                          }
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

          <div className="logoutAllDevices">
            <h2 className="sectionHeader">Log out from all devices</h2>
            <p>
              Proceeding will sign you out from all devices. Sure about this?
            </p>
            <button onClick={() => router.push('/logout?all-devices=true')}>
              Log out
            </button>
          </div>

          <div className="accountDeletionSection">
            <div className="withWarningContainer">
              <p className="warningMessage">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
              <div className="accountDeletionContent">
                <div className="deleteAccountInput">
                  <button
                    onClick={showOTPInputs}
                    className={`deleteAccountButton 
                                ${
                                  showSpinnerForAccountDeletion
                                    ? 'increaseDeletionButtonWidth'
                                    : ''
                                } `}
                  >
                    {showSpinnerForAccountDeletion ? (
                      <ClipLoader size={12} />
                    ) : (
                      <>
                        <p>Delete my account</p>
                      </>
                    )}
                  </button>
                  <div
                    className={`otpInput ${
                      showOTPDeletionInput ? 'hideElement' : ''
                    }`}
                  >
                    {otpInputs.map((ref, index) => (
                      <input
                        className={`${
                          signupOTPSuccessDelete ? 'makeInputGreenWhole' : ''
                        } ${signupOTPErrorDelete ? 'makeInputRedWhole' : ''} `}
                        key={index}
                        ref={ref}
                        type="text"
                        value={otp[index]}
                        onChange={(e) => handleInputChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength={1}
                      />
                    ))}
                  </div>
                </div>
                <div
                  className={`confirmCancelButtons ${
                    !showConfirmCancel ? 'hideElement' : ''
                  }`}
                >
                  <button
                    disabled={disableResendButtonInAccountDeletion}
                    onClick={handleResendOTPToDeleteUser}
                    className={`${
                      disableResendButtonInAccountDeletion
                        ? 'makeColorGrayOfResendButton'
                        : ''
                    } ${
                      resendOTPForDeletionSpinner
                        ? 'increaseResendButtonWidth'
                        : ''
                    } colorBGBlue ${showOTPDeletionInput ? 'hideElement' : ''}`}
                  >
                    {resendOTPForDeletionSpinner ? (
                      <ClipLoader size={12} />
                    ) : (
                      'Resend'
                    )}
                  </button>

                  <button
                    onClick={deleteUser}
                    style={{ color: '#f85149', fontWeight: 'bold' }}
                    className={`colorBgRed ${
                      showOTPDeletionInput ? 'hideElement' : ''
                    } ${
                      accountConfirmationDeletionSpinner
                        ? 'increaseResendButtonWidth'
                        : ''
                    }`}
                  >
                    {accountConfirmationDeletionSpinner ? (
                      <ClipLoader size={12} />
                    ) : (
                      'Confirm'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {(showOtpSendPopupDeletion || showResendOtpSendPopupDeletion) && (
            <div className="otpResentPopup">
              <span className="otpResendText">OTP sent ✅</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
