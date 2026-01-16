'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
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

import AddProduct from '@/components/dialogs/add-product/index.jsx'
// Import Services
import productGroupService from "@/services/product/productGroup"
import productService from "@/services/product/product"

import tableStyles from '@core/styles/table.module.css'
import { toast } from 'react-toastify'

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
        itemRank
    })

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

const columnHelper = createColumnHelper()

const ProductGroupTable = () => {

    const params = useParams() // Get URL params
    const businessId = params?.id // Extract id parameter

    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [editData, setEditData] = useState(null)
    const [open, setOpen] = useState(false)

    const statusObj = {
        INACTIVE: { title: 'INACTIVE', color: 'warning' },
        ACTIVE: { title: 'ACTIVE', color: 'success' }
    }

    useEffect(() => {
        getRejectedProduct()
    }, [businessId])

    const getRejectedProduct = async () => {
        const res = await productService.getRejectedProduct(businessId);
        setData(res?.data)
    }

    const handleEditProGroup = data => {
        setEditData(data)
        setOpen(true)
    }

    const handleGetProduct = async () => {
        const res = await productService.getAllProduct()
        setData(res?.data)
    }

    const handleDelete = async id => {
        const data = await productService.deleteProduct(id)
        toast.success('Product Deleted Successfully')
        getRejectedProduct()
    }

    const { lang: locale } = useParams()

    const columns = useMemo(
        () => [
            columnHelper.accessor('vendorId', {
                header: 'Vendor Id',
                cell: ({ row }) => (
                    <div className='flex items-center gap-3'>
                        <div className='flex flex-col items-start'>
                            <Typography className='font-medium' color='text.primary'>
                                {row?.original?.businessId?.vendorId}
                            </Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('name', {
                header: 'Name',
                cell: ({ row }) => (
                    <div className='flex items-center gap-3'>
                        <div className='flex flex-col items-start'>
                            <Typography className='font-medium' color='text.primary'>
                                {row?.original?.name}
                            </Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: ({ row }) => (
                    <div className='flex items-center gap-3'>
                        <div className='flex flex-col items-start'>
                            <Typography className='font-medium' color='text.primary'>
                                {row?.original?.status}
                            </Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('reason', {
                header: 'Reason',
                cell: ({ row }) => (
                    <div className='flex items-center gap-3'>
                        <div className='flex flex-col items-start'>
                            <Typography className='font-medium' color='text.primary'>
                                {row?.original?.reason}
                            </Typography>
                        </div>
                    </div>
                )
            }),

            // columnHelper.accessor('actions', {
            //     header: 'Actions',
            //     cell: ({ row }) => (
            //         <div className='flex items-center'>
            //             <IconButton >
            //                 <i className='tabler-edit' onClick={() => handleEditProGroup(row.original)} />
            //             </IconButton>
            //             <IconButton >
            //                 <i className='tabler-trash text-textSecondary' onClick={() => handleDelete(row.original._id)} />
            //             </IconButton>
            //         </div>
            //     ),
            //     enableSorting: false
            // })
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data]
    )

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
            {/* <AddProduct open={open} setOpen={setOpen} data={editData} onSuccess={handleGetProduct} /> */}
        </>
    )
}

export default ProductGroupTable
