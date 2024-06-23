'use client';

/*
  File: LinkedInRedirect.js
  Description: This is an intermediary page that acts as redirection page after
  user starts sharing their post on linkedin
*/

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import './SocialRedirect.css';
import usePrivateAxios from '../../../../Utils/usePrivateAxios';
import ClipLoader from 'react-spinners/ClipLoader';

function SignUpRedirect() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useSearchParams();

  const privateAxios = usePrivateAxios();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [sharePostErr, setSharePostErr] = useState(false);

  async function sendCode(authCode) {
    setIsLoading(true);
    setMessage('Sharing post on linkedin...');

    try {
      const url = `/linkedin/share-redirect?code=${authCode}`;
      const res = await privateAxios.get(url);

      // if user is successfully signed up redirect them to profile page
      if (res.status === 200) {
        router.push('/profile?post_shared=success', {
          replace: true,
        });
      } else {
        setMessage('Unknown error occured, while sharing the post');
        setSharePostErr(true);
      }
    } catch (error) {
      setSharePostErr(true);
      setMessage('Error while sharing the post.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // get the query parameters from the
    const codeParam = searchParams.get('code');

    if (!codeParam) {
      router.push('/profile');
    } else {
      sendCode(codeParam);
    }

    setSearchParams({});
  }, []);

  return (
    <div className="social_redirection_container">
      {/* display a loader for network requests */}
      {isLoading && <ClipLoader size={50} />}

      {/* display message for the user about the process */}
      {message.length > 0 && (
        <div className="social_redirection_message">{message}</div>
      )}

      {/* if there was any error authenticating user, display
        login button and home button */}
      {sharePostErr && (
        <div className="social_redirection_links">
          <Link href={'/'}>
            <button>Home</button>
          </Link>
          <Link href={'/profile'}>
            <button>Profile</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default SignUpRedirect;
