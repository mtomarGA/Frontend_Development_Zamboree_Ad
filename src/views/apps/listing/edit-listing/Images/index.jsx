'use client'

import React from 'react'
import { Box, Card, Typography, Grid, Button } from '@mui/material'
import SingleImageUploader from './SingleImageUpload'
import MultipleImagesUploader from './MultipleImageUpload'
import { useUpdateListingFormContext } from '@/hooks/updateListingForm'

function BusinessEditGalary({ listingId }) {
    const {
        logoImage,
        setLogoImage,
      
      
        businessImageList,
        setBusinessImageList,
        removedBusinessImageIds,
        validateGallery,
        saveGalleryUpdates,
        galleryErrors,
    } = useUpdateListingFormContext();
    console.log(logoImage, businessImageList, "logo cover business");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateGallery();
        if (!isValid) return;

        await saveGalleryUpdates({
            listingId,
            logoImage,
            businessImageList,
            removedBusinessImageIds
        });

        console.log('✅ Gallery updated successfully!');
    };

    return (
        <Card sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                    Edit Business Gallery
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
                            errorKey="businessImageList"
                        />
                    </Grid>
                </Grid>

                {/* <Button variant="contained" type="submit" sx={{ mt: 4 }}>
                    Save Changes
                </Button> */}
            </Box>
        </Card>
    )
}

export default BusinessEditGalary
