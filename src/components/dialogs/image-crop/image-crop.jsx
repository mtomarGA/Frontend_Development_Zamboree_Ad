'use client'

import { Dialog, DialogTitle, DialogContent, Button, CircularProgress, Typography, Slider, styled } from '@mui/material'
import React, { useState, useCallback } from 'react'
import DialogCloseButton from '../DialogCloseButton'
import Cropper from 'react-easy-crop'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { getCroppedImg } from '@/utils/canvasUtils'

const CropContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '400px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '16px',
})

const ControlsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginTop: '16px',
})

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
  marginTop: '16px',
})

const ImageCropModal = ({ open, imageSrc, onConfirm, onClose, cropSize }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }, [])

  const handleCropAndApply = async () => {
    try {
      setLoading(true)
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
      const response = await fetch(croppedImage)
      const blob = await response.blob()
      const file = new File([blob], 'happening-bazaar.jpg', { type: 'image/jpeg' })
      await onConfirm(file)
    } catch (err) {
      console.error('Crop error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    // Reset state when dialog is closed
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setCroppedAreaPixels(null)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='md'
      scroll='paper'
      sx={{
        '& .MuiDialog-paper': { overflow: 'visible', minHeight: '600px' },
        '& .MuiDialogContent-root': { padding: '24px' }
      }}
    >
      <DialogCloseButton onClick={handleClose}>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4'>Crop Image</DialogTitle>

      <DialogContent dividers>
        <CropContainer>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={cropSize?.width / cropSize?.height || 4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            style={{
              cropAreaStyle: { border: '2px solid #1976d2', borderRadius: '4px' },
              mediaStyle: { maxHeight: '100%', maxWidth: '100%' }
            }}
          />
        </CropContainer>

        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, value) => setZoom(value)}
        />

        <ControlsContainer>
          <Typography variant="body2" color="text.secondary">
            Drag to position the crop area. Zoom if needed.
          </Typography>

          <ButtonContainer >
            <Button
              variant="contained"
              color="primary"
              onClick={handleCropAndApply}
              startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
              disabled={loading}
            >
              Crop & Apply
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </ButtonContainer>
        </ControlsContainer>
      </DialogContent>
    </Dialog>
  )
}

export default ImageCropModal
