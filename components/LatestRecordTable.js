import React, { useEffect, useMemo, useState } from 'react';
import MaterialReactTable from 'material-react-table';
import LoadingModal from './LoadingModal ';

const LatestRecordTable = ({ data, page }) => {
    const [tableData, setTableData] = useState(() => data);
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!data.length > 0) return;
        setTableData(data)
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
                accessorKey: 'epoch',
                header: 'Epoch',
                size: 140,
            },
            {
                accessorKey: 'timestamp',
                header: 'Timestamp',
                size: 140,
            },
            {
                accessorKey: 'last_email_id',
                header: 'Last Email',
                size: 140,
            },
            {
                accessorKey: 'last_thread_id',
                header: 'Last Thread',
                size: 140,
            },
            {
                accessorKey: 'subject',
                header: 'Subject',
                size: 140,
            }
        ],
        [],
    );

    return (
        <>
            <LoadingModal loading={loading} />
            
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
                enableEditing={false}
                onEditingRowSave={handleSaveRowEdits}
                onEditingRowCancel={handleCancelRowEdits}
            />
        </>
    );
};

export default LatestRecordTable;