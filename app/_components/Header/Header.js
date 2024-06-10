'use client'

/*
  FileName - Header.js
  Desc - This file defines a React component (Header) responsible for rendering
  a navigation header with a logo, menu items, and responsive behavior based on
  user authentication and screen width. It enhances user experience by providing
  dynamic menu rendering and smooth scrolling functionality.
*/

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import './Header.css';
import companyName from '../../../public/nectworks-ssar04a-mil-11@2x.webp';
import scrollToTop from '../../../Utils/scrollToTop';
import { UserContext } from '../../../context/User/UserContext';

const Header = ( ) => {
  const { userState } = useContext(UserContext);
  const [user, setUser] = userState;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const RenderMenu = () => {
    // if the user is not logged in the button (in the header) will
    // be displayed on pages other than login and signup pages
    if (
      !isLoggedIn &&
      router.pathname !== '/log-in' &&
      router.pathname !== '/sign-up'
    ) {
      return (
        <li className='loginheader'><Link href="/log-in">Log In</Link></li>
      );
    }
    return null;
  };

  useEffect(() => {
    setIsLoggedIn((user !== null));
  }, [user]);

  return (
    <header className="header">
      <nav className='header_navigation'>
        {/* <!-- Logo --> */}
        <div className="logo" onClick={scrollToTop}>
          <Link href="/">
            <Image className='image' src={companyName} alt="Nectworks home page" />
          </Link>
        </div>
        {/* <!-- Responsive Menu Icon --> */}
        <input type="checkbox" id="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">&#9776;</label>
        {/* <!-- Menu Items --> */}
        <ul className="menu" onClick={scrollToTop}>
          <RenderMenu />
          {(isLoggedIn) &&
          <li><Link href="/profile">Profile</Link></li>
          }
          <li><Link href='/about-us'>About Us</Link></li>
          <li><Link href="/faq">FAQ</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;