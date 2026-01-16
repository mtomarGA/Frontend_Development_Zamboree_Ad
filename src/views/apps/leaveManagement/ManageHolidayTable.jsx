'use client'

import { useEffect, useMemo, useState } from 'react'
import {
    Card,
    Button,
    MenuItem,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    Tooltip
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
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import Chip from '@mui/material/Chip'
import TablePaginationComponent from '@components/TablePaginationComponent'

import TablePagination from '@mui/material/TablePagination'
import tableStyles from '@core/styles/table.module.css'

import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

import AddHolidayForm from '@/components/dialogs/leave-management/manageHoliday/AddHoliday'
import manageHolidaysServices from '@/services/leave-management/manageHolidays'
import HolidayDetail from '@/components/dialogs/leave-management/manageHoliday/HolidayDetails'


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

const ManageHolidayTable = () => {
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [rowSelection, setRowSelection] = useState({})
    const [ModalOpen, setModalOpen] = useState(false)
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
    const [deleteId, setDeleteId] = useState(null)
    const [showData, setShowData] = useState(false)
    const [holidayData, setHolidayData] = useState()
    const { hasPermission } = useAuth()

    const productStatusObj = {
        ACTIVE: { title: 'ACTIVE', color: 'success' },
        INACTIVE: { title: 'INACTIVE', color: 'error' },
    }

    useEffect(() => {
        getAllHolidays()
    }, [])

    const getAllHolidays = async () => {
        const res = await manageHolidaysServices.getAllHolidays()
        setData(res.data)
    }

    const confirmDelete = async () => {
        if (deleteId) {
            const result = await manageHolidaysServices.deleteHoliday(deleteId)
            toast.success(result.message)
            getAllHolidays()
            setConfirmDeleteOpen(false)
            setDeleteId(null)
        }
    }

    const handleAdd = () => {
        setHolidayData("")
        setModalOpen(true)
    }

    const columns = useMemo(() => {
        const columnHelper = createColumnHelper()
        return [
            columnHelper.accessor('holidayName', {
                header: 'Holiday Name',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.holidayName}
                    </Typography>
                )
            }),
            columnHelper.accessor('startData', {
                header: 'Start Date',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {dayjs(row.original.startDate).format('DD MMM YYYY')}
                    </Typography>
                )
            }),
            columnHelper.accessor('endData', {
                header: 'End Date',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {dayjs(row.original.endDate).format('DD MMM YYYY')}
                    </Typography>
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
                    <div className='flex items-center gap-2'>

                        {hasPermission("leave management_manageHoliday:view") && <IconButton onClick={() => {
                            setHolidayData(row.original)
                            setShowData(true)
                        }}>
                            <Tooltip placement="top-end" title="View">
                                <i className='tabler-eye text-green-500' />
                            </Tooltip>
                        </IconButton>}

                        {hasPermission("leave management_manageHoliday:edit") && <IconButton
                            onClick={() => {
                                setHolidayData(row.original)
                                setModalOpen(true)
                            }}
                        >
                            <Tooltip placement="top-end" title="Edit">
                                <i className='tabler-edit text-blue-600 text-2xl cursor-pointer' />
                            </Tooltip>
                        </IconButton>}

                        {hasPermission("leave management_manageHoliday:delete") && <IconButton
                            onClick={() => {
                                setDeleteId(row.original._id)
                                setConfirmDeleteOpen(true)
                            }}
                        >
                            <Tooltip placement="top-end" title="Delete">
                                <i className='tabler-trash text-red-500 text-2xl cursor-pointer' />
                            </Tooltip>
                        </IconButton>}
                    </div>
                ),
            })
        ]
    }, [])

    const table = useReactTable({
        data,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        globalFilterFn: fuzzyFilter,
        state: { rowSelection, globalFilter },
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        initialState: { pagination: { pageSize: 10 } },
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues()
    })

    return (
        <Card>
            <Typography variant='h3' className='px-7 py-2'>Manage Holiday</Typography>

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
                    {hasPermission("leave management_manageHoliday:add") && <Button
                        variant='contained'
                        className='max-sm:is-full is-auto text-white'
                        onClick={handleAdd}
                    >
                        Add Holiday
                    </Button>}
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

            {/* Add Holiday */}
            <Dialog fullWidth open={ModalOpen} maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setModalOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle>
                    <AddHolidayForm
                        getAllHolidays={getAllHolidays}
                        holidayData={holidayData}
                        setModalOpen={setModalOpen}
                    />
                </DialogTitle>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Confirm Delete</DialogTitle>
                <div className="px-6 pb-4">
                    <Typography>Are you sure you want to delete</Typography>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outlined" onClick={() => setConfirmDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="error" onClick={confirmDelete}>
                            Confirm
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* Holiday Details Dialog */}
            <Dialog fullWidth open={showData} maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setShowData(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
                    <HolidayDetail
                        holidayData={holidayData}
                        getAllHolidays={getAllHolidays}
                        setShowData={setShowData}
                    />
                </DialogTitle>
            </Dialog>

        </Card>
    )
}

export default ManageHolidayTable
