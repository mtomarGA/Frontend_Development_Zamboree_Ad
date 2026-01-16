'use client'

import { useEffect } from 'react'
import {
  Button,
  Grid,
  DialogContent,
  DialogActions,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Typography,
  Box
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import CustomTextField from '@core/components/mui/TextField'
import { toast } from 'react-toastify'
import deductionServices from '@/services/payroll/deductionServices'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DeductionForm = ({ setModalOpen, getAllDeduction, deductionData }) => {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      deductionName: '',
      deductionType: 'Percentage on Basic',
      allowanceType: 'Taxable',
      value: '',
      monthField: []
    }
  })

  const deductionTypeValue = watch('deductionType')
  const monthFieldValue = watch('monthField') || []

  // Edit Mode
  useEffect(() => {
    if (deductionData) {
      reset({
        deductionName: deductionData?.deductionName || '',
        deductionType: deductionData?.deductionType || 'Percentage on Basic',
        allowanceType: deductionData?.allowanceType || 'Taxable',
        value: deductionData?.value || '',
        monthField: deductionData?.monthField || []
      })
    }
  }, [deductionData, reset])

  const allSelected = monthFieldValue.length === months.length

  const handleSelectAll = (checked) => {
    setValue('monthField', checked ? [...months] : [])
  }

  const onSubmit = async (data) => {
    try {
      const formData = {
        deductionName: data.deductionName,
        deductionType: data.deductionType,
        allowanceType: data.allowanceType,
        value: data.value,
        monthField: data.monthField
      }

      if (deductionData?._id) {
        await deductionServices.updateDeduction(deductionData._id, formData)
      } else {
        await deductionServices.createDeduction(formData)
      }

      getAllDeduction()
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
          {/* Deduction Name */}
          <Grid item xs={12}>
            <Controller
              name="deductionName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label="Deduction Name"
                  placeholder="Enter deduction name"
                  error={!!errors.deductionName}
                  helperText={errors.deductionName && 'This field is required.'}
                />
              )}
            />
          </Grid>

          {/* Deduction Type */}
          <Grid item xs={12}>
            <Controller
              name="deductionType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label="Deduction Type"
                  error={!!errors.deductionType}
                  InputProps={{ sx: { textAlign: 'left' } }}
                >
                  <MenuItem value="" disabled>Select Deduction Type</MenuItem>
                  <MenuItem value="Percentage on Basic">Percentage on Basic</MenuItem>
                  <MenuItem value="Fixed Value">Fixed Value</MenuItem>
                  <MenuItem value="Any Value">Any Value</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid>

          {/* Value Input */}
          {deductionTypeValue !== 'Any Value' && (
            <Grid item xs={12}>
              <Controller
                name="value"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={deductionTypeValue === 'Fixed Value' ? 'Fixed Value' : 'Percentage (%)'}
                    placeholder={deductionTypeValue === 'Fixed Value' ? 'Enter fixed value' : 'Enter percentage'}
                    value={field.value || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      if (/^\d*\.?\d*$/.test(val)) {
                        field.onChange(val)
                      }
                    }}
                    error={!!errors.value}
                    helperText={errors.value && 'This field is required.'}
                  />
                )}
              />
            </Grid>
          )}

          {/* Allowance Type */}
          <Grid item xs={12}>
            <Controller
              name="allowanceType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label="Allowance Type"
                  error={!!errors.allowanceType}
                  InputProps={{ sx: { textAlign: 'left' } }}
                >
                  <MenuItem value="" disabled>Select Allowance Type</MenuItem>
                  <MenuItem value="Taxable">Taxable</MenuItem>
                  <MenuItem value="Non-Taxable">Non-Taxable</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid>

          {/* Allowance Period (same as earning form) */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'left', mb: '8px' }}>
              Allowance Period
            </Typography>

            {/* Select All */}
            <Box display="flex" justifyContent="flex-start">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                }
                label="Select All"
                sx={{
                  textAlign: 'left',
                  '& .MuiFormControlLabel-label': { fontWeight: 500 },
                }}
              />
            </Box>

            {/* Month List */}
            <Controller
              name="monthField"
              control={control}
              render={({ field }) => (
                <Grid container>
                  {months.map((month, idx) => (
                    <Grid item xs={3} sm={2} md={2} key={idx}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            value={month}
                            checked={field.value?.includes(month)}
                            onChange={() => {
                              const newValue = field.value?.includes(month)
                                ? field.value.filter((m) => m !== month)
                                : [...(field.value || []), month]
                              field.onChange(newValue)
                            }}
                          />
                        }
                        label={month.substring(0, 3)}
                      />
                    </Grid>
                  ))}
                </Grid>
              )}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button type="submit" variant="contained">Save</Button>
        <Button onClick={() => setModalOpen(false)} variant="outlined">Cancel</Button>
      </DialogActions>
    </form>
  )
}

export default DeductionForm
