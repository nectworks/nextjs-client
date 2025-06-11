'use client';

/*
  File: NectCoins.js
  Description: This file consists of the component that displays all
    the coins earned by the user.
*/

import { useContext, useEffect, useState } from 'react';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import './NectCoins.css';
import DashboardMenu from '../../_components/DashboardMenu/DashboardMenu';
import ProfileHeaderWrapper from '@/app/_components/ProfileHeaderWrapper/ProfileHeaderWrapper';
import nectCoinsImg from '@/public/Profile/nectCoin.svg';
import { UserContext } from '@/context/User/UserContext';
import ClipLoader from 'react-spinners/ClipLoader';
import leftArrow from '@/public/ReferCandidates/leftArrow.png';
import rightArrow from '@/public/ReferCandidates/rightArrow.png';
import Image from 'next/image';
import formatNectCoins from '@/Utils/formatNectCoins';

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

  // Urgency & timing-focused messages
  const getStreakMessage = (streak) => {
    const dayInCycle = (streak - 1) % 5;
    const daysUntilBonus = 5 - dayInCycle - 1;
    
    switch (dayInCycle) {
      case 0:
        return {
          main: 'Great start! Keep it going 🎯',
          urgency: `${daysUntilBonus} more days for +5 bonus coins`,
          reminder: 'Come back tomorrow to continue your streak!'
        };
      case 1:
        return {
          main: 'Building momentum! 🚀',
          urgency: `${daysUntilBonus} more days for +5 bonus coins`,
          reminder: 'Don\'t break the chain - login tomorrow!'
        };
      case 2:
        return {
          main: 'Halfway to bonus! 💪',
          urgency: `${daysUntilBonus} more days for +5 bonus coins`,
          reminder: 'Almost there! Keep your streak alive'
        };
      case 3:
        return {
          main: 'So close to bonus! 🔥',
          urgency: 'Just 1 more day for +5 bonus coins!',
          reminder: 'Don\'t miss tomorrow - bonus coins await!'
        };
      case 4:
        return {
          main: 'Streak milestone reached! 🎉',
          urgency: 'You earned +5 bonus coins!',
          reminder: 'Start your next 5-day cycle tomorrow'
        };
      default:
        return {
          main: 'Keep going! ✨',
          urgency: 'Daily login rewards active',
          reminder: 'Come back tomorrow for more coins'
        };
    }
  };

  const streakInfo = getStreakMessage(user?.loginStreak || 1);

  // function to fetch data about coins activity of the user
  const fetchData = async () => {
    setIsLoading(true);
    setMessage('Loading your coin activity...');

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
      setMessage(`Unable to load activity data`);
    } finally {
      setIsLoading(false);
    }
  };

  // update the data of the current page when state changes
  const updateCurrentPageItems = () => {
    const pageStart = (paginationModel.page - 1) * paginationModel.limit;
    const pageEnd = pageStart + paginationModel.limit;

    if (
      activityCount === -1 ||
      (data?.activity.length - 1 < pageEnd - 1 &&
        data?.activity.length < activityCount)
    ) {
      fetchData();
    } else {
      setCurrPageData({
        ...data,
        activity: data.activity.slice(pageStart, pageEnd),
      });
    }
  };

  // function to highlight streaks with modern animation
  const highlightProgress = () => {
    const progressBar = document.querySelector('.modern_progress_fill');
    const streakLevel = (user?.loginStreak - 1) % 5;
    const progressPercentage = (streakLevel / 4) * 100;
    
    if (progressBar) {
      progressBar.style.width = `${progressPercentage}%`;
    }

    // Add pulse animation to current coin
    const coins = document.querySelectorAll('.progress_coin');
    coins.forEach((coin, index) => {
      coin.classList.remove('active_coin', 'completed_coin');
      if (index < streakLevel) {
        coin.classList.add('completed_coin');
      } else if (index === streakLevel) {
        coin.classList.add('active_coin');
      }
    });
  };

  // get special activity badge
  function getActivityBadge(activity) {
    if (activity.title === 'Five day streak') {
      return { text: '5-Day Streak', emoji: '🔥' };
    } else if (activity.title === 'Ten day streak') {
      return { text: '10-Day Streak', emoji: '💯' };
    }
    return null;
  }

  function formatDate(createdDate) {
    const date = new Date(createdDate);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }

  function getTotalPages() {
    return Math.ceil(activityCount / paginationModel.limit);
  }

  function decreasePage() {
    if (paginationModel.page <= 1) return;
    setPaginationModel((prevModel) => ({
      ...prevModel,
      page: prevModel.page - 1,
    }));
  }

  function increasePage() {
    const pageCount = getTotalPages();
    if (paginationModel.page >= pageCount) return;

    setPaginationModel((prevModel) => ({
      ...prevModel,
      page: prevModel.page + 1,
    }));
  }

  useEffect(() => {
    highlightProgress();
  }, [user?.loginStreak]);

  useEffect(() => {
    updateCurrentPageItems();
  }, [paginationModel, data]);

  return (
    <>
      <DashboardMenu />
      <div className="dashboard-layout">
        <div className="modern_nectcoins_container">
          <ProfileHeaderWrapper />

          <div className="modern_nectcoins_content">
            {/* Header Section - Coins card moved next to title */}
            <div className="modern_header">
              <div className="header_main">
                <h1 className="modern_title">NectCoins</h1>
                <div className="total_coins_card">
                  <div className="coin_icon">
                    <Image src={nectCoinsImg} alt="NectCoin" width={20} height={20} />
                  </div>
                  <span className="total_amount">{formatNectCoins(user?.totalCoins)}</span>
                </div>
              </div>
              <p className="modern_subtitle">
                Your digital currency for the Nectworks ecosystem
              </p>
            </div>

            {/* Streak Section */}
            <div className="modern_streak_card">
              <div className="streak_header">
                <div className="streak_info">
                  <h3 className="streak_title">Daily Streak</h3>
                  <p className="streak_message">
                    {streakInfo.main}
                  </p>
                  <p className="streak_urgency">
                    {streakInfo.urgency}
                  </p>
                </div>
                <div className="streak_counter">
                  <span className="streak_number">{user?.loginStreak || 0}</span>
                  <span className="streak_label">days</span>
                </div>
              </div>

              <div className="modern_progress_container">
                <div className="modern_progress_track">
                  <div className="modern_progress_fill"></div>
                </div>
                <div className="progress_coins">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="progress_coin">
                      <Image src={nectCoinsImg} alt="Coin" width={20} height={20} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Timing & Urgency Section */}
              <div className="streak_timing_info">
                <div className="daily_reward_info">
                  <div className="reward_item">
                    <Image src={nectCoinsImg} alt="coin" width={16} height={16} />
                    <span>+1 coin daily</span>
                  </div>
                  <div className="reward_item bonus">
                    <Image src={nectCoinsImg} alt="coin" width={16} height={16} />
                    <span>+5 bonus every 5 days</span>
                  </div>
                </div>
                <div className="streak_reminder">
                  <span className="reminder_icon">⏰</span>
                  <span className="reminder_text">{streakInfo.reminder}</span>
                </div>
                <div className="streak_warning">
                  <span className="warning_text">⚠️ Streak resets if you miss a day</span>
                </div>
              </div>
            </div>

            {/* Activities Section */}
            {isLoading ? (
              <div className="modern_loading">
                <ClipLoader color="#6366f1" size={32} />
                <span>{message}</span>
              </div>
            ) : (
              <div className="activities_section">
                <h3 className="section_title">Recent Activity</h3>
                <div className="modern_activities_grid">
                  {currPageData?.activity?.map((activity, idx) => {
                    const badge = getActivityBadge(activity);
                    return (
                      <div className="modern_activity_card" key={idx}>
                        {badge && (
                          <div className="activity_badge">
                            <span className="badge_emoji">{badge.emoji}</span>
                            <span className="badge_text">{badge.text}</span>
                          </div>
                        )}
                        
                        <div className="activity_main">
                          <div className="activity_icon">
                            <Image src={nectCoinsImg} alt="Coin" width={28} height={28} />
                          </div>
                          <div className="activity_content">
                            <p className="activity_description">{activity.description}</p>
                            <span className="activity_date">{formatDate(activity.createdAt)}</span>
                          </div>
                          <div className="activity_reward">
                            <span className={`reward_amount ${activity.coinsAwarded > 0 ? 'positive' : 'negative'}`}>
                              {activity.coinsAwarded > 0 ? '+' : ''}{activity.coinsAwarded}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {getTotalPages() > 1 && (
                  <div className="modern_pagination">
                    <button 
                      className="pagination_btn" 
                      onClick={decreasePage}
                      disabled={paginationModel.page <= 1}
                    >
                      <Image src={leftArrow} alt="Previous" width={16} height={16} />
                    </button>
                    <span className="pagination_info">
                      {paginationModel.page} of {getTotalPages()}
                    </span>
                    <button 
                      className="pagination_btn" 
                      onClick={increasePage}
                      disabled={paginationModel.page >= getTotalPages()}
                    >
                      <Image src={rightArrow} alt="Next" width={16} height={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* FAQ Section */}
            <div className="modern_faq">
              <h3 className="section_title">How it works</h3>
              <div className="faq_grid">
                <div className="faq_item">
                  <h4 className="faq_question">What are NectCoins?</h4>
                  <p className="faq_answer">
                    Digital currency you earn and spend within the Nectworks platform.
                  </p>
                </div>
                <div className="faq_item">
                  <h4 className="faq_question">How to earn?</h4>
                  <p className="faq_answer">
                    Get 4 free coins for signing up! Build daily login streaks for more rewards and bonus coins.
                  </p>
                </div>
                <div className="faq_item">
                  <h4 className="faq_question">How to spend?</h4>
                  <p className="faq_answer">
                    Use coins to request referrals from professionals. Each referral costs 1 NectCoin.
                  </p>
                </div>
                <div className="faq_item">
                  <h4 className="faq_question">What's next?</h4>
                  <p className="faq_answer">
                    More earning opportunities and spending options are coming soon!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NectCoins;