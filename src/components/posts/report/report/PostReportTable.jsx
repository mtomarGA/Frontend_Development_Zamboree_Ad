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

import classnames from 'classnames'
import dayjs from 'dayjs'
import tableStyles from '@core/styles/table.module.css'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import TablePagination from '@mui/material/TablePagination'

import getAllReport from '@/services/posts/report.service'
import { toast } from 'react-toastify'
import ViewPost from '@/components/dialogs/posts/report/ViewPosts'

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const productStatusObj = {
    PENDING: { title: 'PENDING', color: 'warning' },
    APPROVED: { title: 'APPROVE', color: 'success' },
    REJECTED: { title: 'RJECTED', color: 'error' }
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

const ReportedListTable = () => {
    const [data, setData] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState('')
    // const { lang: locale } = useParams()

    const [EditModalOpen, setEditModalOpen] = useState(false)
    const [EditSelectedPost, setEditSelectedPost] = useState(null)

    useEffect(() => {
        getusers()
    }, [])

    const getusers = async () => {
        const res = await getAllReport.getPostReport()
        console.log(res?.data,"resresresresresres");
        
        setData(res.data)
    }


    const columns = useMemo(() => {
        const columnHelper = createColumnHelper()

        return [
            columnHelper.accessor('message', {
                header: 'Report',
                cell: ({ row }) => <Typography>{row.original.message?.message}</Typography>
            }),
            columnHelper.accessor('reportedBy', {
                header: 'Reported By',
                cell: ({ row }) => {
                    const { firstName, lastName } = row.original.reportedBy || {}
                    const fullName = [firstName, lastName].filter(Boolean).join(' ')
                    return <Typography>{fullName || 'ADMIN'}</Typography>
                }
            }),

            columnHelper.accessor('mobile', {
                header: 'View',
                cell: ({ row }) => <Typography>
                    {/* {row.original.phone} */}
                    {"118"}
                </Typography>
            }),

            columnHelper.accessor('postId', {
                header: 'Like',
                cell: ({ row }) => 
                <Typography>{row?.original?.postId?.totalLikes}</Typography>
            }),
            columnHelper.accessor('love', {
                header: 'Love',
                cell: ({ row }) => <Typography>{row?.original?.postId?.reactionCount?.LOVE||"0"}</Typography>
            }),
            columnHelper.accessor('haa', {
                header: 'Haa',
                cell: ({ row }) => <Typography>{row?.original?.postId?.reactionCount?.HAHA||"0"}</Typography>
            }),
            columnHelper.accessor('surprise', {
                header: 'surprise',
                cell: ({ row }) => <Typography>{row?.original?.postId?.reactionCount?.SURPRISE||"0"}</Typography>
            }),
            columnHelper.accessor('sad', {
                header: 'sad',
                cell: ({ row }) => <Typography>{row?.original?.postId?.reactionCount?.SAD||"0"}</Typography>
            }),
            columnHelper.accessor('angry', {
                header: 'angry',
                cell: ({ row }) => <Typography>{row?.original?.postId?.reactionCount?.ANGRY||"0"}</Typography>
            }),

            columnHelper.accessor('shares', {
                header: 'Share',
                cell: ({ row }) => <Typography>{'108'}</Typography>
            }),
            columnHelper.accessor('comments', {
                header: 'Comment',
                cell: ({ row }) => <Typography>{row?.original?.postId?.commentCount}</Typography>
            }),


            columnHelper.accessor('status', {
                header: 'Status',
                cell: ({ row }) => {
                    const status = productStatusObj[row.original.status]
                    return (
                        <Chip
                            label={status?.title}
                            variant='tonal'
                            color={status?.color}
                            size='small'
                        />
                    )
                }
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
                                setEditSelectedPost(row.original)
                                setEditModalOpen(true)
                            }}
                        >
                            <Tooltip title='View'>
                                <i className='tabler-eye text-blue-600 text-2xl cursor-pointer' />
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
                    <DebouncedInput
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

           <Dialog fullWidth open={EditModalOpen} maxWidth='lg' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setEditModalOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle variant='h4' className='flex gap-2 flex-col text-center'>
                  <ViewPost EditSelectedPost={EditSelectedPost} setEditModalOpen={setEditModalOpen} onSuccess={getusers}/>
                </DialogTitle>
            </Dialog>
        </Card>
    )
}

export default ReportedListTable
