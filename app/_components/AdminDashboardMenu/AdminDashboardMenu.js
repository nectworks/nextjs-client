'use client';
/*
  File: AdminDashboardMenu.js
  Description: This component contains the dashboard menu for the admin panel
*/

import './AdminDashboardMenu.css';
import companyLogo from '../../../public/Dashboard/companyLogo.webp';
import companyName from '../../../public/Dashboard/companyName.webp';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { privateAxios } from '../../Config/axiosInstance';
import showBottomMessage from '../../Utils/showBottomMessage';
import { useState, useContext, useEffect } from 'react';
import { AdminUserContext } from '../../context/AdminUserContext/AdminUserContext';

function AdminDashboardMenu() {
  const router = useRouter();
  const [admin, setAdmin] = useContext(AdminUserContext);

  const [privilegeLvl, setPrivilegeLvl] = useState(2);

  async function logoutAdmin() {
    try {
      const res = await privateAxios.post('/admin/logout');

      if (res.status === 200) {
        setAdmin(null);
        router.push('/admin-panel/login');
      }
    } catch (error) {
      showBottomMessage("Couldn't logout");
    }
  }

  useEffect(() => {
    setPrivilegeLvl(admin?.role?.privilegeLvl);
  }, []);

  return (
    <div className="admin_dashboard_menu_container">
      <div className="admin_dashboard_menu_icons">
        <Image src={companyLogo} alt="nectworks job referrals logo" />
        <Image src={companyName} alt="nectworks technology" />
      </div>
      <hr></hr>

      {privilegeLvl === 1 && (
        <ul className="admin_only_pages">
          <li>
            <Link href="/admin-panel/reported-jobs">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <Image src={myProfileIcon} alt='user profile' /> */}
                </span>
                <span className="admin_dashboard_menu_item_text">
                  Reported Jobs
                </span>
              </div>
            </Link>
          </li>

          <li>
            <Link href="/admin-panel/contact-us">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <Image src={helpIcon} alt='help' /> */}
                </span>

                <span className="admin_dashboard_menu_item_text">
                  Contact Us
                </span>
              </div>
            </Link>
          </li>

          {/* <li>
            <Link href='/'>
              <div className='admin_dashboard_menu_item'>
                <span className='admin_dashboard_menu_item_icon'>
                  <Image src={settingsIcon} alt='settings icon' />
                </span>

                <span className='admin_dashboard_menu_item_text'>
                    Remove Account
                </span>
              </div>
            </Link>
          </li> */}

          <li>
            <Link href="/admin-panel/reviews">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <Image src={settingsIcon} alt='settings icon' /> */}
                </span>

                <span className="admin_dashboard_menu_item_text">
                  Reviews Recieved
                </span>
              </div>
            </Link>
          </li>

          <li>
            <Link href="/admin-panel/users">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <Image src={settingsIcon} alt='settings icon' /> */}
                </span>

                <span className="admin_dashboard_menu_item_text">
                  User database
                </span>
              </div>
            </Link>
          </li>

          <li>
            <Link href="/admin-panel/view-user">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <Image src={settingsIcon} alt='settings icon' /> */}
                </span>

                <span className="admin_dashboard_menu_item_text">
                  Search User
                </span>
              </div>
            </Link>
          </li>

          <li>
            <Link href="/admin-panel/admin-users">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon"></span>

                <span className="admin_dashboard_menu_item_text">
                  Manage admin
                </span>
              </div>
            </Link>
          </li>

          <li>
            <Link href="/admin-panel/help">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <Image src={settingsIcon} alt='settings icon' /> */}
                </span>

                <span className="admin_dashboard_menu_item_text">Help</span>
              </div>
            </Link>
          </li>
        </ul>
      )}

      <ul>
        <li>
          <Link href="/admin-panel/manage-blog">
            <div className="admin_dashboard_menu_item">
              <span className="admin_dashboard_menu_item_icon"></span>

              <span className="admin_dashboard_menu_item_text">
                Manage posts
              </span>
            </div>
          </Link>
        </li>

        <li>
          <Link href="/admin-panel/create-blog-post">
            <div className="admin_dashboard_menu_item">
              <span className="admin_dashboard_menu_item_icon"></span>

              <span className="admin_dashboard_menu_item_text">
                Create posts
              </span>
            </div>
          </Link>
        </li>
      </ul>

      <hr></hr>

      <div
        className="admin_dashboard_menu_item admin_dashboard_logout"
        onClick={logoutAdmin}
      >
        <span className="admin_dashboard_menu_item_icon">
          {/* <Image src={settingsIcon} alt='settings icon' /> */}
        </span>

        <span className="admin_dashboard_menu_item_text">Logout</span>
      </div>
    </div>
  );
}

export default AdminDashboardMenu;
