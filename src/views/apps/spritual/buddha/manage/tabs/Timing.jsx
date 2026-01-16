'use client'

import React, { useState } from 'react'
import {
  Button, Card, Box, Typography, Grid, IconButton
} from '@mui/material'
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material'
import CustomTextField from '@/@core/components/mui/TextField'
import { useTempleContext } from '@/contexts/TempleFormContext'
import { useJainism } from '@/contexts/JainFormContext'
import { useBuddhism } from '@/contexts/BuddhaFormContext'

const TimingSection = ({ title, timings, setTimings , error_message , setTimingErrors}) => {
  const handleChange = (index, field, value) => {
    const updated = [...timings]
    updated[index][field] = value
    setTimings(updated)
    setTimingErrors("")
  }

  const handleAdd = () => {
    setTimings(prev => [...prev, { title: '', start: '', end: '' }])
  }

  const handleRemove = (index) => {
    setTimings(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">{title}</Typography>
      </Box>

      <Grid container spacing={2} mt={2}>
        <Grid item xs={3}><Typography>Title</Typography></Grid>
        <Grid item xs={3}><Typography>Start Time</Typography></Grid>
        <Grid item xs={3}><Typography>End Time</Typography></Grid>
        <Grid item xs={3}><Typography>Action</Typography></Grid>

        {timings.map((timing, index) => (
          <React.Fragment key={index}>
            <Grid item xs={3}>
              <CustomTextField
                fullWidth
                value={timing.title}
                onChange={e => handleChange(index, 'title', e.target.value)}
                placeholder="Title"
                error={!!error_message}
                helperText={error_message}
              />
            </Grid>
            <Grid item xs={3}>
              <CustomTextField
                fullWidth
                type="time"
                value={timing.start}
                onChange={e => handleChange(index, 'start', e.target.value)}
                error={!!error_message}
                helperText={error_message}
              />
            </Grid>
            <Grid item xs={3}>
              <CustomTextField
                fullWidth
                type="time"
                value={timing.end}
                onChange={e => handleChange(index, 'end', e.target.value)}
                error={!!error_message}
                helperText={error_message}
              />
            </Grid>
            <Grid item xs={3}>
              <IconButton color="primary" onClick={handleAdd}>
                <AddCircleOutline />
              </IconButton>
              {timings.length > 1 && (
                <IconButton color="error" onClick={() => handleRemove(index)}>
                  <RemoveCircleOutline />
                </IconButton>
              )}
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Box>
  )
}

const Timing = ({ nextHandle, handleCancel }) => {
  const { timingFormData, setTimingFormData,timingErrors , validateTiming, setTimingErrors, setTempleTabManager } = useBuddhism()
  const [darshan, setDarshan] = useState(timingFormData.darshan || [
    { title: '', start: '', end: '' }
  ])
  const [aarti, setAarti] = useState(timingFormData.aarti || [
    { title: '', start: '', end: '' }
  ])

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log('Morning Darshan:', darshan)
    console.log('Evening Aarti:', aarti)
    setTimingFormData(prev => ({
      ...prev,
      darshan,
      aarti
    }))
    const isValid = validateTiming()


    if (isValid) {
      setTempleTabManager(prev => ({ ...prev, socialmedia: true }))
      nextHandle()
    }
  }

  return (
    <Card sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Timing
        </Typography>

        <TimingSection
          title="Darshan Timings"
          timings={darshan}
          setTimings={setDarshan}
          error_message={timingErrors.darshan}
          setTimingErrors={setTimingErrors}
        />
        <TimingSection
          title="Aarti Timings"
          timings={aarti}
          setTimings={setAarti}
          error_message={timingErrors.aarti}
          setTimingErrors={setTimingErrors}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button
            onClick={() => { handleCancel(); resetForm()  }}
            variant="outlined"
            color="primary"
            className="mr-2"
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save & Continue
          </Button>
        </Box>
      </Box>
    </Card>
  )
}

export default Timing
