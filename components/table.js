import React, { useCallback, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import { data } from './makeData.js';
import Link from 'next/link.js';
import { useRouter } from 'next/router.js';

const Table = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState(() => data);
    const [validationErrors, setValidationErrors] = useState({});

    const router = useRouter()

    const handleCreateNewRow = (values) => {
        tableData.push(values);
        setTableData([...tableData]);
    };

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
            if (
                !confirm(`Are you sure you want to delete ${row.getValue('firstName')}`)
            ) {
                return;
            }
            //send api delete request here, then refetch or update local table data for re-render
            tableData.splice(row.index, 1);
            setTableData([...tableData]);
        },
        [tableData],
    );

    const getCommonEditTextFieldProps = useCallback(
        (cell) => {
            return {
                error: !!validationErrors[cell.id],
                helperText: validationErrors[cell.id],
                onBlur: (event) => {
                    const isValid =
                        cell.column.id === 'email'
                            ? validateEmail(event.target.value)
                            : cell.column.id === 'age'
                                ? validateAge(+event.target.value)
                                : validateRequired(event.target.value);
                    if (!isValid) {
                        //set validation error for cell if invalid
                        setValidationErrors({
                            ...validationErrors,
                            [cell.id]: `${cell.column.columnDef.header} is required`,
                        });
                    } else {
                        //remove validation error for cell if valid
                        delete validationErrors[cell.id];
                        setValidationErrors({
                            ...validationErrors,
                        });
                    }
                },
            };
        },
        [validationErrors],
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'application_id',
                header: 'ID',
                enableColumnOrdering: false,
                disableColumnMenu: true,
                enableEditing: false, //disable editing on this column
                enableSorting: false,
                size: 80,
            },
            {
                accessorKey: 'date_submitted',
                header: 'Date Submitted',
                size: 140,
                muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
                    ...getCommonEditTextFieldProps(cell),
                }),
            },
            {
                accessorKey: 'status',
                header: 'Status',
                size: 140,
            },
            {
                accessorKey: 'name_of_business',
                header: 'Name Of Business',
                size: 140,
            },
            {
                accessorKey: 'status_date',
                header: 'Status Date',
                size: 140,
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
                accessorKey: 'users_cash_advance',
                header: 'Users Cash Advance',
                size: 140,
            },
            {
                accessorKey: 'have_cash_advance',
                header: 'Have Cash Advance',
                size: 140,
            },
            {
                accessorKey: 'credit_score',
                header: 'Credit Score',
                size: 140,
            },
            {
                accessorKey: 'business_name_match_flag',
                header: 'Business Name Match Flag',
                size: 240,
            }
        ],
        [getCommonEditTextFieldProps],
    );

    const renderRow = (row, index, columns, highlighted) => {
        const rowProps = {
            key: row.id,
            style: {
                backgroundColor: highlighted ? '#EEE' : '#FFF'
            },
        };
        return (
            <Link to={`/application/${row.id}`} style={{ textDecoration: 'none' }}>
                <MaterialReactTable.Row {...rowProps}>
                    {columns.map((column, columnIndex) => {
                        const cellProps = {
                            key: `${columnIndex}-${column.field}`,
                        };
                        return (
                            <MaterialReactTable.Cell key={index} {...cellProps}>
                                {row[column.field]}
                            </MaterialReactTable.Cell>
                        );
                    })}
                </MaterialReactTable.Row>
            </Link>
        );
    };

    const handleRowClick = (e) => {
        router.push(`/application/${e?.application_id}`)
    };


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
                disableColumnMenu
                enableEditing={false}
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                onRowClick={handleRowClick}
                muiTableBodyRowProps={({ row }) => {
                    return ({
                    // onClick: row.getToggleSelectedHandler(),
                    onClick: () => handleRowClick(row.original),
                    sx: { cursor: 'pointer' },
                })}}
                // renderRowActions={({ row, table }) => (
                //     <Box sx={{ display: 'flex', gap: '1rem' }}>
                //         {/* <Tooltip arrow placement="left" title="Edit">
                //             <IconButton onClick={() => table.setEditingRow(row)}>
                //                 <Edit />
                //             </IconButton>
                //         </Tooltip> */}
                //         <Tooltip arrow placement="right" title="Delete">
                //             <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                //                 <Delete />
                //             </IconButton>
                //         </Tooltip>
                //     </Box>
                // )}
                renderTopToolbarCustomActions={() => (
                    <Link href="/add" className="bg-black text-white py-2 px-4 rounded-lg">Add New Application</Link>
                )}
            />
            <CreateNewAccountModal
                columns={columns}
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSubmit={handleCreateNewRow}
            />
        </>
    );
};

//example of creating a mui dialog modal for creating new rows
export const CreateNewAccountModal = ({ open, columns, onClose, onSubmit }) => {
    const [values, setValues] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );

    const handleSubmit = () => {
        //put your validation logic here
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open}>
            <DialogTitle textAlign="center">Create New Account</DialogTitle>
            <DialogContent>
                <form onSubmit={(e) => e.preventDefault()}>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >
                        {columns.map((column) => (
                            <TextField
                                key={column.accessorKey}
                                label={column.header}
                                name={column.accessorKey}
                                onChange={(e) =>
                                    setValues({ ...values, [e.target.name]: e.target.value })
                                }
                            />
                        ))}
                    </Stack>
                </form>
            </DialogContent>
            <DialogActions sx={{ p: '1.25rem' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="secondary" onClick={handleSubmit} variant="contained">
                    Create New Account
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const validateRequired = (value) => !!value.length;

const validateEmail = (email) =>
    !!email.length &&
    email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        );
const validateAge = (age) => age >= 18 && age <= 50;

export default Table;
