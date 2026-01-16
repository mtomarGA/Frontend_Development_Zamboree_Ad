'use client'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import React, { useEffect, useState } from 'react'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '../DialogCloseButton'
import BugService from '@/services/bugService'
import { CircularProgress, Slider, styled, Typography } from '@mui/material'
import ImageService from '@/services/imageService'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Grid } from '@mui/system'
import Cropper from 'react-easy-crop'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const CropContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '400px',
  backgroundColor: '#f5f5f5',
  borderRadius: '8px',
  overflow: 'hidden',
  marginBottom: '16px',
});

const ControlsContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginTop: '16px',
});

const ButtonContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  gap: '12px',
  marginTop: '16px',
});

const ImageCropDialog = ({
  open,
  imageSrc,
  crop,
  setCrop,
  onCropComplete,
  handleClose,
  showCroppedImage,
  zoom,
  setZoom,
  onConfirm,
  cropSize
}) => {
  const [loading, setLoading] = useState(false);
  const handleCropAndApply = async () => {
    try {
      setLoading(true);
      const url = await showCroppedImage();
      if (url) await onConfirm(url);
    } catch (error) {
      console.error('Error cropping image:', error);
    } finally {
      setLoading(false);
      // handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='md'
      scroll='paper'
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible',
          minHeight: '600px',
        },
        '& .MuiDialogContent-root': {
          padding: '24px',
        }
      }}
    >
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='text-start'>
        Crop Image
      </DialogTitle>

      <DialogContent dividers>
        <CropContainer>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoomWithScroll={true}
            aspect={cropSize ? cropSize.width / cropSize.height : 1}
            onCropChange={setCrop}
            
            onZoomChange={setZoom}
            zoom={zoom}
            onCropComplete={onCropComplete}
            style={{
              containerStyle: {
                position: 'relative',
                width: '100%',
                height: '100%',
              },
              cropAreaStyle: {
                border: '2px solid #1976d2',
                borderRadius: '4px',
              },
              mediaStyle: {
                maxHeight: '100%',
                maxWidth: '100%',
              },
            }}
          />
        </CropContainer>

        <ControlsContainer>
          <Typography variant="body2" color="text.secondary">
            Drag to reposition the image and use the corners to resize the crop area.
          </Typography>

          <ButtonContainer>
            <Button
              onClick={handleCropAndApply}
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              sx={{
                minWidth: '140px',
                textTransform: 'none',
                borderRadius: '8px',
              }}
            >
              Crop & Apply
            </Button>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="secondary"
              size="large"
              sx={{
                minWidth: '140px',
                textTransform: 'none',
                borderRadius: '8px',
              }}
            >
              Cancel
            </Button>
          </ButtonContainer>
        </ControlsContainer>
      </DialogContent>
    </Dialog>
  )
}

export default ImageCropDialog
