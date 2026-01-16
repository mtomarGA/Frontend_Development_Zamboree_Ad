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

// Third-party Imports
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
import serviceAttributeService from '@/services/business/service/serviceAttribute.service.js'
import DeleteConfirmationDialog from '@/views/apps/deleteConfirmation'

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const columnHelper = createColumnHelper()

const AttributeListTable = () => {
    const [data, setData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [rowSelection, setRowSelection] = useState({})
    const [globalFilter, setGlobalFilter] = useState('')
    const [newAttribute, setNewAttribute] = useState('')
    const [status, setStatus] = useState('ACTIVE')

    const [editId, setEditId] = useState(null)
    const [editName, setEditName] = useState('')
    const [editStatus, setEditStatus] = useState('ACTIVE')

    const { hasPermission } = useAuth()

    const handleGet = async () => {
        const res = await serviceAttributeService.getServiceAttributeSet()
        setData(res.data)
        setFilteredData(res.data)
    }

    const handleAdd = async () => {
        if (!newAttribute.trim()) {
            toast.error("Attribute Set is required")
            return
        }

        try {
            await serviceAttributeService.addServiceAttributeSet({
                name: newAttribute.trim(),
                status
            })
            toast.success("Attribute Set added successfully")
            setNewAttribute('')
            setStatus('ACTIVE') // Reset status to default
            handleGet()
        } catch (err) {
            toast.error("Error adding attribute set")
        }
    }

    const handleEdit = (row) => {
        setEditId(row._id)
        setNewAttribute(row.name)
        setStatus(row.status)
    }


    const handleUpdate = async () => {
        if (!newAttribute.trim()) {
            toast.error("Attribute Set is required")
            return
        }

        try {
            await serviceAttributeService.updateServiceAttributeSet(editId, {
                name: newAttribute.trim(),
                status
            })
            toast.success("Attribute updated successfully")
            setEditId(null)
            setNewAttribute('')
            setStatus('ACTIVE')
            handleGet()
        } catch (err) {
            toast.error("Error updating attribute set")
        }
    }


    const handleDelete = async id => {
        await serviceAttributeService.deleteServiceAttributeSet(id)
        toast.success('Attribute set deleted successfully')
        handleGet()
    }

    useEffect(() => {
        handleGet()
    }, [])

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: ({ row }) => <Typography>{row.original.name}</Typography>
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
                        {isEditing ? (
                            <>
                                <Button size='small' variant='contained' onClick={handleUpdate}>
                                    Save
                                </Button>
                                <Button size='small' variant='outlined' color='secondary' onClick={() => setEditId(null)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                {hasPermission("attribute:update") && (
                                    <IconButton onClick={() => handleEdit(row.original)}>
                                        <i className='tabler-edit text-blue-500' />
                                    </IconButton>
                                )}
                                {hasPermission("attribute:delete") && (
                                    <DeleteConfirmationDialog
                                        itemName="Attribute set"
                                        onConfirm={() => handleDelete(row.original._id)}
                                        icon={<i className='tabler-trash text-red-500' />}
                                    />
                                )}
                            </>
                        )}
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
            {/* Name Input and Submit Button */}
            <div className='p-6'>
                <Typography variant='h5' className='mb-4'>
                    Add Attributes Set
                </Typography>
                <div className='flex flex-wrap justify-between items-center gap-4 p-6'>
                    <CustomTextField
                        value={newAttribute}
                        onChange={e => setNewAttribute(e.target.value)}
                        placeholder='Enter attribute set name'
                        className='flex-1 min-w-[50]'
                    />
                    <CustomTextField
                        select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className='flex-1 min-w-[50]'
                    >
                        <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                        <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                    </CustomTextField>

                    {editId ? (
                        <>
                            <Button variant='contained' color='primary' onClick={handleUpdate}>
                                Update Attribute
                            </Button>
                            <Button variant='outlined' color='secondary' onClick={() => {
                                setEditId(null)
                                setNewAttribute('')
                                setStatus('ACTIVE')
                            }}>
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button variant='contained' onClick={handleAdd}>
                            Add Attribute Set
                        </Button>
                    )}
                </div>
            </div>
            <Divider />
            {/* Global Filter and Page Size */}
            <div className='flex flex-wrap justify-between items-center gap-4 p-6'>
                <CustomTextField
                    value={globalFilter ?? ''}
                    onChange={e => setGlobalFilter(e.target.value)}
                    placeholder='Search Attribute'
                    className='flex-2'
                />
                <CustomTextField
                    select
                    value={table.getState().pagination.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                    className=''
                >
                    <MenuItem value='10'>10</MenuItem>
                    <MenuItem value='25'>25</MenuItem>
                    <MenuItem value='50'>50</MenuItem>
                </CustomTextField>
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
