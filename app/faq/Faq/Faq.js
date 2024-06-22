'use client';
/*
  FileName: Faq.js
  Description: This file defines a React component (Faq). The purpose of this component is to serve as the starting point for building the FAQ page within a React application. This component is served at /faq and has a small compilation of common
  questions that users might have
*/
import { useEffect, useState } from 'react';
import './Faq.css';
import Image from 'next/image';
import accordianArrow from '../../public/accordianArrow.svg';

export default function Faq() {
  const [faqOption, setFaqOption] = useState(1);
  const jobSeekerQuestions = [
    {
      question: 'Is it free for job seekers?',
      answer: 'Our services are absolutely free for job seekers.',
    },
    {
      question: 'How does it work?',
      answer:
        'You can either submit a referral request, ' +
        'specific to a job posting or share a Job ID or Job URL.' +
        ' We will send the request to the referrers in the company of ' +
        'your choosing.',
    },
    {
      question: 'Are interviews guaranteed by the referrers?',
      answer:
        'No, while a referrer may guarantee that ' +
        'your application will be reviewed by a hiring manager, ' +
        'it is not guaranteed that you will land an interview. But, ' +
        'referrals will increase your chances to land one. ',
    },
    {
      question: 'What happens after getting referred?',
      answer:
        'Once you get referred, you might receive an ' +
        'email with further instructions for the next process.',
    },
    {
      question: 'How long does it take to get referred?',
      answer:
        'Once a referral request is submitted, your ' +
        'request will be sent to the referrer. Referrers typically ' +
        'take 3 to 6 days to submit your referral.',
    },
    {
      question: 'Shall I ask for a referral first or apply for a job directly?',
      answer:
        'Ask for a referral first since most companies do not ' +
        "allow to ask for a reference after you've " +
        'already applied for it.',
    },
    {
      question: 'Where can I reach Nectworks if I have an another question?',
      answer: (
        <>
          If you have any other queries that you wish to get resolved, let us
          know at
          <a className="faq_link" href="/contact-us">
            {' '}
            Contact Us
          </a>
        </>
      ),
    },
  ];

  const jobReferrerQuestions = [
    {
      question: 'Is it free for job referrers?',
      answer:
        'For job referrers, our platform for ' +
        'referring job seekers is completely free.',
    },
    {
      question: 'How do I register as a referrer?',
      answer: (
        <>
          <a href="/sign-up" className="faq_link">
            Click here{' '}
          </a>
          to create an account first, and then verify your work email address
          once logged in.
        </>
      ),
    },
    {
      question: 'How does referring work?',
      answer:
        'You can either post jobs through our job postings page, ' +
        'or set preferences in your profile. Based on your preferences we ' +
        'will suggest candidates to your talent pool.',
    },
    {
      question: 'Why are you verifying my work email?',
      answer:
        'We will verify your work email to check if you' +
        'are actually working in the company.',
    },
    {
      question: 'Can I ask for referrals myself?',
      answer:
        'Yes, through our dashboard you can edit your profile' +
        'as a referrer and a seeker both and ask for job referrals.',
    },
    {
      question: 'Can job seekers view my profile?',
      answer:
        'No, your profile is kept private. Although, you can ' +
        'choose to share your public profile with your connections to ' +
        'receive referral requests in your dashboard.',
    },
    {
      question: 'How long will my job posting be active?',
      answer:
        'Your job posting stays active for 15 days. However,' +
        ' you can disable your job posting earlier if you have' +
        ' received enough candidates.',
    },
    {
      question: 'Where can I reach Nectworks if I have an another question?',
      answer: (
        <>
          If you have any other queries that you wish to get resolved, let us
          know at{' '}
          <a className="faq_link" href="/contact-us">
            Contact Us
          </a>
        </>
      ),
    },
  ];

  const personalDataQuestions = [
    {
      question: 'How does Nectworks ensure the protection of my personal data?',
      answer:
        'We place the utmost importance on ensuring the security of ' +
        'your data. To achieve this, we implement encryption techniques and ' +
        'follow industry best practices to protect your personal information. ' +
        'Our data storage and transmission protocols strictly adhere to ' +
        'rigorous international security standards.',
    },
    {
      question: 'Is my data shared with third parties?',
      answer:
        'No, we do not sell or disclose your personal information ' +
        'to third parties for marketing or any purposes unrelated to the ' +
        'services provided by Nectworks. Your data is exclusively utilized ' +
        "to deliver and improve Nectworks' services.",
    },
    {
      question: 'Can I delete my Nectworks account and data?',
      answer:
        'Yes, you can. When you ask to delete your account, ' +
        'all your personal data will be permanently removed in line with ' +
        'data protection rules.',
    },
    {
      question:
        'Why is email verification necessary during ' + 'the signup process?',
      answer:
        'Email verification is a crucial step to verify the ' +
        'authenticity of our users. It helps minimize fraudulent registrations ' +
        'and ensures that our communications reach the intended recipients ' +
        'accurately.',
    },
    {
      question: 'Who can retrieve my resume and personal information?',
      answer:
        'Access to your resume on Nectworks is restricted to relevant ' +
        'personnel at Nectworks and potential referrers, with referrers ' +
        'remaining anonymous and not having direct access to your contact ' +
        'details. However, when you share your resume with potential ' +
        'referrers, they can obtain your mobile and email details, which ' +
        'are essential for communication. Your personal data is not shared ' +
        'with anyone else unless you choose to share it.',
    },
    {
      question: 'How long is my data kept after I delete my account?',
      answer:
        'After you initiate the account deletion process, your data ' +
        'is promptly erased. We do not store your personal information beyond ' +
        'this step, guaranteeing its complete removal from our system.',
    },
    {
      question: 'What information is gathered during the registration process?',
      answer:
        'Job seekers are required to provide their first name, last ' +
        'name, email, and resume. For referrers, the primary data collected is ' +
        'their work email. This information is crucial to enhancing the ' +
        'effectiveness of our referral services.',
    },
    {
      question: 'Is my resume shared with other platforms or job boards?',
      answer:
        "No, your resume stays within Nectworks. It's only used to " +
        'find potential referrals and is not given to other platforms or ' +
        'job boards.',
    },
    {
      question: 'How do we notify users about privacy policy changes?',
      answer:
        'We inform our users of any updates or modifications to our ' +
        'privacy policy through email and notifications on our platform. We ' +
        'prioritize transparency to keep our users well-informed.',
    },
    {
      question: 'How can I update or modify my data on Nectworks?',
      answer:
        'To update or modify your data on Nectworks, simply log ' +
        'into your account and navigate to the account settings or profile ' +
        'section. We recommend keeping your information up-to-date to ' +
        'maximize your experience on our platform.',
    },
  ];

  const [displayQuestions, setDisplayQuestions] = useState(jobSeekerQuestions);

  // function to hide current visible answer
  // at any point just keep one question active/open
  function hideCurrentVisibleAnswer() {
    // get references to currently visible answer and the icon associated
    // with it and close them
    const visibleAnswer = document.querySelector('.faq_answer_reveal');
    const questionContainer = visibleAnswer?.closest('.faq_question_container');
    const polygonIconContainer = questionContainer?.querySelector('span');

    visibleAnswer?.classList.remove('faq_answer_reveal');
    polygonIconContainer?.classList.remove('faq_question_polygon');

    return visibleAnswer;
  }

  function revealAnswers(e) {
    // hide currently visible question/answer
    const currentlyVisibleAnswer = hideCurrentVisibleAnswer();

    // get the question container
    const questionContainer = e.target.closest('.faq_question_container');
    // get the answer 'div' inside the question container
    const answerDiv = questionContainer.lastChild;
    // get the 'span' containing polygon icon
    const polygonIconContainer = questionContainer.querySelector('span');

    // if currently visible answer is clicked again just hide it
    if (currentlyVisibleAnswer === answerDiv) {
      return;
    }

    // toggle the answer and rotate the icon to open the answer
    answerDiv.classList.add('faq_answer_reveal');
    polygonIconContainer.classList.add('faq_question_polygon');
  }

  useEffect(() => {
    // change questions to be displayed based on the option selected by the user
    if (faqOption === 1) {
      setDisplayQuestions(jobSeekerQuestions);
    } else if (faqOption === 2) {
      setDisplayQuestions(jobReferrerQuestions);
    } else {
      setDisplayQuestions(personalDataQuestions);
    }
  }, [faqOption]);

  return (
    <div className="faq_outer_container">
      <h2 className="faq_header">Frequently asked questions</h2>
      <h4 className="faq_sub_header">Have questions? We're here to help.</h4>

      <div className="faq_main_container">
        <div className="faq_options_container">
          <span
            className={faqOption === 1 ? 'faq_option_active' : ''}
            onClick={() => setFaqOption(1)}
          >
            Job Seekers
          </span>
          <span
            className={faqOption === 2 ? 'faq_option_active' : ''}
            onClick={() => setFaqOption(2)}
          >
            Professionals
          </span>
          <span
            className={faqOption === 3 ? 'faq_option_active' : ''}
            onClick={() => setFaqOption(3)}
          >
            Your Data & Privacy
          </span>
        </div>

        <div className="faq_all_questions">
          {displayQuestions.map((questionObj, index) => {
            return (
              <div
                className="faq_question_container"
                key={index}
                onClick={revealAnswers}
              >
                <div className="faq_question">
                  <p>{questionObj.question}</p>
                  <span>
                    <Image
                      src={accordianArrow}
                      className="faq_polygon_icon"
                      alt="arrow icon"
                    />
                  </span>
                </div>

                <div className="faq_answer">{questionObj.answer}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
