'use client'

import React, { useMemo, useState } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    flexRender,
} from '@tanstack/react-table'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    TextField,
    Paper,
} from '@mui/material'
import { Eye } from 'lucide-react'

export default function IntrestedTable({ data, fetchData, setData }) {
    // 🧩 Dummy Data
    // const data = useMemo(
    //     () => [
    //         { id: 1, userId: 1, name: 'Amit', age: 25, city: 'Delhi', interested: true },
    //         { id: 2, userId: 2, name: 'Priya', age: 30, city: 'Mumbai', interested: true },
    //         { id: 3, userId: 3, name: 'Rahul', age: 22, city: 'Lucknow', interested: false },
    //         { id: 4, userId: 4, name: 'Sneha', age: 28, city: 'Jaipur', interested: true },
    //         { id: 5, userId: 5, name: 'Deepanshu', age: 26, city: 'Kanpur', interested: false },
    //     ],
    //     []
    // )

    // 🧩 Columns Define
    const columns = useMemo(
        () => [
            {
                accessorKey: 'userId.userId',
                header: 'User ID',
                // cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'userId.email',
                header: 'Email',
                // cell: (info) => info.getValue(),
            },

            {
                accessorKey: 'interested',
                header: 'Interested',
                // console.log(first)
                cell: (info) => info.getValue() ? 'Yes' : 'No',
            },
            {
                accessorKey: 'createdAt',
                header: 'Date',
                cell: (info) => new Date(info.getValue()).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                }),
            },

            {
                header: 'Action',
                cell: (info) => {
                    return (
                        <div className='flex gap-2'>
                            <Eye className='text-blue-500' />
                        </div>
                    );
                },
            }


        ],
        []
    )

    // 🧩 States
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    })

    // 🧩 Table Instance
    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    // const table = useReactTable({
    //     data,
    //     columns
    // })
    // console.log(table, "dd")

    return (
        <Paper className='p-4 shadow-md'>
            <h2 className='text-lg font-semibold mb-2'>Plan Interested</h2>

            {/* 🔍 Search */}
            <TextField
                label='Search by name'
                variant='outlined'
                size='small'

                className='mb-4'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />

            {/* 🧾 Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        sx={{
                                            fontSize: '0.5rem',          // 🔹 increase font size
                                            fontWeight: 400,           // 🔹 make bold
                                            // backgroundColor: '#f9fafb',// optional subtle background
                                            // color: '#111827',          // dark gray
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <TableSortLabel
                                                active={!!header.column.getIsSorted()}
                                                direction={
                                                    header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                                sx={{
                                                    fontSize: '0.9rem', // 🔹 ensures label text matches size
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableSortLabel>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>


                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>

            {/* 📑 Pagination */}
            <TablePagination
                component='div'
                count={data.length}
                page={pagination.pageIndex}
                rowsPerPage={pagination.pageSize}
                onPageChange={(_, newPage) => table.setPageIndex(newPage)}
                onRowsPerPageChange={(e) => {
                    table.setPageSize(Number(e.target.value))
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Paper>
    )
}
