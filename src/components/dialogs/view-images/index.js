'use client'

import { useState, useEffect } from 'react'

import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CustomTextField from '@core/components/mui/TextField'
import { Box, Stack, MenuItem } from '@mui/material'

import approvalService from "@/services/approval/approval.service"
import { toast } from 'react-toastify'

import DialogCloseButton from '../DialogCloseButton'

const ViewBusinessImage = ({ open, setOpen, data: businessId, onSuccess }) => {
    const [imageStatuses, setImageStatuses] = useState({});
    const [localImages, setLocalImages] = useState({
        logo: null,
        coverImage: null,
        businessImages: [],
    });

    useEffect(() => {
        if (businessId) {
            getPendingImages(businessId);
        }
    }, [businessId, open]);

    const getPendingImages = async (businessId) => {
        try {
            const response = await approvalService.getSingleBusinessImages(businessId);
            if (response && response.statusCode === 200) {
                setLocalImages({
                    logo: response.data.logo ? { ...response.data.logo, _id: 'logo' } : null,
                    coverImage: response.data.coverImage ? { ...response.data.coverImage, _id: 'coverImage' } : null,
                    businessImages: (response.data.businessImages || []),
                });

                // Initialize statuses
                const initialStatuses = {};
                if (response.data.logo) initialStatuses[response.data.logo._id] = response.data.logo.status;
                if (response.data.coverImage) initialStatuses[response.data.coverImage._id] = response.data.coverImage.status;
                (response.data.businessImages || []).forEach(img => {
                    initialStatuses[img._id] = img.status;
                });
                setImageStatuses(initialStatuses);
            } else {
                toast.error(response?.message || 'Failed to fetch pending images.');
            }
        } catch (error) {
            console.error('Error fetching pending images:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setImageStatuses({});
        setLocalImages({
            logo: null,
            coverImage: null,
            businessImages: [],
        });
    };

    const allowedImageStatuses = [
        { value: 'APPROVED', label: 'APPROVED' },
        { value: 'REJECTED', label: 'REJECTED' },
    ];

    const handleImageStatusChange = (imageId, newStatus) => {
        setImageStatuses(prevStatuses => ({
            ...prevStatuses,
            [imageId]: newStatus,
        }));
    };

    const handleUpdateImageStatus = async (imageId) => {
        const statusToUpdate = imageStatuses[imageId];

        if (!imageId || !businessId || !statusToUpdate) {
            toast.error('Missing data. Cannot update status.');
            return;
        }

        try {
            const response = await approvalService.updateBusinessImageStatus(imageId, { status: statusToUpdate, businessId });
            if (response && response.statusCode === 200) {
                toast.success(response.message || `Image status updated to ${statusToUpdate} successfully!`);

                setLocalImages(prev => ({
                    ...prev,
                    logo: prev.logo && prev.logo._id === imageId ? { ...prev.logo, status: statusToUpdate } : prev.logo,
                    coverImage: prev.coverImage && prev.coverImage._id === imageId ? { ...prev.coverImage, status: statusToUpdate } : prev.coverImage,
                    businessImages: prev.businessImages.map(img =>
                        img._id === imageId ? { ...img, status: statusToUpdate } : img
                    ),
                }));

                setImageStatuses(prev => ({
                    ...prev,
                    [imageId]: statusToUpdate,
                }));

                onSuccess();
            } else {
                toast.error(response?.message || 'Failed to update image status.');
            }
        } catch (error) {
            console.error('Error updating image status:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating image status.');
        }
    };

    const handleApproveAllImagesStatus = async () => {
        if (!businessId) {
            toast.error('Business ID is missing. Cannot approve all images.');
            return;
        }

        try {
            const response = await approvalService.allImageApprove(businessId);
            if (response && response.statusCode === 200) {
                toast.success(response.message || 'All pending images approved successfully!');
                onSuccess();

                setLocalImages(prev => ({
                    logo: prev.logo && prev.logo.status === 'PENDING' ? { ...prev.logo, status: 'APPROVED' } : prev.logo,
                    coverImage: prev.coverImage && prev.coverImage.status === 'PENDING' ? { ...prev.coverImage, status: 'APPROVED' } : prev.coverImage,
                    businessImages: prev.businessImages.map(img =>
                        img.status === 'PENDING' ? { ...img, status: 'APPROVED' } : img
                    ),
                }));

                setImageStatuses(prev => {
                    const newStatuses = { ...prev };
                    if (localImages.logo && localImages.logo.status === 'PENDING') {
                        newStatuses[localImages.logo._id] = 'APPROVED';
                    }
                    if (localImages.coverImage && localImages.coverImage.status === 'PENDING') {
                        newStatuses[localImages.coverImage._id] = 'APPROVED';
                    }
                    localImages.businessImages.forEach(img => {
                        if (img.status === 'PENDING') {
                            newStatuses[img._id] = 'APPROVED';
                        }
                    });
                    return newStatuses;
                });
            } else {
                toast.error(response?.message || 'Failed to approve all images.');
            }
        } catch (error) {
            console.error('Error approving all images:', error);
            toast.error(error.response?.data?.message || 'An error occurred while approving all images.');
        }
    };

    const hasPendingImages = !!(
        (localImages.logo && localImages.logo.status === 'PENDING') ||
        (localImages.coverImage && localImages.coverImage.status === 'PENDING') ||
        (localImages.businessImages && localImages.businessImages.some(img => img.status === 'PENDING'))
    );

    const renderImageCard = (image) => (
        <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}>
            <img
                src={image.url}
                alt={`Business Image ${image._id}`}
                style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px'
                }}
            />
            <Stack direction="row" spacing={2} alignItems="center" mt={2}>
                <CustomTextField
                    select
                    fullWidth
                    value={imageStatuses[image._id] || 'PENDING'}
                    onChange={(e) => handleImageStatusChange(image._id, e.target.value)}
                    size="small"
                    disabled={image.status === 'APPROVED' || image.status === 'REJECTED'}
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
                    disabled={
                        !imageStatuses[image._id] ||
                        imageStatuses[image._id] === (image.status || 'PENDING') ||
                        image.status === 'APPROVED' ||
                        image.status === 'REJECTED'
                    }
                >
                    Update
                </Button>
            </Stack>
            <Typography variant="body2" color="text.secondary" mt={1}>
                Current Status: <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>{image.status || 'PENDING'}</Typography>
            </Typography>
        </Box>
    );

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
                Business Images Approval
            </DialogTitle>
            <Divider sx={{ my: 4 }} />

            <DialogContent dividers>

                {/* Row 1: Logo and Cover Image */}
                {(localImages.logo || localImages.coverImage) && (
                    <Grid container spacing={4} mb={4}>
                        {localImages.logo && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6" mb={2}>Logo Image</Typography>
                                {renderImageCard(localImages.logo)}
                            </Grid>
                        )}

                        {localImages.coverImage && (
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h6" mb={2}>Cover Image</Typography>
                                {renderImageCard(localImages.coverImage)}
                            </Grid>
                        )}
                    </Grid>
                )}

                {/* Row 2: Business Images */}
                {localImages.businessImages && localImages.businessImages.length > 0 && (
                    <>
                        <Typography variant="h6" mb={2}>Business Images</Typography>
                        <Grid container spacing={4}>
                            {localImages.businessImages.map((image) => (
                                <Grid item xs={12} sm={6} md={4} key={image._id}>
                                    {renderImageCard(image)}
                                </Grid>
                            ))}
                        </Grid>
                    </>
                )}

                {/* No Images Message */}
                {(!localImages.logo && !localImages.coverImage && (!localImages.businessImages || localImages.businessImages.length === 0)) && (
                    <Typography variant="body1" className='text-center'>
                        No images available for this business.
                    </Typography>
                )}
            </DialogContent>



            <DialogActions sx={{ justifyContent: 'flex-end', my: 3, gap: 2 }}>
                {(localImages.logo || localImages.coverImage || localImages.businessImages.length > 0) && (
                    <Button
                        onClick={handleApproveAllImagesStatus}
                        variant='contained'
                        color='success'
                        disabled={!hasPendingImages}
                    >
                        Approve All Pending Images
                    </Button>
                )}
                <Button onClick={handleClose} variant='outlined' color='secondary'>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ViewBusinessImage



