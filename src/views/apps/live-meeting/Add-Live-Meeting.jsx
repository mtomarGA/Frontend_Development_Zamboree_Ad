'use client'

import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { ArrowLeft } from 'lucide-react'
import {
  Button,
  Card,
  Grid,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

import CustomTextField from '@/@core/components/mui/TextField'
import EmployeeService from '@/services/employee/EmployeeService.js'
import createLiveMeetingsService from '@/services/live-meetings/live-meetings.js'
import allTicketService from '@/services/custmore-care-ticket/allTicketService'

const AddLiveMeetingForm = ({ data }) => {
  const router = useRouter()

  const [staffList, setStaffList] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [isEditMode, setIsEditMode] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors }
  } = useForm({ mode: 'onChange' })

  const emplist = async () => {
    try {
      const res = await allTicketService.getEmployeeList()
      if (res.success && Array.isArray(res.data)) {
        const transformed = res.data.map(emp => ({
          id: emp._id,
          name: emp.name || emp.employee_id || 'N/A',
          employee_id: emp.employee_id || 'N/A'
        }))
        setStaffList(transformed)
      } else {
        toast.error('Failed to load staff list')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error loading staff list')
    }
  }

  useEffect(() => {
    emplist()
  }, [])

  useEffect(() => {
    if (data && data._id) {
      setIsEditMode(true)
      setSelectedMembers(data.members || [])
      const fields = {
        title: data.title || '',
        duration: data.duration || '',
        link: data.link || '',
        description: data.description || '',
        meetingDateTime: dayjs(data.meetingDateTime) || null
      }
      Object.entries(fields).forEach(([key, value]) => setValue(key, value))
    }
  }, [data, setValue])

  const handleMemberToggle = id => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    )
  }

  const onSubmit = async formData => {
    console.log("assdasad")
    if (!formData.meetingDateTime) {
      toast.error('Meeting Date & Time is required')
      return
    }

    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member')
      return
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description || '',
      meetingDateTime: formData.meetingDateTime,
      duration: parseInt(formData.duration),
      // link: formData.link.trim(),
      members: selectedMembers
    }

    try {
      await createLiveMeetingsService.createLiveMeeting(payload)
      toast.success(isEditMode ? 'Meeting updated successfully!' : 'Meeting created successfully!')
      router.push('/en/apps/live-meeting')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save meeting')
    }
  }

  const handleBack = () => router.push('/en/apps/live-meeting')

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Card sx={{ p: 4 }}>
          <Box display='flex' justifyContent='space-between' mb={3}>
            <Typography variant='h4'>{isEditMode ? 'Edit Live Meeting' : 'Add Live Meeting'}</Typography>
            <Button variant='outlined' startIcon={<ArrowLeft />} onClick={handleBack}>
              Back
            </Button>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <CustomTextField
                      label='Meeting Title'
                      fullWidth
                      {...register('title', { required: 'Meeting Title is required' })}
                      error={!!errors.title}
                      helperText={errors.title?.message}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="meetingDateTime"
                      control={control}
                      rules={{ required: "Meeting Date & Time is required" }}
                      render={({ field, fieldState: { error } }) => (
                        <CustomTextField
                          {...field}
                          type="datetime-local"  // ✅ Native date-time input
                          label="Meeting Date & Time"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: dayjs().format("YYYY-MM-DDTHH:mm") }} // ✅ minDateTime
                          error={!!error}
                          helperText={error?.message}
                        />
                      )}
                    />
                  </Grid>



                  <Grid item xs={12} md={6}>
                    <CustomTextField
                      label='Meeting Duration (Minutes)'
                      type='number'
                      fullWidth
                      inputProps={{ min: 1 }}
                      {...register('duration', {
                        required: 'Meeting Duration is required',
                        min: { value: 1, message: 'Minimum 1 minute required' }
                      })}
                      error={!!errors.duration}
                      helperText={errors.duration?.message}
                    />
                  </Grid>

                  {/* <Grid item xs={12}>
                    <CustomTextField
                      label='Meeting Link'
                      fullWidth
                      placeholder='https://...'
                      {...register('link', {
                        required: 'Meeting Link is required',
                        pattern: {
                          value: /^https?:\/\/.+/i,
                          message: 'Enter a valid URL'
                        }
                      })}
                      // error={!!errors.link}
                      // helperText={errors.link?.message}
                    />
                  </Grid> */}

                  <Grid item xs={12}>
                    <CustomTextField
                      label='Description'
                      fullWidth
                      multiline
                      rows={4}
                      {...register('description')}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Column - Members */}
              <Grid item xs={12} md={4}>
                <Typography variant='subtitle1' mb={2}>
                  Who Can Join Meeting <span style={{ color: 'red' }}>*</span>
                </Typography>
                <Card variant='outlined' sx={{ p: 2, maxHeight: 400, overflowY: 'auto' }}>
                  <FormGroup>
                    {staffList.length > 0 ? (
                      staffList.map(staff => (
                        <FormControlLabel
                          key={staff.id}
                          control={
                            <Checkbox
                              checked={selectedMembers.includes(staff.id)}
                              onChange={() => handleMemberToggle(staff.id)}
                              size='small'
                            />
                          }
                          label={`${staff.name} (${staff.employee_id})`}
                          sx={{ mb: 1 }}
                        />
                      ))
                    ) : (
                      <Typography variant='body2' color='textSecondary'>
                        Loading staff list...
                      </Typography>
                    )}
                  </FormGroup>
                </Card>
                {selectedMembers.length === 0 && (
                  <Typography variant='caption' color='error' sx={{ mt: 1 }}>
                    Please select at least one member
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} textAlign='right'>
                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  disabled={selectedMembers.length === 0}
                >
                  {isEditMode ? 'Update Meeting' : 'Save Meeting'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>
      </Box>
    </LocalizationProvider>
  )
}

export default AddLiveMeetingForm
