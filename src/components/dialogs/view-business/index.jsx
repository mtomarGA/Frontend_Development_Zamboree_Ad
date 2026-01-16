'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CustomTextField from '@core/components/mui/TextField'
import { Box, Tab, Tabs, Stack, MenuItem, IconButton, Paper, Chip } from '@mui/material'
import approvalService from "@/services/approval/approval.service"

// Local Component
import DialogCloseButton from '../DialogCloseButton'
import { toast } from 'react-toastify'

const ViewBusinessDetail = ({ open, setOpen, data, onSuccess }) => {
    console.log(data, "datadatadata");

    const [activeTab, setActiveTab] = useState(0)
    const [selectedStatus, setSelectedStatus] = useState('');
    const [openPreview, setOpenPreview] = useState(false)
    const [previewUrl, setPreviewUrl] = useState('')
    const [previewAlt, setPreviewAlt] = useState('')

    // Access the business ID directly from the 'data' prop
    // The 'data' prop should contain the full business object, including its _id
    const currentBusinessId = data?._id;

    const handleClose = () => {
        setOpen(false);
        setSelectedStatus(''); // Reset status when closing
    }

    const handleOpenPreview = (url, alt) => {
        setPreviewUrl(url)
        setPreviewAlt(alt)
        setOpenPreview(true)
    }

    const handleClosePreview = () => {
        setOpenPreview(false)
        setPreviewUrl('')
        setPreviewAlt('')
    }

    const statuses = [
        { value: 'APPROVED', label: 'APPROVED' },
        { value: 'REJECTED', label: 'REJECTED' },
    ];

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleUpdateStatus = async () => {
        // console.log("clicking", currentBusinessId);

        if (!currentBusinessId) {
            toast.error('Business ID is missing. Cannot update status.');
            return;
        }

        if (!selectedStatus) {
            toast.error('Please select a status to update.');
            return;
        }

        const requestBody = {
            status: selectedStatus,
        };

        try {
            const response = await approvalService.listingApproval(currentBusinessId, requestBody);

            if (response && response.statusCode === 200) {
                toast.success(response.message || `Status updated to ${selectedStatus} successfully!`);
                onSuccess()
                handleClose(); // Close the dialog on success
            } else {
                toast.error(response?.message || 'Failed to update status.');
            }
        } catch (error) {
            console.error('Error updating business status:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating status.');
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    return (
        <Dialog
            fullWidth
            open={open}
            onClose={handleClose}
            maxWidth='md'
            scroll='body'
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
        >
            <DialogCloseButton onClick={handleClose} disableRipple>
                <i className='tabler-x' />
            </DialogCloseButton>

            <DialogTitle variant='h4' className='text-center'>
                Partner Details
            </DialogTitle>

            <DialogContent dividers>
                <Tabs value={activeTab} onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
                    {/* <Tab label='Basic Info' /> */}
                    <Tab label='Company Details' />
                    <Tab label='Location Information' />
                    <Tab label='Timing & Payment' />
                    <Tab label='Business Images' />
                    <Tab label='Keywords' />
                    <Tab label='Social Link' />
                </Tabs>

                <Box sx={{ mt: 3 }}>
                    {/* Basic Info Tab */}
                    {activeTab === 0 && data?.companyInfo && data?.contactInfo && (
                        <Grid container spacing={2}>
                            {/* Company Info Section */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h6' className='font-bold py-2' color='primary'>Company Information</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Company Name:</Typography>
                                <Typography variant='body2'>{data.companyInfo.companyName || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Establish Year:</Typography>
                                <Typography variant='body2'>{data.companyInfo.establishYear || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Company CEO:</Typography>
                                <Typography variant='body2'>{data.companyInfo.companyCeo || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Business Nature:</Typography>
                                <Typography variant='body2'>{data.companyInfo.businessNature?.name || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Business Category:</Typography>
                                <Typography variant='body2'>{data.companyInfo.businessCategory?.name || 'N/A'}</Typography>
                            </Grid>
                            {/* <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Business Subcategory:</Typography>
                                <Typography variant='body2'>{data.companyInfo.businessSubCategory?.name || 'N/A'}</Typography>
                            </Grid> */}
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Number Of Employee:</Typography>
                                <Typography variant='body2'>{data.companyInfo.employeeNumber?.name || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Business Legal Status:</Typography>
                                <Typography variant='body2'>{data.companyInfo.businessLegal?.name || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Company Website:</Typography>
                                <Typography variant='body2'>{data.companyInfo.companyWebsite || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>About Us:</Typography>
                                <Typography variant='body2'>{data.companyInfo.aboutUs || 'N/A'}</Typography>
                            </Grid>

                            {/* Divider between sections */}
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                            </Grid>

                            {/* Contact Info Section */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h6' className='font-bold py-2' color='primary'>Contact Information</Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Phone Number:</Typography>
                                <Typography variant='body2'>{data.contactInfo.phoneNo || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Email:</Typography>
                                <Typography variant='body2'>{data.contactInfo.email || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Office Landline:</Typography>
                                <Typography variant='body2'>{data.contactInfo.officeLandline || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Toll Free Number:</Typography>
                                <Typography variant='body2'>{data.contactInfo.tollFreeNumber || 'N/A'}</Typography>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h6' className='font-bold py-2' color='primary'>Personalized URL</Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>URL:</Typography>
                                <Typography variant='body2'>{`https://haapeningads.com/${data?.url}` || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h6' className='font-bold py-2' color='primary'>Approval & update Info</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Created At:</Typography>
                                <Typography variant='body2'>
                                    {data?.createdAt
                                        ? new Date(data.createdAt).toLocaleString('en-IN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })
                                        : 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>
                                    Updated At:
                                </Typography>
                                <Typography variant='body2'>
                                    {data?.updatedAt
                                        ? new Date(data.updatedAt).toLocaleString('en-IN', {
                                            dateStyle: 'medium',
                                            timeStyle: 'short'
                                        })
                                        : 'N/A'}
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Created By:</Typography>
                                <Typography variant='body2'>
                                    {data?.createdBy
                                        ? data?.createdBy?.userType === 'ADMIN'
                                            ? 'ADMIN'
                                            : data?.createdBy?.userId?.employee_id?.trim() || 'N/A'
                                        : data?.companyInfo?.companyName || 'N/A'}
                                </Typography>

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Updated By:</Typography>
                                <Typography variant='body2'>
                                    {/* {`${data?.updatedBy?.firstName || ''} ${data?.updatedBy?.lastName || ''}`.trim() || 'N/A'} */}
                                </Typography>
                                <Typography variant='body2'>
                                    {data?.updatedBy
                                        ? data?.updatedBy?.userType === 'ADMIN'
                                            ? 'ADMIN'
                                            : data?.updatedBy?.userId?.employee_id?.trim() || 'N/A'
                                        : data?.companyInfo?.companyName || 'N/A'}
                                </Typography>

                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Approved By:</Typography>
                                <Typography variant='body2'>
                                    {/* {`${data?.approvedBy?.firstName || ''} ${data?.approvedBy?.lastName || ''}`.trim() || 'N/A'} */}
                                </Typography>
                                <Typography variant="body2">
                                    {data?.updatedBy
                                        ? data?.updatedBy?.userType === 'ADMIN'
                                            ? 'ADMIN'
                                            : data?.updatedBy?.userId?.employee_id?.trim() || 'N/A'
                                        : 'N/A'}
                                </Typography>

                            </Grid>
                        </Grid>
                    )}

                    {/* Contact Info Tab */}
                    {activeTab === 1 && data?.locationInfo && (
                        <Grid container spacing={2} direction='column'>

                            {/* Section: Location Info */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h6' gutterBottom>Location</Typography>
                            </Grid>

                            <Grid container spacing={2} >
                                <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                    <Typography className='font-bold' variant='body1' color='text.secondary'>Country:</Typography>
                                    <Typography variant='body2'>{data.locationInfo.country || 'N/A'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                    <Typography className='font-bold' variant='body1' color='text.secondary'>State:</Typography>
                                    <Typography variant='body2'>{data.locationInfo.state || 'N/A'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                    <Typography className='font-bold' variant='body1' color='text.secondary'>City:</Typography>
                                    <Typography variant='body2'>{data.locationInfo.city || 'N/A'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                    <Typography className='font-bold' variant='body1' color='text.secondary'>Area:</Typography>
                                    <Typography variant='body2'>{data.locationInfo.area || 'N/A'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                    <Typography className='font-bold' variant='body1' color='text.secondary'>Pincode:</Typography>
                                    <Typography variant='body2'>{data.locationInfo.pincode || 'N/A'}</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 12 }} className='flex gap-2 items-center'>
                                    <Typography className='font-bold' variant='body1' color='text.secondary'>Address:</Typography>
                                    <Typography variant='body2'>{data.locationInfo.address || 'N/A'}</Typography>
                                </Grid>
                            </Grid>

                            {/* Divider */}
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Section: Google Location */}
                            <Grid item xs={12}>
                                <Typography variant='h6' gutterBottom>Co-ordinate</Typography>
                            </Grid>

                            {data.googleLocation ? (
                                <Grid container spacing={1} direction='column'>
                                    <Grid item className='flex gap-2 items-center'>
                                        <Typography className='font-bold' variant='body1' color='text.secondary'>Latitude:</Typography>
                                        <Typography variant='body2'>{data.googleLocation.latitude}</Typography>
                                    </Grid>
                                    <Grid item className='flex gap-2 items-center'>
                                        <Typography className='font-bold' variant='body1' color='text.secondary'>Longitude:</Typography>
                                        <Typography variant='body2'>{data.googleLocation.longitude}</Typography>
                                    </Grid>
                                    <Grid item className='flex gap-2 items-center'>
                                        <Typography className='font-bold' variant='body1' color='text.secondary'>Map URL:</Typography>
                                        <Typography variant='body2'>
                                            <a
                                                href={`https://www.google.com/maps?q=${data.googleLocation.latitude},${data.googleLocation.longitude}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                style={{ color: '#1976d2', textDecoration: 'underline' }}
                                            >
                                                View on Google Maps
                                            </a>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid item>
                                    <Typography variant='body2' color='text.secondary'>No Google location provided.</Typography>
                                </Grid>
                            )}
                        </Grid>
                    )}


                    {/* Business Hours */}
                    {activeTab === 2 && data?.businessHours && (
                        <Grid container spacing={2} direction="column">

                            <Grid item xs={12}>
                                <Typography variant='h6' gutterBottom>Business Hours</Typography>
                                <Grid container spacing={2}>
                                    {[...data.businessHours]
                                        .sort((a, b) => {
                                            const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                            return order.indexOf(a.day) - order.indexOf(b.day);
                                        })
                                        .map((day, index) => (
                                            <Grid size={{ xs: 12, md: 6 }} key={index} className='flex gap-2 items-center'>
                                                <Typography className='font-bold' variant='body1' color='text.secondary'>
                                                    {day.day}:
                                                </Typography>
                                                <Typography variant='body2'>
                                                    {day.isClosed ? 'Closed' : `${day.openTime} - ${day.closeTime}`}
                                                </Typography>
                                            </Grid>
                                        ))}
                                </Grid>
                            </Grid>

                            {/* Divider */}
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>

                            {/* Payment Options */}
                            <Grid item xs={12}>
                                <Typography variant='h6' gutterBottom>Payment Options</Typography>
                                <Grid container direction="row" spacing={1}>
                                    {data.paymentOptions?.length > 0 ? (
                                        data.paymentOptions?.map((option, index) =>

                                        (
                                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center' key={index}>
                                                <Typography variant='body2'>{option.name}</Typography>
                                            </Grid>
                                        )
                                        )
                                    ) : (
                                        <Typography variant='body2' color='text.secondary'>No payment options provided.</Typography>
                                    )}
                                </Grid>
                            </Grid>

                            {/* Banker Name */}
                            <Grid item xs={12}>
                                <Typography variant='h6' gutterBottom>Banker Name</Typography>
                                <Typography variant='body2'>{data.bankerName?.name || 'Not available'}</Typography>
                            </Grid>
                        </Grid>
                    )}

                    {/* Media Tab */}
                    {activeTab === 3 && (
                        <Box sx={{ p: 3 }}>
                            {/* Logo and Cover Row */}
                            <Box sx={{
                                display: 'flex',
                                gap: 3,
                                mb: 3,
                                flexDirection: { xs: 'column', md: 'row' }
                            }}>
                                {/* Logo Card */}
                                <Paper sx={{
                                    flex: 1,
                                    p: 2,
                                    minHeight: 300,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Logo Image</Typography>
                                    {data?.logo?.url ? (
                                        <Box sx={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img
                                                src={data.logo.url}
                                                alt="Logo"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: 200,
                                                    objectFit: 'contain',
                                                    cursor: 'pointer',
                                                    border: '1px solid #eee',
                                                    borderRadius: 4,
                                                    padding: 8
                                                }}
                                                onClick={() => handleOpenPreview(data.logo.url, 'Logo Image')}
                                            />
                                            {data?.logo?.status && (
                                                <Chip
                                                    label={`Status: ${data.logo.status}`}
                                                    size="small"
                                                    sx={{ mt: 2, fontWeight: 500 }}
                                                />
                                            )}
                                        </Box>
                                    ) : (
                                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography color="text.secondary">No logo available</Typography>
                                        </Box>
                                    )}
                                </Paper>

                                {/* Cover Card */}
                                <Paper sx={{
                                    flex: 1,
                                    p: 2,
                                    minHeight: 300,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2
                                }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Cover Image</Typography>
                                    {data?.coverImage?.url ? (
                                        <Box sx={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img
                                                src={data.coverImage.url}
                                                alt="Cover"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: 200,
                                                    objectFit: 'contain',
                                                    cursor: 'pointer',
                                                    border: '1px solid #eee',
                                                    borderRadius: 4,
                                                    padding: 8
                                                }}
                                                onClick={() => handleOpenPreview(data.coverImage.url, 'Cover Image')}
                                            />
                                            <Chip
                                                label={`Status: ${data?.coverImage?.status || 'N/A'}`}
                                                size="small"
                                                sx={{ mt: 2, fontWeight: 500 }}
                                            />
                                        </Box>
                                    ) : (
                                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Typography color="text.secondary">No cover available</Typography>
                                        </Box>
                                    )}
                                </Paper>
                            </Box>

                            {/* Business Images Row */}
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Business Images</Typography>
                                {data?.businessImages?.length > 0 ? (
                                    <Box sx={{
                                        display: 'flex',
                                        gap: 2,
                                        overflowX: 'auto',
                                        py: 1,
                                        px: 1,
                                        '&::-webkit-scrollbar': {
                                            height: 6,
                                        },
                                        '&::-webkit-scrollbar-thumb': {
                                            backgroundColor: 'grey.400',
                                            borderRadius: 3,
                                        }
                                    }}>
                                        {data.businessImages.map((image, index) => (
                                            <Paper key={index} sx={{
                                                minWidth: 250,
                                                height: 250,
                                                p: 2,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                border: '1px solid #e0e0e0',
                                                borderRadius: 2
                                            }}>
                                                <Box sx={{
                                                    flex: 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden'
                                                }}>
                                                    <img
                                                        src={image.url}
                                                        alt={`Business ${index + 1}`}
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '100%',
                                                            objectFit: 'contain',
                                                            cursor: 'pointer',
                                                            border: '1px solid #eee',
                                                            borderRadius: 4,
                                                            padding: 4
                                                        }}
                                                        onClick={() => handleOpenPreview(image.url, `Business Image ${index + 1}`)}
                                                    />
                                                </Box>
                                                <Chip
                                                    label={`Status: ${image.status || 'N/A'}`}
                                                    size="small"
                                                    sx={{ mt: 1, alignSelf: 'center', fontWeight: 500 }}
                                                />
                                            </Paper>
                                        ))}
                                    </Box>
                                ) : (
                                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                                        <Typography color="text.secondary">No business images available</Typography>
                                    </Paper>
                                )}
                            </Box>
                        </Box>
                    )}

                    {activeTab === 4 && data?.keywords && (
                        <Grid container spacing={2} direction="row">
                            {/* Display Keywords */}
                            {data.keywords.map((keyword, index) => (
                                // <Grid item xs={12} md={6} key={index}> {/* Changed 'ize' to 'item', added 'index' for key */}
                                // <div className='flex-row gap-2 items-center'>

                                <Chip key={index} label={keyword} color="primary" variant="filled" />
                                // </div>
                                // </Grid>
                            ))}
                        </Grid>
                    )}

                    {activeTab === 5 && data?.socialLinks && (
                        <Grid container spacing={2} direction="column">
                            <Grid item xs={12} md={6}>
                                <div className='gap-2 items-center'>
                                    <Grid className="flex gap-2" item xs={12} md={6}>
                                        <Typography className='font-bold' variant='body1' color='text.secondary'>
                                            Faceook :
                                        </Typography>
                                        <Typography variant='body2' color='primary'>
                                            <a target='_blank' rel='noopener noreferrer'>
                                                {` https://facebook.com/${data?.socialLinks?.facebook}`}
                                            </a>
                                        </Typography>
                                    </Grid>
                                    <Grid className="flex gap-2" item xs={12} md={6}>
                                        <Typography className='font-bold' variant='body1' color='text.secondary'>
                                            Instagram :
                                        </Typography>
                                        <Typography variant='body2' color='primary'>
                                            <a target='_blank' rel='noopener noreferrer'>
                                                {`https://instagram.com/${data?.socialLinks?.instagram}`}
                                            </a>
                                        </Typography>
                                    </Grid>
                                    <Grid className="flex gap-2" item xs={12} md={6}>
                                        <Typography className='font-bold' variant='body1' color='text.secondary'>
                                            LinkedIn :
                                        </Typography>
                                        <Typography variant='body2' color='primary'>
                                            <a target='_blank' rel='noopener noreferrer'>
                                                {`https://linkedIn.com/${data?.socialLinks?.linkedIn}`}
                                            </a>
                                        </Typography>
                                    </Grid>
                                    <Grid className="flex gap-2" item xs={12} md={6}>
                                        <Typography className='font-bold' variant='body1' color='text.secondary'>
                                            Twitter :
                                        </Typography>
                                        <Typography variant='body2' color='primary'>
                                            <a target='_blank' rel='noopener noreferrer'>
                                                {`https://x.com/${data?.socialLinks?.twitter}`}
                                            </a>
                                        </Typography>
                                    </Grid>
                                    <Grid className="flex gap-2" item xs={12} md={6}>
                                        <Typography className='font-bold' variant='body1' color='text.secondary'>
                                            Pinterest :
                                        </Typography>
                                        <Typography variant='body2' color='primary'>
                                            <a target='_blank' rel='noopener noreferrer'>
                                                {`https://pinterest.com/${data?.socialLinks?.pinterest}`}
                                            </a>
                                        </Typography>
                                    </Grid>
                                    <Grid className="flex gap-2" item xs={12} md={6}>
                                        <Typography className='font-bold' variant='body1' color='text.secondary'>
                                            YouTube :
                                        </Typography>
                                        <Typography variant='body2' color='primary'>
                                            <a target='_blank' rel='noopener noreferrer'>
                                                {`https://youTube.com/${data?.socialLinks?.youTube}`}
                                            </a>
                                        </Typography>
                                    </Grid>
                                </div>
                            </Grid>
                            {/* ); */}
                        </Grid>
                    )}
                </Box>
            </DialogContent>

            <Dialog open={openPreview} maxWidth="md">
                <Box sx={{ position: 'relative' }}>
                    <IconButton
                        onClick={handleClosePreview}
                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                    >
                        x
                    </IconButton>
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" mb={2}>{previewAlt}</Typography>
                        <Box
                            component="img"
                            src={previewUrl}
                            alt={previewAlt}
                            sx={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 2 }}
                        />
                    </Box>
                </Box>
            </Dialog>
            {/* <DialogActions>
                <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ pt: 3, width: '100%' }}>
                    <Grid item xs={12} sm={6}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Typography variant='body2' color='text.primary' className='font-bold text-lg' sx={{ whiteSpace: 'nowrap' }} >
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
                                size="small"
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
            </DialogActions> */}
        </Dialog >

    )
}

export default ViewBusinessDetail