// 'use client'

// import { useState, useEffect, use } from 'react'

// import Grid from '@mui/material/Grid'
// import Dialog from '@mui/material/Dialog'
// import Button from '@mui/material/Button'
// import DialogTitle from '@mui/material/DialogTitle'
// import DialogContent from '@mui/material/DialogContent'
// import DialogActions from '@mui/material/DialogActions'
// import Typography from '@mui/material/Typography'
// import Divider from '@mui/material/Divider'
// import CustomTextField from '@core/components/mui/TextField'
// import { Box, Stack, MenuItem } from '@mui/material'

// import approvalService from "@/services/approval/approval.service"
// import { toast } from 'react-toastify'

// import DialogCloseButton from '../DialogCloseButton'

// const ViewBusinessImage = ({ open, setOpen, data, onSuccess }) => {
//     const [imageStatuses, setImageStatuses] = useState({});
//     const [localImages, setLocalImages] = useState({
//         logo: null,
//         coverImage: null,
//         businessImages: [],
//     });



//     useEffect(() => {
//         if (data) {
//             getPendingImages(data)
//         }
//     }, [data]);

//     const getPendingImages = async (data) => {
//         try {
//             const response = await approvalService.getSingleBusinessImages(data);
//             if (response && response.statusCode === 200) {
//                 console.log(response.data, "response data");
//                 setLocalImages({
//                     logo: response.data.logo || null,
//                     coverImage: response.data.coverImage || null,
//                     businessImages: response.data.businessImages || [],
//                 });
//             } else {
//                 toast.error(response?.message || 'Failed to fetch pending images.');
//             }
//         } catch (error) {
//             console.error('Error fetching pending images:', error);
//         }
//     }


