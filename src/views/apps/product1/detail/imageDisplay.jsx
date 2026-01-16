import React, { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Chip,
    Button
} from '@mui/material';
import product1Service from '@/services/product/product1';
import { toast } from 'react-toastify';

const ProductImagesDisplay = ({ showImages: initialImages, productId, onCoverImageUpdate }) => {
    const [localImages, setLocalImages] = useState(initialImages);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleCoverImage = async (imageId) => {
        setIsUpdating(true);
        try {
            // Optimistic UI update
            const updatedImages = localImages.map(img => ({
                ...img,
                type: img._id === imageId ? "COVER" : "NORMAL"
            }));
            setLocalImages(updatedImages);

            // Call API
            const response = await product1Service.updateCoverImage(productId, imageId);

            // Optional: Notify parent component
            if (onCoverImageUpdate) {
                onCoverImageUpdate(updatedImages);
            }

            toast.success(response?.message);
        } catch (error) {
            // Revert on error
            setLocalImages(initialImages);
            console.error("Operation failed:", error);
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Box sx={{
            p: 3,
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            backgroundColor: '#ffffff',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.05)'
        }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
                Product Images
            </Typography>

            <Grid container spacing={2}>
                {localImages?.map((image) => (
                    <Grid item xs={12} sm={6} md={4} key={image._id}>
                        <Card sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            '&:hover': {
                                boxShadow: '0px 4px 8px rgba(0,0,0,0.1)'
                            }
                        }}>
                            {image.type === "COVER" && (
                                <Chip
                                    label="Cover"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        zIndex: 1
                                    }}
                                />
                            )}
                            <CardMedia
                                component="img"
                                height="180"
                                image={image.url}
                                alt="Product image"
                                sx={{
                                    objectFit: 'cover',
                                    minHeight: 180,
                                    opacity: isUpdating && image.type === "COVER" ? 0.7 : 1
                                }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x180?text=Image+Not+Found';
                                }}
                            />
                            <CardActions sx={{ justifyContent: 'center', p: 1 }}>
                                <Button
                                    size="small"
                                    color={image.type === "COVER" ? "secondary" : "primary"}
                                    variant={image.type === "COVER" ? "contained" : "outlined"}
                                    disabled={image.type === "COVER" || isUpdating}
                                    sx={{
                                        textTransform: 'none',
                                        minWidth: 120
                                    }}
                                    onClick={() => handleCoverImage(image._id)}
                                >
                                    {image.type === "COVER" ? 'Cover' : 'Make Cover'}
                                    {isUpdating && image.type === "COVER" && '...'}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProductImagesDisplay;
