/* eslint-disable @next/next/no-img-element */
'use client';
/*
  FileName - Home.js
  Desc - This file defines the main content of a web page using React
  components. It includes introductory text, an input field for a username,
  and various images to create an appealing layout. It also renders the BodyMain
  component for additional content and an Accordion component for displaying
  collapsible questions and answers.
*/
import illustration from '@/public/Illustration.webp';
import cloudImage1 from '@/public/heroSectionCloud1.png';
import cloudImage2 from '@/public/heroSectionCloud2.png';
import boyImage from '@/public/heroSectionHeroImg.webp';
import studyImage from '@/public/Frame.webp';
import isolationImage from '@/public/Isolation_Mode.webp';
import './Home.css';
import HomeMain from './HomeMain';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import Accordion from '../../_components/Accordian/Accordion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import arrowImg from '@/public/arrow_img.svg';
import scrollToTop from '@/Utils/scrollToTop';
import { UserContext } from '@/context/User/UserContext';
import showBottomMessage from '@/Utils/showBottomMessage';
import { privateAxios } from '@/config/axiosInstance.js';

export default function Home() {
    const { userState } = useContext(UserContext);
    const [user, setUser] = userState;
    const [username, setUsername] = useState('');
    const router = useRouter();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        stopBlinking();
    };

    localStorage.setItem('singupval', username);
    // The blinkingCursor to stop on click functionality
    const stopBlinking = () => {
        const blinkingCursor = document.querySelector('.blinking-cursor');
        blinkingCursor.style.animation = 'none'; // Stop the blinking animation
    };

    useEffect(() => {
        const inputName = document.querySelector('.input__name');
        // set 'enter' key listener for the input element
        inputName.addEventListener('keyup', (e) => {
            /* if the user types a name and presses 'enter',
                        redirect them to signup page */
            if (e.keyCode === 13) {
                router.push('/sign-up');
                return;
            }
        });
    }, []);

      const navigate = useRouter();

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
          navigate.push('/profile', {
            state: {
              from: '/sign-up',
            },
            replace: true,
          });
        } else {
          navigate.push('/profile');
        }
      }
    } catch (error) {
        console.log(error);
      showBottomMessage('Error while signing up:');
    }
  }

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
  }, [user]);

    return (
        <main className="body__component">
            {/* splitting the top component into two divisions  */}
            <div className="outer__layer__body__header">
                <div className="body__header body__container">
                    {/* keeping the image and text as one unit */}
                    <img
                        className="cloudImage1"
                        src={cloudImage1.src}
                        alt="cloud image"
                        loading="lazy"
                    />
                    <img
                        className="cloudImage2"
                        src={cloudImage2.src}
                        alt="cloud image"
                        loading="lazy"
                    />
                    <div className="body__header__inner body__components">
                        <div className="header__paragraph">
                            {/* keeping the text as one unit */}
                            <p className="company_moto main__paragraph">
                                The Future of Hiring and Job Referrals is
                                <span className="color_change"> Here</span>
                            </p>
                            <p className="body_secondary_para color-black">
                                Find your <span className="color_change">dream job</span>, or
                                become a top referrer. Connect with ease, ditch the cold
                                messages. Join our hiring revolution!
                            </p>

                            {/* Sign In Link */}
                            <div
                                className="signIn__link"
                                style={{
                                    display: user !== null ? 'none' : '',
                                }}
                            >
                                <span className="input__form">
                                    <span>
                                        nectworks<span className="blinking-cursor">/</span>
                                    </span>
                                    <input
                                        type="text"
                                        className="input__name"
                                        id="inputField"
                                        placeholder="username"
                                        value={username}
                                        onChange={handleUsernameChange}
                                    />
                                </span>

                                {/* Button for user signIn */}
                                <Link href="/sign-up">
                                    <button
                                        className={`landingSignupButton ${!username ? 'nocursor' : ''
                                            }`}
                                        disabled={!username}
                                    >
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        </div>
                        {/* <Image
                            src={boyImage}
                            // width={471}
                            // height={344}
                            // className='boy__img'
                            style={{
                                zIndex: 2,
                                height: "auto",
                                width: "73.5%",
                                marginTop: "1.3rem",
                            }}
                            loading="lazy"
                            alt="not found"
                        /> */}
                        <img
                            src={boyImage.src}
                            className="boy__img"
                            loading="lazy"
                            alt="not found"
                        />
                    </div>
                </div>
            </div>
            <HomeMain />
            <div className="outer__layer__bdy__com">
                <div className="body__container">
                    <div className="info__img">
                        <img
                            src={illustration.src}
                            className="bodyImg illustrationimg"
                            loading="lazy"
                            alt="man working on his laptop"
                        />
                        <div className="paragraph__title">
                            <div>
                                <h2 className="main__paragraph">
                                    Empowering Job Seekers with{' '}
                                    <span className="color_change"> AI Driven Referrers </span>
                                </h2>
                                <p className="body_secondary_para color-black">
                                    By leveraging AI-driven insights and algorithms, you can
                                    uncover hidden opportunities and match them with the right
                                    candidates.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="study__boy info__img">
                        <div className="paragraph__title">
                            <h2 className=" main__paragraph">
                                Refer <span className="color_change">2x faster</span>
                            </h2>
                            <p className="body_secondary_para">
                                Save time reviewing and referring candidates that aren’t
                                qualified or interested. Reduce your time to refer by hours, not
                                days.{' '}
                            </p>
                        </div>
                        <img
                            src={studyImage.src}
                            loading="lazy"
                            className="bodyImg studyImage"
                            alt="Man studying in his laptop productively"
                        />
                    </div>

                    <div className="info__img">
                        <img
                            src={isolationImage.src}
                            className="bodyImg"
                            loading="lazy"
                            alt="People connected through a platform"
                        />
                        <div className="paragraph__title third__para">
                            <h2 className="main__paragraph">
                                Exceptional talent and opportunities,
                                <span className="color_change"> all in one umbrella </span>
                            </h2>

                            <p className="body_secondary_para">
                                Discover exceptional talent and connect with top-notch
                                professionals who go beyond job boards, finding them where they
                                naturally thrive.{' '}
                            </p>
                        </div>
                    </div>

                    <div className="body__awareness__msg">
                        <div className="body__awareness__msg__content">
                            <div className="awareness__msg__block">
                                <h2 className="awareness__header">
                                    Fraudulent recruitment practices
                                </h2>
                                <p className="awareness__message">
                                    When it comes to job search, your email can get spammed with
                                    multiple job alerts. Here’s what you can do to stay safe from
                                    fraudulent practices.
                                </p>
                            </div>
                            <Link href="/fraudulent-activity">
                                <img
                                    src={arrowImg.src}
                                    className="arrowImg"
                                    onClick={scrollToTop}
                                    alt="report fradulent activity"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="qna__header">
                    <h4>
                        <span className="color_change">Quick answers</span> to common
                        questions
                    </h4>
                </div>
            </div>
            <Accordion />
        </main>
    );
}
