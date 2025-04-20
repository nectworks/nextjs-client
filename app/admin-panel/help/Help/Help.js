'use client';
/*
  File: Help.js
  Description: This page contains UI to view and resolve all the issues
  faced and submitted by users at 'help' page.
*/

import { useEffect, useState } from 'react';
import './Help.css';
import Image from 'next/image';
import showBottomMessage from '@/Utils/showBottomMessage';
import { privateAxios } from '@/config/axiosInstance';
import AdminDashboardMenu from '../../../_components/AdminDashboardMenu/AdminDashboardMenu';
import documentLinkIcon from '@/public/Profile/documentLinkIcon.svg';
import Link from 'next/link';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LinearProgress } from '@mui/material';

function Help() {
    const [data, setData] = useState(null);

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

    const [isLoading, setIsLoading] = useState(false);

    const [viewSelectedData, setViewSelectedData] = useState(false);
    const [selectedData, setSelectedData] = useState(null);
    const [showResolved, setShowResolved] = useState(false);

    // function to fetch data from the server
    async function fetchData() {
        setIsLoading(true);

        try {
            const url = `/admin/data/help`;
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
            showBottomMessage(`Couldn't fetch data`);
        } finally {
            setIsLoading(false);
        }
    }

    // function to view data on click
    function viewData({ row }) {
        setSelectedData(row);
        setViewSelectedData(true);
    }

    // function to switch between resolved/unresolved tickets
    function switchBetweenData() {
        setPaginationModel({
            pageSize: 5,
            page: 0,
        });
        setShowResolved((prevState) => !prevState);
    }

    // function to format date and time
    function formatDate(dateStr) {
        const date = new Date(dateStr);

        const formatDate = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        const formatTime = `${date.getHours().toString().padStart(2, '0')}:
        ${date.getMinutes().toString().padStart(2, '0')}`;

        return formatDate + ' ' + formatTime;
    }

    // function to resolve help submission
    async function resolveHelp() {
        const helpId = selectedData._id;

        try {
            const url = '/admin/help/resolve';
            await privateAxios.post(url, { helpId });

            setViewSelectedData(false);
            setSelectedData(null);
            showBottomMessage(`Successfully resolved issue with id '${helpId}'`);

            const updatedData = data.map((obj, idx) => {
                if (obj._id === helpId) {
                    return { ...obj, status: 'resolved' };
                }
                return obj;
            });
            setData(updatedData);
        } catch (error) {
            showBottomMessage(`Couldn't resolve submission`);
        }
    }

    // define columns for the data grid
    const helpDataCols = [
        {
            field: '_id',
            headerName: 'SUBMISSION ID',
            width: 220,
            headerAlign: 'center',
            align: 'center',
        },
        {
            field: 'userId',
            headerName: 'USER ID',
            width: 220,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => {
                const username = row?.userId?.username;
                const url = `/admin-panel/view-user?username=${username}`;

                return (
                    <Link className="link_to_user_profile" href={url} target="_blank">
                        {row?.userId?._id}
                    </Link>
                );
            },
        },
        {
            field: 'heading',
            headerName: 'TITLE',
            width: 300,
            headerAlign: 'center',
            align: 'center',
            valueGetter: ({ row }) => {
                return row.heading;
            },
        },
        {
            field: 'attachment',
            headerName: 'ATTACHMENT',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            renderCell: ({ row }) => {
                const attachmentUrl = row.attachment?.url || null;

                if (!attachmentUrl) return '-';

                return (
                    <Link href={attachmentUrl} target="_blank">
                        <Image src={documentLinkIcon} alt="" />
                    </Link>
                );
            },
        },
    ];

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
        <div className="admin_help_outer_container">
            <AdminDashboardMenu />

            <div className="admin_help_inner_container">
                <h1>Help</h1>
                <h3>View help submission here</h3>

                <button
                    className={`${showResolved ? 'resolve_help_tickets_active' : ''}
            resolve_help_tickets_switch`}
                    onClick={switchBetweenData}
                >
                    Resolved Tickets
                </button>

                {/* display selected row */}
                {viewSelectedData === true && (
                    <div className="admin_help_selected_data">
                        <p>
                            <span>Heading : </span>
                            {selectedData.heading || ''}
                        </p>

                        <p>
                            <span>Description : </span>
                            {selectedData.description || ''}
                        </p>

                        <p>
                            <span>Date : </span>
                            {formatDate(selectedData.date)}
                        </p>

                        <p>
                            <span>Status : </span>
                            {selectedData.status}
                        </p>

                        <button onClick={resolveHelp}>Resolve</button>
                    </div>
                )}

                {/* display data in grid */}
                <div className="admin_help_data_grid">
                    <DataGrid
                        getRowId={(row) => row._id}
                        rows={currPageData}
                        columns={helpDataCols}
                        onRowClick={viewData}
                        rowCount={showResolved ? resolvedCount : unResolvedCount}
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

export default Help;
