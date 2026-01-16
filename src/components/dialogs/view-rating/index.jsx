'use client'

import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'

// Local Component
import DialogCloseButton from '../DialogCloseButton'

const ViewRatingDetail = ({ open, setOpen, data }) => {
    const handleClose = () => {
        setOpen(false)
    }
    console.log(data, "qwertyu qwertyu qwertyu");

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

            <DialogTitle variant='h5' className='text-center'>
                Rating Details
            </DialogTitle>

            <DialogContent dividers>
                {/* Rating Info */}
                <Box mb={4}>
                    {/* <Typography variant='h6' gutterBottom>Rating Information</Typography> */}
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Company Name:</Typography>
                            <Typography variant='body2'>{data?.businessId?.companyInfo?.companyName || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>User Name:</Typography>
                            <Typography variant='body2'>{`${data?.userId?.firstName || 'N/A'} ${data?.userId?.lastName || ''}`}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Rating:</Typography>
                            <Typography variant='body2'>{data?.rating || ""}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Status:</Typography>
                            <Typography variant='body2'>{data?.status || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Date & Time:</Typography>
                            <Typography variant='body2'>{data?.createdAt ? new Date(data?.createdAt).toLocaleString() : 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} className='flex gap-2 items-start'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Details:</Typography>
                            <Typography variant='body2'>{data?.comment || 'N/A'}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider />
            </DialogContent>
        </Dialog>
    )
}

export default ViewRatingDetail
