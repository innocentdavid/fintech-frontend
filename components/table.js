



import React, { useCallback, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
  Box,
  Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
// import   data from './makeData';

const Table = () => {

  const data= [
    { application_id :1, name_of_business:'Fajumo', legal_business_name:'first'}
  ]

  const [tableData, setTableData] = useState(() => data);
  

  const columns = [
    {
      "application_id":1,
      "date_submitted":"2023-05-03T08:30:00Z",
      "status":"SD",
      "name_of_business": "ABC Corporation",
      "legal_business_name":"ABC Corporation LLC",
      "oweners":"John Doe, Jane Doe",
      "users_cash_advance":true,
      "have_cash_advance":true,
      "credit_score":750,
      "business_name_match": false
     }
  ]


  return (
    <>
      <MaterialReactTable
        displayColumnDefOptions={{
          'mrt-row-actions': {
            muiTableHeadCellProps: {
              align: 'center',
            },
            size: 120,
          },
        }}
        columns={columns}
        data={tableData}
        editingMode="modal" //default
        enableColumnOrdering
        enableEditing
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem' }}>
            <Tooltip arrow placement="left" title="Edit">
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
            </Tooltip>
          </Box>
        )}
        />
          
    </>
  )
}

export default Table;
