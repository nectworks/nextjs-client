'use client';

/*
  File: GoogleRedirect.js
  Description: This is an intermediary page that acts as redirection page after
  google signup
*/

import { useContext, useEffect, useState } from 'react';
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
    if (!codeParam) {
      router.push('/profile');
    } else {
      sendCode(codeParam);
    }
  }, []);

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
