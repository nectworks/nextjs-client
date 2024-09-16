'use client';
/**
 * seekerPublicPage.js
 * This page displays information about a job seeker, including their profile picture, name,
 * company, profession, and various sections such as about, experience, education, skills,
 * achievements, projects, and social links.
 */

import { useEffect, useState } from 'react';
import './seekerPublicPage.css';
import iconSrc from '@/public/download_icon.svg';
import AboutIcon from '@/public/JobSeeker/seekerPublicPage/me_icon.svg';
import Projects from '@/public/JobSeeker/seekerPublicPage/project_icon.svg';
import SkillsIcon from '@/public/JobSeeker/seekerPublicPage/school_icon.svg';
import Social from '@/public/JobSeeker/seekerPublicPage/projects-icon.svg';
import ExpIcon from '@/public/JobSeeker/seekerPublicPage/edu_icon.svg';
import achievementIcon from '@/public/JobSeeker/seekerPublicPage/achievementIcon.png';
import educationIcon from '@/public/JobSeeker/seekerPublicPage/educationIcon.png';
import smallCircle from '@/public/JobSeeker/seekerPublicPage/smallCircle.svg';
import fileDownloadIcon from '@/public/JobSeeker/seekerPublicPage/fileDownloadIcon.svg';
import fileLinkIcon from '@/public/JobSeeker/seekerPublicPage/fileLinkIcon.svg';
import LinkBtn from '@/public/JobSeeker/seekerPublicPage/link_btn.svg';
import linkdin from '@/public/linkedinImage.webp';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { publicAxios } from '@/config/axiosInstance';
import ClipLoader from 'react-spinners/ClipLoader';
import ProfileImage from '../../_components/Profile/ProfileImage/ProfileImage';
import showBottomMessage from '@/Utils/showBottomMessage';
import viewDocumentInNewTab from '@/Utils/viewDocument';
import sendGAEvent from '@/Utils/gaEvents';
import downloadDocument from '@/Utils/downloadDocument';
import Image from 'next/image';

// Import skill socialsLogo
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
// Add more logo imports as needed

