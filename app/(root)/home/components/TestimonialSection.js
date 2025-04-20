/*
  FileName: TestimonialSection.js
  Desc: This component renders a carousel of user testimonials to build trust and 
  showcase success stories. It features auto-rotating testimonials that change every 
  5 seconds, navigation controls, and a final CTA slide that encourages users to 
  sign up and share their own feedback. The component helps build credibility by 
  displaying real user experiences with the Nectworks platform.
*/

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const TestimonialSection = () => {
  // Regular testimonials
  const testimonials = [
    {
      id: 1,
      quote: "Nectworks completely changed how I approach job referrals. I've helped a lot of people get hired and earned good in referral bonuses!",
      name: "Chandan Sharma",
      role: "Senior AI/ML Engineer",
      company: "Fujitsu",
      avatar: "/testimonial-1.jpg" // These would be placeholder images
    },
    {
      id: 2,
      quote: "The platform is user-friendly and the referral process is seamless. I was able to refer multiple candidates to my company easily",
      name: "Vanshi",
      role: "SDE3",
      company: "Oracle",
      avatar: "/testimonial-2.jpg"
    },
    {
      id: 3,
      quote: "Super easy to use! love how I can track all my referrals in one place. The support team is also very responsive.",
      name: "Subhradeep",
      role: "Software Engineer",
      company: "Expedia Group",
      avatar: "/testimonial-3.jpg"
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
  const timerRef = useRef(null);

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
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(nextTestimonial, 5000);
    }
  };

  // Set up auto-rotation with 5 second intervals
  useEffect(() => {
    timerRef.current = setInterval(nextTestimonial, 5000);
    
    // Clean up timer on component unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands of professionals who trust Nectworks</p>
        </div>

        <div className="testimonial-carousel">
          <div className="testimonial-container">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className={`testimonial-card ${index === activeIndex ? 'active' : ''}`}
              >
                <div className="quote-icon">
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.0002 24L8.00016 32H14.0002V40H6.00016V32L12.0002 24V16H14.0002V24ZM26.0002 24L20.0002 32H26.0002V40H18.0002V32L24.0002 24V16H26.0002V24Z" fill="currentColor"/>
                  </svg>
                </div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="avatar">
                    {/* This would be a real image in production */}
                    <div className="avatar-placeholder"></div>
                  </div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* CTA Slide */}
            <div 
              className={`testimonial-card cta-testimonial ${activeIndex === allSlides.length - 1 ? 'active' : ''}`}
            >
              <h3 className="cta-title">Share Your Nectworks Story</h3>
              <p className="cta-message">
                Join our platform, refer candidates, and share your experience. 
                Your success story could be featured here!
              </p>
              <div className="cta-buttons">
                <Link href="/sign-up">
                  <button className="primary-button">Sign Up Now</button>
                </Link>
                <Link href="/feedback">
                  <button className="secondary-button">Leave Feedback</button>
                </Link>
              </div>
            </div>
          </div>

          <div className="carousel-controls">
            <button className="control-button prev" onClick={prevTestimonial} aria-label="Previous testimonial">
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
            <button className="control-button next" onClick={nextTestimonial} aria-label="Next testimonial">
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