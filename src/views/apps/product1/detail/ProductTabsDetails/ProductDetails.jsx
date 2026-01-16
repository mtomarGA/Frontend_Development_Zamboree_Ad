'use client'

import { useEffect, useState } from 'react'

// MUI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { Autocomplete, MenuItem } from '@mui/material'


// Custom
import CustomTextField from '@/@core/components/mui/TextField'
import { useproductContext } from '@/contexts/productContext'
import GST from "@/services/premium-listing/gst.service"
import HSNCODE from "@/services/product/product-hsn-service"
import { Grid } from '@mui/system'

const ProductDetailsTab = () => {
  const { handleFormChange, formData } = useproductContext()

  const [gst, setGst] = useState([])
  const [hsn, setHSN] = useState([])
  const [hsnSearch, setHSNSearch] = useState('')
  const [hsnSelected, setHSNSelected] = useState(false)

  // Fetch GST details
  const getGSTDetails = async () => {
    try {
      const response = await GST.getAllACTIVEGST()
      setGst(response.data || [])
    } catch (err) {
      console.error("Error fetching GST:", err)
    }
  }

  // Fetch HSN codes based on search
  const getHSNCodeDetails = async (search) => {
    try {
      const response = await HSNCODE.searchHSNCode(search)
      setHSN(response.data || [])
    } catch (err) {
      console.error("Error fetching HSN:", err)
    }
  }

  // Initial fetch
  useEffect(() => {
    getGSTDetails()
    getHSNCodeDetails('') // initial fetch, top 5
  }, [])

  // Search HSN with debounce, only if nothing is selected
  useEffect(() => {
    if (hsnSelected) return

    const delayDebounce = setTimeout(() => {
      getHSNCodeDetails(hsnSearch)
    }, 300) // 300ms debounce

    return () => clearTimeout(delayDebounce)
  }, [hsnSearch, hsnSelected])

  return (
    <>
      {/* Product Details */}
      <Card>
        <CardHeader title='Tax Details' />
        <Grid container spacing={6} className='mbe-6 px-4'>
          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              options={hsn}
              getOptionLabel={(option) => option.hsnCode || ''}
              value={hsn.find(item => item._id === formData.hsnCode) || null}
              onChange={(event, newValue) => {
                handleFormChange('hsnCode', newValue?._id || '')
                setHSNSelected(!!newValue)
              }}
              onInputChange={(event, newInputValue) => {
                if (!hsnSelected) {
                  setHSNSearch(newInputValue)
                }
                // reset selection if input cleared
                if (newInputValue === '') {
                  setHSNSelected(false)
                  setHSNSearch('')
                }
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Product HSN Code"
                  placeholder="Search HSN Code"
                />
              )}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              noOptionsText="No HSN found"
              clearOnEscape
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label="Applicable GST"
              value={formData.gst}
              onChange={e => handleFormChange('gst', e.target.value)}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: selected => {
                    if (!selected) return <span style={{ color: '#888' }}>GST not selected</span>
                    const selectedItem = gst.find(item => item._id === selected)
                    return selectedItem ? selectedItem.message : ''
                  }
                }
              }}
            >
              <MenuItem value="" disabled>Select GST</MenuItem>
              {gst.map(item => (
                <MenuItem key={item._id} value={item._id}>{item.message}</MenuItem>
              ))}
            </CustomTextField>
          </Grid>
        </Grid>
      </Card>

      {/* Packaging Details */}
      {/* <Card className='mt-6'>
        <CardHeader title='Packaging Details' />
        <CardContent>
          <Grid container spacing={6} className='mbe-6'>
            {['packageWeight', 'length', 'height', 'width'].map((field) => (
              <Grid size={{ xs: 12, sm: 6 }} key={field}>
                <CustomTextField
                  fullWidth
                  label={`Package ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}*`}
                  placeholder={`e.g. ${field === 'packageWeight' ? '500 g' : '10 cm'}`}
                  value={formData[field]}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '')
                    handleFormChange(field, value)
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card> */}
    </>
  )
}

export default ProductDetailsTab
