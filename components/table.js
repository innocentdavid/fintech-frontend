import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import {
    Box,
    Button,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Link from 'next/link';
import { FiExternalLink } from 'react-icons/fi';
import { BsSpeedometer2 } from 'react-icons/bs';
import { useRouter } from 'next/router';
import axios from 'axios';
import LoadingModal from './LoadingModal ';
import { getCookie } from '../utils/helpers';
// import { data, states } from './makeData';

const Table = ({ data, page, setRefreshData }) => {
    const router = useRouter()
    const [tableData, setTableData] = useState(() => data);
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const [showCreditScoreModal, setShowCreditScoreModal] = useState(false)
    const [appToCalcScore, setAppToCalcScore] = useState({ application_id: '', credit_score: '' })
    const [getScoreRes, setGetScoreRes] = useState({ error: '', credit_score: '' })

    useEffect(() => {
        if (!data.length > 0) return;
        const list = []
        data.forEach(item => {
            const funder = item.funder
            const id = page ? item?.application?.count : item.count
            const d = { ...item, id, funder_name: funder?.name }
            list.push(d)
        });
        setTableData(list)
    }, [data, page])

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
        async (row) => {
            if (!confirm(`Are you sure you want to delete this data?`)) return;
            setLoading(true)
            //send api delete request here, then refetch or update local table data for re-render
            var url = page ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/submittedApplications/${row.original.submittedApplication_id}/` : `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/${row.original.application_id}/`;
            var res = await axios.delete(url, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getCookie('jwt')}`, }, withCredentials: true }).catch(err => console.log(err))
            // console.log(res);
            if (res?.status === 204) {
                tableData.splice(row.index, 1);
                setTableData([...tableData]);
                setLoading(false)
            }
            setLoading(false)
        },
        [page, tableData],
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
            <LoadingModal loading={loading} />

            <div className={`${!showCreditScoreModal ? "opacity-0 pointer-events-none" : "fixed top-0 left-0 w-full h-screen z-10 grid place-items-center"}`} style={{
                transition: 'opacity .15s ease-in-out'
            }}>
                <div className="fixed top-0 left-0 w-full h-screen bg-black/20" onClick={() => {
                    setGetScoreRes({ credit_score: '', error: '' })
                    setShowCreditScoreModal(false)
                }}></div>
                <div className="absolute z-10">
                    <div className="p-10 rounded-xl bg-white text-black">
                        <p className="">Do you want to calculate the Score?</p>

                        {!getScoreRes?.error && <p className="mt-5">SCORE: {getScoreRes?.credit_score ? getScoreRes?.credit_score : appToCalcScore.credit_score}</p>}
                        {getScoreRes?.error && <p className="mt-5">ERROR: {getScoreRes?.error}</p>}

                        <div className="flex items-center justify-between mt-5">
                            <div className="rippleButton ripple cursor-pointer !bg-red-600"
                                onClick={() => {
                                    setGetScoreRes({ credit_score: '', error: ''})
                                    setShowCreditScoreModal(false)
                                }}
                            >Close</div>
                            {!getScoreRes?.credit_score && <div className="rippleButton ripple cursor-pointer !bg-blue-600"
                                onClick={async () => {
                                    setLoading(true);
                                    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/get_score/${appToCalcScore.application_id}/`, {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${getCookie('jwt')}`
                                        },
                                        withCredentials: true,
                                    })
                                        .catch((error) => {
                                            console.log(error);
                                            alert(error?.response?.statusText)
                                            setGetScoreRes({ error: error?.response?.statusText })
                                            setLoading(false);
                                            return;a
                                        })
                                    if (res && res?.status === 200) {
                                        // console.log(res);
                                        setGetScoreRes(res?.data)
                                        setRefreshData(true)
                                    }
                                    setLoading(false);
                                }}
                            >Ok</div>}
                        </div>
                    </div>
                </div>
            </div>

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
                options={{
                    sorting: true,
                    defaultSort: 'desc', // 'asc' for ascending, 'desc' for descending
                    defaultSortField: page ? 'date_submitted' : 'id',
                    sortingOrder: ['desc', 'asc'],
                    // ... other options
                }}
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
                        {!page && <Tooltip arrow placement="left" title="score">
                            <IconButton onClick={() => {
                                setShowCreditScoreModal(true);
                                setAppToCalcScore({ application_id: row.original.application_id, credit_score: row.original.credit_score });
                            }}>
                                <BsSpeedometer2 />
                            </IconButton>
                        </Tooltip>}
                        <Tooltip arrow placement="left" title="Delete">
                            <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                                <Delete />
                            </IconButton>
                        </Tooltip>
                        <Tooltip arrow placement="right" title="View">
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
                        {!page && <Link href="/createnew" className="rippleButton ripple cursor-pointer">Add New Application</Link>}
                    </div>
                )}
            />
        </>
    );
};

export default Table;