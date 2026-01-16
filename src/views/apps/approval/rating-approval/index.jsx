'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
// import approvalService from '@/services/approval/approval.service'
import businessRating from '@/services/rating/rating.service'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel
} from '@tanstack/react-table'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import tableStyles from '@core/styles/table.module.css'
import { IconButton } from '@mui/material'
import { toast } from 'react-toastify'
import ViewRatingApproval from '@/components/dialogs/rating-approval/index';

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const searchValue = value.toLowerCase();

    // Define which fields to search and their accessors
    const searchFields = [
        row.original.vendorId?.toString().toLowerCase() || '',
        row.original?.companyInfo?.companyName?.toLowerCase() || '',
        row.original?.contactInfo?.email?.toLowerCase() || '',
        row.original?.contactInfo?.phoneNo?.toString().toLowerCase() || '',
        row.original.companyInfo?.businessCategory?.name?.toLowerCase() || '',
        row.original.locationInfo?.city?.toLowerCase() || '',
        row.original.status?.toLowerCase() || ''
    ];

    // Check if any field contains the search value
    const passed = searchFields.some(field => field.includes(searchValue));

    addMeta({
        itemRank: passed ? 1 : 0
    });

    return passed;
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

// Column Definitions
const columnHelper = createColumnHelper()

const ImagesApprovalTable = () => {

    const [status, setStatus] = useState('All')
    const [rowSelection, setRowSelection] = useState({})
    const [allData, setAllData] = useState([])
    const [data, setData] = useState(allData)
    const [globalFilter, setGlobalFilter] = useState('')
    const [showData, setShowData] = useState(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        getAllBusiness();
    }, [])

    const productStatusObj = {
        APPROVED: { title: 'APPROVED', color: 'success' },
        PENDING: { title: 'PENDING', color: 'warning' },
        REJECTED: { title: 'REJECTED', color: 'error' },
    };

    const getAllBusiness = async (req, res) => {
        try {
            const response = await businessRating.getRatingByType("PENDING")
            setData(response.data)

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Something went wrong";
            toast.error(errorMessage);
        }
    }

    const handleViewBusiness = (data) => {
        setShowData(data)
        setOpen(true)
    }

    const columns = useMemo(
        () => [
            columnHelper.accessor('businessName', {
                header: 'Business Name',
                cell: ({ row }) => (
                    <div className='flex items-center gap-4'>
                        <div className='flex flex-col items-start'>
                            <Typography variant='body2'>{row.original?.businessId?.companyInfo?.companyName || "N/A"}</Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('name', {
                header: 'User Name',
                cell: ({ row }) => (
                    <div className='flex items-center gap-4'>
                        <div className='flex flex-col items-start'>
                            <Typography variant='body2'>{`${row.original?.userId?.firstName || "N/A"} ${row.original?.userId?.lastName || "N/A"}`}</Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('rating', {
                header: 'Rating',
                cell: ({ row }) => (
                    <div className='flex items-center gap-4'>
                        <div className='flex flex-col items-start'>
                            <Typography variant='body2'>{row.original?.rating || "N/A"}</Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: ({ row }) => (
                    <Chip
                        label={productStatusObj[row.original.status].title}
                        variant='tonal'
                        color={productStatusObj[row.original.status].color}
                        size='small'
                    />
                )
            }),
            columnHelper.accessor('actions', {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex items-center'>
                        <IconButton onClick={() => handleViewBusiness(row.original)}>
                            <i className='tabler-eye text-blue-500' />
                        </IconButton>
                    </div>
                ),
                enableSorting: false
            })
        ],
        [data]
    )

    const table = useReactTable({
        data: data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter
        },
        state: {
            rowSelection,
            globalFilter
        },
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        enableRowSelection: true,
        globalFilterFn: fuzzyFilter,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues()
    })

    useEffect(() => {
        setData(data)
    }, [status, allData, setData])

    return (
        <>
            <Card>
                <div className='flex flex-wrap justify-between gap-4 p-6'>
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        placeholder='Search List Here'
                        className='max-sm:is-full'
                    />
                    <div className='flex max-sm:flex-col sm:items-center gap-4 max-sm:is-full'>
                        <CustomTextField
                            select
                            value={table.getState().pagination.pageSize}
                            onChange={e => table.setPageSize(Number(e.target.value))}
                            className='sm:is-[140px] flex-auto is-full'
                        >
                            <MenuItem value='10'>10</MenuItem>
                            <MenuItem value='25'>25</MenuItem>
                            <MenuItem value='50'>50</MenuItem>
                        </CustomTextField>
                        <Button
                            variant='tonal'
                            className='max-sm:is-full'
                            startIcon={<i className='tabler-upload' />}
                            color='secondary'
                        >
                            Export
                        </Button>
                    </div>
                </div>
                <div className='overflow-x-auto'>
                    <table className={tableStyles.table}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <>
                                                    <div
                                                        className={classnames({
                                                            'flex items-center': header.column.getIsSorted(),
                                                            'cursor-pointer select-none': header.column.getCanSort()
                                                        })}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                        {{
                                                            asc: <i className='tabler-chevron-up text-xl' />,
                                                            desc: <i className='tabler-chevron-down text-xl' />
                                                        }[header.column.getIsSorted()] ?? null}
                                                    </div>
                                                </>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        {table.getFilteredRowModel().rows.length === 0 ? (
                            <tbody>
                                <tr>
                                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                                        No data available
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {table
                                    .getRowModel()
                                    .rows.slice(0, table.getState().pagination.pageSize)
                                    .map(row => {
                                        return (
                                            <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                                                {row.getVisibleCells().map(cell => (
                                                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                                ))}
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        )}
                    </table>
                </div>
                <TablePagination
                    component={() => <TablePaginationComponent table={table} />}
                    count={table.getFilteredRowModel().rows.length}
                    rowsPerPage={table.getState().pagination.pageSize}
                    page={table.getState().pagination.pageIndex}
                    onPageChange={(_, page) => {
                        table.setPageIndex(page)
                    }}
                />
            </Card>
            <ViewRatingApproval open={open} setOpen={setOpen} data={showData} onSuccess={getAllBusiness} />
        </>
    )
}

export default ImagesApprovalTable
