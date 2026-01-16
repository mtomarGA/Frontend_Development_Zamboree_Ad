'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
} from '@tanstack/react-table'

import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import { useAuth } from '@/contexts/AuthContext'

import tableStyles from '@core/styles/table.module.css'
import { MenuItem } from '@mui/material'

// 👇 Replace this with your actual attribute service
import attributeService from '@/services/attribute/attribute.service'

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const columnHelper = createColumnHelper()

const AttributeListTable = () => {

    const router = useRouter()

    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState('')
    const [newAttribute, setNewAttribute] = useState('')
    const [status, setStatus] = useState('INACTIVE')

    const [editId, setEditId] = useState(null)
    const [editName, setEditName] = useState('')
    const [editStatus, setEditStatus] = useState('INACTIVE')

    const { hasPermission } = useAuth()

    const handleGet = async () => {
        const res = await attributeService.getAttribute()
        setData(res.data)
        setFilteredData(res.data)
    }

    const handleAdd = async () => {
        if (!newAttribute.trim()) {
            toast.error("Attribute name is required")
            return
        }

        try {
            await attributeService.addAttribute({
                name: newAttribute.trim(),
                status
            })
            toast.success("Attribute added successfully")
            setNewAttribute('')
            setStatus('INACTIVE') // Reset status to default
            handleGet()
        } catch (err) {
            toast.error("Error adding attribute")
        }
    }

    const handleEdit = (row) => {
        setEditId(row._id)
        setNewAttribute(row.name)
        setStatus(row.status)
    }


    const handleUpdate = async () => {
        if (!newAttribute.trim()) {
            toast.error("Attribute name is required")
            return
        }

        try {
            await attributeService.updateAttribute(editId, {
                name: newAttribute.trim(),
                status
            })
            toast.success("Attribute updated successfully")
            setEditId(null)
            setNewAttribute('')
            setStatus('INACTIVE')
            handleGet()
        } catch (err) {
            toast.error("Error updating attribute")
        }
    }




    const handleDelete = async id => {
        await attributeService.deleteAttribute(id)
        toast.success('Attribute deleted successfully')
        handleGet()
    }

    useEffect(() => {
        handleGet()
    }, [])

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: ({ row }) => <Typography>{row.original?.name}</Typography>
        }),
        columnHelper.accessor('name', {
            header: 'Attribute Set',
            cell: ({ row }) => <Typography>{row.original?.attributeSet?.name}</Typography>
        }),
        columnHelper.accessor('status', {
            header: 'Status',
            cell: ({ row }) => (
                <Typography color={row.original.status === 'ACTIVE' ? 'success.main' : 'warning.main'}>
                    {row.original.status}
                </Typography>
            )
        }),
        columnHelper.accessor('actions', {
            header: 'Actions',
            cell: ({ row }) => {
                const isEditing = row.original._id === editId

                return (
                    <div className='flex items-center gap-2'>
                        <>
                            {hasPermission("product_master:edit") && (
                                <IconButton onClick={() => router.push(`/en/apps/product1/attribute/update/${row.original._id}`)}>
                                    <i className='tabler-edit text-blue-500' />
                                </IconButton>
                            )}
                            {hasPermission("product_master:delete") && (
                                <IconButton onClick={() => handleDelete(row.original._id)}>
                                    <i className='tabler-trash text-red-500' />
                                </IconButton>
                            )}
                        </>
                    </div>
                )
            },
            enableSorting: false
        }),
    ], [data])

    const table = useReactTable({
        data: filteredData,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        state: { rowSelection, globalFilter },
        initialState: { pagination: { pageSize: 10 } },
        enableRowSelection: true,
        globalFilterFn: fuzzyFilter,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <Card>
            <Divider />
            {/* Global Filter and Page Size */}
            <div className='flex flex-wrap justify-between items-center gap-4 p-6'>
                <div className='flex gap-4 flex-wrap'>
                    <CustomTextField
                        value={globalFilter ?? ''}
                        onChange={e => setGlobalFilter(e.target.value)}
                        placeholder='Search Attribute'
                        className='min-w-[200px]'
                    />
                    <CustomTextField
                        select
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                        className='min-w-[100px]'
                    >
                        <MenuItem value='10'>10</MenuItem>
                        <MenuItem value='25'>25</MenuItem>
                        <MenuItem value='50'>50</MenuItem>
                    </CustomTextField>
                </div>

                {hasPermission("product_master:add") && (
                    <div className='ml-auto'>
                        <Button variant='contained' onClick={() => router.push('/en/apps/product1/attribute/create')}>
                            Add Attribute
                        </Button>
                    </div>)}
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
                                                {header.column.getIsSorted() === 'asc' && (
                                                    <i className='tabler-chevron-up text-xl' />
                                                )}
                                                {header.column.getIsSorted() === 'desc' && (
                                                    <i className='tabler-chevron-down text-xl' />
                                                )}
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
                                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                                    No data available
                                </td>
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
                component={() => <TablePaginationComponent table={table} />}
                count={table.getFilteredRowModel().rows.length}
                rowsPerPage={table.getState().pagination.pageSize}
                page={table.getState().pagination.pageIndex}
                onPageChange={(_, page) => table.setPageIndex(page)}
            />
        </Card>
    )
}

export default AttributeListTable
