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
import ShowTransaction from './ShowTransaction'
import quizRoute from '@/services/quiz/quiztypeServices'
import { toast } from 'react-toastify'

const rowsPerPageOptions = [5, 10, 25, 50]

const stylesStatus = {
    "COMPLETED": "success",
    "PENDING": "warning",
    "FAILED": "error"

}
function PurchaseTable({ data, GetTransaction }) {
    // modal

    const [open, setOpen] = useState(false)
    const [ShowData, setShowData] = useState({});
    const handleClickOpen = (row) => {
        setShowData(row);
        setOpen(true);
    }

    // const [data, setdata] = useState(data);
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [search, setSearch] = useState('')
    const [orderBy, setOrderBy] = useState('id')
    const [order, setOrder] = useState('asc')


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
    const filteredData = data.filter((row) =>
        row?.id?.toLowerCase().includes(search.toLowerCase()) ||
        row?.packageId?.title?.toLowerCase().includes(search.toLowerCase()) ||
        row?.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
        row?.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        row?.paid_via?.toLowerCase().includes(search.toLowerCase()) ||
        row?.status?.toLowerCase().includes(search.toLowerCase()) ||
        row?.order_id?.toLowerCase().includes(search.toLowerCase()) ||
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

    const Deletefun = async (id) => {
        try {
            const res = await quizRoute.DeleteCoinTransaction(id);
            if (res.success == true) {
                toast.success(res?.message || "Coin Transaction Deleted Successfully");
                GetTransaction();
                return;
            }

        } catch (error) {
            console.log(error, "error");
            toast.error(error);
        }
    }

    return (
        <div>

            <ShowTransaction open={open} ShowData={ShowData} handleClickOpen={handleClickOpen} setOpen={setOpen} />

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
                                { key: 'title', label: 'Coin Pack Name' },
                                { key: 'paid_via', label: 'Payment Gateway' },
                                { key: 'transaction_id', label: 'Transaction ID' },
                                { key: 'createdAt' || 'updatedAt', label: 'Payment Date' },
                                { key: 'status', label: 'Payment Status' },
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
                                <TableCell className='p-2'>{row?.user?.firstName}&nbsp;{row?.user?.lastName}</TableCell>
                                <TableCell className='p-2'>{row?.packageId?.title}</TableCell>
                                <TableCell className='p-2'>{row?.paid_via}</TableCell>
                                <TableCell className='p-2'>{row?.transaction_id}</TableCell>
                                {/* <TableCell className='p-2'>{row.coins}</TableCell> */}
                                <TableCell className='p-2'>{row?.updatedAt ? <>{new Date(row.updatedAt).toLocaleString()}</> : new Date(row?.createdAt).toLocaleString()}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row.status} variant='tonal' color={stylesStatus[row.status]} />
                                </TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row?.orderStatus} variant='tonal' color={stylesStatus[row.orderStatus]} />
                                </TableCell>
                                <TableCell className='p-2 flex gap-2 items-center'>
                                    <Eye size={20} className='cursor-pointer text-blue-500' onClick={() => handleClickOpen(row)} />
                                    <Trash2 size={20} className='cursor-pointer text-red-500' onClick={() => Deletefun(row?._id)} />

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

export default PurchaseTable
