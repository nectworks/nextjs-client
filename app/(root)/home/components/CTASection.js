/*
  FileName: CTASection.js
  Desc: This component renders a modern call-to-action section that encourages users to 
  sign up for the Nectworks platform. It features a compelling headline, supporting 
  description text, prominent action buttons with hover effects, and key statistics 
  to build credibility. The section uses high-contrast colors, gradient backgrounds,
  and interactive elements to drive conversions.
*/

import React from 'react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="cta-section animation-container">
      <div className="cta-background"> 
        <div className="cta-shapes"> 
          <div className="shape shape-1">
          </div> 
          <div className="shape shape-2">
          </div> 
          <div className="shape shape-3"> 
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="svg-shape" > 
              <path style={{ fill: "#2780df", stroke: "#2A424F" }} d="M 22,43 C 18,48 6.5,45 4.2,56 2,62 2,81 14,79 13,64 12,57 12,57 c 0,0 1,14 2,21 9,4 24,4 35,-1 0,-8 -1,-13 0,-18 0,-5 0,19 0,19 0,0 6,2 8,-5 3,-10 5,-24 -9,-28 -9,-1 -7,-2 -8,-2 -2,0 -18,0 -18,0 z"/>
              <path style={{ fill: "#C29B82", stroke: "#693311" }} d="m 23,38 c 0,0 1,3 -1,5 3,4 11,8 18,0 -1,-2 -1,-2 -1,-5 0,0 -16,0 -16,0 z"/>
              <path style={{ fill: "#CDA68E", stroke: "#693311" }} d="M 31,42 C 17,42 7.6,4.8 31,4.2 55,4.1 44,42 31,42 z"/>
              <path style={{ fill: "#553932", stroke: "#311710" }} d="M 17,26 C 14,16 14,3.2 31,2.4 44,3.1 49,15 44,26 44,21 45,19 43,16 39,15 33,16 28,11 27,15 15,13 17,26 z"/>
              <path style={{ fill: "#5F3E20", stroke: "#311710" }} d="m 45,65 c 5,-8 0,-25 3,-31 3,-10 7,-16 16,-16 10,0 16,8 20,17 1,2 0,6 2,11 1,4 -1,8 -1,10 0,5 -1,3 2,9 -5,13 -34,10 -42,0 z"/>
              <path style={{ fill: "#D8933B", stroke: "#2A424F" }} d="m 58,60 c -5,5 -18,3 -20,13 -2,6 -1,25 11,24 -1,-16 -3,-23 -3,-23 0,0 2,15 3,21 9,5 23,5 35,-1 0,-6 -1,-13 0,-18 1,-5 0,20 0,20 0,0 7,1 9,-6 2,-9 4,-22 -7,-25 -9,-3 -10,-5 -12,-5 -1,0 -16,0 -16,0 z"/>
              <path style={{ fill: "#DEB89F", stroke: "#693311" }} d="m 58,54 c 0,0 1,3 0,7 3,3 10,8 16,0 -1,-4 -1,-4 -1,-7 0,0 -15,0 -15,0 z"/>
              <path style={{ fill: "#DBBFA8", stroke: "#693311" }} d="M 66,59 C 52,59 43,21 66,20 86,21 79,59 66,59 z"/>
              <path style={{ fill: "#5F3E20" }} d="m 63,27 c -3,5 -7,8 -12,9 -4,1 2,-17 13,-17 5,0 13,3 15,15 -6,1 -14,-5 -16,-7"/> 
            </svg> 
          </div> 
        </div> 
      </div>
      <div className="cta-container">
        <div className="cta-content">
          <h2>Ready to Transform Your Hiring Process?</h2>
          <p>Join thousands of professionals already using Nectworks to streamline hiring and advance their careers.</p>
          <div className="cta-buttons">
            <Link href="/sign-up">
              <button className="primary-button cta-primary">
                <span className="button-text">Get Started</span>
                <span className="button-icon">→</span>
              </button>
            </Link>
          </div>
        </div>
        <div className="cta-stats">
          <div className="stat-item">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 20H7C4.79086 20 3 18.2091 3 16V8C3 5.79086 4.79086 4 7 4H17C19.2091 4 21 5.79086 21 8V16C21 18.2091 19.2091 20 17 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 8.5C16 9.88071 14.8807 11 13.5 11C12.1193 11 11 9.88071 11 8.5C11 7.11929 12.1193 6 13.5 6C14.8807 6 16 7.11929 16 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18 18H9C9 15.7909 10.7909 14 13 14C15.2091 14 17 15.7909 17 18H18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 6H7V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 18H7V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>100+</h3>
            <p>Active Referrers</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>1000+</h3>
            <p>Job Seekers</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>85%</h3>
            <p>Faster Referrals</p>
          </div>
        </div>
      </div>
      
      <div className="cta-badge">
        <span>Free to get started</span>
      </div>
    </section>
  );
};

export default CTASection;