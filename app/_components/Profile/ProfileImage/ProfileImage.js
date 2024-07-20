'use client';
/*
  File: ProfileImage.js
  Description: This component returns the profile image if user has uploaded
  profile image, else it will display the user initials with a random bg color.
*/

import { useContext, useEffect, useState } from 'react';
import './ProfileImage.css';
import Image from 'next/image';
import { UserContext } from '@/context/User/UserContext';

// function to get user profile image
function ProfileImage({ otherUser, isLoggedInUser }) {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [initials, setInitials] = useState('');

  /* if the user doesn't have a profile image, display their
     initials as profile image

     (1). Displaying profile image is through 'img' tag
     (2). Displaying initials is through 'div' tag

     Where this component is reused, the edge case of initials in
     'div' tag should be handled properly.
    */
  const colors = [
    '#1abc9c',
    '#2ecc71',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#16a085',
    '#27ae60',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#95a5a6',
    '#f39c12',
    '#d35400',
    '#c0392b',
    '#bdc3c7',
    '#7f8c8d',
  ];

  useEffect(() => {
    const a = isLoggedInUser ? user : otherUser;
    console.log(`This is userState :${JSON.stringify(userState)}`);
    console.log(`This is user :${JSON.stringify(user)}`);
    console.log(`this user is: ${JSON.stringify(a)}`);
    const firstInitial = a?.firstName?.[0] || '-';
    const secondInitial = a?.lastName?.[0] || '-';
    setInitials(firstInitial.toUpperCase() + secondInitial.toUpperCase());
  }, [isLoggedInUser, otherUser, user, userState]);

  // calculate random index within 0 to colors.length
  const randomIdx = Math.floor(Math.random() * colors.length);

  // get random color
  let currBgColor = colors[randomIdx];

  const savedBgColor = sessionStorage.getItem('profileBgColor');
  if (!savedBgColor) {
    sessionStorage.setItem('profileBgColor', currBgColor);
  } else {
    currBgColor = savedBgColor;
  }

  const style = {
    backgroundColor: currBgColor,
  };

  // if user has already uploaded a profile, display it.
  if (isLoggedInUser == true && user?.profile) {
    return (
      <Image
        className="profile_image"
        src={user?.profile}
        alt={`${user?.firstName || ''} Nectworks`}
        width={50}
        height={50}
      />
    );
  } else if (isLoggedInUser == false && otherUser?.profile) {
    return (
      <Image
        className="profile_image"
        src={otherUser?.profile}
        width={200}
        height={200}
        alt={`${otherUser?.firstName || ''} Nectworks`}
      />
    );
  }

  return (
    <div data-initials={true} style={style} className="profile_image">
      {initials}
    </div>
  );
}

export default ProfileImage;
