'use client';

import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';

const adminGridStyles = {
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
};

export default function AdminDataGrid({ sx, slots, ...props }) {
  return (
    <DataGrid
      {...props}
      slots={{
        toolbar: GridToolbar,
        loadingOverlay: LinearProgress,
        ...slots,
      }}
      sx={{
        ...adminGridStyles,
        ...sx,
      }}
    />
  );
}
