'use client'
import { useUpdateListingFormContext } from '@/hooks/updateListingForm'
import {
  Card, CardContent, CardHeader, FormControlLabel, Checkbox, Button,
  Typography, Radio, RadioGroup, FormControl, FormLabel,
  TextField, Switch, Box, Autocomplete,
  FormGroup,
  FormHelperText
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { useEffect, useState } from 'react'
import PaymentOption from "@/services/business/service/paymentBusiness.service"
const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// const paymentOptions = [
//   { value: 'cash', label: 'Cash' },
//   { value: 'masterCard', label: 'Master Card' },
//   { value: 'visaCard', label: 'Visa Card' },
//   { value: 'debitCard', label: 'Debit Card' },
//   { value: 'moneyOrders', label: 'Money Orders' },
//   { value: 'cheques', label: 'Cheques' },
//   { value: 'creditCard', label: 'Credit Card' },
//   { value: 'travellersCheque', label: 'Travellers Cheque' },
//   { value: 'financing', label: 'Financing' },
//   { value: 'americanExpress', label: 'American Express' },
//   { value: 'dinersClub', label: 'Diners Club' },
//   { value: 'upi', label: 'UPI' },
// ]

const TimingPayment = ({ nextHandle }) => {
  const {
    timingFormData,
    timingErrors,
    handleTimingChange,
    handlePaymentToggle,
    validateTiming,
    bankerName,
  } = useUpdateListingFormContext()


  const [paymentOptions, setPaymentOptions] = useState([])

  const getKeymentShow = async () => {
    const result = await PaymentOption.getACTIVEPayment()
    setPaymentOptions(result.data)
  }


  useEffect(() => {
    getKeymentShow()
  }, [])

  const handleTimeChange = (day, field, value) => {
    if (day === 'open' || day === 'close') {
      if (value && !value.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
        return;
      }
    }
    handleTimingChange(day, field, value);
  };

  const handleChange = (field, value) => {
    handleTimingChange(field, null, value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateTiming();
    if (!isValid) return;

    // Transform timings object into an array of businessHours
    const businessHours = Object.entries(timingFormData.timings || {}).map(([day, values]) => ({
      day,
      openTime: values.open,
      closeTime: values.close,
      isOpen24Hours: values.is24Hours,
      isClosed: values.isClosed,
    }));

    const transformedData = {
      // displayHours: timingFormData.displayHours,
      businessHours,
      paymentOptions: timingFormData.payments || [],
      bankerName: timingFormData.bankerName || '',
    };

    console.log("Transformed Timing & Payment Data:", transformedData);


  };


  return (
    <Card component="form" onSubmit={handleSubmit}>
      <CardHeader title='Timing & Payment' />
      <CardContent>
        <Grid container spacing={6}>
          {/* Display hours */}
          {/* <Grid size={{ xs: 12 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Display Business Hours</FormLabel>
              <RadioGroup
                row
                value={timingFormData.displayHours ? 'display' : 'nodisplay'}
                onChange={e => handleChange('displayHours', e.target.value === 'display')}
              >
                <FormControlLabel value="display" control={<Radio />} label="Display hours" />
                <FormControlLabel value="nodisplay" control={<Radio />} label="Do not display hours" />
              </RadioGroup>
            </FormControl>
          </Grid> */}

          {/* Business Hours Section - Only shown if displayHours is true */}

          <Grid size={{ xs: 12 }}>
            <Box border={1} borderRadius={2} borderColor='grey.300' p={3}>
              <Typography variant='h6' gutterBottom>
                Business Hours
              </Typography>
              {weekDays.map(day => {
                const dayData = timingFormData.timings?.[day] || {
                  open: '09:00',
                  close: '17:00',
                  is24Hours: false,
                  isClosed: day === 'Sunday'
                };
                const isDisabled = dayData.is24Hours || dayData.isClosed;

                return (
                  <Grid container spacing={2} alignItems='center' key={day} sx={{ mb: 2 }}>
                    <Grid size={{ xs: 6, sm: 2 }}>
                      <Typography>{day}</Typography>
                    </Grid>

                    <Grid size={{ xs: 6, sm: 2 }}>
                      <TextField
                        type='time'
                        size='small'
                        fullWidth
                        disabled={isDisabled}
                        value={dayData.open}
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
                        value={dayData.close}
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
              })}
            </Box>
          </Grid>


          {/* Payment Options Section */}
          <Grid size={{ md: 6 }}>
            <Box
              border={1}
              borderRadius={2}
              borderColor={timingErrors.payments ? "error.main" : "grey.300"}
              p={3}
            >
              <Typography variant="h6" gutterBottom>
                Accept Payment Options
              </Typography>

              <FormControl
                error={!!timingErrors.payments}
                component="fieldset"
                fullWidth
                variant="standard"
              >
                <Grid container spacing={1}>
                  {paymentOptions.map((option) => (
                    <Grid item xs={6} sm={4} key={option._id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              timingFormData.payments?.includes(option._id) || false
                            }
                            onChange={() => handlePaymentToggle(option._id)}
                            color="primary"
                          />
                        }
                        label={option.name}
                      />
                    </Grid>
                  ))}
                </Grid>

                {timingErrors.payments && (
                  <FormHelperText>{timingErrors.payments}</FormHelperText>
                )}
              </FormControl>
            </Box>
          </Grid>


          {/* Banker Name (Searchable) */}
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
