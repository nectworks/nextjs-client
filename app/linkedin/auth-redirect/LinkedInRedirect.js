'use client';

/*
  File: LinkedInRedirect.js
  Description: This is an intermediary page that acts as redirection page after
  linkedin signup
*/

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import './SignUpRedirect.css';
import { privateAxios } from '@/config/axiosInstance';
import ClipLoader from 'react-spinners/ClipLoader';

function SignUpRedirect() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [authenticationError, setAuthenticationError] = useState(false);

  async function sendCode(authCode) {
    setIsLoading(true);
    setMessage('Authenticating user...');

    try {
      const url = `/linkedin/auth/callback?code=${authCode}`;
      const res = await privateAxios.get(url);

      // if user is successfully signed up redirect them to profile page
      const { signUp } = res.data;

      if (res.status === 200) {
        setMessage('Successfully authenticated.');
        if (signUp === true) {
          router.push('/profile', {
            state: {
              from: '/sign-up',
            },
            replace: true,
          });
        } else {
          router.push('/profile');
        }
      }
    } catch (error) {
      setAuthenticationError(true);
      setMessage('Error while authenticating user.');
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
    <div className="signup_redirection_container">
      {/* display a loader for network requests */}
      {isLoading && <ClipLoader size={50} />}

      {/* display message for the user about the process */}
      {message.length > 0 && (
        <div className="signup_redirection_message">{message}</div>
      )}

      {/* if there was any error authenticating user, display
        login button and home button */}
      {authenticationError && (
        <div className="signup_redirection_links">
          <Link href={'/'}>
            <button>Home</button>
          </Link>
          <Link href={'/log-in'}>
            <button>Login</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default SignUpRedirect;
