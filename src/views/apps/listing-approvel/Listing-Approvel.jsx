'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    Box,
    Grid,
    Card,
    CardContent,
    Button,
    Typography,
    Chip,
    MenuItem,
    Drawer,
    Tabs,
    Tab,
    Divider,
    TablePagination
} from '@mui/material'
import { Eye, Trash2, X } from 'lucide-react'
import classnames from 'classnames'
import {
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'

import CustomTextField from '@core/components/mui/TextField'
import AllPaidData from '@/services/premium-listing/banner.service'
import tableStyles from '@core/styles/table.module.css'

import InvoicePage from './detailsTab/listingsPayement'
import ActiveLogs from './detailsTab/ActiveLogs'
import Reminders from './detailsTab/Reminder'
import ApprovalForm from './detailsTab/MakeApprove'
import Notes from './detailsTab/notes'
import TaskForm from './detailsTab/Tasks'

// ---------- Helpers ----------
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

// ---------- Main Component ----------
const ApprovelListTable = () => {
    const [status, setStatus] = useState('')
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [selectedInvoice, setSelectedInvoice] = useState(null)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [tabValue, setTabValue] = useState(0)

    useEffect(() => {
        getAllInvoiced()
    }, [])

    const getAllInvoiced = async () => {
        const res = await AllPaidData.getPaidListing()
        setData(res.data || [])
    }

    useEffect(() => {
        const filtered = data.filter(inv => !status || inv.status === status)
        setFilteredData(filtered)
    }, [status, data])

    const columns = useMemo(
        () => [
            {
                accessorKey: 'invoiceid',
                header: 'Invoice Id',
                cell: ({ row }) => (
                    <Box
                        sx={{
                            display: 'inline-block',
                            position: 'relative',
                            cursor: 'pointer',
                            textAlign: 'center',
                            '&:hover .view-text': {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }}
                        onClick={() => {
                            setSelectedInvoice(row.original)
                            setOpenDrawer(true)
                        }}
                    >
                        <Typography color='primary.main'>
                            #{row.original.InvoiceId || row.original.INVOICEDID}
                        </Typography>
                        <Typography
                            className='view-text'
                            sx={{
                                opacity: 0,
                                fontSize: '0.85rem',
                                color: 'text.secondary',
                                transform: 'translateY(-5px)',
                                transition: 'all 0.25s ease'
                            }}
                        >
                            View
                        </Typography>
                    </Box>
                )
            },
            {
                accessorKey: 'businessId',
                header: 'Business ID',
                cell: ({ row }) => (
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: 180 }}>
                        <Typography
                            color='secondary.main'
                            sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {row.original?.basicDetails?.vendorId}
                        </Typography>
                        <Typography
                            color='secondary.main'
                            sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}
                        >
                            {row.original?.basicDetails?.vendor?.contactInfo?.email ||
                                row.original?.basicDetails?.vendor?.companyInfo?.companyName}
                        </Typography>
                    </Box>
                )
            },
            {
                accessorKey: 'amount',
                header: 'Amount',
                cell: ({ row }) => <Typography>₹{row.original.amount?.EstimateTotal}</Typography>
            },
            {
                accessorKey: 'reciver',
                header: 'Receiver',
                cell: ({ row }) => (
                    <Typography>{row.original?.paymentDetails?.length || 0} Payments</Typography>
                )
            },
            {
                accessorKey: 'orderid',
                header: 'Type',
                cell: ({ row }) => (
                    <Typography variant='body2' color='secondary.main'>
                        {row.original.type}
                    </Typography>
                )
            },
            {
                accessorKey: 'status',
                header: 'Status',
                cell: ({ row }) => (
                    <Chip
                        variant='tonal'
                        label={row.original?.status}
                        color={
                            row.original.status === 'PAID'
                                ? 'success'
                                : row.original.status === 'APPROVED'
                                    ? 'info'
                                    : 'warning'
                        }
                        size='small'
                    />
                )
            }
        ],
        []
    )

    const table = useReactTable({
        data: filteredData,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        state: { globalFilter },
        initialState: { pagination: { pageSize: 10 } },
        globalFilterFn: fuzzyFilter,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
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
                <CardContent className='flex justify-between flex-col items-start md:items-center md:flex-row gap-4'>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Typography variant='h5' fontWeight={600}>
                            Listing Approval Table
                        </Typography>
                    </Grid>

                    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 w-full sm:w-auto'>
                        <CustomTextField
                            select
                            value={table.getState().pagination.pageSize}
                            onChange={e => table.setPageSize(Number(e.target.value))}
                            className='w-[70px] max-sm:w-full'
                        >
                            <MenuItem value='10'>10</MenuItem>
                            <MenuItem value='25'>25</MenuItem>
                            <MenuItem value='50'>50</MenuItem>
                        </CustomTextField>

                        <DebouncedInput
                            value={globalFilter ?? ''}
                            onChange={value => setGlobalFilter(String(value))}
                            placeholder='Search Invoice'
                            className='max-sm:w-full sm:w-[250px]'
                        />
                    </div>
                </CardContent>

                <div className='overflow-x-auto'>
                    <Box sx={{ mt: 2 }}>
                        <Tabs
                            value={status || 'ALL'}
                            onChange={(e, newValue) => setStatus(newValue === 'ALL' ? '' : newValue)}
                            textColor='primary'
                            indicatorColor='primary'
                        >
                            <Tab value='ALL' label='All' />
                            <Tab value='APPROVED' label='Approved' />
                            <Tab value='PAID' label='Paid' />
                        </Tabs>
                    </Box>
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
                                                    {{
                                                        asc: <i className='tabler-chevron-up text-xl' />,
                                                        desc: <i className='tabler-chevron-down text-xl' />
                                                    }[header.column.getIsSorted()] ?? null}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>{cell.column.columnDef.cell(cell.getContext())}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <TablePagination
                    component={() => (
                        <div className='flex items-center justify-between p-4'>
                            <Typography variant='body2'>
                                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    filteredData.length
                                )}{' '}
                                of {filteredData.length} entries
                            </Typography>
                            <div className='flex gap-2'>
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant='outlined'
                                    color='secondary'
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                    count={filteredData.length}
                    rowsPerPage={table.getState().pagination.pageSize}
                    page={table.getState().pagination.pageIndex}
                    onPageChange={(_, page) => table.setPageIndex(page)}
                    onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
                />
            </Card>

            {/* Drawer */}
            <Drawer
                anchor='right'
                open={openDrawer}
                onClose={() => setOpenDrawer(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: { xs: '100%', sm: 550 },
                        padding: 3,
                        boxShadow: 6
                    }
                }}
            >
                <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
                    <Typography variant='h6'>
                        Invoice #{selectedInvoice?.InvoiceId || selectedInvoice?.INVOICEDID}
                    </Typography>
                    <X className='cursor-pointer' onClick={() => setOpenDrawer(false)} />
                </Box>

                <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} variant='scrollable'>
                    <Tab label='Payment Details' />
                    <Tab label='Approve' />
                    <Tab label='Notes' />
                    <Tab label='Active Log' />
                    <Tab label='Reminders' />
                    <Tab label='Tasks' />
                </Tabs>

                <Divider sx={{ my: 2 }} />

                {tabValue === 0 && <InvoicePage selectedInvoice={selectedInvoice} />}
                {tabValue === 1 && (
                    <ApprovalForm selectedInvoice={selectedInvoice} getAllInvoiced={getAllInvoiced} />
                )}
                {tabValue === 2 && <Notes selectedInvoice={selectedInvoice} getAllInvoiced={getAllInvoiced} />}
                {tabValue === 3 && <ActiveLogs />}
                {tabValue === 4 && <Reminders />}
                {tabValue === 5 && <TaskForm />}
            </Drawer>
        </>
    )
}

export default ApprovelListTable
