'use client'

import React, { useEffect, useState } from 'react'
import CustomTextField from "@/@core/components/mui/TextField"
import { Button, Card, MenuItem } from "@mui/material"
import FixedApprovel from "@/services/premium-listing/fixedListing.service"
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { Grid } from '@mui/system'

const FixedListingApprovel = ({ onSuccess, get, FixedListing }) => {
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
        if (FixedListing) {
            setFormData({
                status: FixedListing.status || '',
                approveDate: FixedListing.approveDate || '',
                rejectedDate: FixedListing.rejectedDate || '',
                message: FixedListing?.message || '',
            })
        }
    }, [FixedListing])

    const handleSubmit = async () => {
        const newErrors = {
            status: '',
            message: '',
        };

        if (!formData.status) {
            newErrors.status = 'Status is required';
        }

        if (formData.status === 'REJECTED' && !formData.message.trim()) {
            newErrors.message = 'Rejection message is required';
        }

        if (newErrors.status || newErrors.message) {
            setErrors(newErrors);
            return; // 🔴 Stop form submission here if errors
        }

        // If no errors, clear error state
        setErrors({ status: '', message: '' });

        try {
            const FixedListingId = FixedListing?._id;
            const result = await FixedApprovel.approvelFixed(FixedListingId, formData);

            console.log(result, 'Fixed Listing Approval Result');

            onSuccess(false);
            get();
            toast.success(result?.message || 'Fixed Listing updated successfully.');
        } catch (error) {
            console.error(error); // helpful for debugging
            toast.error('Something went wrong while updating Fixed Listing status.');
        }
    };

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

export default FixedListingApprovel
