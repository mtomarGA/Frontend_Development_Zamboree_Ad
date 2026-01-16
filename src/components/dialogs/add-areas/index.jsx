'use client'

// React Imports
import { useState, useRef, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Script from 'next/script'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import GoogleMapLocation from "../add-country/googleLocation"

// Services
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import cityService from '@/services/location/city.service'
import areaService from '@/services/location/area.services'

// Toast (assumed)
import { toast } from 'react-toastify'

const initialData = {
  country: '',
  state: '',
  city: '',
  name: '',
  status: 'ACTIVE',
  // image: '',
  latitude: '',
  longitude: ''
}

const statusOptions = ['ACTIVE', 'INACTIVE']

const AddAreaInfo = ({ open, setOpen, data, onSuccess }) => {
  const [userData, setUserData] = useState(initialData)
  const [countryList, setCountryList] = useState([])
  const [stateList, setStateList] = useState([])
  const [cityList, setCityList] = useState([])
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isNameDisabled, setIsNameDisabled] = useState(true)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  // const [originalImage, setOriginalImage] = useState('')
  // const [imageLoader, setimageLoader] = useState(false)

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (data && data._id) {
      setIsEditMode(true)
      setIsNameDisabled(true)
      setUserData({
        country: data.country?._id || data.country || '',
        state: data.state?._id || data.state || '',
        city: data.city?._id || data.city || '',
        name: data.name || '',
        status: data.status || 'INACTIVE',
        // image: data.image || '',
        latitude: data.latitude || '',
        longitude: data.longitude || ''
      })
      // setOriginalImage(data.image || '')
      // setFileName(data.image ? 'Current image' : '')
      // Load dependent data
      if (data.country?._id || data.country) {
        getStates(data.country?._id || data.country).then(() => {
          if (data.state?._id || data.state) {
            getCities(data.state?._id || data.state)
          }
        })
      }
    } else {
      setIsEditMode(false)
      setIsNameDisabled(true)
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

  // const handleFileUpload = async (e) => {
  //   try {
  //     // setimageLoader(true)

  //     const selectedFile = e.target.files?.[0]
  //     if (!selectedFile) {
  //       setFile(null)
  //       setFileName('')
  //       return
  //     }

  //     const formData = new FormData()
  //     formData.append('image', selectedFile)

  //     const imageUrls = await Image.uploadImage(formData)

  //     if (imageUrls?.data?.url) {
  //       setFileName(selectedFile.name)
  //       setFile(selectedFile)
  //       setUserData(prev => ({
  //         ...prev,
  //         image: imageUrls.data.url
  //       }))
  //     } else {
  //       throw new Error('Image URL not received')
  //     }
  //   } catch (error) {
  //     console.error('Error uploading image:', error)
  //     toast.error('Error uploading image')
  //     setFile(null)
  //     setFileName('')
  //   } finally {
  //     setimageLoader(false)
  //   }
  // }

  const getCountries = async () => {
    try {
      const res = await countryService.getCountries()
      setCountryList(res.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch countries')
    }
  }

  const getStates = async countryId => {
    if (!countryId) return
    try {
      const res = await stateService.getStateById(countryId)
      setStateList(res.data)
      return res.data
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch states')
    }
  }

  const getCities = async stateId => {
    if (!stateId) return
    try {
      const res = await cityService.getCityById(stateId)
      setCityList(res.data)
      return res.data
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch cities')
    }
  }

  useEffect(() => {
    getCountries()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    if (!userData.country || !userData.state || !userData.city || !userData.name || !userData.status) {
      toast.error('Please fill all required fields.')
      return
    }

    const payload = {
      country: userData.country,
      state: userData.state,
      city: userData.city,
      name: userData.name,
      status: userData.status,
      // image: userData.image || '',
      latitude: userData.latitude || '',
      longitude: userData.longitude || ''
    }

    try {
      if (isEditMode) {
        await areaService.updateArea(data._id, payload)
        toast.success('Area updated successfully!')
      } else {
        await areaService.addArea(payload)
        toast.success('Area added successfully!')
      }

      if (onSuccess) onSuccess()
      handleClose()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} area.`)
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
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogCloseButton onClick={handleClose}>
          <i className='tabler-x' />
        </DialogCloseButton>
        <DialogTitle variant='h4' className='flex flex-col gap-2 text-center sm:pbs-6 sm:pbe-6 sm:pli-16'>
          {isEditMode ? 'Update Area Information' : 'Add Area Information'}
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
                    const countryId = e.target.value
                    setUserData({ ...userData, country: countryId, state: '', city: '' })
                    getStates(countryId)
                    setCityList([])
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
                  onChange={e => {
                    const stateId = e.target.value
                    setUserData({ ...userData, state: stateId, city: '' })
                    getCities(stateId)
                  }}
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
                  select
                  fullWidth
                  label='City'
                  value={userData.city}
                  onChange={e => setUserData({ ...userData, city: e.target.value })}
                  disabled={isEditMode} // Disable city selection in edit mode
                >
                  <MenuItem value='' disabled>
                    Select City
                  </MenuItem>
                  {cityList.map(item => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.name}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label='Area Name'
                  disabled={isNameDisabled}
                  placeholder='Enter Area Name'
                  value={userData.name}
                  onChange={e => setUserData({ ...userData, name: e.target.value })}
                  slotProps={{
                    input: {
                      readOnly: isNameDisabled,
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            size='small'
                            edge='end'
                            onClick={() => setIsNameDisabled(prev => !prev)}
                            aria-label={isNameDisabled ? 'Enable editing' : 'Disable editing'}
                          >
                            <i className={isNameDisabled ? 'tabler-edit' : 'tabler-lock'} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }
                  }}
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
                  {statusOptions.map(option => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </Grid>
              {/* <Grid size={{ xs: 12, sm: 6 }}>
                <div className='flex items-end gap-4'>
                  <CustomTextField
                    label='Area Logo'
                    placeholder='No file chosen'
                    value={fileName}
                    className='flex-auto'
                    slotProps={{
                      input: {
                        readOnly: true,
                        endAdornment: fileName && (
                          <InputAdornment position='end'>
                            <IconButton
                              size='small'
                              edge='end'
                              onClick={() => {
                                setFileName('')
                                setFile(null)
                                if (fileInputRef.current) fileInputRef.current.value = null
                              }}
                            >
                              <i className='tabler-x' />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                  <Button component='label' variant='tonal' className='min-is-fit'>
                    Choose
                    <input hidden type='file' onChange={handleFileUpload} ref={fileInputRef} />
                  </Button>
                </div>
                {isEditMode && originalImage && !file && (
                  <div className='mt-2 text-sm text-textSecondary'>
                    Current image will be retained if no new file is selected
                  </div>
                )}
              </Grid> */}
            </Grid>
          </DialogContent>
          <DialogContent className='overflow-visible sm:pli-16'>
            <GoogleMapLocation userData={userData} setUserData={setUserData} />
          </DialogContent>

          <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
            {/* {!imageLoader && ( */}
            <Button variant='contained' type='submit'>
              Submit
            </Button>
            {/* )} */}
            <Button variant='tonal' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default AddAreaInfo
