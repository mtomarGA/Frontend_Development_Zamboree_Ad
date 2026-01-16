'use client'

import { useState } from 'react'

// MUI
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import CustomTextField from '@/@core/components/mui/TextField'
import { useproductContext } from '@/contexts/productContext'
import { MenuItem } from '@mui/material'

const ShippingTab = ({ hasVariants = false }) => {
  const { handleFormChange, formData } = useproductContext()
  console.log(formData, "formDataformData");


  return (
    <Card>
      <CardHeader title="Shipping Configuration" />
      <CardContent>
        <Grid container spacing={6} className="mbe-6">
          {/* Price */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <CustomTextField
              fullWidth
              label="Shipping Price*"
              placeholder="Enter Price"
              value={formData.shipingPrice}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                handleFormChange('shipingPrice', value);
              }}
            />

          </Grid>

          {/* Return Policy */}
          <Grid size={{ xs: 12, md: 6 }}>
            <CustomTextField
              select
              fullWidth
              label="Return Policy"
              placeholder="Select Policy"
              value={formData?.returnPolicy ?? ''}
              onChange={(e) => {
                handleFormChange('returnPolicy', e.target.value)
                handleFormChange('returnType', '')
              }}
              slotProps={{
                select: {
                  displayEmpty: true,
                  renderValue: (selected) =>
                    selected ? selected : <em>Select Policy</em>,
                },
              }}
            >
              <MenuItem value="7 Days Return Policy">7 Days Return Policy</MenuItem>
              <MenuItem value="Not Returnable">Not Returnable</MenuItem>
            </CustomTextField>
          </Grid>

          {/* Conditional Dropdown - Return Reason */}
          {formData?.returnPolicy === '7 Days Return Policy' && (
            <Grid size={{ xs: 12, md: 6 }}>
              <CustomTextField
                select
                fullWidth
                label="Return Reason"
                placeholder="Select Return Reason"
                value={formData?.returnType ?? ''}
                onChange={(e) => {
                  handleFormChange('returnType', e.target.value)
                }}
                slotProps={{
                  select: {
                    displayEmpty: true,
                    renderValue: (selected) =>
                      selected ? selected : <em>Select Return Reason</em>,
                  },
                }}
              >
                <MenuItem value="All Reason Return">All Reason Return</MenuItem>
                <MenuItem value="Physically Defective OR Wrong Item OR Product Missing">
                  Physically Defective OR Wrong Item OR Product Missing
                </MenuItem>
              </CustomTextField>
            </Grid>
          )}

          {/* Conditional Dropdown - Return Sub Reason */}
          {(formData?.returnType === 'All Reason Return' ||
            formData?.returnType === 'Physically Defective OR Wrong Item OR Product Missing') && (
              <Grid size={{ xs: 12, md: 6 }}>
                <CustomTextField
                  select
                  fullWidth
                  label="Return OR Replacement "
                  placeholder="Select Sub Reason"
                  value={formData?.replacement ?? ''}
                  onChange={(e) => handleFormChange('replacement', e.target.value)}
                  slotProps={{
                    select: {
                      displayEmpty: true,
                      renderValue: (selected) =>
                        selected ? selected : <em>Select Sub Reason</em>,
                    },
                  }}
                >
                  {/* Example sub reasons — you can replace with your real options */}
                  <MenuItem value="Full Refund">Full Refund</MenuItem>
                  <MenuItem value="Product Replacement">Product Replacement</MenuItem>
                </CustomTextField>
              </Grid>
            )}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ShippingTab
