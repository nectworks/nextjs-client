import React, { useState } from 'react';

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Nectworks completely transformed how I approach job referrals. I've helped 12 people get hired and earned over $15,000 in referral bonuses in just 6 months!",
      name: "Alex Thompson",
      role: "Senior Software Engineer",
      company: "TechGiant Inc.",
      avatar: "/testimonial-1.jpg" // These would be placeholder images
    },
    {
      id: 2,
      quote: "As a hiring manager, Nectworks has been a game-changer. The quality of referred candidates is significantly higher, and our time-to-hire has dropped by 40%.",
      name: "Sarah Williams",
      role: "Engineering Manager",
      company: "InnovateCorp",
      avatar: "/testimonial-2.jpg"
    },
    {
      id: 3,
      quote: "I landed my dream job at a FAANG company through Nectworks after months of applying through traditional job boards with no success. The personal connection made all the difference.",
      name: "Michael Chen",
      role: "Product Designer",
      company: "CreativeSolutions",
      avatar: "/testimonial-3.jpg"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

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
          </div>

          <div className="carousel-controls">
            <button className="control-button prev" onClick={prevTestimonial}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="carousel-indicators">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  className={`indicator ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button className="control-button next" onClick={nextTestimonial}>
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