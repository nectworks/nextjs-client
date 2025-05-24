'use client';
/*
  FileName - SignUpMobile.js
  Desc - The provided code is a React component named SignUpForm
  that represents a sign-up form for a web application.
  It utilizes various state variables to manage user
  input and validation. The component renders a form
  with input fields for the user's first name,
  last name, username, email address, and invite code.
  It also includes a mechanism to verify the user's
  email address using an OTP (One-Time Password).
*/

import { useContext, useEffect, useRef, useState } from 'react';
import './SignUpMobile.css';
import infoIcon from '@/public/SignIn/userIcon.png';
import userNameIcon from '@/public/SignIn/userNameIcon.png';
import emailIcon from '@/public/SignIn/emailIcon.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { publicAxios } from '@/config/axiosInstance.js';
import ClipLoader from 'react-spinners/ClipLoader';
import scrollToTop from '@/Utils/scrollToTop';
import { UserContext } from '@/context/User/UserContext';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import LinkedInIcon from '@/public/SignIn/LinkedInIcon.svg';
import GoogleIcon from '@/public/SignIn/GoogleIcon.svg';
import Image from 'next/image';

const SignUpMobile = () => {
  const router = useRouter();
  const getSignupInputValFromMain = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('singupval') || '';
    }
    return '';
  };
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  const privateAxios = usePrivateAxios();

  // get the location from where the user was redirected to sign-up page.
  const [prevLocation, setPrevLocation] = useState(null);

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const [username, setUsername] = useState('');

  const [usernameError, setUsernameError] = useState('');

  const [isOTPSentAgainSignup, setIsOTPSentAgainSignup] = useState(false);

  // -----------------otp for sign__up----------

  const [showOtpScreenSignUp, setShowOtpScreenUp] = useState(false);
  const [otpValuesSignUp, setotpValuesSignUp] = useState(['', '', '', '']);

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

  useEffect(() => {
    const savedUsername = getSignupInputValFromMain();
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  useEffect(() => {
    if (router.query && router.query.from) {
      setPrevLocation(router.query.from);
    }
  }, [router.query]);

  // Create refs for each input field
  const inputRefsSignUp = [useRef(), useRef(), useRef(), useRef()];
  const [showSpinner, setShowSpinner] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [showLoadingOnusernameChange, setShowLoadingOnusernameChange] =
    useState(false);
  const [checkUsernameExist, setcheckUsernameExist] = useState(false);

  const checkUsername = async () => {
    setShowLoadingOnusernameChange(true);
    try {
      const checkUser = await publicAxios.post('/signup/findusername', {
        username,
      });
      if (checkUser.status === 200) {
        setShowLoadingOnusernameChange(false);
        setShowUsername(false);
        setUsernameError('This username is already taken');
        setcheckUsernameExist(true);
      }
    } catch (err) {
      setShowLoadingOnusernameChange(false);
      setShowUsername(true);
      setcheckUsernameExist(false);
    }
  };
  useEffect(() => {
    if (isUsernameValid(username)) {
      checkUsername();
    }
  }, [username]);

  const handleOtpButtonClickSignUp = async (e) => {
    setIsActive(false);
    e.preventDefault(); // Prevent the default Enter key behavior

    if (!isNameValid(firstName)) {
      setFirstNameError('First Name is invalid');
      return;
    }

    if (!isNameValid(lastName)) {
      setLastNameError('Last Name is invalid');
      return;
    }

    if (
      checkUsernameExist ||
      (!isUsernameValid(username) &&
        username.length > 0 &&
        (username.length < 3 || username.length > 20))
    ) {
      return;
    }

    if (!isEmailValid(email)) {
      setEmailError('Email is invalid');
      return;
    }

    setShowSpinner(true);
    try {
      const sendOTP = await publicAxios.post('/signup/generateOTP', {
        email: email,
      });

      if (sendOTP.status == 200) {
        setshowSignupOTPError(false);
        setshowSignupOTPSuccess(false);
        setIsActive(true);
        setShowSpinner(false);
        setResendButton(true);
        setTimeout(() => {
          setResendButton(false);
        }, 60000);
        setShowOtpScreenUp(true);
        document.body.style.overflow = 'hidden';
        if (typeof window !== 'undefined') {
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        }
      }
    } catch (err) {
      console.log(err);
      setShowSpinner(false);
      setEmailError('Email already exists');
    }
  };

  const [verifyEmail, setVerifyEmail] = useState(false);
  const [showSignupOTPError, setshowSignupOTPError] = useState(false);
  const [showSignupOTPSuccess, setshowSignupOTPSuccess] = useState(false);
  const [showSpinnerForVerifyOTP, setShowSpinnerForVerifyOTP] = useState(false);

  const closeModal = async (e) => {
    if (e) {
      e.preventDefault();
    }
    setShowSpinnerForVerifyOTP(true);
    try {
      const enteredOTP = otpValuesSignUp.join('');
      const verifyOTP = await publicAxios.post('/signup/verifyOTP', {
        email: email,
        enteredOTP: enteredOTP,
      });

      if (verifyOTP.status === 200) {
        setshowSignupOTPSuccess(true);
        setShowSpinnerForVerifyOTP(false);
        setShowOtpScreenUp(false);
        document.body.style.overflow = 'auto';
        setVerifyEmail(true);
        setEmailError('Now, you can proceed with the signup process');
        return true;
      }
    } catch (err) {
      setShowSpinnerForVerifyOTP(false);
      setotpValuesSignUp(['', '', '', '']);
      setshowSignupOTPError(true);
      setLoginButtonBg(false);
      return false;
    }
    return false;
  };

  const [loginButtonBg, setLoginButtonBg] = useState(false);

  const handleOtpInputChangeSignUp = (index, value) => {
    if (value === '' || /^[0-9]$/.test(value)) {
      const newotpValuesSignUp = [...otpValuesSignUp];
      newotpValuesSignUp[index] = value;
      setotpValuesSignUp(newotpValuesSignUp);

      if (newotpValuesSignUp.every((val) => val !== '')) {
        setLoginButtonBg(true);
      } else {
        setLoginButtonBg(false);
      }

      if (value !== '' && index < 3) {
        inputRefsSignUp[index + 1].current.focus();
      } else if (value === '' && index > 0) {
        inputRefsSignUp[index - 1].current.focus();
      }

      setshowSignupOTPError(false);
      setshowSignupOTPSuccess(false);
    }
  };
  // -----------------otp for sign__up----------

  // Function to check if the username is valid
  const isUsernameValid = (username) => {
    const usernamePattern =
      /^(?!admin|founder|support|contact|webmaster|postmaster|abuse|sales|privacy|webmail|email|domain)[A-Za-z0-9]{3,20}$/;
    return usernamePattern.test(username);
  };

  // Function to handle username change and validate it
  const handleUsernameChange = (e) => {
    const { value } = e.target;
    const newUsername = e.target.value.toLowerCase(); // Convert to lowercase
    setUsername(newUsername);
    if (value === '') {
      setUsernameError('');
    } else if (!isUsernameValid(value)) {
      setUsernameError('Enter a valid username');
    } else {
      setUsernameError('');
    }
  };

  // Function to check if the email is valid
  const isEmailValid = (email) => {
    const emailPattern = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return emailPattern.test(email) && email.endsWith('.com');
  };

  // Function to check if the first name/last name's length <= 30 and > 0
  const isNameValid = (name) => {
    return name.length <= 30 && name.length > 0;
  };

  // Function to handle email change and validate it
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (value === '') {
      setEmailError('');
    } else if (!isEmailValid(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  function capitalizeFirstChar(word) {
    if (word.length > 0) {
      return word[0].toUpperCase() + word.slice(1);
    }

    return word;
  }

  // Function to handle first name change and validate it
  const handleFirstNameChange = (e) => {
    const value = e.target.value;

    // capitalize first character to upperCase and other characters to lowerCase
    const formattedName = capitalizeFirstChar(value);
    setFirstName(formattedName);

    // if the value entered is empty, return with error
    if (value === '') {
      setFirstNameError('First name is required');
    } else if (!isNameValid(formattedName)) {
      setFirstName(formattedName.slice(0, 30));
      setFirstNameError("Can't exceed 30 characters");
    } else {
      setFirstNameError('');
    }
  };

  // Function to handle last name change and validate it
  const handleLastNameChange = (e) => {
    const value = e.target.value;

    // capitalize first character to upperCase and other characters to lowerCase
    const formattedName = capitalizeFirstChar(value);
    setLastName(formattedName);

    if (value === '') {
      setLastNameError('Last name is required');
    } else if (!isNameValid(formattedName)) {
      setLastName(formattedName.slice(0, 30));
      setLastNameError("Can't exceed 30 characters");
    } else {
      setLastNameError('');
    }
  };

  const [resendButton, setResendButton] = useState(true);
  const [showSendOTPAgainSignupSpinner, setShowSendOTPAgainSignupSpinner] =
    useState(false);
  const handleSendOTPAgainSignup = async (e) => {
    setIsActive(false);
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault(); // Prevent the default Enter key behavior
      return;
    }
    setShowSendOTPAgainSignupSpinner(true);
    try {
      const sendOTP = await publicAxios.post('/signup/generateOTP', {
        email: email,
      });
      if (sendOTP.status === 200) {
        setLoginButtonBg(false);
        setShowSendOTPAgainSignupSpinner(false);
        setResendButton(true);
        setIsActive(true);
        setTimeout(() => {
          setResendButton(false);
        }, 60000);
        setIsOTPSentAgainSignup(true);
        setotpValuesSignUp(['', '', '', '']);
        setTimeout(() => {
          setIsOTPSentAgainSignup(false);
        }, 2000); // Hide the OTP sent popup after 2 seconds
      }
    } catch (err) {
      console.log(err);
      setShowSendOTPAgainSignupSpinner(false);
      setLoginButtonBg(false);
    }
  };

  const [signupSpinner, showSignupSpinner] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (firstName === lastName) {
      setFirstNameError('Firstname and lastName should not be same');
      setLastNameError('Firstname and lastName should not be same');
      return;
    }
  
    // Call closeModal to verify OTP first
    const otpVerified = await closeModal(e);
  
    if (!otpVerified) {
      // If OTP verification failed, don't proceed with signup
      return;
    }
  
    showSignupSpinner(true);
    try {
      const res = await privateAxios.post('/signup', {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
      });
  
      if (res.status === 200) {
        showSignupSpinner(false);
        setUser(res.data.user);
  
        // Set a flag in localStorage to indicate this is a brand new signup
        localStorage.setItem('newSignup', 'true');
        sessionStorage.setItem('from', '/sign-up');
        
        // Add a small delay before redirecting to ensure storage is set
        setTimeout(() => {
          router.push(prevLocation || '/profile');
        }, 100);
      }
    } catch (err) {
      showSignupSpinner(false);
      // Handle error (e.g., show error message)
    }
  };

  const handleClickChangeEmail = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault(); // Prevent the default Enter key behavior
      return;
    }
    setShowOtpScreenUp(false);
    document.body.style.overflow = 'auto';
    setIsActive(false);
  };

  // function to sign in with google
  async function signInWithGoogle(e) {
    e.preventDefault();
    try {
      const res = await publicAxios.get('/google/auth');
      const { authUrl } = res.data;
      window.location.href = authUrl;
    } catch (error) {
      showBottomMessage("Couldn't sign up using google");
    }
  }

  // function to sign in with likeding
  async function signInWithLinkedin(e) {
    e.preventDefault();
    try {
      const res = await publicAxios.get('/linkedin/auth');
      const { authUrl } = res.data;
      window.location.href = authUrl;
    } catch (error) {
      showBottomMessage("Couldn't sign up using linkedin");
    }
  }

  useEffect(() => {
    /* if the user is already registered, redirect them to where they came from
               or to the profile page */
    if (user) {
      router.push(prevLocation || '/profile', { replace: true });
      return;
    }
  }, []);

  return (
    <>
      <div
        className={`mob__container container ${showOtpScreenSignUp ? 'blurBG' : ''}`}
      >
        <h2 className="mob__header">Let’s get you started!</h2>
        <form>
          <div className="input-wrapper">
            <div
              className={`input-icon ${
                isNameValid(firstName) ? 'valid' : 'invalid'
              }`}
            >
              <label className="label__style__signup">
                <span>
                  First Name<span className="required__color">&nbsp;*</span>
                </span>
              </label>
              <img src={infoIcon.src} alt="user first name label" />
              <div className="error-container-mobile">
                <input
                  type="text"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  className={`input__style_mob ${
                    isNameValid(firstName) ? 'valid' : 'invalid'
                  }`}
                  disabled={showOtpScreenSignUp}
                />
                {isNameValid(firstName) && (
                  <div className="green-circle-mobile"></div>
                )}
              </div>
              {firstNameError && (
                <div className="error-message-mobile">{firstNameError}</div>
              )}
            </div>
          </div>
          <div className="input-wrapper">
            <div
              className={`input-icon ${
                isNameValid(lastName) ? 'valid' : 'invalid'
              }`}
            >
              <label className="label__style__signup">
                <span>
                  Last Name<span className="required__color">&nbsp;*</span>
                </span>
              </label>
              <img src={infoIcon.src} alt="user last name label" />
              <div className="error-container-mobile">
                <input
                  type="text"
                  value={lastName}
                  onChange={handleLastNameChange}
                  className={`input__style_mob
                  ${isNameValid(lastName) ? 'valid' : 'invalid'}`}
                  disabled={showOtpScreenSignUp}
                />
                {isNameValid(lastName) && (
                  <div className="green-circle-mobile"></div>
                )}
              </div>
              {lastNameError && (
                <div className="error-message-mobile">{lastNameError}</div>
              )}
            </div>
          </div>
          <div className="input-wrapper">
            <div
              className={`input-icon ${
                isUsernameValid(username) ? 'valid' : 'invalid'
              }`}
            >
              <label className="label__style__signup">
                <span>
                  Username<span className="required__color"></span>
                </span>
              </label>
              <img src={userNameIcon.src} alt="username label" />
              <div className="error-container-mobile">
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className={`input__style_mob
                  ${isUsernameValid(username) ? 'valid' : 'invalid'}`}
                  disabled={showOtpScreenSignUp}
                />
                <span className="info__icon__one tooltip">
                  i
                  <span className="tooltiptext">
                    Once set, usernames cannot be changed.&nbsp; Not sure about
                    the username right now?&nbsp; You can set your username in
                    your profile&nbsp; settings after logging in.
                  </span>
                </span>
                {isUsernameValid(username) && showUsername ? (
                  showLoadingOnusernameChange ? (
                    <div className="cliploaderclassmobile">
                      <ClipLoader size={10} />
                    </div>
                  ) : (
                    <div className="green-circle-mobile"></div>
                  )
                ) : null}
                {isUsernameValid(username) && !showUsername ? (
                  showLoadingOnusernameChange ? (
                    <div className="cliploaderclassmobile">
                      <ClipLoader size={10} />
                    </div>
                  ) : (
                    <div className="red-circle-mobile"></div>
                  )
                ) : null}
              </div>
            </div>
            {usernameError && (
              <div className="error-message-mobile">{usernameError}</div>
            )}
            {username &&
            username.length < 3 &&
            username.length > 0 &&
            !usernameError ? (
              <span className="localStorageCheck localStorageCheckMobile">
                Enter a valid username.
              </span>
            ) : null}
          </div>
          <div className="input-wrapper">
            <div
              className={`input-icon ${
                isEmailValid(email) ? 'valid' : 'invalid'
              }`}
            >
              <label className="label__style__signup">
                <span>
                  Email address<span className="required__color">&nbsp;*</span>
                </span>
              </label>
              <img
                className="emailIcon"
                src={emailIcon.src}
                alt="email label"
              />
              <div className="error-container-mobile">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Trigger click event on the "Send OTP" button
                      document.getElementById('send__otp__button').click();
                    }
                  }}
                  className={`mobile__email__signup
                  input__style_mob ${
                    isEmailValid(email) ? 'valid' : 'invalid'
                  }`}
                  disabled={showOtpScreenSignUp || verifyEmail}
                />
                {isEmailValid(email) && (
                  <div className="green-circle-mobile"></div>
                )}
                <button
                  disabled={verifyEmail}
                  className={`send__otp__button
                  ${showSpinner ? 'increaseSendOTPWidth' : ''}
                  ${verifyEmail ? 'disablebutton' : null}`}
                  onClick={handleOtpButtonClickSignUp}
                >
                  {!verifyEmail ? (
                    showSpinner ? (
                      <ClipLoader size={12} />
                    ) : (
                      'Send OTP'
                    )
                  ) : (
                    'Verified'
                  )}
                </button>
              </div>
            </div>
            {emailError && (
              <div
                className={`error-message-mobile error-message-mobile-email
            ${verifyEmail ? 'changeErrorColorGreen' : ''}`}
              >
                {emailError}
              </div>
            )}
          </div>
          <div className="othersigninoptions">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="189"
              height="1"
              viewBox="0 0 189 1"
              fill="none"
            >
              <path
                d="M1 0.5L188 0.500016"
                stroke="#E1E1E1"
                strokeLinecap="round"
              />
            </svg>
            <p>Or</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="189"
              height="1"
              viewBox="0 0 189 1"
              fill="none"
            >
              <path
                d="M1 0.5L188 0.500016"
                stroke="#E1E1E1"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="othersigninbuttons">
            <button onClick={signInWithGoogle}>
              <img src={GoogleIcon.src} alt="google icon" />
              Continue with Google
            </button>
            <button onClick={signInWithLinkedin}>
              <img src={LinkedInIcon.src} alt="linkedin icon" />
              Continue with LinkedIn
            </button>
          </div>
        </form>
        <div className="link-button-container">
          <p> Already have an account? </p>
          <Link href="/log-in">Log In</Link>
        </div>
      </div>
      {showOtpScreenSignUp && (
        <div className="otp__style">
          <h2>VERIFY YOUR EMAIL ADDRESS</h2>
          <hr />
          <p>
            A verification code has been sent to&nbsp;
            <span className="sent__mail__otp">{email}</span>
          </p>
          <p className="otp__expiry__desc">
            Please check your inbox and enter the verification code below to
            verify your email address. The code will be valid for {seconds}{' '}
            seconds.
          </p>
          <div className="otp__input-container-otpbox">
            {otpValuesSignUp.map((value, index) => (
              <input
                key={index}
                className={`otp__input__four ${
                  showSignupOTPSuccess ? 'makeInputGreen' : ''
                } ${showSignupOTPError ? 'makeInputRed' : ''} `}
                ref={inputRefsSignUp[index]}
                type="text"
                value={value}
                onChange={(e) =>
                  handleOtpInputChangeSignUp(index, e.target.value)
                }
              />
            ))}
          </div>
          <button
            disabled={!loginButtonBg}
            className={`otp__verify ${loginButtonBg ? 'colorLoginButton' : ''}`}
            onClick={handleSignup}
          >
            {showSpinnerForVerifyOTP ? (
              <ClipLoader size={12} />
            ) : (
              'Verify and Sign Up'
            )}
          </button>
          <div className="otp__button-container">
            <button onClick={handleClickChangeEmail}>Change Mail</button>
            <button
              className={` ${
                showSendOTPAgainSignupSpinner
                  ? 'increaseResendOTPWidthPopup'
                  : ''
              }
          ${resendButton ? 'changeButtonColor' : ''}`}
              onClick={handleSendOTPAgainSignup}
              disabled={resendButton}
            >
              {showSendOTPAgainSignupSpinner ? (
                <ClipLoader size={12} />
              ) : (
                'Resend OTP'
              )}
            </button>
            {isOTPSentAgainSignup && (
              <div className="otp-popup-again-signup">
                <span className="otp__sent__style">OTP sent ✅</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SignUpMobile;
