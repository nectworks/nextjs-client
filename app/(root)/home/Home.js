/*
  FileName: Home.js
  Desc: Main component for the Nectworks landing page. This file orchestrates the 
  entire landing page experience by importing and arranging various section components.
  It includes a modernized hero section with animated elements, a data intelligence showcase,
  feature highlights, testimonials, how it works section, company benefits, and a final call-to-action.
  The component handles Google One-Tap login integration and user state management.
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

// Components
import FeatureSection from './components/FeatureSection';
import TestimonialSection from './components/TestimonialSection';
import HowItWorksSection from './components/HowItWorksSection';
import CTASection from './components/CTASection';
import DataIntelligenceSection from './components/DataIntelligenceSection';
import CompanySection from './components/CompanySection';
import Accordion from '../../_components/Accordian/Accordion'; // Using existing Accordion

// Styles
import './Home.css';

export default function Home() {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState('referrer'); // Default to 'referrer'
  const router = useRouter();
  const heroRef = useRef(null);

  // Animation state for observed elements
  const [isHeroVisible, setIsHeroVisible] = useState(false);

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

    // Setup Intersection Observer for animations
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
  }, [user, username]);

  return (
    <main className="home">
      {/* Hero Section - Modernized with animation */}
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
            
            {!user && (
              <div className="hero__signup">
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

      {/* Data Intelligence Section - NEW */}
      <DataIntelligenceSection />

      {/* Audience Tabs Section */}
      <section className="audience-tabs animation-container">
        <div className="tabs-container">
          <div className="section-header">
            <h2>Find Your Path</h2>
            <p>Whether you're looking for a job or want to refer candidates, we've got you covered</p>
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
            
            <Link href="/sign-up" onClick={scrollToTop}>
              <button className="primary-button">
                <span className="button-text">Start Your Journey</span>
                <span className="button-icon">→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - Updated */}
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

      {/* Company Section - NEW */}
      <CompanySection />

      {/* Testimonial Section - Updated for more authentic voices */}
      <TestimonialSection />

      {/* Safety Alert Section - Styled differently */}
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

      {/* FAQ Section - Improved styling */}
      <section className="faq-section animation-container">
        <div className="section-header">
          <h2>
            <span className="highlight">Quick answers</span> to common questions
          </h2>
          <p>Everything you need to know about our platform</p>
        </div>
        <Accordion />
      </section>

      {/* Final CTA Section - Updated */}
      <CTASection />
    </main>
  );
}