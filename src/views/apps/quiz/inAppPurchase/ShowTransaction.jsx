'use client'
// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import { Card, CardContent, Divider } from '@mui/material'

const ShowTransaction = ({ open, handleClickOpen, ShowData, setOpen }) => {
    // States

    const handleClose = () => setOpen(false)
    console.log(ShowData, "dd")
    return (
        <>

            <Dialog
                onClose={handleClose}
                aria-labelledby='customized-dialog-title'
                open={open}
                closeAfterTransition={false}
                maxWidth='md'
                PaperProps={{ sx: { overflow: 'visible' } }}
            >
                <DialogTitle id='customized-dialog-title'>
                    <Typography variant='h5' component='span'>
                        Transaction Details
                    </Typography>
                    <DialogCloseButton onClick={handleClose} disableRipple>
                        <i className='tabler-x' />
                    </DialogCloseButton>
                </DialogTitle>
                <DialogContent>
                    <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 3 }}>
                        <CardContent>
                            {/* Customer Info */}
                            <Typography variant="h6" gutterBottom>
                                Customer Information
                            </Typography>
                            <Typography>
                                <strong>Name:</strong> {ShowData?.user?.firstName}&nbsp;
                                {ShowData?.user?.lastName}
                            </Typography>
                            <Typography>
                                <strong>Email:</strong> {ShowData?.user?.email}
                            </Typography>
                            <Typography>
                                <strong>Phone:</strong> {ShowData?.user?.phone}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            {/* Order Info */}
                            <Typography variant="h6" gutterBottom>
                                Order Information
                            </Typography>
                            <Typography>
                                <strong>Order ID:</strong> {ShowData?.order_id}
                            </Typography>
                            <Typography>
                                <strong>Razorpay Order ID:</strong>{" "}
                                {ShowData?.razorpay_order_id}
                            </Typography>
                            <Typography>
                                <strong>Transaction ID:</strong> {ShowData?.transaction_id}
                            </Typography>
                            <Typography>
                                <strong>Status:</strong> {ShowData?.status}
                            </Typography>
                            <Typography>
                                <strong>Order Status:</strong> {ShowData?.orderStatus}
                            </Typography>
                            <Typography>
                                <strong>Paid Via:</strong> {ShowData?.paid_via}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            {/* Package Info */}
                            <Typography variant="h6" gutterBottom>
                                Package Information
                            </Typography>
                            <Typography>
                                <strong>Package:</strong> {ShowData?.packageId?.title}
                            </Typography>
                            <Typography>
                                <strong>Price:</strong> ₹{ShowData?.packageId?.price}
                            </Typography>
                            <Typography>
                                <strong>Package ID:</strong> ₹{ShowData?.packageId?.packageId}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            {/* Date Info */}
                            <Typography variant="h6" gutterBottom>
                                Timestamps
                            </Typography>
                            <Typography>
                                <strong>Created At:</strong>{" "}
                                {new Date(ShowData?.createdAt).toLocaleString()}
                            </Typography>
                            <Typography>
                                <strong>Updated At:</strong>{" "}
                                {new Date(ShowData?.updatedAt).toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant='tonal' color='secondary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ShowTransaction
