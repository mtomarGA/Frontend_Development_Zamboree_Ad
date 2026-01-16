'use client'

import { useState } from 'react'

// MUI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import CustomTextField from '@/@core/components/mui/TextField'
import { useproductContext } from '@/contexts/productContext'

const ManufacturingDetails = ({ hasVariants = false, }) => {
  const { handleFormChange, formData } = useproductContext()

  return (
    <>

      <Card>
        <CardHeader title='Manufacturing Details' />
        <CardContent>
          <Grid container spacing={6} className='mbe-6'>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Country of Origin *'
                placeholder='Enter Country'
                value={formData.countryOfOrigin}
                onChange={e =>
                  handleFormChange('countryOfOrigin', e.target.value)
                }
              />

            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Manufacturer Details *'
                placeholder='Enter Manufacturer'
                value={formData.manufacturerDetails}
                onChange={e =>
                  handleFormChange('manufacturerDetails', e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Packer Details *'
                placeholder='Enter Packer'
                value={formData.packerDetails}
                onChange={e =>
                  handleFormChange("packerDetails", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>



    </>
  )
}

export default ManufacturingDetails
