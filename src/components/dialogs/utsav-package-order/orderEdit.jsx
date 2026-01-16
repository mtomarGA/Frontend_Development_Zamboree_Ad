'use client'

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  Button,
  Box,
  Typography,
  MenuItem,
  Chip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import CustomTextField from '@/@core/components/mui/TextField';
import createUtsavService from '@/services/utsav-packages/createOrder.Service';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthContext';

const productStatusOptions = [
  { value: 'PENDING', label: 'PENDING' },
  { value: 'COMPLETED', label: 'COMPLETED' },

];

const OrdersEdit = ({ orderData, onClose, fetchOrders }) => {
  const router = useRouter();
  const { hasPermission } = useAuth();
  const [formData, setFormData] = useState({
    orderId: '',
    userId: '',
    choosePackage: '',
    paymentGateway: '',
    transactionId: '',
    paymentDate: '',
    paymentStatus: 'PENDING',
    createdBy: ''
  })

  useEffect(() => {
    if (orderData) {
      setFormData({
        orderId: orderData.orderId || '',
        userId: orderData.userId?.userId || '',
        choosePackage:
          Array.isArray(orderData.choosePackage)
            ? orderData.choosePackage[0]?.title || ''
            : orderData.choosePackage?.title || '',
        paymentGateway: orderData.paymentGateway || '',
        transactionId: orderData.transactionId || '',
        paymentDate: orderData.paymentDate ? new Date(orderData.paymentDate).toISOString().substr(0, 10) : '',
        paymentStatus: orderData.paymentStatus || 'PENDING',
        createdBy: orderData.createdBy ? `${orderData.createdBy.firstName} ${orderData.createdBy.lastName}` : ''
      })
    }
  }, [orderData])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const updatedOrder = {
        ...formData,
        paymentDate: formData.paymentDate ? new Date(formData.paymentDate) : null
      }
      const res = await createUtsavService.updateOrder(orderData._id, updatedOrder)
      if (res?.success) {
        toast.success('Order updated successfully')
        fetchOrders()
        onClose()
      } else {
        toast.error(res?.message || 'Update failed')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update order')
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Order ID'
                value={formData.orderId}
                onChange={e => handleInputChange('orderId', e.target.value)}
                placeholder='Order ID'
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='User ID'
                value={formData.userId}
                onChange={e => handleInputChange('userId', e.target.value)}
                placeholder='User ID'
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Package Name'
                value={formData.choosePackage}
                onChange={e => handleInputChange('choosePackage', e.target.value)}
                placeholder='Package Name'
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Payment Gateway'
                value={formData.paymentGateway}
                onChange={e => handleInputChange('paymentGateway', e.target.value)}
                placeholder='Payment Gateway'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Transaction ID'
                value={formData.transactionId}
                onChange={e => handleInputChange('transactionId', e.target.value)}
                placeholder='Transaction ID'
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Payment Date'
                type='date'
                value={formData.paymentDate}
                onChange={e => handleInputChange('paymentDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CustomTextField
                select
                fullWidth
                label='Payment Status'
                value={formData.paymentStatus}
                onChange={e => handleInputChange('paymentStatus', e.target.value)}
                disabled={hasPermission('utsav_package_All_orders:edit') && !hasPermission('utsav_package_order_status:edit')}
              >
                {productStatusOptions.map(status => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>


            <Grid item xs={12} md={6}>
              <CustomTextField
                fullWidth
                label='Created By'
                value={formData.createdBy}
                placeholder='Created By'
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <Box display='flex' justifyContent='flex-end' gap={2}>
                <Button variant='contained' type='submit'>
                  Update Order
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default OrdersEdit
