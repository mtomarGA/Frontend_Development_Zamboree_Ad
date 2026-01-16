'use client'

import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid2'

// Component Imports
import AreaListTable from '@views/apps/listing/masters/location/areas/areas'
import areaService from '@/services/location/area.services'

const areasList = () => {
  const [areas, setAreas] = useState([])

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await areaService.getAreas()
        setAreas(response?.data || [])
      } catch (error) {
        console.log(error, 'error')
      }
    }

    fetchAreas()
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <AreaListTable areaData={areas} />
      </Grid>
    </Grid>
  )
}

export default areasList
