'use client';
/*
  File: DashboardContext.js
  Description: This file contains the state for userInfo that is displayed
  in the profile page. Utilising react's context API this
  state is accessible in all the components in dashboard.
*/

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import usePrivateAxios from '../../Utils/usePrivateAxios';
import { UserContext } from '../User/UserContext';

export const DashboardContext = createContext(null);

const DashboardContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const privateAxios = usePrivateAxios();
  const { userState } = useContext(UserContext);
  const [user] = userState;

  // function to fetch data required for user profile
  const fetchProfileData = useCallback(async () => {
    // fetch the user profile info from the API

    try {
      const res = await privateAxios.get('/profile/user-info');

      const { data } = res.data;
      setUserInfo(data.userInfo);
      sessionStorage.setItem(
        `userInfo:${user._id}`,
        JSON.stringify(data.userInfo)
      );
    } catch (error) {
      // console.log(error);
    }
  }, [privateAxios, user?._id]);

  useEffect(() => {
    if (!user?._id) {
      setUserInfo(null);
      return;
    }

    const currUserInfo = JSON.parse(
      sessionStorage.getItem(`userInfo:${user._id}`)
    );
    if (!currUserInfo) {
      fetchProfileData();
    } else {
      setUserInfo(currUserInfo);
    }
  }, [fetchProfileData, user?._id]);

  useEffect(() => {
    if (user?._id && userInfo) {
      sessionStorage.setItem(`userInfo:${user._id}`, JSON.stringify(userInfo));
    }
  }, [user?._id, userInfo]);

  return (
    <DashboardContext.Provider value={[userInfo, setUserInfo]}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContextProvider;