//     // useEffect(() => {
//     //     if (images) {
//     //         setLocalImages(images);
//     //         const initialStatuses = {};
//     //         images.forEach(img => {
//     //             initialStatuses[img._id] = img.status || 'PENDING';
//     //         });
//     //         setImageStatuses(initialStatuses);
//     //     } else {
//     //         setLocalImages([]);
//     //         setImageStatuses({});
//     //     }
//     // }, [images]);

//     const handleClose = () => {
//         setOpen(false);
//         setImageStatuses({});
//         setLocalImages([]);
//     }

//     const allowedImageStatuses = [
//         { value: 'APPROVED', label: 'APPROVED' },
//         { value: 'REJECTED', label: 'REJECTED' },
//     ];

//     const handleImageStatusChange = (imageId, newStatus) => {
//         setImageStatuses(prevStatuses => ({
//             ...prevStatuses,
//             [imageId]: newStatus,
//         }));
//     };

//     const handleUpdateImageStatus = async (imageId) => {
//         const statusToUpdate = imageStatuses[imageId];

//         if (!imageId) {
//             toast.error('Image ID is missing. Cannot update status.');
//             return;
//         }
//         if (!businessId) {
//             toast.error('Business ID is missing. Cannot update status.');
//             return;
//         }
//         if (!statusToUpdate) {
//             toast.error('Please select a status for the image.');
//             return;
//         }

//         try {
//             const response = await approvalService.updateBusinessImageStatus(imageId, { status: statusToUpdate, businessId: businessId });

//             if (response && response.statusCode === 200) {
//                 toast.success(response.message || `Image status updated to ${statusToUpdate} successfully!`);
//                 setLocalImages(prevImages => prevImages.map(img =>
//                     img._id === imageId ? { ...img, status: statusToUpdate } : img
//                 ));
//                 onSuccess();
//             } else {
//                 toast.error(response?.message || 'Failed to update image status.');
//             }
//         } catch (error) {
//             console.error('Error updating image status:', error);
//             toast.error(error.response?.data?.message || 'An error occurred while updating image status.');
//         }
//     };

