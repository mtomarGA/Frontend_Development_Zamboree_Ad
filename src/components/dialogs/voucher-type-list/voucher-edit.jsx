'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Box,
  Grid
} from '@mui/material'
import CustomTextField from '@core/components/mui/TextField'
import { toast } from 'react-toastify'
import voucherTypeService from '@/services/utsav-packages/voucherTypeService'

const VoucherEdit = ({ voucherTypeData, onClose, fetchVoucherTypes }) => {
  const [voucherType, setVoucherType] = useState('')

  useEffect(() => {
    if (voucherTypeData) {
      setVoucherType(voucherTypeData.voucherType || '')
    }
  }, [voucherTypeData])

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const updatedData = { voucherType }

      const result = await voucherTypeService.updateVoucher(voucherTypeData._id, updatedData)

      if (result.data?.message?.length) {
        result.data.message.forEach(msg => toast.error(msg))
      } else {
        toast.success('Voucher type updated successfully')
        fetchVoucherTypes()
        onClose()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed')
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label='Voucher Type'
                value={voucherType}
                onChange={e => setVoucherType(e.target.value)}
                placeholder='Enter voucher type'
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                
                <Button type='submit' variant='contained' color='primary' sx={{ color: 'white' }}>
                  Update
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default VoucherEdit
