/*
  FileName: FeatureSection.js
  Desc: This component renders a feature section with an image and descriptive text.
  It displays a heading with highlighted text, paragraph description, and an image
  in a flexible layout that can be reversed. The component includes hover effects
  for the image and responsive design for different screen sizes.
*/

import React from 'react';
import Image from 'next/image';

const FeatureSection = ({ image, imageAlt, title, highlight, description, reversed }) => {
  return (
    <section className={`feature-section ${reversed ? 'reversed' : ''}`}>
      <div className="feature-container">
        <div className="feature-content">
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
        </div>
        <div className="feature-image">
          <div className="image-wrapper">
            <img src={image} alt={imageAlt} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;