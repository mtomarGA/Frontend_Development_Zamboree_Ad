'use client'
import React, { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Slider,
  Box,
  Typography,
  IconButton,
} from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

/* ------------------ IMAGE CROPPING UTILITY ------------------ */
async function getCroppedImg(imageSrc, croppedAreaPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = imageSrc

    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const pixelRatio = window.devicePixelRatio || 1

      canvas.width = croppedAreaPixels.width * pixelRatio
      canvas.height = croppedAreaPixels.height * pixelRatio
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
      ctx.imageSmoothingQuality = 'high'

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error('Crop failed'))),
        'image/jpeg',
        0.95
      )
    }
    image.onerror = reject
  })
}

/* ------------------ AUTO CENTER CROP GENERATOR ------------------ */
function getAutoCropArea(image, aspect) {
  const imgW = image.width
  const imgH = image.height

  let cropW, cropH

  if (imgW / imgH > aspect) {
    cropH = imgH
    cropW = imgH * aspect
  } else {
    cropW = imgW
    cropH = imgW / aspect
  }

  return {
    x: (imgW - cropW) / 2,
    y: (imgH - cropH) / 2,
    width: cropW,
    height: cropH,
  }
}

/* ------------------ MAIN COMPONENT ------------------ */
const MultiImageCropperModal = ({
  open,
  images = [],
  aspect = 1,
  onCancel,
  onCropAll,
  thumbnailLabel = 'Thumbnail',
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [cropStates, setCropStates] = useState({}) // Stores crop, zoom, croppedPixels
  const [loading, setLoading] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const currentImage = images[currentIndex] || null

  /* ------------------ RESTORE CROP ON IMAGE CHANGE ------------------ */
  useEffect(() => {
    const saved = cropStates[currentIndex]

    if (saved) {
      setCrop(saved.crop || { x: 0, y: 0 })
      setZoom(saved.zoom || 1)
    } else {
      setCrop({ x: 0, y: 0 })
      setZoom(1)
    }
  }, [currentIndex])

  /* SAVE CROP POSITION & PIXELS */
  const handleCropChange = (c) => {
    setCrop(c)
    setCropStates((prev) => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        crop: c,
      },
    }))
  }

  const handleZoomChange = (z) => {
    setZoom(z)
    setCropStates((prev) => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        zoom: z,
      },
    }))
  }

  const onCropComplete = useCallback(
    (_, croppedPixels) => {
      setCropStates((prev) => ({
        ...prev,
        [currentIndex]: {
          ...prev[currentIndex],
          croppedPixels,
        },
      }))
    },
    [currentIndex]
  )

  /* ------------------ NAVIGATION ------------------ */
  const handleNext = () => {
    if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  /* ------------------ UPLOAD ALL ------------------ */
  const handleUploadAll = async () => {
    setLoading(true)
    try {
      const blobs = []

      for (let i = 0; i < images.length; i++) {
        const cropData = cropStates[i]

        if (cropData?.croppedPixels) {
          const blob = await getCroppedImg(images[i], cropData.croppedPixels)
          blobs.push(blob)
        } else {
          const imgObj = await new Promise((res) => {
            const im = new Image()
            im.src = images[i]
            im.onload = () => res(im)
          })

          const autoArea = getAutoCropArea(imgObj, aspect)
          const blob = await getCroppedImg(images[i], autoArea)
          blobs.push(blob)
        }
      }

      onCropAll(blobs)
    } catch (err) {
      console.error('Cropping error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onCancel}>
      <DialogTitle>Crop Images</DialogTitle>

      <DialogContent sx={{ position: 'relative', height: 420, background: '#111' }}>
        {currentImage ? (
          <>
            {currentIndex === 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  zIndex: 30,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  px: 1.2,
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                  {thumbnailLabel}
                </Typography>
              </Box>
            )}

            {currentIndex > 0 && (
              <IconButton
                onClick={handlePrev}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: 10,
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                  zIndex: 40,
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            )}

            {currentIndex < images.length - 1 && (
              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 10,
                  transform: 'translateY(-50%)',
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.8)' },
                  zIndex: 40,
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            )}

            <Cropper
              image={currentImage}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={handleCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={handleZoomChange}
              initialCroppedAreaPixels={cropStates[currentIndex]?.croppedPixels || null}
              showGrid={false}
            />

            <Box sx={{ position: 'absolute', bottom: 16, left: '10%', right: '10%' }}>
              <Slider
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(_, val) => handleZoomChange(Array.isArray(val) ? val[0] : val)}
              />
            </Box>

            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                color: '#fff',
                opacity: 0.8,
              }}
            >
              {currentIndex + 1}/{images.length}
            </Typography>
          </>
        ) : (
          <Typography sx={{ color: 'white', textAlign: 'center', mt: 20 }}>
            No Image Selected
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>

        <Button onClick={handleUploadAll} variant="contained" disabled={loading}>
          {loading ? 'Processing...' : 'Crop & Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default MultiImageCropperModal
