'use client';
/*
  FileName - Feedback.js
  Desc -  This code defines a React component that collects user
  feedback through a questionnaire, manages user interactions and
  responses, and submits the feedback to a server. It provides a
  user-friendly interface for this process, incorporating
  conditional rendering and basic error handling.
*/

import { useContext, useState } from 'react';
import './Feedback.css';
import nectworksLogo from '../../../public/nectworks-ssar04a-mil-11@2x.webp';
import timerLogo from '../../../public/Feedback/timer.svg';
import Link from 'next/link';
import Image from 'next/image';
import ClipLoader from 'react-spinners/ClipLoader';
import showBottomMessage from '../../../Utils/showBottomMessage';
import { UserContext } from '../../../context/User/UserContext';
import { privateAxios } from '../../../config/axiosInstance';

const Feedback = () => {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [currentPage, setCurrentPage] = useState(1);
  const [ratings, setRatings] = useState([]);
  const [desc, setdesc] = useState([]);
  const [showConfirmationPage, setShowConfirmationPage] = useState(false);
  const [enableFeedback, setEnableFeedback] = useState(false);
  const maxPages = 12;
  const inputList = [];

  const paragraphs = [
    'On a scale of 1 to 10 how would you rate the design of our website?',
    'On a scale of 1 to 10 how would you rate the load time of our pages?',
    'On a scale of 1 to 10 how easy it is to find content that you’re looking for?',
    'On a scale of 1 to 10 how would you rate the ease of signing in and signing up to our website?',
    'On a scale of 1 to 10 how likely are you to recommend our website to your colleagues, friends and family?',
    'On a scale of 1 to 10 how would you rate the ease of adding details to your profile?',
    'On a scale of 1 to 10 how would you rate the design of your public profile?',
    'On a scale of 1 to 10 how would you rate the process of getting referral requests through our website?',
    'On a scale of 1 to 10 how easy is it for you to navigate through your dashboard?',
    'On a scale of 1 to 10 how easy was it for you to set up your professional profile?',
    'Given the chance, is there any feature that you would want to add or improve in our website?',
    'Is there anything else that you would like to put to our notice regarding the website?',
  ];

  const handleRatingChange = (e) => {
    const rating = e.target.value;
    const updatedRatings = [...ratings];
    updatedRatings[currentPage - 1] = rating;
    setRatings(updatedRatings);
    // Remove the custom class from all input elements
    const inputs = document.querySelectorAll('input[name="selectableInput"]');
    inputs.forEach((input) => {
      input.classList.remove('makeBgBlue');
    });
    e.target.classList.add('makeBgBlue');
  };

  const [featureSuggestion, setFeatureSuggestion] = useState('');
  const [improvement, setImprovement] = useState('');
  const handleDescriptionChange = (description) => {
    if (currentPage === 11) {
      setFeatureSuggestion(description);
    }
    if (currentPage === 12) {
      setImprovement(description);
    }
    const updateddesc = [...desc];
    updateddesc[currentPage - 1] = description;
    setdesc(updateddesc);
  };

  const handleNextPage = (e) => {
    if (currentPage < maxPages) {
      if (currentPage <= 10 && ratings[currentPage - 1] === undefined) {
        showBottomMessage('Please add a rating!');
        return;
      }
      setCurrentPage(currentPage + 1);
      // Remove the custom class from all input elements
      const inputs = document.querySelectorAll('input[name="selectableInput"]');
      inputs.forEach((input) => {
        input.classList.remove('makeBgBlue');
      });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startFeedback = () => {
    setEnableFeedback(true);
  };

  for (let i = 1; i <= 10; i++) {
    inputList.push(
      <input
        readOnly
        key={i}
        type="text"
        name="selectableInput"
        placeholder={i}
        value={i}
        onClick={handleRatingChange}
        onKeyPress={handleNextPage}
      />
    );
  }

  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    // You can submit the ratings and desc to a database here
    const feedbackData = ratings.map((rating, index) => ({
      rating,
      desc: desc[index],
    }));

    // Calculating average rating
    const totalRating = ratings.reduce(
      (accumulator, rating) => accumulator + parseInt(rating),
      0
    );
    const avgRating = totalRating / 10;
    setIsLoading(true);

    try {
      const res = await privateAxios.patch(`/others/feedback/${user?.email}`, {
        email: user?.email,
        design: feedbackData[0],
        loadTime: feedbackData[1],
        findContent: feedbackData[2],
        easeOfSignup: feedbackData[3],
        recommendation: feedbackData[4],
        profileDetails: feedbackData[5],
        publicProfile: feedbackData[6],
        processingReferralRequest: feedbackData[7],
        navigation: feedbackData[8],
        professionalProfile: feedbackData[9],
        featureSuggestion: featureSuggestion,
        improvement: improvement,
        averageRating: avgRating.toFixed(2),
      });
      if (res.status === 200) {
        setShowConfirmationPage(true);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!enableFeedback && (
        <div className="feedbackContainer">
          <div className="feedbackContent">
            <Link href="/">
              <Image
                className="nectworksLogo"
                src={nectworksLogo}
                alt="Nectworks logo"
              />
            </Link>
            <p className="feedbackPara">
              Your <span className="feedbackSpan">feedback</span> is extremely
              valuable for us in order to improve.
            </p>
            <p className="dimPara">
              Let us know how we can make your experience better.
            </p>
            <button onClick={startFeedback} className="startButton">
              Start
            </button>
            <div className="timeTaken">
              <Image src={timerLogo} alt="Nectworks logo" />
              <p style={{ marginLeft: '6px', color: '#808080' }}>
                Takes 2 minutes
              </p>
            </div>
          </div>
        </div>
      )}

      {enableFeedback && !showConfirmationPage && (
        <div className="feedbackDetails">
          <div className="feedbackDetailsDesc">
            <Image
              className="nectworksLogo"
              src={nectworksLogo}
              alt="Nectworks logo"
            />
            <div className="includingHeadingAlso">
              <h3>{paragraphs[currentPage - 1]}</h3>
              <div className="feedbackDetailsContainer">
                {currentPage <= 10 && (
                  <div className="ratingInputContainer">{inputList}</div>
                )}
                {currentPage <= 10 && (
                  <div className="performancePara">
                    <p className="poorRating">Poor</p>
                    <p className="excellentRating">Excellent</p>
                  </div>
                )}
                <textarea
                  className={`${currentPage > 10 ? 'marginTop' : ''}`}
                  value={desc[currentPage - 1] || ''}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  placeholder="What can we improve? (Optional)"
                  cols="70"
                  rows="6"
                  style={{ resize: 'none' }}
                ></textarea>
                <div className="currentPrevButtons">
                  <p>
                    {currentPage} of {maxPages}{' '}
                  </p>
                  {currentPage > 1 && (
                    <button
                      className="previousButton"
                      onClick={handlePreviousPage}
                    >
                      Previous
                    </button>
                  )}
                  {currentPage < maxPages ? (
                    <button className="nextButton" onClick={handleNextPage}>
                      Next
                    </button>
                  ) : (
                    <button className="nextButton" onClick={handleSubmit}>
                      {isLoading ? <ClipLoader size={12} /> : 'Finish'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirmationPage && (
        <div className="feedbackContainer">
          <div className="feedbackContent">
            <Link href="/">
              <Image
                className="nectworksLogo"
                src={nectworksLogo}
                alt="Nectworks logo"
              />
            </Link>
            <p className="feedbackPara">
              <span className="feedbackSpan">Thank You </span>
              for your time and patience to answer the questionnaire.
            </p>
            <p className="dimPara">
              Your genuine feedback helps us make our product better.
            </p>
            <Link href="/">
              <button
                style={{ marginTop: '1.5rem' }}
                onClick={startFeedback}
                className="startButton"
              >
                Go to dashboard
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Feedback;
