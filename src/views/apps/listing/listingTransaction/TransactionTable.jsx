'use client'
import React, { useEffect, useState } from 'react'
import {
    Table, TableContainer, TableHead, TableRow, TableCell,
    TableBody, TableSortLabel, Typography, FormControl, Select, MenuItem, Button, Chip, Avatar
} from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '@views/apps/announce/list/pagination'
import { Eye, Trash2 } from 'lucide-react'
import ListingPackage from '@/services/listingPackage/PackageService'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

const rowsPerPageOptions = [5, 10, 25, 50]

const statusColors = {
    COMPLETED: 'success',
    FAILED: 'error',
    PENDING: 'warning'
}

export default function ListingTransactionTable() {
    const { hasPermission } = useAuth();

    const [transactions, setTransactions] = useState([])
    const getTransFun = async () => {
        const res = await ListingPackage.getTransaction();
        setTransactions(res.data || []);
    }

    useEffect(() => {
        getTransFun();
    }, []);


    const handleDelete = async (id) => {
        try {
            const res = await ListingPackage.deleteTrans(id);
            if (res.success === true) {
                toast.success(res.message || 'Transaction deleted successfully');
                // setTransactions(transactions.filter(item => item.id !== id));
                getTransFun();
                return;
            }
            toast.error(res.message || 'Failed to delete the transaction');
        } catch (error) {
            console.error('Error deleting live meeting:', error)
            throw error?.response?.data || { message: 'Something went wrong while deleting the meeting' }
        }
    }







    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [orderBy, setOrderBy] = useState('createdAt')
    const [order, setOrder] = useState('desc')

    // Sorting
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...transactions].sort((a, b) => {
        if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
        if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1
        return 0
    })

    // Pagination
    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    return (
        <TableContainer className="shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="mb-4">Partner Package Transactions</h3>
                <div className="flex items-center gap-2 mx-4">
                    <Typography variant="body2">Rows per page:</Typography>
                    <FormControl size="small" variant="standard">
                        <Select
                            value={rowsPerPage}
                            className="mx-2 w-16"
                            onChange={handleChangeRowsPerPage}
                            label="Rows per page"
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
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'order_id'}
                                direction={orderBy === 'order_id' ? order : 'asc'}
                                onClick={() => handleRequestSort('order_id')}
                            >
                                Order ID
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>Package ID</TableCell>
                        {/* <TableCell>Paid Via</TableCell> */}
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'price'}
                                direction={orderBy === 'price' ? order : 'asc'}
                                onClick={() => handleRequestSort('price')}
                            >
                                Price
                            </TableSortLabel>
                        </TableCell>

                        <TableCell>Transaction ID</TableCell>
                        {/* <TableCell>Order Status</TableCell> */}
                        <TableCell>Status</TableCell>
                        <TableCell>Company Name</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {paginatedData.map((row) => (
                        <TableRow key={row._id} className="border-b">
                            <TableCell>{row?.orderId}</TableCell>
                            <TableCell>
                                {row?.packageId?.title || '-'}
                            </TableCell>
                            {/* <TableCell>{row.paid_via}</TableCell> */}
                            <TableCell>₹{row?.packageId?.price}</TableCell>
                            <TableCell>{row?.payment_id === "0" ? '-' : row?.payment_id}</TableCell>

                            {/* <TableCell>
                                <Chip
                                    label={row.orderStatus}
                                    color={statusColors[row.orderStatus]}
                                    variant="tonal"
                                    size="small"
                                />
                            </TableCell> */}
                            <TableCell>
                                <Chip
                                    label={row.status}
                                    color={statusColors[row.status]}
                                    variant="tonal"
                                    size="small"
                                />
                            </TableCell>

                            <TableCell>
                                {row.user?.companyInfo?.companyName || row.user?.email || '-'}
                            </TableCell>

                            <TableCell>
                                {new Date(row.createdAt).toLocaleDateString()}
                            </TableCell>

                            <TableCell>
                                {/* <Eye className="text-blue-500 cursor-pointer hover:scale-110 transition" /> */}
                                {hasPermission('partner_packages_transaction:delete') && (
                                    <Trash2 className="text-red-500 cursor-pointer hover:scale-110 transition" onClick={() => handleDelete(row._id)} />
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex flex-col sm:flex-row justify-between items-center m-4 gap-4">
                <Typography variant="body2" className="text-gray-600">
                    Showing {(currentPage - 1) * rowsPerPage + 1}–
                    {Math.min(currentPage * rowsPerPage, transactions.length)} of {transactions.length} entries
                </Typography>
                <PaginationRounded
                    count={Math.ceil(transactions.length / rowsPerPage)}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                />
            </div>
        </TableContainer>
    )
}


// import React from 'react'

// function ListingTransactionTable() {
//     return (
//         <div>TransactionTable</div>
//     )
// }

// export default ListingTransactionTable
