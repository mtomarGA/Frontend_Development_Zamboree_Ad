'use client'

import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Avatar,
  Typography,
  IconButton,
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
import ImageCropModal from './dialogs/image-crop/image-crop'

const FileUploader = ({
  onFileSelect,
  initialFile,
  error_text,
  acceptedFiles,
  label,
  name,
  isWatermark = false,
  folderName= "Other",
  cropSize = { width: 800, height: 600 }
}) => {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [cropOpen, setCropOpen] = useState(false)
  const [tempImage, setTempImage] = useState(null)

  useEffect(() => {
    if (initialFile) setFile(initialFile)
  }, [initialFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
    accept: {
      [acceptedFiles || 'image/*']: ['.png', '.jpg', '.jpeg'],
    },
    onDrop: acceptedFiles => {
      const selectedFile = acceptedFiles[0]
      if (!selectedFile) return
      // instead of uploading immediately, show cropper
      setTempImage(URL.createObjectURL(selectedFile))
      setCropOpen(true)
    },
    onDropRejected: () => {
      toast.error('You can only upload 1 image (max 2MB).', { autoClose: 3000 })
      setDragActive(false)
    },
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false)
  })

  const handleCropConfirm = async (croppedFile) => {
    setCropOpen(false)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', croppedFile)

      const uploaded = await ImageService.uploadImage(formData , { isWatermark, folder: folderName })

      setFile(uploaded.data.url)

      onFileSelect({
        target: { name, value: uploaded.data.url }
      })
    } catch (err) {
      toast.error('Upload failed, please try again.', { autoClose: 3000 })
      setFile(null)
      onFileSelect({ target: { name, value: null } })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleCropClose = () => {
    setCropOpen(false)
    setTempImage(null)
  }

  const handleRemove = () => {
    setFile(null)
    onFileSelect({ target: { name, value: null } })
  }

  // Show uploading state
  if (uploading) {
    return (
      <Card className="p-6">
        <Box className="flex flex-col items-center justify-center py-8">
          <CircularProgress color="primary" size={48} className="mb-4" />
          <Typography variant="h6" className="mb-2">Uploading...</Typography>
          {/* <LinearProgress variant="determinate" value={uploadProgress} className="w-full max-w-xs" />
          <Typography variant="body2" color="text.secondary" className="mt-2">
            {uploadProgress}% complete
          </Typography> */}
        </Box>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <Box className="p-3 relative">
        {label && <Typography variant="h6" className="mb-4 font-semibold">{label}</Typography>}

        <Box
          {...getRootProps({ className: 'dropzone' })}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive || dragActive ? 'primary.main' : 'divider',
            borderRadius: 2,
            backgroundColor: isDragActive || dragActive ? 'action.hover' : 'background.paper',
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
                <Avatar variant="rounded" sx={{
                  width: 40, height: 40, mb: 3,
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText'
                }}>
                  <i className="tabler-cloud-upload text-3xl" />
                </Avatar>

                <Typography variant="h4" className="mb-3 font-bold">
                  {isDragActive ? 'Drop files here' : 'Upload Files'}
                </Typography>

                <Typography variant="body1" className="mb-2" color="text.secondary">
                  Drag & drop files here or click to browse
                </Typography>

                <Box className="flex flex-wrap gap-2 justify-center mb-3">
                  {['.jpeg', '.jpg', '.png'].map(ext => (
                    <Chip key={ext} label={ext} size="small" variant="outlined" color="primary" />
                  ))}
                </Box>

                {error_text && (
                  <Typography variant="body2" color="error" className="mt-3 font-medium">
                    {error_text}
                  </Typography>
                )}
              </Box>
            </Fade>
          )}
        </Box>

        {file && (
          <Fade in={!!file}>
            <Card className="mt-4" variant="outlined">
              <ListItem className="p-4">
                <Box className="flex items-center gap-4 w-full">
                  <Box className="relative flex-shrink-0">
                    <img
                      src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                      alt="Uploaded"
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-md"
                    />
                  </Box>

                  <Box className="flex-1 min-w-0">
                    <Typography variant="subtitle1" className="font-semibold truncate">
                      Uploaded file
                    </Typography>
                    <Chip label="Uploaded" size="small" color="success" variant="outlined" className="mt-2" />
                  </Box>

                  <IconButton onClick={handleRemove} size="large" color="error">
                    <i className="tabler-x text-xl" />
                  </IconButton>
                </Box>
              </ListItem>
            </Card>
          </Fade>
        )}
      </Box>

      {/* Image crop modal */}
      <ImageCropModal
        open={cropOpen}
        imageSrc={tempImage}
        onConfirm={handleCropConfirm}
        onClose={handleCropClose}
        cropSize={cropSize}
      />
    </Card>
  )
}

export default FileUploader
