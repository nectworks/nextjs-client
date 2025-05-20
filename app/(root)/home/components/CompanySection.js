/*
  FileName: CompanySection.js
  Desc: This component showcases the benefits of Nectworks for companies.
  It features a clean, professional design highlighting key advantages for
  corporate users including job posting capabilities, talent pool access,
  and hiring process optimization. Designed to balance the Gen Z appeal of
  the rest of the site while maintaining a professional appearance for
  business users.
*/

import React from 'react';
import Link from 'next/link';

const CompanySection = () => {
  const benefits = [
    {
      icon: 'magnifying-glass',
      title: 'Find Top Talent',
      description: 'Access our extensive pool of pre-vetted candidates with skills that match your requirements.'
    },
    {
      icon: 'lightning',
      title: 'Accelerate Hiring',
      description: 'Reduce your time-to-hire by up to 60% with our streamlined referral process.'
    },
    {
      icon: 'chart',
      title: 'Data Insights',
      description: 'Make informed hiring decisions with AI-powered candidate matching and analytics.'
    },
    {
      icon: 'dollar',
      title: 'Cost Effective',
      description: 'Save on recruiting costs while improving the quality of your candidate pipeline.'
    }
  ];

  // SVG icons for benefits
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'magnifying-glass':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'lightning':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'chart':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 8V16M12 11V16M8 14V16M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'dollar':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7C9.23858 7 7 9.23858 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12M12 7V5M12 7C14.7614 7 17 9.23858 17 12M12 17V19M12 17C9.23858 17 7 14.7614 7 12M17 12C17 9.23858 14.7614 7 12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="company-section animation-container">
      <div className="container">
        <div className="section-header">
          <h2>For <span className="highlight">Companies</span></h2>
          <p>Optimize your hiring process with our powerful platform</p>
        </div>

        <div className="company-benefits">
          {benefits.map((benefit, index) => (
            <div className="benefit-card" key={index}>
              <div className="benefit-icon">
                {getIcon(benefit.icon)}
              </div>
              <h3 className="benefit-title">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="company-features">
          <div className="company-image">
            <img src="/CompanySection.webp" alt="Nectworks for companies" />
            <div className="image-badge">
              <span>Enterprise Ready</span>
            </div>
          </div>
          
          <div className="company-content">
            <h3>Post Jobs & Manage Applicants</h3>
            <p>
              Nectworks makes it easy to post job openings and manage your applicants
              all in one place. Our platform connects you with the ideal candidates
              through our intelligent referral system.
            </p>
            <ul className="feature-list">
              <li>
                <div className="check-icon">✓</div>
                <span>Unlimited job postings</span>
              </li>
              <li>
                <div className="check-icon">✓</div>
                <span>Custom screening questions</span>
              </li>
              <li>
                <div className="check-icon">✓</div>
                <span>Automated candidate ranking</span>
              </li>
              <li>
                <div className="check-icon">✓</div>
                <span>Integration with your ATS</span>
              </li>
              <li>
                <div className="check-icon">✓</div>
                <span>Detailed analytics dashboard</span>
              </li>
            </ul>
            
            <Link href="/for-companies">
              <button className="primary-button">
                <span className="button-text">Learn More</span>
                <span className="button-icon">→</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;