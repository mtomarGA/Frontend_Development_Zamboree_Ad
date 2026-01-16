'use client'

import React from 'react'
import {
  Card,
  Grid,
  Typography,
  Box,
  Button,
  Stack,
  IconButton
} from '@mui/material'
import CustomTextField from '@/@core/components/mui/TextField'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import benefitsService from "@/services/utsav-packages/benifits.Service"
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'

const PlanBenifits = ({ onClose }) => {
  const [loading, setLoading] = React.useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      howToRedeem: [{ value: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'howToRedeem'
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await benefitsService.createBenefits({
        title: data.title,
        howToRedeem: data.howToRedeem.map(item => item.value)
      })
      toast.success('Plan Benefits created successfully')
      onClose()
    } catch (error) {
      console.error('Error creating benefits:', error)
      toast.error('Failed to create benefits')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 4, mx: 'auto', position: 'relative' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0,0,0,0.05)',
            '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant='h4' mb={3}>
          Add Plan Benefits
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12}>
              <Controller
                name='title'
                control={control}
                rules={{ required: 'Title is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Title *'
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            {/* How to Redeem */}
            <Grid item xs={12}>
              <Typography variant='h6' mb={2}>
                How to Redeem
              </Typography>
              {fields.map((field, index) => (
                <Box key={field.id} display='flex' alignItems='center' mb={2}>
                  <Controller
                    name={`howToRedeem.${index}.value`}
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field: inputField }) => (
                      <CustomTextField
                        {...inputField}
                        label={`How to Redeem ${index + 1} *`}
                        fullWidth
                        error={!!errors.howToRedeem?.[index]?.value}
                        helperText={errors.howToRedeem?.[index]?.value?.message}
                      />
                    )}
                  />
                  <IconButton
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    sx={{ ml: 1 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant='outlined'
                startIcon={<AddIcon />}
                onClick={() => append({ value: '' })}
                sx={{ mt: 1 }}
              >
                Add How to Redeem
              </Button>
            </Grid>

            {/* Buttons */}
            <Grid item xs={12} textAlign='right'>
              <Stack direction='row' spacing={2} justifyContent='flex-end'>
                <Button variant='outlined' onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  type='submit'
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Create'}
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </form>
      </Card>
    </Box>
  )
}

export default PlanBenifits
