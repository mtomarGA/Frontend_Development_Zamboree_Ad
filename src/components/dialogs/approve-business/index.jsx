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
import { Box, Tab, Tabs, Stack, MenuItem } from '@mui/material'
import approvalService from "@/services/approval/approval.service"

// Local Component
import DialogCloseButton from '../DialogCloseButton'
import { toast } from 'react-toastify'

const ApproveBusinessDetail = ({ open, setOpen, data, onSuccess }) => {
    const [activeTab, setActiveTab] = useState(0)
    const [selectedStatus, setSelectedStatus] = useState('');

    // Access the business ID directly from the 'data' prop
    // The 'data' prop should contain the full business object, including its _id
    const currentBusinessId = data?._id;

    const handleClose = () => {
        setOpen(false);
        setSelectedStatus(''); // Reset status when closing
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
                Business Details
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
                    {/* {activeTab === 0 && (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Vendor ID:</Typography>
                                <Typography variant='body2'>{data?.vendorId || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Status:</Typography>
                                <Typography variant='body2'>{data?.status || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Banker Name:</Typography>
                                <Typography variant='body2'>{data?.bankerName?.name || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Personalized URL:</Typography>
                                <Typography variant='body2'>{data?.url || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Created At:</Typography>
                                <Typography variant='body2'>{data?.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Updated At:</Typography>
                                <Typography variant='body2'>{data?.updatedAt ? new Date(data.updatedAt).toLocaleString() : 'N/A'}</Typography>
                            </Grid>
                        </Grid>
                    )} */}

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
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Business Subcategory:</Typography>
                                <Typography variant='body2'>{data.companyInfo.businessSubCategory?.name || 'N/A'}</Typography>
                            </Grid>
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
                            {/* <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Home Landline:</Typography>
                                <Typography variant='body2'>{data.contactInfo.homeLandline || 'N/A'}</Typography>
                            </Grid> */}
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
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
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
                                <Typography variant='body2'>{data?.createdAt || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Updated At:</Typography>
                                <Typography variant='body2'>{data?.updatedAt || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Created By:</Typography>
                                <Typography variant='body2'>
                                    {`${data?.createdBy?.firstName || ''} ${data?.createdBy?.lastName || ''}`.trim() || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Updated By:</Typography>
                                <Typography variant='body2'>
                                    {`${data?.updatedBy?.firstName || ''} ${data?.updatedBy?.lastName || ''}`.trim() || 'N/A'}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center'>
                                <Typography className='font-bold' variant='body1' color='text.secondary'>Approved By:</Typography>
                                <Typography variant='body2'>
                                    {`${data?.approvedBy?.firstName || ''} ${data?.approvedBy?.lastName || ''}`.trim() || 'N/A'}
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
                                        data.paymentOptions?.map((option, index) => (
                                            <Grid size={{ xs: 12, md: 6 }} className='flex gap-2 items-center' key={index}>
                                                <Typography variant='body2'>{option}</Typography>
                                            </Grid>
                                        ))
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
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className='flex gap-2 items-center'>
                                    <Typography className='font-bold' variant='body1' color='text.secondary'>Logo:</Typography>
                                </div>
                                {data?.logo?.url ? (
                                    <img src={data.logo.url} alt='Logo' style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '8px' }} />
                                ) : (
                                    <Typography variant='body2'>N/A</Typography>
                                )}
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className='flex gap-2 items-center'>
                                    <Typography className='font-bold' variant='body1' color='text.secondary'>Cover Image:</Typography>
                                </div>
                                {data?.coverImage?.url ? (
                                    <img src={data.coverImage.url} alt='Cover' style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '8px' }} />
                                ) : (
                                    <Typography variant='body2'>N/A</Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <div className='flex gap-2 items-center'>
                                    <Typography className='font-bold' variant='body1' color='text.secondary'>Business Images:</Typography>
                                </div>
                                {data?.businessImages?.length > 0 ? (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                                        {data.businessImages.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image.url}
                                                alt={`Business ${index + 1}`}
                                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <Typography variant='body2'>N/A</Typography>
                                )}
                            </Grid>
                        </Grid>
                    )}

                    {activeTab === 4 && data?.keywords && (
                        <Grid container spacing={2} direction="column">
                            {/* Display Keywords */}
                            {data.keywords.map((keyword, index) => ( // Changed 'link' to 'keyword'
                                <Grid item xs={12} md={6} key={index}> {/* Changed 'ize' to 'item', added 'index' for key */}
                                    <div className='flex gap-2 items-center'>
                                        <Typography className='font-bold' variant='body1' color='text.secondary'>
                                            Keyword {index + 1}: {/* Labeling each keyword */}
                                        </Typography>
                                        <Typography variant='body2' color='text.primary'> {/* Changed color to text.primary for content */}
                                            {keyword} {/* Directly display the keyword string */}
                                        </Typography>
                                    </div>
                                </Grid>
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

            <DialogActions>
                {/* Use Grid container for the main row of elements */}
                <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ pt: 3, width: '100%' }}>
                    {/* Left side: "Update Status :" label and Dropdown */}
                    <Grid item xs={12} sm={6}> {/* Occupies 12/12 on small screens, 6/12 on sm+ */}
                        <Stack direction="row" spacing={2} alignItems="center"> {/* Stack them horizontally */}
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

                    {/* Right side: Update Status Button and Close Button */}
                    <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}> {/* Align to end */}
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
            </DialogActions>
        </Dialog >
    )
}

export default ApproveBusinessDetail