//     const handleApproveAllImagesStatus = async () => {
//         if (!businessId) {
//             toast.error('Business ID is missing. Cannot approve all images.');
//             return;
//         }
//         console.log("businessId", businessId);

//         try {
//             const response = await approvalService.allImageApprove(businessId); // Pass businessId directly
//             console.log("businessId", response);

//             if (response && response.statusCode === 200) {
//                 toast.success(response.message || 'All pending images approved successfully!');
//                 onSuccess();

//                 setLocalImages(prevImages => prevImages.map(img =>
//                     img.status === 'PENDING' ? { ...img, status: 'APPROVED' } : img
//                 ));
//                 setImageStatuses(prevStatuses => {
//                     const newStatuses = { ...prevStatuses };
//                     localImages.forEach(img => {
//                         if (img.status === 'PENDING') {
//                             newStatuses[img._id] = 'APPROVED';
//                         }
//                     });
//                     return newStatuses;
//                 });

//             } else {
//                 toast.error(response?.message || 'Failed to approve all images.');
//             }
//         } catch (error) {
//             console.error('Error approving all images:', error);
//             toast.error(error.response?.data?.message || 'An error occurred while approving all images.');
//         }
//     };

//     const hasPendingImages = localImages.some(img => img.status === 'PENDING');


//     return (
//         <Dialog
//             fullWidth
//             open={open}
//             onClose={handleClose}
//             maxWidth='md'
//             scroll='body'
//             sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
//         >
//             <DialogCloseButton onClick={handleClose} disableRipple>
//                 <i className='tabler-x' />
//             </DialogCloseButton>

//             {/* Dialog Title */}
//             <DialogTitle variant='h4' className='text-center'>
//                 {name} Images Approval
//             </DialogTitle>
//             <Divider sx={{ my: 4 }} />

//             <DialogContent dividers>
//                 {localImages && localImages.length > 0 ? (
//                     <Grid container spacing={4}>
//                         {localImages.map((image) => ( // Map over localImages state
//                             <Grid item xs={12} sm={6} md={4} key={image._id}>
//                                 <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}>
//                                     {/* The Image Preview */}
//                                     <img
//                                         src={image.url}
//                                         alt={`Business Image ${image._id}`}
//                                         style={{
//                                             width: '100%',
//                                             height: '150px',
//                                             objectFit: 'cover',
//                                             borderRadius: '4px'
//                                         }}
//                                     />
//                                     <Stack direction="row" spacing={2} alignItems="center" mt={2}>
//                                         {/* Status Dropdown */}
//                                         <CustomTextField
//                                             select
//                                             fullWidth
//                                             value={imageStatuses[image._id] || 'PENDING'} // Use state value or 'PENDING'
//                                             onChange={(e) => handleImageStatusChange(image._id, e.target.value)}
//                                             size="small"
//                                             // Disable dropdown if image is already approved/rejected
//                                             disabled={image.status === 'APPROVED' || image.status === 'REJECTED'}
//                                         >
//                                             {allowedImageStatuses.map((option) => (
//                                                 <MenuItem key={option.value} value={option.value}>
//                                                     {option.label}
//                                                 </MenuItem>
//                                             ))}
//                                         </CustomTextField>

//                                         <Button
//                                             variant="contained"
//                                             onClick={() => handleUpdateImageStatus(image._id)}
//                                             // Disable if status hasn't changed or image is already final
//                                             disabled={
//                                                 !imageStatuses[image._id] ||
//                                                 imageStatuses[image._id] === (image.status || 'PENDING') ||
//                                                 image.status === 'APPROVED' || // Cannot update if already APPROVED
//                                                 image.status === 'REJECTED'    // Cannot update if already REJECTED
//                                             }
//                                         >
//                                             Update
//                                         </Button>
//                                     </Stack>

//                                     <Typography variant="body2" color="text.secondary" mt={1}>
//                                         Current Status: <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>{image.status || 'PENDING'}</Typography>
//                                     </Typography>
//                                 </Box>
//                             </Grid>
//                         ))}
//                     </Grid>
//                 ) : (
//                     <Typography variant="body1" className='text-center'>
//                         No images available for this business.
//                     </Typography>
//                 )}
//             </DialogContent>

