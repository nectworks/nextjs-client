'use client';

/*
  File: GoogleRedirect.js
  Description: This is an intermediary page that acts as redirection page after
  google signup
*/

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import '../../linkedin/auth-redirect/SignUpRedirect.css';
import { privateAxios } from '@/config/axiosInstance';
import ClipLoader from 'react-spinners/ClipLoader';

function SignUpRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [authenticationError, setAuthenticationError] = useState(false);

  async function sendCode(authCode) {
    setIsLoading(true);
    setMessage('Authenticating user...');
    try {
      const url = `/google/auth/callback?code=${authCode}`;
      const res = await privateAxios.get(url);
      const { signUp } = res.data;

      if (res.status === 200) {
        setMessage('Successfully authenticated.');
        if (signUp) {
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
    const codeParam = searchParams.get('code');
    if (!codeParam) {
      router.push('/profile');
    } else {
      sendCode(codeParam);
    }
  }, [searchParams]);

  return (
    <div className="signup_redirection_container">
      {isLoading && <ClipLoader size={50} />}
      {message && <div className="signup_redirection_message">{message}</div>}
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
