'use client'

import React, { useState } from 'react'
import { Box, Button, Typography, IconButton, CircularProgress } from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import DeleteIcon from '@mui/icons-material/Close'
import ImageService from '@/services/imageService'
import { useAddListingFormContext } from '@/hooks/useAddListingForm'

export default function SingleImageUploader({ title, image, setImage, errorKey, folderPath }) {
    const [loading, setLoading] = useState(false)
    const { galleryErrors, setGalleryErrors } = useAddListingFormContext()

    const handleFileChange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        setLoading(true)
        try {
            const uploaded = await ImageService.uploadMultipleImage([file], { folder: folderPath })
            const url = uploaded?.data?.[0]?.url
            setImage(url)
            setGalleryErrors(prev => ({ ...prev, [errorKey]: '' }));
        } catch (err) {
            console.error('Upload failed:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (url) => {
        await ImageService.deleteImage(url);
        setImage(null)
    }

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {title}
            </Typography>

            <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                sx={{ mb: 2 }}
                disabled={loading}
            >
                {loading ? 'Uploading...' : `Upload ${title}`}
                <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleFileChange}
                />
            </Button>

            {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}

            {image && (
                <Box sx={{ position: 'relative', width: 200, height: 140, mt: 2 }}>
                    <img
                        src={image}
                        alt={title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 8,
                        }}
                    />
                    <IconButton
                        size="small"
                        onClick={() => handleRemove(image)}
                        sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}
            {galleryErrors?.logoImage && (
                <Typography color="red" variant="body2" sx={{ mt: 1 }}>
                    {galleryErrors.logoImage}
                </Typography>
            )}
        </Box>
    )
}
