'use client';
/*
  File: ProfileContext.js
  Description: This file utilizes context API from react.
  Here, we 'create' and 'provide' our context for updating profile information
  and pass it down to children components.
*/

import { createContext, useReducer } from 'react';

// 'create' the context with default value as 'null'
export const ProfileContext = createContext(null);

// 'provide' the above context with values from useReducer.
const ProfileContextProvider = ({ children, initialState, reducer }) => {
  /*
    utilise the useReducer function and pass it's return value to children
    context provider.
  */
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ProfileContext.Provider value={[state, dispatch]}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContextProvider;
