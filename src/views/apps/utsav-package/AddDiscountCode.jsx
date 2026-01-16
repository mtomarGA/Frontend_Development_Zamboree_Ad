'use client'

import React from 'react'
import { Card, CardHeader, CardContent, Button, MenuItem, Grid, Typography, Box } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from '@/@core/components/mui/TextField'
import discountCode from '@/services/utsav-packages/discountCode.service'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const AddDiscountCode = () => {
  const router = useRouter()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      couponCode: '',
      discount: '',
      voucherType: 'PERCENTAGE',
      date: '',
      status: 'ACTIVE'
    }

  })

  const onSubmit = async formData => {
    const payload = {
      couponCode: formData.couponCode,
      discount: Number(formData.discount),
      voucherType: formData.voucherType,
      date: formData.date,
      status: formData.status
    }

    try {
      await discountCode.createDiscount(payload)
      toast.success('Discount code created successfully')
      reset()
      router.push('/en/apps/utsav-package/discount-code')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error?.response?.data?.message || 'Failed to create discount code')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 4 }}>
        <CardHeader title={<Typography variant='h4'>Add Discount Code</Typography>} />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Controller
                name='couponCode'
                control={control}
                rules={{
                  required: 'Coupon code is required',
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: 'Only alphanumeric characters are allowed'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label='Name'
                    placeholder='Enter code (letters and numbers only)'
                    error={!!errors.couponCode}
                    helperText={errors.couponCode?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name='discount'
                control={control}
                rules={{
                  required: 'Discount is required',
                  pattern: {
                    value: /^\d+$/,
                    message: 'Only numeric value is allowed'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField 
                    {...field}
                    fullWidth
                    label='Discount'
                    placeholder='Enter discount (e.g., 40)'
                    type='number'
                    error={!!errors.discount}
                    helperText={errors.discount?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name='voucherType'
                control={control}
                rules={{ required: 'Voucher type is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label='Voucher Type'
                    error={!!errors.voucherType}
                    helperText={errors.voucherType?.message}
                  >
                    <MenuItem value='PERCENTAGE'>Percentage</MenuItem>
                    <MenuItem value='AMOUNT'>Fixed Amount</MenuItem>
                  </CustomTextField>
                )}
              />

            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name='date'
                control={control}
                rules={{
                  required: 'Expiry date is required',
                  validate: value => {
                    const today = new Date().toISOString().split('T')[0]
                    return value >= today || 'Date cannot be in the past'
                  }
                }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type='date'
                    label='Expire Date'
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().split('T')[0]
                    }}
                    error={!!errors.date}
                    helperText={errors.date?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name='status'
                control={control}
                render={({ field }) => (
                  <CustomTextField {...field} select fullWidth
                   label='status'>
                    <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                    <MenuItem value='INACTIVE'>INACTIVE</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type='submit' variant='contained'>
                  Create
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  )
}

export default AddDiscountCode
