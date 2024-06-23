'use client';
/*
  File: Reviews.js
  Description: This page lists all the feedbacks submitted by the user.
*/

import { useEffect, useState } from 'react';
import './Reviews.css';
import Image from 'next/image';
import showBottomMessage from '@/Utils/showBottomMessage';
import { privateAxios } from '@/config/axiosInstance';
import AdminDashboardMenu from '../../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import copyIcon from '@/public/PublicProfile/copyIcon.png';

function Reviews() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReview, setSlectedReview] = useState(null);

  // data required to implement pagination
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const [currPageData, setCurrPageData] = useState([]);
  const [nextPageRef, setNextPageRef] = useState(null);
  const [reviewsCount, setReviewsCount] = useState(-1);

  // function to fetch data from the api
  async function fetchData() {
    setIsLoading(true);

    try {
      const res = await privateAxios.get('/admin/data/reviews', {
        params: {
          page: page,
          limit: itemsPerPage,
          prevDocId: nextPageRef,
        },
      });

      const { data, count, next } = res.data;

      setData((prevData) => [...prevData, ...data]);
      setReviewsCount(count);
      setNextPageRef(next);
    } catch (error) {
      const { message } = error.response.data;
      showBottomMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  /* function to update the current page data as the 'page'
    increases or decreases. */
  function updateCurrentPageItems() {
    const pageStart = page * itemsPerPage;
    const pageEnd = pageStart + itemsPerPage;

    if (
      reviewsCount === -1 ||
      (data.length - 1 < pageEnd - 1 && data.length < reviewsCount)
    ) {
      fetchData();
    } else {
      const currentPageItems = data.slice(pageStart, pageEnd);
      setCurrPageData(currentPageItems);
      setSlectedReview(currentPageItems?.[0]);
    }
  }

  // function to view a review
  function selectReview(e, review) {
    e.stopPropagation();
    setSlectedReview(review);

    // remove all the active boxes
    const activeBoxes = document.querySelectorAll('.reviews_user');
    Array.from(activeBoxes).forEach((activeBox) => {
      activeBox.classList.remove('reviews_user_active');
    });

    // add active class to the selected review
    e.target.closest('.reviews_user').classList.add('reviews_user_active');
  }

  // function to get full name from user object.
  function getFullName(user) {
    if (!user) return null;

    const fullName = user?.firstName + ' ' + user?.lastName;

    if (fullName.length > 15) {
      return fullName.substring(0, 15) + '...';
    }

    return fullName;
  }

  useEffect(() => {
    updateCurrentPageItems();
  }, [page, data]);

  return (
    <div className="admin_reviews_outer_container">
      <AdminDashboardMenu />

      <div className="admin_reviews_inner_container">
        <h1>Reviews Received</h1>
        <h3>View feedbacks submitted by users</h3>

        <div className="admin_reviews_pagination_btns">
          <button
            onClick={() => {
              if (page <= 0) return;
              setPage((prevPage) => prevPage - 1);
            }}
          >
            Prev
          </button>
          <span>{page}</span>
          <button
            onClick={() => {
              const lastPage = Math.floor(reviewsCount / itemsPerPage);
              if (page === lastPage) {
                showBottomMessage(`You are in the last page...`);
                return;
              }
              setPage((prevPage) => prevPage + 1);
            }}
          >
            Next
          </button>
        </div>
        <div className="admin_reviews_data">
          <div className="reviews_users">
            {currPageData.map((review, idx) => {
              return (
                <div
                  key={idx}
                  onClick={(e) => selectReview(e, review)}
                  className={`${idx === 0 ? 'reviews_user_active' : ''} reviews_user`}
                >
                  <span className="fullname">
                    {getFullName(review?.user) || review?.email}
                  </span>

                  {review?.user?.username && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(review?.user.username);
                        showBottomMessage(`Username copied!`);
                      }}
                      className="username_container"
                    >
                      <span className="username">
                        {'#' + review?.user?.username}
                      </span>
                      <Image src={copyIcon} alt="copy user name" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {data.length > 0 && selectedReview !== null && (
            <div className="review_info">
              <div>
                <p className="review_question">
                  1. On a scale of 1 to 10 how would you rate the design of our
                  website?
                </p>
                <span className="review_rating">
                  {selectedReview?.design?.rating}
                </span>
                <p>{selectedReview?.design?.desc}</p>
              </div>

              <div>
                <p className="review_question">
                  2. On a scale of 1 to 10 how would you rate the load time of
                  our pages?
                </p>
                <span className="review_rating">
                  {selectedReview?.loadTime?.rating}
                </span>
                <p>{selectedReview?.loadTime?.desc}</p>
              </div>

              <div>
                <p className="review_question">
                  3. On a scale of 1 to 10 how easy it is to find content that
                  you’re interested in?
                </p>
                <span className="review_rating">
                  {selectedReview?.findContent?.rating}
                </span>
                <p>{selectedReview?.findContent?.desc}</p>
              </div>

              <div>
                <p className="review_question">
                  4. On a scale of 1 to 10 how would you rate the ease of
                  signing in and signing up to our website?
                </p>
                <span className="review_rating">
                  {selectedReview?.easeOfSignup?.rating}
                </span>
                <p>{selectedReview?.easeOfSignup?.desc}</p>
              </div>

              <div>
                <p className="review_question">
                  5. On a scale of 1 to 10 how likely are you to recommend our
                  website to your colleagues, friends and family?
                </p>
                <span className="review_rating">
                  {selectedReview?.recommendation?.rating}
                </span>
                <p>{selectedReview?.recommendation?.desc}</p>
              </div>

              <div>
                <p className="review_question">
                  6. On a scale of 1 to 10 how would you rate the ease of adding
                  details to your profile?
                </p>
                <span className="review_rating">
                  {selectedReview?.profileDetails?.rating}
                </span>
                <p>{selectedReview?.profileDetails?.desc}</p>
              </div>

              <div>
                <p className="review_question">
                  7. On a scale of 1 to 10 how would you rate the design of your
                  public profile?
                </p>
                <span className="review_rating">
                  {selectedReview?.publicProfile?.rating}
                </span>
                <p>{selectedReview?.publicProfile?.desc}</p>
              </div>

              <div>
                <p className="review_question">
                  8. On a scale of 1 to 10 how would you rate the process of
                  getting referral requests through our website?
                </p>
                <span className="review_rating">
                  {selectedReview?.processingReferralRequest?.rating}
                </span>
                <p>{selectedReview?.processingReferralRequest?.desc}</p>
              </div>

              <div>
                <p className="review_question">
                  9. On a scale of 1 to 10 how easy is it for you to navigate
                  through your dashboard?
                </p>
                <span className="review_rating">
                  {selectedReview?.navigation?.rating}
                </span>
                <p>{selectedReview?.navigation?.desc}</p>
              </div>

              <div>
                <p className="review_question">
                  10. On a scale of 1 to 10 how easy was it for you to set up
                  your professional profile?
                </p>
                <span className="review_rating">
                  {selectedReview?.professionalProfile?.rating}
                </span>
                <p>{selectedReview?.professionalProfile?.desc}</p>
              </div>

              <div>
                <p className="review_question">
                  11. Given the chance, is there any feature that you would want
                  to add or improve in our website?
                </p>
                <p>{selectedReview?.featureSuggestion || '-'}</p>
              </div>

              <div>
                <p className="review_question">
                  12. Is there anything else that you would like to put to our
                  notice regarding the website?
                </p>
                <p>{selectedReview?.improvement || '-'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
