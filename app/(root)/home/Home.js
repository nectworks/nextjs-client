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
  
  SEO ENHANCEMENTS:
  - Structured data for FAQ, Services, Reviews, and Organization
  - Semantic HTML5 elements (main, section, article, aside)
  - Improved heading hierarchy (h1, h2, h3)
  - Enhanced meta descriptions and titles
  - Schema markup for better rich snippets
  - Breadcrumb navigation
  - Internal linking optimization
  - Image optimization with proper alt tags
  - Accessibility improvements for better SEO
*/

'use client';

import React, { useState, useContext, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

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
  const [showSignupForm, setShowSignupForm] = useState(true);

  // SEO: Base URL for structured data
  const baseURL = process.env.NEXT_PUBLIC_CLIENT_URL || 'https://nectworks.com';

  // SEO: FAQ structured data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Nectworks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nectworks is an AI-powered job referral platform that connects job seekers with company insiders and streamlines the employee referral process for companies."
        }
      },
      {
        "@type": "Question",
        "name": "How does the referral process work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Job seekers create profiles and send referral requests to employees at their target companies. Referrers can review candidates through our dashboard and refer qualified candidates to their companies."
        }
      },
      {
        "@type": "Question",
        "name": "Is Nectworks free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Nectworks is free for job seekers to create profiles and send referral requests. Companies can access our platform with various pricing plans."
        }
      },
      {
        "@type": "Question",
        "name": "How do referrers earn bonuses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Referrers earn bonuses when candidates they refer are successfully hired by their companies. Bonus amounts vary by company and position level."
        }
      },
      {
        "@type": "Question",
        "name": "What makes Nectworks different from other job platforms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nectworks focuses specifically on employee referrals with AI-powered matching, eliminating email chaos, and providing a streamlined dashboard for managing the entire referral process."
        }
      }
    ]
  };

  // SEO: Service structured data
  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "AI-Powered Job Referral Platform",
    "description": "Streamline your hiring process with intelligent job referrals and professional networking",
    "provider": {
      "@type": "Organization",
      "name": "Nectworks",
      "url": baseURL
    },
    "serviceType": "Employment Services",
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Nectworks Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Job Referral Service for Job Seekers",
            "description": "Connect with referrers at target companies"
          },
          "price": "0",
          "priceCurrency": "USD"
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Employee Referral Management for Companies",
            "description": "Streamline employee referral programs"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "25",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // SEO: How it works structured data
  const howItWorksStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Get Job Referrals on Nectworks",
    "description": "Step-by-step guide to getting job referrals through the Nectworks platform",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Create Your Profile",
        "text": "Sign up and build your professional profile with your experience, skills, and preferences",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Connect with Referrers",
        "text": "Find referrers at your target companies and send referral requests with a single click",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Track Your Progress",
        "text": "Monitor all your referral requests in one place and follow up as needed",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "Land Your Dream Job",
        "text": "Get referred to top companies and increase your chances of landing the perfect role",
        "position": 4
      }
    ]
  };

  // SEO: Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseURL
      }
    ]
  };

  // All existing functionality remains the same...
  useEffect(() => {
    setIsMounted(true);
    
    const savedUsername = safeLocalStorage.getItem('singupval');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleUsernameChange = (event) => {
    const newUsername = event.target.value;
    setUsername(newUsername);
    
    if (isMounted) {
      safeLocalStorage.setItem('singupval', newUsername);
    }
    
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
      
      return () => {
        inputName.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [router, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (user) return;
    if (!authCheckComplete) return;
    if (typeof window === 'undefined') return;

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
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [user, authCheckComplete, isMounted]);

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

    document.querySelectorAll('.animation-container').forEach((el) => {
      observer.observe(el);
    });

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [isMounted]);

  return (
    <>
      <Head>
        <title>Nectworks - AI-Powered Job Referral Platform | Connect Talent with Opportunities</title>
        <meta name="description" content="Transform your hiring process with Nectworks - the AI-powered job referral platform. Connect job seekers with company insiders, streamline employee referrals, and reduce time-to-hire by 60%. Join 1000+ professionals building their careers through smart referrals." />
        <meta name="keywords" content="job referrals, employee referral platform, AI hiring, professional networking, career opportunities, talent acquisition, recruitment platform, job matching, referral management, hiring optimization" />
        <link rel="canonical" href={baseURL} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              faqStructuredData,
              serviceStructuredData,
              howItWorksStructuredData,
              breadcrumbStructuredData
            ])
          }}
        />
      </Head>

      <main className="home" id="main-content" itemScope itemType="https://schema.org/WebSite">
        {/* SEO: Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="breadcrumb-nav" style={{ position: 'absolute', left: '-9999px' }}>
          <ol itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/" itemProp="item">
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section 
          className={`hero ${isHeroVisible ? 'animate-hero' : ''}`} 
          ref={heroRef}
          itemScope 
          itemType="https://schema.org/Service"
          role="banner"
          aria-labelledby="hero-title"
        >
          <div className="hero__container">
            <div className="hero__content animation-container">
              <div className="tag-line" role="text" aria-label="Platform category">
                Next Gen Professional Connections
              </div>
              <h1 className="hero__title" id="hero-title" itemProp="name">
                <span className="text-gradient">Reimagining</span> How Talent Connects to Opportunity
              </h1>
              <p className="hero__subtitle" itemProp="description">
                No more messy DMs or emails. Drop your custom link on LinkedIn, 
                Twitter, or anywhere you vibe — and let job seekers send you their job info straight to your dashboard.
                Or, Looking for a job or want a referral? Sign up, plug in, and make career moves happen.
              </p>
              
              {showWelcomeMessage && (
                <section 
                  className="hero__welcome-back" 
                  style={{
                    opacity: showWelcomeMessage ? 1 : 0,
                    transform: showWelcomeMessage ? 'translateY(0)' : 'translateY(10px)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                  aria-labelledby="welcome-heading"
                >
                  <h2 id="welcome-heading">Welcome back, {user?.firstName || 'there'}!</h2>
                  <p>
                    Share your link to get job referrals in your dashboard — no more email spam!
                  </p>
                  <div className="profile-url-container">         
                    <Link href={`/user/${user?.username}`} passHref>
                      <a
                        className="profile-url-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        itemProp="url"
                      >
                        <code className="profile-url">
                          nectworks.com/user/{user?.username}
                        </code>
                      </a>
                    </Link>
                    <button 
                      onClick={() => navigator.clipboard.writeText(`https://nectworks.com/user/${user?.username}`)}
                      className="copy-icon"
                      aria-label="Copy profile URL to clipboard"
                      type="button"
                    >
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        title="Copy URL"
                        role="img"
                        aria-hidden="true"
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
                    </button>
                  </div>
                  <p className="url-description">
                    Let others know you&apos;re available to help with job referrals at your company.
                  </p>
                  <Link href="/profile">
                    <button className="primary-button" type="button">
                      <span className="button-text">Go to Profile</span>
                      <span className="button-icon" aria-hidden="true">→</span>
                    </button>
                  </Link>
                </section>
              )}
              
              {showSignupForm && (
                <section 
                  className="hero__signup" 
                  style={{
                    opacity: showSignupForm ? 1 : 0,
                    transform: showSignupForm ? 'translateY(0)' : 'translateY(-10px)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                  aria-labelledby="signup-heading"
                >
                  <h2 id="signup-heading" className="sr-only">Sign up for Nectworks</h2>
                  <div className="username-input">
                    <span>nectworks<span className="blinking-cursor">/</span></span>
                    <label htmlFor="username-input" className="sr-only">Choose your username</label>
                    <input 
                      id="username-input"
                      type="text" 
                      placeholder="choose your username" 
                      value={username}
                      onChange={handleUsernameChange}
                      className="input__name"
                      aria-describedby="username-description"
                      autoComplete="username"
                    />
                    <div id="username-description" className="sr-only">
                      Enter a username for your Nectworks profile
                    </div>
                  </div>
                  <Link href="/sign-up">
                    <button 
                      className={`signup-button ${!username ? 'disabled' : ''}`}
                      disabled={!username}
                      type="button"
                      aria-describedby="signup-button-description"
                    >
                      <span className="button-text">Get Started</span>
                      <span className="button-icon" aria-hidden="true">→</span>
                    </button>
                  </Link>
                  <div id="signup-button-description" className="sr-only">
                    {!username ? 'Enter a username to continue' : 'Start your Nectworks journey'}
                  </div>
                </section>
              )}
              
              {isInitialLoad && !authCheckComplete && (
                <section 
                  className="hero__loading" 
                  style={{
                    opacity: isInitialLoad ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                  aria-label="Loading authentication status"
                >
                  <div className="auth-loading-skeleton">
                    <div className="skeleton-line" aria-hidden="true"></div>
                    <div className="skeleton-button" aria-hidden="true"></div>
                  </div>
                </section>
              )}
              
              <aside className="hero-stats" aria-labelledby="stats-heading">
                <h3 id="stats-heading" className="sr-only">Platform Statistics</h3>
                <dl>
                  <div className="stat-item">
                    <dt className="sr-only">Number of active referrers</dt>
                    <dd className="stat-number">100+</dd>
                    <dd className="stat-label">Active Referrers</dd>
                  </div>
                  <div className="stat-item">
                    <dt className="sr-only">Number of job seekers</dt>
                    <dd className="stat-number">1000+</dd>
                    <dd className="stat-label">Job Seekers</dd>
                  </div>
                  <div className="stat-item">
                    <dt className="sr-only">Percentage faster referrals</dt>
                    <dd className="stat-number">85%</dd>
                    <dd className="stat-label">Faster Referrals</dd>
                  </div>
                </dl>
              </aside>
            </div>
            <aside className="hero__image animation-container" role="img" aria-labelledby="hero-image-description">
              <div id="hero-image-description" className="sr-only">
                Nectworks platform interface showing dashboard and referral management features
              </div>
              <div className="image-container">
                <Image 
                  src="/heroSectionHeroImg.webp" 
                  alt="Nectworks platform dashboard interface showing job referral management system"
                  className="main-image"
                  width={600}
                  height={400}
                  priority
                  loading="eager"
                />
                <div className="floating-element one" aria-hidden="true"></div>
                <div className="floating-element two" aria-hidden="true"></div>
                <div className="floating-element three" aria-hidden="true"></div>
              </div>
            </aside>
          </div>
          <div className="hero-scroll-indicator" role="button" tabIndex="0" aria-label="Scroll to explore more content">
            <span>Scroll to explore</span>
            <div className="scroll-arrow" aria-hidden="true"></div>
          </div>
        </section>

        {/* Data Intelligence Section */}
        <DataIntelligenceSection />

        {/* Audience Tabs Section */}
        <section className="audience-tabs animation-container" itemScope itemType="https://schema.org/Service">
          <div className="tabs-container">
            <header className="section-header">
              <h2>Find Your Path</h2>
              <p>Whether you&apos;re looking for a job or want to refer candidates, we&apos;ve got you covered</p>
            </header>
            
            <div className="tabs-header" role="tablist" aria-label="User type selection">
              <button
                className={`tab-button ${activeTab === 'referrer' ? 'active' : ''}`}
                onClick={() => setActiveTab('referrer')}
                role="tab"
                aria-selected={activeTab === 'referrer'}
                aria-controls="referrer-panel"
                id="referrer-tab"
                type="button"
              >
                For Referrers
              </button>
              <button
                className={`tab-button ${activeTab === 'jobseeker' ? 'active' : ''}`}
                onClick={() => setActiveTab('jobseeker')}
                role="tab"
                aria-selected={activeTab === 'jobseeker'}
                aria-controls="jobseeker-panel"
                id="jobseeker-tab"
                type="button"
              >
                For Job Seekers
              </button>
            </div>
            
            <div className="tabs-content">
              {activeTab === 'referrer' ? (
                <article 
                  className="tab-panel" 
                  role="tabpanel" 
                  id="referrer-panel" 
                  aria-labelledby="referrer-tab"
                  itemScope 
                  itemType="https://schema.org/Service"
                >
                  <h3 itemProp="name">Become a Meta-referrer</h3>
                  <p itemProp="description">
                    Streamline your referral process, manage candidates efficiently,
                    and maximize your referral bonuses - all in one platform.
                  </p>
                  <ol className="steps">
                    <li className="step">
                      <div className="step-number" aria-hidden="true">1</div>
                      <p>Create your Nectworks account</p>
                    </li>
                    <li className="step">
                      <div className="step-number" aria-hidden="true">2</div>
                      <p>Share your personalized link to reach quality candidates</p>
                    </li>
                    <li className="step">
                      <div className="step-number" aria-hidden="true">3</div>
                      <p>Manage referrals and earn bonuses with minimal effort</p>
                    </li>
                  </ol>
                </article>
              ) : (
                <article 
                  className="tab-panel" 
                  role="tabpanel" 
                  id="jobseeker-panel" 
                  aria-labelledby="jobseeker-tab"
                  itemScope 
                  itemType="https://schema.org/Service"
                >
                  <h3 itemProp="name">Find Your Dream Job</h3>
                  <p itemProp="description">
                    Connect with referrers at your target companies without awkward cold messages.
                    Send your profile to multiple potential referrers in just a few clicks.
                  </p>
                  <ol className="steps">
                    <li className="step">
                      <div className="step-number" aria-hidden="true">1</div>
                      <p>Create your Nectworks account</p>
                    </li>
                    <li className="step">
                      <div className="step-number" aria-hidden="true">2</div>
                      <p>Complete your profile with your experience and target roles</p>
                    </li>
                    <li className="step">
                      <div className="step-number" aria-hidden="true">3</div>
                      <p>Send referral requests to multiple referrers with one click</p>
                    </li>
                  </ol>
                </article>
              )}
              
              <Link href={showWelcomeMessage ? "/profile" : "/sign-up"} onClick={scrollToTop}>
                <button className="primary-button" type="button">
                  <span className="button-text">
                    {showWelcomeMessage ? "Go to Profile" : "Start Your Journey"}
                  </span>
                  <span className="button-icon" aria-hidden="true">→</span>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorksSection />

        <FeatureSection
          image="/Illustration.webp"
          imageAlt="AI-driven referral matching algorithm visualization showing candidate and job matching process"
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
          imageAlt="Nectworks referral dashboard interface showing candidate management and filtering options"
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
          imageAlt="Centralized candidate management system showing organized referral tracking and status updates"
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
        <section className="alert-section animation-container" role="complementary" aria-labelledby="safety-heading">
          <div className="alert-container">
            <div className="alert-content">
              <div className="alert-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Warning icon">
                  <path d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 id="safety-heading">Stay Safe from Fraudulent Practices</h2>
              <p>
                In today&apos;s job market, your inbox can get flooded with suspicious job alerts.
                Learn how to identify and avoid fraudulent recruitment practices.
              </p>
            </div>
            <Link href="/fraudulent-activity">
              <button className="alert-button" type="button">
                Learn More
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </Link>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section animation-container" itemScope itemType="https://schema.org/FAQPage" aria-labelledby="faq-heading">
          <header className="section-header">
            <h2 id="faq-heading">
              <span className="highlight">Quick answers</span> to common questions
            </h2>
            <p>Everything you need to know about our platform</p>
          </header>
          <Accordion />
        </section>

        {/* Final CTA Section */}
        <CTASection />
      </main>
    </>
  );
}