'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useRouter, useParams } from 'next/navigation'

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
import AddProductGroup from '@/components/dialogs/add-product-group/index.jsx'
import productGroupService from "@/services/product/productGroup"
import { useAuth } from '@/contexts/AuthContext'
import DeleteConfirmationDialog from '@/views/apps/deleteConfirmation'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import { getLocalizedUrl } from '@/utils/i18n'
import { toast } from 'react-toastify'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import { use } from 'react'

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
        itemRank
    })

    // Return if the item should be filtered in/out
    return itemRank.passed
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
    // States
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

// Column Definitions
const columnHelper = createColumnHelper()

const ProductGroupTable = () => {

    const params = useParams() // Get URL params
    const businessId = params?.id // Extract id parameter

    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [editData, setEditData] = useState(null)
    const [addCategoryOpen, setAddCategoryOpen] = useState(false)
    const [rowSelection, setRowSelection] = useState({})
    const [data, setData] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const { hasPermission } = useAuth()

    useEffect(() => {
        handleGet()
    }, [businessId])

    const handleGet = async () => {
        const res = await productGroupService.getGroupByVendorId(businessId)
        setData(res?.data)
    }

    const handleEditProGroup = data => {
        setEditData(data)
        setOpen(true)
    }

    const handleDelete = async id => {
        const data = await productGroupService.deleteProductGroup(id)
        toast.success(data?.message)
        handleGet()
    }

    const buttonProps = {
        variant: 'contained',
        children: 'Add Product Group'
    }

    const statusObj = {
        INACTIVE: { title: 'INACTIVE', color: 'warning' },
        ACTIVE: { title: 'ACTIVE', color: 'success' }
    }

    const { lang: locale } = useParams()

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: 'index',
                header: 'Id',
                cell: ({ table, row }) => {
                    const pageIndex = table.getState().pagination.pageIndex
                    const pageSize = table.getState().pagination.pageSize
                    const rowsInPage = table.getRowModel().rows
                    const currentRowIndex = rowsInPage.findIndex(r => r.id === row.id)
                    const displayIndex = pageIndex * pageSize + currentRowIndex + 1

                    return (
                        <div className='flex items-center gap-3'>
                            <Typography className='font-medium' color='text.primary'>
                                {displayIndex}
                            </Typography>
                        </div>
                    )
                }
            }),
            columnHelper.accessor('name', {
                header: 'Group Name',
                cell: ({ row }) => (
                    <div className='flex items-center gap-3'>
                        <div className='flex flex-col items-start'>
                            <Typography className='font-medium' color='text.primary'>
                                {row.original.name}
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
                                {row.original.status}
                            </Typography>
                        </div>
                    </div>
                )
            }),
            columnHelper.accessor('image', {
                header: 'Image',
                cell: ({ row }) => (
                    <div className='flex items-center gap-3'>
                        <img src={row?.original?.image?.url || ''} width={38} height={38} className='rounded bg-actionHover' />
                    </div>
                )
            }),
            columnHelper.accessor('actions', {
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex items-center'>
                        {hasPermission("product_manage_product_group:edit") &&
                            <IconButton >
                                <i className='tabler-edit text-blue-500' onClick={() => handleEditProGroup(row.original)} />
                            </IconButton>}
                        {hasPermission("product_manage_product_group:delete") &&
                            <DeleteConfirmationDialog
                                itemName="product group"
                                onConfirm={() => handleDelete(row.original._id)}
                                icon={<i className='tabler-trash text-red-500' />}
                            />
                        }
                    </div>
                ),
                enableSorting: false
            })
        ],
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
        // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
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

                    <div className='flex flex-wrap items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
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
                        {hasPermission("product_manage_product_group:add") &&
                            <OpenDialogOnElementClick
                                element={Button}
                                elementProps={buttonProps}
                                dialog={AddProductGroup}
                                dialogProps={{ onSuccess: handleGet }}
                            />}
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
            <AddProductGroup open={open} setOpen={setOpen} data={editData} onSuccess={handleGet} />
        </>
    )
}

export default ProductGroupTable
