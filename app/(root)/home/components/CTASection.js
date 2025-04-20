import React from 'react';
import Link from 'next/link';

const CTASection = () => {
  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2>Ready to Revolutionize Your Hiring Process?</h2>
          <p>Join the thousands of professionals already using Nectworks to streamline hiring.</p>
          <div className="cta-buttons">
            <Link href="/sign-up">
              <button className="primary-button">Get Started</button>
            </Link>
            <Link href="/demo">
              <button className="secondary-button">Request a Demo</button>
            </Link>
          </div>
        </div>
        <div className="cta-stats">
          <div className="stat-item">
            <h3>2,500+</h3>
            <p>Active Referrers</p>
          </div>
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Job Seekers</p>
          </div>
          <div className="stat-item">
            <h3>85%</h3>
            <p>Faster Referrals</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;