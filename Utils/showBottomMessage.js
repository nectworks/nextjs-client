/*
   File: displayMessage.js
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
  infoBox.textContent = message;

  infoBox.style.display = 'block';
  // Trigger the fade-in effect
  setTimeout(function() {
    infoBox.style.opacity = '1';
  }, 10);

  const currentTimeOut = setTimeout(function() {
    infoBox.classList.add('slide-down'); // Apply slide-down animation class

    // Trigger the fade-out effect
    setTimeout(function() {
      infoBox.style.opacity = '0';
      infoBox.style.display = 'none';
      infoBox.classList.remove('slide-down'); // Remove animation class
    }, 500); // Hide after the slide-down animation (500 milliseconds)
  }, time); // Show for specified seconds (default 5000 milliseconds)

  prevTimeOut = currentTimeOut;
}

export default showBottomMessage;
