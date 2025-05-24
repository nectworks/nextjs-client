/*
  FileName: FeatureSection.js
  Desc: This component renders a feature section with an image and descriptive text.
  It displays a heading with highlighted text, paragraph description, icon, and an image
  in a flexible layout that can be reversed. The component includes hover effects
  for the image and modern interactive elements for improved user engagement.
*/

import React from 'react';

const FeatureSection = ({ image, imageAlt, title, highlight, description, reversed, icon, featurePoints = [] }) => {
  // SVG icons for features
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'sparkles':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 3V7M3 5H7M6 17V21M4 19H8M13 3L15.2857 9.85714L21 12L15.2857 14.1429L13 21L10.7143 14.1429L5 12L10.7143 9.85714L13 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'clock':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'folder':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V9C21 7.89543 20.1046 7 19 7H13L11 5H5C3.89543 5 3 5.89543 3 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section className={`feature-section ${reversed ? 'reversed' : ''} animation-container`}>
      <div className="feature-container">
        <div className="feature-content">
          {icon && (
            <div className="feature-icon">
              {getIcon(icon)}
            </div>
          )}
          <h2 className="feature-title">
            {title.split(highlight).map((part, index, array) => {
              if (index === array.length - 1) {
                return <span key={index}>{part}</span>;
              }
              return (
                <React.Fragment key={index}>
                  {part}
                  <span className="highlight">{highlight}</span>
                </React.Fragment>
              );
            })}
          </h2>
          <p className="feature-description">{description}</p>
          <div className="feature-points">
            <div className="feature-points">
              {featurePoints.map((point, idx) => (
              <div className="feature-point" key={idx}>
                <div className="point-icon"></div>
                <span>{point}</span>
              </div>
              ))}
            </div>
          </div>
        </div>
        <div className="feature-image">
          <div className="image-wrapper">
            <img src={image} alt={imageAlt} />
            <div className="image-overlay">
              <div className="overlay-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;