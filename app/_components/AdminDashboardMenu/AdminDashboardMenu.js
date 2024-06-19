/*
  File: AdminDashboardMenu.js
  Description: This component contains the dashboard menu for the admin panel
*/

import './AdminDashboardMenu.css';
import companyLogo from '../../Assets/Dashboard/companyLogo.webp';
import companyName from '../../Assets/Dashboard/companyName.webp';
import { Link, useNavigate } from 'react-router-dom';
import { privateAxios } from '../../Config/axiosInstance';
import showBottomMessage from '../../Utils/showBottomMessage';
import { useState, useContext, useEffect } from 'react';
import { AdminUserContext } from '../../context/AdminUserContext/AdminUserContext';

function AdminDashboardMenu() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useContext(AdminUserContext);

  const [privilegeLvl, setPrivilegeLvl] = useState(2);

  async function logoutAdmin() {
    try {
      const res = await privateAxios.post('/admin/logout');

      if (res.status === 200) {
        setAdmin(null);
        navigate('/admin-panel/login');
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
        <img src={companyLogo} alt="nectworks job referrals logo" />
        <img src={companyName} alt="nectworks technology" />
      </div>
      <hr></hr>

      {privilegeLvl === 1 && (
        <ul className="admin_only_pages">
          <li>
            <Link to="/admin-panel/reported-jobs">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <img src={myProfileIcon} alt='user profile' /> */}
                </span>
                <span className="admin_dashboard_menu_item_text">
                  Reported Jobs
                </span>
              </div>
            </Link>
          </li>

          <li>
            <Link to="/admin-panel/contact-us">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <img src={helpIcon} alt='help' /> */}
                </span>

                <span className="admin_dashboard_menu_item_text">
                  Contact Us
                </span>
              </div>
            </Link>
          </li>

          {/* <li>
            <Link to='/'>
              <div className='admin_dashboard_menu_item'>
                <span className='admin_dashboard_menu_item_icon'>
                  <img src={settingsIcon} alt='settings icon' />
                </span>

                <span className='admin_dashboard_menu_item_text'>
                    Remove Account
                </span>
              </div>
            </Link>
          </li> */}

          <li>
            <Link to="/admin-panel/reviews">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <img src={settingsIcon} alt='settings icon' /> */}
                </span>

                <span className="admin_dashboard_menu_item_text">
                  Reviews Recieved
                </span>
              </div>
            </Link>
          </li>

          <li>
            <Link to="/admin-panel/users">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <img src={settingsIcon} alt='settings icon' /> */}
                </span>

                <span className="admin_dashboard_menu_item_text">
                  User database
                </span>
              </div>
            </Link>
          </li>

          <li>
            <Link to="/admin-panel/view-user">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <img src={settingsIcon} alt='settings icon' /> */}
                </span>

                <span className="admin_dashboard_menu_item_text">
                  Search User
                </span>
              </div>
            </Link>
          </li>

          <li>
            <Link to="/admin-panel/admin-users">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon"></span>

                <span className="admin_dashboard_menu_item_text">
                  Manage admin
                </span>
              </div>
            </Link>
          </li>

          <li>
            <Link to="/admin-panel/help">
              <div className="admin_dashboard_menu_item">
                <span className="admin_dashboard_menu_item_icon">
                  {/* <img src={settingsIcon} alt='settings icon' /> */}
                </span>

                <span className="admin_dashboard_menu_item_text">Help</span>
              </div>
            </Link>
          </li>
        </ul>
      )}

      <ul>
        <li>
          <Link to="/admin-panel/manage-blog">
            <div className="admin_dashboard_menu_item">
              <span className="admin_dashboard_menu_item_icon"></span>

              <span className="admin_dashboard_menu_item_text">
                Manage posts
              </span>
            </div>
          </Link>
        </li>

        <li>
          <Link to="/admin-panel/create-blog-post">
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
          {/* <img src={settingsIcon} alt='settings icon' /> */}
        </span>

        <span className="admin_dashboard_menu_item_text">Logout</span>
      </div>
    </div>
  );
}

export default AdminDashboardMenu;
