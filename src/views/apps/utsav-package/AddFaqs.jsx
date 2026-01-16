'use client'

import React, { useEffect, useState } from 'react'
import {
  Card,
  Grid,
  Typography,
  Box,
  Button,
  Stack,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Chip
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CustomTextField from '@/@core/components/mui/TextField'
import faqService from '@/services/utsav-packages/faqs.Service'
import createUtsavPackage from '@/services/utsav-packages/utsavPackageService'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { toast } from 'react-toastify'
import serviceCategoryService from '@/services/business/service/serviceCategory.service'

const AddFaq = ({ onClose, open }) => {
  const [categoryList, setCategoryList] = useState([])
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      // title: '',
      // description: '',
      // sortingNumber: '',
      // selectedPackage: '',
      title: '',
      selectedCategories: [],
      terms: [{ value: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'terms'
  })

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await serviceCategoryService.getAllServiceCategory()
        setCategoryList(Array.isArray(res?.data) ? res.data : [])
      } catch (err) {
        console.error('Error fetching categories:', err)
      }
    }
    fetchCategories()
  }, [open])

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await faqService.createFaqs({
        title: data.title,
        categories: data.selectedCategories,
        terms: data.terms.map(term => term.value)
      })
      toast.success('Terms created successfully')
      onClose?.()
      reset()
    } catch (error) {
      console.error('Error creating FAQ:', error)
      toast.error('Failed to create FAQ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Card sx={{ p: 4, mx: 'auto', position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant='h4' mb={3}>
          Add Terms & Conditions
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Title */}
            {/* <Grid item xs={12} md={6}>
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
            </Grid> */}

            {/* Choose Categories */}
            <Grid item xs={12} md={6}>
              <Controller
                name='selectedCategories'
                control={control}
                rules={{ required: 'At least one category is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.selectedCategories}>
                    <InputLabel>Choose Categories *</InputLabel>
                    <Select
                      {...field}
                      multiple
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const category = categoryList.find(cat => cat._id === value)
                            return <Chip key={value} label={category?.name || value} />
                          })}
                        </Box>
                      )}
                    >
                      {categoryList.map(cat => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.selectedCategories && (
                      <FormHelperText>{errors.selectedCategories.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Description */}
            {/* <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                rules={{ required: 'Description is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Description *'
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid> */}

            {/* Terms and Conditions Title */}
            <Grid item xs={12}>
              <Controller
                name='title'
                control={control}
                rules={{ required: 'Terms and Conditions Title is required' }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label='Terms and Conditions Title *'
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>

            {/* Terms and Conditions */}
            <Grid item xs={12}>
              <Typography variant='h6' mb={2}>
                Terms and Conditions
              </Typography>
              {fields.map((field, index) => (
                <Box key={field.id} display='flex' alignItems='center' mb={2}>
                  <Controller
                    name={`terms.${index}.value`}
                    control={control}
                    rules={{ required: 'Term is required' }}
                    render={({ field: inputField }) => (
                      <CustomTextField
                        {...inputField}
                        label={`Term ${index + 1} *`}
                        fullWidth
                        error={!!errors.terms?.[index]?.value}
                        helperText={errors.terms?.[index]?.value?.message}
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
                Add Term
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

export default AddFaq
