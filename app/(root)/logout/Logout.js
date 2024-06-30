'use client';

/*
    FileName - Logout.js
    Desc - This JavaScript file defines a React component called Logout. The primary purpose of this component is to handle the logout process for a user. It includes logic to send a request to a server to log the user out and provides visual feedback during the logout process.
*/
// Import necessary dependencies and styles
import { useContext, useEffect } from 'react';
import usePrivateAxios from '@/Utils/usePrivateAxios';
import { useRouter, useSearchParams } from 'next/navigation';
import ClipLoader from 'react-spinners/ClipLoader';
import './Logout.css'; // Import local CSS styles
import { UserContext } from '@/context/User/UserContext';
import showBottomMessage from '@/Utils/showBottomMessage';

// Define the Logout component
const Logout = () => {
  const searchParams = useSearchParams();
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  const privateAxios = usePrivateAxios();

  // Get the navigation function from react-router-dom
  const router = useRouter();

  // Function to handle the logout process
  const logout = async (url) => {
    try {
      // Send a POST request to the logout endpoint
      await privateAxios.post(url);
      sessionStorage.clear();
      setUser(null);
      // navigate user to the login page.
      router.push('/log-in');
    } catch (error) {
      // An error occurred during logout process
      showBottomMessage(`Could not logout`);
    }
  };

  // Run the logout function when the component mounts
  useEffect(() => {
    if (!searchParams) {
      return;
    }
    // Convert searchParams to a URLSearchParams object if it's not already
    const params = new URLSearchParams(searchParams.toString());
    console.log(JSON.stringify(`params: ${params}`));
    // check if the user chose to logout from all devices
    const allDevices = params.get('all-devices');
    console.log(JSON.stringify(`allDevices: ${allDevices}`));
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
