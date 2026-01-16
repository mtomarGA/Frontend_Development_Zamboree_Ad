'use client'

import { useState, useEffect, useRef } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { toast } from 'react-toastify'
import Script from 'next/script'

// IMPORT APIS
import countryService from '@/services/location/country.services'
import Image from '@/services/imageService'
import GoogleMapLocation from "./googleLocation"

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

const initialData = {
  countryCode: '',
  name: '',
  status: 'ACTIVE',
  image: '',
  latitude: '',
  longitude: ''
}

const statusOptions = ['ACTIVE', 'INACTIVE']

const AddCountryInfo = ({ open, setOpen, data, onSuccess }) => {
  const [userData, setUserData] = useState(data || initialData)
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [imageLoader, setimageLoader] = useState(false)

  useEffect(() => {
    if (data) {
      setUserData({
        countryCode: data.countryCode || '',
        name: data.name || '',
        image: data.image || '',
        status: data.status || 'INACTIVE',
        latitude: data.latitude || '',
        longitude: data.longitude || ''
      })
    } else {
      setUserData(initialData)
    }
  }, [data, open])

  const handleClose = () => {
    setOpen(false)
    setUserData(initialData)
    setFileName('')
    setFile(null)
  }

  const handleFileUpload = async (e) => {
    try {
      setimageLoader(true)
      const selectedFile = e.target.files?.[0]
      if (!selectedFile) {
        setFile(null)
        setFileName('')
        return
      }

      const formData = new FormData()
      formData.append('image', selectedFile)

      const imageUrls = await Image.uploadImage(formData , {folder:"Listing/Master"})

      if (imageUrls?.data?.url) {
        setFileName(selectedFile.name)
        setFile(selectedFile)
        setUserData(prev => ({
          ...prev,
          image: imageUrls.data.url
        }))
      } else {
        throw new Error('Image URL not received')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Error uploading image')
      setFile(null)
      setFileName('')
    } finally {
      setimageLoader(false)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setFileName('')
    if (fileInputRef.current) fileInputRef.current.value = null
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!userData.countryCode || !userData.name || !userData.status) {
      toast.error('Please fill all required fields.')
      return
    }

    const payload = {
      name: userData.name,
      countryCode: userData.countryCode,
      status: userData.status,
      image: userData.image || '',
      latitude: userData.latitude || '',
      longitude: userData.longitude || ''
    }

    try {
      let res
      if (data?._id) {
        res = await countryService.updateCountry(data._id, payload)
      } else {
        res = await countryService.addCountry(payload)
      }

      if (res) {
        toast.success(`Country ${data ? 'updated' : 'created'} successfully.`)
        onSuccess?.()
        handleClose()
      }
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to add country.')
    }
  }

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy='afterInteractive'
        onLoad={() => setIsMapLoaded(true)}
      />
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        maxWidth='md'
        scroll='body'
        sx={{
          '& .MuiDialog-paper': {
            overflow: 'visible',
            '& .pac-container': {
              zIndex: 1300
            }
          }
        }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='text-center'>
          Add Country Information
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label='Country Code*'
                  placeholder='Enter Country Code'
                  value={userData.countryCode}
                  onChange={e => setUserData({ ...userData, countryCode: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label='Country Name *'
                  placeholder='Enter Country Name'
                  value={userData.name}
                  disabled
                  onChange={e => setUserData({ ...userData, name: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='Status*'
                  value={userData.status}
                  onChange={e => setUserData({ ...userData, status: e.target.value })}
                >
                  <MenuItem value='' disabled>
                    Select Status
                  </MenuItem>
                  {statusOptions.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex items-end gap-4'>
                  <CustomTextField
                    label='Country Image*'
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
                  />
                  <Button component='label' variant='tonal'>
                    Choose
                    <input hidden type='file' onChange={handleFileUpload} ref={fileInputRef} />
                  </Button>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogContent className='overflow-visible sm:pli-16'>
            <GoogleMapLocation userData={userData} setUserData={setUserData} />
          </DialogContent>

          {/* <DialogContent>
            <Grid container spacing={4}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  inputRef={inputRef}
                  label='Search Location'
                  placeholder='Enter a place name or address'
                  fullWidth
                  sx={{
                    '& .pac-container': {
                      zIndex: 1300
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <div
                  ref={mapRef}
                  style={{
                    height: open ? '150px' : '0',
                    width: '100%',
                    borderRadius: 8,
                    border: '1px solid #ccc',
                    visibility: open ? 'visible' : 'hidden'
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label='Latitude'
                  value={userData.latitude || ''}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label='Longitude'
                  value={userData.longitude || ''}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Button
                  variant='outlined'
                  onClick={handleUseCurrentLocation}
                  disabled={!isMapLoaded}
                >
                  Use Current Location
                </Button>
              </Grid>
            </Grid>
          </DialogContent> */}

          <DialogActions className='justify-center'>
            <Button variant='contained' type='submit' disabled={imageLoader} >
              Submit
            </Button>
            <Button variant='tonal' color='secondary' onClick={handleClose} disabled={imageLoader}>
              Cancel
            </Button>
          </DialogActions>

        </form>
      </Dialog>
    </>
  )
}

export default AddCountryInfo
