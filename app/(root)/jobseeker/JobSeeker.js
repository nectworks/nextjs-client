'use server';

/**
 * File name: JobSeeker.js
 * Description: This page is for the jobseekers.
 */

import './JobSeeker.css';
import FirstImage from '@/public/JobSeeker/jobseekerHeroImg.webp';
import Link from 'next/link';
import scrollToTop from '@/Utils/scrollToTop';
import Placeholder1 from '@/public/JobSeeker/placeholder_1.webp';

const JobSeeker = () => {
  return (
    <div className="whole_page">
      <div className="mobile-image"></div>
      <div className="JobSeeker_heading_first">
        <p>Tap into our referral network to land your dream job</p>
      </div>
      <p className="JobSeeker_subheading_first">
        A revolutionary stride keeping you in mind
      </p>
      <div className="placeholders_mobile_first">
        <img
          src={Placeholder1.src}
          alt="Image Not Found"
          className="placeholder_mobile_first"
          width={350}
          height={260}
        />
      </div>
      <div className="center-image">
        <img
          src={FirstImage.src}
          alt="Image Not Found"
          className="JobSeekerHeroImg"
        />
      </div>

      <div className="containers">
        <div className="content_first">
          <h3 className="content_heading">
            How to make the most out of our referral network?<br></br>
            <br></br>
          </h3>
          <p className="content_paragraphs first_paragraph">
            It’s pretty simple. There are more than one ways of sending a
            referral through our platform. Find a job that best suits your
            requirements and send out your referral request with your updated
            resume.<br></br>
            <br></br> Alternatively, if you have a job ID, simply send us a
            request, and we will match your requirements with available
            referrers. <br></br>
            <br></br> Let us take you through how you can set up your Nectworks
            account.<br></br>
          </p>
        </div>
      </div>

      <div className="containers">
        <div className="content_first">
          <h3 className="second_content_heading">1. Set up your profile</h3>
          <br></br>
          <p className="content_paragraphs">
            After signing up with your email, switch to your job seeker profile.
            Set up your username and add in your personal details like about,
            education, JobSeeker details in order to access your public profile.
            <br></br>
            <br></br> Once you send out a referral, your public profile is
            shared along with your request to referrers.
            <br></br>
            <br></br> It allows referrers to view your qualifications before
            referring you.
          </p>
          <div className="placeholders_mobile">
            <img
              src={Placeholder1.src}
              alt="Image Not Found"
              className="placehoder_mobile"
              width={350}
              height={260}
            />
          </div>
        </div>

        <div className="placeholders">
          <img
            src={Placeholder1.src}
            alt="Image Not Found"
            className="placehoder-Image"
          />
        </div>
      </div>
      <div className="containers">
        <div className="placeholders">
          <img
            src={Placeholder1.src}
            alt="Image Not Found"
            className="placehoder-Image"
          />
        </div>
        <div className="content_first">
          <h3 className="second_content_heading_left">
            2. Screen through job postings <br></br>
          </h3>
          <p className="content_paragraphs_left">
            Once your profile is created, head over to your dashboard and view
            the available job postings. You can screen through multiple job
            postings or set preferences in your profile for personalized
            suggestions. <br></br>
            <br></br>
            Open a job posting, screen through the details carefully, upload
            your resume and send out your request.
            <br></br>
            <br></br>
            Your public profile along with your resume will be sent to the
            referrer. <br></br>
            <br></br>
          </p>
          <div className="placeholders_mobile">
            <img
              src={Placeholder1}
              alt="Image Not Found"
              className="placehoder_mobile"
              width={350}
              height={260}
            />
          </div>
        </div>
      </div>
      <div className="containers">
        <div className="content_first">
          <h3 className="second_content_heading">
            3. Have a job ID? We got you covered<br></br>
            <br></br>
          </h3>
          <p className="content_paragraphs">
            Through our referral algorithm we will match your job requirements
            with referrers in our system and send out your request. <br></br>
            <br></br>
            Send out your referral request from the preferences tab in your
            dashboard, along with your job ID and job URL.
            <br></br>
            Alternatively, you can send referral requests for more than one job
            IDs to referrers directly through their public profiles. <br></br>
            <br></br>
          </p>
          <div className="placeholders_mobile">
            <img
              src={Placeholder1.src}
              alt="Image Not Found"
              className="placehoder_mobile"
              width={350}
              height={260}
            />
          </div>
        </div>
        <div className="placeholders">
          <img
            src={Placeholder1.src}
            alt="Image Not Found"
            className="placehoder-Image"
          />
        </div>
      </div>
      <div className="banner-container">
        <div className="text-left">
          <h3>Have more queries</h3>
          <p>
            Head over to our FAQ page or post a query at Contact Us and we will
            get back to you.
          </p>
        </div>
        <div className="btn-right">
          <Link href="/faq">
            <button className="JobSeeker-btn" onClick={scrollToTop}>
              FAQ
            </button>
          </Link>
          <Link href="/contact-us">
            <button className="JobSeeker-btn" onClick={scrollToTop}>
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobSeeker;
