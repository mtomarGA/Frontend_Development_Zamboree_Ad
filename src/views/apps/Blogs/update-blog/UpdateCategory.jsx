'use client'

import { useEffect, useState } from 'react'
import { TextField, Button, Box, MenuItem, Grid, Avatar, Card, CardHeader, CardContent, Typography } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import '@/libs/styles/tiptapEditor.css'
import CustomTextField from '@/@core/components/mui/TextField'
import blogCategoryService from '@/services/blog/blogCategoryservice'
import { toast } from 'react-toastify'
import Image from '@/services/imageService.js'

export default function UpdateCategory({ categoryId, onClose, onSuccess, categoryData }) {
  const [sortingNo, setSortingNo] = useState(categoryData.sortingNo || '')
  const [categoryName, setCategoryName] = useState(categoryData.name || '')
  const [status, setStatus] = useState(categoryData.status || '')
  const [uploadedImageUrl, setUploadedImageUrl] = useState(categoryData.image || '')  // ✅ Set existing image
  const [files, setFiles] = useState([])

  const [errors, setErrors] = useState({
    sortingNo: '',
    categoryName: '',
    status: ''
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: 'Write something here...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ],
    autofocus: true
  })

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const formData = new FormData()
        formData.append('image', acceptedFiles[0])
        try {
          const res = await Image.uploadImage(formData)
          setUploadedImageUrl(res.data.url)          // ✅ Set uploaded image URL
          setFiles(acceptedFiles)
          toast.success('Image uploaded successfully!')
        } catch (error) {
          toast.error('Image upload failed')
        }
      }
    }
  })

  const handleSubmit = async () => {
    const newErrors = {
      sortingNo: sortingNo ? '' : 'Sorting Number is required',
      categoryName: categoryName ? '' : 'Category Name is required',
      status: status ? '' : 'Status is required'
    }
    setErrors(newErrors)

    if (newErrors.sortingNo || newErrors.categoryName || newErrors.status) {
      return
    }

    const data = {
      sortingNo: parseInt(sortingNo, 10),
      categoryName,
      status,
      image: uploadedImageUrl || categoryData.image || ''  // ✅ Always send image (uploaded or existing)
    }

    try {
      const result = await blogCategoryService.updateCategory(categoryId, data)
      toast.success(result?.message || 'Category updated successfully!')
      onSuccess?.()
      onClose?.(false)
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error(error?.response?.data?.message || 'Sorting Number already in use.')
      } else {
        toast.error('Failed to update category')
      }
    }
  }

  return (
    <div className='max-w-md mx-auto'>
      <Card>
        <CardHeader title={<Typography variant='h5'>Edit Blog Category</Typography>} />
        <CardContent sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Sorting No *'
                value={sortingNo}
                type='text'
                size='small'
                onChange={e => {
                  const value = e.target.value
                  if (/^\d*$/.test(value)) {
                    setSortingNo(value)
                  }
                }}
                error={!!errors.sortingNo}
                helperText={errors.sortingNo}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Name *'
                size='small'
                value={categoryName}
                onChange={e => setCategoryName(e.target.value)}
                error={!!errors.categoryName}
                helperText={errors.categoryName}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                select
                fullWidth
                size='small'
                label='Status *'
                value={status}
                onChange={e => setStatus(e.target.value)}
                error={!!errors.status}
                helperText={errors.status}
              >
                <MenuItem value='INACTIVE'>Inactive</MenuItem>
                <MenuItem value='ACTIVE'>Active</MenuItem>
              </CustomTextField>
            </Grid>

            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '1px dashed #ccc',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'grey.50' }
                }}
              >
                <input {...getInputProps()} />
                <Avatar sx={{ width: 24, height: 24, mx: 'auto', mb: 1, bgcolor: 'grey.100' }} variant='rounded'>
                  <i className='tabler-upload' style={{ fontSize: 14 }} />
                </Avatar>
                <Typography variant='caption' display='block'>Drag and drop image</Typography>
                <Typography variant='caption' color='text.secondary'>or</Typography>
                <Button variant='outlined' size='small' sx={{ mt: 0.5, fontSize: '0.75rem' }}>
                  Browse
                </Button>
              </Box>
              {uploadedImageUrl && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <img src={uploadedImageUrl} alt='Category' style={{ maxWidth: '100%', maxHeight: 150 }} />
                </Box>
              )}

              {files.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {files.map((file, i) => (
                    <Typography key={i} variant='caption' display='block' color='text.secondary'>
                      {file.name} - {Math.round(file.size / 1024)}KB
                    </Typography>
                  ))}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                variant='contained'
                size='small'
                sx={{ color: 'white' }}
                onClick={handleSubmit}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  )
}
