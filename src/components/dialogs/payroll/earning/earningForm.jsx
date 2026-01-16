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
import earningServices from '@/services/payroll/earningServices'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const EarningForm = ({ setModalOpen, getAllEarnings, earningData }) => {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      earningName: '',
      earningType: 'Percentage on Basic',
      allowanceType: 'Taxable',
      value: '',
      monthField: []
    }
  })

  const earningTypeValue = watch('earningType')
  const monthFieldValue = watch('monthField') || []

  useEffect(() => {
    if (earningData) {
      reset({
        earningName: earningData?.earningName || '',
        earningType: earningData?.earningType || 'Percentage on Basic',
        allowanceType: earningData?.allowanceType || 'Taxable',
        value: earningData?.value || '',
        monthField: earningData?.monthField || []
      })
    }
  }, [earningData, reset])

  const onSubmit = async (data) => {
    try {
      const formData = {
        earningName: data.earningName,
        earningType: data.earningType,
        allowanceType: data.allowanceType,
        value: data.value,
        monthField: data.monthField
      }

      if (earningData?._id) {
        await earningServices.updateEarning(earningData._id, formData)
      } else {
        await earningServices.createEarning(formData)
      }

      getAllEarnings()
      reset()
      setModalOpen(false)
    } catch (error) {
      toast.error('Something went wrong.')
    }
  }

  const allSelected = monthFieldValue.length === months.length
  const isIndeterminate =
    monthFieldValue.length > 0 && monthFieldValue.length < months.length

  const handleSelectAll = (checked) => {
    if (checked) {
      setValue('monthField', [...months])
    } else {
      setValue('monthField', [])
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Grid container spacing={5}>
          {/* Earning Name */}
          <Grid item xs={12}>
            <Controller
              name="earningName"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label="Earning Name"
                  placeholder="Enter earning name"
                  error={!!errors.earningName}
                  helperText={errors.earningName && 'This field is required.'}
                />
              )}
            />
          </Grid>

          {/* Earning Type */}
          <Grid item xs={12}>
            <Controller
              name="earningType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  select
                  fullWidth
                  label="Earning Type"
                  error={!!errors.earningType}
                  InputProps={{ sx: { textAlign: 'left' } }}
                >
                  <MenuItem value="" disabled>Select Earning Type</MenuItem>
                  <MenuItem value="Percentage on Basic">Percentage on Basic</MenuItem>
                  <MenuItem value="Fixed Value">Fixed Value</MenuItem>
                  <MenuItem value="Any Value">Any Value</MenuItem>
                </CustomTextField>
              )}
            />
          </Grid>

          {/* Value Input */}
          {earningTypeValue !== 'Any Value' && (
            <Grid item xs={12}>
              <Controller
                name="value"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label={earningTypeValue === 'Fixed Value' ? 'Fixed Value' : 'Percentage (%)'}
                    placeholder={earningTypeValue === 'Fixed Value' ? 'Enter fixed value' : 'Enter percentage'}
                    value={field.value || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      if (/^\d*\.?\d*$/.test(val)) field.onChange(val)
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

          {/* Month Multi-Select – always visible */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'left', mb: "8px" }} gutterbottom>Allowance Period</Typography>

            {/* Select All checkbox */}
            <Box display="flex" justifyContent="flex-start">
              <FormControlLabel
                control={
                  <Checkbox
                    indeterminate={false} // 🔹 Always normal checkbox
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



            {/* Month list */}
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
                            value={month}
                            checked={field.value?.includes(month)}
                            onChange={() => {
                              const newValue = field.value?.includes(month)
                                ? field.value.filter((m) => m !== month)
                                : [...(field.value || []), month]
                              field.onChange(newValue)
                            }}
                            size="small"
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

export default EarningForm
