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

export default function page() {
    // 🧩 Dummy Data
    const data = useMemo(
        () => [
            { id: 1, name: 'Amit', age: 25, city: 'Delhi' },
            { id: 2, name: 'Priya', age: 30, city: 'Mumbai' },
            { id: 3, name: 'Rahul', age: 22, city: 'Lucknow' },
            { id: 4, name: 'Sneha', age: 28, city: 'Jaipur' },
            { id: 5, name: 'Deepanshu', age: 26, city: 'Kanpur' },
        ],
        []
    )

    // 🧩 Columns Define
    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
                // cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'age',
                header: 'Age',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'city',
                header: 'City',
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: 'Con',
                header: (ctx) => <h5>City</h5>,
                cell: (info) => info.getValue(),
            },
        ],
        []
    )

    // 🧩 States
    const [sorting, setSorting] = useState([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 3,
    })

    // 🧩 Table Instance
    // const table = useReactTable({
    //     data,
    //     columns,
    //     state: {
    //         sorting,
    //         globalFilter,
    //         pagination,
    //     },
    //     onSortingChange: setSorting,
    //     onPaginationChange: setPagination,
    //     onGlobalFilterChange: setGlobalFilter,
    //     getCoreRowModel: getCoreRowModel(),
    //     getSortedRowModel: getSortedRowModel(),
    //     getFilteredRowModel: getFilteredRowModel(),
    //     getPaginationRowModel: getPaginationRowModel(),
    // })

    const table = useReactTable({
        data,
        columns
    })
    // console.log(table, "dd")

    return (
        <Paper className='p-4 shadow-md'>
            <h2 className='text-lg font-semibold mb-2'>📊 TanStack Table Example</h2>

            {/* 🔍 Search */}
            <TextField
                label='Search by name'
                variant='outlined'
                size='small'
                fullWidth
                className='mb-4'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
            />

            {/* 🧾 Table */}
            <TableContainer>
                <Table>
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (

                            // <TableRow key={headerGroup.id}>
                            //     {headerGroup.headers.map((header) => (
                            //         <TableCell key={header.id}>
                            //             {header.isPlaceholder ? null : (
                            //                 <TableSortLabel
                            //                     active={!!header.column.getIsSorted()}
                            //                     direction={
                            //                         header.column.getIsSorted() === 'desc' ? 'desc' : 'asc'
                            //                     }
                            //                     onClick={header.column.getToggleSortingHandler()}
                            //                 >
                            //                     {flexRender(
                            //                         header.column.columnDef.header,
                            //                         header.getContext()
                            //                     )}
                            //                 </TableSortLabel>
                            //             )}
                            //         </TableCell>
                            //     ))}
                            // </TableRow>
                            // console.log(headerGroup, "d")
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((item) => (
                                    <TableCell key={item.id}>
                                        {flexRender(item.column.columnDef.header, item.getContext())}
                                        {/* {console.log(item.getContext(), "dd")} */}
                                        {/* {item.column.columnDef.header} */}
                                    </TableCell>
                                ))}

                            </TableRow>


                        ))}
                    </TableHead>

                    {/* <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cel l, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody> */}
{/* 
                    <TableBody>
                        {table.getRowModel().rows.map((column) => (
                            console.log(column, "d")
                        ))}
                    </TableBody> */}
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
                rowsPerPageOptions={[3, 5, 10]}
            />
        </Paper>
    )
}
