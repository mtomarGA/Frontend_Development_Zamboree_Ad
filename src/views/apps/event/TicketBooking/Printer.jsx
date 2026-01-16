'use client'

import React, { useEffect, useRef, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react';

import {
    Box, Grid, Paper, Divider, Avatar, Button,
    Dialog, Typography, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import { useReactToPrint } from 'react-to-print'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import TicketSettingService from '@/services/event/event_mgmt/TicketSettingService'

const Printer = ({ open, handleClose, ticketid }) => {
    const [data, setdata] = useState([]);

    const printRef = useRef()
    const reactToPrintFn = useReactToPrint({
        contentRef: printRef
    })
    console.log(ticketid, "ss")

    // console.log(ticketid, "printer");

    const printInfo = async () => {
        const response = await TicketSettingService.Print(ticketid);
        console.log(response, "hiii");
        setdata(response?.data);

    }

    console.log(data, "data");
    useEffect(() => {
        printInfo()
    }, [open]);



    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby='customized-dialog-title'
            fullScreen
            open={open}
            closeAfterTransition={false}
            PaperProps={{ sx: { overflow: 'visible' } }}
        >
            <DialogTitle id='customized-dialog-title'>
                <Typography variant='h5' component='span'>
                    Print Ticket
                </Typography>
                <DialogCloseButton onClick={handleClose} disableRipple>
                    <i className='tabler-x' />
                </DialogCloseButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ p: 4 }}>
                    {!data ? (
                        <Typography variant="body1">Loading ticket details...</Typography>
                    ) : (
                        <Paper ref={printRef} elevation={3} sx={{ p: 4, maxWidth: 900, mx: 'auto', borderRadius: 3 }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Box>
                                    <Typography variant="h5" fontWeight={600}>{data.eventTitle}</Typography>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Organized by: {data.organizer}
                                    </Typography>
                                </Box>
                                <Avatar src={data.ticketicon} alt="Icon" sx={{ width: 60, height: 60 }} />
                            </Box>

                            {/* Event Image */}
                            <Box sx={{ mb: 3 }}>
                                <img
                                    src={data?.ticketimage}
                                    alt="Event"
                                    style={{ width: '100%', height: 250, objectFit: 'cover', borderRadius: 12 }}
                                />
                            </Box>

                            {/* Info Grid */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>Ticket ID:</strong> {data?.ticketid}</Typography>
                                    <Typography><strong>Tickets:</strong> {data?.quantity}</Typography>
                                    <Typography><strong>Status:</strong> {data?.status}</Typography>
                                    <Typography><strong>Paid Via:</strong> {data?.paid_via}</Typography>
                                    <Typography><strong>Customer Paid:</strong> ₹{data?.cust_paid}</Typography>
                                    {/* <Typography><strong>Organizer Received:</strong> ₹{data?.org_received}</Typography> */}
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography><strong>Booking Date:</strong> {data?.eventDatetime?.map(date => new Date(date).toLocaleString()).join(', ')}</Typography>

                                    <Typography><strong>Ticket Type:</strong> {data?.tickettype_name}</Typography>
                                    <Typography><strong>User:</strong> {data?.user?.firstName} {data?.user?.lastName}</Typography>
                                    <Typography><strong>Email:</strong> {data?.user?.email}</Typography>
                                </Grid>
                            </Grid>

                            {/* QR Code */}
                            <Box sx={{ mt: 4, mb: 3, textAlign: 'center' }}>
                                <Typography variant="h6" fontWeight={500} gutterBottom>
                                    Scan QR Code
                                </Typography>
                                <QRCodeCanvas
                                    value={data?.ticketid || 'N/A'}
                                    size={128}
                                    bgColor="#ffffff"
                                    fgColor="#000000"
                                    level="H"
                                    includeMargin={true}
                                />
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            {/* Event Timing */}
                            <Typography variant="h6" fontWeight={500} gutterBottom>Event Details</Typography>
                            <ul style={{ marginLeft: '1rem', paddingLeft: '1rem' }}>
                                {(data.eventDatetime || []).map((start, i) => (
                                    <li key={i} style={{ marginBottom: '0.5rem' }}>
                                        <div className='flex flex-row justify-between'>

                                            <strong>Event {i + 1}:</strong><br />
                                            <strong>Start:</strong> {new Date(start).toLocaleString()}<br />
                                            <strong>End:</strong> {new Date(data?.eventEndDatetime?.[i] || '').toLocaleString()}
                                        </div>

                                    </li>
                                ))}
                                <li>
                                    <strong>Venue:</strong> {data?.address} <br />
                                </li>
                            </ul>




                            <Divider sx={{ my: 3 }} />

                            {/* Ticket Instructions */}
                            <Typography variant="h6" fontWeight={500} gutterBottom>Instructions</Typography>
                            <Typography variant="body2" color="text.secondary" whiteSpace="pre-line">
                                {data.ticketinstruction}
                            </Typography>
                        </Paper>
                    )}
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} variant='tonal' color='secondary'>
                    Close
                </Button>
                <Button onClick={reactToPrintFn} variant="contained" color="primary" disabled={!data}>
                    Print
                </Button>
            </DialogActions>
        </Dialog>


    )
}

export default Printer
