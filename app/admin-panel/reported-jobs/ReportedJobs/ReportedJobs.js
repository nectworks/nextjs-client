'use client';
/*
  File: ReportedJobs.js
  Description: All the reported jobs are listed in this page and could be
  reviewed in the admin panel
*/

import { useCallback, useEffect, useState } from 'react';
import showBottomMessage from '@/Utils/showBottomMessage';
import { privateAxios } from '@/config/axiosInstance';
import './ReportedJobs.css';
import AdminDashboardMenu from '../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import profileLinkIcon from '@/public/Profile/otherLinkIcon.svg';
import Link from 'next/link';
import { LinearProgress } from '@mui/material';

function ReportedJobs() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [viewSelectedData, setViewSelectedData] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const [showResolved, setShowResolved] = useState(false);

  // state required for pagination
  const [currPageData, setCurrPageData] = useState([]);
  const [reportCount, setReportCount] = useState(-1);
  const [nextPageRef, setNextPageRef] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  // function to fetch data from the api.
  async function fetchData() {
    setIsLoading(true);

    try {
      const res = await privateAxios.get('/admin/data/reports', {
        params: {
          page: paginationModel.page,
          limit: paginationModel.pageSize,
          prevDocId: nextPageRef,
        },
      });

      const { data, count, next } = res.data;

      setData((prevData) => [...prevData, ...data]);
      setNextPageRef(next);
      setReportCount(count);
    } catch (error) {
      const { message } = error?.response?.data || '';
      showBottomMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  const updateCurrPageItems = useCallback(() => {
    const pageStart = paginationModel.page * paginationModel.pageSize;
    const pageEnd = pageStart + paginationModel.pageSize;

    if (
      reportCount === -1 ||
      (data.length - 1 < pageEnd - 1 && data.length < reportCount)
    ) {
      fetchData();
    } else {
      setCurrPageData(data.slice(pageStart, pageEnd));
    }
  }, [data, fetchData]);

  // function to view selected data.
  function viewData({ row }) {
    setViewSelectedData(true);
    setSelectedData(row);
  }

  // function to delete a report
  async function deleteReport() {
    const reportId = selectedData._id;

    try {
      privateAxios.delete(`/admin/reports/${reportId}`);
      showBottomMessage(`Report with id '${reportId}' deleted`);

      setViewSelectedData(false);
      setSelectedData(null);

      // remove the report from the state
      const updatedReports = data.filter((report) => {
        return report._id !== reportId;
      });
      setData(updatedReports);
    } catch (error) {
      showBottomMessage(`Couldn't delete report`);
    }
  }

  // function to remove profile of a user
  async function removeProfile() {
    const user = selectedData.referralId?.userId;

    // if the user is unregistered user, show message and return
    if (user === null) {
      showBottomMessage(`User doesn't have a profile yet.`);
      return;
    }

    try {
      const userId = user._id;
      await privateAxios.delete(`/admin/users/${userId}`);

      // clear the data in the state
      setViewSelectedData(false);
      setSelectedData(null);

      // update the reports in the state
      const reportId = selectedData._id;
      const updatedReports = data.filter((report) => {
        return report._id !== reportId;
      });
      setData(updatedReports);
    } catch (error) {
      showBottomMessage(`Couldn't delete user profile`);
    }
  }

  // columns for the data grid
  const mainDataGridColumns = [
    {
      field: '_id',
      headerName: 'REPORT ID',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'professionalUserId',
      headerName: 'REFERRER',
      width: 250,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        const username = row?.referralId?.professionalUserId?.username;
        const userProfileUrl = `/admin-panel/view-user?username=${username}`;

        return (
          <Link href={userProfileUrl} target="_blank">
            {username}
          </Link>
        );
      },
    },
    {
      field: "seeker's profile",
      headerName: 'SEEKER PROFILE',
      width: 250,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        if (row.referralId === null) return '-';

        const user = row.referralId.userId;
        const userProfileUrl = `/admin-panel/view-user?username=${user?.username}`;

        if (user === null) return row?.referralId?.unRegisteredUserId || '';

        return (
          <Link href={userProfileUrl} target="_blank">
            {user?.username}
          </Link>
        );
      },
    },
    {
      field: 'title',
      headerName: 'ACTION TAKEN',
      width: 250,
      headerAlign: 'center',
      align: 'center',
    },
  ];

  useEffect(() => {
    updateCurrPageItems();
  }, [paginationModel, data, updateCurrPageItems]);

  return (
    <div className="admin_reports_outer_container">
      <AdminDashboardMenu />

      <div className="admin_reports_inner_container">
        <h1>Reported Jobs</h1>
        <h3>View and resolve incoming report requests</h3>

        <button
          className={`${showResolved ? 'resolve_reported_tickets_active' : ''} 
            resolve_reported_tickets_switch`}
          onClick={() => setShowResolved((prevState) => !prevState)}
        >
          Resolved Tickets
        </button>

        {/* display selected report */}
        {viewSelectedData === true && (
          <div className="admin_report_submission_data">
            <h4>Job details</h4>

            <div className="admin_report_job_details">
              {selectedData?.referralId?.jobsAskedForReferral?.jobDetails.map(
                (job) => {
                  return (
                    <div key={job._id}>
                      <p>
                        <span>Job ID: </span>
                        {job.jobId || '-'}
                      </p>
                      <p>
                        <span>Job URL: </span>
                        {job.jobUrl || '-'}
                      </p>
                    </div>
                  );
                }
              )}
            </div>

            <p>
              <span>Description: </span>
              {selectedData?.description || '-'}
            </p>

            <div className="admin_report_actions">
              <button onClick={deleteReport}>Delete Report</button>
              <button onClick={removeProfile}>Remove Profile</button>
            </div>
          </div>
        )}

        {/* data grid */}
        <div className="admin_reported_jobs_data_grid">
          <DataGrid
            rows={currPageData}
            columns={mainDataGridColumns}
            getRowId={(row) => row._id}
            onRowClick={viewData}
            rowCount={reportCount}
            paginationMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
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
      </div>
    </div>
  );
}

export default ReportedJobs;
