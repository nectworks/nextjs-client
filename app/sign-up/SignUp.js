'use client';
/*
  FileName - SignUp.js
  Desc - This file defines a React component (MainForm) responsible for rendering either a sign-in page or a sign-up form based on the width of the browser window. The component dynamically adapts its content based on the screen size to provide a responsive user experience.
*/

import { useState, useEffect } from 'react';
import SignUpDesktop from './SignUpDesktop';
import SignUpMobile from './SignUpMobile';

const SignUp = () => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <div>{innerWidth > 950 ? <SignUpDesktop /> : <SignUpMobile />}</div>
    </>
  );
};

export default SignUp;
