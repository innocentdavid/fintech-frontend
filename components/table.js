import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import { useRouter } from 'next/router';
// import { data, states } from './makeData';

const Table = ({ data, page }) => {
    const router = useRouter()
    const [tableData, setTableData] = useState(() => data);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        if (!data.length > 0) return;
        const list = []
        data.forEach(item => {
            const funder = item.funder
            const id = item.count
            const d = { ...item, id, funder_name: funder?.name }
            list.push(d)
        });
        setTableData(list)
    }, [data])

    const handleSaveRowEdits = async ({ exitEditingMode, row, values }) => {
        if (!Object.keys(validationErrors).length) {
            tableData[row.index] = values;
            //send/receive api updates here, then refetch or update local table data for re-render
            setTableData([...tableData]);
            exitEditingMode(); //required to exit editing mode and close modal
        }
    };

    const handleCancelRowEdits = () => {
        setValidationErrors({});
    };

    const handleDeleteRow = useCallback(
        (row) => {
            const application_id = row.getValue('application_id')
            console.log(application_id);
            if (
                !confirm(`Are you sure you want to delete ${row.getValue('application_id')}`)
            ) {
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render
            tableData.splice(row.index, 1);
            setTableData([...tableData]);
        },
        [tableData],
    );

    var columns = useMemo(
        () => [
            {
                accessorKey: 'id',
                header: 'ID',
                enableColumnOrdering: false,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 80,
            },
            {
                accessorKey: 'funder_name',
                header: 'Funder',
                size: 140,
                hidden: page ? true : false,
            },
            {
                accessorKey: 'date_submitted',
                header: 'Date Submitted',
                size: 140,
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 140,
            },
            {
                accessorKey: 'status_date',
                header: 'Status Date',
                size: 140,
            },
            {
                accessorKey: 'name_of_business',
                header: 'Name Of Business',
                size: 140,
                // muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                //     ...getCommonEditTextFieldProps(cell),
                //     type: 'email',
                // }),
            },
            {
                accessorKey: 'legal_business_name',
                header: 'Legal Business Name',
                size: 140,
            },
            {
                accessorKey: 'owners',
                header: 'Owners',
                size: 140,
            },
            {
                accessorKey: 'has_open_cash_advances',
                header: 'Open Cash Advance',
                size: 140,
            },
            {
                accessorKey: 'has_used_cash_advance_plan_before',
                header: 'Have Used Cash Advance',
                size: 200,
            },
            {
                accessorKey: 'credit_score',
                header: 'Credit Score',
                size: 140,
            },
            {
                accessorKey: 'business_name_match_flag',
                header: 'Business Name Match Flag',
                size: 250,
            },
        ],
        [page],
    );

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
                initialState={{ columnVisibility: { funder_name: page ? true : false } }}
                editingMode="modal" //default
                enableColumnOrdering
                enableEditing
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                renderRowActions={({ row, table }) => (
                    <Box sx={{ display: 'flex', gap: '1rem' }}>
                        {!page && <Tooltip arrow placement="left" title="Edit">
                            <IconButton onClick={() => {
                                router.push(`/edit/${row.original.application_id}`)
                                }}>
                                <Edit />
                            </IconButton>
                        </Tooltip>}
                        <Tooltip arrow placement="right" title="Delete">
                            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="left" title="View">
                            <IconButton onClick={() => {
                                var p = page || 'application'
                                if (page) {
                                    router.push(`${p}/${row?.original?.submittedApplication_id}`)
                                } else {
                                    router.push(`application/${row?.original?.application_id}`)
                                }
                            }}>
                                <FiExternalLink />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                renderTopToolbarCustomActions={() => (
                    <div className="flex items-center gap-3">
                        {!page && <div className='rippleButton ripple cursor-pointer'><Link href="/createnew" className="">Add New Application</Link></div>}
                    </div>
                )}
            />
        </>
    );
};

export default Table;