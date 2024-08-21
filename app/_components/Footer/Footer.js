'use client';
/*
  FileName - Footer.js
  Desc - This file defines a React component (Footer)
  responsible for rendering the footer section of a webpage.
  The footer includes company information,
  links to various sections, social media icons, and copyright information.
*/
import Link from 'next/link';
import Image from 'next/image';
import companyName from '../../../public/nectworks-ssar04a-mil-11@2x.webp';
import linkedinImg from '../../../public/linkedinImage.webp';
import twitterIcon from '../../../public/twitterIcon.webp';
import './Footer.css';
import scrollToTop from '../../../Utils/scrollToTop';

export default function Footer() {
  return (
    <>
      {/* Footer Outer Container */}
      <div className="footer__outer__container">
        <div className="footer__container">
          {/* Top Section */}
          <div className="footer__container__top">
            {/* First Part */}
            <div className="first__part">
              <Link href="/">
                <img
                  src={companyName.src}
                  onClick={scrollToTop}
                  alt="Nectworks home page"
                />
              </Link>
              <p className="logoMoto"> Made for you, by people like you.</p>
            </div>

            {/* Second Part */}
            <div className="link__tags">
              <div className="second__part">
                <p className="footer__header"> Get in touch with us</p>
                <a href="/contact-us"> Contact Us </a>
              </div>

              {/* Third Part */}
              <div className="third__part" onClick={scrollToTop}>
                <p className="footer__header"> COMPANY</p>
                <a href="/about-us"> About Us </a>
                <a href="/professional"> Professionals </a>
                <a href="/jobseeker"> Job Seekers </a>
              </div>

              {/* Fourth Part */}
              <div className="fourth__part" onClick={scrollToTop}>
                <p className="footer__header"> SUPPORT </p>
                <a href="/faq"> FAQ </a>
              </div>
            </div>
          </div>
        </div>

        <hr />
        <div className="footer__copyright">
          <div className="company__copyright">
            <p>&#169;Nectworks Technology. 2024 All rights reserved</p>
            <div className="link__tags link__tagss" onClick={scrollToTop}>
              <a href="/terms-and-conditions">Terms and conditions</a>
              <a href="/privacy-policy">Privacy Policy</a>
            </div>
          </div>
          <div className="footer__links">
            <p className="social__media__text ">Find us on</p>
            <a
              href="https://www.linkedin.com/company/nectworks/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="social__media__icons"
                src={linkedinImg.src}
                alt="linkedin icon"
              />
            </a>
            <a
              href="https://twitter.com/nectworks"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="social__media__icons"
                src={twitterIcon.src}
                alt="twitter icon"
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
