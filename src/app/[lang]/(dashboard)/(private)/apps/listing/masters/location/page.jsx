'use client'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import CountryListTable from '@views/apps/listing/masters/location/CountryListTable'

// Service Import
import countryService from '@/services/location/country.services'

const CountryList = () => {
  const [countries, setCountries] = useState([])

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await countryService.getCountries()
        console.log(response, '🎯 country data')
        setCountries(response?.data || [])
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }

    fetchCountries()
  }, [])

  return (
    <Grid container spacing={6}>
      {/* <Grid size={{ xs: 12 }}>
        <ProductCard />
      </Grid> */}
      <Grid size={{ xs: 12 }}>
        <CountryListTable />
      </Grid>
    </Grid>
  )
}

export default CountryList
