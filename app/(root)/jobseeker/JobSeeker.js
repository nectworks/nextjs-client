'use client';

/**
 * File name: JobSeeker.js
 * Description: Updated JobSeeker page with Gen-Z design aligned with Home.js
 */

import './JobSeeker.css';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import scrollToTop from '@/Utils/scrollToTop';
import FirstImage from '@/public/JobSeeker/jobseekerHeroImg.webp';

const JobSeeker = () => {
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
    <main className="jobseeker-page">
      {/* Hero Section */}
      <section className="jobseeker-hero" ref={heroRef}>
        <div className="jobseeker-container">
          <div className="jobseeker-hero-content">
            <span className="jobseeker-tag-line">For Job Seekers</span>
            <h1 className="jobseeker-hero-title">
              Get <span className="text-gradient">Referred</span> to Your Dream Job
            </h1>
            <p className="jobseeker-hero-subtitle">
              Tap into our powerful network of industry insiders who can refer you directly to hiring managers at top companies
            </p>
            <img
              src={FirstImage.src}
              alt="Job seeker connecting with referrers"
              className="jobseeker-hero-image"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <div className="jobseeker-container">
          <header className="section-header animation-container">
            <h2>How to Get Referred Through Nectworks</h2>
            <p>
              Our platform makes the referral process simple and transparent. Follow these steps to maximize your chances of landing your dream job.
            </p>
          </header>

          <div className="steps-grid">
            <div className="step-card animation-container" style={{ '--step-delay': '0.1s' }}>
              <div className="step-number">1</div>
              <h3 className="step-title">Set Up Your Profile</h3>
              <p className="step-description">
                Create your job seeker profile with your experience, education, and career details. Your public profile will be shared with potential referrers, so make it stand out with relevant skills and achievements.
              </p>
            </div>

            <div className="step-card animation-container" style={{ '--step-delay': '0.3s' }}>
              <div className="step-number">2</div>
              <h3 className="step-title">Browse Job Postings</h3>
              <p className="step-description">
                Explore available positions on your dashboard. Find opportunities that match your skills and goals, upload your resume, and send your referral request to insiders at your target companies.
              </p>
            </div>

            <div className="step-card animation-container" style={{ '--step-delay': '0.5s' }}>
              <div className="step-number">3</div>
              <h3 className="step-title">Use Job IDs for Direct Requests</h3>
              <p className="step-description">
                Already found a specific job you love? Just provide the job ID and URL, and our algorithm will match you with the right referrers who can boost your application and increase your chances of getting an interview.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="jobseeker-container">
          <div className="cta-content animation-container">
            <h2 className="cta-title">Ready to Start Your Journey?</h2>
            <p className="cta-description">
              Have questions or need assistance? We're here to help you navigate your career path and connect with the right opportunities.
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

export default JobSeeker;