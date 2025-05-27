'use client';

/*
  File: ManageAdmins.js (Updated for bcrypt security)
  Description: This page allows admin users to list/edit/delete other admins.
  Note: Passwords are no longer displayed for security (bcrypt hashed)
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminRole, setAdminRole] = useState('admin');
  const [adminId, setAdminId] = useState('');
  
  const [updatingAdmin, setUpdatingAdmin] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

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

    if (password.length < 8) {
      showBottomMessage(`Password must be at least 8 characters`);
      return;
    }

    setIsLoading(true);

    try {
      const res = await privateAxios.post('/admin/register', {
        username: username.trim(),
        password: password,
        role: adminRole,
      });

      if (res.status === 200) {
        // Refresh the admin list
        await fetchData();
        
        // Reset form
        setUsername('');
        setPassword('');
        setAdminRole('admin');
        setShowCreateForm(false);
        
        showBottomMessage(`Successfully created admin: ${username}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create admin';
      showBottomMessage(message);
    } finally {
      setIsLoading(false);
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
      const message = error.response?.data?.message || `Couldn't fetch admin users`;
      showBottomMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  // function to delete a user
  async function deleteAdmin(e, admin) {
    if (!confirm(`Are you sure you want to delete admin: ${admin.username}?`)) {
      return;
    }

    setIsLoading(true);
    const adminId = admin._id;

    try {
      await privateAxios.delete(`/admin/admin-user/${adminId}`);

      // Remove from local state
      const updatedAdminUsers = adminUsers.filter((obj) => {
        return obj._id !== adminId;
      });
      setAdminUsers(updatedAdminUsers);
      showBottomMessage(`Successfully deleted admin: ${admin.username}`);
    } catch (error) {
      const message = error.response?.data?.message || `Couldn't delete admin`;
      showBottomMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateAdmin(e) {
    e.preventDefault();

    if (!username || username.trim().length === 0) {
      showBottomMessage(`Username required`);
      return;
    }

    if (!password || password.trim().length === 0) {
      showBottomMessage(`Password required`);
      return;
    }

    if (password.length < 8) {
      showBottomMessage(`Password must be at least 8 characters`);
      return;
    }

    setIsLoading(true);

    try {
      await privateAxios.patch(`/admin/admin-user/${adminId}`, {
        username: username.trim(),
        password: password,
        role: adminRole,
      });

      // Refresh the admin list to get updated data
      await fetchData();

      // Reset form
      setUsername('');
      setPassword('');
      setAdminRole('admin');
      setAdminId('');
      setUpdatingAdmin(false);
      
      showBottomMessage('Successfully updated admin');
    } catch (error) {
      const message = error.response?.data?.message || `Couldn't update admin`;
      showBottomMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  function startEditAdmin(admin) {
    setUpdatingAdmin(true);
    setShowCreateForm(true);
    setUsername(admin.username);
    setPassword(''); // Don't pre-fill password for security
    setAdminId(admin._id);
    setAdminRole(admin.role.name);
  }

  function cancelForm() {
    setUpdatingAdmin(false);
    setShowCreateForm(false);
    setUsername('');
    setPassword('');
    setAdminRole('admin');
    setAdminId('');
  }

  // columns for the admin data grid
  const adminCols = [
    {
      field: '_id',
      headerName: 'ADMIN ID',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ value }) => (
        <div className="text-truncate" style={{ maxWidth: '180px' }} title={value}>
          {value}
        </div>
      ),
    },
    {
      headerName: 'ROLE',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      valueGetter: ({ row }) => row.role.name,
      renderCell: ({ row }) => {
        return (
          <span className={`role-badge ${row.role.name === 'admin' ? 'role-admin' : 'role-content-editor'}`}>
            {row.role.name.replace('-', ' ')}
          </span>
        );
      },
    },
    {
      field: 'username',
      headerName: 'USERNAME',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'lastLogin',
      headerName: 'LAST LOGIN',
      width: 140,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        if (!row.lastLogin) return <span style={{ color: '#999' }}>Never</span>;
        return new Date(row.lastLogin).toLocaleDateString();
      },
    },
    {
      field: 'accountCreated',
      headerName: 'CREATED',
      width: 120,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return new Date(row.accountCreated).toLocaleDateString();
      },
    },
    {
      field: 'actions',
      headerName: 'ACTIONS',
      width: 160,
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => {
        return (
          <div className="admin_user_actions">
            <button
              onClick={() => startEditAdmin(row)}
              style={{
                backgroundColor: '#1976d2',
                color: 'white'
              }}
            >
              Edit
            </button>

            {adminUsers.length > 1 && (
              <button 
                onClick={(e) => deleteAdmin(e, row)}
                style={{
                  backgroundColor: '#d32f2f',
                  color: 'white'
                }}
              >
                Delete
              </button>
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
        <div className="admin_header_section">
          <h1>Admin Users Management</h1>
          
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="add_admin_button"
            >
              + Add New Admin
            </button>
          )}
        </div>

        {/* Create/Edit Admin Form */}
        {showCreateForm && (
          <form className="create_new_admin_form">
            <div className="form_header">
              {updatingAdmin ? <h3>Edit Admin</h3> : <h3>Add New Admin</h3>}
              <button
                type="button"
                onClick={cancelForm}
                className="cancel_button"
              >
                Cancel
              </button>
            </div>

            <div className="admin_form_control">
              <label htmlFor="username">Username: </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                minLength={3}
                maxLength={50}
              />
            </div>

            <div className="admin_form_control">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={updatingAdmin ? "Enter new password" : "Enter password"}
                required
                minLength={8}
                autoComplete="new-password"
              />
              <small>
                {updatingAdmin ? 'Leave blank to keep current password' : 'Minimum 8 characters'}
              </small>
            </div>

            <div className="admin_form_control">
              <label htmlFor="role">Role: </label>
              <select
                name="role"
                value={adminRole}
                onChange={(e) => setAdminRole(e.target.value)}
              >
                <option value="admin">Admin (Full Access)</option>
                <option value="content-editor">Content Editor (Limited Access)</option>
              </select>
            </div>

            {updatingAdmin ? (
              <button 
                type="submit" 
                onClick={updateAdmin}
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Admin'}
              </button>
            ) : (
              <button 
                type="submit" 
                onClick={createNewAdmin}
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Admin'}
              </button>
            )}
          </form>
        )}

        {/* Admin Users Data Grid */}
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
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            autoHeight={false}
            sx={{
              '& .MuiDataGrid-root': {
                borderRadius: '8px',
                boxShadow: '1px 1px 4px 0px rgba(0, 0, 0, 0.25)',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                color: 'black',
                borderBottom: '2px solid #e0e0e0',
              },
              '& .MuiDataGrid-cell': {
                backgroundColor: '#FFF',
                color: 'black',
                borderBottom: '1px solid #f0f0f0',
              },
              '& .MuiDataGrid-row': {
                '&:hover': {
                  backgroundColor: '#fafafa',
                },
              },
              '& .MuiDataGrid-columnSeparator': {
                display: 'none',
              },
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'auto',
              },
            }}
          />
        </div>

        {/* Security Notice */}
        <div className="security_notice">
          <strong>🔒 Security Notice:</strong>
          Passwords are securely hashed and cannot be displayed. 
          When editing an admin, you must provide a new password.
        </div>
      </div>
    </div>
  );
}

export default ManageAdmins;