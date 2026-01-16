'use client'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

// React & Others
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'

// Styles
import '@/libs/styles/tiptapEditor.css'

// Services
import categoryService from '@/services/category/category.service'
import Image from '@/services/imageService'

const CategoryInformation = () => {
  const router = useRouter()

  const [imageLoader, setImageLoader] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'INACTIVE',
    iconImage: '',
    thumbImage: '',
    bannerImageWeb: '',
    bannerImageApp: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e) => {
    const { name, files } = e.target

    if (!files?.[0]) return

    try {
      setImageLoader(true)
      const file = files[0]

      const data = new FormData()
      data.append('image', file)

      const response = await Image.uploadImage(data)

      if (response?.data?.url) {
        setFormData(prev => ({
          ...prev,
          [name]: response.data.url
        }))
      } else {
        throw new Error('Image URL not received')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Error uploading image')
    } finally {
      setImageLoader(false)
    }
  }


  const handleSubmit = async () => {
    try {

      if (!formData.name || '') {
        toast.error("Name Is Required")
        return
      } if (!formData.iconImage || '') {
        toast.error("Icon Image Is Required")
        return
      } if (!formData.thumbImage || '') {
        toast.error("Thumbnail Image Is Required")
        return
      } if (!formData.bannerImageWeb || '') {
        toast.error("Banner Image For Web Is Required")
        return
      } if (!formData.bannerImageApp || '') {
        toast.error("Banner Image For App Is Required")
        return
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        iconImage: formData.iconImage,
        thumbImage: formData.thumbImage,
        bannerImageWeb: formData.bannerImageWeb,
        bannerImageApp: formData.bannerImageApp
      }

      const res = await categoryService.addCategory(payload)
      toast.success('Category Added Successfully')
      router.push('/en/apps/listing/masters/view-category')
    } catch (error) {
      toast.error(error.response?.data?.message || "Something Went Wrong")
      console.error(error)
    }
  }


  return (
    <Card>
      <CardHeader title='Category Information' />
      <CardContent>
        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomTextField
              fullWidth
              label='Category Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter Category Name'
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomTextField
              fullWidth
              label='Description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Enter Description'
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <CustomTextField
              select
              fullWidth
              label='Status'
              name='status'
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
              <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
            </CustomTextField>
          </Grid>
        </Grid>
        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type='file'
              name='iconImage'
              label='Icon Image'
              onChange={handleFileUpload}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type='file'
              name='thumbImage'
              label='Thumbnail Image'
              onChange={handleFileUpload}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type='file'
              name='bannerImageWeb'
              label='Banner Image Web'
              onChange={handleFileUpload}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              type='file'
              name='bannerImageApp'
              label='Banner Image Application'
              onChange={handleFileUpload}
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={6} className='mbe-6'>
          <Grid size={{ xs: 3, md: 3 }}>
            <Button variant='contained' onClick={handleSubmit}>
              Add Category
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default CategoryInformation
