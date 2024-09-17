'use client';

/*
  File: GoogleRedirect.js
  Description: This is an intermediary page that acts as redirection page after
  google signup
*/

import { useContext, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import '../../linkedin/auth-redirect/SignUpRedirect.css';
import { privateAxios } from '@/config/axiosInstance';
import ClipLoader from 'react-spinners/ClipLoader';
import { UserContext } from '@/context/User/UserContext';

function SignUpRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [authenticationError, setAuthenticationError] = useState(false);

  // Use a ref to prevent the call from being made twice
  const hasRequested = useRef(false);

  async function sendCode(authCode) {
    setIsLoading(true);
    setMessage('Authenticating user...');
    try {
      const url = `/google/auth/callback?code=${authCode}`;
      const res = await privateAxios.get(url);
      const { signUp } = res.data;
      setUser(res.data.user);

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
      console.error('Authentication error:', error);
      setAuthenticationError(true);
      setMessage('Error while authenticating user.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const codeParam = searchParams.get('code');

    // Ensure the code exists and the request hasn't already been made
    if (codeParam && !hasRequested.current) {
      hasRequested.current = true; // Mark that the request has been made
      sendCode(codeParam);
    } else if (!codeParam) {
      router.push('/profile');
    }
  }, [searchParams, router]);

  return (
    <div className="signup_redirection_container">
      {isLoading && <ClipLoader size={50} />}
      {message.length > 0 && (
        <div className="signup_redirection_message">{message}</div>
      )}
      {authenticationError && (
        <div className="signup_redirection_links">
          <Link href="/">
            <button>Home</button>
          </Link>
          <Link href="/log-in">
            <button>Login</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default SignUpRedirect;
