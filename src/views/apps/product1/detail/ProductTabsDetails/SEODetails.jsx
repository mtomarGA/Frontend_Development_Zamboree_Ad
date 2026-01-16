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


const SEODetails = () => {
  const { handleFormChange, formData } = useproductContext()
  console.log(formData, "formData in seo");



  const [selectedAttributes, setSelectedAttributes] = useState({})

  const handleAttributeChange = (id, value) => {
    setSelectedAttributes(prev => ({ ...prev, [id]: value }))
  }

  return (
    <>

      <Card>
        <CardHeader title='SEO Details' />
        <CardContent>
          <Grid container spacing={6} className='mbe-6'>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Meta Title *'
                placeholder='Enter Meta Title'
                value={formData.metaTitle}
                onChange={e =>
                  handleFormChange('metaTitle', e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Meta Description *'
                placeholder='Enter Description'
                value={formData.metadescription}
                onChange={e =>
                  handleFormChange('metadescription', e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Slug *'
                placeholder='Enter Slug'
                value={formData.slug}
                onChange={e =>
                  handleFormChange('slug', e.target.value)
                }
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>



    </>
  )
}

export default SEODetails
