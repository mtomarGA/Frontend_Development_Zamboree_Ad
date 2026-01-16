'use client'

import { useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CustomTextField from '@core/components/mui/TextField'
import { Box, Tab, Tabs, Stack, MenuItem, DialogActions, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Card, CardMedia, CardContent } from '@mui/material'
import approvalService from "@/services/approval/approval.service"

// Local Component
import DialogCloseButton from '../DialogCloseButton'
import { toast } from 'react-toastify'

const ViewApprovalDetail = ({ open, setOpen, data, onSuccess }) => {
    const [activeTab, setActiveTab] = useState(0)
    const [selectedStatus, setSelectedStatus] = useState('');
    const [imageStatuses, setImageStatuses] = useState({});
    const [reason, setReason] = useState('');
    const [errors, setErrors] = useState({});

    const { product, images } = data || {};
    console.log(product, images, "img % product");

    const productId = data?.product?._id;

    useState(() => {
        if (images) {
            const initialImageStatuses = {};
            images.forEach(image => {
                initialImageStatuses[image._id] = image.status || 'PENDING';
            });
            setImageStatuses(initialImageStatuses);
        }
    }, [images]);


    const handleClose = () => {
        setOpen(false);
        setSelectedStatus('');
        setReason('');
        setImageStatuses({});
    }

    const statuses = [
        { value: 'APPROVED', label: 'APPROVED' },
        { value: 'REJECTED', label: 'REJECTED' },
    ];

    const allowedImageStatuses = [
        { value: 'APPROVED', label: 'APPROVED' },
        { value: 'REJECTED', label: 'REJECTED' },
    ];

    const handleStatusChange = (event) => {
        const value = event.target.value

        setSelectedStatus(value);
        setErrors((prev) => ({ ...prev, selectedStatus: '' }));

        if (value !== 'REJECTED') {
            setReason('');
            setErrors((prev) => ({ ...prev, reason: '' }));
        }
    };

    const handleReasonChange = (e) => {
        setReason(e.target.value);
        setErrors((prev) => ({ ...prev, reason: '' }));
    };

    const handleImageStatusChange = (imageId, newStatus) => {
        setImageStatuses(prevStatuses => ({
            ...prevStatuses,
            [imageId]: newStatus
        }));
    };

    const handleApproveAllProductImages = async () => {
        if (!productId) {
            toast.error('Product ID is missing. Cannot approve all images.');
            return;
        }

        try {
            const response = await approvalService.allPoductImageApprove(productId);
            if (response && response.statusCode === 200) {
                toast.success(response.message || 'All pending images approved successfully!');
                onSuccess();
            } else {
                toast.error(response?.message || 'Failed to approve all images.');
            }
            
        } catch (error) {
            console.error('Error approving all images:', error);
            toast.error(error.response?.data?.message || 'An error occurred while approving all images.');
        }
    };

    const handleUpdateStatus = async () => {
        console.log("clicking", productId);

        if (!productId) {
            toast.error('Product ID is missing. Cannot update status.');
            return;
        }

        if (!selectedStatus) {
            toast.error('Please select a status to update.');
            return;
        }

        if (selectedStatus === 'REJECTED' && !reason.trim()) {
            toast.error('Reason is required when status is REJECTED');
            return;
        }

        const requestBody = {
            status: selectedStatus,
            reason: reason
        };

        try {
            const response = await approvalService.productApproval(productId, requestBody);

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

    const handleUpdateImageStatus = async (imageId) => {
        const newStatus = imageStatuses[imageId];

        if (!productId || !imageId || !newStatus) {
            toast.error('Missing information to update image status.');
            return;
        }

        const requestBody = {
            productId,
            status: newStatus,
        };

        try {
            const response = await approvalService.updateProductImageStatus(imageId, requestBody); // You need to implement this service call.

            if (response && response.statusCode === 200) {
                toast.success(response.message || `Image status updated to ${newStatus} successfully!`);
                onSuccess()
                // handleClose();
            } else {
                toast.error(response?.message || 'Failed to update image status.');
            }
        } catch (error) {
            console.error('Error updating image status:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating image status.');
        }
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue)
    }

    const renderAttributeTable = (attributes) => {
        const attributesArray = Array.isArray(attributes) ? attributes : [attributes];
        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Attribute</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {attributesArray?.length > 0 ? (
                            attributesArray.map((attr, index) => (
                                <TableRow key={index}>
                                    <TableCell>{attr.name || 'N/A'}</TableCell>
                                    <TableCell>{attr.values?.[0] || 'N/A'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={2}>No attributes found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    const renderVariantsTable = (variants) => {
        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Variant</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Zamboree Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>SKU</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Track Inventory</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {variants?.length > 0 ? (
                            variants.map((variant) => (
                                <TableRow key={variant.id}>
                                    <TableCell>{variant?.name|| 'N/A'}</TableCell>
                                    <TableCell>{variant.price || 'N/A'}</TableCell>
                                    <TableCell>{variant.happeningPrice || 'N/A'}</TableCell>
                                    <TableCell>{variant.quantity || 'N/A'}</TableCell>
                                    <TableCell>{variant.sku || 'N/A'}</TableCell>
                                    <TableCell>{variant.trackInventory ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6}>No variants found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };


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
                Product Details
            </DialogTitle>
            <Divider />
            <DialogContent dividers>
                <Tabs value={activeTab} onChange={handleTabChange} variant='scrollable' scrollButtons='auto'>
                    <Tab label='Product Image Info' />
                    <Tab label='Product Info' />

                </Tabs>

                <Box sx={{ mt: 3 }}>
                    {/* Product Info Tab */}
                    {activeTab === 1 && data?.product && (
                        <Grid container spacing={4}>
                            {/* Product Information Section */}
                            <Grid xs={12}>
                                <Typography variant='h6' className='font-bold py-2' color='primary'>Product Information</Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant='body1'><Box component="span" fontWeight="bold">Vendor ID:</Box> {product?.businessId?.vendorId || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant='body1'><Box component="span" fontWeight="bold">Product Name:</Box> {product?.name || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant='body1'><Box component="span" fontWeight="bold">Category:</Box> {product?.categoryId?.name || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant='body1'><Box component="span" fontWeight="bold">Weight:</Box> {product?.weight || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant='body1'><Box component="span" fontWeight="bold">Style Code:</Box> {product?.styleCode || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant='body1'><Box component="span" fontWeight="bold">HSN Code:</Box> {product?.hsnCode || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant='body1'><Box component="span" fontWeight="bold">GST:</Box> {product?.gst || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant='body1'><Box component="span" fontWeight="bold">Status:</Box> {product?.status || 'N/A'}</Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Typography variant='body1'><Box component="span" fontWeight="bold">Description:</Box> {product?.description || 'N/A'}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                            </Grid>
                            {/* Product Attributes Section */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h6' className='font-bold py-2' color='primary'>Product Attributes</Typography>
                                {renderAttributeTable(product?.attributes)}
                            </Grid>

                            {/* Product Variants Section */}
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h6' className='font-bold py-2' color='primary'>Product Variants</Typography>
                                {renderVariantsTable(product?.variants)}
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                            </Grid>
                            {/* Status Update Section */}
                            <Grid size={{ xs: 12 }} container spacing={2} alignItems="center">
                                <Grid item size={{ xs: 12, sm: 6 }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Typography variant='body2' color='text.primary' className='font-bold text-lg' sx={{ whiteSpace: 'nowrap' }}>
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
                                        >
                                            {statuses.map((statusOption) => (
                                                <MenuItem key={statusOption.value} value={statusOption.value}>
                                                    {statusOption.label}
                                                </MenuItem>
                                            ))}
                                        </CustomTextField>
                                    </Stack>
                                </Grid>

                                {selectedStatus === 'REJECTED' && (
                                    <Grid item xs={12}>
                                        <CustomTextField
                                            label="Reason"
                                            multiline
                                            minRows={2}
                                            fullWidth
                                            value={reason}
                                            onChange={handleReasonChange}
                                            size="small"
                                            error={Boolean(errors.reason)}
                                            helperText={errors.reason}
                                        />
                                    </Grid>
                                )}

                                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    <Button onClick={handleUpdateStatus} variant='contained' disabled={!selectedStatus}>
                                        Update Status
                                    </Button>
                                    <Button onClick={handleClose} variant='outlined' color='secondary'>
                                        Close
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    {/* Product Image Info Tab */}
                    {activeTab === 0 && data?.images && (
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant='h6' className='font-bold py-2' color='primary'>Product Images</Typography>
                            </Grid>
                            {images && images.length > 0 ? (
                                images.map((image) => (
                                    <Grid size={{ xs: 12, md: 6, sm: 4 }} key={image._id}>
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                height="150"
                                                image={image.url}
                                                alt={`Product Image ${image._id}`}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                            <CardContent>
                                                <Typography variant="body2" color="text.secondary" mb={2}>
                                                    Current Status: {image.status || 'PENDING'}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <CustomTextField
                                                        select
                                                        fullWidth
                                                        value={imageStatuses[image._id] || 'PENDING'}
                                                        onChange={(e) => handleImageStatusChange(image._id, e.target.value)}
                                                        size="small"
                                                    >
                                                        {allowedImageStatuses.map((option) => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </CustomTextField>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => handleUpdateImageStatus(image._id)}
                                                        disabled={!imageStatuses[image._id] || imageStatuses[image._id] === image.status}
                                                    >
                                                        Update
                                                    </Button>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="body1" className='text-center'>
                                        No images available for this business.
                                    </Typography>
                                </Grid>
                            )}
                            <Grid size={{ xs: 12 }} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 4 }}>
                                {images && images.length > 0 && (
                                    <Button onClick={handleApproveAllProductImages}  variant='contained' color='success'>
                                        Approve All Pending Images
                                    </Button>
                                )}
                               
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    )
}

export default ViewApprovalDetail
