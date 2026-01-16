'use client'

import React, { useEffect, useState } from 'react'
import CustomTextField from "@/@core/components/mui/TextField"
import { Button, Card, MenuItem } from "@mui/material"
import PaidListingService from "@/services/premium-listing/paidListing.service"
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { Grid } from '@mui/system'

const PaidListingApprovel = ({getPaid, PaidListing, setModalOpen, getBanner }) => {
    const [formData, setFormData] = useState({
        status: '',
        approveDate: '',
        rejectedDate: '',
        message: '',
    })

    const [errors, setErrors] = useState({
        status: '',
        message: '',
    })

    useEffect(() => {
        if (PaidListing) {
            setFormData({
                status: PaidListing.status || '',
                approveDate: PaidListing.approveDate || '',
                rejectedDate: PaidListing.rejectedDate || '',
                message: PaidListing?.message || '',
            })
        }
    }, [PaidListing])

    const handleSubmit = async () => {
        const newErrors = {
            status: '',
            message: '',
        }

        if (!formData.status) {
            newErrors.status = 'Status is required'
        }

        if (formData.status === 'REJECTED' && !formData.message.trim()) {
            newErrors.message = 'Rejection message is required'
        } 
            const PaidListingId = PaidListing?._id
            const result = await PaidListingService.approvePaidListing(PaidListingId,formData)
            console.log(result,'asqswqwsqasasas')
            toast.success(result?.message)
            setModalOpen(false)
            getPaid()
    }

    return (
        <Card className='shadow-none' sx={{ p: 2 }}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 12 }} >
                    <CustomTextField
                        select
                        fullWidth
                        className='text-start'
                        label="Status"
                        value={formData.status}
                        onChange={(e) => {
                            const newStatus = e.target.value
                            const today = format(new Date(), 'yyyy-MM-dd') // ISO format for backend

                            setFormData(prev => ({
                                ...prev,
                                status: newStatus,
                                approveDate: newStatus === 'APPROVED' ? (prev.approveDate || today) : '',
                                rejectedDate: newStatus === 'REJECTED' ? (prev.rejectedDate || today) : '',
                                message: newStatus !== 'REJECTED' ? '' : prev.message,
                            }))
                        }}
                        error={!!errors.status}
                        helperText={errors.status}
                        SelectProps={{
                            displayEmpty: true,
                            renderValue: (selected) => (!selected ? <span>Select Status</span> : selected),
                        }}
                    >
                        <MenuItem value="PENDING">Pending</MenuItem>
                        <MenuItem value="APPROVED">Approved</MenuItem>
                        <MenuItem value="REJECTED">Rejected</MenuItem>
                    </CustomTextField>
                </Grid>

                {formData.status === 'REJECTED' && (
                    <Grid size={{ xs: 12, md: 12 }}>
                        <CustomTextField
                            fullWidth
                            label="Message"
                            placeholder="Enter rejection message"
                            value={formData.message}
                            rows={4}
                            multiline
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            error={!!errors.message}
                            helperText={errors.message}
                        />
                    </Grid>
                )}

                <Grid size={{ xs: 12, md: 12 }}>
                    <Button
                        variant='contained'
                        size='large'
                        fullWidth
                        onClick={handleSubmit}
                        disabled={!formData.status || (formData.status === 'REJECTED' && !formData.message.trim())}
                    >
                        {formData?.status
                            ? 'Create ' + formData.status.charAt(0).toUpperCase() + formData.status.slice(1).toLowerCase()
                            : 'Submit'}
                    </Button>
                </Grid>
            </Grid>
        </Card>
    )
}

export default PaidListingApprovel
