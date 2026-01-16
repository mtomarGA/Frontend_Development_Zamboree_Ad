'use client'

import { useEffect } from 'react'
import { Button, Grid, DialogContent, DialogActions, MenuItem, Typography } from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import { toast } from 'react-toastify'
import leaveManegmentService from '@/services/leave-management/ApplyForLeave'
import StyledHorizontalMenuItem from '@/@menu/styles/horizontal/StyledHorizontalMenuItem'

const ApproveForm = ({ empData, setShowApprove, getLeave }) => {

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      status: 'PENDING',
      response: ''
    }
  })


  const status = watch('status')


  //  Auto-fill the form when empData changes
  useEffect(() => {
    if (empData) {
      reset({
        status: empData.status || 'PENDING',
        response: empData.response || ''
      })
    }
  }, [empData, reset])


  const onSubmit = async (data) => {
    try {
      const formData = {
        status: data.status,
        response: data.response
      }

      const res = await leaveManegmentService.isApprove(empData._id, formData)
      toast.success(res.message)
      getLeave()
      setShowApprove(false)
    } catch (error) {
      toast.error('Failed to update leave status.')
      console.error('Error:', error)
    }
  }

  return (


    <>


      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h4" className=" " gutterBottom>
          Update Status
        </Typography>

        <DialogContent>
          <Grid container spacing={6}>
            {/* Status Field */}
            <Grid item xs={12} sm={5}>
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
                    helperText={errors.status && 'This field is required.'}
                    InputProps={{
                      sx: { textAlign: 'left' },
                    }}
                  >
                    <MenuItem value="" disabled>Select Status</MenuItem>
                    <MenuItem value="PENDING" >Pending</MenuItem>
                    <MenuItem value="APPROVED">Approved</MenuItem>
                    <MenuItem value="REJECTED">Rejected</MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>

            {/* Response Field */}
            {status !== 'APPROVED' && <Grid item xs={12}>
              <Controller
                name="response"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    disabled={status === 'APPROVED'}
                    label="Response"
                    placeholder="Enter your response"
                    error={!!errors.response}
                    helperText={errors.response && 'This field is required.'}
                  />
                )}
              />
            </Grid>}

          </Grid>
        </DialogContent>

        <DialogActions>
          <Button type="submit" variant="contained">
            Save
          </Button>
          <Button variant="outlined" onClick={() => setShowApprove(false)}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </>
  )
}

export default ApproveForm
