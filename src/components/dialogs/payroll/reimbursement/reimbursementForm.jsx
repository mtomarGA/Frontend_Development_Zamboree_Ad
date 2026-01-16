'use client'

import { useEffect } from 'react'
import {
  Button,
  Grid,
  DialogContent,
  DialogActions,
  MenuItem
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import { toast } from 'react-toastify'
import reimbursementServices from '@/services/payroll/reimbursementServices'

const ReimbursementForm = ({ setModalOpen, getAllReimbursement, reimbursementData }) => {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      reimbursementName: '',
      maxAmount: '',
      status: 'INACTIVE'
    }
  })

  // Autofill in edit mode
  useEffect(() => {
    if (reimbursementData) {
      reset({
        reimbursementName: reimbursementData?.reimbursementName || '',
        maxAmount: reimbursementData?.maxAmount || '',
        status: reimbursementData?.status?.toUpperCase() || 'INACTIVE'
      })
    }
  }, [reimbursementData, reset])

  const onSubmit = async (data) => {
    try {
      const formData = {
        reimbursementName: data.reimbursementName,
        maxAmount: data.maxAmount,
        status: data.status // already uppercase
      }

      if (reimbursementData?._id) {
        await reimbursementServices.updateReimbursement(reimbursementData._id, formData)
      } else {
        await reimbursementServices.createReimbursement(formData)
      }

      getAllReimbursement()
      reset()
      setModalOpen(false)
    } catch (error) {
      toast.error('Something went wrong.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Grid container spacing={5}>
          {/* Reimbursement Name */}
          <Grid item xs={12}>
            <Controller
              name="reimbursementName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label="Reimbursement Name"
                  placeholder="Enter reimbursement name"
                  error={!!errors.reimbursementName}
                  helperText={errors.reimbursementName && 'This field is required.'}
                />
              )}
            />
          </Grid>

          {/* Maximum Reimbursement Amount */}
          <Grid item xs={12}>
            <Controller
              name="maxAmount"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label="Maximum Reimbursement Amount"
                  placeholder="Enter maximum amount"
                  value={field.value || ''}
                  onChange={(e) => {
                    let val = e.target.value
                    // allow only digits + one dot
                    if (/^\d*\.?\d*$/.test(val)) {
                      field.onChange(val)
                    }
                  }}
                  error={!!errors.maxAmount}
                  helperText={errors.maxAmount && 'This field is required.'}
                />
              )}
            />
          </Grid>

          {/* Status */}
          <Grid item xs={12}>
            <Controller
              name="status"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label="Status"
                  error={!!errors.status}
                  InputProps={{
                    sx: { textAlign: 'left' },
                  }}
                >
                  <MenuItem disabled value="">Select Status</MenuItem>
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="INACTIVE">INACTIVE</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button type="submit" variant="contained">
          Save
        </Button>
        <Button onClick={() => setModalOpen(false)} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </form>
  )
}

export default ReimbursementForm
