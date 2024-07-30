'use client';
/*
  File: SignUpConfirmPopup.js
  Description: This component contains the popup that will be showed
  once on successful user registration
*/

import './SignUpConfirmPopup.css';
import popUpIllustration from '@/public/SignUpConfirmPopup/signUpConfirmation.webp';
import Image from 'next/image';
import crossIcon from '@/public/SignUpConfirmPopup/crossIcon.svg';
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '@/context/User/UserContext';

function SignUpConfirmPopup({ closePopUp }) {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  return (
    <div className="signup_confirm_container">
      <div className="signup_confirm_window">
        <div className="signup_confirm_illustration">
          <Image src={popUpIllustration} alt="successful signup confirmation" />
        </div>

        <Image
          onClick={closePopUp}
          className="signup_confirm_cross_icon"
          src={crossIcon}
          alt="close singup confirmation window"
        />

        <div className="signup_confirm_text">
          <h2 className="signup_confirm_text_highlight">
            Hi {user?.firstName.slice(0, 10) + '...' || ''}!
          </h2>
          <h4>You have successfully signed up!</h4>
          <p>
            In just a few steps you can start reaching out to multiple referrers
            or refer potential candidates to your company.
          </p>

          <div className="signup_confirm_pointer">
            <span className="signup_confirm_pointer_number number_one">1</span>

            <span>
              Set up your profile as a
              <span className="signup_confirm_text_highlight">
                &nbsp;job referrer
              </span>{' '}
              or
              <span className="signup_confirm_text_highlight">
                {' '}
                a job seeker.
              </span>
            </span>
          </div>

          <div className="signup_confirm_pointer">
            <span className="signup_confirm_pointer_number number_two">2</span>
            <span>
              <span className="signup_confirm_text_highlight">
                Verify your account in account-settings page!&nbsp;
              </span>
              You will not be able to receive referral requests till then.
            </span>
          </div>

          <div className="signup_confirm_pointer">
            <span className="signup_confirm_pointer_number number_three">
              3
            </span>
            <span>
              Screen through potential candidates through your dashboard.
            </span>
          </div>

          <Link href="/account-settings">
            <button onClick={closePopUp}>Start Exploring</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUpConfirmPopup;
