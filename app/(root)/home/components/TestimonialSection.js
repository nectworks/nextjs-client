/*
  FileName: TestimonialSection.js
  Desc: This component renders a modern carousel of user testimonials to build trust and 
  showcase success stories. It features testimonials from users with a more authentic Gen Z tone,
  while maintaining professional credibility. Fixed to ensure testimonials display correctly
  and navigation buttons work properly on both mobile and desktop.
*/

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const TestimonialSection = () => {
  // Updated testimonials with more authentic Gen Z voices
  const testimonials = [
    {
      id: 1,
      quote: "Nectworks is a game-changer! I've helped 5 people get hired and earned ₹50,000 in referral bonuses this quarter without dealing with a flooded inbox.",
      name: "Chandan Sharma",
      role: "Senior AI/ML Engineer",
      company: "Fujitsu",
      avatar: "/testimonial-1.jpg" // These would be placeholder images
    },
    {
      id: 2,
      quote: "The platform is super intuitive and the referral process is totally seamless. No more awkward LinkedIn messages - I was able to refer multiple candidates to Oracle with just a few clicks!",
      name: "Vanshi",
      role: "SDE3",
      company: "Oracle",
      avatar: "/testimonial-2.jpg"
    },
    {
      id: 3,
      quote: "100% recommend Nectworks for job hunting. Got a referral at Expedia in 2 days! The referrer dashboard makes it easy to track everything in one place.",
      name: "Subhradeep",
      role: "Software Engineer",
      company: "Expedia Group",
      avatar: "/testimonial-3.jpg"
    },
    {
      id: 4,
      quote: "As a hiring manager, Nectworks cut our time-to-hire by 40%. The quality of candidates coming through referrals is significantly better than what we'd get from job boards.",
      name: "Priya Mehta",
      role: "Engineering Manager",
      company: "PayTM",
      avatar: "/testimonial-4.jpg"
    }
  ];

  // Add a CTA "testimonial" as the last item
  const allSlides = [
    ...testimonials,
    {
      id: 'cta',
      isCTA: true
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  // Function to go to next testimonial
  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % allSlides.length);
  };

  // Function to go to previous testimonial
  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + allSlides.length) % allSlides.length);
  };

  // Reset timer when user manually changes testimonial
  const goToTestimonial = (index) => {
    setActiveIndex(index);
    resetInterval();
  };

  // Function to reset the auto-rotation interval
  const resetInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(nextTestimonial, 6000);
    }
  };

  // Set up auto-rotation with 6 second intervals
  useEffect(() => {
    intervalRef.current = setInterval(nextTestimonial, 6000);
    
    // Clean up timer on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <section className="testimonials animation-container">
      <div className="container">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands of professionals who trust Nectworks</p>
        </div>

        <div className="testimonial-carousel">
          {/* Fixed testimonial display - each card is positioned absolutely and only active one is visible */}
          <div className="testimonial-slides">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`testimonial-card ${index === activeIndex ? 'active' : ''}`}
                style={{display: index === activeIndex ? 'block' : 'none'}}
              >
                <div className="quote-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.0002 24L8.00016 32H14.0002V40H6.00016V32L12.0002 24V16H14.0002V24ZM26.0002 24L20.0002 32H26.0002V40H18.0002V32L24.0002 24V16H26.0002V24Z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="testimonial-rating">
                  <div className="stars">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="avatar">
                    {/* This would be a real image in production */}
                    <div className="avatar-placeholder">{testimonial.name.charAt(0)}</div>
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* CTA Slide - Modified to match regular testimonial card structure */}
            <div 
              className={`testimonial-card ${activeIndex === allSlides.length - 1 ? 'active' : ''}`}
              style={{
                display: activeIndex === allSlides.length - 1 ? 'block' : 'none',
                backgroundColor: 'var(--secondary)'
              }}
            >
              <div className="quote-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.0002 24L8.00016 32H14.0002V40H6.00016V32L12.0002 24V16H14.0002V24ZM26.0002 24L20.0002 32H26.0002V40H18.0002V32L24.0002 24V16H26.0002V24Z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="cta-title">Share Your Nectworks Story</h3>
              <p className="testimonial-quote">
                Join our platform, refer candidates, and share your experience. 
                Your success story could be featured here!
              </p>
              <div className="cta-buttons">
                <Link href="/sign-up">
                  <button className="primary-button">
                    <span className="button-text">Sign Up Now</span>
                    <span className="button-icon">→</span>
                  </button>
                </Link>
                <Link href="/feedback">
                  <button className="secondary-button">Leave Feedback</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="carousel-controls">
            <button 
              className="control-button prev" 
              onClick={prevTestimonial} 
              aria-label="Previous testimonial"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="carousel-indicators">
              {allSlides.map((_, index) => (
                <button 
                  key={index} 
                  className={`indicator ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => goToTestimonial(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <button 
              className="control-button next" 
              onClick={nextTestimonial} 
              aria-label="Next testimonial"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;