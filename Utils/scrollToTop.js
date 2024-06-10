'use client'
// Define a function to scroll to the top of the page smoothly when called.
export default function scrollToTop (){
  // Use the 'window.scroll' method to scroll the page.
  // The 'window.scroll' method allows scrolling to a specific position on the page.
  // In this case, we want to scroll to the top of the page, so we set 'top: 0' and 'left: 0'.
  window.scroll({
    top: 0, // Scroll to the top (y-coordinate = 0).
    left: 0, // Scroll to the left edge (x-coordinate = 0).
    behavior: 'smooth', // Use smooth scrolling animation for a nicer user experience.
  });
};

