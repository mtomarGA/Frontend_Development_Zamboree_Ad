'use client'

import React, { useState, useEffect } from 'react'
import {
    TableRow,
    Table,
    TableContainer,
    TableHead,
    TableCell,
    TableSortLabel,
    TableBody,
    Typography,
    Button,
    FormControl,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Box,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material'

import tableStyles from '@core/styles/table.module.css'
import PaginationRounded from '../../announce/list/pagination'
import { CheckCircle, XCircle, User, Mail, Ticket, Calendar } from 'lucide-react'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import AttendeesService from '@/services/event/event_mgmt/AttendeesService'
import { toast } from 'react-toastify'

const rowsPerPageOptions = [5, 10, 25, 50]

function CheckInTable({ fetchEvent, AllTickets, Selecteddate, GetBookedUser }) {
    const [formData, setformData] = useState({
        date: Selecteddate,
        quantity: 1
    });

    const [showdata, setshowdataid] = useState(null);
    const [loading, setLoading] = useState(false);

    // Calculate check-in status based on userCheckin property
    const alreadyCheckedIn = showdata ? Number(showdata.userCheckin || 0) : 0;
    const totalBooked = showdata ? Number(showdata.quantity) || 0 : 0;
    const maxCheckinQuantity = totalBooked - alreadyCheckedIn;

    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchText, setSearchText] = useState('')

    // Edit modal state
    const [Editopen, setEditOpen] = useState(false)
    const handleEditOpen = (row) => {
        setEditOpen(true)
        setshowdataid(row);
        setformData({
            ticket: row?._id,
            Eventid: row?.Eventid?._id,
            date: Selecteddate,
            quantity: 1
        })
    }

    const handleEditClose = () => {
        setEditOpen(false)
        setshowdataid(null);
    }

    const [orderBy, setOrderBy] = useState('ticketid')
    const [order, setOrder] = useState('asc')

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc'
        setOrder(isAsc ? 'desc' : 'asc')
        setOrderBy(property)
    }

    const filteredData = AllTickets.filter(row => {
        const search = searchText.toLowerCase()
        return (
            row?.ticketid?.toLowerCase().includes(search) ||
            row?.user?.email?.toLowerCase().includes(search) ||
            `${row?.user?.firstName} ${row?.user?.lastName}`.toLowerCase().includes(search)
        )
    })

    const sortedData = [...filteredData].sort((a, b) => {
        // Handle nested properties for sorting
        const aValue = orderBy.includes('.')
            ? orderBy.split('.').reduce((obj, key) => obj && obj[key], a)
            : a[orderBy];

        const bValue = orderBy.includes('.')
            ? orderBy.split('.').reduce((obj, key) => obj && obj[key], b)
            : b[orderBy];

        if (aValue < bValue) return order === 'asc' ? -1 : 1
        if (aValue > bValue) return order === 'asc' ? 1 : -1
        return 0
    })

    const paginatedData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setCurrentPage(1)
    }

    const CheckInFun = async () => {
        setLoading(true);
        try {
            const response = await AttendeesService.Post(formData);
            if (response?.success == true) {
                toast.success(response?.message);
                await GetBookedUser();
               
                handleEditClose();
            } else {
                toast.error(response?.message || "Check-in failed");
            }
        } catch (error) {
            toast.error("An error occurred during check-in");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // Update check-in (increase quantity for same ticket/date)
  const updateCheckin = async () => {
    setLoading(true)
    try {
      const updatePayload = {
        quantity: formData?.quantity,
        date: Selecteddate
      }
      const response = await AttendeesService.putData(showdata._id, updatePayload)
      console.log(response, "Update Response")

      if (response?.success) {
        toast.success(response?.message)
        await GetBookedUser()
        handleEditClose()
      } else {
        toast.error(response?.message || "Update failed")
      }
    } catch (error) {
      toast.error("An error occurred during update")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
    // Update formData when Selecteddate changes
    useEffect(() => {
        setformData(prev => ({
            ...prev,
            date: Selecteddate
        }));
    }, [Selecteddate]);

    return (
        <div>
            {/* Edit Modal */}
            <Dialog
                onClose={handleEditClose}
                aria-labelledby='customized-dialog-title'
                open={Editopen}
                fullWidth
                maxWidth="sm"
                closeAfterTransition={false}
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title' sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant='h5' component='span'>Check In Attendees</Typography>
                    <DialogCloseButton onClick={handleEditClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    {showdata && (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <User size={20} style={{ marginRight: '8px' }} />
                                <Typography variant="body1">
                                    <strong>Name:</strong> {showdata?.user?.firstName} {showdata?.user?.lastName}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Mail size={20} style={{ marginRight: '8px' }} />
                                <Typography variant="body1">
                                    <strong>Email:</strong> {showdata?.user?.email}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Ticket size={20} style={{ marginRight: '8px' }} />
                                <Typography variant="body1">
                                    <strong>Ticket ID:</strong> {showdata?.ticketid}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Calendar size={20} style={{ marginRight: '8px' }} />
                                <Typography variant="body1">
                                    <strong>Booked Date:</strong> {new Date(showdata?.bookeddate).toLocaleDateString()}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="body1">
                                    <strong>Booked Tickets:</strong> {showdata?.quantity}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Already Checked In:</strong> {alreadyCheckedIn}
                                </Typography>
                            </Box>

                            {maxCheckinQuantity <= 0 ? (
                                <Alert severity="success" sx={{ my: 2 }}>
                                    All tickets have been checked in already.
                                </Alert>
                            ) : (
                                <>
                                    <Alert severity="info" sx={{ my: 2 }}>
                                        You can check in up to {maxCheckinQuantity} more attendees.
                                    </Alert>

                                    <CustomTextField
                                        fullWidth
                                        name='quantity'
                                        sx={{ mt: 2 }}
                                        label="Number of Attendees to Check In"
                                        placeholder="Enter quantity"
                                        type="number"
                                        value={formData.quantity || ''}
                                        inputProps={{
                                            min: 1,
                                            max: maxCheckinQuantity
                                        }}
                                        onChange={(e) => {
                                            const val = Math.max(1, Math.min(maxCheckinQuantity, Number(e.target.value)));
                                            setformData({ ...formData, quantity: val });
                                        }}
                                    />
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose} variant='tonal' color='secondary'>Close</Button>
                    {maxCheckinQuantity > 0 && (
                        alreadyCheckedIn === 0 ? (
                            <Button
                                onClick={CheckInFun}
                                variant='contained'
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={16} /> : <CheckCircle size={18} />}
                            >
                                {loading ? 'Processing...' : 'Check In'}
                            </Button>
                        ) : (
                            <Button
                                onClick={updateCheckin}
                                variant='contained'
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={16} /> : <CheckCircle size={18} />}
                            >
                                {loading ? 'Updating...' : 'Update Check In'}
                            </Button>
                        )
                    )}
                </DialogActions>
            </Dialog>

            {/* Table Section */}
            <TableContainer className='m-2 my-4 p-6'>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <Typography variant='h5'>Check In Management</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
                        <Grid item xs={12} md={8} sx={{ width: { xs: '100%', sm: '300px' } }}>
                            <CustomTextField
                                fullWidth
                                id='search-attendees'
                                label='Search by Ticket ID, Name or Email'
                                type='search'
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                                size="small"
                            />
                        </Grid>

                        <FormControl size='small' variant='outlined' sx={{ minWidth: 120 }}>
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
                    </Box>
                </Box>

                <Table className={tableStyles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'ticketid'}
                                    direction={orderBy === 'ticketid' ? order : 'asc'}
                                    onClick={() => handleRequestSort('ticketid')}
                                >
                                    Ticket ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'user.firstName'}
                                    direction={orderBy === 'user.firstName' ? order : 'asc'}
                                    onClick={() => handleRequestSort('user.firstName')}
                                >
                                    Attendee Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'user.email'}
                                    direction={orderBy === 'user.email' ? order : 'asc'}
                                    onClick={() => handleRequestSort('user.email')}
                                >
                                    Email
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'quantity'}
                                    direction={orderBy === 'quantity' ? order : 'asc'}
                                    onClick={() => handleRequestSort('quantity')}
                                >
                                    Booked Qty
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                Checked In
                            </TableCell>
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row) => {
                                const checkedIn = row.userCheckin || 0;
                                const remaining = row.quantity - checkedIn;

                                return (
                                    <TableRow key={row?._id} hover>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                {row?.ticketid}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {row?.user?.firstName} {row?.user?.lastName}
                                        </TableCell>
                                        <TableCell>
                                            {row?.user?.email}
                                        </TableCell>
                                        <TableCell>
                                            {row?.quantity}
                                        </TableCell>
                                        <TableCell>
                                            {row?.userCheckin}
                                        </TableCell>
                                        <TableCell>
                                            {remaining === 0 ? (
                                                <Chip
                                                    label="Fully Checked In"
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                />
                                            ) : (
                                                <Chip
                                                    label={`${remaining} Remaining`}
                                                    size="small"
                                                    color="warning"
                                                    variant="outlined"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                size='small'
                                                variant="outlined"
                                                onClick={() => handleEditOpen(row)}
                                                disabled={remaining === 0}
                                                startIcon={<CheckCircle size={16} />}
                                            >
                                                Check In
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <XCircle size={48} color="#ccc" />
                                        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                                            No tickets found
                                        </Typography>
                                        {searchText && (
                                            <Typography variant="body2" color="textSecondary">
                                                Try adjusting your search query
                                            </Typography>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {filteredData.length > 0 && (
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mt: 4, gap: 2 }}>
                        <Typography variant='body2' color="textSecondary">
                            Showing {(currentPage - 1) * rowsPerPage + 1}–
                            {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
                        </Typography>
                        <PaginationRounded
                            count={Math.ceil(filteredData.length / rowsPerPage)}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                        />
                    </Box>
                )}
            </TableContainer>
        </div>
    )
}

export default CheckInTable
