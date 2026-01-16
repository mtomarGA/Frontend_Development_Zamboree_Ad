'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useRouter } from 'next/navigation'

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

import ViewEnquiryDetail from '@/components/dialogs/view-enquiry/index.jsx'
// Import Services
import businessEnquiry from "@/services/enquiry/businessEnquiry"

import tableStyles from '@core/styles/table.module.css'
import dayjs from 'dayjs'


const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
        itemRank
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const productStatusObj = {
    PENDING: { title: 'Pending', color: 'warning' },
    COMPLETED: { title: 'ACTIVE', color: 'success' },
    REJECTED: { title: 'INACTIVE', color: 'error' },
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    // States
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

const DoneEnquiryTable = () => {
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [showData, setShowData] = useState(null)
    const [open, setOpen] = useState(false)

    const statusObj = {
        INACTIVE: { title: 'INACTIVE', color: 'warning' },
        ACTIVE: { title: 'ACTIVE', color: 'success' }
    }
    console.log(data, "data data data");

    useEffect(() => {
        handleGetAllEnq()
    }, [])


    const handleViewEnquiry = data => {
        setShowData(data)
        setOpen(true)
    }

    const handleGetAllEnq = async () => {
        const res = await businessEnquiry.getDoneEnquiry()
        setData(res?.data)
    }

    const columns = useMemo(() => [
        columnHelper.display({
            id: 'index',
            header: 'S.No.',
            cell: ({ table, row }) => {
                const pageIndex = table.getState().pagination.pageIndex
                const pageSize = table.getState().pagination.pageSize
                const rowsInPage = table.getRowModel().rows
                const currentRowIndex = rowsInPage.findIndex(r => r.id === row.id)
                return <Typography>{pageIndex * pageSize + currentRowIndex + 1}</Typography>
            }
        }),
        columnHelper.accessor(row => row.leadId ?? '', {
            id: 'leadId',
            header: 'Lead Id',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor(row => row.userId?.userId ?? '', {
            id: 'userId',
            header: 'User Id',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor(row => `${row.userId?.firstName ?? ''} ${row.userId?.lastName ?? ''}`, {
            id: 'userName',
            header: 'User Name',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor(row => row.userId?.email ?? '', {
            id: 'userEmail',
            header: 'User Email',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor(row => row.userId?.phone ?? '', {
            id: 'userPhone',
            header: 'User Phone',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor(row => row.businessId?.vendorId ?? '', {
            id: 'businessId',
            header: 'Business Id',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor(row => row.businessId?.companyInfo?.companyName ?? '', {
            id: 'businessName',
            header: 'Business Name',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor(row => dayjs(row.createdAt).format("DD MMM YYYY, hh:mm A"), {
            id: 'leadDate',
            header: 'Lead Date',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: ({ row }) => {
                const statusValue = row.original.status;
                const status = statusValue ? productStatusObj[statusValue] : null;
                console.log(status, "statusstatus");

                if (!status) return null; // or return some default component

                return (
                    <Chip
                        label={status.title}
                        variant='tonal'
                        color={status.color}
                        size='small'
                    />
                )
            }
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <IconButton onClick={() => handleViewEnquiry(row.original)}>
                    <i className='tabler-binoculars' />
                </IconButton>
            ),
            enableSorting: false
        })
    ], [data])


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
        enableRowSelection: true, //enable row selection for all rows
        // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
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

    return (
        <>
            <Card>
                <div className='flex flex-wrap justify-between gap-4 p-6'>
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        placeholder='Search'
                        className='max-sm:is-full'
                    />
                    <div className='flex max-sm:flex-col items-start sm:items-center gap-4 max-sm:is-full'>
                        <CustomTextField
                            select
                            value={table.getState().pagination.pageSize}
                            onChange={e => table.setPageSize(Number(e.target.value))}
                            className='flex-auto max-sm:is-full sm:is-[70px]'
                        >
                            <MenuItem value='10'>10</MenuItem>
                            <MenuItem value='15'>15</MenuItem>
                            <MenuItem value='25'>25</MenuItem>
                        </CustomTextField>
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
            <ViewEnquiryDetail open={open} setOpen={setOpen} data={showData} />
        </>
    )
}

export default DoneEnquiryTable
