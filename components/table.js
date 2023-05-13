import React, { useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LoadingModal from './LoadingModal ';

const Table = ({ data, page, applicationsLoading }) => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!data.length>0) return;
        const list = []
        data.forEach(item => {
            const funder = item.funder
            const d = { ...item, funder_name: funder?.name}
            list.push(d)
        });
        setTableData(list)
    }, [data])


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

    var columns = useMemo(
        () => [
            {
                accessorKey: 'count',
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

    const handleRoswClick = (e) => {
        setLoading(true)
        var p = page || 'application'
        if(page){
            router.push(`${p}/${e.submittedApplication_id}`)
        }else{
            router.push(`application/${e.application_id}`)
        }
    }

    return (
        <div className='relative'>
            {/* <LoadingModal loading={loading || applicationsLoading} /> */}
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
                enableEditing={false}
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
                muiTableBodyRowProps={({ row }) => {
                    return ({
                        onClick: () => handleRoswClick(row.original),
                        sx: { cursor: 'pointer' },
                    })
                }}
                renderTopToolbarCustomActions={() => (
                    <div className="flex items-center gap-3">
                        {!page && <Link href="/createnew" className="bg-black text-white py-2 px-4 rounded-lg text-xs md:text-base">Add New Application</Link>}
                        {applicationsLoading && <div className="animate-pulse tracking-[1em]">Loading...</div>}
                    </div>
                )}
            />
        </div>
    );
};

export default Table;