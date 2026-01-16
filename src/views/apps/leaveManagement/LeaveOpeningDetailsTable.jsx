'use client'

import { useEffect, useMemo, useState } from 'react'
import {
    Card,
    MenuItem,
    Typography,
} from '@mui/material'

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

import { rankItem } from '@tanstack/match-sorter-utils'
import classnames from 'classnames'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

import TablePagination from '@mui/material/TablePagination'
import tableStyles from '@core/styles/table.module.css'

import leaveManegmentService from '@/services/leave-management/leaveOpeningDetails'


const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
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

const LeaveOpeningDetailsTable = () => {
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [rowSelection, setRowSelection] = useState({})

    useEffect(() => {
        getLeave()
    }, [])

    const getLeave = async () => {
        const res = await leaveManegmentService.getLeaveOpeningDetails()
        setData(res.data)
    }



    const columns = useMemo(() => {
        const columnHelper = createColumnHelper()
        return [
            columnHelper.accessor('employee.department.name', {
                header: 'Department',
                cell: ({ row }) =>
                (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.employee?.department?.name}
                    </Typography>
                ),

            }),
            columnHelper.accessor('employee.name', {
                header: 'Employee Name',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.employee.name}
                    </Typography>
                )
            }),
            columnHelper.accessor('employee.employee_id', {
                header: 'Emp. No',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.employee.employee_id}
                    </Typography>
                ),

            }),
            columnHelper.accessor('leaveType.allowLeave', {
                header: 'Allow Leave',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.leaveType?.allowLeave}
                    </Typography>
                ),

            }),

            columnHelper.accessor('totalLeave', {
                header: 'Used Leave',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.totalLeave}
                    </Typography>
                )
            }),

            columnHelper.accessor('calculateleave', {
                header: 'Balenced Leave',
                cell: ({ row }) => {
                    const allowLeave = Number(row.original?.leaveType?.allowLeave) || 0
                    const usedLeave = Number(row.original?.totalLeave) || 0
                    const calculateLeave = allowLeave - usedLeave

                    return (
                        <Typography className='font-medium' color='text.primary'>
                            {calculateLeave}
                        </Typography>
                    )
                }
            }),




        ]
    }, [])

    const table = useReactTable({
        data,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        state: { rowSelection, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
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

    return (
        <Card>
            <Typography variant='h3' className='px-7 py-2'>Leave Opening Details</Typography>

            <div className='flex flex-wrap justify-between gap-4 p-6'>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    placeholder='Search Name'
                    className='max-sm:is-full'
                />
                <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
                    <CustomTextField
                        select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className='flex-auto is-[70px] max-sm:is-full'
                    >
                        <MenuItem value='10'>10</MenuItem>
                        <MenuItem value='25'>25</MenuItem>
                        <MenuItem value='50'>50</MenuItem>
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
                                            <div
                                                className={classnames({
                                                    'flex items-center': header.column.getIsSorted(),
                                                    'cursor-pointer select-none': header.column.getCanSort()
                                                })}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() === 'asc' && <i className='tabler-chevron-up text-xl' />}
                                                {header.column.getIsSorted() === 'desc' && <i className='tabler-chevron-down text-xl' />}
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className='text-center'>
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
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
    )
}

export default LeaveOpeningDetailsTable
