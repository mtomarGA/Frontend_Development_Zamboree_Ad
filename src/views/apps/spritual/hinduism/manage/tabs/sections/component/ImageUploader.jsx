'use client'

import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Avatar,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  CircularProgress,
  Card,
  Box,
  Chip,
  Fade,
  LinearProgress
} from '@mui/material'
import { toast } from 'react-toastify'
import ImageService from '@/services/imageService'
import ImageCropDialog from '@/components/dialogs/image-crop'
import { ORIENTATION_TO_ANGLE, getRotatedImage, getCroppedImg } from '@/utils/canvasUtils'
import { getOrientation } from 'get-orientation/browser'

const ImageUploader = ({
  onFileSelect,
  initialFile,
  error_text,
  imageUploading,
  imageId,
  setImageUploading,
  waterMark = false,
  label,
  ratio = { width: 400, height: 300 },
}) => {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // new start
  const [zoom, setZoom] = useState(1)
  const [cropSize, setCropSize] = useState({ width: 400, height: 100 })

  // Image cropping states
  const [imageSrc, setImageSrc] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [imageCropDialogOpen, setImageCropDialogOpen] = useState(false)
  const [currentCropContext, setCurrentCropContext] = useState(null) // To track what's being cropped
  const [rotation, setRotation] = useState(0) // Add rotation state

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const showCroppedImage = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      )

      return croppedImageUrl
    } catch (e) {
      console.error('Error cropping image:', e)
      throw e
    }
  }

  const handleClose = () => {
    setImageCropDialogOpen(false)
    setImageSrc(null)
    setCurrentCropContext(null)
    setCrop({ x: 0, y: 0 })
    setCroppedAreaPixels(null)
    setZoom(1)
  }

  const handleCropConfirm = async (croppedImage) => {
    if (!croppedImage) {
      console.error('No cropped image available for upload')
      return
    }
    if (!croppedImage) return

    try {
      // Convert cropped image to File object for upload
      const response = await fetch(croppedImage)
      const blob = await response.blob()
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })

      // Upload the cropped image
      const formData = new FormData()
      formData.append('image', file)
      const uploaded = await ImageService.uploadImage(formData)
      const imageUrl = uploaded.data.url
      handleChange('main_image')({ target: { value: imageUrl } })

      handleClose()
    } catch (error) {
      console.error('Error uploading cropped image:', error)
    }
  }


  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  const onImageSelect = async (file) => {
    let imageDataUrl = await readFile(file)

    try {
      const orientation = await getOrientation(file)
      const rotationAngle = ORIENTATION_TO_ANGLE[orientation]
      if (rotationAngle) {
        imageDataUrl = await getRotatedImage(imageDataUrl, rotationAngle)
      }
      setRotation(rotationAngle || 0)
    } catch (e) {
      console.warn('failed to detect the orientation')
      setRotation(0)
    }

    setImageSrc(imageDataUrl)
    setImageCropDialogOpen(true);
  }


  // new end

  useEffect(() => {
    if (initialFile) {
      setFile(initialFile)
    }
  }, [initialFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    onDrop: acceptedFiles => {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      onFileSelect(selectedFile)
      setDragActive(false)
      onImageSelect(selectedFile)

    },
    onDropRejected: () => {
      toast.error('You can only upload 1 file with max size of 2 MB.', { autoClose: 3000 })
      setDragActive(false)
    },
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  const handleRemove = async () => {
    setImageUploading(false)
    setFile(null)
    onFileSelect(null)
    setUploadProgress(0)
  }

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'mp3':
      case 'wav':
      case 'ogg':
        return 'tabler-music'
      case 'mp4':
        return 'tabler-video'
      default:
        return 'tabler-photo'
    }
  }

  const getFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  useEffect(() => {
    console.log('File:', file);

    if (file?.type?.startsWith('image/')) {
      handleRemove()
    }
  }, [file])

  if (imageUploading) {
    return (
      <Card className="p-6">
        <Box className="flex flex-col items-center justify-center py-8">
          <CircularProgress
            color="primary"
            size={48}
            className="mb-4"
          />
          <Typography variant="h6" className="mb-2">
            Uploading...
          </Typography>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            className="w-full max-w-xs"
          />
          <Typography variant="body2" color="text.secondary" className="mt-2">
            {uploadProgress}% complete
          </Typography>
        </Box>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Box className="p-3 relative">
        {label && (
          <Typography
            variant="h6"
            className="mb-4 font-semibold"
          >
            {label}
          </Typography>
        )}

        <Box
          {...getRootProps({ className: 'dropzone' })}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive || dragActive ? 'primary.main' : 'divider',
            borderRadius: 2,
            backgroundColor: isDragActive || dragActive
              ? 'action.hover'
              : 'background.paper',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover',
              transform: 'scale(1.01)'
            }
          }}
        >
          <input {...getInputProps()} />

          {!file && (
            <Fade in={!file}>
              <Box className="flex items-center flex-col py-3 px-3">
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 40,
                    height: 40,
                    mb: 3,
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText'
                  }}
                >
                  <i className="tabler-cloud-upload text-3xl" />
                </Avatar>

                <Typography
                  variant="h4"
                  className="mb-3 font-bold"
                  color="text.primary"
                >
                  {isDragActive ? 'Drop files here' : 'Upload Files'}
                </Typography>

                <Typography
                  variant="body1"
                  className="mb-2"
                  color="text.secondary"
                >
                  Drag & drop files here or click to browse
                </Typography>

                <Box className="flex flex-wrap gap-2 justify-center mb-3">
                  {['.jpeg', '.jpg', '.png'].map(ext => (
                    <Chip
                      key={ext}
                      label={ext}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Maximum file size: 2MB
                </Typography>

                {error_text && (
                  <Typography
                    variant="body2"
                    className="mt-3 font-medium"
                    color="error"
                  >
                    {error_text}
                  </Typography>
                )}
              </Box>
            </Fade>
          )}
        </Box>

        {file && (
          <Fade in={!!file}>
            <Card
              className="mt-4"
              variant="outlined"
            >
              <ListItem className="p-4">
                <Box className="flex items-center gap-4 w-full">
                  <Box className="relative flex-shrink-0">
                    {typeof file === 'string' || file.type?.startsWith('image/') ? (
                      <img
                        src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                        alt={typeof file === 'string' ? 'Uploaded file' : file.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: { xs: 64, sm: 80 },
                          height: { xs: 64, sm: 80 },
                          backgroundColor: 'primary.main',
                          color: 'primary.contrastText'
                        }}
                      >
                        <i className={`${getFileIcon(file.name)} text-xl sm:text-2xl`} />
                      </Avatar>
                    )}
                  </Box>

                  <Box className="flex-1 min-w-0">
                    <Typography
                      variant="subtitle1"
                      className="font-semibold truncate"
                      color="text.primary"
                    >
                      {typeof file === 'string' ? 'Uploaded file' : file.name}
                    </Typography>

                    {file.size && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        className="mt-1"
                      >
                        {getFileSize(file.size)}
                      </Typography>
                    )}

                    <Chip
                      label="Uploaded"
                      size="small"
                      color="success"
                      variant="outlined"
                      className="mt-2"
                    />
                  </Box>

                  <IconButton
                    onClick={handleRemove}
                    size="large"
                    color="error"
                    sx={{
                      flexShrink: 0,
                      minWidth: { xs: 44, sm: 48 },
                      minHeight: { xs: 44, sm: 48 },
                      '&:hover': {
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <i className="tabler-x text-xl" />
                  </IconButton>
                </Box>
              </ListItem>
            </Card>
          </Fade>
        )}
      </Box>
      <ImageCropDialog
        open={imageCropDialogOpen}
        imageSrc={imageSrc}
        crop={crop}
        setCrop={setCrop}
        onCropComplete={onCropComplete}
        handleClose={handleClose}
        showCroppedImage={showCroppedImage}
        onConfirm={handleCropConfirm}
        zoom={zoom}
        setZoom={setZoom}
        cropSize={cropSize}
      />
    </Card>
  )
}

export default FileUploader
