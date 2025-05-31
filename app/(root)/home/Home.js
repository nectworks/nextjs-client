/*
  FileName: Home.js
  Description: SSR-safe landing page component for Nectworks platform
  
  PURPOSE:
  Main marketing landing page that adapts UI based on user authentication state.
  Handles user onboarding flow and showcases platform features through multiple sections.

  KEY FUNCTIONALITY:
  - Dynamic content: Shows signup form for guests, welcome message for authenticated users
  - Google One Tap integration for seamless login
  - Username input with localStorage persistence
  - Scroll-based animations using Intersection Observer
  - Smooth state transitions between auth states
  
  MAIN SECTIONS:
  Hero, Data Intelligence, Audience Tabs, How It Works, Features, Testimonials, FAQ, CTA
  
  TECHNICAL NOTES:
  - SSR-safe with proper client-side hydration
  - Context-based authentication state management
  - Conditional rendering prevents hydration mismatches
  - Cleanup functions for event listeners and observers
  - Error handling for Google authentication flow
*/

'use client';

import React, { useState, useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Context
import { UserContext } from '@/context/User/UserContext';

// Utils
import scrollToTop from '@/Utils/scrollToTop';
import showBottomMessage from '@/Utils/showBottomMessage';
import { privateAxios } from '@/config/axiosInstance.js';
import { safeLocalStorage } from '@/Utils/browserUtils';

// Components
import FeatureSection from './components/FeatureSection';
import TestimonialSection from './components/TestimonialSection';
import HowItWorksSection from './components/HowItWorksSection';
import CTASection from './components/CTASection';
import DataIntelligenceSection from './components/DataIntelligenceSection';
import CompanySection from './components/CompanySection';
import Accordion from '../../_components/Accordian/Accordion';

// Styles
import './Home.css';

export default function Home() {
  const { userState, authCheckComplete, isInitialLoad } = useContext(UserContext);
  const [user, setUser] = userState;
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('referrer');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const heroRef = useRef(null);

  // Animation state
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  
  // OPTIMIZED: Track auth state changes for smooth transitions
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(true); // Start optimistically

  // SSR-SAFE: Only set username from localStorage after mount
  useEffect(() => {
    setIsMounted(true);
    
    // Load saved username from localStorage (client-side only)
    const savedUsername = safeLocalStorage.getItem('singupval');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    
    // SSR-SAFE: Only access localStorage on client
    if (isMounted) {
      safeLocalStorage.setItem('singupval', newUsername);
    }
    
    // Remove blinking cursor animation
    if (typeof document !== 'undefined') {
      const cursor = document.querySelector('.blinking-cursor');
      if (cursor) {
        cursor.style.animation = 'none';
      }
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
        const destination = signUp ? '/profile' : '/profile';
        navigate.push(destination, {
          state: { from: signUp ? '/sign-up' : '/log-in' },
          replace: true,
        });
      }
    } catch (error) {
      console.log(error);
      showBottomMessage('Error while signing up.');
    }
  }

  // OPTIMIZED: Handle auth state changes smoothly
  useEffect(() => {
    if (authCheckComplete) {
      if (user) {
        setShowSignupForm(false);
        setShowWelcomeMessage(true);
      } else {
        setShowSignupForm(true);
        setShowWelcomeMessage(false);
      }
    }
  }, [user, authCheckComplete]);

  // SSR-SAFE: Setup input event listener only after mount
  useEffect(() => {
    if (!isMounted) return;
    
    const inputName = document.querySelector('.input__name');
    if (inputName) {
      const handleKeyUp = (e) => {
        if (e.key === 'Enter') {
          router.push('/sign-up');
        }
      };
      inputName.addEventListener('keyup', handleKeyUp);
      
      // Cleanup
      return () => {
        inputName.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [router, isMounted]);

  // FIXED: Setup Google One Tap after auth is determined (CLIENT-SIDE ONLY)
  useEffect(() => {
    // Only proceed if:
    // 1. Component is mounted (client-side)
    // 2. User is NOT logged in
    // 3. Auth check is complete
    // 4. Window object exists
    if (!isMounted) return;
    if (user) return; // Already logged in, don't show Google One Tap
    if (!authCheckComplete) return; // Still checking auth state
    if (typeof window === 'undefined') return; // Not client-side

    // All conditions met - setup Google One Tap
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.defer = true;
    script.async = true;
    script.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_CLIENT,
          callback: handleOneTapLogin,
        });
        window.google.accounts.id.prompt();
      }
    };
    document.body.appendChild(script);
    
    return () => {
      // Cleanup script if component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [user, authCheckComplete, isMounted]);

  // Setup Intersection Observer for animations (CLIENT-SIDE ONLY)
  useEffect(() => {
    if (!isMounted) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === heroRef.current) {
              setIsHeroVisible(true);
            }
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections with animation-container class
    document.querySelectorAll('.animation-container').forEach((el) => {
      observer.observe(el);
    });

    // Observe hero section
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isMounted]);

  return (
    <main className="home">
      {/* Hero Section */}
      <section className={`hero ${isHeroVisible ? 'animate-hero' : ''}`} ref={heroRef}>
        <div className="hero__container">
          <div className="hero__content animation-container">
            <div className="tag-line">Next Gen Professional Connections</div>
            <h1 className="hero__title">
              <span className="text-gradient">Reimagining</span> How Talent Connects to Opportunity
            </h1>
            <p className="hero__subtitle">
              Simplify job referrals. No more inbox chaos. Build your network, showcase your talent, 
              and advance your career with our data-driven platform.
            </p>
            
            {/* OPTIMIZED: Show welcome message with smooth transition */}
            {showWelcomeMessage && (
              <div className="hero__welcome-back" style={{
                opacity: showWelcomeMessage ? 1 : 0,
                transform: showWelcomeMessage ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.3s ease-in-out'
              }}>
                <h3>Welcome back, {user?.firstName || 'there'}!</h3>
                  <p>
                    Share your link to get job referrals in your dashboard — no more email spam!
                  </p>
                  <div className="profile-url-container">         
                    <Link href={`/user/${user?.username}`} passHref>
                      <a
                        className="profile-url-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <code className="profile-url">
                          nectworks.com/user/{user?.username}
                        </code>
                      </a>
                    </Link>
                    <svg 
                      onClick={() => navigator.clipboard.writeText(`https://nectworks.com/user/${user?.username}`)}
                      className="copy-icon"
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      title="Copy URL"
                    >
                      <path 
                        d="M8 4V16C8 17.1046 8.89543 18 10 18H18C19.1046 18 20 17.1046 20 16V7.41421C20 7.149 19.8946 6.89464 19.7071 6.70711L16.2929 3.29289C16.1054 3.10536 15.851 3 15.5858 3H10C8.89543 3 8 3.89543 8 5Z" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                      <path 
                        d="M16 18V20C16 21.1046 15.1046 22 14 22H6C4.89543 22 4 21.1046 4 20V9C4 7.89543 4.89543 7 6 7H8" 
                        stroke="currentColor"
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="url-description">
                    Let others know you&apos;re available to help with job referrals at your company.
                  </p>
                <Link href="/profile">
                  <button className="primary-button">
                    <span className="button-text">Go to Profile</span>
                    <span className="button-icon">→</span>
                  </button>
                </Link>
              </div>
            )}
            
            {/* OPTIMIZED: Show signup form immediately, fade out when user logs in */}
            {showSignupForm && (
              <div className="hero__signup" style={{
                opacity: showSignupForm ? 1 : 0,
                transform: showSignupForm ? 'translateY(0)' : 'translateY(-10px)',
                transition: 'all 0.3s ease-in-out'
              }}>
                <div className="username-input">
                  <span>nectworks<span className="blinking-cursor">/</span></span>
                  <input 
                    type="text" 
                    placeholder="choose your username" 
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
                    <span className="button-text">Get Started</span>
                    <span className="button-icon">→</span>
                  </button>
                </Link>
              </div>
            )}
            
            {/* OPTIMIZED: Show loading state only during very initial load */}
            {isInitialLoad && !authCheckComplete && (
              <div className="hero__loading" style={{
                opacity: isInitialLoad ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out'
              }}>
                <div className="auth-loading-skeleton">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-button"></div>
                </div>
              </div>
            )}
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100+</span>
                <span className="stat-label">Active Referrers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Job Seekers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">85%</span>
                <span className="stat-label">Faster Referrals</span>
              </div>
            </div>
          </div>
          <div className="hero__image animation-container">
            <div className="image-container">
              <img 
                src="/heroSectionHeroImg.webp" 
                alt="Nectworks platform preview"
                className="main-image"
              />
              <div className="floating-element one"></div>
              <div className="floating-element two"></div>
              <div className="floating-element three"></div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Data Intelligence Section */}
      <DataIntelligenceSection />

      {/* Audience Tabs Section */}
      <section className="audience-tabs animation-container">
        <div className="tabs-container">
          <div className="section-header">
            <h2>Find Your Path</h2>
            <p>Whether you&apos;re looking for a job or want to refer candidates, we&apos;ve got you covered</p>
          </div>
          
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
                <h3>Become a Meta-referrer</h3>
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
                    <p>Share your personalized link to reach quality candidates</p>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <p>Manage referrals and earn bonuses with minimal effort</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="tab-panel">
                <h3>Find Your Dream Job</h3>
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
            
            <Link href={showWelcomeMessage ? "/profile" : "/sign-up"} onClick={scrollToTop}>
              <button className="primary-button">
                <span className="button-text">
                  {showWelcomeMessage ? "Go to Profile" : "Start Your Journey"}
                </span>
                <span className="button-icon">→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      <FeatureSection
        image="/Illustration.webp"
        imageAlt="AI-driven referral matching"
        title="AI-Driven Talent Matching"
        highlight="Smart Matching"
        description="Our powerful AI algorithms connect the right candidates with the right referrers, increasing successful placements and reducing time-to-hire by analyzing patterns in professional data."
        reversed={false}
        icon="sparkles"
        featurePoints={[
          "Data-driven insights",
          "Easy implementation",
          "24/7 access"
        ]}
      />

      <FeatureSection
        image="/Frame.webp"
        imageAlt="Referral dashboard"
        title="Refer Candidates 2x Faster"
        highlight="Save Time"
        description="No more wading through unqualified applications. Our streamlined dashboard helps you review and refer candidates in minutes, not hours."
        reversed={true}
        icon="clock"
        featurePoints={[
          "Quick candidate filtering",
          "User-friendly dashboard",
          "Save hours every week"
        ]}
      />

      <FeatureSection
        image="/Isolation_Mode.webp"
        imageAlt="Centralized candidate management"
        title="All Your Candidates in One Place"
        highlight="Stay Organized"
        description="Keep track of all your referral requests and candidates in a single, easy-to-use dashboard. No more hunting through emails or messages."
        reversed={false}
        icon="folder"
        featurePoints={[
          "Centralized tracking",
          "Real-time updates",
          "Simplified workflow"
        ]}
      />

      {/* Company Section */}
      <CompanySection />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* Safety Alert Section */}
      <section className="alert-section animation-container">
        <div className="alert-container">
          <div className="alert-content">
            <div className="alert-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>Stay Safe from Fraudulent Practices</h2>
            <p>
              In today&apos;s job market, your inbox can get flooded with suspicious job alerts.
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

      {/* FAQ Section */}
      <section className="faq-section animation-container">
        <div className="section-header">
          <h2>
            <span className="highlight">Quick answers</span> to common questions
          </h2>
          <p>Everything you need to know about our platform</p>
        </div>
        <Accordion />
      </section>

      {/* Final CTA Section */}
      <CTASection />
    </main>
  );
}