//             {/* DialogActions for buttons at the bottom */}
//             <DialogActions sx={{ justifyContent: 'flex-end', my: 3, gap: 2 }}>
//                 {localImages.length > 0 && ( // Only show if there are images
//                     <Button
//                         onClick={handleApproveAllImagesStatus}
//                         variant='contained'
//                         color='success'
//                         disabled={!hasPendingImages}
//                     >
//                         Approve All Pending Images
//                     </Button>
//                 )}
//                 {/* Close Button */}
//                 <Button onClick={handleClose} variant='outlined' color='secondary'>
//                     Close
//                 </Button>
//             </DialogActions>
//         </Dialog >
//     )
// }

// export default ViewBusinessImage


// // 'use client'

// // import { useState, useEffect } from 'react'

// // // MUI Imports
// // import Grid from '@mui/material/Grid'
// // import Dialog from '@mui/material/Dialog'
// // import Button from '@mui/material/Button'
// // import DialogTitle from '@mui/material/DialogTitle'
// // import DialogContent from '@mui/material/DialogContent'
// // import DialogActions from '@mui/material/DialogActions'
// // import Typography from '@mui/material/Typography'
// // import Divider from '@mui/material/Divider'
// // import CustomTextField from '@core/components/mui/TextField'
// // import { Box, Stack, MenuItem } from '@mui/material'

// // import approvalService from "@/services/approval/approval.service"
// // import { toast } from 'react-toastify'

// // import DialogCloseButton from '../DialogCloseButton'

// // const ViewBusinessImage = ({ open, setOpen, data, onSuccess }) => {
// //     const [imageStatuses, setImageStatuses] = useState({});
// //     const { _id, name, images } = data || {};
// //     const [image, setImage] = useState([]);

// //     useEffect(() => {
// //         if (images) {
// //             setImage(images); // Set the local images state
// //             const initialStatuses = {};
// //             image.forEach(img => {
// //                 initialStatuses[img._id] = img.status || 'PENDING';
// //             });
// //             setImageStatuses(initialStatuses);
// //         }
// //     }, [images]);

// //     const handleClose = () => {
// //         setOpen(false);
// //         setImageStatuses({});
// //     }

// //     const allowedImageStatuses = [
// //         { value: 'APPROVED', label: 'APPROVED' },
// //         { value: 'REJECTED', label: 'REJECTED' },
// //     ];

// //     const handleImageStatusChange = (imageId, newStatus) => {
// //         setImageStatuses(prevStatuses => ({
// //             ...prevStatuses,
// //             [imageId]: newStatus,
// //         }));
// //     };

// //     const handleUpdateImageStatus = async (imageId) => {
// //         const statusToUpdate = imageStatuses[imageId];
// //         const businessId = _id;

// //         if (!imageId) {
// //             toast.error('Image ID is missing. Cannot update status.');
// //             return;
// //         }
// //         if (!businessId) {
// //             toast.error('Business ID is missing. Cannot update status.');
// //             return;
// //         }
// //         if (!statusToUpdate) {
// //             toast.error('Please select a status for the image.');
// //             return;
// //         }

// //         try {
// //             const response = await approvalService.updateBusinessImageStatus(imageId, { status: statusToUpdate, businessId: businessId });

// //             if (response && response.statusCode === 200) {
// //                 toast.success(response.message || `Image status updated to ${statusToUpdate} successfully!`);

// //                 setImage(prevImages => prevImages.map(img =>
// //                     img._id === imageId ? { ...img, status: statusToUpdate } : img
// //                 ));
// //                 onSuccess();
// //             } else {
// //                 toast.error(response?.message || 'Failed to update image status.');
// //             }
// //         } catch (error) {
// //             console.error('Error updating image status:', error);
// //             toast.error(error.response?.data?.message || 'An error occurred while updating image status.');
// //         }
// //     };

// //     const handleAllImageStatus = async () => {

