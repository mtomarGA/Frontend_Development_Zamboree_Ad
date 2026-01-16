'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid2'
import CityListTable from '@views/apps/listing/masters/location/cities/cities'

// import services
import CityService from '@/services/location/city.service'

const citiesList = () => {
  const [cities, setCities] = useState([])

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await CityService.getCities()
        setCities(response?.data || [])
      } catch (error) {
        console.error('Error fetching city:', error)
      }
    }

    fetchCities()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CityListTable cityData={cities} />
      </Grid>
    </Grid>
  )
}

export default citiesList
