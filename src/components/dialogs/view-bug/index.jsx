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
import { Box, Chip } from '@mui/material'

// Local Component
import DialogCloseButton from '../DialogCloseButton'

const colors = {
    ACTIVE: 'error',
    INACTIVE: 'success'
}

const ViewBugModal = ({ open, setOpen, data }) => {
    const handleClose = () => {
        setOpen(false)
    }

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

            {/* Remove the extra margin from the title */}
            <DialogTitle variant='h4' sx={{ mb: 0 }} className='text-center'>
                Bug Details
            </DialogTitle>

            <DialogContent dividers>
                {/* Bug Info */}
                <Box mb={4}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Bug ID:</Typography>
                            <Typography variant='body2'>{data?._id || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Title:</Typography>
                            <Typography variant='body2'>{data?.title || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Category:</Typography>
                            <Typography variant='body2'>{data?.category.name || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Status:</Typography>
                            <Chip
                                variant='tonal'
                                label={data?.status === "ACTIVE" ? "Unsolved" : "Solved"}
                                color={colors[data?.status] || 'default'}
                                size='small'
                                className='capitalize'
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Created At:</Typography>
                            <Typography variant='body2'>{data?.createdAt ? new Date(data?.createdAt).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    timeZone: 'Asia/Kolkata',
                                                    hour12: true,
                                                }) : 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Updated At:</Typography>
                            <Typography variant='body2'>{data?.updatedAt ? new Date(data?.updatedAt).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    timeZone: 'Asia/Kolkata',
                                                    hour12: true,
                                                }) : 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} className='flex gap-2 items-start'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Details:</Typography>
                            <Typography variant='body2'>{data?.description || 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={12} className='flex gap-2 items-start'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Created By:</Typography>
                            <Typography variant='body2'>{data?.createdBy?.userType === "ADMIN" ? 'ADMIN' : data?.createdBy?.userId?.employee_id || "N/A"}</Typography>
                        </Grid>
                        <Grid item xs={12} className='flex gap-2 items-start'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>Updated By:</Typography>
                            <Typography variant='body2'>{data?.updatedBy?.userType === "ADMIN" ? 'ADMIN' : data?.updatedBy?.userId?.employee_id || "N/A"}</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Divider />
                {/* Bug Screenshot */}
                <Box mt={2}>
                    <Typography variant='h6' gutterBottom>Bug Screenshot</Typography>
                    {data?.image ? (
                        <img src={data.image} alt='Bug Screenshot' className='w-full h-auto rounded' />
                    ) : (
                        <Typography variant='body2'>No Screenshot Available</Typography>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ViewBugModal
