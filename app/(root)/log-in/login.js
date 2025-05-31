'use client';

/*
  File: Login.js (OPTIMIZED)
  Description: Fast-loading login component that renders immediately while
  handling auth redirects in the background for optimal user experience.
*/

import { useContext, useEffect, useState } from 'react';
import '../sign-up/SignUpMobile.css';
import emailIcon from '@/public/SignIn/emailIcon.svg';
import otpIcon from '@/public/SignIn/otpIcon.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { privateAxios, publicAxios } from '@/config/axiosInstance.js';
import ClipLoader from 'react-spinners/ClipLoader';
import { UserContext } from '@/context/User/UserContext.js';
import showBottomMessage from '@/Utils/showBottomMessage.js';
import LinkedInIcon from '@/public/SignIn/LinkedInIcon.svg';
import GoogleIcon from '@/public/SignIn/GoogleIcon.svg';
import useAuthRedirect from '@/hooks/useAuthRedirect';

export default function Login() {
  // OPTIMIZED: Non-blocking auth redirect
  const { user: redirectUser, shouldShowAuthPage } = useAuthRedirect();
  
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const router = useRouter();
  
  // Form state
  const [prevLocation, setPrevLocation] = useState(null);
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');

  const [emailError, setEmailError] = useState('');
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [isOTPSentAgainLogin, setIsOTPSentAgainLogin] = useState(false);
  const [isEmailAndOTPEntered, setEmailandOTPEntered] = useState(false);

  const [onChangeEmailLoginInput, setOnChangeEmailLoginInput] = useState(true);
  const [userEmailNotExist, setUserEmailNotExist] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  
  const [loginButtonBg, setLoginButtonBg] = useState(false);
  const [showSpinnerLogin, setShowSpinnerLogin] = useState(false);
  const [loginEmailDisable, setloginEmailDisable] = useState(false);
  const [resendButton, setResendButton] = useState(true);
  const [emailLoginError, setEmailLoginError] = useState('');
  const [showSpinnerForLoginSendOTP, setShowSpinnerForLoginSendOTP] = useState(false);
  const [showSpinnerForLoginResendOTP, setShowSpinnerForLoginResendOTP] = useState(false);
  const [enableCross, setEnableCross] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  // Email validation
  const isEmailValid = (email) => {
    const emailPattern = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    return emailPattern.test(email) && email.endsWith('.com');
  };

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

  // OTP sending
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setOnChangeEmailLoginInput(true);
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
        }, 2000);
      }
    } catch (err) {
      const { status, data } = err.response || {};
      setShowSpinnerForLoginSendOTP(false);
      
      if (status === 404) {
        setEmailLoginError('Email does not exist!');
      } else if (status === 403) {
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
      setUserEmailNotExist(true);
    }
  };

  // Resend OTP
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
        }, 2000);
      }
    } catch (err) {
      const { status, data } = err.response || {};
      setShowSpinnerForLoginResendOTP(false);

      if (status === 404) {
        setEmailLoginError('Email does not exist!');
      } else if (status === 403) {
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
    }
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setShowSpinnerLogin(true);
    
    try {
      const res = await privateAxios.post('/login/verifyOTP', {
        email: email,
        enteredOTP: otpInput,
      });
      
      if (res.status === 200) {
        setUser(res.data.user);
        setShowSpinnerLogin(false);
        setOtpVerified(true);
        
        // Handle redirect
        let redirectTo = '/profile';
        if (typeof window !== 'undefined') {
          const storedRedirect = sessionStorage.getItem('redirectAfterLogin');
          if (storedRedirect) {
            redirectTo = storedRedirect;
            sessionStorage.removeItem('redirectAfterLogin');
          }
        }
        
        router.replace(redirectTo);
      }
    } catch (err) {
      const { status, data } = err.response || {};
      setShowSpinnerLogin(false);
      setOtpInput('');

      if (status === 403) {
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
    }
  };

  // Social login functions
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

  // Button color logic
  const handleLoginButtonColour = () => {
    if (email && otpInput.length >= 3) {
      setLoginButtonBg(true);
    } else {
      setLoginButtonBg(false);
    }
  };

  useEffect(() => {
    handleLoginButtonColour();
  }, [otpInput]);

  // Store redirect location for post-login navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const from = urlParams.get('from');
      if (from) {
        sessionStorage.setItem('redirectAfterLogin', from);
        setPrevLocation(from);
      }
    }
  }, []);

  // OPTIMIZED: Don't show loading states - render form immediately
  // The auth redirect will happen in the background if user is already logged in

  return (
    <>
      <div className="mob__container container">
        <h2 className="mob__header">Welcome Back!</h2>
        <form>
          <label className="label__style">Email address</label>
          <img
            className="loginImages loginImageIcon1"
            src={emailIcon.src}
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
              <img
                className="loginImages loginImageIcon2"
                src={otpIcon.src}
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
                      const numericValue = value.replace(/\D/g, '').slice(0, 4);
                      setOtpInput(numericValue);
                      setTimeout(() => handleLoginButtonColour(), 0);
                    }}
                    maxLength={4}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
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
                id="sendOTPButton"
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
              <img src={GoogleIcon.src} alt="google icon" />
              Continue with Google
            </button>
            <button onClick={signInWithLinkedin}>
              <img src={LinkedInIcon.src} alt="linkedin icon" />
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