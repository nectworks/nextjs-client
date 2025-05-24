/*
  FileName: HowItWorksSection.js
  Desc: This component displays a step-by-step process explaining how the Nectworks
  platform works. It features a modern, interactive design with animated step cards,
  each with a numbered indicator, title, description, and icon. The component guides 
  users through the platform's workflow in a visually appealing format designed to 
  appeal to Gen Z users while maintaining professionalism.
*/

import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Sign up and build your professional profile with your experience, skills, and preferences.',
      icon: 'user-plus'
    },
    {
      number: '02',
      title: 'Connect with Referrers',
      description: 'Find referrers at your target companies and send referral requests with a single click.',
      icon: 'network'
    },
    {
      number: '03',
      title: 'Track Your Progress',
      description: 'Monitor all your referral requests in one place and follow up as needed.',
      icon: 'chart-line'
    },
    {
      number: '04',
      title: 'Land Your Dream Job',
      description: 'Get referred to top companies and increase your chances of landing the perfect role.',
      icon: 'briefcase-check'
    }
  ];

  // SVG icons for each step
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'user-plus':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20 8V14M17 11H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'network':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 6L12 3L15 6M12 3V15M15 18L12 21L9 18M12 21V9M6 9L3 12L6 15M3 12H15M18 15L21 12L18 9M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'chart-line':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 16L12 11L16 15L22 9M22 9H17M22 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'briefcase-check':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 14L11 16L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className="how-it-works animation-container">
      <div className="container">
        <div className="section-header">
          <h2>How Nectworks Works</h2>
          <p>Our simple 4-step process makes job referrals easier than ever before</p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-card" key={index} style={{"--step-delay": `${index * 0.15}s`}}>
              <div className="step-icon">
                {getIcon(step.icon)}
              </div>
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              <div className="step-indicator">
                <div className="indicator-line"></div>
                <div className="indicator-dot"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="how-it-works-cta">
          <a href="/sign-up" className="text-link">
            Get started in minutes
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;