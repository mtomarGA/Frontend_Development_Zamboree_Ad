'use client'

import { useEffect, useMemo, useState } from 'react'
import {
    Button,
    Card,
    CardHeader,
    Chip,
    Dialog,
    DialogTitle,
    IconButton,
    MenuItem,
    Tab,
    Tabs,
    Tooltip,
    Typography
} from '@mui/material'

import { useParams } from 'next/navigation'
import { createColumnHelper, flexRender, useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues } from '@tanstack/react-table'
import Report from "@/services/posts/report.service"
import classnames from 'classnames'
import dayjs from 'dayjs'
import tableStyles from '@core/styles/table.module.css'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import TablePagination from '@mui/material/TablePagination'
import { toast } from 'react-toastify'

import { Grid } from '@mui/system'
import AddReportType from '@/components/dialogs/posts/report/AddReportType'

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}




const ReportTypeTable = () => {
    const [data, setData] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState('')
    const [reportModelOpen, setReportModalOpen] = useState(false)

    const [EditSelectedReport, setEditSelectedReport] = useState(null)


    useEffect(() => {
        getTypeReport()
    }, [])

    const getTypeReport = async () => {
        const res = await Report.getReportType()
        setData(res.data)
    }





    const handleDelete = async (report) => {
        const id = report?._id
        const res = await Report.deleteReportType(id)
        toast.success(res.message)
        getTypeReport()

    }



    const columns = useMemo(() => {
        const columnHelper = createColumnHelper()

        return [
            columnHelper.accessor('message', {
                header: 'Report',
                cell: ({ row }) => <Typography>{row.original.message}</Typography>
            }),
            columnHelper.accessor('createdAt', {
                header: 'Created At',
                cell: ({ row }) => (
                    <Typography>{dayjs(row.original.createdAt).format('DD MMM YYYY, hh:mm A')}</Typography>
                )
            }),
            columnHelper.accessor('actions', {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex items-center gap-2'>
                        <IconButton
                            onClick={() => {
                                setEditSelectedReport(row.original)
                                setReportModalOpen(true)
                            }}
                        >
                            <Tooltip title='Edit'>
                                <i className='tabler-edit text-blue-600 text-2xl cursor-pointer' />
                            </Tooltip>
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row.original)}>
                            <Tooltip title='Delete'>
                                <i className='tabler-trash text-red-600 text-2xl cursor-pointer' />
                            </Tooltip>
                        </IconButton>

                    </div>
                ),
                enableSorting: false
            })
        ]
    }, [])

    const table = useReactTable({
        data,
        columns,
        state: { rowSelection, globalFilter },
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
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        initialState: { pagination: { pageSize: 10 } }
    })

    return (
        <Card className='shadow-none'>
            <div className='flex flex-wrap justify-between gap-4 p-6'>
                <div className='flex flex-wrap items-center gap-4'>
                    <CardHeader title='Reported Post Table' />
                </div>
                <div className='flex flex-wrap items-center gap-4'>
                    {/* <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        placeholder='Search Report'
                    />
                    <CustomTextField
                        select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className='w-[70px]'
                    >
                        <MenuItem value='10'>10</MenuItem>
                        <MenuItem value='25'>25</MenuItem>
                        <MenuItem value='50'>50</MenuItem>
                    </CustomTextField> */}
                    <Grid container xs={8} className='flex items-center justify-between px-5'>

                        <Button
                            variant='contained'
                            className=' px-10'
                            onClick={() => { setReportModalOpen(true), setEditSelectedReport("") }}
                        >
                            Add Report Type
                        </Button>
                    </Grid>
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
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
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
                onPageChange={(_, page) => table.setPageIndex(page)}
            />

            <Dialog fullWidth open={reportModelOpen} maxWidth='sm' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setReportModalOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle variant='h4' className='flex gap-2 flex-col text-center'>
                    <AddReportType EditSelectedReport={EditSelectedReport} setEditModalOpen={setReportModalOpen} onSuccess={getTypeReport} />
                </DialogTitle>
            </Dialog>
        </Card>
    )
}

export default ReportTypeTable
