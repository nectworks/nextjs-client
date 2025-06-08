/*
    FileName - About.js
    Desc - This file defines the AboutUs component that renders the About Us
    section of the webpage. It uses various images, styles, and context to
    display content related to the purpose and motivation behind the website.
    The component updates the global state using the dispatch function from
    the context.
*/

'use client';

import { useEffect, useRef } from 'react';
import './About.css';
import AboutImgThirdSection from '@/public/AboutUs/About_Img_Third_Section.webp';
import AboutBGPic1 from '@/public/AboutUs/About_Bg_Pic1.webp';
import AboutBGPic2 from '@/public/AboutUs/About_Bg_Pic2.webp';
import AboutBGPic3 from '@/public/AboutUs/About_Bg_Pic3.webp';
import AboutBGPic4 from '@/public/AboutUs/About_Bg_Pic4.webp';

const AboutUs = () => {
  const heroRef = useRef(null);
  
  // Animation on scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animationContainers = document.querySelectorAll('.animation-container');
    animationContainers.forEach((container) => {
      observer.observe(container);
    });

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => {
      animationContainers.forEach((container) => {
        observer.unobserve(container);
      });
      
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero" ref={heroRef}>
        <div className="about-container">
          <div className="about-hero-content">
            <span className="about-tag-line">Our Story</span>
            
            <div className="typing-container">
              <h3 className="typing-text">Hi! We are</h3>
            </div>
            
            <h1 className="about-hero-title">
              <span className="text-highlight">Revolutionizing</span> Job Referrals
            </h1>
            
            <div className="hero-image-grid">
              <div className="hero-image-item">
                <img src={AboutBGPic1.src} alt="Team collaboration" />
              </div>
              <div className="hero-image-item">
                <img src={AboutBGPic2.src} alt="Professional networking" />
              </div>
              <div className="hero-image-item">
                <img src={AboutBGPic3.src} alt="Career growth" />
              </div>
              <div className="hero-image-item">
                <img src={AboutBGPic4.src} alt="Digital recruitment" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-container">
          <header className="section-header animation-container">
            <h2>About Us</h2>
            <div className="section-divider"></div>
          </header>
          
          <p className="about-text animation-container">
            Nectworks is revolutionizing the job referral process for both job seekers and referrers. 
            By harnessing the power of referrals, we're helping job seekers get connected with top 
            companies and opportunities, while empowering referrers to play a more active role in 
            the hiring process. Our platform simplifies connections and creates meaningful career opportunities.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="about-container">
          <div className="mission-container">
            <div className="mission-image animation-container">
              <img 
                src={AboutImgThirdSection.src} 
                alt="Nectworks mission illustration"
              />
            </div>
            
            <div className="mission-content animation-container">
              <h2>Why We Do This?</h2>
              <p className="mission-text">
                We feel the frustration you go through when it comes to looking for a job. 
                We've been there too. The endless applications, the silence, the uncertainty.
              </p>
              <p className="mission-text">
                At Nectworks, we manifest this frustration into a product that benefits both 
                referrers and seekers to refer and seek jobs under one umbrella. We've created 
                a platform where connections matter and opportunities flow naturally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <div className="about-container">
          <header className="vision-header animation-container">
            <h2 className="vision-title">Our Vision</h2>
            <p className="vision-subtitle">
              Enhancing the referral workflow through innovative solutions that streamline 
              and simplify the referral process for everyone involved.
            </p>
          </header>
          
          <div className="vision-cards">
            <div className="vision-card animation-container" style={{ '--step-delay': '0.1s' }}>
              <p className="vision-card-text">
                Our user-friendly software platform empowers employees to effortlessly submit 
                referrals, while our automated tracking system ensures that no potential 
                candidates slip through the cracks.
              </p>
            </div>
            
            <div className="vision-card animation-container" style={{ '--step-delay': '0.3s' }}>
              <p className="vision-card-text">
                By centralizing and digitizing referrals, our tools save precious time and 
                effort for both employees and recruiters, optimizing the recruitment process 
                benefitting both employees and recruiters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Goal Section */}
      <section className="goal-section">
        <div className="about-container">
          <div className="goal-content animation-container">
            <div className="goal-divider">
              <div className="goal-divider-line"></div>
              <span className="goal-divider-text">What We Aim to Achieve</span>
              <div className="goal-divider-line"></div>
            </div>
            
            <h2 className="goal-title">
              Nectworks tools actively promote employee engagement in the recruitment journey.
            </h2>
            
            <div className="goal-grid">
              <div className="goal-item">
                <p>
                  By involving employees in the referral process, organizations cultivate a 
                  sense of ownership, collaboration, and active involvement.
                </p>
              </div>
              
              <div className="goal-item">
                <p>
                  Employees gain a greater sense of value and empowerment when their insights 
                  and connections contribute to identifying top talent.
                </p>
              </div>
              
              <div className="goal-item">
                <p>
                  This heightened engagement leads to increased job satisfaction, enhanced 
                  employee retention rates, and a more vibrant and positive work environment.
                </p>
              </div>
              
              <div className="goal-item">
                <p>
                  Our platform creates a seamless experience that connects talent with 
                  opportunity, creating value for all participants in the hiring process.
                </p>
              </div>
            </div>
            
            <div className="highlight-box">
              <div className="highlight-text">TheRevolution</div>
              <div className="highlight-bg"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;