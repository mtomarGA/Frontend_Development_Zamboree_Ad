'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import { Card, Button, Typography, CardHeader, CardContent, MenuItem, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useAddListingFormContext } from '@/hooks/useAddListingForm'

// Custom Components
import CustomTextField from '@core/components/mui/TextField'

const LocationInfo = ({ nextHandle }) => {
  const {
    locationFormData,
    locationErrors,
    handleLocationChange,
    validateLocation,
    countries,
    states,
    cities,
    areas,
    isStatesLoading,
    isCitiesLoading,
    isAreasLoading
  } = useAddListingFormContext()

  const handleSubmit = (e) => {
    e.preventDefault()
    const isVAlid = validateLocation()
    if (!isVAlid) return
    console.log('location:', locationFormData)
    // nextHandle()
  }

  return (
    <Card>
      <CardHeader title='Location Information' />
      <CardContent component="form" onSubmit={handleSubmit}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CustomTextField
              select
              label='Country'
              fullWidth
              name='country'
              value={locationFormData.country}
              onChange={handleLocationChange('country')}
              error={!!locationErrors.country}
              helperText={locationErrors.country}
            >
              <MenuItem value='' disabled>Select Country</MenuItem>
              {countries.map(country => (
                <MenuItem key={country._id} value={country._id}>
                  {country.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CustomTextField
              select
              label='State'
              fullWidth
              name='state'
              value={locationFormData.state}
              onChange={handleLocationChange('state')}
              error={!!locationErrors.state}
              helperText={locationErrors.state}
              disabled={!locationFormData.country || isStatesLoading}
            >
              <MenuItem value='' disabled>
                {isStatesLoading ? <CircularProgress size={20} /> : 'Select State'}
              </MenuItem>
              {states.map(state => (
                <MenuItem key={state._id} value={state._id}>
                  {state.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CustomTextField
              select
              label='City'
              fullWidth
              name='city'
              value={locationFormData.city}
              onChange={handleLocationChange('city')}
              error={!!locationErrors.city}
              helperText={locationErrors.city}
              disabled={!locationFormData.state || isCitiesLoading}
            >
              <MenuItem value='' disabled>
                {isCitiesLoading ? <CircularProgress size={20} /> : 'Select City'}
              </MenuItem>
              {cities.map(city => (
                <MenuItem key={city._id} value={city._id}>
                  {city.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CustomTextField
              select
              label='Area'
              fullWidth
              name='area'
              value={locationFormData.area}
              onChange={handleLocationChange('area')}
              error={!!locationErrors.area}
              helperText={locationErrors.area}
              disabled={!locationFormData.city || isAreasLoading}
            >
              <MenuItem value='' disabled>
                {isAreasLoading ? <CircularProgress size={20} /> : 'Select Area'}
              </MenuItem>
              {areas.map(area => (
                <MenuItem key={area._id} value={area._id}>
                  {area.name}
                </MenuItem>
              ))}
            </CustomTextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CustomTextField
              label='Pincode'
              fullWidth
              name='pincode'
              value={locationFormData.pincode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 6) {
                  handleLocationChange('pincode')({ target: { value } });
                }
              }}
              error={!!locationErrors.pincode}
              helperText={locationErrors.pincode}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CustomTextField
              label='Address'
              fullWidth
              multiline
              rows={4}
              name='address'
              value={locationFormData.address}
              onChange={handleLocationChange('address')}
              error={!!locationErrors.address}
              helperText={locationErrors.address}
            />
          </Grid>
          <Grid item xs={12}>
            <div className='flex items-center gap-4'>
              {/* <Button variant='contained' color='primary' onClick={handleSubmit}> */}
              <Button variant='contained' color='primary' onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default LocationInfo
