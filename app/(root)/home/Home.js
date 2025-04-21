/*
  FileName: Home.js
  Desc: Main component for the Nectworks landing page. This file orchestrates the 
  entire landing page experience by importing and arranging various section components.
  It includes a hero section with username input, audience-specific tab navigation,
  feature showcases, testimonials, safety alert section, FAQ accordion, and final call-to-action.
  The component also handles Google One-Tap login integration and user state management.
*/

'use client';

import React, { useState, useContext, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Context
import { UserContext } from '@/context/User/UserContext';

// Utils
import scrollToTop from '@/Utils/scrollToTop';
import showBottomMessage from '@/Utils/showBottomMessage';
import { privateAxios } from '@/config/axiosInstance.js';

// Components
import FeatureSection from './components/FeatureSection';
import TestimonialSection from './components/TestimonialSection';
import Accordion from '../../_components/Accordian/Accordion'; // Using existing Accordion

// Styles
import './Home.css';

export default function Home() {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('referrer'); // Default to 'referrer'
  const router = useRouter();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    if (document.querySelector('.blinking-cursor')) {
      document.querySelector('.blinking-cursor').style.animation = 'none';
    }
  };

  const navigate = useRouter();

  async function handleOneTapLogin(response) {
    try {
      const res = await privateAxios.post(`/google/one-tap/register`, {
        data: response,
      });

      const { signUp, user } = res.data;
      setUser(user);

      if (res.status === 200) {
        showBottomMessage('Successfully authenticated.');
        if (signUp === true) {
          navigate.push('/profile', {
            state: {
              from: '/sign-up',
            },
            replace: true,
          });
        } else {
          navigate.push('/profile');
        }
      }
    } catch (error) {
      console.log(error);
      showBottomMessage('Error while signing up.');
    }
  }

  useEffect(() => {
    localStorage.setItem('singupval', username);

    const inputName = document.querySelector('.input__name');
    if (inputName) {
      inputName.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          router.push('/sign-up');
        }
      });
    }

    // Google One Tap login
    if (!user) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.defer = true;
      script.async = true;
      script.onload = () => {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_CLIENT,
          callback: handleOneTapLogin,
        });

        window.google.accounts.id.prompt();
      };
      document.body.appendChild(script);
    }
  }, [user, username]);

  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__container">
          <div className="hero__content">
            <h1 className="hero__title">
              The Future of <span className="highlight">Job Referrals</span> Has Arrived
            </h1>
            <p className="hero__subtitle">
              Find your dream job, or become a top referrer. Connect with ease, 
              ditch the cold messages. Join our hiring revolution today!
            </p>
            
            {!user && (
              <div className="hero__signup">
                <div className="username-input">
                  <span>nectworks<span className="blinking-cursor">/</span></span>
                  <input 
                    type="text" 
                    placeholder="username" 
                    value={username}
                    onChange={handleUsernameChange}
                    className="input__name"
                  />
                </div>
                <Link href="/sign-up">
                  <button 
                    className={`signup-button ${!username ? 'disabled' : ''}`}
                    disabled={!username}
                  >
                    Get Started
                  </button>
                </Link>
              </div>
            )}
          </div>
          <div className="hero__image">
            <div className="image-container">
              <img 
                src="/heroSectionHeroImg.webp" 
                alt="Nectworks platform preview"
                className="main-image"
              />
              <div className="floating-element one"></div>
              <div className="floating-element two"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Tabs Section */}
      <section className="audience-tabs">
        <div className="tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'referrer' ? 'active' : ''}`}
              onClick={() => setActiveTab('referrer')}
            >
              For Referrers
            </button>
            <button
              className={`tab-button ${activeTab === 'jobseeker' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobseeker')}
            >
              For Job Seekers
            </button>
          </div>
          
          <div className="tabs-content">
            {activeTab === 'referrer' ? (
              <div className="tab-panel">
                <h2>Become a Meta-referrer</h2>
                <p>
                  Streamline your referral process, manage candidates efficiently,
                  and maximize your referral bonuses - all in one platform.
                </p>
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <p>Create your Nectworks account</p>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <p>Share your personalized page on social media to attract candidates</p>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <p>Review candidates on your dashboard and earn referral bonuses</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tab-panel">
                <h2>Find Your Dream Job</h2>
                <p>
                  Connect with referrers at your target companies without awkward cold messages.
                  Send your profile to multiple potential referrers in just a few clicks.
                </p>
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <p>Create your Nectworks account</p>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <p>Complete your profile with your experience and target roles</p>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <p>Send referral requests to multiple referrers with one click</p>
                  </div>
                </div>
              </div>
            )}
            
            <Link href="/sign-up" onClick={scrollToTop}>
              <button className="primary-button">Start Your Journey</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Showcase Sections */}
      <FeatureSection 
        image="/Illustration.webp"
        imageAlt="AI-driven referral matching"
        title="AI-Driven Talent Matching"
        highlight="Smart Matching"
        description="Our powerful AI algorithms connect the right candidates with the right referrers, increasing successful placements and reducing time-to-hire."
        reversed={false}
      />
      
      <FeatureSection 
        image="/Frame.webp"
        imageAlt="Referral dashboard"
        title="Refer Candidates 2x Faster"
        highlight="Save Time"
        description="No more wading through unqualified applications. Our streamlined dashboard helps you review and refer candidates in minutes, not hours."
        reversed={true}
      />
      
      <FeatureSection 
        image="/Isolation_Mode.webp"
        imageAlt="Centralized candidate management"
        title="All Your Candidates in One Place"
        highlight="Stay Organized"
        description="Keep track of all your referral requests and candidates in a single, easy-to-use dashboard. No more hunting through emails or messages."
        reversed={false}
      />

      {/* Testimonial Section - Added to showcase user success stories */}
      <TestimonialSection />

      {/* Safety Alert Section */}
      <section className="alert-section">
        <div className="alert-container">
          <div className="alert-content">
            <h2>Stay Safe from Fraudulent Practices</h2>
            <p>
              In today`&apos;`s job market, your email can get flooded with suspicious job alerts.
              Learn how to identify and avoid fraudulent recruitment practices.
            </p>
          </div>
          <Link href="/fraudulent-activity">
            <button className="alert-button">
              Learn More
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </Link>
        </div>
      </section>

      {/* FAQ Section - Using unmodified structure from original Home.js */}
      <div className="outer__layer__bdy__com">
        <div className="qna__header">
          <h4>
            <span className="color_change">Quick answers</span> to common
            questions
          </h4>
        </div>
      </div>
      <Accordion />

      {/* Final CTA Section - Fixed button contrast issue */}
      <section className="final-cta">
        <div className="cta-container">
          <h2>Ready to Transform Your Hiring Process?</h2>
          <p>Join thousands of professionals already using Nectworks to streamline referrals.</p>
          <Link href="/sign-up">
            <button className="cta-button">Create Your Account</button>
          </Link>
        </div>
      </section>
    </main>
  );
}