function SeekerPublicPage() {
  const params = useParams();
  const router = useRouter();
  const { username } = params;

  // Placeholder data (you will replace this with actual data from your backend)
  const line = '';

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  const buttonStyle = {
    backgroundColor: isClicked ? '#F68A14' : '#0057B',
  };

  function scrollToSection(e) {
    e.preventDefault();
    // get the target element to scroll into view
    const targetId = e.target.dataset.sectionId;
    const targetElement = document.getElementById(targetId);

    // get top attribute of the body element and target element
    const bodyRect = document.body.getBoundingClientRect().top;
    const targetEleRect = targetElement.getBoundingClientRect().top;
    const headerOffset = 150;

    // calculate the current position to bring the view into the screen
    const scrollPos = targetEleRect - bodyRect - headerOffset;

    window.scrollTo({
      top: scrollPos,
      behaviour: 'smooth',
    });
  }

  function getLinkIcon(url) {
    if (!url || url.length == 0) return null;

    const { hostname } = new URL(url);

    let linkIcon = LinkBtn;

    if (hostname.includes('linkedin')) {
      linkIcon = linkdin;
    } else if (hostname.includes('twitter')) {
      linkIcon = twitterLogo;
    } else if (hostname.includes('github')) {
      linkIcon = githubLogo;
    } else if (hostname.includes('dev.to')) {
      linkIcon = devLogo;
    } else if (hostname.includes('instagram')) {
      linkIcon = instagramLogo;
    } else if (hostname.includes('facebook')) {
      linkIcon = facebookLogo;
    } else if (hostname.includes('medium')) {
      linkIcon = mediumLogo;
    } else if (hostname.includes('figma')) {
      linkIcon = figmaLogo;
    } else if (hostname.includes('substack')) {
      linkIcon = substackLogo;
    } else if (hostname.includes('tiktok')) {
      linkIcon = tiktokLogo;
    } else if (hostname.includes('twitch')) {
      linkIcon = twitchLogo;
    } else if (hostname.includes('youtube')) {
      linkIcon = youtubeLogo;
    } else if (hostname.includes('behance')) {
      linkIcon = behanceLogo;
    } else if (hostname.includes('dribbble')) {
      linkIcon = dribbleLogo;
    } else if (hostname.includes('crunchbase')) {
      linkIcon = crunchbaseLogo;
    } else if (hostname.includes('hashnode')) {
      linkIcon = hashnodeLogo;
    }

    return linkIcon;
  }

  const [userData, setUserData] = useState(null);
  const [about, setAbout] = useState('');
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [socials, setSocials] = useState([]);
  const [education, setEducation] = useState([]);
  const [showLoader, setShowLoader] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [projects, setProjects] = useState([]);

  // function to fetch `user` information
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

  // function to fetch information about user's profile
  const getProfileDetails = async () => {
    setShowLoader(true);
    try {
      const res = await publicAxios.get(`/profile/profile-info/${username}`);

      if (res.status === 200) {
        const data = res.data.data;
        console.log(data.socials);
        setShowLoader(false);
        setAbout(data.about);
        setExperience(data.experience);
        setSkills(data.skills);
        setSocials(data.socials);
        setEducation(data.education);
        setAchievements(data.achievements);
        setProjects(data.projects);
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

  /* A simple function to reduce the character length in a paragraph 
    and implement show more/show less feature.
  */
  function toggleDescription(e) {
    // get the closest paragraph
    const revealBtn = e.target;
    const closestParagraph = revealBtn.previousSibling;
    closestParagraph.classList.toggle('seekerPageHideText');

    // change the text inside the button based on it's status
    const oldStatus = revealBtn.dataset.status;

    if (oldStatus === 'hide') {
      /* if the section was previously hidden, it will be revealed
          and hence change the text and the status */
      revealBtn.innerText = 'Show less';
      revealBtn.dataset.status = 'reveal';
    } else {
      revealBtn.innerText = 'Show more';
      revealBtn.dataset.status = 'hide';
    }
  }

  // Function to send custom event to google analytics
  function sendViewFileEvent(file, eventName) {
    // send the event to google analytics
    sendGAEvent(eventName);

    // view the document
    viewDocumentInNewTab(file);
  }

  // function to download a resume
  async function downloadResume() {
    showBottomMessage(`Downloading resume...`, 10000);

    const fileName =
      (userData?.firstName || '') +
      '_' +
      (userData?.lastName || '') +
      '_resume.pdf';

    try {
      await downloadDocument(userData.resume, fileName);
      showBottomMessage(`Successfully downloaded resume`);
      //It will refresh the page when resume is deleted successfully
      window.location.reload();
    } catch (error) {
      showBottomMessage(`Couldn't download resume`);
    }
  }

  useEffect(() => {
    getUserViaUsername().then(() => getProfileDetails());
  }, []);

  return (
    <>
      {showLoader ? (
        <div className="clipLoaderClass">
          <ClipLoader size={30} />
        </div>
      ) : (
        <div className="content_external">
          <div className="my-external-page">
            <div className="profile-picture">
              <ProfileImage isLoggedInUser={false} otherUser={userData} />
            </div>
            <div className="content_passing">
              <h3>
                {userData.firstName} {userData.lastName}
              </h3>
              {experience &&
                experience.map((ele, id) => {
                  return id !== 0 ? null : (
                    <div className="currentComapanyAndCurrentJob" key={id}>
                      <p>{ele.companyName}</p>
                      <p>{ele.jobTitle}</p>
                    </div>
                  );
                })}
            </div>
                
            {userData.resume && (
              <div className="button_icon_content">
                <button
                  className="button-with-icon"
                  style={buttonStyle}
                  onClick={() =>
                    sendViewFileEvent(userData.resume, 'view_resume')
                  }
                >
                  View Resume
                </button>
                <Image
                  onClick={downloadResume}
                  src={iconSrc}
                  alt="download resume"
                  className="button-icon"
                />
              </div>
            )}

            <div className="icon-column">
              <button
                className="icon-container"
                data-section-id="about"
                onClick={scrollToSection}
              >
                <Image
                  src={AboutIcon}
                  alt="Scroll to about section"
                  className="icon"
                />
              </button>

              <button
                className="icon-container"
                data-section-id="experience"
                onClick={scrollToSection}
              >
                <Image
                  src={ExpIcon}
                  alt="Scroll to experience section"
                  className="icon"
                />
              </button>

              <button
                className="icon-container"
                data-section-id="education"
                onClick={scrollToSection}
              >
                <Image
                  src={educationIcon}
                  alt="Scroll to education section"
                  className="icon"
                />
              </button>

              <button
                className="icon-container"
                data-section-id="skills"
                onClick={scrollToSection}
              >
                <Image
                  style={{ height: '45px', width: '45px' }}
                  src={SkillsIcon}
                  alt="Scroll to skills section"
                  className="icon"
                />
              </button>

              <button
                className="icon-container"
                data-section-id="achievements"
                onClick={scrollToSection}
              >
                <Image
                  style={{
                    height: '45px',
                    width: '45px',
                    marginTop: '3px',
                    marginBottom: '3px',
                  }}
                  src={achievementIcon}
                  alt="Scroll to achievement section"
                  className="icon"
                />
              </button>

              <button
                className="icon-container"
                data-section-id="projects"
                onClick={scrollToSection}
              >
                <Image
                  style={{
                    height: '45px',
                    width: '45px',
                    marginTop: '3px',
                    marginBottom: '3px',
                  }}
                  src={Projects}
                  alt="Scroll to project section"
                  className="icon"
                />
              </button>

              <button
                className="icon-container"
                onClick={scrollToSection}
                data-section-id="social"
              >
                <Image
                  style={{
                    height: '45px',
                    width: '45px',
                    marginTop: '3px',
                    marginBottom: '3px',
                  }}
                  src={Social}
                  alt="Scroll to social links section"
                  className="icon"
                />
              </button>
            </div>
          </div>
          <div className="about_info_section" id="about">
            <h3 className="about_external_tab">
              About
              {userData.resume !== null && (
                <div className="button_icon_content_tab">
                  <button
                    className="button-with-icon_tab"
                    style={buttonStyle}
                    onClick={() =>
                      sendViewFileEvent(userData.resume, 'view_resume')
                    }
                  >
                    View Resume
                  </button>
                  <Image
                    onClick={downloadResume}
                    src={iconSrc}
                    alt="Icon"
                    className="button-icon"
                  />
                </div>
              )}
            </h3>

            {/* Initially the paragraph will be truncated to 250 characters */}
            {about?.bio?.length > 250 ? (
              <pre className="seekerPageHideText">{about?.bio || ''}</pre>
            ) : (
              <pre>{about?.bio || ''}</pre>
            )}

            {/* Display this only if the paragraph has more than 250 characters */}
            {about?.bio?.length > 250 && (
              <button
                className="seekerPageTruncateBtn"
                data-status="hide"
                onClick={toggleDescription}
              >
                Show more
              </button>
            )}

            <div className="experience_info_section" id="experience">
              <h3 className="about_experience">Experience</h3>
              <h6>
                Total work experience : &nbsp;
                {calcTotalExperience().countYear === 0
                  ? null
                  : calcTotalExperience().countYear + 'y'}
                &nbsp;
                {calcTotalExperience().countMonth}mos{' '}
              </h6>

              {experience &&
                experience.map((ele, idx) => {
                  return (
                    <div key={idx}>
                      <h2>{ele.jobTitle}</h2>
                      <p style={{ marginTop: '3px' }}>
                        {' '}
                        {ele.companyName} - {ele.employmentType}
                      </p>
                      <p>
                        {ele.startMonth}&nbsp;
                        {ele.startYear} -&nbsp;
                        {!ele.endMonth ? 'Present' : ele.endMonth}&nbsp;
                        {ele.endYear ? ele.endYear + ' ' : null}|{' '}
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
                      </p>
                      <div className="line_container">
                        <span className="line_containers"> {line}</span>

                        {ele?.description?.length > 250 ? (
                          <p className="seekerPageHideText">
                            {ele?.description || ''}
                          </p>
                        ) : (
                          <p>{ele?.description || ''}</p>
                        )}

                        {ele?.description?.length > 250 && (
                          <button
                            className="seekerPageTruncateBtn"
                            data-status="hide"
                            onClick={toggleDescription}
                          >
                            Show more
                          </button>
                        )}
                      </div>
                      <br />
                    </div>
                  );
                })}

              <div className="experience_info_section" id="education">
                <h3 className="about_external_Education">Education</h3>
                {education &&
                  education.map((ele, idx) => {
                    return (
                      <div key={idx}>
                        <h2>{ele.school}</h2>
                        <p>{ele.fieldOfStudy}</p>
                        <p>
                          {ele.startYear} - {ele.endYear}
                        </p>

                        {ele?.description?.length > 250 ? (
                          <p className="seekerPageHideText">
                            {ele?.description || ''}
                          </p>
                        ) : (
                          <p>{ele?.description || ''}</p>
                        )}

                        {ele?.description?.length > 250 && (
                          <button
                            className="seekerPageTruncateBtn"
                            data-status="hide"
                            onClick={toggleDescription}
                          >
                            Show more
                          </button>
                        )}

                        <br />
                      </div>
                    );
                  })}
              </div>

              <div className="experience_info_section" id="skills">
                <h3 className="about_external_Skills">Skills</h3>
                <div className="btn-wrapper">
                  {skills &&
                    skills.map((ele, idx) => {
                      return (
                        <button key={idx} className="skills_button">
                          {ele}
                        </button>
                      );
                    })}
                </div>
              </div>

              <div className="experience_info_section" id="achievements">
                <h3 className="about_external_Achivement">Achievements</h3>
                {achievements &&
                  achievements.map((ele, idx) => {
                    return (
                      <div key={idx}>
                        <div
                          className={`achievementsHeading ${!ele.link && !ele.document ? 'achievementsParaStyle addMarginBottomInPara' : ''}`}
                        >
                          <h2>{ele.heading}</h2>

                          {ele.document && (
                            <button
                              onClick={() =>
                                sendViewFileEvent(
                                  ele.document.key,
                                  'view_document'
                                )
                              }
                              className="achievementsButtonFileIcon"
                            >
                              <Image src={fileLinkIcon} alt="view document" />
                            </button>
                          )}

                          {ele.link && (
                            <Link
                              href={ele.link}
                              target="_blank"
                              className="achievementsButtonLinkIcon"
                            >
                              <Image
                                src={fileDownloadIcon}
                                alt="download document"
                              />
                            </Link>
                          )}
                        </div>

                        {ele?.description?.length > 250 ? (
                          <p className="seekerPageHideText">
                            {ele?.description || ''}
                          </p>
                        ) : (
                          <p>{ele?.description || ''}</p>
                        )}

                        {ele?.description?.length > 250 && (
                          <button
                            className="seekerPageTruncateBtn"
                            data-status="hide"
                            onClick={toggleDescription}
                          >
                            Show more
                          </button>
                        )}

                        <br />
                      </div>
                    );
                  })}
              </div>
              <br />
              <br />
              <div className="experience_info_section" id="projects">
                <h3 className="about_external_Projects">Projects</h3>
                {projects &&
                  projects.map((ele, idx) => {
                    return (
                      <div key={idx}>
                        <div
                          className={`achievementsHeading ${!ele.link && !ele.document ? 'addMarginBottomInParaAchievements' : ''}`}
                        >
                          <h2>{ele.heading}</h2>
                          {ele.document && (
                            <button
                              onClick={() =>
                                sendViewFileEvent(
                                  ele.document.key,
                                  'view_document'
                                )
                              }
                              className="achievementsButtonFileIcon"
                            >
                              <Image src={fileLinkIcon} alt="view document" />
                            </button>
                          )}
                          {ele.link && (
                            <Link
                              href={ele.link}
                              target="_blank"
                              className="achievementsButtonLinkIcon"
                            >
                              <Image src={fileDownloadIcon} alt="open link" />
                            </Link>
                          )}
                        </div>

                        {ele?.description?.length > 250 ? (
                          <p className="seekerPageHideText">
                            {ele?.description || ''}
                          </p>
                        ) : (
                          <p>{ele?.description || ''}</p>
                        )}

                        {ele?.description?.length > 250 && (
                          <button
                            className="seekerPageTruncateBtn"
                            data-status="hide"
                            onClick={toggleDescription}
                          >
                            Show more
                          </button>
                        )}

                        <div className="skillsUsed">
                          <p>Skills Used: </p>
                          {ele.skills.map((ele1, idx1) => {
                            return (
                              <div className="actualSkills" key={idx1}>
                                <span key={idx1}>{ele1}</span>
                                {idx1 === ele.skills.length - 1 ? null : (
                                  <Image src={smallCircle} alt="logo" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <br />
                      </div>
                    );
                  })}
              </div>
              <br />
              <br />
              <div className="seeker_info_all_socials" id="social">
                <h3 className="seeker_Social">Social</h3>
                {socials &&
                  socials.map((social, index) => {
                    return (
                      <div key={index} className="seeker_info_Social">
                        <Link href={social} target="_blank">
                          <Image src={getLinkIcon(social)} alt="social links" />
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SeekerPublicPage;
