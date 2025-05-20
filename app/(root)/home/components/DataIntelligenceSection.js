/*
  FileName: DataIntelligenceSection.js
  Desc: This component showcases Nectworks' data intelligence capabilities.
  It features an animated visualization of the platform's data processing,
  key metrics about the database size, and highlights the core value proposition
  of reorganizing professional data to be more actionable for hiring.
*/

import React from 'react';

const DataIntelligenceSection = () => {
  return (
    <section className="data-intelligence animation-container">
      <div className="container">
        <div className="data-content">
          <h2 className="section-title">
            Powered by <span className="text-gradient">Data Intelligence</span>
          </h2>
          <p className="section-description">
            We&apos;re reorganizing the world&apos;s professional data to make hiring more effective.
            Our platform combines the largest database of white-collar professionals with
            intelligent matching algorithms to connect the right talent with the right opportunities.
          </p>
          
          <div className="data-metrics">
            <div className="metric">
              <div className="metric-value">1000+</div>
              <div className="metric-label">Professional Profiles</div>
            </div>
            <div className="metric">
              <div className="metric-value">85%</div>
              <div className="metric-label">Matching Accuracy</div>
            </div>
            <div className="metric">
              <div className="metric-value">2x</div>
              <div className="metric-label">Faster Hiring</div>
            </div>
          </div>
        </div>
        
        <div className="data-visualization">
          <div className="viz-container">
            <div className="data-flow">
              <div className="data-node profiles">
                <div className="node-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Profiles</span>
              </div>
              <div className="connection-line"></div>
              
              <div className="data-node processing">
                <div className="node-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 2v4m4-4v4M2 10h4m-4 4h4m12-8h4m-4 4h4m-4 4h4M10 18v4m4-4v4m-9-13l4 4m0 6l-4 4m14-14l-4 4m0 6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>AI Processing</span>
              </div>
              <div className="connection-line"></div>
              
              <div className="data-node matching">
                <div className="node-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 14H19M12 7L19 14L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span>Smart Matching</span>
              </div>
            </div>
            
            <div className="pulse-effect"></div>
            
            <div className="floating-icons">
              <div className="floating-icon icon1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="floating-icon icon2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M10 20L14 4M18 8L22 12L18 16M6 16L2 12L6 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="floating-icon icon3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataIntelligenceSection;