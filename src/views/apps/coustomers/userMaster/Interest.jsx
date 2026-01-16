'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import Link from 'next/link'

// Service Imports
import interest from '@/services/customers/interestService'
import Image from '@/services/imageService'
// MUI Imports
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Typography,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

// Form Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import ColumnVisibility from '@/components/coustomer/UserMaster/InterestTable'

// Toast
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'

const InterestForm = () => {
  const [openInterestModal, setOpenInterestModal] = useState(false)
  const [imageLoader, setimageLoader] = useState(false)

  const { hasPermission } = useAuth()
  const [getInterest, setgetInterest] = useState()

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      image: '',
      status: 'INACTIVE'
    }
  })


  const uploadImage = async (file) => {
    setimageLoader(false)
    const formData = new FormData()
    formData.append('image', file)
    const imageUrls = await Image.uploadImage(formData)
    if (imageUrls?.data?.url) {
      setimageLoader(true)
    }
    return imageUrls?.data?.url
  }



  const onSubmit = async (data) => {
    try {
      let imageUrl = ''
      if (data.image) {
        imageUrl = await uploadImage(data.image)
      }
      const formData = {
        name: data.name,
        status: data.status,
        image: imageUrl
      }
      const result = await interest.createInterest(formData)
      
      toast.success(result.message)
      getInterestdata()
      reset()
      setOpenInterestModal(false)
    } catch (error) {
      console.error('Error:', error)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong'
      toast.error(errorMessage)
    }
  }

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent='space-between' alignItems='center'>
          <Typography variant='h6'>Interest List</Typography>
          {hasPermission("user_user_master:add") && <Button
            variant='outlined'
            className='bg-[#7367F0] text-white'
            onClick={() => setOpenInterestModal(true)}
          >
            Add Interest
          </Button>}
        </Grid>
      </CardContent>

      {/* Interest Modal */}
      <Dialog
        open={openInterestModal}
        maxWidth='md'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >

        <DialogCloseButton disableRipple onClick={() => setOpenInterestModal(false)}>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle>Edit Interest</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <Controller
                  name='name'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      label='Interest'
                      placeholder='Photography'
                      error={!!errors.name}
                      helperText={errors.name && 'This field is required.'}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='image'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, ref } }) => (
                    <CustomTextField
                      inputRef={ref}
                      fullWidth
                      type='file'
                      label='Image'
                      onChange={e => {
                        onChange(e.target.files?.[0] || null)
                        uploadImage(e.target.files?.[0])
                      }}
                      helperText={errors.image ? 'This field is required.' : 'Choose Image'}
                      error={!!errors.image}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name='status'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <CustomTextField
                      {...field}
                      fullWidth
                      select
                      label='Status'
                      error={!!errors.status}
                      helperText={errors.status && 'This field is required.'}
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (selected) => {
                          if (!selected) {
                            return <span>Select Status</span>;
                          }
                          return selected.charAt(0) + selected.slice(1).toLowerCase(); // Capitalize
                        }
                      }}
                    >
                      <MenuItem value='ACTIVE'>Active</MenuItem>
                      <MenuItem value='INACTIVE'>Inactive</MenuItem>
                    </CustomTextField>
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setOpenInterestModal(false)}>Cancel</Button>
            <Button type='submit' disabled={!imageLoader} variant='contained'>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ColumnVisibility getInterest={getInterest} />
    </Card>
  )
}

export default InterestForm
