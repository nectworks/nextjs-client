'use client';

/*
    File - PublicProfile.js
    Desc - This file is responsible for displaying a user-friendly public profile
    page for a user, including their personal details, work history,
    skills, and social links. It features modern UI elements like gradients,
    floating animations, and a more engaging visual layout.
*/
import { useEffect, useRef, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useRouter, useParams } from 'next/navigation';
import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Icons and images
import rightIcon from '@/public/PublicProfile/rightIcon.png';
import copyIcon from '@/public/PublicProfile/copyIcon.png';
import greenTickIcon from '@/public/PublicProfile/greenTickIcon.png';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import close from '@/public/SignUpConfirmPopup/crossIcon.svg';

// React icons
import { FaFacebookF, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter, FaArrowUpRightFromSquare, FaLocationDot, FaBuilding, FaBriefcase, FaCalendarDays } from 'react-icons/fa6';

// Social media icons
import linkedinLogo from '@/public/socialsLogo/linkedinLogo.svg';
import twitterLogo from '@/public/socialsLogo/twitterLogo.svg';
import githubLogo from '@/public/socialsLogo/githubLogo.svg';
import devLogo from '@/public/socialsLogo/devToLogo.svg';
import instagramLogo from '@/public/socialsLogo/instagramLogo.svg';
import facebookLogo from '@/public/socialsLogo/facebookLogo.svg';
import mediumLogo from '@/public/socialsLogo/mediumLogo.svg';
import figmaLogo from '@/public/socialsLogo/figmaLogo.svg';
import substackLogo from '@/public/socialsLogo/substackLogo.svg';
import tiktokLogo from '@/public/socialsLogo/tiktokLogo.svg';
import twitchLogo from '@/public/socialsLogo/twitchLogo.svg';
import youtubeLogo from '@/public/socialsLogo/youtubeLogo.svg';
import behanceLogo from '@/public/socialsLogo/behanceLogo.svg';
import dribbleLogo from '@/public/socialsLogo/dribbleLogo.svg';
import crunchbaseLogo from '@/public/socialsLogo/crunchbaseLogo.svg';
import hashnodeLogo from '@/public/socialsLogo/hashnodeLogo.svg';

// Components and utilities
import ProfileImage from '../../_components/Profile/ProfileImage/ProfileImage';
import showBottomMessage from '@/Utils/showBottomMessage';
import { publicAxios, privateAxios } from '@/config/axiosInstance';
import { UserContext } from '@/context/User/UserContext';
import { getSkillDescription, getSkillEmoji } from '@/Utils/skillDescriptions';

// Import CSS
import './PublicProfile.css';

