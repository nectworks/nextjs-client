'use client';

/*
  File: NectCoins.js
  Description: This file consists of the component that displays all
    the coins earned by the user.
*/

import { useCallback, useContext, useEffect, useState } from 'react';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import './NectCoins.css';
import DashboardMenu from '../../_components/DashboardMenu/DashboardMenu';
import ProfileHeader from '../../_components/Profile/ProfileHeader/ProfileHeader';
import nectCoinsImg from '@/public/Profile/nectCoin.svg';
import { UserContext } from '@/context/User/UserContext';
import ClipLoader from 'react-spinners/ClipLoader';
import leftArrow from '@/public/ReferCandidates/leftArrow.png';
import rightArrow from '@/public/ReferCandidates/rightArrow.png';
import Image from 'next/image';

function NectCoins() {
  const privateAxios = usePrivateAxios();

  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // store all the data fetched so far
  const [data, setData] = useState(null);

  // state required for pagination
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    limit: 6,
  });
  const [currPageData, setCurrPageData] = useState(null);
  const [activityCount, setActivityCount] = useState(-1);

  // messages to be displayed based on the streak
  const progressMessages = [
    'Great Start!',
    'Keep Going!',
    "You're halfway there!",
    "You're so close!",
    "You've done it!",
  ];

  // function to fetch data about coins activity of the user
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setMessage('Fetching activity data...');

    try {
      const url = '/nect-coins/activity';
      const res = await privateAxios.get(url, {
        params: {
          page: paginationModel.page,
          limit: paginationModel.limit,
        },
      });

      const activityData = res.data.data;

      if (data === null) {
        setData(activityData);
      } else {
        setData((prevData) => {
          return {
            ...prevData,
            activity: [...prevData.activity, ...activityData.activity],
          };
        });
      }
      setActivityCount(activityData.activityCount);
    } catch (error) {
      setMessage(`Couldn't fetch nect coins activity`);
    } finally {
      setIsLoading(false);
    }
  }, [data, paginationModel.limit, paginationModel.page, privateAxios]);

  // update the data of the current page when state changes
  const updateCurrentPageItems = useCallback(() => {
    const pageStart = (paginationModel.page - 1) * paginationModel.limit;
    const pageEnd = pageStart + paginationModel.limit;

    if (
      activityCount === -1 ||
      (data?.activity.length - 1 < pageEnd - 1 &&
        data?.activity.length < activityCount)
    ) {
      // if enough data for current page is not fetched, fetch the data
      fetchData();
    } else {
      // if the data is already fetched, update the current page state
      setCurrPageData({
        ...data,
        activity: data.activity.slice(pageStart, pageEnd),
      });
    }
  }, [
    activityCount,
    data,
    fetchData,
    paginationModel.limit,
    paginationModel.page,
  ]);

  // function to highlight streaks
  const highlightProgress = useCallback(() => {
    // get all the coin images
    const allCoins = Array.from(document.querySelectorAll('.coin_img'));

    // coin till which the progress should be highlighted
    const highlightLvl = (user?.loginStreak - 1) % 5;

    // get the width till which it should be highlighted
    if (allCoins[highlightLvl]) {
      const rightLimit = allCoins[highlightLvl].getBoundingClientRect().left;
      const leftLimit = allCoins[0].getBoundingClientRect().left;

      // update the width of the indicator
      const timeLineIndicator = document.querySelector('.timeline_indicator');
      timeLineIndicator.style.width = `${rightLimit - leftLimit}px`;

      // animate the correct coin
      allCoins[highlightLvl].classList.add('animated_coin');

      // when the last coins are to be animated, animate the extra coin
      if (highlightLvl === 4) {
        const lastCoin = document.querySelector('.last_coin');
        lastCoin.classList.add('animated_coin');
      }
    }
  }, [user?.loginStreak]);

  // get special activity message
  function getNectCoinsSpecialActivity(activity) {
    if (activity.title === 'Five day streak') {
      return '5 day bonus';
    } else if (activity.title === 'Ten day streak') {
      return '10 day bonus';
    }

    return null;
  }

  function formatDate(createdDate) {
    const date = new Date(createdDate);
    const allMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const month = allMonths[date.getMonth()];
    const dateOfMonth = date.getDate();
    const year = date.getFullYear();

    return `${month} ${dateOfMonth}, ${year}`;
  }

  function getTotalPages() {
    return Math.ceil(activityCount / paginationModel.limit);
  }

  // increase or decrease page to view different activity
  function decreasePage() {
    if (paginationModel.page <= 1) return;
    setPaginationModel((prevModel) => {
      return {
        ...prevModel,
        page: prevModel.page - 1,
      };
    });
  }

  function increasePage() {
    const pageCount = getTotalPages();
    if (paginationModel.page >= pageCount) return;

    setPaginationModel((prevModel) => {
      return {
        ...prevModel,
        page: prevModel.page + 1,
      };
    });
  }

  useEffect(() => {
    // update the progress indicator according to the width of the progress bar
    highlightProgress();
    const progressBar = document.querySelector('.nectcoins_coin_progress');
    progressBar.addEventListener('resize', highlightProgress);

    const resizeObserver = new ResizeObserver((entries) => {
      highlightProgress();
    });

    resizeObserver.observe(progressBar);
  }, [highlightProgress]);

  useEffect(() => {
    updateCurrentPageItems();
  }, [paginationModel, data, updateCurrentPageItems]);

  return (
    <div className="dashboard_outer_container">
      <DashboardMenu />

      <div className="dashboard_nectcoins_container">
        <ProfileHeader />

        <div className="dashboard_nectcoins_inner_container">
          <h1>Your Nectcoins</h1>
          <h3>
            Keep your streak alive! Visit Nectworks daily, log in, and collect
            Nectcoins for referrals and more.
          </h3>

          <div className="nectcoins_streak_container">
            {/* heading that displays a message and current streak */}
            <div className="nectcoins_streak_heading">
              <p>{progressMessages[(user?.loginStreak - 1) % 5]}</p>
              <p>
                <span>Current Streak</span> {user?.loginStreak} days
              </p>
            </div>

            {/* display the progress of the current streak */}
            <div>
              {/* the horizontal line of the progress bar */}
              <div className="nectcoins_timeline">
                <div className="timeline_indicator"></div>
              </div>

              {/* coin images in the progress bar */}
              <div className="nectcoins_coin_progress">
                <div>
                  <Image
                    className="coin_img"
                    src={nectCoinsImg}
                    alt="nectcoin image"
                  />
                </div>

                <div>
                  <Image
                    className="coin_img"
                    src={nectCoinsImg}
                    alt="nectcoin image"
                  />
                </div>

                <div>
                  <Image
                    className="coin_img"
                    src={nectCoinsImg}
                    alt="nectcoin image"
                  />
                </div>

                <div>
                  <Image
                    className="coin_img"
                    src={nectCoinsImg}
                    alt="nectcoin image"
                  />
                </div>

                <div>
                  <Image
                    className="coin_img"
                    src={nectCoinsImg}
                    alt="nectcoin image"
                  />
                  <Image
                    className="last_coin"
                    src={nectCoinsImg}
                    alt="nectcoin image"
                  />
                </div>
              </div>
            </div>
          </div>

          {isLoading === true ? (
            <div className="nectcoin_message_container">
              <span>{message}</span>
              <ClipLoader className="nectcoin_loader" size={50} />
            </div>
          ) : (
            <>
              <div className="nectcoins_activities">
                {currPageData?.activity?.map((activity, idx) => {
                  return (
                    <div className="nectcoins_activity" key={idx}>
                      <span className="activity_created_date">
                        {formatDate(activity.createdAt)}
                      </span>

                      <div className="activity_coin_container">
                        <Image src={nectCoinsImg} alt="nectcoin image" />
                        <span className="nectcoins_awarded">
                          {activity?.coinsAwarded > 0
                            ? '+' + activity?.coinsAwarded
                            : activity?.coinsAwarded}
                        </span>
                      </div>
                      <div className="activity_description_container">
                        {getNectCoinsSpecialActivity(activity) !== null && (
                          <span className="nectcoin_special_activity">
                            {getNectCoinsSpecialActivity(activity)}
                          </span>
                        )}
                        {activity.description}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* display the buttons only if the number of pages > 1 */}
              {getTotalPages() > 1 && (
                <div className="nectcoin_pagination_actions">
                  <button onClick={decreasePage}>
                    <Image src={leftArrow} alt="left arrow icon" />
                  </button>
                  {paginationModel.page}/{getTotalPages()}
                  <button onClick={increasePage}>
                    <Image src={rightArrow} alt="right arrow icon" />
                  </button>
                </div>
              )}
            </>
          )}
          <div className="basic_nectcoins_queries">
            <div>
              <p className="nectcoin_question">What are Nectcoins?</p>
              <p className="nectcoin_answer">
                Nectcoins are Nectworks currency you can earn and spend on the
                site.
              </p>
            </div>
            <div>
              <p className="nectcoin_question">How do I get Nectcoins?</p>
              <p className="nectcoin_answer">
                Score four free Nectcoins just for signing up at Nectworks! Keep
                logging in to build your streak and earn even more Nectcoins
                daily 📆, plus there might be surprise bonuses for staying
                consistent! 🎁
              </p>
            </div>
            <div>
              <p className="nectcoin_question">Where can I use Nectcoins?</p>
              <p className="nectcoin_answer">
                You can currently use Nectcoins to ask for referrals from
                professionals through their public profiles. Each referral costs
                1 Nectcoin. 💰
              </p>
            </div>
            <div>
              <p className="nectcoin_question">Is that all?</p>
              <p className="nectcoin_answer">
                Currently, yes, but we will soon be adding more ways to earn and
                spend Nectcoins. 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NectCoins;
