'use client';
/*
  File: SignUpFormPopup.js
  Description: This file contains the pop up
  form for the user to fill in their details
  after signing up.
*/

import React, { useState, useRef, useEffect } from 'react';
import './SignUpFormPopup.css';
import Image from 'next/image';
import { publicAxios } from '@/config/axiosInstance';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import showBottomMessage from '@/Utils/showBottomMessage';

function SignUpFormPopup({ user, closePopUp }) {
  const privateAxios = usePrivateAxios();

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

  const [firstTimeFill, setFirstTimeFill] = useState(true); // State variable to track first time fill

  useEffect(() => {
    // Check if the form has been filled for the first time
    const filledExperience = localStorage.getItem('filledExperience');
    if (filledExperience) {
      setFirstTimeFill(false); // Update state when form is filled for the first time
    }
  }, []);

  const [formData, setFormData] = useState({
    jobStatus: 'experienced',
    jobTitle: '',
    companyName: '',
    location: '',
    mobileNumber: '',
    experience: '',
    emailID: '',
    username: user.username,
  });

  const [jobTitleSuggestions, setJobTitleSuggestions] = useState([]);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // function to fetch auto suggestions from the backend
  async function fetchAutoSuggestions(url, data) {
    try {
      const res = await privateAxios.get(url, { params: data });

      if (res.status === 200) {
        return res.data.suggestions;
      }
    } catch (error) {
      return [];
    }
  }

  async function updateAutoSuggestions(inputText, attribute) {
    if (inputText.length === 0) {
      attribute === 'jobtitles'
        ? setJobTitleSuggestions([])
        : setLocationSuggestions([]);
      return;
    }

    const url = `/suggestions/${attribute}`;
    const data = { text: inputText };
    const suggestions = await fetchAutoSuggestions(url, data);

    attribute === 'jobtitles'
      ? setJobTitleSuggestions(suggestions)
      : setLocationSuggestions(suggestions);
  }

  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const experiencedResponse = await publicAxios.get(
          `/signUpCards/get/${user._id}`
        );
        const userData = experiencedResponse.data.userDetails;
        const username = experiencedResponse.data.username;
        setUserData(userData);
        setUsername(username);
        updateFormData(userData, username);
        const filledForm = localStorage.getItem('filledForm');
        if (!filledForm) {
          // Disable close functionality if the form hasn't been filled before
          document.querySelector('.closeFormOptionForPopup').style.display =
            'none';
        }
      } catch (error) {
        console.error('Error fetching experienced user data:', error);
      }
    };

    const updateFormData = (userData, username) => {
      if (userData) {
        if (userData.companyName === null) {
          setFormData({
            ...formData,
            jobStatus: 'Fresher',
            jobTitle: userData.jobTitle || '',
            companyName: userData.companyName || '',
            location: userData.location || '',
            mobileNumber: userData.mobileNumber || '',
            experience: userData.experience || '',
            emailID: userData.emailID || '',
            desiredIndustry: userData.desiredIndustry || '',
            username: username || '',
          });
        } else {
          setFormData({
            ...formData,
            jobStatus: 'experienced',
            jobTitle: userData.jobTitle || '',
            companyName: userData.companyName || '',
            location: userData.location || '',
            mobileNumber: userData.mobileNumber || '',
            experience: userData.experience || '',
            emailID: userData.emailID || '',
            desiredIndustry: userData.desiredIndustry || '',
            username: username || '',
          });
        }
      }
    };
    fetchData();
  }, []);

  const handleOptionChange = (e) => {
    const selectedOption = e.target.value;
    setFormData({
      ...formData,
      jobStatus: selectedOption,
    });
  };

  const handleOptionClick = (value) => {
    setFormData({
      ...formData,
      jobStatus: value,
    });
  };

  const [emailChanged, setEmailChanged] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'emailID') {
      // Reset OTP state to false when email ID is changed
      setEmailChanged(true);
    }
    if (name === 'months') {
      setFormData({
        ...formData,
        experience: {
          ...formData.experience,
          [name]: value,
        },
      });
    } else if (name === 'years') {
      const numericValue = value.replace(/\D/g, '');
      setFormData({
        ...formData,
        experience: {
          ...formData.experience,
          [name]: numericValue,
        },
      });
    } else if (name === 'desiredLocation') {
      setFormData({
        ...formData,
        location: value,
      });
      updateAutoSuggestions(
        value,
        name === 'jobTitle' ? 'jobtitles' : 'locations'
      );
    } else if (name === 'location') {
      setFormData({
        ...formData,
        location: value,
      });
      updateAutoSuggestions(
        value,
        name === 'jobTitle' ? 'jobtitles' : 'locations'
      );
    } else if (name === 'jobTitle') {
      setFormData({
        ...formData,
        jobTitle: value,
      });
      updateAutoSuggestions(
        value,
        name === 'jobTitle' ? 'jobtitles' : 'locations'
      );
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const [otpInputs, setOtpInputs] = useState(['', '', '', '']);
  const [showOTPErrors, setShowOTPErrors] = useState(false);
  const [OTPSent, setOTPSent] = useState(false);
  const otpInputRefs = useRef([]);

  const handleOTPInputChange = (index, e) => {
    const { value } = e.target;
    if (!isNaN(value) && value.length <= 1) {
      const newOtpInputs = [...otpInputs];
      newOtpInputs[index] = value;
      setOtpInputs(newOtpInputs);

      // Move focus to the next input if a number is entered
      if (value !== '' && index < otpInputs.length - 1) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSendOTP = async () => {
    try {
      const email = formData.emailID;
      // Send request to generate OTP
      const response = await privateAxios.post('/signUpCards/generateOTP', {
        email,
      });

      setShowOTPErrors(false);
      setOTPSent(true); // Reset OTP errors
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Handle error scenario
    }
  };

  const handleConfirmOTP = async () => {
    try {
      // Get entered OTP from otpInputs
      const enteredOTP = otpInputs.join('');
      const email = formData.emailID;
      // Send request to verify OTP
      if (emailChanged && !OTPSent) {
        showBottomMessage('Generate OTP first');
      } else {
        if (localStorage.getItem('filledExperience') && OTPSent) {
          // If it's the first time filling the form and OTP has been sent
          const response = await privateAxios.post('/signUpCards/verifyOTP', {
            email,
            enteredOTP,
          });
          if (response.status === 200) {
            setShowOTPErrors(false);
            handleSubmit();
          }
        } else {
          // Otherwise, handle submit directly
          handleSubmit();
        }
      }
    } catch (error) {
      setShowOTPErrors(true); // Show OTP error message
      showBottomMessage('Enter valid OTP');
      console.error('Error verifying OTP:', error);
      // Handle error scenario
    }
  };

  function disableSendOTP() {
    return (
      !formData.emailID ||
      !formData.companyName ||
      !formData.mobileNumber ||
      !formData.jobTitle ||
      !formData.username ||
      !isValidEmailFormat(formData.emailID) ||
      !isAllowedDomain(formData.emailID) ||
      OTPSent
    );
  }

  function disableNextButton() {
    if (!localStorage.getItem('filledExperience')) {
      // First time filling the form
      return (
        !formData.emailID ||
        !formData.companyName ||
        !formData.mobileNumber ||
        !formData.jobTitle ||
        !isValidEmailFormat(formData.emailID) ||
        !isAllowedDomain(formData.emailID) ||
        !OTPSent
      );
    } else {
      // Not the first time filling the form
      return (
        !formData.emailID ||
        !formData.companyName ||
        !formData.mobileNumber ||
        !formData.jobTitle ||
        !isValidEmailFormat(formData.emailID) ||
        !isAllowedDomain(formData.emailID)
      );
    }
  }
  console.log(!formData.desiredIndustry || !formData.mobileNumber);
  function disableNextButtonForFreshers() {
    return !formData.desiredIndustry || !formData.mobileNumber;
  }
  const [resendDisabled, setResendDisabled] = useState(false);
  const disableResendOTP = () => {
    setResendDisabled(true);
    setTimeout(() => {
      setResendDisabled(false);
    }, 60000); // 60 seconds
  };

  useEffect(() => {
    if (OTPSent) {
      disableResendOTP();
    }
  }, [OTPSent]);

  const handleResendOTP = async () => {
    try {
      // Code to resend OTP
      const email = formData.emailID;

      // Send request to resend OTP
      const response = await publicAxios.post('/signUpCards/generateOTP', {
        email: email,
      });

      setShowOTPErrors(false); // Reset OTP errors
    } catch (error) {
      console.error('Error resending OTP:', error);
      // Handle error scenario
    }
  };

  const handleSubmit = async (e) => {
    if (formData.jobStatus === 'experienced') {
      // Handle submission for other jobStatus values
      try {
        const response = await publicAxios.put('/signUpCards/save', {
          ...formData,
          userId: user._id,
          isExperienced: true,
        });

        if (response.status === 201 || response.status === 200) {
          localStorage.setItem('filledForm', 'true');
          setEmailChanged(false);
          closePopUp();
          window.location.reload();
        }
        if (firstTimeFill) {
          // Check if it's the first time filling the form
          localStorage.setItem('filledExperience', 'true'); // Update filledForm in localStorage
          setFirstTimeFill(false); // Update state variable
        }
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    } else {
      e.preventDefault();
      // Handle submission for other jobStatus values
      try {
        const response = await publicAxios.put('/signUpCards/save', {
          ...formData,
          userId: user._id,
          isExperienced: false,
        });
        if (response.status === 201 || response.status === 200) {
          localStorage.setItem('filledForm', 'true');
          closePopUp();
          window.location.reload();
        }
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    }
  };
  const [widthForFresherRadio, setWidthForFresherRadio] = useState(false);

  useEffect(() => {
    if (formData.jobStatus === 'Fresher') {
      setWidthForFresherRadio(true);
    } else {
      setWidthForFresherRadio(false);
    }
  }, [formData.jobStatus]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isValidEmailFormat(formData.emailID)) {
      handleSendOTP();
    }
  };

  const handleLabelClick = (value) => {
    handleOptionChange({ target: { name: 'jobStatus', value } });
  };

  return (
    <div
      className="signup_confirm_popup"
      onClick={(e) => {
        // Check if the target element is the outer div and form has been filled for the first time
        const filledForm = localStorage.getItem('filledForm');
        if (e.target.classList.contains('signup_confirm_popup') && filledForm) {
          closePopUp();
        }
      }}
    >
      <div
        className={`signup_confirm_popup_content${
          widthForFresherRadio ? 'fresher' : ''
        }`}
      >
        <div className="radioSignUp">
          <div className="heroForPopUp">
            <h1>What&apos;s your job status?</h1>
            <div className="closeFormOptionForPopup" onClick={closePopUp}>
              <Image src={crossIcon} alt="close" />
            </div>
          </div>
          <div className="RadioButtons">
            <div className="RadioButton">
              <input
                type="radio"
                id="experienced"
                name="jobStatus"
                value="experienced"
                checked={formData.jobStatus === 'experienced'}
                onChange={handleOptionChange}
              />
              <label
                htmlFor="experienced"
                style={{
                  fontWeight: '600',
                  color:
                    formData.jobStatus === 'experienced' ? '#000' : '#475462',
                }}
                onClick={() => handleLabelClick('experienced')}
              >
                Experienced
              </label>
            </div>
            {!user.isExperienced && (
              <div className="RadioButton">
                <input
                  type="radio"
                  id="Fresher"
                  name="jobStatus"
                  value="Fresher"
                  checked={formData.jobStatus === 'Fresher'}
                  onChange={handleOptionChange}
                />
                <label
                  htmlFor="Fresher"
                  style={{
                    fontWeight: '600',
                    color:
                      formData.jobStatus === 'Fresher' ? '#000' : '#475462',
                  }}
                  onClick={() => handleLabelClick('Fresher')}
                >
                  Fresher
                </label>
              </div>
            )}
          </div>
        </div>
        <div>
          {formData.jobStatus === 'experienced' && (
            <div className="form__container">
              <div>
                <label>
                  Job Title
                  <span className="required__color">&nbsp;*</span>
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g. UI/UX Designer"
                  required
                />
                {jobTitleSuggestions.length > 0 && (
                  <ul className="AutoSuggestions_PopUpFormPage">
                    {jobTitleSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            jobTitle: suggestion.jobTitle,
                          });
                          setJobTitleSuggestions([]);
                        }}
                      >
                        {suggestion.jobTitle}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label>
                  Company Name
                  <span className="required__color">&nbsp;*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Amazon"
                  required
                />
              </div>
              <div>
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
                {locationSuggestions.length > 0 && (
                  <ul className="AutoSuggestions_PopUpFormPage">
                    {locationSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            location: suggestion.city,
                          });
                          setLocationSuggestions([]);
                        }}
                      >
                        {suggestion.city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label>
                  Mobile Number
                  <span className="required__color">&nbsp;*</span>
                </label>

                <PhoneInput
                  inputStyle={{
                    width: '100%',
                    height: '35px',
                    border: '0.6px solid #8E99A4',
                    borderRadius: '8px',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '21px',
                    background: 'inherit',
                    marginLeft: '0px',
                  }}
                  buttonStyle={{
                    backgroundColor: '#fff',
                    color: '#007bff',
                    borderRadius: '0px',
                    padding: '0px 1px',
                    cursor: 'pointer',
                    marginLeft: '5px',
                  }}
                  type="text"
                  country={'in'}
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  placeholder=""
                  onChange={(phone) =>
                    setFormData({ ...formData, mobileNumber: phone })
                  }
                />
              </div>
              <div>
                <label>
                  Experience
                  <span className="required__color">&nbsp;*</span>
                </label>
                <div className="Experience_select">
                  <input
                    type="text"
                    name="years"
                    className="experienceSelectOption"
                    value={formData.experience.years}
                    onChange={handleChange}
                    placeholder="Enter Years"
                    maxLength={3}
                  />
                  <select
                    className="experienceSelectOption"
                    name="months"
                    value={formData.experience.months}
                    onChange={handleChange}
                  >
                    <option value="">Select Months</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                  </select>
                </div>
              </div>
              <div className="popupform_profile_username-wrapper">
                <label>
                  Username
                  <span className="required__color">&nbsp;*</span>
                </label>
                <div className="wrapperforusernameinput">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="company-email-wrapper">
                <label>
                  Company Mail ID
                  <span className="required__color">&nbsp;*</span>
                </label>
                <div className="company-email">
                  <input
                    type="text"
                    name="emailID"
                    id="emailID"
                    value={formData.emailID}
                    onChange={handleChange}
                    placeholder="user@company.com"
                    disabled={OTPSent}
                    required
                    onKeyDown={handleKeyPress}
                  />
                  {!formData.emailID && (
                    <span className={'inputFieldsError hideCompanyError'}>
                      Please enter a company email address
                    </span>
                  )}

                  {formData.emailID &&
                    !isValidEmailFormat(formData.emailID) && (
                      <span className={'inputFieldsError makeErrorColorRed'}>
                        Invalid email format
                      </span>
                    )}

                  {formData.emailID &&
                    isValidEmailFormat(formData.emailID) &&
                    !isAllowedDomain(formData.emailID) && (
                      <span className={'inputFieldsError makeErrorColorRed'}>
                        Please enter a valid company email address
                      </span>
                    )}
                  <button
                    onClick={handleSendOTP}
                    className={`sendOTPButton${
                      disableSendOTP() ? 'verifyButtonDisabled' : ''
                    }`}
                    disabled={disableSendOTP()}
                  >
                    Send OTP
                  </button>
                </div>
                {/* OTP Inputs */}
                {OTPSent && (
                  <div className="otpInputsContainer">
                    <label htmlFor="otpInput1">
                      Enter OTP
                      <span className="required__color">&nbsp;*</span>
                    </label>
                    <div className="otpInputsForResendButton">
                      <div className="otpInputs">
                        {[...Array(4)].map((_, index) => (
                          <input
                            key={index}
                            type="text"
                            id={`otpInput${index + 1}`}
                            ref={(el) => (otpInputRefs.current[index] = el)}
                            value={otpInputs[index]}
                            onChange={(e) => handleOTPInputChange(index, e)}
                            maxLength={1}
                            className={`otpInput ${
                              showOTPErrors ? 'error' : ''
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={handleResendOTP}
                        className={`resendOTPButton${
                          resendDisabled ? 'verifyButtonDisabled' : ''
                        }`}
                        disabled={resendDisabled}
                      >
                        Resend OTP
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="nextButtonDiv">
                <button
                  className={`NextButton${
                    disableNextButton() ? 'disabled' : ''
                  }`}
                  type="submit"
                  onClick={handleConfirmOTP}
                  disabled={disableNextButton()}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {formData.jobStatus === 'Fresher' && (
            <div className="form__container">
              <div>
                <label>
                  Desired Industry
                  <span className="required__color">&nbsp;*</span>
                </label>
                <input
                  type="text"
                  name="desiredIndustry"
                  value={formData.desiredIndustry}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Desired Location</label>
                <input
                  type="text"
                  name="desiredLocation"
                  value={formData.location}
                  onChange={handleChange}
                />
                {locationSuggestions.length > 0 && (
                  <ul className="AutoSuggestions_PopUpFormPage">
                    {locationSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            location: suggestion.city,
                          });
                          setLocationSuggestions([]);
                        }}
                      >
                        {suggestion.city}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label>
                  Mobile Number
                  <span className="required__color">&nbsp;*</span>
                </label>
                <PhoneInput
                  inputStyle={{
                    width: '100%',
                    height: '35px',
                    border: '0.6px solid #8E99A4',
                    borderRadius: '8px',
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '21px',
                    background: 'inherit',
                    marginLeft: '0px',
                  }}
                  buttonStyle={{
                    backgroundColor: '#fff',
                    color: '#007bff',
                    borderRadius: '0px',
                    padding: '0px 1px',
                    cursor: 'pointer',
                    marginLeft: '5px',
                  }}
                  type="text"
                  country={'in'}
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  placeholder=""
                  onChange={(phone) =>
                    setFormData({ ...formData, mobileNumber: phone })
                  }
                />
              </div>
              <button
                className={`NextButton${
                  disableNextButtonForFreshers() ? 'disabled' : ''
                }`}
                onClick={handleSubmit}
                type="submit"
                disabled={disableNextButtonForFreshers()}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignUpFormPopup;