const PublicProfile = () => {
  // Context and router
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const router = useRouter();
  const { username } = useParams();
  
  // State variables
  const [userData, setUserData] = useState({});
  const [about, setAbout] = useState('');
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [socials, setSocials] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const [showGreenCheck, setShowGreenCheck] = useState(false);
  const [handleInvite, setHandleInvite] = useState(false);
  const [emailList, setEmailList] = useState('');
  const [sending, setSending] = useState(false);
  const [shareOptionsVisible, setShareOptionsVisible] = useState(false);
  const [showOwnerInfo, setShowOwnerInfo] = useState(true);
  const [companyColors, setCompanyColors] = useState({});
  
  const spanRef = useRef(null);
  const sectionRefs = {
    about: useRef(null),
    experience: useRef(null),
    skills: useRef(null),
    social: useRef(null)
  };
  
  const linkToRequestRefer = `/request-referral/${username}`;
  
  // Months array for date calculations
  const allMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Get current date
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Array of vibrant colors for company markers
  const vibrantColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFD166', // Yellow
    '#6A0572', // Purple
    '#1A535C', // Dark Teal
    '#F86624', // Orange
    '#662E9B', // Deep Purple
    '#43AA8B', // Green
    '#F94144', // Bright Red
    '#277DA1', // Blue
    '#9C6644', // Brown
    '#F9C80E', // Gold
    '#2B2D42', // Navy
    '#06D6A0', // Mint
    '#5F0F40'  // Burgundy
  ];

  // Generate random colors for companies
  const generateCompanyColors = (companies) => {
    const colorMap = {};
    
    companies.forEach((exp, index) => {
      // Use index % array length to cycle through colors if more companies than colors
      colorMap[exp.companyName] = vibrantColors[index % vibrantColors.length];
    });
    
    return colorMap;
  };

  // Data fetching functions
  const getUserViaUsername = async () => {
    setShowLoader(true);
    try {
      const res = await publicAxios.get(`/getUser/${username}`);
      if (res.status === 200) {
        setUserData(res.data.user);
        setShowLoader(false);
      }
    } catch (err) {
      router.push('/page-not-found', { replace: true });
      setShowLoader(false);
    }
  };

  const getProfileDetails = async () => {
    setShowLoader(true);
    try {
      const res = await publicAxios.get(`/profile/profile-info/${username}`);
      if (res.status === 200) {
        const data = res.data.data;
        setAbout(data?.about);
        setExperience(data?.experience || []);
        setSkills(data?.skills || []);
        setSocials(data?.socials || []);
        
        // Generate colors for companies
        if (data?.experience && data.experience.length > 0) {
          setCompanyColors(generateCompanyColors(data.experience));
        }
        
        setShowLoader(false);
      }
    } catch (err) {
      setShowLoader(false);
    }
  };

  // Helper function to identify link type and return appropriate icon
  function getLinkIcon(url) {
    if (!url || url.length === 0) return null;

    try {
      const { hostname } = new URL(url);
      
      if (hostname.includes('linkedin')) return linkedinLogo;
      if (hostname.includes('twitter')) return twitterLogo;
      if (hostname.includes('github')) return githubLogo;
      if (hostname.includes('dev.to')) return devLogo;
      if (hostname.includes('instagram')) return instagramLogo;
      if (hostname.includes('facebook')) return facebookLogo;
      if (hostname.includes('medium')) return mediumLogo;
      if (hostname.includes('figma')) return figmaLogo;
      if (hostname.includes('substack')) return substackLogo;
      if (hostname.includes('tiktok')) return tiktokLogo;
      if (hostname.includes('twitch')) return twitchLogo;
      if (hostname.includes('youtube')) return youtubeLogo;
      if (hostname.includes('behance')) return behanceLogo;
      if (hostname.includes('dribbble')) return dribbleLogo;
      if (hostname.includes('crunchbase')) return crunchbaseLogo;
      if (hostname.includes('hashnode')) return hashnodeLogo;
      
      // Default social icon
      return null;
    } catch (e) {
      return null;
    }
  }

  // Helper function to get main expertise from skills
  function getMainExpertise() {
    if (!skills || skills.length === 0) {
      return '';
    }
    
    // Try to find common programming languages or skills
    const techKeywords = ['javascript', 'python', 'java', 'ruby', 'c++', 'c#', 'php', 'golang', 'rust', 
                          'oracle', 'sql', 'database', 'aws', 'azure', 'gcp', 'cloud', 'react', 'angular', 
                          'vue', 'node', 'frontend', 'backend', 'fullstack', 'mobile', 'android', 'ios'];
    
    for (const skill of skills) {
      for (const keyword of techKeywords) {
        if (skill.toLowerCase().includes(keyword)) {
          return skill;
        }
      }
    }
    
    // If no tech skill found, return the first skill
    return skills[0];
  }

  // Calculate total experience
  const calcTotalExperience = () => {
    let countMonth = 0;
    let countYear = 0;
    
    experience?.forEach((ele) => {
      const startMonthIdx = allMonths.indexOf(ele.startMonth);
      const endMonthIdx = ele.endMonth
        ? allMonths.indexOf(ele.endMonth) + 1
        : currentMonth;
      
      countMonth +=
        startMonthIdx > endMonthIdx
          ? Math.abs(12 - startMonthIdx + endMonthIdx)
          : Math.abs(startMonthIdx - endMonthIdx);
      
      if (startMonthIdx <= endMonthIdx) {
        countYear += (ele.endYear ? ele.endYear : currentYear) - ele.startYear;
      } else {
        countYear += (ele.endYear ? ele.endYear : currentYear) - ele.startYear - 1;
      }
    });

    if (countMonth >= 12) {
      countYear += Math.floor(countMonth / 12);
      countMonth = countMonth % 12;
    }
    
    return { countMonth, countYear };
  };

  // Get experience duration in months
  function getMonthDifference(currentYear, currentMonth, targetYear, targetMonth) {
    const yearDiff =
      targetMonth > currentMonth
        ? currentYear - targetYear - 1
        : currentYear - targetYear;
    const monthDiff =
      targetMonth > currentMonth
        ? Math.abs(12 - targetMonth + currentMonth)
        : Math.abs(targetMonth - currentMonth);
    const totalMonths = yearDiff * 12 + monthDiff;
    return totalMonths + 1;
  }

  // Format experience duration
  function formatExperienceDuration(months) {
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      return `${years} year${years !== 1 ? 's' : ''}${remainingMonths ? ` ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''}`;
    }
  }

  // Event handlers
  const copyProfileUrl = () => {
    const publicProfileURL = `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${username}`;
    navigator.clipboard.writeText(publicProfileURL);
    showBottomMessage('Public URL copied!');
    setShareOptionsVisible(false);
  };

  const copyTextToClipboard = () => {
    const textToCopy = spanRef.current.innerText;
    navigator.clipboard.writeText(textToCopy);
    setShowGreenCheck(true);
    setTimeout(() => {
      setShowGreenCheck(false);
    }, 1000);
  };

  // Scroll to section and update active tab
  const scrollToContent = (sectionId) => {
    setActiveSection(sectionId);
    const section = sectionRefs[sectionId]?.current;
    if (section) {
      const offset = 80; // Offset from the top to account for sticky header
      const sectionTop = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: sectionTop, behavior: 'smooth' });
    }
  };

  // Social sharing functions
  const handleLinkedinShare = () => {
    const userProfileUrl = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${username}`
    );
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${userProfileUrl}`;
    window.open(shareUrl, '_blank');
    setShareOptionsVisible(false);
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(`${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${username}`);
    const text = encodeURIComponent(`Check out ${userData.firstName}'s professional profile`);
    const via = encodeURIComponent('nectworks');
    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=${via}`;
    window.open(shareUrl, '_blank');
    setShareOptionsVisible(false);
  };
  
  const handleFacebookShare = () => {
    const userProfileUrl = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${username}`
    );
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${userProfileUrl}`;
    window.open(shareUrl, '_blank');
    setShareOptionsVisible(false);
  };

  // Toggle invite form
  const toggleInvite = () => {
    setHandleInvite(!handleInvite);
  };

  // Handle sending invite emails
  const handleSendEmails = async () => {
    try {
      let emails = emailList.trim().split(',').map((email) => email.trim());

      // Validate emails
      const isValidEmails = emails.every((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      });

      if (emails.length > 0 && emails.length <= 3 && isValidEmails) {
        // Remove duplicates
        emails = Array.from(new Set(emails));
        setSending(true);
        
        const response = await publicAxios.post('/send-invite-emails', {
          emails,
          userId: user._id,
        });

        if (response.status === 200) {
          showBottomMessage('Email sent successfully');
          setHandleInvite(false);
          setEmailList('');
          setSending(false);
        }
      } else if (!isValidEmails) {
        showBottomMessage('Please enter valid email address.');
      } else {
        showBottomMessage('Cannot send more than three emails at once.');
      }
    } catch (error) {
      showBottomMessage('Error sending emails.');
      setSending(false);
    }
  };

  // Handle referral request click
  const handleReferralRequest = () => {
    if (user && user._id === userData._id) {
      showBottomMessage('Cannot send referral requests to yourself.');
      return;
    } else {
      router.push(linkToRequestRefer);
    }
  };

  // Close owner info box
  const closeOwnerInfo = () => {
    setShowOwnerInfo(false);
  };

  // Initialize the one-tap login
  async function handleOneTapLogin(response) {
    try {
      const res = await privateAxios.post(`/google/one-tap/register`, {
        data: response,
      });

      const { signUp, user } = res.data;
      setUser(user);

      if (res.status === 200) {
        showBottomMessage('Successfully authenticated.');
        if (signUp === true) {
          router.push('/profile', {
            state: { from: `/user/${username}` },
            replace: true,
          });
        } else {
          router.push('/profile');
        }
      }
    } catch (error) {
      showBottomMessage('Error while signing up');
    }
  }

  // Load Google One Tap
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.defer = true;
    script.async = true;
    script.onload = () => {
      if (!user) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_CLIENT,
          callback: handleOneTapLogin,
        });
        window.google.accounts.id.prompt();
      }
    };
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Load Twitter widgets
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchData = async () => {
      await getUserViaUsername();
      await getProfileDetails();
    };
    
    fetchData();
    
    // Clean up function to handle component unmounting
    return () => {
      setUserData({});
      setAbout('');
      setExperience([]);
      setSkills([]);
      setSocials([]);
    };
  }, [username]);

  // Add event listener for page visibility changes to reload data when returning to page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Reload data when page becomes visible again
        getUserViaUsername().then(() => getProfileDetails());
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [username]);

  // Observe sections for intersection to update active tab
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -50% 0px',
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      Object.values(sectionRefs).forEach(ref => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      });
    };
  }, [showLoader]);

  // Render loading spinner
  if (showLoader) {
    return (
      <div className="profile-loader">
        <ClipLoader size={30} />
      </div>
    );
  }

  // Get user's main expertise for CTA card
  const userExpertise = getMainExpertise();

  return (
    <div className="profile-container">
      {/* Brand header (removed navbar class) */}
      <div className="profile-brand-header">
        <Link href="https://nectworks.com/" target="_blank" className="profile-navbar-brand">
          Nectworks
        </Link>
        <div className="profile-navbar-actions">
          <Link href="/profile">
            <button 
              className="profile-avatar-button"
              title="Profile">
              {user ? user.firstName?.charAt(0) : 'G'}
            </button>
          </Link>
        </div>
      </div>
      
      {/* Header with gradient background */}
      <header className="profile-header">
        <div className="profile-header-bg">
          {/* Animated background dots */}
          <div className="profile-animated-dots">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="profile-animated-dot" 
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 15 + 5}px`,
                  height: `${Math.random() * 15 + 5}px`,
                }}
              />
            ))}
          </div>
          
          {/* Status indicators */}
          <div className="profile-status-indicators">
            <div className="profile-status-badge profile-status-work">
              <span className="profile-status-dot"></span>
              <span>Open to refer</span>
            </div>
          </div>
        </div>
        
        <div className="profile-header-content">
          {/* Profile image with verification badge */}
          <div className="profile-image-container">
            <ProfileImage isLoggedInUser={false} otherUser={userData} />
            
            {userData.professionalDetails?.isVerifiedEmail && (
              <div className="profile-verified-badge">
                <span>✓</span>
              </div>
            )}
          </div>
          
          {/* User info */}
          <div className="profile-user-info">
            <h1 className="profile-name">
              {userData.firstName} {userData.lastName}
            </h1>
            
            {experience && experience.length > 0 && (
              <div className="profile-title">
                <FaBriefcase className="profile-icon" />
                <span>
                  {experience[0].jobTitle} @ {experience[0].companyName}
                </span>
              </div>
            )}
            
            <div className="profile-meta-info">
              {userData?.userDetails?.location && (
                <div className="profile-location">
                  <FaLocationDot className="profile-icon-sm" />
                  <span>{userData.userDetails.location}</span>
                </div>
              )}
              
              <div className="profile-experience">
                <FaCalendarDays className="profile-icon-sm" />
                <span>
                  {calcTotalExperience().countYear > 0 
                    ? `${calcTotalExperience().countYear} years, ${calcTotalExperience().countMonth} months` 
                    : `${calcTotalExperience().countMonth} months`}
                </span>
              </div>
            </div>
            
            {/* Previous companies */}
            {experience && experience.length > 1 && (
              <div className="profile-companies">
                {experience.slice(0, 3).map((exp, idx) => (
                  <div key={idx} className="profile-company-badge">
                    {exp.companyName}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="profile-actions">
            <button 
              className="profile-primary-btn"
              onClick={handleReferralRequest}
            >
              <span>Request Referral</span>
              <Image src={rightIcon} alt="arrow" width={16} height={16} />
            </button>
            
            {user && user.username === username && (
              <>
                <button 
                  className="profile-secondary-btn"
                  onClick={toggleInvite}
                  data-tooltip="Invite friends"
                >
                  <FaEnvelope className="profile-btn-icon" />
                </button>
                
                <div className="profile-share-container">
                  <button 
                    className="profile-secondary-btn"
                    onClick={() => setShareOptionsVisible(!shareOptionsVisible)}
                    data-tooltip="Share profile"
                  >
                    <FaArrowUpRightFromSquare className="profile-btn-icon" />
                  </button>
                  
                  {shareOptionsVisible && (
                    <div className="profile-share-dropdown">
                      <button onClick={handleLinkedinShare} className="profile-share-option">
                        <FaLinkedin className="profile-share-icon linkedin" /> LinkedIn
                      </button>
                      <button onClick={handleTwitterShare} className="profile-share-option">
                        <FaXTwitter className="profile-share-icon twitter" /> Twitter
                      </button>
                      <button onClick={handleFacebookShare} className="profile-share-option">
                        <FaFacebookF className="profile-share-icon facebook" /> Facebook
                      </button>
                      <button onClick={copyProfileUrl} className="profile-share-option">
                        <Image src={copyIcon} alt="copy" width={16} height={16} className="profile-share-icon" />
                        Copy Link
                        {showGreenCheck && (
                          <Image src={greenTickIcon} alt="copied" width={16} height={16} className="profile-check-icon" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {!user && (
              <a href="/" className="profile-secondary-btn explore-btn">
                Explore
              </a>
            )}
          </div>
        </div>
      </header>
      
      {/* Invite modal */}
      {handleInvite && (
        <div className="profile-invite-modal">
          <div className="profile-invite-content">
            <div className="profile-invite-header">
              <h3>Invite friends via email</h3>
              <button onClick={toggleInvite} className="profile-invite-close">
                <Image src={close} alt="close" width={20} height={20} />
              </button>
            </div>
            
            <div className="profile-invite-body">
              <div className="profile-invite-group">
                <label><strong>From:</strong></label>
                <p>{user?.email}</p>
              </div>
              
              <div className="profile-invite-group">
                <label><strong>Subject:</strong></label>
                <p>{user?.firstName} has invited you to join Nectworks</p>
              </div>
              
              <div className="profile-invite-group">
                <label><strong>To:</strong></label>
                <textarea
                  className="profile-invite-textarea"
                  value={emailList}
                  onChange={(e) => setEmailList(e.target.value)}
                  placeholder="Enter email addresses separated by commas (max 3)..."
                  rows={3}
                />
                <p className="profile-invite-hint">You can invite up to 3 people at once</p>
              </div>
              
              <button
                className="profile-invite-send-btn"
                onClick={handleSendEmails}
                disabled={sending}
              >
                {sending ? 'Sending...' : 'Send Invites'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabbed navigation */}
      <div className="profile-tabs-container">
        <div className="profile-tabs">
          <button 
            className={`profile-tab ${activeSection === 'about' ? 'active' : ''}`}
            onClick={() => scrollToContent('about')}
          >
            About
          </button>
          <button 
            className={`profile-tab ${activeSection === 'experience' ? 'active' : ''}`}
            onClick={() => scrollToContent('experience')}
          >
            Experience
          </button>
          <button 
            className={`profile-tab ${activeSection === 'skills' ? 'active' : ''}`}
            onClick={() => scrollToContent('skills')}
          >
            Skills
          </button>
          {socials && socials.length > 0 && (
            <button 
              className={`profile-tab ${activeSection === 'social' ? 'active' : ''}`}
              onClick={() => scrollToContent('social')}
            >
              Connect
            </button>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <main className="profile-main">
        {/* About section */}
        <section id="about" ref={sectionRefs.about} className="profile-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">About</h2>
          </div>
          <div className="profile-section-body">
            {about?.bio ? (
              <p className="profile-bio">{about.bio}</p>
            ) : (
              <p className="profile-empty">No bio provided</p>
            )}
            
            {about?.additionalInfo && (
              <div className="profile-additional-info">
                <h3 className="profile-additional-title">What {userData.firstName} loves about their job</h3>
                <p>{about.additionalInfo}</p>
              </div>
            )}
            
            {/* Current vibe - Gen Z element */}
            <div className="profile-vibe-box">
              <h3 className="profile-vibe-title">Current Vibe</h3>
              <div className="profile-vibe-content">
                <div className="profile-vibe-emoji">🚀</div>
                <div className="profile-vibe-text">
                  <div className="profile-vibe-status">Ready to help others grow</div>
                  <div className="profile-vibe-detail">Sharing knowledge &amp; opening doors</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Experience section */}
        <section id="experience" ref={sectionRefs.experience} className="profile-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Experience</h2>
          </div>
          <div className="profile-section-body">
            {experience && experience.length > 0 ? (
              <div className="profile-timeline">
                {experience.map((exp, index) => {
                  const startMonth = allMonths.indexOf(exp.startMonth);
                  const endMonth = exp.endMonth ? allMonths.indexOf(exp.endMonth) : currentMonth - 1;
                  const durationMonths = getMonthDifference(
                    exp.endYear || currentYear,
                    endMonth,
                    exp.startYear,
                    startMonth
                  );
                  
                  // Get color for this company
                  const companyColor = companyColors[exp.companyName] || vibrantColors[0];
                  
                  return (
                    <div key={index} className="profile-timeline-item">
                      <div 
                        className="profile-timeline-marker"
                        style={{ backgroundColor: companyColor, color: '#fff' }}
                      >
                        <span>{exp.companyName.charAt(0)}</span>
                      </div>
                      <div className="profile-timeline-content">
                        <h3 className="profile-job-title">{exp.jobTitle}</h3>
                        <div className="profile-company-info">
                          <span className="profile-company-name">{exp.companyName}</span>
                          <span className="profile-employment-type">{exp.employmentType}</span>
                        </div>
                        <div className="profile-job-duration">
                          <span className="profile-duration-dates">
                            {exp.startMonth} {exp.startYear} - {exp.endMonth || 'Present'} {exp.endYear || ''}
                          </span>
                          <span className="profile-duration-time">
                            {formatExperienceDuration(durationMonths)}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="profile-job-description">{exp.description}</p>
                        )}
                        {exp.skills && exp.skills.length > 0 && (
                          <div className="profile-job-skills">
                            {exp.skills.map((skill, idx) => (
                              <span key={idx} className="profile-skill-tag-small">{skill}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="profile-empty">No experience listed</p>
            )}
          </div>
        </section>
        
        {/* Skills section */}
        <section id="skills" ref={sectionRefs.skills} className="profile-section">
          <div className="profile-section-header">
            <h2 className="profile-section-title">Skills & Superpowers</h2>
          </div>
          <div className="profile-section-body">
            {skills && skills.length > 0 ? (
              <>
                <div className="profile-skills">
                  {skills.map((skill, index) => (
                    <div key={index} className="profile-skill-tag">{skill}</div>
                  ))}
                </div>
                
                {/* Skill cards section */}
                <div className="profile-skill-cards">
                  <div className="profile-skill-card profile-skill-card-blue">
                    <div className="profile-skill-emoji">
                      {skills.length > 0 ? getSkillEmoji(skills[0]) : '👨‍💻'}
                    </div>
                    <h3 className="profile-skill-card-title">
                      {skills.length > 0 ? skills[0] : 'Technical Expert'}
                    </h3>
                    <p className="profile-skill-card-desc">
                      {skills.length > 0 ? getSkillDescription(skills[0]) : 'Applying specialized knowledge to solve complex problems'}
                    </p>
                  </div>
                  
                  <div className="profile-skill-card profile-skill-card-orange">
                    <div className="profile-skill-emoji">
                      {skills.length > 1 ? getSkillEmoji(skills[1]) : '🔄'}
                    </div>
                    <h3 className="profile-skill-card-title">
                      {skills.length > 1 ? skills[1] : 'Problem Solver'}
                    </h3>
                    <p className="profile-skill-card-desc">
                      {skills.length > 1 ? getSkillDescription(skills[1]) : 'Supporting projects with specialized knowledge'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <p className="profile-empty">No skills listed</p>
            )}
          </div>
        </section>
        
        {/* Connect section */}
        {socials && socials.length > 0 && (
          <section id="social" ref={sectionRefs.social} className="profile-section">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Connect With Me</h2>
            </div>
            <div className="profile-section-body">
              <div className="profile-social-links">
                {socials.map((social, index) => {
                  const icon = getLinkIcon(social);
                  let hostname = '';
                  
                  try {
                    const url = new URL(social);
                    hostname = url.hostname.replace('www.', '').split('.')[0];
                  } catch (e) {
                    hostname = 'link';
                  }
                  
                  return (
                    <a 
                      key={index} 
                      href={social} 
                      target="_blank" 
                      rel="noreferrer"
                      className="profile-social-link"
                    >
                      <div className="profile-social-icon-container">
                        {icon ? (
                          <Image 
                            src={icon} 
                            alt={hostname} 
                            width={24} 
                            height={24} 
                            className="profile-social-icon" 
                          />
                        ) : (
                          <FaArrowUpRightFromSquare className="profile-social-icon" />
                        )}
                      </div>
                      <div className="profile-social-info">
                        <span className="profile-social-name">{hostname}</span>
                        <span className="profile-social-username">@{userData.username || 'username'}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
              
              {/* Dynamic CTA Card based on user's current company */}
              <div className="profile-cta-card">
                <h3 className="profile-cta-title">
                  {experience && experience.length > 0 && !experience[0].endMonth
                    ? `Interested in working at ${experience[0].companyName}?`
                    : `Looking for a referral opportunity?`}
                </h3>
                <p className="profile-cta-text">
                  {experience && experience.length > 0 && !experience[0].endMonth
                    ? `I can refer you for roles at ${experience[0].companyName}. Send me your details to get started!`
                    : `I can help connect you with opportunities in my network. Let me know what you're looking for!`}
                </p>
                <button className="profile-cta-button" onClick={handleReferralRequest}>
                  Request a Referral
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
      
      {/* Profile owner info box */}
      {user && user.username === username && showOwnerInfo && (
        <div className="profile-owner-info">
          <button 
            className="profile-owner-info-close" 
            onClick={closeOwnerInfo}
          >
            <Image src={crossIcon} alt="close" width={16} height={16} />
          </button>
          
          <h3 className="profile-owner-info-title">Your Public Profile</h3>
          <p className="profile-owner-info-text">
            Your public profile is visible to all users. Enhance your visibility and increase referral requests by ensuring <Link href="/profile" className="profile-owner-info-link">your profile</Link> is complete.
          </p>
          <button 
            className="profile-owner-info-btn"
            onClick={copyProfileUrl}
          >
            Copy profile link
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicProfile;