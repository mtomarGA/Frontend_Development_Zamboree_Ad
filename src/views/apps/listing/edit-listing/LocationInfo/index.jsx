'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import { Card, Button, Typography, CardHeader, CardContent, MenuItem, CircularProgress } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useUpdateListingFormContext } from '@/hooks/updateListingForm'

// Custom Components
import CustomTextField from '@core/components/mui/TextField'

const LocationInfo = () => {

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
    isAreasLoading,
    getStates,
    getCities,
    getAreas
  } = useUpdateListingFormContext()
  console.log(locationFormData, states, cities, areas, "locationFormData locationFormData");

  const [warning, setWarning] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  // Add this to your LocationInfo component
  useEffect(() => {
    if (initialLoad && locationFormData.country) {
      const loadDependentData = async () => {
        try {
          // Load states if country is selected
          if (locationFormData.country) {
            await getStates(locationFormData.country)
          }

          // Load cities if state is selected
          if (locationFormData.state) {
            await getCities(locationFormData.state)
          }

          // Load areas if city is selected
          if (locationFormData.city) {
            await getAreas(locationFormData.city)
          }
        } catch (error) {
          console.error('Error loading location data:', error)
        } finally {
          setInitialLoad(false)
        }
      }

      loadDependentData()
    }
  }, [initialLoad, locationFormData.country, locationFormData.state, locationFormData.city])


  const handleSaveAndNext = () => {
    // Check if required fields are filled
    if (!formData.address || !formData.state || !formData.city || !formData.area || !formData.pincode) {
      setWarning(true)
    } else {
      setWarning(false)
      // Save logic here (API call or local storage etc.)
      console.log('Saved data:', formData)
    }
  }

  return (
    <Card>
      <CardHeader title='Location Information' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <CustomTextField
              select
              label='Country'
              fullWidth
              name='country'
              value={locationFormData.country}
              onChange={e => {
                handleLocationChange('country')(e)
                handleLocationChange('state')({ target: { value: '' } })
                handleLocationChange('city')({ target: { value: '' } })
                handleLocationChange('area')({ target: { value: '' } })
              }}
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
              onChange={e => {
                handleLocationChange('state')(e)
                handleLocationChange('city')({ target: { value: '' } })
                handleLocationChange('area')({ target: { value: '' } })
              }}
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
              value={locationFormData.address}
              onChange={handleLocationChange('address')}
              error={!!locationErrors.address}
              helperText={locationErrors.address}
            />
          </Grid>
          <Grid item xs={12}>
            <div className='flex items-center gap-4'>
              <Button variant='contained' color='primary' onClick={handleSaveAndNext}>
                Update
              </Button>
              {warning && (
                <Typography color='error'>When Click on Next Button without save, then show warning message</Typography>
              )}
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default LocationInfo
