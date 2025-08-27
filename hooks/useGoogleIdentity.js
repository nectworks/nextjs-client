'use client';

// hooks/useGoogleIdentity.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from '@/context/User/UserContext';
import { publicAxios } from '@/config/axiosInstance';
import showBottomMessage from '@/Utils/showBottomMessage';

const useGoogleIdentity = () => {
  const router = useRouter();
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  useEffect(() => {
    if (!user) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_ONE_TAP_CLIENT,
        callback: async (response) => {
          try {
            const res = await publicAxios.post(`/google/one-tap/register`, {
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
