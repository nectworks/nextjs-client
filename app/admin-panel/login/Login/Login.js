'use client';
/*
  File: Login.js
  Description: Login page for the admin panel. Takes username
    and password inputs.
*/

'use client';

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
  const [isLogging, setIsLogging] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  async function loginAdmin(e) {
    e.preventDefault();

    if (isLogging) return;

    if (!username.trim()) {
      showBottomMessage('Username is required');
      return;
    }
    
    if (!password) {
      showBottomMessage('Password is required');
      return;
    }

    if (isBlocked) {
      showBottomMessage(`Please wait ${Math.ceil(blockTimeRemaining / 60)} minutes before trying again`);
      return;
    }

    setIsLogging(true);

    try {
      const res = await privateAxios.post('/admin/login', {
        username: username.trim(),
        password,
      });

      if (res.status === 200 && res.data.authenticated) {
        const { user } = res.data;
        setAdmin(user);
        
        setLoginAttempts(0);
        showBottomMessage('Login successful!', 'success');

        const privilegeLvl = user.role.privilegeLvl;
        const redirectPath = privilegeLvl === 2 ? '/admin-panel/manage-blog' : '/admin-panel/users';
        
        setTimeout(() => {
          router.push(redirectPath);
        }, 1000);
      }

    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 401:
            handleLoginFailure(data);
            break;
          case 423:
            handleAccountLocked(data);
            break;
          case 429:
            handleRateLimit(data);
            break;
          case 500:
            showBottomMessage('Server error. Please try again later.');
            break;
          default:
            showBottomMessage(data?.message || 'Login failed. Please try again.');
        }
      } else if (error.request) {
        showBottomMessage('Network error. Please check your connection.');
      } else {
        showBottomMessage('An unexpected error occurred.');
      }
    } finally {
      setIsLogging(false);
    }
  }

  function handleLoginFailure(data) {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    
    if (data.code === 'INVALID_CREDENTIALS') {
      const remainingAttempts = Math.max(0, 5 - newAttempts);
      if (remainingAttempts > 0) {
        showBottomMessage(`Invalid credentials. ${remainingAttempts} attempts remaining.`);
      } else {
        showBottomMessage('Too many failed attempts. Please try again later.');
        setIsBlocked(true);
        startBlockTimer(15 * 60);
      }
    } else {
      showBottomMessage(data.message || 'Login failed');
    }
  }

  function handleAccountLocked(data) {
    showBottomMessage('Account is locked due to too many failed attempts. Please contact administrator.');
    setIsBlocked(true);
    startBlockTimer(2 * 60 * 60);
  }

  function handleRateLimit(data) {
    showBottomMessage('Too many requests. Please wait before trying again.');
    setIsBlocked(true);
    startBlockTimer(15 * 60);
  }

  function startBlockTimer(seconds) {
    setBlockTimeRemaining(seconds);
    
    const timer = setInterval(() => {
      setBlockTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsBlocked(false);
          setLoginAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    async function checkAuthStatus() {
      if (admin) {
        const privilegeLvl = admin.role.privilegeLvl;
        const redirectPath = privilegeLvl === 2 ? '/admin-panel/manage-blog' : '/admin-panel/users';
        router.push(redirectPath);
        return;
      }

      try {
        const res = await privateAxios.get('/admin/authenticate');
        if (res.data.authenticated) {
          setAdmin(res.data.admin);
        }
      } catch (error) {
        if (error.response?.status !== 401) {
          console.error('Auth check error:', error);
        }
      }
    }

    checkAuthStatus();
  }, [admin, router, setAdmin]);

  function formatTimeRemaining(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  return (
    <div className="admin_login_container">
      <form className="admin_login_form" onSubmit={loginAdmin}>
        <h1>Admin Login</h1>

        {isBlocked && blockTimeRemaining > 0 && (
          <div className="login_warning" style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            <p>Too many failed attempts. Try again in: {formatTimeRemaining(blockTimeRemaining)}</p>
          </div>
        )}

        <div className="admin_login_form_control">
          <label htmlFor="username">
            Username
            <span>*</span>
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter the username"
            disabled={isLogging || isBlocked}
            autoComplete="username"
            maxLength={50}
          />
        </div>

        <div className="admin_login_form_control">
          <label htmlFor="password">
            Password
            <span>*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter the password"
            disabled={isLogging || isBlocked}
            autoComplete="current-password"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLogging || isBlocked || !username.trim() || !password}
          style={{
            opacity: (isLogging || isBlocked || !username.trim() || !password) ? 0.6 : 1,
            cursor: (isLogging || isBlocked || !username.trim() || !password) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLogging ? 'Logging in...' : 'Login'}
        </button>

        {loginAttempts > 0 && !isBlocked && (
          <div className="login_attempts" style={{
            textAlign: 'center',
            marginTop: '10px',
            color: '#f57c00',
            fontSize: '14px'
          }}>
            <p>Failed attempts: {loginAttempts}/5</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;