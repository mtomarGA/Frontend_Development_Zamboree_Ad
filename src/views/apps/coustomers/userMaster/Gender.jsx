'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Toast
import { toast } from 'react-toastify'

// Service
import GenderUser from '@/services/customers/gender'
import Image from '@/services/imageService'
// Components
import CustomTextField from '@core/components/mui/TextField'
import ColumnVisibility from '@/components/coustomer/UserMaster/GenderTable'
import { useAuth } from '@/contexts/AuthContext'

const GenderForm = () => {
  const [openGenderModal, setOpenGenderModal] = useState(false)
  const [imageLoader, setImageLoader] = useState(false)
  console.log('imageLoader', imageLoader)
  const { hasPermission } = useAuth()

  // Local form state
  const [userData, setUserData] = useState({
    name: '',
    image: null,
    status: 'INACTIVE'
  })

  const [getUserData, setGetUserData] = useState()

  // Handle change
  const handleChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getGender = async () => {
    const result = await GenderUser.getAllGender()
    setGetUserData(result.data)
  }

  useEffect(() => {
    getGender()
  }, [])

  // Save handler
  const uploadImage = async (file) => {
    setImageLoader(false)
    const formData = new FormData()
    formData.append('image', file)
    const imageUrls = await Image.uploadImage(formData)
    if (imageUrls?.data?.url) {
      setImageLoader(true)
    }
    return imageUrls?.data?.url
  }

  const handleSave = async (data) => {
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

      const result = await GenderUser.createGender(formData)
      toast.success(result.message)
      getGender()
      setUserData({
        name: '',
        image: null,
        status: 'INACTIVE'
      })
      setOpenGenderModal(false)
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
        <Grid container xs={12} className='flex items-center justify-between'>
          <CardHeader title='Gender List' />
          {hasPermission('user_user_master:add') && (
            <Button
              variant='outlined'
              className='bg-[#7367F0] text-white'
              onClick={() => setOpenGenderModal(true)}
            >
              Add Gender
            </Button>
          )}
        </Grid>
      </CardContent>

      {/* Modal */}
      <Dialog
        open={openGenderModal}
        maxWidth='md'
        scroll='body'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={() => setOpenGenderModal(false)} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>

        <DialogTitle variant='h4' className='flex gap-2 flex-col'>
          Add Gender
        </DialogTitle>

        <DialogContent>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Gender'
                placeholder='Male'
                value={userData.name}
                onChange={e => handleChange('name', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                type='file'
                label='Image'
                onChange={e => {
                  handleChange('image', e.target.files?.[0] || null)
                  uploadImage(e.target.files?.[0])
                }}
                helperText='Choose Image'
              />
            </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                select
                label='Status'
                value={userData.status}
                onChange={e => handleChange('status', e.target.value)}
              >
                <MenuItem value='ACTIVE'>Active</MenuItem>
                <MenuItem value='INACTIVE'>Inactive</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenGenderModal(false)}>Cancel</Button>
          <Button variant='contained' disabled={!imageLoader} onClick={() => handleSave(userData)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ColumnVisibility genderData={getUserData} onSuccess={getGender} />
    </Card>
  )
}

export default GenderForm
