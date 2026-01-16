'use client'
import React, { useState } from 'react'
import { TableRow, Table, TableContainer, TableHead, TableCell, TableSortLabel, TableBody, Typography, Button, FormControl, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Chip } from '@mui/material'
import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { Eye, Pencil, PrinterIcon, Trash2 } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import { useAuth } from '@/contexts/AuthContext'
import { date } from 'valibot'
import Link from '@/components/Link'
import Printer from './Printer'


const rowsPerPageOptions = [5, 10, 25, 50]

const statusStyles = {
    PENDING: "warning",
    COMPLETED: "success",
    FAILED: "error",
}

function BookedTable({ quizType, Eventid, lang }) {
    const { hasPermission } = useAuth();
    // const [quizType, setQuizType] = useState(quizType);

    // modal state
    const [ticketid, setticketid] = useState('');
    const [open, setOpen] = useState(false)
    const handleClickOpen = (id) => {
        setOpen(true)
        setticketid(id);
    }
    const handleClose = () => setOpen(false)


    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)



    // Sorting state - default to newest first
    const [orderBy, setOrderBy] = useState('createdAt')
    const [order, setOrder] = useState('desc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const sortedData = [...quizType].sort((a, b) => {
        // For date fields, newest first by default
        if (orderBy === 'createdAt' || orderBy === 'id') {
            if (order === 'desc') {
                return new Date(b[orderBy]) - new Date(a[orderBy])
            } else {
                return new Date(a[orderBy]) - new Date(b[orderBy])
            }
        }

        // For other fields
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1
        }
        return 0
    })

    // pagination
    const paginatedData = sortedData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }


    const date = (dateString) => {
        const date = new Date(dateString);
        const newdate = date.toLocaleDateString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        return newdate
    }

    return (
        <div>
            {/* modal */}
            <Printer open={open} ticketid={ticketid} handleClose={handleClose} />
            {/* table */}
            <TableContainer className='shadow p-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='mb-4'>All Tickets on Particular Events</h3>
                    <div className='flex items-center gap-2 mx-4'>
                        <Typography variant='body2'>Rows per page:</Typography>
                        <FormControl size='small' variant='standard'>
                            <Select
                                value={rowsPerPage}
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
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'ticketid'}
                                    direction={orderBy === 'ticketid' ? order : 'desc'}
                                    onClick={() => handleRequestSort('ticketid')}
                                >
                                    Ticket ID                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'Eventid'}
                                    direction={orderBy === 'Eventid' ? order : 'desc'}
                                    onClick={() => handleRequestSort('Eventid')}
                                >
                                    Event
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'createdAt'}
                                    direction={orderBy === 'createdAt' ? order : 'desc'}
                                    onClick={() => handleRequestSort('createdAt')}
                                >
                                    Date
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'quantity'}
                                    direction={orderBy === 'quantity' ? order : 'desc'}
                                    onClick={() => handleRequestSort('quantity')}
                                >
                                    Tickets
                                </TableSortLabel>
                            </TableCell>


                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'user'}
                                    direction={orderBy === 'user' ? order : 'desc'}
                                    onClick={() => handleRequestSort('user')}
                                >
                                    Customer
                                </TableSortLabel>
                            </TableCell>
                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'cust_paid'}
                                    direction={orderBy === 'cust_paid' ? order : 'desc'}
                                    onClick={() => handleRequestSort('cust_paid')}
                                >
                                    Amount Paid
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'paid_via'}
                                    direction={orderBy === 'paid_via' ? order : 'desc'}
                                    onClick={() => handleRequestSort('paid_via')}
                                >
                                    Paid Via
                                </TableSortLabel>
                            </TableCell>

                            <TableCell className='p-2'>
                                <TableSortLabel
                                    active={orderBy === 'status'}
                                    direction={orderBy === 'status' ? order : 'desc'}
                                    onClick={() => handleRequestSort('status')}
                                >
                                    Payment Status
                                </TableSortLabel>
                            </TableCell>



                            <TableCell className='p-2'>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row) => (
                            <TableRow key={row._id} className='border-b'>
                                <TableCell className='p-2 max-w-xs overflow-clip text-ellipsis whitespace-nowrap'>
                                    <div className='font-medium'>{row?.ticketid}</div>
                                </TableCell>
                                <TableCell className='p-2'>{row?.Eventid?.event_title}</TableCell>
                                <TableCell className='p-2'>{date(row?.createdAt)}</TableCell>
                                <TableCell className='p-2'>{row?.quantity}</TableCell>
                                <TableCell className='p-2'>{row?.user?.firstName} {row?.user?.lastName}</TableCell>
                                <TableCell className='p-2'>{row?.cust_paid}</TableCell>
                                <TableCell className='p-2'>{row?.paid_via}</TableCell>
                                <TableCell className='p-2'>
                                    <Chip label={row?.status} color={statusStyles[row?.status]} variant='tonal' />
                                </TableCell>

                                <TableCell className='p-2'>

                                    {hasPermission('event_manageEvents:view') && (
                                        <Link href={`/${lang}/apps/event/allTickets/detail/${row._id}`}>
                                            <Eye className='text-gray-600 mx-2 size-5 cursor-pointer hover:scale-110 transition' />
                                        </Link>
                                    )}
                                    {hasPermission('event_manageEvents:delete') && (
                                        <Trash2 className='text-red-500 mx-2 size-5 cursor-pointer hover:scale-110 transition' />
                                    )}

                                    <Link>
                                        <PrinterIcon onClick={() => handleClickOpen(row._id)} className='text-blue-500 mx-2 size-5 cursor-pointer hover:scale-110 transition' />
                                    </Link>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className='flex flex-col sm:flex-row justify-between items-center m-4 gap-4'>
                    <Typography variant='body2' className='text-gray-600'>
                        Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, quizType.length)} of {quizType.length} entries
                    </Typography>
                    <PaginationRounded
                        count={Math.ceil(quizType.length / rowsPerPage)}
                        page={currentPage}
                        onChange={(event, value) => setCurrentPage(value)}
                    />
                </div>
            </TableContainer>
        </div>
    )
}

export default BookedTable 
