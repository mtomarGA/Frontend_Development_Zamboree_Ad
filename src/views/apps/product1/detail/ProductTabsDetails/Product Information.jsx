'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'
import { useproductContext } from '@/contexts/productContext'


const OverviewTab = () => {


  const { handleFormChange, formData } = useproductContext()
  const isVariant = Boolean(formData.hasVariants)
  const [attributeList] = useState([
    {
      _id: 'color',
      name: 'Color',
      mandatory: true,
      values: [{ text: 'Red' }, { text: 'Blue' }, { text: 'Green' }]
    },
    {
      _id: 'size',
      name: 'Size',
      mandatory: false,
      values: [{ text: 'S' }, { text: 'M' }, { text: 'L' }]
    }
  ])

  const [selectedAttributes, setSelectedAttributes] = useState({})

  const handleAttributeChange = (attributeId, value) => {
    setSelectedAttributes(prev => ({ ...prev, [attributeId]: value }))
  }

  // useEffect(() => {
  //   nonVariantDetails(formData)
  // }, [formData.price, formData.happeningPrice, formData.sku, formData.quantity])



  return (
    <>
      {!isVariant && (
        <Card>
          <CardHeader title="Product Information" />
          <CardContent>
            <Grid container spacing={6} className="mbe-6">
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label="Original MRP*"
                  placeholder="Enter MRP"
                  value={formData.price}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // only digits
                    handleFormChange("price", value);

                    // Adjust happeningPrice if it exceeds the new price
                    if (formData.happeningPrice && parseInt(formData.happeningPrice) > parseInt(value)) {
                      handleFormChange("happeningPrice", value); // cap it to original price
                    }
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label="Zamboree Price (inclusive  GST)"
                  placeholder="Enter Selling Price"
                  value={formData.happeningPrice}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');

                    // Allow happeningPrice to be <= price
                    if (formData.price && parseInt(value) > parseInt(formData.price)) {
                      // optionally show alert or just block
                      return;
                    }
                    handleFormChange("happeningPrice", value);
                  }}
                />
              </Grid>


              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label="SKU*"
                  placeholder="Enter SKU"
                  value={formData.sku}
                  onChange={e =>
                    handleFormChange("sku", e.target.value)
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <CustomTextField
                  fullWidth
                  label="Available Stock*"
                  placeholder="Enter Stock"
                  value={formData.quantity}

                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '');
                    handleFormChange("quantity", value);
                  }}
                />
              </Grid>


            </Grid>
          </CardContent>
        </Card>
      )}

      {/* {attributeList.length > 0 && (
       
      )} */}
    </>
  )
}

export default OverviewTab
