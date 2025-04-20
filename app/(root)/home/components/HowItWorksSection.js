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

  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How Nectworks Works</h2>
          <p>Our simple 4-step process makes job referrals easier than ever before</p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              <div className="step-icon">
                <svg className="icon" width="24" height="24" viewBox="0 0 24 24">
                  {/* We'd normally use an SVG icon here based on the icon name */}
                  <rect width="24" height="24" fill="none" rx="12" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;