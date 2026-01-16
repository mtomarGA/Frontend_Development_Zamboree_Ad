'use client'

import { useEffect, useMemo, useState } from 'react'

// MUI
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    MenuItem,
    TablePagination
} from '@mui/material'

// Table imports
import {
    createColumnHelper,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    flexRender
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

// Styles and components
import tableStyles from '@core/styles/table.module.css'
import classnames from 'classnames'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import IslamPrayerModal from '@/components/dialogs/islam-prayer'

// Services & Auth
import islamPrayerService from '@/services/spritual/islamPrayer'
import { useAuth } from '@/contexts/AuthContext'
import IslamPrayerAddModal from '@/components/dialogs/islam-prayer/new'

// Column Helper
const columnHelper = createColumnHelper()

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    const [value, setValue] = useState(initialValue)
    useEffect(() => setValue(initialValue), [initialValue])
    useEffect(() => {
        const timeout = setTimeout(() => onChange(value), debounce)
        return () => clearTimeout(timeout)
    }, [value])
    return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const PrayerTimes = () => {
    const { hasPermission } = useAuth()
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const [addOpen, setAddOpen] = useState(false)
    const [data, setData] = useState([])
    const [editValue, setEditValue] = useState(null)
    const [globalFilter, setGlobalFilter] = useState('')
    const [rowSelection, setRowSelection] = useState({})
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await islamPrayerService.getall({ month: selectedMonth, year: selectedYear })
            setData(response.data)
        } catch (error) {
            console.log('Error fetching data:', error)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [selectedMonth, selectedYear])

    const handleAdd = async values => {
        setLoading(true)
        try {
            await islamPrayerService.create(values)
            fetchData()
            setOpen(false)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async values => {
        setLoading(true)
        try {
            await islamPrayerService.update(editValue._id, values)
            fetchData()
            setOpen(false)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async id => {
        setLoading(true)
        try {
            await islamPrayerService.delete(id)
            fetchData()
        } finally {
            setLoading(false)
        }
    }

    const columns = useMemo(() => [
        columnHelper.accessor('date', {
            header: 'Date',
            cell: info => <Typography>{info.getValue() ? new Date(info.getValue()).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                // hour: '2-digit',
                // minute: '2-digit',
                // second: '2-digit',
                // timeZone: 'Asia/Kolkata',
                // hour12: true,
            }) : 'N/A'}</Typography>
        }),
        columnHelper.accessor('fajr', {
            header: 'Fajr Time',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor('sunrise', {
            header: 'Sunrise Time',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor('zuhur', {
            header: 'Zuhur Time',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor('asr', {
            header: 'Asr Time',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor('maghrib', {
            header: 'Maghrib Time',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor('isha', {
            header: 'Isha Time',
            cell: info => <Typography>{info.getValue()}</Typography>
        }),
        columnHelper.accessor('action', {
            header: 'Actions',
            cell: ({ row }) => (
                <div className='flex gap-2'>
                    {hasPermission('spiritual_islam_prayer_times:add') && (
                        <button
                            onClick={() => {
                                setEditValue(row.original)
                                setAddOpen(true)
                            }}
                            className='text-blue-600 tabler-circle-plus text-xl cursor-pointer'
                        ></button>
                    )}
                    {hasPermission('spiritual_islam_prayer_times:edit') && (
                        <button
                            onClick={() => {
                                setEditValue(row.original)
                                setOpen(true)
                            }}
                            className='text-blue-600 tabler-edit text-xl cursor-pointer'
                        ></button>
                    )}
                    {hasPermission('spiritual_islam_prayer_times:delete') && (
                        <button
                            onClick={() => handleDelete(row.original._id)}
                            className='text-red-500 tabler-trash text-xl cursor-pointer'
                        ></button>
                    )}
                </div>
            ),
            enableSorting: false
        })
    ], [])

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter, rowSelection },
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        filterFns: { fuzzy: fuzzyFilter },
        globalFilterFn: fuzzyFilter,
        initialState: { pagination: { pageSize: 9 } },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues()
    })
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i)


    return (
        <Grid container spacing={2}>
            {/* Sidebar */}
            <Grid item xs={12} md={4} lg={2} >
                <Card className='p-3'>
                    <Typography variant='h6' gutterBottom>Year</Typography>
                    <CustomTextField
                        select
                        fullWidth
                        value={selectedYear}
                        onChange={e => setSelectedYear(e.target.value)}
                        sx={{ mb: 4 }}
                    >
                        {years.map(year => (
                            <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                    </CustomTextField>

                    <Typography variant='h6' gutterBottom>Months</Typography>

                    <div className='flex flex-col gap-2'>
                        {months.map((month, index) => {
                            const monthNum = index + 1
                            const isSelected = selectedMonth === monthNum
                            return (
                                <Button
                                    key={month}
                                    variant={isSelected ? 'contained' : 'outlined'}
                                    color={isSelected ? 'primary' : 'inherit'}
                                    onClick={() => setSelectedMonth(monthNum)}
                                    sx={{
                                        justifyContent: 'flex-start',
                                        fontWeight: isSelected ? 'bold' : 'normal'
                                    }}
                                >
                                    {month}
                                </Button>
                            )
                        })}
                    </div>
                </Card>
            </Grid>

            {/* Table and controls */}
            <Grid item xs={12} md={9} lg={10}>
                <Typography variant='h4' gutterBottom>
                    Prayer Times
                </Typography>
                <Card>
                    <CardContent className='flex flex-col sm:flex-row justify-between gap-4 items-center flex-wrap'>
                        <div className='flex items-center gap-2'>
                            <Typography>Show</Typography>
                            <CustomTextField
                                select
                                value={table.getState().pagination.pageSize}
                                onChange={e => table.setPageSize(Number(e.target.value))}
                                className='is-[70px]'
                            >
                                {[5, 7, 9].map(n => (
                                    <MenuItem key={n} value={n}>{n}</MenuItem>
                                ))}
                            </CustomTextField>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                            <DebouncedInput
                                value={globalFilter ?? ''}
                                onChange={value => setGlobalFilter(String(value))}
                                placeholder='Search prayer time...'
                            />
                            {hasPermission('spiritual_islam_prayer_times:add') && (
                                <Button variant='contained' onClick={() => { setOpen(true); setEditValue(null) }}>
                                    Add Prayer Time
                                </Button>
                            )}
                        </div>
                    </CardContent>

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
                                                        {header.column.columnDef.header}
                                                        {({
                                                            asc: <i className='tabler-chevron-up text-xl' />,
                                                            desc: <i className='tabler-chevron-down text-xl' />
                                                        })[header.column.getIsSorted()] ?? null}
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
                                        <td colSpan={columns.length} className='text-center'>No data available</td>
                                    </tr>
                                ) : (
                                    table.getRowModel().rows.map(row => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <TablePagination
                        component='div'
                        count={table.getFilteredRowModel().rows.length}
                        rowsPerPage={table.getState().pagination.pageSize}
                        page={table.getState().pagination.pageIndex}
                        onPageChange={(_, page) => table.setPageIndex(page)}
                        onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
                    />
                </Card>

                <IslamPrayerModal
                    open={open}
                    setOpen={setOpen}
                    data={editValue}
                    handleUpdate={handleUpdate}
                    handleAdd={handleAdd}
                    handleClose={() => setOpen(false)}
                    title='Prayer Time'
                />
                <IslamPrayerAddModal
                    open={addOpen}
                    setOpen={setAddOpen}
                    data={editValue}
                    handleUpdate={handleUpdate}
                    handleAdd={handleAdd}
                    handleClose={() => setAddOpen(false)}
                    title='Prayer Time'
                />
            </Grid>
        </Grid>
    )
}

export default PrayerTimes
