'use client'

import React, { useMemo, useEffect } from 'react'
import {
  Box,
  Button,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  Paper,
  CircularProgress // Make sure to import CircularProgress
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useAddListingFormContext } from '@/hooks/useAddListingForm'

function BusinessImagesUpload({ nextHandle }) {
  const {
    // imageData: { businessImages, logo, coverImage },
    imageErrors,
    isImageUploading, // Get the loading state from context
    uploadingStatus,
    handleBusinessImagesChange,
    handleLogoChange,
    handleCoverImageChange,
    removeBusinessImage,
    validateImages
  } = useAddListingFormContext()

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent submission if an upload is in progress
    if (isImageUploading) {
      console.log('Cannot submit: Image upload in progress.');
      return;
    }

    const isValid = validateImages();
    if (!isValid) {
      console.log('Cannot submit: Validation failed.');
      return;
    }

    console.log('Validation passed, proceeding to next step.');
    nextHandle(); // Only call nextHandle if validation passes and no upload is active
  };

  const formatSize = (size) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  // Generate previews (unchanged)
  const businessImagePreviews = useMemo(() => {
    return businessImages.map((file) =>
      typeof file === 'string' ? file : URL.createObjectURL(file)
    )
  }, [businessImages])

  const logoPreview = useMemo(() => {
    return !logo || typeof logo === 'string' ? logo : URL.createObjectURL(logo)
  }, [logo])

  const coverImagePreview = useMemo(() => {
    return !coverImage || typeof coverImage === 'string'
      ? coverImage
      : URL.createObjectURL(coverImage)
  }, [coverImage])

  // Clean up blobs (unchanged)
  useEffect(() => {
    return () => {
      businessImagePreviews.forEach((url) => {
        if (url && url.startsWith('blob:')) URL.revokeObjectURL(url)
      })
      if (logoPreview && logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
      if (coverImagePreview && coverImagePreview.startsWith('blob:')) URL.revokeObjectURL(coverImagePreview)
    }
  }, [businessImagePreviews, logoPreview, coverImagePreview])

  return (
    <Box p={2} component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" mb={2}>
        Upload Images
      </Typography>

      <Grid container spacing={3}>
        {/* Business Images */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={1}>
              Business Images
            </Typography>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              // Use specific loading status for this button
              startIcon={uploadingStatus.businessImages ? <CircularProgress size={20} color="inherit" /> : <span>📁</span>}
              disabled={uploadingStatus.businessImages} // Disable this button only when its own upload is active
            >
              {uploadingStatus.businessImages ? 'Uploading...' : 'Choose Files'}
              <input
                hidden
                multiple
                accept="image/*"
                type="file"
                onChange={handleBusinessImagesChange}
                disabled={uploadingStatus.businessImages} // Disable the input itself
              />
            </Button>
            {imageErrors.businessImages && (
              <Typography variant="body2" color="red" mt={1}>
                {imageErrors.businessImages}
              </Typography>
            )}
            <Box mt={2}>
              {businessImagePreviews.map((url, index) => (
                <Card key={index} sx={{ mb: 1 }}>
                  <CardMedia
                    component="img"
                    height="60"
                    image={url}
                    alt={`Image ${index + 1}`}
                    sx={{ objectFit: 'contain' }}
                  />
                  <CardActions sx={{ justifyContent: 'flex-end', py: 0 }}>
                    <IconButton onClick={() => removeBusinessImage(index)} disabled={isImageUploading}>
                      <span role="img" aria-label="delete">
                        ❌
                      </span>
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Logo */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }} >
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={1}>
              Logo
            </Typography>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={uploadingStatus.logo ? <CircularProgress size={20} color="inherit" /> : <span>📁</span>}
              disabled={uploadingStatus.logo}
            >
              {uploadingStatus.logo ? 'Uploading...' : 'Choose File'}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleLogoChange}
                disabled={uploadingStatus.logo}
              />
            </Button>
            {imageErrors.logo && (
              <Typography variant="body2" color="red" mt={1}>
                {imageErrors.logo}
              </Typography>
            )}
            {logoPreview && (
              <Card sx={{ mt: 2 }}>
                <CardMedia component="img" height="60" image={logoPreview} sx={{ objectFit: 'contain' }} />
              </Card>
            )}
          </Paper>
        </Grid>

        {/* Cover Image */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography fontWeight={600} mb={1}>
              Cover Image
            </Typography>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              startIcon={uploadingStatus.coverImage ? <CircularProgress size={20} color="inherit" /> : <span>📁</span>}
              disabled={uploadingStatus.coverImage}
            >
              {uploadingStatus.coverImage ? 'Uploading...' : 'Choose File'}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleCoverImageChange}
                disabled={uploadingStatus.coverImage}
              />
            </Button>
            {imageErrors.coverImage && (
              <Typography variant="body2" color="red" mt={1}>
                {imageErrors.coverImage}
              </Typography>
            )}
            {coverImagePreview && (
              <Card sx={{ mt: 2 }}>
                <CardMedia component="img" height="60" image={coverImagePreview} sx={{ objectFit: 'contain' }} />
              </Card>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default BusinessImagesUpload;
