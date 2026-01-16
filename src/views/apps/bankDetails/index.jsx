
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
    Tooltip,
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
import TablePaginationComponent from '@components/TablePaginationComponent'
import TablePagination from '@mui/material/TablePagination'
import tableStyles from '@core/styles/table.module.css'
import BusinessBankDetails from '@/services/business/manageBusiness.service'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import BankDetailsForm from '@/components/dialogs/add-bankDetails'


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

const BancDetailsTable = () => {
    useEffect(() => {
        getBankDetail()
    }, [])
    const { hasPermission } = useAuth();

    const getBankDetail = async () => {
        const res = await BusinessBankDetails.getBusinessBankDetails()
        console.log(res,"sasasasasasa");
        
        setData(res.data)
    }

    const handleDelete = async (id) => {
        const result = await BusinessBankDetails.deleteBusinessBankDetails(id)
        toast.success(result.message)
        getBankDetail()
    }

    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [EditSelectedBanck, setEditSelectedBanck] = useState(null)


    const columns = useMemo(() => {
        const columnHelper = createColumnHelper()
        return [
            columnHelper.accessor('vendorId', {
                header: 'Business Id',
                cell: ({ row }) =>
                (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original?.vendorId}
                    </Typography>
                )
            }
            ),
            columnHelper.accessor('ceo', {
                header: 'Comapany Name ',
                cell: ({ row }) => <Typography color='text.primary'>{row.original.companyInfo?.
                    companyName
                }</Typography>
            }),

            columnHelper.accessor('bankName', {
                header: 'Bank Name',
                cell: ({ row }) => <Typography>{row.original.bankDetails?.bankName?.name}</Typography>
            }),

            columnHelper.accessor('account Number', {
                header: 'Bank Account No',
                cell: ({ row }) => <Typography>{row.original.bankDetails?.accountNumber}</Typography>
            }),
            columnHelper.accessor('account Number', {
                header: 'Branch',
                cell: ({ row }) => <Typography>{row.original.bankDetails?.branchName}</Typography>
            }),
            columnHelper.accessor('companyName', {
                header: 'IFSC Code',
                cell: ({ row }) => (
                    <Typography className='font-medium' color='text.primary'>
                        {row.original.bankDetails?.IFSCCode}
                    </Typography>
                )
            }),
            columnHelper.accessor('actions', {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex items-center gap-2'>
                        <IconButton
                            onClick={() => {
                                setEditSelectedBanck(row.original)
                                setModalOpen(true)
                            }}
                        >
                            <Tooltip title="Edit" placement="top-end">
                                <i className='tabler-edit text-blue-600 text-2xl cursor-pointer' />
                            </Tooltip>

                        </IconButton>
                        <IconButton onClick={() => handleDelete(row.original._id)}>
                            <Tooltip title="Delete" placement="top-end">
                                <i className='tabler-trash text-red-500 text-2xl cursor-pointer' />
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
            <Typography variant='h4' className='px-7 py-2'>Vendors Bank Details</Typography>
            <div className='flex flex-wrap justify-between gap-4 p-6'>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    placeholder='Search User'
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
                            <tr key={headerGroup._id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header._id}>
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
                                <tr key={row._id} className={classnames({ selected: row.getIsSelected() })}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell._id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
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

            <Dialog fullWidth open={modalOpen} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
                <DialogCloseButton onClick={() => setModalOpen(false)} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
                <DialogTitle variant='h4' className='flex gap-2 flex-col text-center '>
                    <BankDetailsForm setModalOpen={setModalOpen} getBankDetail={getBankDetail} EditSelectedBanck={EditSelectedBanck} />
                </DialogTitle>
            </Dialog>

        </Card>
    )
}

export default BancDetailsTable
