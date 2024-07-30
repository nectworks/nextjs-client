'use client';

/*
    FileName - AccountDeletionConfirmation.js
    Desc - This file is a React component that renders a confirmation message for account deletion. The message includes a link to the Nectworks logo, a message thanking the user for being a part of the community, and a button to provide feedback. The user can also click on the "Home" button to return to the homepage.
*/

import './AccountDeletionConfirmation.css';
import nectworksLogo from '@/public/AccountSettings/nectworksLogo.webp';
import Link from 'next/link';
import Image from 'next/image';

const AccountDeletionConfirmation = () => {
  return (
    <>
      <div className="accountDeletionMessageContainer">
        <div className="accountDeletionMessageContent">
          <div className="accountDeletionMessage">
            <Image src={nectworksLogo} alt="Nectworks logo" />
            <p>
              We&apos;re sad to see you leave. If there&apos;s anything we could
              have done better to make your experience more enjoyable, we&apos;d
              love to hear your feedback.
            </p>
            <p>
              Your thoughts matter to us, and we&apos;re constantly striving to
              improve.{' '}
            </p>
            <p>
              Thank you for being a part of our community, and we hope to
              welcome you back in the future. Until then, take care and have a
              fantastic journey ahead!
            </p>
            <p>~ Team Nectworks</p>
            <div className="accountDeletionMessageButtons">
              <Link href="/">
                <button>Home</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountDeletionConfirmation;
