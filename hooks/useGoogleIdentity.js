'use client';

// hooks/useGoogleIdentity.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '@/contexts/UserContext';
import showBottomMessage from './../app/_components/showBottomMessage';

const useGoogleIdentity = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_CLIENT,
        callback: async (response) => {
          try {
            const res = await axios.post(`/api/google/one-tap/register`, {
              data: response,
            });

            const { signUp, user } = res.data;
            setUser(user);

            if (res.status === 200) {
              showBottomMessage('Successfully authenticated.');
              router.push(signUp ? '/profile' : '/profile');
            }
          } catch (error) {
            showBottomMessage('Error while signing up');
          }
        },
      });

      window.google.accounts.id.prompt();
    }
  }, [user, router, setUser]);
};

export default useGoogleIdentity;
