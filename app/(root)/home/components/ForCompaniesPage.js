'use client';


/*
  FileName: ForCompaniesPage.js
  Desc: Comprehensive page showcasing Nectworks for enterprise clients.
  Features AI dashboard capabilities, job referral management, employee
  profile sharing, and tutorial video. Designed with Gen Z aesthetics
  while maintaining professional credibility for corporate decision-makers.
  Location: app/(root)/home/components/ForCompaniesPage.js
*/

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../Home.css'; // Import the CSS file

// Import Header and Footer components (adjust paths as needed)
// import Header from '../../_components/Header/Header';
// import Footer from '../../_components/Footer/Footer';

export default function ForCompaniesPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const videoRef = useRef(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  // Animation state for observed elements
  const [visibleSections, setVisibleSections] = useState(new Set());

  const features = [
    {
      icon: 'brain',
      title: 'AI-Powered Candidate Search',
      description: 'Our intelligent dashboard analyzes thousands of profiles to find candidates that perfectly match your job requirements.',
      details: [
        'Advanced filtering by skills, experience, and preferences',
        'ML-powered candidate ranking and scoring',
        'Real-time availability and interest indicators',
        'Automated candidate-job matching suggestions'
      ]
    },
    {
      icon: 'network',
      title: 'Streamlined Referral Management',
      description: 'Transform your employee referral program with our centralized platform that eliminates email chaos.',
      details: [
        'One-click referral submissions from employees',
        'Automated tracking and status updates',
        'Built-in communication tools for follow-ups',
        'Referral bonus tracking and management'
      ]
    },
    {
      icon: 'shield',
      title: 'Privacy-First Profile Sharing',
      description: 'Employees can share their Nectworks profiles without exposing personal or work email addresses.',
      details: [
        'Secure profile links for candidate discovery',
        'No personal contact information exposed',
        'Professional brand building for employees',
        'Compliance with data privacy regulations'
      ]
    },
    {
      icon: 'dashboard',
      title: 'Consolidated Candidate Hub',
      description: 'All your potential hires in one place - no more scattered spreadsheets or lost applications.',
      details: [
        'Unified candidate pipeline management',
        'Integration with popular ATS systems',
        'Custom hiring workflow automation',
        'Real-time collaboration tools for hiring teams'
      ]
    }
  ];

  const stats = [
    { number: '60%', label: 'Faster Time-to-Hire', icon: 'clock' },
    { number: '3x', label: 'More Quality Candidates', icon: 'users' },
    { number: '45%', label: 'Reduced Recruiting Costs', icon: 'dollar' },
    { number: '92%', label: 'Employee Satisfaction', icon: 'heart' }
  ];

  // SVG icons
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'brain':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C13.1046 2 14 2.89543 14 4C14 4.53043 13.7893 5.03914 13.4142 5.41421C13.0391 5.78929 12.5304 6 12 6C11.4696 6 10.9609 5.78929 10.5858 5.41421C10.2107 5.03914 10 4.53043 10 4C10 2.89543 10.8954 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6C14.2091 6 16 7.79086 16 10V14C16 16.2091 14.2091 18 12 18C9.79086 18 8 16.2091 8 14V10C8 7.79086 9.79086 6 12 6Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 10C6.89543 10 6 10.8954 6 12C6 13.1046 6.89543 14 8 14" stroke="currentColor" strokeWidth="2"/>
            <path d="M16 10C17.1046 10 18 10.8954 18 12C18 13.1046 17.1046 14 16 14" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 18V22M10 20H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'network':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="5" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            <circle cx="19" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'shield':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L21 5V11C21 16.55 17.16 21.74 12 23C6.84 21.74 3 16.55 3 11V5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'dashboard':
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="12" width="7" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="16" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'clock':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'users':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M23 21V19C23 18.1332 22.7361 17.2923 22.2447 16.5852C21.7534 15.8781 21.0577 15.3393 20.2493 15.0393" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 3.13C16.8604 3.41245 17.623 3.94823 18.1676 4.67706C18.7122 5.40588 19.0078 6.29009 19.0078 7.195C19.0078 8.09991 18.7122 8.98412 18.1676 9.71294C17.623 10.4418 16.8604 10.9775 16 11.26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'dollar':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1V23M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'heart':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'play':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <polygon points="10,8 16,12 10,16" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    // Setup Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-section-id');
            if (sectionId) {
              setVisibleSections(prev => new Set([...prev, sectionId]));
            }
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections with animation-container class
    document.querySelectorAll('.animation-container').forEach((el, index) => {
      el.setAttribute('data-section-id', `section-${index}`);
      observer.observe(el);
    });

    // Video intersection observer
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoVisible(true);
            if (videoRef.current) {
              videoRef.current.play().catch(console.error);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) {
      videoObserver.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
      videoObserver.disconnect();
    };
  }, []);

  return (
    <>
      {/* Uncomment when Header component is available */}
      {/* <Header /> */}
      
      <main className="for-companies-page">
        {/* Hero Section */}
        <section className="companies-hero animation-container" data-section-id="hero">
          <div className="companies-hero-container">
            <div className="companies-hero-content">
              <div className="tag-line">Enterprise Solution</div>
              <h1 className="companies-hero-title">
                <span className="text-gradient">Supercharge</span> Your Hiring Process
              </h1>
              <p className="companies-hero-subtitle">
                Transform how your company finds, evaluates, and hires top talent. 
                Our AI-powered platform streamlines referrals, eliminates email chaos, 
                and connects you with the best candidates faster than ever.
              </p>
              <div className="companies-hero-buttons">
                <Link href="#demo">
                  <button className="watch-demo-button">
                    {getIcon('play')}
                    <span className="button-text">Watch Demo</span>
                  </button>
                </Link>
                <Link href="/contact-us">
                  <button className="contact-us-button">
                    <span className="button-text">Contact Us</span>
                    <span className="button-icon">→</span>
                  </button>
                </Link>
              </div>
            </div>
            <div className="companies-hero-stats">
              {stats.map((stat, index) => (
                <div className="companies-stat-card" key={index}>
                  <div className="companies-stat-icon">
                    {getIcon(stat.icon)}
                  </div>
                  <div className="companies-stat-number">{stat.number}</div>
                  <div className="companies-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Demo Section */}
        <section className="video-demo-section animation-container" id="demo" data-section-id="video">
          <div className="companies-container">
            <div className="section-header">
              <h2>See Our Platform in Action</h2>
              <p>Watch how Nectworks transforms your hiring workflow in under 2 minutes</p>
            </div>
            <div className="video-container">
              <video
                ref={videoRef}
                className="demo-video"
                controls
                loop
                muted
                poster="/videoThumbnail.jpg"
                preload="metadata"
              >
                <source src="/tutorialCompany.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-overlay">
                <div className="play-button-overlay">
                  <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="50" fill="rgba(0, 87, 177, 0.9)"/>
                    <path d="M35 25L75 50L35 75V25Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-showcase animation-container" data-section-id="features">
          <div className="companies-container">
            <div className="section-header">
              <h2>Everything You Need to <span className="highlight">Hire Smarter</span></h2>
              <p>Powerful features designed for modern recruiting teams</p>
            </div>
            
            <div className="features-grid">
              {features.map((feature, index) => (
                <div 
                  className={`companies-feature-card ${activeFeature === index ? 'active' : ''}`}
                  key={index}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="companies-feature-icon-container">
                    {getIcon(feature.icon)}
                  </div>
                  <h3 className="companies-feature-title">{feature.title}</h3>
                  <p className="companies-feature-description">{feature.description}</p>
                  <div className="companies-feature-details">
                    {feature.details.map((detail, idx) => (
                      <div className="companies-detail-item" key={idx}>
                        <div className="companies-check-icon">✓</div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works for Companies */}
        <section className="company-workflow animation-container" data-section-id="workflow">
          <div className="companies-container">
            <div className="section-header">
              <h2>How It Works for Your Team</h2>
              <p>Simple setup, powerful results in just three steps</p>
            </div>
            
            <div className="companies-workflow-steps">
              <div className="companies-step-card">
                <div className="companies-step-number">1</div>
                <div className="companies-step-content">
                  <h3>Setup Your Company Profile</h3>
                  <p>Create your company dashboard, add team members, and configure your hiring preferences in minutes.</p>
                </div>
              </div>
              <div className="companies-connection-arrow">→</div>
              
              <div className="companies-step-card">
                <div className="companies-step-number">2</div>
                <div className="companies-step-content">
                  <h3>Employees Share Their Profiles</h3>
                  <p>Your team members share their secure Nectworks profiles to attract quality candidates without exposing personal emails.</p>
                </div>
              </div>
              <div className="companies-connection-arrow">→</div>
              
              <div className="companies-step-card">
                <div className="companies-step-number">3</div>
                <div className="companies-step-content">
                  <h3>AI Finds Perfect Matches</h3>
                  <p>Our platform consolidates all candidates, ranks them using AI, and presents the best matches in your dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Security Section */}
        <section className="privacy-section animation-container" data-section-id="privacy">
          <div className="companies-container">
            <div className="companies-privacy-content">
              <div className="companies-privacy-text">
                <h2>Privacy-First Approach</h2>
                <p className="companies-privacy-description">
                  Your employees&apos; privacy matters. With Nectworks, team members can participate 
                  in referrals without exposing their work or personal email addresses.
                </p>
                <div className="companies-privacy-features">
                  <div className="companies-privacy-feature">
                    <div className="companies-feature-icon">🔒</div>
                    <div>
                      <h4>Secure Profile Sharing</h4>
                      <p>Employees control what information is visible to candidates</p>
                    </div>
                  </div>
                  <div className="companies-privacy-feature">
                    <div className="companies-feature-icon">🛡️</div>
                    <div>
                      <h4>No Email Exposure</h4>
                      <p>Communication happens through our secure platform</p>
                    </div>
                  </div>
                  <div className="companies-privacy-feature">
                    <div className="companies-feature-icon">✅</div>
                    <div>
                      <h4>GDPR Compliant</h4>
                      <p>Full compliance with international data protection regulations</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="companies-privacy-visual">
                <div className="companies-security-badge">
                  <div className="companies-badge-icon">🔐</div>
                  <h3>Enterprise Security</h3>
                  <p>Bank-level encryption and security protocols</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="companies-final-cta animation-container" data-section-id="cta">
          <div className="companies-cta-container">
            <div className="companies-cta-content">
              <h2>Ready to Transform Your Hiring?</h2>
              <p>Join innovative companies already using Nectworks to build better teams faster.</p>
              <div className="companies-cta-buttons">
                <Link href="/contact-us">
                  <button className="companies-cta-primary">
                    <span className="button-text">Contact Us Today</span>
                    <span className="button-icon">💬</span>
                  </button>
                </Link>
              </div>
              <p className="companies-cta-note">Let&apos;s discuss how Nectworks can transform your hiring process</p>
            </div>
          </div>
        </section>
      </main>
      
      {/* Uncomment when Footer component is available */}
      {/* <Footer /> */}
    </>
  );
}