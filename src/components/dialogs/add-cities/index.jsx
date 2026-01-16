'use client'

import { useState, useEffect, useRef } from 'react'
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

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import GoogleMapLocation from "../add-country/googleLocation"

// Import services
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import CityService from '@/services/location/city.service'
import Image from '@/services/imageService'


const initialData = {
  country: '',
  state: '',
  name: '',
  status: 'ACTIVE',
  image: '',
  latitude: '',
  longitude: ''
}

const statusOptions = ['ACTIVE', 'INACTIVE']

const AddCityInfo = ({ open, setOpen, data, onSuccess }) => {
  const [userData, setUserData] = useState(initialData)
  const [stateList, setStateList] = useState([])
  const [countryList, setCountryList] = useState([])
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [originalImage, setOriginalImage] = useState('')
  const [imageLoader, setimageLoader] = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (data && data._id) {
      setIsEditMode(true)
      setUserData({
        country: data.country?._id || data.country || '',
        state: data.state?._id || data.state || '',
        name: data.name || '',
        status: data.status || 'INACTIVE',
        image: data.image || '',
        latitude: data.latitude || '',
        longitude: data.longitude || ''
      })
      setOriginalImage(data.image || '')
      setFileName(data.image ? 'Current image' : '')
      // Load states for the selected country
      if (data.country?._id || data.country) {
        handleGetState(data.country?._id || data.country)
      }
    } else {
      setIsEditMode(false)
      setUserData(initialData)
      setFileName('')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = null
    }
  }, [data, open])

  const handleClose = () => {
    setOpen(false)
    setUserData(initialData)
    setFile(null)
    setFileName('')
    setIsEditMode(false)
    if (fileInputRef.current) fileInputRef.current.value = null
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

  const getCountry = async () => {
    const res = await countryService.getCountries()
    setCountryList(res.data)
  }

  const handleGetState = async id => {
    if (!id) return
    const res = await stateService.getStateById(id)
    setStateList(res.data)
  }

  useEffect(() => {
    getCountry()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    if (!userData.country || !userData.name || !userData.status || !userData.state) {
      toast.error('Please fill all required fields.')
      return
    }

    const payload = {
      country: userData.country,
      state: userData.state,
      name: userData.name,
      status: userData.status,
      image: userData.image || '',
      latitude: userData.latitude || '',
      longitude: userData.longitude || ''
    }

    try {
      let response
      if (isEditMode) {
        response = await CityService.updateCity(data._id, payload)
        toast.success('City updated successfully!')
      } else {
        response = await CityService.addCity(payload)
        toast.success('City added successfully!')
      }

      if (onSuccess) onSuccess()
      handleClose()
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} city.`)
      handleClose()
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
        closeAfterTransition={false}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleClose} disableRipple>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-6 sm:pbe-6 sm:pli-16'>
          {isEditMode ? 'Update City Information' : 'Add City Information'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='Country'
                  value={userData.country}
                  onChange={e => {
                    setUserData({ ...userData, country: e.target.value, state: '' })
                    handleGetState(e.target.value)
                  }}
                  disabled={isEditMode} // Disable country selection in edit mode
                >
                  <MenuItem value='' disabled>
                    Select Country
                  </MenuItem>
                  {countryList.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='State'
                  value={userData.state}
                  onChange={e => setUserData({ ...userData, state: e.target.value })}
                  disabled={isEditMode} // Disable state selection in edit mode
                >
                  <MenuItem value='' disabled>
                    Select State
                  </MenuItem>
                  {stateList.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  disabled
                  label='City Name'
                  placeholder='Enter City Name'
                  value={userData.name}
                  onChange={e => setUserData({ ...userData, name: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='Status'
                  value={userData.status}
                  onChange={e => setUserData({ ...userData, status: e.target.value })}
                >
                  {statusOptions.map((status, index) => (
                    <MenuItem key={index} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex items-end gap-4'>
                  <CustomTextField
                    label='City Image'
                    placeholder='No file chosen'
                    value={fileName}
                    className='flex-auto'
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: fileName ? (
                          <InputAdornment position='end'>
                            <IconButton size='small' edge='end' onClick={() => {
                              setFileName('')
                              setFile(null)
                              if (fileInputRef.current) fileInputRef.current.value = null
                            }}>
                              <i className='tabler-x' />
                            </IconButton>
                          </InputAdornment>
                        ) : null
                      }
                    }}
                  />
                  <Button component='label' variant='tonal'>
                    Choose
                    <input hidden type='file' onChange={handleFileUpload} ref={fileInputRef} />
                  </Button>
                </div>
                {isEditMode && originalImage && !file && (
                  <div className='mt-2 text-sm text-textSecondary'>
                    Current image will be retained if no new file is selected
                  </div>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogContent className='overflow-visible sm:pli-16'>
            <GoogleMapLocation userData={userData} setUserData={setUserData} />
          </DialogContent>
          <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
            {!imageLoader && (
              <Button variant='contained' type='submit'>
                Submit
              </Button>
            )}
            <Button variant='tonal' color='secondary' type='reset' onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default AddCityInfo
