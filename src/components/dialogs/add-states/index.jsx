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
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { toast } from 'react-toastify'
import Script from 'next/script'

// Component Imports
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'

// import services
import countryService from '@/services/location/country.services'
import stateService from '@/services/location/state.services'
import Image from '@/services/imageService'
import GoogleMapLocation from "../add-country/googleLocation"

const initialData = { name: '', country: '', status: 'ACTIVE', image: '', latitude: '', longitude: '' }

const statusOptions = ['ACTIVE', 'INACTIVE']

const AddStatesInfo = ({ open, setOpen, data, onSuccess }) => {
  const [userData, setUserData] = useState(initialData)
  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)
  const [countryList, setCountryList] = useState([])
  const [imageLoader, setimageLoader] = useState(false)

  useEffect(() => {
    if (!open) return;

    if (data?._id) {
      const newUserData = {
        name: data.name || '',
        country: data.country?._id || data.country || '',
        image: data.image || '',
        status: data.status || 'INACTIVE',
        latitude: data.latitude || '',
        longitude: data.longitude || ''
      }
      setUserData(newUserData)
      setFileName(data.image ? (typeof data.image === 'string' ? 'Existing file' : data.image.name) : '')
    } else {
      setUserData(initialData)
      setFileName('')
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = null
    }
  }, [open, data])

  const handleClose = () => {
    setOpen(false)
    setUserData(initialData)
    setFile(null)
    setFileName('')
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

      const imageUrls = await Image.uploadImage(formData)
      console.log(imageUrls, "imageUrls imageUrls");

      if (imageUrls?.data?.url) {
        setFileName(selectedFile.name)
        setFile(imageUrls?.data?.url)
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
    setUserData(prev => ({ ...prev, image: '' }))
    if (fileInputRef.current) fileInputRef.current.value = null
  }

  useEffect(() => {
    const getCountry = async () => {
      try {
        const res = await countryService.getCountries()
        setCountryList(res.data)
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }

    getCountry()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    const payload = {
      name: userData.name,
      country: userData.country,
      status: userData.status,
      image: userData.image || '',
      latitude: userData.latitude,
      longitude: userData.longitude
    }

    try {
      const res = data?._id
        ? await stateService.updateState(data._id, payload)
        : await stateService.addState(payload)

      if (res) {
        toast.success(`State ${data?._id ? 'updated' : 'created'} successfully.`)
        onSuccess?.()
        handleClose()
      } else {
        throw new Error('Unexpected response')
      }
    } catch (err) {
      // console.error('Error:', err)
      toast.error(err?.response?.data?.message || "something went wrong")
    }
  }


  return (
    <><Script
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
          {data?._id ? 'Update' : 'Add'} States Information
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='Country'
                  value={userData.country || ''}
                  onChange={e => setUserData({ ...userData, country: e.target.value })}
                  required
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
                  fullWidth
                  disabled
                  label='State Name'
                  placeholder='Enter State Name'
                  value={userData.name || ''}
                  onChange={e => setUserData({ ...userData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  select
                  fullWidth
                  label='Status'
                  value={userData.status || 'INACTIVE'}
                  onChange={e => setUserData({ ...userData, status: e.target.value })}
                  required
                >
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
                    label='State Image'
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
                    <input
                      hidden
                      type='file'
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                      accept='image/*'
                    />
                  </Button>
                </div>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogContent className='overflow-visible sm:pli-16'>
            <GoogleMapLocation userData={userData} setUserData={setUserData} />
          </DialogContent>
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

export default AddStatesInfo
