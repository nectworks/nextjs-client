'use client';
/*
    FileName - ProtectedRoute.js
    Desc - This JavaScript file defines a React component called
    ProtectedRoute that is designed to provide route protection based
    on user authentication status. The purpose of this component is to
    conditionally render a given component (referred to as element:
    Component) if the user is authenticated. If the user is not authenticated,
    they are redirected to the login page.
*/
// Import necessary dependencies from React and react-router-dom libraries
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/User/UserContext';

// Define the ProtectedRoute component
const ProtectedRoute = ({ element: Component, requireProfessional }) => {
  // State to manage user authentication status

  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;

  // Get the current location using react-router-dom's useLocation hook
  const location = useLocation();

  // if the user is not found, redirect them to login page
  if (!user) {
    return <Navigate to="/log-in" state={{ path: location.pathname }} />;
  }

  /* if any route requires user to be a professional but user
    is a seeker, redirect them to profile page with a message */

  if (requireProfessional === true && !!user?.userDetails?.emailID === false) {
    return (
      <Navigate
        to="/account-settings"
        state={{
          path: location.pathname,
          message: 'Verify work email to access the feature.',
          displayMessage: true,
        }}
      />
    );
  }

  return <Component />;
};

// Export the ProtectedRoute component as the default export
export default ProtectedRoute;