// //         if (!businessId) {
// //             toast.error('Business ID is missing. Cannot update status.');
// //             return;
// //         }

// //         try {
// //             const response = await approvalService.allImageApprove(businessId);

// //             if (response && response.statusCode === 200) {
// //                 toast.success(response.message || `Image status updated to ${statusToUpdate} successfully!`);
// //                 onSuccess();
// //             } else {
// //                 toast.error(response?.message || 'Failed to update image status.');
// //             }
// //         } catch (error) {
// //             console.error('Error updating image status:', error);
// //             toast.error(error.response?.data?.message || 'An error occurred while updating image status.');
// //         }
// //     };

// //     return (
// //         <Dialog
// //             fullWidth
// //             open={open}
// //             onClose={handleClose}
// //             maxWidth='md'
// //             scroll='body'
// //             sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
// //         >
// //             <DialogCloseButton onClick={handleClose} disableRipple>
// //                 <i className='tabler-x' />
// //             </DialogCloseButton>

// //             {/* Dialog Title */}
// //             <DialogTitle variant='h4' className='text-center'>
// //                 {name} Images Approval
// //             </DialogTitle>
// //             <Divider sx={{ my: 4 }} />
// //             <DialogContent dividers>
// //                 {images && images.length > 0 ? (
// //                     <Grid container spacing={4}>
// //                         {images.map((image) => (
// //                             <Grid item xs={12} sm={6} md={4} key={image._id}>
// //                                 <Box sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}>
// //                                     {/* The Image Preview */}
// //                                     <img
// //                                         src={image.url}
// //                                         alt={`Business Image ${image._id}`}
// //                                         style={{
// //                                             width: '100%',
// //                                             height: '150px', // Fixed height for consistency
// //                                             objectFit: 'cover', // Ensures image covers the area without distortion
// //                                             borderRadius: '4px'
// //                                         }}
// //                                     />
// //                                     <Stack direction="row" spacing={2} alignItems="center" mt={2}>
// //                                         {/* Status Dropdown */}
// //                                         <CustomTextField
// //                                             select
// //                                             fullWidth
// //                                             // label="Status"
// //                                             value={imageStatuses[image._id] || image.status || 'PENDING'}
// //                                             onChange={(e) => handleImageStatusChange(image._id, e.target.value)}
// //                                             size="small"
// //                                         >
// //                                             {allowedImageStatuses.map((option) => (
// //                                                 <MenuItem key={option.value} value={option.value}>
// //                                                     {option.label}
// //                                                 </MenuItem>
// //                                             ))}
// //                                         </CustomTextField>

// //                                         <Button
// //                                             variant="contained" // Solid background button
// //                                             onClick={() => handleUpdateImageStatus(image._id)} // Calls update handler with image ID
// //                                             disabled={!imageStatuses[image._id] || imageStatuses[image._id] === (image.status || 'PENDING')}
// //                                         >
// //                                             Update
// //                                         </Button>
// //                                     </Stack>

// //                                     <Typography variant="body2" color="text.secondary" mt={1}>
// //                                         Current Status: {image.status || 'PENDING'}
// //                                     </Typography>
// //                                 </Box>
// //                             </Grid>
// //                         ))}
// //                     </Grid>
// //                 ) : (
// //                     <Typography variant="body1" className='text-center'>
// //                         No images available for this business.
// //                     </Typography>
// //                 )}
// //             </DialogContent>

// //             <DialogActions>
// //                 {/* Use Grid container for the main row of elements */}
// //                 <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ pt: 3, width: '100%' }}>
// //                     {/* Right side: Update Status Button and Close Button */}
// //                     <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}> {/* Align to end */}
// //                         <Button
// //                             onClick={handleAllImageStatus()}
// //                             variant='contained'
// //                         // color='primary'
// //                         >
// //                             Approve All Image
// //                         </Button>
// //                         <Button onClick={handleClose} variant='outlined' color='secondary'>
// //                             Close
// //                         </Button>
// //                     </Grid>
// //                 </Grid>
// //             </DialogActions>
// //         </Dialog >
// //     )
// // }

// // export default ViewBusinessImage
