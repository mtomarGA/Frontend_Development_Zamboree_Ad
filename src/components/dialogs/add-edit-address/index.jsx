'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import { Grid } from '@mui/system'

// Custom Imports
import classnames from 'classnames'
import CustomInputVertical from '@core/components/custom-inputs/Vertical'
import DialogCloseButton from '../DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import GoogleAddressMapLocation from './GoogleSearch'
import AddAddress from '@/services/customers/createService'
import { toast } from 'react-toastify'

// Initial State
const initialAddressData = {
  firstName: '',
  country: '',
  addressLine1: '',
  landmark: '',
  city: '',
  flat: '',
  mobile: '',
  state: '',
  zipCode: '',
  latitude: '',
  longitude: '',
  isDefault: false,
  type: '',
  id: '',
}

// Address type options
const customInputData = [
  {
    title: 'Home',
    content: 'Delivery Time (7am - 9pm)',
    value: 'home',
    isSelected: true,
    asset: 'tabler-home'
  },
  {
    title: 'Office',
    content: 'Delivery Time (10am - 6pm)',
    value: 'office',
    isSelected: false,
    asset: 'tabler-building-skyscraper'
  }
]

const AddEditAddress = ({
  open,
  setOpen,
  data,
  userId,
  area,
  typeOfAddress,
  isDefaultAddress,
  name,
  addressLine1,
  city,
  id,
  flat,
  mobile,
  state,
  zipCode,
  latitude,
  longitude,
  fetchAddress,
  country
}) => {
  const initialSelected = customInputData.find(item => item.isSelected)?.value || ''
  const [selected, setSelected] = useState(initialSelected)
  const [addressData, setAddressData] = useState(initialAddressData)


  useEffect(() => {
    setAddressData({
      firstName: name || '',
      country: country || '',
      addressLine1: addressLine1 || '',
      city: city || '',
      landmark: area || '',
      isDefault: isDefaultAddress || false,
      flat: flat || '',
      mobile: mobile || '',
      state: state || '',
      latitude: latitude || '',
      zipCode: zipCode || '',
      longitude: longitude || '',
      type: typeOfAddress || initialSelected,
      id: id || '',
    })
    setSelected(typeOfAddress || initialSelected)
  }, [area, typeOfAddress, isDefaultAddress, name, addressLine1, city, id, flat, mobile, state, zipCode, latitude, longitude, country, open])

  const handleChangeType = value => {
    setSelected(typeof value === 'string' ? value : value.target.value)
    setAddressData(prev => ({ ...prev, type: typeof value === 'string' ? value : value.target.value }))
  }

  const handleToggleDefault = event => {
    setAddressData(prev => ({ ...prev, isDefault: event.target.checked }))
  }

  const handleAddress = async () => {
    const uid = userId?.selectedUser || userId

    const payload = {
      type: selected,
      deliveryTime: selected === 'home' ? '7am - 9pm' : '10am - 6pm',
      firstName: addressData.firstName || '',
      country: addressData.country || '',
      addressLine1: addressData.addressLine1 || '',
      landmark: addressData.landmark || '',
      city: addressData.city || '',
      flat: addressData.flat || '',
      mobile: addressData.mobile || '',
      state: addressData.state || '',
      zipCode: addressData.zipCode || '',
      latitude: addressData.latitude || '',
      longitude: addressData.longitude || '',
      isDefault: addressData.isDefault
    }

    if(name){
      payload.addAddressId=id
    }

    if (name) {
      const userIds=userId?.selectedUser
      const result=await AddAddress.editAddress(userIds,payload)
      toast.success(result.message)
      setOpen(false)
    } else {
      const result = await AddAddress.addAddress(uid, payload)
      toast.success(result.message)
      setOpen(false)
    }

    fetchAddress()
  }





  return (
    <Dialog
      open={open}
      maxWidth='md'
      scroll='body'
      onClose={() => {
        setOpen(false)
        setSelected(initialSelected)
      }}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogTitle variant='h4' className='flex flex-col text-center'>
        {data ? 'Edit Address' : 'Add New Address'}
        <Typography component='span'>
          {data ? 'Edit Address for future billing' : 'Add address for billing address'}
        </Typography>
      </DialogTitle>

      <form onSubmit={e => e.preventDefault()}>
        <DialogContent>
          <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
            <i className='tabler-x' />
          </DialogCloseButton>

          <Grid container spacing={6}>
            {customInputData.map((item, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={index}>
                <CustomInputVertical
                  type='radio'
                  data={{ ...item, asset: <i className={classnames(item.asset, 'text-[28px]')} /> }}
                  selected={selected}
                  name='addressType'
                  handleChange={handleChangeType}
                />
              </Grid>
            ))}

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                label='Name'
                name='firstName'
                placeholder='John'
                value={addressData.firstName}
                onChange={e => setAddressData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                label='Mobile No'
                name='mobile'
                placeholder='Enter Number'
                value={addressData.mobile}
                onChange={e => setAddressData(prev => ({ ...prev, mobile: e.target.value }))}
              />
            </Grid>

            {/* Google Maps Location Search */}
            <Grid size={{ xs: 12, md: 12 }}>
              <GoogleAddressMapLocation
                setFormData={setAddressData}
                addressLine1={addressLine1}
                googleMapData={{
                  latitude: addressData.latitude || 28.6139,
                  longitude: addressData.longitude || 77.2090
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                label='Flat No/House No/Building Name'
                name='flat'
                placeholder='Nr. Hard Rock Cafe'
                value={addressData.flat}
                onChange={e => setAddressData(prev => ({ ...prev, flat: e.target.value }))}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                fullWidth
                label='Landmark'
                name='landmark'
                placeholder='Near Central Park'
                value={addressData.landmark}
                onChange={e => setAddressData(prev => ({ ...prev, landmark: e.target.value }))}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'none' }}>
              <CustomTextField
                fullWidth
                label='City'
                name='city'
                placeholder='Los Angeles'
                value={addressData.city}
                onChange={e => setAddressData(prev => ({ ...prev, city: e.target.value }))}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'none' }}>
              <CustomTextField
                fullWidth
                label='State'
                name='state'
                placeholder='California'
                value={addressData.state}
                onChange={e => setAddressData(prev => ({ ...prev, state: e.target.value }))}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'none' }}>
              <CustomTextField
                fullWidth
                label='Pin Code'
                name='zipCode'
                placeholder='99950'
                value={addressData.zipCode}
                onChange={e => setAddressData(prev => ({ ...prev, zipCode: e.target.value }))}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={addressData.isDefault}
                    onChange={handleToggleDefault}
                  />
                }
                label='Make this default Delivery address'
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions className='justify-center'>
          <Button variant='contained' onClick={handleAddress}>
            {name ? 'Update' : 'Submit'}
          </Button>
          <Button
            variant='tonal'
            color='secondary'
            onClick={() => {
              setOpen(false)
              setSelected(initialSelected)
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default AddEditAddress
