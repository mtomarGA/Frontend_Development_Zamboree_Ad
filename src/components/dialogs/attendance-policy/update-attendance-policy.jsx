'use client'

import { useEffect } from 'react'
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  MenuItem
} from '@mui/material'
import DialogCloseButton from '../DialogCloseButton'

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const EditPolicyDialog = ({
  open,
  onClose,
  initialData,
  weeklyOff,
  setWeeklyOff,
  dayOptions,
  setDayOptions,
  group,
  setGroup,
  onSave
}) => {
  useEffect(() => {
    if (!open || !initialData) return

    setGroup(initialData.group || '')

    const weeklyData = initialData.weeklyOff || {}
    const days = ['Sunday'] // Always include Sunday
    const options = { Sunday: 'All Sunday' }

    weekDays.forEach(day => {
      if (day === 'Sunday') return // Skip Sunday (always fixed)
      const lower = day.toLowerCase()
      const info = weeklyData[lower]

      if (info?.isClosed) {
        days.push(day)

        let label = `All ${day}`
        if (info.pattern === '1st & 3rd') label = `First and Third ${day}`
        else if (info.pattern === '2nd & 4th') label = `Second and Fourth ${day}`

        options[day] = label
      }
    })

    setWeeklyOff(days)
    setDayOptions(options)
  }, [initialData, open])

  const handleCheckboxChange = (day, checked) => {
    if (day === 'Sunday') return // Prevent unchecking Sunday
    if (checked) setWeeklyOff(prev => [...prev, day])
    else setWeeklyOff(prev => prev.filter(d => d !== day))
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm' PaperProps={{ sx: { overflow: 'visible' } }}>
      <DialogCloseButton onClick={onClose}>
        <i className='tabler-x' />
      </DialogCloseButton>

      <Box p={4}>
        <Typography marginBottom={4} variant='h4'>
          Edit Policy
        </Typography>

        <TextField label='Group' fullWidth value={group} onChange={e => setGroup(e.target.value)} />

        <FormControl fullWidth sx={{ mt: 3 }}>
          <FormLabel sx={{ fontWeight: 'bold' }}>Weekly Off</FormLabel>
          <Box display='flex' flexDirection='column' gap={1.5} mt={1}>
            {weekDays.map(day => (
              <Box
                key={day}
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                sx={{ border: '1px solid #e0e0e0', p: 1.5, borderRadius: 1 }}
              >
                <Typography sx={{ width: '30%' }}>{day}</Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={weeklyOff.includes(day)}
                      onChange={e => handleCheckboxChange(day, e.target.checked)}
                      disabled={day === 'Sunday'} // Sunday always checked and disabled
                    />
                  }
                  label='Closed'
                  sx={{ width: '30%' }}
                />

                {day === 'Sunday' ? (
                  <TextField
                    label='Type'
                    size='small'
                    value='All Sunday'
                    disabled
                    sx={{ width: '30%' }}
                  />
                ) : (
                  <TextField
                    select
                    label='Type'
                    size='small'
                    sx={{ width: '30%' }}
                    value={dayOptions[day] || `All ${day}`}
                    onChange={e => setDayOptions({ ...dayOptions, [day]: e.target.value })}
                    disabled={!weeklyOff.includes(day)}
                  >
                    <MenuItem value={`All ${day}`}>All {day}</MenuItem>
                    <MenuItem value={`First and Third ${day}`}>First and Third {day}</MenuItem>
                    <MenuItem value={`Second and Fourth ${day}`}>Second and Fourth {day}</MenuItem>
                  </TextField>
                )}
              </Box>
            ))}
          </Box>
        </FormControl>

        <Box display='flex' justifyContent='flex-end' marginTop={3}>
          <Button variant='contained' onClick={onSave}>
            Update
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}

export default EditPolicyDialog
