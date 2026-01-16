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

const FileUploader = ({
  onFileSelect,
  initialFile,
  error_text,
  imageUploading,
  imageId,
  setImageUploading,
  label
}) => {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

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
      <Box>
        {label && (
          <Typography
            variant="body2"
            className="mb-1 font-medium"
          >
            {label}
          </Typography>
        )}
        <Box
          sx={{
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 1,
            backgroundColor: 'action.hover',
            aspectRatio: '1 / 1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80px',
            maxHeight: '150px',
            flexDirection: 'column',
            padding: 1
          }}
        >
          <CircularProgress
            color="primary"
            size={30}
            className="mb-1"
          />
          <Typography variant="caption" className="mb-1" fontWeight="medium">
            Uploading...
          </Typography>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ width: '70%', mb: 0.5 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
            {uploadProgress}%
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      {label && (
        <Typography
          variant="caption"
          className="mb-0.5 font-medium block"
        >
          {label}
        </Typography>
      )}

      <Box
        {...getRootProps({ className: 'dropzone' })}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive || dragActive ? 'primary.main' : 'divider',
          borderRadius: 1,
          backgroundColor: isDragActive || dragActive
            ? 'action.hover'
            : 'background.paper',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '80px',
          maxHeight: '150px',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          }
        }}
      >
        <input {...getInputProps()} />

        {!file && (
          <Fade in={!file}>
            <Box className="flex items-center flex-col justify-center p-1 text-center">
              <Avatar
                variant="rounded"
                sx={{
                  width: 28,
                  height: 28,
                  mb: 0.5,
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText'
                }}
              >
                <i className="tabler-cloud-upload text-lg" />
              </Avatar>

              <Typography
                variant="caption"
                className="mb-0.5 font-semibold"
                color="text.primary"
                sx={{ fontSize: '0.7rem' }}
              >
                {isDragActive ? 'Drop' : 'Upload'}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: '0.65rem' }}
              >
                Click or drag
              </Typography>

              {error_text && (
                <Typography
                  variant="caption"
                  className="mt-0.5 font-medium"
                  color="error"
                  sx={{ fontSize: '0.6rem' }}
                >
                  {error_text}
                </Typography>
              )}
            </Box>
          </Fade>
        )}

        {file && (
          <Fade in={!!file}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.paper'
              }}
            >
              {typeof file === 'string' || file.type?.startsWith('image/') ? (
                <img
                  src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                  alt={typeof file === 'string' ? 'Uploaded file' : file.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }}
                />
              ) : (
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText'
                  }}
                >
                  <i className={`${getFileIcon(file.name)} text-lg`} />
                </Avatar>
              )}

              <IconButton
                onClick={handleRemove}
                size="small"
                color="error"
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 24,
                  height: 24,
                  backgroundColor: 'background.paper',
                  boxShadow: 1,
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'white',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <i className="tabler-x text-sm" />
              </IconButton>
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  )
}

export default FileUploader
