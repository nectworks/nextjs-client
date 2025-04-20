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