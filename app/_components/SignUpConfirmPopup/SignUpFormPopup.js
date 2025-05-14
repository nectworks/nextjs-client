'use client';
/*
  File: SignUpFormPopup.js
  Description: This is a component rendered inside the profile page.
  This contains the pop up form for the user to fill in their details
  after signing up, with improved UX matching the provided designs
*/

import React, { useState, useRef, useEffect, useMemo } from 'react';
import './SignUpFormPopup.css';
import Image from 'next/image';
import { publicAxios } from '@/config/axiosInstance';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import showBottomMessage from '@/Utils/showBottomMessage';
import ClipLoader from 'react-spinners/ClipLoader';

const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const DISALLOWED_DOMAINS = /(gmail|hotmail|yahoo|outlook|icloud|aol)/i;

// Custom deep equal function to replace lodash/isEqual
function isDeepEqual(obj1, obj2) {
  // Check if both items are the same object or same primitive
  if (obj1 === obj2) return true;

  // Check if either is null or not an object
  if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return obj1 === obj2;
  }

  // Check if they're arrays
  const isArray1 = Array.isArray(obj1);
  const isArray2 = Array.isArray(obj2);
  
  if (isArray1 !== isArray2) return false;
  
  if (isArray1) {
    if (obj1.length !== obj2.length) return false;
    
    for (let i = 0; i < obj1.length; i++) {
      if (!isDeepEqual(obj1[i], obj2[i])) return false;
    }
    
    return true;
  }
  
  // They're both objects, compare keys
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  // Check each key exists in both and has the same value
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isDeepEqual(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

function SignUpFormPopup({ user, closePopUp }) {
  const privateAxios = usePrivateAxios();
  const otpInputRefs = useRef([]);
  const countrySelectRef = useRef(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    jobStatus: 'experienced', // Default to 'experienced' (Professional)
    jobTitle: '',
    companyName: '',
    location: '',
    mobileNumber: '',
    countryCode: '+91',
    experience: { years: '', months: '' },
    emailID: '',
    username: user.username,
    desiredIndustry: '',
    educationLevel: '',
  });
  
  // Store the original data to detect changes
  const [originalData, setOriginalData] = useState(null);
  
  // UI state management
  const [uiState, setUiState] = useState({
    currentStep: 1,
    maxSteps: 3, // Since we default to experienced
    canClose: false,
    isFirstTime: true,
    formError: null,
    isSubmitting: false,
    showCountryDropdown: false,
    saveInProgress: false,
    showCloseButton: false, // New state to control close button visibility
    formChanged: false, // Track if form data has changed from original
  });
  
  const [otpState, setOtpState] = useState({
    inputs: ['', '', '', ''],
    sent: false,
    verified: false,
    error: false,
    resendDisabled: false,
    countdown: 0,
    verificationInProgress: false,
  });

  // Username validation state
  const [checkUsernameExist, setCheckUsernameExist] = useState(false);
  const [showUsername, setShowUsername] = useState(false);
  const [showLoadingOnUsernameChange, setShowLoadingOnUsernameChange] = useState(false);
  
  // Check if this is the user's first time filling the form
  useEffect(() => {
    const filledExperience = localStorage.getItem('filledExperience');
    
    if (filledExperience) {
      setUiState(prev => ({ ...prev, isFirstTime: false }));
    }
    
    // Calculate max steps based on job status
    updateMaxSteps(formData.jobStatus);
  }, []);
  
  // Timer for OTP countdown
  useEffect(() => {
    let timer;
    if (otpState.countdown > 0) {
      timer = setTimeout(() => {
        setOtpState(prev => ({ ...prev, countdown: prev.countdown - 1 }));
        if (otpState.countdown === 1) {
          setOtpState(prev => ({ ...prev, resendDisabled: false }));
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [otpState.countdown]);
  
  // Check for form changes
  useEffect(() => {
    if (!originalData) return;
    
    // Compare current form data with original data
    const isChanged = !isDeepEqual(formData, originalData);
    
    // Update state only if the change status is different
    if (isChanged !== uiState.formChanged) {
      setUiState(prev => ({ ...prev, formChanged: isChanged }));
    }
  }, [formData, originalData, uiState.formChanged]);
  
  // Auto-save user inputs periodically
  useEffect(() => {
    // Only proceed if the form has changed
    if (!uiState.formChanged) return;
    
    // Debounce the save operation to avoid too many localStorage operations
    const saveTimeout = setTimeout(() => {
      if (uiState.saveInProgress) return;
      
      // Only save if user has entered some meaningful data
      const hasData = formData.mobileNumber || 
                     formData.jobTitle || 
                     formData.companyName || 
                     formData.desiredIndustry;
      
      if (hasData) {
        saveFormDataTempState();
      }
    }, 3000); // Save after 3 seconds of inactivity
    
    return () => clearTimeout(saveTimeout);
  }, [formData, uiState.formChanged, uiState.saveInProgress]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (countrySelectRef.current && !countrySelectRef.current.contains(event.target)) {
        setUiState(prev => ({ ...prev, showCountryDropdown: false }));
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle keyboard navigation in OTP inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!otpState.sent || otpState.verified) return;
      
      // Find the active element index
      const currentIndex = otpInputRefs.current.findIndex(
        ref => ref && document.activeElement === ref
      );
      
      if (currentIndex === -1) return;
      
      // Handle navigation
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        otpInputRefs.current[currentIndex - 1].focus();
      } else if (e.key === 'ArrowRight' && currentIndex < 3) {
        otpInputRefs.current[currentIndex + 1].focus();
      } else if (e.key === 'Backspace' && !otpState.inputs[currentIndex]) {
        // Move to previous input when backspace is pressed on an empty input
        if (currentIndex > 0) {
          otpInputRefs.current[currentIndex - 1].focus();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [otpState.sent, otpState.verified, otpState.inputs]);
  
  // Load saved temp state from localStorage
  useEffect(() => {
    const savedTempState = localStorage.getItem('signUpFormTempState');
    if (savedTempState) {
      try {
        const parsedState = JSON.parse(savedTempState);
        
        // Only use it if it's for the current user
        if (parsedState.userId === user._id) {
          let mobileNum = parsedState.mobileNumber || '';
          let countryCode = '+91';
          
          if (mobileNum.startsWith('+')) {
            const firstSpaceIndex = mobileNum.indexOf(' ');
            if (firstSpaceIndex > 0) {
              countryCode = mobileNum.substring(0, firstSpaceIndex);
              mobileNum = mobileNum.substring(firstSpaceIndex + 1);
            }
          }
          
          setFormData(prev => ({
            ...prev,
            jobStatus: parsedState.jobStatus || prev.jobStatus,
            jobTitle: parsedState.jobTitle || prev.jobTitle,
            companyName: parsedState.companyName || prev.companyName,
            location: parsedState.location || prev.location,
            mobileNumber: mobileNum,
            countryCode: countryCode,
            experience: parsedState.experience || prev.experience,
            emailID: parsedState.emailID || prev.emailID,
            username: parsedState.username || prev.username,
            desiredIndustry: parsedState.desiredIndustry || prev.desiredIndustry,
            educationLevel: parsedState.educationLevel || prev.educationLevel,
          }));
          
          // Update max steps based on job status
          updateMaxSteps(parsedState.jobStatus || prev.jobStatus);
        }
      } catch (error) {
        console.warn('Error parsing saved temp state:', error);
      }
    }
  }, [user._id]);
  
  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await publicAxios.get(`/signUpCards/get/${user._id}`);
        const { userDetails, username } = response.data;
        
        if (userDetails) {
          // Parse mobile number if it includes country code
          let mobileNum = userDetails.mobileNumber || '';
          let countryCode = '+91';
          
          if (mobileNum.startsWith('+')) {
            const firstSpaceIndex = mobileNum.indexOf(' ');
            if (firstSpaceIndex > 0) {
              countryCode = mobileNum.substring(0, firstSpaceIndex);
              mobileNum = mobileNum.substring(firstSpaceIndex + 1);
            }
          }
          
          // Update form data with fetched info
          const jobStatus = userDetails.companyName ? 'experienced' : 'fresher';
          
          const initialFormData = {
            jobStatus,
            jobTitle: userDetails.jobTitle || '',
            companyName: userDetails.companyName || '',
            location: userDetails.location || '',
            mobileNumber: mobileNum,
            countryCode: countryCode,
            experience: userDetails.experience || { years: '', months: '' },
            emailID: userDetails.emailID || '',
            desiredIndustry: userDetails.desiredIndustry || '',
            educationLevel: userDetails.educationLevel || '',
            username: username || user.username,
          };
          
          setFormData(initialFormData);
          // Save original data for comparison
          setOriginalData(JSON.parse(JSON.stringify(initialFormData)));
          
          // Update max steps based on job status
          updateMaxSteps(jobStatus);
          
          // If email is verified, set the verified state
          if (userDetails.emailVerified) {
            setOtpState(prev => ({ ...prev, verified: true }));
          }

          const hasCompletedFormBefore = Boolean(
            // Check for essential fields that indicate form completion
            userDetails.mobileNumber && 
            username &&
            (
              // Either professional path is complete
              (userDetails.jobTitle && userDetails.companyName) ||
              // Or student path is complete
              (userDetails.desiredIndustry && userDetails.educationLevel)
            )
          );
          
          // Enable close button if basic profile exists
          setUiState(prev => ({
            ...prev,
            isFirstTime: !hasCompletedFormBefore,
            canClose: hasCompletedFormBefore,
            showCloseButton: hasCompletedFormBefore
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Don't show an error message here as this is on initial load
        // and would be confusing to the user
      }
    };
    
    fetchUserData();
  }, [user._id]);

  // Check username existence when username changes
  useEffect(() => {
    // Only check if the username is valid and different from the original username
    if (isUsernameValid(formData.username) && 
        originalData && 
        formData.username !== originalData.username) {
      checkUsernameExists();
    } else if (originalData && formData.username === originalData.username) {
      // If username is unchanged, it's always valid (since it's already theirs)
      setCheckUsernameExist(false);
      setShowUsername(true);
      setShowLoadingOnUsernameChange(false);
    }
  }, [formData.username, originalData]);
  
  // Helpers
  const updateMaxSteps = (status) => {
    const maxSteps = status === 'experienced' ? 3 : 2;
    setUiState(prev => ({ ...prev, maxSteps }));
  };
  
  // Check if username exists
  const checkUsernameExists = async () => {
    setShowLoadingOnUsernameChange(true);
    try {
      const checkUser = await publicAxios.post('/signup/findusername', {
        username: formData.username,
      });
      if (checkUser.status === 200) {
        setShowLoadingOnUsernameChange(false);
        setShowUsername(false);
        setUiState(prev => ({ 
          ...prev, 
          formError: 'This username is already taken' 
        }));
        setCheckUsernameExist(true);
      }
    } catch (err) {
      setShowLoadingOnUsernameChange(false);
      setShowUsername(true);
      setCheckUsernameExist(false);
    }
  };
  
  // Auto-save form data to localStorage
  const saveFormDataTempState = () => {
    if (uiState.saveInProgress) return;
    
    setUiState(prev => ({ ...prev, saveInProgress: true }));
    
    try {
      // Combine country code and mobile number
      const fullMobileNumber = `${formData.countryCode} ${formData.mobileNumber}`;
      
      // Save to localStorage instead of making an API call
      const tempStateData = {
        ...formData,
        mobileNumber: fullMobileNumber,
        userId: user._id,
        isExperienced: formData.jobStatus === 'experienced',
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('signUpFormTempState', JSON.stringify(tempStateData));
    } catch (error) {
      // Silent error for background saves
      console.warn('Error saving temp state to localStorage:', error);
    } finally {
      setUiState(prev => ({ ...prev, saveInProgress: false }));
    }
  };
  
  // Function to check if the username is valid
  const isUsernameValid = (username) => {
    const usernamePattern =
      /^(?!admin|founder|support|contact|webmaster|postmaster|abuse|sales|privacy|webmail|email|domain)[A-Za-z0-9]{3,15}$/;
    return usernamePattern.test(username);
  };
  
  // Validation
  const validateEmailFormat = (email) => {
    if (!email) return { valid: false, message: 'Please enter a company email address' };
    if (!EMAIL_REGEX.test(email)) return { valid: false, message: 'Invalid email format' };
    
    const domain = email.split('@')[1];
    if (DISALLOWED_DOMAINS.test(domain)) {
      return { valid: false, message: 'Please enter a valid company email address' };
    }
    
    return { valid: true, message: '' };
  };
  
  const validateMobileNumber = (number) => {
    // Different countries have different mobile number formats
    // For simplicity, we're checking if it's at least 8 digits (most countries)
    // and at most 15 digits (international standard)
    
    if (!number) return { valid: false, message: 'Mobile number is required' };
    
    const numDigits = number.replace(/\D/g, '').length;
    
    if (numDigits < 8 || numDigits > 15) {
      return { 
        valid: false, 
        message: 'Mobile number should be between 8 and 15 digits' 
      };
    }
    
    // Special case for India (+91) - must be 10 digits
    if (formData.countryCode === '+91' && numDigits !== 10) {
      return { 
        valid: false, 
        message: 'Indian mobile numbers must be 10 digits' 
      };
    }
    
    return { valid: true, message: '' };
  };
  
  const canProceedToNextStep = () => {
    const { currentStep } = uiState;
    
    if (formData.jobStatus === 'experienced') {
      if (currentStep === 1) {
        return formData.jobTitle && formData.companyName;
      } else if (currentStep === 2) {
        const mobileValidation = validateMobileNumber(formData.mobileNumber);
        const usernameChanged = originalData && formData.username !== originalData.username;
        
        // Only check username existence if the username was changed
        // If username hasn't changed, we don't need to check existence
        // If username has changed, we need to ensure it doesn't exist (checkUsernameExist is false)
        const usernameIsValid = formData.username &&
                              isUsernameValid(formData.username) &&
                              (!usernameChanged || !checkUsernameExist);

        return mobileValidation.valid && 
              formData.experience.years &&
              usernameIsValid;
      } else if (currentStep === 3) {
        // Email is valid AND (OTP is verified OR not yet sent)
        const emailValidation = validateEmailFormat(formData.emailID);
        return emailValidation.valid && (otpState.verified || !otpState.sent);
      }
    } else { // fresher
      if (currentStep === 1) {
        return formData.desiredIndustry && formData.educationLevel;
      } else if (currentStep === 2) {
        const mobileValidation = validateMobileNumber(formData.mobileNumber);
        const usernameChanged = originalData && formData.username !== originalData.username;
        
        return mobileValidation.valid && 
               formData.username && 
               isUsernameValid(formData.username) &&
               // Only check existence if username was changed
               (!usernameChanged || (usernameChanged && !checkUsernameExist));
      }
    }
    return false;
  };
  
  // Check if form can be submitted (all required fields + email verification if experienced, and form data must have changed)
  const canSubmitForm = () => {
    // First check if the form has changed
    if (!uiState.formChanged) {
      return false;
    }

    // Check if username is valid
    if (!isUsernameValid(formData.username)) {
      return false;
    }

    // Only check for username existence if username has changed
    if (originalData && 
        formData.username !== originalData.username && 
        checkUsernameExist) {
      return false;
    }
    
    if (formData.jobStatus === 'experienced') {
      // If email is already verified, allow submission without requiring verification again
      if (otpState.verified) {
        return true;
      }
      
      // If user has sent OTP but not verified yet, require verification
      if (otpState.sent && !otpState.verified) {
        return false;
      }
      
      // If no OTP has been sent but the email is valid, allow submission
      const emailValidation = validateEmailFormat(formData.emailID);
      return emailValidation.valid;
    } else {
      // Fresher form can be submitted without email verification
      return true;
    }
  };
  
  // Event handlers
  const handleOptionChange = (value) => {
    setFormData(prev => ({ ...prev, jobStatus: value }));
    updateMaxSteps(value);
    setUiState(prev => ({ ...prev, currentStep: 1 }));
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'emailID' && otpState.sent) {
      // Reset OTP state if email is changed after OTP was sent
      setOtpState({
        inputs: ['', '', '', ''],
        sent: false,
        verified: false,
        error: false,
        resendDisabled: false,
        countdown: 0,
        verificationInProgress: false
      });
    }
    
    if (name === 'mobileNumber') {
      // Only allow digits for mobile number
      const digitsOnly = value.replace(/\D/g, '');
      
      // Limit by country code
      let maxLength = 15;
      
      // Special case for India: 10 digits
      if (formData.countryCode === '+91') {
        maxLength = 10;
      }
      
      // Enforce maximum length
      const trimmedValue = digitsOnly.slice(0, maxLength);
      
      setFormData(prev => ({ ...prev, mobileNumber: trimmedValue }));
    } else if (name === 'countryCode') {
      setFormData(prev => ({ ...prev, countryCode: value }));
      
      // Clear validation errors when country code changes
      setUiState(prev => ({ ...prev, formError: null }));
    } else if (name === 'username') {
      // Handle username validation
      const newUsername = value.trim().toLowerCase();
      setFormData(prev => ({ ...prev, username: newUsername }));
      
      // Validate username format
      if (value === '') {
        setUiState(prev => ({ ...prev, formError: null }));
      } else if (!isUsernameValid(value)) {
        setUiState(prev => ({ ...prev, formError: 'Username should be 3-15 characters (letters and numbers only)' }));
      } else {
        setUiState(prev => ({ ...prev, formError: null }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const toggleCountryDropdown = () => {
    setUiState(prev => ({ ...prev, showCountryDropdown: !prev.showCountryDropdown }));
  };
  
  const selectCountry = (code) => {
    setFormData(prev => ({ ...prev, countryCode: code }));
    setUiState(prev => ({ ...prev, showCountryDropdown: false }));
  };
  
  // OTP handling
  const handleOtpInputChange = (index, value) => {
    if (isNaN(value) || value.length > 1) return;
    
    const newOtpInputs = [...otpState.inputs];
    newOtpInputs[index] = value;
    
    setOtpState(prev => ({ ...prev, inputs: newOtpInputs, error: false }));
    
    // Move focus to next input
    if (value && index < 3) {
      otpInputRefs.current[index + 1].focus();
    }
  };
  
  const verifyOtp = async () => {
    const otp = otpState.inputs.join('');
    
    // Validate OTP format
    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      setOtpState(prev => ({ ...prev, error: true }));
      showBottomMessage('Please enter a valid 4-digit OTP');
      return;
    }
    
    setOtpState(prev => ({ ...prev, verificationInProgress: true }));
    
    try {
      const response = await privateAxios.post('/signUpCards/verifyOTP', {
        email: formData.emailID,
        enteredOTP: otp,
      });
      
      if (response.status === 200) {
        setOtpState(prev => ({ 
          ...prev, 
          verified: true, 
          error: false, 
          verificationInProgress: false 
        }));
        showBottomMessage('Email verified successfully!');
      } else {
        setOtpState(prev => ({ 
          ...prev, 
          error: true, 
          verificationInProgress: false 
        }));
        showBottomMessage('Invalid OTP. Please try again.');
      }
    } catch (error) {
      setOtpState(prev => ({ 
        ...prev, 
        error: true, 
        verificationInProgress: false 
      }));
      showBottomMessage('Invalid OTP. Please try again.');
    }
  };
  
  const handleSendOtp = async () => {
    try {
      await privateAxios.post('/signUpCards/generateOTP', {
        email: formData.emailID,
      });
      
      setOtpState({
        inputs: ['', '', '', ''],
        sent: true, 
        verified: false,
        error: false,
        resendDisabled: true,
        countdown: 60,
        verificationInProgress: false
      });
      
      showBottomMessage('OTP sent to your email');
      
      // Focus first OTP input
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 100);
    } catch (error) {
      showBottomMessage('Failed to send OTP. Please try again.');
    }
  };
  
  const handleResendOtp = async () => {
    if (otpState.resendDisabled) return;
    
    try {
      await privateAxios.post('/signUpCards/generateOTP', {
        email: formData.emailID,
      });
      
      setOtpState(prev => ({ 
        ...prev, 
        inputs: ['', '', '', ''],
        error: false,
        resendDisabled: true,
        countdown: 60,
        verificationInProgress: false
      }));
      
      // Focus first OTP input
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 100);
      
      showBottomMessage('OTP sent successfully');
    } catch (error) {
      showBottomMessage('Failed to send OTP. Please try again.');
    }
  };
  
  // Navigation
  const nextStep = () => {
    // Validate current step
    if (uiState.currentStep === 1 && formData.jobStatus === 'fresher' && !formData.educationLevel) {
      setUiState(prev => ({ ...prev, formError: 'Please select your education level' }));
      return;
    }
    
    if (uiState.currentStep === 2) {
      const mobileValidation = validateMobileNumber(formData.mobileNumber);
      if (!mobileValidation.valid) {
        setUiState(prev => ({ ...prev, formError: mobileValidation.message }));
        return;
      }

      // Check username
      if (!isUsernameValid(formData.username)) {
        setUiState(prev => ({ ...prev, formError: 'Username should be 3-15 characters (letters and numbers only)' }));
        return;
      }

      // Only check for username existence if username has changed
      if (originalData && 
          formData.username !== originalData.username && 
          checkUsernameExist) {
        setUiState(prev => ({ ...prev, formError: 'This username is already taken' }));
        return;
      }
    }
    
    if (canProceedToNextStep()) {
      // Clear any errors
      setUiState(prev => ({ 
        ...prev, 
        currentStep: prev.currentStep + 1,
        formError: null
      }));
      
      // Save form data when moving to next step
      saveFormDataTempState();
    }
  };
  
  const prevStep = () => {
    setUiState(prev => ({ 
      ...prev, 
      currentStep: Math.max(1, prev.currentStep - 1),
      formError: null
    }));
    
    // Save form data when moving to previous step
    saveFormDataTempState();
  };
  
  // Close popup handler
  const handleClosePopUp = () => {
    closePopUp();
  };
  
  // Final submission
  const handleSubmit = async () => {
    // For experienced users with unverified emails but OTP sent, require verification
    if (formData.jobStatus === 'experienced' && otpState.sent && !otpState.verified) {
      showBottomMessage('Please verify your company email before proceeding');
      return;
    }

    // Check username validation again
    if (!isUsernameValid(formData.username)) {
      setUiState(prev => ({ ...prev, formError: 'Username should be 3-15 characters (letters and numbers only)' }));
      return;
    }

    // Only check for username existence if username has changed
    if (originalData && 
        formData.username !== originalData.username && 
        checkUsernameExist) {
      setUiState(prev => ({ ...prev, formError: 'This username is already taken' }));
      return;
    }
    
    setUiState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      // Combine country code and mobile number
      const fullMobileNumber = `${formData.countryCode} ${formData.mobileNumber}`;
      
      const response = await publicAxios.put('/signUpCards/save', {
        ...formData,
        mobileNumber: fullMobileNumber,
        userId: user._id,
        isExperienced: formData.jobStatus === 'experienced',
      });
      
      if (response.status === 200 || response.status === 201) {
        // Application no longer depends on this
        // Still set localStorage for backward compatibility as we used this in the past
        localStorage.setItem('filledForm', 'true');
        
        if (uiState.isFirstTime) {
          localStorage.setItem('filledExperience', 'true');
        }
        
        // If user was previously a fresher and is now experienced, update status
        if (formData.jobStatus === 'experienced') {
          localStorage.setItem('isExperienced', 'true');
        }
        
        // Clear temporary state from localStorage since we've saved it permanently
        localStorage.removeItem('signUpFormTempState');
        
        showBottomMessage('Profile updated successfully!');

        // Now enable the close button
        setUiState(prev => ({ ...prev, showCloseButton: true }));

        setTimeout(() => {
          // Clear all form related localStorage items
          localStorage.removeItem('signUpFormTempState');
          localStorage.removeItem('filledExperience');
          
          closePopUp();
        }, 1000);
      }
    } catch (error) {
      console.error('Submit error:', error);
      showBottomMessage('Failed to save information. Please try again.');
    } finally {
      setUiState(prev => ({ ...prev, isSubmitting: false }));
    }
  };
  
  // Country code options
  const countryCodes = [
    { code: '+91', country: 'India' },
    { code: '+1', country: 'USA' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+86', country: 'China' },
    { code: '+49', country: 'Germany' },
    { code: '+81', country: 'Japan' },
    { code: '+65', country: 'Singapore' },
    { code: '+971', country: 'UAE' },
    { code: '+33', country: 'France' }
  ];
  
  // Education levels
  const educationLevels = [
    { value: '', label: 'Select your highest education' },
    { value: 'high_school', label: 'High School' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: 'Bachelor\'s Degree' },
    { value: 'master', label: 'Master\'s Degree' },
    { value: 'phd', label: 'PhD' }
  ];
  
  // Render step indicators
  const renderStepIndicators = () => {
    const { currentStep, maxSteps } = uiState;
    
    return (
      <div className="step-progress-container">
        {Array.from({ length: maxSteps }, (_, i) => i + 1).map(step => (
          <React.Fragment key={step}>
            <div className={`step-indicator ${
              step < currentStep ? 'completed' : 
              step === currentStep ? 'active' : ''
            }`}>
              {step < currentStep ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : step}
            </div>
            
            {step < maxSteps && (
              <div className={`step-connector ${step < currentStep ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  // Render form content
  const renderFormContent = () => {
    const { currentStep } = uiState;
    
    if (formData.jobStatus === 'fresher') {
      // Fresher form
      if (currentStep === 1) {
        return (
          <div className="form-step">
            <h2 className="step-title">Career Details</h2>
            
            <div className="form-field">
              <label>
                Desired Industry <span className="required-field">*</span>
              </label>
              <input
                type="text"
                name="desiredIndustry"
                value={formData.desiredIndustry}
                onChange={handleInputChange}
                placeholder="e.g. Technology, Finance"
                required
              />
            </div>
            
            <div className="form-field">
              <label>Desired Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Bangalore"
              />
            </div>
            
            <div className="form-field">
              <label>
                Education Level <span className="required-field">*</span>
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleInputChange}
                required
              >
                {educationLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            {uiState.formError && (
              <div className="form-error-message">{uiState.formError}</div>
            )}
          </div>
        );
      } else if (currentStep === 2) {
        return (
          <div className="form-step">
            <h2 className="step-title">Contact Information</h2>
            
            <div className="form-field">
              <label>
                Mobile Number <span className="required-field">*</span>
              </label>
              <div className="phone-input-group" ref={countrySelectRef}>
                <div className="country-code-container">
                  <div
                    className="country-code-select"
                    onClick={toggleCountryDropdown}
                  >
                    {formData.countryCode} ({countryCodes.find(c => c.code === formData.countryCode)?.country})
                    <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  
                  {uiState.showCountryDropdown && (
                    <div className="country-dropdown">
                      {countryCodes.map(country => (
                        <div
                          key={country.code}
                          className={`country-dropdown-item ${formData.countryCode === country.code ? 'selected' : ''}`}
                          onClick={() => selectCountry(country.code)}
                        >
                          {country.code} ({country.country})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="mobile-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-field">
              <label>
                Username <span className="required-field">*</span>
              </label>
              <div className="username-input-container" style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className={isUsernameValid(formData.username) && !checkUsernameExist ? 'valid' : ''}
                />
                {isUsernameValid(formData.username) && (
                  showLoadingOnUsernameChange ? (
                    <div className="loading-indicator" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                      <ClipLoader size={15} />
                    </div>
                  ) : (
                    showUsername ? (
                      <div className="valid-indicator" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    ) : (
                      <div className="invalid-indicator" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    )
                  )
                )}
              </div>
              {formData.username && formData.username.length < 3 && formData.username.length > 0 && (
                <div className="input-hint">Username should be at least 3 characters</div>
              )}
            </div>
            
            {uiState.formError && (
              <div className="form-error-message">{uiState.formError}</div>
            )}
            
            <div className="info-box">
              <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div className="info-content">
                <h4>Career Tip</h4>
                <p>When you get a job, you can update your profile by selecting &quot;Professional&quot; to fill in your job details and experience.</p>
              </div>
            </div>
          </div>
        );
      }
    } else {
      // Experienced form
      if (currentStep === 1) {
        return (
          <div className="form-step">
            <h2 className="step-title">Job Details</h2>
            
            <div className="form-field">
              <label>
                Job Title <span className="required-field">*</span>
              </label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                placeholder="e.g. UI/UX Designer"
                required
              />
            </div>
            
            <div className="form-field">
              <label>
                Company Name <span className="required-field">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="e.g. Amazon"
                required
              />
            </div>
            
            <div className="form-field">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Bangalore"
              />
            </div>
            
            {uiState.formError && (
              <div className="form-error-message">{uiState.formError}</div>
            )}
          </div>
        );
      } else if (currentStep === 2) {
        return (
          <div className="form-step">
            <h2 className="step-title">Experience & Contact</h2>
            
            <div className="form-field">
              <label>
                Mobile Number <span className="required-field">*</span>
              </label>
              <div className="phone-input-group" ref={countrySelectRef}>
                <div className="country-code-container">
                  <div
                    className="country-code-select"
                    onClick={toggleCountryDropdown}
                  >
                    {formData.countryCode} ({countryCodes.find(c => c.code === formData.countryCode)?.country})
                    <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  
                  {uiState.showCountryDropdown && (
                    <div className="country-dropdown">
                      {countryCodes.map(country => (
                        <div
                          key={country.code}
                          className={`country-dropdown-item ${formData.countryCode === country.code ? 'selected' : ''}`}
                          onClick={() => selectCountry(country.code)}
                        >
                          {country.code} ({country.country})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="mobile-input"
                  required
                />
              </div>
            </div>
            
            <div className="form-field">
              <label>
                Experience <span className="required-field">*</span>
              </label>
              <div className="experience-inputs">
                <input
                  type="text"
                  name="years"
                  value={formData.experience.years}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    experience: { ...prev.experience, years: e.target.value.replace(/\D/g, '') }
                  }))}
                  placeholder="Years"
                  maxLength={2}
                  className="experience-input"
                  required
                />
                <select
                  name="months"
                  value={formData.experience.months}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    experience: { ...prev.experience, months: e.target.value }
                  }))}
                  className="experience-input"
                >
                  <option value="">Months</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-field">
              <label>
                Username <span className="required-field">*</span>
              </label>
              <div className="username-input-container" style={{ position: 'relative' }}>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className={isUsernameValid(formData.username) && !checkUsernameExist ? 'valid' : ''}
                />
                {isUsernameValid(formData.username) && (
                  showLoadingOnUsernameChange ? (
                    <div className="loading-indicator" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                      <ClipLoader size={15} />
                    </div>
                  ) : (
                    showUsername ? (
                      <div className="valid-indicator" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    ) : (
                      <div className="invalid-indicator" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </div>
                    )
                  )
                )}
              </div>
              {formData.username && formData.username.length < 3 && formData.username.length > 0 && (
                <div className="input-hint">Username should be at least 3 characters</div>
              )}
            </div>
            
            {uiState.formError && (
              <div className="form-error-message">{uiState.formError}</div>
            )}
          </div>
        );
      } else if (currentStep === 3) {
        return (
          <div className="form-step">
            <h2 className="step-title">Email Verification</h2>
            
            <div className="form-field">
              <label>
                Company Email <span className="required-field">*</span>
              </label>
              <div className="email-input-group">
                <input
                  type="email"
                  name="emailID"
                  value={formData.emailID}
                  onChange={handleInputChange}
                  placeholder="user@company.com"
                  className={`email-input ${otpState.verified ? 'verified' : ''}`}
                  disabled={otpState.verified}
                  required
                />
                {!otpState.sent && !otpState.verified && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className={`send-otp-button ${!validateEmailFormat(formData.emailID).valid ? 'disabled' : ''}`}
                    disabled={!validateEmailFormat(formData.emailID).valid}
                  >
                    Send OTP
                  </button>
                )}
                {otpState.verified && (
                  <div className="verified-indicator">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Email validation error */}
              {formData.emailID && !validateEmailFormat(formData.emailID).valid && (
                <div className="input-error">
                  {validateEmailFormat(formData.emailID).message}
                </div>
              )}
              
              <p className="input-hint">Use your company email for verification</p>
            </div>
            
            {/* OTP Verification */}
            {otpState.sent && !otpState.verified && (
              <div className="otp-verification-section">
                <label>
                  Enter Verification Code <span className="required-field">*</span>
                </label>
                <div className="otp-inputs">
                  {Array(4).fill(0).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otpState.inputs[index]}
                      onChange={(e) => handleOtpInputChange(index, e.target.value)}
                      ref={el => otpInputRefs.current[index] = el}
                      className={otpState.error ? 'error' : ''}
                    />
                  ))}
                </div>
                
                <div className="verify-otp-container">
                  <button
                    type="button"
                    onClick={verifyOtp}
                    className={`verify-otp-button ${
                      otpState.inputs.some(input => !input) || otpState.verificationInProgress
                        ? 'disabled'
                        : ''
                    }`}
                    disabled={otpState.inputs.some(input => !input) || otpState.verificationInProgress}
                  >
                    {otpState.verificationInProgress ? (
                      <span className="loading-spinner small"></span>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>
                </div>
                
                <div className="otp-actions">
                  <span className="resend-timer">
                    {otpState.countdown > 0 ? `Resend in ${otpState.countdown}s` : ''}
                  </span>
                  {otpState.countdown === 0 && (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="resend-otp-button"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {otpState.verified && (
              <div className="profile-link-section">
                <div className="success-box">
                  <div className="success-header">
                    <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="16 12 12 16 8 12"></polyline>
                      <polyline points="12 8 12 16"></polyline>
                    </svg>
                    <h4>Email Verified Successfully!</h4>
                  </div>
                  <p>Your public profile is now available at:</p>
                  <div className="profile-url-container">
                    <a 
                      href={`/user/${formData.username}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="profile-url-link"
                    >
                      {typeof window !== 'undefined' ? window.location.origin : ''}/user/{formData.username}
                    </a>
                    <svg className="verified-check" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div className="profile-advice">
                    <p>
                      <strong>Note:</strong> You can still update your profile information and save changes.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Warning for transitioning from fresher to experienced */}
            {!user.isExperienced && (
              <div className="warning-box">
                <svg className="warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div className="warning-content">
                  <h4>Important Notice</h4>
                  <p>Verify email: share profile, manage all referrals in your dashboard. 🚫 No spam. EVER.</p>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    
    return null;
  };
  
  return (
    <div className="signup-form-overlay">
      <div className="signup-form-modal">
        {/* Only show the close button if user has completed the form */}
        {uiState.showCloseButton && (
          <button 
            className="form-header-close" 
            onClick={handleClosePopUp} 
            aria-label="Close form"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Header */}
        <div className="form-header">
          <h1>What&apos;s your job status?</h1>
          
          {/* Progress bar */}
          <div className="progress-bar">
            <div 
              className="progress-indicator"
              style={{ 
                width: `${(uiState.currentStep / uiState.maxSteps) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        {/* Job status selection - Only show both options if user is not experienced */}
        {!user.isExperienced && (
          <div className="job-status-selector">
            <div className="radio-option">
              <input
                type="radio"
                id="experienced"
                name="jobStatus"
                value="experienced"
                checked={formData.jobStatus === 'experienced'}
                onChange={() => handleOptionChange('experienced')}
              />
              <label htmlFor="experienced">Professional</label>
            </div>
            
            <div className="radio-option">
              <input
                type="radio"
                id="fresher"
                name="jobStatus"
                value="fresher"
                checked={formData.jobStatus === 'fresher'}
                onChange={() => handleOptionChange('fresher')}
              />
              <label htmlFor="fresher">Student</label>
            </div>
          </div>
        )}
        
        {/* Step indicators */}
        {renderStepIndicators()}
        
        {/* Form content */}
        <div className="form-content">
          {renderFormContent()}
        </div>
        
        {/* Form navigation */}
        <div className="form-navigation">
          {uiState.currentStep > 1 && (
            <button
              type="button"
              className="back-button"
              onClick={prevStep}
              disabled={uiState.isSubmitting}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Back
            </button>
          )}
          
          {uiState.currentStep < uiState.maxSteps ? (
            <button
              type="button"
              className={`next-button ${!canProceedToNextStep() ? 'disabled' : ''}`}
              onClick={nextStep}
              disabled={!canProceedToNextStep() || uiState.isSubmitting}
            >
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className={`submit-button ${!canSubmitForm() ? 'disabled' : ''}`}
              onClick={handleSubmit}
              disabled={!canSubmitForm() || uiState.isSubmitting}
            >
              {uiState.isSubmitting ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  {!user.isExperienced && formData.jobStatus === 'experienced' ? 
                    'Update as Professional' : 
                    uiState.formChanged ? 'Save Profile' : 'No Changes'}
                  {uiState.formChanged && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Step counter */}
        <div className="step-counter">
          Step {uiState.currentStep} of {uiState.maxSteps}
        </div>
      </div>
    </div>
  );
}

export default SignUpFormPopup;