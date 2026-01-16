// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Avatar } from '@mui/material'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import CustomTextField from '@/@core/components/mui/TextField'
import { toast } from 'react-toastify'
import Image from '@/services/imageService'
import ListingPackage from '@/services/listingPackage/PackageService'

const AddModal = ({ open, handleClose, GetPackageFun }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    discountPrice: '',
    validity: '',
    image: '',
    status: 'INACTIVE',
    features: [''] // multiple feature fields
  })

  const [formErrors, setFormErrors] = useState({})

  // 🔍 Validation
  const validateFields = (data) => {
    let errors = {}

    if (!data.title.trim()) errors.title = 'Title is required'
    if (!data.price || isNaN(data.price)) errors.price = 'Valid price is required'
    if (!data.discountPrice || isNaN(data.discountPrice)) errors.discountPrice = 'Valid discount price is required'
    if (!data.validity.trim()) errors.validity = 'Validity is required'
    if (!data.image.trim()) errors.image = 'Image URL is required'
    if (!data.status) errors.status = 'Status is required'
    if (data.features.some(f => !f.trim())) errors.features = 'All features are required'

    return errors
  }

  // 🔄 General input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]:
        name === 'price' || name === 'discountPrice'
          ? parseFloat(value) || ''
          : value
    }))
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // ⚙️ Feature handlers
  const handleFeatureChange = (index, value) => {
    const updated = [...formData.features]
    updated[index] = value
    setFormData(prev => ({ ...prev, features: updated }))
  }

  const handleAddFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ''] }))
  }

  const handleRemoveFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, features: updated }))
  }

  // 🖼️ Image upload handler
  const handleImageChange = async (e) => {
    const { files } = e.target
    if (!files[0]) return

    try {
      const imageData = { image: files[0] }
      const result = await Image.uploadImage(imageData)

      if (result.data.url) {
        setFormData(prev => ({ ...prev, image: result.data.url }))
        if (formErrors.image) setFormErrors(prev => ({ ...prev, image: '' }))
      }
    } catch (error) {
      toast.error('Failed to upload image')
      console.error(error)
    }
  }

  // 🚀 Submit handler
  const handleSubmit = async () => {
    // console.log(formData,"formDataformData");
    const errors = validateFields(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      toast.error('Please fill all required fields')
      return
    }
console.log(formData,"formDataformData");

    try {
      const response = await ListingPackage.post(formData)
      if (response.success === true) {
        toast.success(response.message)
        handleClose()
        GetPackageFun()
      }

      // Reset
      setFormData({
        title: '',
        price: '',
        discountPrice: '',
        validity: '',
        packageId: '',
        image: '',
        status: 'INACTIVE',
        features: ['']
      })
      setFormErrors({})
    } catch (error) {
      toast.error('Failed to add package')
      console.error(error)
    }
  }

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby='customized-dialog-title'
      open={open}
      closeAfterTransition={false}
      PaperProps={{ sx: { overflow: 'visible' } }}
    >
      <DialogTitle id='customized-dialog-title'>
        <Typography variant='h5' component='span'>Add Package</Typography>
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {/* Title */}
          <CustomTextField
            className='w-full'
            name='title'
            label='Title'
            onChange={handleInputChange}
            value={formData.title}
            variant='outlined'
            error={!!formErrors.title}
            helperText={formErrors.title}
            sx={{ mb: 3 }}
          />

          {/* Price */}
          <CustomTextField
            className='w-full'
            name='price'
            label='Price'
            type='number'
            onChange={handleInputChange}
            value={formData.price}
            variant='outlined'
            error={!!formErrors.price}
            helperText={formErrors.price}
            sx={{ mb: 3 }}
          />

          {/* Discount Price */}
          <CustomTextField
            className='w-full'
            name='discountPrice'
            label='Discount Price'
            type='number'
            onChange={handleInputChange}
            value={formData.discountPrice}
            variant='outlined'
            error={!!formErrors.discountPrice}
            helperText={formErrors.discountPrice}
            sx={{ mb: 3 }}
          />

          {/* Validity */}
          <CustomTextField
            className='w-full'
            name='validity'
            label='Validity'
            placeholder='e.g. 30 Days'
            onChange={handleInputChange}
            value={formData.validity}
            variant='outlined'
            error={!!formErrors.validity}
            helperText={formErrors.validity}
            sx={{ mb: 3 }}
          />

          {/* Features */}
          <Box sx={{ mb: 3 }}>
            <Typography variant='body2' sx={{ mb: 1 }}>Features</Typography>
            {formData.features.map((feature, index) => (
              <Grid container spacing={1} alignItems='center' key={index} sx={{ mb: 1 }}>
                <Grid item xs={11}>
                  <CustomTextField
                    fullWidth
                    label={`Feature ${index + 1}`}
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={1}>
                  {index === formData.features.length - 1 ? (
                    <IconButton color='primary' onClick={handleAddFeature}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  ) : (
                    <IconButton color='error' onClick={() => handleRemoveFeature(index)}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            ))}
            {formErrors.features && (
              <Typography variant='caption' color='error'>
                {formErrors.features}
              </Typography>
            )}
          </Box>

          {/* Image Upload */}
          <div className='my-2'>
            <label htmlFor='image' className='text-sm'>Image</label>
            <div>
              <Button
                variant='outlined'
                component='label'
                className='w-full'
                sx={{ mb: 3 }}
              >
                Upload File
                <input
                  type='file'
                  hidden
                  name='image'
                  onChange={handleImageChange}
                  key={formData.image ? 'file-selected' : 'file-empty'}
                  accept='image/*'
                />
              </Button>
              {formData.image && (
                <Avatar src={formData.image} sx={{ width: 56, height: 56 }} />
              )}
              {formErrors.image && (
                <Typography variant='body2' color='error'>
                  {formErrors.image}
                </Typography>
              )}
            </div>
          </div>

          {/* Status */}
          <Box width='100%' mb={3}>
            <FormControl fullWidth error={!!formErrors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                name='status'
                value={formData.status || ''}
                onChange={handleInputChange}
                label='Status'
              >
                <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
              </Select>
              {formErrors.status && (
                <Typography variant='caption' color='error'>
                  {formErrors.status}
                </Typography>
              )}
            </FormControl>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant='tonal' color='secondary'>
          Close
        </Button>
        <Button onClick={handleSubmit} variant='contained'>
          Add Package
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddModal
