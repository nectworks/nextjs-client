'use client';
/*
  File: ContactUs.js
  Description: This page contains UI to view and resolve all the 'contact us'
  submissions at our website.
*/

import { useEffect, useState } from 'react';
import { privateAxios } from '@/config/axiosInstance';
import './ContactUs.css';
import Image from 'next/image';
import AdminDashboardMenu from '../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import showBottomMessage from '@/Utils/showBottomMessage';
import mailIcon from '@/public/Profile/otherLinkIcon.svg';
import phoneIcon from '@/public/AdminPanel/phoneIcon.svg';
import messageIcon from '@/public/AdminPanel/messageIcon.svg';
import arrowIcon from '@/public/arrow_img.svg';

function ContactUs() {
  // segregate the data based on it's status
  const [resolvedData, setResolvedData] = useState([]);
  const [resolvedCount, setResolvedCount] = useState(-1);
  const [resolvedPageRef, setResolvedPageRef] = useState(null);

  const [unResolvedData, setUnResolvedData] = useState([]);
  const [unResolvedCount, setUnResolvedCount] = useState(-1);
  const [unResolvedPageRef, setUnResolvedPageRef] = useState(null);

  /* this state contains the data to be displayed based on the selection of
     resolved/unresolved tickets */
  const [currPageData, setCurrPageData] = useState([]);

  // control pagination with state
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  // state to indicate an ongoing network request
  const [isLoading, setIsLoading] = useState(false);

  // state to switch between resolved/unresolved tickets.
  const [showResolved, setShowResolved] = useState(false);

  // state to display selected submission data
  const [viewSelectedData, setViewSelectedData] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // function to switch between resolved/unresolved tickets
  function switchBetweenData() {
    setPaginationModel({
      pageSize: 5,
      page: 0,
    });
    setShowResolved((prevData) => !prevData);
  }

  // function to fetch data from the server
  async function fetchData() {
    setIsLoading(true);

    try {
      const url = `/admin/data/contact-us`;
      const res = await privateAxios.get(url, {
        params: {
          page: paginationModel.page,
          limit: paginationModel.pageSize,
          prevDocId: showResolved ? resolvedPageRef : unResolvedPageRef,
          isResolved: showResolved,
        },
      });

      const { data, count, next } = res.data;

      if (showResolved) {
        setResolvedData((prevData) => [...prevData, ...data]);
        setResolvedPageRef(next);
        setResolvedCount(count);
      } else {
        setUnResolvedData((prevData) => [...prevData, ...data]);
        setUnResolvedPageRef(next);
        setUnResolvedCount(count);
      }

      return data;
    } catch (error) {
      const { message } = error.response.data;
      showBottomMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  /* function to upate the data to be displayed in the current page as
     the page is changed by the user */
  function updateCurrentPageItems(retrievedData, dbDocumentCount) {
    const currPageStart = paginationModel.page * paginationModel.pageSize;
    const currPageEnd = currPageStart + paginationModel.pageSize;

    if (
      dbDocumentCount === -1 ||
      (retrievedData.length - 1 < currPageEnd - 1 &&
        retrievedData.length < dbDocumentCount)
    ) {
      fetchData();
    } else {
      setCurrPageData(retrievedData.slice(currPageStart, currPageEnd));
    }
  }

  // function to resolve submission
  async function resolveTicket(report) {
    showBottomMessage('Resolving the submission...');

    try {
      const url = '/admin/contact-us/resolve?';
      const data = { submissionId: report._id };
      await privateAxios.post(url, data);

      showBottomMessage(`Report with id '${report._id}' resolved!`);

      // update the state, move the object from unresolved data to resolved data
      setUnResolvedData((prevData) =>
        prevData.filter((obj, idx) => {
          return obj._id !== report._id;
        })
      );
      setResolvedData((prevData) => [...prevData, report]);

      setUnResolvedCount((prevCount) => prevCount - 1);
      setResolvedCount((prevCount) => prevCount + 1);

      setSelectedData(null);
      setViewSelectedData(false);
    } catch (error) {
      const { message } = error.response.data;
      showBottomMessage(message);
    }
  }

  // function to view selected row
  function viewData({ row }) {
    setViewSelectedData(true);
    setSelectedData(row);
  }

  // define the columns for the data grid
  const columns = [
    {
      field: '_id',
      headerName: 'REPORT ID',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'fullName',
      headerName: 'NAME',
      width: 250,
      valueGetter: ({ row }) => {
        return row?.firstName + ' ' + row?.lastName;
      },
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'email',
      headerName: 'EMAIL',
      width: 100,
      renderCell: ({ row }) => {
        return (
          <div className="admin_contactus_icon_container">
            <Image src={mailIcon} />
          </div>
        );
      },
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'phone',
      headerName: 'NUMBER',
      width: 100,
      renderCell: ({ row }) => {
        return (
          <div className="admin_contactus_icon_container">
            <Image src={phoneIcon} />
          </div>
        );
      },
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'message',
      headerName: 'MESSAGE SENT',
      width: 200,
      renderCell: ({ row }) => {
        return (
          <div className="admin_contactus_icon_container">
            <Image src={messageIcon} />
          </div>
        );
      },
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'STATUS',
      width: 200,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        return (
          <div className="admin_contactus_status_container">
            {row.status}

            {row.status === 'pending' && (
              <>
                <Image src={arrowIcon} />

                <span
                  className="admin_contactus_status_update"
                  onClick={() => resolveTicket(row)}
                >
                  Resolve
                </span>
              </>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (showResolved === true) {
      updateCurrentPageItems(resolvedData, resolvedCount);
    } else {
      updateCurrentPageItems(unResolvedData, unResolvedCount);
    }
  }, [paginationModel, showResolved, resolvedData, unResolvedData]);

  useEffect(() => {
    setViewSelectedData(false);
    setSelectedData(null);
  }, [showResolved]);

  return (
    <div className="admin_contactus_outer_container">
      {/* add admin dashbaord menu */}
      <AdminDashboardMenu />

      <div className="admin_contactus_inner_container">
        <h1>Contact Us</h1>

        <h3>View and resolve incoming requests from Contact Us</h3>

        <button
          className={`${showResolved ? 'resolve_contactus_tickets_active' : ''} 
            resolve_contactus_tickets_switch`}
          onClick={switchBetweenData}
        >
          Resolved Tickets
        </button>

        {/* display the information of the selected submission */}
        {viewSelectedData === true && (
          <div className="admin_submission_view_data">
            <p>
              <span className="field_name">Phone: </span>
              {selectedData?.phone}
            </p>

            <p>
              <span className="field_name">Email: </span>
              {selectedData?.email}
            </p>

            <p>
              <span className="field_name">Message: </span>
              {selectedData?.message}
            </p>

            <p>
              <span className="field_name">Status: </span>
              {selectedData.status}

              {selectedData.status === 'pending' && (
                <button
                  className="resolve_tickets_btn"
                  onClick={() => resolveTicket(selectedData)}
                >
                  Resolve
                </button>
              )}
            </p>
          </div>
        )}

        <div className="admin_contactus_data_grid">
          <DataGrid
            getRowId={(row) => row._id}
            rows={currPageData}
            columns={columns}
            rowCount={showResolved ? resolvedCount : unResolvedCount}
            onRowClick={viewData}
            // props for implementing pagination
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 15, 20]}
            // additional features
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

export default ContactUs;
