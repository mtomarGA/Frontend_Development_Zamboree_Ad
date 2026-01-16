'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'

// Local Component
import DialogCloseButton from '../DialogCloseButton'

const ViewEnquiryDetail = ({ open, setOpen, data }) => {
    const handleClose = () => {
        setOpen(false)
    }

    console.log(data,"datadatadata");
    

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={handleClose}
            maxWidth='sm'
            scroll='body'
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
            <DialogCloseButton onClick={handleClose} disableRipple>
                <i className='tabler-x' />
            </DialogCloseButton>

            <DialogTitle variant='h4' className='text-center'>
                Enquiry Details
            </DialogTitle>

            <DialogContent dividers>
                {/* Enquiry Info */}
                <Box mb={4}>
                    <Typography variant='h6' gutterBottom>Enquiry Information</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Lead ID:</Typography>
                            <Typography variant='body2'>{data?.leadId || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Service Name:</Typography>
                            <Typography variant='body2'>{data?.serviceName || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Status:</Typography>
                            <Typography variant='body2'>{data?.status || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Created At:</Typography>
                            <Typography variant='body2'>{data?.createdAt ? new Date(data?.createdAt).toLocaleString() : 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} className='flex gap-2 items-start'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Details:</Typography>
                            <Typography variant='body2'>{data?.details || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider />
                {/* User Info */}
                <Box my={4} >
                    <Typography variant='h6' gutterBottom>User Information</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>User ID:</Typography>
                            <Typography variant='body2'>{data?.userId?.userId || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Name:</Typography>
                            <Typography variant='body2'>{data?.userId?.firstName || 'N/A'} {data?.userId?.lastName || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Phone:</Typography>
                            <Typography variant='body2'>{data?.userId?.phone || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Email:</Typography>
                            <Typography variant='body2'>{data?.userId?.email || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>City:</Typography>
                            <Typography variant='body2'>{data?.userId?.city?.name || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Area:</Typography>
                            <Typography variant='body2'>{data?.userId?.area?.name || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider />

                {/* Business Info */}
                <Box my={4}>
                    <Typography variant='h6' gutterBottom>Business Information</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Vendor ID:</Typography>
                            <Typography variant='body2'>{data?.businessId?.vendorId || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Company Name:</Typography>
                            <Typography variant='body2'>{data?.businessId?.companyInfo?.companyName || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Category:</Typography>
                            <Typography variant='body2'>{data?.businessId?.companyInfo?.businessCategory?.name || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Subcategory:</Typography>
                            <Typography variant='body2'>{data?.businessId?.companyInfo?.businessSubCategory?.name || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>State:</Typography>
                            <Typography variant='body2'>{data?.businessId?.locationInfo?.state?.name || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>City:</Typography>
                            <Typography variant='body2'>{data?.businessId?.locationInfo?.city?.name || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ViewEnquiryDetail
