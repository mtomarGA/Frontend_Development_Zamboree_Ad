'use client'
import {
  Card, CardContent, CardHeader, FormControlLabel, Checkbox, Button,
  MenuItem, Typography, Radio, RadioGroup, FormControl, FormLabel,
  TextField, Switch, Box,
  Autocomplete
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useAddListingFormContext } from '@/hooks/useAddListingForm'
import PaymentOption from "@/services/business/service/paymentBusiness.service"
import { useEffect, useState } from 'react'

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']





const TimingPayment = ({ nextHandle }) => {
  const {
    timingFormData,
    timingErrors,
    handleTimingChange,
    handlePaymentToggle,
    validateTiming,
    bankerName
  } = useAddListingFormContext()



  

  const [paymentOptions, setPaymentOptions] = useState([])

  const handleTimeChange = (day, field, value) => {
    if (day === 'open' || day === 'close') {
      if (value && !value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
        return;
      }
    }
    handleTimingChange(day, field, value);
  };



  const getKeymentShow = async () => {
    const result = await PaymentOption.getACTIVEPayment()
    setPaymentOptions(result.data)
  }


  useEffect(() => {
    getKeymentShow()
  }, [])


  const handleChange = (field, value) => {
    handleTimingChange(field, null, value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const isValid = validateTiming()
    if (!isValid) return
    console.log(timingFormData, "timingFormData");

    // nextHandle()
  }

  return (
    <Card component="form" onSubmit={handleSubmit}>
      <CardHeader title='Timing & Payment' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <Box border={1} borderRadius={2} borderColor='grey.300' p={3}>
              <Typography variant='h6' gutterBottom>
                Business Hours
              </Typography>
              {
                weekDays.map(day => {
                  const dayData = timingFormData.timings?.[day] || {};
                  const isDisabled = dayData.is24Hours || dayData.isClosed;

                  return (
                    <Grid container spacing={2} alignItems='center' key={day} sx={{ mb: 2 }}>
                      <Grid size={{ xs: 12, sm: 2 }}>
                        <Typography>{day}</Typography>
                      </Grid>

                      <Grid size={{ xs: 6, sm: 2 }}>
                        <TextField
                          type='time'
                          size='small'
                          fullWidth
                          disabled={isDisabled}
                          value={dayData.open || '09:00'}
                          onChange={e => handleTimeChange(day, 'open', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid size={{ xs: 6, sm: 2 }}>
                        <TextField
                          type='time'
                          size='small'
                          fullWidth
                          disabled={isDisabled}
                          value={dayData.close || '17:00'}
                          onChange={e => handleTimeChange(day, 'close', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>

                      <Grid size={{ xs: 6, sm: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={dayData.is24Hours || false}
                              onChange={e => {
                                handleTimeChange(day, 'is24Hours', e.target.checked);
                                if (e.target.checked) {
                                  handleTimeChange(day, 'isClosed', false);
                                }
                              }}
                              disabled={dayData.isClosed}
                            />
                          }
                          label='24 Hours'
                        />
                      </Grid>

                      <Grid size={{ xs: 6, sm: 2 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={dayData.isClosed || false}
                              onChange={e => {
                                handleTimeChange(day, 'isClosed', e.target.checked);
                                if (e.target.checked) {
                                  handleTimeChange(day, 'is24Hours', false);
                                }
                              }}
                            />
                          }
                          label='Closed'
                        />
                      </Grid>
                    </Grid>
                  );
                })
              }
            </Box>
          </Grid>


          {/* Payment Options Section */}
          <Grid size={{ xs: 6 }}>
            <Box border={1} borderRadius={2} borderColor={timingErrors.payments ? 'error.main' : 'grey.300'} p={3}>
              <Typography variant="h6" gutterBottom>
                Accept Payment Options
              </Typography>
              {timingErrors.payments && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {timingErrors.payments}
                </Typography>
              )}
              <Grid container spacing={1}>
                {paymentOptions.map(option => (
                  <Grid item xs={6} sm={4} key={option._id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={timingFormData.payments?.includes(option._id) || false}
                          onChange={() => handlePaymentToggle(option._id)}
                          color="primary"
                        />
                      }
                      label={option?.name}
                    />
                  </Grid>
                ))}
              </Grid>

            </Box>
          </Grid>

          {/* Banker Name */}
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              options={bankerName || []}
              getOptionLabel={option => option?.name ?? ''}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              value={(bankerName || []).find(b => b._id === timingFormData.bankerName) || null}
              onChange={(e, newValue) => handleChange('bankerName', newValue?._id || '')}
              clearOnEscape
              autoHighlight
              renderInput={params => (
                <TextField
                  {...params}
                  label="Bank Preference"
                  fullWidth
                  error={!!timingErrors.bankerName}
                  helperText={timingErrors.bankerName}
                />
              )}
            />
          </Grid>


        </Grid>
      </CardContent>
    </Card>
  )
}

export default TimingPayment
