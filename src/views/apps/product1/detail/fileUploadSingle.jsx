// src/views/products/ImageOptionUploader.js
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Box, Button, IconButton, InputAdornment, Typography } from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import { toast } from 'react-toastify'
import ImageService from '@/services/imageService'
import { useproductContext } from '@/contexts/productContext'

const ImageOptionUploader = ({ initialImageUrl, onChange, label = 'Image', required = true }) => {
  const { handleFormChange, formData } = useproductContext()
  const [fileName, setFileName] = useState('')
  const [imageUrl, setImageUrl] = useState(initialImageUrl || formData?.thumbnail || '')
  const fileInputRef = useRef(null)
  const [imageLoader, setImageLoader] = useState(false)

  // ✅ Sync when parent updates `initialImageUrl`
  useEffect(() => {
    if (initialImageUrl) {
      setImageUrl(initialImageUrl)
      try {
        const url = new URL(initialImageUrl)
        const pathSegments = url.pathname.split('/')
        setFileName(pathSegments[pathSegments.length - 1])
      } catch {
        setFileName('File chosen')
      }
    } else {
      setImageUrl(formData?.thumbnail || '')
      setFileName('')
    }
  }, [initialImageUrl, formData?.thumbnail])

  const handleFileUpload = async (e) => {
    try {
      setImageLoader(true)
      const selectedFile = e.target.files?.[0]
      if (!selectedFile) {
        handleRemoveFile()
        return
      }

      const uploadData = new FormData()
      uploadData.append('image', selectedFile)

      const res = await ImageService.uploadImage(uploadData)

      if (res?.data?.url) {
        setFileName(selectedFile.name)
        setImageUrl(res.data.url)

        if (!formData.hasVariants) {
          handleFormChange('thumbnail', res.data.url)
        }
        onChange?.(res.data.url)
      } else {
        throw new Error('Image URL not received')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error uploading image')
      handleRemoveFile()
    } finally {
      setImageLoader(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = () => {
    setFileName('')
    setImageUrl('')
    handleFormChange('thumbnail', '')
    onChange?.('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div className='flex items-end gap-4'>
        <CustomTextField
          label={`${label}${required ? '*' : ''}`}
          type='text'
          placeholder='No file chosen'
          value={fileName}
          className='flex-auto'
          InputProps={{
            readOnly: true,
            endAdornment: fileName && (
              <InputAdornment position='end'>
                <IconButton size='small' edge='end' onClick={handleRemoveFile}>
                  <i className='tabler-x' />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{
            '& .MuiInputBase-input': {
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }
          }}
        />
        <Button component='label' variant='tonal' disabled={imageLoader}>
          {imageLoader ? 'Uploading...' : 'Choose'}
          <input
            hidden
            type='file'
            onChange={handleFileUpload}
            ref={fileInputRef}
            accept='image/*'
          />
        </Button>
      </div>

      {imageUrl && (
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <img
            src={imageUrl}
            alt='Uploaded'
            style={{
              maxWidth: 80,
              maxHeight: 80,
              objectFit: 'contain',
              border: '1px solid #eee',
              borderRadius: '4px'
            }}
          />
          <Typography variant='caption' color='text.secondary'>
            {fileName}
          </Typography>
        </Box>
      )}

      {required && !imageUrl && !imageLoader && (
        <Typography variant='caption' color='error'>
          Image is required.
        </Typography>
      )}
    </Box>
  )
}

export default ImageOptionUploader
