'use client'
import React, { useState, useEffect, useRef } from 'react'
import {
    Box, Typography, Grid, Card, CardContent,
    Table, TableBody, TableCell, TableHead, TableRow,
    Button, Chip
} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import TicketService from '@/services/event/event_mgmt/ticketService'
import { useParams } from 'next/navigation'
import { useReactToPrint } from 'react-to-print'

const BookingDetails = () => {
    const { id } = useParams()
    const [booking, setBooking] = useState(null)

    console.log(id);
    const printRef = useRef()
    const reactToPrintFn = useReactToPrint({
        contentRef: printRef
    })

    const getBookingDetails = async () => {
        try {
            const response = await TicketService.getBookedTicketByTicketId(id)
            console.log(response, "response")
            if (response.success) {
                setBooking(response.data)
            }
        } catch (error) {
            console.error("Failed to fetch booking details", error)
        }
    }

    useEffect(() => {
        if (id) getBookingDetails()
    }, [id])

    if (!booking) return <Typography>Loading booking details...</Typography>

    return (
        <div ref={printRef}>

            <Box p={3}>
                <Typography variant="h5" mb={2} component="div">
                    Booking Details
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" component="div">
                        Ticket ID: {booking?.ticketid || '-'}
                    </Typography>

                    <Button variant="contained" onClick={reactToPrintFn} startIcon={<PrintIcon />}>
                        Print
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Booking Summary */}
                    <Grid item xs={12} md={6} lg={7}>
                        <Card>
                            <CardContent>
                                {booking.event && (
                                    <Typography variant="h6" gutterBottom component="div">
                                        Event: <Button variant="text">{booking?.Eventid?.event_title}</Button>
                                    </Typography>
                                )}
                                <Grid container spacing={1}>
                                    {[
                                        ['Booking Date', booking?.createdAt],
                                        ['Event Start Date', booking.Eventid.startDateTime],
                                        ['Event End Date', booking.Eventid.endDateTime],
                                        ['Duration', booking.duration],
                                        ['Coupon Discount', booking.discount],
                                        // ['Tax (18%)', booking. + ' (Received by Admin)'],
                                        ['Customer Paid', booking?.cust_paid],
                                        // ['Commission (5%)', booking.commission + ' (Received by Admin)'],
                                        ['Received by Organization', booking.received],
                                        ['Paid Via', booking?.paid_via],
                                        ['Quantity', booking?.quantity],
                                        ['Payment Status', <Chip key={booking.id} label={booking?.status} color="success" size="small" />],
                                        ['Ticket Scan Status', booking.scanStatus]
                                    ].map(([label, value], index) => (
                                        <React.Fragment key={index}>
                                            <Grid item xs={5}>
                                                <Typography fontWeight="bold" component="div">{label} :</Typography>
                                            </Grid>
                                            <Grid item xs={7}>
                                                <Typography component="div">{value}</Typography>
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Billing + Organizer */}
                    <Grid item xs={12} md={6} lg={5}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom component="div">
                                            Billing Details
                                        </Typography>
                                        {[
                                            ['Username', `${booking?.user?.firstName} ${booking?.user?.lastName}`],

                                            ['Email', booking?.user?.email],
                                            ['Phone', booking?.user?.phone],
                                            // ['Address', billing.address],
                                            // ['City', billing.city],
                                            // ['State', billing.state],
                                            // ['Country', billing.country]
                                        ].map(([label, value], index) => (
                                            <Typography key={index} component="div">
                                                <strong>{label}:</strong> {value}
                                            </Typography>
                                        ))}
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom component="div">
                                            Organizer Details
                                        </Typography>
                                        {[
                                            ['Username', booking?.Eventid?.organizer?.companyInfo?.companyName],
                                            ['Email', booking?.Eventid?.organizer?.contactInfo?.email],
                                            ['Phone', booking?.Eventid?.organizer?.contactInfo?.phoneNo],
                                            ['Address', booking?.Eventid?.organizer?.locationInfo?.address],
                                            ['City', booking?.Eventid?.organizer?.locationInfo?.city],
                                            ['State', booking?.Eventid?.organizer?.locationInfo?.state],
                                            ['Country', booking?.Eventid?.organizer?.locationInfo?.country]
                                        ].map(([label, value], index) => (
                                            <Typography key={index} component="div">
                                                <strong>{label}:</strong> {value}
                                            </Typography>
                                        ))}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Tickets Table */}
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom component="div">
                        Tickets Info
                    </Typography>
                    <Card>
                        <CardContent>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Ticket</strong></TableCell>
                                        <TableCell><strong>Quantity</strong></TableCell>
                                        <TableCell><strong>Price</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {/* {tickets.map((ticket, idx) => ( */}
                                    <TableRow >
                                        <TableCell>{booking?.tickettype?.ticket_name}</TableCell>
                                        <TableCell>{booking?.quantity}</TableCell>
                                        <TableCell>{booking?.cust_paid ? "₹" + (booking?.cust_paid) : ''}</TableCell>
                                    </TableRow>
                                    {/* ))} */}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </div>
    )
}

export default BookingDetails
