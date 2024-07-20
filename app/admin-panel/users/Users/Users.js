'use client';
/*
  File: Users.js
  Description: This file contains the list of all the users registered for
  the database.
*/

import { useCallback, useEffect, useState } from 'react';
import AdminDashboardMenu from '../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import showBottomMessage from '@/Utils/showBottomMessage';
import { privateAxios } from '@/config/axiosInstance';
import './Users.css';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Link from 'next/link';
import Image from 'next/image';
import profileLinkIcon from '@/public/Profile/otherLinkIcon.svg';
import { LinearProgress } from '@mui/material';

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // state to store the count of all the users present
  const [userCount, setUserCount] = useState(-1);

  // store the reference to next page of documents
  const [nextUserRef, setNextUserRef] = useState(null);

  // represents data to be displayed in current page.
  const [userPageData, setUserPageData] = useState([]);

  // switch between viewing registered and unregistered users.
  const [showRegisteredUsers, setShowRegisteredUsers] = useState(true);

  // control pagination with state
  const [userPaginationModel, setUserPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  // states require to maintain pagination for unregistered users
  const [unregisteredUsers, setUnRegisteredUsers] = useState([]);
  const [unregisteredUserCount, setUnregisteredUserCount] = useState(-1);
  const [nextUnRegisteredUserRef, setUnRegisteredUserRef] = useState(null);
  const [unRegisteredUserPageData, setUnRegisteredUserPageData] = useState([]);
  const [unRegisteredUserPaginationModel, setUnRegisteredUserPaginationModel] =
    useState({
      pageSize: 5,
      page: 0,
    });

  // function to fetch the users from the database.
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    showBottomMessage(`Fetching data...`);

    try {
      const res = await privateAxios.get('/admin/data/users', {
        params: {
          page: userPaginationModel.page,
          limit: userPaginationModel.pageSize,
          prevDocId: nextUserRef,
        },
      });
      const { users, count, next } = res.data;

      setUsers((prevUsers) => [...prevUsers, ...users]);
      setUserCount(count);
      setNextUserRef(next);
      showBottomMessage(`Successfully fetched users...`);
    } catch (error) {
      let message = `Couldn't fetch all users...`;

      if (error?.response?.data.message) {
        message = error?.response?.data.message;
      }

      showBottomMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [userPaginationModel.page, userPaginationModel.pageSize, nextUserRef]);

  // function to update current data as the page changes.
  const updateUserPageItems = useCallback(() => {
    const currPageStart =
      userPaginationModel.page * userPaginationModel.pageSize;
    const currPageEnd = currPageStart + userPaginationModel.pageSize;

    const retrievedUsersCount = users.length;

    // if the data is not fetched already, fetch from api
    if (
      userCount === -1 ||
      (retrievedUsersCount - 1 < currPageEnd - 1 &&
        retrievedUsersCount < userCount)
    ) {
      fetchUsers();
    } else {
      // else display the data
      setUserPageData(users.slice(currPageStart, currPageEnd));
    }
  }, [
    fetchUsers,
    userPaginationModel.page,
    userPaginationModel.pageSize,
    userCount,
    users,
  ]);

  // the columns for displaying user data.
  const userCols = [
    {
      field: '_id',
      headerName: 'USER ID',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'firstName',
      headerName: 'FIRST NAME',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'lastName',
      headerName: 'LAST NAME',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'username',
      headerName: 'USER NAME',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'profile',
      headerName: 'PROFILE',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const userProfileUrl = `/admin-panel/view-user?username=${row?.username}`;

        return (
          <Link href={userProfileUrl} target="_blank">
            <Image src={profileLinkIcon} alt="" />
          </Link>
        );
      },
    },
  ];

  // function to fetch unregistered users from database
  const fetchUnRegisteredUsers = useCallback(async () => {
    setIsLoading(true);
    showBottomMessage(`Fetching data...`);

    try {
      const res = await privateAxios.get('/admin/data/unregisteredusers', {
        params: {
          page: unRegisteredUserPaginationModel.page,
          limit: unRegisteredUserPaginationModel.pageSize,
          prevDocId: nextUnRegisteredUserRef,
        },
      });
      const { users, count, next } = res.data;

      setUnRegisteredUsers((prevUsers) => [...prevUsers, ...users]);
      setUnregisteredUserCount(count);
      setUnRegisteredUserRef(next);
      showBottomMessage(`Successfully fetched users...`);
    } catch (error) {
      let message = `Couldn't fetch all users...`;

      if (error?.response?.data.message) {
        message = error?.response?.data.message;
      }

      showBottomMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [
    unRegisteredUserPaginationModel.page,
    unRegisteredUserPaginationModel.pageSize,
    nextUnRegisteredUserRef,
  ]);

  const updateUnRegisteredUserPage = useCallback(() => {
    const currPageStart =
      unRegisteredUserPaginationModel.page *
      unRegisteredUserPaginationModel.pageSize;
    const currPageEnd =
      currPageStart + unRegisteredUserPaginationModel.pageSize;

    const retrievedUsersCount = unregisteredUsers.length;

    // if the data is not fetched already, fetch from api
    if (
      unregisteredUserCount === -1 ||
      (retrievedUsersCount - 1 < currPageEnd - 1 &&
        retrievedUsersCount < unregisteredUserCount)
    ) {
      fetchUnRegisteredUsers();
    } else {
      // else display the data
      setUnRegisteredUserPageData(
        unregisteredUsers.slice(currPageStart, currPageEnd)
      );
    }
  }, [
    fetchUnRegisteredUsers,
    unRegisteredUserPaginationModel.page,
    unRegisteredUserPaginationModel.pageSize,
    unregisteredUserCount,
    unregisteredUsers,
  ]);

  const unRegisteredUserCols = [
    {
      field: '_id',
      headerName: 'USER ID',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'firstName',
      headerName: 'FIRST NAME',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'lastName',
      headerName: 'LAST NAME',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'profile',
      headerName: 'PROFILE',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const userProfileUrl = `/admin-panel/view-user?email=${row?.email}`;

        return (
          <Link href={userProfileUrl} target="_blank">
            <Image src={profileLinkIcon} alt="" />
          </Link>
        );
      },
    },
  ];

  useEffect(() => {
    if (showRegisteredUsers === true) {
      updateUserPageItems();
    }
  }, [userPaginationModel, users, showRegisteredUsers, updateUserPageItems]);

  useEffect(() => {
    if (showRegisteredUsers === false) {
      updateUnRegisteredUserPage();
    }
  }, [
    unRegisteredUserPaginationModel,
    unregisteredUsers,
    showRegisteredUsers,
    updateUnRegisteredUserPage,
  ]);

  return (
    <div className="admin_users_outer_container">
      <AdminDashboardMenu />

      <div className="admin_users_inner_container">
        <h1>All Users</h1>

        <button
          className={`users_switch_btn
            ${showRegisteredUsers ? 'users_switch_active' : ''}`}
          onClick={() => setShowRegisteredUsers(true)}
        >
          Registered
        </button>
        <button
          className={`users_switch_btn
          ${!showRegisteredUsers ? 'users_switch_active' : ''}`}
          onClick={() => setShowRegisteredUsers(false)}
        >
          Unregistered
        </button>

        {/* data grid */}
        {showRegisteredUsers === true ? (
          <div className="admin_users_data_grid">
            <DataGrid
              getRowId={(row) => row._id}
              rows={userPageData}
              columns={userCols}
              rowCount={userCount}
              paginationMode="server"
              paginationModel={userPaginationModel}
              onPaginationModelChange={setUserPaginationModel}
              pageSizeOptions={[5, 10, 15, 20]}
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
        ) : (
          <div className="admin_users_data_grid">
            <DataGrid
              getRowId={(row) => row._id}
              rows={unRegisteredUserPageData}
              columns={unRegisteredUserCols}
              rowCount={unregisteredUserCount}
              paginationMode="server"
              paginationModel={unRegisteredUserPaginationModel}
              onPaginationModelChange={setUnRegisteredUserPaginationModel}
              pageSizeOptions={[5, 10, 15, 20]}
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
        )}
      </div>
    </div>
  );
}

export default Users;
