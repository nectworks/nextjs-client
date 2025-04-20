'use client';
/*
  FileName - ProgressBar.js
  Desc - This component renders a progress bar with a logo,
  incrementing its progress until reaching 100% while the rest
  of the page is getting loaded.
*/

import './ProgressBar.css';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '@/public/nectworks-ssar04a-mil-11@2x.webp';
const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  // In this case, it sets up an interval that updates the 'progress' state
  useEffect(() => {
    const interval = setInterval(() => {
      // Updates the 'progress' state using the function form of setState
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1;
        } else {
          // If 'progress' reaches 100, clear the interval to stop the animation
          clearInterval(interval);
          return 100;
        }
      });
    }, 8);

    // Cleanup function returned by useEffect, which clears the interval
    // to prevent memory leaks when the component unmounts or re-renders.
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this effect runs only once.

  return (
    <div className="progress-container">
      <Image src={Logo} alt="Nectworks" className="ProgressBarLogo" />
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default ProgressBar;
