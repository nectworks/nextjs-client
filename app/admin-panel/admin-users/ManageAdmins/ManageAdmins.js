'use client';

/*
  File: ManageAdmins.js
  Description: This page allows admin users to list/edit/delete other admins.
*/

import { useState, useEffect } from 'react';
import showBottomMessage from '@/Utils/showBottomMessage';
import { privateAxios } from '@/config/axiosInstance';
import AdminDashboardMenu from '../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import './ManageAdmins.css';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';

function ManageAdmins() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminRole, setAdminRole] = useState('admin');
  const [adminId, setAdminId] = useState('');

  const [updatingAdmin, setUpdatingAdmin] = useState(false);

  // function to send credentials of new user to backend
  async function createNewAdmin(e) {
    e.preventDefault();

    if (!username || username.trim().length === 0) {
      showBottomMessage(`Username required`);
      return;
    }

    if (!password || password.trim().length === 0) {
      showBottomMessage(`Password required`);
      return;
    }

    try {
      const res = await privateAxios.post('/admin/register', {
        username: username,
        password: password,
        role: adminRole,
      });

      if (res.status === 200) {
        // add the new admin to state
        const newAdmin = {
          ...res.data,
          password: password,
        };

        setAdminUsers((prevUsers) => [...prevUsers, newAdmin]);
        setUsername('');
        setPassword('');
      }

      showBottomMessage(`Successfully created admin`);
    } catch (error) {
      const { message } = error.response.data;
      showBottomMessage(message);
    }
  }

  // function to fetch all the admin users.
  async function fetchData() {
    setIsLoading(true);

    try {
      const res = await privateAxios.get('/admin/data/admin-users/');
      const { data } = res.data;

      setAdminUsers(data);
    } catch (error) {
      showBottomMessage(`Couldn't fetch admin users..`);
    } finally {
      setIsLoading(false);
    }
  }

  // function to delete a user
  async function deleteAdmin(e, admin) {
    setIsLoading(true);
    const adminId = admin._id;

    try {
      await privateAxios.delete(`/admin/admin-user/${adminId}`);

      const updatedAdminUsers = adminUsers.filter((obj) => {
        return obj._id !== adminId;
      });
      setAdminUsers(updatedAdminUsers);
      showBottomMessage(`Successfully deleted admin: ${admin.username}`);
    } catch (error) {
      showBottomMessage(`Couldn't delete admin`);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateAdmin(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      await privateAxios.patch(`/admin/admin-user/${adminId}`, {
        username: username,
        password: password,
        role: adminRole,
      });

      const updatedAdminUsers = adminUsers.map((user) => {
        if (user._id !== adminId) {
          return user;
        } else {
          return {
            ...user,
            username,
            password,
            role: {
              name: adminRole,
            },
          };
        }
      });

      setAdminUsers(updatedAdminUsers);
      setUsername('');
      setPassword('');
      setUpdatingAdmin(false);
      showBottomMessage('Successfully updated admin');
    } catch (error) {
      showBottomMessage(`Coudln't update admin`);
    } finally {
      setIsLoading(false);
    }
  }

  // columns for the admin data grid
  const adminCols = [
    {
      field: '_id',
      headerName: 'ADMIN ID',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      headerName: 'ROLE',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      valueGetter: ({ row }) => row.role.name,
    },
    {
      field: 'username',
      headerName: 'USERNAME',
      width: 200,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'password',
      headerName: 'PASSWORD',
      width: 250,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <div
            onClick={() => setShowPassword((prevVal) => !prevVal)}
            style={{
              cursor: 'pointer',
            }}
          >
            {showPassword ? row.password : '*'.repeat(12)}
          </div>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 250,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <div className="admin_user_actions">
            <button
              onClick={() => {
                setUpdatingAdmin(true);
                setUsername(row.username);
                setPassword(row.password);
                setAdminId(row._id);
                setAdminRole(row.role.name);
              }}
            >
              Edit
            </button>

            {adminUsers.length > 1 && (
              <button onClick={(e) => deleteAdmin(e, row)}>Delete</button>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="manage_admin_outer_container">
      <AdminDashboardMenu />

      <div className="manage_admin_inner_container">
        <h1>All admin users.</h1>

        <form className="create_new_admin_form">
          {updatingAdmin ? <h3>Edit admin</h3> : <h3>Add new admin</h3>}

          <div className="admin_form_control">
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="admin_form_control">
            <label htmlFor="password">Password: </label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="admin_form_control">
            <label htmlFor="role">Role: </label>
            <select
              name="role"
              value={adminRole}
              onChange={(e) => setAdminRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="content-editor">Content Editor</option>
            </select>
          </div>

          {updatingAdmin === true ? (
            <button type="submit" onClick={updateAdmin}>
              Edit
            </button>
          ) : (
            <button type="submit" onClick={createNewAdmin}>
              Create
            </button>
          )}
        </form>

        <div className="admin_users_data_grid">
          <DataGrid
            rows={adminUsers}
            columns={adminCols}
            getRowId={(row) => row._id}
            loading={isLoading}
            slots={{
              toolbar: GridToolbar,
              loadingOverlay: LinearProgress,
            }}
            sx={{
              '& .MuiDataGrid-root': {
                borderRadius: '8px',
                boxShadow: '1px 1px 4px 0px rgba(0, 0, 0, 0.25)',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#EBEBEB',
                color: 'black',
              },
              '& .MuiDataGrid-cell': {
                backgroundColor: '#FFF',
                color: 'black',
              },
              '& .MuiDataGrid-row': {
                margin: '3px 0',
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ManageAdmins;
