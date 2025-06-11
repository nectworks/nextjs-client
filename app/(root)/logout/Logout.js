'use client';

/*
    FileName - Logout.js
    Desc - This JavaScript file defines a React component called Logout.
    The primary purpose of this component is to handle the logout process for a user.
    It includes logic to send a request to a server to log the user out and provides visual feedback during the logout process.

    Enhanced logout component that properly cleans up all auth state,
    including Google One Tap state, to prevent login prompts after logout.
*/
// Import necessary dependencies and styles
import { useContext, useEffect } from 'react';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import { useRouter, useSearchParams } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';
import './Logout.css'; // Import local CSS styles
import { UserContext } from '@/context/User/UserContext';
import showBottomMessage from '@/Utils/showBottomMessage';
import { safeSessionStorage, safeCookies } from '@/Utils/browserUtils';

// Define the Logout component
const Logout = () => {
  const searchParams = useSearchParams();
  const { userState, clearUser } = useContext(UserContext);
  const [user, setUser] = userState;

  const privateAxios = usePrivateAxios();

  // Get the navigation function from Next.js
  const router = useRouter();

  // Enhanced function to handle the logout process with better cleanup
  const logout = async (url) => {
    try {
      // Send a POST request to the logout endpoint
      await privateAxios.post(url);
      
      // Clear all authentication-related state
      clearAllAuthState();
      
      // Navigate user to the login page
      router.push('/log-in');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if server logout fails, clear client-side state
      clearAllAuthState();
      
      // Still redirect to login page
      router.push('/log-in');
    }
  };
  
  // Helper function to clear all authentication-related state
  const clearAllAuthState = () => {
    // Clear user context state
    if (clearUser) {
      clearUser(); // Use the new clearUser function if available
    } else {
      setUser(null); // Fallback
    }
    
    // Clear session storage
    try {
      safeSessionStorage.removeItem('auth_status');
      safeSessionStorage.removeItem('user_data');
      safeSessionStorage.removeItem('redirectAfterLogin');
      
      // Important: Don't clear Google One Tap attempted flag
      // This prevents Google One Tap from showing immediately after logout
      safeSessionStorage.setItem('googleOneTapAttempted', 'true');
      
      // Clear any other auth-related items
      sessionStorage.clear();
    } catch (error) {
      console.warn('Error clearing session storage:', error);
    }
    
    // Cancel Google One Tap if it exists
    if (typeof window !== 'undefined' && window.google && window.google.accounts) {
      try {
        window.google.accounts.id.cancel();
        console.log('Google One Tap cancelled during logout');
      } catch (error) {
        console.warn('Error cancelling Google One Tap:', error);
      }
    }
  };

  // Run the logout function when the component mounts
  useEffect(() => {
    if (!searchParams) {
      return;
    }
    // Convert searchParams to a URLSearchParams object if it's not already
    const params = new URLSearchParams(searchParams.toString());
    
    // Check if the user chose to logout from all devices
    const allDevices = params.get('all-devices');
    if (allDevices && allDevices === true.toString()) {
      logout(`/auth/logout-all`);
    } else {
      logout(`/auth/logout`);
    }
  }, []);

  // Return the JSX elements
  return (
    <>
      {/* Create a blurred background overlay */}
      <div className="logoutContainer blurBG"></div>
      {/* Display the ClipLoader spinner */}
      <div className="cliploader">
        <ClipLoader />
      </div>
    </>
  );
};

// Export the Logout component as the default export
export default Logout;