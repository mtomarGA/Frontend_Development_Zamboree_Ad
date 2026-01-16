'use client'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import createLiveMeetingsService from '@/services/live-meetings/live-meetings'

const EditMeetingDialog = ({ open, onClose, meeting, refreshList }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    if (meeting) {
      // Fix date formatting - handle both string and Date objects
      let formattedDateTime = ''
      if (meeting.meetingDateTime) {
        const date = new Date(meeting.meetingDateTime)
        if (!isNaN(date.getTime())) {
          // Format to YYYY-MM-DDTHH:MM for datetime-local input
          formattedDateTime = date.toISOString().slice(0, 16)
        }
      }

      reset({
        title: meeting.title || '',
        description: meeting.description || '',
        meetingDateTime: formattedDateTime,
        duration: meeting.duration ? meeting.duration.toString() : '' // Ensure string for form input
      })
    }
  }, [meeting, reset])

  const onSubmit = async data => {
    try {
      // Validate and format data to match backend expectations
      const payload = {
        title: data.title?.trim(), // Remove whitespace
        description: data.description?.trim() || '', // Handle empty description
        meetingDateTime: data.meetingDateTime, // Keep as ISO string
        duration: parseInt(data.duration, 10) // Convert to number for backend
      }

      // Client-side validation to match backend requirements
      if (!payload.title) {
        toast.error('Title is required')
        return
      }

      if (!payload.meetingDateTime) {
        toast.error('Date & Time is required')
        return
      }

      if (!payload.duration || payload.duration <= 0) {
        toast.error('Duration must be greater than 0')
        return
      }

      const res = await createLiveMeetingsService.updateLiveMeeting(meeting._id, payload)

      if (res.success) {
        toast.success('Meeting updated successfully')
        refreshList()
        onClose()
      } else {
        toast.error(res.message || 'Update failed')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error(error.message || 'Something went wrong')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Edit Meeting
        <IconButton
          aria-label='close'
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ border: 'none' }}>
        <form id='edit-meeting-form' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3} mt={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Title'
                {...register('title', { 
                  required: 'Title is required',
                  validate: value => value?.trim() !== '' || 'Title cannot be empty'
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Description'
                multiline
                rows={3}
                {...register('description')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Date & Time'
                type='datetime-local'
                InputLabelProps={{
                  shrink: true,
                }}
                {...register('meetingDateTime', { 
                  required: 'Date & Time is required'
                })}
                error={!!errors.meetingDateTime}
                helperText={errors.meetingDateTime?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Duration (minutes)'
                type='number'
                inputProps={{ min: 1 }}
                {...register('duration', { 
                  required: 'Duration is required',
                  min: {
                    value: 1,
                    message: 'Duration must be at least 1 minute'
                  }
                })}
                error={!!errors.duration}
                helperText={errors.duration?.message}
              />
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button type='submit' form='edit-meeting-form' variant='contained'>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditMeetingDialog
