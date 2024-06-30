'use client';
/*
  File: DashboardContext.js
  Description: This file contains the state for userInfo that is displayed
  in the profile page. Utilising react's context API this
  state is accessible in all the components in dashboard.
*/

import { createContext, useEffect, useState } from 'react';
import usePrivateAxios from '../../Utils/usePrivateAxios';

export const DashboardContext = createContext(null);

const DashboardContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const privateAxios = usePrivateAxios();

  // function to fetch data required for user profile
  const fetchProfileData = async () => {
    // fetch the user profile info from the API

    try {
      const res = await privateAxios.get('/profile/user-info');

      const { data } = res.data;
      setUserInfo(data.userInfo);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    /* fetch the data only if it is not saved in sessionStorage
    on the first render */
    const currUserInfo = JSON.parse(sessionStorage.getItem('userInfo'));
    if (!currUserInfo) {
      fetchProfileData();
    } else {
      setUserInfo(currUserInfo);
    }
  }, []);

  useEffect(() => {
    // update the sessionStorage each time state is updated.
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  return (
    <DashboardContext.Provider value={[userInfo, setUserInfo]}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardContextProvider;
