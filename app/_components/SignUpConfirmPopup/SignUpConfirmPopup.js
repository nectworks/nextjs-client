'use client';
/*
  File: SignUpConfirmPopup.js
  Description: This component contains the popup that will be showed
  once on successful user registration, with an improved modern design
*/

import './SignUpConfirmPopup.css';
import popUpIllustration from '@/public/SignUpConfirmPopup/signUpConfirmation.webp';
import Image from 'next/image';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { UserContext } from '@/context/User/UserContext';

function SignUpConfirmPopup({ closePopUp }) {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [activeStep, setActiveStep] = useState(1);

  const displayName = user?.firstName
    ? user.firstName.length > 10
      ? user.firstName.slice(0, 10) + '...'
      : user.firstName
    : '';
  
  const steps = [
    {
      number: 1,
      title: "Set up your profile",
      description: "Complete your profile as a job referrer or a job seeker to connect with potential opportunities.",
      colorClass: "step-one"
    },
    {
      number: 2,
      title: "Verify your account",
      description: "Verify your account in the account-settings page to enable receiving referral requests.",
      colorClass: "step-two"
    },
    {
      number: 3,
      title: "Start connecting",
      description: "Screen through potential candidates through your dashboard and engage with them.",
      colorClass: "step-three"
    }
  ];

  return (
    <div className="signup-confirm-overlay">
      <div className="signup-confirm-container">
        <button
          onClick={closePopUp}
          className="signup-confirm-close-button"
          aria-label="Close confirmation window"
        >
          <Image src={crossIcon} alt="Close" width={24} height={24} />
        </button>

        <div className="signup-confirm-content">
          <div className="signup-confirm-illustration">
            <Image 
              src={popUpIllustration} 
              alt="Success illustration" 
              priority
              quality={90}
            />
          </div>

          <div className="signup-confirm-text">
            <div className="signup-confirm-header">
              <h1>Welcome, <span className="highlight">{displayName}!</span></h1>
              <p className="signup-confirm-subheader">
                Your account has been successfully created
              </p>
            </div>

            <p className="signup-confirm-description">
              Complete these steps to start connecting with referrers or candidates:
            </p>

            <div className="signup-confirm-steps">
              {steps.map((step) => (
                <div 
                  key={step.number}
                  className={`signup-confirm-step ${activeStep === step.number ? 'active' : ''}`}
                  onClick={() => setActiveStep(step.number)}
                >
                  <div className={`step-number ${step.colorClass}`}>
                    {step.number}
                  </div>
                  <div className="step-content">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="signup-confirm-progress">
              <div className="progress-dots">
                {steps.map((step) => (
                  <button 
                    key={step.number}
                    className={`progress-dot ${activeStep === step.number ? 'active' : ''}`}
                    onClick={() => setActiveStep(step.number)}
                    aria-label={`View step ${step.number}`}
                  />
                ))}
              </div>
              
              <div className="progress-navigation">
                <button 
                  className="nav-button prev"
                  onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                  disabled={activeStep === 1}
                  aria-label="Previous step"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button 
                  className="nav-button next"
                  onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
                  disabled={activeStep === steps.length}
                  aria-label="Next step"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>

            <Link href="/account-settings">
              <button className="signup-confirm-action" onClick={closePopUp}>
                Start Exploring
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpConfirmPopup;