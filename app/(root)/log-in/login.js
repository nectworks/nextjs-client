'use client';

/*
  FileName - Login.js
  Desc - This file defines a React component (LoginForm) responsible for rendering a user login form, handling OTP verification, and providing responsive behavior based on the screen width. It enhances user experience by offering OTP-based authentication for a smooth login process.
*/

import { useContext, useEffect, useState } from 'react';
import '../sign-up/SignUpMobile.css';
import emailIcon from '@/public/SignIn/emailIcon.svg';
import otpIcon from '@/public/SignIn/otpIcon.svg';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { privateAxios, publicAxios } from '@/config/axiosInstance.js';
import ClipLoader from 'react-spinners/ClipLoader';
import { UserContext } from '@/context/User/UserContext.js';
import showBottomMessage from '@/Utils/showBottomMessage.js';
import LinkedInIcon from '@/public/SignIn/LinkedInIcon.svg';
import GoogleIcon from '@/public/SignIn/GoogleIcon.svg';

export default function Login() {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const router = useRouter();
  // get the location from where the user was redirected to login page.
  const [prevLocation, setPrevLocation] = useState(null);
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // eslint-disable-next-line no-unused-vars
  const [emailError, setEmailError] = useState('');
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isOTPSentAgainLogin, setIsOTPSentAgainLogin] = useState(false);
  const [isEmailAndOTPEntered, setEmailandOTPEntered] = useState(false);

  // -----------------otp for sign_up----------
  const [showOtpScreenSignUp] = useState(false);

  // Function to check if the email is valid
  const isEmailValid = (email) => {
    const emailPattern = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return emailPattern.test(email) && email.endsWith('.com');
  };
  const [onChangeEmailLoginInput, setOnChangeEmailLoginInput] = useState(true);
  const [userEmailNotExist, setUserEmailNotExist] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  // Function to handle email change and validate it
  const handleEmailChange = (e) => {
    const { value } = e.target;
    if (value) {
      setOnChangeEmailLoginInput(false);
      setUserEmailNotExist(false);
    }
    setEmail(value);
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

  const [otpValues, setOtpValues] = useState(['', '', '', '']);

  const [loginButtonBg, setLoginButtonBg] = useState(false);
  const [showSpinnerLogin, setShowSpinnerLogin] = useState(false);

  const [loginEmailDisable, setloginEmailDisable] = useState(false);
  const [resendButton, setResendButton] = useState(true);
  const [emailLoginError, setEmailLoginError] = useState('');
  const [showSpinnerForLoginSendOTP, setShowSpinnerForLoginSendOTP] =
    useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setOnChangeEmailLoginInput(true);
    }
    if (!email) {
      setEmailLoginError('Please enter email');
      return;
    }
    setShowSpinnerForLoginSendOTP(true);
    try {
      const sendOTP = await publicAxios.post('/login/generateOTP', {
        email: email,
      });
      if (sendOTP.status == 200) {
        setShowSpinnerForLoginSendOTP(false);
        setDisableButton(true);
        setTimeout(() => {
          setResendButton(false);
        }, 60000);
        setIsOTPSent(true);
        setEmailandOTPEntered(true);
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
        // user has been blocked from logging in
        const banTime = new Date(parseInt(data.banTime));
        const banTimeString = banTime.toLocaleTimeString();
        const banDateString = banTime.toLocaleDateString();
        showBottomMessage(
          `You've been blocked from signing in till ${banDateString} ${banTimeString}`,
          10000
        );
      } else {
        console.log(`status code: ${status}, Error: ${data}`);
        showBottomMessage('Unknown error occured');
      }
      setUserEmailNotExist(true);
      setShowSpinnerForLoginSendOTP(false);
    }
  };

  const [showSpinnerForLoginResendOTP, setShowSpinnerForLoginResendOTP] =
    useState(false);
  const handleSendOTPAgainLogin = async (e) => {
    e.preventDefault();
    setShowSpinnerForLoginResendOTP(true);
    try {
      const sendOTP = await publicAxios.post('/login/generateOTP', {
        email: email,
      });
      if (sendOTP.status === 200) {
        setShowSpinnerForLoginResendOTP(false);
        setEnableCross(false);
        setOtpVerified(false);
        setResendButton(true);
        setTimeout(() => {
          setResendButton(false);
        }, 60000);
        setIsOTPSentAgainLogin(true);
        setOtpValues(['', '', '', '']);
        setTimeout(() => {
          setIsOTPSentAgainLogin(false);
        }, 2000); // Hide the OTP sent popup after 2 seconds
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
        router.replace(prevLocation || '/profile');
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
    if (router.query && router.query.from) {
      setPrevLocation(router.query.from);
    }
  }, [router.query]);

  useEffect(() => {
    /* if the user is already registered, redirect them to where they came from
       or to the profile page */
    if (user) {
      router.replace(prevLocation || '/profile');
      return;
    }
  }, [user]);

  return (
    <>
      <div
        className={`mob__container container 
              ${showOtpScreenSignUp ? 'blurBG' : ''}`}
      >
        <h2 className="mob__header">Welcome Back!</h2>
        <form>
          <label className="label__style">Email address</label>
          <Image
            className="loginImages loginImageIcon1"
            src={emailIcon}
            alt="username or email label"
          />
          <div className="loginMobileInput">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`${isEmailValid(email) ? 'valid' : 'invalid'}`}
              disabled={loginEmailDisable}
            />
            {emailError && <div className="error-message">{emailError}</div>}
            {userEmailNotExist && (
              <div className={'error__login__email__user'}>
                {emailLoginError}
              </div>
            )}
            <button
              disabled={disableButton}
              className={`${showSpinnerForLoginSendOTP ? 'increaseSendOTPWidth' : ''}${disableButton ? 'changeSendOtpColor1' : ''}`}
              onClick={handleSendOTP}
            >
              {showSpinnerForLoginSendOTP ? (
                <ClipLoader size={12} />
              ) : (
                'Send OTP'
              )}
            </button>
          </div>

          {isOTPSent && (
            <div className="otp-popup-mobile-inLoginPage">
              <span className="otp__sent__style">OTP sent✅</span>
            </div>
          )}

          <div
            className={`login-wrapper-forLoginPage ${isEmailAndOTPEntered ? 'show' : ''}`}
          >
            <div className="otp-container">
              {onChangeEmailLoginInput && (
                <div className={'error__login__email'}>{emailLoginError}</div>
              )}

              <label className="label__style">OTP</label>
              <Image
                className="loginImages loginImageIcon2"
                src={otpIcon}
                alt="otp label"
              />

              <div
                className={`input__resend__otp ${enableCross || otpVerified ? 'input__resend__otp__cross' : ''}`}
              >
                <div className="otp__input-container-login">
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
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        // Trigger click event on the "Send OTP" button
                        document.getElementById('sendOTPButton').click();
                      }
                    }}
                  />
                </div>
                <button
                  className={`${showSpinnerForLoginResendOTP ? 'increaseResendOTPWidth' : ''} ${resendButton ? 'changeButtonColor' : ''}`}
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
                  <div className="otp-popup-again-mobile">
                    <span className="otp__sent__style">OTP sent ✅</span>
                  </div>
                )}
              </div>
            </div>
            <div className="login-container">
              <button
                disabled={!loginButtonBg}
                type="button"
                className={`colorBgg ${!loginEmailDisable ? 'loginNoCursor' : ''} ${loginButtonBg ? 'colorLoginButton' : ''}`}
                onClick={handleLogin}
              >
                {showSpinnerLogin ? <ClipLoader size={12} /> : 'Log In'}
              </button>
            </div>
          </div>
          <div className="gap-for-other-buttons"></div>
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
              <Image src={GoogleIcon} alt="google icon" />
              Continue with Google
            </button>
            <button onClick={signInWithLinkedin}>
              <Image src={LinkedInIcon} alt="linkedin icon" />
              Continue with LinkedIn
            </button>
          </div>
          <div className="link-button-container">
            <p> New to Nectworks? </p>
            <Link href="/sign-up">Join now</Link>
          </div>
        </form>
      </div>
    </>
  );
}
