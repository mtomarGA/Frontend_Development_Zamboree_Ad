'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'



import {
    Card,
    Divider,
    Button,
    MenuItem,
    IconButton,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    CardHeader,
    Chip,
    Tabs,
    Tab
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
import Grid from '@mui/material/Grid2'
import classnames from 'classnames'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import TablePagination from '@mui/material/TablePagination'
import tableStyles from '@core/styles/table.module.css'
import EditPolls from '@/components/dialogs/posts/edit/EditPolls'


import AddPolls from '@/components/dialogs/posts/CreatePolls'
import Viewpolls from '@/components/dialogs/posts/ViewPolls'
import getAllPolls from '@/services/posts/polls.service'

import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'


const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({ itemRank })

    return itemRank.passed
}
const productStatusObj = {
    PENDING: { title: 'PENDING', color: 'warning' },
    APPROVED: { title: 'ACTIVE', color: 'success' },
    REJECTED: { title: 'INACTIVE', color: 'error' },
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

const PollsListTable = () => {
    useEffect(() => {
        getPolls()
    }, [])
    const { hasPermission } = useAuth()

    const [singlePolls, setSinglePolls] = useState(null)
    const getPolls = async () => {
        const res = await getAllPolls.getPolls()
        console.log(res, 'polls data')
        console.log(res.data)
        setData(res.data)
    }

    const handleView = async (id) => {
        const result = await getAllPolls.getPollsById(id)
        setSinglePolls(result.data)
        console.log(id, 'id')
        setModalviewOpen(true)
    }

    const handleDelete = async (id) => {
        const result = await getAllPolls.deletePolls(id)
        toast.success(result.message)
        getPolls()
    }

    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [modalviewOpen, setModalviewOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState('ALL')
    const [EditModalOpen, setEditModalOpen] = useState(false)
    const [EditModalMode, setEditModalMode] = useState('edit')
    const [EditSelectedPost, setEditSelectedPost] = useState(null)
    const filteredData = useMemo(() => {
        if (statusFilter === 'ALL') return data
        if (statusFilter === 'PENDING') return data.filter(item => item.status === 'PENDING')
        if (statusFilter === 'ACTIVE') return data.filter(item => item.status === 'APPROVED')
        if (statusFilter === 'REJECTED') return data.filter(item => item.status === 'REJECTED')
        return data
    }, [data, statusFilter])
    const columns = useMemo(() => {
        const columnHelper = createColumnHelper()

        return [

            columnHelper.accessor('question', {
                header: 'Question',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.question}

                    </Typography>
                )
            }),



            columnHelper.accessor('chooseType', {
                header: 'Created For',
                cell: ({ row }) => <Typography>
                    {row.original.chooseType}
                </Typography>
            }),

            columnHelper.accessor('chooseTypeId', {
                header: 'Unique Id',
                cell: ({ row }) => (
                   <Typography>
                        {row.original.chooseTypeId?.vendorId || row.original?.chooseTypeId?.gurudwara_id || row.original?.chooseTypeId?.temple_id || row.original?.chooseTypeId?.mosque_id || 'ADMIN'}
                    </Typography>
                )
            }),


           columnHelper.accessor('mobile', {
                header: 'View',
                cell: ({ row }) => <Typography>
                    {/* {row.original.phone} */}
                    {"118"}
                </Typography>
            }),

            columnHelper.accessor('likes', {
                header: 'Like',
                cell: ({ row }) => <Typography>{row.original.likes?.length}</Typography>
            }),
            columnHelper.accessor('reactionCount', {
                header: 'Love',
                cell: ({ row }) => <Typography>{row.original.reactionCount?.LOVE || "0"}</Typography>
            }),
            columnHelper.accessor('reactionCount', {
                header: 'Haa',
                cell: ({ row }) => <Typography>{row.original?.reactionCount?.HAHA || "0"}</Typography>
            }),
            columnHelper.accessor('reactionCount', {
                header: 'surprise',
                cell: ({ row }) => <Typography>{row.original.reactionCount?.SURPRISE || "0"}</Typography>
            }),
            columnHelper.accessor('reactionCount', {
                header: 'sad',
                cell: ({ row }) => <Typography>{row.original.reactionCount?.SAD || "0"}</Typography>
            }),
            columnHelper.accessor('reactionCount', {
                header: 'angry',
                cell: ({ row }) => <Typography>{row.original.reactionCount?.ANGRY || "0"}</Typography>
            }),

            columnHelper.accessor('shares', {
                header: 'Share',
                cell: ({ row }) => <Typography>{'108'}</Typography>
            }),
            columnHelper.accessor('commentCount', {
                header: 'Comment',
                cell: ({ row }) => <Typography>{row?.original?.commentCount}</Typography>
            }),

            columnHelper.accessor('status', {
                header: 'Status',
                cell: ({ row }) => {
                    const statusValue = row.original.status;
                    const status = statusValue ? productStatusObj[statusValue] : null;

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
            columnHelper.accessor('createdBy', {
                header: 'Created By',
                cell: ({ row }) =>  
                
                <Typography color='text.primary'>
                    {row.original.createdBy.firstName} {row.original.createdBy.lastName}
                </Typography>
            }),

            columnHelper.accessor('createdAt', {
                header: 'Created At',
                cell: ({ row }) => (
                    <Typography>
                        {dayjs(row.original.createdAt).format('DD MMM YYYY, hh:mm A')}
                    </Typography>
                )
            }),

            columnHelper.accessor('actions', {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex items-center gap-2'>
                        <IconButton onClick={() => handleView(row.original._id)}>
                            <Tooltip title="Result" placement="top-end">
                                <i className='tabler-eye text-green-500 text-2xl cursor-pointer' />
                            </Tooltip>
                        </IconButton>
                        {hasPermission("happening_polls:edit") && <IconButton
                            onClick={() => {
                                setEditModalMode('edit')
                                setEditSelectedPost(row.original)
                                setEditModalOpen(true)

                            }}
                            disabled={row.original.status === 'APPROVED'}
                        >
                            <Tooltip title="Edit" placement="top-end">
                                <i className='tabler-edit text-blue-600 text-2xl cursor-pointer' />
                            </Tooltip>

                        </IconButton>}
                        {hasPermission("happening_polls:delete") && <IconButton onClick={() => handleDelete(row.original._id)}>
                            <Tooltip title="Delete" placement="top-end">
                                <i className='tabler-trash text-red-500 text-2xl cursor-pointer' />
                            </Tooltip>

                        </IconButton>}
                    </div>
                ),
                enableSorting: false
            })
        ]
    }, [])

    const table = useReactTable({
        data: filteredData,
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

    const exportSelectedRows = () => {
        const selectedRows = table.getSelectedRowModel().rows

        if (selectedRows.length === 0) {
            toast.warning('No rows selected for export')
            return
        }

        const csvRows = [
            ['Id', 'Name', 'Email', 'Mobile', 'Source', 'Created At', 'Updated At', 'Status'],
            ...selectedRows.map(row => [
                row.original._id,
                `${row.original.firstName} ${row.original.lastName}`,
                row.original.email,
                row.original.phone,
                'Website',
                dayjs(row.original.createdAt).format('DD MMM YYYY, hh:mm A'),
                dayjs(row.original.updatedAt).format('DD MMM YYYY, hh:mm A'),
                row.original.status
            ])
        ]

        const csvContent = csvRows.map(e => e.join(',')).join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'selected-users.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Card className='shadow-none '>
            <div className='flex flex-wrap justify-between gap-4 p-6'>
                <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
                    <CardHeader title='Polls Table' />


                </div>
                <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
                    <DebouncedInput
                        value={globalFilter ?? ''}
                        onChange={value => setGlobalFilter(String(value))}
                        placeholder='Search User'
                        className='max-sm:is-full'
                    />
                    {/* <CardContent> */}

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
                    <Grid container xs={8} className='flex items-center justify-between px-5'>

                        {hasPermission("happening_polls:add") && <Button
                            variant='contained'
                            className=' px-10'
                            onClick={() => setModalOpen(true)}
                        >
                            Add Polls
                        </Button>}
                    </Grid>

                </div>
            </div>

            <Tabs
                value={statusFilter}
                onChange={(event, newValue) => setStatusFilter(newValue)}
                className="px-6 mb-4"
                textColor="primary"
                indicatorColor="primary"
            >
                <Tab label="All" value="ALL" />
                <Tab label="Pending" value="PENDING" />
                <Tab label="Active" value="ACTIVE" />
                <Tab label="Rejected" value="REJECTED" />
            </Tabs>

            <div className='overflow-x-auto'>
                <table className={tableStyles.table}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup?._id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header?._id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={classnames({
                                                    'flex items-center': header.column.getIsSorted(),
                                                    'cursor-pointer select-none': header.column.getCanSort(),
                                                })}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() === 'asc' && (
                                                    <i className="tabler-chevron-up text-xl" />
                                                )}
                                                {header.column.getIsSorted() === 'desc' && (
                                                    <i className="tabler-chevron-down text-xl" />
                                                )}
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
                                <tr key={row._id} className={classnames({ selected: row.getIsSelected() })}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell._id}>
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
                onPageChange={(_, page) => {
                    table.setPageIndex(page)
                }}
            />

            <Dialog fullWidth open={modalviewOpen} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setModalviewOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle variant='h4' className='flex gap-2 flex-col text-center '>
                    <Viewpolls singlePolls={singlePolls} />
                </DialogTitle>
            </Dialog>

            <Dialog fullWidth open={modalOpen} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setModalOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle variant='h4' className='flex gap-2 flex-col text-center '>
                    <AddPolls onsuccess={setModalOpen} getData={getPolls} />
                </DialogTitle>
            </Dialog>


            <Dialog fullWidth open={EditModalOpen} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setEditModalOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
                    <EditPolls EditSelectedPost={EditSelectedPost} onsuccess={setEditModalOpen} getData={getPolls} />
                </DialogTitle>
            </Dialog>
        </Card>
    )
}

export default PollsListTable
