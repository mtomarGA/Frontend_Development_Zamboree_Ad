'use client'

import React, { useEffect, useState } from 'react'
import {
    TableRow,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableSortLabel,
    TableBody,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Chip,
    Button
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import CustomTextField from '@core/components/mui/TextField'
import { Eye, Trash2 } from 'lucide-react'

const rowsPerPageOptions = [5, 10, 25, 50]

const stylesStatus = {
    SUCCESS: 'success',
    PENDING: 'error',

}
function UserPurchaseTable() {
    const [quizType, setQuizType] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')

    useEffect(() => {
        // Replace this with actual fetch logic
        const dummyData = [
            {
                _id: '1',
                order_id: 'P001',
                name: 'John Doe',
                order_status: 'SUCCESS',
                payment_status: 'SUCCESS',
                payment_gateway: 'Paypal',
                coin_pack_name: 'Coins 100',
                transaction_id: 'TX123456',
                product_id: 'coins_100',
                coins: 100,
                date: new Date().toLocaleDateString()
            },
            {
                _id: '2',
                order_id: 'P002',
                name: 'Jane Smith',
                order_status: 'PENDING',
                payment_status: 'PENDING',
                payment_gateway: 'Paypal',
                coin_pack_name: 'Coins 500',
                transaction_id: 'TX654321',
                product_id: 'coins_500',
                coins: 500,
                date: new Date().toLocaleDateString()
            }
        ]
        setQuizType(dummyData)
    }, [])

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    // Filter by search term
    const filteredData = quizType.filter((row) =>
        row?.id?.toLowerCase().includes(search.toLowerCase()) ||
        row?.name?.toLowerCase().includes(search.toLowerCase()) ||
        row?.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
        row?.product_id?.toLowerCase().includes(search.toLowerCase()) ||
        row?.coin_pack_name?.toLowerCase().includes(search.toLowerCase()) ||
        row?.payment_gateway?.toLowerCase().includes(search.toLowerCase()) ||
        row?.payment_status?.toLowerCase().includes(search.toLowerCase()) ||
        row?.order_status?.toLowerCase().includes(search.toLowerCase()) ||
        row?.coins?.toString().includes(search)
    )

    // Apply sort
    const sortedData = [...filteredData].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
        return 0
    })

    // Paginate
    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    return (
        <div>
            <TableContainer className='shadow p-6'>
                {/* Search */}
                <div className='flex justify-between items-center mb-4'>
                    <Grid size={{ xs: 12, md: 2 }}>
                        <CustomTextField
                            id='form-props-search'
                            label='Search field'
                            type='search'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Grid>
                </div>

                {/* Header and Rows Per Page */}
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>Coin Order</h3>
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

                {/* Table */}
                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            {[
                                { key: 'order_id', label: 'Order ID' },
                                { key: 'name', label: 'Name' },
                                { key: 'coin_pack_name', label: 'Coin Pack Name' },
                                { key: 'payment_gateway', label: 'Payment Gateway' },
                                { key: 'transaction_id', label: 'Transaction ID' },
                                { key: 'date', label: 'Payment Date' },
                                { key: 'payment_status', label: 'Payment Status' },
                                { key: 'order_status', label: 'Order Status' },
                                { key: 'action', label: 'Action' },


                            ].map(col => (
                                <TableCell key={col.key} className='p-2'>
                                    <TableSortLabel
                                        active={orderBy === col.key}
                                        direction={orderBy === col.key ? order : 'asc'}
                                        onClick={() => handleRequestSort(col.key)}
                                    >
                                        {col.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2'>{row.order_id}</TableCell>
                                <TableCell className='p-2'>{row.name}</TableCell>
                                <TableCell className='p-2'>{row.coin_pack_name}</TableCell>
                                <TableCell className='p-2'>{row.payment_gateway}</TableCell>
                                <TableCell className='p-2'>{row.transaction_id}</TableCell>
                                {/* <TableCell className='p-2'>{row.coins}</TableCell> */}
                                <TableCell className='p-2'>{row.date}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row.payment_status} variant='tonal' color={stylesStatus[row.payment_status]} />
                                </TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row.order_status} variant='tonal' color={stylesStatus[row.order_status]} />
                                </TableCell>
                                <TableCell className='p-2 flex gap-2 items-center'>
                                    <Eye size={20} className='cursor-pointer text-blue-500' />
                                    <Trash2 size={20} className='cursor-pointer text-red-500' />

                                    <Button variant='tonal' size='small' color='primary'>
                                        Order Status
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–
                        {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
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

export default UserPurchaseTable
