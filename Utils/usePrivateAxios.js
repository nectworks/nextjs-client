'use client';

/*
  File: usePrivateAxios.js
  Description: This contains a custom hook that mounts and unmounts the
    interceptor to the axios request and refreshes access token if
    it has expired.
*/

import { useContext, useEffect } from 'react';
import { privateAxios } from '../config/axiosInstance.js';
import { useRouter } from 'next/navigation';
import { UserContext } from '../context/User/UserContext';

const usePrivateAxios = () => {
  const router = useRouter();
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  // The privateAxios instance already has interceptors configured
  // so we just return it directly
  return privateAxios;
};

export default usePrivateAxios;
