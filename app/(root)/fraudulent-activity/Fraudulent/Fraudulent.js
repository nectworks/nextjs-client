/*
   File: Fraudulent.js
   Description: This file contains the Fraudulent page.
   It is served at /fraudulent-activity and shows the
   Fraudulent details and how we can prevent it.
*/

import './Fraudulent.css';
import Link from 'next/link';

const Fraudulent = () => {
  return (
    <div className="main">
      <div className="box ">
        <div className="fraudulent_header">
          <h2>Fraudulent recruitment practices</h2>
        </div>
        <p>
          When it comes to job search, your email can get spammed with multiple
          job alerts. Here&apos;s what you can do to stay safe from fraudulent
          practices.
        </p>
      </div>
      <div className="fraudulent_container">
        <div className="left-side">
          <h3>Report suspicious activities</h3>
          <Link href="/contact-us">
            <button className="fraudulent_btn">Contact Us</button>
          </Link>
        </div>
        <div className="right-side">
          <p className="justify-text">
            Recruitment fraud is a serious concern that can have detrimental
            effects on job seekers. To help you avoid falling victim to
            recruitment fraud, here are some important tips:
          </p>
          <p className="justify-text">
            <strong>1. Research the company: </strong> Before engaging with any
            company, conduct thorough research to verify its existence and
            reputation. Visit the official company website, search for online
            reviews and news articles, and check if the company is listed on
            reputable job portals.
          </p>
          <p className="justify-text">
            <strong>2. Beware of unsolicited job offers:</strong> Be cautious if
            you receive unexpected job offers via email or social media,
            especially from unknown sources. Legitimate companies typically
            follow a formal recruitment process and do not approach candidates
            out of the blue.
          </p>
          <p className="justify-text">
            <strong>3.Validate job postings:</strong> Double-check the
            legitimacy of job postings by cross-referencing the information
            provided. Look for inconsistencies, grammatical errors, or vague
            details that may indicate a fraudulent posting. Legitimate job
            openings are typically detailed and include specific requirements.
          </p>
          <p className="justify-text">
            <strong>4. Verify contact information: </strong>Legitimate companies
            provide valid contact information, including an official email
            address and phone number. Avoid job offers that only provide generic
            email addresses or personal email accounts.
          </p>
          <p className="justify-text">
            <strong>5. Never pay for job applications:</strong> Legitimate
            employers do not require applicants to pay any fees for job
            applications, interviews, or background checks. Be wary of any
            requests for money or personal financial information during the
            recruitment process.
          </p>
          <p className="justify-text">
            <strong>6. Be cautious of unusual interview processes:</strong>
            Exercise caution if the interview process seems unconventional or
            deviates from standard practices. Be wary of online interviews
            conducted through unsecured platforms or interviews that seem
            unprofessional or overly casual.
          </p>
          <p className="justify-text">
            <strong>7. Trust your instincts: </strong>If something feels off or
            too good to be true, trust your instincts. If a job offer seems
            suspicious, incomplete, or inconsistent, it&apos;s better to be
            cautious and investigate further before proceeding.
          </p>
          <p className="justify-text">
            <strong>8. Protect your personal information: </strong>Never share
            sensitive personal information, such as your Social Security number,
            bank details, or passport information, unless you are certain of the
            legitimacy of the employer and the job opportunity.
          </p>
          <p className="justify-text">
            <strong>9. Report suspected fraud:</strong> If you encounter any
            suspicious job offers or suspect recruitment fraud, report it to the
            appropriate authorities, such as your local law enforcement agency
            or the national consumer protection agency in your country.
          </p>
          <p className="justify-text">
            Remember, it&apos;s important to stay vigilant and conduct thorough
            research before engaging with any company or providing personal
            information during the job search process. By following these tips,
            you can reduce the risk of falling victim to recruitment fraud and
            protect yourself during your job search.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Fraudulent;
