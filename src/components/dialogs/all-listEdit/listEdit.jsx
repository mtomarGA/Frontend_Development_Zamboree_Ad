'use client';

import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, Grid, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import createUtsavService from '@/services/utsav-packages/createOrder.Service';

const OrderStatusEditDialog = ({ open, onClose, orderData, fetchOrders }) => {
  const [paymentStatus, setPaymentStatus] = useState(orderData?.paymentStatus || '');

  const handleSubmit = async () => {
    try {
      const updatedOrder = { paymentStatus };  // Only paymentStatus is updated

      const res = await createUtsavService.updateOrder(orderData._id, updatedOrder);
      if (res?.success) {
        toast.success('Order status updated successfully');
        fetchOrders();
        onClose();
      } else {
        toast.error(res?.message || 'Update failed');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update order');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Order Status</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography fontWeight="bold">Order ID:</Typography>
            <Typography>{orderData?.orderId || 'N/A'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography fontWeight="bold" mb={1}>Payment Status:</Typography>
            <Select
              fullWidth
              value={paymentStatus}
              onChange={e => setPaymentStatus(e.target.value)}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderStatusEditDialog;
