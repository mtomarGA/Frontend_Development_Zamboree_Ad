'use client'

import { useState, useEffect } from 'react'
import { Button, Typography, Box, TextField, Card, MenuItem, Stack, Grid, InputAdornment } from '@mui/material'
import configService from '@/services/attendance/configration.service'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-toastify'

const WorkConfigurationForm = () => {
  const [formData, setFormData] = useState({
    latesForHalfDay: '',
    lateStatus: 'Active',
    BufferTimeLimit: '',
    minWorkingHoursForHalfDay: '',
    halfDayStatus: 'Active',
    sundayAbsent: 'Yes'
  })

  const { hasPermission } = useAuth()
  const [configExists, setConfigExists] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Fetch existing configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await configService.getConfig()
        const existingConfig = res.data
        if (existingConfig) {
          setFormData({
            latesForHalfDay: existingConfig.latesForHalfDay || '',
            lateStatus: existingConfig.lateStatus || 'Active',
            BufferTimeLimit: existingConfig.BufferTimeLimit || '',
            minWorkingHoursForHalfDay: existingConfig.minWorkingHoursForHalfDay || '',
            halfDayStatus: existingConfig.halfDayStatus || 'Active',
            sundayAbsent: existingConfig.sundayAbsent || 'Yes'
          })
          setConfigExists(true)
        }
      } catch (error) {
       
      } finally {
        setLoading(false)
      }
    }
    fetchConfig()
  }, [])

  // Save or update configuration
  const handleSaveAll = async () => {
    try {
      const payload = {
        ...formData,
        slNo: 1,
        halfDayRecord: '1 Day Record is Half Day'
      }
      const res = configExists ? await configService.updateConfig(payload) : await configService.addConfig(payload)
      const savedConfig = res.data
      setFormData({
        latesForHalfDay: savedConfig.latesForHalfDay || '',
        lateStatus: savedConfig.lateStatus || 'Active',
        BufferTimeLimit: savedConfig.BufferTimeLimit || '',
        minWorkingHoursForHalfDay: savedConfig.minWorkingHoursForHalfDay || '',
        halfDayStatus: savedConfig.halfDayStatus || 'Active',
        sundayAbsent: savedConfig.sundayAbsent || 'Yes'
      })

      setConfigExists(true)
      toast.success('Configuration updated successfully!')
    } catch (error) {
    
    }
  }

  // 🔹 Disable Late Config fields when status = Active
  const isLateDisabled = formData.lateStatus === 'Active'

  return (
    <Card sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom>
        Work Configuration
      </Typography>

      <Stack spacing={3} sx={{ mb: 2 }}>
        {/* Late Config Card */}
        <Card sx={{ p: 3 }}>
          <Typography variant='h5' gutterBottom>
            Late Config
          </Typography>

          <Grid container spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
            <Grid item xs={6} sm={3}>
              <TextField fullWidth label='Day Record' value='1 Day Record is Half Day' disabled />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label='Buffer Day Limit'
                value={formData.latesForHalfDay}
                onChange={e => handleChange('latesForHalfDay', e.target.value)}
                disabled={isLateDisabled}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Box sx={{ borderLeft: '1px solid #ccc', px: 1, color: 'text.secondary' }}>Day</Box>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label='Buffer Time Limit'
                value={formData.BufferTimeLimit}
                onChange={e => handleChange('BufferTimeLimit', e.target.value)}
                disabled={isLateDisabled}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <Box sx={{ borderLeft: '2px solid #ccc', px: 1, color: 'text.secondary' }}>Minutes</Box>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={4} sm={3}>
              <TextField
                select
                fullWidth
                label='Late Status'
                value={formData.lateStatus}
                onChange={e => handleChange('lateStatus', e.target.value)}
              >
                <MenuItem value='Active'>Active</MenuItem>
                <MenuItem value='Inactive'>Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Card>

        {/* Half Day Card */}
        <Card sx={{ p: 3 }}>
          <Typography variant='h5' gutterBottom>
            Half Day Config
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Min working hours in single day'
                value={formData.minWorkingHoursForHalfDay}
                onChange={e => handleChange('minWorkingHoursForHalfDay', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label='Half Day Status'
                value={formData.halfDayStatus}
                onChange={e => handleChange('halfDayStatus', e.target.value)}
              >
                <MenuItem value='Active'>Active</MenuItem>
                <MenuItem value='Inactive'>Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Card>

        {/* Sunday Card */}
        <Card sx={{ p: 3 }}>
          <Typography variant='h5' gutterBottom>
            Sandwich Config
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label='Sunday Absent'
                value={formData.sundayAbsent}
                onChange={e => handleChange('sundayAbsent', e.target.value)}
              >
                <MenuItem value='Yes'>Yes</MenuItem>
                <MenuItem value='No'>No</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Card>
      </Stack>

      {/* Save All Button */}
      <Box display='flex' justifyContent='flex-end' mt={5}>
        {hasPermission('attendance_master_config:add') && (
          <Button variant='contained' onClick={handleSaveAll}>
            Save All
          </Button>
        )}
      </Box>
    </Card>
  )
}

export default WorkConfigurationForm
