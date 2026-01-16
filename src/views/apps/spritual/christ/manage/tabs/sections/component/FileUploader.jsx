'use client'

import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Avatar, Typography, Button, IconButton, List, ListItem, Backdrop, CircularProgress } from '@mui/material'
import { toast } from 'react-toastify'
import ImageService from '@/services/imageService'

const FileUploader = ({ onFileSelect, initialFile, error_text, imageUploading, imageId, setImageUploading }) => {
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (initialFile) {
      setFile(initialFile)
    }
  }, [initialFile])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024, // 2MB
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: acceptedFiles => {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      onFileSelect(selectedFile)
    },
    onDropRejected: () => {
      toast.error('You can only upload 1 image with max size of 2 MB.', { autoClose: 3000 })
    }
  })

  const handleRemove = async () => {
    setImageUploading(true)
    try {
      await ImageService.deleteImage(imageId)
      setImageUploading(false)
    } catch (error) {
      console.log('Error deleting image:', error);
      setImageUploading(false)
    }
    
    setFile(null)
    onFileSelect(null)
  }

  if (imageUploading) {
    return (
      <CircularProgress color='inherit' />
    )

  }

  return (
    <>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {!file && <div className='flex items-center flex-col'>
          <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
            <i className='tabler-upload' />
          </Avatar>
          <Typography variant='h4' className='mbe-2.5'>Upload temple image</Typography>
          <Typography>Allowed *.jpeg, *.jpg, *.png, *.gif</Typography>
          <Typography>Only 1 file, max size 2 MB</Typography>
          {/* error */}
          <p className='text-red-500 text-sm'> {error_text} </p>
        </div>}
      </div>

      {file && (
        <List>
          <ListItem>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <img src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                alt={typeof file === 'string' ? 'Uploaded file' : file.name} width={100} height={100} />
              <div>
                <Typography>{file.name}</Typography>
                {/* <Typography variant='body2'>{(file.size / 1024).toFixed(1)} KB</Typography> */}
              </div>
              <IconButton onClick={handleRemove}>
                <i className='tabler-x text-xl' />
              </IconButton>
            </div>

          </ListItem>
        </List>
      )}
    </>
  )
}

export default FileUploader
