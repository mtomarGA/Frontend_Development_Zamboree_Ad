'use client'

import React, { useState } from 'react'
import {
  Button,
  Card,
  Box,
  Typography,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import { CloudUpload } from '@mui/icons-material'

const DonationForm = ({ nextHandle, handleCancel }) => {
  const [formData, setFormData] = useState({
    image: null ,
    description: '',
    buttonName: '',
    buttonLink: ''
  })

  const [errors, setErrors] = useState({
    description: '',
    buttonName: '',
    buttonLink: ''
  })

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
    }
  }

  const validate = () => {
    let isValid = true
    const newErrors = { description: '', buttonName: '', buttonLink: '' }

    if (!formData.description) {
      newErrors.description = 'Description is required'
      isValid = false
    }
    if (!formData.buttonName) {
      newErrors.buttonName = 'Button Name is required'
      isValid = false
    }
    if (!formData.buttonLink) {
      newErrors.buttonLink = 'Button Link is required'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    // Submit logic
    console.log('Submitted Donation:', formData)
    nextHandle()
  }

  return (
    <Card sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Add Donation
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUpload />}
            >
              {formData.image ? formData.image.name : 'Upload Image'}
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              required
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange('description')}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              required
              label="Button Name"
              name="buttonName"
              value={formData.buttonName}
              onChange={handleChange('buttonName')}
              error={!!errors.buttonName}
              helperText={errors.buttonName}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <CustomTextField
              fullWidth
              required
              label="Button Link"
              name="buttonLink"
              value={formData.buttonLink}
              onChange={handleChange('buttonLink')}
              error={!!errors.buttonLink}
              helperText={errors.buttonLink}
              InputProps={{
                startAdornment: <InputAdornment position="start">https://</InputAdornment>
              }}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5, gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

export default DonationForm
