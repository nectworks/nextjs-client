'use client'
/*
  FileName - HomeMain.js
  Desc - This file defines a React component (HomeMain) responsible for rendering a section of content with two toggle buttons and three step components. Depending on which button is clicked, the step components display different information and colors. This component is intended to be used as part of a larger web page.
*/
import React, { useState } from 'react';
import Link from 'next/link';
import scrollToTop from '../../Utils/scrollToTop';
import './Home.css';

export default function HomeMain() {
  // State variables
  const [data1, setData1] = useState(
    'Claim your personalised page, unlock professional features, and share on social media to get candidates.');
  const [data2, setData2] = useState(
    'Check out the right candidates on your dashboard and refer them to your company to earn referral bonuses.');
  const [candidateColor, setCandidateColor] = useState('#ffffff');
  const [candidateBackColor, setCandidateBackColor] = useState('#0057B1');

  // Function to update the state when the "Find Your Ideal Workplace" button is clicked
  const handleCandidateData = () => {
    setData1('Complete your profile to get started!');
    setData2(
      'Optimize your referral process by effortlessly sending referrals to multiple referrers at once.'
    );
    setCandidateColor('#0057B1');
	setCandidateBackColor('#ffffff');
  };

  // Function to update the state when the "Become a Meta-referrer" button is clicked
  const handleReferrerData = () => {
    setData1(
      'Claim your personalised page, unlock professional features, and share on social media to get candidates.'
    );
    setData2(
      'Check out the right candidates on your dashboard and refer them to your company to earn referral bonuses.'
    );
    setCandidateColor('#ffffff');
    setCandidateBackColor('#0057B1');
  };

  // JSX code for rendering the component
  return (
    <div className="bodyMain__container__outer">
      <div className="bodyMain__container__inner">
        <div className='bodyMain__btn'>
          <div className='toggle__btns'>
            {/* Button for "Become a Meta-referrer" */}
            <button
              type="button"
              className="main__btn"
			        style={{ color: candidateColor, backgroundColor: candidateBackColor }}
              onClick={handleReferrerData}
            >
              Become a Meta-referrer
            </button>
            {/* Button for "Find Your Ideal Workplace" */}
            <button
              type="button"
              className="main__btn"
              style={{ color: candidateBackColor, backgroundColor: candidateColor }}
              onClick={handleCandidateData}
            >
              Find Your Ideal Workplace
            </button>
          </div>
        </div>
        <div className='bodyMain__three__components'>
          {/* Component 1 */}
          <div className='first__component bodyMain__component'>
            <div className='component__num'>1</div>
            <p className='component__text'>Create a<span className='color_change'> Nectworks</span> account or log in.</p>
          </div>
          {/* Component 2 */}
          <div className='bodyMain__component'>
            <div className='component__num'>2</div>
            {/* Data1 state is used here */}
            <p className='component__text'>{data1}</p>
          </div>
          {/* Component 3 */}
          <div className='third__component bodyMain__component'>
            <div className='component__num'>3</div>
            {/* Data2 state is used here */}
            <p className='component__text'>{data2}</p>
          </div>
        </div>
      </div>
      <div className='bodyMain__btn'>
        {/* "Get Started" button */}
        <Link href='/sign-up' onClick={scrollToTop}>
          <button type="button" className="main__btn down_btn">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}
