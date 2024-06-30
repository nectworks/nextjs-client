'use client';

/*
    File - PublicProfile.js
    Desc -  This file is responsible for displaying a public profile
    page for a user, including their personal details, work history,
    skills, and social links. It also includes functionality for
    copying a referral code to the clipboard and scrolling to specific
    sections of the page.
*/
import { useEffect, useRef, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import rightIcon from '@/public/PublicProfile/rightIcon.png';
import copyIcon from '@/public/PublicProfile/copyIcon.png';
import linkedInIcon from '@/public/PublicProfile/linkedInIcon.png';
import greenTickIcon from '@/public/PublicProfile/greenTickIcon.png';
import generalLinkIcon from '@/public/PublicProfile/generalLinkIcon.svg';
import './PublicProfile.css';
import Link from 'next/link';
import Image from 'next/image';
import { publicAxios } from '@/config/axiosInstance';
import { privateAxios } from '@/config/axiosInstance';
import ProfileImage from '../../_components/Profile/ProfileImage/ProfileImage';
import showBottomMessage from '@/Utils/showBottomMessage';
import { useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { UserContext } from '@/context/User/UserContext';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import close from '@/public/SignUpConfirmPopup/crossIcon.svg';
import { FaFacebookF, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter, FaArrowUpRightFromSquare } from 'react-icons/fa6';

const PublicProfile = () => {
  // get the loggedin user from the context
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const router = useRouter();
  const spanRef = useRef(null);
  const [showGreenCheck, setShowGreenCheck] = useState(false);
  const { username } = useParams();
  const [userData, setUserData] = useState({});
  const linkToRequestRefer = `/request-referral/${username}`;
  const [about, setAbout] = useState('');
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [socials, setSocials] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [handleInvite, setHandleInvite] = useState(false);
  const [emailList, setEmailList] = useState('');
  const [sending, setSending] = useState(false);

  // Function to scroll to a specific content
  function scrollToContent(e) {
    e.preventDefault();

    // Get the target element to scroll into view
    const targetId = (e.target.dataset.sectionId || '').toLowerCase();
    const targetElement = document.getElementById(targetId);

    if (!targetElement) {
      return;
    }

    // Get the top attribute of the body element and target element
    const bodyRect = document.body.getBoundingClientRect().top;
    const targetEleRect = targetElement.getBoundingClientRect().top;
    const headerOffset = 150;

    // Calculate the current position to bring the view into the screen
    const scrollPos = targetEleRect - bodyRect - headerOffset;

    window.scrollTo({
      top: scrollPos,
      behavior: 'smooth', // Use 'smooth' for smooth scrolling
    });
  }

  //to send invitation links to friends
  const handleSendEmails = async () => {
    try {
      let emails = emailList
        .trim()
        .split(',')
        .map((email) => email.trim());

      // Validate each email
      const isValidEmails = emails.every((email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      });

      if (emails.length > 0 && emails.length <= 3 && isValidEmails) {
        // Remove duplicates using a Set
        emails = Array.from(new Set(emails));
        setSending(true);
        const response = await publicAxios.post('/send-invite-emails', {
          emails,
          userId: user._id,
        });

        if (response.status === 200) {
          // Close the invite div and clear the email list only if the email sending is successful
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
      setSending(false); // Set sending to false in case of error
    }
  };

  //To handle inviteDiv toggle
  const toggleInvite = () => {
    setHandleInvite(!handleInvite);
  };
  const copyTextToClipboard = () => {
    // Get the text from the span element using the ref
    const textToCopy = spanRef.current.innerText;

    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.setAttribute('value', textToCopy);
    document.body.appendChild(tempInput);

    // Select the text in the input field
    tempInput.select();

    // Copy the selected text to the clipboard
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(tempInput);

    setShowGreenCheck(true);
    setTimeout(() => {
      setShowGreenCheck(false);
    }, 1000);
  };

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
        setExperience(data?.experience);
        setSkills(data?.skills);
        setSocials(data?.socials);
        setShowLoader(false);
      }
    } catch (err) {
      setShowLoader(false);
    }
  };

  // Get the current date
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
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  function getMonthDifference(
    currentYear,
    currentMonth,
    targetYear,
    targetMonth
  ) {
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
  const lastJobStyleMarginTop = {
    marginTop: '-6px',
  };

  const calcTotalExperience = () => {
    let countMonth = 0;
    let countYear = 0;
    experience &&
      experience.map((ele) => {
        const startMonthIdx = allMonths.indexOf(ele.startMonth);
        const endMonthIdx = ele.endMonth
          ? allMonths.indexOf(ele.endMonth) + 1
          : currentMonth;
        countMonth +=
          startMonthIdx > endMonthIdx
            ? Math.abs(12 - startMonthIdx + endMonthIdx)
            : Math.abs(startMonthIdx - endMonthIdx);
        if (startMonthIdx <= endMonthIdx) {
          countYear +=
            (ele.endYear ? ele.endYear : currentYear) - ele.startYear;
        } else {
          countYear +=
            (ele.endYear ? ele.endYear : currentYear) - ele.startYear - 1;
        }
      });

    if (countMonth >= 12) {
      countYear += Math.floor(countMonth / 12);
      countMonth = countMonth % 12;
    }
    return { countMonth, countYear };
  };

  // copy the url of the public profile on click
  function copyProfileUrl() {
    if (!user) return;
    const publicProfileURL = `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`;
    navigator.clipboard.writeText(publicProfileURL);
    // display a message after copying url successfully
    showBottomMessage('Public URL copied!');
  }

  useEffect(() => {
    getUserViaUsername().then(() => getProfileDetails());
  }, []);

  // prompt user to login
  async function handleOneTapLogin(response) {
    try {
      const res = await privateAxios.post(`/google/one-tap/register`, {
        data: response,
      });

      // if user is successfully signed up redirect them to profile page
      const { signUp, user } = res.data;

      setUser(user);

      if (res.status === 200) {
        showBottomMessage('Successfully authenticated.');
        if (signUp === true) {
          router.push('/profile', {
            state: {
              from: `/user/${username}`,
            },
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

  useEffect(() => {
    // <!-- google identity client library (for one tap signup) -->
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.defer = true;
    script.async = true;
    script.onload = (data) => {
      if (!user) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_ONE_TAP_CLIENT,
          callback: handleOneTapLogin,
        });

        window.google.accounts.id.prompt();
      }
    };

    document.body.appendChild(script);
  }, []);

  async function getLinkedinShareUrl(e) {
    const userProfileUrl = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`
    );
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${userProfileUrl}`;
    window.open(shareUrl, '_blank');
  }

  // function to share on twitter with the user's handle
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [clickedShareButton, setclickedShareButton] = useState(false);
  const handleShareButtonClick = () => {
    const shareBtn = document.getElementById('profile-share-button');
    shareBtn.classList.toggle('open');
    if (clickedShareButton) setclickedShareButton(false);
    else setclickedShareButton(true);
  };

  const [clickedShareButton1, setclickedShareButton1] = useState(false);
  const handleShareButtonClick1 = () => {
    const shareBtn = document.getElementById('profile-share-button1');
    shareBtn.classList.toggle('open');
    if (clickedShareButton1) setclickedShareButton1(false);
    else setclickedShareButton1(true);
  };

  const handleClick = () => {
    const url = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`
    ); // URL of your website
    const text = encodeURIComponent(''); // Text for the tweet to add a placeholder text
    const via = encodeURIComponent('nectworks'); // Your Twitter handle

    const shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=${via}`;
    window.open(shareUrl, '_blank');
  };

  // function to share on Facebook as a post
  const handleClickFacebook = () => {
    const userProfileUrl = encodeURIComponent(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/user/${user?.username}`
    );
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${userProfileUrl}`;
    window.open(shareUrl, '_blank');
  };

  return (
    <>
      {!showLoader ? (
        <div className="publicProfileContainer">
          <div className="publicProfileContent">
            <div className="introductionSection">
              <div className="introSection">
                <div className="introSectionDetails">
                  <h1>
                    Hello! I&apos;m{' '}
                    <b>
                      {userData.firstName}&nbsp;
                      {userData.lastName}
                    </b>
                  </h1>
                  <h1>
                    I work{' '}
                    <b>
                      @
                      {experience &&
                        experience.map((ele, id) => {
                          return id !== 0 ? null : (
                            <span key={id}>{ele.companyName}</span>
                          );
                        })}
                    </b>
                  </h1>
                  <div className="introSectionDetailsButtons">
                    <button
                      onClick={() => {
                        if (user && user._id === userData._id) {
                          showBottomMessage(
                            'Can not send referral requests to yourself.'
                          );
                          return;
                        } else {
                          router.push(linkToRequestRefer);
                        }
                      }}
                    >
                      Request Referral
                      <Image
                        src={rightIcon}
                        alt="request referral from the professional"
                      />
                    </button>

                    <a href="/" target="_blank" rel="noreferrer">
                      <button>
                        Explore Nectworks
                        <Image src={rightIcon} alt="Nectworks home page" />
                      </button>
                    </a>
                  </div>
                  {experience && experience.length > 1 && (
                    <div className="previousCompanies">
                      {experience &&
                        (experience.length <= 1 ? (
                          <p>&nbsp;</p>
                        ) : (
                          <p>Ex Company:</p>
                        ))}
                      {experience &&
                        experience.map((ele, id) => {
                          return (
                            id < 4 &&
                            (id === 0 ? null : (
                              <span key={id}>{ele.companyName}</span>
                            ))
                          );
                        })}
                    </div>
                  )}

                  {user && user.username === username && (
                    <div className="invite-share-div">
                      <div className="inviteMainDiv">
                        <button
                          className="invite-button"
                          onClick={toggleInvite}
                        >
                          Invite Friends
                        </button>

                        {handleInvite && (
                          <div className="inviteDiv">
                            <div className="inviteShareDiv">
                              <p className="invitePara">
                                Invite friends via email
                              </p>
                              <Image
                                src={close}
                                alt="close"
                                className="closeInvite"
                                onClick={toggleInvite}
                              />
                            </div>

                            <p className="fromPara">
                              <b>From:</b> <p>{user.email}</p>
                            </p>
                            <p className="subjectPara">
                              <b>Subject:</b>
                              <p>
                                {user.firstName} has invited you to join
                                nectworks
                              </p>
                            </p>
                            <div>
                              <div className="textAreaBox">
                                <label className="toPara">
                                  <b>To:</b>
                                </label>
                                <textarea
                                  className="textArea"
                                  rows={4}
                                  cols={50}
                                  value={emailList}
                                  onChange={(e) => setEmailList(e.target.value)}
                                  placeholder="Enter email addresses separated by commas..."
                                ></textarea>
                              </div>
                              <div className="sendButtonDiv">
                                <button
                                  className="sendEmailsButton"
                                  onClick={handleSendEmails}
                                  disabled={sending}
                                >
                                  {sending ? 'Sending...' : 'Send Emails'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {user && user.username === username && (
                        <div
                          className={`profile_share-wrapper${
                            clickedShareButton1 ? 'clicked' : ''
                          }`}
                        >
                          <div className="Dashboard_profile_share-publicprofile">
                            <span onClick={handleShareButtonClick1}>Share</span>
                            <button
                              className="profile-share-button1"
                              id="profile-share-button1"
                              onClick={handleShareButtonClick1}
                            >
                              <i className="fas fa-arrow-up-right-from-square share-icon">
                                <FaArrowUpRightFromSquare />
                              </i>
                              <span className="social-icons">
                                <i
                                  className="fab fa-facebook-f"
                                  onClick={handleClickFacebook}
                                >
                                  <FaFacebookF />
                                </i>
                                <i
                                  className="fab fa-x-twitter"
                                  onClick={handleClick}
                                >
                                  <FaXTwitter />
                                </i>
                                <i
                                  className="fab fa-linkedin"
                                  onClick={getLinkedinShareUrl}
                                >
                                  <FaLinkedin />
                                </i>
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <ProfileImage isLoggedInUser={false} otherUser={userData} />
              </div>
            </div>
            <div className="profileDetailsSection">
              <div className="profileDetailsHeading">
                <div className="profileDetailsButtons">
                  <button
                    data-section-id="about"
                    className="scrollButton"
                    onClick={scrollToContent}
                  >
                    about
                  </button>
                  <button
                    data-section-id="Experience"
                    className="scrollButton"
                    onClick={scrollToContent}
                  >
                    experience
                  </button>
                  <button
                    data-section-id="Skills"
                    className="scrollButton"
                    onClick={scrollToContent}
                  >
                    skills
                  </button>
                  <button
                    data-section-id="Social"
                    className="scrollButton"
                    onClick={scrollToContent}
                  >
                    social
                  </button>
                  {/* <button className='shareButton' onClick={scrollToContent}>
                                    <p>Share</p>
                                    <Image src={shareIcon} alt="logo" />
                                </button> */}
                </div>
              </div>
              <div className="profileDetailDescription">
                <div id="about" className="aboutContent">
                  <pre>{about?.bio || ''}</pre>
                </div>

                {/* If the professional has added additionalInfo, display it */}
                {about?.additionalInfo?.length > 0 && (
                  <div className="aboutAdditionalContent">
                    <h3>What does {userData.firstName} love about their job</h3>
                    <pre>{about?.additionalInfo || ''}</pre>
                  </div>
                )}

                <hr
                  className="horizontalLinePublicProfile"
                  style={{
                    marginTop: '40px',
                    marginBottom: '15px',
                    marginLeft: '0',
                    marginRight: '0',
                  }}
                />
                <div id="experience" className="experience">
                  <h4 className="public_profile_section_heading">
                    Total Experience:&nbsp;
                    {calcTotalExperience().countYear === 0
                      ? null
                      : calcTotalExperience().countYear + 'y '}
                    {calcTotalExperience().countMonth}mos
                  </h4>
                  {experience &&
                    experience.map((ele, id) => {
                      return (
                        <div key={id} className="experienceDesc">
                          <div
                            className="experienceDescLeft"
                            style={
                              id === experience.length - 1
                                ? lastJobStyleMarginTop
                                : null
                            }
                          >
                            <div
                              className={`makeCircle 
                          ${id === 0 ? 'hideExperienceDescCircle' : ''}`}
                            ></div>
                            <div
                              className={`experienceHorizontalLine
                          ${
                            id === experience.length - 1
                              ? 'experienceHorizontalLineDecreaseWidth'
                              : null
                          }`}
                            ></div>
                          </div>

                          <div className="experienceDescRight">
                            <h1 style={{ fontSize: '24px' }}>
                              {ele.jobTitle}
                              <span
                                style={{
                                  fontSize: '1.2rem',
                                  fontWeight: 'lighter',
                                  color: '#0057B1',
                                }}
                              >
                                &nbsp;|
                              </span>{' '}
                              <span
                                style={{
                                  fontSize: '1rem',
                                  fontWeight: 'lighter',
                                  color: '#4B4B4B',
                                }}
                              >
                                {getMonthDifference(
                                  ele.endYear ? ele.endYear : currentYear,
                                  ele.endMonth
                                    ? allMonths.indexOf(ele.endMonth)
                                    : currentMonth - 1,
                                  ele.startYear,
                                  allMonths.indexOf(ele.startMonth)
                                ) < 12
                                  ? getMonthDifference(
                                      ele.endYear ? ele.endYear : currentYear,
                                      ele.endMonth
                                        ? allMonths.indexOf(ele.endMonth)
                                        : currentMonth - 1,
                                      ele.startYear,
                                      allMonths.indexOf(ele.startMonth)
                                    ) + ' months'
                                  : Math.floor(
                                      getMonthDifference(
                                        ele.endYear ? ele.endYear : currentYear,
                                        ele.endMonth
                                          ? allMonths.indexOf(ele.endMonth)
                                          : currentMonth - 1,
                                        ele.startYear,
                                        allMonths.indexOf(ele.startMonth)
                                      ) / 12
                                    ) +
                                    ' year ' +
                                    (getMonthDifference(
                                      ele.endYear ? ele.endYear : currentYear,
                                      ele.endMonth
                                        ? allMonths.indexOf(ele.endMonth)
                                        : currentMonth - 1,
                                      ele.startYear,
                                      allMonths.indexOf(ele.startMonth)
                                    ) %
                                      12 !==
                                    0
                                      ? (getMonthDifference(
                                          ele.endYear
                                            ? ele.endYear
                                            : currentYear,
                                          ele.endMonth
                                            ? allMonths.indexOf(ele.endMonth)
                                            : currentMonth - 1,
                                          ele.startYear,
                                          allMonths.indexOf(ele.startMonth)
                                        ) %
                                          12) +
                                        ' months'
                                      : '')}
                              </span>
                            </h1>
                            <p>
                              {ele.companyName} - {ele.employmentType}
                            </p>
                            <p style={{ color: '#282828' }}>
                              {ele.startMonth}&nbsp;
                              {ele.startYear} -&nbsp;
                              {!ele.endMonth ? 'Present' : ele.endMonth}&nbsp;
                              {ele.endYear ? ele.endYear : null}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <hr
                  className="horizontalLinePublicProfile"
                  style={{ margin: '40px 0px 15px' }}
                />
                <h4 className="public_profile_section_heading">Skills</h4>
                <div className="skills">
                  {skills &&
                    skills.map((ele, id) => {
                      return <p key={id}>{ele}</p>;
                    })}
                </div>
                <hr
                  className="horizontalLinePublicProfile"
                  style={{ margin: '40px 0px 15px' }}
                />
                <div id="social" className="social">
                  {socials &&
                    socials.map((ele, id) => {
                      return ele.includes('linkedin.com') ? (
                        <a key={id} href={ele} target="_blank" rel="noreferrer">
                          <Image
                            className="linkedInIcon"
                            src={linkedInIcon}
                            alt="linkedin link"
                          />
                        </a>
                      ) : (
                        <a key={id} href={ele} target="_blank" rel="noreferrer">
                          <Image
                            className="generalIcon"
                            src={generalLinkIcon}
                            alt="other social link"
                          />
                        </a>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="clipLoaderClass">
          <ClipLoader size={30} />
        </div>
      )}

      {!showLoader ? (
        <div className="mobilePublicProfileContainer">
          <div className="mobilePublicProfileContent">
            <div className="mobilePublicProfileHeader">
              {/* <button className='shareIconImg'>
            <Image src={shareIcon} alt="logo" /></button> */}
              <div className="publicImgAndShareButton">
                {/* <Image src={defaultProfile} alt="logo" /> */}
                <ProfileImage isLoggedInUser={false} otherUser={userData} />
              </div>
              <h1>
                Hello! I&apos;m{' '}
                <b>
                  {userData.firstName}&nbsp;
                  {userData.lastName}
                </b>
              </h1>
              <h1>
                I work{' '}
                <b>
                  @
                  {experience &&
                    experience.map((ele, id) => {
                      return id !== 0 ? null : (
                        <span key={id}>{ele.companyName}</span>
                      );
                    })}
                </b>
              </h1>
              {experience && experience.length > 1 && (
                <div className="exCompanies">
                  {experience &&
                    (experience.length <= 1 ? (
                      <p>&nbsp;</p>
                    ) : (
                      <p>Ex Company:</p>
                    ))}
                  {experience &&
                    experience.map((ele, id) => {
                      return (
                        id < 4 &&
                        (id === 0 ? null : (
                          <span key={id}>{ele.companyName}</span>
                        ))
                      );
                    })}
                </div>
              )}
            </div>
          </div>
          <div className="introSectionDetailsButtonsMobile">
            <Link href={`/request-referral/${username}`}>
              <button>Request Referral</button>
            </Link>
            <a
              href={`${process.env.NEXT_PUBLIC_CLIENT_URL}`}
              target="_blank"
              rel="noreferrer"
            >
              <button>Explore Nectworks</button>
            </a>
          </div>

          <div className="aboutSectionMobile">
            <h1>About</h1>
            <pre>{about?.bio || ''}</pre>
          </div>
          <hr
            style={{
              padding: '0',
              marginLeft: '20px',
              width: '55vw',
              marginTop: '20px',
              marginBottom: '40px',
            }}
          />
          <div className="experienceSectionMobile">
            <h1>Experience</h1>
            <div id="experience" className="experience">
              <p
                style={{
                  color: '#4B4B4B',
                  marginLeft: '0',
                  marginRight: '0',
                  marginTop: '30px',
                  marginBottom: '20px',
                }}
              >
                Total Experience:&nbsp;
                {calcTotalExperience().countYear === 0
                  ? null
                  : calcTotalExperience().countYear + 'y'}
                &nbsp;
                {calcTotalExperience().countMonth}mos
              </p>
              {experience &&
                experience.map((ele, id) => {
                  return (
                    <div
                      key={id}
                      className="experienceDesc"
                      style={{
                        marginLeft: id === 0 ? '10px' : '0',
                      }}
                    >
                      <div
                        className="experienceDescLeft"
                        style={
                          id === experience.length - 1
                            ? lastJobStyleMarginTop
                            : null
                        }
                      >
                        {id > 0 ? <div className="makeCircle"></div> : null}
                        <div
                          className={`experienceHorizontalLine
      ${
        id === experience.length - 1
          ? 'experienceHorizontalLineDecreaseWidth'
          : null
      }`}
                        ></div>
                      </div>
                      <div className="experienceDescRight">
                        <h1 style={{ fontSize: '18px' }}>
                          {ele.jobTitle}
                          <span
                            style={{
                              fontSize: '1.2rem',
                              fontWeight: 'lighter',
                              color: '#0057B1',
                            }}
                          >
                            &nbsp;|
                          </span>{' '}
                          <span
                            style={{
                              fontSize: '1rem',
                              fontWeight: 'lighter',
                              color: '#4B4B4B',
                            }}
                          >
                            {getMonthDifference(
                              ele.endYear ? ele.endYear : currentYear,
                              ele.endMonth
                                ? allMonths.indexOf(ele.endMonth)
                                : currentMonth - 1,
                              ele.startYear,
                              allMonths.indexOf(ele.startMonth)
                            ) < 12
                              ? getMonthDifference(
                                  ele.endYear ? ele.endYear : currentYear,
                                  ele.endMonth
                                    ? allMonths.indexOf(ele.endMonth)
                                    : currentMonth - 1,
                                  ele.startYear,
                                  allMonths.indexOf(ele.startMonth)
                                ) + ' months'
                              : Math.floor(
                                  getMonthDifference(
                                    ele.endYear ? ele.endYear : currentYear,
                                    ele.endMonth
                                      ? allMonths.indexOf(ele.endMonth)
                                      : currentMonth - 1,
                                    ele.startYear,
                                    allMonths.indexOf(ele.startMonth)
                                  ) / 12
                                ) +
                                ' years ' +
                                (getMonthDifference(
                                  ele.endYear ? ele.endYear : currentYear,
                                  ele.endMonth
                                    ? allMonths.indexOf(ele.endMonth)
                                    : currentMonth - 1,
                                  ele.startYear,
                                  allMonths.indexOf(ele.startMonth)
                                ) %
                                  12 !==
                                0
                                  ? (getMonthDifference(
                                      ele.endYear ? ele.endYear : currentYear,
                                      ele.endMonth
                                        ? allMonths.indexOf(ele.endMonth)
                                        : currentMonth - 1,
                                      ele.startYear,
                                      allMonths.indexOf(ele.startMonth)
                                    ) %
                                      12) +
                                    ' months'
                                  : '')}
                          </span>
                        </h1>
                        <p>
                          {ele.companyName} - {ele.employmentType}
                        </p>
                        <p style={{ color: '#282828' }}>
                          {ele.startMonth}&nbsp;
                          {ele.startYear} -&nbsp;
                          {!ele.endMonth ? 'Present' : ele.endMonth}
                          {ele.endYear ? ele.endYear : null}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <hr
            style={{
              padding: '0',
              marginLeft: '20px',
              width: '55vw',
              marginTop: '40px',
              marginBottom: '40px',
            }}
          />
          <div className="skillsMobile">
            <h1>Skills</h1>
            <div style={{ marginTop: '20px' }} id="skills" className="skills">
              {skills &&
                skills.map((ele, id) => {
                  return <p key={id}>{ele}</p>;
                })}
            </div>
          </div>
          <hr
            style={{
              padding: '0',
              marginLeft: '20px',
              width: '55vw',
              marginTop: '40px',
              marginBottom: '40px',
            }}
          />
          <div className="socialMobile">
            <h1>Social</h1>
            <div style={{ marginTop: '10px' }} id="social" className="social">
              {socials &&
                socials.map((ele, id) => {
                  return ele.includes('linkedin.com') ? (
                    <a key={id} href={ele} target="_blank" rel="noreferrer">
                      <Image
                        className="linkedInIcon"
                        src={linkedInIcon}
                        alt="linkedin link"
                      />
                    </a>
                  ) : (
                    <a key={id} href={ele} target="_blank" rel="noreferrer">
                      <Image
                        className="generalIcon"
                        src={generalLinkIcon}
                        alt="other link"
                      />
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <div className="clipLoaderClass">
          <ClipLoader size={30} />
        </div>
      )}

      {user && user.username === username && (
        <div className="profile_preview_info_box profile_preview_info_box_hidden">
          <Image
            src={crossIcon}
            alt="close the profile preview message"
            onClick={(e) => {
              const previewBox = document.querySelector(
                '.profile_preview_info_box'
              );
              previewBox.style.opacity = 0;

              setTimeout(function () {
                previewBox.style.display = 'none';
              }, 500);
            }}
          />
          <h3>Profile Preview</h3>
          <p>
            {user?.firstName}, your public profile is visible to all users,
            whether they are signed in or not. Enhance your visibility and
            increase referral requests by ensuring{' '}
            <Link href={`/profile`}>your profile</Link> shines.
            <br></br>
            <br></br>
            <i>
              Don&apos;t forget, you can also{' '}
              <button onClick={copyProfileUrl}>Copy your profile URL</button>{' '}
              and share it on LinkedIn or other platforms to attract more
              referrals.
            </i>
          </p>
        </div>
      )}
    </>
  );
};

export default PublicProfile;
