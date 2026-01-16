'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { Box, Button, MenuItem, Stack } from '@mui/material'

// Local Components
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import approvalService from '@/services/approval/approval.service'
import { toast } from 'react-toastify'

const ViewRatingApproval = ({ open, setOpen, data, onSuccess }) => {
    const [selectedStatus, setSelectedStatus] = useState('')

    const ratingId = data?._id

    const handleClose = () => {
        setOpen(false)
        setSelectedStatus('')
    }

    const statuses = [
        { value: 'APPROVED', label: 'APPROVED' },
        { value: 'REJECTED', label: 'REJECTED' }
    ]

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value)
    }

    const handleUpdateStatus = async () => {
        if (!ratingId) {
            toast.error('Rating ID is missing. Cannot update status.')
            return
        }

        if (!selectedStatus) {
            toast.error('Please select a status to update.')
            return
        }

        const requestBody = {
            status: selectedStatus
        }

        try {
            const response = await approvalService.RatingApproval(ratingId, requestBody)

            if (response?.statusCode === 200) {
                toast.success(response.message || `Status updated to ${selectedStatus} successfully!`)
                onSuccess?.()
                handleClose()
            } else {
                toast.error(response?.message || 'Failed to update status.')
            }
        } catch (error) {
            console.error('Error updating rating status:', error)
            toast.error(error?.response?.data?.message || 'An error occurred while updating status.')
        }
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

            <DialogTitle variant='h5' className='text-center'>
                Rating Details
            </DialogTitle>

            <DialogContent dividers>
                <Box mb={4}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>
                                Company Name:
                            </Typography>
                            <Typography variant='body2'>
                                {data?.businessId?.companyInfo?.companyName || 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>
                                User Name:
                            </Typography>
                            <Typography variant='body2'>
                                {`${data?.userId?.firstName || 'N/A'} ${data?.userId?.lastName || ''}`}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>
                                Rating:
                            </Typography>
                            <Typography variant='body2'>{data?.rating || ''}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>
                                Status:
                            </Typography>
                            <Typography variant='body2'>{data?.status || 'N/A'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>
                                Date & Time:
                            </Typography>
                            <Typography variant='body2'>
                                {data?.createdAt ? new Date(data?.createdAt).toLocaleString() : 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className='flex gap-2 items-start'>
                            <Typography className='font-bold' variant='body1' color='text.secondary'>
                                Details:
                            </Typography>
                            <Typography variant='body2'>{data?.comment || 'N/A'}</Typography>
                        </Grid>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 2 }} />
                    </Grid>

                    <Grid
                        container
                        spacing={2}
                        alignItems='center'
                        justifyContent='space-between'
                        sx={{ pt: 3, width: '100%' }}
                    >
                        <Grid item xs={12} sm={6}>
                            <Stack direction='row' spacing={2} alignItems='center'>
                                <Typography
                                    variant='body1'
                                    color='text.primary'
                                    className='font-bold text-md'
                                    sx={{ whiteSpace: 'nowrap' }}
                                >
                                    Update Status :
                                </Typography>
                                <CustomTextField
                                    select
                                    fullWidth
                                    value={selectedStatus}
                                    onChange={handleStatusChange}
                                    SelectProps={{
                                        displayEmpty: true,
                                        renderValue: (selected) => (!selected ? <span>Select Status</span> : selected)
                                    }}
                                    size='small'
                                    sx={{ minWidth: 150 }}
                                >
                                    {statuses.map((statusOption) => (
                                        <MenuItem key={statusOption.value} value={statusOption.value}>
                                            {statusOption.label}
                                        </MenuItem>
                                    ))}
                                </CustomTextField>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                onClick={handleUpdateStatus}
                                variant='contained'
                                color='primary'
                                disabled={!selectedStatus}
                            >
                                Update Status
                            </Button>
                            <Button onClick={handleClose} variant='outlined' color='secondary'>
                                Close
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                <Divider />
            </DialogContent>
        </Dialog>
    )
}

export default ViewRatingApproval
