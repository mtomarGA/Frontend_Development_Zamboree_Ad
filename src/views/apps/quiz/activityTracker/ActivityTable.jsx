'use client'

import React, { useState } from 'react'
import {
    TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody,
    Typography, Button, FormControl, Select, MenuItem
} from '@mui/material'
import Grid from '@mui/material/Grid'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'

const rowsPerPageOptions = [5, 10, 25, 50]

function ActivityTable({ quizType }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    const handleRequestSort = property => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const expiryDateFun = ExpiryDate => {
        const date = new Date(ExpiryDate)
        return date.toLocaleDateString('en-GB')
    }

    // 🔍 Filter logic based on search input
    const filteredData = quizType.filter(row =>
        row?.userDetails?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        row?.userDetails?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        row?.details?.toLowerCase().includes(search.toLowerCase()) ||
        row?.id?.toString().includes(search)
    )

    const sortedData = [...filteredData].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    return (
        <div>
            <TableContainer className='shadow p-6'>
                {/* search bar */}
                <div className='flex justify-between items-center mb-4'>
                    <Grid item xs={12} md={3}>
                        <CustomTextField
                            id='form-props-search'
                            label='Search'
                            type='search'
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value)
                                setCurrentPage(1)
                            }}
                            fullWidth
                        />
                    </Grid>
                </div>

                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Activity Tracker</h3>
                    <div className='flex items-center gap-2 mx-4'>
                        <Typography variant='body2'>Rows per page:</Typography>
                        <FormControl size='small' variant='standard'>
                            <Select
                                value={rowsPerPage}
                                className='mx-2 w-16'
                                onChange={handleChangeRowsPerPage}
                                label='Rows per page'
                            >
                                {rowsPerPageOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>

                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            {['id', 'name', 'details', 'coins', 'date'].map(column => (
                                <TableCell key={column} className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === column}
                                        direction={orderBy === column ? order : 'asc'}
                                        onClick={() => handleRequestSort(column)}
                                    >
                                        {column.charAt(0).toUpperCase() + column.slice(1)}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map(row => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2'>{row.id}</TableCell>
                                <TableCell className='p-2'>
                                    {row?.userDetails?.firstName} {row?.userDetails?.lastName}
                                </TableCell>
                                <TableCell className='p-2'>{row.details}</TableCell>
                                <TableCell className='p-2'>{row.coins}</TableCell>
                                <TableCell className='p-2'>{expiryDateFun(row.createdAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(filteredData.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default ActivityTable
