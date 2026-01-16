'use client'

import React, { useState } from 'react'
import { Box, Card, Typography, Grid, Button } from '@mui/material'
import SingleImageUploader from './SingleFileUpload'
import MultipleImagesUploader from './MultipleFileUpload'
import { useAddListingFormContext } from '@/hooks/useAddListingForm'

export default function GalleryManagement() {

    const {
        logoImage,
        setLogoImage,
        coverImage,
        setCoverImage,
        businessImageList,
        setBusinessImageList,
        validateGallery,
        galleryErrors
    } = useAddListingFormContext();


    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validateGallery();
        if (!isValid) {
            console.log('Validation failed');
            return;
        }

        // Proceed to next step
        console.log('✅ All Images Ready:', {
            logoImage,
            coverImage,
            businessImageList
        });
    };

    return (
        <Card sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                    Business Galary
                </Typography>

                <Grid container spacing={5}>
                    <Grid item xs={12} md={6}>
                        <SingleImageUploader
                            title="Logo Image"
                            image={logoImage}
                            folderPath="Listing/Logo"
                            setImage={setLogoImage}
                            errorKey="logoImage"
                        />
                    </Grid>

                  

                    <Grid item xs={12}>
                        <MultipleImagesUploader
                            title="Image Gallery"
                            images={businessImageList}
                            folderPath="Listing/Gallery"
                            setImages={setBusinessImageList}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Card>
    )
}
