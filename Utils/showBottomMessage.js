'use client';

/*
   File: showBottomMessage.js
   Description: This file contains a single function to display the
   message near the bottom of the screen.
*/

/* When the previous message has not been completely displayed, but new
  message occurs, the time out is not reset and continues
  for only remaining time */
let prevTimeOut = null;

// display a small message near the bottom of the screen
function showBottomMessage(message, time = 8000) {
  // clear all the previous timeouts before starting new one
  if (prevTimeOut) {
    clearTimeout(prevTimeOut);
  }

  // display a message when the user mode is changed
  const infoBox = document.getElementById('info-box');
  
  // Reset any existing animations
  infoBox.classList.remove('slide-down');
  
  // Set content and ensure the color is correct
  infoBox.textContent = message;
  infoBox.style.backgroundColor = '#0057b1';
  infoBox.style.color = 'white';
  
  // Make sure the box is centered horizontally
  infoBox.style.left = '50%';
  infoBox.style.transform = 'translateX(-50%)';
  
  // Set text alignment to center
  infoBox.style.textAlign = 'center';
  
  // Make sure the box has appropriate padding and width
  infoBox.style.padding = '10px 20px';
  infoBox.style.maxWidth = '80%';
  infoBox.style.width = 'auto';
  
  // Display the message
  infoBox.style.display = 'block';
  
  // Trigger the fade-in effect with a small delay to ensure styles are applied
  setTimeout(function () {
    infoBox.style.opacity = '1';
  }, 10);

  const currentTimeOut = setTimeout(function () {
    // Apply slide-down animation class
    infoBox.classList.add('slide-down');

    // Trigger the fade-out effect
    setTimeout(function () {
      infoBox.style.opacity = '0';
      
      // Give the opacity transition time to finish before hiding
      setTimeout(function() {
        infoBox.style.display = 'none';
        infoBox.classList.remove('slide-down');
      }, 300);
    }, 500);
  }, time);

  prevTimeOut = currentTimeOut;
}

export default showBottomMessage;