'use client';
/*
  FileName - SignUpDesktop.js
  Desc - This file is a React component named SignUpDesktop
  responsible for rendering the sign-up and sign-in forms.
  It includes input fields for user information such as first name,
  last name, username, invite code, and email.
  It also handles the sending and verification of OTP (One-Time Password)
  for sign-up. The component toggles between sign-up and sign-in views with
  animations and includes various validation checks for input fields.
  The form submission and interaction with a server for sending OTP
  and user creation are also included. It utilizes several state variables,
  refs, and event handlers to manage user input and interactions effectively.
*/
import { useContext, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import './SignUpDesktop.css';
import infoIcon from '@/public/SignIn/userIcon.png';
import userNameIcon from '@/public/SignIn/userNameIcon.png';
import emailIcon from '@/public/SignIn/emailIcon.svg';
import otpIcon from '@/public/SignIn/otpIcon.svg';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { publicAxios } from '@/config/axiosInstance.js';
import ClipLoader from 'react-spinners/ClipLoader';
import scrollToTop from '@/Utils/scrollToTop';
import { privateAxios } from '@/config/axiosInstance.js';
import { UserContext } from '@/context/User/UserContext';
import showBottomMessage from '@/Utils/showBottomMessage';
import LinkedInIcon from '@/public/SignIn/LinkedInIcon.svg';
import GoogleIcon from '@/public/SignIn/GoogleIcon.svg';

// Main component
const SignUpDesktop = () => {
  const router = useRouter();
  // get the location from where the user was redirected to sign-up page.
  const [prevLocation, setPrevLocation] = useState(null);

  const getSignupInputValFromMain = localStorage.getItem('singupval');
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');

  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const [username, setUsername] = useState(getSignupInputValFromMain || '');
  const [usernameError, setUsernameError] = useState('');

  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isOTPSentAgainLogin, setIsOTPSentAgainLogin] = useState(false);
  const [isOTPSentAgainSignup, setIsOTPSentAgainSignup] = useState(false);
  const [isEmailAndOTPEntered, setEmailAndOTPEntered] = useState(false);

  // -----------------otp for sign__up----------

  const [showOtpScreenSignUp, setShowOtpScreenUp] = useState(false);
  const [otpValuesSignUp, setotpValuesSignUp] = useState(['', '', '', '']);

  // Create refs for each input field
  const inputRefsSignUp = [useRef(), useRef(), useRef(), useRef()];

  const [showSpinner, setShowSpinner] = useState(false);
  const [otpInput, setOtpInput] = useState('');

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
    if (router.query && router.query.from) {
      setPrevLocation(router.query.from);
    }
  }, [router.query]);

  const [checkUsernameExist, setcheckUsernameExist] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [showLoadingOnusernameChange, setShowLoadingOnusernameChange] =
    useState(false);

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
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault(); // Prevent the default Enter key behavior
      return;
    }

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
          setSeconds(0);
        }, 60000);
        setShowOtpScreenUp(true);
        document.body.style.overflow = 'hidden';
        window.scroll({
          top: 0, // Scroll to the top (y-coordinate = 0).
          left: 0, // Scroll to the left edge (x-coordinate = 0).
          behavior: 'smooth',
          // Use smooth scrolling animation for a nicer user experience.
        });
      }
    } catch (err) {
      setShowSpinner(false);
      setEmailError('Email already exists!');
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
      /^(?!admin|founder|support|contact|webmaster|postmaster|abuse|sales|privacy|webmail|email|domain)[A-Za-z0-9]{3,15}$/;
    return usernamePattern.test(username);
  };

  // Function to handle username change and validate it
  const handleUsernameChange = (e) => {
    const { value } = e.target;

    // Convert to lowercase
    const newUsername = e.target.value.trim().toLowerCase();

    setUsername(newUsername);
    if (value === '') {
      setUsernameError('');
    } else if (!isUsernameValid(value)) {
      setUsernameError('Maximum 3-15 characters');
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
  const [onChangeEmailLoginInput, setOnChangeEmailLoginInput] = useState(true);
  const [disableButton, setDisableButton] = useState(true);
  const [showEmailUsernameExistError, setShowEmailUsernameExistError] =
    useState(false);
  // Function to handle email change and validate it
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
    if (value) {
      setOnChangeEmailLoginInput(false);
      setShowEmailUsernameExistError(false);
    }
    if (value === '') {
      setEmailError('');
    } else if (!isEmailValid(value)) {
      setEmailError('Please enter a valid email address');
      setDisableButton(true);
    } else {
      setEmailError('');
      setDisableButton(false);
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

    // convert first character to upperCase and other characters to lowerCase
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

    // convert first character to upperCase and other characters to lowerCase
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

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if any of the required fields are empty
    if (firstName.trim() === '') {
      setFirstNameError('First name is required');
    }

    if (lastName.trim() === '') {
      setLastNameError('Last name is required');
    }

    if (email.trim() === '') {
      setEmailError('Email is required');
    }

    // Check if there are any errors in the form
    if (firstNameError || lastNameError || emailError) {
      // If there are errors, do not proceed with form submission
      return;
    }
  };

  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  // Create refs for each input field
  const [showSpinnerLogin, setShowSpinnerLogin] = useState(false);

  // Refs for handling animation and UI
  const contRef = useRef(null);
  const imgBtnRef = useRef(null);

  // Function to handle image button click and toggle form view
  const handleImgBtnClick = () => {
    contRef.current.classList.toggle('s--signup');
  };

  const [loginEmailDisable, setloginEmailDisable] = useState(false);
  const [resendButton, setResendButton] = useState(true);
  const [emailLoginError, setEmailLoginError] = useState('');
  const [showSpinnerForLoginSendOTP, setShowSpinnerForLoginSendOTP] =
    useState(false);

  const handleSendOTP = async (e) => {
    if (!email) {
      setOnChangeEmailLoginInput(true);
    }
    if (!email) {
      setEmailLoginError('Please enter email');
      return;
    }

    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault(); // Prevent the default Enter key behavior
      return;
    }
    setShowSpinnerForLoginSendOTP(true);
    try {
      const sendOTP = await publicAxios.post('/signUpCards/generateOTP', {
        email: email,
      });
      if (sendOTP.status == 200) {
        setShowSpinnerForLoginSendOTP(false);
        setDisableButton(true);
        setTimeout(() => {
          setResendButton(false);
        }, 60000);
        setIsOTPSent(true);
        setEmailAndOTPEntered(true);
        setloginEmailDisable(true);
        setTimeout(() => {
          setIsOTPSent(false);
        }, 2000); // Hide the OTP sent popup after 5 seconds
      }
    } catch (err) {
      const { status, data } = err.response;

      if (status === 404) {
        setEmailLoginError('Email does not exist!');
      } else if (status === 403) {
        setDisableButton(true);

        // user has been blocked from logging in
        const banTime = new Date(parseInt(data.banTime));
        const banTimeString = banTime.toLocaleTimeString();
        const banDateString = banTime.toLocaleDateString();
        showBottomMessage(
          `You've been blocked from signing in till ${banDateString} ${banTimeString}`,
          10000
        );
      } else {
        showBottomMessage('Unknown error occured');
      }

      setShowEmailUsernameExistError(true);
      setShowSpinnerForLoginSendOTP(false);
    }
  };
  const [showSpinnerForLoginResendOTP, setShowSpinnerForLoginResendOTP] =
    useState(false);
  const handleSendOTPAgainLogin = async (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault(); // Prevent the default Enter key behavior
      return;
    }
    setShowSpinnerForLoginResendOTP(true);
    try {
      const sendOTP = await publicAxios.post('signUpCards/generateOTP', {
        email: email,
      });
      if (sendOTP.status === 200) {
        setShowSpinnerForLoginResendOTP(false);
        setEnableCross(false);
        setOtpVerified(false);
        setOtpValues(['', '', '', '']);
        setResendButton(true);
        setTimeout(() => {
          setResendButton(false);
        }, 60000);
        setIsOTPSentAgainLogin(true);
        setTimeout(() => {
          setIsOTPSentAgainLogin(false);
        }, 2000); // Hide the OTP sent popup after 5 seconds
      }
    } catch (err) {
      const { status, data } = err.response;

      if (status === 404) {
        setEmailLoginError('Email does not exist!');
      } else if (status === 403) {
        // user has been blocked from logging in
        const banTime = new Date(parseInt(data.banTime));
        const banTimeString = banTime.toLocaleTimeString();
        const banDateString = banTime.toLocaleDateString();
        showBottomMessage(
          `You've been blocked from signing in till ${banDateString} ${banTimeString}`,
          10000
        );
      } else {
        showBottomMessage('Unknown error occured');
      }
      setShowSpinnerForLoginResendOTP(false);
    }
  };

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
          setSeconds(0);
        }, 60000);
        setIsOTPSentAgainSignup(true);
        setotpValuesSignUp(['', '', '', '']);
        setTimeout(() => {
          setIsOTPSentAgainSignup(false);
        }, 2000); // Hide the OTP sent popup after 2 seconds
      }
    } catch (err) {
      setShowSendOTPAgainSignupSpinner(false);
      setLoginButtonBg(false);
    }
  };
  const [enableCross, setEnableCross] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // function to login the user
  const handleLogin = async (e) => {
    e.preventDefault();
    setShowSpinnerLogin(true);
    try {
      const res = await privateAxios.post('/login/verifyOTP', {
        email: email,
        enteredOTP: otpInput, // Use the single input value
      });
      if (res.status === 200) {
        setUser(res.data.user);
        setShowSpinnerLogin(false);
        setOtpVerified(true);
        router.push(prevLocation || '/profile', {
          state: {
            from: '/log-in',
          },
          replace: true,
        });
      }
    } catch (err) {
      const { status, data } = err.response;

      if (status === 403) {
        // user has been blocked from logging in
        const banTime = new Date(parseInt(data.banTime));
        const banTimeString = banTime.toLocaleTimeString();
        const banDateString = banTime.toLocaleDateString();
        showBottomMessage(
          `You've been blocked from signing in till ${banDateString} ${banTimeString}`,
          10000
        );
      } else if (status === 400) {
        showBottomMessage(data.message);
      } else {
        showBottomMessage('Unknown error occurred');
      }

      setOtpInput(''); // Clear OTP input on error
      setShowSpinnerLogin(false);
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

        router.push(prevLocation || '/profile', {
          state: {
            from: '/sign-up',
          },
          replace: true,
        });
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

  const handleLoginButtonColour = () => {
    if (email && otpInput) {
      setLoginButtonBg(true);
    } else {
      setLoginButtonBg(false);
    }
  };

  useEffect(() => {
    /* if the user is already registered, redirect them to where they came from
           or to the profile page */
    if (user) {
      router.push(prevLocation || '/profile', { replace: true });
      return;
    }
  }, []);

  // JSX return
  return (
    <>
      <div
        className={`outerLayer__signIn ${showOtpScreenSignUp ? 'blurBG' : ''}`}
      >
        <div className="signIn-container cont" ref={contRef}>
          <div className="form sign-in">
            {/* Add your sign-in form content here */}
            <p className="welcome__back__header">Let’s get you started!</p>
            <div
              className="container__whole"
              style={{ position: 'relative', left: '2rem' }}
            >
              <form onSubmit={handleSubmit}>
                <div className="first__block">
                  <div className="first__name__container">
                    <div className="input-wrapper">
                      <label className="input__header">
                        First Name
                        <span className="required__color">&nbsp;*</span>
                      </label>
                      <img src={infoIcon.src} alt="first name label" />
                      <div
                        className={`input-icon ${
                          isNameValid(firstName) ? 'valid' : 'invalid'
                        }`}
                      >
                        <div className="error-container">
                          <input
                            id="input__width"
                            type="text"
                            value={firstName}
                            onChange={handleFirstNameChange}
                            className={
                              isNameValid(firstName) ? 'valid' : 'invalid'
                            }
                            disabled={showOtpScreenSignUp}
                          />
                          {isNameValid(firstName) && (
                            <div className="green-circle-first"></div>
                          )}
                        </div>
                        {firstNameError && (
                          <div className="error-message">{firstNameError}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Last Name */}
                  <div className="last__name__container">
                    <div className="input-wrapper">
                      <label>
                        Last Name
                        <span className="required__color">&nbsp;*</span>
                      </label>
                      <img src={infoIcon.src} alt="last name label" />
                      <div
                        className={`input-icon ${
                          isNameValid(lastName) ? 'valid' : 'invalid'
                        }`}
                      >
                        <input
                          type="text"
                          id="input__width"
                          value={lastName}
                          onChange={handleLastNameChange}
                          className={
                            isNameValid(lastName) ? 'valid' : 'invalid'
                          }
                          disabled={showOtpScreenSignUp}
                        />
                        {isNameValid(lastName) && (
                          <div className="green-circle"></div>
                        )}
                      </div>
                      {lastNameError && (
                        <div className="error-message">{lastNameError}</div>
                      )}
                    </div>
                  </div>
                  {/* Last Name */}
                </div>
                <div className="second__block">
                  <div className="first__name__container">
                    <div className="input-wrapper">
                      <label className="input__header">Username</label>
                      <img src={userNameIcon.src} alt="username label" />
                      <div
                        className={`input-icon ${
                          isUsernameValid(username) ? 'valid' : 'invalid'
                        }`}
                      >
                        <input
                          id="input__width"
                          type="text"
                          value={username}
                          onChange={handleUsernameChange}
                          className={
                            isUsernameValid(username) ? 'valid' : 'invalid'
                          }
                          disabled={showOtpScreenSignUp}
                        />
                        <span className="info__icon tooltip">
                          i
                          <span className="tooltiptext">
                            Once set, usernames cannot be changed. Not sure
                            about the username right now? You can set your
                            username in your profile settings after logging in.
                          </span>
                        </span>
                        {isUsernameValid(username) && showUsername ? (
                          showLoadingOnusernameChange ? (
                            <div className="cliploaderclass">
                              <ClipLoader size={10} />
                            </div>
                          ) : (
                            <div className="green-circle"></div>
                          )
                        ) : null}
                        {isUsernameValid(username) && !showUsername ? (
                          showLoadingOnusernameChange ? (
                            <div className="cliploaderclass">
                              <ClipLoader size={10} />
                            </div>
                          ) : (
                            <div className="red-circle"></div>
                          )
                        ) : null}
                      </div>
                      {usernameError && (
                        <div className="error-message">{usernameError}</div>
                      )}
                      {username &&
                      username.length < 3 &&
                      username.length > 0 &&
                      !usernameError ? (
                        <span className="localStorageCheck">
                          Enter a valid username.
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="third__block">
                  <div className="input-wrapper">
                    <label
                      className="first__name__container"
                      style={{ position: 'relative', right: '6rem' }}
                    >
                      Email address
                      <span className="required__color">&nbsp;*</span>
                    </label>
                    <img src={emailIcon.src} alt="user's email label" />
                    <div
                      className={`input-icon ${
                        isEmailValid(email) ? 'valid' : 'invalid'
                      }`}
                    >
                      <input
                        type="text"
                        id="input__email__width-signUp"
                        value={email}
                        onChange={handleEmailChange}
                        className={isEmailValid(email) ? 'valid' : 'invalid'}
                        disabled={showOtpScreenSignUp || verifyEmail}
                      />
                      {isEmailValid(email) && (
                        <div className="green-circle"></div>
                      )}
                    </div>
                    {emailError && (
                      <div
                        className={`error-message ${
                          verifyEmail ? 'changeErrorColorGreen' : ''
                        }`}
                      >
                        {emailError}
                      </div>
                    )}
                  </div>
                  <button
                    disabled={verifyEmail}
                    className={`send__otp__signUp ${
                      showSpinner ? 'increaseSendOTPWidth' : ''
                    }${verifyEmail ? 'send__otp__signUpcolor' : ''}
                        ${disableButton ? 'changeSendOtpColor' : ''}`}
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
                    )}{' '}
                  </button>
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
                <div className={'last__block'}>
                  <div className="check__box__details">
                    <p>
                      By clicking the Sign Up, you agree to the Nectworks&nbsp;
                      <Link
                        className="Link__color__blue"
                        href="/privacy-policy"
                        onClick={scrollToTop}
                      >
                        Privacy Policy
                      </Link>{' '}
                      and&nbsp;
                      <Link
                        href="/terms-and-conditions"
                        className="Link__color__blue"
                        onClick={scrollToTop}
                      >
                        User Agreement
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="sub-cont">
            <div className="img">
              {/* Image and text content */}
              <div className="img__text m--up">
                <h2 className="rightAlignedHeading">One of us?</h2>
                <p className="rightAlignedPara">
                  Sign in to your account and get started.
                </p>
              </div>

              <div className="img__text m--in">
                <h2 className="leftAlignedHeading">New here?</h2>
                <p className="leftAlignedPara">
                  Create your account in just a couple of seconds.
                </p>
              </div>
              <div
                className={`img__btn ${showOtpScreenSignUp ? 'disabled' : ''}`}
                ref={imgBtnRef}
                onClick={handleImgBtnClick}
              >
                <span className="m--up">Log In</span>
                <span className="m--in">Sign Up</span>
              </div>
            </div>
            <div className="form sign-up">
              <p className="welcome__back__header">Welcome Back!</p>
              <div className="web__sign__up">
                <div className="input-wrapper">
                  <label
                    className="email__container"
                    style={{ position: 'relative', right: '15.8rem' }}
                  >
                    Email address
                  </label>
                  <img src={emailIcon.src} alt="email label" />
                  <div
                    className={`input-icon ${isEmailValid(email) ? 'valid' : 'invalid'}`}
                  >
                    <input
                      type="text"
                      id="input__email__width-Login"
                      value={email}
                      onChange={handleEmailChange}
                      className={isEmailValid(email) ? 'valid' : 'invalid'}
                      disabled={showOtpScreenSignUp || verifyEmail}
                      onKeyDown={(event) => {
                        if (
                          event.key === 'Enter' &&
                          event.target.id === 'input__email__width-Login'
                        ) {
                          event.preventDefault();
                          document.getElementById('send__otp__logIn').click();
                        }
                      }}
                    />
                    {emailError && (
                      <div
                        className={`error-message ${
                          verifyEmail ? 'changeErrorColorGreen' : ''
                        }`}
                      >
                        {emailError}
                      </div>
                    )}
                    {onChangeEmailLoginInput && (
                      <div className={'error-message'}>{emailLoginError}</div>
                    )}
                    {showEmailUsernameExistError && (
                      <div className={'error-message'}>{emailLoginError}</div>
                    )}
                    <button
                      disabled={disableButton}
                      id="send__otp__logIn"
                      className={`send__otp__logIn ${
                        showSpinnerForLoginSendOTP ? 'increaseSendOTPWidth' : ''
                      } ${disableButton ? 'changeSendOtpColor' : ''}`}
                      onClick={handleSendOTP}
                    >
                      {showSpinnerForLoginSendOTP ? (
                        <ClipLoader size={12} />
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  </div>
                </div>
                {isOTPSent && (
                  <div className="otp-popup-inLoginDesktopPage">
                    <span className="otp__sent__style">OTP sent ✅</span>
                  </div>
                )}
                <div className="input-wrapper">
                  <div
                    className={`input-wrapper-1 ${isEmailAndOTPEntered ? 'show' : ''}`}
                  >
                    <div className="otp__container__log__in">
                      <label
                        className="first__name__container"
                        style={{ position: 'relative', right: '15.8rem' }}
                      >
                        OTP
                      </label>

                      <div className="otp__input-container">
                        <img src={otpIcon.src} alt="" />
                        <input
                          type="text"
                          value={otpInput}
                          onChange={(e) => {
                            const { value } = e.target;
                            // Filter out non-numeric characters
                            const numericValue = value.replace(/\D/g, '');
                            // Update the state with the filtered value
                            setOtpInput(numericValue);
                            if (numericValue.length === 4) {
                              handleLoginButtonColour();
                            }
                          }}
                          maxLength={4}
                        />
                      </div>
                      <button
                        className={`log__in__resend__otp ${
                          showSpinnerForLoginResendOTP
                            ? 'increaseResendOTPWidth'
                            : ''
                        } ${resendButton ? 'changeButtonColor' : ''}`}
                        onClick={handleSendOTPAgainLogin}
                        disabled={resendButton}
                      >
                        {showSpinnerForLoginResendOTP ? (
                          <ClipLoader size={12} />
                        ) : (
                          'Resend OTP'
                        )}
                      </button>
                      {isOTPSentAgainLogin && (
                        <div className="otp-popup-again">
                          <span className="otp__sent__style">OTP sent ✅</span>
                        </div>
                      )}
                    </div>
                    <button
                      disabled={!loginButtonBg}
                      className={`log__in__btn ${
                        !loginEmailDisable ? 'loginNoCursor' : ''
                      } ${loginButtonBg ? 'colorLoginButton' : ''}`}
                      onClick={handleLogin}
                    >
                      {showSpinnerLogin ? <ClipLoader size={12} /> : 'Log In'}
                    </button>
                  </div>
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
              </div>
            </div>
          </div>
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
export default SignUpDesktop;
