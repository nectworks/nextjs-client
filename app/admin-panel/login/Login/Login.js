'use client';
/*
  File: Login.js
  Description: Login page for the admin panel. Takes username
    and password inputs.
*/

import { useContext, useEffect, useState } from 'react';
import { privateAxios } from '@/config/axiosInstance';
import { useRouter } from 'next/navigation';
import { AdminUserContext } from '@/context/AdminUserContext/AdminUserContext';
import showBottomMessage from '@/Utils/showBottomMessage';
import './Login.css';

function Login() {
  const [admin, setAdmin] = useContext(AdminUserContext);
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function loginAdmin(e) {
    e.preventDefault();

    if (username.length === 0) {
      showBottomMessage('Username is required');
      return;
    }
    if (password.length === 0) {
      showBottomMessage('Password is required');
      return;
    }

    try {
      const res = await privateAxios.post('/admin/login', {
        username,
        password,
      });

      // if the admin is successfully logged in redirect them to dashboard
      if (res.status === 200) {
        const { user } = res.data;
        setAdmin(user);

        const privilegeLvl = user.role.privilegeLvl;

        if (privilegeLvl === 2) {
          router.push('/admin-panel/manage-blog');
        } else {
          router.push('/admin-panel/users');
        }
      }
    } catch (error) {
      const { data } = error.response;
      showBottomMessage(data.message);
    }
  }

  useEffect(() => {
    if (admin) {
      const privilegeLvl = admin.role.privilegeLvl;
      if (privilegeLvl === 2) {
        router.push('/admin-panel/manage-blog');
      } else {
        router.push('/admin-panel/users');
      }
    }
  }, [admin, router]);

  return (
    <div className="admin_login_container">
      <form className="admin_login_form">
        <h1>Login</h1>

        <div className="admin_login_form_control">
          <label htmlFor="username">
            Username
            <span>*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter the username"
          />
        </div>

        <div className="admin_login_form_control">
          <label htmlFor="passworrd">
            Password
            <span>*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter the password"
          />
        </div>

        <button type="submit" onClick={loginAdmin}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
