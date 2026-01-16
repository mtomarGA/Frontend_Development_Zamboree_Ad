'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

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

// Style Imports
import tableStyles from '@core/styles/table.module.css'

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
    }, [value, onChange, debounce])

    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const columnHelper = createColumnHelper()

const MeetingTable = () => {
    const router = useRouter()
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const { lang: locale } = useParams()

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: 'index',
                header: 'ID',
                cell: ({ table, row }) => {
                    const pageIndex = table.getState().pagination.pageIndex
                    const pageSize = table.getState().pagination.pageSize
                    const currentRowIndex = table.getRowModel().rows.findIndex(r => r.id === row.id)
                    const displayIndex = pageIndex * pageSize + currentRowIndex + 1
                    return (
                        <Typography className='font-medium' color='text.primary'>
                            {displayIndex}
                        </Typography>
                    )
                }
            }),
            columnHelper.accessor('employeeId', {
                header: 'Employee Id',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.meeting || '-'}
                    </Typography>
                )
            }),
            columnHelper.accessor('subject', {
                header: 'Subject',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.title || '-'}
                    </Typography>
                )
            }),
            columnHelper.accessor('createdAt', {
                header: 'Create At',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.comment || '-'}
                    </Typography>
                )
            }),
            columnHelper.accessor('meetWith', {
                header: 'Meet With',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.rating ?? '-'}
                    </Typography>
                )
            }),
            columnHelper.accessor('decisionTakingPerson', {
                header: 'Desition Taking Person',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.createdAt ?? '-'}
                    </Typography>
                )
            }),
            columnHelper.accessor('mobile', {
                header: 'Mobile Number',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.createdAt ?? '-'}
                    </Typography>
                )
            }),
            columnHelper.accessor('meetingLocation', {
                header: 'Meeting Location',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.createdAt ?? '-'}
                    </Typography>
                )
            }),
            columnHelper.accessor('description', {
                header: 'Description',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.createdAt ?? '-'}
                    </Typography>
                )
            }),
            columnHelper.accessor('nextMeeting', {
                header: 'Next Meeting',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.createdAt ?? '-'}
                    </Typography>
                )
            }),
            columnHelper.accessor('tagRating', {
                header: 'Tag Rating',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.createdAt ?? '-'}
                    </Typography>
                )
            }),
        ],
        [data]
    )

    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
            globalFilter
        },
        filterFns: { fuzzy: fuzzyFilter },
        globalFilterFn: fuzzyFilter,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        initialState: {
            pagination: {
                pageSize: 10
            }
        },
        enableRowSelection: true
    })

    return (
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
                        {table.getFilteredRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className='text-center'>
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <TablePagination
                component={() => <TablePaginationComponent table={table} />}
                count={table.getFilteredRowModel().rows.length}
                rowsPerPage={table.getState().pagination.pageSize}
                page={table.getState().pagination.pageIndex}
                onPageChange={(_, page) => table.setPageIndex(page)}
            />
        </Card>
    )
}

export default MeetingTable
