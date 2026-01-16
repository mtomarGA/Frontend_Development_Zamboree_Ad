'use client'

import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import StateListTable from '@views/apps/listing/masters/location/states/states'

// Service import
import stateService from '@/services/location/state.services'

const statesList = () => {
  const [states, setStates] = useState([])

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await stateService.getStates()
        console.log(response, '🎯 state data')
        setStates(response?.data || [])
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }

    fetchStates()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <StateListTable productData={states} />
      </Grid>
    </Grid>
  )
}

export default statesList
