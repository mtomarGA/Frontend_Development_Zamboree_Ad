'use client'

import React, {useRef, useState } from 'react'
import {
  Button,
  Card,
  Box,
  Typography,
  Grid,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tooltip,
  CircularProgress,
  Backdrop
} from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import DeleteIcon from '@mui/icons-material/Close'
import { useTempleContext } from '@/contexts/TempleFormContext'
import ImageService from '@/services/imageService'
import { useJainism } from '@/contexts/JainFormContext'
import { useBuddhism } from '@/contexts/BuddhaFormContext'
import ImageCropModal from '@/components/dialogs/image-crop/image-crop'

const ImageUploadSection = ({ title, images, setImages, type, error_message }) => {
  const { tempImageIds, setTempImageIds, setGalleryErrors ,resetForm  } = useBuddhism()
  const [loading, setLoading] = useState(false)
  const [imageCropDialogOpen, setImageCropDialogOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    try {
       setLoading(true)

      const uploaded = await ImageService.uploadMultipleImage(files,{isWatermarked: type === 'galleryImages', folder: "Spiritual/Buddhism/Temple"})

      const imageUrls = uploaded.data.map(item => item.url)
      const imageIds = uploaded.data.map(item => item.public_id)

      if (type === 'galleryImages') {
        setTempImageIds(prev => [...prev, ...imageIds])
        setGalleryErrors(prev => ({ ...prev, [type]: '' }))
        setImages(prev => [...prev, ...imageUrls])

      } else {
        setTempImageIds(imageIds)
        setGalleryErrors(prev => ({ ...prev, [type]: '' }))
        setImages(imageUrls)
      }
      setImageSrc(null)
      fileInputRef.current.value = null // Reset file input
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveImage = async (index, url) => {
    setLoading(true)
    // const imageId = tempImageIds[index]
    setTempImageIds(prev => prev.filter((_, i) => i !== index))
    await ImageService.deleteImage(url)
    const updated = [...images]
    updated.splice(index, 1)
    setImages(updated)
    setLoading(false)
  }

  return (
    <Grid item xs={12}>
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
        {loading ? 'Uploading...' : `Upload ${type === 'bannerImages' ? 'Banners' : 'Gallery'}`}
        <input
          hidden
          ref={fileInputRef}
          accept="image/*"
          multiple={type === 'galleryImages'}
          type="file"
          onChange={type === 'galleryImages' ? handleImageUpload : (e => {
            setImageCropDialogOpen(true)
            setImageSrc(URL.createObjectURL(e.target.files[0]))
          })}
        />
      </Button>

      {images.length > 0 && (
        <ImageList cols={4} gap={12} sx={{ mt: 1 }}>
          {images.map((img, index) => (
            <ImageListItem key={index} sx={{ borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
              <img
                src={img}
                alt={`${type}-${index}`}
                loading="lazy"
                style={{
                  height: 140,
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: 8,
                  transition: 'transform 0.3s',
                }}
              />
              <ImageListItemBar
                sx={{
                  background: 'rgba(0, 0, 0, 0.5)',
                  height: 30,
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  left: 0,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  pr: 1,
                }}
                position="top"
                actionIcon={
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index,img)}
                      sx={{ color: 'white' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      <Typography variant="caption" sx={{ color: 'error.main', m: 2 }}>
        {error_message}
      </Typography>

      {/* Loader Overlay */}
      <Backdrop open={loading} sx={{ zIndex: 1000, color: '#fff' }}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <ImageCropModal
        open={imageCropDialogOpen}
        imageSrc={imageSrc}
        cropSize={{ width: 800, height: 600 }}
        onClose={() => {
          setImageCropDialogOpen(false)
        }}
        onConfirm={(file) =>{
          setImageSrc(null)
          setImageCropDialogOpen(false)
          handleImageUpload({ target: { files: [file] } })
        }}
      />
    </Grid>
  )
}


const Gallery = ({ nextHandle, handleCancel }) => {
  const {
    bannerImages, setBannerImages,
    galleryImages, setGalleryImages, validateGalleryImages, galleryErrors, setGalleryErrors , setTempleTabManager } = useBuddhism()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = {
      banners: bannerImages.map(img => img.file),
      gallery: galleryImages.map(img => img.file)
    }
    const isValid = validateGalleryImages(formData)
    console.log("errror", galleryErrors);
    
    if (!isValid) {
      console.log('Validation failed')
      return
    }
    console.log('Gallery Data:', formData)
    setTempleTabManager(prev => ({ ...prev, donation: true }))
    nextHandle()
  }

  return (
    <Card sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
          Gallery Management
        </Typography>

        <Grid container spacing={5}>
          <ImageUploadSection
            title="Upload Banner Images"
            images={bannerImages}
            setImages={setBannerImages}
            type="bannerImages"
            error_message={galleryErrors.bannerImages}
          />
          <ImageUploadSection
            title="Upload Gallery Images"
            images={galleryImages}
            setImages={setGalleryImages}
            type="galleryImages"
            error_message={galleryErrors.galleryImages}
          />
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button
            onClick={() => { handleCancel(); resetForm() }}
            variant="outlined"
            color="primary"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save & Continue
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

export default Gallery
