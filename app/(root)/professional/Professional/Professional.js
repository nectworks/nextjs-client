'use client';

/**
 * File name: Professional.js
 * Description: Updated Professional page with Gen-Z design aligned with Home.js
 */

import './Professional.css';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import scrollToTop from '@/Utils/scrollToTop';
import FirstImage from '@/public/Professional/professionalHeroImg.webp';

const Professional = () => {
  const heroRef = useRef(null);
  
  // Animation on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animationContainers = document.querySelectorAll('.animation-container');
    animationContainers.forEach((container) => {
      observer.observe(container);
    });

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      animationContainers.forEach((container) => {
        observer.unobserve(container);
      });
      
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <main className="professional-page">
      {/* Hero Section */}
      <section className="professional-hero" ref={heroRef}>
        <div className="professional-container">
          <div className="professional-hero-content">
            <span className="professional-tag-line">For Professionals</span>
            <h1 className="professional-hero-title">
              Become a <span className="text-gradient">Referrer</span> at Your Company
            </h1>
            <p className="professional-hero-subtitle">
              Help connect talented candidates with opportunities at your company and streamline your referral process with our platform
            </p>
            <img
              src={FirstImage.src}
              alt="Professional referring job candidates"
              className="professional-hero-image"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="professional-container">
          <header className="section-header animation-container">
            <h2>How It Works for Professionals</h2>
            <p>
              Our platform makes managing referrals simple and efficient. Follow these steps to start referring qualified candidates to your company.
            </p>
          </header>

          <div className="features-grid">
            <div className="feature-card animation-container" style={{ '--step-delay': '0.1s' }}>
              <div className="feature-number">1</div>
              <h3 className="feature-title">Verify Your Professional Email</h3>
              <p className="feature-description">
                Add and verify your company email to access all professional features. This verification allows you to post job openings at your company and unlocks additional tools for managing referrals.
              </p>
            </div>

            <div className="feature-card animation-container" style={{ '--step-delay': '0.3s' }}>
              <div className="feature-number">2</div>
              <h3 className="feature-title">Create Your Username</h3>
              <p className="feature-description">
                Choose a unique username for your profile that will show up in your public profile URL. Share this link on your social channels to attract referral requests from qualified candidates.
              </p>
            </div>

            <div className="feature-card animation-container" style={{ '--step-delay': '0.5s' }}>
              <div className="feature-number">3</div>
              <h3 className="feature-title">Complete Your Profile</h3>
              <p className="feature-description">
                Add your personal details, including a brief intro, your academic and professional background, and your skills. A complete profile helps job seekers understand who you are at the company.
              </p>
            </div>

            <div className="feature-card animation-container" style={{ '--step-delay': '0.7s' }}>
              <div className="feature-number">4</div>
              <h3 className="feature-title">Post Job Openings</h3>
              <p className="feature-description">
                Add available positions at your company with details like job title, location, work type, responsibilities, and job ID to attract qualified candidates seeking referrals for specific roles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="professional-container">
          <div className="cta-content animation-container">
            <h2 className="cta-title">Ready to Start Referring?</h2>
            <p className="cta-description">
              Have questions or need assistance? Check out our resources or contact our team for help with setting up your professional profile.
            </p>
            <div className="cta-buttons">
              <Link href="/faq">
                <button className="cta-btn" onClick={scrollToTop}>
                  View FAQ
                </button>
              </Link>
              <Link href="/contact-us">
                <button className="cta-btn" onClick={scrollToTop}>
                  Get in Touch
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Professional;